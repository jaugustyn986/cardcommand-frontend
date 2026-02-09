import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import type { TrendingItem } from '../types'

interface TrendingResponse {
  success: boolean
  data: TrendingItem[]
}

export function useTrending() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: async () => {
      const response = await apiClient.get<TrendingResponse>('/trending')
      return response.data.data
    },
  })
}
