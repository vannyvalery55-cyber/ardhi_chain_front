<template>
  <div class="wallet-container">
    <!-- Header du wallet -->
    <div class="wallet-header">
      <q-btn
        flat
        icon="arrow_back"
        color="grey-7"
        @click="$router.go(-1)"
        class="q-mb-md"
      >
        <q-tooltip>Retour</q-tooltip>
      </q-btn>
      
      <div class="text-h4 text-weight-bold text-green-9 q-mb-xs">
        Mon Portefeuille Cardano
      </div>
      <div class="text-subtitle1 text-grey-7">
        Gérez vos actifs et transactions
      </div>
    </div>

    <!-- État de connexion -->
    <div v-if="!isConnected" class="wallet-disconnected-state">
      <q-card class="my-card q-pa-lg text-center">
        <q-icon name="account_balance_wallet" size="80px" color="grey-5" class="q-mb-md" />
        <div class="text-h6 text-grey-7 q-mb-sm">Wallet non connecté</div>
        <div class="text-body1 text-grey-6 q-mb-lg">
          Connectez votre wallet Cardano pour voir vos détails
        </div>
        <q-btn
          unelevated
          color="green-7"
          icon="account_balance_wallet"
          label="Connecter Wallet"
          @click="connectWallet"
          :loading="isLoading"
          size="lg"
        />
      </q-card>
    </div>

    <!-- Wallet connecté -->
    <div v-else>
      <!-- Carte principale du wallet -->
      <q-card class="wallet-main-card q-mb-lg">
        <q-card-section>
          <div class="row items-center">
            <div class="col-auto">
              <q-avatar size="60px" color="green-8" text-color="white">
                <q-icon name="account_balance_wallet" size="30px" />
              </q-avatar>
            </div>
            <div class="col q-pl-md">
              <div class="text-h5 text-weight-bold text-green-9">
                {{ walletName }}
              </div>
              <div class="text-body2 text-grey-7">
                {{ network || 'Network' }} • Connecté
              </div>
            </div>
            <div class="col-auto">
              <q-btn
                flat
                color="negative"
                icon="logout"
                label="Déconnecter"
                @click="disconnectWallet"
                size="sm"
              />
            </div>
          </div>
        </q-card-section>

        <!-- Solde principal -->
        <q-card-section class="bg-green-1 q-pt-none">
          <div class="text-center q-py-lg">
            <div class="text-h2 text-weight-bold text-green-9 q-mb-sm">
              {{ formattedBalance }} <span class="text-h4">ADA</span>
            </div>
            <div class="text-body1 text-grey-7">
              ≈ {{ estimatedValue }} USD
            </div>
            <div class="q-mt-md">
              <q-btn
                unelevated
                color="blue-7"
                icon="refresh"
                label="Rafraîchir"
                @click="refreshBalance"
                size="sm"
                class="q-mr-sm"
              />
              <q-btn
                unelevated
                color="green-7"
                icon="send"
                label="Envoyer"
                @click="showSendDialog = true"
                size="sm"
                class="q-mr-sm"
              />
              <q-btn
                unelevated
                color="amber-7"
                icon="call_received"
                label="Recevoir"
                @click="showReceiveDialog = true"
                size="sm"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Adresse du wallet -->
      <q-card class="q-mb-lg">
        <q-card-section>
          <div class="text-h6 text-weight-bold q-mb-md">Adresse du Wallet</div>
          <div class="wallet-address-display">
            <div class="text-caption text-grey-7 q-mb-xs">Votre adresse Cardano</div>
            <div class="address-value">
              <code>{{ safeWalletAddress || 'Adresse non disponible' }}</code>
            </div>
            <div class="q-mt-sm">
              <q-btn
                flat
                dense
                icon="content_copy"
                label="Copier"
                @click="copyAddress"
                color="primary"
                size="sm"
                class="q-mr-sm"
              />
              <q-btn
                flat
                dense
                icon="open_in_new"
                label="Voir dans l'explorer"
                @click="openInExplorer"
                color="secondary"
                size="sm"
              />
              <q-btn
                flat
                dense
                icon="qr_code"
                label="QR Code"
                @click="showQrCode = true"
                color="green-7"
                size="sm"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Informations réseau -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="row items-center">
                <q-icon name="language" size="24px" color="blue-7" class="q-mr-sm" />
                <div class="col">
                  <div class="text-caption text-grey-7">Réseau</div>
                  <div class="text-h6 text-weight-bold">{{ networkDisplay }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="row items-center">
                <q-icon name="account_balance" size="24px" color="green-7" class="q-mr-sm" />
                <div class="col">
                  <div class="text-caption text-grey-7">Solde en Lovelace</div>
                  <div class="text-h6 text-weight-bold">{{ balanceLovelace }} ₳</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="row items-center">
                <q-icon name="security" size="24px" color="amber-7" class="q-mr-sm" />
                <div class="col">
                  <div class="text-caption text-grey-7">Statut</div>
                  <div class="text-h6 text-weight-bold">{{ connectionStatus }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Transactions récentes -->
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold q-mb-md">Transactions récentes</div>
          
          <div v-if="transactions.length === 0" class="text-center q-py-lg">
            <q-icon name="receipt_long" size="60px" color="grey-4" class="q-mb-md" />
            <div class="text-h6 text-grey-6 q-mb-sm">Aucune transaction</div>
            <div class="text-body2 text-grey-5">
              Vos transactions apparaîtront ici
            </div>
          </div>

          <div v-else>
            <q-list bordered separator>
              <q-item v-for="tx in transactions" :key="tx.id" clickable>
                <q-item-section avatar>
                  <q-icon :name="tx.type === 'send' ? 'call_made' : 'call_received'" 
                         :color="tx.type === 'send' ? 'negative' : 'positive'" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ tx.description }}</q-item-label>
                  <q-item-label caption>{{ tx.date }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label :class="tx.type === 'send' ? 'text-negative' : 'text-positive'">
                    {{ tx.type === 'send' ? '-' : '+' }}{{ tx.amount }} ADA
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="text-center q-mt-md">
            <q-btn
              flat
              color="primary"
              icon="history"
              label="Voir toutes les transactions"
              @click="goToTransactions"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Assets -->
      <q-card class="q-mt-lg">
        <q-card-section>
          <div class="text-h6 text-weight-bold q-mb-md">Actifs</div>
          
          <div class="row q-col-gutter-md">
            <!-- ADA -->
            <div class="col-12 col-md-6">
              <q-card class="asset-card">
                <q-card-section>
                  <div class="row items-center">
                    <q-avatar color="green-1" text-color="green-9" size="48px" class="q-mr-md">
                      <q-icon name="payments" size="24px" />
                    </q-avatar>
                    <div class="col">
                      <div class="text-h6 text-weight-bold">Cardano (ADA)</div>
                      <div class="text-body2 text-grey-7">Monnaie native</div>
                    </div>
                    <div class="col-auto text-right">
                      <div class="text-h5 text-weight-bold">{{ formattedBalance }} ADA</div>
                      <div class="text-caption text-grey-6">{{ estimatedValue }} USD</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- NFTs -->
            <div class="col-12 col-md-6">
              <q-card class="asset-card">
                <q-card-section>
                  <div class="row items-center">
                    <q-avatar color="purple-1" text-color="purple-9" size="48px" class="q-mr-md">
                      <q-icon name="image" size="24px" />
                    </q-avatar>
                    <div class="col">
                      <div class="text-h6 text-weight-bold">NFTs</div>
                      <div class="text-body2 text-grey-7">Collections</div>
                    </div>
                    <div class="col-auto text-right">
                      <div class="text-h5 text-weight-bold">0</div>
                      <div class="text-caption text-grey-6">Non disponible</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Dialog pour recevoir -->
    <q-dialog v-model="showReceiveDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="bg-green-7 text-white">
          <div class="text-h6">Recevoir des fonds</div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="text-center">
            <div v-if="safeWalletAddress" class="q-mb-lg">
              <!-- QR Code -->
              <div class="q-pa-md bg-white q-mb-md" style="display: inline-block">
                <canvas ref="qrcodeCanvas" width="200" height="200"></canvas>
              </div>
              
              <!-- Adresse -->
              <div class="q-mb-md">
                <div class="text-caption text-grey-7 q-mb-xs">Votre adresse:</div>
                <div class="address-display q-pa-sm bg-grey-2 rounded-borders">
                  <code>{{ safeWalletAddress }}</code>
                </div>
              </div>
            </div>

            <div v-else class="text-center q-py-lg">
              <q-icon name="error" size="60px" color="warning" class="q-mb-md" />
              <div class="text-h6 text-grey-7">Adresse non disponible</div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Copier l'adresse" color="primary" @click="copyAddress" />
          <q-btn flat label="Fermer" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog pour envoyer -->
    <q-dialog v-model="showSendDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="bg-blue-7 text-white">
          <div class="text-h6">Envoyer des ADA</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="sendTransaction">
            <q-input
              v-model="sendForm.address"
              label="Adresse du destinataire"
              placeholder="addr1..."
              :rules="[val => !!val || 'Adresse requise']"
              class="q-mb-md"
            />

            <q-input
              v-model="sendForm.amount"
              label="Montant (ADA)"
              type="number"
              :rules="[val => !!val || 'Montant requis', val => val > 0 || 'Montant positif requis']"
              class="q-mb-md"
            />

            <q-input
              v-model="sendForm.message"
              label="Message (optionnel)"
              type="textarea"
              rows="2"
              class="q-mb-lg"
            />

            <div class="text-caption text-grey-7 q-mb-md">
              Frais estimés: ~0.17 ADA
            </div>

            <div class="row justify-between">
              <q-btn flat label="Annuler" color="negative" v-close-popup />
              <q-btn 
                unelevated 
                label="Envoyer" 
                type="submit" 
                color="primary"
                :loading="sending"
                :disable="!sendForm.address || !sendForm.amount"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog QR Code -->
    <q-dialog v-model="showQrCode">
      <q-card>
        <q-card-section class="text-center">
          <div class="text-h6 q-mb-md">QR Code de votre adresse</div>
          <div v-if="safeWalletAddress" class="q-pa-md bg-white">
            <canvas ref="qrCanvas" width="250" height="250"></canvas>
          </div>
          <div v-else class="text-grey-6">
            Adresse non disponible
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat label="Fermer" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Bouton de débogage -->
    <div v-if="isConnected" class="text-center q-mt-md">
      <q-btn
        flat
        dense
        color="grey"
        icon="bug_report"
        label="Déboguer"
        @click="debugWallet"
        size="xs"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import QRCode from 'qrcode' // Gardé car utilisé dans generateQrCode

export default {
  name: 'WalletPage',
  
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    
    // États de base
    const isConnected = ref(false)
    const walletAddress = ref('')
    const balance = ref(0)
    const isLoading = ref(false)
    const network = ref('')
    
    // États UI
    const showReceiveDialog = ref(false)
    const showSendDialog = ref(false)
    const showQrCode = ref(false)
    const sending = ref(false)
    const transactions = ref([])
    
    // Références (liées au template)
    const qrcodeCanvas = ref(null)
    const qrCanvas = ref(null)
    
    // Formulaire d'envoi
    const sendForm = ref({
      address: '',
      amount: '',
      message: ''
    })
    
    // Computed properties
    const walletName = computed(() => {
      return localStorage.getItem('cardanoWalletName') || 'Eternl Wallet'
    })
    
    const formattedBalance = computed(() => {
      const bal = balance.value || 0
      return typeof bal === 'number' ? bal.toFixed(2) : '0.00'
    })
    
    const safeWalletAddress = computed(() => {
      const addr = walletAddress.value || ''
      if (addr.startsWith('addr') || addr.includes('addr')) {
        return addr
      }
      if (addr.length > 100) {
        return addr.substring(0, 50) + '...' + addr.substring(addr.length - 10)
      }
      return addr || 'Adresse non disponible' 
    })
    
    const balanceLovelace = computed(() => {
      const bal = balance.value || 0
      const numericBal = Number(bal)
      return isNaN(numericBal) ? '0' : Math.floor(numericBal * 1000000).toLocaleString()
    })
    
    const networkDisplay = computed(() => {
      const net = network.value || ''
      switch (net) {
        case 'mainnet': return 'Mainnet'
        case 'testnet': return 'Testnet'
        case 'preprod': return 'Preprod'
        case 'preview': return 'Preview'
        default: return net || 'Inconnu'
      }
    })
    
    const connectionStatus = computed(() => {
      return isConnected.value ? 'En ligne' : 'Hors ligne'
    })
    
    const estimatedValue = computed(() => {
      const bal = balance.value || 0
      const numericBal = Number(bal)
      const adaPrice = 0.25 // Prix approximatif en USD
      return isNaN(numericBal) ? '0.00' : (numericBal * adaPrice).toFixed(2)
    })
    
    // ====================================================================
    // DÉCLARATION DES MÉTHODES
    // Toutes les méthodes sont déclarées ici avant le return
    // ====================================================================

    const loadWalletData = () => {
      try {
        console.log('🔄 Chargement données wallet...')
        
        // Charger depuis localStorage
        const connected = localStorage.getItem('cardanoConnected') === 'true'
        const address = localStorage.getItem('cardanoAddress') || ''
        const storedBalance = localStorage.getItem('cardanoBalance') || '0'
        const storedNetwork = localStorage.getItem('cardanoNetwork') || ''
        const lastUpdate = localStorage.getItem('cardanoLastUpdate') || '0'
        
        console.log('📥 Données localStorage:', {
          connected,
          address,
          storedBalance,
          storedNetwork,
          lastUpdate
        })
        
        isConnected.value = connected
        
        // La condition qui déclenche l'avertissement quand l'adresse est vide
        if (address && 
            typeof address === 'string' && 
            address.trim() !== '' && 
            address !== 'addr1... (en attente)' && 
            address !== 'addr_not_available' &&
            address !== 'vide') { 
          walletAddress.value = address.trim()
          console.log('✅ Adresse chargée:', walletAddress.value.substring(0, 50) + '...')
        } else {
          console.warn('⚠️ Adresse invalide ou vide:', address)
          walletAddress.value = ''
        }
        
        // Convertir le solde
        const balanceNum = parseFloat(storedBalance)
        balance.value = isNaN(balanceNum) ? 0 : balanceNum
        
        // Réseau
        network.value = storedNetwork
        
        console.log('✅ État final:', {
          isConnected: isConnected.value,
          hasAddress: !!walletAddress.value,
          balance: balance.value,
          network: network.value
        })
        
      } catch (error) {
        console.error('❌ Erreur chargement données:', error)
        isConnected.value = false
        walletAddress.value = ''
        balance.value = 0
      }
    } 
    
    // Utilise un événement pour déclencher la connexion dans le contexte principal
    const connectWallet = async () => {
      try {
        isLoading.value = true
        console.log('🔗 Tentative de connexion depuis Wallet.vue...')
        
        // Émettre l'événement pour que App.vue déclenche la connexion.
        window.dispatchEvent(new CustomEvent('trigger-wallet-connect'))
        
        // Le rechargement sera géré par l'événement 'wallet-data-updated'
        
      } catch (error) {
        console.error('Erreur connexion:', error)
        isLoading.value = false
      }
    }
    
    const disconnectWallet = () => {
      $q.dialog({
        title: 'Confirmer la déconnexion',
        message: 'Voulez-vous vraiment déconnecter votre wallet ?',
        cancel: true,
        persistent: true,
        ok: {
          label: 'Déconnecter',
          color: 'negative'
        }
      }).onOk(() => {
        // Nettoyer localStorage
        localStorage.removeItem('cardanoConnected')
        localStorage.removeItem('cardanoAddress')
        localStorage.removeItem('cardanoBalance')
        localStorage.removeItem('cardanoNetwork')
        localStorage.removeItem('cardanoApiAvailable')
        localStorage.removeItem('cardanoLastUpdate')
        localStorage.removeItem('cardanoWalletName') 

        window.dispatchEvent(new CustomEvent('trigger-wallet-disconnect')) 
        
        // Réinitialiser les états
        isConnected.value = false
        walletAddress.value = ''
        balance.value = 0
        network.value = ''
        
        showReceiveDialog.value = false
        showSendDialog.value = false
        
        $q.notify({
          message: 'Wallet déconnecté',
          color: 'info',
          position: 'top',
          timeout: 2000
        })
        
        // Rediriger vers l'accueil
        setTimeout(() => {
          router.push('/')
        }, 1000)
      })
    }
    
    const refreshBalance = async () => {
      try {
        isLoading.value = true
        
        // Émettre un événement pour rafraîchir
        window.dispatchEvent(new CustomEvent('trigger-wallet-refresh'))
        
        // Le rechargement des données et la fin du chargement se feront via les événements
        // Simuler la fin du chargement après un délai minimal en attendant l'événement
        setTimeout(() => {
            isLoading.value = false
        }, 1500)
        
        $q.notify({
            message: 'Rafraîchissement demandé',
            color: 'info',
            position: 'top',
            timeout: 1000
        })
        
      } catch (error) {
        console.error('Erreur rafraîchissement:', error)
        isLoading.value = false
      }
    }
    
    // ✅ CORRIGÉ: copyAddress est maintenant bien déclaré (évite no-undef)
    const copyAddress = () => {
      if (safeWalletAddress.value && safeWalletAddress.value !== 'Adresse non disponible') {
        navigator.clipboard.writeText(safeWalletAddress.value)
        $q.notify({
          message: 'Adresse copiée dans le presse-papier',
          color: 'positive',
          position: 'top',
          timeout: 1000
        })
      } else {
        $q.notify({
          message: 'Aucune adresse à copier',
          color: 'warning',
          position: 'top'
        })
      }
    }
    
    // ✅ CORRIGÉ: openInExplorer est maintenant bien déclaré (évite no-undef)
    const openInExplorer = () => {
      if (!safeWalletAddress.value || safeWalletAddress.value === 'Adresse non disponible') {
        $q.notify({
          message: 'Adresse non disponible',
          color: 'warning',
          position: 'top'
        })
        return
      }
      
      const net = network.value || 'mainnet'
      let explorerUrl = ''
      
      // Logique pour déterminer l'explorateur
      if (net === 'mainnet') {
        explorerUrl = `https://cardanoscan.io/address/${safeWalletAddress.value}`
      } else if (net === 'testnet' || net === 'preprod') {
        explorerUrl = `https://preprod.cardanoscan.io/address/${safeWalletAddress.value}`
      } else if (net === 'preview') {
        explorerUrl = `https://preview.cardanoscan.io/address/${safeWalletAddress.value}`
      } else {
        explorerUrl = `https://cexplorer.io/address/${safeWalletAddress.value}?network=${net}`
      }
      
      window.open(explorerUrl, '_blank', 'noopener,noreferrer')
    }

    // ✅ CORRIGÉ: sendTransaction est maintenant bien déclaré (évite no-undef)
    const sendTransaction = async () => {
      sending.value = true
      
      try {
        // Simulation d'envoi
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        $q.notify({
          message: `Transaction envoyée: ${sendForm.value.amount} ADA`,
          color: 'positive',
          position: 'top',
          timeout: 3000
        })
        
        // Réinitialiser le formulaire
        sendForm.value = { address: '', amount: '', message: '' }
        showSendDialog.value = false
        
        // Rafraîchir le solde
        refreshBalance()
        
      } catch (error) {
        console.error('Erreur envoi:', error)
        $q.notify({
          message: 'Erreur lors de l\'envoi',
          color: 'negative',
          position: 'top'
        })
      } finally {
        sending.value = false
      }
    }

    // ✅ CORRIGÉ: goToTransactions est maintenant bien déclaré (évite no-undef)
    const goToTransactions = () => {
      router.push('/transactions')
    }

    // ✅ CORRIGÉ: debugWallet est maintenant bien déclaré (évite no-undef)
    const debugWallet = () => {
      console.log('🐛 DÉBOGAGE WALLET:')
      console.log('=== État local ===')
      console.log('- isConnected:', isConnected.value)
      console.log('- walletAddress:', walletAddress.value)
      console.log('- safeWalletAddress:', safeWalletAddress.value)
      console.log('- balance:', balance.value)
      console.log('- network:', network.value)
      
      console.log('=== localStorage ===')
      console.log('- cardanoConnected:', localStorage.getItem('cardanoConnected'))
      console.log('- cardanoAddress:', localStorage.getItem('cardanoAddress'))
      console.log('- cardanoBalance:', localStorage.getItem('cardanoBalance'))
      console.log('- cardanoNetwork:', localStorage.getItem('cardanoNetwork'))
      console.log('- cardanoLastUpdate:', localStorage.getItem('cardanoLastUpdate'))
      
      console.log('=== Vérifications ===')
      console.log('- Adresse présente:', !!walletAddress.value)
      console.log('- Adresse longueur:', walletAddress.value?.length || 0)
      console.log('- Type adresse:', typeof walletAddress.value)
      
      // Forcer le rechargement
      console.log('🔄 Forçage rechargement...')
      loadWalletData()
    }
    
    // ✅ CORRIGÉ: generateQrCode est maintenant bien déclaré (évite no-undef)
    const generateQrCode = async () => {
      if (!safeWalletAddress.value || (!qrcodeCanvas.value && !qrCanvas.value)) {
        console.log('QR Code: adresse ou canvas non disponible')
        return
      }
      
      try {
        // nextTick est nécessaire pour être sûr que les canvas existent dans le DOM
        await nextTick() 
        
        // Pour le dialog receive
        if (qrcodeCanvas.value && showReceiveDialog.value) {
          await QRCode.toCanvas(qrcodeCanvas.value, safeWalletAddress.value, {
            width: 180,
            margin: 2,
            color: {
              dark: '#1b5e20',
              light: '#ffffff'
            }
          })
          console.log('✅ QR Code receive généré')
        }
        
        // Pour le dialog QR code seul
        if (qrCanvas.value && showQrCode.value) {
          await QRCode.toCanvas(qrCanvas.value, safeWalletAddress.value, {
            width: 230,
            margin: 2,
            color: {
              dark: '#1976d2',
              light: '#ffffff'
            }
          })
          console.log('✅ QR Code dialog généré')
        }
      } catch (error) {
        console.warn('QR code non généré:', error)
      }
    }

    // Gère la synchronisation via les Custom Events
    const setupEventListeners = () => {
      window.addEventListener('open-send-dialog', () => {
        showSendDialog.value = true
      })
      
      window.addEventListener('open-receive-dialog', () => {
        showReceiveDialog.value = true
      })
      
      // Gère les mises à jour de données APRÈS une connexion ou un rafraîchissement réussi
      window.addEventListener('wallet-data-updated', (event) => {
        console.log('🎯 Données wallet mises à jour:', event.detail)
        
        // On force le rechargement depuis localStorage pour synchroniser tous les états locaux
        loadWalletData() 
        
        $q.notify({
            message: 'Données wallet synchronisées',
            color: 'positive',
            position: 'top',
            timeout: 1000
        })
      })

      // Gère la mise à jour du solde sans forcément recharger toutes les données
      window.addEventListener('wallet-balance-updated', (event) => {
        console.log('💰 Solde mis à jour:', event.detail)
        if (event.detail.balance !== undefined) {
          balance.value = event.detail.balance
          localStorage.setItem('cardanoBalance', event.detail.balance.toString())
        }
      })

      // Permet de désactiver l'état de chargement une fois que l'opération asynchrone est terminée
      window.addEventListener('wallet-loading-finished', () => {
        isLoading.value = false
        console.log('✅ Rechargement après connexion (fin du chargement global)')
      })
    }
    
    // Surveiller le localStorage pour les changements
    const setupStorageListener = () => {
      window.addEventListener('storage', (event) => {
        console.log('📦 Changement localStorage:', event.key, event.newValue)
        if (event.key && (event.key === 'cardanoConnected' || 
             event.key === 'cardanoAddress' || 
             event.key === 'cardanoBalance' || 
             event.key === 'cardanoNetwork')) {
          if (event.newValue !== null) {
              console.log('🔄 Rechargement données après changement storage')
              loadWalletData()
          }
        }
      })
    }
    
    // Watchers
    watch([showReceiveDialog, showQrCode, safeWalletAddress], async () => {
      if (safeWalletAddress.value && (showReceiveDialog.value || showQrCode.value)) {
        // Délai court pour s'assurer que le DOM a rendu les canvas
        setTimeout(() => { 
          generateQrCode() // ✅ generateQrCode est maintenant défini
        }, 300)
      }
    })
    
    // Lifecycle
    onMounted(() => {
      console.log('🚀 Page Wallet montée')
      loadWalletData()
      setupEventListeners()
      setupStorageListener()
      
      // Vérifier périodiquement l'état de connexion ET l'adresse manquante
      const connectionCheckInterval = setInterval(() => {
        if (isConnected.value && !walletAddress.value) {
          console.log('🔄 Vérification adresse manquante... Tentative de rafraîchissement...')
          window.dispatchEvent(new CustomEvent('trigger-wallet-refresh')) 
        }
        loadWalletData(); 
      }, 10000) 
      
      // Nettoyer l'intervalle
      onUnmounted(() => {
        clearInterval(connectionCheckInterval)
        console.log('🧹 Page Wallet démontée')
      })
      
      // Charger les transactions (simulation)
      setTimeout(() => {
        transactions.value = []
      }, 1000)
    })
    
    // ====================================================================
    // EXPORTATION FINALE DES PROPRIÉTÉS ET MÉTHODES (Ligne 800 corrigée)
    // ====================================================================
    return {
      // États
      isConnected,
      walletAddress,
      balance,
      isLoading,
      network,
      showReceiveDialog,
      showSendDialog,
      showQrCode,
      sending,
      transactions,
      sendForm,
      
      // Références
      qrcodeCanvas,
      qrCanvas,
      
      // Computed
      walletName,
      formattedBalance,
      safeWalletAddress,
      balanceLovelace,
      networkDisplay,
      connectionStatus,
      estimatedValue,
      
      // Méthodes (Toutes définies et exportées une seule fois)
      connectWallet,
      disconnectWallet,
      refreshBalance,
      copyAddress,
      openInExplorer,
      sendTransaction,
      goToTransactions,
      debugWallet,
      generateQrCode,
    }
  }
}
</script>
<style scoped>
.wallet-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.wallet-header {
  margin-bottom: 30px;
}

.wallet-main-card {
  border-radius: 16px;
  overflow: hidden;
}

.asset-card {
  transition: transform 0.3s ease;
  border-radius: 12px;
}

.asset-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.wallet-address-display {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.address-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  word-break: break-all;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.address-display {
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  word-break: break-all;
}

.wallet-disconnected-state {
  max-width: 500px;
  margin: 50px auto;
}

/* Responsive */
@media (max-width: 768px) {
  .wallet-container {
    padding: 15px;
  }
  
  .text-h2 {
    font-size: 2.5rem;
  }
  
  .wallet-header {
    text-align: center;
  }
  
  .wallet-main-card .row {
    flex-direction: column;
    text-align: center;
  }
  
  .wallet-main-card .col {
    margin-bottom: 10px;
  }
}
</style>