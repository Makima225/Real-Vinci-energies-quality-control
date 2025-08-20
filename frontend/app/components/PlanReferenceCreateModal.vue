<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b">
        <h3 class="text-lg font-medium text-gray-900">Ajouter un plan de référence</h3>
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

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="mt-6">
        <div class="space-y-4">
          <!-- Nom du plan -->
          <div>
            <label for="nom" class="block text-sm font-medium text-gray-700 mb-1">
              Nom du plan <span class="text-red-500">*</span>
            </label>
            <input
              id="nom"
              v-model="form.nom"
              type="text"
              required
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez le nom du plan de référence"
            >
            <div v-if="validationErrors.nom" class="mt-1 text-sm text-red-600">
              {{ validationErrors.nom }}
            </div>
          </div>

          <!-- Fichier plan -->
          <div>
            <label for="plan" class="block text-sm font-medium text-gray-700 mb-1">
              Fichier du plan <span class="text-red-500">*</span>
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label for="plan" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Télécharger un fichier</span>
                    <input
                      id="plan"
                      ref="fileInput"
                      type="file"
                      class="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
                      @change="handleFileChange"
                    >
                  </label>
                  <p class="pl-1">ou glisser-déposer</p>
                </div>
                <p class="text-xs text-gray-500">PDF, JPG, PNG, DWG, DXF jusqu'à 10MB</p>
              </div>
            </div>
            
            <!-- Fichier sélectionné -->
            <div v-if="selectedFile" class="mt-2 flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
              <span>{{ selectedFile.name }}</span>
              <button 
                type="button"
                @click="removeFile"
                class="ml-2 text-red-500 hover:text-red-700"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
            
            <div v-if="validationErrors.plan" class="mt-1 text-sm text-red-600">
              {{ validationErrors.plan }}
            </div>
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
            type="submit"
            :disabled="planReferenceLoading || !form.nom || !selectedFile"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="planReferenceLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création...
            </span>
            <span v-else>Créer le plan</span>
          </button>
        </div>
      </form>
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
  activiteSpecifiqueId: {
    type: [String, Number],
    required: true
  }
})

// Émissions
const emit = defineEmits(['close', 'created'])

// Composable pour la gestion des plans de référence
const {
  planReferenceLoading,
  error,
  createPlanReference,
  validatePlanReference,
  clearMessages
} = usePlanReferenceManagement()

// État du formulaire
const form = ref({
  nom: '',
  activite_specifique: props.activiteSpecifiqueId
})

const selectedFile = ref(null)
const validationErrors = ref({})
const fileInput = ref(null)

// Gérer le changement de fichier
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Vérifier la taille du fichier (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      validationErrors.value.plan = 'Le fichier ne peut pas dépasser 10MB'
      return
    }
    
    selectedFile.value = file
    validationErrors.value.plan = ''
  }
}

// Supprimer le fichier sélectionné
const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Soumission du formulaire
const handleSubmit = async () => {
  validationErrors.value = {}
  clearMessages()

  // Validation locale
  if (!form.value.nom.trim()) {
    validationErrors.value.nom = 'Le nom est requis'
    return
  }

  if (!selectedFile.value) {
    validationErrors.value.plan = 'Un fichier est requis'
    return
  }

  // Préparer les données
  const planReferenceData = {
    nom: form.value.nom.trim(),
    plan: selectedFile.value,
    activite_specifique: props.activiteSpecifiqueId
  }

  if (import.meta.dev) {
    console.log('🔄 Création plan de référence:', planReferenceData.nom)
  }

  // Créer le plan de référence
  const result = await createPlanReference(planReferenceData)
  
  if (result.success) {
    if (import.meta.dev) {
      console.log('🟢 Plan de référence créé avec succès')
    }
    
    emit('created', result.data)
    handleClose()
  } else {
    if (import.meta.dev) {
      console.error('❌ Erreur création plan de référence:', result.error)
    }
  }
}

// Fermer le modal
const handleClose = () => {
  // Réinitialiser le formulaire
  form.value = {
    nom: '',
    activite_specifique: props.activiteSpecifiqueId
  }
  selectedFile.value = null
  validationErrors.value = {}
  clearMessages()
  
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  
  emit('close')
}

// Surveiller les changements de props
watch(() => props.activiteSpecifiqueId, (newId) => {
  form.value.activite_specifique = newId
})

// Nettoyer les messages quand le modal s'ouvre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    clearMessages()
    validationErrors.value = {}
  }
})
</script>
