const routes = [
  // ============ PAGE D'ACCUEIL AVEC MAINLAYOUT ============
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Seulement la page d'accueil avec le layout
      {
        path: '',
        name: 'home',
        component: () => import('pages/HomePage.vue'),
        meta: {
          title: 'Accueil'
        }
      }
    ]
  },

  // ============ LAYOUT D'AUTHENTIFICATION ============
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      // Connexion
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: {
          requiresGuest: true,
          title: 'Connexion'
        }
      },

      // Inscription
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/LoginPage.vue'), // Même composant avec mode inscription
        meta: {
          requiresGuest: true,
          title: 'Inscription'
        }
      }
    ]
  },

  // ============ ROUTES SANS LAYOUT (PAGES INDÉPENDANTES) ============

  // Espace locataire
  {
    path: '/locataire',
    name: 'locataire',
    component: () => import('pages/LocatairePage.vue'),
    meta: {
      title: 'Espace Locataire',
      requiresAuth: false
    }
  },

  // Dashboard acheteur
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('pages/BuyerDashboard.vue'),
    meta: {
      requiresAuth: true,
      title: 'Tableau de bord'
    }
  },

  // Détails d'une propriété
  {
    path: '/property/:id',
    name: 'property-details',
    component: () => import('pages/PropertyDetailsPage.vue'),
    meta: {
      requiresAuth: false,
      title: 'Détails du bien'
    }
  },

  // Ajouter un bien
  {
    path: '/add-property',
    name: 'add-property',
    component: () => import('pages/AddPropertyPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'Ajouter un bien'
    }
  },

  // Mon compte
  {
    path: '/account',
    name: 'account',
    component: () => import('pages/AccountPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mon compte'
    }
  },

  // Portefeuille
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('pages/Wallet.vue'),
    meta: {
      title: 'Mon Portefeuille'
    }
  },

  // Parcelles
  {
    path: '/parcelles',
    name: 'parcelles',
    component: () => import('pages/ParcellesPage.vue'),
    meta: {
      title: 'Parcelles'
    }
  },

  {
    path: '/proprietaire',
    name: 'proprietaire',
    component: () => import('pages/DashboardProprietaire.vue'),
    meta: {
      title: 'Propriétaire'
    }
  },

  // Détails d'une parcelle
  {
    path: '/parcelle/:id',
    name: 'parcelle-details',
    component: () => import('pages/ParcelleDetailsPage.vue'),
    meta: {
      title: 'Détails de la parcelle'
    }
  },

  // ============ ROUTE 404 (TOUJOURS LA DERNIÈRE) ============
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: {
      title: 'Page non trouvée'
    }
  }
]

export default routes
