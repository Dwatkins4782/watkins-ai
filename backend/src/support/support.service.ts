import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';

import { NotFoundException } from '@nestjs/common';

@Injectable()
export class SupportService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  // AUDIT #16: every per-store and per-ticket call must verify tenant ownership
  private async assertTenantOwnsStore(tenantId: string, storeId: string) {
    const store = await this.prisma.store.findFirst({
      where: { id: storeId, tenantId },
      select: { id: true },
    });
    if (!store) throw new NotFoundException('Store not found');
  }

  private async assertTenantOwnsTicket(tenantId: string, ticketId: string) {
    const ticket = await this.prisma.supportTicket.findFirst({
      where: { id: ticketId, store: { tenantId } },
      select: { id: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
  }

  async createTicket(tenantId: string, storeId: string, ticketData: any) {
    await this.assertTenantOwnsStore(tenantId, storeId);
    const ticketNumber = `TKT-${Date.now()}`;

    const ticket = await this.prisma.supportTicket.create({
      data: {
        storeId,
        ticketNumber,
        subject: ticketData.subject,
        status: 'OPEN',
        priority: 'MEDIUM',
        channel: ticketData.channel || 'email',
        customerId: ticketData.customerId,
      },
    });

    // Create initial message
    await this.prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        content: ticketData.message,
        isCustomer: true,
        isAi: false,
      },
    });

    // Generate AI response
    const analysis = await this.aiService.analyzeSupportTicket({
      subject: ticketData.subject,
      message: ticketData.message,
    });

    if (analysis.confidence > 0.8) {
      await this.prisma.supportMessage.create({
        data: {
          ticketId: ticket.id,
          content: analysis.suggestedResponse,
          isCustomer: false,
          isAi: true,
        },
      });

      await this.prisma.supportTicket.update({
        where: { id: ticket.id },
        data: {
          aiHandled: true,
          aiConfidence: analysis.confidence,
          sentiment: analysis.sentiment,
          priority: analysis.priority as any,
        },
      });
    }

    return ticket;
  }

  async getTickets(tenantId: string, storeId: string) {
    await this.assertTenantOwnsStore(tenantId, storeId);
    return this.prisma.supportTicket.findMany({
      where: { storeId },
      include: { messages: true, customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTicket(tenantId: string, ticketId: string) {
    await this.assertTenantOwnsTicket(tenantId, ticketId);
    return this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: { messages: { orderBy: { createdAt: 'asc' } }, customer: true },
    });
  }
}
