import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import type { Release, Category } from '../types'

interface ReleasesResponse {
  success: boolean
  data: Release[]
}

export interface UseReleasesParams {
  fromDate?: string
  toDate?: string
  categories?: Category[]
}

function buildReleasesParams(params: UseReleasesParams) {
  const { fromDate, toDate, categories } = params

  return {
    fromDate,
    toDate,
    // API expects comma-separated list for multi-select
    categories: categories && categories.length > 0 ? categories.join(',') : undefined,
  }
}

export function useReleases(params: UseReleasesParams = {}) {
  const queryParams = buildReleasesParams(params)

  return useQuery({
    queryKey: ['releases', queryParams],
    queryFn: async () => {
      const response = await apiClient.get<ReleasesResponse>('/releases', {
        params: queryParams,
      })
      return response.data.data
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  })
}
