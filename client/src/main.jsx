import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { ContentProvider } from './components/ContentProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <App />
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>,
)
