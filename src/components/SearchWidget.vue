<template>
  <q-card flat bordered class="bg-white shadow-10 search-widget q-pa-md q-ma-md elevated-search">
    <div class="row items-center q-col-gutter-md">
      <!-- Champ de recherche -->
      <div class="col-md-6 col-sm-12">
        <q-input
          v-model="localSearchTerm"
          dense
          outlined
          placeholder="Rechercher une propriété..."
          class="full-width"
          @keyup.enter="handleSearch"
          @update:model-value="handleInput"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
          <template #append>
            <q-btn
              v-if="localSearchTerm"
              flat
              round
              dense
              icon="clear"
              @click="clearSearch"
            />
          </template>
        </q-input>
      </div>

      <!-- Bouton de recherche -->
      <div class="col-md-2 col-sm-12">
        <q-btn
          color="primary"
          label="Rechercher"
          class="full-width"
          @click="handleSearch"
          :loading="loading"
        />
      </div>

      <!-- Filtres rapides -->
      <div class="col-md-4 col-sm-12">
        <div class="row q-col-gutter-xs">
          <div class="col-auto">
            <q-btn
              outline
              color="primary"
              label="À vendre"
              size="sm"
              @click="filterByType('vente')"
              :class="{ 'bg-primary text-white': activeFilter === 'vente' }"
            />
          </div>
          <div class="col-auto">
            <q-btn
              outline
              color="secondary"
              label="À louer"
              size="sm"
              @click="filterByType('location')"
              :class="{ 'bg-secondary text-white': activeFilter === 'location' }"
            />
          </div>
          <div class="col-auto">
            <q-btn
              flat
              color="grey"
              icon="tune"
              size="sm"
              @click="showAdvancedFilters = !showAdvancedFilters"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres avancés -->
    <div v-if="showAdvancedFilters" class="q-mt-md">
      <div class="row q-col-gutter-md">
        <div class="col-md-3 col-sm-6">
          <q-select
            v-model="selectedCity"
            :options="cityOptions"
            label="Ville"
            outlined
            dense
            clearable
          />
        </div>
        <div class="col-md-3 col-sm-6">
          <q-input
            v-model.number="minPrice"
            type="number"
            label="Prix min"
            outlined
            dense
            prefix="$"
            clearable
          />
        </div>
        <div class="col-md-3 col-sm-6">
          <q-input
            v-model.number="maxPrice"
            type="number"
            label="Prix max"
            outlined
            dense
            prefix="$"
            clearable
          />
        </div>
        <div class="col-md-3 col-sm-6">
          <q-select
            v-model="selectedBedrooms"
            :options="bedroomOptions"
            label="Chambres"
            outlined
            dense
            clearable
          />
        </div>
      </div>

      <div class="row q-mt-sm justify-end">
        <q-btn
          color="primary"
          label="Appliquer filtres"
          @click="applyAdvancedFilters"
          class="q-mr-sm"
        />
        <q-btn
          outline
          color="grey"
          label="Réinitialiser"
          @click="resetFilters"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { usePropertiesStore } from 'src/stores/properties'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const propertiesStore = usePropertiesStore()

// Variables réactives
const localSearchTerm = ref(props.modelValue || '')
const loading = ref(false)
const showAdvancedFilters = ref(false)
const activeFilter = ref('')

// Filtres avancés
const selectedCity = ref(null)
const minPrice = ref(null)
const maxPrice = ref(null)
const selectedBedrooms = ref(null)

// Options pour les sélecteurs
const cityOptions = ref(['Goma', 'Bukavu', 'Kinshasa'])
const bedroomOptions = ref([
  { label: '1+ chambre', value: 1 },
  { label: '2+ chambres', value: 2 },
  { label: '3+ chambres', value: 3 },
  { label: '4+ chambres', value: 4 }
])

// Mettre à jour le terme local quand la prop change
watch(() => props.modelValue, (newValue) => {
  localSearchTerm.value = newValue
})

// Émettre les changements
const handleInput = () => {
  emit('update:modelValue', localSearchTerm.value)
}

// Recherche principale
const handleSearch = async () => {
  loading.value = true

  try {
    console.log('🔍 Recherche:', localSearchTerm.value)

    // Construire les filtres
    const filters = {}

    if (localSearchTerm.value) {
      filters.search = localSearchTerm.value
    }

    if (activeFilter.value) {
      filters.type_offre = activeFilter.value
    }

    // Appliquer les filtres avancés
    if (selectedCity.value) {
      filters.ville = selectedCity.value
    }

    if (minPrice.value) {
      filters.minPrice = minPrice.value
    }

    if (maxPrice.value) {
      filters.maxPrice = maxPrice.value
    }

    if (selectedBedrooms.value) {
      filters.minBedrooms = selectedBedrooms.value
    }

    console.log('🎯 Filtres appliqués:', filters)

    // Émettre l'événement de recherche
    emit('search', filters)

  } catch (error) {
    console.error('❌ Erreur recherche:', error)
  } finally {
    loading.value = false
  }
}

// Filtres rapides
const filterByType = (type) => {
  if (activeFilter.value === type) {
    activeFilter.value = ''
  } else {
    activeFilter.value = type
  }
  handleSearch()
}

// Filtres avancés
const applyAdvancedFilters = () => {
  showAdvancedFilters.value = false
  handleSearch()
}

const resetFilters = () => {
  localSearchTerm.value = ''
  activeFilter.value = ''
  selectedCity.value = null
  minPrice.value = null
  maxPrice.value = null
  selectedBedrooms.value = null
  showAdvancedFilters.value = false

  emit('update:modelValue', '')
  emit('search', {})
}

const clearSearch = () => {
  localSearchTerm.value = ''
  handleInput()
  handleSearch()
}

// Charger les options depuis le store
onMounted(() => {
  // Si le store a des villes disponibles, les utiliser
  if (propertiesStore.availableCities && propertiesStore.availableCities.length > 0) {
    cityOptions.value = propertiesStore.availableCities
  }
})
</script>

<style scoped>
.search-widget {
  border-radius: 16px;
  transition: all 0.3s ease;
}

.search-widget:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.elevated-search {
  position: relative;
  z-index: 10;
}
</style>
