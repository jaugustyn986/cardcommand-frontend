import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import type { Deal } from '../types'

interface DealsResponse {
  success: boolean
  data: Deal[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export function useDeals() {
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const response = await api.get<DealsResponse>('/deals')
      return response.data.data
    },
  })
}
