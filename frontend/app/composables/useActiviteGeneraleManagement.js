// composables/useActiviteGeneraleManagement.js
import { ref, computed } from 'vue'
import { useFetchAPI } from './useFetchAPI'

export function useActiviteGeneraleManagement() {
  const api = useFetchAPI()
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  // État pour les activités générales
  const activitesGenerales = ref([])
  const activitesGeneralesLoading = ref(false)
  
  // État pour une activité générale spécifique
  const currentActiviteGenerale = ref(null)
  const activiteGeneraleLoading = ref(false)

  // État pour les qualiticiens
  const qualiticiens = ref([])
  const qualiticiensLoading = ref(false)

  // Récupérer la liste des qualiticiens
  const fetchQualiticiens = async () => {
    qualiticiensLoading.value = true
    error.value = ''
    
    try {
      const response = await api.get('users/detail/by-role/qualiticient/')
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Transformer les données pour le select multiple
      qualiticiens.value = data.map(user => ({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        label: `${user.name} ${user.surname}`,
        value: user.id
      }))
      
      if (import.meta.dev) {
        console.log('🟢 Qualiticiens récupérés:', qualiticiens.value)
      }
      
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération des qualiticiens'
      console.error('❌ Erreur lors de la récupération des qualiticiens:', err)
    } finally {
      qualiticiensLoading.value = false
    }
  }

  // Créer une activité générale
  const createActiviteGenerale = async (activiteData) => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      const response = await api.post('activite-generale/create/', {
        titre: activiteData.titre,
        sous_projet: activiteData.sous_projet,
        qualiticient: activiteData.qualiticient || []
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Gestion des erreurs spécifiques
        if (response.status === 400) {
          if (errorData.titre) {
            throw new Error(`Titre: ${errorData.titre[0]}`)
          }
          if (errorData.sous_projet) {
            throw new Error(`Sous-projet: ${errorData.sous_projet[0]}`)
          }
          if (errorData.qualiticient) {
            throw new Error(`Qualiticiens: ${errorData.qualiticient[0]}`)
          }
          if (errorData.detail) {
            throw new Error(errorData.detail)
          }
          throw new Error('Données invalides')
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const newActiviteGenerale = await response.json()
      success.value = `Activité générale "${newActiviteGenerale.titre}" créée avec succès`
      
      if (import.meta.dev) {
        console.log('🟢 Activité générale créée:', newActiviteGenerale)
      }

      return { success: true, activiteGenerale: newActiviteGenerale }

    } catch (err) {
      error.value = err.message || 'Erreur lors de la création de l\'activité générale'
      console.error('❌ Erreur lors de la création:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Récupérer les activités générales d'un sous-projet
  const fetchActivitesGenerales = async (sousProjetId) => {
    activitesGeneralesLoading.value = true
    error.value = ''
    
    try {
      const response = await api.get(`activite-generale/list/?sous_projet=${sousProjetId}`)
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      activitesGenerales.value = data
      
      if (import.meta.dev) {
        console.log('🟢 Activités générales récupérées:', activitesGenerales.value)
        console.log('🔍 Structure des qualiticiens dans activités:', activitesGenerales.value.map(a => ({ 
          titre: a.titre, 
          qualiticiens: a.qualiticient 
        })))
      }
      
      return { success: true, activitesGenerales: data }
      
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération des activités générales'
      console.error('❌ Erreur lors de la récupération des activités générales:', err)
      return { success: false, error: err.message }
    } finally {
      activitesGeneralesLoading.value = false
    }
  }

  // Valider les données activité générale
  const validateActiviteGenerale = (activiteData) => {
    const errors = {}

    // Validation titre
    if (!activiteData.titre?.trim()) {
      errors.titre = 'Le titre est requis'
    } else if (activiteData.titre.trim().length > 100) {
      errors.titre = 'Le titre ne peut pas dépasser 100 caractères'
    }

    // Validation sous-projet
    if (!activiteData.sous_projet) {
      errors.sous_projet = 'Le sous-projet est requis'
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

  // Charger les détails d'une activité générale
  const fetchActiviteGenerale = async (activiteId) => {
    if (!activiteId) {
      error.value = 'ID de l\'activité générale requis'
      return { success: false, error: error.value }
    }

    activiteGeneraleLoading.value = true
    error.value = ''

    try {
      const response = await api.get(`activite-generale/detail/${activiteId}/`)
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      currentActiviteGenerale.value = data
      
      if (import.meta.dev) {
        console.log('🟢 Activité générale récupérée:', data)
      }
      
      return { success: true, activiteGenerale: data }
      
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération de l\'activité générale'
      console.error('❌ Erreur lors de la récupération de l\'activité générale:', err)
      return { success: false, error: err.message }
    } finally {
      activiteGeneraleLoading.value = false
    }
  }

  // Mettre à jour une activité générale
  const updateActiviteGenerale = async (activiteId, activiteData) => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      const response = await api.put(`activite-generale/update/${activiteId}/`, {
        titre: activiteData.titre,
        sous_projet: activiteData.sous_projet,
        qualiticient: activiteData.qualiticient || []
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        if (response.status === 400) {
          if (errorData.titre) {
            throw new Error(`Titre: ${errorData.titre[0]}`)
          }
          if (errorData.sous_projet) {
            throw new Error(`Sous-projet: ${errorData.sous_projet[0]}`)
          }
          if (errorData.qualiticient) {
            throw new Error(`Qualiticiens: ${errorData.qualiticient[0]}`)
          }
          if (errorData.detail) {
            throw new Error(errorData.detail)
          }
          throw new Error('Données invalides')
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const updatedActiviteGenerale = await response.json()
      success.value = `Activité générale "${updatedActiviteGenerale.titre}" modifiée avec succès`
      
      // Mettre à jour la liste locale si elle existe
      if (activitesGenerales.value.length > 0) {
        const index = activitesGenerales.value.findIndex(a => a.id === activiteId)
        if (index !== -1) {
          activitesGenerales.value[index] = updatedActiviteGenerale
        }
      }
      
      if (import.meta.dev) {
        console.log('🟢 Activité générale mise à jour:', updatedActiviteGenerale)
      }
      
      return { success: true, activiteGenerale: updatedActiviteGenerale }
      
    } catch (err) {
      error.value = err.message || 'Erreur lors de la mise à jour de l\'activité générale'
      console.error('❌ Erreur lors de la mise à jour de l\'activité générale:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Supprimer une activité générale
  const deleteActiviteGenerale = async (activiteId) => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      const response = await api.delete(`activite-generale/delete/${activiteId}/`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Activité générale introuvable')
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      success.value = 'Activité générale supprimée avec succès'
      
      // Retirer de la liste locale si elle existe
      if (activitesGenerales.value.length > 0) {
        activitesGenerales.value = activitesGenerales.value.filter(a => a.id !== activiteId)
      }
      
      if (import.meta.dev) {
        console.log('🟢 Activité générale supprimée:', activiteId)
      }
      
      return { success: true }
      
    } catch (err) {
      error.value = err.message || 'Erreur lors de la suppression de l\'activité générale'
      console.error('❌ Erreur lors de la suppression de l\'activité générale:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Helper pour obtenir le nom d'affichage d'un qualiticient
  const getQualiticiendDisplayName = (qualiticient) => {
    if (import.meta.dev) {
      console.log('🔍 getQualiticiendDisplayName input:', qualiticient)
    }
    
    // Si c'est un objet avec name et surname
    if (typeof qualiticient === 'object' && qualiticient && qualiticient.name && qualiticient.surname) {
      return `${qualiticient.name} ${qualiticient.surname}`
    }
    
    // Si c'est un ID (number ou string), chercher dans la liste des qualiticiens
    const qualiticiendId = typeof qualiticient === 'object' && qualiticient ? qualiticient.id : qualiticient
    
    if (qualiticiendId && qualiticiens.value && qualiticiens.value.length > 0) {
      const foundQualiticient = qualiticiens.value.find(q => q.id === qualiticiendId || q.id === parseInt(qualiticiendId))
      
      if (foundQualiticient) {
        if (import.meta.dev) {
          console.log('🟢 Qualiticient trouvé:', foundQualiticient)
        }
        return `${foundQualiticient.name} ${foundQualiticient.surname}`
      }
    }
    
    // Fallback
    if (import.meta.dev) {
      console.log('❌ Qualiticient non trouvé pour:', qualiticiendId, 'dans:', qualiticiens.value)
    }
    return `Qualiticient ID: ${qualiticiendId}`
  }

  return {
    // État
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    success: computed(() => success.value),
    qualiticiensLoading: computed(() => qualiticiensLoading.value),
    qualiticiens: computed(() => qualiticiens.value),
    activitesGenerales: computed(() => activitesGenerales.value),
    activitesGeneralesLoading: computed(() => activitesGeneralesLoading.value),
    currentActiviteGenerale: computed(() => currentActiviteGenerale.value),
    activiteGeneraleLoading: computed(() => activiteGeneraleLoading.value),

    // Méthodes
    fetchQualiticiens,
    fetchActivitesGenerales,
    fetchActiviteGenerale,
    createActiviteGenerale,
    updateActiviteGenerale,
    deleteActiviteGenerale,
    validateActiviteGenerale,
    getQualiticiendDisplayName,
    clearMessages
  }
}
