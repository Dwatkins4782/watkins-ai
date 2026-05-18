/**
 * AUDIT #8: Shared shape for the authenticated user object exposed via @CurrentUser().
 * Must exactly match what JwtStrategy.validate() returns.
 */
export interface AuthUser {
  id: string;
  email: string;
  tenantId: string;
  role: string;
  emailVerified?: boolean;
}
