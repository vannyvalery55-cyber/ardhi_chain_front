<template>
  <q-page class="maison-details-page">
    <!-- Bouton retour -->
    <div class="q-pa-md">
      <q-btn
        icon="arrow_back"
        label="Retour aux maisons"
        color="primary"
        flat
        @click="router.push('/maisons')"
      />
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-gears color="primary" size="50px" />
      <div class="text-subtitle1 q-mt-md">Chargement des détails de la maison...</div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="text-center q-pa-xl">
      <q-icon name="error" color="negative" size="60px" />
      <div class="text-h6 q-mt-md">Erreur de chargement</div>
      <div class="text-body1 q-mt-sm">{{ error }}</div>
      <q-btn
        color="primary"
        label="Réessayer"
        @click="fetchMaisonDetails"
        class="q-mt-md"
      />
    </div>

    <!-- Détails de la maison -->
    <div v-else-if="maison" class="q-pa-md">
      <!-- En-tête -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-h4 text-weight-bold">{{ maison.titre }}</div>
          <div class="text-subtitle1 text-grey">
            <q-icon name="location_on" />
            <span v-if="maison.parcelle_details">
              {{ maison.parcelle_details.ville }}, {{ maison.parcelle_details.quartier }}
            </span>
            <span v-else>
              Parcelle ID: {{ maison.parcelle_id }}
            </span>
          </div>
        </div>
        <div class="col-auto">
          <q-badge :color="getStatusColor(maison.statut)" class="q-pa-sm text-h6">
            {{ getStatusLabel(maison.statut) }}
          </q-badge>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Images et description -->
        <div class="col-12 col-lg-8">
          <!-- Images -->
          <q-card class="q-mb-lg">
            <q-carousel
              v-if="maison.images && maison.images.length > 0"
              v-model="carouselSlide"
              animated
              infinite
              arrows
              navigation
              height="400px"
            >
              <q-carousel-slide
                v-for="(image, index) in maison.images"
                :key="index"
                :name="index"
                :img-src="getImageUrl(image)"
              />
            </q-carousel>
            <div v-else class="text-center q-pa-xl">
              <q-icon name="image_not_supported" size="60px" color="grey" />
              <div class="text-subtitle1 q-mt-md">Aucune image disponible</div>
            </div>
          </q-card>

          <!-- Description -->
          <q-card class="q-mb-lg">
            <q-card-section>
              <div class="text-h6">Description</div>
              <q-separator class="q-my-md" />
              <div class="text-body1" v-html="formatDescription(maison.description)"></div>
            </q-card-section>
          </q-card>

          <!-- Détails de la parcelle associée -->
          <q-card v-if="maison.parcelle_details" class="q-mb-lg">
            <q-card-section>
              <div class="text-h6">Parcelle associée</div>
              <q-separator class="q-my-md" />
              <q-card class="bg-blue-grey-1 cursor-pointer" @click="viewParcelle(maison.parcelle_id)">
                <q-card-section>
                  <div class="row items-center">
                    <div class="col">
                      <div class="text-h6">{{ maison.parcelle_details.titre }}</div>
                      <div class="text-caption">
                        {{ maison.parcelle_details.superficie.toLocaleString() }} m² •
                        {{ getTerrainTypeLabel(maison.parcelle_details.type_terrain) }}
                      </div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="arrow_forward" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-card-section>
          </q-card>
        </div>

        <!-- Informations détaillées et actions -->
        <div class="col-12 col-lg-4">
          <!-- Prix et actions -->
          <q-card class="q-mb-lg">
            <q-card-section>
              <div v-if="maison.type_offre === 'vente'" class="text-center">
                <div class="text-h5 text-grey">Prix de vente</div>
                <div class="text-h3 text-primary q-mt-sm">
                  {{ formatCurrency(maison.prix_vente) }}
                </div>
              </div>

              <div v-else-if="maison.type_offre === 'location'" class="text-center">
                <div class="text-h5 text-grey">Prix de location</div>
                <div class="text-h3 text-primary q-mt-sm">
                  {{ formatCurrency(maison.prix_location) }}/mois
                </div>
              </div>

              <div v-else class="text-center">
                <div class="row">
                  <div class="col-6">
                    <div class="text-h6 text-grey">À vendre</div>
                    <div class="text-h4 text-primary">
                      {{ formatCurrency(maison.prix_vente) }}
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-h6 text-grey">À louer</div>
                    <div class="text-h4 text-primary">
                      {{ formatCurrency(maison.prix_location) }}/mois
                    </div>
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="row q-gutter-sm">
                <div class="col">
                  <q-btn
                    color="primary"
                    label="Modifier"
                    icon="edit"
                    @click="editMaison"
                    class="full-width"
                  />
                </div>
                <div class="col">
                  <q-btn
                    color="negative"
                    label="Supprimer"
                    icon="delete"
                    @click="confirmDelete"
                    class="full-width"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Caractéristiques principales -->
          <q-card class="q-mb-lg">
            <q-card-section>
              <div class="text-h6">Caractéristiques</div>
              <q-separator class="q-my-md" />

              <div class="row q-col-gutter-y-md">
                <div class="col-6">
                  <div class="row items-center">
                    <q-icon name="square_foot" class="text-grey q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey">Surface</div>
                      <div class="text-body1">{{ maison.surface_totale }} m²</div>
                    </div>
                  </div>
                </div>

                <div class="col-6">
                  <div class="row items-center">
                    <q-icon name="bed" class="text-grey q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey">Chambres</div>
                      <div class="text-body1">{{ maison.nombre_chambres }}</div>
                    </div>
                  </div>
                </div>

                <div class="col-6">
                  <div class="row items-center">
                    <q-icon name="bathtub" class="text-grey q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey">Salles de bain</div>
                      <div class="text-body1">{{ maison.nombre_salles_bain }}</div>
                    </div>
                  </div>
                </div>

                <div class="col-6">
                  <div class="row items-center">
                    <q-icon name="stairs" class="text-grey q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey">Étage</div>
                      <div class="text-body1">{{ maison.etage || '0' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Type et standing -->
          <q-card class="q-mb-lg">
            <q-card-section>
              <div class="text-h6">Classification</div>
              <q-separator class="q-my-md" />

              <div class="q-gutter-y-md">
                <div class="row items-center">
                  <q-icon name="category" class="text-grey q-mr-sm" />
                  <div class="col">
                    <div class="text-caption text-grey">Type de maison</div>
                    <div class="text-body1">{{ getMaisonTypeLabel(maison.type_maison) }}</div>
                  </div>
                </div>

                <div class="row items-center">
                  <q-icon name="star" class="text-grey q-mr-sm" />
                  <div class="col">
                    <div class="text-caption text-grey">Standing</div>
                    <div class="text-body1">{{ getStandingLabel(maison.standing) }}</div>
                  </div>
                </div>

                <div class="row items-center">
                  <q-icon name="construction" class="text-grey q-mr-sm" />
                  <div class="col">
                    <div class="text-caption text-grey">État</div>
                    <div class="text-body1">{{ getEtatLabel(maison.etat) }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Équipements -->
          <q-card class="q-mb-lg" v-if="hasEquipment">
            <q-card-section>
              <div class="text-h6">Équipements</div>
              <q-separator class="q-my-md" />

              <div class="row">
                <div class="col-6" v-if="maison.jardin">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="grass" color="green" class="q-mr-sm" />
                    <span class="text-body1">Jardin</span>
                  </div>
                </div>

                <div class="col-6" v-if="maison.garage">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="garage" color="blue-grey" class="q-mr-sm" />
                    <span class="text-body1">Garage</span>
                  </div>
                </div>

                <div class="col-6" v-if="maison.piscine">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="pool" color="blue" class="q-mr-sm" />
                    <span class="text-body1">Piscine</span>
                  </div>
                </div>

                <div class="col-6" v-if="maison.climatisation">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="ac_unit" color="cyan" class="q-mr-sm" />
                    <span class="text-body1">Climatisation</span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Informations supplémentaires -->
          <q-card>
            <q-card-section>
              <div class="text-h6">Informations</div>
              <q-separator class="q-my-md" />

              <div class="q-gutter-y-md">
                <div class="row items-center">
                  <q-icon name="sell" class="text-grey q-mr-sm" />
                  <div class="col">
                    <div class="text-caption text-grey">Type d'offre</div>
                    <div class="text-body1">{{ getOffreTypeLabel(maison.type_offre) }}</div>
                  </div>
                </div>

                <div class="row items-center">
                  <q-icon name="calendar_today" class="text-grey q-mr-sm" />
                  <div class="col">
                    <div class="text-caption text-grey">Date d'ajout</div>
                    <div class="text-body1">{{ formatDate(maison.date_creation) }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Modale de suppression -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm text-h6">Confirmer la suppression</span>
        </q-card-section>

        <q-card-section>
          Êtes-vous sûr de vouloir supprimer la maison "{{ maison?.titre }}" ?
          Cette action est irréversible.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn
            label="Supprimer"
            color="negative"
            @click="deleteMaison"
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const API_BASE_URL = 'http://localhost:3000/api'

// Données
const maison = ref(null)
const loading = ref(true)
const error = ref(null)
const deleting = ref(false)
const showDeleteDialog = ref(false)
const carouselSlide = ref(0)

// Computed properties
const hasEquipment = computed(() => {
  return maison.value && (
    maison.value.jardin ||
    maison.value.garage ||
    maison.value.piscine ||
    maison.value.climatisation
  )
})

// Fonctions utilitaires
const formatCurrency = (amount) => {
  if (!amount) return '0 €'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `${API_BASE_URL}${imagePath}`
}

const formatDescription = (description) => {
  if (!description) return '<span class="text-grey">Aucune description</span>'
  return description.replace(/\n/g, '<br>')
}

const getStatusColor = (statut) => {
  const colors = {
    disponible: 'positive',
    loué: 'primary',
    vendu: 'info',
    en_negociation: 'warning',
    maintenance: 'negative',
  }
  return colors[statut] || 'grey'
}

const getStatusLabel = (statut) => {
  const labels = {
    disponible: 'Disponible',
    loué: 'Loué',
    vendu: 'Vendu',
    en_negociation: 'En négociation',
    maintenance: 'En maintenance',
  }
  return labels[statut] || statut
}

const getMaisonTypeLabel = (type) => {
  const labels = {
    villa: 'Villa',
    appartement: 'Appartement',
    duplex: 'Duplex',
    studio: 'Studio',
    fermette: 'Fermette',
    contemporaine: 'Contemporaine',
  }
  return labels[type] || type
}

const getStandingLabel = (standing) => {
  const labels = {
    luxe: 'Luxe',
    haut_de_gamme: 'Haut de gamme',
    standard: 'Standard',
    economique: 'Économique',
  }
  return labels[standing] || standing
}

const getEtatLabel = (etat) => {
  const labels = {
    neuf: 'Neuf',
    bon_etat: 'Bon état',
    renovation: 'À rénover',
    ancien: 'Ancien',
  }
  return labels[etat] || etat
}

const getOffreTypeLabel = (type) => {
  const labels = {
    vente: 'À vendre',
    location: 'À louer',
    vente_location: 'À vendre et à louer',
  }
  return labels[type] || type
}

const getTerrainTypeLabel = (type) => {
  const labels = {
    urbain: 'Urbain',
    agricole: 'Agricole',
    residentiel: 'Résidentiel',
    commercial: 'Commercial',
  }
  return labels[type] || type
}

// Fonction pour récupérer le token JWT
const getAuthToken = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
  if (!token) {
    console.warn('Aucun token JWT trouvé dans le localStorage')
    return 'test-token-for-development'
  }
  return token
}

// Charger les détails de la maison
const fetchMaisonDetails = async () => {
  loading.value = true
  error.value = null

  try {
    const maisonId = route.params.id
    const token = getAuthToken()

    // Charger la maison
    const response = await fetch(`${API_BASE_URL}/maisons/${maisonId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    const maisonData = await response.json()
    maison.value = maisonData
    console.log('Maison chargée:', maison.value)

    // Si la maison a une parcelle associée, charger ses détails
    if (maison.value.parcelle_id) {
      await fetchParcelleDetails()
    }

  } catch (err) {
    console.error('Erreur:', err)
    error.value = err.message || 'Erreur lors du chargement des détails'
  } finally {
    loading.value = false
  }
}

// Charger les détails de la parcelle associée
const fetchParcelleDetails = async () => {
  try {
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/parcelles/${maison.value.parcelle_id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const parcelleData = await response.json()
      maison.value.parcelle_details = parcelleData
      console.log('Détails parcelle chargés:', parcelleData)
    }
  } catch (err) {
    console.error('Erreur chargement parcelle:', err)
  }
}

// Actions
const editMaison = () => {
  if (maison.value) {
    router.push(`/maisons/edit/${maison.value.id}`)
  }
}

const viewParcelle = (parcelleId) => {
  router.push(`/parcelles/${parcelleId}`)
}

const confirmDelete = () => {
  showDeleteDialog.value = true
}

const deleteMaison = async () => {
  deleting.value = true

  try {
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/maisons/${maison.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      $q.notify({
        type: 'positive',
        message: 'Maison supprimée avec succès',
        icon: 'check_circle',
        timeout: 3000,
      })
      router.push('/maisons')
    } else {
      throw new Error('Erreur lors de la suppression')
    }
  } catch (err) {
    console.error('Erreur:', err)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la suppression',
      icon: 'error',
      timeout: 5000,
    })
  } finally {
    deleting.value = false
    showDeleteDialog.value = false
  }
}

// Initialisation
onMounted(() => {
  fetchMaisonDetails()
})
</script>

<style scoped lang="scss">
.maison-details-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.q-carousel-slide img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.text-primary {
  color: #1976d2;
}

.text-grey {
  color: #757575;
}

.cursor-pointer {
  cursor: pointer;
}

.full-width {
  width: 100%;
}

// Responsive
@media (max-width: 768px) {
  .text-h4 {
    font-size: 1.5rem;
  }

  .text-h3 {
    font-size: 2rem;
  }

  .text-h5 {
    font-size: 1.25rem;
  }

  .text-h6 {
    font-size: 1rem;
  }
}
</style>
