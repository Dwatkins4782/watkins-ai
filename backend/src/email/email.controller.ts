import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { AuthUser } from '../common/types/auth-user.type';
import { CreateEmailFlowDto, CreateCampaignDto } from './dto/email.dto';

@Controller('email')
@UseGuards(JwtAuthGuard, TenantGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true })) // AUDIT #26
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('stores/:storeId/flows')
  async createFlow(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Body() flowData: CreateEmailFlowDto,
  ) {
    return this.emailService.createFlow(user.tenantId, storeId, flowData);
  }

  @Get('stores/:storeId/flows')
  async getFlows(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string) {
    return this.emailService.getFlows(user.tenantId, storeId);
  }

  @Get('flows/:flowId')
  async getFlow(@CurrentUser() user: AuthUser, @Param('flowId') flowId: string) {
    return this.emailService.getFlow(user.tenantId, flowId);
  }

  @Put('flows/:flowId/activate')
  async activateFlow(@CurrentUser() user: AuthUser, @Param('flowId') flowId: string) {
    return this.emailService.activateFlow(user.tenantId, flowId);
  }

  @Put('flows/:flowId/pause')
  async pauseFlow(@CurrentUser() user: AuthUser, @Param('flowId') flowId: string) {
    return this.emailService.pauseFlow(user.tenantId, flowId);
  }

  @Delete('flows/:flowId')
  async deleteFlow(@CurrentUser() user: AuthUser, @Param('flowId') flowId: string) {
    return this.emailService.deleteFlow(user.tenantId, flowId);
  }

  @Post('stores/:storeId/campaigns')
  async createCampaign(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Body() campaignData: CreateCampaignDto,
  ) {
    return this.emailService.createCampaign(user.tenantId, storeId, campaignData);
  }

  @Get('stores/:storeId/campaigns')
  async getCampaigns(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string) {
    return this.emailService.getCampaigns(user.tenantId, storeId);
  }
}
