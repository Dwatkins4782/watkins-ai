import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('crawler') private crawlerQueue: Queue,
  ) {}

  async startCrawl(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    // Create crawl report
    const report = await this.prisma.crawlReport.create({
      data: {
        storeId,
        status: 'pending',
      },
    });

    // Queue crawl job
    await this.crawlerQueue.add('crawl-website', {
      storeId,
      reportId: report.id,
      url: store.url,
    });

    return report;
  }

  async crawlWebsite(url: string): Promise<any> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'WatkinsAI-Bot/1.0',
        },
        timeout: 30000,
      });

      const $ = cheerio.load(response.data);

      // Extract content
      const title = $('title').text();
      const metaDescription = $('meta[name="description"]').attr('content');
      const h1s = $('h1').map((_, el) => $(el).text()).get();
      const h2s = $('h2').map((_, el) => $(el).text()).get();
      const paragraphs = $('p').map((_, el) => $(el).text()).get();
      const links = $('a').map((_, el) => $(el).attr('href')).get();
      const images = $('img').map((_, el) => $(el).attr('src')).get();

      // SEO Analysis
      const seoIssues = [];
      if (!title || title.length < 30) seoIssues.push({ type: 'title', message: 'Title too short or missing' });
      if (!metaDescription || metaDescription.length < 120) seoIssues.push({ type: 'meta', message: 'Meta description too short or missing' });
      if (h1s.length === 0) seoIssues.push({ type: 'h1', message: 'Missing H1 tag' });
      if (h1s.length > 1) seoIssues.push({ type: 'h1', message: 'Multiple H1 tags found' });

      // UX Analysis
      const uxIssues = [];
      if (images.filter(img => !img).length > 0) uxIssues.push({ type: 'images', message: 'Images without src attribute' });

      return {
        title,
        metaDescription,
        headings: { h1s, h2s },
        paragraphs: paragraphs.slice(0, 20),
        links: links.slice(0, 50),
        images: images.slice(0, 20),
        seoIssues,
        uxIssues,
        pagesScanned: 1,
      };
    } catch (error) {
      this.logger.error(`Failed to crawl ${url}`, error);
      throw error;
    }
  }

  async getReports(storeId: string) {
    return this.prisma.crawlReport.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async getReport(reportId: string) {
    return this.prisma.crawlReport.findUnique({
      where: { id: reportId },
    });
  }

  async createAuditReport(storeId: string, reportType: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: {
        products: true,
      },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    // Queue audit job
    await this.crawlerQueue.add('audit-store', {
      storeId,
      reportType,
    });

    return { message: 'Audit queued' };
  }
}
