<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la page -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Créer un projet</h1>
            <p class="mt-1 text-sm text-gray-600">Ajouter un nouveau projet au système</p>
          </div>
          
          <!-- Bouton retour -->
          <NuxtLink 
            to="/admin" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Retour au tableau de bord
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Messages d'état -->
      <div v-if="success" class="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
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
            <div class="-mx-1.5 -my-1.5">
              <button @click="clearMessages" type="button" class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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
            <div class="-mx-1.5 -my-1.5">
              <button @click="clearMessages" type="button" class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire -->
      <BaseForm
        title="Informations du projet"
        subtitle="Remplissez tous les champs pour créer un nouveau projet"
        :loading="loading"
        :disabled="!isFormValid"
        submit-text="Créer le projet"
        cancel-text="Annuler"
        @submit="handleSubmit"
        @cancel="handleCancel"
      >
        <div class="grid grid-cols-1 gap-6">
          <!-- Titre -->
          <FormInput
            v-model="form.titre"
            label="Titre du projet"
            placeholder="Nom du projet"
            required
            :error="validationErrors.titre"
            help-text="Maximum 100 caractères"
          />

          <!-- Client -->
          <FormInput
            v-model="form.client"
            label="Client"
            placeholder="Nom du client"
            required
            :error="validationErrors.client"
            help-text="Maximum 100 caractères"
          />

          <!-- Emplacement -->
          <FormInput
            v-model="form.emplacement"
            label="Emplacement"
            placeholder="Lieu du projet"
            required
            :error="validationErrors.emplacement"
            help-text="Maximum 100 caractères"
          />

          <!-- Référence affaire -->
          <FormInput
            v-model="form.referenceAffaire"
            label="Référence affaire"
            placeholder="REF-2024-001"
            required
            :error="validationErrors.referenceAffaire"
            help-text="Maximum 100 caractères"
          />

          <!-- Coordonnateur -->
          <BaseSelect
            v-model="form.coordonnateur"
            label="Coordonnateur"
            :options="coordonnateurs"
            placeholder="Sélectionnez un coordonnateur..."
            :loading="coordonnateurLoading"
            :error="validationErrors.coordonnateur"
            help-text="Optionnel - Vous pouvez assigner un coordonnateur plus tard"
          />
        </div>
      </BaseForm>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useProjectManagement } from '~/composables/useProjectManagement'

// Configuration de la page
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// Composable pour la gestion des projets
const {
  loading,
  error,
  success,
  coordonnateurs,
  coordonnateurLoading,
  fetchCoordonnateurs,
  createProject,
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

// Gestion de la soumission du formulaire
const handleSubmit = async () => {
  // Valider le formulaire
  const { isValid, errors } = validateProject(form)
  validationErrors.value = errors

  if (!isValid) {
    return
  }

  // Créer le projet
  const result = await createProject(form)
  
  if (result.success) {
    // Réinitialiser le formulaire en cas de succès
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
    validationErrors.value = {}
  }
}

// Gestion de l'annulation
const handleCancel = () => {
  // Réinitialiser le formulaire
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  validationErrors.value = {}
  clearMessages()
  
  // Rediriger vers le tableau de bord admin
  navigateTo('/admin')
}

// Charger les coordonnateurs au montage du composant
onMounted(async () => {
  await fetchCoordonnateurs()
})
</script>