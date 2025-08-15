<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header avec navigation -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Breadcrumb -->
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <button 
                  @click="navigateTo('/admin')"
                  class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Administration
                </button>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    Détails du projet
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <button 
              v-if="currentProject"
              @click="handleEditProject"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Modifier
            </button>
            
            <button 
              v-if="currentProject"
              @click="handleDeleteProject"
              class="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="success" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div class="bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{{ success }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button @click="clearMessages" type="button" class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button @click="clearMessages" type="button" class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- État de chargement -->
      <div v-if="projectLoading" class="flex items-center justify-center py-12">
        <div class="flex items-center">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-lg text-gray-600">Chargement du projet...</span>
        </div>
      </div>

      <!-- Détails du projet -->
      <div v-else-if="currentProject" class="space-y-8">
        <!-- Informations du projet -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ currentProject.titre }}</h1>
                <p class="mt-1 text-sm text-gray-500">Informations du projet</p>
              </div>
              <div class="flex-shrink-0">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Actif
                </span>
              </div>
            </div>
          </div>
          <div class="px-6 py-5">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Titre du projet</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentProject.titre }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Client</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentProject.client }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Emplacement</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentProject.Emplacement }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Référence affaire</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentProject.Reference_affaire }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Coordonnateur</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <div v-if="currentProject.coordonnateur_details" class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-blue-600">
                          {{ currentProject.coordonnateur_details.name?.charAt(0) }}{{ currentProject.coordonnateur_details.surname?.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">
                        {{ currentProject.coordonnateur_details.name }} {{ currentProject.coordonnateur_details.surname }}
                      </p>
                      <p class="text-sm text-gray-500">{{ currentProject.coordonnateur_details.email }}</p>
                    </div>
                  </div>
                  <span v-else class="text-gray-500 italic">Non assigné</span>
                </dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Date de création</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ formatDate(currentProject.created_at) }}
                </dd>
              </div>
              
              <div v-if="currentProject.updated_at !== currentProject.created_at">
                <dt class="text-sm font-medium text-gray-500">Dernière modification</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ formatDate(currentProject.updated_at) }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Section vide pour futurs développements -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Section disponible
            </h3>
          </div>
          <div class="px-6 py-5">
            <!-- Contenu à ajouter selon vos besoins -->
          </div>
        </div>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="error && !projectLoading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Erreur de chargement</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <button 
            @click="loadProject"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de modification -->
    <ProjectEditModal
      :is-open="isEditModalOpen"
      :project="currentProject"
      @close="closeEditModal"
      @updated="handleProjectUpdated"
    />

    <!-- Modal de suppression -->
    <ProjectDeleteModal
      :is-open="isDeleteModalOpen"
      :project="currentProject"
      @close="closeDeleteModal"
      @deleted="handleProjectDeleted"
    />
  </div>
</template>
<style scoped>
/* Styles pour l'affichage des détails du projet */
</style>
<script setup>
import { useProjectManagement } from '~/composables/useProjectManagement'
import ProjectEditModal from '~/components/ProjectEditModal.vue'
import ProjectDeleteModal from '~/components/ProjectDeleteModal.vue'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// Récupérer l'ID du projet depuis l'URL
const route = useRoute()
const projectId = route.params.id

// Titre dynamique de la page
const pageTitle = ref('Détails du projet')

// Composable pour la gestion des projets
const {
  currentProject,
  projectLoading,
  error,
  success,
  fetchProject,
  deleteProject,
  clearMessages
} = useProjectManagement()

// État des modals
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

// Charger le projet
const loadProject = async () => {
  const result = await fetchProject(projectId)
  if (result.success && currentProject.value) {
    pageTitle.value = `${currentProject.value.titre} - Détails`
  }
}

// Formatage des dates
const formatDate = (dateString) => {
  if (!dateString) return 'Non spécifié'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Handlers pour les actions
const handleEditProject = () => {
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const handleProjectUpdated = async (updatedProject) => {
  // Recharger le projet pour avoir les dernières données
  await loadProject()
}

const handleDeleteProject = () => {
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
}

const handleProjectDeleted = () => {
  // Rediriger vers la page d'administration après suppression
  navigateTo('/admin')
}

// Titre de la page avec meta
useHead({
  title: pageTitle
})

// Charger le projet au montage
onMounted(async () => {
  await loadProject()
})

// Valider que l'ID est un nombre
if (!projectId || isNaN(Number(projectId))) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Projet introuvable'
  })
}
</script>