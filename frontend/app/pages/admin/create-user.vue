<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la page -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Créer un utilisateur</h1>
            <p class="mt-1 text-sm text-gray-600">Ajouter un nouvel utilisateur au système</p>
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
        title="Informations utilisateur"
        subtitle="Remplissez tous les champs pour créer un nouvel utilisateur"
        :loading="loading"
        :disabled="!isFormValid"
        submit-text="Créer l'utilisateur"
        cancel-text="Annuler"
        @submit="handleSubmit"
        @cancel="handleCancel"
      >
        <div class="grid grid-cols-1 gap-6">
          <!-- Email -->
          <FormInput
            v-model="form.email"
            label="Adresse email"
            type="email"
            placeholder="utilisateur@example.com"
            required
            :error="validationErrors.email"
            help-text="L'utilisateur recevra ses identifiants par email"
          />

          <!-- Nom et Prénom sur la même ligne -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              v-model="form.name"
              label="Nom"
              placeholder="Dupont"
              required
              :error="validationErrors.name"
            />

            <FormInput
              v-model="form.surname"
              label="Prénom"
              placeholder="Jean"
              required
              :error="validationErrors.surname"
            />
          </div>

          <!-- Rôle -->
          <BaseSelect
            v-model="form.role"
            label="Rôle"
            :options="roles"
            placeholder="Sélectionnez un rôle..."
            required
            :loading="rolesLoading"
            :error="validationErrors.role"
            help-text="Le rôle détermine les permissions de l'utilisateur"
          />
        </div>
      </BaseForm>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useUserManagement } from '~/composables/useUserManagement'

// Configuration de la page
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// Composable pour la gestion des utilisateurs
const {
  loading,
  error,
  success,
  roles,
  rolesLoading,
  fetchRoles,
  createUser,
  validateUser,
  clearMessages
} = useUserManagement()

// État du formulaire
const form = reactive({
  email: '',
  name: '',
  surname: '',
  role: ''
})

// Erreurs de validation
const validationErrors = ref({})

// Valider le formulaire en temps réel
const isFormValid = computed(() => {
  const { isValid } = validateUser(form)
  return isValid && form.email && form.name && form.surname && form.role
})

// Gestion de la soumission du formulaire
const handleSubmit = async () => {
  // Valider le formulaire
  const { isValid, errors } = validateUser(form)
  validationErrors.value = errors

  if (!isValid) {
    return
  }

  // Créer l'utilisateur
  const result = await createUser(form)
  
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

// Charger les rôles au montage du composant
onMounted(async () => {
  await fetchRoles()
})
</script>
