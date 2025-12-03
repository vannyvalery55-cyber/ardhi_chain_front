<template>
  <q-card class="property-card-square shadow-3" flat bordered>
    
    <!-- Image de la propriété -->
    <div class="property-image-container">
      <q-img
        :src="property.image"
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
            {{ property.category }}
          </q-badge>
        </div>
        
        <!-- Badge NFT -->
        <div class="absolute-top-right q-ma-sm">
          <q-badge 
            color="amber-6" 
            class="nft-badge"
          >
            <q-icon name="token" size="xs" class="q-mr-xs" />
            NFT
          </q-badge>
        </div>
        
        <!-- Overlay au survol -->
        <div class="property-image-overlay">
          <q-btn 
            round 
            color="white" 
            text-color="deep-purple-7"
            icon="visibility"
            size="sm"
            class="view-details-btn"
            @click.stop="viewDetails"
          />
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
            {{ property.area }}
          </div>
        </div>
        <div class="col-6">
          <div class="text-caption text-grey-6">Prix</div>
          <div class="text-subtitle2 text-weight-bold text-deep-purple-7">
            {{ property.price }}
          </div>
        </div>
      </div>
      
      <!-- Caractéristiques -->
      <div class="property-features q-mb-md">
        <div class="row q-col-gutter-xs">
          <div 
            v-for="(feature, index) in property.features" 
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
      
      <!-- Boutons d'action -->
      <div class="property-actions">
        <q-btn 
          flat 
          color="deep-purple-7" 
          label="Voir détails" 
          size="sm"
          icon-right="arrow_forward"
          class="full-width"
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

// Couleur de la catégorie
const categoryColor = computed(() => {
  switch(props.property.category) {
    case 'Maison': return 'deep-purple-6';
    case 'Appartement': return 'blue-6';
    case 'Parcelle': return 'teal-6';
    default: return 'grey-6';
  }
});

// Icônes pour les caractéristiques
const getFeatureIcon = (feature) => {
  const icons = {
    'Jardin': 'grass',
    'Piscine': 'pool',
    'Garage': 'garage',
    'Climatisé': 'ac_unit',
    'Sécurité': 'security',
    'Balcon': 'balcony',
    'Terrasse': 'deck',
    'Vue mer': 'beach_access',
    'Vue montagne': 'landscape',
    'Électricité': 'bolt',
    'Eau': 'water_drop',
    'Route': 'road'
  };
  
  return icons[feature] || 'check';
};

// Navigation vers les détails
const viewDetails = () => {
  router.push({ 
    name: 'property-details', 
    params: { id: props.property.id }
  });
};
</script>

<style scoped>
.property-card-square {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 350px;
}

.property-card-square:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(103, 58, 183, 0.15) !important;
}

/* Image Container */
.property-image-container {
  position: relative;
  overflow: hidden;
}

.property-image {
  transition: transform 0.5s ease;
}

.property-card-square:hover .property-image {
  transform: scale(1.05);
}

/* Badge NFT */
.nft-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
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

.view-details-btn {
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.property-card-square:hover .view-details-btn {
  transform: scale(1);
}

/* Contenu */
.property-content {
  padding: 16px;
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

/* Responsive */
@media (max-width: 768px) {
  .property-card-square {
    min-height: 320px;
  }
  
  .property-content {
    padding: 12px;
  }
}
</style>