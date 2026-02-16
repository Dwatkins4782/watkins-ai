'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { toast } from 'sonner';

interface EmailFlow {
  id: string;
  name: string;
  type: string;
  trigger: string;
  isActive: boolean;
  createdAt: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  createdAt: string;
}

export default function EmailPage() {
  const { user } = useAuthStore();
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [flows, setFlows] = useState<EmailFlow[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'flows' | 'campaigns'>('flows');

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (selectedStoreId) {
      loadEmailData();
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

  const loadEmailData = async () => {
    if (!selectedStoreId) return;
    
    setLoading(true);
    try {
      // Load flows
      const flowsData = await api.get(`/email/stores/${selectedStoreId}/flows`);
      setFlows(flowsData);

      // Load campaigns
      const campaignsData = await api.get(`/email/stores/${selectedStoreId}/campaigns`);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Failed to load email data:', error);
      toast.error('Failed to load email data');
    } finally {
      setLoading(false);
    }
  };

  const createFlow = async () => {
    try {
      const flowData = {
        name: 'Welcome Series',
        type: 'WELCOME',
        trigger: 'NEW_SUBSCRIBER',
      };
      await api.post(`/email/stores/${selectedStoreId}/flows`, flowData);
      toast.success('Email flow created');
      loadEmailData();
    } catch (error) {
      console.error('Failed to create flow:', error);
      toast.error('Failed to create email flow');
    }
  };

  const toggleFlow = async (flowId: string, isActive: boolean) => {
    try {
      await api.put(`/email/flows/${flowId}/activate`, { isActive: !isActive });
      toast.success(`Flow ${!isActive ? 'activated' : 'deactivated'}`);
      loadEmailData();
    } catch (error) {
      console.error('Failed to toggle flow:', error);
      toast.error('Failed to update flow');
    }
  };

  const createCampaign = async () => {
    try {
      const campaignData = {
        name: 'New Campaign',
        subject: 'Check out our latest products!',
        template: 'default',
      };
      await api.post(`/email/stores/${selectedStoreId}/campaigns`, campaignData);
      toast.success('Campaign created');
      loadEmailData();
    } catch (error) {
      console.error('Failed to create campaign:', error);
      toast.error('Failed to create campaign');
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
        <p className="text-gray-600">Create a store first to manage email campaigns.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-gray-600 mt-1">Manage automated flows and campaigns</p>
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('flows')}
            className={`${
              activeTab === 'flows'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Automated Flows
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Campaigns
          </button>
        </nav>
      </div>

      {/* Flows Tab */}
      {activeTab === 'flows' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Automated Email Flows</h2>
            <button
              onClick={createFlow}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Create Flow
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading flows...</div>
          ) : flows.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No email flows yet</p>
              <button
                onClick={createFlow}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Your First Flow
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {flows.map((flow) => (
                <div key={flow.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{flow.name}</h3>
                      <p className="text-sm text-gray-600">
                        Type: {flow.type} • Trigger: {flow.trigger}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created {new Date(flow.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          flow.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {flow.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => toggleFlow(flow.id, flow.isActive)}
                        className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        {flow.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Email Campaigns</h2>
            <button
              onClick={createCampaign}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Create Campaign
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No campaigns yet</p>
              <button
                onClick={createCampaign}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Your First Campaign
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        campaign.status === 'SENT'
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'DRAFT'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  {campaign.status === 'SENT' && (
                    <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
                      <div>
                        <p className="text-sm text-gray-600">Sent</p>
                        <p className="text-lg font-semibold">{campaign.sentCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Open Rate</p>
                        <p className="text-lg font-semibold">{campaign.openRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Click Rate</p>
                        <p className="text-lg font-semibold">{campaign.clickRate}%</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
