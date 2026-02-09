import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import type { PortfolioItem } from '../types'

interface PortfolioResponse {
  success: boolean
  data: PortfolioItem[]
}

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const response = await apiClient.get<PortfolioResponse>('/portfolio')
      return response.data.data
    },
  })
}
