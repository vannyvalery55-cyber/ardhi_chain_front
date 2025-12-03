<template>
  <q-page class="q-pa-md column items-center">
    
    <div style="width: 100%; max-width: 700px;" class="q-mx-auto">
      
      <q-card class="q-mt-lg">
        <q-card-section class="bg-primary text-white">
          <div class="text-h5">
            <q-icon name="add_home" class="q-mr-sm" />Ajouter une Nouvelle Propriété
          </div>
          <div class="text-subtitle2">Enregistrement dans l'inventaire ARDHI\_CHAIN</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            
            <div class="text-h6 text-deep-purple-7">Détails de la Propriété</div>
            <q-separator />

            <q-select
              filled
              v-model="property.category"
              :options="['Maison', 'Appartement', 'Parcelle', 'Bureau']"
              label="Catégorie du Bien *"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Veuillez choisir une catégorie']"
            />

            <q-input
              filled
              v-model="property.name"
              label="Nom/Titre du Bien *"
              hint="Ex: Villa 4 ch. Himbi ou Terrain Titré Katindo"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Veuillez entrer un titre']"
            />

            <q-input
              filled
              v-model="property.location"
              label="Localisation (Quartier/Zone) *"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Veuillez entrer la localisation']"
            />

            <q-input
              filled
              v-model="property.surface"
              label="Surface (Ex: 350m²)"
              type="text"
            />

            <div class="text-h6 text-deep-purple-7 q-pt-md">Photo du Bien</div>
            <q-separator />
            
            <q-file 
              filled 
              v-model="property.imageFile" 
              label="Charger la photo de la Propriété *" 
              accept="image/*"
              counter
              :max-files="1"
              max-file-size="5242880"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
              <template v-slot:hint>
                  Taille maximale: 5 MB. Format: JPG, PNG.
              </template>
            </q-file>
            
            <q-item-label caption class="text-red-7">
              Cette image sera tokenisée lors de la création du NFT.
            </q-item-label>


            <div class="text-h6 text-deep-purple-7 q-pt-md">Transaction et Description</div>
            <q-separator />

            <q-select
              filled
              v-model="property.type"
              :options="['Vente', 'Location']"
              label="Type de Transaction *"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Veuillez choisir le type']"
            />

            <q-input
              filled
              v-model="property.price"
              label="Prix (Ex: 5,000 ADA ou 200 USD/Mois) *"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Veuillez entrer le prix']"
            />

            <q-input
              filled
              v-model="property.description"
              label="Description détaillée"
              type="textarea"
              rows="4"
            />
            
            <q-card-actions align="right" class="q-mt-lg">
              <q-btn label="Annuler" color="negative" flat @click="onReset" />
              <q-btn label="Enregistrer & Mint NFT" type="submit" color="primary" icon="send" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
      
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const property = ref({
  category: null,
  name: '',
  location: '',
  surface: '',
  imageFile: null, 
  type: null,
  price: '',
  description: '',
});

const onSubmit = () => {
  if (property.value.imageFile) {
    console.log('Fichier image prêt à être envoyé :', property.value.imageFile.name);
  }
  
  // Logique de soumission (Simulée)
  console.log('Propriété soumise pour enregistrement:', property.value);
  
  $q.notify({
    message: 'Propriété soumise avec succès ! (Simulé)',
    color: 'positive',
    icon: 'check_circle'
  });
  
  onReset();
};

const onReset = () => {
  property.value = {
    category: null,
    name: '',
    location: '',
    surface: '',
    imageFile: null,
    type: null,
    price: '',
    description: '',
  };
};
</script>