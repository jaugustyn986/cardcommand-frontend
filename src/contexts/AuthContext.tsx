import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { apiClient } from '../services/api'

interface User {
  id: string
  email: string
  name?: string
  plan: 'free' | 'premium' | 'pro'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      const { user, token } = response.data.data
      localStorage.setItem('token', token)
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name?: string) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post('/auth/register', { email, password, name })
      const { user, token } = response.data.data
      localStorage.setItem('token', token)
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
