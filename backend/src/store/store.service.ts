import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('store-sync') private storeSyncQueue: Queue,
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
    await this.storeSyncQueue.add('sync-store', {
      storeId: store.id,
      fullSync: true,
    });

    return store;
  }

  async findAll(tenantId: string) {
    return this.prisma.store.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: {
            products: true,
            orders: true,
            customers: true,
          },
        },
      },
    });
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
    await this.storeSyncQueue.add('sync-store', {
      storeId,
      fullSync: false,
    });

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
}
