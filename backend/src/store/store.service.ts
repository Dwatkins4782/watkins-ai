import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(
    private prisma: PrismaService,
    @Optional() @InjectQueue('store-sync') private storeSyncQueue?: Queue,
  ) {}

  async create(tenantId: string, createStoreDto: CreateStoreDto) {
    const store = await this.prisma.store.create({
      data: {
        ...createStoreDto,
        tenantId,
        status: 'SYNCING',
      },
    });

    // Queue initial sync
    if (this.storeSyncQueue) {
      await this.storeSyncQueue.add('sync-store', {
        storeId: store.id,
        fullSync: true,
      });
    }

    return store;
  }

  // AUDIT #4: paginated, ordered, returns total for client pagination
  async findAll(tenantId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.store.findMany({
        where: { tenantId },
        skip,
        take: limit,
        include: {
          _count: { select: { products: true, orders: true, customers: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.store.count({ where: { tenantId } }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            orders: true,
            customers: true,
            campaigns: true,
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    return this.prisma.store.update({
      where: { id },
      data: updateStoreDto,
    });
  }

  async delete(id: string) {
    return this.prisma.store.delete({
      where: { id },
    });
  }

  async syncStore(storeId: string) {
    if (this.storeSyncQueue) {
      await this.storeSyncQueue.add('sync-store', {
        storeId,
        fullSync: false,
      });
    }

    return { message: 'Store sync queued' };
  }

  async getAnalytics(storeId: string) {
    const store = await this.findOne(storeId);

    const [productCount, customerCount, orderCount] = await Promise.all([
      this.prisma.product.count({ where: { storeId } }),
      this.prisma.customer.count({ where: { storeId } }),
      this.prisma.order.count({ where: { storeId } }),
    ]);

    const recentOrders = await this.prisma.order.aggregate({
      where: {
        storeId,
        placedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      _sum: { total: true },
      _avg: { total: true },
      _count: true,
    });

    return {
      store,
      counts: {
        products: productCount,
        customers: customerCount,
        orders: orderCount,
      },
      last30Days: {
        revenue: recentOrders._sum.total || 0,
        averageOrderValue: recentOrders._avg.total || 0,
        orderCount: recentOrders._count || 0,
      },
      profitScore: store.profitScore,
      conversionRate: store.conversionRate,
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // AUDIT #13: Tenant-scoped wrappers. Every per-store mutation/read
  // must verify the store belongs to the caller's tenant.
  // ═══════════════════════════════════════════════════════════════
  private async assertTenantOwnsStore(tenantId: string, id: string): Promise<void> {
    const store = await this.prisma.store.findFirst({
      where: { id, tenantId },
      select: { id: true },
    });
    if (!store) {
      // Use NotFoundException (not Forbidden) to avoid leaking the existence of cross-tenant resources
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException('Store not found');
    }
  }

  async findOneByTenant(tenantId: string, id: string) {
    await this.assertTenantOwnsStore(tenantId, id);
    return this.findOne(id);
  }

  async getAnalyticsByTenant(tenantId: string, id: string) {
    await this.assertTenantOwnsStore(tenantId, id);
    return this.getAnalytics(id);
  }

  async updateByTenant(tenantId: string, id: string, dto: UpdateStoreDto) {
    await this.assertTenantOwnsStore(tenantId, id);
    return this.update(id, dto);
  }

  async syncStoreByTenant(tenantId: string, id: string) {
    await this.assertTenantOwnsStore(tenantId, id);
    return this.syncStore(id);
  }

  async deleteByTenant(tenantId: string, id: string) {
    await this.assertTenantOwnsStore(tenantId, id);
    return this.delete(id);
  }
}