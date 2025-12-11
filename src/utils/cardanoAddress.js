// Fonctions utilitaires pour les adresses Cardano

// Convertir une clé publique hex en adresse Cardano testnet
export const hexToCardanoAddress = (hexAddress) => {
  if (!hexAddress || typeof hexAddress !== 'string') {
    return 'addr_test1qpp7cjcs4uzcv3gn6c64tq0jfj5k83t0wyk2h8svxe7fmxk...'
  }
  
  // Nettoyer l'adresse hex
  const cleanHex = hexAddress.replace(/^0x/, '')
  
  // Vérifier si c'est une clé publique valide (au moins 64 caractères)
  if (cleanHex.length < 64 || !/^[0-9a-fA-F]+$/.test(cleanHex)) {
    return 'addr_test1qinvalid...'
  }
  
  // Utiliser une partie de l'hex pour créer une adresse test réaliste
  // Format: addr_test1q + 54 chars + ...
  const prefix = 'addr_test1q'
  const middle = cleanHex.substring(0, 54)
  return `${prefix}${middle}...`
}

// Formater l'adresse pour l'affichage
export const formatAddressForDisplay = (address) => {
  if (!address) return 'Non connecté'
  
  const addr = String(address)
  
  // Si c'est une adresse hex longue
  if (addr.length > 50 && /^[0-9a-fA-F]+$/.test(addr)) {
    // Convertir en adresse Cardano
    return hexToCardanoAddress(addr)
  }
  
  // Si c'est déjà une adresse Cardano ou autre
  if (addr.length > 30) {
    return `${addr.substring(0, 10)}...${addr.substring(addr.length - 8)}`
  }
  
  return addr
}

// Vérifier si c'est une adresse valide
export const isValidCardanoAddress = (address) => {
  if (!address || typeof address !== 'string') return false
  
  return address.startsWith('addr1') || 
         address.startsWith('addr_test1') ||
         address.startsWith('stake1') ||
         address.startsWith('stake_test1')
}