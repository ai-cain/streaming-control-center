import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from './app/AppProviders'
import { AppShell } from './app/AppShell'

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProviders>
  )
}

export default App
