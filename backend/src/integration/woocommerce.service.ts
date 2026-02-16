import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

@Injectable()
export class WooCommerceService {
  private readonly logger = new Logger(WooCommerceService.name);

  constructor(private prisma: PrismaService) {}

  async syncStore(storeId: string, credentials: any) {
    const { url, consumerKey, consumerSecret } = credentials;

    const WooCommerce = new WooCommerceRestApi({
      url,
      consumerKey,
      consumerSecret,
      version: 'wc/v3',
    });

    try {
      const response = await WooCommerce.get('products', { per_page: 100 });
      const products = response.data;

      for (const product of products) {
        await this.prisma.product.upsert({
          where: {
            storeId_externalId: { storeId, externalId: product.id.toString() },
          },
          create: {
            storeId,
            externalId: product.id.toString(),
            title: product.name,
            description: product.description,
            price: parseFloat(product.price || '0'),
            sku: product.sku || null,
            productType: product.type,
            tags: product.tags?.map(t => t.name) || [],
            images: product.images?.map(img => img.src) || [],
            status: product.status,
          },
          update: {
            title: product.name,
            description: product.description,
            price: parseFloat(product.price || '0'),
          },
        });
      }

      this.logger.log(`Synced ${products.length} products from WooCommerce for store ${storeId}`);
      
      return { success: true, productsSynced: products.length };
    } catch (error) {
      this.logger.error('Failed to sync WooCommerce store', error);
      throw error;
    }
  }
}
