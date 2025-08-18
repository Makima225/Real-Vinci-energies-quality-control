<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3">
        <h3 class="text-lg font-bold text-gray-900">Créer un sous-projet</h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>

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

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Titre du sous-projet -->
        <div>
          <label for="titre" class="block text-sm font-medium text-gray-700 mb-1">
            Titre du sous-projet *
          </label>
          <input
            id="titre"
            v-model="form.titre"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le titre du sous-projet"
          />
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
              v-for="user in chefProjets" 
              :key="user.id" 
              :value="user.id"
            >
              {{ user.name }} {{ user.surname }}
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
              v-for="user in ingenieurTravaux" 
              :key="user.id" 
              :value="user.id"
            >
              {{ user.name }} {{ user.surname }}
            </option>
          </select>
        </div>

        <!-- Boutons -->
        <div class="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading || !form.titre"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useSousProjetManagement } from '~/composables/useSousProjetManagement'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  projetId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['close', 'created'])

// État du formulaire
const form = ref({
  titre: '',
  projet: props.projetId,
  chef_projet: '',
  ingenieur_travaux: ''
})

// Composable pour la gestion des sous-projets
const {
  loading,
  error,
  success,
  usersLoading,
  chefProjets,
  ingenieurTravaux,
  fetchUsers,
  createSousProjet,
  validateSousProjet,
  clearMessages
} = useSousProjetManagement()

// Gérer la soumission du formulaire
const handleSubmit = async () => {
  // Validation côté client
  const validation = validateSousProjet(form.value)
  if (!validation.isValid) {
    error.value = Object.values(validation.errors)[0]
    return
  }

  // Préparer les données
  const sousProjetData = {
    titre: form.value.titre.trim(),
    projet: parseInt(props.projetId),
    chef_projet: form.value.chef_projet || null,
    ingenieur_travaux: form.value.ingenieur_travaux || null
  }

  const result = await createSousProjet(sousProjetData)

  if (result.success) {
    // Réinitialiser le formulaire
    form.value = {
      titre: '',
      projet: props.projetId,
      chef_projet: '',
      ingenieur_travaux: ''
    }
    
    // Émettre l'événement de création et fermer la modal
    emit('created', result.sousProjet)
    emit('close')
  }
}

// Gérer l'ouverture/fermeture de la modal
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // Charger les utilisateurs quand la modale s'ouvre
    fetchUsers()
    clearMessages()
  } else {
    // Réinitialiser le formulaire quand la modale se ferme
    form.value = {
      titre: '',
      projet: props.projetId,
      chef_projet: '',
      ingenieur_travaux: ''
    }
    clearMessages()
  }
})
</script>
