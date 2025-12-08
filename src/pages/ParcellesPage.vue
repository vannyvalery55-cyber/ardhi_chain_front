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
            Explorez nos terrains disponibles à l'achat, sécurisés par la blockchain
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
            <q-card class="text-center">
              <q-card-section>
                <div class="text-h4 text-green-7">{{ totalParcelles }}</div>
                <div class="text-caption text-grey-7">Terrains disponibles</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3 col-6">
            <q-card class="text-center">
              <q-card-section>
                <div class="text-h4 text-amber-7">{{ forSaleCount }}</div>
                <div class="text-caption text-grey-7">À vendre</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3 col-6">
            <q-card class="text-center">
              <q-card-section>
                <div class="text-h4 text-light-blue-7">{{ uniqueCities.length }}</div>
                <div class="text-caption text-grey-7">Villes</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3 col-6">
            <q-card class="text-center">
              <q-card-section>
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
            </div>

            <div class="grid-container">
              <div class="grid-row">
                <div
                  v-for="parcelle in filteredParcelles"
                  :key="parcelle.id"
                  class="grid-item"
                >
                  <PropertyCardSquare :property="parcelle" />
                </div>
              </div>
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
import PropertyCardSquare from 'src/components/PropertyCardSquare.vue'
import ParcelleHeader from 'src/components/parcelles/ParcelleHeader.vue'

// Router et Store
const router = useRouter()
const parcellesStore = useParcellesStore()

// États
const loading = ref(true)
const searchTerm = ref('')
const selectedCity = ref(null)
const selectedType = ref(null)

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

// Méthodes pour ParcelleHeader
const handleToggleChat = () => {
  console.log('Chat toggled - cette fonctionnalité est disponible sur la page de détails')
  // Vous pouvez rediriger vers une page de chat général si nécessaire
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
  // Logique pour gérer les favoris de la page
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
}

.stats-section .q-card:hover {
  transform: translateY(-5px);
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
}

.empty-state {
  border: 2px dashed #E0E0E0;
  border-radius: 16px;
  background: #FAFAFA;
}

/* Responsive */
@media (max-width: 992px) {
  .grid-row {
    grid-template-columns: repeat(2, 1fr);
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
}
</style>