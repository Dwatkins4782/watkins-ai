import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class OptimizationService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async optimizeProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { store: true },
    });

    if (!product) throw new Error('Product not found');

    const optimized = await this.aiService.optimizeProductPage({
      title: product.title,
      description: product.description || '',
      brandVoice: product.store.brandVoice || 'Professional and engaging',
    });

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        optimizedTitle: optimized.optimizedTitle,
        optimizedDescription: optimized.optimizedDescription,
        seoScore: optimized.seoScore,
      },
    });
  }

  async getOptimizedProducts(storeId: string) {
    return this.prisma.product.findMany({
      where: { storeId, optimizedTitle: { not: null } },
      select: {
        id: true,
        title: true,
        optimizedTitle: true,
        seoScore: true,
        conversionScore: true,
      },
    });
  }
}
