import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../services/api'

interface SyncResponse {
  success: boolean
  message: string
  data: { pokemon: number; mtg: number }
}

export function useSyncReleases() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<SyncResponse>('/admin/releases/sync')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] })
    },
  })
}
