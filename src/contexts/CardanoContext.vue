<template>
  <slot />
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// État du contexte
const isConnected = ref(false)
const walletAddress = ref('')
const balance = ref(0)
const isLoading = ref(false)
const selectedWallet = ref('')
const network = ref('preview')
const isReconnectable = ref(false)
const errorMessage = ref('')

// Liste des wallets supportés
const supportedWallets = [
  { id: 'eternl', name: 'Eternl', icon: 'diamond' },
  { id: 'nami', name: 'Nami', icon: 'account_balance_wallet' },
  { id: 'flint', name: 'Flint', icon: 'whatshot' },
  { id: 'typhon', name: 'Typhon', icon: 'bolt' },
  { id: 'gerowallet', name: 'Gero Wallet', icon: 'shield' }
]

// Vérifier si un wallet est installé
const isWalletInstalled = (walletId) => {
  if (typeof window === 'undefined') return false
  return !!window.cardano?.[walletId]
}

// Récupérer tous les wallets disponibles
const getAvailableWallets = () => {
  if (typeof window === 'undefined') return []

  return supportedWallets.filter(wallet =>
    window.cardano?.[wallet.id] &&
    window.cardano[wallet.id].enable
  )
}

// FONCTION CRITIQUE : Convertir un objet Eternl en string
const convertEternlObjectToString = async (addressObj) => {
  console.log('🔄 Conversion Eternl objet → string:', addressObj)
  
  if (!addressObj) return ''
  
  // 1. Si c'est déjà une string
  if (typeof addressObj === 'string') {
    return addressObj
  }
  
  // 2. Si c'est un objet avec toBech32
  if (typeof addressObj === 'object' && addressObj.toBech32) {
    try {
      const bech32 = await addressObj.toBech32()
      console.log('✅ Conversion toBech32 réussie:', bech32.substring(0, 30) + '...')
      return bech32
    } catch (error) {
      console.error('❌ toBech32 échoué:', error)
    }
  }
  
  // 3. Si c'est un tableau, prendre le premier élément
  if (Array.isArray(addressObj) && addressObj.length > 0) {
    return convertEternlObjectToString(addressObj[0])
  }
  
  // 4. Dernier recours
  const result = String(addressObj)
  return result === '[object Object]' ? '' : result
}

// Connexion avec conversion FORCÉE
const connectWallet = async () => {
  console.log('🚀 Connexion avec conversion forcée')

  if (isLoading.value) {
    console.log('⏳ Déjà en cours...')
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    if (!window.cardano?.eternl) {
      throw new Error('Eternl non détecté')
    }

    // Activer Eternl
    const api = await window.cardano.eternl.enable()
    console.log('✅ Eternl activé')

    // Obtenir l'adresse comme OBJET
    const changeAddr = await api.getChangeAddress()
    console.log('📍 Adresse objet obtenue:', changeAddr)
    console.log('🔍 Type:', typeof changeAddr)
    
    if (typeof changeAddr === 'object') {
      console.log('📋 Propriétés:', Object.keys(changeAddr))
    }

    // CONVERTIR l'objet en string
    const addressString = await convertEternlObjectToString(changeAddr)
    console.log('🎯 Adresse convertie:', addressString.substring(0, 30) + '...')

    // Vérifier la conversion
    if (!addressString || addressString === '[object Object]') {
      throw new Error('Conversion échouée')
    }

    // Stocker comme STRING
    walletAddress.value = addressString
    selectedWallet.value = 'eternl'

    // Obtenir le solde
    try {
      const balanceData = await api.getBalance()
      balance.value = (Number(balanceData) / 1000000).toFixed(2)
      console.log('💰 Solde:', balance.value, 'ADA')
    } catch (error) {
      console.warn('⚠️ Erreur solde:', error)
      balance.value = '0.00'
    }

    // Obtenir le réseau
    try {
      const networkId = await api.getNetworkId()
      network.value = networkId === 0 ? 'testnet' : networkId === 1 ? 'mainnet' : 'unknown'
      console.log('🌐 Réseau:', network.value)
    } catch (error) {
      console.warn('⚠️ Erreur réseau:', error)
      network.value = 'unknown'
    }

    // Finaliser
    isConnected.value = true
    isReconnectable.value = true

    $q.notify({
      message: '✅ Connecté avec Eternl',
      color: 'positive',
      position: 'top',
      timeout: 3000
    })

    console.log('🏁 CONNEXION RÉUSSIE! Adresse:', addressString.substring(0, 20) + '...')
    return { success: true, address: addressString }

  } catch (error) {
    console.error('💥 ERREUR:', error)
    
    errorMessage.value = error.message
    $q.notify({
      message: `❌ ${error.message}`,
      color: 'negative',
      position: 'top',
      timeout: 5000
    })
    
    return { success: false, error: error.message }
    
  } finally {
    isLoading.value = false
  }
}

// FONCTION SPÉCIALE : Forcer la conversion de l'adresse si c'est un objet
const forceAddressConversion = async () => {
  console.log('🔧 Conversion forcée de l\'adresse actuelle')
  
  if (!walletAddress.value || typeof walletAddress.value !== 'object') {
    console.log('✅ L\'adresse est déjà une string')
    return walletAddress.value
  }
  
  try {
    if (window.cardano?.eternl) {
      const api = await window.cardano.eternl.enable()
      const changeAddr = await api.getChangeAddress()
      const addressString = await convertEternlObjectToString(changeAddr)
      
      if (addressString && addressString !== '[object Object]') {
        walletAddress.value = addressString
        console.log('✅ Adresse convertie:', addressString.substring(0, 30) + '...')
        return addressString
      }
    }
  } catch (error) {
    console.error('❌ Conversion échouée:', error)
  }
  
  return ''
}

// Déconnexion
const disconnectWallet = () => {
  console.log('🔓 Déconnexion')
  walletAddress.value = ''
  balance.value = 0
  selectedWallet.value = ''
  isConnected.value = false
  network.value = 'preview'
  isReconnectable.value = false
  errorMessage.value = ''
  
  $q.notify({
    message: '🔓 Wallet déconnecté',
    color: 'info',
    position: 'top',
    timeout: 2000
  })
}

// Rafraîchir le solde
const refreshBalance = async () => {
  if (!isConnected.value || selectedWallet.value !== 'eternl') return

  try {
    const api = await window.cardano.eternl.enable()
    const balanceData = await api.getBalance()
    balance.value = (Number(balanceData) / 1000000).toFixed(2)
    
    $q.notify({
      message: '💰 Solde mis à jour',
      color: 'positive',
      position: 'top',
      timeout: 2000
    })
    
    return balance.value
  } catch (error) {
    console.error('❌ Erreur rafraîchissement:', error)
    $q.notify({
      message: '❌ Impossible de rafraîchir',
      color: 'warning',
      position: 'top',
      timeout: 3000
    })
  }
}

// Obtenir le nom du wallet
const getWalletName = (walletId) => {
  const wallet = supportedWallets.find(w => w.id === walletId)
  return wallet ? wallet.name : walletId
}

// Obtenir l'icône
const getWalletIcon = (walletId) => {
  const wallet = supportedWallets.find(w => w.id === walletId)
  return wallet ? wallet.icon : 'account_balance_wallet'
}

// Formater l'adresse pour l'affichage (TOUJOURS retourner une string)
const formatAddressForDisplay = (address) => {
  console.log('🔧 Formatage adresse:', address)
  
  if (!address) return ''
  
  // Si c'est un objet, indiquer qu'une conversion est nécessaire
  if (typeof address === 'object') {
    return '[Cliquez pour convertir]'
  }
  
  const str = String(address)
  if (str === '[object Object]') return '[Conversion nécessaire]'
  
  // Troncature
  if (str.length <= 12) return str
  return `${str.substring(0, 8)}...${str.substring(str.length - 4)}`
}

// DEBUG : Analyse Eternl
const debugEternl = async () => {
  console.log('🔍 DEBUG Eternl')
  
  if (!window.cardano?.eternl) {
    console.error('❌ Eternl non détecté')
    return
  }
  
  try {
    const api = await window.cardano.eternl.enable()
    console.log('✅ API activée')
    
    // Test getChangeAddress
    const changeAddr = await api.getChangeAddress()
    console.log('📍 getChangeAddress:', changeAddr)
    console.log('📊 Type:', typeof changeAddr)
    
    if (typeof changeAddr === 'object') {
      console.log('🔑 Propriétés:', Object.keys(changeAddr))
      
      // Tester toBech32
      if (changeAddr.toBech32) {
        console.log('🎯 Test toBech32:')
        const bech32 = await changeAddr.toBech32()
        console.log('✅ Résultat:', bech32)
        console.log('📏 Longueur:', bech32.length)
        console.log('🎯 Début:', bech32.substring(0, 30))
      }
    }
    
  } catch (error) {
    console.error('💥 Erreur debug:', error)
  }
}

// Vérifier et corriger l'adresse au démarrage
const checkAndFixAddress = async () => {
  if (walletAddress.value && typeof walletAddress.value === 'object') {
    console.log('🔄 Adresse est un objet, tentative de correction...')
    await forceAddressConversion()
  }
}

// Au montage
onMounted(() => {
  console.log('🚀 CardanoContext prêt')
  
  // Vérifier l'adresse après un court délai
  setTimeout(() => {
    checkAndFixAddress()
  }, 1000)
  
  // Exposer les fonctions
  if (typeof window !== 'undefined') {
    window.debugEternl = debugEternl
    window.forceAddressConversion = forceAddressConversion
    window.cardanoConnect = connectWallet
    console.log('🔧 Fonctions disponibles: debugEternl(), forceAddressConversion(), cardanoConnect()')
  }
})

// Fournir le contexte
provide('cardano', {
  // État
  isConnected,
  walletAddress,
  balance,
  isLoading,
  selectedWallet,
  network,
  isReconnectable,
  errorMessage,
  
  // Wallets
  supportedWallets,
  getAvailableWallets,
  isWalletInstalled,
  getWalletName,
  getWalletIcon,
  
  // Actions
  connectWallet,
  disconnectWallet,
  refreshBalance,
  forceAddressConversion,
  
  // Utilitaires
  formatAddressForDisplay,
  
  // Debug
  debugEternl
})
</script>