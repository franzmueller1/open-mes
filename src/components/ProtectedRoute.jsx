import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { user, loading, isPublicDemo } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Erlaubt Zugriff im öffentlichen Demo-Modus ODER wenn angemeldet
  if (!user && !isPublicDemo) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute