import { Injectable, Logger, Optional } from '@nestjs/common';
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
    @Optional() @InjectQueue('email') private emailQueue?: Queue,
  ) {
    const apiKey = this.configService.get('sendgrid.apiKey');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
  }

  // AUDIT #16 + #26: tenant ownership assertions for store/flow scoping
  private async assertTenantOwnsStore(tenantId: string, storeId: string): Promise<void> {
    const { NotFoundException } = await import('@nestjs/common');
    const store = await this.prisma.store.findFirst({
      where: { id: storeId, tenantId },
      select: { id: true },
    });
    if (!store) throw new NotFoundException('Store not found');
  }

  private async assertTenantOwnsFlow(tenantId: string, flowId: string): Promise<void> {
    const { NotFoundException } = await import('@nestjs/common');
    const flow = await this.prisma.emailFlow.findFirst({
      where: { id: flowId, store: { tenantId } },
      select: { id: true },
    });
    if (!flow) throw new NotFoundException('Flow not found');
  }

  async createFlow(tenantId: string, storeId: string, flowData: any /* CreateEmailFlowDto validated by controller */) {
    await this.assertTenantOwnsStore(tenantId, storeId);
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

  async getFlows(tenantId: string, storeId: string) {
    await this.assertTenantOwnsStore(tenantId, storeId);
    return this.prisma.emailFlow.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async activateFlow(tenantId: string, flowId: string) {
    await this.assertTenantOwnsFlow(tenantId, flowId);
    return this.prisma.emailFlow.update({
      where: { id: flowId },
      data: { status: 'ACTIVE' },
    });
  }

  async pauseFlow(tenantId: string, flowId: string) {
    await this.assertTenantOwnsFlow(tenantId, flowId);
    return this.prisma.emailFlow.update({
      where: { id: flowId },
      data: { status: 'PAUSED' },
    });
  }

  async getFlow(tenantId: string, flowId: string) {
    await this.assertTenantOwnsFlow(tenantId, flowId);
    return this.prisma.emailFlow.findUnique({
      where: { id: flowId },
    });
  }

  async deleteFlow(tenantId: string, flowId: string) {
    await this.assertTenantOwnsFlow(tenantId, flowId);
    return this.prisma.emailFlow.delete({
      where: { id: flowId },
    });
  }

  async queueEmail(to: string, subject: string, html: string) {
    if (this.emailQueue) {
      await this.emailQueue.add('send-email', { to, subject, html });
    } else {
      this.logger.warn('Redis not available — email not queued');
    }
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

  async createCampaign(tenantId: string, storeId: string, campaignData: any) {
    await this.assertTenantOwnsStore(tenantId, storeId);
    return this.prisma.campaign.create({
      data: {
        storeId,
        ...campaignData,
        type: 'EMAIL',
        status: 'draft',
      },
    });
  }

  async getCampaigns(tenantId: string, storeId: string) {
    await this.assertTenantOwnsStore(tenantId, storeId);
    return this.prisma.campaign.findMany({
      where: { storeId, type: 'EMAIL' },
      orderBy: { createdAt: 'desc' },
    });
  }
}
