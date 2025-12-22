import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post('stores/:storeId/tickets')
  async createTicket(@Param('storeId') storeId: string, @Body() ticketData: any) {
    return this.supportService.createTicket(storeId, ticketData);
  }

  @Get('stores/:storeId/tickets')
  async getTickets(@Param('storeId') storeId: string) {
    return this.supportService.getTickets(storeId);
  }

  @Get('tickets/:ticketId')
  async getTicket(@Param('ticketId') ticketId: string) {
    return this.supportService.getTicket(ticketId);
  }
}
