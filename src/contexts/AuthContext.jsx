import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [isPublicDemo, setIsPublicDemo] = useState(false)

  useEffect(() => {
    // Check for public demo mode (no login required)
    const urlParams = new URLSearchParams(window.location.search)
    const publicDemo = urlParams.get('demo') === 'true' || window.location.pathname === '/demo'
    
    if (publicDemo || !import.meta.env.VITE_SUPABASE_URL) {
      // Aktiviere öffentlichen Demo-Modus
      setIsPublicDemo(true)
      setIsDemo(true)
      setUser({
        email: 'demo@öffentlich.de',
        id: 'public-demo',
        user_metadata: { role: 'demo' }
      })
      setLoading(false)
      return
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Auth session check:', { 
        hasSession: !!session, 
        userEmail: session?.user?.email,
        isDemo: session?.user?.email === 'demo@mes-system.com'
      })
      setSession(session)
      setUser(session?.user ?? null)
      setIsDemo(session?.user?.email === 'demo@mes-system.com')
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', { 
        event: _event,
        hasSession: !!session, 
        userEmail: session?.user?.email 
      })
      setSession(session)
      setUser(session?.user ?? null)
      setIsDemo(session?.user?.email === 'demo@mes-system.com')
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Erfolgreich angemeldet!')
      return { data, error: null }
    } catch (error) {
      toast.error(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) throw error

      toast.success('Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail.')
      return { data, error: null }
    } catch (error) {
      toast.error(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success('Erfolgreich abgemeldet')
      setUser(null)
      setSession(null)
      setIsDemo(false)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const signInAsDemo = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@mes-system.com',
        password: 'demo123456',
      })

      if (error) {
        // If demo user doesn't exist, create it
        if (error.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'demo@mes-system.com',
            password: 'demo123456',
            options: {
              data: {
                role: 'demo',
                company: 'Demo Company',
              },
            },
          })

          if (signUpError) throw signUpError

          // Sign in with the newly created demo account
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: 'demo@mes-system.com',
            password: 'demo123456',
          })

          if (signInError) throw signInError

          toast.success('Demo-Zugang aktiviert!')
          return { data: signInData, error: null }
        }
        throw error
      }

      toast.success('Demo-Zugang aktiviert!')
      return { data, error: null }
    } catch (error) {
      toast.error('Demo-Zugang konnte nicht aktiviert werden: ' + error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const enterPublicDemo = () => {
    setIsPublicDemo(true)
    setIsDemo(true)
    setUser({
      email: 'demo@öffentlich.de',
      id: 'public-demo',
      user_metadata: { role: 'demo' }
    })
    toast.success('Öffentlicher Demo-Modus aktiviert')
  }

  const value = {
    user,
    session,
    loading,
    isDemo,
    isPublicDemo,
    signIn,
    signUp,
    signOut,
    signInAsDemo,
    enterPublicDemo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}