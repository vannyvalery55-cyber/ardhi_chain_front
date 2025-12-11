<template>
  <CardanoContextSimple>
    <q-layout view="lHh Lpr lFf">
      <!-- Overlay de chargement -->
      <div v-if="appLoading" class="app-loading-overlay">
        <q-spinner-gears color="primary" size="3em" />
        <p class="q-mt-md text-grey-7">Chargement de l'application...</p>
      </div>
      
      <!-- Header avec menu -->
      
      <!-- Navigation drawer -->
      <q-drawer
        v-model="leftDrawerOpen"
        side="left"
        bordered
        v-if="!appLoading"
      >
        <q-list>
          <!-- Header du drawer -->
          <q-item class="bg-green-1">
            <q-item-section avatar>
              <q-avatar color="green" text-color="white">
                <q-icon name="account_balance_wallet" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Mon Portefeuille</q-item-label>
              <q-item-label caption>
                {{ cardanoConnected ? (cardanoBalance > 0 ? `${cardanoBalance} ADA` : 'Connecté') : 'Non connecté' }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <!-- Navigation principale -->
          <q-item clickable v-ripple to="" exact>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Accueil</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Lien vers la page Wallet existante -->
          <q-item 
            clickable 
            v-ripple 
            :to="{ name: 'Wallet' }"
            active-class="active-menu-item"
          >
            <q-item-section avatar>
              <q-icon name="wallet" :color="cardanoConnected ? 'green-7' : 'grey'" />
              <q-badge v-if="cardanoConnected && cardanoBalance > 0" color="green" floating rounded>
                {{ cardanoBalance }}
              </q-badge>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Mon Portefeuille</q-item-label>
              <q-item-label caption>
                {{ cardanoConnected ? 'Voir les détails complets' : 'Connectez-vous d\'abord' }}
              </q-item-label>
            </q-item-section>
            <q-item-section side v-if="cardanoConnected">
              <q-icon name="chevron_right" />
            </q-item-section>
          </q-item>

          <q-separator />

          <!-- Section Cardano -->
          <q-item-label header>Cardano Wallet</q-item-label>
          
          <q-item 
            clickable 
            v-ripple 
            @click="handleWalletConnectSimple"
            :disable="walletLoading"
          >
            <q-item-section avatar>
              <q-icon name="link" :color="cardanoConnected ? 'positive' : 'amber-7'" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ cardanoConnected ? 'Déjà connecté' : 'Connecter Wallet' }}</q-item-label>
              <q-item-label caption>Eternl, Flint, Nami...</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-spinner v-if="walletLoading" size="sm" />
              <q-icon v-else :name="cardanoConnected ? 'check_circle' : 'radio_button_unchecked'" 
                     :color="cardanoConnected ? 'positive' : 'grey'" />
            </q-item-section>
          </q-item>

          <q-item 
            clickable 
            v-ripple 
            :to="{ name: 'Transactions' }" 
            v-if="cardanoConnected"
          >
            <q-item-section avatar>
              <q-icon name="receipt_long" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Transactions</q-item-label>
              <q-item-label caption>Historique</q-item-label>
            </q-item-section>
          </q-item>

          <q-item 
            clickable 
            v-ripple 
            v-if="cardanoConnected"
            @click="goToWalletSend"
          >
            <q-item-section avatar>
              <q-icon name="send" color="blue-7" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Envoyer ADA</q-item-label>
              <q-item-label caption>Transfert rapide</q-item-label>
            </q-item-section>
          </q-item>

          <q-item 
            clickable 
            v-ripple 
            v-if="cardanoConnected"
            @click="goToWalletReceive"
          >
            <q-item-section avatar>
              <q-icon name="qr_code_scanner" color="green-7" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Recevoir ADA</q-item-label>
              <q-item-label caption>Adresse et QR Code</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <!-- Outils -->
          <q-item-label header>Outils</q-item-label>
          
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>
            <q-item-section>
              <q-item-label>À propos</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Paramètres</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>

      <!-- Bouton flottant principal -->
      <q-btn
        v-if="!appLoading"
        fab
        :color="cardanoConnected ? 'primary' : 'green'"
        :icon="cardanoConnected ? 'wallet' : 'account_balance_wallet'"
        class="fixed-bottom-right q-ma-lg wallet-fab"
        @click="cardanoConnected ? goToWallet() : handleWalletConnectSimple()"
        :loading="walletLoading"
      >
        <q-tooltip>
          {{ cardanoConnected ? 'Voir mon portefeuille' : 'Connecter le wallet' }}
        </q-tooltip>
        <q-badge v-if="cardanoConnected && cardanoBalance > 0" color="positive" floating rounded>
          {{ cardanoBalance }}
        </q-badge>
      </q-btn>
      
      <q-page-container>
        <router-view v-if="!appLoading" />
        
        <div v-if="appLoading" class="loading-placeholder"></div>
      </q-page-container>
    </q-layout>
  </CardanoContextSimple>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

// 💡 IMPORT CLÉ POUR LA CONVERSION D'ADRESSE CARDANO (Bech32)
import { Address } from '@emurgo/cardano-serialization-lib-asmjs'

const $q = useQuasar()
const router = useRouter()

// Variables d'état
const appLoading = ref(true)
const walletLoading = ref(false)
const leftDrawerOpen = ref(false)
const eternlApi = ref(null)

// États du wallet depuis localStorage
const cardanoConnected = computed(() => {
  return localStorage.getItem('cardanoConnected') === 'true'
})

const cardanoBalance = computed(() => {
  const balance = localStorage.getItem('cardanoBalance')
  return balance ? parseFloat(balance).toFixed(2) : 0
})

/**
 * Fonction utilitaire pour convertir une chaîne hexadécimale en Uint8Array.
 * @param {string} hexString - La chaîne hexadécimale (e.g., "61f8...").
 * @returns {Uint8Array} Le tableau d'octets.
 */
const hexToUint8Array = (hexString) => {
    // Supprime les espaces ou caractères non-hexadécimaux
    const cleanHex = hexString.replace(/[^0-9a-fA-F]/g, '');
    if (cleanHex.length % 2 !== 0) {
        // Le hex doit être pair
        console.error('❌ Chaîne hexadécimale de longueur impaire.');
        return new Uint8Array();
    }
    const array = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        array[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
    }
    return array;
};


/**
 * Fonction pour convertir l'adresse CBOR/Uint8Array/string(Hex) en Bech32.
 * @param {any} rawAddress - L'adresse brute reçue du wallet (string Hex ou Uint8Array).
 * @returns {string | null} L'adresse Bech32 (addr1...) ou null en cas d'échec.
 */
const cborToAddress = (rawAddress) => {
    let addressBytes = null;

    // 1. Gestion des entrées
    if (typeof rawAddress === 'string') {
        // Si c'est déjà une adresse Bech32
        if (rawAddress.startsWith('addr1') || rawAddress.startsWith('stake1')) {
            return rawAddress;
        }
        // Si c'est une chaîne Hex (cas d'Eternl)
        console.log('🔄 Conversion de la chaîne Hex en Uint8Array...')
        addressBytes = hexToUint8Array(rawAddress);
    } else if (rawAddress instanceof Uint8Array) {
        // Si c'est un Uint8Array (cas CIP-30 standard)
        addressBytes = rawAddress;
    } else {
        console.error('❌ cborToAddress: Type de donnée non supporté pour la conversion.');
        return null;
    }
    
    // VÉRIFICATION FINALE
    if (!(addressBytes instanceof Uint8Array) || addressBytes.length === 0) {
        console.error('❌ Conversion finale en Uint8Array échouée.');
        return null;
    }

    try {
        // --- TENTATIVE 1 : Conversion directe (idéale) ---
        try {
            const address = Address.from_bytes(addressBytes)
            console.log('✅ Conversion CBOR directe réussie.')
            return address.to_bech32()
        } catch (e) {
            console.warn(`⚠️ Échec conversion directe (possiblement données inutiles) : ${e.message}`)
        }
        
        // --- TENTATIVE 2 : Couper si l'adresse est trop longue (Contournement du "trailing data") ---
        if (addressBytes.length > 50) { 
            const suspectedAddressLength = 33; 
            const slicedBytes = addressBytes.slice(0, suspectedAddressLength);
            
            console.log(`✂️ Tentative de coupe du CBOR à ${suspectedAddressLength} octets (longueur originale: ${addressBytes.length})`)

            const address = Address.from_bytes(slicedBytes)
            console.log('✅ Conversion CBOR après coupe réussie.')
            return address.to_bech32()
        }
        
        return null;

    } catch (e) {
        console.error('❌ Échec final de la désérialisation de l\'adresse CBOR:', e)
        return null
    }
}


// Fonctions Watch, Utilitaires (goToWallet, etc.) - non modifiées
watch(cardanoConnected, (newValue) => {
  if (newValue && router.currentRoute.value.name !== 'Wallet') {
    setTimeout(() => {
      if (router.currentRoute.value.name !== 'Wallet') {
        router.push('/wallet')
      }
    }, 1500)
  }
})
const goToWallet = () => { cardanoConnected.value ? router.push('/wallet') : handleWalletConnectSimple() }
const goToWalletSend = () => { router.push('/wallet'); setTimeout(() => { window.dispatchEvent(new CustomEvent('open-send-dialog')) }, 100) }
const goToWalletReceive = () => { router.push('/wallet'); setTimeout(() => { window.dispatchEvent(new CustomEvent('open-receive-dialog')) }, 100) }


/**
 * Fonction de connexion principale au portefeuille (CIP-30).
 */
const handleWalletConnectSimple = async () => {
  console.log('🎯 Début connexion wallet...')
  walletLoading.value = true
  
  try {
    if (!window.cardano?.eternl) {
      throw new Error('Eternl Wallet non détecté. Installez-le depuis eternl.io')
    }
    
    console.log('✅ Eternl détecté, activation...')
    const api = await window.cardano.eternl.enable()
    eternlApi.value = api
    console.log('✅ Eternl activé avec succès')
    
    let address = ''
    let addressFound = false
    
    // 1. Essayer getUsedAddresses (Adresses de réception/principales)
    if (typeof api.getUsedAddresses === 'function') {
      try {
        const addresses = await api.getUsedAddresses()
        
        if (addresses && addresses.length > 0 && addresses[0]) {
          let rawAddress = addresses[0]
          
         

          const bech32Address = cborToAddress(rawAddress)
          
          if (bech32Address) {
            address = bech32Address
            addressFound = true
          } else {
            console.warn('⚠️ L\'adresse brute n\'a pas pu être convertie en Bech32. Conversion échouée.')
          }
        }
      } catch (e) {
        console.log('❌ getUsedAddresses échoué:', e.message)
      }
    }
    
    // 2. Si pas d'adresse trouvée, essayer getChangeAddress
    if (!addressFound && typeof api.getChangeAddress === 'function') {
      try {
        const rawAddress = await api.getChangeAddress()
        
        if (rawAddress) {
           const bech32Address = cborToAddress(rawAddress)

           if (bech32Address) {
              address = bech32Address
              addressFound = true
              console.log('✅ Adresse depuis getChangeAddress (Bech32) capturée.')
           }
        }
      } catch (e) {
        console.log('❌ getChangeAddress échoué:', e.message)
      }
    }
    
    // ... (Récupération du solde, du réseau, notifications) ...
    let balanceADA = 0
    // ... (Logique balance) ...
    if (typeof api.getBalance === 'function') {
      try {
        const balanceLovelace = await api.getBalance()
        const balanceNum = Number(balanceLovelace)
        if (!isNaN(balanceNum)) {
          balanceADA = balanceNum / 1000000
        } 
      } catch (balanceError) {
        console.warn('⚠️ Impossible de récupérer le solde:', balanceError.message)
      }
    }
    
    let network = 'mainnet' 
    // ... (Logique réseau) ...
    if (typeof api.getNetworkId === 'function') {
      try {
        const networkId = await api.getNetworkId()
        network = networkId === 1 ? 'mainnet' : networkId === 0 ? 'testnet' : `network-${networkId}`
      } catch (networkError) {
        console.warn('⚠️ Impossible de détecter le réseau:', networkError.message)
      }
    }
    
    $q.notify({
      message: `Eternl connecté! ${balanceADA > 0 ? `Solde: ${balanceADA.toFixed(2)} ADA` : 'Connecté avec succès'}`,
      color: 'positive',
      position: 'top',
      timeout: 4000,
      icon: 'check_circle'
    })
    
    // --- STOCKAGE PERSISTANT (FIN DE LA BOUCLE DE RAFRAÎCHISSEMENT) ---
    try {
      localStorage.setItem('cardanoConnected', 'true')
      
      let addressToStore = ''
      if (address && typeof address === 'string' && (address.startsWith('addr1') || address.startsWith('stake1'))) {
        addressToStore = address.trim()
      } else {
        // Laisse 'addr_not_available' si la conversion finale a échoué.
        addressToStore = 'addr_not_available' 
      }
      
      localStorage.setItem('cardanoAddress', addressToStore)
      localStorage.setItem('cardanoBalance', balanceADA.toString())
      localStorage.setItem('cardanoNetwork', network)
      localStorage.setItem('cardanoApiAvailable', 'true')
      localStorage.setItem('cardanoLastUpdate', Date.now().toString())
      
      console.log('✅ Données sauvegardées dans localStorage. Adresse finale:', addressToStore)
      
      // Émettre un événement global pour informer Wallet.vue
      window.dispatchEvent(new CustomEvent('wallet-data-updated', {
        detail: { address: addressToStore, balance: balanceADA, network, timestamp: Date.now() }
      }))
      
    } catch (storageError) {
      console.error('❌ Erreur sauvegarde localStorage:', storageError)
    }
    
  } catch (error) {
    // ... (Gestion des erreurs de connexion) ...
    // ... (Le code de gestion des erreurs reste le même) ...
    let errorMessage = error.message
     if (error.message.includes('user rejected') || error.message.includes('rejected')) {
       errorMessage = 'Vous avez refusé la connexion'
     } else if (error.message.includes('not installed')) {
       errorMessage = 'Installez Eternl Wallet depuis eternl.io'
     } else if (error.message.includes('timeout')) {
       errorMessage = 'Temps d\'attente dépassé'
     }
     
     $q.notify({
       message: `Erreur: ${errorMessage}`,
       color: 'negative',
       position: 'top',
       timeout: 5000,
       icon: 'error'
     })
  } finally {
    walletLoading.value = false
    window.dispatchEvent(new CustomEvent('wallet-loading-finished'))
  }
}

// ... (Les autres fonctions refreshWalletBalance, initApp, onMounted restent inchangées) ...

// Fonction pour rafraîchir le solde
const refreshWalletBalance = async () => {
  if (window.cardano?.eternl && eternlApi.value) {
    try {
      walletLoading.value = true
      const api = eternlApi.value
      
      let balanceADA = 0
      if (typeof api.getBalance === 'function') {
        const balanceLovelace = await api.getBalance()
        balanceADA = Number(balanceLovelace) / 1000000
        
        localStorage.setItem('cardanoBalance', balanceADA.toString())
        localStorage.setItem('cardanoLastUpdate', Date.now().toString())
        
        window.dispatchEvent(new CustomEvent('wallet-balance-updated', {
          detail: { balance: balanceADA }
        }))
      }
    } catch (error) {
      console.warn('❌ Échec du rafraîchissement du solde:', error.message)
      $q.notify({
        message: 'Avertissement: Échec du rafraîchissement (trop de requêtes?)',
        color: 'warning',
        position: 'top',
        timeout: 2000
      })
    } finally {
      walletLoading.value = false
    }
  }
}


// Initialisation
const initApp = async () => {
  console.log('🚀 Initialisation application...')
  
  setTimeout(() => {
    appLoading.value = false
    console.log('✅ Application prête')
    
    const wasConnected = localStorage.getItem('cardanoConnected')
    
    if (wasConnected === 'true' && window.cardano?.eternl) {
      window.cardano.eternl.isEnabled()
        .then(async enabled => {
          if (enabled) {
            console.log('🔄 Eternl toujours activé. Tentative de récupération API et synchronisation.')
             
            try {
              const api = await window.cardano.eternl.enable() 
              eternlApi.value = api
              if (api) {
                  handleWalletConnectSimple();
              }

            } catch(e) {
                console.warn('Échec de la réactivation de l\'API:', e);
            }
          }
        })
        .catch(() => {
          console.log('Eternl non activé')
        })
    }
  }, 800)
}

// Exposer des fonctions de test et gérer les événements globaux
onMounted(() => {
  initApp()
  
  // Événements d'écoute pour la synchronisation
  window.addEventListener('trigger-wallet-connect', handleWalletConnectSimple)
  window.addEventListener('trigger-wallet-refresh', refreshWalletBalance)
  
  // Fonctions de debug (conservées)
  window.debugLocalStorage = () => { /* ... */ }
  window.testEternlApi = async () => { /* ... */ }
  window.connectEternl = handleWalletConnectSimple
  window.getEternlApi = () => eternlApi.value
  window.refreshWallet = refreshWalletBalance
})
</script>

<style scoped>
.app-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.q-page-container {
  min-height: 100vh;
}

.loading-placeholder {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Bouton flottant wallet */
.wallet-fab {
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  z-index: 9998 !important;
  animation: pulse 2s infinite;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
}

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3); }
  50% { transform: scale(1.05); box-shadow: 0 6px 25px rgba(76, 175, 80, 0.5); }
  100% { transform: scale(1); box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3); }
}

/* Item menu actif */
.active-menu-item {
  background-color: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4CAF50;
}

.cursor-pointer {
  cursor: pointer;
}

/* Mobile */
@media (max-width: 600px) {
  .wallet-fab {
    bottom: 10px !important;
    right: 10px !important;
  }
}
</style>