import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import Shopify from 'shopify-api-node';

@Injectable()
export class ShopifyService {
  private readonly logger = new Logger(ShopifyService.name);

  constructor(private prisma: PrismaService) {}

  async syncStore(storeId: string, credentials: any) {
    const { shopName, accessToken } = credentials;

    const shopify = new Shopify({
      shopName,
      accessToken,
    });

    try {
      // Sync products
      const products = await shopify.product.list({ limit: 250 });

      for (const product of products) {
        await this.prisma.product.upsert({
          where: {
            storeId_externalId: { storeId, externalId: product.id.toString() },
          },
          create: {
            storeId,
            externalId: product.id.toString(),
            title: product.title,
            description: product.body_html,
            price: parseFloat(product.variants[0]?.price || '0'),
            sku: product.variants[0]?.sku || null,
            vendor: product.vendor,
            productType: product.product_type,
            tags: product.tags ? product.tags.split(',').map(t => t.trim()) : [],
            images: product.images?.map(img => img.src) || [],
            status: product.status,
          },
          update: {
            title: product.title,
            description: product.body_html,
            price: parseFloat(product.variants[0]?.price || '0'),
          },
        });
      }

      this.logger.log(`Synced ${products.length} products from Shopify for store ${storeId}`);
      
      return { success: true, productsSynced: products.length };
    } catch (error) {
      this.logger.error('Failed to sync Shopify store', error);
      throw error;
    }
  }
}
