import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Factory, Eye, EyeOff, ArrowRight, Users } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { user, signIn, signUp, signInAsDemo, enterPublicDemo, loading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
  })

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/app/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // E-Mail Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      return
    }

    if (isSignUp) {
      // Passwort-Validierung für Registrierung
      if (formData.password.length < 6) {
        toast.error('Das Passwort muss mindestens 6 Zeichen lang sein')
        return
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error('Die Passwörter stimmen nicht überein')
        return
      }

      if (!formData.company || formData.company.trim() === '') {
        toast.error('Bitte geben Sie einen Firmennamen ein')
        return
      }

      const { error } = await signUp(formData.email, formData.password, {
        company: formData.company.trim(),
      })
      if (!error) {
        toast.success('Registrierung erfolgreich! Sie können sich jetzt anmelden.')
        setIsSignUp(false)
        setFormData({ ...formData, confirmPassword: '' })
      }
    } else {
      // Passwort-Validierung für Login
      if (!formData.password) {
        toast.error('Bitte geben Sie Ihr Passwort ein')
        return
      }

      const { error } = await signIn(formData.email, formData.password)
      if (!error) {
        navigate('/app/dashboard')
      }
    }
  }

  const handleDemoLogin = async () => {
    const { error } = await signInAsDemo()
    if (!error) {
      navigate('/app/dashboard')
    }
  }

  const handlePublicDemo = () => {
    enterPublicDemo()
    navigate('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Factory className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Müller MES</h1>
          <p className="mt-2 text-gray-600">
            Manufacturing Execution System
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isSignUp ? 'Konto erstellen' : 'Willkommen zurück'}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {isSignUp
                ? 'Registrieren Sie sich für Ihr MES-System'
                : 'Melden Sie sich bei Ihrem Konto an'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="company" className="label">
                  Firmenname
                </label>
                <input
                  type="text"
                  id="company"
                  className="input"
                  placeholder="Ihre Firma GmbH"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="name@firma.de"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Passwort
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="input pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="label">
                  Passwort bestätigen
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required={isSignUp}
                />
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-sm text-error-600">
                      Passwörter stimmen nicht überein
                    </p>
                  )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  {isSignUp ? 'Registrieren' : 'Anmelden'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">oder</span>
            </div>
          </div>

          <button
            onClick={handlePublicDemo}
            disabled={loading}
            className="w-full btn btn-primary bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
          >
            <Users className="w-4 h-4 mr-2" />
            🚀 Ohne Anmeldung ausprobieren
          </button>

          <div className="text-center text-sm text-gray-500 my-2">oder</div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full btn btn-secondary"
          >
            <Users className="w-4 h-4 mr-2" />
            Mit Demo-Account anmelden
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? 'Bereits ein Konto?' : 'Noch kein Konto?'}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {isSignUp ? 'Jetzt anmelden' : 'Jetzt registrieren'}
            </button>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <p className="text-sm text-primary-800">
            <strong>Demo-Zugang:</strong> Testen Sie das System ohne
            Registrierung mit eingeschränkten Berechtigungen.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login