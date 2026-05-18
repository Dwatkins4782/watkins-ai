import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DropshippingService } from './dropshipping.service';
import { DropshippingController } from './dropshipping.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  // AUDIT #6: in-memory cache module. For production, swap to redisStore.
  imports: [
    AiModule,
    CacheModule.register({
      ttl: 300_000, // 5 minutes default
      max: 500,
    }),
  ],
  controllers: [DropshippingController],
  providers: [DropshippingService],
  exports: [DropshippingService],
})
export class DropshippingModule {}
