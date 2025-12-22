// DFY Store Builder Module
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DfyService } from './dfy.service';
import { DfyController } from './dfy.controller';
import { DfyProcessor } from './dfy.processor';
import { PrismaService } from '../prisma.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'dfy' }),
    AiModule,
  ],
  controllers: [DfyController],
  providers: [DfyService, DfyProcessor, PrismaService],
  exports: [DfyService],
})
export class DfyModule {}
