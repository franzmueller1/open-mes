import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-error-600 text-white py-2 px-4 text-center animate-slide-in">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">
          Keine Internetverbindung - Bitte überprüfen Sie Ihre Verbindung
        </span>
      </div>
    </div>
  )
}

export default OfflineIndicator