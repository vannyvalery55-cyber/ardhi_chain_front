import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000',
  timeout: 30000, // Augmentez le timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Intercepteur pour debug
api.interceptors.request.use(
  config => {
    console.log('Requête API:', config.method.toUpperCase(), config.url)
    return config
  },
  error => {
    console.error('Erreur requête API:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => {
    console.log('Réponse API:', response.status, response.config.url)
    return response
  },
  error => {
    console.error('Erreur réponse API:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    })
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
