<template>
  <q-page class="parcelles-page">
    <!-- En-tête spécifique pour les parcelles -->
    <ParcelleHeader
      :parcelle-name="''"
      :show-chat="false"
      :unread-messages="0"
      @toggle-chat="handleToggleChat"
      @share="handleShare"
      @toggle-favorite="handleToggleFavorite"
      @go-back="handleGoBack"
    />

    <div class="page-content q-pa-lg">
      <!-- Titre de la page -->
      <div class="page-header q-mb-xl">
        <div class="text-center">
          <h1 class="text-h3 text-weight-bold text-green-9 q-mb-sm">
            <q-icon name="landscape" class="q-mr-sm" />
            Terrains et Parcelles
          </h1>
          <p class="text-h6 text-grey-7">
            Explorez nos terrains disponibles à l'achat, sécurisés par la blockchain.
            <span class="text-green text-weight-bold q-ml-sm">
              Connecté en tant que : {{ userTypeLabel }}
            </span>
          </p>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="filters-section q-mb-lg">
        <q-card class="q-pa-md">
          <div class="row items-center q-col-gutter-md">
            <div class="col-md-4">
              <q-input
                v-model="searchTerm"
                placeholder="Rechercher un terrain..."
                dense
                outlined
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div class="col-md-3">
              <q-select
                v-model="selectedCity"
                :options="villes"
                placeholder="Ville"
                dense
                outlined
                clearable
              />
            </div>

            <div class="col-md-3">
              <q-select
                v-model="selectedType"
                :options="typesTerrain"
                placeholder="Type de terrain"
                dense
                outlined
                clearable
              />
            </div>

            <div class="col-md-2">
              <q-btn
                color="green-7"
                label="Filtrer"
                icon="filter_alt"
                class="full-width"
                @click="applyFilters"
              />
            </div>
          </div>
        </q-card>
      </div>

      <!-- Statistiques -->
      <div class="stats-section q-mb-lg">
        <div class="row q-col-gutter-md">
          <div class="col-md-3 col-6">
            <q-card class="text-center" @click="showAllParcelles">
              <q-card-section class="cursor-pointer">
                <div class="text-h4 text-green-7">{{ totalParcelles }}</div>
                <div class="text-caption text-grey-7">Terrains disponibles</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3 col-6">
            <q-card class="text-center" @click="filterAvailable">
              <q-card-section class="cursor-pointer">
                <div class="text-h4 text-amber-7">{{ forSaleCount }}</div>
                <div class="text-caption text-grey-7">À vendre</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3 col-6">
            <q-card class="text-center" @click="filterByCity">
              <q-card-section class="cursor-pointer">
                <div class="text-h4 text-light-blue-7">{{ uniqueCities.length }}</div>
                <div class="text-caption text-grey-7">Villes</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3 col-6">
            <q-card class="text-center" @click="filterByType">
              <q-card-section class="cursor-pointer">
                <div class="text-h4 text-deep-purple-7">{{ typesTerrain.length }}</div>
                <div class="text-caption text-grey-7">Types de terrain</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-gears color="green-6" size="3em" />
        <p class="q-mt-md">Chargement des terrains...</p>
      </div>

      <!-- Liste des parcelles -->
      <div v-else>
        <div v-if="filteredParcelles.length > 0" class="parcelles-grid q-mb-xl">
          <div class="grid-section">
            <div class="text-h5 text-green-9 q-mb-md">
              <q-icon name="landscape" class="q-mr-sm" />
              Terrains disponibles ({{ filteredParcelles.length }})
              <span class="text-caption text-grey-7 q-ml-sm">
                - Cliquez sur une parcelle pour voir les détails complets
              </span>
            </div>

            <!-- Vue Grille -->
            <div class="grid-container">
              <div class="grid-row">
                <div
                  v-for="parcelle in filteredParcelles"
                  :key="parcelle.id"
                  class="grid-item"
                  @click="viewParcelleDetails(parcelle)"
                >
                  <PropertyCardSquare :property="parcelle" />
                </div>
              </div>
            </div>

            <!-- Vue Liste alternative -->
            <div v-if="showListView" class="list-view q-mt-lg">
              <div class="text-h6 text-grey-8 q-mb-md">
                <q-icon name="view_list" class="q-mr-sm" />
                Vue détaillée
              </div>

              <q-list bordered separator class="rounded-borders">
                <q-item
                  v-for="parcelle in filteredParcelles"
                  :key="parcelle.id"
                  clickable
                  v-ripple
                  class="q-mb-sm parcelle-list-item"
                  @click="viewParcelleDetails(parcelle)"
                >
                  <q-item-section avatar>
                    <q-avatar>
                      <q-img
                        :src="getParcelleImage(parcelle)"
                        :alt="parcelle.name"
                        ratio="1"
                        class="rounded-borders"
                      />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ parcelle.name }}</q-item-label>
                    <q-item-label caption lines="2">
                      {{ parcelle.description }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="text-right">
                      <div class="text-h6 text-green-7 text-weight-bold">
                        {{ parcelle.priceFormatted || parcelle.price }}
                      </div>
                      <div class="text-caption text-grey-7">
                        {{ parcelle.superficie }} m² • {{ parcelle.ville }}
                      </div>
                      <q-badge :color="getStatusColor(parcelle.statut)">
                        {{ parcelle.statut || 'Disponible' }}
                      </q-badge>
                    </div>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                      round
                      flat
                      color="green-7"
                      icon="chevron_right"
                      @click.stop="viewParcelleDetails(parcelle)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- Toggle pour changer la vue -->
            <div class="view-toggle q-mt-lg text-center">
              <q-btn-toggle
                v-model="viewMode"
                toggle-color="green-7"
                :options="[
                  { label: 'Grille', value: 'grid', icon: 'grid_view' },
                  { label: 'Liste', value: 'list', icon: 'view_list' }
                ]"
              />
            </div>
          </div>
        </div>

        <div v-else class="empty-state q-pa-xl text-center">
          <q-icon name="landscape" size="xl" color="grey-4" class="q-mb-sm" />
          <div class="text-h5 text-grey-6 q-mb-sm">Aucun terrain trouvé</div>
          <div class="text-body1 text-grey-5 q-mb-md">
            Aucun terrain ne correspond à vos critères de recherche.
          </div>
          <q-btn
            color="green-7"
            label="Réinitialiser les filtres"
            @click="resetFilters"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useParcellesStore } from 'src/stores/parcelles'
import { useAuthStore } from 'src/stores/auth'
import PropertyCardSquare from 'src/components/PropertyCardSquare.vue'
import ParcelleHeader from 'src/components/parcelles/ParcelleHeader.vue'

// Router et Stores
const router = useRouter()
const parcellesStore = useParcellesStore()
const authStore = useAuthStore()

// États
const loading = ref(true)
const searchTerm = ref('')
const selectedCity = ref(null)
const selectedType = ref(null)
const viewMode = ref('grid')

// Computed properties
const allParcelles = computed(() => {
  return parcellesStore.formattedParcelles || []
})

const villes = computed(() => {
  return parcellesStore.villes || []
})

const typesTerrain = computed(() => {
  return parcellesStore.typesTerrain || []
})

const userTypeLabel = computed(() => {
  const user = authStore.user || authStore.currentUser
  if (!user || !user.type) return 'Utilisateur'
  return user.type.charAt(0).toUpperCase() + user.type.slice(1)
})

const filteredParcelles = computed(() => {
  let filtered = allParcelles.value

  // Filtrer par ville
  if (selectedCity.value) {
    filtered = filtered.filter(p => p.ville === selectedCity.value)
  }

  // Filtrer par type
  if (selectedType.value) {
    filtered = filtered.filter(p => p.type === selectedType.value)
  }

  // Filtrer par recherche
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.location?.toLowerCase().includes(term) ||
      p.ville?.toLowerCase().includes(term) ||
      p.quartier?.toLowerCase().includes(term)
    )
  }

  return filtered
})

const totalParcelles = computed(() => {
  return allParcelles.value.length
})

const forSaleCount = computed(() => {
  return allParcelles.value.filter(p => p.statut === 'disponible').length
})

const uniqueCities = computed(() => {
  const cities = new Set(allParcelles.value.map(p => p.ville).filter(Boolean))
  return Array.from(cities)
})

const showListView = computed(() => {
  return viewMode.value === 'list'
})

// Voir les détails d'une parcelle
const viewParcelleDetails = (parcelle) => {
  console.log('Navigation vers détails parcelle:', parcelle.id)
  router.push(`/parcelle/${parcelle.id}`)
}

// Obtenir l'image d'une parcelle
const getParcelleImage = (parcelle) => {
  return parcelle.image ||
         parcelle.images?.[0] ||
         'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
}

// Obtenir la couleur du statut
const getStatusColor = (statut) => {
  if (!statut) return 'grey'

  switch(statut.toLowerCase()) {
    case 'disponible': return 'green'
    case 'vendu': return 'red'
    case 'réservé': return 'amber'
    case 'indisponible': return 'orange'
    default: return 'grey'
  }
}

// Filtres interactifs
const showAllParcelles = () => {
  resetFilters()
}

const filterAvailable = () => {
  searchTerm.value = ''
  selectedCity.value = null
  selectedType.value = null
  // Ajoutez ici la logique pour filtrer seulement les disponibles
}

const filterByCity = () => {
  // Logique pour filtrer par ville
}

const filterByType = () => {
  // Logique pour filtrer par type
}

// Méthodes pour ParcelleHeader
const handleToggleChat = () => {
  console.log('Chat toggled')
}

const handleShare = () => {
  console.log('Partage de la page des terrains')
  if (navigator.share) {
    navigator.share({
      title: 'Terrains disponibles - ARDHI-CHAIN',
      text: 'Découvrez nos terrains sécurisés par blockchain',
      url: window.location.href
    })
  }
}

const handleToggleFavorite = (isFavorite) => {
  console.log('Favori:', isFavorite ? 'ajouté' : 'retiré')
}

const handleGoBack = () => {
  router.push('/')
}

// Méthodes existantes
const applyFilters = () => {
  console.log('Filtres appliqués:', {
    ville: selectedCity.value,
    type: selectedType.value,
    search: searchTerm.value
  })
}

const resetFilters = () => {
  searchTerm.value = ''
  selectedCity.value = null
  selectedType.value = null
}

// Chargement initial
onMounted(async () => {
  try {
    loading.value = true
    await parcellesStore.fetchParcelles()

    // Vérifier si l'utilisateur est connecté (pour info)
    if (authStore.initialize) {
      await authStore.initialize()
    }

    console.log('Utilisateur connecté:', {
      isAuthenticated: authStore.isAuthenticated,
      userType: authStore.user?.type || authStore.currentUser?.type
    })

  } catch (error) {
    console.error('Erreur chargement parcelles:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.parcelles-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-content {
  padding-top: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  padding: 2rem 0;
}

.filters-section .q-card {
  border-radius: 12px;
  border-left: 4px solid var(--q-positive);
}

.stats-section .q-card {
  border-radius: 12px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.stats-section .q-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.parcelles-grid {
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
  transform: translateY(-5px);
}

/* Vue Liste */
.parcelle-list-item {
  transition: all 0.3s ease;
}

.parcelle-list-item:hover {
  background-color: #f0f7f0;
  transform: translateX(5px);
}

.view-toggle {
  margin-top: 20px;
}

.empty-state {
  border: 2px dashed #E0E0E0;
  border-radius: 16px;
  background: #FAFAFA;
}

/* Badge de statut amélioré */
.q-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 992px) {
  .grid-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .list-view .q-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .list-view .q-item-section.side {
    align-self: flex-end;
    margin-top: 10px;
  }
}

@media (max-width: 768px) {
  .grid-row {
    grid-template-columns: 1fr;
  }

  .filters-section .row {
    flex-direction: column;
  }

  .filters-section .col-md-2,
  .filters-section .col-md-3,
  .filters-section .col-md-4 {
    width: 100%;
  }

  .page-content {
    padding: 15px;
  }

  .page-header {
    padding: 1.5rem 0;
  }

  .stats-section .row {
    flex-wrap: wrap;
  }

  .stats-section .col-md-3 {
    width: 50%;
    margin-bottom: 10px;
  }
}
</style>
