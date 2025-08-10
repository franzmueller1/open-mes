import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

export const useDemo = () => {
  const { isDemo } = useAuth()

  const checkDemoRestriction = (action = 'diese Aktion') => {
    if (isDemo) {
      toast.error(`Demo-Benutzer können ${action} nicht durchführen`, {
        icon: '🔒',
        duration: 3000,
      })
      return true
    }
    return false
  }

  return {
    isDemo,
    checkDemoRestriction,
  }
}

export default useDemo