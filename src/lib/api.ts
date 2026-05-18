import axios, { AxiosResponse } from "axios";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  AuthUser,
  Store,
  CreateStoreRequest,
  UpdateStoreRequest,
  PaginatedResponse,
  EmailFlow,
  CreateEmailFlowRequest,
  SupportTicket,
  CreateTicketRequest,
  Subscription,
  CheckoutResponse,
  Invoice,
  AnalyticsDashboard,
  Insight,
  Recommendation,
  DropshipSupplier,
  SupplierFilters,
  PlanName,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const api = axios.create({ baseURL: API_URL });

// AUDIT #7: typed interceptors
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

// ─── Auth ───────────────────────────────────────────────────
export const authApi = {
  register: (data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/register", data),
  login: (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/login", data),
  me: (): Promise<AxiosResponse<AuthUser>> => api.get("/auth/me"),
  forgotPassword: (email: string): Promise<AxiosResponse<{ message: string }>> =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, newPassword: string): Promise<AxiosResponse<{ message: string }>> =>
    api.post("/auth/reset-password", { token, newPassword }),
};

// ─── Store ──────────────────────────────────────────────────
export const storeApi = {
  list: (page = 1, limit = 20): Promise<AxiosResponse<PaginatedResponse<Store>>> =>
    api.get(`/stores?page=${page}&limit=${limit}`),
  create: (data: CreateStoreRequest): Promise<AxiosResponse<Store>> =>
    api.post("/stores", data),
  get: (id: string): Promise<AxiosResponse<Store>> => api.get(`/stores/${id}`),
  update: (id: string, data: UpdateStoreRequest): Promise<AxiosResponse<Store>> =>
    api.put(`/stores/${id}`, data),
  delete: (id: string): Promise<AxiosResponse<{ deleted: boolean }>> =>
    api.delete(`/stores/${id}`),
  getAnalytics: (id: string): Promise<AxiosResponse<AnalyticsDashboard>> =>
    api.get(`/stores/${id}/analytics`),
  sync: (id: string): Promise<AxiosResponse<{ jobId: string }>> =>
    api.post(`/stores/${id}/sync`),
};

// ─── Crawler ────────────────────────────────────────────────
export const crawlerApi = {
  startCrawl: (storeId: string): Promise<AxiosResponse<{ jobId: string }>> =>
    api.post(`/crawler/stores/${storeId}/crawl`),
  getReports: (storeId: string): Promise<AxiosResponse<{ id: string; createdAt: string }[]>> =>
    api.get(`/crawler/stores/${storeId}/reports`),
};

// ─── Email ──────────────────────────────────────────────────
export const emailApi = {
  createFlow: (storeId: string, data: CreateEmailFlowRequest): Promise<AxiosResponse<EmailFlow>> =>
    api.post(`/email/stores/${storeId}/flows`, data),
  getFlows: (storeId: string): Promise<AxiosResponse<EmailFlow[]>> =>
    api.get(`/email/stores/${storeId}/flows`),
  getFlow: (flowId: string): Promise<AxiosResponse<EmailFlow>> =>
    api.get(`/email/flows/${flowId}`),
  activateFlow: (flowId: string): Promise<AxiosResponse<EmailFlow>> =>
    api.put(`/email/flows/${flowId}/activate`),
  pauseFlow: (flowId: string): Promise<AxiosResponse<EmailFlow>> =>
    api.put(`/email/flows/${flowId}/pause`),
  deleteFlow: (flowId: string): Promise<AxiosResponse<{ deleted: boolean }>> =>
    api.delete(`/email/flows/${flowId}`),
};

// ─── Analytics ──────────────────────────────────────────────
export const analyticsApi = {
  getDashboard: (storeId: string): Promise<AxiosResponse<AnalyticsDashboard>> =>
    api.get(`/analytics/stores/${storeId}/dashboard`),
  getInsights: (storeId: string): Promise<AxiosResponse<Insight[]>> =>
    api.get(`/analytics/stores/${storeId}/insights`),
  generateInsights: (storeId: string): Promise<AxiosResponse<Insight[]>> =>
    api.post(`/analytics/stores/${storeId}/insights/generate`),
};

// ─── Recommendations ────────────────────────────────────────
export const recommendationsApi = {
  generate: (storeId: string): Promise<AxiosResponse<Recommendation[]>> =>
    api.post(`/recommendations/stores/${storeId}/generate`),
  getAll: (storeId: string): Promise<AxiosResponse<Recommendation[]>> =>
    api.get(`/recommendations/stores/${storeId}`),
};

// ─── Support ────────────────────────────────────────────────
export const supportApi = {
  createTicket: (storeId: string, data: CreateTicketRequest): Promise<AxiosResponse<SupportTicket>> =>
    api.post(`/support/stores/${storeId}/tickets`, data),
  getTickets: (storeId: string): Promise<AxiosResponse<SupportTicket[]>> =>
    api.get(`/support/stores/${storeId}/tickets`),
  getTicket: (ticketId: string): Promise<AxiosResponse<SupportTicket>> =>
    api.get(`/support/tickets/${ticketId}`),
};

// ─── Billing ────────────────────────────────────────────────
export const billingApi = {
  createCheckoutSession: (plan: PlanName): Promise<AxiosResponse<CheckoutResponse>> =>
    api.post("/billing/checkout", { plan }),
  getSubscription: (): Promise<AxiosResponse<Subscription>> =>
    api.get("/billing/subscription"),
  getInvoices: (): Promise<AxiosResponse<Invoice[]>> => api.get("/billing/invoices"),
  cancel: (): Promise<AxiosResponse<{ cancelled: boolean }>> => api.post("/billing/cancel"),
  updatePlan: (plan: PlanName): Promise<AxiosResponse<Subscription>> =>
    api.post("/billing/update-plan", { plan }),
};

// ─── Dropshipping ───────────────────────────────────────────
export const dropshippingApi = {
  getSuppliers: (filters?: SupplierFilters): Promise<AxiosResponse<DropshipSupplier[]>> =>
    api.get("/dropshipping/suppliers", { params: filters }),
  getSupplier: (id: string): Promise<AxiosResponse<DropshipSupplier>> =>
    api.get(`/dropshipping/suppliers/${id}`),
  getRecommended: (storeId: string): Promise<AxiosResponse<DropshipSupplier[]>> =>
    api.get(`/dropshipping/stores/${storeId}/recommended`),
};

// Default export keeps backward compat with existing imports
const apiClient = {
  authApi,
  storeApi,
  crawlerApi,
  emailApi,
  analyticsApi,
  recommendationsApi,
  supportApi,
  billingApi,
  dropshippingApi,
};
export default apiClient;
