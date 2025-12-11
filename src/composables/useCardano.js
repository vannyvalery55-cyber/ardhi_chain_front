import { inject } from 'vue'

export default function useCardano() {
  const context = inject('cardano')

  if (!context) {
    throw new Error('useCardano must be used within CardanoContext')
  }

  return {
    // État
    isConnected: context.isConnected,
    walletAddress: context.walletAddress,
    balance: context.balance,
    isLoading: context.isLoading,
    selectedWallet: context.selectedWallet,
    network: context.network,

    // Wallets
    supportedWallets: context.supportedWallets,
    getAvailableWallets: context.getAvailableWallets,
    isWalletInstalled: context.isWalletInstalled,
    getWalletName: context.getWalletName,

    // Actions
    connect: context.connectWallet,
    disconnect: context.disconnectWallet,
    refreshBalance: context.refreshBalance,
    signTransaction: context.signTransaction,
    signData: context.signData,

    // Utilitaires
    formatADA: context.parseADAFromLovelace,

    // Shortcuts
    get isMainnet() {
      return context.network.value === 'mainnet'
    },

    get isTestnet() {
      return ['testnet', 'preview', 'preprod'].includes(context.network.value)
    },

    get formattedBalance() {
      return context.parseADAFromLovelace(context.balance.value)
    },

    get shortAddress() {
      const address = context.walletAddress.value
      if (!address) return ''
      return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`
    }
  }
}
