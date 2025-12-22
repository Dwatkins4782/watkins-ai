import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        users: true,
        stores: true,
        subscriptions: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async updateSettings(tenantId: string, settings: any) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { settings },
    });
  }

  async getUsage(tenantId: string, resourceType?: string) {
    const where: any = { tenantId };
    if (resourceType) {
      where.resourceType = resourceType;
    }

    const records = await this.prisma.usageRecord.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 100,
    });

    const summary = records.reduce((acc, record) => {
      acc[record.resourceType] = (acc[record.resourceType] || 0) + record.quantity;
      return acc;
    }, {});

    return { records, summary };
  }

  async recordUsage(tenantId: string, resourceType: string, quantity: number = 1, metadata: any = {}) {
    return this.prisma.usageRecord.create({
      data: {
        tenantId,
        resourceType,
        quantity,
        metadata,
      },
    });
  }
}
