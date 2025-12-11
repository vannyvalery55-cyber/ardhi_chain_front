<template>
  <div class="cardano-wallet-section">
    <!-- État : Non connecté -->
    <div v-if="!isConnected" class="wallet-disconnected">
      <q-btn
        unelevated
        color="deep-purple-7"
        icon="account_balance_wallet"
        label="Wallet"
        class="connect-wallet-btn"
        size="sm"
        @click="openWalletSelector"
        :loading="isLoading"
      >
        <q-tooltip>Connecter votre portefeuille Cardano</q-tooltip>
      </q-btn>
    </div>

    <!-- État : Connecté -->
    <div v-else class="wallet-connected">
      <div class="wallet-info" @click="showWalletMenu = !showWalletMenu">
        <div class="wallet-avatar">
          <q-avatar size="36px" :color="getWalletColor" text-color="white">
            <q-icon :name="getWalletIcon" />
          </q-avatar>
          <q-icon name="expand_more" size="16px" class="wallet-arrow" :class="{ 'rotated': showWalletMenu }" />
        </div>

        <div class="wallet-details">
          <div class="wallet-network">{{ networkName }}</div>
          <div class="wallet-balance">{{ formattedBalance }} ₳</div>
        </div>
      </div>

      <!-- Menu déroulant wallet -->
      <div v-if="showWalletMenu" class="wallet-dropdown" v-click-outside="closeWalletMenu">
        <div class="wallet-header">
          <div class="wallet-info-badge">
            <q-avatar size="48px" :color="getWalletColor" text-color="white" class="q-mb-sm">
              <q-icon :name="getWalletIcon" />
            </q-avatar>
            <div class="wallet-name">{{ getWalletName }}</div>
            <div class="wallet-address">
              <div class="wallet-label">Adresse:</div>
              <div 
                class="address-value"
                @click="forceConvertAddress"
                :style="{
                  cursor: addressDisplay.includes('Cliquez') ? 'pointer' : 'default',
                  textDecoration: addressDisplay.includes('Cliquez') ? 'underline dotted' : 'none'
                }"
                :title="addressDisplay.includes('Cliquez') ? 'Cliquez pour convertir l\'adresse' : ''"
              >
                {{ addressDisplay }}
              </div>
              <q-btn
                flat
                dense
                icon="content_copy"
                size="xs"
                color="grey-6"
                @click="copyAddress"
                class="copy-btn"
                :disabled="!canCopyAddress"
              >
                <q-tooltip>{{ copyTooltip }}</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <div class="wallet-actions">
          <q-btn
            flat
            dense
            icon="refresh"
            label="Rafraîchir le solde"
            class="dropdown-action"
            @click="refreshBalance"
          />
          <q-btn
            flat
            dense
            icon="swap_horiz"
            label="Changer de réseau"
            class="dropdown-action"
            @click="switchNetwork"
          />
          <q-btn
            flat
            dense
            icon="history"
            label="Transactions"
            class="dropdown-action"
            @click="viewTransactions"
          />
          <q-btn
            flat
            dense
            icon="swap_vert"
            label="Changer de wallet"
            class="dropdown-action"
            @click="openWalletSelector"
          />
        </div>

        <div class="dropdown-divider"></div>

        <div class="wallet-footer">
          <q-btn
            flat
            dense
            color="red"
            icon="logout"
            label="Déconnecter"
            class="disconnect-btn"
            @click="disconnectWallet"
          />
        </div>
      </div>
    </div>

    <!-- Sélecteur de wallet (modal) -->
    <WalletSelector
      v-model="showWalletSelector"
      @wallet-selected="onWalletSelected"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useQuasar } from 'quasar'
import WalletSelector from './WalletSelector.vue'

const $q = useQuasar()

// ✅ INJECTER le contexte Cardano global
const cardano = inject('cardano', {
  // État
  isConnected: { value: false },
  walletAddress: { value: '' },
  balance: { value: 0 },
  isLoading: { value: false },
  selectedWallet: { value: '' },
  network: { value: '' },
  isReconnectable: { value: false },
  errorMessage: { value: '' },
  forceAddressConversion: () => Promise.resolve(''), // ✅ AJOUTÉ

  // Wallets
  supportedWallets: [],
  getAvailableWallets: () => [],
  isWalletInstalled: () => false,
  getWalletName: () => '',
  getWalletIcon: () => 'account_balance_wallet',

  // Actions
  connectWallet: () => Promise.reject('Contexte Cardano non disponible'),
  disconnectWallet: () => {},
  refreshBalance: () => Promise.resolve(0),

  // Utilitaires
  formatAddressForDisplay: (addr) => String(addr),

  // Debug
  debugEternl: () => {}
})

const showWalletMenu = ref(false)
const showWalletSelector = ref(false)

// Computed properties - accéder aux valeurs réactives
const isConnected = computed(() => cardano.isConnected?.value || false)
const walletAddress = computed(() => cardano.walletAddress?.value || '')
const balance = computed(() => cardano.balance?.value || 0)
const isLoading = computed(() => cardano.isLoading?.value || false)
const selectedWallet = computed(() => cardano.selectedWallet?.value || '')
const network = computed(() => cardano.network?.value || '')

// Fonction pour forcer la conversion au clic
const forceConvertAddress = async () => {
  console.log('🔄 Conversion forcée demandée')
  
  if (cardano.forceAddressConversion) {
    try {
      const newAddress = await cardano.forceAddressConversion()
      if (newAddress) {
        $q.notify({
          message: '✅ Adresse convertie avec succès',
          color: 'positive',
          timeout: 2000
        })
        console.log('✅ Nouvelle adresse:', newAddress.substring(0, 30) + '...')
        // Rafraîchir le menu
        showWalletMenu.value = false
        setTimeout(() => {
          showWalletMenu.value = true
        }, 100)
      }
    } catch (error) {
      console.error('❌ Conversion échouée:', error)
      $q.notify({
        message: '❌ Échec de la conversion',
        color: 'negative'
      })
    }
  } else {
    // Fallback: reconnexion
    cardano.connectWallet?.()
  }
}

// Affichage de l'adresse avec conversion intégrée
const addressDisplay = computed(() => {
  const address = walletAddress.value
  
  if (!address) return 'Non connecté'
  
  console.log('🔍 Adresse pour affichage:', {
    address,
    type: typeof address,
    isObject: typeof address === 'object',
    stringValue: String(address)
  })
  
  // Si c'est un objet ou [object Object]
  if (typeof address === 'object') {
    console.log('🎯 Objet détecté, propriétés:', address)
    return '[Cliquez pour convertir]'
  }
  
  // Si c'est [object Object] comme string
  const str = String(address)
  if (str === '[object Object]') {
    return '[Cliquez pour convertir]'
  }
  
  // Si c'est une string vide ou invalide
  if (str.trim() === '') {
    return 'Non disponible'
  }
  
  // Si c'est une string valide
  if (str.length <= 20) return str
  
  // Troncature pour les adresses longues
  if (str.startsWith('addr1') || str.startsWith('addr_test1')) {
    // Adresse Cardano - format standard
    return `${str.substring(0, 10)}...${str.substring(str.length - 8)}`
  }
  
  return `${str.substring(0, 8)}...${str.substring(str.length - 6)}`
})

// Balance formatée
const formattedBalance = computed(() => {
  const bal = balance.value
  if (typeof bal === 'string') return bal
  return Number(bal).toFixed(2)
})

// Nom du réseau
const networkName = computed(() => {
  const net = network.value
  const networkMap = {
    'testnet': 'Testnet',
    'mainnet': 'Mainnet',
    'preview': 'Preview',
    'preprod': 'Preprod',
    'unknown': 'Network'
  }
  return networkMap[net] || net || 'Network'
})

// Nom du wallet
const getWalletName = computed(() => {
  const walletId = selectedWallet.value
  if (!walletId) return 'Cardano'
  return cardano.getWalletName?.(walletId) || walletId
})

// Icône du wallet
const getWalletIcon = computed(() => {
  const walletId = selectedWallet.value
  if (!walletId) return 'account_balance_wallet'

  if (cardano.getWalletIcon) {
    return cardano.getWalletIcon(walletId)
  }

  const wallet = cardano.supportedWallets?.find(w => w.id === walletId)
  return wallet?.icon || 'account_balance_wallet'
})

// Couleur du wallet
const getWalletColor = computed(() => {
  const walletId = selectedWallet.value
  const colors = {
    'nami': 'blue-7',
    'eternl': 'orange-7',
    'flint': 'red-7',
    'typhon': 'purple-7',
    'gerowallet': 'green-7'
  }
  return colors[walletId] || 'deep-purple-7'
})

// Peut-on copier l'adresse ?
const canCopyAddress = computed(() => {
  const address = walletAddress.value
  return address && 
         typeof address === 'string' && 
         address !== '[object Object]' && 
         address !== '' &&
         !addressDisplay.value.includes('Cliquez') &&
         !addressDisplay.value.includes('Non disponible')
})

// Tooltip pour le bouton copier
const copyTooltip = computed(() => {
  if (addressDisplay.value.includes('Cliquez')) {
    return 'Convertir d\'abord l\'adresse'
  }
  return canCopyAddress.value ? 'Copier l\'adresse' : 'Adresse non disponible'
})

// Ouvrir le sélecteur de wallet
const openWalletSelector = () => {
  const availableWallets = cardano.getAvailableWallets?.() || []

  if (availableWallets.length === 1 && !isConnected.value) {
    // Auto-connect si un seul wallet disponible
    cardano.connectWallet?.(availableWallets[0].id)
  } else if (availableWallets.length === 0) {
    // Aucun wallet installé
    $q.notify({
      message: 'Aucun wallet Cardano détecté ❌',
      color: 'warning',
      timeout: 3000
    })
  } else {
    // Afficher le sélecteur
    showWalletSelector.value = true
  }
}

// Wallet sélectionné dans le modal
const onWalletSelected = (walletId) => {
  console.log('✅ Wallet sélectionné:', walletId)
  cardano.connectWallet?.(walletId)
  showWalletSelector.value = false
  showWalletMenu.value = true
}

// Déconnexion
const disconnectWallet = () => {
  cardano.disconnectWallet?.()
  showWalletMenu.value = false

  $q.notify({
    message: 'Wallet déconnecté ✅',
    color: 'info',
    timeout: 2000
  })
}

// Rafraîchir le solde
const refreshBalance = async () => {
  try {
    await cardano.refreshBalance?.()
    $q.notify({
      message: 'Solde mis à jour ✅',
      color: 'positive',
      timeout: 2000
    })
  } catch {
    $q.notify({
      message: 'Erreur de mise à jour ❌',
      color: 'negative'
    })
  }
}

// Copier l'adresse
const copyAddress = () => {
  const address = walletAddress.value

  if (canCopyAddress.value) {
    navigator.clipboard.writeText(address)
    $q.notify({
      message: 'Adresse copiée 📋',
      color: 'positive',
      timeout: 2000
    })
  } else if (addressDisplay.value.includes('Cliquez')) {
    $q.notify({
      message: 'Convertir d\'abord l\'adresse ❌',
      color: 'warning'
    })
  } else {
    $q.notify({
      message: 'Adresse non disponible pour copie ❌',
      color: 'warning'
    })
  }
}

// Fermer le menu
const closeWalletMenu = () => {
  showWalletMenu.value = false
}

// Changer de réseau (fonctionnalité future)
const switchNetwork = () => {
  $q.notify({
    message: 'Fonctionnalité à venir 🔄',
    color: 'info',
    timeout: 2000
  })
}

// Voir les transactions (fonctionnalité future)
const viewTransactions = () => {
  $q.notify({
    message: 'Fonctionnalité à venir 📜',
    color: 'info',
    timeout: 2000
  })
}
</script>

<style scoped>
.cardano-wallet-section {
  position: relative;
  margin-right: 8px;
}

.connect-wallet-btn {
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(103, 58, 183, 0.3);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #673ab7 0%, #9575cd 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.connect-wallet-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(103, 58, 183, 0.4);
}

.connect-wallet-btn:active {
  transform: translateY(0);
}

.wallet-connected {
  display: flex;
  align-items: center;
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.wallet-info:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.wallet-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wallet-avatar .q-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.wallet-arrow {
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
}

.wallet-arrow.rotated {
  transform: rotate(180deg);
}

.wallet-details {
  display: flex;
  flex-direction: column;
}

.wallet-network {
  font-size: 0.7rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #e0f7fa;
  font-weight: 500;
}

.wallet-balance {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.wallet-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 300px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  z-index: 2500;
  animation: dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e0e0e0;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-15px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.wallet-header {
  padding: 20px;
  background: linear-gradient(135deg, #673ab7 0%, #9575cd 100%);
  color: white;
  position: relative;
}

.wallet-info-badge {
  text-align: center;
}

.wallet-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
}

.wallet-address {
  font-family: 'Roboto Mono', monospace;
  position: relative;
}

.wallet-label {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.address-value {
  font-size: 0.8rem;
  word-break: break-all;
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 8px;
  font-weight: 500;
  line-height: 1.4;
  transition: all 0.3s ease;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.address-value:hover {
  background: rgba(0, 0, 0, 0.25);
}

.wallet-address .copy-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 6px;
}

.wallet-address .copy-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.wallet-address .copy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 0;
}

.wallet-actions {
  padding: 8px;
}

.dropdown-action {
  width: 100%;
  justify-content: flex-start;
  padding: 12px 16px;
  border-radius: 10px;
  margin: 4px 0;
  transition: all 0.3s ease;
  color: #424242;
  font-weight: 500;
  font-size: 0.9rem;
}

.dropdown-action:hover {
  background: #f5f5f5;
  transform: translateX(4px);
  color: #673ab7;
}

.dropdown-action .q-icon {
  margin-right: 12px;
  color: #673ab7;
  font-size: 18px;
}

.wallet-footer {
  padding: 12px 16px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.disconnect-btn {
  width: 100%;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.disconnect-btn:hover {
  background: #ffebee !important;
  transform: translateY(-1px);
}

/* Animations pour le badge */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.wallet-info:hover .wallet-avatar {
  animation: pulse 0.5s ease;
}

/* Animation pour la conversion */
@keyframes convertPulse {
  0% { background-color: rgba(0, 0, 0, 0.2); }
  50% { background-color: rgba(255, 193, 7, 0.3); }
  100% { background-color: rgba(0, 0, 0, 0.2); }
}

.address-value[style*="cursor: pointer"] {
  animation: convertPulse 2s infinite;
}

/* Responsive */
@media (max-width: 1024px) {
  .wallet-details {
    display: none;
  }

  .wallet-info {
    padding: 6px;
  }

  .connect-wallet-btn .q-btn__content span {
    display: none;
  }

  .connect-wallet-btn {
    min-width: 40px;
    padding: 8px;
  }
}

@media (max-width: 768px) {
  .cardano-wallet-section {
    margin-right: 4px;
  }

  .wallet-dropdown {
    width: 280px;
    right: -10px;
  }

  .connect-wallet-btn {
    min-width: 36px;
    padding: 6px;
  }
}

@media (max-width: 480px) {
  .wallet-dropdown {
    width: 260px;
    right: -20px;
  }

  .cardano-wallet-section {
    margin-right: 2px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .wallet-dropdown {
    background: #1e1e1e;
    border-color: #333;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
  }

  .dropdown-action {
    color: #e0e0e0;
  }

  .dropdown-action:hover {
    background: #2d2d2d;
    color: #bb86fc;
  }

  .dropdown-action .q-icon {
    color: #bb86fc;
  }

  .wallet-footer {
    background: #121212;
    border-top-color: #333;
  }

  .dropdown-divider {
    background: linear-gradient(to right, transparent, #333, transparent);
  }

  .address-value {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .address-value:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

/* Support pour les navigateurs sans backdrop-filter */
@supports not (backdrop-filter: blur(10px)) {
  .wallet-dropdown {
    background: rgba(255, 255, 255, 0.98);
  }

  @media (prefers-color-scheme: dark) {
    .wallet-dropdown {
      background: rgba(30, 30, 30, 0.98);
    }
  }
}
</style>