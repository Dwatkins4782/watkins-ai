import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { PrismaService } from '../prisma.service';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'store-sync',
    }),
    IntegrationModule,
  ],
  controllers: [StoreController],
  providers: [StoreService, PrismaService],
  exports: [StoreService],
})
export class StoreModule {}
