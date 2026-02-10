import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'

export interface ReleaseChange {
  id: string
  field: string
  oldValue: string | null
  newValue: string | null
  detectedAt: string
  sourceUrl?: string
  productName: string
  productId: string
  setName: string
  category: string
}

interface ReleaseChangesResponse {
  success: boolean
  data: ReleaseChange[]
}

export function useReleaseChanges(params: { limit?: number; since?: string } = {}) {
  const { limit = 10, since } = params

  return useQuery({
    queryKey: ['releaseChanges', limit, since],
    queryFn: async () => {
      const response = await apiClient.get<ReleaseChangesResponse>('/releases/changes', {
        params: { limit, since },
      })
      return response.data.data
    },
    staleTime: 1000 * 60 * 2, // 2 min
  })
}
