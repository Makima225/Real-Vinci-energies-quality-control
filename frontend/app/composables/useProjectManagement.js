// composables/useProjectManagement.js
import { ref, computed } from 'vue'
import { useFetchAPI } from './useFetchAPI'

export function useProjectManagement() {
  const api = useFetchAPI()
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  // État pour les coordonnateurs
  const coordonnateurs = ref([])
  const coordonnateurLoading = ref(false)

  // Récupérer la liste des coordonnateurs
  const fetchCoordonnateurs = async () => {
    coordonnateurLoading.value = true
    error.value = ''
    
    try {
      const response = await api.get('users/detail/by-role/coordonnateur/')
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Transformer les données pour le select
      coordonnateurs.value = data.map(user => ({
        value: user.id,
        label: `${user.name} ${user.surname}`
      }))
      
      if (import.meta.dev) {
        console.log('🟢 Coordonnateurs récupérés:', coordonnateurs.value)
      }
      
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération des coordonnateurs'
      console.error('❌ Erreur lors de la récupération des coordonnateurs:', err)
    } finally {
      coordonnateurLoading.value = false
    }
  }

  // Créer un projet
  const createProject = async (projectData) => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      const response = await api.post('projects/create/', {
        titre: projectData.titre,
        client: projectData.client,
        Emplacement: projectData.emplacement,
        Reference_affaire: projectData.referenceAffaire,
        coordonnateur: projectData.coordonnateur || null
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Gestion des erreurs spécifiques
        if (response.status === 400) {
          if (errorData.titre) {
            throw new Error(`Titre: ${errorData.titre[0]}`)
          }
          if (errorData.client) {
            throw new Error(`Client: ${errorData.client[0]}`)
          }
          if (errorData.Emplacement) {
            throw new Error(`Emplacement: ${errorData.Emplacement[0]}`)
          }
          if (errorData.Reference_affaire) {
            throw new Error(`Référence affaire: ${errorData.Reference_affaire[0]}`)
          }
          if (errorData.coordonnateur) {
            throw new Error(`Coordonnateur: ${errorData.coordonnateur[0]}`)
          }
          if (errorData.detail) {
            throw new Error(errorData.detail)
          }
          throw new Error('Données invalides')
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const newProject = await response.json()
      success.value = `Projet "${newProject.titre}" créé avec succès`
      
      if (import.meta.dev) {
        console.log('🟢 Projet créé:', newProject)
      }

      return { success: true, project: newProject }

    } catch (err) {
      error.value = err.message || 'Erreur lors de la création du projet'
      console.error('❌ Erreur lors de la création:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Valider les données projet
  const validateProject = (projectData) => {
    const errors = {}

    // Validation titre
    if (!projectData.titre?.trim()) {
      errors.titre = 'Le titre est requis'
    } else if (projectData.titre.trim().length > 100) {
      errors.titre = 'Le titre ne peut pas dépasser 100 caractères'
    }

    // Validation client
    if (!projectData.client?.trim()) {
      errors.client = 'Le client est requis'
    } else if (projectData.client.trim().length > 100) {
      errors.client = 'Le nom du client ne peut pas dépasser 100 caractères'
    }

    // Validation emplacement
    if (!projectData.emplacement?.trim()) {
      errors.emplacement = 'L\'emplacement est requis'
    } else if (projectData.emplacement.trim().length > 100) {
      errors.emplacement = 'L\'emplacement ne peut pas dépasser 100 caractères'
    }

    // Validation référence affaire
    if (!projectData.referenceAffaire?.trim()) {
      errors.referenceAffaire = 'La référence affaire est requise'
    } else if (projectData.referenceAffaire.trim().length > 100) {
      errors.referenceAffaire = 'La référence affaire ne peut pas dépasser 100 caractères'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // État pour les projets
  const projects = ref([])
  const projectsLoading = ref(false)
  
  // État pour un projet spécifique
  const currentProject = ref(null)
  const projectLoading = ref(false)

  // Récupérer les détails d'un projet
  const fetchProject = async (projectId) => {
    projectLoading.value = true
    error.value = ''
    currentProject.value = null
    
    try {
      const response = await api.get(`projects/detail/${projectId}/`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Projet introuvable')
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      currentProject.value = data
      
      if (import.meta.dev) {
        console.log('🟢 Projet récupéré:', data)
      }

      return { success: true, project: data }

    } catch (err) {
      console.error('❌ Erreur lors de la récupération du projet:', err)
      error.value = err.message || 'Erreur lors de la récupération du projet'
      return { success: false, error: err.message }
    } finally {
      projectLoading.value = false
    }
  }

  // Récupérer la liste des projets
  const fetchProjects = async () => {
    projectsLoading.value = true
    error.value = ''
    
    try {
      const response = await api.get('projects/list/')
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      projects.value = data
      
      if (import.meta.dev) {
        console.log('🟢 Projets récupérés:', projects.value)
      }
      
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération des projets'
      console.error('❌ Erreur lors de la récupération des projets:', err)
    } finally {
      projectsLoading.value = false
    }
  }

  // Supprimer un projet
  const deleteProject = async (projectId) => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      const response = await api.delete(`projects/delete/${projectId}/`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Projet non trouvé')
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      success.value = 'Projet supprimé avec succès'
      
      if (import.meta.dev) {
        console.log('🟢 Projet supprimé:', projectId)
      }

      return { success: true }

    } catch (err) {
      error.value = err.message || 'Erreur lors de la suppression du projet'
      console.error('❌ Erreur lors de la suppression:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Modifier un projet
  const updateProject = async (projectId, projectData) => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      const response = await api.put(`projects/update/${projectId}/`, {
        titre: projectData.titre,
        client: projectData.client,
        Emplacement: projectData.emplacement,
        Reference_affaire: projectData.referenceAffaire,
        coordonnateur: projectData.coordonnateur || null
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Gestion des erreurs spécifiques
        if (response.status === 400) {
          if (errorData.titre) {
            throw new Error(`Titre: ${errorData.titre[0]}`)
          }
          if (errorData.client) {
            throw new Error(`Client: ${errorData.client[0]}`)
          }
          if (errorData.Emplacement) {
            throw new Error(`Emplacement: ${errorData.Emplacement[0]}`)
          }
          if (errorData.Reference_affaire) {
            throw new Error(`Référence affaire: ${errorData.Reference_affaire[0]}`)
          }
          if (errorData.coordonnateur) {
            throw new Error(`Coordonnateur: ${errorData.coordonnateur[0]}`)
          }
          if (errorData.detail) {
            throw new Error(errorData.detail)
          }
          throw new Error('Données invalides')
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const updatedProject = await response.json()
      success.value = `Projet "${updatedProject.titre}" modifié avec succès`
      
      // Recharger la liste des projets
      await fetchProjects()
      
      if (import.meta.dev) {
        console.log('🟢 Projet modifié:', updatedProject)
      }

      return { success: true, project: updatedProject }

    } catch (err) {
      error.value = err.message || 'Erreur lors de la modification du projet'
      console.error('❌ Erreur lors de la modification:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
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
    coordonnateurs: computed(() => coordonnateurs.value),
    coordonnateurLoading: computed(() => coordonnateurLoading.value),
    projects: computed(() => projects.value),
    projectsLoading: computed(() => projectsLoading.value),
    currentProject: computed(() => currentProject.value),
    projectLoading: computed(() => projectLoading.value),

    // Méthodes
    fetchCoordonnateurs,
    fetchProject,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    validateProject,
    clearMessages
  }
}
