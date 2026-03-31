import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get('stripe.apiKey');
    if (apiKey) {
      this.stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });
    } else {
      this.logger.warn('Stripe not configured');
    }
  }

  async createCheckoutSession(tenantId: string, plan: string) {
    try {
      this.logger.log(`[BILLING] Creating checkout session - TenantID: ${tenantId}, Plan: ${plan}`);
      this.logger.log(`[BILLING] Stripe configured: ${!!this.stripe}`);
      
      // If Stripe is not configured, update subscription directly for development
      if (!this.stripe) {
        this.logger.warn('[BILLING] Stripe not configured - updating subscription directly for development');
        
        this.logger.log(`[BILLING] Step 1: Looking up tenant ${tenantId}`);
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) {
          this.logger.error(`[BILLING] Tenant not found: ${tenantId}`);
          throw new Error('Tenant not found');
        }
        this.logger.log(`[BILLING] Tenant found: ${tenant.id}`);

        // Validate plan enum
        const validPlans = ['FREE', 'STARTER', 'GROWTH', 'PROFESSIONAL', 'ENTERPRISE', 'DFY_BUILDER'];
        const planEnum = plan.toUpperCase();
        this.logger.log(`[BILLING] Step 2: Validating plan "${plan}" -> "${planEnum}"`);
        if (!validPlans.includes(planEnum)) {
          this.logger.error(`[BILLING] Invalid plan: ${plan}`);
          throw new Error(`Invalid plan: ${plan}`);
        }

        this.logger.log(`[BILLING] Step 3: Updating subscription to ${planEnum} for tenant ${tenantId}`);
        
        // Update subscription with new plan
        const result = await this.prisma.subscription.updateMany({
          where: { tenantId },
          data: {
            plan: planEnum as any,
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        this.logger.log(`[BILLING] Step 4: Subscription updated successfully. Updated ${result.count} records`);

        const response = { 
          sessionId: 'dev-session-' + Date.now(),
          url: null,
          message: 'Subscription updated successfully (Stripe not configured)',
          success: true
        };
        this.logger.log(`[BILLING] Returning response: ${JSON.stringify(response)}`);
        return response;
      }

      // Stripe is configured - use normal Stripe checkout
      this.logger.log('[BILLING] Using Stripe checkout');
      const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
      if (!tenant) throw new Error('Tenant not found');

      const priceId = this.configService.get(`stripe.priceIds.${plan.toLowerCase()}`);
      if (!priceId) throw new Error('Invalid plan');

      const session = await this.stripe.checkout.sessions.create({
        customer_email: tenant.billingEmail,
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${this.configService.get('frontend.url')}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get('frontend.url')}/billing/cancel`,
        metadata: { tenantId },
      });

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      this.logger.error(`[BILLING] FATAL ERROR in createCheckoutSession: ${error.message}`);
      this.logger.error(`[BILLING] Error stack: ${error.stack}`);
      this.logger.error(`[BILLING] Error object: ${JSON.stringify(error, null, 2)}`);
      throw error;
    }
  }

  async handleWebhook(payload: any, signature: string) {
    if (!this.stripe) return;

    const webhookSecret = this.configService.get('stripe.webhookSecret');
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error('Invalid webhook signature');
    }

    this.logger.log(`Stripe webhook received: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutComplete(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCancelled(event.data.object);
        break;
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object);
        break;
    }
  }

  private async handleCheckoutComplete(session: any) {
    const tenantId = session.metadata.tenantId;
    
    await this.prisma.subscription.updateMany({
      where: { tenantId },
      data: {
        stripeSubscriptionId: session.subscription,
        status: 'active',
      },
    });

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'ACTIVE' },
    });
  }

  private async handleSubscriptionUpdate(subscription: any) {
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: subscription.status },
    });
  }

  private async handleSubscriptionCancelled(subscription: any) {
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: 'cancelled' },
    });
  }

  private async handleInvoicePaid(invoice: any) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription },
    });

    if (subscription) {
      await this.prisma.invoice.create({
        data: {
          tenantId: subscription.tenantId,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: 'paid',
          paidAt: new Date(invoice.status_transitions?.paid_at * 1000 || Date.now()),
        },
      });
    }
  }

  private async handleInvoicePaymentFailed(invoice: any) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription },
    });

    if (subscription) {
      await this.prisma.invoice.create({
        data: {
          tenantId: subscription.tenantId,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_due / 100,
          currency: invoice.currency,
          status: 'failed',
        },
      });

      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'past_due' },
      });
    }
  }

  async getSubscription(tenantId: string) {
    return this.prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInvoices(tenantId: string) {
    return this.prisma.invoice.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async cancelSubscription(tenantId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { tenantId, status: 'active' },
    });

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    if (this.stripe && subscription.stripeSubscriptionId) {
      await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: true },
    });

    return { message: 'Subscription will cancel at end of current period' };
  }

  async updatePlan(tenantId: string, newPlan: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      throw new Error('No subscription found');
    }

    const planLimits: Record<string, { stores: number; products: number; emails: number; sms: number }> = {
      FREE: { stores: 1, products: 100, emails: 1000, sms: 100 },
      STARTER: { stores: 1, products: 500, emails: 5000, sms: 500 },
      GROWTH: { stores: 5, products: 5000, emails: 25000, sms: 2500 },
      PROFESSIONAL: { stores: 999, products: 999999, emails: 100000, sms: 10000 },
      ENTERPRISE: { stores: 999, products: 999999, emails: 999999, sms: 999999 },
    };

    const planEnum = newPlan.toUpperCase();
    const limits = planLimits[planEnum];
    if (!limits) {
      throw new Error(`Invalid plan: ${newPlan}`);
    }

    if (this.stripe && subscription.stripeSubscriptionId) {
      const priceId = this.configService.get(`stripe.priceIds.${newPlan.toLowerCase()}`);
      if (priceId) {
        const stripeSubscription = await this.stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
        await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          items: [{ id: stripeSubscription.items.data[0].id, price: priceId }],
          proration_behavior: 'create_prorations',
        });
      }
    }

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: planEnum as any,
        maxStores: limits.stores,
        maxProducts: limits.products,
        maxEmailsPerMonth: limits.emails,
        maxSmsPerMonth: limits.sms,
        cancelAtPeriodEnd: false,
      },
    });
  }
}
