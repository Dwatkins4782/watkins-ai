import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Post('stores/:storeId/generate')
  async generate(@Param('storeId') storeId: string) {
    return this.recommendationService.generateRecommendations(storeId);
  }

  @Get('stores/:storeId')
  async getAll(@Param('storeId') storeId: string) {
    return this.recommendationService.getRecommendations(storeId);
  }
}
