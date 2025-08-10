import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import OfflineIndicator from '@/components/OfflineIndicator'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Products from '@/pages/Products'
import Machines from '@/pages/Machines'
import Productions from '@/pages/Productions'
import QualityControl from '@/pages/QualityControl'
import Employees from '@/pages/Employees'
import Materials from '@/pages/Materials'
import Reports from '@/pages/Reports'
import Settings from '@/pages/Settings'
import TestDatabase from '@/pages/TestDatabase'
import DemoLanding from '@/pages/DemoLanding'

function App() {
  return (
    <AuthProvider>
      <OfflineIndicator />
      <Routes>
        <Route path="/" element={<DemoLanding />} />
        <Route path="/demo" element={<DemoLanding />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="machines" element={<Machines />} />
          <Route path="productions" element={<Productions />} />
          <Route path="quality" element={<QualityControl />} />
          <Route path="employees" element={<Employees />} />
          <Route path="materials" element={<Materials />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="test" element={<TestDatabase />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App