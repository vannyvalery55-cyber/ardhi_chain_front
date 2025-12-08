<template>
  <header class="parcelle-header">
    <!-- Barre d'en-tête principale -->
    <div class="header-bar">
      <!-- Bouton menu -->
      <q-btn flat round icon="menu" color="white" size="md" @click="toggleDrawer">
        <q-tooltip>Menu</q-tooltip>
      </q-btn>

      <!-- Titre principal -->
      <div class="header-center">
        <div class="header-title">
          <q-icon name="landscape" size="20px" class="q-mr-sm" />
          <span>Détails Terrain</span>
        </div>
        <div v-if="parcelleName" class="parcelle-name">
          {{ parcelleName }}
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="header-actions">
        <q-btn flat round icon="share" color="white" size="md" @click="shareParcelle">
          <q-tooltip>Partager</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          :icon="isFavorite ? 'favorite' : 'favorite_border'"
          :color="isFavorite ? 'amber' : 'white'"
          size="md"
          @click="toggleFavorite"
        >
          <q-tooltip>{{ isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}</q-tooltip>
        </q-btn>

        <q-btn flat round icon="chat" color="white" size="md" @click="toggleChat">
          <q-tooltip>Chat avec propriétaire</q-tooltip>
          <q-badge v-if="unreadMessages > 0" color="red" floating rounded>
            {{ unreadMessages > 9 ? '9+' : unreadMessages }}
          </q-badge>
        </q-btn>
      </div>
    </div>

    <!-- Menu latéral -->
    <q-drawer
      v-model="localDrawerOpen"
      bordered
      side="left"
      :width="280"
      :breakpoint="768"
      class="parcelle-menu"
      @hide="closeDrawer"
    >
      <!-- En-tête du menu -->
      <div class="menu-header">
        <div class="menu-logo">
          <q-icon name="account_balance" size="32px" color="green-7" />
          <div class="menu-title">
            <div class="text-weight-bold">ARDHI-CHAIN</div>
            <div class="text-caption text-grey-7">Sécurité Foncière</div>
          </div>
        </div>
        <q-btn flat round icon="close" size="sm" @click="closeDrawer" />
      </div>

      <!-- Navigation -->
      <q-scroll-area class="menu-scroll">
        <q-list class="menu-nav">
          <q-item clickable v-ripple to="/" @click="closeDrawer">
            <q-item-section avatar>
              <q-icon name="home" color="green-7" />
            </q-item-section>
            <q-item-section>Accueil</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/parcelles" @click="closeDrawer">
            <q-item-section avatar>
              <q-icon name="landscape" color="green-7" />
            </q-item-section>
            <q-item-section>Terrains</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/properties" @click="closeDrawer">
            <q-item-section avatar>
              <q-icon name="house" color="green-7" />
            </q-item-section>
            <q-item-section>Maisons</q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple to="/add-property" @click="closeDrawer">
            <q-item-section avatar>
              <q-icon name="add_circle" color="positive" />
            </q-item-section>
            <q-item-section class="text-positive">Ajouter un bien</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/wallet" @click="closeDrawer">
            <q-item-section avatar>
              <q-icon name="account_balance_wallet" color="amber-7" />
            </q-item-section>
            <q-item-section>Mon portefeuille</q-item-section>
          </q-item>

          <q-separator />

          <div class="auth-section">
            <q-item clickable v-ripple to="/login" @click="closeDrawer">
              <q-item-section avatar>
                <q-icon name="login" color="blue-7" />
              </q-item-section>
              <q-item-section>Se Deconnecter</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/register" @click="closeDrawer">
              <q-item-section avatar>
                <q-icon name="person_add" color="blue-7" />
              </q-item-section>
              <q-item-section>Paramétres</q-item-section>
            </q-item>
          </div>

          <!-- Retour -->
          <q-item clickable v-ripple @click="goBack" class="back-item">
            <q-item-section avatar>
              <q-icon name="arrow_back" color="grey-7" />
            </q-item-section>
            <q-item-section>
              <div class="text-weight-medium">Retour aux terrains</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  parcelleName: String,
  showChat: Boolean,
  unreadMessages: Number,
})

const emit = defineEmits(['toggle-chat', 'share', 'toggle-favorite', 'go-back'])

// État local
const localDrawerOpen = ref(false)
const isFavorite = ref(false)

// Gestion du drawer
const toggleDrawer = () => {
  localDrawerOpen.value = !localDrawerOpen.value
}

const closeDrawer = () => {
  localDrawerOpen.value = false
}

// Gestion des actions
const toggleChat = () => {
  emit('toggle-chat')
}

const shareParcelle = () => {
  emit('share')

  if (navigator.share) {
    navigator.share({
      title: `Terrain: ${props.parcelleName || 'ARDHI-CHAIN'}`,
      text: 'Découvrez ce terrain sécurisé par blockchain',
      url: window.location.href,
    })
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('toggle-favorite', isFavorite.value)
}

const goBack = () => {
  closeDrawer()
  emit('go-back')
}

// Fermer le drawer quand on clique sur un lien
// const handleNavClick = () => {
//   closeDrawer()
// }
</script>

<style scoped>
.parcelle-header {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: rgb(27, 24, 24);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Barre d'en-tête */
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 0 16px;
}

.header-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.parcelle-name {
  font-size: 0.85rem;
  opacity: 0.9;
  max-width: 300px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* Menu latéral */
.parcelle-menu {
  background: white;
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
}

.menu-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-title {
  line-height: 1.2;
}

.menu-scroll {
  height: calc(100vh - 100px);
}

.menu-nav {
  padding: 8px;
}

.menu-nav .q-item {
  border-radius: 8px;
  margin-bottom: 4px;
  transition: background-color 0.2s ease;
}

.menu-nav .q-item:hover {
  background: rgba(46, 125, 50, 0.08);
}

.auth-section {
  padding: 8px 0;
}

.back-item {
  margin-top: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .header-bar {
    padding: 10px 12px;
  }

  .header-center {
    margin: 0 8px;
  }

  .parcelle-name {
    max-width: 200px;
    font-size: 0.8rem;
  }

  .header-actions {
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .header-title span {
    font-size: 0.9rem;
  }

  .parcelle-name {
    max-width: 150px;
  }
}
</style>
