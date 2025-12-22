'use client'

import { useQuery } from '@tanstack/react-query'
import { storeApi, analyticsApi } from '@/lib/api'
import { 
  Store, TrendingUp, ShoppingCart, Users, 
  Sparkles, Mail, MessageSquare, Target 
} from 'lucide-react'

export default function DashboardPage() {
  const { data: stores } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storeApi.list().then(res => res.data),
  })

  const activeStore = stores?.[0]

  const { data: analytics } = useQuery({
    queryKey: ['analytics', activeStore?.id],
    queryFn: () => analyticsApi.getDashboard(activeStore!.id).then(res => res.data),
    enabled: !!activeStore,
  })

  const stats = [
    {
      name: 'Profit Score',
      value: analytics?.profitScore?.toFixed(0) || '0',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      name: 'Active Stores',
      value: stores?.length || 0,
      icon: Store,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      name: 'Total Revenue',
      value: `$${(analytics?.last30Days?.revenue || 0).toFixed(0)}`,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      name: 'AI Insights',
      value: analytics?.totalInsights || 0,
      icon: Sparkles,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
  ]

  const quickActions = [
    {
      name: 'Generate Email Flow',
      description: 'Create AI-powered email campaigns',
      icon: Mail,
      href: '/dashboard/email',
      color: 'bg-purple-600',
    },
    {
      name: 'Analyze Store',
      description: 'Get AI insights and recommendations',
      icon: Target,
      href: '/dashboard/analytics',
      color: 'bg-blue-600',
    },
    {
      name: 'Support AI',
      description: 'Handle customer inquiries with AI',
      icon: MessageSquare,
      href: '/dashboard/support',
      color: 'bg-green-600',
    },
    {
      name: 'DFY Builder',
      description: 'Build a complete store with AI',
      icon: Sparkles,
      href: '/dashboard/dfy',
      color: 'bg-yellow-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your stores.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition group"
            >
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition">
                {action.name}
              </h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Insights */}
      {analytics?.insights && analytics.insights.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent AI Insights</h2>
          <div className="bg-white rounded-lg shadow divide-y">
            {analytics.insights.slice(0, 5).map((insight: any) => (
              <div key={insight.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <p className="text-gray-600 mt-1">{insight.description}</p>
                    {insight.suggestedAction && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">
                          <strong>Action:</strong> {insight.suggestedAction}
                        </p>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    insight.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                    insight.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
