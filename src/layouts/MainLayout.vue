<template>
  <q-layout view="lHh Lpr lFf">

    <!-- Header renforcé -->
    <q-header elevated class="bg-deep-purple-9">
      <q-toolbar class="q-py-md custom-toolbar">

        <!-- Logo/Titre avec effet amélioré -->
        <div class="row items-center no-wrap">
          <q-icon
            name="account_balance"
            size="md"
            class="q-mr-sm text-white"
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

          <!-- Optionnel: Bouton de déconnexion ou menu utilisateur -->
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
    </q-header>

    <!-- Page Container -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
// Aucune importation nécessaire pour le moment
</script>

<style scoped>
/* Styles pour le header */
.custom-toolbar {
  min-height: 80px !important;
  height: 80px;
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
}

/* Boutons de navigation améliorés */
.nav-btn {
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-btn.q-router-link--exact-active {
  background: rgba(255, 193, 7, 0.15);
  border-left: 3px solid #FFC107;
}

/* Barre d'accentuation du header */
.header-accent {
  height: 4px;
  width: 100%;
  background: linear-gradient(90deg, #FFC107 0%, #FF9800 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
    box-shadow: 0 0 0 6px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .custom-toolbar {
    min-height: 70px !important;
    height: 70px;
  }

  .logo-text {
    font-size: 1.25rem;
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
}
</style>
