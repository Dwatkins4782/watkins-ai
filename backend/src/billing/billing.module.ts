// Billing Module
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [BillingController],
  providers: [BillingService, PrismaService],
  exports: [BillingService],
})
export class BillingModule {}
