import { useQuasar } from 'quasar'
import { ref } from 'vue'

export function useNotify() {
  const $q = useQuasar()
  const isAvailable = ref(false)
  
  // Vérifier la disponibilité
  if ($q && typeof $q.notify === 'function') {
    isAvailable.value = true
  }
  
  const notify = {
    // Success
    success: (message, options = {}) => {
      const config = {
        type: 'positive',
        message,
        icon: 'check_circle',
        position: 'top-right',
        timeout: 2500,
        ...options
      }
      
      if (isAvailable.value) {
        $q.notify(config)
      } else {
        console.log('✅', message)
      }
    },
    
    // Error
    error: (message, options = {}) => {
      const config = {
        type: 'negative',
        message,
        icon: 'error',
        position: 'top-right',
        timeout: 3000,
        ...options
      }
      
      if (isAvailable.value) {
        $q.notify(config)
      } else {
        console.error('❌', message)
      }
    },
    
    // Warning
    warning: (message, options = {}) => {
      const config = {
        type: 'warning',
        message,
        icon: 'warning',
        position: 'top-right',
        timeout: 3000,
        ...options
      }
      
      if (isAvailable.value) {
        $q.notify(config)
      } else {
        console.warn('⚠️', message)
      }
    },
    
    // Info
    info: (message, options = {}) => {
      const config = {
        type: 'info',
        message,
        icon: 'info',
        position: 'top',
        ...options
      }
      
      if (isAvailable.value) {
        $q.notify(config)
      } else {
        console.info('ℹ️', message)
      }
    },
    
    // Check availability
    isAvailable: isAvailable
  }
  
  return notify
}