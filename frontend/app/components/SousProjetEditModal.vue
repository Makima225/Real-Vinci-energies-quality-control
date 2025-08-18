<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <!-- En-tête -->
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Modifier le sous-projet
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
              Titre du sous-projet *
            </label>
            <input
              id="titre"
              v-model="form.titre"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': validationErrors.titre }"
              placeholder="Entrez le titre du sous-projet"
            />
            <p v-if="validationErrors.titre" class="mt-1 text-sm text-red-600">
              {{ validationErrors.titre }}
            </p>
          </div>

          <!-- Chef de projet -->
          <div>
            <label for="chef_projet" class="block text-sm font-medium text-gray-700 mb-1">
              Chef de projet
            </label>
            <select
              id="chef_projet"
              v-model="form.chef_projet"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner un chef de projet</option>
              <option 
                v-for="chef in chefProjets" 
                :key="chef.id" 
                :value="chef.id"
              >
                {{ chef.name }} {{ chef.surname }}
                <span v-if="chef.email" class="text-gray-500">({{ chef.email }})</span>
              </option>
            </select>
          </div>

          <!-- Ingénieur travaux -->
          <div>
            <label for="ingenieur_travaux" class="block text-sm font-medium text-gray-700 mb-1">
              Ingénieur travaux
            </label>
            <select
              id="ingenieur_travaux"
              v-model="form.ingenieur_travaux"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner un ingénieur travaux</option>
              <option 
                v-for="ingenieur in ingenieurTravaux" 
                :key="ingenieur.id" 
                :value="ingenieur.id"
              >
                {{ ingenieur.name }} {{ ingenieur.surname }}
                <span v-if="ingenieur.email" class="text-gray-500">({{ ingenieur.email }})</span>
              </option>
            </select>
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
import { useSousProjetManagement } from '~/composables/useSousProjetManagement'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  sousProjet: {
    type: Object,
    default: null
  },
  projetId: {
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
  chefProjets,
  ingenieurTravaux,
  usersLoading,
  updateSousProjet,
  fetchUsers,
  validateSousProjet,
  clearMessages
} = useSousProjetManagement()

// État du formulaire
const form = ref({
  titre: '',
  chef_projet: '',
  ingenieur_travaux: ''
})

const validationErrors = ref({})

// Initialiser le formulaire avec les données du sous-projet
const initializeForm = () => {
  if (props.sousProjet) {
    form.value = {
      titre: props.sousProjet.titre || '',
      chef_projet: props.sousProjet.chef_projet || '',
      ingenieur_travaux: props.sousProjet.ingenieur_travaux || ''
    }
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    titre: '',
    chef_projet: '',
    ingenieur_travaux: ''
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
  // Validation
  const validation = validateSousProjet({
    ...form.value,
    projet: props.projetId
  })

  if (!validation.isValid) {
    validationErrors.value = validation.errors
    return
  }

  validationErrors.value = {}

  // Modification du sous-projet
  const result = await updateSousProjet(props.sousProjet.id, {
    ...form.value,
    projet: props.projetId
  })

  if (result.success) {
    // Émettre l'événement avec les données mises à jour
    emit('updated', result.sousProjet)
    
    // Fermer le modal après un délai court pour voir le message de succès
    setTimeout(() => {
      closeModal()
    }, 1500)
  }
}

// Watchers
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Charger les utilisateurs et initialiser le formulaire quand le modal s'ouvre
    fetchUsers()
    initializeForm()
  } else {
    // Réinitialiser quand le modal se ferme
    resetForm()
  }
})

watch(() => props.sousProjet, () => {
  if (props.isOpen && props.sousProjet) {
    initializeForm()
  }
})
</script>
