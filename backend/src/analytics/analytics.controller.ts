import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('stores/:storeId/dashboard')
  async getDashboard(@Param('storeId') storeId: string) {
    return this.analyticsService.getDashboard(storeId);
  }

  @Get('stores/:storeId/insights')
  async getInsights(@Param('storeId') storeId: string) {
    return this.analyticsService.getInsights(storeId);
  }

  @Post('stores/:storeId/insights/generate')
  async generateInsights(@Param('storeId') storeId: string) {
    return this.analyticsService.generateInsights(storeId);
  }

  @Get('stores/:storeId/profit-score')
  async getProfitScore(@Param('storeId') storeId: string) {
    return { score: await this.analyticsService.calculateProfitScore(storeId) };
  }
}
