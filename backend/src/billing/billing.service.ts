import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import Stripe from 'stripe';

type PlanKey = 'FREE' | 'STARTER' | 'GROWTH' | 'PROFESSIONAL' | 'ENTERPRISE' | 'DFY_BUILDER';

interface PlanLimits {
  stores: number;
  products: number;
  emails: number;
  sms: number;
}

// Single source of truth for what each plan unlocks. Applied when a payment
// completes (webhook), on in-place plan changes, and on cancellation.
const PLAN_LIMITS: Record<PlanKey, PlanLimits> = {
  FREE: { stores: 1, products: 100, emails: 1000, sms: 100 },
  STARTER: { stores: 1, products: 500, emails: 5000, sms: 500 },
  GROWTH: { stores: 5, products: 5000, emails: 25000, sms: 2500 },
  PROFESSIONAL: { stores: 999, products: 999999, emails: 100000, sms: 10000 },
  ENTERPRISE: { stores: 999, products: 999999, emails: 999999, sms: 999999 },
  // Assumption: DFY Builder customers get Growth-level limits. Adjust if needed.
  DFY_BUILDER: { stores: 5, products: 5000, emails: 25000, sms: 2500 },
};

// Maps a plan to its key under `stripe.priceIds` in configuration.ts.
// (Previously `plan.toLowerCase()` was used, which turned DFY_BUILDER into
// "dfy_builder" and never matched the "dfyBuilder" config key.)
const PRICE_KEY: Record<PlanKey, string | null> = {
  FREE: null,
  STARTER: 'starter',
  GROWTH: 'growth',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
  DFY_BUILDER: 'dfyBuilder',
};

const PRODUCTION_FRONTEND_URL = 'https://ecomrevhub.com';

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
      this.logger.warn('Stripe not configured (STRIPE_SECRET_KEY missing) — paid checkout is disabled');
    }
  }

  private normalizePlan(plan: string): PlanKey {
    const key = String(plan || '').toUpperCase() as PlanKey;
    if (!(key in PLAN_LIMITS)) {
      throw new BadRequestException(`Invalid plan: ${plan}`);
    }
    return key;
  }

  private limitsData(plan: PlanKey) {
    const l = PLAN_LIMITS[plan];
    return {
      maxStores: l.stores,
      maxProducts: l.products,
      maxEmailsPerMonth: l.emails,
      maxSmsPerMonth: l.sms,
    };
  }

  private priceIdFor(plan: PlanKey): string | undefined {
    const key = PRICE_KEY[plan];
    return key ? this.configService.get(`stripe.priceIds.${key}`) : undefined;
  }

  /**
   * Where Stripe sends the customer back to. Never fall back to localhost in
   * production — a missing FRONTEND_URL previously sent paying customers to
   * http://localhost:3000 after checkout.
   */
  private frontendUrl(): string {
    const configured = String(this.configService.get('frontend.url') || '')
      .split(',')[0]
      .trim()
      .replace(/\/+$/, '');
    const isProd = process.env.NODE_ENV === 'production';
    if (!configured || (isProd && configured.includes('localhost'))) {
      return isProd ? PRODUCTION_FRONTEND_URL : 'http://localhost:3000';
    }
    return configured;
  }

  async createCheckoutSession(tenantId: string, plan: string) {
    const planKey = this.normalizePlan(plan);
    this.logger.log(`[BILLING] Checkout requested - tenant=${tenantId} plan=${planKey}`);

    if (planKey === 'FREE') {
      throw new BadRequestException('To move to the Free plan, cancel your subscription instead.');
    }

    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // --- Stripe not configured -------------------------------------------
    if (!this.stripe) {
      // SECURITY: never grant a paid plan for free in production just because
      // Stripe isn't wired up. This dev-only shortcut previously let any user
      // POST {plan:"ENTERPRISE"} and receive it without paying.
      if (process.env.NODE_ENV === 'production') {
        throw new BadRequestException(
          'Payments are temporarily unavailable. Please try again shortly or contact support.',
        );
      }
      this.logger.warn('[BILLING] Stripe not configured - DEV ONLY: updating subscription directly');
      await this.prisma.subscription.updateMany({
        where: { tenantId },
        data: {
          plan: planKey as any,
          status: 'active',
          ...this.limitsData(planKey),
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      return {
        sessionId: 'dev-session-' + Date.now(),
        url: null,
        message: 'Subscription updated (development mode — Stripe not configured)',
        success: true,
      };
    }

    // --- Existing paying customer: change plan in place --------------------
    // Creating a second Checkout session here would start a SECOND Stripe
    // subscription and double-bill the customer.
    const existing = await this.prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
    if (existing?.stripeSubscriptionId && ['active', 'trialing', 'past_due'].includes(existing.status)) {
      const updated = await this.updatePlan(tenantId, planKey);
      return {
        sessionId: null,
        url: null,
        success: true,
        message: `Your plan was changed to ${planKey.toLowerCase()}. Billing is prorated automatically.`,
        subscription: updated,
      };
    }

    // --- New paying customer: Stripe Checkout ------------------------------
    const priceId = this.priceIdFor(planKey);
    if (!priceId) {
      this.logger.error(`[BILLING] No Stripe price configured for plan ${planKey}`);
      throw new BadRequestException('This plan is not available for purchase yet.');
    }

    const fe = this.frontendUrl();
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      ...(tenant.billingEmail ? { customer_email: tenant.billingEmail } : {}),
      client_reference_id: tenantId,
      allow_promotion_codes: true,
      success_url: `${fe}/dashboard/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${fe}/dashboard/billing?checkout=cancelled`,
      // The plan travels with the session so the webhook knows what was bought.
      metadata: { tenantId, plan: planKey },
      subscription_data: { metadata: { tenantId, plan: planKey } },
    });

    return { sessionId: session.id, url: session.url };
  }

  async handleWebhook(payload: any, signature: string) {
    if (!this.stripe) {
      this.logger.warn('Stripe webhook received but Stripe is not configured; ignoring');
      return;
    }

    const webhookSecret = this.configService.get('stripe.webhookSecret');
    if (!webhookSecret) {
      this.logger.error('STRIPE_WEBHOOK_SECRET is not set — cannot verify webhooks');
      throw new BadRequestException('Webhook not configured');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      // 400 (not 500) so Stripe reports it as a signature problem.
      throw new BadRequestException('Invalid webhook signature');
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
    const tenantId = session.metadata?.tenantId || session.client_reference_id;
    if (!tenantId) {
      this.logger.error(`checkout.session.completed without tenantId (session ${session.id})`);
      return;
    }

    let planKey: PlanKey | null = null;
    try {
      planKey = session.metadata?.plan ? this.normalizePlan(session.metadata.plan) : null;
    } catch {
      planKey = null;
    }
    if (!planKey) {
      this.logger.error(`checkout.session.completed without a valid plan (session ${session.id})`);
    }

    // Previously this only stored the Stripe id and status — the customer's
    // plan and limits were never upgraded after they paid.
    await this.prisma.subscription.updateMany({
      where: { tenantId },
      data: {
        stripeSubscriptionId: session.subscription,
        status: 'active',
        cancelAtPeriodEnd: false,
        currentPeriodStart: new Date(),
        ...(planKey ? { plan: planKey as any, ...this.limitsData(planKey) } : {}),
      },
    });

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'ACTIVE' },
    });

    this.logger.log(`[BILLING] Activated plan ${planKey} for tenant ${tenantId}`);
  }

  private async handleSubscriptionUpdate(subscription: any) {
    const data: Record<string, unknown> = {
      status: subscription.status,
      cancelAtPeriodEnd: !!subscription.cancel_at_period_end,
    };
    if (subscription.current_period_end) {
      data.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    }
    if (subscription.current_period_start) {
      data.currentPeriodStart = new Date(subscription.current_period_start * 1000);
    }
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data,
    });
  }

  private async handleSubscriptionCancelled(subscription: any) {
    // Subscription has actually ended in Stripe — drop the tenant to Free
    // limits so they stop receiving paid features.
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'cancelled',
        cancelAtPeriodEnd: false,
        plan: 'FREE' as any,
        ...this.limitsData('FREE'),
      },
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

      if (subscription.status === 'past_due') {
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'active' },
        });
      }
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
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    if (this.stripe && subscription.stripeSubscriptionId) {
      await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    } else if (subscription.plan !== ('FREE' as any)) {
      // No Stripe subscription behind it (e.g. dev-granted plan): downgrade now.
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { plan: 'FREE' as any, ...this.limitsData('FREE') },
      });
      return { message: 'Your plan has been changed to Free.' };
    }

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: true },
    });

    return { message: 'Subscription will cancel at the end of the current billing period' };
  }

  async updatePlan(tenantId: string, newPlan: string) {
    const planKey = this.normalizePlan(newPlan);

    if (planKey === 'FREE') {
      return this.cancelSubscription(tenantId);
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      throw new NotFoundException('No subscription found');
    }

    const hasActiveStripe = !!(this.stripe && subscription.stripeSubscriptionId);

    // SECURITY: block self-service elevation to a paid plan unless it is backed
    // by an active Stripe subscription. Previously any user could POST
    // {plan:"ENTERPRISE"} here and get Enterprise limits without paying.
    if (process.env.NODE_ENV === 'production' && !hasActiveStripe) {
      throw new BadRequestException(
        'Paid plan changes require an active payment method. Please complete checkout first.',
      );
    }

    if (hasActiveStripe) {
      const priceId = this.priceIdFor(planKey);
      if (!priceId) {
        throw new BadRequestException('This plan is not available for purchase yet.');
      }
      const stripeSubscription = await this.stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        items: [{ id: stripeSubscription.items.data[0].id, price: priceId }],
        proration_behavior: 'create_prorations',
        metadata: { tenantId, plan: planKey },
      });
    }

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: planKey as any,
        ...this.limitsData(planKey),
        cancelAtPeriodEnd: false,
      },
    });
  }
}
