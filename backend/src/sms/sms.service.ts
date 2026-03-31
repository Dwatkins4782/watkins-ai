import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import * as Twilio from 'twilio';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private twilioClient: Twilio.Twilio | null = null;
  private twilioPhone: string;

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private configService: ConfigService,
    @InjectQueue('sms') private smsQueue: Queue,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioPhone = this.configService.get<string>('TWILIO_PHONE_NUMBER') || '';

    if (accountSid && authToken && !accountSid.startsWith('AC...')) {
      this.twilioClient = Twilio.default(accountSid, authToken);
      this.logger.log('Twilio client initialized');
    } else {
      this.logger.warn('Twilio not configured — SMS sending will be simulated');
    }
  }

  async createFlow(storeId: string, flowData: any) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');

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

  async getFlow(flowId: string) {
    const flow = await this.prisma.smsFlow.findUnique({ where: { id: flowId } });
    if (!flow) throw new NotFoundException('SMS flow not found');
    return flow;
  }

  async activateFlow(flowId: string) {
    return this.prisma.smsFlow.update({
      where: { id: flowId },
      data: { status: 'ACTIVE' },
    });
  }

  async pauseFlow(flowId: string) {
    return this.prisma.smsFlow.update({
      where: { id: flowId },
      data: { status: 'PAUSED' },
    });
  }

  async deleteFlow(flowId: string) {
    return this.prisma.smsFlow.delete({ where: { id: flowId } });
  }

  async sendSms(to: string, body: string): Promise<{ success: boolean; sid?: string }> {
    if (!this.twilioClient) {
      this.logger.log(`[DEV] SMS to ${to}: ${body}`);
      return { success: true, sid: `dev_${Date.now()}` };
    }

    const result = await this.twilioClient.messages.create({
      body,
      from: this.twilioPhone,
      to,
    });

    this.logger.log(`SMS sent to ${to}, SID: ${result.sid}`);
    return { success: true, sid: result.sid };
  }

  async queueSms(to: string, body: string, flowId?: string) {
    await this.smsQueue.add('send-sms', { to, body, flowId });
    return { queued: true };
  }
}
