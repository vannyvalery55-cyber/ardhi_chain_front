import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const usePropertiesStore = defineStore('properties', {
  state: () => ({
    houses: [],
    housesLoading: false,
    housesError: null,
    housesPagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      count: 0
    }
  }),

  getters: {
    // Getter principal pour les propriétés formatées
    formattedProperties: (state) => {
      return state.houses.map(house => ({
        id: house.id,
        name: house.titre,
        description: house.description || 'Aucune description disponible',
        location: house.parcelle ?
          `${house.parcelle.quartier || ''}, ${house.parcelle.ville || ''}`.trim() :
          'Localisation non spécifiée',
        area: `${house.surface_totale} m²`,
        price: house.prix_vente ?
          `$${house.prix_vente.toLocaleString()}` :
          house.prix_location ?
            `$${house.prix_location}/mois` :
            'Non spécifié',
        category: 'Maison',
        image: house.images && house.images.length > 0 ?
          `http://localhost:3000${house.images[0]}` :
          '/images/default-house.jpg',
        features: [
          ...(house.jardin ? ['Jardin'] : []),
          ...(house.piscine ? ['Piscine'] : []),
          ...(house.garage ? ['Garage'] : []),
          ...(house.nombre_chambres > 0 ? [`${house.nombre_chambres} chambres`] : []),
          ...(house.nombre_salles_bain > 0 ? [`${house.nombre_salles_bain} salles de bain`] : [])
        ].slice(0, 3),
        type_offre: house.type_offre,
        standing: house.standing,
        etat: house.etat,
        type_maison: house.type_maison,
        original: house
      }))
    },

    // Alias pour compatibilité
    formattedHouses: (state) => state.formattedProperties,

    allProperties: (state) => state.formattedProperties
  },

  actions: {
    // Méthode principale - celle que vous appelez depuis App.vue
    async fetchProperties(params = {}) {
      return await this.fetchHouses(params)
    },

     async loadMockData() {
    console.log('🔄 Chargement des données mock depuis le store')
    this.houses = getMockHouses()
    this.housesLoading = false
    this.housesError = 'Mode démonstration - Données locales'

    // Simuler un petit délai
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`✅ ${this.houses.length} maisons mock chargées`)
        resolve(this.houses)
      }, 500)
    })
  },

    // Méthode interne pour charger les maisons
    async fetchHouses(params = {}) {
      this.housesLoading = true
      this.housesError = null

      try {
        console.log('Chargement des maisons depuis API...')

        // Pour éviter l'erreur 500, testez d'abord avec un timeout court
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await api.get('/api/maisons', {
          params,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        console.log('Réponse API reçue:', response.status)
        this.houses = response.data.data || []

        this.housesPagination = {
          page: response.data.page || 1,
          totalPages: response.data.totalPages || 1,
          total: response.data.total || this.houses.length,
          count: response.data.count || this.houses.length
        }

        console.log(`${this.houses.length} maisons chargées`)
        return this.houses

      } catch (err) {
        console.error('Erreur fetchHouses:', {
          message: err.message,
          name: err.name,
          code: err.code
        })

        // Fallback avec données mock
        console.warn('Utilisation des données de démonstration')
        this.houses = getMockHouses()
        this.housesError = `API indisponible: ${err.message}. Données de démo chargées.`

        return this.houses
      } finally {
        this.housesLoading = false
      }
    }
  }
})

// Données mock pour le développement
function getMockHouses() {
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
      prix_location: null,
      type_offre: "vente",
      statut: "disponible",
      images: [],
      parcelle: {
        id: 1,
        quartier: "Katindo",
        ville: "Goma",
        avenue: "Lumumba",
        numero: "15A"
      },
      proprietaire: null
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
      prix_location: null,
      type_offre: "vente",
      statut: "disponible",
      images: [],
      parcelle: {
        id: 2,
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
      }
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
      }
    }
  ]
}
