<template>
  <div class="parcelle-details-container">
    <!-- En-tête spécifique parcelle -->
    <ParcelleHeader
      :parcelle-name="parcelle?.name"
      :show-chat="showChat"
      :unread-messages="unreadMessages"
      @toggle-chat="toggleChat"
      @share="shareParcelle"
      @toggle-favorite="toggleFavorite"
      @go-back="goBack"
    />

    <!-- Contenu principal -->
    <q-page class="parcelle-details-page q-px-lg q-pt-lg">
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-gears color="green-6" size="3em" />
        <p class="q-mt-md">Chargement du terrain...</p>
      </div>

      <div v-else-if="parcelle" class="max-width-1200 mx-auto">
        <!-- Badge Terrain -->
        <div class="type-badge q-mb-md">
          <q-badge
            color="green-6"
            class="text-caption text-weight-bold q-px-md q-py-xs"
          >
            <q-icon name="landscape" class="q-mr-xs" />
            TERRAIN / PARCELLE
          </q-badge>
          <q-badge
            :color="statusColor"
            class="q-ml-sm text-caption text-weight-bold q-px-md q-py-xs"
          >
            {{ getStatusLabel }}
          </q-badge>
        </div>

        <!-- Galerie d'images -->
        <div class="parcelle-gallery q-mb-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-img :src="mainImage" :alt="parcelle.name" class="main-image" :ratio="16/9">
                <div class="absolute-top-right q-ma-sm">
                  <q-badge color="green-7" class="text-weight-bold">
                    À VENDRE
                  </q-badge>
                </div>
              </q-img>
            </div>

            <!-- Miniatures d'images -->
            <div
              v-if="parcelleImages && parcelleImages.length > 1"
              class="col-12"
            >
              <div class="row q-col-gutter-xs">
                <div
                  v-for="(image, index) in parcelleImages.slice(0, 4)"
                  :key="index"
                  class="col-3"
                >
                  <q-img
                    :src="getImageUrl(image)"
                    :alt="`Image ${index + 1}`"
                    class="thumbnail"
                    :ratio="1"
                    @click="mainImage = getImageUrl(image)"
                  />
                </div>
              </div>
            </div>

            <!-- Aucune image -->
            <div v-else class="col-12 text-center q-pa-xl">
              <q-icon name="landscape" size="xl" color="grey-4" />
              <div class="text-h6 text-grey-6 q-mt-md">Aucune photo disponible</div>
            </div>
          </div>
        </div>

        <!-- Informations principales -->
        <div class="row q-col-gutter-lg">
          <div class="col-md-8">
            <div class="parcelle-main-info">
              <!-- Titre et prix -->
              <div class="row items-center justify-between q-mb-md">
                <div>
                  <h1 class="text-h4 text-weight-bold q-mb-sm">{{ parcelle.name }}</h1>
                  <div class="row items-center">
                    <q-icon name="location_on" color="green-7" class="q-mr-sm" />
                    <span class="text-h6 text-grey-8">{{ parcelle.location }}</span>
                  </div>
                </div>
                <div class="text-h4 text-green-7 text-weight-bold">
                  {{ parcelle.priceFormatted || parcelle.price }}
                </div>
              </div>

              <!-- Description -->
              <q-card class="q-mb-lg">
                <q-card-section>
                  <h3 class="text-h6 q-mb-md">
                    <q-icon name="description" class="q-mr-sm" />
                    Description du terrain
                  </h3>
                  <p class="text-body1">{{ parcelle.description }}</p>
                </q-card-section>
              </q-card>

              <!-- Caractéristiques du terrain -->
              <q-card class="q-mb-lg">
                <q-card-section>
                  <h3 class="text-h6 q-mb-md">
                    <q-icon name="landscape" class="q-mr-sm" />
                    Caractéristiques du Terrain
                  </h3>

                  <div class="row q-col-gutter-md">
                    <div class="col-md-6">
                      <q-list>
                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="square_foot" color="green-7" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>Superficie</q-item-label>
                            <q-item-label class="text-weight-medium text-h6">
                              {{ parcelle.superficie?.toLocaleString('fr-FR') || '0' }} m²
                            </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="location_city" color="green-7" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>Type de terrain</q-item-label>
                            <q-item-label class="text-weight-medium">
                              {{ formatTerrainType(parcelle.type) }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="map" color="green-7" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>Ville</q-item-label>
                            <q-item-label class="text-weight-medium">
                              {{ parcelle.ville || 'Non spécifié' }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                    <div class="col-md-6">
                      <q-list>
                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="place" color="green-7" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>Quartier</q-item-label>
                            <q-item-label class="text-weight-medium">
                              {{ parcelle.quartier || 'Non spécifié' }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="streetview" color="green-7" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>Avenue</q-item-label>
                            <q-item-label class="text-weight-medium">
                              {{ parcelle.avenue || 'Non spécifié' }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="tag" color="green-7" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>Numéro</q-item-label>
                            <q-item-label class="text-weight-medium">
                              {{ parcelle.numero || 'Non spécifié' }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Informations supplémentaires -->
              <q-card class="q-mb-lg">
                <q-card-section>
                  <h3 class="text-h6 q-mb-md">
                    <q-icon name="info" class="q-mr-sm" />
                    Informations supplémentaires
                  </h3>
                  <div class="row q-col-gutter-md">
                    <div class="col-md-6">
                      <div class="info-item q-mb-sm">
                        <span class="text-caption text-grey-7">Statut :</span>
                        <span class="q-ml-sm text-weight-medium">{{ getStatusLabel }}</span>
                      </div>
                      <div class="info-item q-mb-sm">
                        <span class="text-caption text-grey-7">Date de création :</span>
                        <span class="q-ml-sm text-weight-medium">
                          {{ formatDate(parcelle.dateCreation || parcelle.original?.date_creation) }}
                        </span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div v-if="parcelle.owner" class="info-item q-mb-sm">
                        <span class="text-caption text-grey-7">Propriétaire :</span>
                        <span class="q-ml-sm text-weight-medium">{{ parcelle.owner }}</span>
                      </div>
                      <div v-if="parcelle.ownerType" class="info-item">
                        <span class="text-caption text-grey-7">Type propriétaire :</span>
                        <span class="q-ml-sm text-weight-medium">{{ parcelle.ownerType }}</span>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Sidebar avec contact et infos -->
          <div class="col-md-4">
            <q-card class="sticky-sidebar">
              <q-card-section>
                <h3 class="text-h6 q-mb-md">Intéressé par ce terrain ?</h3>

                <!-- Informations propriétaire -->
                <div v-if="parcelleOwner" class="q-mb-lg">
                  <div class="text-subtitle2 q-mb-xs">Propriétaire du terrain</div>
                  <div class="row items-center">
                    <q-avatar size="40px" class="q-mr-sm" color="green-7" text-color="white">
                      <q-icon name="person" size="24px" />
                    </q-avatar>
                    <div>
                      <div class="text-weight-medium">{{ parcelleOwner.nom }}</div>
                      <div class="text-caption text-grey">
                        {{ parcelleOwner.type || 'Propriétaire terrain' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Informations de contact -->
                <div class="q-mb-lg">
                  <div class="text-subtitle2 q-mb-xs">Pour plus d'informations</div>
                  <div class="text-body2">
                    <div class="q-mb-xs">
                      <q-icon name="phone" size="sm" class="q-mr-sm" />
                      <span class="text-weight-medium">+243 970 000 000</span>
                    </div>
                    <div>
                      <q-icon name="email" size="sm" class="q-mr-sm" />
                      <span class="text-weight-medium">contact@ardhichain.cd</span>
                    </div>
                  </div>
                </div>

                <!-- Boutons d'action -->
                <div class="q-gutter-y-sm">
                  <q-btn
                    color="green-7"
                    label="Acheter ce terrain"
                    class="full-width"
                    size="lg"
                    icon="shopping_cart"
                    @click="handleBuyParcelle"
                  />

                  <q-btn
                    outline
                    color="green-7"
                    label="Contacter le propriétaire"
                    class="full-width"
                    icon="mail"
                    @click="handleContactOwner"
                  />

                  <q-btn
                    flat
                    color="amber-7"
                    label="Vérifier sur blockchain"
                    class="full-width"
                    icon="verified"
                    @click="handleBlockchainVerify"
                  />
                </div>

                <!-- Informations blockchain -->
                <div class="q-mt-lg">
                  <q-separator class="q-my-md" />
                  <div class="text-center">
                    <q-icon name="verified" color="green-7" size="md" class="q-mb-xs" />
                    <div class="text-caption text-grey-7">
                      Cette parcelle est sécurisée par la blockchain Cardano
                    </div>
                    <div class="text-caption text-grey-6 q-mt-xs">
                      NFT ID: {{ getNftId(parcelle.id) }}
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div v-else class="text-center q-py-xl">
        <q-icon name="error" size="4em" color="negative" />
        <div class="text-h6 q-mt-md">Terrain non trouvé</div>
        <q-btn
          color="green-7"
          label="Retour aux terrains"
          @click="goBack"
          class="q-mt-md"
        />
      </div>
    </q-page>

    <!-- Pied de page spécifique parcelle -->
    <ParcelleFooter
      :price="parcelle?.priceFormatted || '2 900 000 CDF'"
      :nft-id="getNftId(parcelle?.id)"
      action-label="Acheter maintenant"
      action-icon="shopping_cart"
      :installment="installmentText"
      @action-click="handleBuyParcelle"
    />
<ParcelleHeader
  :parcelle-name="parcelle?.name"
  :show-chat="showChat"
  :unread-messages="unreadMessages"
  :drawer-open="drawerOpen"
  @toggle-chat="toggleChat"
  @share="shareParcelle"
  @toggle-favorite="toggleFavorite"
  @go-back="goBack"
  @toggle-drawer="handleToggleDrawer"
/>
    <!-- Système de chat -->
    <ParcelleChat
      :is-open="showChat"
      :unread-count="unreadMessages"
      :parcelle-id="parcelle?.id"
      @toggle="toggleChat"
      @send-message="handleChatMessage"
      @read-messages="markMessagesAsRead"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useParcellesStore } from 'src/stores/parcelles'
import ParcelleHeader from 'src/components/parcelles/ParcelleHeader.vue'
// import ParcelleFooter from 'src/components/parcelles/ParcelleFooter.vue'
import ParcelleChat from 'src/components/parcelles/ParcelleChat.vue'

const router = useRouter()
const route = useRoute()
const parcellesStore = useParcellesStore()
const loading = ref(true)
const parcelle = ref(null)
const mainImage = ref('')
const showChat = ref(false)
const unreadMessages = ref(0)
const isFavorite = ref(false)
const installmentText = 'Facilités de paiement disponibles'

const drawerOpen = ref(false)

const handleToggleDrawer = (value) => {
  drawerOpen.value = value
}
// Obtenir les images de la parcelle
const parcelleImages = computed(() => {
  if (!parcelle.value) return []
  return parcelle.value.images || parcelle.value.original?.images || []
})

// Obtenir le propriétaire
const parcelleOwner = computed(() => {
  if (!parcelle.value) return null
  return parcelle.value.original?.utilisateur || { nom: parcelle.value.owner }
})

// Couleur du statut
const statusColor = computed(() => {
  const statut = parcelle.value?.statut?.toLowerCase()
  if (!statut) return 'grey-6'

  switch(statut) {
    case 'disponible': return 'green-6'
    case 'vendu': return 'red-6'
    case 'indisponible': return 'orange-6'
    case 'réservé': case 'reserve': return 'amber-6'
    default: return 'grey-6'
  }
})

// Label du statut
const getStatusLabel = computed(() => {
  const statut = parcelle.value?.statut
  if (!statut) return 'Non spécifié'

  const labels = {
    'disponible': 'Disponible',
    'vendu': 'Vendu',
    'indisponible': 'Indisponible',
    'reserve': 'Réservé',
    'réservé': 'Réservé'
  }

  return labels[statut.toLowerCase()] || statut
})

// Formater l'URL de l'image
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/default-land.jpg'

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // Si c'est un chemin relatif
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:3000${imagePath}`
  }

  // Si c'est déjà une URL complète du store
  return imagePath
}

// Formater le type de terrain
const formatTerrainType = (type) => {
  const types = {
    'urbain': 'Urbain',
    'residentiel': 'Résidentiel',
    'commercial': 'Commercial',
    'agricole': 'Agricole',
    'industriel': 'Industriel',
    'terrain': 'Terrain'
  }
  return types[type] || type
}

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return 'Non spécifié'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

// Générer un ID NFT
const getNftId = (id) => {
  if (!id) return 'PARC-000000'
  return `PARC-${id.toString().padStart(6, '0')}`
}

// Gestion du chat
const toggleChat = () => {
  showChat.value = !showChat.value
  if (showChat.value) {
    unreadMessages.value = 0
  }
}

const handleChatMessage = (message) => {
  console.log('Message envoyé:', message)
  // Ici, vous enverriez le message à votre backend
  // Pour l'instant, on simule juste
}

const markMessagesAsRead = () => {
  unreadMessages.value = 0
}

// Gestion des favoris
const toggleFavorite = (isFav) => {
  isFavorite.value = isFav
  console.log('Favori:', isFav ? 'ajouté' : 'retiré')
}

// Partage
const shareParcelle = () => {
  console.log('Partage de la parcelle:', parcelle.value?.name)
  // Implémentez le partage ici
}

// Navigation
const goBack = () => {
  router.push('/parcelles')
}

// Gestionnaires d'événements
const handleBuyParcelle = () => {
  console.log('Achat terrain:', parcelle.value?.id)
  router.push({
    name: 'buy-parcelle',
    params: { id: parcelle.value?.id }
  })
}

const handleContactOwner = () => {
  console.log('Contacter propriétaire terrain:', parcelle.value?.id)
  // Ouvrir le chat automatiquement
  showChat.value = true
}

const handleBlockchainVerify = () => {
  console.log('Vérification blockchain pour parcelle:', parcelle.value?.id)
  router.push({
    name: 'blockchain-verify',
    params: { id: parcelle.value?.id }
  })
}

// Chargement des données
onMounted(async () => {
  try {
    const parcelleId = parseInt(route.params.id)

    // Chercher dans les données déjà chargées
    let foundParcelle = parcellesStore.formattedParcelles.find(p => p.id === parcelleId)

    if (foundParcelle) {
      parcelle.value = foundParcelle
      console.log('✅ Parcelle trouvée dans store:', foundParcelle)
    } else {
      // Charger depuis l'API
      console.log('🔍 Chargement parcelle via API:', parcelleId)
      const response = await parcellesStore.fetchParcelleById(parcelleId)

      if (response.success) {
        parcelle.value = response.data
        console.log('✅ Parcelle chargée via API:', response.data)
      } else {
        console.error('❌ Parcelle non trouvée avec ID:', parcelleId)
      }
    }

    // Définir l'image principale
    if (parcelle.value) {
      const images = parcelleImages.value
      if (images && images.length > 0) {
        mainImage.value = getImageUrl(images[0])
      } else {
        mainImage.value = '/images/default-land.jpg'
      }
    }

  } catch (error) {
    console.error('❌ Erreur chargement parcelle:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.parcelle-details-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.parcelle-details-page {
  flex: 1;
  padding-top: 20px;
  padding-bottom: 80px; /* Espace pour le footer */
}

.max-width-1200 {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.type-badge .q-badge {
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.main-image {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.thumbnail {
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.thumbnail:hover {
  transform: scale(1.05);
  border-color: var(--q-positive);
}

.sticky-sidebar {
  position: sticky;
  top: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border-left: 4px solid var(--q-positive);
}

.info-item {
  padding: 8px 0;
}

@media (max-width: 768px) {
  .sticky-sidebar {
    position: static;
  }

  .type-badge .q-badge {
    font-size: 0.8rem;
  }

  .parcelle-details-page {
    padding-top: 10px;
    padding-bottom: 100px; /* Plus d'espace sur mobile */
  }
}
</style>
