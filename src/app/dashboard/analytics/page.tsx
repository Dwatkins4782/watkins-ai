'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [dashboard, setDashboard] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      router.push('/auth/login');
      return;
    }
    loadStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      loadDashboard();
    }
  }, [selectedStore]);

  const loadStores = async () => {
    try {
      const data = await api.getStores();
      setStores(data);
      if (data.length > 0) {
        setSelectedStore(data[0].id);
      }
    } catch (error: any) {
      console.error('Failed to load stores:', error);
      // If 401, user will be redirected by interceptor
      if (error.response?.status !== 401) {
        alert('Failed to load stores. Please try refreshing the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    if (!selectedStore) return;
    try {
      const [dashboardData, insightsData] = await Promise.all([
        api.getDashboard(selectedStore),
        api.getInsights(selectedStore),
      ]);
      setDashboard(dashboardData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const handleGenerateInsights = async () => {
    if (!selectedStore) return;
    setGenerating(true);
    try {
      await api.generateInsights(selectedStore);
      alert('AI Insights generated successfully!');
      loadDashboard();
    } catch (error) {
      console.error('Failed to generate insights:', error);
      alert('Failed to generate insights. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Stores Found</h3>
          <p className="text-gray-500 mb-4">Add a store to view analytics and insights.</p>
          <a
            href="/dashboard/stores"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Stores
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">AI-powered analytics and recommendations for your store</p>
        </div>
        <button
          onClick={handleGenerateInsights}
          disabled={generating || !selectedStore}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {generating ? '🔄 Generating...' : '✨ Generate AI Insights'}
        </button>
      </div>

      {/* Store Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Store</label>
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dashboard Metrics */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="text-sm font-medium opacity-90">Profit Score</div>
            <div className="text-4xl font-bold mt-2">{dashboard.profitScore?.toFixed(0) || 0}</div>
            <div className="text-sm opacity-75 mt-1">out of 100</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm font-medium text-gray-600">Total Insights</div>
            <div className="text-4xl font-bold text-gray-900 mt-2">{dashboard.totalInsights || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Active recommendations</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm font-medium text-gray-600">High Priority</div>
            <div className="text-4xl font-bold text-gray-900 mt-2">
              {insights.filter(i => i.priority === 'HIGH').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">Urgent actions needed</div>
          </div>
        </div>
      )}

      {/* Insights List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {insights.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-500 mb-4">No insights available yet.</div>
              <button
                onClick={handleGenerateInsights}
                disabled={generating}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {generating ? '🔄 Generating...' : '✨ Generate Insights'}
              </button>
            </div>
          ) : (
            insights.map((insight) => (
              <div key={insight.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          insight.priority === 'HIGH'
                            ? 'bg-red-100 text-red-700'
                            : insight.priority === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {insight.priority}
                      </span>
                      <span className="text-xs text-gray-500">{insight.insightType}</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{insight.title}</h3>
                    <p className="text-gray-600 mb-2">{insight.description}</p>
                    
                    {insight.suggestedAction && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-1">💡 Suggested Action</div>
                        <div className="text-sm text-blue-700">{insight.suggestedAction}</div>
                      </div>
                    )}
                    
                    {insight.metrics && Object.keys(insight.metrics).length > 0 && (
                      <div className="mt-3 flex gap-4">
                        {Object.entries(insight.metrics).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="text-gray-500">{key}: </span>
                            <span className="font-medium text-gray-900">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
