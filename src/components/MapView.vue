<template>
  <div class="map-view-container">
    <!-- Map avec contrôle -->
    <div v-if="!loading && !error" class="map-controls">
      <div class="row items-center justify-between q-mb-sm">
        <div class="col">
          <div class="text-subtitle2 text-deep-purple-9 text-weight-bold">
            <q-icon name="map" class="q-mr-sm" />
            Carte Interactive des Biens Immobiliers - Goma
          </div>
        </div>
        <div class="col-auto">
          <q-btn-group outline class="q-mr-sm">
            <q-btn
              @click="filterProperties('all')"
              :color="activeFilter === 'all' ? 'primary' : 'grey-7'"
              label="Tous"
              size="sm"
            />
            <q-btn
              @click="filterProperties('house')"
              :color="activeFilter === 'house' ? 'primary' : 'grey-7'"
              icon="house"
              size="sm"
            />
            <q-btn
              @click="filterProperties('land')"
              :color="activeFilter === 'land' ? 'primary' : 'grey-7'"
              icon="landscape"
              size="sm"
            />
          </q-btn-group>

          <q-btn
            @click="centerOnGoma"
            size="sm"
            color="secondary"
            outline
            icon="gps_fixed"
            label="Centrer Goma"
            class="q-mr-sm"
          />

          <q-btn
            @click="showAllProperties"
            size="sm"
            color="primary"
            outline
            icon="zoom_out_map"
            label="Tout voir"
          />
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="map-placeholder text-center q-pa-xl bg-grey-3 rounded-borders">
      <q-spinner color="primary" size="3em" />
      <div class="text-h6 text-grey-7 q-mt-md">Chargement de la carte...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="map-placeholder text-center q-pa-xl bg-grey-3 rounded-borders">
      <q-icon name="error_outline" size="xl" color="red-7" class="q-mb-sm" />
      <div class="text-h6 text-grey-7">Erreur de chargement de la carte</div>
      <div class="text-caption text-grey-6 q-mb-md">Assurez-vous d'être connecté à Internet</div>
      <q-btn @click="retryLoadMap" color="primary" label="Réessayer" class="q-mt-md" />
    </div>

    <!-- Map container - TOUJOURS présent dans le DOM -->
    <div
      v-show="!loading && !error"
      id="ardhi-chain-map"
      class="ardhi-map"
      ref="mapContainer"
    ></div>

    <!-- Statistiques -->
    <div v-if="!loading && !error" class="q-mt-md">
      <div class="row text-center q-gutter-md">
        <div class="col">
          <div class="text-h6 text-primary">{{ displayedProperties.length }}</div>
          <div class="text-caption text-grey-7">Biens affichés</div>
        </div>
        <div class="col">
          <div class="text-h6 text-green">{{ avgPriceFormatted }}</div>
          <div class="text-caption text-grey-7">Prix moyen</div>
        </div>
        <div class="col">
          <div class="text-h6 text-orange">{{ propertiesInGoma }}</div>
          <div class="text-caption text-grey-7">Biens à Goma</div>
        </div>
        <div class="col">
          <div class="text-h6 text-teal">{{ propertiesForSale }}</div>
          <div class="text-caption text-grey-7">À vendre</div>
        </div>
      </div>
    </div>

    <!-- Légende -->
    <div v-if="!loading && !error" class="q-mt-sm">
      <div class="text-caption text-grey-8 q-mb-xs">Légende :</div>
      <div class="row items-center q-gutter-md">
        <div class="row items-center">
          <div class="legend-circle house"></div>
          <span class="text-caption q-ml-xs">Maisons</span>
        </div>
        <div class="row items-center">
          <div class="legend-circle apartment"></div>
          <span class="text-caption q-ml-xs">Appartements</span>
        </div>
        <div class="row items-center">
          <div class="legend-circle land"></div>
          <span class="text-caption q-ml-xs">Terrains</span>
        </div>
        <div class="row items-center">
          <div class="legend-circle commercial"></div>
          <span class="text-caption q-ml-xs">Commerces</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

// Déclarer L globalement pour ESLint

// Props du composant
const props = defineProps({
  houses: {
    type: Array,
    default: () => []
  },
  parcels: {
    type: Array,
    default: () => []
  }
})

// États
const loading = ref(true)
const error = ref(false)
const activeFilter = ref('all')
const mapInstance = ref(null)
const markersLayer = ref(null)
const allMarkers = ref([])
const mapContainer = ref(null) // Référence au conteneur de la carte

// Coordonnées de Goma
const gomaCoords = [-1.6741, 29.2285]

// Couleurs par type
const typeColors = {
  house: '#4CAF50',      // Vert - Maisons
  apartment: '#2196F3',  // Bleu - Appartements
  commercial: '#FF9800', // Orange - Commerces
  land: '#795548',       // Marron - Terrains
  villa: '#9C27B0'       // Violet - Villas
}

// Transforme les propriétés du store en format pour la carte
const propertiesForMap = computed(() => {
  const properties = []

  // Traiter les maisons
  props.houses.forEach(house => {
    const type = house.type_maison?.toLowerCase() || 'house'
    const mapType = type.includes('appartement') ? 'apartment' :
                   type.includes('villa') ? 'villa' : 'house'

    properties.push({
      id: house.id,
      title: house.name || 'Propriété sans nom',
      type: mapType,
      price: parseFloat(house.price) || 0,
      surface: parseInt(house.superficie) || 0,
      bedrooms: parseInt(house.nbr_chambres) || 0,
      bathrooms: parseInt(house.nbr_salles) || 0,
      status: house.type_offre === 'vente' ? 'available' : 'sold',
      coords: getPropertyCoords(house),
      address: house.location || 'Adresse non spécifiée',
      description: house.description || 'Aucune description',
      ville: house.original?.parcelle?.ville || 'Goma',
      quartier: house.quartier || 'Non spécifié',
      original: house
    })
  })

  // Traiter les parcelles
  props.parcels.forEach(parcel => {
    properties.push({
      id: `land-${parcel.id}`,
      title: parcel.name || 'Parcelle',
      type: 'land',
      price: parseFloat(parcel.prix) || 0,
      surface: parseInt(parcel.superficie) || 0,
      bedrooms: 0,
      bathrooms: 0,
      status: parcel.statut === 'disponible' ? 'available' : 'sold',
      coords: getParcelCoords(parcel),
      address: parcel.location || 'Adresse non spécifiée',
      description: parcel.description || 'Parcelle disponible',
      ville: parcel.ville || 'Goma',
      quartier: parcel.quartier || 'Non spécifié',
      original: parcel
    })
  })

  return properties
})

// Propriétés filtrées selon le filtre actif
const displayedProperties = computed(() => {
  if (activeFilter.value === 'all') {
    return propertiesForMap.value
  }

  if (activeFilter.value === 'house') {
    return propertiesForMap.value.filter(p =>
      p.type === 'house' || p.type === 'apartment' || p.type === 'villa'
    )
  }

  if (activeFilter.value === 'land') {
    return propertiesForMap.value.filter(p => p.type === 'land')
  }

  return propertiesForMap.value
})

// Statistiques
const avgPriceFormatted = computed(() => {
  if (displayedProperties.value.length === 0) return '0 $'
  const total = displayedProperties.value.reduce((sum, prop) => sum + prop.price, 0)
  const avg = Math.round(total / displayedProperties.value.length)
  return avg.toLocaleString() + ' $'
})

const propertiesInGoma = computed(() => {
  return displayedProperties.value.filter(p =>
    p.ville.toLowerCase().includes('goma') ||
    p.ville.toLowerCase().includes('goma')
  ).length
})

const propertiesForSale = computed(() => {
  return displayedProperties.value.filter(p => p.status === 'available').length
})

// Générer des coordonnées aléatoires autour de Goma (pour la démo)
function getPropertyCoords(property) {
  // Si vous avez des coordonnées GPS réelles, utilisez-les
  if (property.latitude && property.longitude) {
    return [parseFloat(property.latitude), parseFloat(property.longitude)]
  }

  // Sinon, générer des coordonnées aléatoires autour de Goma
  const lat = gomaCoords[0] + (Math.random() * 0.03 - 0.015)
  const lng = gomaCoords[1] + (Math.random() * 0.03 - 0.015)
  return [lat, lng]
}

function getParcelCoords(parcel) {
  // Même logique pour les parcelles
  if (parcel.latitude && parcel.longitude) {
    return [parseFloat(parcel.latitude), parseFloat(parcel.longitude)]
  }

  const lat = gomaCoords[0] + (Math.random() * 0.04 - 0.02)
  const lng = gomaCoords[1] + (Math.random() * 0.04 - 0.02)
  return [lat, lng]
}

// Vérifier si Leaflet est déjà chargé
const isLeafletLoaded = () => {
  return typeof window.L !== 'undefined'
}

// Charger les ressources Leaflet
const loadLeafletResources = () => {
  return new Promise((resolve, reject) => {
    // Vérifier si déjà chargé
    if (isLeafletLoaded()) {
      resolve()
      return
    }

    // Vérifier si le CSS est déjà chargé
    const existingCss = document.querySelector('link[href*="leaflet"]')
    if (!existingCss) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.crossOrigin = ''
      link.onload = () => console.log('✅ Leaflet CSS chargé')
      link.onerror = (err) => {
        console.error('❌ Erreur chargement CSS Leaflet:', err)
        reject(new Error('Erreur chargement CSS Leaflet'))
      }
      document.head.appendChild(link)
    }

    // Vérifier si le JS est déjà chargé
    const existingScript = document.querySelector('script[src*="leaflet"]')
    if (existingScript) {
      // Attendre que le script soit chargé
      existingScript.onload = () => resolve()
      existingScript.onerror = () => reject(new Error('Erreur chargement JS Leaflet'))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.crossOrigin = ''
    script.onload = () => {
      console.log('✅ Leaflet JS chargé avec succès')
      resolve()
    }
    script.onerror = (err) => {
      console.error('❌ Erreur chargement JS Leaflet:', err)
      reject(new Error('Erreur chargement JS Leaflet'))
    }
    document.head.appendChild(script)
  })
}

// Initialisation de la carte
const initMap = async () => {
  try {
    loading.value = true
    error.value = false

    console.log('🚀 Initialisation de la carte...')

    // Charger Leaflet
    await loadLeafletResources()

    // Attendre un peu pour être sûr que tout est chargé
    await new Promise(resolve => setTimeout(resolve, 300))

    // Vérifier que Leaflet est bien chargé
    if (!isLeafletLoaded()) {
      throw new Error('Leaflet non chargé après tentative')
    }

    console.log('✅ Leaflet chargé')

    // Attendre que le DOM soit prêt et que le conteneur existe
    await nextTick()

    // Utiliser la référence Vue ou chercher par ID
    const mapElement = mapContainer.value || document.getElementById('ardhi-chain-map')

    if (!mapElement) {
      console.error('❌ Élément de carte non trouvé. Conteneur:', mapContainer.value)
      console.error('❌ Recherche par ID:', document.getElementById('ardhi-chain-map'))
      throw new Error('Élément de carte non trouvé')
    }

    console.log('✅ Élément de carte trouvé:', mapElement)

    const L = window.L

    // Vérifier que l'élément est visible et a une taille
    mapElement.style.height = '500px'
    mapElement.style.width = '100%'
    mapElement.style.display = 'block'

    // Créer la carte centrée sur Goma
    mapInstance.value = L.map(mapElement).setView(gomaCoords, 13)
    console.log('✅ Carte Leaflet créée')

    // Ajouter la couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapInstance.value)

    // Créer un layer group pour les marqueurs
    markersLayer.value = L.layerGroup().addTo(mapInstance.value)

    // Ajouter les zones de Goma
    addGomaAreas()

    // Ajouter les marqueurs
    updateMapMarkers()

    // Forcer un redimensionnement
    setTimeout(() => {
      if (mapInstance.value) {
        mapInstance.value.invalidateSize()
      }
    }, 100)

    console.log('✅ Carte entièrement initialisée')
    loading.value = false

  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation de la carte:', err)
    error.value = true
    loading.value = false
  }
}

const addGomaAreas = () => {
  if (!mapInstance.value || !isLeafletLoaded()) return

  const L = window.L

  // Quartiers principaux de Goma (approximatifs)
  const neighborhoods = [
    {
      name: "Centre-ville",
      coords: [[-1.682, 29.225], [-1.672, 29.235]],
      color: '#FFEB3B',
      opacity: 0.2
    },
    {
      name: "Himbi (Lac)",
      coords: [[-1.678, 29.205], [-1.670, 29.215]],
      color: '#03A9F4',
      opacity: 0.2
    },
    {
      name: "Katoyi",
      coords: [[-1.668, 29.212], [-1.660, 29.222]],
      color: '#8BC34A',
      opacity: 0.2
    },
    {
      name: "Birere",
      coords: [[-1.673, 29.240], [-1.665, 29.250]],
      color: '#FF9800',
      opacity: 0.2
    },
    {
      name: "Keshero",
      coords: [[-1.659, 29.198], [-1.650, 29.208]],
      color: '#E91E63',
      opacity: 0.2
    }
  ]

  neighborhoods.forEach(area => {
    L.rectangle(area.coords, {
      color: area.color,
      fillColor: area.color,
      fillOpacity: area.opacity,
      weight: 2
    })
    .addTo(mapInstance.value)
    .bindTooltip(`<strong>${area.name}</strong><br>Quartier de Goma`)
  })

  // Ajouter le Lac Kivu
  L.polygon([
    [-1.690, 29.200],
    [-1.685, 29.190],
    [-1.680, 29.195],
    [-1.675, 29.190],
    [-1.670, 29.195],
    [-1.665, 29.190],
    [-1.660, 29.195]
  ], {
    color: '#2196F3',
    fillColor: '#2196F3',
    fillOpacity: 0.3,
    weight: 1
  })
  .addTo(mapInstance.value)
  .bindTooltip('<strong>Lac Kivu</strong><br>Frontière naturelle')
}

const updateMapMarkers = () => {
  if (!mapInstance.value || !markersLayer.value || !isLeafletLoaded()) return

  const L = window.L

  // Nettoyer les anciens marqueurs
  markersLayer.value.clearLayers()

  // Réinitialiser la liste
  allMarkers.value = []

  // Ajouter les nouveaux marqueurs
  displayedProperties.value.forEach(property => {
    const color = typeColors[property.type] || '#000000'
    const statusColor = property.status === 'available' ? '#4CAF50' :
                       property.status === 'sold' ? '#F44336' : '#FFC107'

    const icon = L.divIcon({
      html: `
        <div style="
          position: relative;
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
        ">
          ${property.type === 'house' ? 'M' :
            property.type === 'apartment' ? 'A' :
            property.type === 'villa' ? 'V' :
            property.type === 'commercial' ? 'C' : 'T'}
          <div style="
            position: absolute;
            bottom: -5px;
            right: -5px;
            width: 16px;
            height: 16px;
            background-color: ${statusColor};
            border-radius: 50%;
            border: 2px solid white;
          "></div>
        </div>
      `,
      className: 'property-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    })

    const marker = L.marker(property.coords, { icon })
      .addTo(markersLayer.value)
      .bindPopup(createPropertyPopup(property))

    allMarkers.value.push(marker)
  })
}

const createPropertyPopup = (property) => {
  const color = typeColors[property.type] || '#000000'
  const statusText = {
    available: 'Disponible',
    sold: 'Vendu',
    reserved: 'Réservé'
  }[property.status] || property.status

  const typeText = {
    house: 'Maison',
    apartment: 'Appartement',
    villa: 'Villa',
    commercial: 'Commerce',
    land: 'Terrain'
  }[property.type] || property.type

  return `
    <div style="min-width: 250px;">
      <div style="color: ${color}; font-weight: bold; font-size: 16px; margin-bottom: 5px;">
        ${property.title}
      </div>
      <div style="background-color: ${property.status === 'available' ? '#4CAF50' : '#F44336'};
                 color: white;
                 padding: 2px 8px;
                 border-radius: 10px;
                 font-size: 12px;
                 display: inline-block;
                 margin-bottom: 10px;">
        ${statusText}
      </div>

      <div style="margin-bottom: 10px;">
        <strong>${property.price.toLocaleString()} $</strong> -
        ${property.surface} m² -
        ${typeText}
      </div>

      <div style="color: #666; font-size: 13px; margin-bottom: 10px;">
        <i class="material-icons" style="vertical-align: middle; font-size: 14px;">location_on</i>
        ${property.quartier}, ${property.ville}
      </div>

      <div style="margin-bottom: 10px; font-size: 13px;">
        ${property.description}
      </div>

      <div style="font-size: 12px; color: #555;">
        ${property.bedrooms > 0 ? `${property.bedrooms} chambres • ` : ''}
        ${property.bathrooms > 0 ? `${property.bathrooms} salles de bain` : ''}
      </div>

      <button onclick="window.dispatchEvent(new CustomEvent('property-selected', { detail: ${JSON.stringify(property)} }))"
              style="margin-top: 10px;
                     background-color: ${color};
                     color: white;
                     border: none;
                     padding: 8px 16px;
                     border-radius: 4px;
                     cursor: pointer;
                     width: 100%;">
        Voir les détails
      </button>
    </div>
  `
}

// Actions
const filterProperties = (type) => {
  activeFilter.value = type
  updateMapMarkers()
}

const centerOnGoma = () => {
  if (mapInstance.value) {
    mapInstance.value.setView(gomaCoords, 13)
  }
}

const showAllProperties = () => {
  if (mapInstance.value && displayedProperties.value.length > 0 && isLeafletLoaded()) {
    const L = window.L
    const markers = displayedProperties.value.map(p => L.marker(p.coords))
    const group = L.featureGroup(markers)
    mapInstance.value.fitBounds(group.getBounds().pad(0.1))
  }
}

const retryLoadMap = () => {
  cleanUpMap()
  loading.value = true
  error.value = false
  initMap()
}

const cleanUpMap = () => {
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }
  markersLayer.value = null
  allMarkers.value = []
}

// Watch pour les changements de propriétés
watch(() => [props.houses, props.parcels], () => {
  if (mapInstance.value) {
    updateMapMarkers()
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  console.log('📌 MapView monté, initialisation de la carte...')
  // Petite pause pour s'assurer que le DOM est prêt
  setTimeout(() => {
    initMap()
  }, 100)
})

onUnmounted(() => {
  console.log('🗑️ MapView démonté, nettoyage de la carte...')
  cleanUpMap()
})
</script>

<style scoped>
.map-view-container {
  width: 100%;
  min-height: 500px;
}

.ardhi-map {
  height: 500px;
  width: 100%;
  border-radius: 8px;
  z-index: 1;
  background-color: #f0f0f0;
}

.map-placeholder {
  height: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.map-controls {
  background: white;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.legend-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.legend-circle.house {
  background-color: #4CAF50;
}

.legend-circle.apartment {
  background-color: #2196F3;
}

.legend-circle.land {
  background-color: #795548;
}

.legend-circle.commercial {
  background-color: #FF9800;
}

/* Responsive */
@media (max-width: 768px) {
  .ardhi-map {
    height: 400px;
  }

  .map-placeholder {
    height: 400px;
  }

  .map-controls {
    padding: 8px;
  }
}

@media (max-width: 576px) {
  .ardhi-map {
    height: 350px;
  }

  .map-placeholder {
    height: 350px;
  }
}
</style>
