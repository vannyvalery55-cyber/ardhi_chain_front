<template>
  <q-page class="property-details-page">
    <!-- Header avec navigation -->
    <q-header elevated class="bg-blue-9">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="goBack" />
        <q-toolbar-title class="text-white">
          Détails de la propriété
        </q-toolbar-title>
        <q-btn flat round dense icon="share" @click="shareProperty" />
        <q-btn flat round dense icon="favorite" :color="isFavorite ? 'red' : 'white'" @click="toggleFavorite" />
      </q-toolbar>
    </q-header>

    <div v-if="loading" class="loading-container">
      <q-spinner-gears color="blue-6" size="3em" />
      <p class="q-mt-md">Chargement des détails...</p>
    </div>

    <div v-else-if="propertyError" class="error-container q-pa-xl text-center">
      <q-icon name="error" size="xl" color="red" class="q-mb-sm" />
      <div class="text-h5 text-grey-6 q-mb-sm">{{ propertyError }}</div>
      <q-btn color="blue-7" label="Retour à l'accueil" @click="$router.push('/')" />
    </div>

    <div v-else-if="property" class="property-details">
      <!-- Galerie d'images -->
      <div class="gallery-section">
        <div class="main-image">
          <q-carousel
            v-model="currentImage"
            animated
            infinite
            :autoplay="autoplayGallery"
            arrows
            navigation
            height="400px"
            class="rounded-borders"
          >
            <q-carousel-slide
              v-for="(image, index) in propertyImages"
              :key="index"
              :name="index"
              :img-src="image"
            />
          </q-carousel>
        </div>

        <div class="thumbnails q-mt-sm">
          <div
            v-for="(image, index) in propertyImages"
            :key="index"
            class="thumbnail"
            :class="{ active: currentImage === index }"
            @click="currentImage = index"
          >
            <q-img :src="image" ratio="1" class="rounded-borders" />
          </div>
        </div>
      </div>

      <!-- Informations principales -->
      <div class="main-info-section q-pa-lg">
        <div class="row items-start justify-between">
          <div class="col-md-8">
            <h1 class="text-h4 text-weight-bold text-blue-9 q-mb-sm">
              {{ property.titre }}
            </h1>
            
            <div class="location-info q-mb-md">
              <q-icon name="location_on" color="blue-7" class="q-mr-sm" />
              <span class="text-h6 text-grey-8">
                {{ getFullAddress() }}
              </span>
            </div>

            <!-- Badges d'état -->
            <div class="badges-section q-mb-lg">
              <q-badge :color="getStatusColor()" class="q-mr-sm q-mb-sm">
                {{ getStatusText() }}
              </q-badge>
              <q-badge :color="getTypeColor()" class="q-mr-sm q-mb-sm">
                {{ getTypeText() }}
              </q-badge>
              <q-badge :color="getConditionColor()" class="q-mr-sm q-mb-sm">
                {{ getConditionText() }}
              </q-badge>
              <q-badge v-if="property.standing" color="amber" class="q-mr-sm q-mb-sm">
                Standing: {{ property.standing }}
              </q-badge>
            </div>
          </div>

          <div class="col-md-4">
            <div class="price-card q-pa-md text-center">
              <div class="text-h3 text-weight-bold text-blue-9 q-mb-xs">
                {{ formatPrice() }}
              </div>
              <div class="text-caption text-grey-7">
                {{ property.type_offre === 'location' ? 'par mois' : 'prix de vente' }}
              </div>
              
              <div class="q-mt-lg">
                <q-btn
                  v-if="property.type_offre === 'location'"
                  color="blue-7"
                  label="Demander une visite"
                  icon="event"
                  class="full-width q-mb-sm"
                  @click="requestVisit"
                />
                <q-btn
                  v-else
                  color="green-7"
                  label="Demander un rendez-vous"
                  icon="real_estate_agent"
                  class="full-width q-mb-sm"
                  @click="requestAppointment"
                />
                <q-btn
                  color="amber-7"
                  label="Contacter le propriétaire"
                  icon="chat"
                  class="full-width"
                  @click="openChat"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Description et détails -->
      <div class="details-section q-pa-lg">
        <div class="row q-col-gutter-lg">
          <!-- Colonne gauche -->
          <div class="col-md-8">
            <!-- Description -->
            <q-card class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-blue-9">
                  <q-icon name="description" class="q-mr-sm" />
                  Description
                </div>
              </q-card-section>
              <q-card-section>
                <p class="text-body1">{{ property.description || 'Aucune description disponible.' }}</p>
              </q-card-section>
            </q-card>

            <!-- Caractéristiques -->
            <q-card class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-blue-9">
                  <q-icon name="info" class="q-mr-sm" />
                  Caractéristiques
                </div>
              </q-card-section>
              <q-card-section>
                <div class="features-grid">
                  <div class="feature-item">
                    <q-icon name="square_foot" color="blue-7" class="q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey-7">Surface totale</div>
                      <div class="text-weight-medium">{{ property.surface_totale || 0 }} m²</div>
                    </div>
                  </div>
                  
                  <div class="feature-item">
                    <q-icon name="bed" color="blue-7" class="q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey-7">Chambres</div>
                      <div class="text-weight-medium">{{ property.nombre_chambres || 0 }}</div>
                    </div>
                  </div>
                  
                  <div class="feature-item">
                    <q-icon name="bathtub" color="blue-7" class="q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey-7">Salles de bain</div>
                      <div class="text-weight-medium">{{ property.nombre_salles_bain || 0 }}</div>
                    </div>
                  </div>
                  
                  <div class="feature-item">
                    <q-icon name="garage" color="blue-7" class="q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey-7">Garage</div>
                      <div class="text-weight-medium">{{ property.garage ? 'Oui' : 'Non' }}</div>
                    </div>
                  </div>
                  
                  <div class="feature-item">
                    <q-icon name="yard" color="blue-7" class="q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey-7">Jardin</div>
                      <div class="text-weight-medium">{{ property.jardin ? 'Oui' : 'Non' }}</div>
                    </div>
                  </div>
                  
                  <div class="feature-item">
                    <q-icon name="pool" color="blue-7" class="q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey-7">Piscine</div>
                      <div class="text-weight-medium">{{ property.piscine ? 'Oui' : 'Non' }}</div>
                    </div>
                  </div>
                  
                  <div class="feature-item">
                    <q-icon name="balcony" color="blue-7" class="q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey-7">Terrasse</div>
                      <div class="text-weight-medium">{{ property.terrace ? 'Oui' : 'Non' }}</div>
                    </div>
                  </div>
                  
                  <div class="feature-item">
                    <q-icon name="ac_unit" color="blue-7" class="q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey-7">Climatisation</div>
                      <div class="text-weight-medium">{{ property.climatisation ? 'Oui' : 'Non' }}</div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Localisation -->
            <q-card class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-blue-9">
                  <q-icon name="map" class="q-mr-sm" />
                  Localisation
                </div>
              </q-card-section>
              <q-card-section>
                <div class="location-details">
                  <div class="q-mb-md">
                    <div class="text-weight-medium">Adresse complète :</div>
                    <div class="text-body1">{{ getFullAddress() }}</div>
                    <div v-if="hasCoordinates" class="text-caption text-green-7 q-mt-xs">
                      <q-icon name="place" size="xs" /> Coordonnées disponibles
                    </div>
                  </div>
                  
                  <!-- Carte OpenStreetMap -->
                  <div class="map-container">
                    <div v-if="hasCoordinates" class="real-map">
                      <l-map 
                        ref="map"
                        :zoom="zoom"
                        :center="mapCenter"
                        @ready="onMapReady"
                        style="height: 400px; width: 100%; border-radius: 8px;"
                      >
                        <l-tile-layer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          layer-type="base"
                          name="OpenStreetMap"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <l-marker :lat-lng="mapCenter">
                          <l-popup>
                            <div class="map-popup-content">
                              <strong>{{ property.titre }}</strong><br>
                              {{ getFullAddress() }}<br>
                              {{ formatPrice() }}
                            </div>
                          </l-popup>
                        </l-marker>
                      </l-map>
                    </div>
                    <div v-else class="map-fallback">
                      <div class="text-center q-py-xl">
                        <q-icon name="map" size="xl" color="grey-4" class="q-mb-sm" />
                        <p class="text-grey-6">Géolocalisation en cours...</p>
                        <q-btn 
                          flat 
                          color="blue-7" 
                          label="Voir sur Google Maps" 
                          @click="openGoogleMaps"
                          class="q-mt-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div class="q-mt-md text-center">
                    <q-btn 
                      outline 
                      color="blue-7" 
                      icon="directions" 
                      label="Obtenir l'itinéraire" 
                      @click="getDirections"
                      :disable="!hasCoordinates"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Colonne droite -->
          <div class="col-md-4">
            <!-- Informations propriétaire -->
            <q-card class="q-mb-lg">
              <q-card-section class="bg-blue-1">
                <div class="text-h6 text-weight-bold text-blue-9">
                  <q-icon name="person" class="q-mr-sm" />
                  Propriétaire
                </div>
              </q-card-section>
              <q-card-section>
                <div v-if="property.proprietaire" class="owner-info">
                  <div class="row items-center q-mb-md">
                    <q-avatar size="60px" color="blue-7" text-color="white" class="q-mr-md">
                      <q-icon name="person" v-if="!property.proprietaire.avatar" />
                      <q-img v-else :src="property.proprietaire.avatar" />
                    </q-avatar>
                    <div>
                      <div class="text-h6 text-weight-bold">{{ property.proprietaire.nom || 'Propriétaire' }}</div>
                      <div class="text-caption text-grey-7">
                        <q-icon name="verified" size="xs" color="green" class="q-mr-xs" />
                        Membre vérifié
                      </div>
                    </div>
                  </div>
                  
                  <div class="contact-info">
                    <q-btn
                      color="blue-7"
                      icon="phone"
                      label="Appeler"
                      class="full-width q-mb-sm"
                      :disable="!property.proprietaire.telephone"
                      @click="callOwner"
                    />
                    <q-btn
                      color="green-7"
                      icon="chat"
                      label="Ouvrir le chat"
                      class="full-width"
                      @click="openChat"
                    />
                  </div>
                </div>
                <div v-else class="text-center q-py-md">
                  <q-icon name="person_off" size="xl" color="grey-4" class="q-mb-sm" />
                  <p class="text-grey-6">Information propriétaire non disponible</p>
                </div>
              </q-card-section>
            </q-card>

            <!-- Documents légaux -->
            <q-card class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-blue-9">
                  <q-icon name="folder" class="q-mr-sm" />
                  Documents disponibles
                </div>
              </q-card-section>
              <q-card-section>
                <q-list dense>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="description" color="blue" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Certificat de propriété</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn flat round dense icon="visibility" @click="viewDocument('certificat')" />
                    </q-item-section>
                  </q-item>
                  
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="description" color="green" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Plan cadastral</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn flat round dense icon="visibility" @click="viewDocument('cadastral')" />
                    </q-item-section>
                  </q-item>
                  
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="description" color="amber" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Diagnostics techniques</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn flat round dense icon="visibility" @click="viewDocument('diagnostics')" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>

            <!-- Statut blockchain -->
            <q-card class="q-mb-lg">
              <q-card-section class="bg-deep-purple-1">
                <div class="text-h6 text-weight-bold text-deep-purple-9">
                  <q-icon name="security" class="q-mr-sm" />
                  Sécurité Blockchain
                </div>
              </q-card-section>
              <q-card-section>
                <div class="blockchain-info">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="verified" color="green" class="q-mr-sm" />
                    <span class="text-weight-medium">Certifié et sécurisé</span>
                  </div>
                  <p class="text-caption text-grey-7">
                    Cette propriété est enregistrée sur la blockchain, garantissant son authenticité et sa traçabilité.
                  </p>
                  
                  <div class="blockchain-details q-mt-md">
                    <div class="text-caption text-grey-7 q-mb-xs">Hash de transaction :</div>
                    <div class="text-caption text-weight-medium text-truncate">
                      {{ property.blockchain_hash || '0x' + Math.random().toString(16).substr(2, 64) }}
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Composant Chat intégré directement -->
      <div class="parcelle-chat" :class="{ 'chat-open': chatOpen }">
        <!-- En-tête du chat -->
        <div class="chat-header" @click="toggleChat">
          <div class="chat-header-content">
            <q-icon name="chat" class="q-mr-sm" />
            <span class="chat-title">Chat avec le propriétaire</span>
            <q-badge v-if="unreadMessages > 0" color="red" rounded>
              {{ unreadMessages }}
            </q-badge>
            <q-icon :name="chatOpen ? 'expand_less' : 'expand_more'" class="q-ml-auto" />
          </div>
        </div>

        <!-- Contenu du chat (visible seulement quand ouvert) -->
        <div v-if="chatOpen" class="chat-content">
          <!-- Messages -->
          <div class="chat-messages" ref="messagesContainer">
            <div v-for="(message, index) in chatMessages" :key="index"
                 :class="['message', message.type]">

              <!-- En-tête du message -->
              <div v-if="message.sender" class="message-sender">
                <q-avatar size="24px" class="q-mr-xs">
                  <q-icon :name="message.type === 'sent' ? 'person' : 'support_agent'" />
                </q-avatar>
                <span class="sender-name">{{ message.sender }}</span>
                <span class="message-time">{{ message.time }}</span>
              </div>

              <!-- Contenu du message -->
              <div class="message-content">
                {{ message.text }}
              </div>

              <!-- Status du message -->
              <div v-if="message.status" class="message-status">
                <q-icon :name="getMessageStatusIcon(message.status)" size="xs" />
                <span class="status-text">{{ message.status }}</span>
              </div>
            </div>

            <!-- Indicateur de saisie -->
            <div v-if="isTyping" class="typing-indicator">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="typing-text">Le propriétaire est en train d'écrire...</span>
            </div>
          </div>

          <!-- Zone de saisie -->
          <div class="chat-input">
            <q-input
              v-model="newChatMessage"
              placeholder="Tapez votre message..."
              dense
              outlined
              rounded
              class="message-input"
              @keyup.enter="sendChatMessage"
            >
              <template v-slot:before>
                <q-btn flat round icon="attach_file" size="sm">
                  <q-tooltip>Joindre un fichier</q-tooltip>
                </q-btn>
              </template>

              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  :icon="newChatMessage.trim() ? 'send' : 'mic'"
                  :color="newChatMessage.trim() ? 'green-7' : 'grey-6'"
                  @click="newChatMessage.trim() ? sendChatMessage() : startRecording()"
                  :loading="sendingMessage"
                >
                  <q-tooltip>
                    {{ newChatMessage.trim() ? 'Envoyer' : 'Enregistrer un message vocal' }}
                  </q-tooltip>
                </q-btn>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <!-- Boutons d'action flottants -->
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="chat" color="blue-7" @click="openChat">
          <q-tooltip>Contacter</q-tooltip>
        </q-btn>
      </q-page-sticky>

      <!-- Dialogs -->
      <!-- Dialog de demande de visite -->
      <q-dialog v-model="visitDialog">
        <q-card style="width: 500px; max-width: 90vw;">
          <q-card-section class="bg-blue-7 text-white">
            <div class="text-h6">Demander une visite</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="submitVisitRequest" class="q-gutter-md">
              <q-input
                v-model="visitRequest.name"
                label="Votre nom *"
                outlined
                required
              />

              <q-input
                v-model="visitRequest.email"
                type="email"
                label="Votre email *"
                outlined
                required
              />

              <q-input
                v-model="visitRequest.phone"
                label="Votre téléphone"
                outlined
              />

              <q-input
                v-model="visitRequest.date"
                type="date"
                label="Date souhaitée *"
                outlined
                required
              />

              <q-input
                v-model="visitRequest.time"
                type="time"
                label="Heure souhaitée *"
                outlined
                required
              />

              <q-input
                v-model="visitRequest.message"
                label="Message (optionnel)"
                type="textarea"
                outlined
                rows="3"
              />
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Annuler" color="grey" v-close-popup />
            <q-btn label="Envoyer la demande" color="blue-7" @click="submitVisitRequest" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Dialog de contact -->
      <q-dialog v-model="contactDialog">
        <q-card style="width: 500px; max-width: 90vw;">
          <q-card-section class="bg-green-7 text-white">
            <div class="text-h6">Contacter le propriétaire</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="submitContact" class="q-gutter-md">
              <q-input
                v-model="contactMessage.name"
                label="Votre nom *"
                outlined
                required
              />

              <q-input
                v-model="contactMessage.email"
                type="email"
                label="Votre email *"
                outlined
                required
              />

              <q-input
                v-model="contactMessage.phone"
                label="Votre téléphone"
                outlined
              />

              <q-input
                v-model="contactMessage.subject"
                label="Sujet *"
                outlined
                required
              />

              <q-input
                v-model="contactMessage.message"
                label="Votre message *"
                type="textarea"
                outlined
                required
                rows="4"
              />
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Annuler" color="grey" v-close-popup />
            <q-btn label="Envoyer le message" color="green-7" @click="submitContact" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet"

// Router, Route et Quasar
const route = useRoute()
const router = useRouter()
const $q = useQuasar()

// États principaux
const loading = ref(true)
const property = ref(null)
const propertyError = ref(null)
const currentImage = ref(0)
const autoplayGallery = ref(false)
const isFavorite = ref(false)
const visitDialog = ref(false)
const contactDialog = ref(false)

// États pour la carte
const zoom = ref(15)
const map = ref(null)
const geocodingAttempted = ref(false)

// États pour le chat
const chatOpen = ref(false)
const unreadMessages = ref(0)
const chatMessages = ref([])
const newChatMessage = ref('')
const sendingMessage = ref(false)
const isTyping = ref(false)
const messagesContainer = ref(null)

// Formulaires
const visitRequest = ref({
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  message: ''
})

const contactMessage = ref({
  name: '',
  email: '',
  phone: '',
  subject: `À propos de la propriété ${route.params.id}`,
  message: ''
})

// Computed properties
const propertyImages = computed(() => {
  if (!property.value) return []
  
  const images = []
  
  // Images principales
  if (property.value.images) {
    if (Array.isArray(property.value.images)) {
      property.value.images.forEach(img => {
        if (img.startsWith('/')) {
          images.push(`http://localhost:3000${img}`)
        } else {
          images.push(img)
        }
      })
    } else if (typeof property.value.images === 'string') {
      if (property.value.images.startsWith('/')) {
        images.push(`http://localhost:3000${property.value.images}`)
      } else {
        images.push(property.value.images)
      }
    }
  }
  
  // Image par défaut si aucune image
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
  }
  
  return images
})

// Computed pour les coordonnées de la carte
const hasCoordinates = computed(() => {
  if (!property.value?.parcelle) return false
  const parcelle = property.value.parcelle
  
  // Vérifier si des coordonnées existent déjà
  if (parcelle.latitude && parcelle.longitude) {
    const lat = parseFloat(parcelle.latitude)
    const lng = parseFloat(parcelle.longitude)
    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0
  }
  return false
})

const mapCenter = computed(() => {
  if (!property.value?.parcelle) return [0, 0]
  
  const parcelle = property.value.parcelle
  const lat = parseFloat(parcelle.latitude) || 0
  const lng = parseFloat(parcelle.longitude) || 0
  
  return [lat, lng]
})

// Méthodes utilitaires
const getFullAddress = () => {
  if (!property.value || !property.value.parcelle) {
    return 'Adresse non disponible'
  }
  
  const parcelle = property.value.parcelle
  const parts = []
  
  if (parcelle.numero) parts.push(parcelle.numero)
  if (parcelle.avenue) parts.push(parcelle.avenue)
  if (parcelle.quartier) parts.push(parcelle.quartier)
  if (parcelle.ville) parts.push(parcelle.ville)
  
  return parts.length > 0 ? parts.join(', ') : 'Localisation non spécifiée'
}

const formatPrice = () => {
  if (!property.value) return 'Prix non spécifié'
  
  if (property.value.prix_location) {
    return `${Number(property.value.prix_location).toLocaleString()} €/mois`
  } else if (property.value.prix_vente) {
    return `${Number(property.value.prix_vente).toLocaleString()} €`
  }
  
  return 'Prix non spécifié'
}

const getStatusColor = () => {
  if (!property.value) return 'grey'
  
  const statut = property.value.statut?.toLowerCase()
  switch (statut) {
    case 'disponible': return 'green'
    case 'réservé': return 'amber'
    case 'vendu': return 'red'
    case 'loué': return 'blue'
    default: return 'grey'
  }
}

const getStatusText = () => {
  if (!property.value) return 'Statut inconnu'
  
  const statut = property.value.statut?.toLowerCase()
  switch (statut) {
    case 'disponible': return 'Disponible'
    case 'réservé': return 'Réservé'
    case 'vendu': return 'Vendu'
    case 'loué': return 'Loué'
    default: return property.value.statut || 'Disponible'
  }
}

const getTypeColor = () => {
  if (!property.value) return 'grey'
  
  const type = property.value.type_offre
  switch (type) {
    case 'location': return 'blue'
    case 'vente': return 'green'
    default: return 'grey'
  }
}

const getTypeText = () => {
  if (!property.value) return 'Type inconnu'
  
  const type = property.value.type_offre
  switch (type) {
    case 'location': return 'À louer'
    case 'vente': return 'À vendre'
    default: return type || 'Type inconnu'
  }
}

const getConditionColor = () => {
  if (!property.value) return 'grey'
  
  const etat = property.value.etat
  switch (etat) {
    case 'neuf': return 'green'
    case 'bon_etat': return 'blue'
    case 'renovation': return 'amber'
    case 'ancien': return 'grey'
    default: return 'grey'
  }
}

const getConditionText = () => {
  if (!property.value) return 'État inconnu'
  
  const etat = property.value.etat
  switch (etat) {
    case 'neuf': return 'Neuf'
    case 'bon_etat': return 'Bon état'
    case 'renovation': return 'À rénover'
    case 'ancien': return 'Ancien'
    default: return etat || 'État inconnu'
  }
}

const checkFavorite = () => {
  try {
    const favorites = JSON.parse(localStorage.getItem('favorite_houses') || '[]')
    isFavorite.value = favorites.some(fav => fav.id === property.value?.id)
  } catch {
    isFavorite.value = false
  }
}

// Méthodes pour la carte
const onMapReady = () => {
  // La carte est prête
  console.log('Carte Leaflet prête')
}

const geocodeAddress = async () => {
  if (!property.value?.parcelle || geocodingAttempted.value) return
  
  const address = getFullAddress()
  if (!address || address === 'Localisation non spécifiée') return
  
  try {
    geocodingAttempted.value = true
    
    // Utiliser Nominatim (service de géocodage gratuit d'OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    )
    
    if (!response.ok) {
      throw new Error('Erreur de géocodage')
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      // Mettre à jour les coordonnées de la propriété
      if (!property.value.parcelle.latitude) {
        property.value.parcelle.latitude = parseFloat(data[0].lat)
      }
      if (!property.value.parcelle.longitude) {
        property.value.parcelle.longitude = parseFloat(data[0].lon)
      }
      
      // Recentrer la carte si elle existe
      await nextTick()
      if (map.value && map.value.leafletObject && hasCoordinates.value) {
        map.value.leafletObject.setView(mapCenter.value, zoom.value)
      }
      
      return true
    }
  } catch (error) {
    console.error('Erreur de géocodage:', error)
  }
  
  return false
}

const getDirections = () => {
  if (!hasCoordinates.value) {
    // Si pas de coordonnées, utilisez juste l'adresse
    openGoogleMaps()
    return
  }
  
  const [lat, lng] = mapCenter.value
  
  // Ouvrir dans OpenStreetMap
  window.open(`https://www.openstreetmap.org/directions?from=&to=${lat},${lng}`, '_blank')
}

const openGoogleMaps = () => {
  if (hasCoordinates.value) {
    const [lat, lng] = mapCenter.value
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank')
  } else {
    const address = encodeURIComponent(getFullAddress())
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
  }
}

// Méthodes pour le chat
const loadDemoMessages = () => {
  chatMessages.value = [
    {
      type: 'received',
      sender: property.value?.proprietaire?.nom || 'Propriétaire',
      text: 'Bonjour ! Je suis intéressé par votre propriété. Est-elle toujours disponible ?',
      time: '10:30',
      status: 'lu'
    },
    {
      type: 'sent',
      sender: 'Vous',
      text: `Bonjour ! Oui, la propriété "${property.value?.titre || ''}" est toujours disponible.`,
      time: '10:32',
      status: 'envoyé'
    },
    {
      type: 'received',
      sender: property.value?.proprietaire?.nom || 'Propriétaire',
      text: 'Parfait ! Pouvons-nous fixer une visite sur place ?',
      time: '10:33',
      status: 'lu'
    }
  ]
}

const toggleChat = () => {
  chatOpen.value = !chatOpen.value
  
  // Marquer les messages comme lus quand on ouvre le chat
  if (chatOpen.value) {
    unreadMessages.value = 0
  }
  
  if (chatOpen.value) {
    nextTick(() => {
      scrollChatToBottom()
    })
  }
}

const openChat = () => {
  chatOpen.value = true
  unreadMessages.value = 0
  
  nextTick(() => {
    scrollChatToBottom()
  })
}

const sendChatMessage = async () => {
  if (!newChatMessage.value.trim()) return

  const message = {
    type: 'sent',
    sender: 'Vous',
    text: newChatMessage.value,
    time: new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'en attente'
  }

  chatMessages.value.push(message)
  newChatMessage.value = ''
  sendingMessage.value = true

  // Simuler l'envoi
  setTimeout(() => {
    const sentMessage = chatMessages.value.find(m => m.status === 'en attente')
    if (sentMessage) {
      sentMessage.status = 'envoyé'
    }
    sendingMessage.value = false
  }, 500)

  // Simuler une réponse automatique
  setTimeout(() => {
    simulateChatResponse()
  }, 2000)

  scrollChatToBottom()
}

const simulateChatResponse = () => {
  isTyping.value = true

  setTimeout(() => {
    const responses = [
      'Je vous recontacte dès que possible pour confirmer.',
      'Merci pour votre message. Pouvons-nous en discuter par téléphone ?',
      'Je note votre demande de visite. Je vous confirme l\'horaire ce soir.',
      'Parfait ! Apportez une pièce d\'identité pour la visite.',
      'Je suis disponible demain après-midi à partir de 14h.'
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    chatMessages.value.push({
      type: 'received',
      sender: property.value?.proprietaire?.nom || 'Propriétaire',
      text: randomResponse,
      time: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'lu'
    })

    isTyping.value = false
    scrollChatToBottom()
  }, 1500)
}

const startRecording = () => {
  console.log('Démarrage enregistrement vocal')
  // Implémenter la logique d'enregistrement vocal ici
}

const getMessageStatusIcon = (status) => {
  switch(status) {
    case 'en attente': return 'schedule'
    case 'envoyé': return 'done'
    case 'lu': return 'done_all'
    default: return 'info'
  }
}

const scrollChatToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Méthodes d'action principales
const goBack = () => {
  router.go(-1)
}

const shareProperty = () => {
  if (navigator.share) {
    navigator.share({
      title: property.value.titre,
      text: `Découvrez cette propriété : ${property.value.titre}`,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    $q.notify({
      message: 'Lien copié dans le presse-papier',
      color: 'green',
      icon: 'content_copy'
    })
  }
}

const toggleFavorite = () => {
  try {
    const favorites = JSON.parse(localStorage.getItem('favorite_houses') || '[]')
    
    if (isFavorite.value) {
      // Retirer des favoris
      const index = favorites.findIndex(fav => fav.id === property.value.id)
      if (index > -1) {
        favorites.splice(index, 1)
      }
    } else {
      // Ajouter aux favoris
      favorites.push({
        id: property.value.id,
        titre: property.value.titre,
        image: propertyImages.value[0],
        price: formatPrice(),
        addedAt: new Date().toISOString()
      })
    }
    
    localStorage.setItem('favorite_houses', JSON.stringify(favorites))
    isFavorite.value = !isFavorite.value
    
    $q.notify({
      message: isFavorite.value ? 'Ajouté aux favoris' : 'Retiré des favoris',
      color: isFavorite.value ? 'red' : 'grey',
      icon: isFavorite.value ? 'favorite' : 'favorite_border'
    })
  } catch (error) {
    console.error('Erreur gestion favoris:', error)
  }
}

const requestVisit = () => {
  visitDialog.value = true
}

const requestAppointment = () => {
  $q.dialog({
    title: 'Demander un rendez-vous',
    message: 'Souhaitez-vous prendre rendez-vous pour visiter cette propriété ?',
    ok: {
      label: 'Oui, continuer',
      color: 'blue'
    },
    cancel: {
      label: 'Annuler',
      color: 'grey'
    }
  }).onOk(() => {
    visitDialog.value = true
  })
}

const submitVisitRequest = () => {
  // Enregistrer la demande
  try {
    const requests = JSON.parse(localStorage.getItem('visit_requests') || '[]')
    requests.push({
      propertyId: property.value.id,
      propertyTitle: property.value.titre,
      ...visitRequest.value,
      submittedAt: new Date().toISOString()
    })
    
    localStorage.setItem('visit_requests', JSON.stringify(requests))
    
    $q.notify({
      message: 'Demande de visite envoyée avec succès',
      color: 'green',
      icon: 'check_circle'
    })
    
    visitDialog.value = false
    
    // Réinitialiser le formulaire
    visitRequest.value = {
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      message: ''
    }
  } catch (error) {
    console.error('Erreur envoi demande:', error)
    $q.notify({
      message: 'Erreur lors de l\'envoi de la demande',
      color: 'red',
      icon: 'error'
    })
  }
}

const submitContact = () => {
  // Enregistrer le message
  try {
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
    messages.push({
      propertyId: property.value.id,
      propertyTitle: property.value.titre,
      ...contactMessage.value,
      submittedAt: new Date().toISOString()
    })
    
    localStorage.setItem('contact_messages', JSON.stringify(messages))
    
    $q.notify({
      message: 'Message envoyé avec succès',
      color: 'green',
      icon: 'check_circle'
    })
    
    contactDialog.value = false
    
    // Réinitialiser le formulaire
    contactMessage.value = {
      name: '',
      email: '',
      phone: '',
      subject: `À propos de la propriété ${route.params.id}`,
      message: ''
    }
  } catch (error) {
    console.error('Erreur envoi message:', error)
    $q.notify({
      message: 'Erreur lors de l\'envoi du message',
      color: 'red',
      icon: 'error'
    })
  }
}

const callOwner = () => {
  if (property.value?.proprietaire?.telephone) {
    window.location.href = `tel:${property.value.proprietaire.telephone}`
  } else {
    $q.notify({
      message: 'Numéro de téléphone non disponible',
      color: 'amber',
      icon: 'phone_disabled'
    })
  }
}



const viewDocument = (type) => {
  $q.notify({
    message: `Ouverture du document: ${type}`,
    color: 'blue',
    icon: 'description'
  })
}

// Chargement de la propriété
const fetchPropertyDetails = async () => {
  const propertyId = route.params.id
  
  if (!propertyId) {
    propertyError.value = 'ID de propriété non spécifié'
    loading.value = false
    return
  }
  
  try {
    loading.value = true
    
    // Essayer l'API d'abord
    try {
      const response = await api.get(`/api/maisons/${propertyId}`)
      
      if (response.data && response.data.data) {
        property.value = response.data.data
        
        // Tenter le géocodage si pas de coordonnées
        if (!hasCoordinates.value) {
          await geocodeAddress()
        }
        
        // Charger les messages de démonstration pour le chat
        loadDemoMessages()
        
        // Simuler des messages non lus
        unreadMessages.value = 3
        
        // Enregistrer dans l'historique de consultation
        const viewed = {
          propertyId: property.value.id,
          propertyTitle: property.value.titre,
          viewedAt: new Date().toISOString()
        }
        
        const recent = JSON.parse(localStorage.getItem('recently_viewed') || '[]')
        const filtered = recent.filter(r => r.propertyId !== property.value.id)
        localStorage.setItem('recently_viewed', JSON.stringify([viewed, ...filtered].slice(0, 20)))
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (apiError) {
      console.warn('API non disponible, utilisation des données locales:', apiError)
      
      // Charger depuis le store local (mode démo)
      const propertiesStore = await import('src/stores/properties').then(mod => mod.usePropertiesStore())
      await propertiesStore.fetchHouses()
      
      const allHouses = propertiesStore.houses || []
      const foundProperty = allHouses.find(house => house.id == propertyId)
      
      if (foundProperty) {
        property.value = foundProperty
        
        // Tenter le géocodage si pas de coordonnées
        if (!hasCoordinates.value) {
          await geocodeAddress()
        }
        
        // Charger les messages de démonstration pour le chat
        loadDemoMessages()
        
        // Simuler des messages non lus
        unreadMessages.value = 3
      } else {
        throw new Error('Propriété non trouvée')
      }
    }
    
    checkFavorite()
    
  } catch (error) {
    console.error('Erreur chargement propriété:', error)
    propertyError.value = error.message || 'Impossible de charger les détails de la propriété'
  } finally {
    loading.value = false
  }
}

// Watchers
watch(hasCoordinates, (newVal) => {
  if (newVal && map.value && map.value.leafletObject) {
    nextTick(() => {
      map.value.leafletObject.setView(mapCenter.value, zoom.value)
    })
  }
})

watch(chatOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      scrollChatToBottom()
    })
  }
})

// Initialisation
onMounted(() => {
  fetchPropertyDetails()
})
</script>

<style scoped>
.property-details-page {
  background-color: #f8f9fa;
  padding-bottom: 100px; /* Espace pour le chat */
}

.loading-container,
.error-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.property-details {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

/* Galerie */
.gallery-section {
  position: relative;
}

.main-image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
}

.thumbnail {
  width: 80px;
  height: 80px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail.active {
  border-color: #1976d2;
}

.thumbnail:hover {
  transform: scale(1.05);
}

/* Informations principales */
.price-card {
  background: linear-gradient(135deg, #f0f7ff 0%, #e3f2fd 100%);
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.1);
}

.location-info {
  display: flex;
  align-items: center;
}

.badges-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Caractéristiques */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: #e3f2fd;
  transform: translateY(-2px);
}

/* Carte */
.map-container {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.real-map {
  height: 400px;
  position: relative;
}

.map-fallback {
  background: #f5f5f5;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #e0e0e0;
}

.map-popup-content {
  padding: 8px;
  font-size: 14px;
  line-height: 1.4;
}

/* Informations propriétaire */
.owner-info {
  padding: 10px 0;
}

.contact-info {
  margin-top: 20px;
}

/* Documents */
.q-list {
  border-radius: 8px;
}

.q-item {
  border-radius: 8px;
  margin-bottom: 4px;
}

.q-item:hover {
  background-color: #f5f5f5;
}

/* Blockchain info */
.blockchain-info {
  padding: 10px;
}

.blockchain-details {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #7b1fa2;
  overflow-wrap: break-word;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Chat Styles */
.parcelle-chat {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  background: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.parcelle-chat.chat-open {
  max-height: 70vh;
}

.chat-header {
  padding: 12px 16px;
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  cursor: pointer;
  user-select: none;
}

.chat-header-content {
  display: flex;
  align-items: center;
}

.chat-title {
  font-weight: 500;
  flex: 1;
}

.chat-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 300px;
  max-height: 60vh;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8f9fa;
}

.message {
  max-width: 85%;
  padding: 12px;
  border-radius: 12px;
  position: relative;
}

.message.sent {
  align-self: flex-end;
  background: linear-gradient(135deg, #2E7D32 0%, #388E3C 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received {
  align-self: flex-start;
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.message-sender {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.sender-name {
  font-weight: 500;
  margin-right: 8px;
}

.message-time {
  font-size: 0.7rem;
  opacity: 0.6;
}

.message-content {
  word-wrap: break-word;
  line-height: 1.4;
}

.message-status {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 4px;
  font-size: 0.7rem;
  opacity: 0.7;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  align-self: flex-start;
}

.typing-dots {
  display: flex;
  gap: 3px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2E7D32;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.typing-text {
  font-size: 0.8rem;
  color: #666;
}

.chat-input {
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  background: white;
}

.message-input {
  background: #f8f9fa;
}

/* Animation */
@keyframes typing {
  0%, 100% {
    opacity: 0.4;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .property-details {
    padding: 0 10px;
  }
  
  .main-info-section .row {
    flex-direction: column;
  }
  
  .price-card {
    margin-top: 20px;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gallery-section {
    margin: 0 -10px;
  }
  
  .main-image {
    border-radius: 0;
  }
  
  .thumbnails {
    padding: 10px;
  }
  
  .real-map {
    height: 300px;
  }
  
  .parcelle-chat {
    width: calc(100vw - 40px);
    right: 10px;
    bottom: 10px;
  }
  
  .parcelle-chat.chat-open {
    max-height: 60vh;
  }
}

@media (max-width: 480px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .badges-section {
    justify-content: center;
  }
  
  .thumbnails {
    justify-content: center;
  }
  
  .real-map {
    height: 250px;
  }
  
  .parcelle-chat {
    width: calc(100vw - 20px);
  }
}

/* Correction des icônes Leaflet */
:deep(.leaflet-default-icon-path) {
  background-image: url(https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png);
}

:deep(.leaflet-default-shadow-path) {
  background-image: url(https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png);
}

:deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}
</style>