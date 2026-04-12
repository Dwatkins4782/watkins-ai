import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { IntegrationModule } from '../integration/integration.module';

const redisEnabled = !!process.env.REDIS_HOST;

@Module({
  imports: [
    ...(redisEnabled ? [BullModule.registerQueue({ name: 'store-sync' })] : []),
    IntegrationModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
