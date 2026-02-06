import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import type { Release } from '../types'

interface ReleasesResponse {
  success: boolean
  data: Release[]
}

export function useReleases() {
  return useQuery({
    queryKey: ['releases'],
    queryFn: async () => {
      const response = await api.get<ReleasesResponse>('/releases')
      return response.data.data
    },
  })
}
