// Integration Module
import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { ShopifyService } from './shopify.service';
import { WooCommerceService } from './woocommerce.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [IntegrationService, ShopifyService, WooCommerceService, PrismaService],
  exports: [IntegrationService, ShopifyService, WooCommerceService],
})
export class IntegrationModule {}
