import 'antd/dist/reset.css'
import { FeelPage } from 'pages/Feel'
import { ListenPage } from 'pages/Listen'
import { ListenFeelPage } from 'pages/ListenFeel'
import { MainPage } from 'pages/Main'
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
          <Route path="/listen/feel" element={<ListenFeelPage />} />
          <Route path="/listen" element={<ListenPage />} />
          <Route path="/feel" element={<FeelPage />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
