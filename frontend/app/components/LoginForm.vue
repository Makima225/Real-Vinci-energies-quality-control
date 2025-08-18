<template>
  <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Quality Control
      </h1>
      <p class="text-gray-600">
        Connectez-vous à votre espace
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <FormInput
        id="email"
        v-model="email"
        label="Adresse email"
        type="email"
        placeholder="votre@email.com"
        :required="true"
        :error="errors.email"
      />

      <FormInput
        id="password"
        v-model="password"
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        :required="true"
        :error="errors.password"
      />

      

      <BaseButton
        type="submit"
        variant="primary"
        text="Se connecter"
        :loading="isLoading"
        loading-text="Connexion..."
        @click="handleSubmit"
      />
    </form>

    <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>

    <div class="mt-8 text-center">
      <p class="text-sm text-gray-600">
        Besoin d'aide ? 
        <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors">
          Contactez l'administrateur
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const errors = ref({
  email: '',
  password: ''
})

// États de chargement depuis le store
const isLoading = computed(() => authStore.loginLoading)

const validateForm = () => {
  // Reset errors
  errors.value = { email: '', password: '' }
  error.value = ''

  let isValid = true

  // Validation email
  if (!email.value) {
    errors.value.email = 'L\'adresse email est requise'
    isValid = false
  } else if (!isValidEmail(email.value)) {
    errors.value.email = 'Format d\'email invalide'
    isValid = false
  }

  // Validation password
  if (!password.value) {
    errors.value.password = 'Le mot de passe est requis'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Le mot de passe doit contenir au moins 6 caractères'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  // Validation du formulaire
  if (!validateForm()) {
    return
  }

  try {
    // Appel à l'API de connexion via le store
    const result = await authStore.login({
      email: email.value,
      password: password.value
    })

    if (result.success) {
      // Connexion réussie
      if (import.meta.dev) {
        console.log('🟢 Connexion réussie pour:', email.value)
      }

      // Vérifier si l'utilisateur a un rôle autorisé
      const userRole = authStore.user?.role
      if (!isRoleAuthorized(userRole)) {
        // Déconnecter l'utilisateur et afficher un message d'erreur
        await authStore.clearAuth()
        error.value = 'Accès refusé : Votre rôle ne vous permet pas d\'accéder à cette application. Contactez l\'administrateur.'
        return
      }

      // Redirection selon le rôle de l'utilisateur
      const redirectPath = getRedirectPath(userRole)
      await navigateTo(redirectPath)
    } else {
      // Erreur de connexion
      error.value = result.error || 'Identifiants invalides'
    }
  } catch (err) {
    // Erreur inattendue
    error.value = 'Une erreur inattendue s\'est produite'
    console.error('❌ Erreur lors de la connexion:', err)
  }
}

// Vérifier si le rôle est autorisé dans l'application
const isRoleAuthorized = (role) => {
  const authorizedRoles = [
    'qualiticient',
    'ingenieur travaux', 
    'chef de projet',
    'coordonnateur',
    'directeur',
    'admin'
  ]
  return authorizedRoles.includes(role)
}

// Utilitaire pour valider l'email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Redirection selon le rôle
const getRedirectPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'directeur':
      return '/directeur'
    case 'chef de projet':
      return '/chef-projet'
    case 'coordonnateur':
      return '/coordonnateur'
    case 'ingenieur travaux':
      return '/ingenieur-travaux'
    case 'qualiticient':
      return '/qualiticient'
    default:
      // Ne devrait jamais arriver vu la vérification isRoleAuthorized
      return '/admin'
  }
}

// Écouter les erreurs du store
watch(() => authStore.error, (newError) => {
  if (newError) {
    error.value = newError
  }
})

// Nettoyer les erreurs quand l'utilisateur tape
watch([email, password], () => {
  if (error.value) {
    error.value = ''
  }
  if (errors.value.email || errors.value.password) {
    errors.value = { email: '', password: '' }
  }
})
</script>
