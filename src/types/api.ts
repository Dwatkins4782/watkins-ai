// AUDIT #7: Centralized API request/response types.
// Replaces `any` across the frontend API client.

// ─── Auth ───────────────────────────────────────────────────
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  tenantId: string;
  role: string;
  emailVerified: boolean;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ─── Store ──────────────────────────────────────────────────
export type StorePlatform = 'shopify' | 'woocommerce' | 'bigcommerce' | 'custom';

export interface Store {
  id: string;
  tenantId: string;
  name: string;
  url: string;
  platform: StorePlatform;
  status: 'active' | 'syncing' | 'error' | 'disconnected';
  createdAt: string;
  updatedAt: string;
  _count?: { products: number; orders: number; customers: number };
}

export interface CreateStoreRequest {
  name: string;
  url: string;
  platform: StorePlatform;
  apiKey?: string;
  apiSecret?: string;
}

export interface UpdateStoreRequest extends Partial<CreateStoreRequest> {}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Email Flows ────────────────────────────────────────────
export interface EmailFlowStep {
  type: 'wait' | 'send' | 'condition';
  delayMinutes?: number;
  templateId?: string;
  conditions?: Record<string, unknown>;
}

export interface EmailFlow {
  id: string;
  storeId: string;
  name: string;
  trigger: string;
  steps: EmailFlowStep[];
  active: boolean;
  createdAt: string;
}

export interface CreateEmailFlowRequest {
  name: string;
  trigger: 'signup' | 'abandoned_cart' | 'post_purchase' | 'win_back' | 'custom';
  steps: EmailFlowStep[];
  active?: boolean;
}

// ─── Support ────────────────────────────────────────────────
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicket {
  id: string;
  storeId: string;
  ticketNumber: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  channel: string;
  customerId?: string;
  createdAt: string;
}

export interface CreateTicketRequest {
  subject: string;
  message: string;
  channel?: string;
  customerId?: string;
}

// ─── Billing ────────────────────────────────────────────────
export type PlanName = 'starter' | 'growth' | 'professional' | 'enterprise';

export interface Subscription {
  id: string;
  plan: PlanName;
  status: 'active' | 'trialing' | 'past_due' | 'cancelled';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void';
  paidAt?: string;
  pdfUrl?: string;
}

// ─── Analytics ──────────────────────────────────────────────
export interface AnalyticsDashboard {
  revenue: number;
  orders: number;
  visitors: number;
  conversionRate: number;
  topProducts: Array<{ id: string; name: string; revenue: number }>;
  revenueByDay: Array<{ date: string; revenue: number }>;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

// ─── Recommendations ────────────────────────────────────────
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  category: string;
  acceptedAt?: string;
  completedAt?: string;
}

// ─── Dropshipping ───────────────────────────────────────────
export interface DropshipSupplier {
  id: string;
  slug: string;
  name: string;
  website: string;
  categories: string[];
  niches: string[];
  regions: string[];
  avgRating: number;
  avgShippingDays: number;
  featured: boolean;
}

export interface SupplierFilters {
  category?: string;
  niche?: string;
  region?: string;
}

// ─── Generic error ──────────────────────────────────────────
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
