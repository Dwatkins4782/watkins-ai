// Module 2: Email & SMS Engine - Complete Implementation
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailProcessor } from './email.processor';
import { PrismaService } from '../prisma.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'email' }),
    AiModule,
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailProcessor, PrismaService],
  exports: [EmailService],
})
export class EmailModule {}
