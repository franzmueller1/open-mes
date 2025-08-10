import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Edit, Trash2, Search, Package, Calendar, FileText } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import toast from 'react-hot-toast'

const Products = () => {
  const { isDemo } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [formData, setFormData] = useState({
    model: '',
    description: '',
    release_date: '',
    specifications: {
      range: '',
      acceleration: '',
      top_speed: '',
    },
  })

  useEffect(() => {
    fetchProducts()

    // Realtime subscription
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Fehler beim Laden der Produkte')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isDemo) {
      toast.error('Demo-Benutzer können keine Änderungen vornehmen')
      return
    }

    // Validierung
    if (!formData.model.trim()) {
      toast.error('Bitte geben Sie einen Modellnamen ein')
      return
    }

    setFormLoading(true)

    try {
      const productData = {
        model: formData.model.trim(),
        description: formData.description.trim(),
        release_date: formData.release_date || null,
        specifications: formData.specifications,
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) throw error
        toast.success('Produkt erfolgreich aktualisiert')
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])

        if (error) throw error
        toast.success('Produkt erfolgreich erstellt')
      }

      setShowModal(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(`Fehler beim Speichern: ${error.message || 'Unbekannter Fehler'}`)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      model: product.model,
      description: product.description || '',
      release_date: product.release_date || '',
      specifications: product.specifications || {
        range: '',
        acceleration: '',
        top_speed: '',
      },
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (isDemo) {
      toast.error('Demo-Benutzer können keine Änderungen vornehmen')
      return
    }

    if (!confirm('Sind Sie sicher, dass Sie dieses Produkt löschen möchten?')) {
      return
    }

    setDeleteLoading(id)

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Produkt erfolgreich gelöscht')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error(`Fehler beim Löschen: ${error.message || 'Unbekannter Fehler'}`)
    } finally {
      setDeleteLoading(null)
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      model: '',
      description: '',
      release_date: '',
      specifications: {
        range: '',
        acceleration: '',
        top_speed: '',
      },
    })
  }

  const filteredProducts = products.filter((product) =>
    product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Produkte</h1>
          <p className="mt-1 text-sm text-gray-600">
            Verwalten Sie Ihre Produktmodelle und Spezifikationen
          </p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          disabled={isDemo}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neues Produkt
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Produkte suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="card hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    disabled={isDemo}
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    disabled={isDemo || deleteLoading === product.id}
                  >
                    {deleteLoading === product.id ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-error-600" />
                    )}
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.model}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {product.description || 'Keine Beschreibung verfügbar'}
              </p>

              {product.release_date && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(product.release_date).toLocaleDateString('de-DE')}
                  </span>
                </div>
              )}

              {product.specifications && (
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  {product.specifications.range && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Reichweite:</span>
                      <span className="font-medium">{product.specifications.range}</span>
                    </div>
                  )}
                  {product.specifications.acceleration && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">0-100 km/h:</span>
                      <span className="font-medium">{product.specifications.acceleration}</span>
                    </div>
                  )}
                  {product.specifications.top_speed && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Höchstgeschw.:</span>
                      <span className="font-medium">{product.specifications.top_speed}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Keine Produkte gefunden
          </h3>
          <p className="text-sm text-gray-600">
            {searchTerm
              ? 'Versuchen Sie eine andere Suche'
              : 'Erstellen Sie Ihr erstes Produkt'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Produkt bearbeiten' : 'Neues Produkt'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="model" className="label">
                  Modellname *
                </label>
                <input
                  type="text"
                  id="model"
                  className="input"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Beschreibung
                </label>
                <textarea
                  id="description"
                  className="input"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="release_date" className="label">
                  Veröffentlichungsdatum
                </label>
                <input
                  type="date"
                  id="release_date"
                  className="input"
                  value={formData.release_date}
                  onChange={(e) =>
                    setFormData({ ...formData, release_date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Spezifikationen</h3>
                
                <div>
                  <label htmlFor="range" className="label">
                    Reichweite
                  </label>
                  <input
                    type="text"
                    id="range"
                    className="input"
                    placeholder="z.B. 652 km"
                    value={formData.specifications.range}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          range: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="acceleration" className="label">
                    Beschleunigung (0-100 km/h)
                  </label>
                  <input
                    type="text"
                    id="acceleration"
                    className="input"
                    placeholder="z.B. 2.1s"
                    value={formData.specifications.acceleration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          acceleration: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="top_speed" className="label">
                    Höchstgeschwindigkeit
                  </label>
                  <input
                    type="text"
                    id="top_speed"
                    className="input"
                    placeholder="z.B. 322 km/h"
                    value={formData.specifications.top_speed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          top_speed: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Abbrechen
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex-1"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    editingProduct ? 'Aktualisieren' : 'Erstellen'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products