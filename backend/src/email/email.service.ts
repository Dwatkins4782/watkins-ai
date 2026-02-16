import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private configService: ConfigService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {
    const apiKey = this.configService.get('sendgrid.apiKey');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
  }

  async createFlow(storeId: string, flowData: any) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });

    // Generate AI content if requested
    let emailContent = flowData.content;
    if (flowData.aiGenerated && store.brandVoice) {
      const generated = await this.aiService.generateEmailContent({
        flowType: flowData.flowType,
        brandVoice: store.brandVoice,
        productContext: flowData.productContext,
      });

      emailContent = {
        subject: generated.subject,
        preheader: generated.preheader,
        content: generated.content,
      };
    }

    return this.prisma.emailFlow.create({
      data: {
        storeId,
        ...flowData,
        ...emailContent,
        status: 'DRAFT',
      },
    });
  }

  async getFlows(storeId: string) {
    return this.prisma.emailFlow.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async activateFlow(flowId: string) {
    return this.prisma.emailFlow.update({
      where: { id: flowId },
      data: { status: 'ACTIVE' },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    const from = this.configService.get('sendgrid.fromEmail');
    
    if (!from) {
      this.logger.warn('SendGrid not configured');
      return;
    }

    try {
      await sgMail.send({ to, from, subject, html });
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }

  async createCampaign(storeId: string, campaignData: any) {
    return this.prisma.campaign.create({
      data: {
        storeId,
        ...campaignData,
        type: 'EMAIL',
        status: 'draft',
      },
    });
  }

  async getCampaigns(storeId: string) {
    return this.prisma.campaign.findMany({
      where: { storeId, type: 'EMAIL' },
      orderBy: { createdAt: 'desc' },
    });
  }
}
