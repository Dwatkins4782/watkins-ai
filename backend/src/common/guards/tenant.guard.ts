import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * Ensures authenticated users can only access resources belonging to their tenant.
 * Checks route params for tenantId and compares against the JWT user's tenantId.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenantId) {
      throw new ForbiddenException('No tenant context');
    }

    // If request body or params contain a tenantId, verify it matches the user's
    const paramTenantId = request.params?.tenantId;
    const bodyTenantId = request.body?.tenantId;

    if (paramTenantId && paramTenantId !== user.tenantId) {
      throw new ForbiddenException('Access denied: tenant mismatch');
    }

    if (bodyTenantId && bodyTenantId !== user.tenantId) {
      throw new ForbiddenException('Access denied: tenant mismatch');
    }

    return true;
  }
}
