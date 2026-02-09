import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Set to false to use real API
const USE_MOCK_API = false

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Mock API for development
type MockResponse<T> = { data: { success: boolean; data: T } }

const mockApi = {
  get<T>(_url: string): Promise<MockResponse<T>> {
    return Promise.resolve({ data: { success: true, data: [] as T } })
  },
  post<T>(_url: string, _data?: unknown): Promise<MockResponse<T>> {
    return Promise.resolve({ data: { success: true, data: {} as T } })
  },
}

export const apiClient: typeof api = USE_MOCK_API ? (mockApi as any) : api
