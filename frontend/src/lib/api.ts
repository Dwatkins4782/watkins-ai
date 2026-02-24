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

// Optimization API
export const optimizationApi = {
  getOptimizedProducts: (storeId: string) => api.get(`/optimization/stores/${storeId}/optimized-products`),
  optimizeProduct: (productId: string) => api.post(`/optimization/products/${productId}/optimize`),
}

// Billing API
export const billingApi = {
  createCheckout: (plan: string) => api.post('/billing/checkout', { plan }),
  getSubscription: () => api.get('/billing/subscription'),
  getInvoices: () => api.get('/billing/invoices'),
  cancelSubscription: () => api.post('/billing/subscription/cancel'),
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

  // Optimization
  getOptimizedProducts: (storeId: string) => optimizationApi.getOptimizedProducts(storeId).then(res => res.data),
  optimizeProduct: (productId: string) => optimizationApi.optimizeProduct(productId).then(res => res.data),

  // Billing
  createCheckout: (plan: string) => billingApi.createCheckout(plan).then(res => res.data),
  getSubscription: () => billingApi.getSubscription().then(res => res.data),
  getInvoices: () => billingApi.getInvoices().then(res => res.data),
  cancelSubscription: () => billingApi.cancelSubscription().then(res => res.data),
}
