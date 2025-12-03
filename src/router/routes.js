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
        component: () => import('pages/PropertyDetailsPage.vue')
      },
      
      // 🛑 ROUTE MANQUANTE : Ajouter Bien
      { 
        path: 'add-property', 
        name: 'add-property', // <- Ce nom est utilisé dans MainLayout.vue
        component: () => import('pages/AddPropertyPage.vue') 
      },
      
      // 🛑 ROUTE MANQUANTE : Mon Compte
      { 
        path: 'account', 
        name: 'account',       // <- Ce nom est utilisé dans MainLayout.vue
        component: () => import('pages/AccountPage.vue') 
      }
    ]
  },

  // Route 404 (doit rester la dernière)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes