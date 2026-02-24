'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  impact: string;
  effort: string;
  status: string;
  metadata: any;
  createdAt: string;
  implementedAt?: string;
}

export default function RecommendationsPage() {
  const { user } = useAuthStore();
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (selectedStoreId) {
      loadRecommendations();
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

  const loadRecommendations = async () => {
    if (!selectedStoreId) return;
    
    setLoading(true);
    try {
      const data = await api.getRecommendations(selectedStoreId);
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (!selectedStoreId) return;
    
    setGenerating(true);
    try {
      await api.generateRecommendations(selectedStoreId);
      toast.success('Recommendations generated successfully');
      loadRecommendations();
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH':
        return 'bg-purple-100 text-purple-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      case 'LOW':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'IMPLEMENTED':
        return 'bg-green-100 text-green-800';
      case 'DISMISSED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SEO':
        return '🔍';
      case 'CONVERSION':
        return '📈';
      case 'PRODUCT':
        return '🛍️';
      case 'CONTENT':
        return '📝';
      case 'PRICING':
        return '💰';
      case 'MARKETING':
        return '📢';
      default:
        return '💡';
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
        <p className="text-gray-600">Create a store first to get AI recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Recommendations</h1>
          <p className="text-gray-600 mt-1">Get actionable insights to improve your store</p>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={generating}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? 'Generating...' : '✨ Generate Recommendations'}
        </button>
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
      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-gray-900">{recommendations.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">High Priority</p>
            <p className="text-3xl font-bold text-red-600">
              {recommendations.filter(r => r.priority === 'HIGH').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Implemented</p>
            <p className="text-3xl font-bold text-green-600">
              {recommendations.filter(r => r.status === 'IMPLEMENTED').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-gray-600">
              {recommendations.filter(r => r.status === 'PENDING').length}
            </p>
          </div>
        </div>
      )}

      {/* Recommendations List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recommendations</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No recommendations yet</p>
            <button
              onClick={generateRecommendations}
              disabled={generating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {generating ? 'Generating...' : '✨ Generate Your First Recommendations'}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedRecommendation(rec)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{getTypeIcon(rec.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {rec.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rec.status)}`}>
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{rec.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {rec.type}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(rec.priority)}`}>
                        Priority: {rec.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${getImpactColor(rec.impact)}`}>
                        Impact: {rec.impact}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${getEffortColor(rec.effort)}`}>
                        Effort: {rec.effort}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendation Detail Modal */}
      {selectedRecommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recommendation Details</h2>
              <button
                onClick={() => setSelectedRecommendation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{getTypeIcon(selectedRecommendation.type)}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{selectedRecommendation.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                      {selectedRecommendation.type}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded ${getPriorityColor(selectedRecommendation.priority)}`}>
                      Priority: {selectedRecommendation.priority}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded ${getImpactColor(selectedRecommendation.impact)}`}>
                      Impact: {selectedRecommendation.impact}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded ${getEffortColor(selectedRecommendation.effort)}`}>
                      Effort: {selectedRecommendation.effort}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded ${getStatusColor(selectedRecommendation.status)}`}>
                      {selectedRecommendation.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedRecommendation.description}</p>
              </div>

              {selectedRecommendation.metadata && Object.keys(selectedRecommendation.metadata).length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Additional Details</h4>
                  <div className="bg-gray-50 rounded p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedRecommendation.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 text-sm text-gray-500">
                <p>Created: {new Date(selectedRecommendation.createdAt).toLocaleString()}</p>
                {selectedRecommendation.implementedAt && (
                  <p>Implemented: {new Date(selectedRecommendation.implementedAt).toLocaleString()}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedRecommendation(null)}
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
