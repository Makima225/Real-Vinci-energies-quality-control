import { useFetchAPI } from '~/composables/useFetchAPI'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
    // États spécifiques pour différentes actions
    loginLoading: false,
    userDetailsLoading: false,
    passwordChangeLoading: false,
    refreshLoading: false,
  }),

  actions: {
    // Initialisation de l'auth au démarrage de l'app
    initializeAuth() {
      if (import.meta.client) {
        const storedAccessToken = localStorage.getItem('accessToken')
        const storedRefreshToken = localStorage.getItem('refreshToken')
        const storedUser = localStorage.getItem('user')
        
        if (storedAccessToken && storedRefreshToken && storedUser) {
          try {
            this.accessToken = storedAccessToken
            this.refreshToken = storedRefreshToken
            this.user = JSON.parse(storedUser)
            
            // Récupérer les détails utilisateur pour vérifier la validité
            this.fetchUserDetails()
          } catch (error) {
            console.error('❌ Erreur lors de la récupération des données stockées:', error)
            this.clearAuth()
          }
        }
      }
    },

    // Définir l'utilisateur et le sauvegarder
    setUser(user) {
      this.user = user
      if (import.meta.client) {
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    // Définir les tokens et les sauvegarder
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      
      if (import.meta.client) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
      }
    },

    // Nettoyer l'authentification
    clearAuth() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.error = null
      
      if (import.meta.client) {
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    },

    // Connexion avec votre endpoint token/
    async login(credentials) {
      this.loginLoading = true
      this.error = null

      try {
        const api = useFetchAPI()
        const response = await api.post('token/', credentials)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || 'Identifiants invalides')
        }

        const data = await response.json()
        
        // Stocker les tokens JWT
        this.setTokens(data.access, data.refresh)

        // Récupérer les détails de l'utilisateur après connexion
        await this.fetchUserDetails()

        if (import.meta.dev) {
          console.log('🟢 Connexion réussie')
        }

        return { success: true }
      } catch (error) {
        this.error = error.message
        console.error('❌ Erreur lors de la connexion:', error)
        return { success: false, error: error.message }
      } finally {
        this.loginLoading = false
      }
    },

    // Rafraîchir le token avec votre endpoint token/refresh/
    async refreshAccessToken() {
      if (!this.refreshToken) {
        console.error('❌ Aucun refresh token disponible')
        await this.logout()
        return false
      }

      this.refreshLoading = true

      try {
        const api = useFetchAPI()
        const response = await api.post('token/refresh/', {
          refresh: this.refreshToken
        })

        if (!response.ok) {
          console.warn('⚠️ Refresh token expiré ou invalide')
          await this.logout()
          return false
        }

        const data = await response.json()
        this.accessToken = data.access
        
        if (import.meta.client) {
          localStorage.setItem('accessToken', data.access)
        }

        if (import.meta.dev) {
          console.log('🟢 Token rafraîchi avec succès')
        }

        return true
      } catch (error) {
        console.error('❌ Erreur lors du rafraîchissement du token:', error)
        await this.logout()
        return false
      } finally {
        this.refreshLoading = false
      }
    },

    // Déconnexion
    async logout() {
      this.isLoading = true

      try {
        // Optionnel: Invalider le token côté serveur si vous avez un endpoint logout
        // const api = useFetchAPI()
        // await api.post('auth/logout/')
      } catch (error) {
        console.warn('⚠️ Erreur lors de la déconnexion côté serveur:', error)
      } finally {
        this.clearAuth()
        this.isLoading = false
        
        if (import.meta.dev) {
          console.log('🟢 Déconnexion effectuée')
        }

        // Redirection vers la page de connexion
        await navigateTo('/login')
      }
    },

    // Récupérer les détails avec votre endpoint users/detail/
    async fetchUserDetails() {
      if (!this.accessToken) {
        console.error('❌ Aucun token disponible pour fetchUserDetails')
        return false
      }

      this.userDetailsLoading = true
      this.error = null

      try {
        const api = useFetchAPI()
        const response = await api.get('users/detail/')

        if (!response.ok) {
          if (response.status === 401) {
            // Tenter de rafraîchir le token
            const refreshed = await this.refreshAccessToken()
            if (refreshed) {
              // Retry après rafraîchissement
              return await this.fetchUserDetails()
            }
            return false
          }
          throw new Error(`Erreur API: ${response.status} ${response.statusText}`)
        }

        const userData = await response.json()
        this.setUser(userData)

        if (import.meta.dev) {
          console.log('🟢 Données utilisateur récupérées:', userData.email)
        }

        return true
      } catch (error) {
        this.error = error.message
        console.error('❌ Erreur lors de la récupération des détails utilisateur:', error)
        return false
      } finally {
        this.userDetailsLoading = false
      }
    },

    // Récupérer les utilisateurs par rôle avec votre endpoint users/detail/by-role/<role>/
    async fetchUsersByRole(role) {
      if (!this.accessToken) {
        console.error('❌ Aucun token disponible')
        return { success: false, users: [] }
      }

      this.isLoading = true
      this.error = null

      try {
        const api = useFetchAPI()
        const response = await api.get(`users/detail/by-role/${role}/`)

        if (!response.ok) {
          if (response.status === 401) {
            const refreshed = await this.refreshAccessToken()
            if (refreshed) {
              return await this.fetchUsersByRole(role)
            }
            return { success: false, users: [] }
          }
          throw new Error(`Erreur API: ${response.status} ${response.statusText}`)
        }

        const users = await response.json()
        return { success: true, users }
      } catch (error) {
        this.error = error.message
        console.error('❌ Erreur lors de la récupération des utilisateurs par rôle:', error)
        return { success: false, users: [] }
      } finally {
        this.isLoading = false
      }
    },

    // Récupérer la liste des rôles avec votre endpoint users/roles/
    async fetchRoles() {
      if (!this.accessToken) {
        console.error('❌ Aucun token disponible')
        return { success: false, roles: [] }
      }

      this.isLoading = true
      this.error = null

      try {
        const api = useFetchAPI()
        const response = await api.get('users/roles/')

        if (!response.ok) {
          if (response.status === 401) {
            const refreshed = await this.refreshAccessToken()
            if (refreshed) {
              return await this.fetchRoles()
            }
            return { success: false, roles: [] }
          }
          throw new Error(`Erreur API: ${response.status} ${response.statusText}`)
        }

        const roles = await response.json()
        return { success: true, roles }
      } catch (error) {
        this.error = error.message
        console.error('❌ Erreur lors de la récupération des rôles:', error)
        return { success: false, roles: [] }
      } finally {
        this.isLoading = false
      }
    },

    // Changer le mot de passe avec votre endpoint users/change-password/
    async changePassword(passwordData) {
      this.passwordChangeLoading = true
      this.error = null

      try {
        const api = useFetchAPI()
        const response = await api.post('users/change-password/', passwordData)

        if (!response.ok) {
          if (response.status === 401) {
            const refreshed = await this.refreshAccessToken()
            if (refreshed) {
              return await this.changePassword(passwordData)
            }
            return { success: false, error: 'Session expirée' }
          }
          
          const errorData = await response.json()
          throw new Error(errorData.detail || 'Erreur lors du changement de mot de passe')
        }

        // Marquer le mot de passe comme changé
        if (this.user) {
          this.setUser({
            ...this.user,
            is_password_changed: true
          })
        }

        if (import.meta.dev) {
          console.log('🟢 Mot de passe changé avec succès')
        }

        return { success: true }
      } catch (error) {
        this.error = error.message
        console.error('❌ Erreur lors du changement de mot de passe:', error)
        return { success: false, error: error.message }
      } finally {
        this.passwordChangeLoading = false
      }
    }
  },

  getters: {
    // Vérifier si l'utilisateur est connecté
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
    
    // Vérifier si l'utilisateur est actif
    // Comme l'API ne retourne pas is_active, on considère l'utilisateur actif s'il existe
    isActive: (state) => !!state.user,
    
    // Vérifier si le mot de passe a été changé
    hasChangedPassword: (state) => state.user?.is_password_changed === true,
    
    // Getters pour les rôles spécifiques
    isAdmin: (state) => state.user?.role === 'admin',
    isQualiticient: (state) => state.user?.role === 'qualiticient',
    isIngenieurTravaux: (state) => state.user?.role === 'ingenieur travaux',
    isChefDeProjet: (state) => state.user?.role === 'chef de projet',
    isCoordonnateur: (state) => state.user?.role === 'coordonnateur',
    isDirecteur: (state) => state.user?.role === 'directeur',
    
    // Vérifier si l'utilisateur a un des rôles spécifiés
    hasRole: (state) => (roles) => {
      if (!state.user?.role) return false
      return Array.isArray(roles) 
        ? roles.includes(state.user.role)
        : state.user.role === roles
    },
    
    // Vérifier les permissions d'administration
    canManageUsers: (state) => ['admin', 'directeur'].includes(state.user?.role),
    
    // Vérifier les permissions de gestion de projet
    canManageProjects: (state) => ['admin', 'directeur', 'chef de projet', 'coordonnateur'].includes(state.user?.role),
    
    // Obtenir le nom complet de l'utilisateur
    fullName: (state) => {
      if (!state.user) return ''
      return `${state.user.name} ${state.user.surname}`.trim()
    },
    
    // Obtenir les initiales de l'utilisateur
    initials: (state) => {
      if (!state.user) return ''
      const firstName = state.user.name?.charAt(0)?.toUpperCase() || ''
      const lastName = state.user.surname?.charAt(0)?.toUpperCase() || ''
      return `${firstName}${lastName}`
    },
    
    // Vérifier si une action est en cours
    isAnyLoading: (state) => state.isLoading || state.loginLoading || state.userDetailsLoading || state.passwordChangeLoading || state.refreshLoading
  }
})