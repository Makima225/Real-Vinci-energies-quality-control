<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b">
        <h3 class="text-lg font-medium text-gray-900">Supprimer le plan de référence</h3>
        <button 
          @click="handleClose"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>

      <!-- Messages d'erreur -->
      <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
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

      <!-- Contenu -->
      <div class="mt-6">
        <div class="flex items-center mb-4">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
        </div>
        
        <div class="text-center">
          <h4 class="text-lg font-medium text-gray-900 mb-2">
            Confirmer la suppression
          </h4>
          
          <p class="text-sm text-gray-500 mb-4">
            Êtes-vous sûr de vouloir supprimer ce plan de référence ?
          </p>

          <div v-if="planReference" class="bg-gray-50 rounded-lg p-3 mb-4">
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm font-medium text-gray-900">{{ planReference.nom }}</span>
            </div>
          </div>

          <p class="text-xs text-red-600">
            Cette action est irréversible. Le fichier et toutes les données associées seront définitivement supprimés.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end space-x-3 mt-6 pt-4 border-t">
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          type="button"
          @click="handleDelete"
          :disabled="planReferenceLoading"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="planReferenceLoading" class="flex items-center">
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
</template>

<script setup>
import { usePlanReferenceManagement } from '~/composables/usePlanReferenceManagement'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  planReference: {
    type: Object,
    required: true
  }
})

// Émissions
const emit = defineEmits(['close', 'deleted'])

// Composable pour la gestion des plans de référence
const {
  planReferenceLoading,
  error,
  deletePlanReference,
  clearMessages
} = usePlanReferenceManagement()

// Gérer la suppression
const handleDelete = async () => {
  clearMessages()

  if (!props.planReference?.id) {
    return
  }

  if (import.meta.dev) {
    console.log('🔄 Suppression plan de référence:', props.planReference.nom)
  }

  const result = await deletePlanReference(props.planReference.id)
  
  if (result.success) {
    if (import.meta.dev) {
      console.log('🟢 Plan de référence supprimé avec succès')
    }
    
    emit('deleted', props.planReference)
    handleClose()
  } else {
    if (import.meta.dev) {
      console.error('❌ Erreur suppression plan de référence:', result.error)
    }
  }
}

// Fermer le modal
const handleClose = () => {
  clearMessages()
  emit('close')
}

// Nettoyer les messages quand le modal s'ouvre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    clearMessages()
  }
})
</script>
