<template>
  <div id="app">
    <!-- Écran de chargement -->
    <LoadingScreen 
      :duration="10000"
      v-if="showLoading" 
      @loading-complete="handleLoadingComplete"
    />
    
    <!-- Application principale -->
    <div :class="{ 'app-content': true, 'hidden': showLoading }">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePropertiesStore } from './stores/properties'
import LoadingScreen from './components/LoadingScreen.vue'

const showLoading = ref(true)
const propertiesStore = usePropertiesStore()

const handleLoadingComplete = async () => {
  // Charger les données réelles après le loading screen
  await propertiesStore.fetchProperties()
  showLoading.value = false
}

onMounted(() => {
  // Optionnel: vérifier si l'utilisateur a déjà vu le loading screen
  const hasSeenLoading = localStorage.getItem('hasSeenLoading')
  
  if (hasSeenLoading) {
    // Charger immédiatement les données sans l'écran de chargement
    propertiesStore.fetchProperties()
    showLoading.value = false
  } else {
    localStorage.setItem('hasSeenLoading', 'true')
  }
})
</script>

<style scoped>
#app {
  position: relative;
}

.app-content {
  opacity: 1;
  transition: opacity 0.5s ease;
}

.app-content.hidden {
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
}

.app-content:not(.hidden) {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>