// Configuration Cardano
export const CARDANO_CONFIG = {
  // Réseaux supportés
  NETWORKS: {
    MAINNET: {
      id: 1,
      name: 'Mainnet',
      explorer: 'https://cardanoscan.io',
      label: 'mainnet'
    },
    TESTNET: {
      id: 0,
      name: 'Testnet',
      explorer: 'https://testnet.cardanoscan.io',
      label: 'testnet'
    },
    PREPROD: {
      id: 0,
      name: 'Preprod',
      explorer: 'https://preprod.cardanoscan.io',
      label: 'preprod'
    },
    PREVIEW: {
      id: 0,
      name: 'Preview',
      explorer: 'https://preview.cardanoscan.io',
      label: 'preview'
    }
  },

  // Wallets supportés avec leurs APIs
  WALLETS: {
    NAMI: {
      id: 'nami',
      name: 'Nami',
      icon: 'account_balance_wallet',
      api: window.cardano?.nami,
      download: 'https://namiwallet.io'
    },
    ETERNL: {
      id: 'eternl',
      name: 'Eternl',
      icon: 'diamond',
      api: window.cardano?.eternl,
      download: 'https://eternl.io'
    },
    FLINT: {
      id: 'flint',
      name: 'Flint',
      icon: 'whatshot',
      api: window.cardano?.flint,
      download: 'https://flint-wallet.com'
    },
    TYPHON: {
      id: 'typhon',
      name: 'Typhon',
      icon: 'bolt',
      api: window.cardano?.typhon,
      download: 'https://typhonwallet.io'
    },
    GERO: {
      id: 'gerowallet',
      name: 'Gero Wallet',
      icon: 'shield',
      api: window.cardano?.gerowallet,
      download: 'https://gerowallet.io'
    }
  },

  // Configuration par défaut
  DEFAULT: {
    network: 'preview', // Réseau par défaut
    minADA: 2, // Minimum d'ADA requis pour les transactions
    autoConnect: true, // Auto-connexion si possible
    refreshInterval: 30000 // Intervalle de rafraîchissement (ms)
  },

  // URLs utiles
  URLS: {
    DOCS: 'https://docs.cardano.org',
    COMMUNITY: 'https://cardano.org/community',
    DEVELOPERS: 'https://developers.cardano.org'
  },

  // Helper functions
  getWalletAPI: (walletId) => {
    return window.cardano?.[walletId]
  },

  isWalletAvailable: (walletId) => {
    return !!window.cardano?.[walletId]?.enable
  },

  formatADA: (lovelace) => {
    if (!lovelace) return '0'
    return (Number(lovelace) / 1000000).toFixed(6).replace(/\.?0+$/, '')
  },

  formatAddress: (address, startChars = 8, endChars = 8) => {
    if (!address) return ''
    if (address.length <= startChars + endChars) return address
    return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`
  },

  // Conversion ADA <-> Lovelace
  toLovelace: (ada) => Math.floor(ada * 1000000),
  toADA: (lovelace) => lovelace / 1000000
}

export default CARDANO_CONFIG
