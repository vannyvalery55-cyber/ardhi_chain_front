import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)
  const userType = computed(() => user.value?.type || null)

  // Actions communes
  const setAuthData = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }

  const clearAuthData = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
  }

  // Inscription
  const register = async (userData) => {
    loading.value = true
    try {
      const payload = {
        nom: userData.nom,
        email: userData.email,
        mot_de_passe: userData.mot_de_passe,
        type: userData.type?.toLowerCase() || 'locataire',
        telephone: userData.telephone || null,
        adresse: userData.adresse || null
      }

      console.log('📤 Envoi inscription:', payload)

      const response = await api.post('/api/auth/register', payload)

      if (response.data?.token) {
        setAuthData(response.data.data, response.data.token)
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }
      throw new Error('Réponse invalide du serveur')
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', error)

      let errorMessage = 'Erreur lors de l\'inscription'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = 'Données invalides'
      } else if (error.response?.status === 409) {
        errorMessage = 'Cet email est déjà utilisé'
      }

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  // Connexion
  const login = async (credentials) => {
    loading.value = true
    try {
      console.log('📤 Tentative connexion:', credentials.email)

      const response = await api.post('/api/auth/login', {
        email: credentials.email,
        mot_de_passe: credentials.password
      })

      console.log('✅ Réponse connexion:', response.data)

      if (response.data?.token) {
        setAuthData(response.data.data, response.data.token)
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }
      throw new Error('Réponse invalide du serveur')
    } catch (error) {
      console.error('❌ Erreur de connexion:', error)

      let errorMessage = 'Erreur lors de la connexion'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect'
      }

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  // Déconnexion
  const logout = () => {
    console.log('🔓 Déconnexion')
    clearAuthData()
  }

  // Vérifier l'authentification
  const checkAuth = () => {
    const hasToken = !!token.value
    console.log('🔍 Vérification auth - Token présent:', hasToken)
    return hasToken
  }

  // Vérifier le token
  const verifyToken = async () => {
    if (!token.value) {
      console.log('❌ verifyToken: aucun token')
      return false
    }

    try {
      // Vérifier l'expiration du token JWT
      const parts = token.value.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        const now = Math.floor(Date.now() / 1000)

        if (payload.exp && payload.exp < now) {
          console.log('❌ Token expiré')
          clearAuthData()
          return false
        }
        console.log('✅ Token valide')
        return true
      }
      console.log('❌ Format token invalide')
      return false
    } catch (error) {
      console.error('❌ Erreur vérification token:', error)
      clearAuthData()
      return false
    }
  }

  // Initialiser depuis localStorage
  const init = () => {
    console.log('🔄 Initialisation store auth...')
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    console.log('📁 Token localStorage:', storedToken ? 'Présent' : 'Absent')
    console.log('📁 User localStorage:', storedUser ? 'Présent' : 'Absent')

    if (storedToken && storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        console.log('✅ Store initialisé depuis localStorage')
      } catch (error) {
        console.error('❌ Erreur parsing user:', error)
        clearAuthData()
      }
    } else {
      console.log('ℹ️ Aucune donnée dans localStorage')
    }
  }

  // NE PAS appeler init() ici ! Ça sera fait dans main.js

  return {
    // State
    user,
    token,
    loading,

    // Getters
    isAuthenticated,
    currentUser,
    userType,

    // Actions
    register,
    login,
    logout,
    checkAuth,
    verifyToken,
    setAuthData,
    clearAuthData,
    init
  }
})
