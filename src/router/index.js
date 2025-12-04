import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Middleware/Guard d'authentification
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Vérifier l'authentification si nécessaire
  if (to.meta.requiresAuth) {
    // Vérifier si le token est valide
    if (!authStore.isAuthenticated) {
      // Rediriger vers login avec retour prévu
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  // Pages interdites aux utilisateurs connectés
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Rediriger vers l'accueil
    next({ name: 'home' })
    return
  }

  // Vérifier les rôles admin si nécessaire
  if (to.meta.requiresAdmin) {
    const user = authStore.currentUser
    if (!user || user.type !== 'admin') {
      // Rediriger vers l'accueil si pas admin
      next({ name: 'home' })
      return
    }
  }

  // Mettre à jour le titre de la page
  if (to.meta.title) {
    document.title = `${to.meta.title} - Immobilier Pro`
  } else {
    document.title = 'Immobilier Pro'
  }

  next()
})

export default router
