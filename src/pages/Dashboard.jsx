import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import {
  TrendingUp,
  TrendingDown,
  Package,
  Cpu,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Dashboard = () => {
  const { user, isDemo } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeMachines: 0,
    totalEmployees: 0,
    todayProduction: 0,
    machineStatus: { operational: 0, maintenance: 0, idle: 0 },
    qualityRate: 0,
    recentProductions: [],
  })

  useEffect(() => {
    fetchDashboardData()
    
    // Set up realtime subscription for production updates
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'productions' },
        () => {
          fetchDashboardData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (productsError) throw productsError

      // Fetch machines and their status
      const { data: machines, error: machinesError } = await supabase
        .from('machines')
        .select('status')

      if (machinesError) throw machinesError

      // Fetch employees count
      const { count: employeesCount, error: employeesError } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })

      if (employeesError) throw employeesError

      // Fetch today's production
      const today = new Date().toISOString().split('T')[0]
      const { data: todayProductions, error: productionsError } = await supabase
        .from('productions')
        .select('quantity')
        .gte('start_time', today)

      if (productionsError) throw productionsError

      // Fetch recent productions with details
      const { data: recentProductions, error: recentError } = await supabase
        .from('productions')
        .select(`
          *,
          products (model),
          machines (name),
          employees (name)
        `)
        .order('start_time', { ascending: false })
        .limit(5)

      if (recentError) throw recentError

      // Fetch quality checks
      const { data: qualityChecks, error: qualityError } = await supabase
        .from('quality_checks')
        .select('result')
        .gte('check_date', today)

      if (qualityError) throw qualityError

      // Calculate statistics
      const machineStatusCount = machines?.reduce(
        (acc, machine) => {
          if (machine.status === 'operational') acc.operational++
          else if (machine.status === 'maintenance') acc.maintenance++
          else acc.idle++
          return acc
        },
        { operational: 0, maintenance: 0, idle: 0 }
      )

      const todayProductionTotal = todayProductions?.reduce(
        (sum, prod) => sum + prod.quantity,
        0
      ) || 0

      const passedChecks = qualityChecks?.filter(
        (check) => check.result === 'passed'
      ).length || 0
      const totalChecks = qualityChecks?.length || 0
      const qualityRate = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0

      setStats({
        totalProducts: productsCount || 0,
        activeMachines: machineStatusCount?.operational || 0,
        totalEmployees: employeesCount || 0,
        todayProduction: todayProductionTotal,
        machineStatus: machineStatusCount || { operational: 0, maintenance: 0, idle: 0 },
        qualityRate: qualityRate.toFixed(1),
        recentProductions: recentProductions || [],
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Fehler beim Laden der Dashboard-Daten. Bitte aktualisieren Sie die Seite.')
      
      // Set default values to prevent crashes
      setStats({
        totalProducts: 0,
        activeMachines: 0,
        totalEmployees: 0,
        todayProduction: 0,
        machineStatus: { operational: 0, maintenance: 0, idle: 0 },
        qualityRate: 0,
        recentProductions: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const productionChartData = {
    labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    datasets: [
      {
        label: 'Produktion',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  }

  const machineChartData = {
    labels: ['Betriebsbereit', 'Wartung', 'Inaktiv'],
    datasets: [
      {
        data: [
          stats.machineStatus.operational,
          stats.machineStatus.maintenance,
          stats.machineStatus.idle,
        ],
        backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Willkommen zurück! Hier ist Ihre Produktionsübersicht.
        </p>
      </div>

      {/* Benutzer-Status Box */}
      <div className="card p-4 bg-primary-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-900">Angemeldet als:</p>
            <p className="text-lg font-bold text-primary-900">{user?.email || 'Nicht angemeldet'}</p>
            {isDemo && (
              <p className="text-sm text-warning-700 mt-1">
                ⚠️ Demo-Modus: Sie können Daten nur lesen, nicht bearbeiten.
              </p>
            )}
          </div>
          {!user && (
            <button 
              onClick={() => window.location.href = '/login'}
              className="btn btn-primary"
            >
              Jetzt anmelden
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produkte</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalProducts}
              </p>
              <p className="text-xs text-success-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12% diese Woche</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktive Maschinen</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.activeMachines}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                von {stats.machineStatus.operational + stats.machineStatus.maintenance + stats.machineStatus.idle} gesamt
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Heutige Produktion</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.todayProduction}
              </p>
              <p className="text-xs text-error-600 mt-2 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                <span>-5% vs. gestern</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Qualitätsrate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.qualityRate}%
              </p>
              <p className="text-xs text-success-600 mt-2">Sehr gut</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Chart */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Produktionsverlauf
          </h3>
          <div className="h-64">
            <Line data={productionChartData} options={chartOptions} />
          </div>
        </div>

        {/* Machine Status */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Maschinenstatus
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48">
              <Doughnut data={machineChartData} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-success-500 rounded-full" />
                Betriebsbereit
              </span>
              <span className="font-medium">{stats.machineStatus.operational}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-warning-500 rounded-full" />
                Wartung
              </span>
              <span className="font-medium">{stats.machineStatus.maintenance}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-error-500 rounded-full" />
                Inaktiv
              </span>
              <span className="font-medium">{stats.machineStatus.idle}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Productions */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Aktuelle Produktionen
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produkt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maschine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mitarbeiter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Menge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentProductions.length > 0 ? (
                stats.recentProductions.map((production) => (
                  <tr key={production.production_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {production.products?.model || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {production.machines?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {production.employees?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {production.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-success">Abgeschlossen</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                    Keine aktuellen Produktionen vorhanden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard