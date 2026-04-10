import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { CrawlerProcessor } from './crawler.processor';
import { PrismaService } from '../prisma.service';
import { AiModule } from '../ai/ai.module';

const redisEnabled = !!process.env.REDIS_HOST;

@Module({
  imports: [
    ...(redisEnabled ? [BullModule.registerQueue({ name: 'crawler' })] : []),
    AiModule,
  ],
  controllers: [CrawlerController],
  providers: [
    CrawlerService,
    ...(redisEnabled ? [CrawlerProcessor] : []),
    PrismaService,
  ],
  exports: [CrawlerService],
})
export class CrawlerModule {}
