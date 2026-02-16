'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function StoresPage() {
  const { user } = useAuthStore();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    url: '',
    platform: 'SHOPIFY',
  });

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const data = await api.getStores();
      setStores(data);
    } catch (error: any) {
      console.error('Failed to load stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createStore(newStore);
      setShowAddModal(false);
      setNewStore({ name: '', url: '', platform: 'SHOPIFY' });
      loadStores();
    } catch (error: any) {
      alert('Failed to add store: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCrawl = async (storeId: string) => {
    try {
      await api.crawlWebsite(storeId);
      alert('Website crawl started! Check back in a few minutes for results.');
      loadStores();
    } catch (error: any) {
      alert('Failed to start crawl: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Stores</h1>
          <p className="text-gray-600 mt-2">Manage your connected e-commerce stores</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Store
        </button>
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">No stores yet</p>
          <p className="text-gray-500 mb-6">Add your first store to get started with AI-powered growth</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Your First Store
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{store.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{store.url}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  store.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                  store.status === 'SYNCING' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {store.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">{store._count?.products || 0}</div>
                  <div className="text-xs text-gray-600">Products</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">{store._count?.orders || 0}</div>
                  <div className="text-xs text-gray-600">Orders</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-2xl font-bold text-purple-600">{store._count?.customers || 0}</div>
                  <div className="text-xs text-gray-600">Customers</div>
                </div>
              </div>

              {store.profitScore && (
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded">
                  <div className="text-sm text-gray-600">Profit Score</div>
                  <div className="text-3xl font-bold text-blue-600">{store.profitScore}/100</div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleCrawl(store.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  🔍 Audit Website
                </button>
                <button
                  onClick={() => window.location.href = `/dashboard/stores/${store.id}`}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Store Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Add New Store</h2>
            <form onSubmit={handleAddStore}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Awesome Store"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL *
                </label>
                <input
                  type="url"
                  value={newStore.url}
                  onChange={(e) => setNewStore({ ...newStore, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://mystore.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  value={newStore.platform}
                  onChange={(e) => setNewStore({ ...newStore, platform: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="SHOPIFY">Shopify</option>
                  <option value="WOOCOMMERCE">WooCommerce</option>
                  <option value="CUSTOM">Custom/Other</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
