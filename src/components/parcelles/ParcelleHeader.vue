<template>
  <header class="parcelle-header" :class="{ scrolled: isScrolled }">
    <!-- Barre d'en-tête principale avec effet premium -->
     
    <div class="header-container">
      <div class="header-bar">
        <!-- Logo ARDHI-CHAIN -->
        <div class="header-logo" @click="goToHome">
          <div class="logo-icon">
            <q-icon name="account_balance" size="24px" color="white" />
          </div>
          <div class="logo-text">
            <span class="logo-primary">ARDHI</span>
            <span class="logo-secondary">CHAIN</span>
          </div>
        </div>

        <!-- Navigation centrale - Visible sur desktop -->
        <nav class="header-nav">
          <div class="nav-items">
            <a href="/parcelles" class="nav-item" @click.prevent="goToParcelles">
              <q-icon name="landscape" size="18px" class="q-mr-xs" />
              Terrains
            </a>
            <a href="/properties" class="nav-item" @click.prevent="goToProperties">
              <q-icon name="house" size="18px" class="q-mr-xs" />
              Maisons
            </a>
            <a href="/dashboard" class="nav-item" @click.prevent="goToDashboard">
              <q-icon name="dashboard" size="18px" class="q-mr-xs" />
              Dashboard
            </a>
          </div>
        </nav>

        <!-- Zone utilisateur et actions -->
        <div class="header-user-section">
          <!-- Intégration Cardano Wallet -->
          <div class="cardano-integration">
            <!-- État non connecté -->
            <div v-if="!cardano.isConnected" class="wallet-disconnected">
              <q-btn
                unelevated
                color="green-7"
                icon="account_balance_wallet"
                :label="showWalletLabel ? 'Connecter Wallet' : ''"
                class="connect-wallet-btn"
                :loading="cardano.isLoading"
                @click="connectWalletHandler"
                size="sm"
                :disable="!hasAvailableWallets"
              >
                <template v-slot:loading>
                  <q-spinner-hourglass size="16px" />
                </template>

                <q-tooltip v-if="!showWalletLabel">
                  {{
                    hasAvailableWallets ? 'Connecter votre wallet Cardano' : 'Aucun wallet détecté'
                  }}
                </q-tooltip>

                <q-badge
                  v-if="hasAvailableWallets"
                  color="green"
                  floating
                  rounded
                  class="wallets-badge"
                >
                  {{ availableWalletsCount }}
                </q-badge>
              </q-btn>

              <!-- Message d'erreur -->
              <div v-if="cardano.errorMessage" class="wallet-error">
                <q-icon name="error" size="14px" color="red" />
                <span class="error-text">{{ cardano.errorMessage }}</span>
              </div>
            </div>

            <!-- État connecté -->
            <div v-else class="wallet-connected" @click="toggleWalletMenu">
              <div class="wallet-info">
                <q-icon :name="currentWalletIcon" size="16px" />
                <span class="wallet-address" :title="safeWalletAddress || 'Adresse non disponible'">
                  {{ safeTruncatedAddress || currentWalletName }}
                </span>
                <q-badge color="green" rounded class="balance-badge">
                  {{ formattedBalance }} ADA
                </q-badge>
                <q-icon name="expand_more" size="14px" :class="{ rotated: walletMenuOpen }" />
              </div>

              <!-- Menu déroulant du wallet (version simplifiée) -->
              <div v-if="walletMenuOpen" class="wallet-dropdown" @click.stop>
                <div class="dropdown-header">
                  <div class="wallet-details">
                    <q-icon :name="currentWalletIcon" size="24px" color="green-7" />
                    <div class="wallet-text">
                      <div class="wallet-name">{{ currentWalletName }}</div>
                      <div class="wallet-network">
                        <q-badge :color="networkColor" rounded size="xs">
                          {{ cardano.network || 'mainnet' }}
                        </q-badge>
                      </div>
                    </div>
                  </div>
                </div>

                <q-separator />

                <div class="dropdown-content">
                  <!-- Statistiques du wallet -->
                  <div class="wallet-stats">
                    <div class="stat-item">
                      <q-icon name="account_balance" size="16px" color="green-7" />
                      <div class="stat-text">
                        <div class="stat-label">Solde total</div>
                        <div class="stat-value">{{ formattedBalance }} ADA</div>
                      </div>
                    </div>

                    <div class="stat-item">
                      <q-icon name="language" size="16px" color="blue-7" />
                      <div class="stat-text">
                        <div class="stat-label">Réseau</div>
                        <div class="stat-value">{{ cardano.network || 'mainnet' }}</div>
                      </div>
                    </div>

                    <div class="stat-item" v-if="walletStatus === 'online'">
                      <q-icon name="wifi" size="16px" color="positive" />
                      <div class="stat-text">
                        <div class="stat-label">Statut</div>
                        <div class="stat-value">En ligne</div>
                      </div>
                    </div>
                  </div>

                  <q-separator />

             

                  <div class="wallet-actions">
                    <div class="action-grid">
                      <q-btn
                        flat
                        dense
                        icon="refresh"
                        label="Rafraîchir"
                        @click="refreshBalance"
                        class="action-btn"
                      />
                      <q-btn
                        flat
                        dense
                        icon="receipt_long"
                        label="Transactions"
                        @click="goToTransactions"
                        class="action-btn"
                      />
                      <q-btn
                        flat
                        dense
                        icon="open_in_new"
                        label="Explorer"
                        @click="openInExplorer"
                        class="action-btn"
                      />
                      <q-btn
                        flat
                        dense
                        icon="account_balance"
                        label="Détails"
                        @click="goToWallet"
                        class="action-btn"
                      />
                    </div>

                    <q-separator class="q-my-sm" />

                    <q-btn
                      flat
                      dense
                      color="negative"
                      icon="logout"
                      label="Déconnecter"
                      @click="disconnectWallet"
                      class="logout-btn"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bouton ajouter bien -->
          <q-btn
            unelevated
            color="amber-6"
            icon="add"
            label="Ajouter un bien"
            class="add-property-btn"
            size="sm"
            @click="goToAddProperty"
          />

          <!-- Notification indicator -->
          <div class="notification-indicator" @click="showNotifications" v-if="hasNotifications">
            <q-icon name="notifications" size="20px" color="white" />
            <div class="notification-badge">{{ notificationCount }}</div>
          </div>

          <!-- Menu utilisateur -->
          <div class="user-menu" @click="toggleUserMenu">
            <div class="user-avatar">
              <q-avatar size="36px" color="green-8" text-color="white">
                {{ userInitials }}
              </q-avatar>
              <q-icon
                name="expand_more"
                size="16px"
                class="user-arrow"
                :class="{ rotated: userMenuOpen }"
              />
            </div>

              <div v-if="debugMode" style="position: fixed; top: 0; left: 0; right: 0; background: red; color: white; padding: 10px; z-index: 9999;">
    DEBUG Header: 
    Connexion: {{ cardano.isConnected }} | 
    Adresse: {{ cardano.walletAddress }} | 
    Solde: {{ cardano.balance }} | 
    tronqué: {{ cardano.truncatedAddress }}
  </div>

            <!-- Dropdown menu utilisateur -->
            <div v-if="userMenuOpen" class="user-dropdown" @click.stop>
              <div class="user-info">
                <q-avatar size="48px" color="green-8" text-color="white" class="q-mb-sm">
                  {{ userInitials }}
                </q-avatar>
                <div class="user-name">{{ userName }}</div>
                <div class="user-email">{{ userEmail }}</div>
                <div class="user-role">{{ userRole }}</div>

                <!-- Section Wallet dans le menu utilisateur -->
                <div v-if="cardano.isConnected" class="user-wallet-info q-mt-sm">
                  <q-separator class="q-my-sm" />
                  <div class="text-caption text-white">Wallet Connecté</div>
                  <div class="text-caption text-grey-3">{{ safeTruncatedAddress }}</div>
                  <div class="text-caption text-green-3">{{ formattedBalance }} ADA</div>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <div class="dropdown-items">
                <a href="/profile" class="dropdown-item" @click.prevent="goToProfile">
                  <q-icon name="person" size="18px" />
                  <span>Mon profil</span>
                </a>
                <a href="/wallet" class="dropdown-item" @click.prevent="goToWallet">
                  <q-icon name="account_balance_wallet" size="18px" />
                  <span>Mon portefeuille</span>
                  <q-badge v-if="cardano.isConnected" color="green" rounded class="q-ml-auto">
                    {{ formattedBalance }} ADA
                  </q-badge>
                </a>
                <a href="/settings" class="dropdown-item" @click.prevent="goToSettings">
                  <q-icon name="settings" size="18px" />
                  <span>Paramètres</span>
                </a>

                <div class="dropdown-divider"></div>

                <a href="/logout" class="dropdown-item logout-item" @click.prevent="logout">
                  <q-icon name="logout" size="18px" />
                  <span>Se déconnecter</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Bouton menu mobile -->
          <q-btn
            flat
            round
            icon="menu"
            color="white"
            size="md"
            class="menu-toggle"
            @click="toggleDrawer"
          />
        </div>
      </div>

      <!-- Barre d'actions spécifiques à la parcelle -->
      <div class="parcelle-actions-bar" v-if="parcelleName">
        <div class="actions-container">
          <!-- Retour -->
          <q-btn flat icon="arrow_back" color="white" size="sm" class="back-btn" @click="goBack">
            <q-tooltip>Retour aux terrains</q-tooltip>
          </q-btn>

          <!-- Titre de la parcelle -->
          <div class="parcelle-title-section">
            <div class="parcelle-icon">
              <q-icon name="landscape" size="22px" />
            </div>
            <div class="parcelle-title">
              <div class="title-main">Terrain sélectionné</div>
              <div class="title-sub">{{ parcelleName }}</div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="quick-actions">
            <q-btn
              flat
              round
              icon="share"
              color="white"
              size="md"
              @click="shareParcelle"
              class="action-btn"
            >
              <q-tooltip>Partager ce terrain</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              :icon="isFavorite ? 'favorite' : 'favorite_border'"
              :color="isFavorite ? 'amber' : 'white'"
              size="md"
              @click="toggleFavorite"
              class="action-btn"
            >
              <q-tooltip>{{
                isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'
              }}</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              icon="chat"
              color="white"
              size="md"
              @click="toggleChat"
              class="action-btn chat-btn"
            >
              <q-tooltip>Chat avec le propriétaire</q-tooltip>
              <q-badge v-if="unreadMessages > 0" color="red" floating rounded class="chat-badge">
                {{ unreadMessages > 9 ? '9+' : unreadMessages }}
              </q-badge>
            </q-btn>

            <!-- Bouton d'impression -->
            <q-btn
              flat
              round
              icon="print"
              color="white"
              size="md"
              @click="printParcelle"
              class="action-btn"
            >
              <q-tooltip>Imprimer les détails</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu latéral premium -->
    <q-drawer
      v-model="localDrawerOpen"
      side="left"
      :width="320"
      :breakpoint="768"
      class="parcelle-menu"
      @hide="closeDrawer"
      bordered
      overlay
      elevated
    >
      <!-- En-tête du menu -->
      <div class="menu-header">
        <div class="menu-logo" @click="goToHome">
          <div class="menu-logo-icon">
            <q-icon name="account_balance" size="36px" color="green-7" />
          </div>
          <div class="menu-logo-text">
            <div class="text-h6 text-weight-bold text-green-9">ARDHI-CHAIN</div>
            <div class="text-caption text-grey-7">Plateforme Blockchain Foncière</div>
          </div>
        </div>
        <q-btn
          flat
          round
          icon="close"
          size="sm"
          color="grey-7"
          @click="closeDrawer"
          class="close-menu-btn"
        />
      </div>

      <!-- Informations utilisateur -->
      <div class="menu-user-info">
        <q-avatar size="64px" color="green-8" text-color="white" class="q-mb-md">
          {{ userInitials }}
        </q-avatar>
        <div class="user-name-large">{{ userName }}</div>
        <div class="user-email-small">{{ userEmail }}</div>
        <q-chip dense color="green-1" text-color="green-9" icon="verified" class="q-mt-sm">
          {{ userRole }}
        </q-chip>

        <!-- Section Wallet dans le menu latéral -->
        <div v-if="cardano.isConnected" class="menu-wallet-status q-mt-md">
          <div class="wallet-status-card">
            <div class="row items-center">
              <q-icon name="account_balance_wallet" size="20px" color="green-7" class="q-mr-sm" />
              <div class="col">
                <div class="text-caption text-weight-medium">Wallet Connecté</div>
                <div class="text-caption text-grey-7">{{ safeTruncatedAddress }}</div>
              </div>
            </div>
            <div class="row items-center justify-between q-mt-xs">
              <div class="text-h6 text-green-9">{{ formattedBalance }} ADA</div>
              <q-badge :color="networkColor" rounded>
                {{ cardano.network || 'mainnet' }}
              </q-badge>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Wallet Cardano dans le menu -->
      <div class="menu-wallet-section" v-if="cardano.isConnected">
        <div class="wallet-menu-header">
          <q-icon name="account_balance_wallet" size="20px" color="green-7" />
          <span class="wallet-menu-title">Wallet Connecté</span>
          <q-space />
          <q-badge :color="walletStatusColor" rounded>
            {{ walletStatusText }}
          </q-badge>
        </div>
        <div class="wallet-menu-info">
          <div class="wallet-menu-details">
            <div class="wallet-menu-name">{{ currentWalletName }}</div>
            <div class="wallet-menu-address">{{ safeTruncatedAddress }}</div>
            <div class="wallet-menu-balance">
              <q-icon name="account_balance" size="14px" />
              {{ formattedBalance }} ADA
              <q-badge :color="networkColor" rounded class="q-ml-sm">
                {{ cardano.network || 'mainnet' }}
              </q-badge>
            </div>
          </div>
          <q-btn
            flat
            dense
            icon="logout"
            size="sm"
            color="negative"
            @click="disconnectWallet"
            class="wallet-menu-disconnect"
          >
            <q-tooltip>Déconnecter</q-tooltip>
          </q-btn>
        </div>

        <!-- Actions rapides du wallet -->
        <div class="wallet-menu-actions q-mt-sm">
          <div class="row q-gutter-xs">
            <q-btn
              unelevated
              color="blue-7"
              icon="refresh"
              size="sm"
              @click="refreshBalance"
              class="col"
            >
              <q-tooltip>Rafraîchir</q-tooltip>
            </q-btn>
            <q-btn
              unelevated
              color="purple-7"
              icon="receipt_long"
              size="sm"
              @click="goToTransactions"
              class="col"
            >
              <q-tooltip>Transactions</q-tooltip>
            </q-btn>
            <q-btn
              unelevated
              color="teal-7"
              icon="open_in_new"
              size="sm"
              @click="openInExplorer"
              class="col"
            >
              <q-tooltip>Explorer</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <div class="menu-wallet-section" v-else>
        <div class="wallet-menu-header">
          <q-icon name="account_balance_wallet" size="20px" color="grey-6" />
          <span class="wallet-menu-title">Wallet Cardano</span>
        </div>
        <div class="wallet-menu-connect">
          <q-btn
            unelevated
            color="green-7"
            icon="account_balance_wallet"
            label="Connecter Wallet"
            @click="connectWalletHandler"
            :loading="cardano.isLoading"
            class="full-width"
            size="sm"
          />
          <div v-if="hasAvailableWallets" class="available-wallets-hint">
            {{ availableWalletsCount }} wallet(s) détecté(s)
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <q-scroll-area class="menu-scroll">
        <q-list class="menu-nav">
          <!-- Section principale -->
          <div class="menu-section-title">Navigation</div>
          <q-item clickable v-ripple to="/" @click="closeDrawer" class="menu-item">
            <q-item-section avatar>
              <q-icon name="home" color="green-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label">Accueil</div>
              <div class="menu-item-desc">Page d'accueil ARDHI-CHAIN</div>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/parcelles" @click="closeDrawer" class="menu-item">
            <q-item-section avatar>
              <q-icon name="landscape" color="green-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label">Terrains disponibles</div>
              <div class="menu-item-desc">Explorer nos terrains certifiés</div>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/properties" @click="closeDrawer" class="menu-item">
            <q-item-section avatar>
              <q-icon name="house" color="green-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label">Maisons et Villas</div>
              <div class="menu-item-desc">Propriétés résidentielles</div>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard" @click="closeDrawer" class="menu-item">
            <q-item-section avatar>
              <q-icon name="dashboard" color="blue-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label">Tableau de bord</div>
              <div class="menu-item-desc">Vue d'ensemble de vos activités</div>
            </q-item-section>
          </q-item>

          <!-- Section transactionnelle -->
          <div class="menu-section-title">Transactions</div>
          <q-item clickable v-ripple to="/add-property" @click="closeDrawer" class="menu-item">
            <q-item-section avatar>
              <q-icon name="add_circle" color="positive" size="20px" />
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label">Ajouter un bien</div>
              <div class="menu-item-desc">Listez votre propriété</div>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/wallet"
            @click="closeDrawer"
            class="menu-item"
            :class="{ 'active-wallet': cardano.isConnected }"
          >
            <q-item-section avatar>
              <q-icon name="account_balance_wallet" color="amber-7" size="20px" />
              <q-badge v-if="cardano.isConnected" color="green" floating rounded>
                {{ formattedBalance }}
              </q-badge>
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label">Portefeuille numérique</div>
              <div class="menu-item-desc">
                {{
                  cardano.isConnected
                    ? `${formattedBalance} ADA connecté`
                    : 'Gérez vos actifs blockchain'
                }}
              </div>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/transactions" @click="closeDrawer" class="menu-item">
            <q-item-section avatar>
              <q-icon name="receipt_long" color="purple-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label">Historique des transactions</div>
              <div class="menu-item-desc">Toutes vos opérations</div>
            </q-item-section>
          </q-item>

          <!-- Section compte -->
          <div class="menu-section-title">Mon compte</div>
          <q-item clickable v-ripple to="/profile" @click="closeDrawer" class="menu-item">
            <q-item-section avatar>
              <q-icon name="person" color="blue-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label">Mon profil</div>
              <div class="menu-item-desc">Informations personnelles</div>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/settings" @click="closeDrawer" class="menu-item">
            <q-item-section avatar>
              <q-icon name="settings" color="grey-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label">Paramètres</div>
              <div class="menu-item-desc">Préférences et sécurité</div>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/help" @click="closeDrawer" class="menu-item">
            <q-item-section avatar>
              <q-icon name="help_center" color="blue-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label">Centre d'aide</div>
              <div class="menu-item-desc">Support et assistance</div>
            </q-item-section>
          </q-item>

          <!-- Bouton déconnexion -->
          <q-item clickable v-ripple @click="logout" class="logout-menu-item">
            <q-item-section avatar>
              <q-icon name="logout" color="red-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label text-red-7">Se déconnecter</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <!-- Footer du menu -->
      <div class="menu-footer">
        <div class="menu-footer-text">
          <div class="text-caption text-grey-6">© 2024 ARDHI-CHAIN</div>
          <div class="text-caption text-grey-5">Sécurité foncière par blockchain</div>
          <div v-if="cardano.isConnected" class="text-caption text-green-6 q-mt-xs">
            <q-icon name="security" size="12px" />
            Wallet sécurisé
          </div>
        </div>
        <div class="menu-footer-actions">
          <q-btn flat dense icon="security" color="green-7" size="sm">
            <q-tooltip>Sécurité certifiée</q-tooltip>
          </q-btn>
          <q-btn flat dense icon="language" color="grey-6" size="sm">
            <q-tooltip>Changer la langue</q-tooltip>
          </q-btn>
          <q-btn
            v-if="cardano.isConnected"
            flat
            dense
            icon="account_balance_wallet"
            color="green-7"
            size="sm"
          >
            <q-tooltip>Wallet connecté</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-drawer>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

// Injecter le contexte Cardano
const cardano = inject('cardano', {
  isConnected: ref(false),
  walletAddress: ref(''),
  balance: ref(0),
  isLoading: ref(false),
  selectedWallet: ref(''),
  network: ref(''),
  errorMessage: ref(''),
  connectWallet: () => Promise.reject(new Error('Contexte Cardano non disponible')),
  disconnectWallet: () => {},
  refreshBalance: () => Promise.resolve(0),
  getAvailableWallets: () => [],
  getWalletName: () => '',
  getWalletIcon: () => 'account_balance_wallet',
})

const props = defineProps({
  parcelleName: String,
  showChat: Boolean,
  unreadMessages: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['toggle-chat', 'share', 'toggle-favorite', 'go-back'])

// États locaux
const localDrawerOpen = ref(false)
const isFavorite = ref(false)
const userMenuOpen = ref(false)
const walletMenuOpen = ref(false)
const isScrolled = ref(false)
const showWalletLabel = ref(true)
const walletStatus = ref('online') // online, offline, syncing

// Données utilisateur - récupérées du localStorage
const userData = ref({
  name: '',
  email: '',
  role: '',
  notifications: 0,
})

// Computed properties pour Cardano
const availableWallets = computed(() => {
  try {
    return cardano.getAvailableWallets?.() || []
  } catch {
    return []
  }
})

const availableWalletsCount = computed(() => {
  try {
    return availableWallets.value.length
  } catch {
    return 0
  }
})

const hasAvailableWallets = computed(() => {
  try {
    return availableWalletsCount.value > 0
  } catch {
    return false
  }
})

const currentWalletName = computed(() => {
  try {
    return cardano.getWalletName?.(cardano.selectedWallet) || 'Eternl Wallet'
  } catch {
    return 'Wallet'
  }
})

const currentWalletIcon = computed(() => {
  try {
    return cardano.getWalletIcon?.(cardano.selectedWallet) || 'account_balance_wallet'
  } catch {
    return 'account_balance_wallet'
  }
})

// Fonction de troncature sécurisée
const safeTruncatedAddress = computed(() => {
  try {
    if (!cardano.isConnected) return 'Non connecté'

    const getAddress = () => {
      if (cardano.walletAddress && typeof cardano.walletAddress === 'string') {
        return cardano.walletAddress
      }

      if (Array.isArray(cardano.walletAddress) && cardano.walletAddress.length > 0) {
        return cardano.walletAddress[0]
      }

      if (typeof cardano.walletAddress === 'object' && cardano.walletAddress !== null) {
        const possibleProps = ['address', 'hex', 'pubKey', 'publicKey', 'stakeAddress']
        for (const prop of possibleProps) {
          if (cardano.walletAddress[prop]) {
            return cardano.walletAddress[prop]
          }
        }
      }

      return null
    }

    const address = getAddress()

    if (!address) {
      return 'Wallet connecté'
    }

    if (address.length > 30) {
      return `${address.substring(0, 12)}...${address.substring(address.length - 10)}`
    }

    return address
  } catch {
    return cardano.isConnected ? 'Connecté' : 'Non connecté'
  }
})

// Adresse complète pour copier
const safeWalletAddress = computed(() => {
  try {
    if (!cardano.walletAddress || !cardano.isConnected) return ''

    let addressStr = ''

    if (Array.isArray(cardano.walletAddress) && cardano.walletAddress.length > 0) {
      addressStr = cardano.walletAddress[0]
    } else if (typeof cardano.walletAddress === 'string') {
      addressStr = cardano.walletAddress
    } else if (typeof cardano.walletAddress === 'object' && cardano.walletAddress !== null) {
      addressStr = cardano.walletAddress.address || cardano.walletAddress.hex || ''
    }

    if (addressStr === '[object Object]' || addressStr === '{}') {
      return ''
    }

    return addressStr
  } catch {
    return ''
  }
})

// Formater le solde
const formattedBalance = computed(() => {
  try {
    const balance = cardano.balance || 0
    return typeof balance === 'number' ? balance.toFixed(2) : '0.00'
  } catch {
    return '0.00'
  }
})

const networkColor = computed(() => {
  try {
    const network = cardano.network || ''
    switch (network.toLowerCase()) {
      case 'mainnet':
        return 'red'
      case 'testnet':
        return 'blue'
      case 'preview':
        return 'orange'
      case 'preprod':
        return 'purple'
      default:
        return 'grey'
    }
  } catch {
    return 'grey'
  }
})

const walletStatusColor = computed(() => {
  switch (walletStatus.value) {
    case 'online':
      return 'positive'
    case 'offline':
      return 'negative'
    case 'syncing':
      return 'warning'
    default:
      return 'grey'
  }
})

const walletStatusText = computed(() => {
  switch (walletStatus.value) {
    case 'online':
      return 'En ligne'
    case 'offline':
      return 'Hors ligne'
    case 'syncing':
      return 'Synchronisation'
    default:
      return 'Inconnu'
  }
})

// Computed properties pour l'utilisateur
const userName = computed(() => userData.value.name || 'Invité')
const userEmail = computed(() => userData.value.email || 'Non connecté')
const userRole = computed(() => userData.value.role || 'Visiteur')
const notificationCount = computed(() => userData.value.notifications || 0)
const hasNotifications = computed(() => notificationCount.value > 0)

const userInitials = computed(() => {
  if (!userName.value) return 'U'
  const names = userName.value.split(' ')
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : names[0][0].toUpperCase()
})

// Fonction pour récupérer les données utilisateur du localStorage
const loadUserData = () => {
  try {
    const userInfo = localStorage.getItem('user')
    const authToken = localStorage.getItem('token')

    if (userInfo && authToken) {
      const parsedUser = JSON.parse(userInfo)
      userData.value = {
        name: parsedUser.nom || parsedUser.name || 'Utilisateur',
        email: parsedUser.email || 'Email non spécifié',
        role: parsedUser.type
          ? parsedUser.type.charAt(0).toUpperCase() + parsedUser.type.slice(1)
          : 'Utilisateur',
        notifications: parsedUser.notifications || 0,
      }
    } else {
      userData.value = {
        name: 'Invité',
        email: 'Connectez-vous',
        role: 'Visiteur',
        notifications: 0,
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données utilisateur:', error)
    userData.value = {
      name: 'Erreur',
      email: 'Chargement impossible',
      role: 'Utilisateur',
      notifications: 0,
    }
  }
}

// Gestion du scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// Gestion du drawer
const toggleDrawer = () => {
  localDrawerOpen.value = !localDrawerOpen.value
}

const closeDrawer = () => {
  localDrawerOpen.value = false
}

// Menu utilisateur
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
  if (userMenuOpen.value) walletMenuOpen.value = false
}

const closeUserMenu = () => {
  userMenuOpen.value = false
}

// Menu wallet
const toggleWalletMenu = () => {
  walletMenuOpen.value = !walletMenuOpen.value
  if (walletMenuOpen.value) userMenuOpen.value = false
}

const closeWalletMenu = () => {
  walletMenuOpen.value = false
}

// Gestion du click outside pour fermer les menus
const handleClickOutside = (event) => {
  if (userMenuOpen.value) {
    const userMenu = document.querySelector('.user-dropdown')
    const userMenuTrigger = document.querySelector('.user-menu')

    if (
      userMenu &&
      userMenuTrigger &&
      !userMenu.contains(event.target) &&
      !userMenuTrigger.contains(event.target)
    ) {
      closeUserMenu()
    }
  }

  if (walletMenuOpen.value) {
    const walletMenu = document.querySelector('.wallet-dropdown')
    const walletTrigger = document.querySelector('.wallet-connected')

    if (
      walletMenu &&
      walletTrigger &&
      !walletMenu.contains(event.target) &&
      !walletTrigger.contains(event.target)
    ) {
      closeWalletMenu()
    }
  }
}

// Connexion au wallet
const connectWalletHandler = async () => {
  console.log('🎯 Connexion au wallet demandée depuis le header')

  if (!hasAvailableWallets.value) {
    $q.notify({
      message: 'Aucun wallet Cardano détecté. Veuillez installer Eternl.',
      color: 'warning',
      position: 'top',
    })
    return
  }

  try {
    await cardano.connectWallet()
    walletStatus.value = 'online'
    walletMenuOpen.value = true
  } catch (error) {
    console.error('❌ Erreur de connexion depuis header:', error)
    walletStatus.value = 'offline'
  }
}

// Déconnexion du wallet
const disconnectWallet = () => {
  try {
    cardano.disconnectWallet()
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
  walletMenuOpen.value = false
  userMenuOpen.value = false
  walletStatus.value = 'offline'

  $q.notify({
    message: 'Wallet déconnecté',
    color: 'info',
    position: 'top',
  })
}

// Rafraîchir le solde
const refreshBalance = async () => {
  walletStatus.value = 'syncing'
  try {
    await cardano.refreshBalance()
    walletStatus.value = 'online'
    $q.notify({
      message: 'Solde rafraîchi',
      color: 'positive',
      position: 'top',
      timeout: 1000,
    })
  } catch (error) {
    console.error('Erreur de rafraîchissement:', error)
    walletStatus.value = 'online'
  }
}


// Ouvrir dans l'explorer
const openInExplorer = () => {
  try {
    if (!safeWalletAddress.value) return

    const network = cardano.network || 'mainnet'
    const baseUrl =
      network === 'mainnet'
        ? 'https://cardanoscan.io/address/'
        : 'https://preprod.cardanoscan.io/address/'

    window.open(baseUrl + safeWalletAddress.value, '_blank')
    walletMenuOpen.value = false
  } catch (error) {
    console.error("Erreur lors de l'ouverture de l'explorer:", error)
  }
}

// Aller aux transactions
const goToTransactions = () => {
  router.push('/transactions')
  walletMenuOpen.value = false
  closeDrawer()
}

// Gestion des actions de parcelle
const toggleChat = () => {
  emit('toggle-chat')
}

const shareParcelle = () => {
  emit('share')

  if (navigator.share) {
    navigator
      .share({
        title: `Terrain ARDHI-CHAIN: ${props.parcelleName || 'Propriété blockchain'}`,
        text: 'Découvrez ce terrain sécurisé par la technologie blockchain Cardano sur ARDHI-CHAIN',
        url: window.location.href,
      })
      .catch(() => {
        copyToClipboard()
      })
  } else {
    copyToClipboard()
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(window.location.href)
  $q.notify({
    message: 'Lien copié dans le presse-papier',
    color: 'positive',
    position: 'top',
    timeout: 1000,
  })
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('toggle-favorite', isFavorite.value)

  $q.notify({
    message: isFavorite.value ? 'Ajouté aux favoris' : 'Retiré des favoris',
    color: isFavorite.value ? 'amber' : 'grey',
    position: 'top',
  })
}

const goBack = () => {
  closeDrawer()
  emit('go-back')
}

const printParcelle = () => {
  window.print()
  $q.notify({
    message: 'Impression démarrée',
    color: 'info',
    position: 'top',
  })
}

const showNotifications = () => {
  console.log('Afficher les notifications')
}

// Navigation
const goToHome = () => {
  router.push('/')
  closeDrawer()
}

const goToParcelles = () => {
  router.push('/parcelles')
  closeDrawer()
}

const goToProperties = () => {
  router.push('/properties')
  closeDrawer()
}

const goToDashboard = () => {
  router.push('/dashboard')
  closeDrawer()
}

const goToAddProperty = () => {
  router.push('/add-property')
  closeDrawer()
}

const goToProfile = () => {
  router.push('/profile')
  closeDrawer()
  closeUserMenu()
}

const goToWallet = () => {
  router.push('/wallet')
  closeDrawer()
  closeUserMenu()
}

const goToSettings = () => {
  router.push('/settings')
  closeDrawer()
  closeUserMenu()
}

const logout = () => {
  try {
    if (cardano.isConnected) {
      cardano.disconnectWallet()
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion du wallet:', error)
  }

  localStorage.removeItem('user')
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('authToken')

  router.push('/login')
  closeDrawer()

  $q.notify({
    message: 'Déconnexion réussie',
    color: 'positive',
    position: 'top',
  })
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', handleClickOutside)
  loadUserData()

  if (window.innerWidth < 768) {
    showWalletLabel.value = false
  }

  window.addEventListener('storage', (event) => {
    if (event.key === 'user' || event.key === 'token') {
      loadUserData()
    }
  })

  const checkWalletStatus = () => {
    if (cardano.isConnected) {
      walletStatus.value = 'online'
    }
  }

  setInterval(checkWalletStatus, 30000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('storage', loadUserData)
})
</script>

<style scoped>
/* Styles généraux */
.parcelle-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%);
  color: white;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.parcelle-header.scrolled {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Barre principale */
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  position: relative;
}

/* Logo */
.header-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.header-logo:hover {
  transform: translateY(-2px);
}

.logo-icon {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-primary {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #ffffff, #e0f7fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-secondary {
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
  letter-spacing: 2px;
}

/* Navigation desktop */
.header-nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-items {
  display: flex;
  gap: 32px;
  background: rgba(255, 255, 255, 0.08);
  padding: 8px 24px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.nav-item {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav-item:hover::after {
  width: 60%;
}

/* Zone utilisateur */
.header-user-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Intégration Cardano */
.cardano-integration {
  position: relative;
  margin-right: 10px;
}

.connect-wallet-btn {
  border-radius: 20px;
  padding: 6px 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
}

.connect-wallet-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(56, 142, 60, 0.3);
}

.connect-wallet-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.wallets-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 10px;
  min-width: 18px;
  height: 18px;
}

.wallet-error {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(244, 67, 54, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wallet-connected {
  position: relative;
  cursor: pointer;
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.wallet-info:hover {
  background: rgba(255, 255, 255, 0.2);
}

.wallet-address {
  font-size: 0.85rem;
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.balance-badge {
  font-size: 0.75rem;
  padding: 2px 6px;
}

.wallet-info .q-icon.rotated {
  transform: rotate(180deg);
}

/* Menu déroulant wallet */
.wallet-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1001;
  animation: dropdownSlide 0.3s ease;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 20px;
  background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 100%);
}

.wallet-details {
  display: flex;
  align-items: center;
  gap: 16px;
}

.wallet-text {
  flex: 1;
}

.wallet-name {
  font-weight: 600;
  color: #1b5e20;
  margin-bottom: 4px;
}

.wallet-network {
  font-size: 0.8rem;
}

/* Stats du wallet */
.wallet-stats {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 0 16px 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-text {
  flex: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 2px;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

.dropdown-content {
  padding: 16px;
}

/* Section adresse */
.wallet-address-full {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.address-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.address-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.85rem;
  word-break: break-all;
  padding: 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  max-height: 80px;
  overflow-y: auto;
}

.copy-btn {
  padding: 2px;
  min-height: 24px;
  min-width: 24px;
}

/* Actions wallet */
.wallet-actions {
  margin-bottom: 16px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.action-btn {
  justify-content: flex-start;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: left;
}

.action-btn:hover {
  background: #f0f9f0;
}

.logout-btn {
  justify-content: flex-start;
  padding: 10px 12px;
  border-radius: 8px;
  margin-top: 8px;
  width: 100%;
}

.logout-btn:hover {
  background: #ffebee;
}

/* Bouton ajouter bien */
.add-property-btn {
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
  transition: all 0.3s ease;
}

.add-property-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
}

/* Notification indicator */
.notification-indicator {
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.notification-indicator:hover {
  background: rgba(255, 255, 255, 0.1);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #f44336;
  color: white;
  font-size: 0.7rem;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  animation: pulse 2s infinite;
}

/* Menu utilisateur */
.user-menu {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-arrow {
  transition: transform 0.3s ease;
}

.user-arrow.rotated {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 280px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1000;
  animation: dropdownSlide 0.3s ease;
}

.user-info {
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
}

.user-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-email {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-bottom: 8px;
}

.user-role {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 0.8rem;
}

.user-wallet-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 8px;
  margin-top: 8px;
}

.dropdown-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 8px 0;
}

.dropdown-items {
  padding: 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #1b5e20;
  transform: translateX(4px);
}

.dropdown-item span {
  flex: 1;
}

.logout-item {
  color: #f44336;
}

.logout-item:hover {
  background: #ffebee;
  color: #d32f2f;
}

.menu-toggle {
  display: none;
}

/* Barre d'actions parcelle */
.parcelle-actions-bar {
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 0;
  backdrop-filter: blur(10px);
}

.actions-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-4px);
}

.parcelle-title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.parcelle-icon {
  background: rgba(255, 255, 255, 0.15);
  padding: 12px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.parcelle-title {
  display: flex;
  flex-direction: column;
}

.title-main {
  font-size: 0.9rem;
  opacity: 0.9;
  letter-spacing: 1px;
}

.title-sub {
  font-size: 1.1rem;
  font-weight: 600;
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  position: relative;
  padding: 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.chat-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 6px rgba(244, 67, 54, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
}

/* Menu latéral */
.parcelle-menu {
  background: white !important;
}

.menu-header {
  padding: 24px;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
}

.menu-logo-icon {
  background: white;
  padding: 12px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-user-info {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.user-name-large {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-email-small {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
}

.menu-scroll {
  height: calc(100vh - 400px);
}

.menu-nav {
  padding: 16px;
}

.menu-section-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 24px 0 12px 12px;
}

.menu-item {
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: #f0f9f0;
  transform: translateX(4px);
}

.menu-item.active-wallet {
  background: #e8f5e9;
  border-left: 4px solid #4caf50;
}

.menu-item-label {
  font-weight: 500;
  color: #333;
}

.menu-item-desc {
  font-size: 0.8rem;
  color: #888;
  margin-top: 2px;
}

.logout-menu-item:hover {
  background: #ffebee;
}

.menu-footer {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.menu-footer-text {
  margin-bottom: 12px;
}

.menu-footer-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* Menu latéral - Section Wallet */
.menu-wallet-section {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.wallet-menu-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.wallet-menu-title {
  font-weight: 600;
  color: #333;
}

.wallet-menu-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wallet-menu-details {
  flex: 1;
}

.wallet-menu-name {
  font-weight: 500;
  color: #1b5e20;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.wallet-menu-address {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 4px;
}

.wallet-menu-balance {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: #333;
}

.wallet-menu-disconnect {
  margin-left: 10px;
}

.wallet-menu-connect {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.available-wallets-hint {
  font-size: 0.75rem;
  color: #666;
  text-align: center;
}

.wallet-menu-actions {
  margin-top: 12px;
}

.menu-wallet-status {
  margin-top: 16px;
}

.wallet-status-card {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #c8e6c9;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-nav {
    display: none;
  }

  .menu-toggle {
    display: block;
  }

  .header-user-section {
    gap: 12px;
  }

  .add-property-btn .q-btn__content span {
    display: none;
  }

  .add-property-btn {
    min-width: 40px;
    padding: 8px;
  }

  .connect-wallet-btn .q-btn__content span {
    display: none;
  }

  .connect-wallet-btn {
    min-width: 40px;
    padding: 8px;
  }

  .wallet-address {
    max-width: 80px;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }

  .logo-text {
    display: none;
  }

  .parcelle-title .title-sub {
    max-width: 200px;
  }

  .quick-actions {
    gap: 4px;
  }

  .user-dropdown {
    width: 250px;
    right: -20px;
  }

  .wallet-dropdown {
    width: 280px;
    right: -10px;
  }
}

@media (max-width: 480px) {
  .header-bar {
    padding: 12px 0;
  }

  .notification-indicator,
  .user-menu {
    display: none;
  }

  .parcelle-title-section {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .parcelle-icon {
    padding: 8px;
  }

  .title-sub {
    max-width: 150px;
    font-size: 1rem;
  }

  .wallet-address {
    display: none;
  }

  .wallet-info {
    padding: 6px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .user-dropdown,
  .wallet-dropdown {
    background: #2d2d2d;
    color: white;
  }

  .dropdown-item,
  .action-btn,
  .logout-btn {
    color: white;
  }

  .dropdown-item:hover,
  .action-btn:hover {
    background: #3d3d3d;
    color: #4caf50;
  }

  .logout-item:hover,
  .logout-btn:hover {
    background: #3d1c1c;
  }

  .wallet-address-full {
    background: #3d3d3d;
  }

  .address-label {
    color: #aaa;
  }

  .wallet-stats {
    background: #3d3d3d;
  }

  .stat-label {
    color: #aaa;
  }

  .stat-value {
    color: white;
  }
}
</style>