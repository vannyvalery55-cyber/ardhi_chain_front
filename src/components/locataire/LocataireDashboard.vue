<template>
  <q-page class="dashboard-page bg-grey-1">
    <!-- Header du dashboard -->
    <div class="dashboard-header q-pa-lg bg-white">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h4 text-weight-bold text-blue-10">
            <q-icon name="dashboard" class="q-mr-sm" color="primary" />
            Tableau de bord
          </div>
          <div class="text-subtitle1 text-grey-7 q-mt-xs">
            Bienvenue, {{ userName }} 👋 - {{ currentDate }}
          </div>
        </div>
        
        <div class="row items-center q-gutter-md">
          <!-- Mode indication -->
          <q-badge 
            :color="isDemoMode ? 'orange' : 'green'" 
            :label="isDemoMode ? 'Mode Démo' : 'En Ligne'"
            class="q-px-md q-py-sm"
          />
          
          <!-- Bouton rafraîchir -->
          <q-btn 
            round 
            flat 
            :icon="isDemoMode ? 'wifi_off' : 'wifi'" 
            :color="isDemoMode ? 'orange' : 'primary'"
            @click="refreshData"
            :loading="loading"
          >
            <q-tooltip>
              {{ isDemoMode ? 'Mode démo - Données locales' : 'Données en temps réel' }}
            </q-tooltip>
          </q-btn>
          
          <!-- Menu utilisateur -->
          <q-btn round flat>
            <q-avatar size="40px">
              <q-img :src="userAvatar" />
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 200px">
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Mon profil</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Paramètres</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section avatar>
                    <q-icon name="logout" color="red" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-red">Déconnexion</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Statistiques principales -->
    <div class="q-pa-lg">
      <div class="row q-col-gutter-lg">
        <!-- Carte : Total propriétés -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card cursor-pointer" @click="viewAllProperties">
            <q-card-section class="q-pa-lg">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6 text-grey-7">Total propriétés</div>
                  <div class="text-h3 text-weight-bold text-blue-10 q-mt-sm">{{ totalProperties }}</div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    <q-icon :name="propertiesTrend >= 0 ? 'trending_up' : 'trending_down'" 
                            :color="propertiesTrend >= 0 ? 'green' : 'red'" 
                            size="xs" />
                    {{ Math.abs(propertiesTrend) }}% ce mois
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="60px" color="blue-1" text-color="primary">
                    <q-icon name="house" size="lg" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Carte : Propriétés à louer -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card cursor-pointer" @click="viewPropertiesForRent">
            <q-card-section class="q-pa-lg">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6 text-grey-7">À louer</div>
                  <div class="text-h3 text-weight-bold text-green-10 q-mt-sm">{{ propertiesForRent }}</div>
                  <div class="text-caption text-green-7 q-mt-xs">
                    {{ propertiesForRentPercentage }}% du total
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="60px" color="green-1" text-color="green">
                    <q-icon name="real_estate_agent" size="lg" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Carte : Propriétés à vendre -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card cursor-pointer" @click="viewPropertiesForSale">
            <q-card-section class="q-pa-lg">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6 text-grey-7">À vendre</div>
                  <div class="text-h3 text-weight-bold text-amber-10 q-mt-sm">{{ propertiesForSale }}</div>
                  <div class="text-caption text-amber-7 q-mt-xs">
                    {{ propertiesForSalePercentage }}% du total
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="60px" color="amber-1" text-color="amber">
                    <q-icon name="attach_money" size="lg" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Carte : Valeur moyenne -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card">
            <q-card-section class="q-pa-lg">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6 text-grey-7">Valeur moyenne</div>
                  <div class="text-h3 text-weight-bold text-purple-10 q-mt-sm">{{ averagePropertyValue }}</div>
                  <div class="text-caption text-purple-7 q-mt-xs">
                    <q-icon name="euro" size="xs" /> par propriété
                  </div>
                </div>
                <div class="col-auto">
                  <q-avatar size="60px" color="purple-1" text-color="purple">
                    <q-icon name="trending_up" size="lg" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Graphiques et détails -->
      <div class="row q-col-gutter-lg q-mt-lg">
        <!-- Graphique des ventes -->
        <div class="col-12 col-lg-8">
          <q-card>
            <q-card-section>
              <div class="text-h6 text-weight-medium">Activité des propriétés</div>
              <div class="text-caption text-grey-7">Évolution mensuelle des transactions</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="chart-container">
              <!-- Intégration d'un graphique ici -->
              <div class="placeholder-chart text-center q-pa-xl">
                <q-icon name="bar_chart" size="xl" color="grey-4" />
                <div class="text-h6 text-grey-6 q-mt-md">Graphique des activités</div>
                <div class="text-caption text-grey-5">Données de transactions par mois</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Dernières propriétés -->
        <div class="col-12 col-lg-4">
          <q-card>
            <q-card-section>
              <div class="row items-center justify-between">
                <div class="text-h6 text-weight-medium">Dernières propriétés</div>
                <q-btn flat label="Voir tout" color="primary" size="sm" @click="viewAllProperties" />
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-none">
              <q-list bordered separator>
                <q-item 
                  v-for="property in recentProperties" 
                  :key="property.id"
                  clickable
                  @click="viewPropertyDetails(property)"
                  class="property-item"
                >
                  <q-item-section avatar>
                    <q-avatar size="48px" rounded>
                      <q-img :src="property.image || 'default-property.jpg'" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ property.name }}</q-item-label>
                    <q-item-label caption lines="1">
                      <q-icon name="location_on" size="xs" class="q-mr-xs" />
                      {{ property.location }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge :color="property.type_offre === 'location' ? 'blue' : 'green'">
                      {{ property.type_offre === 'location' ? 'À louer' : 'À vendre' }}
                    </q-badge>
                    <div class="text-caption text-grey-7 q-mt-xs">
                      {{ formatPrice(property.price) }}
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Statistiques détaillées -->
      <div class="row q-col-gutter-lg q-mt-lg">
        <!-- Distribution par type -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6 text-weight-medium">Distribution par type</div>
            </q-card-section>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-6" v-for="type in propertyTypes" :key="type.name">
                  <div class="type-distribution-item">
                    <div class="row items-center justify-between">
                      <div>
                        <div class="text-weight-medium">{{ type.name }}</div>
                        <div class="text-caption text-grey-7">{{ type.count }} propriétés</div>
                      </div>
                      <div class="text-h6">{{ type.percentage }}%</div>
                    </div>
                    <q-linear-progress 
                      :value="type.percentage / 100" 
                      :color="type.color" 
                      class="q-mt-sm"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Informations système -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6 text-weight-medium">Informations système</div>
            </q-card-section>
            <q-card-section>
              <q-list bordered separator>
                <q-item>
                  <q-item-section>
                    <q-item-label>Mode de données</q-item-label>
                    <q-item-label caption>
                      {{ isDemoMode ? 'Données locales (démo)' : 'API en temps réel' }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon :name="isDemoMode ? 'wifi_off' : 'wifi'" :color="isDemoMode ? 'orange' : 'green'" />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>Dernière mise à jour</q-item-label>
                    <q-item-label caption>
                      {{ lastUpdateTime }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="update" color="blue" />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>Statut API</q-item-label>
                    <q-item-label caption>
                      {{ apiStatus }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge :color="apiStatus === 'Connecté' ? 'green' : 'red'" rounded />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>Version application</q-item-label>
                    <q-item-label caption>
                      v{{ appVersion }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="code" color="grey" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="addProperty">
        <q-tooltip>Ajouter une propriété</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { usePropertiesStore } from 'src/stores/properties'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()

// État
const loading = ref(false)
const lastUpdateTime = ref('')
const appVersion = ref('1.0.0')

// Computed properties
const userName = computed(() => {
  return authStore.user?.name || authStore.user?.email || 'Utilisateur'
})

const userAvatar = computed(() => {
  return authStore.user?.avatar || 'https://cdn.quasar.dev/img/avatar.png'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const houses = computed(() => {
  return propertiesStore.formattedHouses || []
})

const isDemoMode = computed(() => propertiesStore.isDemoMode)

// Statistiques
const totalProperties = computed(() => houses.value.length)

const propertiesForRent = computed(() => {
  return houses.value.filter(h => h.type_offre === 'location').length
})

const propertiesForSale = computed(() => {
  return houses.value.filter(h => h.type_offre === 'vente').length
})

const propertiesForRentPercentage = computed(() => {
  if (totalProperties.value === 0) return 0
  return ((propertiesForRent.value / totalProperties.value) * 100).toFixed(1)
})

const propertiesForSalePercentage = computed(() => {
  if (totalProperties.value === 0) return 0
  return ((propertiesForSale.value / totalProperties.value) * 100).toFixed(1)
})

const averagePropertyValue = computed(() => {
  if (houses.value.length === 0) return '0 €'
  
  const totalValue = houses.value.reduce((sum, house) => {
    const price = house.original?.prix_location || house.original?.prix_vente || 0
    return sum + (parseFloat(price) || 0)
  }, 0)
  
  const avg = totalValue / houses.value.length
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(avg)
})

const propertiesTrend = computed(() => {
  // Simuler une tendance (dans une vraie app, récupérer depuis l'API)
  return Math.random() > 0.5 ? 12.5 : -3.2
})

const recentProperties = computed(() => {
  return [...houses.value]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 5)
})

const propertyTypes = computed(() => {
  const types = {}
  
  houses.value.forEach(house => {
    const type = house.type_maison || 'Non spécifié'
    if (!types[type]) {
      types[type] = 0
    }
    types[type]++
  })
  
  const colors = ['primary', 'green', 'orange', 'purple', 'red', 'blue', 'teal']
  
  return Object.entries(types).map(([name, count], index) => ({
    name: formatTypeName(name),
    count,
    percentage: ((count / totalProperties.value) * 100).toFixed(1),
    color: colors[index % colors.length]
  }))
})

const apiStatus = computed(() => {
  return propertiesStore.apiAvailable ? 'Connecté' : 'Déconnecté'
})

// Méthodes
const formatTypeName = (type) => {
  const map = {
    'villa': 'Villa',
    'traditionnelle': 'Traditionnelle',
    'contemporaine': 'Contemporaine',
    'moderne': 'Moderne',
    'pavillon': 'Pavillon',
    'appartement': 'Appartement',
    'studio': 'Studio'
  }
  return map[type] || type
}

const formatPrice = (price) => {
  if (!price) return '0 FC'
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(price)
}

const refreshData = async () => {
  loading.value = true
  try {
    await propertiesStore.reloadFromApi()
    lastUpdateTime.value = new Date().toLocaleTimeString('fr-FR')
    
    $q.notify({
      message: isDemoMode.value ? 'Données locales rafraîchies' : 'Données actualisées',
      color: isDemoMode.value ? 'orange' : 'green',
      icon: 'check_circle',
      position: 'top-right'
    })
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error)
    $q.notify({
      message: 'Erreur lors du rafraîchissement',
      color: 'red',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const viewAllProperties = () => {
  router.push('/properties')
}

const viewPropertiesForRent = () => {
  router.push('/locataire')
}

const viewPropertiesForSale = () => {
  router.push({ name: 'properties', query: { type: 'vente' } })
}

const viewPropertyDetails = (property) => {
  router.push(`/property/${property.id}`)
}

const addProperty = () => {
  router.push('/add-property')
}

const logout = () => {
  $q.dialog({
    title: 'Déconnexion',
    message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await authStore.logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  })
}

// Initialisation
onMounted(async () => {
  try {
    loading.value = true
    
    // Charger les données utilisateur
    if (!authStore.user) {
      await authStore.fetchUser()
    }
    
    // Charger les propriétés
    await propertiesStore.fetchHouses()
    
    // Initialiser l'heure de mise à jour
    lastUpdateTime.value = new Date().toLocaleTimeString('fr-FR')
    
    console.log('📊 Dashboard initialisé:', {
      user: authStore.user,
      properties: propertiesStore.houses.length,
      mode: propertiesStore.isDemoMode ? 'demo' : 'api'
    })
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
}

.dashboard-header {
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.stats-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  overflow: hidden;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.chart-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-chart {
  opacity: 0.7;
}

.property-item {
  transition: background-color 0.2s ease;
  border-radius: 8px;
  margin: 4px;
}

.property-item:hover {
  background-color: #f0f7ff;
}

.type-distribution-item {
  padding: 12px;
  border-radius: 8px;
  background: #fafafa;
  margin-bottom: 8px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-card {
  animation: fadeIn 0.5s ease forwards;
}

.stats-card:nth-child(1) { animation-delay: 0.1s; }
.stats-card:nth-child(2) { animation-delay: 0.2s; }
.stats-card:nth-child(3) { animation-delay: 0.3s; }
.stats-card:nth-child(4) { animation-delay: 0.4s; }

/* Responsive */
@media (max-width: 768px) {
  .dashboard-header {
    padding: 16px;
  }
  
  .stats-card {
    margin-bottom: 16px;
  }
  
  .text-h3 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .dashboard-header .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .text-h4 {
    font-size: 1.5rem;
  }
}
</style>