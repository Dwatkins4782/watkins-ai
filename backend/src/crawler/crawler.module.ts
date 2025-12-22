import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { CrawlerProcessor } from './crawler.processor';
import { PrismaService } from '../prisma.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'crawler',
    }),
    AiModule,
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService, CrawlerProcessor, PrismaService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
