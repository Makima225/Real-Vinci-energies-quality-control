// composables/useSousProjetManagement.js
import { ref, computed } from 'vue'
import { useFetchAPI } from './useFetchAPI'

export function useSousProjetManagement() {
  const api = useFetchAPI()
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  // État pour les sous-projets
  const sousProjets = ref([])
  const sousProjetsLoading = ref(false)
  
  // État pour un sous-projet spécifique
  const currentSousProjet = ref(null)
  const sousProjetLoading = ref(false)

  // État pour les utilisateurs
  const chefProjets = ref([])
  const ingenieurTravaux = ref([])
  const usersLoading = ref(false)

  // Récupérer la liste des chefs de projet
  const fetchChefProjets = async () => {
    usersLoading.value = true
    error.value = ''
    
    try {
      const response = await api.get('users/detail/by-role/chef de projet/')
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Transformer les données pour le select
      chefProjets.value = data.map(user => ({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        label: `${user.name} ${user.surname}`,
        value: user.id
      }))
      
      if (import.meta.dev) {
        console.log('🟢 Chefs de projet récupérés:', chefProjets.value)
      }
      
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération des chefs de projet'
      console.error('❌ Erreur lors de la récupération des chefs de projet:', err)
    } finally {
      usersLoading.value = false
    }
  }

  // Récupérer la liste des ingénieurs travaux
  const fetchIngenieurTravaux = async () => {
    usersLoading.value = true
    error.value = ''
    
    try {
      const response = await api.get('users/detail/by-role/ingenieur travaux/')
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Transformer les données pour le select
      ingenieurTravaux.value = data.map(user => ({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        label: `${user.name} ${user.surname}`,
        value: user.id
      }))
      
      if (import.meta.dev) {
        console.log('🟢 Ingénieurs travaux récupérés:', ingenieurTravaux.value)
      }
      
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération des ingénieurs travaux'
      console.error('❌ Erreur lors de la récupération des ingénieurs travaux:', err)
    } finally {
      usersLoading.value = false
    }
  }

  // Charger tous les utilisateurs nécessaires
  const fetchUsers = async () => {
    usersLoading.value = true
    
    try {
      // Charger les deux types d'utilisateurs en parallèle
      await Promise.all([
        fetchChefProjets(),
        fetchIngenieurTravaux()
      ])
    } finally {
      usersLoading.value = false
    }
  }

  // Créer un sous-projet
  const createSousProjet = async (sousProjetData) => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      const response = await api.post('sous-projects/create/', {
        titre: sousProjetData.titre,
        projet: sousProjetData.projet,
        chef_projet: sousProjetData.chef_projet || null,
        ingenieur_travaux: sousProjetData.ingenieur_travaux || null
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Gestion des erreurs spécifiques
        if (response.status === 400) {
          if (errorData.titre) {
            throw new Error(`Titre: ${errorData.titre[0]}`)
          }
          if (errorData.projet) {
            throw new Error(`Projet: ${errorData.projet[0]}`)
          }
          if (errorData.chef_projet) {
            throw new Error(`Chef de projet: ${errorData.chef_projet[0]}`)
          }
          if (errorData.ingenieur_travaux) {
            throw new Error(`Ingénieur travaux: ${errorData.ingenieur_travaux[0]}`)
          }
          if (errorData.detail) {
            throw new Error(errorData.detail)
          }
          throw new Error('Données invalides')
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const newSousProjet = await response.json()
      success.value = `Sous-projet "${newSousProjet.titre}" créé avec succès`
      
      if (import.meta.dev) {
        console.log('🟢 Sous-projet créé:', newSousProjet)
      }

      return { success: true, sousProjet: newSousProjet }

    } catch (err) {
      error.value = err.message || 'Erreur lors de la création du sous-projet'
      console.error('❌ Erreur lors de la création:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Récupérer les sous-projets d'un projet
  const fetchSousProjets = async (projetId) => {
    sousProjetsLoading.value = true
    error.value = ''
    
    try {
      const response = await api.get(`sous-projects/list/?projet=${projetId}`)
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      sousProjets.value = data
      
      if (import.meta.dev) {
        console.log('🟢 Sous-projets récupérés:', sousProjets.value)
      }
      
      return { success: true, sousProjets: data }
      
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération des sous-projets'
      console.error('❌ Erreur lors de la récupération des sous-projets:', err)
      return { success: false, error: err.message }
    } finally {
      sousProjetsLoading.value = false
    }
  }

  // Récupérer les détails d'un sous-projet
  const fetchSousProjet = async (sousProjetId) => {
    sousProjetLoading.value = true
    error.value = ''
    currentSousProjet.value = null
    
    try {
      const response = await api.get(`sous-projects/detail/${sousProjetId}/`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Sous-projet introuvable')
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      currentSousProjet.value = data
      
      if (import.meta.dev) {
        console.log('🟢 Sous-projet récupéré:', data)
      }

      return { success: true, sousProjet: data }

    } catch (err) {
      console.error('❌ Erreur lors de la récupération du sous-projet:', err)
      error.value = err.message || 'Erreur lors de la récupération du sous-projet'
      return { success: false, error: err.message }
    } finally {
      sousProjetLoading.value = false
    }
  }

  // Supprimer un sous-projet
  const deleteSousProjet = async (sousProjetId) => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      const response = await api.delete(`sous-projects/delete/${sousProjetId}/`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Sous-projet non trouvé')
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      success.value = 'Sous-projet supprimé avec succès'
      
      if (import.meta.dev) {
        console.log('🟢 Sous-projet supprimé:', sousProjetId)
      }

      return { success: true }

    } catch (err) {
      error.value = err.message || 'Erreur lors de la suppression du sous-projet'
      console.error('❌ Erreur lors de la suppression:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Modifier un sous-projet
  const updateSousProjet = async (sousProjetId, sousProjetData) => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      const response = await api.put(`sous-projects/update/${sousProjetId}/`, {
        titre: sousProjetData.titre,
        projet: sousProjetData.projet,
        chef_projet: sousProjetData.chef_projet || null,
        ingenieur_travaux: sousProjetData.ingenieur_travaux || null
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Gestion des erreurs spécifiques
        if (response.status === 400) {
          if (errorData.titre) {
            throw new Error(`Titre: ${errorData.titre[0]}`)
          }
          if (errorData.projet) {
            throw new Error(`Projet: ${errorData.projet[0]}`)
          }
          if (errorData.chef_projet) {
            throw new Error(`Chef de projet: ${errorData.chef_projet[0]}`)
          }
          if (errorData.ingenieur_travaux) {
            throw new Error(`Ingénieur travaux: ${errorData.ingenieur_travaux[0]}`)
          }
          if (errorData.detail) {
            throw new Error(errorData.detail)
          }
          throw new Error('Données invalides')
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const updatedSousProjet = await response.json()
      success.value = `Sous-projet "${updatedSousProjet.titre}" modifié avec succès`
      
      if (import.meta.dev) {
        console.log('🟢 Sous-projet modifié:', updatedSousProjet)
      }

      return { success: true, sousProjet: updatedSousProjet }

    } catch (err) {
      error.value = err.message || 'Erreur lors de la modification du sous-projet'
      console.error('❌ Erreur lors de la modification:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Valider les données sous-projet
  const validateSousProjet = (sousProjetData) => {
    const errors = {}

    // Validation titre
    if (!sousProjetData.titre?.trim()) {
      errors.titre = 'Le titre est requis'
    } else if (sousProjetData.titre.trim().length > 100) {
      errors.titre = 'Le titre ne peut pas dépasser 100 caractères'
    }

    // Validation projet
    if (!sousProjetData.projet) {
      errors.projet = 'Le projet parent est requis'
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
    usersLoading: computed(() => usersLoading.value),
    chefProjets: computed(() => chefProjets.value),
    ingenieurTravaux: computed(() => ingenieurTravaux.value),
    sousProjets: computed(() => sousProjets.value),
    sousProjetsLoading: computed(() => sousProjetsLoading.value),
    currentSousProjet: computed(() => currentSousProjet.value),
    sousProjetLoading: computed(() => sousProjetLoading.value),

    // Méthodes
    fetchUsers,
    fetchChefProjets,
    fetchIngenieurTravaux,
    fetchSousProjets,
    fetchSousProjet,
    createSousProjet,
    updateSousProjet,
    deleteSousProjet,
    validateSousProjet,
    clearMessages
  }
}
