<template>
  <q-layout>
    <!-- Loading overlay -->
    <div v-if="appLoading" class="app-loading-overlay">
      <q-spinner-gears color="primary" size="3em" />
      <p class="q-mt-md text-grey-7">Chargement de l'application...</p>
      <p v-if="loadingStep" class="text-caption text-blue-7">{{ loadingStep }}</p>
    </div>

    <!-- Contenu principal -->
    <router-view v-else />

    <!-- Banner mode démo -->
    <div v-if="isDemoMode" class="demo-banner">
      <q-icon name="wifi_off" size="sm" class="q-mr-xs" />
      Mode démonstration - Données locales
      <q-btn
        flat
        dense
        round
        icon="refresh"
        size="sm"
        class="q-ml-sm"
        @click="retryApiConnection"
        title="Réessayer la connexion API"
      />
    </div>

    <!-- Notifications globales -->
    <q-dialog v-model="showError" persistent>
      <q-card style="width: 400px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6 text-negative">
            <q-icon name="error" class="q-mr-sm" />
            Erreur de connexion
          </div>
        </q-card-section>

        <q-card-section>
          <p>Impossible de charger les données depuis le serveur.</p>
          <div class="bg-grey-2 q-pa-sm rounded-borders q-mt-sm">
            <p class="text-caption text-grey-8 q-mb-none">{{ errorMessage }}</p>
          </div>
          <p class="text-caption text-grey q-mt-sm">
            L'application fonctionne en mode démonstration avec des données locales.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Réessayer" color="primary" @click="retryLoading" />
          <q-btn flat label="Continuer en mode démo" color="grey" @click="continueWithDemo" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePropertiesStore } from 'src/stores/properties'

const propertiesStore = usePropertiesStore()
const appLoading = ref(true)
const showError = ref(false)
const errorMessage = ref('')
const loadingStep = ref('')
const isDemoMode = ref(false)

// Computed pour vérifier l'état
const storeStatus = computed(() => ({
  isLoading: propertiesStore.housesLoading,
  hasError: propertiesStore.housesError,
  housesCount: propertiesStore.houses.length,
  formattedCount: propertiesStore.formattedProperties.length
}))

const loadAppData = async () => {
  console.log('🚀 App.vue - Démarrage du chargement')
  appLoading.value = true
  showError.value = false
  errorMessage.value = ''
  isDemoMode.value = false
  loadingStep.value = 'Initialisation...'

  try {
    // Essayer d'abord l'API
    loadingStep.value = 'Connexion au serveur...'

    // Créer un timeout pour l'API
    const apiTimeout = setTimeout(() => {
      loadingStep.value = 'Le serveur met trop de temps à répondre...'
    }, 3000)

    try {
      await propertiesStore.fetchHouses()
      clearTimeout(apiTimeout)

      // Vérifier si on a des données
      if (propertiesStore.houses.length === 0) {
        throw new Error('Aucune donnée reçue du serveur')
      }

      loadingStep.value = 'Données chargées avec succès!'
      console.log('✅ Données API chargées:', storeStatus.value)

      // Petite pause pour montrer le message de succès
      setTimeout(() => {
        appLoading.value = false
      }, 500)

      return

    } catch (apiError) {
      clearTimeout(apiTimeout)
      console.warn('⚠️ API non disponible:', apiError.message)

      // Passer en mode démo
      loadingStep.value = 'Chargement des données de démonstration...'
      await loadDemoData()
      return
    }

  } catch (error) {
    console.error('❌ Erreur fatale:', error)

    // Dernier recours: charger les données demo
    loadingStep.value = 'Erreur critique, chargement des données locales...'
    await loadDemoData()
  }
}

const loadDemoData = async () => {
  try {
    console.log('🔄 Chargement des données de démonstration...')

    // Utiliser la méthode du store
    if (typeof propertiesStore.loadMockData === 'function') {
      await propertiesStore.loadMockData()
    } else {
      // Fallback si la méthode n'existe pas
      console.warn('Méthode loadMockData non disponible, utilisation directe')
      // Le store a déjà chargé les données mock dans fetchHouses en cas d'erreur
    }

    isDemoMode.value = true
    errorMessage.value = propertiesStore.housesError || 'Mode démonstration activé'

    console.log('🎭 Données démo chargées:', {
      houses: propertiesStore.houses.length,
      error: propertiesStore.housesError
    })

    // Montrer l'erreur brièvement
    showError.value = true

    // Masquer le loading après un délai
    setTimeout(() => {
      appLoading.value = false
      // Masquer automatiquement l'erreur après 5 secondes
      setTimeout(() => {
        showError.value = false
      }, 5000)
    }, 1000)

  } catch (demoError) {
    console.error('❌ Erreur avec données démo:', demoError)
    errorMessage.value = `Erreur démo: ${demoError.message}`
    showError.value = true
    appLoading.value = false
  }
}

const retryLoading = () => {
  showError.value = false
  loadAppData()
}

const continueWithDemo = () => {
  showError.value = false
  appLoading.value = false
}

const retryApiConnection = () => {
  console.log('🔄 Tentative de reconnexion API...')
  isDemoMode.value = false
  loadAppData()
}

// Chargement initial
onMounted(() => {
  console.log('🏁 App.vue montée')
  console.log('📦 Store disponible:', !!propertiesStore)
  console.log('🔧 Méthodes store:', Object.keys(propertiesStore).filter(k => typeof propertiesStore[k] === 'function'))

  loadAppData()
})
</script>

<style scoped>
.app-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.demo-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, #ff9800, #ff5722);
  color: white;
  padding: 8px 16px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
}
</style>
