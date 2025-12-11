<template>
  <div class="test-wallet-section">
    <q-btn
      color="primary"
      :icon="cardano.isConnected?.value ? 'check' : 'account_balance_wallet'"
      :label="buttonLabel"
      @click="handleClick"
      :loading="cardano.isLoading?.value"
      size="sm"
    />

    <div v-if="cardano.isConnected?.value" class="wallet-info">
      <div class="address">Adresse: {{ displayAddress }}</div>
      <div class="balance">Solde: {{ cardano.balance?.value }} ₳</div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const cardano = inject('cardano', {
  isConnected: { value: false },
  walletAddress: { value: '' },
  balance: { value: '0.00' },
  isLoading: { value: false },
  connectWallet: () => {},
  disconnectWallet: () => {}
})

const buttonLabel = computed(() => {
  return cardano.isConnected?.value ? 'Déconnecter' : 'Tester Wallet'
})

const displayAddress = computed(() => {
  const addr = cardano.walletAddress?.value || ''
  if (!addr) return 'Non connecté'
  if (addr.length > 20) {
    return `${addr.substring(0, 10)}...${addr.substring(addr.length - 8)}`
  }
  return addr
})

const handleClick = () => {
  if (cardano.isConnected?.value) {
    cardano.disconnectWallet?.()
  } else {
    cardano.connectWallet?.()
  }
}
</script>

<style scoped>
.test-wallet-section {
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 10px;
  background: #f9f9f9;
}

.wallet-info {
  margin-top: 10px;
  padding: 10px;
  background: white;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.address {
  word-break: break-all;
  margin-bottom: 5px;
}

.balance {
  font-weight: bold;
  color: #4caf50;
}
</style>
