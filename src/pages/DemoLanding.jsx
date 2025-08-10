import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Factory, 
  BarChart3, 
  Users, 
  Package, 
  Cpu, 
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react'

const DemoLanding = () => {
  const navigate = useNavigate()
  const { enterPublicDemo } = useAuth()

  const handleStartDemo = () => {
    enterPublicDemo()
    navigate('/app/dashboard')
  }

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Echtzeit-Dashboard',
      description: 'Überwachen Sie Ihre Produktion in Echtzeit'
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'Maschinenverwaltung',
      description: 'Verwalten Sie Ihren Maschinenpark effizient'
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: 'Produktverwaltung',
      description: 'Organisieren Sie Ihre Produktmodelle'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Mitarbeiter-Management',
      description: 'Behalten Sie den Überblick über Ihr Team'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Qualitätskontrolle',
      description: 'Sichern Sie höchste Produktqualität'
    },
    {
      icon: <Factory className="w-6 h-6" />,
      title: 'Produktionsplanung',
      description: 'Optimieren Sie Ihre Produktionsabläufe'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Factory className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold">MES System</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="btn btn-secondary"
              >
                Anmelden
              </button>
              <button
                onClick={handleStartDemo}
                className="btn btn-primary"
              >
                Demo starten
                <Play className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manufacturing Execution System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Erleben Sie unser modernes MES-System ohne Anmeldung. 
            Erkunden Sie alle Funktionen im Demo-Modus - kostenlos und unverbindlich.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartDemo}
              className="btn btn-primary text-lg px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
            >
              <Play className="w-5 h-5 mr-2" />
              Demo ohne Anmeldung starten
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-secondary text-lg px-8 py-4"
            >
              Vollversion testen
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Keine Registrierung erforderlich • Keine Kreditkarte • Sofort loslegen
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Was Sie im Demo-Modus erkunden können
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-8 bg-gradient-to-br from-primary-50 to-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bereit, das MES-System zu erkunden?
            </h2>
            <p className="text-gray-600 mb-6">
              Starten Sie jetzt die Demo und überzeugen Sie sich selbst von den Möglichkeiten.
            </p>
            <button
              onClick={handleStartDemo}
              className="btn btn-primary text-lg px-8 py-3"
            >
              Jetzt Demo starten
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          <p>© 2024 MES System. Entwickelt für moderne Fertigungsunternehmen.</p>
          <p className="mt-2">
            Demo-Modus: Alle Änderungen werden nicht gespeichert. 
            Für die Vollversion registrieren Sie sich bitte.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default DemoLanding