'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [creatingTest, setCreatingTest] = useState(false)

  const createTestUser = async () => {
    setCreatingTest(true)
    try {
      const response = await authApi.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        tenantName: 'Test Company'
      })
      login(response.data.token, response.data.user)
      toast.success('Test user created and logged in!')
      router.push('/dashboard')
    } catch (error: any) {
      // User might already exist, try to login instead
      try {
        const loginResponse = await authApi.login({
          email: 'test@example.com',
          password: 'password123'
        })
        login(loginResponse.data.token, loginResponse.data.user)
        toast.success('Logged in with test user!')
        router.push('/dashboard')
      } catch (loginError: any) {
        toast.error('Failed to create or login test user')
        alert('Error: ' + (loginError.response?.data?.message || loginError.message))
      }
    } finally {
      setCreatingTest(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authApi.login(formData)
      login(response.data.token, response.data.user)
      toast.success('Logged in successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password'
      toast.error(errorMessage)
      alert(errorMessage) // Also show as alert for visibility
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Watkins AI</h1>
          <p className="text-gray-600">E-commerce Growth Engine</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {loading && (
            <div className="text-sm text-gray-600 text-center">
              Authenticating...
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Test Account:</strong><br />
            Email: test@example.com<br />
            Password: password123
          </p>
          <button
            type="button"
            onClick={createTestUser}
            disabled={creatingTest}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm"
          >
            {creatingTest ? 'Creating...' : '🚀 Create & Login Test User'}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/auth/register" className="text-purple-600 hover:text-purple-700 font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
