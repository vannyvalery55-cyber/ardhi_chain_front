<template>
  <header class="parcelle-header" :class="{ 'scrolled': isScrolled }">
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
              <q-icon name="expand_more" size="16px" class="user-arrow" :class="{ 'rotated': userMenuOpen }" />
            </div>

            <!-- Dropdown menu utilisateur -->
            <div v-if="userMenuOpen" class="user-dropdown" v-click-outside="closeUserMenu">
              <div class="user-info">
                <q-avatar size="48px" color="green-8" text-color="white" class="q-mb-sm">
                  {{ userInitials }}
                </q-avatar>
                <div class="user-name">{{ userName }}</div>
                <div class="user-email">{{ userEmail }}</div>
                <div class="user-role">{{ userRole }}</div>
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
          <q-btn
            flat
            icon="arrow_back"
            color="white"
            size="sm"
            class="back-btn"
            @click="goBack"
          >
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
              <q-tooltip>{{ isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}</q-tooltip>
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

          <q-item clickable v-ripple to="/wallet" @click="closeDrawer" class="menu-item">
            <q-item-section avatar>
              <q-icon name="account_balance_wallet" color="amber-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <div class="menu-item-label">Portefeuille numérique</div>
              <div class="menu-item-desc">Gérez vos actifs blockchain</div>
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
        </div>
        <div class="menu-footer-actions">
          <q-btn flat dense icon="security" color="green-7" size="sm">
            <q-tooltip>Sécurité certifiée</q-tooltip>
          </q-btn>
          <q-btn flat dense icon="language" color="grey-6" size="sm">
            <q-tooltip>Changer la langue</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-drawer>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  parcelleName: String,
  showChat: Boolean,
  unreadMessages: {
    type: Number,
    default: 0
  }
})

const router = useRouter()
const emit = defineEmits(['toggle-chat', 'share', 'toggle-favorite', 'go-back'])

// États locaux
const localDrawerOpen = ref(false)
const isFavorite = ref(false)
const userMenuOpen = ref(false)
const isScrolled = ref(false)

// Données utilisateur - récupérées du localStorage
const userData = ref({
  name: '',
  email: '',
  role: '',
  notifications: 0
})

// Fonction pour récupérer les données utilisateur du localStorage
const loadUserData = () => {
  try {
    // Récupérer les données depuis localStorage avec vos clés exactes
    const userInfo = localStorage.getItem('user')
    const authToken = localStorage.getItem('token')

    console.log('🔍 Chargement depuis localStorage:')
    console.log('User:', userInfo)
    console.log('Token présent:', !!authToken)

    if (userInfo && authToken) {
      const parsedUser = JSON.parse(userInfo)
      console.log('Données utilisateur parsées:', parsedUser)

      userData.value = {
        name: parsedUser.nom || parsedUser.name || 'Utilisateur',
        email: parsedUser.email || 'Email non spécifié',
        role: parsedUser.type ?
          (parsedUser.type.charAt(0).toUpperCase() + parsedUser.type.slice(1)) :
          'Utilisateur',
        notifications: parsedUser.notifications || 0
      }

      console.log('Données chargées pour header:', userData.value)
    } else {
      console.log('⚠️ Aucune donnée utilisateur complète trouvée dans localStorage')
      console.log('Clés disponibles:', Object.keys(localStorage))

      userData.value = {
        name: 'Invité',
        email: 'Connectez-vous',
        role: 'Visiteur',
        notifications: 0
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des données utilisateur:', error)
    userData.value = {
      name: 'Erreur',
      email: 'Chargement impossible',
      role: 'Utilisateur',
      notifications: 0
    }
  }
}
// Computed properties
const userName = computed(() => userData.value.name)
const userEmail = computed(() => userData.value.email)
const userRole = computed(() => userData.value.role)
const notificationCount = computed(() => userData.value.notifications)
const hasNotifications = computed(() => notificationCount.value > 0)

const userInitials = computed(() => {
  if (!userName.value) return 'U'
  const names = userName.value.split(' ')
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : names[0][0].toUpperCase()
})

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
}

const closeUserMenu = () => {
  userMenuOpen.value = false
}

// Gestion des actions
const toggleChat = () => {
  emit('toggle-chat')
}

const shareParcelle = () => {
  emit('share')

  if (navigator.share) {
    navigator.share({
      title: `Terrain ARDHI-CHAIN: ${props.parcelleName || 'Propriété blockchain'}`,
      text: 'Découvrez ce terrain sécurisé par la technologie blockchain Cardano sur ARDHI-CHAIN',
      url: window.location.href,
    }).catch(() => {
      // Fallback si l'utilisateur annule
      copyToClipboard()
    })
  } else {
    copyToClipboard()
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(window.location.href)
  // Vous pourriez ajouter une notification ici
  showNotification('Lien copié dans le presse-papier', 'positive')
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('toggle-favorite', isFavorite.value)

  // Animation feedback
  const favoriteBtn = document.querySelector('.action-btn:nth-child(2)')
  if (favoriteBtn) {
    favoriteBtn.classList.add('favorite-animation')
    setTimeout(() => {
      favoriteBtn.classList.remove('favorite-animation')
    }, 600)
  }

  // Notification
  showNotification(
    isFavorite.value ? 'Ajouté aux favoris' : 'Retiré des favoris',
    isFavorite.value ? 'amber' : 'grey'
  )
}

const goBack = () => {
  closeDrawer()
  emit('go-back')
}

const printParcelle = () => {
  window.print()
  showNotification('Impression démarrée', 'info')
}

const showNotifications = () => {
  // Implémentez la logique de notification
  console.log('Afficher les notifications')
  // Vous pourriez ouvrir un popup ou rediriger vers une page de notifications
}

const showNotification = (message, color = 'info') => {
  // Implémentez votre système de notification ici
  console.log(`Notification [${color}]: ${message}`)
  // Exemple avec Quasar Notify:
  // import { useQuasar } from 'quasar'
  // const $q = useQuasar()
  // $q.notify({ message, color, position: 'top' })
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
  // Implémentez la logique de déconnexion
  // 1. Effacer le localStorage
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
  localStorage.removeItem('authToken')

  // 2. Effacer les autres données utilisateur si nécessaire
  // localStorage.removeItem('userPreferences')
  // localStorage.removeItem('favorites')

  // 3. Rediriger vers la page de connexion
  router.push('/login')
  closeDrawer()

  // 4. Notification de déconnexion
  showNotification('Déconnexion réussie', 'positive')
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Charger les données utilisateur au montage
  loadUserData()

  // Écouter les changements de localStorage (si d'autres composants modifient les données)
  window.addEventListener('storage', (event) => {
    if (event.key === 'userInfo') {
      loadUserData()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('storage', loadUserData)
})
</script>

<style scoped>
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

/* Animation favori */
.favorite-animation .q-icon {
  animation: favoritePop 0.6s ease;
}

@keyframes favoritePop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* Menu latéral premium */
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
  height: calc(100vh - 300px);
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
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }

  .logo-text {
    display: none;
  }

  .header-actions {
    gap: 4px;
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
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .user-dropdown {
    background: #2d2d2d;
    color: white;
  }

  .dropdown-item {
    color: white;
  }

  .dropdown-item:hover {
    background: #3d3d3d;
    color: #4caf50;
  }

  .logout-item:hover {
    background: #3d1c1c;
  }
}
</style>
