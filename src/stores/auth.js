import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  const currentUser = computed(() => user.value)

  // Configurer le token dans axios
  const setAuthToken = (authToken) => {
    if (authToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }

  // Initialiser le token dans axios au démarrage
  if (token.value) {
    setAuthToken(token.value)
  }

  // Actions
  const setAuth = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    setAuthToken(authToken)
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    setAuthToken(null)
  }

  // Connexion
  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await api.post('/auth/login', credentials)
      
      const { user: userData, token: authToken } = response.data

      if (!authToken) {
        throw new Error('Token non reçu de l\'API')
      }

      setAuth(userData, authToken)

      return userData
    } catch (err) { // Changé de 'error' à 'err' pour éviter les conflits
      console.error('Login error:', err)
      
      let errorMessage = 'Erreur de connexion'
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Erreur ${err.response.status}`
      } else if (err.request) {
        errorMessage = 'Serveur inaccessible. Vérifiez votre connexion.'
      } else {
        errorMessage = err.message || 'Erreur de configuration'
      }
      
      throw errorMessage
    } finally {
      loading.value = false
    }
  }

  // Inscription
  const register = async (userData) => {
    loading.value = true
    try {
      const response = await api.post('/auth/register', userData)
      
      const { user: newUser, token: authToken } = response.data

      if (!authToken) {
        throw new Error('Token non reçu de l\'API')
      }

      setAuth(newUser, authToken)

      return newUser
    } catch (err) { // Changé de 'error' à 'err'
      console.error('Registration error:', err)
      
      let errorMessage = 'Erreur d\'inscription'
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Erreur ${err.response.status}`
        
        if (err.response.status === 400 && err.response.data?.errors) {
          const errors = err.response.data.errors
          errorMessage = Object.values(errors).flat().join(', ')
        }
      } else if (err.request) {
        errorMessage = 'Serveur inaccessible. Vérifiez votre connexion.'
      } else {
        errorMessage = err.message || 'Erreur de configuration'
      }
      
      throw errorMessage
    } finally {
      loading.value = false
    }
  }

  // Déconnexion
  const logout = () => {
    clearAuth()
  }

  // Vérifier l'authentification
  const checkAuth = async () => {
    if (!token.value) {
      clearAuth()
      return false
    }

    try {
      const response = await api.get('/auth/me')
      user.value = response.data
      return true
    } catch (err) { // Changé de 'error' à 'err'
      console.error('Auth check error:', err)
      
      if (err.response?.status === 401) {
        clearAuth()
      }
      
      return false
    }
  }

  // Réinitialiser le mot de passe
  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (err) { // Changé de 'error' à 'err'
      console.error('Forgot password error:', err)
      throw err.response?.data?.message || 'Erreur lors de l\'envoi de l\'email'
    }
  }

  // Réinitialiser le mot de passe avec token
  const resetPassword = async (data) => {
    try {
      const response = await api.post('/auth/reset-password', data)
      return response.data
    } catch (err) { // Changé de 'error' à 'err'
      console.error('Reset password error:', err)
      throw err.response?.data?.message || 'Erreur lors de la réinitialisation'
    }
  }

  // Charger l'utilisateur depuis le localStorage au démarrage
  const loadUserFromStorage = async () => {
    if (token.value) {
      await checkAuth()
    }
  }

  // Initialiser
  loadUserFromStorage()

  return {
    // États
    user,
    token,
    loading,
    
    // Getters
    isAuthenticated,
    currentUser,
    
    // Actions
    login,
    register,
    logout,
    checkAuth,
    forgotPassword,
    resetPassword,
    setAuth,
    clearAuth
  }
})