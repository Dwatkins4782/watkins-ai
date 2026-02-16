import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName?: string
  role: string
  tenant: any
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        localStorage.setItem('token', token)
        set({ token, user, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('token')
        set({ token: null, user: null, isAuthenticated: false })
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // After rehydration, check if there's a token in localStorage
        if (state && state.token) {
          state.isAuthenticated = true
        }
      },
    }
  )
)
