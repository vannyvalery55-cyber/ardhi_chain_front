<template>
  <q-page class="q-pa-md row justify-center items-center">
    <div class="col-12 col-md-5">
      <q-card class="q-pa-lg shadow-2">
        <q-card-section class="text-center">
          <div class="text-h5 text-primary q-mb-md">
            Identité ARDHI\_CHAIN
          </div>
          <p class="text-caption text-grey-7">
            Fonctionnalité d'authentification désactivée (Pinia retiré).
          </p>
        </q-card-section>

        <q-banner dense rounded class="bg-red-2 text-red-8 q-mb-md">
            <template v-slot:avatar>
                <q-icon name="warning" />
            </template>
            L'inscription et la connexion sont actuellement désactivées (Store Pinia manquant).
        </q-banner>

        <q-tabs
          v-model="tab"
          dense
          class="text-grey-7"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Connexion" />
          <q-tab name="register" label="Inscription" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated class="q-mt-md">
          <q-tab-panel name="login">
            <q-btn label="Connexion Désactivée" color="negative" disable class="full-width" />
          </q-tab-panel>

          <q-tab-panel name="register">
            <q-btn label="Inscription Désactivée" color="negative" disable class="full-width" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
// RETRAIT DE PINIA
// import { useAuthStore } from 'stores/auth-store'; 
// import { useQuasar } from 'quasar';
// import { useRouter } from 'vue-router';

// const $q = useQuasar(); // Retiré
// const router = useRouter(); // Retiré
// const authStore = useAuthStore(); // Retiré

const tab = ref('login');
// Toutes les fonctions handleLogin/handleRegister sont retirées.
</script>