<template>
  <div class="list-view-container">
    <div class="page-content q-pa-lg">
      <!-- Titre de la page -->
      <div class="page-header q-mb-xl">
        <div class="text-center">
          <h1 class="text-h3 text-weight-bold text-blue-9 q-mb-sm">
            <q-icon name="house" class="q-mr-sm" />
            Maisons à louer
          </h1>
          <p class="text-h6 text-grey-7">
            Trouvez votre prochain logement parmi nos maisons sécurisées par blockchain.
            <span v-if="props.isDemoMode" class="text-amber text-weight-bold q-ml-sm">
              Mode démo (API non disponible)
            </span>
            <span v-else class="text-green text-weight-bold q-ml-sm">
              Données en direct
            </span>
          </p>
        </div>
      </div>

      <!-- Filtres avancés -->
      <div class="filters-section q-mb-lg">
        <q-card class="q-pa-md">
          <div class="row items-center q-col-gutter-md">
            <!-- Recherche -->
            <div class="col-md-3">
              <q-input
                v-model="searchTerm"
                placeholder="Rechercher une maison..."
                dense
                outlined
                clearable
                @update:model-value="applyFilters"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <!-- Ville -->
            <div class="col-md-2">
              <q-select
                v-model="selectedCity"
                :options="availableCities"
                placeholder="Ville"
                dense
                outlined
                clearable
                emit-value
                map-options
                @update:model-value="applyFilters"
              />
            </div>

            <!-- Prix maximum -->
            <div class="col-md-2">
              <q-input
                v-model="maxPrice"
                type="number"
                placeholder="Prix max (€)"
                dense
                outlined
                clearable
                min="0"
                @update:model-value="applyFilters"
              >
                <template v-slot:prepend>
                  <q-icon name="euro" />
                </template>
              </q-input>
            </div>

            <!-- Nombre de chambres -->
            <div class="col-md-2">
              <q-select
                v-model="selectedBedrooms"
                :options="bedroomsOptions"
                placeholder="Chambres"
                dense
                outlined
                clearable
                emit-value
                map-options
                @update:model-value="applyFilters"
              />
            </div>

            <!-- Type de maison -->
            <div class="col-md-2">
              <q-select
                v-model="selectedType"
                :options="availableHouseTypes"
                placeholder="Type"
                dense
                outlined
                clearable
                emit-value
                map-options
                @update:model-value="applyFilters"
              />
            </div>

            <!-- Bouton réinitialiser -->
            <div class="col-md-1">
              <q-btn
                color="grey-7"
                label="Reset"
                icon="refresh"
                class="full-width"
                @click="resetFilters"
              />
            </div>
          </div>

          <!-- Filtres supplémentaires -->
          <div class="row q-mt-md q-col-gutter-sm">
            <div class="col-auto">
              <q-toggle
                v-model="filters.furnished"
                label="Meublé"
                color="blue"
                dense
                @update:model-value="applyFilters"
              />
            </div>
            <div class="col-auto">
              <q-toggle
                v-model="filters.parking"
                label="Parking"
                color="blue"
                dense
                @update:model-value="applyFilters"
              />
            </div>
            <div class="col-auto">
              <q-toggle
                v-model="filters.garden"
                label="Jardin"
                color="blue"
                dense
                @update:model-value="applyFilters"
              />
            </div>
            <div class="col-auto">
              <q-toggle
                v-model="filters.petsAllowed"
                label="Animaux autorisés"
                color="blue"
                dense
                @update:model-value="applyFilters"
              />
            </div>
            <div class="col-auto">
              <q-toggle
                v-model="showOnlyForRent"
                label="Location uniquement"
                color="blue"
                dense
                @update:model-value="applyFilters"
              />
            </div>
          </div>
        </q-card>
      </div>

      <!-- Statistiques -->
      <div class="stats-section q-mb-lg">
        <div class="row q-col-gutter-md">
          <div class="col-md-3 col-6">
            <q-card class="text-center cursor-pointer" @click="showAllHouses">
              <q-card-section>
                <div class="text-h4 text-blue-7">{{ housesStore.total }}</div>
                <div class="text-caption text-grey-7">Total maisons</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3 col-6">
            <q-card class="text-center cursor-pointer" @click="filterForRentOnly">
              <q-card-section>
                <div class="text-h4 text-green-7">{{ housesStore.forRent }}</div>
                <div class="text-caption text-grey-7">À louer</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3 col-6">
            <q-card class="text-center cursor-pointer" @click="showCities">
              <q-card-section>
                <div class="text-h4 text-amber-7">{{ housesStore.cities.length }}</div>
                <div class="text-caption text-grey-7">Villes</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3 col-6">
            <q-card class="text-center cursor-pointer" @click="reloadFromApi">
              <q-card-section>
                <div class="text-h4" :class="props.isDemoMode ? 'text-red-7' : 'text-green-7'">
                  <q-icon :name="props.isDemoMode ? 'wifi_off' : 'wifi'" />
                </div>
                <div class="text-caption text-grey-7">
                  {{ props.isDemoMode ? 'Mode démo' : 'En ligne' }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Liste des maisons -->
      <div>
        <div v-if="filteredHouses.length > 0" class="houses-grid q-mb-xl">
          <!-- Toutes les maisons -->
          <div class="all-houses-section">
            <div class="text-h5 text-blue-9 q-mb-md">
              <q-icon name="house" class="q-mr-sm" />
              Maisons disponibles ({{ filteredHouses.length }})
              <span class="text-caption text-grey-7 q-ml-sm">
                - Cliquez pour voir les détails
              </span>
            </div>

            <!-- Vue Grille -->
            <div v-if="listViewMode === 'grid'" class="grid-container">
              <div class="grid-row">
                <div
                  v-for="house in filteredHouses"
                  :key="house.id"
                  class="grid-item"
                  @click="viewHouseDetails(house)"
                >
                  <q-card class="house-card">
                    <q-img
                      :src="getHouseImage(house)"
                      :alt="house.name"
                      ratio="1"
                      class="house-image"
                    >
                      <div class="absolute-top text-subtitle2">
                        <q-badge v-if="house.etat" :color="getEtatColor(house.etat)" class="q-ml-sm">
                          {{ formatEtat(house.etat) }}
                        </q-badge>
                        <q-badge v-if="house.type_offre === 'location'" color="blue" class="q-ml-sm">
                          À louer
                        </q-badge>
                        <q-badge v-else-if="house.type_offre === 'vente'" color="green" class="q-ml-sm">
                          À vendre
                        </q-badge>
                      </div>
                    </q-img>

                    <q-card-section>
                      <div class="text-h6 text-weight-bold">{{ house.name }}</div>
                      <div class="text-caption text-grey-7 q-mb-sm">
                        <q-icon name="location_on" size="xs" />
                        {{ house.location }}
                      </div>
                      <div class="text-h6 text-blue-7 text-weight-bold q-mt-sm">
                        {{ formatPrice(house.price || house.original.prix_location) }}
                      </div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                      <div class="row items-center">
                        <div class="col">
                          <q-icon name="bed" size="sm" class="q-mr-xs" />
                          <span class="text-caption">{{ house.original.nombre_chambres || 0 }} ch.</span>
                        </div>
                        <div class="col">
                          <q-icon name="bathtub" size="sm" class="q-mr-xs" />
                          <span class="text-caption">{{ house.original.nombre_salles_bain || 0 }} sdb</span>
                        </div>
                        <div class="col">
                          <q-icon name="square_foot" size="sm" class="q-mr-xs" />
                          <span class="text-caption">{{ house.original.surface_totale || 0 }} m²</span>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>

            <!-- Vue Liste -->
            <div v-else class="list-view q-mt-lg">
              <q-list bordered separator class="rounded-borders">
                <q-item
                  v-for="house in filteredHouses"
                  :key="house.id"
                  clickable
                  v-ripple
                  class="q-mb-sm house-list-item"
                  @click="viewHouseDetails(house)"
                >
                  <q-item-section avatar>
                    <q-avatar size="60px" rounded>
                      <q-img
                        :src="getHouseImage(house)"
                        :alt="house.name"
                        ratio="1"
                        class="rounded-borders"
                      />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-bold text-blue-9">
                      {{ house.name }}
                      <q-badge v-if="house.type_offre === 'location'" color="blue" class="q-ml-sm">
                        Location
                      </q-badge>
                      <q-badge v-else-if="house.type_offre === 'vente'" color="green" class="q-ml-sm">
                        Vente
                      </q-badge>
                      <q-badge :color="getEtatColor(house.etat)" class="q-ml-sm">
                        {{ formatEtat(house.etat) }}
                      </q-badge>
                    </q-item-label>
                    <q-item-label caption lines="2">
                      <div class="row items-center q-gutter-sm">
                        <div>
                          <q-icon name="location_on" size="xs" />
                          {{ house.location }}
                        </div>
                        <div>•</div>
                        <div>
                          <q-icon name="bed" size="xs" />
                          {{ house.original.nombre_chambres || 0 }} chambres
                        </div>
                        <div>•</div>
                        <div>
                          <q-icon name="square_foot" size="xs" />
                          {{ house.original.surface_totale || 0 }} m²
                        </div>
                      </div>
                      <div class="q-mt-xs">
                        {{ house.description }}
                      </div>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="text-right">
                      <div class="text-h6 text-blue-7 text-weight-bold">
                        {{ formatPrice(house.price || house.original.prix_location) }}
                      </div>
                      <div class="text-caption text-grey-7">
                        {{ house.standing || 'Standard' }}
                      </div>
                      <div class="q-mt-xs">
                        <q-badge :color="getTypeColor(house.type_maison)">
                          {{ formatTypeMaison(house.type_maison) }}
                        </q-badge>
                      </div>
                    </div>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                      round
                      flat
                      color="blue-7"
                      icon="chevron_right"
                      @click.stop="viewHouseDetails(house)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>

          <!-- Toggle pour changer la vue (grille/liste) -->
          <div class="view-toggle q-mt-lg text-center">
            <q-btn-toggle
              v-model="listViewMode"
              toggle-color="blue-7"
              :options="[
                { label: 'Grille', value: 'grid', icon: 'grid_view' },
                { label: 'Liste', value: 'list', icon: 'view_list' }
              ]"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination-section q-mt-lg">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :max-pages="6"
              direction-links
              boundary-links
              color="blue-7"
              active-color="blue-9"
            />
          </div>
        </div>

        <div v-else class="empty-state q-pa-xl text-center">
          <q-icon name="house" size="xl" color="grey-4" class="q-mb-sm" />
          <div class="text-h5 text-grey-6 q-mb-sm">Aucune maison trouvée</div>
          <div class="text-body1 text-grey-5 q-mb-md">
            Aucune maison ne correspond à vos critères de recherche.
          </div>
          <q-btn
            color="blue-7"
            label="Réinitialiser les filtres"
            @click="resetFilters"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePropertiesStore } from 'src/stores/properties'
import { useQuasar } from 'quasar'

const props = defineProps({
  isDemoMode: Boolean,
  reloadFromApi: Function
})

const emit = defineEmits(['view-house-details'])

// Store
const propertiesStore = usePropertiesStore()
const $q = useQuasar()

// États
const listViewMode = ref('grid') // 'grid' ou 'list'
const searchTerm = ref('')
const selectedCity = ref(null)
const selectedType = ref(null)
const selectedBedrooms = ref(null)
const maxPrice = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(12)
const showOnlyForRent = ref(true)

// Filtres
const filters = ref({
  furnished: false,
  parking: false,
  garden: false,
  petsAllowed: false
})

// Computed properties
const allHouses = computed(() => propertiesStore.formattedHouses || [])
const housesStore = computed(() => propertiesStore.stats || { total: 0, forRent: 0, cities: [] })

const availableCities = computed(() => {
  const cities = [...new Set(allHouses.value.map(h => h.location))].filter(Boolean)
  return cities.map(city => ({ label: city, value: city }))
})

const availableHouseTypes = computed(() => {
  const types = new Set()
  allHouses.value.forEach(house => {
    if (house.type_maison) {
      types.add(house.type_maison)
    }
  })
  return Array.from(types).map(type => ({
    label: formatTypeMaison(type),
    value: type
  }))
})

const bedroomsOptions = [
  { label: 'Studio', value: 0 },
  { label: '1 chambre', value: 1 },
  { label: '2 chambres', value: 2 },
  { label: '3 chambres', value: 3 },
  { label: '4+ chambres', value: 4 }
]

// Maisons filtrées
const filteredHouses = computed(() => {
  let filtered = allHouses.value

  // Filtrer par type d'offre (location uniquement par défaut)
  if (showOnlyForRent.value) {
    filtered = filtered.filter(h => h.type_offre === 'location')
  }

  // Filtrer par ville
  if (selectedCity.value) {
    filtered = filtered.filter(h => 
      h.location.toLowerCase().includes(selectedCity.value.toLowerCase())
    )
  }

  // Filtrer par type de maison
  if (selectedType.value) {
    filtered = filtered.filter(h => h.type_maison === selectedType.value)
  }

  // Filtrer par nombre de chambres
  if (selectedBedrooms.value !== null) {
    if (selectedBedrooms.value === 4) {
      filtered = filtered.filter(h => (h.original.nombre_chambres || 0) >= 4)
    } else {
      filtered = filtered.filter(h => h.original.nombre_chambres === selectedBedrooms.value)
    }
  }

  // Filtrer par prix maximum
  if (maxPrice.value) {
    filtered = filtered.filter(h => {
      const price = h.original.prix_location || h.original.prix_vente || 0
      return price <= parseInt(maxPrice.value)
    })
  }

  // Filtrer par recherche textuelle
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(h =>
      h.name?.toLowerCase().includes(term) ||
      h.description?.toLowerCase().includes(term) ||
      h.location?.toLowerCase().includes(term) ||
      h.original.titre?.toLowerCase().includes(term)
    )
  }

  // Filtrer par caractéristiques
  if (filters.value.garden) {
    filtered = filtered.filter(h => h.original.jardin === true)
  }
  if (filters.value.parking) {
    filtered = filtered.filter(h => h.original.garage === true)
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(allHouses.value.length / itemsPerPage.value)
})

// Méthodes utilitaires
const getHouseImage = (house) => {
  return house.image || '/images/default-house.jpg'
}

const formatEtat = (etat) => {
  if (!etat) return 'Non spécifié'
  const map = {
    'neuf': 'Neuf',
    'bon_etat': 'Bon état',
    'renovation': 'À rénover',
    'ancien': 'Ancien'
  }
  return map[etat] || etat
}

const getEtatColor = (etat) => {
  if (!etat) return 'grey'
  const map = {
    'neuf': 'green',
    'bon_etat': 'blue',
    'renovation': 'orange',
    'ancien': 'grey'
  }
  return map[etat] || 'grey'
}

const formatTypeMaison = (type) => {
  if (!type) return 'Non spécifié'
  const map = {
    'villa': 'Villa',
    'traditionnelle': 'Traditionnelle',
    'contemporaine': 'Contemporaine',
    'moderne': 'Moderne',
    'pavillon': 'Pavillon'
  }
  return map[type] || type
}

const getTypeColor = (type) => {
  if (!type) return 'grey'
  const colors = {
    'villa': 'amber',
    'traditionnelle': 'brown',
    'contemporaine': 'blue',
    'moderne': 'purple',
    'pavillon': 'green'
  }
  return colors[type] || 'grey'
}

const formatPrice = (price) => {
  if (!price) return '0 €'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

// Méthodes d'action
const viewHouseDetails = (house) => {
  emit('view-house-details', house)
}

const applyFilters = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  searchTerm.value = ''
  selectedCity.value = null
  selectedType.value = null
  selectedBedrooms.value = null
  maxPrice.value = null
  filters.value = {
    furnished: false,
    parking: false,
    garden: false,
    petsAllowed: false
  }
  showOnlyForRent.value = true
  currentPage.value = 1
  $q.notify({
    message: 'Filtres réinitialisés',
    color: 'blue',
    icon: 'refresh'
  })
}

const showAllHouses = () => {
  resetFilters()
  showOnlyForRent.value = false
  $q.notify({
    message: 'Affichage de toutes les maisons',
    color: 'info',
    icon: 'house'
  })
}

const filterForRentOnly = () => {
  showOnlyForRent.value = true
  applyFilters()
  $q.notify({
    message: 'Affichage des maisons à louer uniquement',
    color: 'blue',
    icon: 'real_estate_agent'
  })
}

const showCities = () => {
  const citiesList = availableCities.value.map(c => c.label).join(', ')
  $q.dialog({
    title: 'Villes disponibles',
    message: `Maisons disponibles dans : ${citiesList}`,
    ok: {
      label: 'OK',
      color: 'blue'
    }
  })
}
</script>

<style scoped>
.list-view-container {
  background-color: #f8f9fa;
}

.page-content {
  padding-top: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  padding: 2rem 0;
  background: linear-gradient(135deg, #f0f7ff 0%, #e3f2fd 100%);
  border-radius: 16px;
  margin: 0 1rem;
}

.filters-section .q-card {
  border-radius: 12px;
  border-left: 4px solid var(--q-primary);
  box-shadow: 0 4px 20px rgba(33, 150, 243, 0.1);
}

.stats-section .q-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  border-top: 3px solid;
}

.stats-section .q-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.stats-section .q-card:nth-child(1) {
  border-color: #1976d2;
}

.stats-section .q-card:nth-child(2) {
  border-color: #388e3c;
}

.stats-section .q-card:nth-child(3) {
  border-color: #f57c00;
}

.stats-section .q-card:nth-child(4) {
  border-color: #d32f2f;
}

.houses-grid {
  margin-top: 2rem;
}

.grid-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.grid-item {
  min-height: 350px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-8px);
}

.house-card {
  height: 100%;
  transition: all 0.3s ease;
}

.house-card:hover {
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.house-image {
  height: 200px;
  object-fit: cover;
}

/* Vue Liste */
.house-list-item {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  border-radius: 8px;
}

.house-list-item:hover {
  background-color: #e3f2fd;
  transform: translateX(5px);
  border-left-color: #1976d2;
}

.view-toggle {
  margin-top: 20px;
}

.pagination-section {
  display: flex;
  justify-content: center;
}

.empty-state {
  border: 2px dashed #E0E0E0;
  border-radius: 16px;
  background: #FAFAFA;
  margin: 0 1rem;
}

/* Responsive */
@media (max-width: 992px) {
  .grid-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters-section .row > div {
    margin-bottom: 10px;
  }
}

@media (max-width: 768px) {
  .grid-row {
    grid-template-columns: 1fr;
  }
  
  .filters-section .row {
    flex-direction: column;
  }
  
  .filters-section .row > div {
    width: 100%;
  }
  
  .page-content {
    padding: 10px;
  }
  
  .page-header {
    padding: 1.5rem 0;
    margin: 0;
  }
  
  .house-list-item {
    flex-direction: column;
  }
  
  .house-list-item .q-item-section.side {
    align-self: stretch;
    text-align: right;
  }
  
  .stats-section .row {
    flex-wrap: wrap;
  }
  
  .stats-section .col-md-3 {
    width: 50%;
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .stats-section .col-md-3 {
    width: 100%;
  }
  
  .house-list-item .q-item-section.avatar {
    align-self: center;
    margin-bottom: 10px;
  }
}
</style>