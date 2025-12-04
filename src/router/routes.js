const routes = [
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

      // Route pour les détails de la propriété
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
      },

    ]
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
      },
    ]
  },

  // Route pour l'admin (exemple)
  // {
  //   path: '/admin',
  //   component: () => import('layouts/AdminLayout.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     requiresAdmin: true
  //   },
  //   children: [
  //     {
  //       path: '',
  //       name: 'admin-dashboard',
  //       component: () => import('pages/admin/DashboardPage.vue')
  //     },
  //     {
  //       path: 'properties',
  //       name: 'admin-properties',
  //       component: () => import('pages/admin/PropertiesPage.vue')
  //     },
  //     {
  //       path: 'users',
  //       name: 'admin-users',
  //       component: () => import('pages/admin/UsersPage.vue')
  //     }
  //   ]
  // },

  // Route 404 (doit rester la dernière)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
