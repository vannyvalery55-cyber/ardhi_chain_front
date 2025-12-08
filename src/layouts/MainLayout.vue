<template>
  <q-layout view="lHh Lpr lFf">

    <!-- Header avec animation au scroll -->
    <q-header
      elevated
      class="bg-deep-purple-9 animated-header"
      :class="{
        'header-visible': headerVisible,
        'header-hidden': !headerVisible,
        'header-scrolled': isScrolled
      }"
    >
      <q-toolbar class="q-py-md custom-toolbar">

        <!-- Logo/Titre avec effet amélioré -->
        <div class="row items-center no-wrap">
          <q-icon
            name="account_balance"
            size="md"
            class="q-mr-sm text-white logo-icon"
            color="amber-4"
          />
          <q-toolbar-title
            class="cursor-pointer text-weight-bold text-h5"
            @click="$router.push({ name: 'home' })"
          >
            <span class="logo-text">
              ARDHI<span class="text-amber-4">_</span>CHAIN
            </span>
            <q-badge
              rounded
              color="amber-6"
              class="q-ml-sm text-caption"
              label="Beta"
            />
          </q-toolbar-title>
        </div>

        <q-space />

        <!-- Navigation améliorée -->
        <div class="row items-center no-wrap q-gutter-md">
          <q-btn
            flat
            label="Accueil"
            :to="{ name: 'home' }"
            icon="home"
            class="nav-btn"
            exact
          />

          <q-btn
            flat
            label="Ajouter Bien"
            :to="{ name: 'login' }"
            icon="add_circle"
            class="nav-btn"
          />

          <q-separator vertical inset spaced color="white" class="q-my-xs" />

          <q-btn
            flat
            label="Mon Compte"
            :to="{ name: 'login' }"
            icon="person"
            class="nav-btn"
          >
            <q-badge
              v-if="false"
              floating
              color="red"
              rounded
            />
          </q-btn>

          <!-- Bouton notifications -->
          <q-btn
            round
            flat
            icon="notifications"
            class="q-ml-sm"
          >
            <q-badge
              v-if="false"
              color="red"
              floating
              rounded
              label="3"
            />
          </q-btn>
        </div>

      </q-toolbar>

      <!-- Barre inférieure décorative optionnelle -->
      <div class="header-accent bg-amber-4"></div>

      <!-- Bouton pour réafficher le header (visible quand header caché) -->
      <q-btn
        v-if="!headerVisible && isScrolled"
        round
        color="amber-6"
        icon="keyboard_arrow_up"
        class="show-header-btn"
        @click="showHeader"
      />
    </q-header>

    <!-- Page Container -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Bouton retour en haut -->
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        icon="keyboard_arrow_up"
        color="deep-purple-9"
      />
    </q-page-scroller>

  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// États pour gérer la visibilité du header
const headerVisible = ref(true)
const isScrolled = ref(false)
const lastScrollPosition = ref(0)
const scrollThreshold = 100 // Seuil de scroll avant de cacher le header

// Fonction pour gérer le scroll
const handleScroll = () => {
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop

  // Vérifier si on est suffisamment scrollé pour activer les animations
  isScrolled.value = currentScrollPosition > 50

  // Logique pour cacher/afficher le header
  if (currentScrollPosition < scrollThreshold) {
    // Si on est en haut de page, toujours montrer le header
    headerVisible.value = true
  } else if (currentScrollPosition > lastScrollPosition.value) {
    // Scroll vers le bas -> cacher le header
    headerVisible.value = false
  } else {
    // Scroll vers le haut -> montrer le header
    headerVisible.value = true
  }

  // Mettre à jour la dernière position de scroll
  lastScrollPosition.value = currentScrollPosition
}

// Fonction pour forcer l'affichage du header (au clic sur le bouton)
const showHeader = () => {
  headerVisible.value = true
  // Optionnel: scroll doux vers le haut
  window.scrollTo({
    top: Math.max(0, window.pageYOffset - 200),
    behavior: 'smooth'
  })
}

// Gestionnaire d'événements de la souris (optionnel: afficher le header au hover)
let mouseTimeout = null
const handleMouseMove = (e) => {
  // Si la souris est près du haut de l'écran, montrer le header
  if (e.clientY < 100 && isScrolled.value) {
    headerVisible.value = true

    // Cacher à nouveau après un délai si l'utilisateur ne reste pas
    clearTimeout(mouseTimeout)
    mouseTimeout = setTimeout(() => {
      if (window.pageYOffset > scrollThreshold) {
        headerVisible.value = false
      }
    }, 2000) // 2 secondes de délai
  }
}

// Initialisation
onMounted(() => {
  // Ajouter les écouteurs d'événements
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('mousemove', handleMouseMove, { passive: true })

  // Initialiser l'état du scroll
  handleScroll()
})

// Nettoyage
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('mousemove', handleMouseMove)
  if (mouseTimeout) clearTimeout(mouseTimeout)
})
</script>

<style scoped>
/* Styles de base pour le header */
.animated-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  opacity: 1;
}

/* Header visible (état normal) */
.header-visible {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

/* Header caché (scroll vers le bas) */
.header-hidden {
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* Header quand on a scrollé */
.header-scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background: rgba(40, 0, 80, 0.95) !important;
  backdrop-filter: blur(10px);
}

/* Bouton pour réafficher le header */
.show-header-btn {
  position: absolute !important;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  animation: pulse 2s infinite;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

/* Styles pour le header */
.custom-toolbar {
  min-height: 80px !important;
  height: 80px;
  transition: min-height 0.3s ease;
}

.header-scrolled .custom-toolbar {
  min-height: 70px !important;
  height: 70px;
}

/* Effet sur le logo */
.logo-text {
  background: linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
  font-family: 'Roboto', sans-serif;
  transition: all 0.3s ease;
}

.header-scrolled .logo-text {
  font-size: 1.1rem;
}

/* Boutons de navigation améliorés */
.nav-btn {
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  font-weight: 500;
  opacity: 1;
}

.header-hidden .nav-btn {
  opacity: 0;
  transform: translateY(-10px);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.nav-btn.q-router-link--exact-active {
  background: rgba(255, 193, 7, 0.2);
  border-left: 3px solid #FFC107;
  animation: activeGlow 2s infinite alternate;
}

/* Barre d'accentuation du header */
.header-accent {
  height: 4px;
  width: 100%;
  background: linear-gradient(90deg, #FFC107 0%, #FF9800 100%);
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.header-hidden .header-accent {
  transform: scaleX(0);
}

/* Effet de surbrillance sur le titre */
.q-toolbar-title:hover .logo-text {
  background: linear-gradient(90deg, #FFC107 0%, #FF9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background 0.3s ease;
}

/* Animation sur les badges */
.q-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
}

@keyframes activeGlow {
  from {
    box-shadow: 0 0 5px rgba(255, 193, 7, 0.5);
  }
  to {
    box-shadow: 0 0 15px rgba(255, 193, 7, 0.8);
  }
}

/* Animation d'apparition du header */
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Ajustement du contenu principal pour compenser le header fixe */
.q-page-container {
  padding-top: 80px;
  transition: padding-top 0.3s ease;
}

.header-scrolled + .q-page-container {
  padding-top: 70px;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-toolbar {
    min-height: 70px !important;
    height: 70px;
  }

  .header-scrolled .custom-toolbar {
    min-height: 60px !important;
    height: 60px;
  }

  .q-page-container {
    padding-top: 70px;
  }

  .header-scrolled + .q-page-container {
    padding-top: 60px;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .header-scrolled .logo-text {
    font-size: 1rem;
  }

  .nav-btn {
    padding: 6px 12px;
    font-size: 0.875rem;
  }
}

@media (max-width: 600px) {
  .nav-btn .q-btn__content {
    flex-direction: column;
  }

  .nav-btn .q-icon {
    margin-bottom: 4px;
  }

  /* Cacher le texte des boutons sur mobile quand header réduit */
  .header-scrolled .nav-btn .q-btn__content span:not(.q-icon) {
    display: none;
  }
}

/* Support pour le mode sombre */
.body--dark .header-scrolled {
  background: rgba(30, 0, 60, 0.95) !important;
}
</style>
