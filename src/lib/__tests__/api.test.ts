import api from '../api';

jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return {
    create: jest.fn(() => instance),
    __instance: instance,
  };
});

describe('API client', () => {
  it('exports default api object with expected methods', () => {
    expect(api).toBeDefined();
    expect(typeof api.login).toBe('function');
    expect(typeof api.register).toBe('function');
    expect(typeof api.getStores).toBe('function');
    expect(typeof api.getSubscription).toBe('function');
    expect(typeof api.getInvoices).toBe('function');
    expect(typeof api.cancelSubscription).toBe('function');
    expect(typeof api.getEmailFlows).toBe('function');
    expect(typeof api.getSupportTickets).toBe('function');
    expect(typeof api.getRecommendations).toBe('function');
    expect(typeof api.getOptimizedProducts).toBe('function');
  });
});
