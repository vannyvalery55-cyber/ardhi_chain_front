<template>
  <div class="dashboard-container bg-grey-2">
    <!-- Header ParcelleHeader -->
    <ParcelleHeader
      :parcelle-name="''"
      :show-chat="false"
      :unread-messages="0"
      @toggle-chat="toggleChat"
      @share="shareDashboard"
      @toggle-favorite="handleToggleFavorite"
      @go-back="goToHome"
    />

    <!-- Contenu du dashboard -->
    <div class="dashboard-content" :style="{ 'margin-top': '0px' }">
      <div class="dashboard-wrapper">
        <!-- En-tête du dashboard -->
        <div class="dashboard-hero bg-primary text-white">
          <div class="dashboard-hero-content">
            <h1 class="hero-title">
              Tableau de Bord <span class="gradient-text">Acheteur</span>
            </h1>
            <p class="hero-subtitle">
              Bienvenue, <strong>{{ userName }}</strong> | Gérez vos investissements et suivez vos transactions
            </p>
            <div class="hero-actions">
              <q-btn
                color="white"
                text-color="primary"
                label="Ajouter des fonds"
                icon="account_balance_wallet"
                @click="addFunds"
                unelevated
                class="q-mr-sm"
              />
              <q-btn
                outline
                color="white"
                text-color="white"
                label="Explorer les terrains"
                icon="explore"
                @click="$router.push('/parcelles')"
              />
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <section class="stats-section q-px-lg q-pt-xl">
          <div class="container">
            <div class="section-header q-mb-lg">
              <h2 class="section-title text-green-10">
                <q-icon name="analytics" class="q-mr-sm" />
                Aperçu de vos investissements
              </h2>
            </div>
            
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-3" v-for="stat in quickStats" :key="stat.title">
                <q-card class="stats-card shadow-3" flat>
                  <q-card-section class="bg-white">
                    <div class="row items-center">
                      <div class="col-8">
                        <div class="stats-label text-grey-7">{{ stat.title }}</div>
                        <div class="stats-value text-green-10">{{ stat.value }}</div>
                        <div class="stats-trend" :class="stat.change >= 0 ? 'positive' : 'negative'">
                          <q-icon :name="stat.change >= 0 ? 'trending_up' : 'trending_down'" />
                          <span>{{ Math.abs(stat.change) }}%</span>
                        </div>
                      </div>
                      <div class="col-4 text-right">
                        <div class="stats-icon" :style="{ 'color': `var(--q-${stat.color})` }">
                          <q-icon :name="stat.icon" size="40px" />
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </section>

        <!-- Contenu principal -->
        <div class="dashboard-main q-px-lg q-pb-xl">
          <div class="container">
            <div class="row q-col-gutter-xl">
              <!-- Colonne gauche -->
              <div class="col-12 col-lg-8">
                <!-- Portfolio -->
                <q-card class="dashboard-card shadow-2 q-mb-lg">
                  <q-card-section>
                    <div class="card-header">
                      <h3 class="card-title">
                        <q-icon name="pie_chart" color="green-7" class="q-mr-sm" />
                        Mon Portfolio
                      </h3>
                      <q-btn
                        flat
                        color="green-7"
                        label="Voir détails"
                        icon-right="arrow_forward"
                        @click="$router.push('/portfolio')"
                      />
                    </div>
                    
                    <div class="portfolio-chart q-my-md">
                      <div class="chart-container">
                        <div class="chart-visual">
                          <div class="chart-circle" :style="{ '--percentage': '61%', '--color': '#1976D2' }"></div>
                          <div class="chart-circle" :style="{ '--percentage': '31%', '--color': '#4CAF50' }"></div>
                          <div class="chart-circle" :style="{ '--percentage': '8%', '--color': '#FF9800' }"></div>
                        </div>
                        <div class="chart-legend">
                          <div class="legend-item" v-for="item in portfolioItems" :key="item.id">
                            <div class="legend-color" :style="{ 'background-color': `var(--q-${item.color})` }"></div>
                            <div class="legend-details">
                              <div class="legend-name">{{ item.name }}</div>
                              <div class="legend-values">
                                <span class="legend-value">{{ item.value }}</span>
                                <span class="legend-percentage">{{ item.percentage }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Transactions -->
                <q-card class="dashboard-card shadow-2">
                  <q-card-section>
                    <div class="card-header">
                      <h3 class="card-title">
                        <q-icon name="receipt_long" color="green-7" class="q-mr-sm" />
                        Transactions Récentes
                      </h3>
                      <q-btn
                        flat
                        color="green-7"
                        label="Voir tout"
                        icon-right="arrow_forward"
                        @click="$router.push('/transactions')"
                      />
                    </div>
                    
                    <div class="transactions-table q-mt-md">
                      <q-table
                        :rows="recentTransactions"
                        :columns="transactionColumns"
                        row-key="id"
                        flat
                        hide-pagination
                        :pagination="{ rowsPerPage: 5 }"
                        class="custom-table"
                      >
                        <template v-slot:body-cell-status="props">
                          <q-td :props="props">
                            <q-chip
                              dense
                              :color="getStatusColor(props.value)"
                              text-color="white"
                              size="sm"
                              class="status-chip"
                            >
                              {{ props.value }}
                            </q-chip>
                          </q-td>
                        </template>
                        
                        <template v-slot:body-cell-actions="props">
                          <q-td :props="props">
                            <q-btn
                              flat
                              round
                              icon="visibility"
                              color="green-7"
                              size="sm"
                              @click="viewTransaction(props.row)"
                            />
                          </q-td>
                        </template>
                      </q-table>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Colonne droite -->
              <div class="col-12 col-lg-4">
                <!-- Favoris -->
                <q-card class="dashboard-card shadow-2 q-mb-lg">
                  <q-card-section>
                    <div class="card-header">
                      <h3 class="card-title">
                        <q-icon name="favorite" color="red" class="q-mr-sm" />
                        Mes Favoris
                      </h3>
                    </div>
                    
                    <div class="favorites-list q-mt-md">
                      <div class="favorite-item" v-for="fav in favorites" :key="fav.id">
                        <div class="fav-media">
                          <q-img
                            :src="fav.image"
                            :ratio="4/3"
                            class="fav-image"
                          />
                          <div class="fav-overlay">
                            <q-icon name="favorite" color="red" size="sm" />
                          </div>
                        </div>
                        <div class="fav-content">
                          <div class="fav-title text-weight-bold text-green-10">{{ fav.title }}</div>
                          <div class="fav-location text-grey-7">
                            <q-icon name="location_on" size="14px" />
                            {{ fav.location }}
                          </div>
                          <div class="fav-price text-green-9 text-weight-bold">{{ fav.price }}</div>
                          <q-btn
                            flat
                            color="green-7"
                            label="Voir détails"
                            size="sm"
                            class="q-mt-sm"
                            @click="$router.push(`/parcelle/${fav.id}`)"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div class="text-center q-mt-md">
                      <q-btn
                        outline
                        color="green-7"
                        label="Voir tous les favoris"
                        @click="$router.push('/favorites')"
                        size="sm"
                        class="full-width"
                      />
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Activités -->
                <q-card class="dashboard-card shadow-2 q-mb-lg">
                  <q-card-section>
                    <div class="card-header">
                      <h3 class="card-title">
                        <q-icon name="notifications_active" color="amber" class="q-mr-sm" />
                        Activités Récentes
                      </h3>
                    </div>
                    
                    <div class="activities-timeline q-mt-md">
                      <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                        <div class="activity-icon" :class="activity.type">
                          <q-icon :name="activity.icon" size="16px" />
                        </div>
                        <div class="activity-content">
                          <div class="activity-text text-weight-medium text-dark">{{ activity.text }}</div>
                          <div class="activity-time text-caption text-grey-6">{{ activity.time }}</div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Actions rapides -->
                <q-card class="dashboard-card shadow-2">
                  <q-card-section>
                    <div class="card-header">
                      <h3 class="card-title">
                        <q-icon name="bolt" color="primary" class="q-mr-sm" />
                        Actions Rapides
                      </h3>
                    </div>
                    
                    <div class="quick-actions q-mt-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-6" v-for="action in quickActions" :key="action.label">
                          <q-btn
                            :color="action.color"
                            :icon="action.icon"
                            :label="action.label"
                            class="quick-action-btn full-width"
                            unelevated
                            @click="action.click"
                          />
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER INTÉGRÉ -->
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-text">
          <q-icon name="copyright" size="16px" />
          <span>2025 ARDHI-CHAIN - Sécurité foncière par blockchain</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ParcelleHeader from 'src/components/parcelles/ParcelleHeader.vue'

const router = useRouter()

// Récupérer le nom de l'utilisateur
const userName = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.nom || 'Utilisateur'
})

// Fonctions pour le ParcelleHeader
const toggleChat = () => console.log('Toggle chat')
const shareDashboard = () => console.log('Partager dashboard')
const handleToggleFavorite = (favoriteStatus) => console.log('Toggle favorite:', favoriteStatus)
const goToHome = () => router.push('/')

// Données
const quickStats = ref([
  { title: 'Portfolio Total', value: '$ 245,800', change: 12.5, icon: 'account_balance', color: 'primary' },
  { title: 'Investissements Actifs', value: '3', change: 25, icon: 'trending_up', color: 'green' },
  { title: 'En Négociation', value: '2', change: -5, icon: 'handshake', color: 'amber' },
  { title: 'Notifications', value: '5', change: 0, icon: 'notifications', color: 'red' }
])

const portfolioItems = ref([
  { id: 1, name: 'Terrains', value: '$ 150,000', percentage: '61%', color: 'primary', icon: 'landscape' },
  { id: 2, name: 'Maisons', value: '$ 75,000', percentage: '31%', color: 'green', icon: 'house' },
  { id: 3, name: 'Liquidités', value: '$ 20,800', percentage: '8%', color: 'amber', icon: 'account_balance_wallet' }
])

const transactionColumns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'type', label: 'Type', field: 'type', align: 'left', sortable: true },
  { name: 'montant', label: 'Montant', field: 'amount', align: 'left', sortable: true },
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'status', label: 'Statut', field: 'status', align: 'center' },
  { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const recentTransactions = ref([
  { id: 'TRX001', type: 'Achat terrain', amount: '$ 50,000', date: '15 Nov 2024', status: 'Complété' },
  { id: 'TRX002', type: 'Réservation', amount: '$ 5,000', date: '10 Nov 2024', status: 'En attente' },
  { id: 'TRX003', type: 'Frais de dossier', amount: '$ 1,200', date: '05 Nov 2024', status: 'Complété' },
  { id: 'TRX004', type: 'Consultation', amount: 'Gratuit', date: '01 Nov 2024', status: 'Complété' },
  { id: 'TRX005', type: 'Achat maison', amount: '$ 95,000', date: '28 Oct 2024', status: 'En cours' }
])

const favorites = ref([
  {
    id: 1,
    title: 'Terrain Kinshasa',
    location: 'Gombe, Kinshasa',
    price: '$ 85,000',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400'
  },
  {
    id: 2,
    title: 'Villa Lubumbashi',
    location: 'Lubumbashi Centre',
    price: '$ 120,000',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400'
  }
])

const recentActivities = ref([
  { id: 1, type: 'success', icon: 'check_circle', text: 'Transaction TRX001 complétée', time: 'Il y a 2 heures' },
  { id: 2, type: 'warning', icon: 'schedule', text: 'Document à signer en attente', time: 'Il y a 5 heures' },
  { id: 3, type: 'info', icon: 'notifications', text: 'Nouveau terrain disponible', time: 'Il y a 1 jour' },
  { id: 4, type: 'success', icon: 'chat', text: 'Message du vendeur reçu', time: 'Il y a 2 jours' }
])

const quickActions = ref([
  { label: 'Rechercher', icon: 'search', color: 'primary', click: () => router.push('/parcelles') },
  { label: 'Messages', icon: 'chat', color: 'green', click: () => router.push('/messages') },
  { label: 'Documents', icon: 'description', color: 'amber', click: () => router.push('/documents') },
  { label: 'Support', icon: 'support_agent', color: 'purple', click: () => router.push('/support') }
])

// Fonctions
const getStatusColor = (status) => {
  switch (status) {
    case 'Complété': return 'positive'
    case 'En cours': return 'warning'
    case 'En attente': return 'info'
    default: return 'grey'
  }
}

const viewTransaction = (transaction) => {
  console.log('Voir transaction:', transaction)
}

const addFunds = () => {
  console.log('Ajouter des fonds')
}

onMounted(() => {
  console.log('Dashboard acheteur chargé')
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  margin-top: 120px; /* Compense le header fixe */
  flex: 1;
  margin-bottom: 60px; /* Espace pour le footer */
}

.dashboard-wrapper {
  min-height: calc(100vh - 180px); /* Hauteur moins header et footer */
}

/* Footer */
.app-footer {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
  padding: 16px 20px;
  text-align: center;
  width: 100%;
  position: relative;
  bottom: 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Hero Section */
.dashboard-hero {
  padding: 60px 20px;
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
}

.dashboard-hero-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
}

.gradient-text {
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Section Header */
.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
}

/* Cards */
.dashboard-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

/* Stats */
.stats-card {
  border-radius: 12px;
  border-left: 4px solid var(--q-primary);
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-3px);
  border-left-color: var(--q-green);
}

.stats-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.stats-value {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.stats-trend.positive {
  color: #4caf50;
}

.stats-trend.negative {
  color: #f44336;
}

.stats-icon {
  opacity: 0.8;
}

/* Portfolio Chart */
.portfolio-chart {
  padding: 1rem;
}

.chart-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.chart-visual {
  position: relative;
  width: 150px;
  height: 150px;
}

.chart-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    var(--color) 0% var(--percentage),
    transparent var(--percentage) 100%
  );
  clip-path: circle(50%);
}

.chart-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
  transition: background 0.3s ease;
}

.legend-item:hover {
  background: #e8f5e9;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-details {
  flex: 1;
}

.legend-name {
  font-weight: 600;
  color: #1a237e;
  margin-bottom: 0.25rem;
}

.legend-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.legend-value {
  font-size: 0.9rem;
  color: #5f6368;
}

.legend-percentage {
  font-weight: 700;
  color: #1a237e;
}

/* Table */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
}

.custom-table :deep(.q-table__top) {
  background: #f8f9fa;
}

.custom-table :deep(.q-table__bottom) {
  background: #f8f9fa;
}

.status-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Favoris */
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.favorite-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.favorite-item:hover {
  background: #e8f5e9;
  transform: translateX(4px);
}

.fav-media {
  position: relative;
  width: 100px;
  height: 75px;
  flex-shrink: 0;
}

.fav-image {
  border-radius: 8px;
  height: 100%;
}

.fav-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.fav-title {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.fav-location {
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.fav-price {
  font-size: 1.1rem;
}

/* Activités */
.activities-timeline {
  position: relative;
  padding-left: 40px;
}

.activities-timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #4caf50, #2196f3);
  border-radius: 2px;
}

.activity-item {
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
}

.activity-icon {
  position: absolute;
  left: -40px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 3px solid;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.activity-icon.success {
  border-color: #4caf50;
  color: #4caf50;
}

.activity-icon.warning {
  border-color: #ff9800;
  color: #ff9800;
}

.activity-icon.info {
  border-color: #2196f3;
  color: #2196f3;
}

.activity-content {
  flex: 1;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.activity-text {
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.activity-time {
  font-style: italic;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.quick-action-btn {
  height: 70px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.quick-action-btn .q-icon {
  font-size: 24px;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-content {
    margin-top: 100px;
    margin-bottom: 50px;
  }
  
  .dashboard-wrapper {
    min-height: calc(100vh - 150px);
  }
  
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .chart-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .favorite-item {
    flex-direction: column;
  }
  
  .fav-media {
    width: 100%;
    height: 150px;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .footer-text {
    font-size: 0.8rem;
    flex-direction: column;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .card-title {
    font-size: 1.2rem;
  }
}
</style>