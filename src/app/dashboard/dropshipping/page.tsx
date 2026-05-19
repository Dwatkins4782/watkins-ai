'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { DropshipSupplier as Supplier } from '@/types/api';

type Connection = {
  id: string;
  supplierId: string;
  supplier?: Supplier;
  status: string;
  setupType: string;
  productsImported: number;
  ordersProcessed: number;
  createdAt: string;
};

export default function DropshippingPage() {
  const [tab, setTab] = useState<'suppliers' | 'connections'>('suppliers');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [connectModal, setConnectModal] = useState<Supplier | null>(null);
  const [connectForm, setConnectForm] = useState({
    setupType: 'DIY' as 'DIY' | 'ASSISTED' | 'FULL_AUTO',
    apiKey: '',
    apiSecret: '',
    autoImportProducts: true,
    autoFulfillOrders: true,
    markupType: 'PERCENTAGE',
    markupValue: 30,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [suppliersData] = await Promise.all([
        api.getSuppliers(),
      ]);
      setSuppliers(suppliersData || []);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectModal) return;
    try {
      await api.connectSupplier('default', {
        supplierId: connectModal.slug,
        ...connectForm,
      });
      setConnectModal(null);
      alert(`Connected to ${connectModal.name}! Setting up integration...`);
      loadData();
    } catch (error: any) {
      alert('Failed to connect: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredSuppliers = categoryFilter
    ? suppliers.filter(s => s.categories?.includes(categoryFilter))
    : suppliers;

  const categories = [...new Set(suppliers.flatMap(s => s.categories || []))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dropshipping hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dropshipping Hub</h1>
        <p className="text-gray-600 mt-2">
          Connect to vetted suppliers, auto-import products, and automate fulfillment.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Available Suppliers', value: suppliers.length, color: 'purple' },
          { label: 'Active Connections', value: connections.filter(c => c.status === 'ACTIVE').length, color: 'green' },
          { label: 'Products Imported', value: connections.reduce((a, c) => a + (c.productsImported || 0), 0), color: 'blue' },
          { label: 'Orders Processed', value: connections.reduce((a, c) => a + (c.ordersProcessed || 0), 0), color: 'orange' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {(['suppliers', 'connections'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-1 font-medium capitalize transition ${
              tab === t
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'suppliers' ? `Suppliers (${suppliers.length})` : `My Connections (${connections.length})`}
          </button>
        ))}
      </div>

      {/* Suppliers Tab */}
      {tab === 'suppliers' && (
        <>
          {/* Category filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setCategoryFilter('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                !categoryFilter ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                  categoryFilter === cat ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Supplier Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.slug}
                className={`bg-white rounded-xl border p-6 hover:shadow-lg transition ${
                  supplier.featured ? 'border-purple-300 ring-1 ring-purple-100' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{supplier.name}</h3>
                      {supplier.featured && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{supplier.description}</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Products</p>
                    <p className="font-bold text-gray-900">{(supplier.productCount ?? 0) >= 1000 ? `${((supplier.productCount ?? 0) / 1000).toFixed(0)}K` : (supplier.productCount ?? '—')}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="font-bold text-gray-900">⭐ {supplier.avgRating}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Shipping</p>
                    <p className="font-bold text-gray-900">{supplier.avgShippingDays}d</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Cost</p>
                    <p className="font-bold text-gray-900">{(supplier.monthlyFee ?? 0) > 0 ? `$${supplier.monthlyFee}/mo` : 'Free'}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {supplier.autoFulfillment && <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">Auto-Fulfill</span>}
                  {supplier.inventorySync && <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Inventory Sync</span>}
                  {supplier.regions?.map(r => (
                    <span key={r} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{r}</span>
                  ))}
                </div>

                {/* Pros */}
                <div className="mb-4">
                  <ul className="space-y-1">
                    {supplier.pros?.slice(0, 3).map((pro, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setConnectModal(supplier)}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Connect Supplier
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Connections Tab */}
      {tab === 'connections' && (
        <div>
          {connections.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <p className="text-5xl mb-4">🔗</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Connections Yet</h3>
              <p className="text-gray-600 mb-6">Connect a supplier from the Suppliers tab to start importing products.</p>
              <button
                onClick={() => setTab('suppliers')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Browse Suppliers
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {connections.map((conn) => (
                <div key={conn.id} className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{conn.supplier?.name || conn.supplierId}</h3>
                    <p className="text-sm text-gray-500">
                      Setup: {conn.setupType} · Products: {conn.productsImported} · Orders: {conn.ordersProcessed}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    conn.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    conn.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {conn.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connect Modal */}
      {connectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect to {connectModal.name}</h2>
            <p className="text-gray-600 mb-6">Choose your setup type and configure integration settings.</p>

            <form onSubmit={handleConnect} className="space-y-5">
              {/* Setup Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Setup Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: 'DIY', label: 'DIY', desc: 'Self-setup', price: 'Free' },
                    { value: 'ASSISTED', label: 'Assisted', desc: 'We help', price: '$49' },
                    { value: 'FULL_AUTO', label: 'Full Auto', desc: 'We do it all', price: '$199' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setConnectForm(f => ({ ...f, setupType: opt.value }))}
                      className={`p-3 rounded-xl border-2 text-center transition ${
                        connectForm.setupType === opt.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                      <p className="text-xs font-medium text-purple-600 mt-1">{opt.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Markup */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Markup (%)</label>
                <input
                  type="number"
                  value={connectForm.markupValue}
                  onChange={(e) => setConnectForm(f => ({ ...f, markupValue: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min={0}
                  max={500}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {[
                  { key: 'autoImportProducts' as const, label: 'Auto-import new products' },
                  { key: 'autoFulfillOrders' as const, label: 'Auto-fulfill orders' },
                ].map((toggle) => (
                  <label key={toggle.key} className="flex items-center gap-3 cursor-pointer">
                    <div
                      className={`w-10 h-6 rounded-full transition-colors ${
                        connectForm[toggle.key] ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setConnectForm(f => ({ ...f, [toggle.key]: !f[toggle.key] }))}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                          connectForm[toggle.key] ? 'translate-x-[18px]' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-gray-700">{toggle.label}</span>
                  </label>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setConnectModal(null)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
