// SMS Module
import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { PrismaService } from '../prisma.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [SmsController],
  providers: [SmsService, PrismaService],
  exports: [SmsService],
})
export class SmsModule {}
