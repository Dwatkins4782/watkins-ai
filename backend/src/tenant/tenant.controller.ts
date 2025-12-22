import { Controller, Get, Put, Body, UseGuards, Param } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get('me')
  async getCurrentTenant(@CurrentUser() user: any) {
    return this.tenantService.findById(user.tenantId);
  }

  @Get(':id')
  async getTenant(@Param('id') id: string) {
    return this.tenantService.findById(id);
  }

  @Put('me/settings')
  async updateSettings(@CurrentUser() user: any, @Body() settings: any) {
    return this.tenantService.updateSettings(user.tenantId, settings);
  }

  @Get('me/usage')
  async getUsage(@CurrentUser() user: any) {
    return this.tenantService.getUsage(user.tenantId);
  }
}
