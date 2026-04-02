import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ConfigProvider } from '../features/config/config-context'
import { UiPreferencesProvider } from '../features/ui-preferences/ui-preferences-context'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <UiPreferencesProvider>{children}</UiPreferencesProvider>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
