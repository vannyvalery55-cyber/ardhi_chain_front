import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const usePropertiesStore = defineStore('properties', () => {
  // State
  const houses = ref([])
  const land = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // API base URL
  const API_BASE_URL = 'http://localhost:3000/api/' // Ajustez selon votre backend

  // Getters
  const totalProperties = computed(() => {
    return houses.value.length + land.value.length
  })

  const availableHouses = computed(() => {
    return houses.value.filter(house => house.statut === 'disponible')
  })

  const availableLand = computed(() => {
    return land.value.filter(plot => plot.statut === 'disponible')
  })

  // Transforme les données de l'API en format compatible avec votre frontend
  const transformHouseData = (apiHouse) => {
    const price = apiHouse.prix_location 
      ? `${apiHouse.prix_location} USD/mois`
      : apiHouse.prix_vente 
        ? `${apiHouse.prix_vente} ADA`
        : 'Prix non spécifié'

    return {
      id: apiHouse.id,
      name: apiHouse.titre || 'Sans titre',
      description: apiHouse.description || 'Description non disponible',
      location: apiHouse.parcelle 
        ? `${apiHouse.parcelle.quartier}, ${apiHouse.parcelle.ville}`
        : 'Localisation non spécifiée',
      category: 'Maison',
      area: `${apiHouse.surface_totale} m²`,
      price: price,
      bedrooms: apiHouse.nombre_chambres,
      bathrooms: apiHouse.nombre_salles_bain,
      type: apiHouse.type_maison,
      condition: apiHouse.etat,
      standing: apiHouse.standing,
      features: [
        apiHouse.jardin ? 'Jardin' : null,
        apiHouse.garage ? 'Garage' : null,
        apiHouse.piscine ? 'Piscine' : null,
        apiHouse.nombre_chambres ? `${apiHouse.nombre_chambres} chambres` : null,
        apiHouse.type_maison ? apiHouse.type_maison : null
      ].filter(Boolean),
      images: apiHouse.images && apiHouse.images.length > 0 
        ? apiHouse.images.map(img => `${API_BASE_URL}${img}`)
        : ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
      status: apiHouse.statut,
      offerType: apiHouse.type_offre,
      owner: apiHouse.proprietaire?.nom || 'Propriétaire inconnu',
      createdAt: apiHouse.date_creation,
      nftId: null, // À remplir si vous avez des IDs NFT
      parcelInfo: apiHouse.parcelle ? {
        id: apiHouse.parcelle.id,
        title: apiHouse.parcelle.titre,
        area: `${apiHouse.parcelle.superficie} m²`,
        price: `${apiHouse.parcelle.prix_vente} ADA`,
        type: apiHouse.parcelle.type_terrain,
        address: `${apiHouse.parcelle.avenue} ${apiHouse.parcelle.numero}, ${apiHouse.parcelle.quartier}`
      } : null
    }
  }

  const transformLandData = (apiLand) => {
    return {
      id: apiLand.id,
      name: apiLand.titre || 'Sans titre',
      description: apiLand.description || 'Description non disponible',
      location: `${apiLand.quartier}, ${apiLand.ville}`,
      category: 'Parcelle',
      area: `${apiLand.superficie} m²`,
      price: `${apiLand.prix_vente} ADA`,
      type: apiLand.type_terrain,
      features: [
        apiLand.type_terrain ? `Terrain ${apiLand.type_terrain}` : null,
        apiLand.superficie ? `${apiLand.superficie} m²` : null
      ].filter(Boolean),
      images: apiLand.images 
        ? apiLand.images.split(',').map(img => `${API_BASE_URL}${img.trim()}`)
        : ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
      status: apiLand.statut,
      address: `${apiLand.avenue} ${apiLand.numero}`,
      owner: apiLand.utilisateur?.nom || 'Propriétaire inconnu',
      createdAt: apiLand.date_creation,
      nftId: null // À remplir si vous avez des IDs NFT
    }
  }

  // Actions
  const fetchProperties = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Récupérer les maisons
      const housesResponse = await axios.get(`${API_BASE_URL}/maisons`)
      
      if (housesResponse.data && housesResponse.data.data) {
        houses.value = housesResponse.data.data.map(transformHouseData)
      }

      // Récupérer les parcelles (optionnel - si vous voulez aussi afficher les terrains)
      // const landResponse = await axios.get(`${API_BASE_URL}/parcelles`)
      // if (landResponse.data && landResponse.data.data) {
      //   land.value = landResponse.data.data.map(transformLandData)
      // }

    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des propriétés'
      console.error('Erreur fetchProperties:', err)
      
      // Fallback avec des données mock si l'API échoue
      houses.value = getMockHouses()
    } finally {
      isLoading.value = false
    }
  }

  // Fonction pour récupérer une maison par ID
  const fetchHouseById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/maisons/${id}`)
      return transformHouseData(response.data)
    } catch (err) {
      console.error('Erreur fetchHouseById:', err)
      return null
    }
  }

  // Fonction de recherche
  const searchProperties = (term) => {
    const searchTerm = term.toLowerCase().trim()
    
    if (!searchTerm) {
      return {
        houses: houses.value,
        land: land.value
      }
    }

    const filteredHouses = houses.value.filter(house => {
      return (
        house.name.toLowerCase().includes(searchTerm) ||
        house.location.toLowerCase().includes(searchTerm) ||
        house.description.toLowerCase().includes(searchTerm) ||
        house.type.toLowerCase().includes(searchTerm)
      )
    })

    const filteredLand = land.value.filter(plot => {
      return (
        plot.name.toLowerCase().includes(searchTerm) ||
        plot.location.toLowerCase().includes(searchTerm) ||
        plot.description.toLowerCase().includes(searchTerm) ||
        plot.type.toLowerCase().includes(searchTerm)
      )
    })

    return {
      houses: filteredHouses,
      land: filteredLand
    }
  }

  // Données mock pour fallback
  const getMockHouses = () => {
    return [
      {
        id: 1,
        name: "Villa de luxe 5 chambres, Goma",
        description: "Villa exceptionnelle avec vue sur le lac, finitions haut de gamme, titres vérifiés.",
        location: "Lac Vert, Goma",
        category: "Maison",
        area: "450 m²",
        price: "45 000 ADA",
        bedrooms: 5,
        bathrooms: 3,
        type: "Villa",
        features: ["Jardin", "Piscine", "Garage", "5 chambres"],
        images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"],
        status: "disponible",
        nftId: "NFT12345"
      }
    ]
  }

  return {
    // State
    houses,
    land,
    isLoading,
    error,
    
    // Getters
    totalProperties,
    availableHouses,
    availableLand,
    
    // Actions
    fetchProperties,
    fetchHouseById,
    searchProperties
  }
})