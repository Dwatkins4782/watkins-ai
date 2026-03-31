'use client'

import { useState, useEffect } from 'react'
import api, { dropshippingApi, storeApi } from '@/lib/api'
import { toast } from 'sonner'
import {
  Truck, Star, Globe, Zap, Package, ArrowRight, CheckCircle2,
  ExternalLink, Loader2, Plug, Settings, RefreshCw, Pause, XCircle,
  Sparkles, Crown, Shield
} from 'lucide-react'

interface Supplier {
  id: string
  name: string
  slug: string
  website: string
  categories: string[]
  niches: string[]
  regions: string[]
  avgShippingDays: number
  avgRating: number
  productCount: number
  autoFulfillment: boolean
  inventorySync: boolean
  priceSync: boolean
  trackingSync: boolean
  monthlyFee: number
  transactionFee: number
  description: string
  pros: string[]
  cons: string[]
  featured: boolean
}

interface Connection {
  id: string
  storeId: string
  supplierId: string
  status: string
  setupType: string
  productsImported: number
  ordersFulfilled: number
  totalRevenue: number
  supplier: Supplier
  connectedAt: string
  createdAt: string
}

interface Recommendation {
  slug: string
  matchScore: number
  reason: string
  suggestedNiche: string
  recommendedSetupType: string
  supplier: Supplier
}

interface Store {
  id: string
  name: string
  url: string
  platform: string
}

const SETUP_PACKAGES = {
  DIY: {
    name: 'DIY Setup',
    price: 0,
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    description: 'Connect and configure suppliers yourself with our step-by-step guides',
    features: [
      'AI-matched supplier recommendations',
      'Step-by-step connection guides',
      'API key setup documentation',
      'Community support',
    ],
  },
  ASSISTED: {
    name: 'Assisted Setup',
    price: 199,
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Our team helps configure your supplier connections with guided onboarding',
    features: [
      'Everything in DIY',
      '1-on-1 onboarding call',
      'Supplier account setup help',
      'Product import assistance (up to 100 products)',
      'Markup strategy consultation',
      'Email support for 30 days',
    ],
  },
  FULL_AUTO: {
    name: 'Full Auto Setup',
    price: 499,
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    popular: true,
    description: 'We handle everything — supplier selection, product curation, pricing, and launch',
    features: [
      'Everything in Assisted',
      'AI-driven supplier matching for your niche',
      'Full product catalog import (up to 500 products)',
      'Automated pricing & markup rules',
      'Inventory sync configuration',
      'Auto-fulfillment setup',
      'Priority support for 90 days',
      'Monthly supplier performance review (3 months)',
    ],
  },
}

type SetupType = keyof typeof SETUP_PACKAGES

export default function DropshippingPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRecs, setLoadingRecs] = useState(false)
  const [activeTab, setActiveTab] = useState<'recommended' | 'suppliers' | 'connections'>('recommended')
  const [connectModal, setConnectModal] = useState<{ supplier: Supplier; setupType: SetupType } | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [markupType, setMarkupType] = useState('percentage')
  const [markupValue, setMarkupValue] = useState(30)
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    loadStores()
  }, [])

  useEffect(() => {
    if (selectedStore) {
      loadConnections()
      loadRecommendations()
    }
  }, [selectedStore])

  useEffect(() => {
    loadSuppliers()
  }, [categoryFilter])

  const loadStores = async () => {
    try {
      const data = await api.getStores()
      setStores(data || [])
      if (data?.length > 0) setSelectedStore(data[0].id)
    } catch {
      toast.error('Failed to load stores')
    } finally {
      setLoading(false)
    }
  }

  const loadSuppliers = async () => {
    try {
      const params: any = {}
      if (categoryFilter) params.category = categoryFilter
      const res = await dropshippingApi.getSuppliers(params)
      setSuppliers(res.data || [])
    } catch {
      // Suppliers might not be seeded yet
      setSuppliers([])
    }
  }

  const loadConnections = async () => {
    if (!selectedStore) return
    try {
      const res = await dropshippingApi.getConnections(selectedStore)
      setConnections(res.data || [])
    } catch {
      setConnections([])
    }
  }

  const loadRecommendations = async () => {
    if (!selectedStore) return
    setLoadingRecs(true)
    try {
      const res = await dropshippingApi.getRecommendations(selectedStore)
      setRecommendations(res.data?.recommendations || [])
    } catch {
      setRecommendations([])
    } finally {
      setLoadingRecs(false)
    }
  }

  const handleConnect = async () => {
    if (!connectModal || !selectedStore) return
    setConnecting(true)
    try {
      await dropshippingApi.connectSupplier(selectedStore, {
        supplierId: connectModal.supplier.id,
        setupType: connectModal.setupType,
        markupType,
        markupValue,
        autoImportProducts: connectModal.setupType === 'FULL_AUTO',
        autoFulfillOrders: connectModal.setupType === 'FULL_AUTO',
      })
      toast.success(`Connected to ${connectModal.supplier.name}!`)
      setConnectModal(null)
      loadConnections()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to connect')
    } finally {
      setConnecting(false)
    }
  }

  const handleConnectionAction = async (connectionId: string, action: 'activate' | 'pause' | 'disconnect') => {
    try {
      if (action === 'activate') await dropshippingApi.activateConnection(connectionId)
      else if (action === 'pause') await dropshippingApi.pauseConnection(connectionId)
      else await dropshippingApi.disconnectConnection(connectionId)
      toast.success(`Connection ${action}d`)
      loadConnections()
    } catch {
      toast.error(`Failed to ${action} connection`)
    }
  }

  const seedSuppliers = async () => {
    try {
      await dropshippingApi.seedSuppliers()
      toast.success('Supplier catalog loaded!')
      loadSuppliers()
      if (selectedStore) loadRecommendations()
    } catch {
      toast.error('Failed to seed suppliers')
    }
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONNECTING: 'bg-blue-100 text-blue-700',
      PAUSED: 'bg-gray-100 text-gray-600',
      FAILED: 'bg-red-100 text-red-700',
      DISCONNECTED: 'bg-red-50 text-red-500',
    }
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-20">
        <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Add a Store First</h2>
        <p className="text-gray-600 mb-6">Connect your e-commerce store to start integrating dropship suppliers.</p>
        <a href="/dashboard/stores" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
          Go to Stores <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    )
  }

  const CATEGORIES = ['fashion', 'electronics', 'home', 'beauty', 'health', 'sports', 'toys', 'accessories']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-7 h-7 text-purple-600" />
            Dropshipping
          </h1>
          <p className="text-gray-600 mt-1">Connect your store with top dropshipping suppliers — AI-matched to your niche</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            {stores.map((store) => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      {connections.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase">Active Suppliers</p>
            <p className="text-2xl font-bold text-gray-900">{connections.filter(c => c.status === 'ACTIVE').length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase">Products Imported</p>
            <p className="text-2xl font-bold text-gray-900">{connections.reduce((sum, c) => sum + c.productsImported, 0)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase">Orders Fulfilled</p>
            <p className="text-2xl font-bold text-gray-900">{connections.reduce((sum, c) => sum + c.ordersFulfilled, 0)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase">Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${connections.reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(['recommended', 'suppliers', 'connections'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab ? 'bg-white shadow text-purple-600' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab === 'recommended' ? 'AI Recommended' : tab === 'suppliers' ? 'All Suppliers' : `Connections (${connections.length})`}
          </button>
        ))}
      </div>

      {/* AI Recommended Tab */}
      {activeTab === 'recommended' && (
        <div className="space-y-6">
          {suppliers.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
              <Package className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h3 className="font-semibold text-amber-800 mb-1">Supplier Catalog Not Loaded</h3>
              <p className="text-sm text-amber-700 mb-4">Load the supplier catalog to get AI-powered recommendations.</p>
              <button onClick={seedSuppliers} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition">
                Load Supplier Catalog
              </button>
            </div>
          )}

          {loadingRecs ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Sparkles className="w-10 h-10 text-purple-500 mx-auto mb-3 animate-pulse" />
                <p className="text-gray-600">AI is analyzing your store and matching suppliers...</p>
              </div>
            </div>
          ) : recommendations.length > 0 ? (
            <>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-700">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  AI analyzed your store&apos;s products, niche, and audience to find the best supplier matches.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.map((rec, i) => (
                  <div key={rec.slug} className={`bg-white rounded-lg border ${i === 0 ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-200'} p-6`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          {i === 0 && <Crown className="w-4 h-4 text-purple-500" />}
                          <h3 className="font-semibold text-gray-900">{rec.supplier?.name}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{rec.suggestedNiche}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{rec.matchScore}%</div>
                        <p className="text-xs text-gray-500">match</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" /> {rec.supplier?.avgRating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" /> {rec.supplier?.avgShippingDays}d shipping
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" /> {rec.supplier?.productCount?.toLocaleString()} products
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => rec.supplier && setConnectModal({
                          supplier: rec.supplier,
                          setupType: rec.recommendedSetupType as SetupType
                        })}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition flex items-center justify-center gap-1"
                      >
                        <Plug className="w-4 h-4" /> Connect ({rec.recommendedSetupType.replace('_', ' ')})
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Setup Packages */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Packages</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {(Object.entries(SETUP_PACKAGES) as [SetupType, typeof SETUP_PACKAGES[SetupType]][]).map(([key, pkg]) => {
                    const Icon = pkg.icon
                    return (
                      <div key={key} className={`rounded-lg border ${pkg.borderColor} ${pkg.bgColor} p-6 relative`}>
                        {'popular' in pkg && pkg.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">Recommended</span>
                          </div>
                        )}
                        <Icon className={`w-6 h-6 ${pkg.color} mb-3`} />
                        <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                        <div className="mt-2 mb-3">
                          <span className="text-2xl font-bold">${pkg.price}</span>
                          {pkg.price > 0 && <span className="text-sm text-gray-500"> one-time</span>}
                          {pkg.price === 0 && <span className="text-sm text-gray-500"> free</span>}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                        <ul className="space-y-2">
                          {pkg.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          ) : suppliers.length > 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No recommendations yet. Add products to your store for AI matching.</p>
              <button onClick={loadRecommendations} className="mt-4 text-purple-600 hover:text-purple-700 text-sm font-medium">
                Try Again
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* All Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          {suppliers.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 mb-2">No Suppliers Loaded</h3>
              <p className="text-sm text-gray-500 mb-4">Load the curated supplier catalog to browse available dropshipping partners.</p>
              <button onClick={seedSuppliers} className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-purple-700 transition">
                Load Supplier Catalog
              </button>
            </div>
          ) : (
            <>
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setCategoryFilter('')}
                  className={`px-3 py-1.5 rounded-full text-sm ${!categoryFilter ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm capitalize ${categoryFilter === cat ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Supplier Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className={`bg-white rounded-lg border ${supplier.featured ? 'border-purple-200' : 'border-gray-200'} p-5`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                          {supplier.featured && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">Featured</span>}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-sm text-gray-600">{supplier.avgRating}</span>
                        </div>
                      </div>
                      {supplier.monthlyFee === 0 ? (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Free</span>
                      ) : (
                        <span className="text-xs text-gray-500">${supplier.monthlyFee}/mo</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{supplier.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {supplier.regions.map((r) => (
                        <span key={r} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{r}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                      <span><Truck className="w-3 h-3 inline mr-1" />{supplier.avgShippingDays}d avg</span>
                      <span><Package className="w-3 h-3 inline mr-1" />{supplier.productCount?.toLocaleString()}</span>
                      <span>{supplier.autoFulfillment ? '✓ Auto-fulfill' : '✗ Manual'}</span>
                      <span>{supplier.inventorySync ? '✓ Inv sync' : '✗ No sync'}</span>
                    </div>
                    <button
                      onClick={() => setConnectModal({ supplier, setupType: 'DIY' })}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition flex items-center justify-center gap-1"
                    >
                      <Plug className="w-4 h-4" /> Connect
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="space-y-4">
          {connections.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Plug className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 mb-2">No Connections Yet</h3>
              <p className="text-sm text-gray-500 mb-4">Connect a dropshipping supplier to get started.</p>
              <button onClick={() => setActiveTab('recommended')} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View Recommendations →
              </button>
            </div>
          ) : (
            connections.map((conn) => (
              <div key={conn.id} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{conn.supplier.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {statusBadge(conn.status)}
                        <span className="text-xs text-gray-500">
                          {conn.setupType.replace('_', ' ')} setup
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {conn.status === 'PENDING' && (
                      <button
                        onClick={() => handleConnectionAction(conn.id, 'activate')}
                        className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition"
                        title="Activate"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                    {conn.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleConnectionAction(conn.id, 'pause')}
                        className="text-yellow-600 hover:text-yellow-700 p-2 rounded-lg hover:bg-yellow-50 transition"
                        title="Pause"
                      >
                        <Pause className="w-5 h-5" />
                      </button>
                    )}
                    {conn.status === 'PAUSED' && (
                      <button
                        onClick={() => handleConnectionAction(conn.id, 'activate')}
                        className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition"
                        title="Resume"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    )}
                    {conn.status !== 'DISCONNECTED' && (
                      <button
                        onClick={() => handleConnectionAction(conn.id, 'disconnect')}
                        className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                        title="Disconnect"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Products</p>
                    <p className="font-semibold">{conn.productsImported}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Orders Fulfilled</p>
                    <p className="font-semibold">{conn.ordersFulfilled}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="font-semibold">${conn.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Connect Modal */}
      {connectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Connect to {connectModal.supplier.name}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Choose a setup package and configure your connection.
            </p>

            {/* Setup Type Selector */}
            <div className="space-y-2 mb-5">
              <label className="block text-sm font-medium text-gray-700">Setup Package</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(SETUP_PACKAGES) as [SetupType, typeof SETUP_PACKAGES[SetupType]][]).map(([key, pkg]) => (
                  <button
                    key={key}
                    onClick={() => setConnectModal({ ...connectModal, setupType: key })}
                    className={`p-3 rounded-lg border text-center transition ${
                      connectModal.setupType === key
                        ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-medium">{pkg.name}</p>
                    <p className="text-lg font-bold mt-1">${pkg.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Markup Config */}
            <div className="space-y-3 mb-5">
              <label className="block text-sm font-medium text-gray-700">Product Markup</label>
              <div className="flex gap-3">
                <select
                  value={markupType}
                  onChange={(e) => setMarkupType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
                <input
                  type="number"
                  value={markupValue}
                  onChange={(e) => setMarkupValue(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
                  min={0}
                  max={markupType === 'percentage' ? 500 : 10000}
                />
              </div>
              <p className="text-xs text-gray-500">
                {markupType === 'percentage'
                  ? `Products will be priced ${markupValue}% above supplier cost`
                  : `$${markupValue} added to each product's supplier cost`}
              </p>
            </div>

            {/* Package Features */}
            <div className="bg-gray-50 rounded-lg p-4 mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {SETUP_PACKAGES[connectModal.setupType].name} includes:
              </p>
              <ul className="space-y-1.5">
                {SETUP_PACKAGES[connectModal.setupType].features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setConnectModal(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                ) : (
                  <>
                    <Plug className="w-4 h-4" />
                    Connect{SETUP_PACKAGES[connectModal.setupType].price > 0 && ` — $${SETUP_PACKAGES[connectModal.setupType].price}`}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
