// SMS Module
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { PrismaService } from '../prisma.service';
import { AiModule } from '../ai/ai.module';

const redisEnabled = !!process.env.REDIS_HOST;

@Module({
  imports: [
    AiModule,
    ...(redisEnabled ? [BullModule.registerQueue({ name: 'sms' })] : []),
  ],
  controllers: [SmsController],
  providers: [SmsService, PrismaService],
  exports: [SmsService],
})
export class SmsModule {}
