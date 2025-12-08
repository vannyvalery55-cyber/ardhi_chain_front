<template>
  <q-card class="property-card-square shadow-3" flat bordered>

    <!-- Image de la propriété -->
    <div class="property-image-container">
      <q-img
        :src="getImageUrl(property)"
        :alt="property.name"
        class="property-image"
        loading="lazy"
        :ratio="1"
      >
        <!-- Badge de catégorie -->
        <div class="absolute-top-left q-ma-sm">
          <q-badge
            :color="categoryColor"
            class="text-caption text-weight-bold"
          >
            {{ getCategoryLabel }}
          </q-badge>
        </div>

        <!-- Badge Statut pour les parcelles -->
        <div class="absolute-top-right q-ma-sm">
          <q-badge
            :color="statusColor"
            class="status-badge"
          >
            {{ property.statut || 'Disponible' }}
          </q-badge>
        </div>

        <!-- Overlay au survol -->
        <div class="property-image-overlay">
          <div class="overlay-content text-center">
            <q-btn
              round
              color="white"
              text-color="deep-purple-7"
              :icon="isUserLoggedIn ? 'visibility' : 'lock'"
              size="md"
              class="view-details-btn q-mb-sm"
              @click.stop="viewDetails"
            />

            <!-- Message conditionnel -->
            <div class="auth-hint text-white text-caption">
              {{ isUserLoggedIn ? 'Voir détails' : 'Connectez-vous' }}
            </div>
          </div>
        </div>
      </q-img>
    </div>

    <!-- Contenu de la carte -->
    <q-card-section class="property-content">

      <!-- Titre et localisation -->
      <div class="property-title q-mb-sm">
        <div class="text-subtitle1 text-weight-bold text-dark ellipsis-2-lines">
          {{ property.name }}
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">
          <q-icon name="location_on" size="xs" class="q-mr-xs" />
          {{ property.location }}
        </div>
        <div v-if="property.type" class="text-caption text-grey-6 q-mt-xs">
          <q-icon name="landscape" size="xs" class="q-mr-xs" />
          {{ property.type }}
        </div>
      </div>

      <!-- Description courte -->
      <div class="property-description q-mb-md">
        <div class="text-caption text-grey-8 ellipsis-3-lines">
          {{ property.description }}
        </div>
      </div>

      <!-- Informations principales -->
      <div class="property-info row q-col-gutter-xs q-mb-md">
        <div class="col-6">
          <div class="text-caption text-grey-6">Superficie</div>
          <div class="text-subtitle2 text-weight-medium text-dark">
            {{ property.area || (property.superficie ? `${property.superficie} m²` : 'Non spécifié') }}
          </div>
        </div>
        <div class="col-6">
          <div class="text-caption text-grey-6">
            Prix
          </div>
          <div class="text-subtitle2 text-weight-bold text-deep-purple-7">
            {{ property.priceFormatted || property.price || 'Prix sur demande' }}
          </div>
        </div>
      </div>

      <!-- Caractéristiques des parcelles (version simplifiée) -->
      <div v-if="getFeatures().length > 0" class="property-features q-mb-md">
        <div class="row q-col-gutter-xs">
          <div
            v-for="(feature, index) in getFeatures()"
            :key="index"
            class="col-auto"
          >
            <q-chip
              dense
              size="sm"
              color="grey-2"
              text-color="grey-8"
              class="q-ma-none"
            >
              <q-avatar
                :icon="getFeatureIcon(feature)"
                size="xs"
                color="transparent"
                text-color="grey-7"
              />
              {{ feature }}
            </q-chip>
          </div>
        </div>
      </div>

      <!-- Informations propriétaire -->
      <div v-if="property.owner" class="property-owner q-mb-sm">
        <div class="row items-center">
          <q-avatar size="24px" class="q-mr-xs">
            <q-icon name="person" color="grey-6" />
          </q-avatar>
          <div class="text-caption text-grey-7">
            {{ property.owner }}
          </div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="property-actions">
        <q-btn
          flat
          color="deep-purple-7"
          :label="property.statut === 'disponible' ? 'Acheter' : 'Consulter'"
          size="sm"
          icon-right="arrow_forward"
          class="full-width action-btn"
          @click="contactOwner"
        />
        <q-btn
          outline
          color="grey-6"
          :label="isUserLoggedIn ? 'Détails' : 'Se connecter'"
          size="sm"
          class="full-width q-mt-xs"
          @click="viewDetails"
        />
      </div>

    </q-card-section>

  </q-card>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
});

const router = useRouter();

// Vérifier si l'utilisateur est connecté
const isUserLoggedIn = computed(() => {
  // Vérifier plusieurs méthodes d'authentification courantes
  const token = localStorage.getItem('auth_token');
  const session = localStorage.getItem('user_session');
  const userData = localStorage.getItem('user_data');
  const accessToken = localStorage.getItem('access_token');

  // Vérifier aussi dans sessionStorage
  const sessionToken = sessionStorage.getItem('auth_token');
  const sessionUser = sessionStorage.getItem('user');

  // Vérifier les cookies (approximation)
  const hasAuthCookie = document.cookie.includes('auth_token') ||
                       document.cookie.includes('access_token') ||
                       document.cookie.includes('session');

  // Retourner true si au moins une méthode d'authentification est trouvée
  return !!(token || session || userData || accessToken ||
           sessionToken || sessionUser || hasAuthCookie);
});

// Déterminer le type de propriété
const isParcelle = computed(() => {
  return props.property.category === 'Terrain' ||
         props.property.type_terrain ||
         props.property.type === 'Terrain'
});

// Log pour déboguer
console.log('📸 PropertyCardSquare - property:', props.property);
console.log('📸 PropertyCardSquare - images:', props.property.images);
console.log('📸 PropertyCardSquare - image:', props.property.image);

// Formater l'URL de l'image
const getImageUrl = (property) => {
  // Priorité 1: propriété image directe
  if (property.image && property.image !== '') {
    console.log('✅ Utilisation de property.image:', property.image);
    return property.image;
  }

  // Priorité 2: premier élément du tableau images
  if (property.images && Array.isArray(property.images) && property.images.length > 0) {
    const firstImage = property.images[0];
    console.log('✅ Utilisation de property.images[0]:', firstImage);
    return firstImage;
  }

  // Priorité 3: si c'est un chemin dans la propriété originale
  if (property.original?.images && Array.isArray(property.original.images) && property.original.images.length > 0) {
    const originalImage = property.original.images[0];
    console.log('✅ Utilisation de property.original.images[0]:', originalImage);

    // Formater l'URL
    if (originalImage.startsWith('/uploads/')) {
      return `http://localhost:3000${originalImage}`;
    }
    return originalImage;
  }

  console.log('⚠️ Aucune image trouvée, utilisation par défaut');
  return '/images/default-property.jpg';
};

// Fonction pour obtenir les caractéristiques
const getFeatures = () => {
  const features = [];
  const property = props.property;

  if (property.type) {
    features.push(property.type);
  }

  if (property.superficie) {
    features.push(`${property.superficie} m²`);
  }

  if (property.ville) {
    features.push(property.ville);
  }

  // Ajouter d'autres caractéristiques si disponibles
  if (property.quartier) {
    features.push(property.quartier);
  }

  if (property.type_terrain) {
    features.push(property.type_terrain);
  }

  return features.slice(0, 3); // Limiter à 3 caractéristiques
};

// Couleur de la catégorie
const categoryColor = computed(() => {
  if (isParcelle.value) {
    return 'green-6'; // Vert pour les terrains
  } else {
    return 'deep-purple-6'; // Violet pour les maisons
  }
});

// Label de catégorie
const getCategoryLabel = computed(() => {
  if (isParcelle.value) {
    return 'Terrain';
  } else {
    return props.property.type_offre === 'vente' ? 'À vendre' : 'À louer';
  }
});

// Couleur du statut
const statusColor = computed(() => {
  const statut = props.property.statut;
  if (!statut) return 'grey-6';

  switch(statut.toLowerCase()) {
    case 'disponible': return 'green-6';
    case 'vendu': return 'red-6';
    case 'indisponible': return 'orange-6';
    case 'réservé': return 'amber-6';
    default: return 'grey-6';
  }
});

// Icônes pour les caractéristiques
const getFeatureIcon = (feature) => {
  const icons = {
    'Jardin': 'grass',
    'Piscine': 'pool',
    'Garage': 'garage',
    'chambres': 'bed',
    'salles de bain': 'bathtub',
    'chambre': 'bed',
    'salle de bain': 'bathtub',
    'urbain': 'location_city',
    'résidentiel': 'home',
    'commercial': 'store',
    'm²': 'square_foot',
    'Goma': 'location_on',
    'Katindo': 'location_on',
    'Terrain': 'landscape',
    'parcelle': 'map',
    'villa': 'villa',
    'appartement': 'apartment',
    'studio': 'meeting_room',
    'maison': 'house'
  };

  // Chercher une correspondance partielle
  for (const [key, icon] of Object.entries(icons)) {
    if (feature.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }

  return 'check';
};

// Navigation vers les détails - MODIFIÉE POUR REDIRIGER VERS AUTH/LOGIN
const viewDetails = () => {
  // Vérifier si l'utilisateur est connecté
  if (!isUserLoggedIn.value) {
    // Stocker les informations de la propriété pour après le login
    const propertyData = {
      id: props.property.id,
      name: props.property.name,
      type: isParcelle.value ? 'parcelle' : 'property',
      path: isParcelle.value ? `/parcelle/${props.property.id}` : `/property/${props.property.id}`,
      timestamp: Date.now()
    };

    // Sauvegarder dans sessionStorage (plus sécurisé)
    sessionStorage.setItem('property_redirect', JSON.stringify(propertyData));

    // Rediriger vers auth/login
    console.log('🔒 Redirection vers /auth/login pour voir:', props.property.name);
    window.location.href = '/auth/login';

    return; // Arrêter l'exécution ici
  }

  // Si l'utilisateur est connecté, procéder normalement
  console.log('✅ Utilisateur connecté, navigation vers détails');

  if (isParcelle.value) {
    // Rediriger vers la page des détails de parcelle
    router.push({
      name: 'parcelle-details',
      params: { id: props.property.id }
    });
  } else {
    // Rediriger vers la page des détails de propriété
    router.push({
      name: 'property-details',
      params: { id: props.property.id }
    });
  }
};

// Contacter le propriétaire
const contactOwner = () => {
  console.log('Contacter le propriétaire pour:', props.property.name);

  // Vérifier si l'utilisateur doit se connecter pour contacter
  if (!isUserLoggedIn.value) {
    // Stocker l'intention de contact
    const contactData = {
      propertyId: props.property.id,
      propertyName: props.property.name,
      action: 'contact',
      timestamp: Date.now()
    };

    sessionStorage.setItem('contact_redirect', JSON.stringify(contactData));

    // Rediriger vers auth/login
    window.location.href = '/auth/login';
    return;
  }

  // Logique de contact si connecté
  if (isParcelle.value) {
    console.log('Terrain ID:', props.property.id);
    // router.push({ name: 'contact-parcelle', params: { id: props.property.id } });
  } else {
    console.log('Maison ID:', props.property.id);
    // router.push({ name: 'contact-property', params: { id: props.property.id } });
  }
};
</script>

<style scoped>
.property-card-square {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
}

.property-card-square:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(103, 58, 183, 0.15) !important;
}

/* Image Container */
.property-image-container {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.property-image {
  transition: transform 0.5s ease;
}

.property-card-square:hover .property-image {
  transform: scale(1.05);
}

/* Badge Statut */
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
}

/* Overlay d'image */
.property-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.property-card-square:hover .property-image-overlay {
  opacity: 1;
}

.overlay-content {
  width: 100%;
  padding: 20px;
}

.view-details-btn {
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.property-card-square:hover .view-details-btn {
  transform: scale(1);
}

.auth-hint {
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  border-radius: 12px;
  margin-top: 8px;
  display: inline-block;
  backdrop-filter: blur(4px);
}

/* Contenu */
.property-content {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.property-description {
  flex-grow: 1;
}

/* Titre avec ellipsis */
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 3em;
  line-height: 1.5em;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 4.5em;
  line-height: 1.5em;
}

/* Caractéristiques */
.property-features .q-chip {
  border-radius: 8px;
  font-size: 0.7rem;
}

/* Bouton d'action */
.action-btn {
  background: linear-gradient(135deg, #673ab7 0%, #512da8 100%);
  color: white !important;
  border-radius: 8px;
}

.property-owner {
  border-top: 1px solid #eee;
  padding-top: 8px;
  margin-top: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .property-card-square {
    min-height: 380px;
  }

  .property-content {
    padding: 12px;
  }

  .overlay-content {
    padding: 10px;
  }

  .auth-hint {
    font-size: 0.65rem;
    padding: 3px 6px;
  }
}

/* Animation pour le bouton de connexion */
.property-actions .q-btn:last-child:hover {
  background-color: rgba(103, 58, 183, 0.1);
  border-color: #673ab7;
}

/* Style pour l'état non connecté */
.property-card-square:not(.user-logged) .property-image-overlay {
  background: rgba(0, 0, 0, 0.4);
}

.property-card-square:not(.user-logged) .auth-hint {
  background: rgba(220, 53, 69, 0.8); /* Rouge pour indiquer l'action nécessaire */
}
</style>
