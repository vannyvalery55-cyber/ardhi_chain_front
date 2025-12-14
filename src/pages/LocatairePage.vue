<template>
  <q-page class="locataire-page">
    <!-- Bouton pour basculer entre liste et dashboard -->
    <div class="page-toggle q-pa-md">
      <q-btn-toggle
        v-model="activeView"
        toggle-color="blue-7"
        :options="[
          { label: 'Liste des maisons', value: 'list', icon: 'list' },
          { label: 'Tableau de bord', value: 'dashboard', icon: 'dashboard' }
        ]"
        class="full-width"
      />
    </div>

    <!-- Vue LISTE DES MAISONS -->
    <LocataireListe 
      v-if="activeView === 'list'" 
      :is-demo-mode="isDemoMode"
      :reload-from-api="reloadFromApi"
      @view-house-details="viewHouseDetails"
    />

    <!-- Vue TABLEAU DE BORD -->
    <LocataireDashboard 
      v-else-if="activeView === 'dashboard'"
      :houses="allHouses"
      :is-demo-mode="isDemoMode"
      :stats="storeStats"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { usePropertiesStore } from 'src/stores/properties'
import LocataireDashboard from 'src/components/locataire/LocataireDashboard.vue'
import LocataireListe from 'src/components/locataire/LocataireListe.vue'

// Router, Quasar et Store
const router = useRouter()
const $q = useQuasar()
const propertiesStore = usePropertiesStore()

// États
const activeView = ref('list') // 'list' ou 'dashboard'
const loading = ref(false)

// Computed properties depuis le store
const allHouses = computed(() => propertiesStore.formattedHouses || [])

const isDemoMode = computed(() => propertiesStore.isDemoMode)
const storeStats = computed(() => propertiesStore.stats || { 
  total: 0, 
  forRent: 0, 
  cities: [],
  averagePrice: 0,
  availableCount: 0
})

// Méthodes
const reloadFromApi = async () => {
  loading.value = true
  try {
    await propertiesStore.reloadFromApi()
    $q.notify({
      message: isDemoMode.value ? 'Mode démo activé' : 'Données actualisées depuis l\'API',
      color: isDemoMode.value ? 'orange' : 'green',
      icon: isDemoMode.value ? 'wifi_off' : 'wifi'
    })
  } catch (error) {
    console.error('Erreur lors du rechargement:', error)
  } finally {
    loading.value = false
  }
}

const viewHouseDetails = (house) => {
  router.push(`/property/${house.id}`)
}

// Chargement initial
import { onMounted } from 'vue'
onMounted(async () => {
  try {
    loading.value = true
    await propertiesStore.fetchHouses()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.locataire-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-toggle {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 20px;
}
</style>