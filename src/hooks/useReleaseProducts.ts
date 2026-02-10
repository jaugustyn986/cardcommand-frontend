import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import type { ReleaseProduct, Category } from '../types'

interface ReleaseProductsResponse {
  success: boolean
  data: ReleaseProduct[]
}

export interface UseReleaseProductsParams {
  fromDate?: string
  toDate?: string
  categories?: Category[]
}

function buildReleaseProductsParams(params: UseReleaseProductsParams) {
  const { fromDate, toDate, categories } = params

  return {
    fromDate,
    toDate,
    categories: categories && categories.length > 0 ? categories.join(',') : undefined,
  }
}

export function useReleaseProducts(params: UseReleaseProductsParams = {}) {
  const queryParams = buildReleaseProductsParams(params)

  return useQuery({
    queryKey: ['releaseProducts', queryParams],
    queryFn: async () => {
      const response = await apiClient.get<ReleaseProductsResponse>('/releases/products', {
        params: queryParams,
      })
      return response.data.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

