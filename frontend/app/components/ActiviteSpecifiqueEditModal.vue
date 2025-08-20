<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity" @click="closeModal"></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Modifier l'activité spécifique
            </h3>
            <button 
              @click="closeModal" 
              class="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleSubmit" class="px-6 py-4">
          <!-- Messages d'erreur -->
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

          <!-- Champ titre -->
          <div class="mb-4">
            <label for="titre" class="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'activité spécifique *
            </label>
            <input
              id="titre"
              v-model="form.titre"
              type="text"
              required
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{
                'border-red-300 focus:border-red-500 focus:ring-red-500': formErrors.titre
              }"
              placeholder="Entrez le titre de l'activité spécifique"
              :disabled="loading"
            />
            <p v-if="formErrors.titre" class="mt-1 text-sm text-red-600">
              {{ formErrors.titre }}
            </p>
          </div>

          <!-- Information sur l'activité générale parent -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Activité générale parent
            </label>
            <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
              Cette activité spécifique est rattachée à l'activité générale actuelle
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="loading"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              :disabled="loading || !form.titre?.trim()"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Modification...' : 'Modifier l\'activité' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useActiviteSpecifiqueManagement } from '~/composables/useActiviteSpecifiqueManagement'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  activiteSpecifique: {
    type: Object,
    default: null
  },
  activiteGeneraleId: {
    type: [Number, String],
    required: true
  }
})

// Events
const emit = defineEmits(['close', 'updated'])

// Composable pour la gestion des activités spécifiques
const {
  updateActiviteSpecifique,
  validateActiviteSpecifique,
  activiteSpecifiqueLoading,
  error,
  clearMessages
} = useActiviteSpecifiqueManagement()

// État du formulaire
const form = reactive({
  titre: '',
  activite_generale: null
})

// État des erreurs de validation
const formErrors = ref({})

// État de chargement local
const loading = ref(false)

// Mettre à jour l'ID de l'activité générale quand les props changent
watch(() => props.activiteGeneraleId, (newId) => {
  form.activite_generale = newId
}, { immediate: true })

// Pré-remplir le formulaire quand l'activité spécifique change
watch(() => props.activiteSpecifique, (newActiviteSpecifique) => {
  if (newActiviteSpecifique) {
    form.titre = newActiviteSpecifique.titre
    form.activite_generale = newActiviteSpecifique.activite_generale
  }
}, { immediate: true, deep: true })

// Réinitialiser le formulaire quand la modal s'ouvre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
    clearMessages()
  }
})

// Fonction pour réinitialiser le formulaire
const resetForm = () => {
  if (props.activiteSpecifique) {
    form.titre = props.activiteSpecifique.titre
    form.activite_generale = props.activiteSpecifique.activite_generale
  }
  formErrors.value = {}
}

// Fonction pour fermer la modal
const closeModal = () => {
  if (!loading.value) {
    emit('close')
  }
}

// Fonction pour gérer la soumission du formulaire
const handleSubmit = async () => {
  // Validation côté client
  const validation = validateActiviteSpecifique(form)
  formErrors.value = validation.errors

  if (!validation.isValid) {
    if (import.meta.dev) {
      console.log('❌ Erreurs de validation:', validation.errors)
    }
    return
  }

  if (!props.activiteSpecifique?.id) {
    if (import.meta.dev) {
      console.error('❌ ID de l\'activité spécifique manquant')
    }
    return
  }

  loading.value = true

  try {
    if (import.meta.dev) {
      console.log('🔄 Soumission modification activité spécifique:', form.titre)
    }

    const result = await updateActiviteSpecifique(props.activiteSpecifique.id, {
      titre: form.titre,
      activite_generale: form.activite_generale
    })

    if (result.success) {
      if (import.meta.dev) {
        console.log('🟢 Activité spécifique modifiée avec succès:', result.data)
      }

      // Émettre l'événement de mise à jour avec les données
      emit('updated', result.data)
      
      // Fermer la modal
      emit('close')
    }
  } catch (err) {
    if (import.meta.dev) {
      console.error('❌ Erreur lors de la modification:', err)
    }
  } finally {
    loading.value = false
  }
}

// Exposer les méthodes pour les tests
defineExpose({
  resetForm,
  handleSubmit
})
</script>
