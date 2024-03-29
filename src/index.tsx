import 'antd/dist/reset.css'
import { ListenPage } from 'pages/Listen'
import { MainPage } from 'pages/Main'
import { TempPage } from 'pages/Temp'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'styles/global.css'

// eslint-disable-next-line no-undef
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/listen" element={<ListenPage />} />
          <Route path="/temp" element={<TempPage />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
