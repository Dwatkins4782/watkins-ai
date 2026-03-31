import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => api.post('/auth/reset-password', { token, newPassword }),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  resendVerification: () => api.post('/auth/resend-verification'),
  changePassword: (currentPassword: string, newPassword: string) => api.post('/auth/change-password', { currentPassword, newPassword }),
}

// Store API
export const storeApi = {
  list: () => api.get('/stores'),
  create: (data: any) => api.post('/stores', data),
  get: (id: string) => api.get(`/stores/${id}`),
  getAnalytics: (id: string) => api.get(`/stores/${id}/analytics`),
  sync: (id: string) => api.post(`/stores/${id}/sync`),
}

// Crawler API
export const crawlerApi = {
  startCrawl: (storeId: string) => api.post(`/crawler/stores/${storeId}/crawl`),
  getReports: (storeId: string) => api.get(`/crawler/stores/${storeId}/reports`),
}

// Email API
export const emailApi = {
  createFlow: (storeId: string, data: any) => api.post(`/email/stores/${storeId}/flows`, data),
  getFlows: (storeId: string) => api.get(`/email/stores/${storeId}/flows`),
  activateFlow: (flowId: string) => api.put(`/email/flows/${flowId}/activate`),
  pauseFlow: (flowId: string) => api.put(`/email/flows/${flowId}/pause`),
  getFlow: (flowId: string) => api.get(`/email/flows/${flowId}`),
  deleteFlow: (flowId: string) => api.delete(`/email/flows/${flowId}`),
  createCampaign: (storeId: string, data: any) => api.post(`/email/stores/${storeId}/campaigns`, data),
  getCampaigns: (storeId: string) => api.get(`/email/stores/${storeId}/campaigns`),
}

// Analytics API
export const analyticsApi = {
  getDashboard: (storeId: string) => api.get(`/analytics/stores/${storeId}/dashboard`),
  getInsights: (storeId: string) => api.get(`/analytics/stores/${storeId}/insights`),
  generateInsights: (storeId: string) => api.post(`/analytics/stores/${storeId}/insights/generate`),
}

// Recommendations API
export const recommendationsApi = {
  generate: (storeId: string) => api.post(`/recommendations/stores/${storeId}/generate`),
  getAll: (storeId: string) => api.get(`/recommendations/stores/${storeId}`),
}

// Support API
export const supportApi = {
  createTicket: (storeId: string, data: any) => api.post(`/support/stores/${storeId}/tickets`, data),
  getTickets: (storeId: string) => api.get(`/support/stores/${storeId}/tickets`),
  getTicket: (ticketId: string) => api.get(`/support/tickets/${ticketId}`),
}

// DFY API
export const dfyApi = {
  createProject: (data: any) => api.post('/dfy/projects', data),
  getProjects: () => api.get('/dfy/projects'),
  getProject: (projectId: string) => api.get(`/dfy/projects/${projectId}`),
}

// User API
export const userApi = {
  getProfile: () => api.get('/users/me') as any,
  updateProfile: (data: any) => api.put('/users/me', data),
}

// SMS API
export const smsApi = {
  createFlow: (storeId: string, data: any) => api.post(`/sms/stores/${storeId}/flows`, data),
  getFlows: (storeId: string) => api.get(`/sms/stores/${storeId}/flows`),
  getFlow: (flowId: string) => api.get(`/sms/flows/${flowId}`),
  activateFlow: (flowId: string) => api.put(`/sms/flows/${flowId}/activate`),
  pauseFlow: (flowId: string) => api.put(`/sms/flows/${flowId}/pause`),
  deleteFlow: (flowId: string) => api.delete(`/sms/flows/${flowId}`),
  send: (data: { to: string; message: string }) => api.post('/sms/send', data),
}

// Billing API
export const billingApi = {
  createCheckout: (plan: string) => api.post('/billing/checkout', { plan }),
  getSubscription: () => api.get('/billing/subscription'),
  getInvoices: () => api.get('/billing/invoices'),
  cancelSubscription: () => api.post('/billing/cancel'),
  updatePlan: (plan: string) => api.post('/billing/update-plan', { plan }),
}

// Dropshipping API
export const dropshippingApi = {
  getSuppliers: (filters?: { category?: string; niche?: string; region?: string }) =>
    api.get('/dropshipping/suppliers', { params: filters }),
  getSupplier: (supplierId: string) => api.get(`/dropshipping/suppliers/${supplierId}`),
  seedSuppliers: () => api.post('/dropshipping/suppliers/seed'),
  getRecommendations: (storeId: string) => api.get(`/dropshipping/stores/${storeId}/recommendations`),
  getSetupPackages: () => api.get('/dropshipping/setup-packages'),
  connectSupplier: (storeId: string, data: any) => api.post(`/dropshipping/stores/${storeId}/connect`, data),
  getConnections: (storeId: string) => api.get(`/dropshipping/stores/${storeId}/connections`),
  getConnection: (connectionId: string) => api.get(`/dropshipping/connections/${connectionId}`),
  activateConnection: (connectionId: string) => api.put(`/dropshipping/connections/${connectionId}/activate`),
  pauseConnection: (connectionId: string) => api.put(`/dropshipping/connections/${connectionId}/pause`),
  disconnectConnection: (connectionId: string) => api.put(`/dropshipping/connections/${connectionId}/disconnect`),
}

// Simplified API exports
export default {
  // Auth
  register: (data: any) => authApi.register(data).then(res => res.data),
  login: (data: any) => authApi.login(data).then(res => res.data),
  me: () => authApi.me().then(res => res.data),

  // Stores
  getStores: () => storeApi.list().then(res => res.data),
  createStore: (data: any) => storeApi.create(data).then(res => res.data),
  getStore: (id: string) => storeApi.get(id).then(res => res.data),
  getStoreAnalytics: (id: string) => storeApi.getAnalytics(id).then(res => res.data),
  syncStore: (id: string) => storeApi.sync(id).then(res => res.data),

  // Crawler
  crawlWebsite: (storeId: string) => crawlerApi.startCrawl(storeId).then(res => res.data),
  getCrawlReports: (storeId: string) => crawlerApi.getReports(storeId).then(res => res.data),

  // Email
  createEmailFlow: (storeId: string, data: any) => emailApi.createFlow(storeId, data).then(res => res.data),
  getEmailFlows: (storeId: string) => emailApi.getFlows(storeId).then(res => res.data),
  activateEmailFlow: (flowId: string) => emailApi.activateFlow(flowId).then(res => res.data),

  // Analytics
  getDashboard: (storeId: string) => analyticsApi.getDashboard(storeId).then(res => res.data),
  getInsights: (storeId: string) => analyticsApi.getInsights(storeId).then(res => res.data),
  generateInsights: (storeId: string) => analyticsApi.generateInsights(storeId).then(res => res.data),

  // Recommendations
  generateRecommendations: (storeId: string) => recommendationsApi.generate(storeId).then(res => res.data),
  getRecommendations: (storeId: string) => recommendationsApi.getAll(storeId).then(res => res.data),

  // Support
  createSupportTicket: (storeId: string, data: any) => supportApi.createTicket(storeId, data).then(res => res.data),
  getSupportTickets: (storeId: string) => supportApi.getTickets(storeId).then(res => res.data),
  getSupportTicket: (ticketId: string) => supportApi.getTicket(ticketId).then(res => res.data),

  // DFY
  createDFYProject: (data: any) => dfyApi.createProject(data).then(res => res.data),
  getDFYProjects: () => dfyApi.getProjects().then(res => res.data),
  getDFYProject: (projectId: string) => dfyApi.getProject(projectId).then(res => res.data),

  // User
  getProfile: () => userApi.getProfile().then((res: any) => res.data),
  updateProfile: (data: any) => userApi.updateProfile(data).then(res => res.data),

  // SMS
  createSmsFlow: (storeId: string, data: any) => smsApi.createFlow(storeId, data).then(res => res.data),
  getSmsFlows: (storeId: string) => smsApi.getFlows(storeId).then(res => res.data),
  getSmsFlow: (flowId: string) => smsApi.getFlow(flowId).then(res => res.data),

  // Billing
  createCheckout: (plan: string) => billingApi.createCheckout(plan).then(res => res.data),
  getSubscription: () => billingApi.getSubscription().then(res => res.data),
  getInvoices: () => billingApi.getInvoices().then(res => res.data),
  cancelSubscription: () => billingApi.cancelSubscription().then(res => res.data),
  updatePlan: (plan: string) => billingApi.updatePlan(plan).then(res => res.data),

  // Dropshipping
  getDropshipSuppliers: (filters?: any) => dropshippingApi.getSuppliers(filters).then(res => res.data),
  getDropshipRecommendations: (storeId: string) => dropshippingApi.getRecommendations(storeId).then(res => res.data),
  connectDropshipSupplier: (storeId: string, data: any) => dropshippingApi.connectSupplier(storeId, data).then(res => res.data),
  getDropshipConnections: (storeId: string) => dropshippingApi.getConnections(storeId).then(res => res.data),
}
