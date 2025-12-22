import { Controller, Post, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('stores/:storeId/flows')
  async createFlow(@Param('storeId') storeId: string, @Body() flowData: any) {
    return this.emailService.createFlow(storeId, flowData);
  }

  @Get('stores/:storeId/flows')
  async getFlows(@Param('storeId') storeId: string) {
    return this.emailService.getFlows(storeId);
  }

  @Put('flows/:flowId/activate')
  async activateFlow(@Param('flowId') flowId: string) {
    return this.emailService.activateFlow(flowId);
  }

  @Post('stores/:storeId/campaigns')
  async createCampaign(@Param('storeId') storeId: string, @Body() campaignData: any) {
    return this.emailService.createCampaign(storeId, campaignData);
  }

  @Get('stores/:storeId/campaigns')
  async getCampaigns(@Param('storeId') storeId: string) {
    return this.emailService.getCampaigns(storeId);
  }
}
