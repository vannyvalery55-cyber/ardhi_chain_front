<template>
  <footer class="parcelle-footer">
    <div class="footer-content">
      <!-- Section gauche : Informations blockchain -->
      <div class="footer-section">
        <div class="blockchain-info">
          <q-icon name="verified" color="white" size="sm" class="q-mr-xs" />
          <div>
            <div class="text-caption">Sécurisé par blockchain</div>
            <div class="text-caption opacity-70">NFT ID: {{ nftId }}</div>
          </div>
        </div>
      </div>

      <!-- Section centrale : Bouton d'action principal -->
      <div class="footer-section">
        <q-btn
          color="white"
          :label="actionLabel"
          :icon="actionIcon"
          class="action-btn"
          @click="handleAction"
          :loading="loading"
        />
      </div>

      <!-- Section droite : Prix -->
      <div class="footer-section">
        <div class="price-display">
          <div class="text-caption opacity-70">Prix total</div>
          <div class="text-h6 text-weight-bold">
            {{ price }}
          </div>
          <div v-if="installment" class="text-caption">
            {{ installment }}
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// CORRECTION : Supprimer la variable props non utilisée
import { defineProps, defineEmits } from 'vue'

defineProps({
  price: {
    type: String,
    default: '2 900 000 CDF'
  },
  nftId: {
    type: String,
    default: 'PARC-000001'
  },
  actionLabel: {
    type: String,
    default: 'Acheter maintenant'
  },
  actionIcon: {
    type: String,
    default: 'shopping_cart'
  },
  installment: {
    type: String,
    default: 'Facilités de paiement disponibles'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['action-click'])

const handleAction = () => {
  emit('action-click')
}
</script>

<style scoped>
.parcelle-footer {
  background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
  color: white;
  padding: 16px 20px;
  position: sticky;
  bottom: 0;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  gap: 20px;
}

.footer-section {
  display: flex;
  align-items: center;
}

.blockchain-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  color: #2E7D32;
  font-weight: bold;
  padding: 8px 24px;
  border-radius: 25px;
  min-width: 200px;
}

.price-display {
  text-align: right;
}

.opacity-70 {
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .footer-section {
    width: 100%;
    justify-content: center;
  }

  .price-display {
    text-align: center;
  }

  .action-btn {
    min-width: 180px;
  }
}
</style>
