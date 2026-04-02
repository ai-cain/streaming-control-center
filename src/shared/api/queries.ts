import { useQuery } from '@tanstack/react-query'
import {
  fetchRecorderHealth,
  fetchRecordingStatus,
} from './recorder-api'

export function useRecorderHealthQuery(apiBase: string, pollingMs: number) {
  return useQuery({
    queryKey: ['recorder', 'health', apiBase],
    enabled: Boolean(apiBase),
    queryFn: () => fetchRecorderHealth(apiBase),
    refetchInterval: pollingMs,
    staleTime: Math.max(1000, pollingMs / 2),
  })
}

export function useRecordingStatusQuery(apiBase: string, pollingMs: number) {
  return useQuery({
    queryKey: ['recorder', 'status', apiBase],
    enabled: Boolean(apiBase),
    queryFn: () => fetchRecordingStatus(apiBase),
    refetchInterval: pollingMs,
    staleTime: Math.max(1000, pollingMs / 2),
  })
}
