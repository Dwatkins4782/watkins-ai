import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
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

// Billing API
export const billingApi = {
  createCheckout: (plan: string) => api.post('/billing/checkout', { plan }),
  getSubscription: () => api.get('/billing/subscription'),
}
