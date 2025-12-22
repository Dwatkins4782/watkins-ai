import { Injectable } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { WooCommerceService } from './woocommerce.service';

@Injectable()
export class IntegrationService {
  constructor(
    private shopifyService: ShopifyService,
    private wooCommerceService: WooCommerceService,
  ) {}

  async syncStore(storeId: string, platform: string, credentials: any) {
    switch (platform) {
      case 'SHOPIFY':
        return this.shopifyService.syncStore(storeId, credentials);
      case 'WOOCOMMERCE':
        return this.wooCommerceService.syncStore(storeId, credentials);
      default:
        throw new Error('Unsupported platform');
    }
  }
}
