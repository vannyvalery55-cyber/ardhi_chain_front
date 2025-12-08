import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'boot/axios'

export const useParcellesStore = defineStore('parcelles', () => {
  // État
  const parcelles = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 10
  })

  // URL de base de votre API (important pour les images)
  const API_BASE_URL = api.defaults.baseURL || 'http://localhost:3000'

  // Getters (propriétés calculées)
  const allParcelles = computed(() => parcelles.value)
  
  const formattedParcelles = computed(() => {
    return parcelles.value.map(parcelle => ({
      id: parcelle.id,
      name: parcelle.titre,
      category: 'Terrain',
      type: parcelle.type_terrain,
      price: parcelle.prix_vente,
      priceFormatted: formatPrice(parcelle.prix_vente),
      location: `${parcelle.quartier}, ${parcelle.ville}`,
      description: parcelle.description,
      superficie: parcelle.superficie,
      superficieFormatted: formatSuperficie(parcelle.superficie),
      statut: parcelle.statut,
      images: formatImages(parcelle.images),
      ville: parcelle.ville,
      quartier: parcelle.quartier,
      avenue: parcelle.avenue,
      numero: parcelle.numero,
      owner: parcelle.utilisateur?.nom || 'Non spécifié',
      ownerType: parcelle.utilisateur?.type,
      dateCreation: parcelle.date_creation,
      original: parcelle
    }))
  })

  // Fonction pour formater les URLs d'images
  const formatImages = (imagePaths) => {
    if (!imagePaths || !Array.isArray(imagePaths) || imagePaths.length === 0) {
      return []
    }
    
    return imagePaths.map(imagePath => {
      if (!imagePath) return ''
      
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath
      }
      
      if (imagePath.startsWith('/uploads/')) {
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
        const baseUrl = API_BASE_URL.replace(/\/$/, '')
        return `${baseUrl}/${cleanPath}`
      }
      
      return imagePath
    })
  }

  const availableParcelles = computed(() => {
    return formattedParcelles.value.filter(p => p.statut === 'disponible')
  })

  const soldParcelles = computed(() => {
    return formattedParcelles.value.filter(p => p.statut === 'vendu' || p.statut === 'indisponible')
  })

  const parcellesCount = computed(() => parcelles.value.length)
  
  const villes = computed(() => {
    const villesSet = new Set()
    parcelles.value.forEach(p => {
      if (p.ville) villesSet.add(p.ville)
    })
    return Array.from(villesSet)
  })

  const typesTerrain = computed(() => {
    const types = new Set()
    parcelles.value.forEach(p => {
      if (p.type_terrain) types.add(p.type_terrain)
    })
    return Array.from(types)
  })

  // Actions
  const fetchParcelles = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/api/parcelles', {
        params: {
          page: params.page || pagination.value.page,
          limit: params.limit || pagination.value.limit,
          ville: params.ville,
          type: params.type,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          statut: params.statut,
          search: params.search
        }
      })

      if (response.data) {
        parcelles.value = response.data.data || []
        pagination.value = {
          page: response.data.page || 1,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 1,
          count: response.data.count || 0
        }
        
        return { success: true, data: response.data }
      }
      
    } catch (err) {
      console.error('❌ Erreur chargement parcelles:', err)
      error.value = err.response?.data?.message || 'Erreur lors du chargement des parcelles'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchParcelleById = async (id) => {
    loading.value = true
    try {
      const response = await api.get(`/api/parcelles/${id}`)
      
      const parcelleWithFormattedImages = {
        ...response.data,
        images: formatImages(response.data.images)
      }
      
      return { success: true, data: parcelleWithFormattedImages }
    } catch (err) {
      console.error('❌ Erreur chargement parcelle:', err)
      error.value = err.response?.data?.message || 'Erreur lors du chargement de la parcelle'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createParcelle = async (parcelleData) => {
    loading.value = true
    try {
      const formData = new FormData()
      
      Object.keys(parcelleData).forEach(key => {
        if (key === 'images' && Array.isArray(parcelleData[key])) {
          parcelleData[key].forEach((image) => {
            if (image instanceof File) {
              formData.append('images', image)
            }
          })
        } else {
          formData.append(key, parcelleData[key])
        }
      })

      const response = await api.post('/api/parcelles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data) {
        const parcelleWithFormattedImages = {
          ...response.data,
          images: formatImages(response.data.images)
        }
        parcelles.value.unshift(parcelleWithFormattedImages)
      }
      
      return { success: true, data: response.data }
    } catch (err) {
      console.error('❌ Erreur création parcelle:', err)
      error.value = err.response?.data?.message || 'Erreur lors de la création de la parcelle'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateParcelle = async (id, parcelleData) => {
    loading.value = true
    try {
      const response = await api.put(`/api/parcelles/${id}`, parcelleData)
      
      const index = parcelles.value.findIndex(p => p.id === id)
      if (index !== -1) {
        const updatedParcelle = {
          ...parcelles.value[index],
          ...response.data,
          images: formatImages(response.data.images)
        }
        parcelles.value[index] = updatedParcelle
      }
      
      return { success: true, data: response.data }
    } catch (err) {
      console.error('❌ Erreur mise à jour parcelle:', err)
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour de la parcelle'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteParcelle = async (id) => {
    loading.value = true
    try {
      await api.delete(`/api/parcelles/${id}`)
      
      parcelles.value = parcelles.value.filter(p => p.id !== id)
      
      return { success: true }
    } catch (err) {
      console.error('❌ Erreur suppression parcelle:', err)
      error.value = err.response?.data?.message || 'Erreur lors de la suppression de la parcelle'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // AJOUT DES FONCTIONS MANQUANTES :
  
  const searchParcelles = async (searchTerm, filters = {}) => {
    loading.value = true
    try {
      const params = {
        search: searchTerm,
        ...filters
      }
      
      return await fetchParcelles(params)
    } catch (err) {
      console.error('❌ Erreur recherche parcelles:', err)
      return { success: false, error: 'Erreur lors de la recherche' }
    } finally {
      loading.value = false
    }
  }

  const filterByVille = (ville) => {
    if (!ville) return formattedParcelles.value
    return formattedParcelles.value.filter(p => p.ville === ville)
  }

  const filterByType = (type) => {
    if (!type) return formattedParcelles.value
    return formattedParcelles.value.filter(p => p.type === type)
  }

  const filterByPriceRange = (minPrice, maxPrice) => {
    return formattedParcelles.value.filter(p => {
      const price = p.price
      return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice)
    })
  }

  const filterByStatut = (statut) => {
    if (!statut) return formattedParcelles.value
    return formattedParcelles.value.filter(p => p.statut === statut)
  }

  const sortParcelles = (sortBy = 'date', order = 'desc') => {
    const sorted = [...formattedParcelles.value]
    
    sorted.sort((a, b) => {
      let valueA, valueB
      
      switch (sortBy) {
        case 'price':
          valueA = a.price
          valueB = b.price
          break
        case 'superficie':
          valueA = a.superficie
          valueB = b.superficie
          break
        case 'date':
          valueA = new Date(a.dateCreation)
          valueB = new Date(b.dateCreation)
          break
        case 'name':
          valueA = a.name?.toLowerCase()
          valueB = b.name?.toLowerCase()
          break
        default:
          valueA = a.id
          valueB = b.id
      }
      
      if (order === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })
    
    return sorted
  }

  const resetParcelles = () => {
    parcelles.value = []
    pagination.value = {
      page: 1,
      total: 0,
      totalPages: 1,
      limit: 10
    }
  }

  // Fonctions utilitaires
  const formatPrice = (price) => {
    if (!price) return 'Non spécifié'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatSuperficie = (superficie) => {
    if (!superficie) return ''
    return `${superficie.toLocaleString('fr-FR')} m²`
  }

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return ''
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    
    const baseUrl = API_BASE_URL.replace(/\/$/, '')
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
    
    return `${baseUrl}/${cleanPath}`
  }

  const init = () => {
    console.log('🔄 Initialisation store parcelles')
  }

  return {
    // État
    parcelles,
    loading,
    error,
    pagination,
    
    // Getters
    allParcelles,
    formattedParcelles,
    availableParcelles,
    soldParcelles,
    parcellesCount,
    villes,
    typesTerrain,
    
    // Actions
    fetchParcelles,
    fetchParcelleById,
    createParcelle,
    updateParcelle,
    deleteParcelle,
    searchParcelles,
    filterByVille,
    filterByType,
    filterByPriceRange,
    filterByStatut,
    sortParcelles,
    resetParcelles,
    init,
    
    // Utilitaires
    formatPrice,
    formatSuperficie,
    getFullImageUrl,
    formatImages
  }
})