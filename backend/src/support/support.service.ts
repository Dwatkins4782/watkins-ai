import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class SupportService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async createTicket(storeId: string, ticketData: any) {
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
          priority: analysis.priority,
        },
      });
    }

    return ticket;
  }

  async getTickets(storeId: string) {
    return this.prisma.supportTicket.findMany({
      where: { storeId },
      include: { messages: true, customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTicket(ticketId: string) {
    return this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: { messages: { orderBy: { createdAt: 'asc' } }, customer: true },
    });
  }
}
