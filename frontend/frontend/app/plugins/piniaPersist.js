import { useAuthStore } from '~/stores/authStore'

export default defineNuxtPlugin((nuxtApp) => {
  // Plugin simplifié - la restauration est maintenant gérée par le middleware
  // On garde juste la logique de sauvegarde automatique
  
  nuxtApp.hook('app:mounted', () => {
    if (typeof window !== 'undefined') {
      const authStore = useAuthStore()
      
      // Watcher pour sauvegarder automatiquement les changements
      authStore.$subscribe((mutation, state) => {
        if (state.accessToken && state.refreshToken && state.user) {
          localStorage.setItem('accessToken', state.accessToken)
          localStorage.setItem('refreshToken', state.refreshToken)
          localStorage.setItem('user', JSON.stringify(state.user))
        }
      })
      
      if (import.meta.dev) {
        console.log('🟢 Plugin de persistance initialisé')
      }
    }
  })
})