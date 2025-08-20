<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <!-- En-tête -->
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Supprimer l'activité générale
          </h3>
          <button 
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Messages d'erreur ou de succès -->
        <div v-if="success" class="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">{{ success }}</p>
            </div>
          </div>
        </div>

        <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Contenu du modal -->
        <div class="text-center">
          <!-- Icône d'avertissement -->
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>

          <!-- Message principal -->
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Êtes-vous sûr de vouloir supprimer cette activité générale ?
          </h3>

          <!-- Détails de l'activité générale -->
          <div v-if="activiteGenerale" class="bg-gray-50 rounded-lg p-4 mb-4 text-left">
            <div class="space-y-2">
              <div>
                <span class="text-sm font-medium text-gray-600">Titre :</span>
                <span class="text-sm text-gray-900 ml-2">{{ activiteGenerale.titre }}</span>
              </div>
              
              <div v-if="activiteGenerale.qualiticient && activiteGenerale.qualiticient.length > 0">
                <span class="text-sm font-medium text-gray-600">Qualiticiens assignés :</span>
                <div class="mt-1 flex flex-wrap gap-1">
                  <span 
                    v-for="qualiticient in activiteGenerale.qualiticient" 
                    :key="qualiticient.id || qualiticient"
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ getQualiticiendName(qualiticient) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Message d'avertissement -->
          <p class="text-sm text-gray-500 mb-6">
            Cette action est irréversible. Toutes les données associées à cette activité générale seront définitivement supprimées.
          </p>

          <!-- Boutons d'action -->
          <div class="flex justify-center space-x-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="button"
              @click="handleDelete"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Suppression...
              </span>
              <span v-else>Supprimer définitivement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useActiviteGeneraleManagement } from '~/composables/useActiviteGeneraleManagement'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  activiteGenerale: {
    type: Object,
    default: null
  }
})

// Events
const emit = defineEmits(['close', 'deleted'])

// Composable
const {
  loading,
  error,
  success,
  deleteActiviteGenerale,
  getQualiticiendDisplayName,
  clearMessages
} = useActiviteGeneraleManagement()

// Obtenir le nom d'un qualiticient
const getQualiticiendName = (qualiticient) => {
  return getQualiticiendDisplayName(qualiticient)
}

// Fermer le modal
const closeModal = () => {
  clearMessages()
  emit('close')
}

// Supprimer l'activité générale
const handleDelete = async () => {
  if (!props.activiteGenerale?.id) {
    error.value = 'Aucune activité générale à supprimer'
    return
  }

  const result = await deleteActiviteGenerale(props.activiteGenerale.id)

  if (result.success) {
    // Émettre l'événement avec les données supprimées
    emit('deleted', props.activiteGenerale)
    
    // Fermer le modal après un délai court pour voir le message de succès
    setTimeout(() => {
      closeModal()
    }, 1500)
  }
}

// Watchers
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    // Réinitialiser les messages quand le modal se ferme
    clearMessages()
  }
})
</script>
