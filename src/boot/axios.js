import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Intercepteur de requête pour ajouter le token
api.interceptors.request.use(
  config => {
    // Récupérer le token depuis localStorage directement
    // Éviter d'utiliser useAuthStore() ici car hors contexte Vue
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log pour debug (optionnel)
    console.log('Requête API:', {
      method: config.method.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: config.data
    })

    return config
  },
  error => {
    console.error('Erreur requête API:', error)
    return Promise.reject(error)
  }
)

// Intercepteur de réponse
api.interceptors.response.use(
  response => {
    console.log('Réponse API:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  error => {
    console.error('Erreur réponse API:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.response?.headers
    })

    // Gestion des erreurs d'authentification
    if (error.response?.status === 401) {
      console.warn('Token expiré ou invalide, déconnexion...')

      // Nettoyer le localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // Rediriger vers la page de connexion
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login'
      }
    }

    // Gestion des erreurs de réseau
    if (!error.response) {
      console.error('Erreur réseau - Impossible de joindre le serveur')
      // Pas de notification ici car elle sera gérée dans les composants
    }

    // Gestion des erreurs de validation (400)
    if (error.response?.status === 400) {
      console.warn('Erreur de validation:', error.response.data)
    }

    // Gestion des erreurs serveur (500)
    if (error.response?.status >= 500) {
      console.error('Erreur serveur:', error.response.data)
    }

    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  // Pour l'utilisation dans les composants avec this.$axios
  app.config.globalProperties.$axios = axios

  // Pour l'utilisation dans les composants avec this.$api
  app.config.globalProperties.$api = api
})

export { api }
