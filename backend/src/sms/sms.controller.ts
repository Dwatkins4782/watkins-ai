import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';

@Controller('sms')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SmsController {
  constructor(private smsService: SmsService) {}

  @Post('stores/:storeId/flows')
  async createFlow(@Param('storeId') storeId: string, @Body() flowData: any) {
    return this.smsService.createFlow(storeId, flowData);
  }

  @Get('stores/:storeId/flows')
  async getFlows(@Param('storeId') storeId: string) {
    return this.smsService.getFlows(storeId);
  }

  @Get('flows/:flowId')
  async getFlow(@Param('flowId') flowId: string) {
    return this.smsService.getFlow(flowId);
  }

  @Put('flows/:flowId/activate')
  async activateFlow(@Param('flowId') flowId: string) {
    return this.smsService.activateFlow(flowId);
  }

  @Put('flows/:flowId/pause')
  async pauseFlow(@Param('flowId') flowId: string) {
    return this.smsService.pauseFlow(flowId);
  }

  @Delete('flows/:flowId')
  async deleteFlow(@Param('flowId') flowId: string) {
    return this.smsService.deleteFlow(flowId);
  }

  // Raw send to an arbitrary number is a toll-fraud vector on your Twilio bill;
  // cap it tightly (5/min per client) on top of the global throttle.
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('send')
  async sendSms(@Body() body: { to: string; message: string }) {
    return this.smsService.sendSms(body.to, body.message);
  }
}
