import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const PublicDemoContext = createContext({})

export const usePublicDemo = () => {
  const context = useContext(PublicDemoContext)
  if (!context) {
    throw new Error('usePublicDemo must be used within a PublicDemoProvider')
  }
  return context
}

export const PublicDemoProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [demoUser] = useState({
    email: 'besucher@demo.de',
    id: 'demo-user',
    role: 'viewer'
  })

  // Demo-Daten (falls keine Datenbankverbindung)
  const [demoData] = useState({
    products: [
      { id: 1, model: 'Model S', description: 'Premium Elektro-Limousine', specifications: { range: '652 km' } },
      { id: 2, model: 'Model 3', description: 'Kompakte Elektro-Limousine', specifications: { range: '567 km' } },
      { id: 3, model: 'Model X', description: 'Elektro-SUV', specifications: { range: '580 km' } },
    ],
    machines: [
      { id: 1, name: 'CNC-Fräse Alpha', type: 'CNC', status: 'operational', location: 'Halle A' },
      { id: 2, name: 'Schweißroboter Beta', type: 'Welding', status: 'operational', location: 'Halle A' },
      { id: 3, name: 'Lackieranlage Gamma', type: 'Painting', status: 'maintenance', location: 'Halle B' },
    ],
    productions: [
      { id: 1, production_number: 'PRD-2024-001', quantity: 10, status: 'completed' },
      { id: 2, production_number: 'PRD-2024-002', quantity: 15, status: 'in_progress' },
    ]
  })

  const showDemoWarning = () => {
    toast('Demo-Modus: Änderungen werden nicht gespeichert', {
      icon: '👁️',
      duration: 3000,
    })
  }

  useEffect(() => {
    // Zeige Demo-Modus Nachricht beim Start
    const timer = setTimeout(() => {
      toast('Sie nutzen den öffentlichen Demo-Modus', {
        icon: '🎭',
        duration: 5000,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <PublicDemoContext.Provider value={{
      isDemoMode,
      demoUser,
      demoData,
      showDemoWarning
    }}>
      {children}
    </PublicDemoContext.Provider>
  )
}