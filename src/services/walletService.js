import api from './api.js'

export const walletService = {
  // Connecter un wallet Cardano
  async connectWallet(walletData) {
    const response = await api.post('/wallets/connect', walletData)
    return response.data
  },

  // Obtenir les wallets de l'utilisateur
  async getMyWallets() {
    const response = await api.get('/wallets/my-wallets')
    return response.data
  },

  // Déconnecter un wallet
  async disconnectWallet(walletId) {
    const response = await api.post(`/wallets/${walletId}/disconnect`)
    return response.data
  },

  // Définir un wallet comme primaire
  async setPrimaryWallet(walletId) {
    const response = await api.put(`/wallets/${walletId}/set-primary`)
    return response.data
  },

  // Synchroniser un wallet avec la blockchain
  async syncWallet(walletId) {
    const response = await api.post(`/wallets/${walletId}/sync`)
    return response.data
  },

  // Obtenir l'historique des transactions
  async getWalletTransactions(walletId, params = {}) {
    const response = await api.get(`/wallets/${walletId}/transactions`, { params })
    return response.data
  }
}