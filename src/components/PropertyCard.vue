<template>
  <q-card 
    flat 
    bordered 
    class="property-card" 
    style="border-radius: 8px; overflow: hidden;"
  >
    <router-link 
      :to="{ name: 'property-details', params: { id: property.id } }"
      class="text-decoration-none text-dark"
    >
      <q-img :src="property.image || 'https://via.placeholder.com/400x200/cccccc?text=ARDHI+Propriete'" ratio="16/9" loading="lazy" />

      <q-card-section>
        
        <div class="text-h6 q-mb-xs text-weight-bold">
          {{ property.name }}
        </div>
        
        <div class="text-caption text-grey-7 flex items-center q-mb-sm">
          <q-icon name="location_on" size="xs" class="q-mr-xs" /> {{ property.location }}
          <q-space />
          <q-badge color="deep-purple-7" class="q-pa-xs">{{ property.category }}</q-badge>
        </div>
        
        <div class="row items-center justify-between q-mt-md">
          <div class="col-auto text-h5 text-teal-7 text-weight-bolder">
            {{ property.price }}
          </div>
          <div class="col-auto text-caption text-grey-6">
            <q-icon name="aspect_ratio" size="xs" /> {{ property.surface }}
          </div>
        </div>

      </q-card-section>
      
      <q-badge 
        color="teal-6" 
        floating 
        style="top: 10px; right: 10px;"
      >
        NFT Certifié
      </q-badge>

    </router-link>
  </q-card>
</template>

<script setup>
import { defineProps } from 'vue';

// FIX 2 : Retire l'assignation à 'props'
defineProps({
  property: {
    type: Object,
    required: true,
    // FIX 3 : Utilise Object.prototype.hasOwnProperty.call pour vérifier 'id' de manière sécurisée
    validator: (value) => Object.prototype.hasOwnProperty.call(value, 'id') 
  }
});
</script>

<style scoped>
.property-card {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.property-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px); 
}
.text-decoration-none {
  text-decoration: none;
}
</style>