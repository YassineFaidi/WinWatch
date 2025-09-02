import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Logs from './pages/Logs'
import LogDetail from './pages/LogDetail'
import Analytics from './pages/Analytics'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/logs/:id" element={<LogDetail />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Layout>
  )
}

export default App



