<template>
  <q-page class="property-details-page q-pa-lg">
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner-gears color="primary" size="3em" />
      <p class="q-mt-md">Chargement de la propriété...</p>
    </div>

    <div v-else-if="property" class="max-width-1200 mx-auto">
      <!-- Bouton retour -->
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Retour"
        @click="$router.back()"
        class="q-mb-md"
      />

      <!-- Galerie d'images -->
      <div class="property-gallery q-mb-lg">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-img :src="mainImage" :alt="property.name" class="main-image" :ratio="16 / 9">
              <div class="absolute-top-right q-ma-sm">
                <q-badge :color="property.type_offre === 'vente' ? 'deep-purple-6' : 'blue-6'">
                  {{ property.type_offre === 'vente' ? 'À vendre' : 'À louer' }}
                </q-badge>
              </div>
            </q-img>
          </div>

          <div
            v-if="property.original.images && property.original.images.length > 1"
            class="col-12"
          >
            <div class="row q-col-gutter-xs">
              <div
                v-for="(image, index) in property.original.images.slice(0, 4)"
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
        </div>
      </div>

      <!-- Informations principales -->
      <div class="row q-col-gutter-lg">
        <div class="col-md-8">
          <div class="property-main-info">
            <h1 class="text-h4 text-weight-bold q-mb-sm">{{ property.name }}</h1>

            <div class="row items-center q-mb-md">
              <q-icon name="location_on" color="primary" class="q-mr-sm" />
              <span class="text-h6 text-grey-8">{{ property.location }}</span>
              <q-chip
                v-if="property.standing"
                :color="standingColor"
                text-color="white"
                class="q-ml-sm"
              >
                {{ getStandingLabel(property.standing) }}
              </q-chip>
            </div>

            <div class="text-h5 text-primary text-weight-bold q-mb-lg">
              {{ property.price }}
            </div>

            <q-card class="q-mb-lg">
              <q-card-section>
                <h3 class="text-h6 q-mb-md">Description</h3>
                <p class="text-body1">{{ property.description }}</p>
              </q-card-section>
            </q-card>

            <!-- Caractéristiques détaillées -->
            <q-card class="q-mb-lg">
              <q-card-section>
                <h3 class="text-h6 q-mb-md">Caractéristiques</h3>
                <div class="row q-col-gutter-md">
                  <div class="col-md-6">
                    <q-list>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="square_foot" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Superficie</q-item-label>
                          <q-item-label>{{ property.area }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="bed" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Chambres</q-item-label>
                          <q-item-label>{{ property.original.nombre_chambres || 0 }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="bathtub" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Salles de bain</q-item-label>
                          <q-item-label>{{
                            property.original.nombre_salles_bain || 0
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>

                  <div class="col-md-6">
                    <q-list>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="home" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Type</q-item-label>
                          <q-item-label>{{ formatHouseType(property.type_maison) }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="construction" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>État</q-item-label>
                          <q-item-label>{{ formatEtat(property.etat) }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="date_range" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Ajoutée le</q-item-label>
                          <q-item-label>{{
                            formatDate(property.original.date_creation)
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
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
              <h3 class="text-h6 q-mb-md">Intéressé par cette propriété ?</h3>

              <div v-if="property.original.proprietaire" class="q-mb-lg">
                <div class="text-subtitle2 q-mb-xs">Propriétaire</div>
                <div class="row items-center">
                  <q-avatar size="40px" class="q-mr-sm">
                    <q-icon name="person" size="24px" />
                  </q-avatar>
                  <div>
                    <div class="text-weight-medium">{{ property.original.proprietaire.nom }}</div>
                    <div class="text-caption text-grey">
                      {{ property.original.proprietaire.type || 'Propriétaire' }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="q-mb-lg">
                <div class="text-subtitle2 q-mb-xs">Informations parcelle</div>
                <div v-if="property.original.parcelle" class="text-body2">
                  <div><strong>Titre :</strong> {{ property.original.parcelle.titre }}</div>
                  <div><strong>Quartier :</strong> {{ property.original.parcelle.quartier }}</div>
                  <div><strong>Avenue :</strong> {{ property.original.parcelle.avenue }}</div>
                  <div><strong>Numéro :</strong> {{ property.original.parcelle.numero }}</div>
                  <div>
                    <strong>Superficie parcelle :</strong>
                    {{ property.original.parcelle.superficie }} m²
                  </div>
                </div>
              </div>

              <q-btn
                color="primary"
                :label="
                  property.type_offre === 'vente' ? 'Demander une visite' : 'Demander à louer'
                "
                class="full-width q-mb-sm"
                size="lg"
                @click="router.push('../auth/login')"
              />

              <q-btn
                outline
                color="primary"
                label="Contacter le propriétaire"
                class="full-width"
                @click="router.push('../auth/login')"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <div v-else class="text-center q-py-xl">
      <q-icon name="error" size="4em" color="negative" />
      <div class="text-h6 q-mt-md">Propriété non trouvée</div>
      <q-btn
        color="primary"
        label="Retour à l'accueil"
        @click="$router.push('/')"
        class="q-mt-md"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertiesStore } from 'src/stores/properties'
const router = useRouter() // IMPORTANT: Initialiser ici
const route = useRoute()
const propertiesStore = usePropertiesStore()
const loading = ref(true)
const property = ref(null)
const mainImage = ref('')

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/default-house.jpg'
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:3000${imagePath}`
}

const standingColor = computed(() => {
  switch (property.value?.standing) {
    case 'luxe':
      return 'amber'
    case 'haut_de_gamme':
      return 'orange'
    case 'standard':
      return 'green'
    case 'economique':
      return 'blue'
    default:
      return 'grey'
  }
})

const getStandingLabel = (standing) => {
  switch (standing) {
    case 'luxe':
      return 'Luxe'
    case 'haut_de_gamme':
      return 'Haut de gamme'
    case 'standard':
      return 'Standard'
    case 'economique':
      return 'Économique'
    default:
      return standing || 'Standard'
  }
}

const formatHouseType = (type) => {
  const types = {
    villa: 'Villa',
    appartement: 'Appartement',
    duplex: 'Duplex',
    studio: 'Studio',
    fermette: 'Fermette',
    contemporaine: 'Contemporaine',
  }
  return types[type] || type
}

const formatEtat = (etat) => {
  const etats = {
    neuf: 'Neuf',
    bon_etat: 'Bon état',
    renovation: 'À rénover',
    ancien: 'Ancien',
  }
  return etats[etat] || etat
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(async () => {
  try {
    const propertyId = parseInt(route.params.id)

    // Chercher d'abord dans les données déjà chargées
    const existingProperty = propertiesStore.formattedProperties.find((p) => p.id === propertyId)

    if (existingProperty) {
      property.value = existingProperty
      // Définir l'image principale
      if (existingProperty.original.images && existingProperty.original.images.length > 0) {
        mainImage.value = getImageUrl(existingProperty.original.images[0])
      } else {
        mainImage.value = '/images/default-house.jpg'
      }
    } else {
      // Charger depuis l'API
      const response = await propertiesStore.fetchHouseById(propertyId)
      property.value = response
    }
  } catch (error) {
    console.error('Erreur chargement propriété:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.property-details-page {
  background-color: #f8f9fa;
}

.max-width-1200 {
  max-width: 1200px;
}

.main-image {
  border-radius: 12px;
  overflow: hidden;
}

.thumbnail {
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.thumbnail:hover {
  transform: scale(1.05);
}

.sticky-sidebar {
  position: sticky;
  top: 20px;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .sticky-sidebar {
    position: static;
  }
}
</style>
