import { CheckCircle } from 'lucide-react'

const QualityControl = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Qualitätskontrolle</h1>
        <p className="mt-1 text-sm text-gray-600">
          Überwachen Sie die Qualität Ihrer Produktion
        </p>
      </div>

      <div className="card p-12 text-center">
        <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Qualitätskontrollmodul
        </h2>
        <p className="text-gray-600">
          Dieses Modul wird in Kürze verfügbar sein
        </p>
      </div>
    </div>
  )
}

export default QualityControl