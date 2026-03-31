'use client';

import { useState, useEffect } from 'react';
import api, { smsApi } from '@/lib/api';
import { toast } from 'sonner';

interface SmsFlow {
  id: string;
  name: string;
  flowType: string;
  status: string;
  message?: string;
  sentCount: number;
  clickRate?: number;
  conversionRate?: number;
  createdAt: string;
}

export default function SmsPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [flows, setFlows] = useState<SmsFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFlow, setNewFlow] = useState({
    name: '',
    flowType: 'WELCOME',
    message: '',
    aiGenerated: false,
  });

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (selectedStoreId) loadFlows();
  }, [selectedStoreId]);

  const loadStores = async () => {
    try {
      const data = await api.getStores();
      setStores(data);
      if (data.length > 0) setSelectedStoreId(data[0].id);
    } catch {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const loadFlows = async () => {
    setLoading(true);
    try {
      const data = await api.getSmsFlows(selectedStoreId);
      setFlows(data);
    } catch {
      toast.error('Failed to load SMS flows');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await smsApi.createFlow(selectedStoreId, newFlow);
      toast.success('SMS flow created');
      setShowCreateModal(false);
      setNewFlow({ name: '', flowType: 'WELCOME', message: '', aiGenerated: false });
      loadFlows();
    } catch {
      toast.error('Failed to create SMS flow');
    }
  };

  const handleActivate = async (flowId: string) => {
    try {
      await smsApi.activateFlow(flowId);
      toast.success('Flow activated');
      loadFlows();
    } catch {
      toast.error('Failed to activate flow');
    }
  };

  const handlePause = async (flowId: string) => {
    try {
      await smsApi.pauseFlow(flowId);
      toast.success('Flow paused');
      loadFlows();
    } catch {
      toast.error('Failed to pause flow');
    }
  };

  const handleDelete = async (flowId: string) => {
    if (!confirm('Delete this SMS flow?')) return;
    try {
      await smsApi.deleteFlow(flowId);
      toast.success('Flow deleted');
      loadFlows();
    } catch {
      toast.error('Failed to delete flow');
    }
  };

  if (loading && stores.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Stores Found</h2>
        <p className="text-gray-600">Create a store first to manage SMS flows.</p>
      </div>
    );
  }

  const flowTypes = [
    'WELCOME', 'ABANDONED_CART', 'ORDER_CONFIRMATION', 'SHIPPING_UPDATE',
    'REVIEW_REQUEST', 'WINBACK', 'PROMOTIONAL', 'BIRTHDAY',
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SMS Marketing</h1>
          <p className="text-gray-600 mt-1">Manage automated SMS flows powered by AI</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Create Flow
        </button>
      </div>

      {/* Store Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Store</label>
        <select
          value={selectedStoreId}
          onChange={(e) => setSelectedStoreId(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>
      </div>

      {/* Flows */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading flows...</div>
      ) : flows.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No SMS flows yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Create Your First SMS Flow
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {flows.map((flow) => (
            <div key={flow.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{flow.name}</h3>
                  <p className="text-sm text-gray-600">Type: {flow.flowType}</p>
                  {flow.message && (
                    <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-3 rounded-lg italic">
                      &ldquo;{flow.message.slice(0, 160)}{flow.message.length > 160 ? '...' : ''}&rdquo;
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Created {new Date(flow.createdAt).toLocaleDateString()}
                  </p>

                  {flow.sentCount > 0 && (
                    <div className="mt-3 flex gap-6 text-sm">
                      <span className="text-gray-600">Sent: <strong>{flow.sentCount}</strong></span>
                      {flow.clickRate != null && <span className="text-gray-600">Click: <strong>{flow.clickRate}%</strong></span>}
                      {flow.conversionRate != null && <span className="text-gray-600">Conv: <strong>{flow.conversionRate}%</strong></span>}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    flow.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    flow.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {flow.status}
                  </span>
                  {flow.status === 'ACTIVE' ? (
                    <button onClick={() => handlePause(flow.id)} className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Pause
                    </button>
                  ) : (
                    <button onClick={() => handleActivate(flow.id)} className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Activate
                    </button>
                  )}
                  <button onClick={() => handleDelete(flow.id)} className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create SMS Flow</h2>
            <form onSubmit={handleCreateFlow} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flow Name</label>
                <input
                  type="text"
                  value={newFlow.name}
                  onChange={(e) => setNewFlow({ ...newFlow, name: e.target.value })}
                  required
                  placeholder="e.g., Welcome SMS"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flow Type</label>
                <select
                  value={newFlow.flowType}
                  onChange={(e) => setNewFlow({ ...newFlow, flowType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {flowTypes.map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                <textarea
                  value={newFlow.message}
                  onChange={(e) => setNewFlow({ ...newFlow, message: e.target.value })}
                  maxLength={160}
                  rows={3}
                  placeholder="Leave blank to auto-generate with AI"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">{newFlow.message.length}/160 characters</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="aiGenerated"
                  checked={newFlow.aiGenerated}
                  onChange={(e) => setNewFlow({ ...newFlow, aiGenerated: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="aiGenerated" className="text-sm text-gray-700">Generate message with AI</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Create
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
