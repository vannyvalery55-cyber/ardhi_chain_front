<template>
  <q-dialog v-model="showSelector" persistent>
    <q-card class="wallet-selector-card">
      <q-card-section class="bg-deep-purple-7 text-white">
        <div class="text-h6 text-center">
          <q-icon name="account_balance_wallet" size="28px" class="q-mr-sm" />
          Choisissez votre wallet Cardano
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div class="text-subtitle2 text-grey-7 q-mb-md text-center">
          Sélectionnez un wallet pour vous connecter
        </div>

        <div class="wallet-grid">
          <q-card
            v-for="wallet in availableWallets"
            :key="wallet.id"
            class="wallet-card cursor-pointer"
            @click="selectWallet(wallet.id)"
            :class="{ 'selected': hoveredWallet === wallet.id }"
            @mouseenter="hoveredWallet = wallet.id"
            @mouseleave="hoveredWallet = null"
          >
            <q-card-section class="text-center">
              <q-avatar
                :color="hoveredWallet === wallet.id ? 'deep-purple-6' : 'grey-3'"
                text-color="white"
                size="60px"
                class="q-mb-md"
              >
                <q-icon :name="wallet.icon" size="28px" />
              </q-avatar>

              <div class="text-h6 text-weight-bold q-mb-xs">
                {{ wallet.name }}
              </div>

              <div class="text-caption text-grey-6">
                {{ wallet.description || `Wallet Cardano ${wallet.name}` }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Aucun wallet détecté -->
        <div v-if="availableWallets.length === 0" class="no-wallet-section">
          <q-icon name="error_outline" color="orange" size="48px" class="q-mb-md" />
          <div class="text-h6 text-weight-bold q-mb-sm">Aucun wallet détecté</div>
          <div class="text-body1 text-grey-7 q-mb-lg">
            Veuillez installer l'un de ces wallets Cardano :
          </div>

          <div class="install-links">
            <a href="https://namiwallet.io" target="_blank" class="install-link">
              <q-icon name="download" />
              <span>Nami Wallet</span>
            </a>
            <a href="https://eternl.io" target="_blank" class="install-link">
              <q-icon name="download" />
              <span>Eternl</span>
            </a>
            <a href="https://flint-wallet.com" target="_blank" class="install-link">
              <q-icon name="download" />
              <span>Flint Wallet</span>
            </a>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-lg">
        <q-btn
          flat
          label="Annuler"
          color="grey"
          v-close-popup
          class="q-px-xl"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import useCardano from 'src/composables/useCardano' // ✅ IMPORT CORRECT

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'wallet-selected'])

// ✅ UTILISER useCardano
const { getAvailableWallets, connectWallet } = useCardano()
const hoveredWallet = ref(null)

// Gérer l'affichage du sélecteur
const showSelector = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Obtenir la liste des wallets disponibles
const availableWallets = computed(() => {
  const wallets = getAvailableWallets()

  // Ajouter des descriptions
  return wallets.map(wallet => ({
    ...wallet,
    description: getWalletDescription(wallet.id)
  }))
})

// Descriptions des wallets
const getWalletDescription = (walletId) => {
  const descriptions = {
    nami: 'Simple et sécurisé',
    eternl: 'Fonctionnalités avancées',
    flint: 'Pour débutants',
    typhon: 'Performance optimale',
    gerowallet: 'Sécurité renforcée'
  }
  return descriptions[walletId] || 'Wallet Cardano'
}

// Sélectionner un wallet
const selectWallet = async (walletId) => {
  try {
    await connectWallet(walletId)
    emit('wallet-selected', walletId)
    showSelector.value = false
  } catch {
    // L'erreur est déjà gérée dans le contexte
  }
}
</script>

<style scoped>
.wallet-selector-card {
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  overflow: hidden;
}

.wallet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.wallet-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: white;
}

.wallet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(103, 58, 183, 0.2);
  border-color: #673ab7;
}

.wallet-card.selected {
  border-color: #673ab7;
  background: linear-gradient(135deg, #f5f0ff 0%, #ede7f6 100%);
}

.no-wallet-section {
  text-align: center;
  padding: 40px 20px;
  background: #fff8e1;
  border-radius: 16px;
  margin: 20px 0;
}

.install-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.install-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #673ab7;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 200px;
  justify-content: center;
  border: 1px solid #e0e0e0;
}

.install-link:hover {
  background: #673ab7;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 58, 183, 0.3);
}

.install-link .q-icon {
  font-size: 18px;
}

/* Responsive */
@media (max-width: 600px) {
  .wallet-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .wallet-selector-card {
    margin: 16px;
  }
}

@media (max-width: 400px) {
  .wallet-grid {
    grid-template-columns: 1fr;
  }

  .install-link {
    min-width: 100%;
  }
}
</style>
