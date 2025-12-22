import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('crawler')
@UseGuards(JwtAuthGuard)
export class CrawlerController {
  constructor(private crawlerService: CrawlerService) {}

  @Post('stores/:storeId/crawl')
  async startCrawl(@Param('storeId') storeId: string) {
    return this.crawlerService.startCrawl(storeId);
  }

  @Get('stores/:storeId/reports')
  async getReports(@Param('storeId') storeId: string) {
    return this.crawlerService.getReports(storeId);
  }

  @Get('reports/:reportId')
  async getReport(@Param('reportId') reportId: string) {
    return this.crawlerService.getReport(reportId);
  }

  @Post('stores/:storeId/audit/:type')
  async createAudit(@Param('storeId') storeId: string, @Param('type') type: string) {
    return this.crawlerService.createAuditReport(storeId, type);
  }
}
