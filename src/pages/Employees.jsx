import { Users } from 'lucide-react'

const Employees = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mitarbeiter</h1>
        <p className="mt-1 text-sm text-gray-600">
          Verwalten Sie Ihre Mitarbeiter und Berechtigungen
        </p>
      </div>

      <div className="card p-12 text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Mitarbeitermodul
        </h2>
        <p className="text-gray-600">
          Dieses Modul wird in Kürze verfügbar sein
        </p>
      </div>
    </div>
  )
}

export default Employees