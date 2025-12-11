<template>
  <slot />
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// État Cardano
const isConnected = ref(false)
const walletAddress = ref('')
const balance = ref(0)
const isLoading = ref(false)
const selectedWallet = ref('')
const network = ref('')
const errorMessage = ref('')

// Fonction pour détecter les wallets
const getAvailableWallets = () => {
  const wallets = []
  
  if (window.cardano?.eternl) {
    console.log('✅ Eternl détecté')
    const eternl = window.cardano.eternl
    
    if (eternl && typeof eternl.enable === 'function') {
      wallets.push({
        id: 'eternl',
        name: 'Eternl Wallet',
        icon: 'account_balance_wallet',
        api: eternl,
      })
    }
  }
  
  return wallets
}

// Fonction pour convertir une clé publique hex en adresse Cardano
const convertPubKeyHexToAddress = async (pubKeyHex) => {
  try {
    // Si nous avons la librairie de sérialisation
    if (window.CardanoSerializationLib) {
      const { PublicKey, BaseAddress } = window.CardanoSerializationLib
      
      // Convertir hex en bytes
      const hex = pubKeyHex.startsWith('0x') ? pubKeyHex.slice(2) : pubKeyHex
      const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
      
      // Créer la clé publique
      const publicKey = PublicKey.from_bytes(bytes)
      
      // Créer l'adresse (pour testnet)
      const address = BaseAddress.new(
        network.value === 'mainnet' ? 1 : 0, // 0 = testnet, 1 = mainnet
        publicKey.hash(),
        publicKey.hash() // Pour simplifier, utiliser la même pour staking
      )
      
      return address.to_bech32()
    }
    
    // Fallback: créer une adresse de test réaliste à partir de la clé
    console.log('ℹ️ Librairie non disponible, création adresse test')
    const shortHash = pubKeyHex.substring(pubKeyHex.length - 40, pubKeyHex.length - 20)
    return `addr_test1q${shortHash}`
    
  } catch (error) {
    console.error('❌ Erreur conversion:', error)
    // Fallback simple
    return `addr_test1q${pubKeyHex.substring(0, 54)}`
  }
}

// Connexion au wallet - VERSION POUR OBTENIR LA VRAIE ADRESSE
const connectWallet = async () => {
  console.log('🚀 Connexion Eternl...')
  
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // Vérifier Eternl
    const wallets = getAvailableWallets()
    
    if (wallets.length === 0) {
      throw new Error('Eternl Wallet non détecté. Veuillez l\'installer.')
    }
    
    const wallet = wallets[0]
    selectedWallet.value = wallet.id
    
    console.log(`🔗 Activation de ${wallet.name}...`)
    
    // Activer le wallet
    const api = await wallet.api.enable()
    console.log('✅ Wallet activé')
    
    // 1. RÉCUPÉRER LE RÉSEAU D'ABORD
    let networkId = 0 // Par défaut testnet
    try {
      if (typeof api.getNetworkId === 'function') {
        networkId = await api.getNetworkId()
        network.value = networkId === 1 ? 'mainnet' : 'testnet'
        console.log('🌐 Réseau:', network.value, '(ID:', networkId, ')')
      }
   } catch (error) {
  console.warn('Réseau non détecté:', error.message)
  network.value = 'testnet'
  console.warn('Réseau non détecté, utilisation testnet')
}
    
    // 2. ESSAYER DE RÉCUPÉRER UNE ADRESSE BECH32 DIRECTEMENT
    let realAddress = null
    
    // Essayer getUsedAddresses d'abord (retourne souvent des adresses bech32)
    if (typeof api.getUsedAddresses === 'function') {
      try {
        const usedAddresses = await api.getUsedAddresses()
        console.log('📫 getUsedAddresses:', usedAddresses)
        
        if (usedAddresses && usedAddresses.length > 0) {
          const addr = usedAddresses[0]
          // Vérifier si c'est déjà une adresse bech32
          if (typeof addr === 'string' && (addr.startsWith('addr1') || addr.startsWith('addr_test1'))) {
            realAddress = addr
            console.log('🎯 VRAIE adresse bech32 trouvée via getUsedAddresses:', realAddress.substring(0, 50) + '...')
          }
        }
      } catch (err) {
        console.warn('getUsedAddresses échoué:', err.message)
      }
    }
    
    // 3. SI PAS D'ADRESSE BECH32, ESSAYER getRewardAddresses (staking address)
    if (!realAddress && typeof api.getRewardAddresses === 'function') {
      try {
        const rewardAddresses = await api.getRewardAddresses()
        console.log('🏆 getRewardAddresses:', rewardAddresses)
        
        if (rewardAddresses && rewardAddresses.length > 0) {
          const addr = rewardAddresses[0]
          if (typeof addr === 'string' && (addr.startsWith('stake1') || addr.startsWith('stake_test1'))) {
            realAddress = addr
            console.log('🎯 Adresse de staking trouvée:', realAddress)
          }
        }
      } catch (err) {
        console.warn('getRewardAddresses échoué:', err.message)
      }
    }
    
    // 4. SI TOUJOURS RIEN, ESSAYER getUnusedAddresses et convertir
    if (!realAddress && typeof api.getUnusedAddresses === 'function') {
      try {
        const unusedAddresses = await api.getUnusedAddresses()
        console.log('📭 getUnusedAddresses retourné:', unusedAddresses)
        
        if (unusedAddresses && unusedAddresses.length > 0) {
          const pubKeyHex = unusedAddresses[0]
          console.log('🔑 Clé publique hex reçue:', typeof pubKeyHex, 'longueur:', pubKeyHex.length)
          
          // Afficher le type exact
          console.log('🔍 Type de donnée:', Object.prototype.toString.call(pubKeyHex))
          
          // Convertir en string si nécessaire
          const hexStr = String(pubKeyHex)
          console.log('🔑 Clé publique (string):', hexStr.substring(0, 20) + '...')
          
          // Convertir la clé publique en adresse Cardano
          realAddress = await convertPubKeyHexToAddress(hexStr)
          console.log('🔄 Adresse convertie:', realAddress)
        }
      } catch (err) {
        console.warn('getUnusedAddresses échoué:', err.message)
      }
    }
    
    // 5. STOCKER L'ADRESSE
    if (realAddress) {
      walletAddress.value = realAddress
      console.log('✅ ADRESSE FINALE STOCKÉE:', walletAddress.value)
    } else {
      walletAddress.value = 'Adresse non disponible'
      console.warn('⚠️ Aucune adresse récupérée')
    }
    
    // 6. RÉCUPÉRER LE SOLDE
    try {
      if (typeof api.getBalance === 'function') {
        const balanceLovelace = await api.getBalance()
        balance.value = Number(balanceLovelace) / 1000000
        console.log('💰 Solde réel:', balance.value, 'ADA')
      } else {
        balance.value = 0
        console.warn('⚠️ getBalance non disponible')
      }
    } catch (err) {
      console.warn('Erreur solde:', err.message)
      balance.value = 0
    }
    
    // 7. CONNEXION RÉUSSIE
    isConnected.value = true
    
    $q.notify({
      message: `${wallet.name} connecté avec succès!`,
      color: 'positive',
      position: 'top',
      icon: 'check_circle',
      timeout: 3000
    })
    
    console.log('🎉 CONNEXION RÉUSSIE - État final:', {
      isConnected: isConnected.value,
      walletAddress: walletAddress.value,
      balance: balance.value,
      network: network.value
    })
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error)
    
    errorMessage.value = error.message.includes('user rejected') 
      ? 'Connexion refusée par l\'utilisateur' 
      : error.message
    
    $q.notify({
      message: `Erreur: ${errorMessage.value}`,
      color: 'negative',
      position: 'top',
      timeout: 5000,
      icon: 'error'
    })
    
    isConnected.value = false
    walletAddress.value = ''
    
  } finally {
    isLoading.value = false
  }
}

// Rafraîchir le solde
const refreshBalance = async () => {
  if (!isConnected.value) return
  
  try {
    const wallets = getAvailableWallets()
    const wallet = wallets.find(w => w.id === selectedWallet.value)
    if (wallet) {
      const api = await wallet.api.enable()
      if (typeof api.getBalance === 'function') {
        const balanceLovelace = await api.getBalance()
        balance.value = Number(balanceLovelace) / 1000000
        console.log('🔄 Solde rafraîchi:', balance.value, 'ADA')
      }
    }
    
    $q.notify({
      message: 'Solde rafraîchi',
      color: 'positive',
      position: 'top',
      timeout: 1000
    })
  } catch (error) {
    console.error('Erreur rafraîchissement:', error)
  }
}

// Déconnexion
const disconnectWallet = () => {
  isConnected.value = false
  walletAddress.value = ''
  balance.value = 0
  selectedWallet.value = ''
  network.value = ''
  errorMessage.value = ''
  
  $q.notify({
    message: 'Wallet déconnecté',
    color: 'info',
    position: 'top',
    timeout: 2000
  })
}

// Créer le contexte
const cardanoContext = {
  // États
  isConnected,
  walletAddress,
  balance,
  isLoading,
  selectedWallet,
  network,
  errorMessage,
  
  // Méthodes
  connectWallet,
  disconnectWallet,
  refreshBalance,
  getAvailableWallets,
  getWalletName: () => 'Eternl Wallet',
  getWalletIcon: () => 'account_balance_wallet',
  
  // Propriétés pour l'affichage
  get truncatedAddress() {
    if (!isConnected.value) return 'Non connecté'
    if (!walletAddress.value) return 'Connecté'
    
    const addr = String(walletAddress.value)
    if (addr.length > 30) {
      return `${addr.substring(0, 10)}...${addr.substring(addr.length - 8)}`
    }
    return addr
  },
  
  get formattedBalance() {
    return balance.value.toFixed(2)
  },
  
  get safeWalletAddress() {
    return walletAddress.value || ''
  }
}

// Fournir le contexte
provide('cardano', cardanoContext)

// Ajouter la librairie Cardano si disponible
const loadCardanoLib = () => {
  // Vous pouvez charger la librairie depuis un CDN
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/@emurgo/cardano-serialization-lib-browser@11.1.0/cardano_serialization_lib.js'
  script.onload = () => {
    console.log('✅ Cardano Serialization Lib chargée')
    window.CardanoSerializationLib = window.emurgoCardanoSerializationLib
  }
  script.onerror = () => {
    console.warn('⚠️ Impossible de charger Cardano Serialization Lib')
  }
  document.head.appendChild(script)
}

// Initialisation
onMounted(() => {
  console.log('🎯 CardanoContext monté')
  
  // Charger la librairie
  loadCardanoLib()
  
  // Auto-connexion si Eternl est déjà activé
  setTimeout(() => {
    if (window.cardano?.eternl) {
      window.cardano.eternl.isEnabled()
        .then(enabled => {
          if (enabled && !isConnected.value) {
            console.log('🔄 Connexion automatique (Eternl déjà activé)')
            connectWallet()
          }
        })
        .catch(() => {})
    }
  }, 1000)
})
</script>