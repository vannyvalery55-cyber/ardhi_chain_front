import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'

export default boot(({ app }) => {
  // Configuration globale des notifications
  Notify.setDefaults({
    position: 'top-right',
    timeout: 2500,
    textColor: 'white',
    progress: true,
    actions: [{ icon: 'close', color: 'white' }]
  })
  
  // Pour l'utilisation globale
  app.config.globalProperties.$notify = Notify
})