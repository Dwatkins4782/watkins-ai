import { Module } from '@nestjs/common';
import { DropshippingService } from './dropshipping.service';
import { DropshippingController } from './dropshipping.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [DropshippingController],
  providers: [DropshippingService],
  exports: [DropshippingService],
})
export class DropshippingModule {}
