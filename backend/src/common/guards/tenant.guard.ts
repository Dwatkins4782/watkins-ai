import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

/**
 * Ensures authenticated users can only access resources belonging to their
 * tenant.
 *
 * This guard used to compare only a `tenantId` route param/body field against
 * the JWT user's tenant — but no route carries a `tenantId` param (they use
 * `storeId`, `flowId`, `productId`, ...), so it enforced nothing about the
 * resource being accessed. Any logged-in user could read or act on another
 * customer's stores, analytics, flows, reports, etc. by id.
 *
 * This version resolves whichever resource id is in the route and verifies it
 * belongs to the caller's tenant. Every resource maps to a tenant directly
 * (DfyProject) or via its parent Store (`store.tenantId`). A mismatch returns
 * 404 so we never reveal that another tenant's resource exists.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenantId) {
      throw new ForbiddenException('No tenant context');
    }

    const tenantId: string = user.tenantId;
    const params = request.params || {};

    // Defense in depth: an explicit tenantId in params/body must match.
    if (params.tenantId && params.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied: tenant mismatch');
    }
    if (request.body?.tenantId && request.body.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied: tenant mismatch');
    }

    const notOwned = () => {
      throw new NotFoundException('Resource not found');
    };

    if (params.storeId) {
      const owned = await this.prisma.store.findFirst({
        where: { id: params.storeId, tenantId },
        select: { id: true },
      });
      if (!owned) notOwned();
    }

    if (params.reportId) {
      const owned = await this.prisma.crawlReport.findFirst({
        where: { id: params.reportId, store: { tenantId } },
        select: { id: true },
      });
      if (!owned) notOwned();
    }

    if (params.productId) {
      const owned = await this.prisma.product.findFirst({
        where: { id: params.productId, store: { tenantId } },
        select: { id: true },
      });
      if (!owned) notOwned();
    }

    if (params.connectionId) {
      const owned = await this.prisma.dropshipConnection.findFirst({
        where: { id: params.connectionId, store: { tenantId } },
        select: { id: true },
      });
      if (!owned) notOwned();
    }

    if (params.ticketId) {
      const owned = await this.prisma.supportTicket.findFirst({
        where: { id: params.ticketId, store: { tenantId } },
        select: { id: true },
      });
      if (!owned) notOwned();
    }

    // flowId is used by both email and SMS flows — accept a match in either.
    if (params.flowId) {
      const [emailFlow, smsFlow] = await Promise.all([
        this.prisma.emailFlow.findFirst({
          where: { id: params.flowId, store: { tenantId } },
          select: { id: true },
        }),
        this.prisma.smsFlow.findFirst({
          where: { id: params.flowId, store: { tenantId } },
          select: { id: true },
        }),
      ]);
      if (!emailFlow && !smsFlow) notOwned();
    }

    if (params.projectId) {
      const owned = await this.prisma.dfyProject.findFirst({
        where: { id: params.projectId, tenantId },
        select: { id: true },
      });
      if (!owned) notOwned();
    }

    return true;
  }
}
