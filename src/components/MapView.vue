<template>
  <div class="map-container">
    <l-map 
      v-model:zoom="zoom" 
      v-model:center="center" 
      :use-global-leaflet="false" 
      style="height: 100%; width: 100%;"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      
      <l-marker 
        v-for="property in properties" 
        :key="property.id" 
        :lat-lng="[property.geo.lat, property.geo.lng]"
      >
        <l-popup>
          <div class="text-weight-bold">{{ property.name }}</div>
          <div class="text-caption">{{ property.price }}</div>
          <router-link :to="{ name: 'property-details', params: { id: property.id } }">
            Voir Détails
          </router-link>
        </l-popup>
      </l-marker>
      
    </l-map>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import { GOMA_CENTER } from 'src/data/properties.js'; 
import 'leaflet/dist/leaflet.css';

// FIX 1 : Déstructure la propriété "properties" car elle est utilisée dans onMounted,
// évitant ainsi l'erreur 'props' is assigned but never used.
const { properties } = defineProps({
  properties: {
    type: Array,
    default: () => []
  }
});

const center = ref([GOMA_CENTER.lat, GOMA_CENTER.lng]);
const zoom = ref(13); 

onMounted(() => {
  // Utilise "properties" directement
  if (properties.length === 1 && properties[0].geo) {
      center.value = [properties[0].geo.lat, properties[0].geo.lng];
      zoom.value = 15;
  }
});
</script>

<style scoped>
.map-container {
  height: 100%; 
  width: 100%;
}
</style>