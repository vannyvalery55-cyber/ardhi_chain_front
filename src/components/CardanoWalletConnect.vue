<template>
  <q-card flat bordered class="q-pa-md bg-white">
    <div v-if="!isConnected" class="text-center">
      <div class="text-h6 text-deep-purple-7 q-mb-md">
        Connecter votre Portefeuille Cardano
      </div>
      <q-list bordered separator>
        <q-item 
          clickable 
          v-ripple 
          v-for="wallet in availableWallets" 
          :key="wallet.id"
          @click="connectWallet(wallet.id)"
        >
          <q-item-section avatar>
            <q-avatar size="sm">
              <img :src="wallet.icon" v-if="wallet.icon">
              <q-icon name="account_balance_wallet" v-else color="deep-purple-4" />
            </q-avatar>
          </q-item-section>
          <q-item-section>{{ wallet.name }}</q-item-section>
          <q-item-section side>
            <q-icon name="arrow_forward_ios" color="grey-5" size="xs" />
          </q-item-section>
        </q-item>
      </q-list>
      <div v-if="error" class="text-caption text-red-6 q-mt-sm">
        Erreur : {{ error }}
      </div>
    </div>

    <div v-else class="text-center">
      <q-icon name="check_circle" color="teal-6" size="lg" class="q-mb-sm" />
      <div class="text-h6 text-teal-7">Portefeuille Connecté !</div>
      <div class="text-body2 text-grey-8">
        Adresse: {{ connectedAddress.slice(0, 10) }}...{{ connectedAddress.slice(-6) }}
      </div>
      <q-btn 
        label="Déconnecter" 
        flat 
        color="red-5" 
        icon="logout" 
        size="sm"
        class="q-mt-md"
        @click="disconnectWallet"
      />
    </div>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Stocke l'état de connexion et les données du portefeuille
const isConnected = ref(false);
const connectedAddress = ref('');
const error = ref(null);
const availableWallets = ref([]);

// Liste des portefeuilles supportés (leurs identifiants CIP-30)
const SUPPORTED_WALLETS = ['nami', 'eternl', 'flint'];

// Fonction standard pour vérifier les portefeuilles CIP-30
const getAvailableWallets = () => {
    // Vérifie si l'objet 'window.cardano' est injecté par les extensions de portefeuille
    if (!window.cardano) {
        // Aucun portefeuille détecté, souvent parce que l'utilisateur n'a pas d'extension
        console.warn("L'objet window.cardano n'est pas disponible. Aucune extension de portefeuille Cardano détectée.");
        availableWallets.value = [];
        return;
    }

    const wallets = [];
    for (const walletId in window.cardano) {
        if (SUPPORTED_WALLETS.includes(walletId) && typeof window.cardano[walletId].enable === 'function') {
            wallets.push({
                id: walletId,
                name: window.cardano[walletId].name || walletId,
                icon: window.cardano[walletId].icon || null, // L'icône peut être fournie par le portefeuille
            });
        }
    }
    availableWallets.value = wallets;
};

const connectWallet = async (walletId) => {
    error.value = null;
    try {
        if (!window.cardano || !window.cardano[walletId]) {
            throw new Error("Portefeuille non détecté ou extension manquante.");
        }

        // 1. Demande d'activation (connexion) via CIP-30
        const api = await window.cardano[walletId].enable();
        
        // 2. Récupération de l'adresse de réception (staking address pour la simplicité)
        // Les adresses sont souvent retournées en format hexadécimal, nous prenons la première.
        const rewardAddressesHex = await api.getRewardAddresses(); 
        
        if (rewardAddressesHex.length === 0) {
             throw new Error("Impossible de récupérer les adresses de récompense.");
        }
        
        // NOTE: Pour décoder les adresses hexadécimales en format bech32 lisible par l'homme,
        // une bibliothèque comme 'cardano-serialization-lib' serait nécessaire. 
        // Pour cette démo front-end, nous allons juste afficher l'adresse brute.
        connectedAddress.value = rewardAddressesHex[0]; // Afficher l'adresse brute
        
        isConnected.value = true;
        
        // Stocker l'API pour les transactions futures (signature, envoi de ADA)
        window.cardanoApi = api;

    } catch (err) {
        console.error("Erreur de connexion au portefeuille:", err);
        error.value = err.message || "Connexion refusée ou erreur interne.";
        isConnected.value = false;
    }
};

const disconnectWallet = () => {
    // Le CIP-30 n'a pas de fonction 'disable', la déconnexion est une réinitialisation locale
    isConnected.value = false;
    connectedAddress.value = '';
    window.cardanoApi = null;
    console.log("Portefeuille déconnecté (localement).");
};

onMounted(() => {
  getAvailableWallets();
});
</script>