<template>
  <q-page class="q-pa-md q-mx-auto" style="max-width: 800px;">
    
    <div class="text-h4 text-deep-purple-7 q-mb-md text-weight-bold">
      Mon Espace Personnel ARDHI\_CHAIN
    </div>
    
    <q-card flat bordered class="q-pa-lg q-mb-xl">
      <div class="row q-col-gutter-lg">
        
        <div class="col-12 col-md-6">
          <CardanoWalletConnect /> 
        </div>

        <div class="col-12 col-md-6">
            <q-card flat bordered class="q-pa-md bg-teal-1">
                <div class="text-subtitle1 text-teal-8 q-mb-sm flex items-center">
                    <q-icon name="fingerprint" class="q-mr-sm" /> Identité Vérifiée (DID)
                </div>
                <q-list dense>
                    <q-item>
                        <q-item-section avatar><q-icon name="person" color="grey-7" /></q-item-section>
                        <q-item-section>Nom: Valery VANNY</q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section avatar><q-icon name="badge" color="grey-7" /></q-item-section>
                        <q-item-section>Statut: Vendeur/Acheteur Certifié</q-item-section>
                    </q-item>
                    <q-item-label caption class="q-mt-sm">
                        Votre identité est liée à votre clé publique Cardano.
                    </q-item-label>
                </q-list>
            </q-card>
        </div>
      </div>
      
      <q-separator class="q-my-lg" />
      
      <div class="text-h6 text-deep-purple-8 q-mb-md">
        Mes Propriétés NFT
      </div>
      <q-list bordered separator>
        <q-item>
          <q-item-section avatar><q-icon name="token" color="teal-6" /></q-item-section>
          <q-item-section>NFT Titre : `nft-003` (Villa de luxe)</q-item-section>
          <q-item-section side><q-btn label="Transférer" size="sm" flat color="deep-purple-5" /></q-item-section>
        </q-item>
         <q-item>
          <q-item-section avatar><q-icon name="token" color="teal-6" /></q-item-section>
          <q-item-section>NFT Titre : `nft-001` (Parcelle titrée)</q-item-section>
          <q-item-section side><q-btn label="Mettre en Vente" size="sm" flat color="teal-5" /></q-item-section>
        </q-item>
      </q-list>
      
      <q-separator class="q-my-lg" />
      <q-btn label="Déconnexion Globale" color="red-6" icon="logout" />
      
    </q-card>
  </q-page>
</template>

<script setup>
import CardanoWalletConnect from 'src/components/CardanoWalletConnect.vue'; // IMPORT DU COMPOSANT
</script>