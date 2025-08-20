<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <!-- En-tête -->
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Modifier l'activité générale
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

        <!-- Formulaire -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Titre -->
          <div>
            <label for="titre" class="block text-sm font-medium text-gray-700 mb-1">
              Titre de l'activité générale *
            </label>
            <input
              id="titre"
              v-model="form.titre"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': validationErrors.titre }"
              placeholder="Entrez le titre de l'activité générale"
            />
            <p v-if="validationErrors.titre" class="mt-1 text-sm text-red-600">
              {{ validationErrors.titre }}
            </p>
          </div>

          <!-- Qualiticiens (sélection multiple) -->
          <div>
            <label for="qualiticient" class="block text-sm font-medium text-gray-700 mb-1">
              Qualiticiens
            </label>
            <div class="relative">
              <select
                id="qualiticient"
                v-model="form.qualiticient"
                multiple
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                size="4"
              >
                <option 
                  v-for="qualiticient in qualiticiens" 
                  :key="qualiticient.id" 
                  :value="qualiticient.id"
                >
                  {{ qualiticient.name }} {{ qualiticient.surname }}
                  <span v-if="qualiticient.email" class="text-gray-500">({{ qualiticient.email }})</span>
                </option>
              </select>
              <p class="mt-1 text-xs text-gray-500">
                Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs qualiticiens
              </p>
            </div>
          </div>

          <!-- Affichage des qualiticiens sélectionnés -->
          <div v-if="form.qualiticient.length > 0" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Qualiticiens sélectionnés ({{ form.qualiticient.length }})
            </label>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="qualiticiendId in form.qualiticient" 
                :key="qualiticiendId"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ getQualiticiendLabel(qualiticiendId) }}
                <button
                  type="button"
                  @click="removeQualiticient(qualiticiendId)"
                  class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </span>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Modification...
              </span>
              <span v-else>Modifier</span>
            </button>
          </div>
        </form>
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
  },
  sousProjetId: {
    type: [String, Number],
    required: true
  }
})

// Events
const emit = defineEmits(['close', 'updated'])

// Composable
const {
  loading,
  error,
  success,
  qualiticiens,
  qualiticiensLoading,
  updateActiviteGenerale,
  fetchQualiticiens,
  validateActiviteGenerale,
  getQualiticiendDisplayName,
  clearMessages
} = useActiviteGeneraleManagement()

// État du formulaire
const form = ref({
  titre: '',
  qualiticient: []
})

const validationErrors = ref({})

// Initialiser le formulaire avec les données de l'activité
const initializeForm = () => {
  if (props.activiteGenerale) {
    form.value = {
      titre: props.activiteGenerale.titre || '',
      qualiticient: props.activiteGenerale.qualiticient?.map(q => q.id || q) || []
    }
  }
}

// Obtenir le label d'un qualiticient sélectionné
const getQualiticiendLabel = (qualiticiendId) => {
  return getQualiticiendDisplayName(qualiticiendId)
}

// Supprimer un qualiticient de la sélection
const removeQualiticient = (qualiticiendId) => {
  form.value.qualiticient = form.value.qualiticient.filter(id => id !== qualiticiendId)
}

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    titre: '',
    qualiticient: []
  }
  validationErrors.value = {}
  clearMessages()
}

// Fermer le modal
const closeModal = () => {
  resetForm()
  emit('close')
}

// Soumettre le formulaire
const handleSubmit = async () => {
  if (!props.activiteGenerale?.id) {
    error.value = 'Aucune activité générale à modifier'
    return
  }

  // Validation
  const validation = validateActiviteGenerale({
    ...form.value,
    sous_projet: props.sousProjetId
  })

  if (!validation.isValid) {
    validationErrors.value = validation.errors
    return
  }

  validationErrors.value = {}

  // Modification de l'activité générale
  const result = await updateActiviteGenerale(props.activiteGenerale.id, {
    ...form.value,
    sous_projet: props.sousProjetId
  })

  if (result.success) {
    // Émettre l'événement avec les données modifiées
    emit('updated', result.activiteGenerale)
    
    // Fermer le modal après un délai court pour voir le message de succès
    setTimeout(() => {
      closeModal()
    }, 1500)
  }
}

// Watchers
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Charger les qualiticiens et initialiser le formulaire quand le modal s'ouvre
    fetchQualiticiens()
    initializeForm()
  } else {
    // Réinitialiser quand le modal se ferme
    resetForm()
  }
})

watch(() => props.activiteGenerale, () => {
  if (props.isOpen && props.activiteGenerale) {
    initializeForm()
  }
})
</script>
