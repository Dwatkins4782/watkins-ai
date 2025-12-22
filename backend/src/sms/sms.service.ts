import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class SmsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async createFlow(storeId: string, flowData: any) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });

    let message = flowData.message;
    if (flowData.aiGenerated && store.brandVoice) {
      message = await this.aiService.generateSmsContent({
        flowType: flowData.flowType,
        brandVoice: store.brandVoice,
        maxLength: 160,
      });
    }

    return this.prisma.smsFlow.create({
      data: { storeId, ...flowData, message, status: 'DRAFT' },
    });
  }

  async getFlows(storeId: string) {
    return this.prisma.smsFlow.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
