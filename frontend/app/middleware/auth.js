// middleware/auth.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Ignorer le middleware côté serveur pour éviter les problèmes
  if (import.meta.server) return
  
  const authStore = useAuthStore()
  
  // Si pas d'authentification, essayer de restaurer depuis localStorage
  if (!authStore.isAuthenticated && import.meta.client) {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')
    
    if (accessToken && refreshToken) {
      try {
        // Restaurer les tokens dans le store
        authStore.accessToken = accessToken
        authStore.refreshToken = refreshToken
        
        // Restaurer l'utilisateur si disponible
        if (storedUser) {
          try {
            authStore.user = JSON.parse(storedUser)
          } catch (parseError) {
            console.warn('⚠️ Erreur lors du parsing des données utilisateur stockées')
          }
        }
        
        // Valider l'authentification en récupérant les détails utilisateur
        const userDetailsSuccess = await authStore.fetchUserDetails()
        
        if (!userDetailsSuccess) {
          // Si échec, essayer de rafraîchir le token
          const refreshSuccess = await authStore.refreshAccessToken()
          
          if (refreshSuccess) {
            // Retry après rafraîchissement
            const retrySuccess = await authStore.fetchUserDetails()
            if (!retrySuccess) {
              authStore.clearAuth()
              return navigateTo('/login')
            }
          } else {
            authStore.clearAuth()
            return navigateTo('/login')
          }
        }
        
        if (import.meta.dev) {
          console.log('🟢 Authentification restaurée dans le middleware')
        }
        
      } catch (error) {
        console.error('❌ Erreur lors de la restauration de l\'authentification:', error)
        authStore.clearAuth()
        return navigateTo('/login')
      }
    }
  }
  
  // Si toujours pas d'authentification après tentative de restauration, rediriger vers login
  if (!authStore.isAuthenticated) {
    if (import.meta.dev) {
      console.log('🔒 Accès refusé - Non authentifié, redirection vers /login')
    }
    return navigateTo('/login')
  }
  
  // Vérifier si l'utilisateur est actif
  if (!authStore.isActive) {
    if (import.meta.dev) {
      console.log('🔒 Compte inactif, redirection vers /login')
    }
    authStore.clearAuth()
    return navigateTo('/login')
  }
  
  // Vérifications spécifiques pour les routes admin (quand vous les créerez)
  if (to.path.startsWith('/admin')) {
    if (!authStore.isAdmin) {
      if (import.meta.dev) {
        console.log('🔒 Accès admin refusé - Rôle insuffisant')
      }
      return navigateTo('/')
    }
  }
  
  if (import.meta.dev) {
    console.log(`✅ Accès autorisé à ${to.path} pour ${authStore.user?.email}`)
  }
})