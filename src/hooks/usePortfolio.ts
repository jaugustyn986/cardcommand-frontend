import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import type { PortfolioItem } from '../types'

interface PortfolioResponse {
  success: boolean
  data: PortfolioItem[]
}

export function usePortfolio() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: async () => {
      const response = await apiClient.get<PortfolioResponse>('/portfolio')
      return response.data.data
    },
    enabled: !!user,
  })
}
