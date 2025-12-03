<template>
  <q-page class="q-pa-md q-mx-auto" style="max-width: 1000px;">
    
    <div class="text-h4 text-deep-purple-7 q-mb-md text-weight-bold">
      Soumettre un Bien pour Certification NFT
    </div>
    <q-card flat bordered class="q-pa-lg">

      <q-stepper
        v-model="step"
        ref="stepper"
        animated
        flat
        header-nav
        color="deep-purple-7"
      >
        <q-step
          :name="1"
          title="Détails du Bien"
          icon="home"
          :done="step > 1"
        >
          <div class="text-h6 q-mb-md">Décrivez votre propriété</div>
          <div class="row q-col-gutter-md">
            
            <div class="col-12 col-sm-6">
              <q-input outlined v-model="form.name" label="Nom du Bien (Ex: Villa Lac Vert)" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input outlined v-model="form.location" label="Adresse / Localisation Principale" />
            </div>
            
            <div class="col-12 col-sm-6">
              <q-select
                outlined
                v-model="form.category"
                :options="['Maison', 'Appartement', 'Parcelle', 'Autre']"
                label="Catégorie du Bien"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                outlined
                v-model="form.transactionType"
                :options="['Vente', 'Location']"
                label="Type de Transaction"
              />
            </div>
            
            <div class="col-12">
              <q-input
                outlined
                v-model="form.description"
                type="textarea"
                label="Description détaillée"
              />
            </div>

          </div>
          
          <q-stepper-navigation>
            <q-btn @click="step = 2" color="deep-purple-7" label="Continuer" icon-right="arrow_forward" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Documents & Preuves"
          icon="folder_shared"
          :done="step > 2"
        >
          <div class="text-h6 q-mb-md">Preuves de Propriété & Géolocalisation</div>
          
          <q-input outlined v-model="form.cadastralId" label="ID Cadastral / Référence Foncière (Si existant)" class="q-mb-md" />
          
          <q-uploader
            label="Télécharger les documents légaux (Titre, Plan, etc.)"
            square
            flat
            bordered
            multiple
            accept=".pdf,.jpg,.png"
            color="teal-1"
            text-color="teal-8"
            class="full-width q-mb-lg"
          />

          <q-card flat bordered class="q-pa-md bg-orange-1">
            <q-icon name="warning" color="orange-8" class="q-mr-sm" />
            <span class="text-weight-bold text-orange-8">
              Si votre bien n'est pas encore enregistré/certifié (sans ID Cadastral),
              le Cadastre interviendra à l'étape suivante pour lancer le processus légal.
            </span>
          </q-card>

          <q-stepper-navigation class="q-mt-lg">
            <q-btn @click="step = 3" color="deep-purple-7" label="Soumettre pour Vérification" icon-right="cloud_upload" class="q-mr-md" />
            <q-btn flat @click="step = 1" color="deep-purple-7" label="Précédent" />
          </q-stepper-navigation>
        </q-step>
        
        <q-step
          :name="3"
          title="Statut de la Tokenisation"
          icon="verified_user"
        >
          <div class="text-h6 text-teal-7 q-mb-md">Soumission Réussie !</div>
          <q-card flat bordered class="q-pa-md bg-blue-1">
            <q-icon name="timer" color="blue-8" class="q-mr-sm" />
            <span class="text-weight-bold text-blue-8">
              Votre bien est en attente de vérification par le Cadastre et l'équipe ARDHI\_CHAIN.
            </span>
            <p class="q-mt-sm text-body2">
              Statut actuel : **En attente de revue légale.**
              <br>
              Nous vous notifierons lorsque le processus de tokenisation NFT sur Cardano sera prêt.
            </p>
          </q-card>
        </q-step>

      </q-stepper>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const step = ref(1);
const form = ref({
  name: '',
  location: '',
  category: 'Maison',
  transactionType: 'Vente',
  description: '',
  cadastralId: '',
});
</script>