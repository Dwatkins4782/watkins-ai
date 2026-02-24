'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: string;
  amount: number;
  status: string;
  date: string;
  description: string;
  invoiceUrl?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    stores: number;
    products: number;
    analyticsReports: number;
    emailCampaigns: number;
    aiRecommendations: number;
  };
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '1 Store',
      '50 Products',
      'Basic Analytics',
      '5 Email Campaigns/month',
      '10 AI Recommendations/month',
    ],
    limits: {
      stores: 1,
      products: 50,
      analyticsReports: 10,
      emailCampaigns: 5,
      aiRecommendations: 10,
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    features: [
      '3 Stores',
      '500 Products',
      'Advanced Analytics',
      '50 Email Campaigns/month',
      '100 AI Recommendations/month',
      'Priority Support',
    ],
    limits: {
      stores: 3,
      products: 500,
      analyticsReports: 100,
      emailCampaigns: 50,
      aiRecommendations: 100,
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    interval: 'month',
    features: [
      '10 Stores',
      'Unlimited Products',
      'Advanced Analytics + Reports',
      'Unlimited Email Campaigns',
      'Unlimited AI Recommendations',
      'Priority Support',
      'Custom Integrations',
      'DFY Store Builder',
    ],
    limits: {
      stores: 10,
      products: -1,
      analyticsReports: -1,
      emailCampaigns: -1,
      aiRecommendations: -1,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    features: [
      'Unlimited Stores',
      'Unlimited Products',
      'White-label Solution',
      'Dedicated Account Manager',
      'Custom AI Training',
      'API Access',
      '99.9% SLA',
      'Advanced Security',
    ],
    limits: {
      stores: -1,
      products: -1,
      analyticsReports: -1,
      emailCampaigns: -1,
      aiRecommendations: -1,
    },
  },
];

export default function BillingPage() {
  const { user } = useAuthStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    setLoading(true);
    try {
      const subData = await api.getSubscription().catch((err) => {
        console.error('Subscription load error:', err);
        return null;
      });
      
      setSubscription(subData);

      const invoiceData = await api.getInvoices().catch((err: any) => {
        console.error('Invoice load error:', err);
        return [];
      });

      const formattedInvoices = (invoiceData || []).map((inv: any) => ({
        id: inv.id,
        amount: inv.amount / 100,
        status: inv.status,
        date: new Date(inv.created * 1000).toISOString(),
        description: `${inv.plan} Plan - ${inv.number || inv.id}`,
        invoiceUrl: inv.hostedInvoiceUrl || inv.pdfUrl,
      }));

      setInvoices(formattedInvoices);
    } catch (error) {
      console.error('Failed to load billing data:', error);
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;
    
    setProcessing(true);
    try {
      const response = await api.createCheckout(selectedPlan.id);
      
      if (response.url) {
        // Redirect to Stripe checkout
        toast.success('Redirecting to checkout...');
        window.location.href = response.url;
      } else if (response.success) {
        // Development mode - subscription updated directly
        toast.success(response.message || `Successfully upgraded to ${selectedPlan.name} plan`);
        setShowUpgradeModal(false);
        await loadBillingData();
      } else {
        toast.error('Checkout URL not available');
        setShowUpgradeModal(false);
      }
    } catch (error: any) {
      console.error('Failed to upgrade:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to create checkout session';
      toast.error(errorMsg);
      setShowUpgradeModal(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    setProcessing(true);
    try {
      const response = await api.cancelSubscription();
      toast.success(response.message || 'Subscription cancelled successfully');
      setShowCancelModal(false);
      await loadBillingData();
    } catch (error: any) {
      console.error('Failed to cancel subscription:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to cancel subscription';
      toast.error(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription) return PLANS[0];
    return PLANS.find(p => p.id === subscription.plan) || PLANS[0];
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const currentPlan = getCurrentPlan();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and billing information</p>
      </div>

      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">{currentPlan.name}</span>
                {subscription && (
                  <span className={`px-3 py-1 rounded text-sm ${getStatusColor(subscription.status)}`}>
                    {subscription.status}
                  </span>
                )}
              </div>
              <p className="text-2xl text-gray-600 mt-2">
                ${currentPlan.price}
                <span className="text-lg text-gray-500">/{currentPlan.interval}</span>
              </p>
            </div>
          </div>
          
          {subscription && subscription.status === 'active' && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Current period</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
              {subscription.cancelAtPeriodEnd && (
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ Cancels on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Plan Features</h3>
          <ul className="space-y-2">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="text-green-600 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {subscription && !subscription.cancelAtPeriodEnd && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg p-6 ${
                currentPlan.id === plan.id ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <span className="text-green-600 mr-2 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {currentPlan.id === plan.id ? (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {plan.price > currentPlan.price ? 'Upgrade' : 'Downgrade'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
        </div>
        
        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No invoices yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {invoice.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {invoice.invoiceUrl ? (
                        <a
                          href={invoice.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Confirm Plan Change</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                You are about to {selectedPlan.price > currentPlan.price ? 'upgrade' : 'downgrade'} to the{' '}
                <strong>{selectedPlan.name}</strong> plan.
              </p>
              
              <div className="bg-gray-50 rounded p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Current Plan:</span>
                  <span className="font-semibold">{currentPlan.name} (${currentPlan.price}/{currentPlan.interval})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">New Plan:</span>
                  <span className="font-semibold text-blue-600">{selectedPlan.name} (${selectedPlan.price}/{selectedPlan.interval})</span>
                </div>
              </div>

              {selectedPlan.price > currentPlan.price && (
                <p className="text-sm text-gray-600 mb-4">
                  You will be charged a prorated amount for the remainder of the current billing period.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpgrade}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-red-600">Cancel Subscription</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to cancel your subscription? Your plan will remain active until the end of the current billing period.
              </p>
              
              {subscription && (
                <p className="text-sm text-gray-600 mb-4">
                  Your subscription will end on{' '}
                  <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</strong>.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
