// composables/useUserManagement.js
import { ref, computed } from 'vue'
import { useFetchAPI } from './useFetchAPI'

export function useUserManagement() {
  const api = useFetchAPI()
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  // État pour les rôles
  const roles = ref([])
  const rolesLoading = ref(false)

  // Récupérer la liste des rôles
  const fetchRoles = async () => {
    rolesLoading.value = true
    error.value = ''
    
    try {
      const response = await api.get('users/roles/')
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Transformer les données pour le select
      roles.value = data.map(role => ({
        value: role.id || role.value || role,
        label: role.name || role.label || role
      }))
      
      if (import.meta.dev) {
        console.log('🟢 Rôles récupérés:', roles.value)
      }
      
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération des rôles'
      console.error('❌ Erreur lors de la récupération des rôles:', err)
    } finally {
      rolesLoading.value = false
    }
  }

  // Créer un utilisateur
  const createUser = async (userData) => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      const response = await api.post('users/create-by-admin/', {
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        role: userData.role
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Gestion des erreurs spécifiques
        if (response.status === 400) {
          if (errorData.email) {
            throw new Error(`Email: ${errorData.email[0]}`)
          }
          if (errorData.role) {
            throw new Error(`Rôle: ${errorData.role[0]}`)
          }
          if (errorData.detail) {
            throw new Error(errorData.detail)
          }
          throw new Error('Données invalides')
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const newUser = await response.json()
      success.value = `Utilisateur ${newUser.email} créé avec succès`
      
      if (import.meta.dev) {
        console.log('🟢 Utilisateur créé:', newUser)
      }

      return { success: true, user: newUser }

    } catch (err) {
      error.value = err.message || 'Erreur lors de la création de l\'utilisateur'
      console.error('❌ Erreur lors de la création:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Valider les données utilisateur
  const validateUser = (userData) => {
    const errors = {}

    // Validation email
    if (!userData.email) {
      errors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Format d\'email invalide'
    }

    // Validation nom
    if (!userData.name?.trim()) {
      errors.name = 'Le nom est requis'
    }

    // Validation prénom
    if (!userData.surname?.trim()) {
      errors.surname = 'Le prénom est requis'
    }

    // Validation rôle
    if (!userData.role) {
      errors.role = 'Le rôle est requis'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Réinitialiser les messages
  const clearMessages = () => {
    error.value = ''
    success.value = ''
  }

  return {
    // État
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    success: computed(() => success.value),
    roles: computed(() => roles.value),
    rolesLoading: computed(() => rolesLoading.value),

    // Méthodes
    fetchRoles,
    createUser,
    validateUser,
    clearMessages
  }
}
