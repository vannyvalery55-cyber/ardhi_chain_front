const routes = [
  // Routes avec MainLayout (pour la plupart des pages)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Route d'accueil
      {
        path: '',
        name: 'home',
        component: () => import('pages/HomePage.vue')
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/BuyerDashboard.vue')
      },
      {
        path: 'property/:id',
        name: 'property-details',
        component: () => import('pages/PropertyDetailsPage.vue'),
        meta: {
          requiresAuth: false // Laisser accessible sans connexion
        }
      },
      // Route : Ajouter Bien
      {
        path: 'add-property',
        name: 'add-property',
        component: () => import('pages/AddPropertyPage.vue'),
        meta: {
          requiresAuth: true, // Nécessite une connexion
          title: 'Ajouter un bien'
        }
      },
      // Route : Mon Compte
      {
        path: 'account',
        name: 'account',
        component: () => import('pages/AccountPage.vue'),
        meta: {
          requiresAuth: true, // Nécessite une connexion
          title: 'Mon compte'
        }
      }
    ]
  },

  // Route Wallet SANS MainLayout
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import('pages/Wallet.vue'),
    meta: {
      title: 'Mon Portefeuille',
    }
  },

  // Layout minimal pour l'authentification
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      // Route de connexion
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: {
          requiresGuest: true, // Accessible uniquement aux non-connectés
          title: 'Connexion'
        }
      },
      // Route d'inscription
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/LoginPage.vue'), // Même page que login
        meta: {
          requiresGuest: true,
          title: 'Inscription'
        }
      }
    ]
  },

  // Routes indépendantes sans layout
  {
    path: '/parcelles',
    name: 'parcelles',
    component: () => import('pages/ParcellesPage.vue')
  },
  {
    path: '/parcelle/:id',
    name: 'parcelle-details',
    component: () => import('pages/ParcelleDetailsPage.vue')
  },
  {
    path: '/properties/:id',
    name: 'property-details',
    component: () => import('pages/PropertyDetailsPage.vue')
  },

  // Route 404 (doit rester la dernière)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes