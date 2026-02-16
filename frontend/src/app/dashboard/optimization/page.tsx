'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  optimizedAt?: string;
}

interface OptimizedProduct {
  id: string;
  productId: string;
  originalTitle: string;
  optimizedTitle: string;
  originalDescription: string;
  optimizedDescription: string;
  originalPrice: number;
  suggestedPrice: number;
  seoKeywords: string[];
  improvements: any;
  status: string;
  createdAt: string;
  product: Product;
}

export default function OptimizationPage() {
  const { user } = useAuthStore();
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [optimizedProducts, setOptimizedProducts] = useState<OptimizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState<string | null>(null);
  const [selectedOptimization, setSelectedOptimization] = useState<OptimizedProduct | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (selectedStoreId) {
      loadProducts();
      loadOptimizedProducts();
    }
  }, [selectedStoreId]);

  const loadStores = async () => {
    try {
      const data = await api.getStores();
      setStores(data);
      if (data.length > 0) {
        setSelectedStoreId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    if (!selectedStoreId) return;
    
    try {
      const data = await api.get(`/stores/${selectedStoreId}`);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadOptimizedProducts = async () => {
    if (!selectedStoreId) return;
    
    setLoading(true);
    try {
      const data = await api.get(`/optimization/stores/${selectedStoreId}/optimized-products`);
      setOptimizedProducts(data);
    } catch (error) {
      console.error('Failed to load optimized products:', error);
      toast.error('Failed to load optimizations');
    } finally {
      setLoading(false);
    }
  };

  const optimizeProduct = async (productId: string) => {
    setOptimizing(productId);
    try {
      await api.post(`/optimization/products/${productId}/optimize`);
      toast.success('Product optimization started');
      loadOptimizedProducts();
    } catch (error) {
      console.error('Failed to optimize product:', error);
      toast.error('Failed to optimize product');
    } finally {
      setOptimizing(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && stores.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Stores Found</h2>
        <p className="text-gray-600">Create a store first to optimize products.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Optimization</h1>
          <p className="text-gray-600 mt-1">AI-powered product listing optimization</p>
        </div>
      </div>

      {/* Store Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Store
        </label>
        <select
          value={selectedStoreId}
          onChange={(e) => setSelectedStoreId(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      {optimizedProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Optimizations</p>
            <p className="text-3xl font-bold text-gray-900">{optimizedProducts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {optimizedProducts.filter(p => p.status === 'COMPLETED').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {optimizedProducts.filter(p => p.status === 'PENDING').length}
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Available Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Available Products</h2>
            <p className="text-sm text-gray-600">Select products to optimize</p>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found. Add products to your store first.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.description || 'No description'}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-2">
                        ${product.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <button
                      onClick={() => optimizeProduct(product.id)}
                      disabled={optimizing === product.id}
                      className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {optimizing === product.id ? 'Optimizing...' : '✨ Optimize'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optimized Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Optimizations</h2>
            <p className="text-sm text-gray-600">Review and apply optimizations</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : optimizedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No optimizations yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {optimizedProducts.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptimization(opt)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{opt.optimizedTitle}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(opt.status)}`}>
                      {opt.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {opt.optimizedDescription}
                  </p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>Price: ${opt.originalPrice} → ${opt.suggestedPrice}</span>
                    <span>•</span>
                    <span>{new Date(opt.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Optimization Detail Modal */}
      {selectedOptimization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Optimization Details</h2>
              <button
                onClick={() => setSelectedOptimization(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{selectedOptimization.optimizedTitle}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 text-sm rounded ${getStatusColor(selectedOptimization.status)}`}>
                    {selectedOptimization.status}
                  </span>
                </div>
              </div>

              {/* Title Comparison */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Title</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Original</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedOptimization.originalTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600 mb-1">Optimized</p>
                    <p className="text-gray-900 bg-green-50 p-3 rounded font-medium">{selectedOptimization.optimizedTitle}</p>
                  </div>
                </div>
              </div>

              {/* Description Comparison */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Description</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Original</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">{selectedOptimization.originalDescription}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600 mb-1">Optimized</p>
                    <p className="text-gray-900 bg-green-50 p-3 rounded whitespace-pre-wrap">{selectedOptimization.optimizedDescription}</p>
                  </div>
                </div>
              </div>

              {/* Price Comparison */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Pricing</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Price</p>
                    <p className="text-2xl font-bold text-gray-700">${selectedOptimization.originalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600 mb-1">Suggested Price</p>
                    <p className="text-2xl font-bold text-green-600">${selectedOptimization.suggestedPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* SEO Keywords */}
              {selectedOptimization.seoKeywords && selectedOptimization.seoKeywords.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">SEO Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOptimization.seoKeywords.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {selectedOptimization.improvements && Object.keys(selectedOptimization.improvements).length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Improvements</h4>
                  <div className="bg-gray-50 rounded p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedOptimization.improvements, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 text-sm text-gray-500">
                <p>Created: {new Date(selectedOptimization.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedOptimization(null)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
