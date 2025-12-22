import { Controller, Post, Get, Body, UseGuards, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(@CurrentUser() user: any, @Body() body: { plan: string }) {
    return this.billingService.createCheckoutSession(user.tenantId, body.plan);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  async getSubscription(@CurrentUser() user: any) {
    return this.billingService.getSubscription(user.tenantId);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    await this.billingService.handleWebhook(req.rawBody, signature);
    return { received: true };
  }
}
