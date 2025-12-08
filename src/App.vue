<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Loading overlay -->
    <div v-if="appLoading" class="app-loading-overlay">
      <q-spinner-gears color="primary" size="3em" />
      <p class="q-mt-md text-grey-7">Chargement de l'application...</p>
    </div>

    <!-- Layout principal (pour toutes les pages sauf parcelles) -->
    <template v-if="!appLoading && !isParcelleDetailsPage">
      <MainHeader @toggle-drawer="drawer = !drawer" />
      <MainDrawer v-model="drawer" />
      <MainFooter />
    </template>

    <!-- Layout spécial pour détails parcelle -->
    <template v-else-if="!appLoading && isParcelleDetailsPage">
      <!-- Pour les détails de parcelle, pas de header/footer principal -->
      <!-- Ils seront gérés par ParcelleHeader et ParcelleFooter dans la page -->
    </template>

    <!-- Conteneur des pages -->
    <q-page-container>
      <!-- Les pages de votre application seront rendues ici -->
      <router-view v-if="!appLoading" />

      <!-- Contenu par défaut pendant le chargement -->
      <div v-if="appLoading" class="loading-placeholder">
        <!-- L'overlay de chargement est déjà géré, cette div est pour la structure -->
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
// import MainHeader from 'src/components/layout/MainHeader.vue'
// import MainFooter from 'src/components/layout/MainFooter.vue'
// import MainDrawer from 'src/components/layout/MainDrawer.vue'

// Variables d'état
const appLoading = ref(true)
const drawer = ref(false)

// Utiliser la route pour déterminer la page actuelle
const route = useRoute()

// Calculer si nous sommes sur une page de détails de parcelle
const isParcelleDetailsPage = computed(() => {
  return route.name === 'parcelle-details' || route.path.includes('/parcelles/')
})

// Chargement initial
const initApp = async () => {
  console.log('🚀 Initialisation de l\'application...')

  try {
    // Simulation d'un chargement
    setTimeout(() => {
      appLoading.value = false
      console.log('✅ Application chargée')
    }, 1000)

  } catch (error) {
    console.error('❌ Erreur lors du chargement:', error)
    appLoading.value = false
  }
}

// Chargement au montage
onMounted(() => {
  initApp()
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

.q-page-container {
  min-height: 100vh;
}

.loading-placeholder {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Ajuster l'espacement selon la présence du header/footer */
:deep(.q-page) {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
