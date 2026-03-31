import { Controller, Post, Get, Body, UseGuards, Headers, RawBodyRequest, Req, Logger } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('billing')
export class BillingController {
  private readonly logger = new Logger(BillingController.name);
  constructor(private billingService: BillingService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async createCheckoutSession(@CurrentUser() user: any, @Body() body: { plan: string }) {
    try {
      this.logger.log(`Checkout request - User: ${user?.id}, Plan: ${body.plan}`);
      return await this.billingService.createCheckoutSession(user.tenantId, body.plan);
    } catch (error) {
      console.error('Checkout error:', error.message, error.stack);
      throw error;
    }
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  async getSubscription(@CurrentUser() user: any) {
    return this.billingService.getSubscription(user.tenantId);
  }

  @Get('invoices')
  @UseGuards(JwtAuthGuard)
  async getInvoices(@CurrentUser() user: any) {
    return this.billingService.getInvoices(user.tenantId);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@CurrentUser() user: any) {
    return this.billingService.cancelSubscription(user.tenantId);
  }

  @Post('update-plan')
  @UseGuards(JwtAuthGuard)
  async updatePlan(@CurrentUser() user: any, @Body() body: { plan: string }) {
    return this.billingService.updatePlan(user.tenantId, body.plan);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    await this.billingService.handleWebhook(req.rawBody, signature);
    return { received: true };
  }
}
