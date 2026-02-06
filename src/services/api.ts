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
export const mockApi = {
  get: async <T>(_url: string): Promise<{ data: { success: boolean; data: T } }> => {
    // Return mock data based on URL
    return { data: { success: true, data: [] as T } }
  },
  post: async <T>(_url: string, _data?: unknown): Promise<{ data: { success: boolean; data: T } }> => {
    return { data: { success: true, data: {} as T } }
  },
}

export const apiClient = USE_MOCK_API ? mockApi : api
