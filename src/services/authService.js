import api from './api.js'

export const authService = {
  // Inscription
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  // Connexion
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  // Déconnexion
  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  // Vérifier si connecté
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  },

  // Obtenir l'utilisateur courant
  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Rafraîchir le token
  async refreshToken() {
    const response = await api.post('/auth/refresh')
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
    }
    return response.data
  }
}
