import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Cpu, Plus, Edit, Wrench, AlertCircle, CheckCircle, Search } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import toast from 'react-hot-toast'

const Machines = () => {
  const { user, isDemo } = useAuth()
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(null)
  
  // Debug-Ausgabe
  console.log('Machines Component - Auth Status:', {
    user: user?.email,
    isDemo,
    isLoggedIn: !!user
  })

  useEffect(() => {
    fetchMachines()

    // Realtime subscription
    const channel = supabase
      .channel('machines-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'machines' },
        () => {
          fetchMachines()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchMachines = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .order('name')

      if (error) throw error
      setMachines(data || [])
    } catch (error) {
      console.error('Error fetching machines:', error)
      toast.error('Fehler beim Laden der Maschinen')
    } finally {
      setLoading(false)
    }
  }

  const updateMachineStatus = async (id, newStatus) => {
    console.log('Updating machine status:', { id, newStatus, isDemo })
    
    if (isDemo) {
      toast.error('Demo-Benutzer können keine Änderungen vornehmen')
      return
    }

    setUpdatingStatus(id)

    try {
      const { data, error } = await supabase
        .from('machines')
        .update({ status: newStatus })
        .eq('id', id)
        .select()

      console.log('Update response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      toast.success(`Maschinenstatus auf "${getStatusText(newStatus)}" geändert`)
      
      // Direkt die lokalen Daten aktualisieren für sofortiges Feedback
      setMachines(prev => prev.map(m => 
        m.id === id ? { ...m, status: newStatus } : m
      ))
      
      // Dann frische Daten vom Server holen
      fetchMachines()
    } catch (error) {
      console.error('Error updating machine status:', error)
      toast.error(`Fehler: ${error.message || 'Unbekannter Fehler'}`)
      // Bei Fehler: Zurücksetzen auf alten Wert
      fetchMachines()
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-success-600" />
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-warning-600" />
      case 'idle':
        return <Cpu className="w-5 h-5 text-gray-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error-600" />
      default:
        return <Cpu className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'operational':
        return 'badge-success'
      case 'maintenance':
        return 'badge-warning'
      case 'error':
        return 'badge-error'
      default:
        return 'badge'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'Betriebsbereit'
      case 'maintenance':
        return 'Wartung'
      case 'idle':
        return 'Inaktiv'
      case 'error':
        return 'Fehler'
      default:
        return status
    }
  }

  const filteredMachines = machines.filter((machine) =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maschinen</h1>
          <p className="mt-1 text-sm text-gray-600">
            Überwachen Sie den Status Ihrer Produktionsmaschinen
          </p>
          {isDemo && (
            <p className="mt-1 text-xs text-warning-600">
              ⚠️ Demo-Modus: Änderungen sind deaktiviert
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              console.log('Testing database update...')
              const testMachine = machines[0]
              if (testMachine) {
                const newStatus = testMachine.status === 'operational' ? 'idle' : 'operational'
                await updateMachineStatus(testMachine.id, newStatus)
              }
            }}
            className="btn btn-secondary"
          >
            Test Update
          </button>
          <button disabled={isDemo} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Neue Maschine
          </button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <div className="card p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Maschinen suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gesamt</p>
              <p className="text-2xl font-bold">{machines.length}</p>
            </div>
            <Cpu className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktiv</p>
              <p className="text-2xl font-bold text-success-600">
                {machines.filter(m => m.status === 'operational').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
        </div>
      </div>

      {/* Machines Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maschine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Standort
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Letzte Wartung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nächste Wartung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMachines.map((machine) => (
                <tr key={machine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getStatusIcon(machine.status)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {machine.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {machine.type || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadgeClass(machine.status)}`}>
                      {getStatusText(machine.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {machine.location || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {machine.last_maintenance
                      ? new Date(machine.last_maintenance).toLocaleDateString('de-DE')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {machine.next_maintenance ? (
                      <span
                        className={
                          new Date(machine.next_maintenance) < new Date()
                            ? 'text-error-600 font-medium'
                            : 'text-gray-600'
                        }
                      >
                        {new Date(machine.next_maintenance).toLocaleDateString('de-DE')}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={machine.status}
                      onChange={(e) => updateMachineStatus(machine.id, e.target.value)}
                      disabled={isDemo || updatingStatus === machine.id}
                      className={`text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                        updatingStatus === machine.id ? 'opacity-50 cursor-wait' : ''
                      }`}
                    >
                      <option value="operational">Betriebsbereit</option>
                      <option value="maintenance">Wartung</option>
                      <option value="idle">Inaktiv</option>
                      <option value="error">Fehler</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMachines.length === 0 && (
            <div className="p-8 text-center">
              <Cpu className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Keine Maschinen gefunden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Machines