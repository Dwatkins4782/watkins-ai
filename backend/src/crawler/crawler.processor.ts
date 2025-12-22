import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma.service';
import { CrawlerService } from './crawler.service';
import { AiService } from '../ai/ai.service';

@Processor('crawler')
export class CrawlerProcessor extends WorkerHost {
  private readonly logger = new Logger(CrawlerProcessor.name);

  constructor(
    private prisma: PrismaService,
    private crawlerService: CrawlerService,
    private aiService: AiService,
  ) {
    super();
  }

  async process(job: Job) {
    const { name, data } = job;

    this.logger.log(`Processing job: ${name}`);

    switch (name) {
      case 'crawl-website':
        return this.processCrawl(data);
      case 'audit-store':
        return this.processAudit(data);
      default:
        this.logger.warn(`Unknown job type: ${name}`);
    }
  }

  private async processCrawl(data: any) {
    const { storeId, reportId, url } = data;

    try {
      await this.prisma.crawlReport.update({
        where: { id: reportId },
        data: { status: 'running', startedAt: new Date() },
      });

      // Crawl the website
      const crawlData = await this.crawlerService.crawlWebsite(url);

      // Analyze brand voice with AI
      const contentForAnalysis = crawlData.paragraphs.join('\n\n');
      const brandVoiceAnalysis = await this.aiService.analyzeBrandVoice(contentForAnalysis);

      // Update store with brand voice
      await this.prisma.store.update({
        where: { id: storeId },
        data: {
          brandVoice: brandVoiceAnalysis,
          lastCrawledAt: new Date(),
        },
      });

      // Complete report
      await this.prisma.crawlReport.update({
        where: { id: reportId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          pagesScanned: crawlData.pagesScanned,
          issuesFound: crawlData.seoIssues.length + crawlData.uxIssues.length,
          seoIssues: crawlData.seoIssues,
          uxIssues: crawlData.uxIssues,
          brandVoiceAnalysis,
        },
      });

      this.logger.log(`Crawl completed for store ${storeId}`);
    } catch (error) {
      this.logger.error(`Crawl failed for store ${storeId}`, error);
      await this.prisma.crawlReport.update({
        where: { id: reportId },
        data: { status: 'failed' },
      });
      throw error;
    }
  }

  private async processAudit(data: any) {
    const { storeId, reportType } = data;

    try {
      const store = await this.prisma.store.findUnique({
        where: { id: storeId },
        include: { products: true },
      });

      if (!store) {
        throw new Error('Store not found');
      }

      // Generate AI insights for the audit
      const insights = await this.aiService.generateInsights({
        storeData: store,
        analyticsData: {
          profitScore: store.profitScore,
          conversionRate: store.conversionRate,
          productCount: store.products.length,
        },
      });

      // Create audit report
      await this.prisma.auditReport.create({
        data: {
          storeId,
          reportType,
          overallScore: 75, // Calculate based on findings
          findings: insights,
          recommendations: insights.map(i => i.suggestedAction),
        },
      });

      this.logger.log(`Audit completed for store ${storeId}`);
    } catch (error) {
      this.logger.error(`Audit failed for store ${storeId}`, error);
      throw error;
    }
  }
}
