// Recommendation Engine Module
import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { PrismaService } from '../prisma.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [RecommendationController],
  providers: [RecommendationService, PrismaService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
