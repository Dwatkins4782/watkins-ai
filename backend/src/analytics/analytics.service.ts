import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async calculateProfitScore(storeId: string): Promise<number> {
    // Verify store exists
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      throw new Error('Store not found');
    }

    const [orderStats, productCount, customerCount] = await Promise.all([
      this.prisma.order.aggregate({
        where: { storeId, placedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        _sum: { total: true },
        _avg: { total: true },
        _count: true,
      }),
      this.prisma.product.count({ where: { storeId } }),
      this.prisma.customer.count({ where: { storeId } }),
    ]);

    const revenue = Number(orderStats._sum.total) || 0;
    const avgOrderValue = Number(orderStats._avg.total) || 0;
    const orderCount = orderStats._count || 0;

    // Simplified profit score calculation
    const score = Math.min(100, (revenue / 10000) * 40 + (orderCount / 100) * 30 + (avgOrderValue / 100) * 30);

    await this.prisma.store.update({
      where: { id: storeId },
      data: { profitScore: score, avgOrderValue },
    });

    return score;
  }

  async generateInsights(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: { products: true, orders: { take: 100, orderBy: { placedAt: 'desc' } } },
    });

    if (!store) throw new Error('Store not found');

    const insights = await this.aiService.generateInsights({
      storeData: store,
      analyticsData: {
        profitScore: store.profitScore,
        conversionRate: store.conversionRate,
        productCount: store.products.length,
        recentOrders: store.orders.length,
      },
    });

    // Save insights to database
    for (const insight of insights) {
      await this.prisma.insight.create({
        data: {
          storeId,
          insightType: insight.insightType || 'REVENUE_OPPORTUNITY',
          priority: insight.priority || 'MEDIUM',
          title: insight.title,
          description: insight.description,
          actionable: !!insight.suggestedAction,
          suggestedAction: insight.suggestedAction,
          metrics: insight.metrics || {},
          status: 'NEW',
        },
      });
    }

    return insights;
  }

  async getInsights(storeId: string) {
    return this.prisma.insight.findMany({
      where: { storeId, status: { not: 'DISMISSED' } },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async getDashboard(storeId: string) {
    // Verify store exists
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      throw new Error('Store not found');
    }

    const profitScore = await this.calculateProfitScore(storeId);
    const insights = await this.getInsights(storeId);

    return { profitScore, insights: insights.slice(0, 5), totalInsights: insights.length };
  }
}
