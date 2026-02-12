import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import type {
  ReleaseProduct,
  Category,
  ReleaseConfidence,
  ReleaseConfidenceBand,
  ReleaseSourceType,
  ReleaseStatus,
} from '../types'

interface ReleaseProductsResponse {
  success: boolean
  data: ReleaseProduct[]
}

export interface UseReleaseProductsParams {
  fromDate?: string
  toDate?: string
  categories?: Category[]
  confidence?: ReleaseConfidence
  confidenceBand?: ReleaseConfidenceBand
  status?: ReleaseStatus
  sourceType?: ReleaseSourceType
}

function buildReleaseProductsParams(params: UseReleaseProductsParams) {
  const { fromDate, toDate, categories, confidence, confidenceBand, status, sourceType } = params

  return {
    fromDate,
    toDate,
    categories: categories && categories.length > 0 ? categories.join(',') : undefined,
    confidence,
    confidenceBand,
    status,
    sourceType,
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

