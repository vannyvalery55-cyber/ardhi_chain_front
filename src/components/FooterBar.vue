<template>
  <div class="bg-deep-purple-9 text-white q-py-lg"> 
    <div class="q-px-md q-mx-auto" style="max-width: 1400px;">
      
      <div class="row q-col-gutter-xl">
        
        <div class="col-12 col-md-4">
          <div class="text-h6 q-mb-md">
            <q-icon name="apartment" class="q-mr-sm" /> ARDHI\_CHAIN
          </div>
          <p class="text-body2 text-grey-4">
            La première plateforme immobilière congolaise sécurisée par la technologie NFT sur la **Blockchain Cardano**.
            Notre mission : garantir la transparence et l'immuabilité des titres de propriété.
          </p>
          <div class="q-mt-md">
            <q-icon name="fingerprint" color="teal-5" class="q-mr-sm" size="sm" />
            <span class="text-subtitle2 text-teal-3">Titres Certifiés par NFT</span>
          </div>
        </div>

        <div class="col-12 col-md-2">
          <div class="text-h6 q-mb-md">Navigation</div>
          <q-list dense dark>
            <q-item clickable v-ripple :to="{ name: 'home' }">
              <q-item-section>Catalogue Immobilier</q-item-section>
            </q-item>
            <q-item clickable v-ripple :to="{ name: 'add-property' }">
              <q-item-section>Ajouter mon Bien</q-item-section>
            </q-item>
            <q-item clickable v-ripple :to="{ name: 'account' }">
              <q-item-section>Mon Compte & Wallet</q-item-section>
            </q-item>
            <q-item clickable v-ripple :to="{ name: 'cadastre-review' }">
              <q-item-section class="text-red-3">Espace Cadastre (Dev)</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-h6 q-mb-md">Contact & Aide</div>
          <q-list dense dark>
            <q-item>
              <q-item-section avatar><q-icon name="email" color="teal-5" /></q-item-section>
              <q-item-section>support@ardhichain.cd</q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="phone" color="teal-5" /></q-item-section>
              <q-item-section>+243 970 000 000</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar><q-icon name="help" color="teal-5" /></q-item-section>
              <q-item-section>FAQ & Documentation</q-item-section>
            </q-item>
          </q-list>
        </div>
        
        <div class="col-12 col-md-3">
          <div class="text-h6 q-mb-md">Légalité & Confiance</div>
          <q-list dense dark>
            <q-item clickable v-ripple>
              <q-item-section avatar><q-icon name="description" color="grey-4" /></q-item-section>
              <q-item-section>Conditions Générales d'Utilisation</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar><q-icon name="security" color="grey-4" /></q-item-section>
              <q-item-section>Politique de Confidentialité</q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="token" color="teal-5" /></q-item-section>
              <q-item-section>Sécurisé par Cardano (ADA)</q-item-section>
            </q-item>
          </q-list>
        </div>

      </div>

      <q-separator color="deep-purple-8" class="q-my-lg" />

      <div class="row items-center justify-between">
        <div class="col-12 col-sm-6 text-body2 text-grey-5">
          &copy; {{ new Date().getFullYear() }} ARDHI\_CHAIN. Tous droits réservés.
        </div>
        <div class="col-12 col-sm-6 text-right q-mt-sm q-sm-mt-none">
          <q-btn flat round color="grey-4" icon="mdi-facebook" size="sm" class="q-mr-xs" />
          <q-btn flat round color="grey-4" icon="mdi-twitter" size="sm" class="q-mr-xs" />
          <q-btn flat round color="grey-4" icon="mdi-linkedin" size="sm" />
        </div>
      </div>
      
    </div>
  </div> </template>

<script setup>
// Pas de logique spécifique ici
</script>