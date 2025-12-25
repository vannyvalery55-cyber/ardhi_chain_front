<template>
  <q-page class="parcelle-details-page">
    <!-- Bouton retour -->
    <div class="q-pa-md">
      <q-btn
        icon="arrow_back"
        label="Retour aux parcelles"
        color="primary"
        flat
        @click="router.push('/parcelles')"
      />
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-gears color="primary" size="50px" />
      <div class="text-subtitle1 q-mt-md">Chargement des détails de la parcelle...</div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="text-center q-pa-xl">
      <q-icon name="error" color="negative" size="60px" />
      <div class="text-h6 q-mt-md">Erreur de chargement</div>
      <div class="text-body1 q-mt-sm">{{ error }}</div>
      <q-btn
        color="primary"
        label="Réessayer"
        @click="fetchParcelleDetails"
        class="q-mt-md"
      />
    </div>

    <!-- Détails de la parcelle -->
    <div v-else-if="parcelle" class="q-pa-md">
      <!-- En-tête -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-h4 text-weight-bold">{{ parcelle.titre }}</div>
          <div class="text-subtitle1 text-grey">
            <q-icon name="location_on" />
            {{ parcelle.ville }}, {{ parcelle.quartier }}
          </div>
        </div>
        <div class="col-auto">
          <q-badge :color="getStatusColor(parcelle.statut)" class="q-pa-sm text-h6">
            {{ getStatusLabel(parcelle.statut) }}
          </q-badge>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Images et informations principales -->
        <div class="col-12 col-lg-8">
          <!-- Images -->
          <q-card class="q-mb-lg">
            <q-carousel
              v-if="parcelle.images && parcelle.images.length > 0"
              v-model="carouselSlide"
              animated
              infinite
              arrows
              navigation
              height="400px"
            >
              <q-carousel-slide
                v-for="(image, index) in parcelle.images"
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
              <div class="text-body1" v-html="formatDescription(parcelle.description)"></div>
            </q-card-section>
          </q-card>

          <!-- Localisation -->
          <q-card class="q-mb-lg" v-if="parcelle.latitude && parcelle.longitude">
            <q-card-section>
              <div class="text-h6">Localisation GPS</div>
              <q-separator class="q-my-md" />
              <div class="row">
                <div class="col-6">
                  <div class="text-caption text-grey">Latitude</div>
                  <div class="text-body1">{{ parcelle.latitude }}</div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey">Longitude</div>
                  <div class="text-body1">{{ parcelle.longitude }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Informations détaillées -->
        <div class="col-12 col-lg-4">
          <!-- Prix et actions -->
          <q-card class="q-mb-lg">
            <q-card-section>
              <div class="text-h4 text-primary text-center q-mb-md">
                {{ formatCurrency(parcelle.prix_vente) }}
              </div>
              <q-separator class="q-my-md" />

              <div class="row q-gutter-sm">
                <div class="col">
                  <q-btn
                    color="primary"
                    label="Modifier"
                    icon="edit"
                    @click="editParcelle"
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

          <!-- Caractéristiques -->
          <q-card class="q-mb-lg">
            <q-card-section>
              <div class="text-h6">Caractéristiques</div>
              <q-separator class="q-my-md" />

              <div class="q-gutter-y-md">
                <div class="row items-center">
                  <q-icon name="square_foot" class="text-grey q-mr-sm" />
                  <div class="col">
                    <div class="text-caption text-grey">Superficie</div>
                    <div class="text-body1">{{ parcelle.superficie.toLocaleString() }} m²</div>
                  </div>
                </div>

                <div class="row items-center">
                  <q-icon name="terrain" class="text-grey q-mr-sm" />
                  <div class="col">
                    <div class="text-caption text-grey">Type de terrain</div>
                    <div class="text-body1">{{ getTerrainTypeLabel(parcelle.type_terrain) }}</div>
                  </div>
                </div>

                <div class="row items-center">
                  <q-icon name="person" class="text-grey q-mr-sm" />
                  <div class="col">
                    <div class="text-caption text-grey">Rôle</div>
                    <div class="text-body1">{{ getRoleLabel(parcelle.role) }}</div>
                  </div>
                </div>

                <div class="row items-center">
                  <q-icon name="calendar_today" class="text-grey q-mr-sm" />
                  <div class="col">
                    <div class="text-caption text-grey">Date d'ajout</div>
                    <div class="text-body1">{{ formatDate(parcelle.date_creation) }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Adresse complète -->
          <q-card>
            <q-card-section>
              <div class="text-h6">Adresse</div>
              <q-separator class="q-my-md" />

              <div class="q-gutter-y-sm">
                <div v-if="parcelle.avenue" class="row items-center">
                  <q-icon name="directions" class="text-grey q-mr-sm" />
                  <div class="text-body1">{{ parcelle.avenue }}</div>
                </div>

                <div v-if="parcelle.numero" class="row items-center">
                  <q-icon name="numbers" class="text-grey q-mr-sm" />
                  <div class="text-body1">Numéro: {{ parcelle.numero }}</div>
                </div>

                <div class="row items-center">
                  <q-icon name="location_city" class="text-grey q-mr-sm" />
                  <div class="text-body1">{{ parcelle.ville }}</div>
                </div>

                <div class="row items-center">
                  <q-icon name="apartment" class="text-grey q-mr-sm" />
                  <div class="text-body1">Quartier: {{ parcelle.quartier }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Maisons associées (si disponibles) -->
      <div v-if="maisonsAssociees.length > 0" class="q-mt-xl">
        <div class="text-h5 q-mb-md">Maisons sur cette parcelle</div>
        <q-separator class="q-mb-lg" />

        <div class="row q-col-gutter-md">
          <div
            v-for="maison in maisonsAssociees"
            :key="maison.id"
            class="col-12 col-md-6 col-lg-4"
          >
            <q-card class="maison-card cursor-pointer" @click="viewMaison(maison.id)">
              <q-img
                v-if="maison.images && maison.images.length > 0"
                :src="getImageUrl(maison.images[0])"
                height="200px"
              >
                <div class="absolute-bottom">
                  <div class="text-h6 text-white text-weight-bold">{{ maison.titre }}</div>
                </div>
              </q-img>
              <div v-else class="text-center q-pa-lg bg-grey-3">
                <q-icon name="home" size="60px" color="grey" />
                <div class="text-subtitle1 q-mt-sm">Pas d'image</div>
              </div>

              <q-card-section>
                <div class="row items-center q-mb-sm">
                  <div class="col">
                    <q-badge :color="getStatusColor(maison.statut)">
                      {{ getStatusLabel(maison.statut) }}
                    </q-badge>
                  </div>
                  <div class="col-auto text-h6 text-primary">
                    {{ formatCurrency(maison.prix_vente || maison.prix_location) }}
                  </div>
                </div>

                <div class="text-caption">
                  <q-icon name="square_foot" size="14px" class="q-mr-xs" />
                  {{ maison.surface_totale }} m²
                  <q-icon name="bed" size="14px" class="q-ml-sm q-mr-xs" />
                  {{ maison.nombre_chambres }} ch.
                </div>
              </q-card-section>
            </q-card>
          </div>
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
          Êtes-vous sûr de vouloir supprimer la parcelle "{{ parcelle?.titre }}" ?
          Cette action est irréversible.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn
            label="Supprimer"
            color="negative"
            @click="deleteParcelle"
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const API_BASE_URL = 'http://localhost:3000/api'

// Données
const parcelle = ref(null)
const maisonsAssociees = ref([])
const loading = ref(true)
const error = ref(null)
const deleting = ref(false)
const showDeleteDialog = ref(false)
const carouselSlide = ref(0)

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
  // Si c'est déjà une URL complète
  if (imagePath.startsWith('http')) return imagePath
  // Sinon, construire l'URL relative
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

const getTerrainTypeLabel = (type) => {
  const labels = {
    urbain: 'Urbain',
    agricole: 'Agricole',
    residentiel: 'Résidentiel',
    commercial: 'Commercial',
  }
  return labels[type] || type
}

const getRoleLabel = (role) => {
  const labels = {
    proprietaire: 'Propriétaire',
    commissionnaire: 'Commissionnaire',
  }
  return labels[role] || role
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

// Charger les détails de la parcelle
const fetchParcelleDetails = async () => {
  loading.value = true
  error.value = null

  try {
    const parcelleId = route.params.id
    const token = getAuthToken()

    // Charger la parcelle
    const response = await fetch(`${API_BASE_URL}/parcelles/${parcelleId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    parcelle.value = await response.json()
    console.log('Parcelle chargée:', parcelle.value)

    // Charger les maisons associées à cette parcelle
    await fetchMaisonsAssociees()

  } catch (err) {
    console.error('Erreur:', err)
    error.value = err.message || 'Erreur lors du chargement des détails'
  } finally {
    loading.value = false
  }
}

// Charger les maisons associées
const fetchMaisonsAssociees = async () => {
  if (!parcelle.value) return

  try {
    const token = getAuthToken()
    const userId = parcelle.value.utilisateur_id

    // Charger toutes les maisons de l'utilisateur
    const response = await fetch(`${API_BASE_URL}/maisons/utilisateur/${userId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const responseData = await response.json()
      const maisonsData = Array.isArray(responseData) ? responseData : responseData.data || []

      // Filtrer les maisons qui sont sur cette parcelle
      maisonsAssociees.value = maisonsData.filter(
        maison => maison.parcelle_id == parcelle.value.id
      )
      console.log('Maisons associées:', maisonsAssociees.value)
    }
  } catch (err) {
    console.error('Erreur chargement maisons:', err)
  }
}

// Actions
const editParcelle = () => {
  if (parcelle.value) {
    router.push(`/parcelles/edit/${parcelle.value.id}`)
  }
}

const viewMaison = (maisonId) => {
  router.push(`/maisons/${maisonId}`)
}

const confirmDelete = () => {
  showDeleteDialog.value = true
}

const deleteParcelle = async () => {
  deleting.value = true

  try {
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/parcelles/${parcelle.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      $q.notify({
        type: 'positive',
        message: 'Parcelle supprimée avec succès',
        icon: 'check_circle',
        timeout: 3000,
      })
      router.push('/parcelles')
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
  fetchParcelleDetails()
})
</script>

<style scoped lang="scss">
.parcelle-details-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.maison-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
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

  .text-h5 {
    font-size: 1.25rem;
  }

  .text-h6 {
    font-size: 1rem;
  }
}
</style>
