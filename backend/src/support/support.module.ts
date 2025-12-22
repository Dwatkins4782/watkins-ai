// Support AI Module
import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { PrismaService } from '../prisma.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [SupportController],
  providers: [SupportService, PrismaService],
  exports: [SupportService],
})
export class SupportModule {}
