<template>
  <q-page>
    
    <div class="hero-container bg-deep-purple-7 q-pa-xl flex flex-center">
      
      <div class="text-center q-mb-lg" style="z-index: 1;">
        
        <div class="text-h3 text-white q-mb-sm text-weight-bolder">
          ARDHI-CHAIN : La Sécurité Foncière à Goma Redéfinie.
        </div>
        
        <div class="text-subtitle1 text-white q-mb-md" style="max-width: 800px; margin: auto;">
          **ARDHI-CHAIN** redéfinit la sécurité foncière à Goma en exploitant la puissance de la technologie blockchain. Notre plateforme garantit l'intégrité et l'authenticité de chaque transaction, car chaque titre de propriété est représenté par un **NFT unique** émis sur la Blockchain **Cardano**. Ce mécanisme nous permet d'établir une **Preuve de Propriété (PoP)** infalsifiable : une fois enregistrées, les données du titre bénéficient de l'**immutabilité** de la blockchain, offrant ainsi une **sécurité** totale et sans précédent contre la fraude, la falsification des documents et les litiges fonciers. ARDHI\_CHAIN est le garant numérique de votre patrimoine immobilier.
        </div>
        
      </div>
      
      <SearchWidget 
        v-model:searchTerm="searchTerm" 
        @search="handleSearch"
      />
    </div>

    <div class="q-pa-md q-mx-auto" style="max-width: 1400px; padding-top: 100px;">
        
        <q-separator class="q-mt-xl q-mb-lg" />

        <q-card flat bordered class="q-mb-xl bg-deep-purple-1">
          <q-card-section>
            <div class="row q-col-gutter-lg items-center">
              
              <div class="col-12 col-md-5 text-center">
                <img 
                  src="https://placehold.co/150x150?text=ARDHI_CHAIN+Logo" 
                  alt="ARDHI-CHAIN Logo" 
                  class="q-mb-md" 
                  style="max-width: 150px;"
                >
                <img 
                  src="https://placehold.co/500x300/a392e2/ffffff?text=Securite+Fonciere+NFT" 
                  alt="Sécurité Foncière NFT" 
                  style="max-width: 100%; height: auto; border-radius: 8px;"
                >
              </div>

              <div class="col-12 col-md-7">
                <div class="text-h5 text-deep-purple-8 q-mb-md text-weight-bold">
                  Qu'est-ce que ARDHI-CHAIN ?
                </div>
                <p class="text-body1 text-grey-9 q-mb-md">
                  **ARDHI-CHAIN** est une initiative révolutionnaire visant à transformer le secteur foncier à Goma et au-delà, en apportant une **transparence** et une **sécurité** sans précédent. Nous exploitons la puissance de la **Blockchain Cardano** pour créer un registre de propriété **immuable** et **infalsifiable**.
                </p>
                <p class="text-body1 text-grey-9 q-mb-md">
                  Chaque parcelle ou bien immobilier enregistré sur notre plateforme est lié à un **NFT (Non-Fungible Token)** unique. Ce NFT sert de **Preuve de Propriété (PoP)** numérique et inviolable. Cela signifie que l'historique de propriété, les transactions et la légitimité du titre sont vérifiables par tous, à tout moment, éliminant ainsi les risques de fraude et de litiges.
                </p>
                <p class="text-body1 text-grey-9">
                  Notre engagement est de garantir la **confiance** et la **sécurité** pour les propriétaires et les investisseurs, en offrant un système où l'authenticité de votre bien est gravée dans la blockchain, pour toujours.
                </p>
              </div>

            </div>
          </q-card-section>
        </q-card>
        <div class="text-h5 text-deep-purple-8 q-mb-md text-weight-bold">
            Pourquoi Choisir ARDHI-CHAIN ?
        </div>
        
        <div class="row q-col-gutter-md q-mt-md q-mb-xl">
            <q-card flat bordered class="col-12 col-md-4 q-pa-md bg-white">
                <q-item>
                    <q-item-section avatar><q-icon name="fingerprint" color="deep-purple-7" size="lg" /></q-item-section>
                    <q-item-section>
                        <q-item-label class="text-weight-bold text-dark text-subtitle1">Identités Vérifiées (DID)</q-item-label>
                    </q-item-section>
                </q-item>
                <p class="q-px-md text-caption text-grey-7">Système d'identité décentralisée pour une confiance absolue entre toutes les parties prenantes.</p>
            </q-card>
            <q-card flat bordered class="col-12 col-md-4 q-pa-md bg-white">
                <q-item>
                    <q-item-section avatar><q-icon name="token" color="teal-6" size="lg" /></q-item-section>
                    <q-item-section>
                        <q-item-label class="text-weight-bold text-dark text-subtitle1">Tokenisation des Parcelles</q-item-label>
                    </q-item-section>
                </q-item>
                <p class="q-px-md text-caption text-grey-7">Chaque titre est un **NFT** unique sur Cardano, garantissant son authenticité et son immuabilité.</p>
            </q-card>
            <q-card flat bordered class="col-12 col-md-4 q-pa-md bg-white">
                <q-item>
                    <q-item-section avatar><q-icon name="gavel" color="light-blue-7" size="lg" /></q-item-section>
                    <q-item-section>
                        <q-item-label class="text-weight-bold text-dark text-subtitle1">Transparence du Registre</q-item-label>
                    </q-item-section>
                </q-item>
                <p class="q-px-md text-caption text-grey-7">Historique des transactions accessible à tous, réduisant drastiquement les risques de litiges.</p>
            </q-card>
        </div>

        <div class="text-h5 text-dark q-mb-md text-weight-bold">
            Trouver votre bien certifié sur la Blockchain Cardano
        </div>
        <div class="text-subtitle1 text-dark q-mb-md">
            Résultats de la Recherche ({{ houses.length + land.length }} Biens Disponibles)
        </div>
        
        <div class="row q-col-gutter-lg">
        
            <div class="col-12 col-lg-4">
                <div class="text-h6 text-dark q-mb-sm">Maisons et Appartements</div>
                <PropertyCard
                v-for="property in houses"
                :key="property.id"
                :property="property"
                class="q-mb-md"
                />
                <q-card v-if="houses.length === 0" flat bordered class="q-pa-md text-center bg-grey-2">
                    <q-icon name="house_siding" color="grey-6" size="sm" />
                    <div class="text-body2 text-grey-7">Aucune maison trouvée.</div>
                </q-card>
            </div>

            <div class="col-12 col-lg-4">
                <div class="text-h6 text-dark q-mb-sm">Terrains et Parcelles</div>
                <PropertyCard
                v-for="property in land"
                :key="property.id"
                :property="property"
                class="q-mb-md"
                />
                <q-card v-if="land.length === 0" flat bordered class="q-pa-md text-center bg-grey-2">
                    <q-icon name="fence" color="grey-6" size="sm" />
                    <div class="text-body2 text-grey-7">Aucune parcelle trouvée.</div>
                </q-card>
            </div>

            <div class="col-12 col-lg-4">
                <q-card style="height: 650px;">
                    <q-card-section>
                        <div class="text-h6 text-dark q-mb-sm">Vue Globale sur Carte</div>
                        <MapView :properties="filteredProperties" style="height: 550px;" />
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
    
    <FooterBar /> 
    
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import PropertyCard from 'src/components/PropertyCard.vue';
import MapView from 'src/components/MapView.vue';
import FooterBar from 'src/components/FooterBar.vue'; 
import SearchWidget from 'src/components/SearchWidget.vue'; 
import { mockProperties } from 'src/data/properties.js'; 

const properties = ref(mockProperties); 
const searchTerm = ref(''); 

const filteredProperties = computed(() => {
  const term = searchTerm.value.toLowerCase().trim();
  if (!term) {
    return properties.value;
  }
  return properties.value.filter(property => {
    return (
      property.name.toLowerCase().includes(term) ||
      property.location.toLowerCase().includes(term) ||
      property.category.toLowerCase().includes(term) ||
      property.description.toLowerCase().includes(term) ||
      property.price.toLowerCase().includes(term)
    );
  });
});

const houses = computed(() => {
    return filteredProperties.value.filter(p => p.category === 'Maison' || p.category === 'Appartement');
});
const land = computed(() => {
    return filteredProperties.value.filter(p => p.category === 'Parcelle');
});

const handleSearch = () => {
    console.log(`Recherche lancée pour : ${searchTerm.value}`);
};
</script>

<style scoped>
.hero-container {
  padding-bottom: 100px;
  position: relative;
  background: linear-gradient(135deg, #5e35b1, #303f9f); 
  min-height: 400px; 
}
</style>