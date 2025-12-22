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
      this.stripe = new Stripe(apiKey, { apiVersion: '2024-11-20.acacia' });
    } else {
      this.logger.warn('Stripe not configured');
    }
  }

  async createCheckoutSession(tenantId: string, plan: string) {
    if (!this.stripe) throw new Error('Stripe not configured');

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
  }

  async handleWebhook(payload: any, signature: string) {
    if (!this.stripe) return;

    const webhookSecret = this.configService.get('stripe.webhookSecret');
    const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

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

  async getSubscription(tenantId: string) {
    return this.prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
