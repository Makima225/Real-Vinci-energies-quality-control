import { ref, computed } from 'vue'
import { useFetchAPI } from './useFetchAPI'

export const usePlanReferenceManagement = () => {
  // États réactifs
  const plansReference = ref([])
  const currentPlanReference = ref(null)
  const planReferenceLoading = ref(false)
  const error = ref('')
  const success = ref('')

  // Composable API
  const api = useFetchAPI()

  // Computed values
  const hasPlansReference = computed(() => plansReference.value.length > 0)
  const plansReferenceCount = computed(() => plansReference.value.length)

  // Récupérer tous les plans de référence d'une activité spécifique
  const fetchPlansReference = async (activiteSpecifiqueId) => {
    if (!activiteSpecifiqueId) {
      error.value = 'ID de l\'activité spécifique requis'
      return { success: false, error: 'ID de l\'activité spécifique requis' }
    }

    try {
      planReferenceLoading.value = true
      error.value = ''

      if (import.meta.dev) {
        console.log('🔄 Chargement des plans de référence pour activité spécifique:', activiteSpecifiqueId)
      }

      const response = await api.get(`planrefs/activite-specifique/${activiteSpecifiqueId}/`)
      
      if (import.meta.dev) {
        console.log('🔍 Réponse API fetchPlansReference:', response)
      }
      
      // Vérifier le statut de la réponse
      if (!response.ok) {
        const errorText = await response.text()
        if (import.meta.dev) {
          console.error('❌ Réponse API non OK:', response.status, errorText)
        }
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }
      
      const responseData = await response.json()
      
      if (responseData) {
        plansReference.value = Array.isArray(responseData) ? responseData : []
        
        if (import.meta.dev) {
          console.log('🟢 Plans de référence chargés:', plansReference.value.length, plansReference.value)
        }
        
        return { success: true, data: plansReference.value }
      } else {
        plansReference.value = []
        return { success: true, data: [] }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors du chargement des plans de référence'
      error.value = errorMessage
      
      if (import.meta.dev) {
        console.error('❌ Erreur chargement plans de référence:', err)
      }
      
      return { success: false, error: error.value }
    } finally {
      planReferenceLoading.value = false
    }
  }

  // Récupérer un plan de référence spécifique
  const fetchPlanReference = async (planReferenceId) => {
    if (!planReferenceId) {
      error.value = 'ID du plan de référence requis'
      return { success: false, error: 'ID du plan de référence requis' }
    }

    try {
      planReferenceLoading.value = true
      error.value = ''

      if (import.meta.dev) {
        console.log('🔄 Chargement du plan de référence:', planReferenceId)
      }

      const response = await api.get(`plan-reference/detail/${planReferenceId}/`)
      
      if (import.meta.dev) {
        console.log('🔍 Réponse API fetchPlanReference:', response)
      }
      
      // Vérifier le statut de la réponse
      if (!response.ok) {
        const errorText = await response.text()
        if (import.meta.dev) {
          console.error('❌ Réponse API non OK:', response.status, errorText)
        }
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }
      
      const responseData = await response.json()
      
      if (responseData) {
        currentPlanReference.value = responseData
        
        if (import.meta.dev) {
          console.log('🟢 Plan de référence chargé:', currentPlanReference.value.nom)
        }
        
        return { success: true, data: currentPlanReference.value }
      } else {
        throw new Error('Plan de référence non trouvé')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors du chargement du plan de référence'
      error.value = errorMessage
      currentPlanReference.value = null
      
      if (import.meta.dev) {
        console.error('❌ Erreur chargement plan de référence:', err)
      }
      
      return { success: false, error: error.value }
    } finally {
      planReferenceLoading.value = false
    }
  }

  // Créer un nouveau plan de référence
  const createPlanReference = async (planReferenceData) => {
    const validation = validatePlanReference(planReferenceData)
    if (!validation.isValid) {
      error.value = validation.errors
      return { success: false, error: error.value }
    }

    try {
      planReferenceLoading.value = true
      error.value = ''
      success.value = ''

      if (import.meta.dev) {
        console.log('🔄 Création plan de référence:', planReferenceData.nom)
      }

      // Créer FormData pour l'upload de fichier
      const formData = new FormData()
      formData.append('nom', planReferenceData.nom)
      formData.append('activite_specifique', planReferenceData.activite_specifique)
      if (planReferenceData.plan) {
        formData.append('plan', planReferenceData.plan)
      }

      const response = await api.post('plan-reference/create/', formData)
      
      if (import.meta.dev) {
        console.log('🔍 Réponse API createPlanReference:', response)
      }
      
      // Vérifier le statut de la réponse
      if (!response.ok) {
        const errorText = await response.text()
        if (import.meta.dev) {
          console.error('❌ Réponse API non OK:', response.status, errorText)
        }
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }
      
      const responseData = await response.json()
      
      if (responseData) {
        const newPlanReference = responseData
        plansReference.value.push(newPlanReference)
        success.value = 'Plan de référence créé avec succès'
        
        if (import.meta.dev) {
          console.log('🟢 Plan de référence créé:', newPlanReference.nom)
        }
        
        return { success: true, data: newPlanReference }
      } else {
        throw new Error('Aucune donnée retournée par le serveur')
      }
    } catch (err) {
      if (import.meta.dev) {
        console.error('❌ Erreur création plan de référence complète:', err)
        console.error('❌ Erreur status:', err.status)
        console.error('❌ Erreur response:', err.response)
      }
      
      let errorMessage = 'Erreur lors de la création du plan de référence'
      
      if (err.response) {
        // Erreur de réponse du serveur
        try {
          const errorData = await err.response.json()
          errorMessage = errorData.error || errorData.message || `Erreur ${err.response.status}`
        } catch {
          errorMessage = `Erreur ${err.response.status}: ${err.response.statusText}`
        }
      } else if (err.message) {
        // Erreur de réseau ou autre
        errorMessage = err.message
      }
      
      error.value = errorMessage
      
      return { success: false, error: error.value }
    } finally {
      planReferenceLoading.value = false
    }
  }

  // Mettre à jour un plan de référence
  const updatePlanReference = async (planReferenceId, planReferenceData) => {
    const validation = validatePlanReference(planReferenceData)
    if (!validation.isValid) {
      error.value = validation.errors
      return { success: false, error: error.value }
    }

    try {
      planReferenceLoading.value = true
      error.value = ''
      success.value = ''

      if (import.meta.dev) {
        console.log('🔄 Modification plan de référence:', planReferenceId)
      }

      // Créer FormData pour l'upload de fichier
      const formData = new FormData()
      formData.append('nom', planReferenceData.nom)
      formData.append('activite_specifique', planReferenceData.activite_specifique)
      
      // N'ajouter le fichier que si un nouveau fichier est fourni
      if (planReferenceData.plan && planReferenceData.plan instanceof File) {
        formData.append('plan', planReferenceData.plan)
        
        if (import.meta.dev) {
          console.log('🔄 Nouveau fichier à uploader:', planReferenceData.plan.name)
        }
      } else {
        if (import.meta.dev) {
          console.log('🔄 Pas de nouveau fichier, conservation du fichier existant')
        }
      }

      const response = await api.patch(`plan-reference/update/${planReferenceId}/`, formData)
      
      if (import.meta.dev) {
        console.log('🔍 Réponse API updatePlanReference:', response)
      }
      
      // Vérifier le statut de la réponse
      if (!response.ok) {
        const errorText = await response.text()
        if (import.meta.dev) {
          console.error('❌ Réponse API non OK:', response.status, errorText)
        }
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }
      
      const responseData = await response.json()
      
      if (responseData) {
        const updatedPlanReference = responseData
        const index = plansReference.value.findIndex(p => p.id === planReferenceId)
        if (index !== -1) {
          plansReference.value[index] = updatedPlanReference
        }
        currentPlanReference.value = updatedPlanReference
        success.value = 'Plan de référence modifié avec succès'
        
        if (import.meta.dev) {
          console.log('🟢 Plan de référence modifié:', updatedPlanReference.nom)
        }
        
        return { success: true, data: updatedPlanReference }
      } else {
        throw new Error('Aucune donnée retournée par le serveur')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la modification du plan de référence'
      error.value = errorMessage
      
      if (import.meta.dev) {
        console.error('❌ Erreur modification plan de référence:', err)
      }
      
      return { success: false, error: error.value }
    } finally {
      planReferenceLoading.value = false
    }
  }

  // Supprimer un plan de référence
  const deletePlanReference = async (planReferenceId) => {
    try {
      planReferenceLoading.value = true
      error.value = ''

      if (import.meta.dev) {
        console.log('🔄 Suppression plan de référence:', planReferenceId)
      }

      await api.delete(`plan-reference/delete/${planReferenceId}/`)
      
      plansReference.value = plansReference.value.filter(p => p.id !== planReferenceId)
      if (currentPlanReference.value?.id === planReferenceId) {
        currentPlanReference.value = null
      }
      success.value = 'Plan de référence supprimé avec succès'
      
      if (import.meta.dev) {
        console.log('🟢 Plan de référence supprimé')
      }
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la suppression du plan de référence'
      error.value = errorMessage
      
      if (import.meta.dev) {
        console.error('❌ Erreur suppression plan de référence:', err)
      }
      
      return { success: false, error: error.value }
    } finally {
      planReferenceLoading.value = false
    }
  }

  // Validation des données
  const validatePlanReference = (planReferenceData) => {
    const errors = {}

    if (!planReferenceData.nom || planReferenceData.nom.trim() === '') {
      errors.nom = 'Le nom est requis'
    } else if (planReferenceData.nom.length > 100) {
      errors.nom = 'Le nom ne peut pas dépasser 100 caractères'
    }

    if (!planReferenceData.activite_specifique) {
      errors.activite_specifique = 'L\'activité spécifique est requise'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Effacer les messages
  const clearMessages = () => {
    error.value = ''
    success.value = ''
  }

  // Return des méthodes et états
  return {
    // États
    plansReference,
    currentPlanReference,
    planReferenceLoading,
    error,
    success,

    // Computed
    hasPlansReference,
    plansReferenceCount,

    // Méthodes
    fetchPlansReference,
    fetchPlanReference,
    createPlanReference,
    updatePlanReference,
    deletePlanReference,
    validatePlanReference,
    clearMessages
  }
}
