<template>
  <q-page class="parcelle-details-page bg-grey-2">
    <!-- Intégration du composant ParcelleHeader -->
    <ParcelleHeader
      :parcelle-name="parcelle?.name || ''"
      :show-chat="false"
      :unread-messages="unreadMessages"
      @toggle-chat="toggleChat"
      @share="shareParcelle"
      @toggle-favorite="handleToggleFavorite"
      @go-back="goBack"
    />

    <q-page-container>
      <div v-if="loading" class="loading-container">
        <q-spinner-gears color="green-6" size="3em" />
        <p class="q-mt-md text-grey-7">Chargement des détails...</p>
      </div>

      <div v-else-if="parcelle" class="parcelle-content">
        <!-- Galerie d'images améliorée -->
        <div class="gallery-section">
          <div class="relative-position">
            <q-carousel
              v-model="slide"
              swipeable
              animated
              infinite
              arrows
              navigation
              navigation-icon="radio_button_unchecked"
              navigation-active-icon="radio_button_checked"
              height="400px"
              class="rounded-borders shadow-3 gallery-carousel"
            >
              <template v-if="parcelleImages.length > 0">
                <q-carousel-slide
                  v-for="(img, index) in parcelleImages"
                  :key="index"
                  :name="index"
                  :img-src="img"
                  class="carousel-slide"
                >
                  <div class="absolute-bottom custom-caption">
                    <div class="text-h6 text-white text-weight-bold">
                      {{ parcelle.name }}
                    </div>
                    <div class="text-subtitle2 text-white">
                      Image {{ index + 1 }} / {{ parcelleImages.length }}
                    </div>
                  </div>
                </q-carousel-slide>
              </template>
              <template v-else>
                <q-carousel-slide :name="0" class="bg-grey-4">
                  <div class="absolute-center text-center">
                    <q-icon name="landscape" size="xl" color="grey-6" />
                    <div class="text-h6 text-grey-7 q-mt-md">Aucune image disponible</div>
                  </div>
                </q-carousel-slide>
              </template>
            </q-carousel>

            <!-- Badge statut -->
            <div class="absolute-top-right q-ma-lg">
              <q-badge :color="statusColor" class="statut-badge">
                {{ parcelle.statut || 'Disponible' }}
              </q-badge>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="main-content q-px-lg q-pt-lg">
          <div class="row q-col-gutter-xl">
            <!-- Section gauche - Détails -->
            <div class="col-md-8">
              <!-- Titre et localisation -->
              <div class="section-header q-mb-lg">
                <h1 class="text-h4 text-weight-bold text-green-10 q-mb-xs">
                  {{ parcelle.name }}
                </h1>
                <div class="location-info row items-center q-gutter-sm">
                  <q-icon name="location_on" color="green-7" size="sm" />
                  <span class="text-subtitle1 text-grey-8">
                    {{ parcelle.ville }}, {{ parcelle.quartier }}
                  </span>
                  <q-chip dense color="green-1" text-color="green-9" icon="landscape">
                    {{ parcelle.type || parcelle.type_terrain || 'Terrain' }}
                  </q-chip>
                </div>
              </div>

              <!-- Description -->
              <q-card class="section-card q-mb-lg" flat bordered>
                <q-card-section>
                  <h2 class="text-h5 text-weight-bold text-green-9 q-mb-md">
                    <q-icon name="description" class="q-mr-sm" />
                    Description
                  </h2>
                  <p class="text-body1 q-mb-none" style="line-height: 1.8;">
                    {{ parcelle.description || 'Aucune description disponible pour ce terrain.' }}
                  </p>
                </q-card-section>
              </q-card>

              <!-- Caractéristiques -->
              <q-card class="section-card q-mb-lg" flat bordered>
                <q-card-section>
                  <h2 class="text-h5 text-weight-bold text-green-9 q-mb-md">
                    <q-icon name="checklist" class="q-mr-sm" />
                    Caractéristiques
                  </h2>
                  <div class="features-grid">
                    <div v-for="(feature, key) in parcelleFeatures" :key="key" class="feature-item">
                      <div class="feature-icon q-mb-xs">
                        <q-icon :name="getFeatureIcon(feature.label)" size="sm" color="green-7" />
                      </div>
                      <div class="feature-label text-caption text-grey-7">
                        {{ feature.label }}
                      </div>
                      <div class="feature-value text-subtitle2 text-weight-bold text-dark">
                        {{ feature.value }}
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Localisation -->
              <q-card class="section-card q-mb-lg" flat bordered>
                <q-card-section>
                  <h2 class="text-h5 text-weight-bold text-green-9 q-mb-md">
                    <q-icon name="map" class="q-mr-sm" />
                    Localisation
                  </h2>
                  <div class="map-container">
                    <div class="map-placeholder">
                      <div class="map-overlay">
                        <q-icon name="location_on" size="xl" color="green-7" />
                        <div class="text-h6 text-grey-8 q-mt-md">{{ parcelle.ville }}</div>
                        <div class="text-caption text-grey-6 q-mt-xs">{{ parcelle.quartier }}</div>
                        <div class="text-caption text-grey-5 q-mt-sm">{{ parcelle.location }}</div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Section droite - Actions et infos -->
            <div class="col-md-4">
              <div class="sticky-sidebar">
                <!-- Carte prix et actions -->
                <q-card class="action-card q-mb-lg shadow-3" flat>
                  <q-card-section class="bg-green-10 text-white">
                    <div class="text-center">
                      <div class="text-h3 text-weight-bold">
                        {{ parcelle.priceFormatted || parcelle.price || 'Sur demande' }}
                      </div>
                      <div class="text-caption q-mt-xs">Prix du terrain</div>
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-lg">
                    <!-- Actions utilisateur -->
                    <div class="action-buttons q-gutter-y-md">
                      <template v-if="isAcheteur">
                        <q-btn
                          unelevated
                          color="green-9"
                          label="Contacter le propriétaire"
                          icon="message"
                          class="full-width action-btn"
                          size="lg"
                          @click="openChat"
                        />

                        <q-btn
                          outline
                          color="green-9"
                          label="Planifier une visite"
                          icon="calendar_today"
                          class="full-width action-btn"
                          @click="scheduleVisit"
                        />

                        <q-btn
                          unelevated
                          color="amber-9"
                          label="Faire une offre"
                          icon="attach_money"
                          class="full-width action-btn"
                          @click="makeOffer"
                        />
                      </template>

                      <template v-else>
                        <div class="info-banner bg-blue-1 q-pa-md rounded-borders">
                          <div class="row items-center">
                            <q-icon name="info" color="blue" size="sm" class="q-mr-sm" />
                            <div class="text-caption text-blue-9">
                              Fonctions d'achat réservées aux <strong>Acheteurs</strong>
                            </div>
                          </div>
                        </div>
                        <q-btn
                          outline
                          color="green-9"
                          label="En savoir plus"
                          icon="info"
                          class="full-width action-btn"
                        />
                      </template>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Informations propriétaire -->
                <q-card class="info-card q-mb-lg" flat bordered>
                  <q-card-section>
                    <h3 class="text-h6 text-weight-bold text-green-9 q-mb-md">
                      <q-icon name="person" class="q-mr-sm" />
                      Propriétaire
                    </h3>
                    <div class="owner-info">
                      <div class="row items-center">
                        <q-avatar size="56px" class="q-mr-md">
                          <q-icon name="account_circle" size="lg" color="green-7" />
                        </q-avatar>
                        <div>
                          <div class="text-subtitle1 text-weight-medium">
                            {{ parcelle.owner || 'Propriétaire privé' }}
                          </div>
                          <div class="row items-center q-mt-xs">
                            <q-icon name="verified" size="xs" color="green" class="q-mr-xs" />
                            <span class="text-caption text-grey-7">Profil vérifié</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Certificat NFT -->
                <q-card class="info-card nft-card" flat bordered>
                  <q-card-section>
                    <h3 class="text-h6 text-weight-bold text-blue-9 q-mb-md">
                      <q-icon name="verified" class="q-mr-sm" />
                      Certificat NFT
                    </h3>
                    <div class="nft-info">
                      <div class="row items-center q-mb-sm">
                        <q-icon name="token" color="deep-purple" size="md" class="q-mr-sm" />
                        <div>
                          <div class="text-subtitle2">Token Cardano</div>
                          <div class="text-caption text-grey-7">Identifiant unique sur blockchain</div>
                        </div>
                      </div>
                      <q-btn
                        unelevated
                        color="deep-purple"
                        label="Voir le certificat"
                        icon="visibility"
                        class="full-width"
                        size="sm"
                        @click="viewNFT"
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="error-container text-center q-py-xl">
        <q-icon name="error_outline" size="xl" color="red" class="q-mb-md" />
        <div class="text-h5 text-weight-bold text-red q-mb-sm">Terrain non trouvé</div>
        <div class="text-body1 text-grey-7 q-mb-lg">
          Le terrain demandé n'existe pas ou a été supprimé.
        </div>
        <q-btn
          unelevated
          color="green-9"
          label="Retour aux terrains"
          icon="landscape"
          @click="$router.push('/parcelles')"
        />
      </div>
    </q-page-container>

    <!-- Composant Chat Intégré -->
    <ParcelleChat
      :is-open="chatOpen"
      :unread-count="unreadMessages"
      :parcelle-id="parcelleId.value"
      @toggle="toggleChat"
      @send-message="handleSendMessage"
      @read-messages="markMessagesAsRead"
    />

     <AppFooter />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useParcellesStore } from 'src/stores/parcelles'
import { useAuthStore } from 'src/stores/auth'
import ParcelleHeader from 'src/components/parcelles/ParcelleHeader.vue' // Import du header
import ParcelleChat from 'src/components/parcelles/ParcelleChat.vue' // Import du composant chat
import AppFooter from 'src/components/parcelles/ParcelleFooter.vue' // IMPORT DU FOOTER
const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const parcellesStore = useParcellesStore()
const authStore = useAuthStore()

const parcelle = ref(null)
const loading = ref(true)
const slide = ref(0)
const isFavorite = ref(false)
const chatOpen = ref(false)
const unreadMessages = ref(2) // Messages non lus de démonstration

const parcelleId = computed(() => route.params.id)

// Fonction pour récupérer les images
const parcelleImages = computed(() => {
  if (!parcelle.value) return []

  const images = []
  const parcelleData = parcelle.value

  console.log('🔍 Recherche images pour parcelle:', parcelleData)

  // Priorité 1: Propriété image directe
  if (parcelleData.image) {
    console.log('📸 Image directe trouvée:', parcelleData.image)
    images.push(formatImageUrl(parcelleData.image))
  }

  // Priorité 2: Tableau images
  if (parcelleData.images && Array.isArray(parcelleData.images)) {
    console.log('📸 Tableau images trouvé:', parcelleData.images)
    parcelleData.images.forEach(img => {
      if (img) images.push(formatImageUrl(img))
    })
  }

  // Priorité 3: Propriété originale
  if (parcelleData.original?.images && Array.isArray(parcelleData.original.images)) {
    console.log('📸 Images originales trouvées:', parcelleData.original.images)
    parcelleData.original.images.forEach(img => {
      if (img) images.push(formatImageUrl(img))
    })
  }

  // Priorité 4: image_url
  if (parcelleData.image_url) {
    console.log('📸 image_url trouvée:', parcelleData.image_url)
    images.push(formatImageUrl(parcelleData.image_url))
  }

  // Image par défaut si aucune image
  if (images.length === 0) {
    console.log('⚠️ Aucune image, utilisation par défaut')
    images.push('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')
  }

  console.log('✅ Images finales:', images)
  return images
})

// Fonction pour formater les URLs d'images
const formatImageUrl = (url) => {
  if (!url) return ''

  // Si c'est une URL complète, la retourner telle quelle
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Si c'est un chemin relatif, ajouter le base URL
  if (url.startsWith('/uploads/') || url.startsWith('/images/')) {
    return `http://localhost:3000${url}`
  }

  // Pour les autres cas, retourner tel quel
  return url
}

// Icônes pour les caractéristiques
const getFeatureIcon = (label) => {
  const icons = {
    'Superficie': 'square_foot',
    'Type': 'category',
    'Ville': 'location_city',
    'Quartier': 'place',
    'Type de terrain': 'landscape',
    'Statut légal': 'gavel',
    'Date d\'ajout': 'calendar_today',
    'Référence': 'tag'
  }

  return icons[label] || 'check'
}

const statusColor = computed(() => {
  const statut = parcelle.value?.statut
  if (!statut) return 'grey'

  switch(statut.toLowerCase()) {
    case 'disponible': return 'green'
    case 'vendu': return 'red'
    case 'réservé': return 'amber'
    case 'indisponible': return 'orange'
    default: return 'grey'
  }
})

const parcelleFeatures = computed(() => {
  if (!parcelle.value) return []

  const features = [
    { label: 'Superficie', value: `${parcelle.value.superficie || parcelle.value.area || 'N/A'} m²` },
    { label: 'Type', value: parcelle.value.type || 'Non spécifié' },
    { label: 'Ville', value: parcelle.value.ville || 'N/A' },
    { label: 'Quartier', value: parcelle.value.quartier || 'N/A' },
    { label: 'Type de terrain', value: parcelle.value.type_terrain || 'Standard' },
    { label: 'Statut légal', value: parcelle.value.statut_legal || 'À vérifier' },
    { label: 'Date d\'ajout', value: formatDate(parcelle.value.createdAt) },
    { label: 'Référence', value: parcelle.value.reference || parcelle.value.id }
  ]

  return features
})

const isAcheteur = computed(() => {
  const user = authStore.user || authStore.currentUser
  return user?.type?.toLowerCase() === 'acheteur'
})

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return 'Non spécifiée'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Fonctions du chat
const openChat = () => {
  chatOpen.value = true
}

const toggleChat = () => {
  chatOpen.value = !chatOpen.value
}

const handleSendMessage = (message) => {
  console.log('💬 Message envoyé:', message)
  // Ici vous pouvez envoyer le message à votre backend
  // Pour l'instant, on simule juste l'envoi

  $q.notify({
    message: 'Message envoyé au propriétaire',
    color: 'positive',
    icon: 'check',
    position: 'top',
    timeout: 2000
  })
}

const markMessagesAsRead = () => {
  unreadMessages.value = 0
}

// Fonctions pour le header
const handleToggleFavorite = (favoriteStatus) => {
  isFavorite.value = favoriteStatus
  $q.notify({
    message: favoriteStatus ? 'Ajouté aux favoris' : 'Retiré des favoris',
    color: favoriteStatus ? 'positive' : 'info',
    icon: favoriteStatus ? 'favorite' : 'favorite_border',
    position: 'top'
  })
}

const goBack = () => {
  router.push('/parcelles')
}

onMounted(async () => {
  try {
    loading.value = true
    console.log('🔄 Chargement parcelle ID:', parcelleId.value)

    // Charger les parcelles si nécessaire
    if (parcellesStore.parcelles.length === 0) {
      console.log('📥 Chargement des parcelles depuis le store...')
      await parcellesStore.fetchParcelles()
    }

    // Chercher la parcelle dans toutes les sources possibles
    const parcelleFound =
      // Dans parcelles brutes
      parcellesStore.parcelles.find(p => p.id == parcelleId.value) ||
      parcellesStore.parcelles.find(p => p._id == parcelleId.value) ||

      // Dans parcelles formatées
      parcellesStore.formattedParcelles?.find(p => p.id == parcelleId.value) ||
      parcellesStore.formattedParcelles?.find(p => p._id == parcelleId.value) ||

      // Recherche par référence
      parcellesStore.parcelles.find(p => p.reference == parcelleId.value)

    if (parcelleFound) {
      console.log('✅ Parcelle trouvée:', parcelleFound)
      parcelle.value = parcelleFound

      // Log des images disponibles
      console.log('📊 Images disponibles:', {
        image: parcelle.value.image,
        images: parcelle.value.images,
        originalImages: parcelle.value.original?.images,
        image_url: parcelle.value.image_url
      })

    } else {
      console.error('❌ Parcelle non trouvée. IDs disponibles:')
      console.log('Par celles brutes:', parcellesStore.parcelles.map(p => ({
        id: p.id,
        _id: p._id,
        name: p.name || p.nom,
        reference: p.reference
      })))
      console.log('Par celles formatées:', parcellesStore.formattedParcelles?.map(p => ({
        id: p.id,
        _id: p._id,
        name: p.name,
        reference: p.reference
      })))
    }

  } catch (error) {
    console.error('❌ Erreur chargement parcelle:', error)
    $q.notify({
      message: 'Erreur lors du chargement de la parcelle',
      color: 'negative',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
})

const shareParcelle = () => {
  if (navigator.share && parcelle.value) {
    navigator.share({
      title: `Terrain: ${parcelle.value.name}`,
      text: `Découvrez ce terrain sur ARDHI-CHAIN: ${parcelle.value.description}`,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    $q.notify({
      message: 'Lien copié dans le presse-papier',
      color: 'positive',
      icon: 'content_copy',
      position: 'top'
    })
  }
}

const scheduleVisit = () => {
  $q.dialog({
    title: 'Planifier une visite',
    message: 'Cette fonctionnalité sera bientôt disponible.',
    cancel: true,
    persistent: true
  })
}

const makeOffer = () => {
  $q.dialog({
    title: 'Faire une offre',
    message: 'Cette fonctionnalité sera bientôt disponible.',
    cancel: true,
    persistent: true
  })
}

const viewNFT = () => {
  $q.dialog({
    title: 'Certificat NFT',
    message: 'Ce terrain est sécurisé par un certificat NFT sur la blockchain Cardano.',
    html: true,
    ok: {
      label: 'Voir détails',
      color: 'deep-purple'
    },
    cancel: true
  })
}
</script>

<style scoped>
.parcelle-details-page {
  min-height: 100vh;
  padding-bottom: 120px; /* Espace pour le chat */
}

/* Galerie */
.gallery-section {
  position: relative;
  margin-top: 20px; /* Espace après le header */
}

.gallery-carousel {
  border-radius: 0 !important;
}

.custom-caption {
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  padding: 20px;
  border-radius: 0 0 8px 8px;
}

.statut-badge {
  font-size: 0.9rem;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Contenu principal */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 50px;
}

.section-header {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 20px;
  margin-top: 20px;
}

.section-card {
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.section-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
}

/* Caractéristiques */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.feature-item {
  text-align: center;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: #f0f7f0;
  transform: scale(1.03);
}

.feature-icon {
  margin-bottom: 10px;
}

.feature-label {
  margin-bottom: 5px;
  font-size: 0.85rem;
}

.feature-value {
  color: #1a237e;
}

/* Carte */
.map-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.map-placeholder {
  height: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.map-overlay {
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* Sidebar */
.sticky-sidebar {
  position: sticky;
  top: 20px;
}

.action-card {
  border-radius: 16px;
  overflow: hidden;
}

.action-buttons .action-btn {
  border-radius: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.info-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
}

.nft-card {
  border-left: 4px solid #673ab7;
}

/* Owner info */
.owner-info {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

/* États */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  margin-top: 60px; /* Compense le header */
}

.error-container {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 60px; /* Compense le header */
}

/* Responsive */
@media (max-width: 768px) {
  .gallery-carousel {
    height: 300px !important;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .sticky-sidebar {
    position: static;
    margin-top: 20px;
  }

  .section-header h1 {
    font-size: 1.75rem;
  }

  .parcelle-details-page {
    padding-bottom: 100px; /* Moins d'espace sur mobile */
  }

  .main-content {
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .features-grid {
    grid-template-columns: 1fr;
  }

  .custom-caption .text-h6 {
    font-size: 1rem;
  }

  .action-btn {
    font-size: 0.9rem;
  }

  .gallery-section {
    margin-top: 10px;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.parcelle-content {
  animation: fadeIn 0.5s ease;
}

.carousel-slide {
  background-size: cover;
  background-position: center;
}

.parcelle-details-page {
  min-height: 100vh;
  padding-bottom: 0px; /* Espace pour le footer */
}
</style>
