import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { AuthUser } from '../common/types/auth-user.type';

@Controller('support')
// AUDIT #16: TenantGuard added — was missing, allowing cross-tenant ticket access
@UseGuards(JwtAuthGuard, TenantGuard)
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post('stores/:storeId/tickets')
  async createTicket(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Body() ticketData: { subject: string; body: string; priority?: string },
  ) {
    return this.supportService.createTicket(user.tenantId, storeId, ticketData);
  }

  @Get('stores/:storeId/tickets')
  async getTickets(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string) {
    return this.supportService.getTickets(user.tenantId, storeId);
  }

  @Get('tickets/:ticketId')
  async getTicket(@CurrentUser() user: AuthUser, @Param('ticketId') ticketId: string) {
    return this.supportService.getTicket(user.tenantId, ticketId);
  }
}
