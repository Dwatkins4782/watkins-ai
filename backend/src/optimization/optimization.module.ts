// Optimization Module
import { Module } from '@nestjs/common';
import { OptimizationService } from './optimization.service';
import { OptimizationController } from './optimization.controller';
import { PrismaService } from '../prisma.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [OptimizationController],
  providers: [OptimizationService, PrismaService],
  exports: [OptimizationService],
})
export class OptimizationModule {}
