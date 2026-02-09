import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import type { Deal } from '../types'

interface DealsResponse {
  success: boolean
  data: Deal[]
  pagination: {
    page: number
    perPage: number
    totalCount: number
    totalPages: number
  }
}

export function useDeals() {
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const response = await apiClient.get<DealsResponse>('/deals')
      return response.data.data
    },
  })
}
