<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="closeModal"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <!-- Header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Modifier le projet
            </h3>
            <button 
              @click="closeModal"
              class="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Messages d'état -->
          <div v-if="success" class="mb-4 bg-green-50 border border-green-200 rounded-md p-3">
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

          <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
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
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Titre -->
            <FormInput
              v-model="form.titre"
              label="Titre du projet"
              placeholder="Nom du projet"
              required
              :error="validationErrors.titre"
            />

            <!-- Client -->
            <FormInput
              v-model="form.client"
              label="Client"
              placeholder="Nom du client"
              required
              :error="validationErrors.client"
            />

            <!-- Emplacement -->
            <FormInput
              v-model="form.emplacement"
              label="Emplacement"
              placeholder="Lieu du projet"
              required
              :error="validationErrors.emplacement"
            />

            <!-- Référence affaire -->
            <FormInput
              v-model="form.referenceAffaire"
              label="Référence affaire"
              placeholder="REF-2024-001"
              required
              :error="validationErrors.referenceAffaire"
            />

            <!-- Coordonnateur -->
            <BaseSelect
              v-model="form.coordonnateur"
              label="Coordonnateur"
              :options="coordonnateurs"
              placeholder="Sélectionnez un coordonnateur..."
              :loading="coordonnateurLoading"
              :error="validationErrors.coordonnateur"
            />
          </form>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="handleSubmit"
            :disabled="loading || !isFormValid"
            :class="[
              'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm transition-colors',
              loading || !isFormValid 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            ]"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Modification...' : 'Modifier le projet' }}
          </button>
          <button
            @click="closeModal"
            :disabled="loading"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { useProjectManagement } from '~/composables/useProjectManagement'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'updated'])

// Composable pour la gestion des projets
const {
  loading,
  error,
  success,
  coordonnateurs,
  coordonnateurLoading,
  fetchCoordonnateurs,
  updateProject,
  validateProject,
  clearMessages
} = useProjectManagement()

// État du formulaire
const form = reactive({
  titre: '',
  client: '',
  emplacement: '',
  referenceAffaire: '',
  coordonnateur: ''
})

// Erreurs de validation
const validationErrors = ref({})

// Valider le formulaire en temps réel
const isFormValid = computed(() => {
  const { isValid } = validateProject(form)
  return isValid && form.titre && form.client && form.emplacement && form.referenceAffaire
})

// Watcher pour pré-remplir le formulaire quand le projet change
watch(() => props.project, (newProject) => {
  if (newProject) {
    form.titre = newProject.titre || ''
    form.client = newProject.client || ''
    form.emplacement = newProject.Emplacement || ''
    form.referenceAffaire = newProject.Reference_affaire || ''
    form.coordonnateur = newProject.coordonnateur || ''
    validationErrors.value = {}
    clearMessages()
  }
}, { immediate: true })

// Watcher pour charger les coordonnateurs quand le modal s'ouvre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    fetchCoordonnateurs()
  }
})

// Gestion de la soumission du formulaire
const handleSubmit = async () => {
  // Valider le formulaire
  const { isValid, errors } = validateProject(form)
  validationErrors.value = errors

  if (!isValid) {
    return
  }

  // Modifier le projet
  const result = await updateProject(props.project.id, form)
  
  if (result.success) {
    // Émettre l'événement de mise à jour
    emit('updated', result.project)
    
    // Fermer le modal après un délai
    setTimeout(() => {
      closeModal()
    }, 1500)
  }
}

// Fermer le modal
const closeModal = () => {
  clearMessages()
  validationErrors.value = {}
  emit('close')
}
</script>
