import { defineStore } from 'pinia'
import { api } from 'boot/axios'

// DÉSACTIVER le mode démo pour essayer l'API
const FORCE_DEMO_MODE = false
// OU utiliser une variable d'environnement
const API_ENABLED = process.env.API_ENABLED !== 'false'

export const usePropertiesStore = defineStore('properties', {
  state: () => ({
    houses: [],
    housesLoading: false,
    housesError: null,
    isDemoMode: FORCE_DEMO_MODE || !API_ENABLED,
    apiAvailable: null // null = pas testé, true = disponible, false = indisponible
  }),

  getters: {
    formattedProperties: (state) => {
      if (!state.houses.length) return []

      return state.houses.map(house => {
        // S'assurer que les données existent
        const titre = house.titre || 'Sans titre'
        const description = house.description || 'Aucune description'
        const surface = house.surface_totale || 0

        // Gérer la localisation
        let location = 'Localisation non spécifiée'
        if (house.parcelle) {
          const quartier = house.parcelle.quartier || ''
          const ville = house.parcelle.ville || ''
          location = [quartier, ville].filter(Boolean).join(', ') || location
        }

        // Gérer le prix
        let price = 'Non spécifié'
        if (house.prix_vente) {
          price = `$${Number(house.prix_vente).toLocaleString()}`
        } else if (house.prix_location) {
          price = `$${Number(house.prix_location)}/mois`
        }

        // Gérer l'image
        let image = '/images/default-house.jpg'
        if (house.images && house.images.length > 0) {
          const img = house.images[0]
          // Si c'est un chemin relatif, ajouter l'URL du backend
          if (img.startsWith('/')) {
            image = `http://localhost:3000${img}`
          } else {
            image = img
          }
        }

        // Caractéristiques
        const features = []
        if (house.jardin) features.push('Jardin')
        if (house.piscine) features.push('Piscine')
        if (house.garage) features.push('Garage')
        if (house.nombre_chambres) features.push(`${house.nombre_chambres} chambres`)
        if (house.nombre_salles_bain) features.push(`${house.nombre_salles_bain} salles de bain`)

        return {
          id: house.id,
          name: titre,
          description: description,
          location: location,
          area: `${surface} m²`,
          price: price,
          category: 'Maison',
          image: image,
          features: features.slice(0, 3),
          type_offre: house.type_offre,
          standing: house.standing,
          etat: house.etat,
          type_maison: house.type_maison,
          original: house
        }
      })
    },

    formattedHouses: (state) => state.formattedProperties,
    allProperties: (state) => state.formattedProperties,

    // Statistiques
    stats: (state) => ({
      total: state.houses.length,
      forSale: state.houses.filter(h => h.type_offre === 'vente').length,
      forRent: state.houses.filter(h => h.type_offre === 'location').length,
      cities: [...new Set(state.houses.map(h => h.parcelle?.ville).filter(Boolean))]
    }),

    // Villes disponibles pour les filtres
    availableCities: (state) => {
      const cities = state.houses
        .map(house => house.parcelle?.ville)
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index)

      return cities.length ? cities : ['Goma', 'Bukavu', 'Kinshasa']
    }
  },

  actions: {
    async fetchHouses(params = {}) {
      // Vérifier d'abord si l'API est disponible
      if (this.apiAvailable === false) {
        console.log('📴 API précédemment indisponible, utilisation du mode démo')
        return this.loadMockData()
      }

      this.housesLoading = true
      this.housesError = null

      try {
        console.log('🌐 Tentative de connexion à l\'API...')

        // Configuration avec timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await api.get('/api/maisons', {
          params,
          signal: controller.signal,
          timeout: 15000
        })

        clearTimeout(timeoutId)

        console.log('✅ API connectée - Status:', response.status)

        // Vérifier la structure de la réponse
        if (response.data && Array.isArray(response.data.data)) {
          this.houses = response.data.data
          this.isDemoMode = false
          this.apiAvailable = true

          console.log(`🏠 ${this.houses.length} maisons chargées depuis l'API`)
          console.log('📊 Exemple de données:', this.houses[0] ? {
            id: this.houses[0].id,
            titre: this.houses[0].titre,
            ville: this.houses[0].parcelle?.ville
          } : 'Aucune donnée')

          return this.houses
        } else {
          throw new Error('Format de réponse API invalide')
        }

      } catch (apiError) {
        console.error('❌ Erreur API:', {
          name: apiError.name,
          message: apiError.message,
          code: apiError.code
        })

        // Marquer l'API comme indisponible
        this.apiAvailable = false
        this.isDemoMode = true

        // Déterminer le type d'erreur
        if (apiError.name === 'AbortError') {
          this.housesError = 'Timeout: Le serveur met trop de temps à répondre'
        } else if (apiError.response) {
          // Erreur HTTP
          this.housesError = `Erreur ${apiError.response.status}: ${apiError.response.data?.message || 'Serveur erreur'}`
        } else if (apiError.request) {
          // Pas de réponse
          this.housesError = 'Serveur inaccessible. Vérifiez que le backend est démarré sur http://localhost:3000'
        } else {
          this.housesError = `Erreur: ${apiError.message}`
        }

        console.warn('⚠️ Basculer en mode démo...')
        return this.loadMockData()

      } finally {
        this.housesLoading = false
      }
    },

    async loadMockData() {
      console.log('🎭 Chargement des données de démonstration')

      this.houses = getMockHouses()
      this.isDemoMode = true
      this.housesError = 'Mode démonstration - Données locales'

      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`📊 ${this.houses.length} maisons de démo chargées`)
          resolve(this.houses)
        }, 500)
      })
    },

    // Tester la connexion API
    async testApiConnection() {
      try {
        console.log('🔌 Test de connexion API...')
        // Utiliser la variable de réponse pour éviter l'erreur ESLint
        const apiResponse = await api.get('/api/maisons', { timeout: 5000 })

        // Vérifier si la réponse est valide
        if (apiResponse.status >= 200 && apiResponse.status < 300) {
          this.apiAvailable = true
          this.isDemoMode = false
          console.log('✅ API disponible - Status:', apiResponse.status)
          return true
        } else {
          throw new Error(`Status HTTP: ${apiResponse.status}`)
        }

      } catch (apiTestError) {
        // Utiliser le paramètre d'erreur pour éviter l'erreur ESLint
        this.apiAvailable = false
        this.isDemoMode = true
        console.warn('❌ API indisponible:', apiTestError.message)
        return false
      }
    },
  
    // Recharger depuis l'API (forcer)
    async reloadFromApi() {
      this.apiAvailable = null // Réinitialiser le statut
      return this.fetchHouses()
    },

    // Filtrer les maisons
    filterHouses(filters = {}) {
      return this.houses.filter(house => {
        // Filtre par type d'offre
        if (filters.type_offre && house.type_offre !== filters.type_offre) {
          return false
        }

        // Filtre par ville
        if (filters.ville && house.parcelle?.ville) {
          if (house.parcelle.ville.toLowerCase() !== filters.ville.toLowerCase()) {
            return false
          }
        }

        // Filtre par prix min
        if (filters.minPrice) {
          const price = house.prix_vente || house.prix_location || 0
          if (price < filters.minPrice) return false
        }

        // Filtre par prix max
        if (filters.maxPrice) {
          const price = house.prix_vente || house.prix_location || Infinity
          if (price > filters.maxPrice) return false
        }

        // Filtre par nombre de chambres
        if (filters.minBedrooms && house.nombre_chambres < filters.minBedrooms) {
          return false
        }

        // Filtre par caractéristiques
        if (filters.features) {
          if (filters.features.includes('jardin') && !house.jardin) return false
          if (filters.features.includes('piscine') && !house.piscine) return false
          if (filters.features.includes('garage') && !house.garage) return false
        }

        return true
      })
    }
  }
})

// Fonction getMockHouses() - version avec plus de données
function getMockHouses() {
  console.log('📦 Génération des données mock')
  return [
    {
      id: 1,
      titre: "Villa moderne avec piscine",
      description: "Superbe villa neuve avec piscine et jardin",
      nombre_chambres: 4,
      nombre_salles_bain: 3,
      surface_totale: 250,
      etat: "neuf",
      type_maison: "villa",
      standing: "luxe",
      jardin: true,
      garage: true,
      piscine: true,
      prix_vente: 150000,
      type_offre: "vente",
      statut: "disponible",
      images: [],
      parcelle: {
        id: 1,
        titre: "Terrain résidentiel à Katindo",
        quartier: "Katindo",
        ville: "Goma",
        avenue: "Lumumba",
        numero: "15A"
      },
      proprietaire: null,
      date_creation: "2025-12-01T08:33:02.698Z"
    },
    {
      id: 2,
      titre: "Maison familiale spacieuse",
      description: "Maison parfaite pour une famille, quartier calme",
      nombre_chambres: 5,
      nombre_salles_bain: 3,
      surface_totale: 180,
      etat: "bon_etat",
      type_maison: "traditionnelle",
      standing: "standard",
      jardin: true,
      garage: false,
      piscine: false,
      prix_vente: 95000,
      type_offre: "vente",
      statut: "disponible",
      images: [],
      parcelle: {
        id: 2,
        titre: "Terrain à Mabanga",
        quartier: "Mabanga",
        ville: "Goma",
        avenue: "Kulanga",
        numero: "15A"
      },
      proprietaire: {
        id: 1,
        nom: "Herve IRAGI",
        telephone: null,
        type: "proprietaire"
      },
      date_creation: "2025-12-01T11:20:48.602Z"
    },
    {
      id: 3,
      titre: "Appartement centre-ville",
      description: "Appartement moderne en plein centre-ville",
      nombre_chambres: 3,
      nombre_salles_bain: 2,
      surface_totale: 120,
      etat: "neuf",
      type_maison: "contemporaine",
      standing: "standard",
      jardin: false,
      garage: true,
      piscine: false,
      prix_vente: null,
      prix_location: 500,
      type_offre: "location",
      statut: "disponible",
      images: [],
      parcelle: {
        id: 3,
        titre: "Terrain commercial",
        quartier: "Centre-ville",
        ville: "Goma",
        avenue: "Commerce",
        numero: "42B"
      },
      proprietaire: {
        id: 2,
        nom: "Marie KABUYA",
        telephone: "+243 81 234 5678",
        type: "proprietaire"
      },
      date_creation: "2025-12-01T12:03:21.114Z"
    },
    {
      id: 4,
      titre: "Asta la vista",
      description: "Une maison plus performante",
      nombre_chambres: 7,
      nombre_salles_bain: 2,
      surface_totale: 130,
      etat: "bon_etat",
      type_maison: "contemporaine",
      standing: "standard",
      jardin: false,
      garage: false,
      piscine: false,
      prix_vente: null,
      prix_location: 500,
      type_offre: "location",
      statut: "disponible",
      images: [
        "/uploads/parcelles/parcelle-1764611050774-374405716.PNG",
        "/uploads/parcelles/parcelle-1764611050780-69797789.jpg"
      ],
      parcelle: {
        id: 4,
        titre: "my parcelle",
        quartier: "mabanga sud",
        ville: "goma",
        avenue: "kulanga",
        numero: "15A"
      },
      proprietaire: {
        id: 1,
        nom: "Herve IRAGI",
        telephone: null,
        type: "proprietaire"
      },
      date_creation: "2025-12-01T17:36:16.361Z"
    }
  ]
}
