import { Module } from '@nestjs/common';
import { DropshippingService } from './dropshipping.service';
import { DropshippingController } from './dropshipping.controller';
import { PrismaService } from '../prisma.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [DropshippingController],
  providers: [DropshippingService, PrismaService],
  exports: [DropshippingService],
})
export class DropshippingModule {}
