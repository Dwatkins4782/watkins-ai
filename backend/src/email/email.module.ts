// Module 2: Email & SMS Engine - Complete Implementation
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailProcessor } from './email.processor';
import { AiModule } from '../ai/ai.module';

const redisEnabled = !!process.env.REDIS_HOST;

@Module({
  imports: [
    ...(redisEnabled ? [BullModule.registerQueue({ name: 'email' })] : []),
    AiModule,
  ],
  controllers: [EmailController],
  providers: [
    EmailService,
    ...(redisEnabled ? [EmailProcessor] : []),
  ],
  exports: [EmailService],
})
export class EmailModule {}
