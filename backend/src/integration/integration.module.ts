// Integration Module
import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { ShopifyService } from './shopify.service';
import { WooCommerceService } from './woocommerce.service';

@Module({
  providers: [IntegrationService, ShopifyService, WooCommerceService],
  exports: [IntegrationService, ShopifyService, WooCommerceService],
})
export class IntegrationModule {}
