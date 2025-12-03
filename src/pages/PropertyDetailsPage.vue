<template>
  <q-page class="q-pa-md">
    
    <q-btn 
      icon="arrow_back" 
      label="Retour au Catalogue" 
      flat 
      color="deep-purple-7" 
      class="q-mb-lg"
      @click="$router.push('/')" 
    />

    <q-card v-if="property" flat bordered class="q-pa-lg">
      
      <div class="row q-col-gutter-lg">
        
        <div class="col-12 col-lg-8">
          
          <div class="text-h4 text-dark q-mb-xs text-weight-bold">{{ property.name }}</div>
          <div class="text-subtitle1 text-teal-7 q-mb-md flex items-center">
            <q-icon name="location_on" class="q-mr-sm" /> {{ property.location }}
          </div>
          
          <q-img
            :src="property.image || 'https://via.placeholder.com/800x450/4CAF50/ffffff?text=Image+Principale+du+Bien'"
            spinner-color="white"
            class="q-mb-md"
            style="border-radius: 8px;"
          />
          
          <q-separator class="q-my-md" />
          <div class="text-h6 text-deep-purple-8 q-mb-sm">Description Complète</div>
          <p class="text-body2 text-grey-8">{{ property.description }}</p>
          
          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-6 col-sm-3">
              <q-card flat bordered class="q-pa-sm text-center">
                <q-icon name="aspect_ratio" color="teal-6" size="sm" />
                <div class="text-caption text-weight-bold">Surface</div>
                <div class="text-body2 text-dark">{{ property.surface }}</div>
              </q-card>
            </div>
            <div class="col-6 col-sm-3">
              <q-card flat bordered class="q-pa-sm text-center">
                <q-icon name="apartment" color="teal-6" size="sm" />
                <div class="text-caption text-weight-bold">Type</div>
                <div class="text-body2 text-dark">{{ property.category }}</div>
              </q-card>
            </div>
            <div class="col-6 col-sm-3">
              <q-card flat bordered class="q-pa-sm text-center">
                <q-icon name="map" color="teal-6" size="sm" />
                <div class="text-caption text-weight-bold">Type Transaction</div>
                <div class="text-body2 text-dark">{{ property.type }}</div>
              </q-card>
            </div>
            <div class="col-6 col-sm-3">
              <q-card flat bordered class="q-pa-sm text-center">
                <q-icon name="qr_code" color="deep-purple-7" size="sm" />
                <div class="text-caption text-weight-bold">ID NFT</div>
                <div class="text-body2 text-dark">{{ property.id }}</div>
              </q-card>
            </div>
          </div>

          <q-separator class="q-my-md" />
          <div class="text-h6 text-deep-purple-8 q-mb-sm">Localisation Géographique (Carte)</div>
          <MapView :properties="[property]" style="height: 350px; border-radius: 8px;" class="q-mt-md" />

        </div>

        <div class="col-12 col-lg-4">
          
          <q-card class="bg-deep-purple-1 q-pa-md q-mb-lg shadow-2">
            <div class="text-h5 text-deep-purple-8 text-weight-bolder">{{ property.price }}</div>
            <div class="text-caption text-grey-7 q-mb-md">{{ property.type === 'Vente' ? 'Prix de Vente (en ADA)' : 'Prix Mensuel' }}</div>
            <q-btn 
              label="Procéder à l'Achat NFT" 
              icon="token" 
              color="deep-purple-7" 
              class="full-width q-mb-sm" 
              @click="console.log('Action: Lancer Transaction Cardano')" 
            />
          </q-card>

          <q-card flat bordered style="height: 550px;">
            <q-tabs
              v-model="tab"
              dense
              class="text-grey-7"
              active-color="deep-purple-7"
              indicator-color="deep-purple-7"
              align="justify"
              narrow-indicator
            >
              <q-tab name="chat" icon="chat" label="Chat Privé" />
              <q-tab name="nft" icon="verified_user" label="Certification NFT" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated style="height: calc(100% - 48px);">
              
              <q-tab-panel name="chat" class="q-pa-none full-height">
                <ChatInterface 
                  contactName="Propriétaire Certifié" 
                  :propertyId="property.id"
                />
              </q-tab-panel>

              <q-tab-panel name="nft" class="q-pa-md">
                <div class="text-h6 text-teal-7 q-mb-sm flex items-center">
                    <q-icon name="verified_user" class="q-mr-sm" /> Titre ARDHI Certifié
                </div>
                <q-list dense>
                    <q-item>
                        <q-item-section avatar><q-icon name="done" color="light-blue-7" /></q-item-section>
                        <q-item-section>Titre Immobilier Tokénisé (NFT)</q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section avatar><q-icon name="done" color="light-blue-7" /></q-item-section>
                        <q-item-section>Identité Vendeur Vérifiée (DID)</q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section avatar><q-icon name="done" color="light-blue-7" /></q-item-section>
                        <q-item-section>Historique de Propriété Immuable</q-item-section>
                    </q-item>
                    <q-item-label caption class="q-mt-md">
                        Le jeton est sécurisé via le **Policy ID** sur la Blockchain Cardano.
                    </q-item-label>
                </q-list>
              </q-tab-panel>
            
            </q-tab-panels>
          </q-card>
          
        </div>
      </div>
    </q-card>

    <q-card v-else flat bordered class="q-pa-lg q-mt-lg text-center">
        <q-icon name="error" color="red-6" size="lg" />
        <div class="text-h5 q-mt-md">Propriété non trouvée.</div>
        <div class="text-body1 q-mt-sm">Veuillez vérifier l'identifiant du bien.</div>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import MapView from 'src/components/MapView.vue'; 
import ChatInterface from 'src/components/ChatInterface.vue'; // NOUVEL IMPORT
import { mockProperties } from 'src/data/properties.js'; 

const route = useRoute();
const propertyId = route.params.id;

// Onglet actif par défaut
const tab = ref('chat');

// Logique pour trouver la propriété correspondant à l'ID
const property = computed(() => {
  return mockProperties.find(p => p.id === propertyId);
});
</script>