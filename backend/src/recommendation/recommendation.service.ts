import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class RecommendationService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async generateRecommendations(storeId: string) {
    const products = await this.prisma.product.findMany({
      where: { storeId },
      take: 50,
    });

    const recommendations = await this.aiService.generateProductRecommendations({
      productData: products,
    });

    for (const rec of recommendations) {
      await this.prisma.recommendation.create({
        data: {
          storeId,
          recommendationType: rec.type || 'BUNDLE',
          title: rec.title || 'Product Bundle',
          description: rec.reason,
          productIds: rec.productIds || [],
          status: 'active',
        },
      });
    }

    return recommendations;
  }

  async getRecommendations(storeId: string) {
    return this.prisma.recommendation.findMany({
      where: { storeId, status: 'active' },
      include: { products: true },
    });
  }
}
