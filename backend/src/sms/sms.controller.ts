import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('sms')
@UseGuards(JwtAuthGuard)
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
}
