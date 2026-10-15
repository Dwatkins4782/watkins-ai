import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        tenant: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(id: string, data: any) {
    // Only non-privileged profile fields are user-editable. Never trust the
    // body for role / tenantId / emailVerified / email / password — a user
    // could previously PUT { tenantId } to move into another customer's account.
    const allowedFields = ['firstName', 'lastName'] as const;
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (data?.[field] !== undefined) {
        updateData[field] = data[field];
      }
    }
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      // Don't send the password hash back to the client.
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
