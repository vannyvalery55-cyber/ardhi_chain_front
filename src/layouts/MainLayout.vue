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

        <!-- Logo/Titre professionnel -->
        <div class="row items-center no-wrap logo-container">
          <div class="logo-icon-wrapper">
            <q-icon
              name="account_balance"
              size="md"
              class="text-white"
              color="amber-4"
            />
          </div>
          <q-toolbar-title
            class="cursor-pointer text-weight-bold main-logo"
            @click="$router.push({ name: 'home' })"
          >
            <div class="logo-content">
              <span class="logo-text">
                ARDHI<span class="text-amber-4">_</span>CHAIN
              </span>
              <q-badge
                rounded
                color="amber-6"
                class="q-ml-xs text-caption beta-badge"
                label="Beta"
              />
            </div>
            <div class="logo-subtitle text-caption text-white">
              Sécurité Foncière Blockchain
            </div>
          </q-toolbar-title>
        </div>

        <q-space />

        <!-- Navigation desktop - Élégante et professionnelle -->
        <div class="row items-center no-wrap q-gutter-md desktop-nav">
          <q-btn
            flat
            label="Accueil"
            :to="{ name: 'home' }"
            icon="home"
            class="nav-btn desktop-nav-btn"
            exact
          />

          <q-btn
            flat
            label="Ajouter Bien"
            :to="{ name: 'login' }"
            icon="add_circle"
            class="nav-btn desktop-nav-btn"
          />

          <q-separator vertical inset spaced color="rgba(255,255,255,0.3)" class="nav-separator" />

          <q-btn
            flat
            label="Mon Compte"
            :to="{ name: 'login' }"
            icon="person"
            class="nav-btn desktop-nav-btn account-btn"
          >
            <q-badge
              v-if="false"
              floating
              color="red"
              rounded
            />
          </q-btn>

          <!-- Bouton notifications élégant -->
          <q-btn
            round
            flat
            icon="notifications"
            class="notification-btn"
            size="md"
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

        <!-- Bouton menu mobile - SIMPLIFIÉ -->
        <q-btn
          flat
          round
          dense
          :icon="mobileMenuOpen ? 'close' : 'menu'"
          class="mobile-menu-btn"
          size="lg"
          @click="toggleMobileMenu"
          aria-label="Menu mobile"
        />

      </q-toolbar>

      <!-- Barre inférieure décorative -->
      <div class="header-accent bg-gradient-amber"></div>

      <!-- Bouton pour réafficher le header -->
      <q-btn
        v-if="!headerVisible && isScrolled"
        round
        color="amber-6"
        icon="keyboard_arrow_up"
        class="show-header-btn"
        size="md"
        @click="showHeader"
      />
    </q-header>

    <!-- Menu mobile - VERSION SIMPLIFIÉE ET FONCTIONNELLE -->
    <div v-if="mobileMenuOpen" class="mobile-menu-simple">
      <div class="mobile-menu-header">
        <div class="row items-center justify-between q-pa-md">
          <div class="mobile-logo">
            <q-icon name="account_balance" size="md" color="amber-4" />
            <span class="text-h6 text-white q-ml-sm">ARDHI_CHAIN</span>
          </div>
          <q-btn 
            flat 
            round 
            dense 
            icon="close" 
            color="white" 
            @click="mobileMenuOpen = false"
            size="lg"
          />
        </div>
        <div class="text-caption text-grey-4 q-px-md q-pb-md">Navigation</div>
      </div>
      
      <q-list class="mobile-menu-list">
        <q-item
          clickable
          :to="{ name: 'home' }"
          exact
          class="mobile-menu-item"
          active-class="mobile-menu-item-active"
          @click="mobileMenuOpen = false"
        >
          <q-item-section avatar class="mobile-menu-icon">
            <q-icon name="home" color="amber-4" size="md" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium mobile-menu-label">Accueil</q-item-label>
            <q-item-label caption class="mobile-menu-caption">Page principale</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'login' }"
          class="mobile-menu-item"
          @click="mobileMenuOpen = false"
        >
          <q-item-section avatar class="mobile-menu-icon">
            <q-icon name="add_circle" color="amber-4" size="md" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium mobile-menu-label">Ajouter un bien</q-item-label>
            <q-item-label caption class="mobile-menu-caption">Immobilier ou terrain</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'login' }"
          class="mobile-menu-item"
          @click="mobileMenuOpen = false"
        >
          <q-item-section avatar class="mobile-menu-icon">
            <q-icon name="person" color="amber-4" size="md" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium mobile-menu-label">Mon Compte</q-item-label>
            <q-item-label caption class="mobile-menu-caption">Gérer votre profil</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'login' }"
          class="mobile-menu-item"
          @click="mobileMenuOpen = false"
        >
          <q-item-section avatar class="mobile-menu-icon">
            <q-icon name="notifications" color="amber-4" size="md" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium mobile-menu-label">Notifications</q-item-label>
            <q-item-label caption class="mobile-menu-caption">Alertes et messages</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>

        <q-separator class="mobile-menu-separator" />

        <div class="mobile-menu-section-title">Explorez</div>
        
        <q-item
          clickable
          :to="{ name: 'properties' }"
          class="mobile-menu-item secondary"
          @click="mobileMenuOpen = false"
        >
          <q-item-section avatar class="mobile-menu-icon">
            <q-icon name="house" color="deep-purple-4" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Biens immobiliers</q-item-label>
            <q-item-label caption>Maisons et appartements</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'login' }"
          class="mobile-menu-item secondary"
          @click="mobileMenuOpen = false"
        >
          <q-item-section avatar class="mobile-menu-icon">
            <q-icon name="landscape" color="green-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Terrains & Parcelles</q-item-label>
            <q-item-label caption>Propriétés foncières</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'login' }"
          class="mobile-menu-item secondary"
          @click="mobileMenuOpen = false"
        >
          <q-item-section avatar class="mobile-menu-icon">
            <q-icon name="map" color="blue-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Carte Interactive</q-item-label>
            <q-item-label caption>Visualisation géographique</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="mobile-menu-footer">
        <div class="text-caption text-grey-4 text-center q-mb-sm">© 2024 ARDHI-CHAIN</div>
        <div class="row justify-center q-gutter-sm">
          <q-btn flat round dense icon="help" size="sm" color="grey-5" />
          <q-btn flat round dense icon="info" size="sm" color="grey-5" />
          <q-btn flat round dense icon="settings" size="sm" color="grey-5" />
        </div>
      </div>
    </div>

    <!-- Overlay pour fermer le menu mobile -->
    <div
      v-if="mobileMenuOpen"
      class="mobile-menu-overlay"
      @click="mobileMenuOpen = false"
    ></div>

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
        size="md"
        class="back-to-top-btn"
      />
    </q-page-scroller>

  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// États pour gérer la visibilité du header
const headerVisible = ref(true)
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const lastScrollPosition = ref(0)
const scrollThreshold = 100

const route = useRoute()

// Fonction pour gérer le scroll
const handleScroll = () => {
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop

  // Vérifier si on est suffisamment scrollé pour activer les animations
  isScrolled.value = currentScrollPosition > 50

  // Logique pour cacher/afficher le header
  if (currentScrollPosition < scrollThreshold) {
    headerVisible.value = true
  } else if (currentScrollPosition > lastScrollPosition.value) {
    // Scroll vers le bas -> cacher le header
    headerVisible.value = false
    mobileMenuOpen.value = false // Fermer le menu mobile si ouvert
  } else {
    // Scroll vers le haut -> montrer le header
    headerVisible.value = true
  }

  // Mettre à jour la dernière position de scroll
  lastScrollPosition.value = currentScrollPosition
}

// Fonction pour forcer l'affichage du header
const showHeader = () => {
  headerVisible.value = true
  window.scrollTo({
    top: Math.max(0, window.pageYOffset - 200),
    behavior: 'smooth'
  })
}

// Gestion du menu mobile - SIMPLIFIÉE
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  updateBodyScroll()
}

const updateBodyScroll = () => {
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Fermer le menu au changement de route
watch(() => route.path, () => {
  mobileMenuOpen.value = false
  updateBodyScroll()
})

// Gérer la touche Escape
const handleEscapeKey = (e) => {
  if (e.key === 'Escape' && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
    updateBodyScroll()
  }
}

// Initialisation
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleEscapeKey)
  handleScroll()
})

// Nettoyage
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ============ HEADER PRINCIPAL ============ */
.animated-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  opacity: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* États du header */
.header-visible {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.header-hidden {
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.header-scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background: rgba(40, 0, 80, 0.95) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* ============ TOOLBAR ============ */
.custom-toolbar {
  min-height: 80px !important;
  height: 80px;
  padding: 0 24px;
  transition: all 0.3s ease;
}

.header-scrolled .custom-toolbar {
  min-height: 70px !important;
  height: 70px;
}

/* ============ LOGO PROFESSIONNEL ============ */
.logo-container {
  min-width: 220px;
}

.logo-icon-wrapper {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.logo-icon-wrapper:hover {
  background: rgba(255, 193, 7, 0.2);
  transform: scale(1.05);
}

.main-logo {
  font-size: 1.3rem;
  overflow: visible;
}

.logo-content {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.logo-text {
  background: linear-gradient(90deg, #ffffff 0%, #FFD54F 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  font-weight: 700;
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 1.4rem;
}

.logo-subtitle {
  opacity: 0.8;
  font-size: 0.75rem;
  letter-spacing: 0.3px;
}

.beta-badge {
  font-size: 0.7rem;
  padding: 3px 8px;
  margin-left: 8px;
}

/* ============ NAVIGATION DESKTOP ============ */
.desktop-nav {
  display: flex;
}

.desktop-nav-btn {
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.desktop-nav-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.desktop-nav-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 3px;
  background: #FFC107;
  border-radius: 3px;
  transition: transform 0.3s ease;
}

.desktop-nav-btn.q-router-link--exact-active::after {
  transform: translateX(-50%) scaleX(1);
}

.nav-separator {
  height: 32px;
  margin: 0 8px;
}

.account-btn {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.notification-btn {
  margin-left: 8px;
  transition: all 0.3s ease;
}

.notification-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

/* ============ BOUTON MENU MOBILE ============ */
.mobile-menu-btn {
  display: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: 48px;
  height: 48px;
  transition: all 0.3s ease;
  z-index: 1002;
}

.mobile-menu-btn:hover {
  background: rgba(255, 193, 7, 0.2);
  transform: rotate(90deg);
}

/* ============ MENU MOBILE SIMPLIFIÉ ============ */
.mobile-menu-simple {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  max-width: 85vw;
  background: linear-gradient(135deg, #2d1b69 0%, #1a0d3a 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.3);
  z-index: 1002;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.mobile-menu-header {
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-logo {
  display: flex;
  align-items: center;
}

.mobile-menu-list {
  flex: 1;
  padding: 16px 0;
}

.mobile-menu-section-title {
  padding: 16px 24px 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mobile-menu-item {
  padding: 16px 24px;
  margin: 0 8px 4px;
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  cursor: pointer;
}

.mobile-menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.mobile-menu-item-active {
  background: rgba(255, 193, 7, 0.15);
  border-left: 4px solid #FFC107;
}

.mobile-menu-item.secondary {
  padding: 12px 24px;
  opacity: 0.9;
}

.mobile-menu-icon {
  min-width: 40px;
}

.mobile-menu-label {
  font-size: 1rem;
  font-weight: 500;
  color: white;
}

.mobile-menu-caption {
  font-size: 0.8rem;
  opacity: 0.7;
}

.mobile-menu-separator {
  margin: 16px 24px;
  background: rgba(255, 255, 255, 0.1);
}

.mobile-menu-footer {
  padding: 20px 24px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* ============ OVERLAY MENU MOBILE ============ */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1001;
}

/* ============ ACCENT HEADER ============ */
.header-accent {
  height: 4px;
  width: 100%;
  background: linear-gradient(90deg, #FFC107 0%, #FF9800 50%, #FF5722 100%);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.header-hidden .header-accent {
  transform: scaleX(0);
}

/* ============ BOUTON AFFICHER HEADER ============ */
.show-header-btn {
  position: absolute !important;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1002;
  animation: pulse 2s infinite;
  box-shadow: 0 6px 16px rgba(255, 193, 7, 0.3);
}

/* ============ AJUSTEMENT CONTENU ============ */
.q-page-container {
  padding-top: 80px;
  transition: padding-top 0.3s ease;
}

.header-scrolled + .q-page-container {
  padding-top: 70px;
}

/* ============ BOUTON RETOUR EN HAUT ============ */
.back-to-top-btn {
  box-shadow: 0 6px 20px rgba(103, 58, 183, 0.4);
  transition: all 0.3s ease;
}

.back-to-top-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(103, 58, 183, 0.6);
}

/* ============ ANIMATIONS ============ */
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

/* ============ RESPONSIVE PROFESSIONNEL ============ */

/* Tablette */
@media (max-width: 1024px) {
  .custom-toolbar {
    min-height: 76px !important;
    height: 76px;
    padding: 0 20px;
  }

  .header-scrolled .custom-toolbar {
    min-height: 68px !important;
    height: 68px;
  }

  .desktop-nav-btn {
    padding: 9px 16px;
    font-size: 0.9rem;
  }

  .logo-text {
    font-size: 1.3rem;
  }

  .logo-subtitle {
    font-size: 0.7rem;
  }

  .q-page-container {
    padding-top: 76px;
  }

  .header-scrolled + .q-page-container {
    padding-top: 68px;
  }
}

/* Mobile - Large (Tablette portrait) */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: flex !important;
  }

  .custom-toolbar {
    min-height: 72px !important;
    height: 72px;
    padding: 0 16px;
  }

  .header-scrolled .custom-toolbar {
    min-height: 64px !important;
    height: 64px;
  }

  .logo-container {
    min-width: auto;
  }

  .logo-icon-wrapper {
    padding: 8px;
    margin-right: 10px;
  }

  .logo-text {
    font-size: 1.2rem;
  }

  .logo-subtitle {
    display: none;
  }

  .beta-badge {
    font-size: 0.65rem;
    padding: 2px 6px;
  }

  .q-page-container {
    padding-top: 72px;
  }

  .header-scrolled + .q-page-container {
    padding-top: 64px;
  }
}

/* Mobile - Medium (Téléphone large) */
@media (max-width: 600px) {
  .custom-toolbar {
    min-height: 68px !important;
    height: 68px;
    padding: 0 12px;
  }

  .header-scrolled .custom-toolbar {
    min-height: 60px !important;
    height: 60px;
  }

  .logo-text {
    font-size: 1.1rem;
  }

  .mobile-menu-btn {
    width: 44px;
    height: 44px;
  }

  .mobile-menu-simple {
    width: 280px;
  }

  .mobile-menu-header {
    padding: 16px;
  }

  .mobile-menu-item {
    padding: 14px 20px;
  }

  .q-page-container {
    padding-top: 68px;
  }

  .header-scrolled + .q-page-container {
    padding-top: 60px;
  }
}

/* Mobile - Small (Téléphone standard) */
@media (max-width: 480px) {
  .custom-toolbar {
    min-height: 64px !important;
    height: 64px;
    padding: 0 10px;
  }

  .header-scrolled .custom-toolbar {
    min-height: 56px !important;
    height: 56px;
  }

  .logo-text {
    font-size: 1rem;
  }

  .beta-badge {
    display: none;
  }

  .mobile-menu-btn {
    width: 40px;
    height: 40px;
  }

  .mobile-menu-simple {
    width: 260px;
  }

  .mobile-menu-header {
    padding: 14px;
  }

  .mobile-menu-item {
    padding: 12px 16px;
  }

  .q-page-container {
    padding-top: 64px;
  }

  .header-scrolled + .q-page-container {
    padding-top: 56px;
  }
}

/* Mobile - Très petit */
@media (max-width: 360px) {
  .custom-toolbar {
    min-height: 60px !important;
    height: 60px;
  }

  .header-scrolled .custom-toolbar {
    min-height: 52px !important;
    height: 52px;
  }

  .logo-text {
    font-size: 0.95rem;
  }

  .logo-icon-wrapper {
    padding: 6px;
    margin-right: 8px;
  }

  .mobile-menu-simple {
    width: 100%;
    max-width: 100%;
  }

  .q-page-container {
    padding-top: 60px;
  }

  .header-scrolled + .q-page-container {
    padding-top: 52px;
  }
}

/* Support pour le mode sombre */
.body--dark .header-scrolled {
  background: rgba(30, 0, 60, 0.95) !important;
}

.body--dark .mobile-menu-simple {
  background: linear-gradient(135deg, #241554 0%, #150933 100%);
}

/* Support iOS Safari */
@supports (-webkit-touch-callout: none) {
  .header-scrolled {
    background: rgba(40, 0, 80, 0.92) !important;
  }
  
  .mobile-menu-simple {
    background: linear-gradient(135deg, #2d1b69 0%, #1a0d3a 95%);
  }
}

/* Empêcher le zoom sur iOS pour les inputs */
@media screen and (max-width: 768px) {
  input,
  select,
  textarea {
    font-size: 16px;
  }
}

/* Améliorations pour le touch */
@media (hover: none) and (pointer: coarse) {
  .desktop-nav-btn {
    padding: 12px 20px;
  }
  
  .mobile-menu-item {
    padding: 18px 24px;
    min-height: 60px;
  }
  
  .mobile-menu-btn {
    width: 56px;
    height: 56px;
  }
}
</style>