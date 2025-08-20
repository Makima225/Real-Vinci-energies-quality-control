import { ref, computed } from 'vue'
import { useFetchAPI } from './useFetchAPI'

export const useActiviteSpecifiqueManagement = () => {
  // État réactif
  const activitesSpecifiques = ref([])
  const currentActiviteSpecifique = ref(null)
  const activiteSpecifiqueLoading = ref(false)
  const error = ref(null)
  const success = ref(null)

  // Instance de l'API
  const api = useFetchAPI()

  // Fonction pour nettoyer les messages
  const clearMessages = () => {
    error.value = null
    success.value = null
  }

  // Récupérer toutes les activités spécifiques d'une activité générale
  const fetchActivitesSpecifiques = async (activiteGeneraleId) => {
    if (!activiteGeneraleId) {
      if (import.meta.dev) {
        console.log('❌ ID de l\'activité générale requis pour charger les activités spécifiques')
      }
      return { success: false, error: 'ID de l\'activité générale requis' }
    }

    activiteSpecifiqueLoading.value = true
    clearMessages()
    
    try {
      if (import.meta.dev) {
        console.log('🔄 Chargement des activités spécifiques pour l\'activité générale:', activiteGeneraleId)
      }

      const response = await api.get(`activite-specifique/list/?activite_generale=${activiteGeneraleId}`)
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      activitesSpecifiques.value = data || []
        
      if (import.meta.dev) {
        console.log('🟢 Activités spécifiques chargées:', activitesSpecifiques.value.length)
      }
        
      return { success: true, data: activitesSpecifiques.value }
    } catch (err) {
      error.value = 'Erreur de communication avec le serveur'
      
      if (import.meta.dev) {
        console.error('❌ Erreur fetchActivitesSpecifiques:', err)
      }
      
      return { success: false, error: error.value }
    } finally {
      activiteSpecifiqueLoading.value = false
    }
  }

  // Récupérer une activité spécifique par ID
  const fetchActiviteSpecifique = async (activiteSpecifiqueId) => {
    if (!activiteSpecifiqueId) {
      if (import.meta.dev) {
        console.log('❌ ID de l\'activité spécifique requis')
      }
      return { success: false, error: 'ID de l\'activité spécifique requis' }
    }

    activiteSpecifiqueLoading.value = true
    clearMessages()
    
    try {
      if (import.meta.dev) {
        console.log('🔄 Chargement de l\'activité spécifique:', activiteSpecifiqueId)
      }

      const response = await api.get(`activite-specifique/detail/${activiteSpecifiqueId}/`)
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      currentActiviteSpecifique.value = data
        
      if (import.meta.dev) {
        console.log('🟢 Activité spécifique chargée:', currentActiviteSpecifique.value?.titre)
      }
        
      return { success: true, data: currentActiviteSpecifique.value }
    } catch (err) {
      error.value = 'Erreur de communication avec le serveur'
      
      if (import.meta.dev) {
        console.error('❌ Erreur fetchActiviteSpecifique:', err)
      }
      
      return { success: false, error: error.value }
    } finally {
      activiteSpecifiqueLoading.value = false
    }
  }

  // Créer une nouvelle activité spécifique
  const createActiviteSpecifique = async (activiteSpecifiqueData) => {
    if (!activiteSpecifiqueData.titre?.trim()) {
      error.value = 'Le titre est requis'
      return { success: false, error: error.value }
    }

    if (!activiteSpecifiqueData.activite_generale) {
      error.value = 'L\'activité générale est requise'
      return { success: false, error: error.value }
    }

    activiteSpecifiqueLoading.value = true
    clearMessages()
    
    try {
      if (import.meta.dev) {
        console.log('🔄 Création de l\'activité spécifique:', activiteSpecifiqueData.titre)
      }

      const response = await api.post('activite-specifique/create/', {
        titre: activiteSpecifiqueData.titre.trim(),
        activite_generale: activiteSpecifiqueData.activite_generale
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Gestion des erreurs spécifiques
        if (response.status === 400) {
          if (errorData.titre) {
            throw new Error(`Titre: ${errorData.titre.join(', ')}`)
          }
          if (errorData.activite_generale) {
            throw new Error(`Activité générale: ${errorData.activite_generale.join(', ')}`)
          }
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const newActiviteSpecifique = await response.json()
      success.value = `Activité spécifique "${newActiviteSpecifique.titre}" créée avec succès`
        
      if (import.meta.dev) {
        console.log('🟢 Activité spécifique créée:', newActiviteSpecifique)
      }
        
      return { success: true, data: newActiviteSpecifique }
    } catch (err) {
      error.value = 'Erreur de communication avec le serveur'
      
      if (import.meta.dev) {
        console.error('❌ Erreur createActiviteSpecifique:', err)
      }
      
      return { success: false, error: error.value }
    } finally {
      activiteSpecifiqueLoading.value = false
    }
  }

  // Modifier une activité spécifique
  const updateActiviteSpecifique = async (activiteSpecifiqueId, activiteSpecifiqueData) => {
    if (!activiteSpecifiqueId) {
      error.value = 'ID de l\'activité spécifique requis'
      return { success: false, error: error.value }
    }

    if (!activiteSpecifiqueData.titre?.trim()) {
      error.value = 'Le titre est requis'
      return { success: false, error: error.value }
    }

    activiteSpecifiqueLoading.value = true
    clearMessages()
    
    try {
      if (import.meta.dev) {
        console.log('🔄 Modification de l\'activité spécifique:', activiteSpecifiqueId)
      }

      const response = await api.put(`activite-specifique/update/${activiteSpecifiqueId}/`, {
        titre: activiteSpecifiqueData.titre.trim(),
        activite_generale: activiteSpecifiqueData.activite_generale
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Gestion des erreurs spécifiques
        if (response.status === 400) {
          if (errorData.titre) {
            throw new Error(`Titre: ${errorData.titre.join(', ')}`)
          }
          if (errorData.activite_generale) {
            throw new Error(`Activité générale: ${errorData.activite_generale.join(', ')}`)
          }
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const updatedActiviteSpecifique = await response.json()
      success.value = `Activité spécifique "${updatedActiviteSpecifique.titre}" modifiée avec succès`
        
      if (import.meta.dev) {
        console.log('🟢 Activité spécifique modifiée:', updatedActiviteSpecifique)
      }
        
      return { success: true, data: updatedActiviteSpecifique }
    } catch (err) {
      error.value = 'Erreur de communication avec le serveur'
      
      if (import.meta.dev) {
        console.error('❌ Erreur updateActiviteSpecifique:', err)
      }
      
      return { success: false, error: error.value }
    } finally {
      activiteSpecifiqueLoading.value = false
    }
  }

  // Supprimer une activité spécifique
  const deleteActiviteSpecifique = async (activiteSpecifiqueId) => {
    if (!activiteSpecifiqueId) {
      error.value = 'ID de l\'activité spécifique requis'
      return { success: false, error: error.value }
    }

    activiteSpecifiqueLoading.value = true
    clearMessages()
    
    try {
      if (import.meta.dev) {
        console.log('🔄 Suppression de l\'activité spécifique:', activiteSpecifiqueId)
      }

      const response = await api.delete(`activite-specifique/delete/${activiteSpecifiqueId}/`)
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      success.value = 'Activité spécifique supprimée avec succès'
        
      if (import.meta.dev) {
        console.log('🟢 Activité spécifique supprimée:', activiteSpecifiqueId)
      }
        
      return { success: true }
    } catch (err) {
      error.value = 'Erreur de communication avec le serveur'
      
      if (import.meta.dev) {
        console.error('❌ Erreur deleteActiviteSpecifique:', err)
      }
      
      return { success: false, error: error.value }
    } finally {
      activiteSpecifiqueLoading.value = false
    }
  }

  // Validation des données
  const validateActiviteSpecifique = (activiteSpecifiqueData) => {
    const errors = {}

    if (!activiteSpecifiqueData.titre?.trim()) {
      errors.titre = 'Le titre est requis'
    } else if (activiteSpecifiqueData.titre.trim().length < 3) {
      errors.titre = 'Le titre doit contenir au moins 3 caractères'
    } else if (activiteSpecifiqueData.titre.trim().length > 100) {
      errors.titre = 'Le titre ne peut pas dépasser 100 caractères'
    }

    if (!activiteSpecifiqueData.activite_generale) {
      errors.activite_generale = 'L\'activité générale est requise'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Computed values
  const hasActivitesSpecifiques = computed(() => activitesSpecifiques.value.length > 0)
  const activitesSpecifiquesCount = computed(() => activitesSpecifiques.value.length)

  // Return des méthodes et états
  return {
    // États
    activitesSpecifiques,
    currentActiviteSpecifique,
    activiteSpecifiqueLoading,
    error,
    success,

    // Computed
    hasActivitesSpecifiques,
    activitesSpecifiquesCount,

    // Méthodes
    fetchActivitesSpecifiques,
    fetchActiviteSpecifique,
    createActiviteSpecifique,
    updateActiviteSpecifique,
    deleteActiviteSpecifique,
    validateActiviteSpecifique,
    clearMessages
  }
}
