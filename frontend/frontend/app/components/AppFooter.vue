<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- Informations de l'entreprise -->
        <div class="flex items-center space-x-4 mb-4 md:mb-0">
          <div class="text-sm text-gray-500">
            <p class="font-medium text-gray-900">Vinci Énergie</p>
            <p>Contrôle Qualité</p>
          </div>
        </div>
        
        <!-- Informations de l'utilisateur connecté -->
        <div class="flex items-center space-x-6 text-sm text-gray-500">
          <div v-if="authStore.user" class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>{{ authStore.user.first_name }} {{ authStore.user.last_name }}</span>
            <span class="text-gray-300">•</span>
            <span class="capitalize">{{ getRoleDisplayName(authStore.user.role) }}</span>
          </div>
          
          <!-- Informations de version et dernière connexion -->
          <div class="hidden sm:flex items-center space-x-4">
            <span>Version 1.0.0</span>
            <span class="text-gray-300">•</span>
            <span>{{ formatLastLogin() }}</span>
          </div>
        </div>
        
        <!-- Liens utiles -->
        <div class="flex items-center space-x-4 mt-4 md:mt-0">
          <button 
            @click="showSupport"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Support
          </button>
          <button 
            @click="showDocumentation"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Documentation
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const authStore = useAuthStore()

// Noms d'affichage des rôles
const getRoleDisplayName = (role) => {
  const roleNames = {
    'admin': 'Administrateur',
    'directeur': 'Directeur',
    'chef_de_projet': 'Chef de Projet', 
    'coordonnateur': 'Coordonnateur',
    'ingenieur_travaux': 'Ingénieur Travaux',
    'qualiticient': 'Qualiticient'
  }
  return roleNames[role] || role
}

// Formater la dernière connexion
const formatLastLogin = () => {
  const now = new Date()
  const today = now.toLocaleDateString('fr-FR', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  })
  const time = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  return `Dernière connexion: ${today} à ${time}`
}

// Actions du footer
const showSupport = () => {
  // Ouvrir une modal de support ou rediriger vers le système de tickets
  alert('Fonction Support à implémenter')
}

const showDocumentation = () => {
  // Ouvrir la documentation dans un nouvel onglet
  window.open('/documentation', '_blank')
}
</script>
