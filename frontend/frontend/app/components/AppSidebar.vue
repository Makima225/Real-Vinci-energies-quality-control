<template>
  <aside class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto z-30">
    <div class="p-6">
      <!-- Section admin uniquement -->
      <div v-if="isAdmin" class="space-y-6">
        <!-- Statistiques rapides -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Aperçu rapide</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Utilisateurs</span>
              <span class="font-medium">{{ stats.users }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Projets actifs</span>
              <span class="font-medium">{{ stats.activeProjects }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">En attente</span>
              <span class="font-medium text-orange-600">{{ stats.pending }}</span>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-3">Actions rapides</h3>
          <div class="space-y-2">
            <button 
              v-for="action in quickActions" 
              :key="action.name"
              @click="navigateTo(action.path)"
              class="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon"></path>
              </svg>
              {{ action.name }}
            </button>
          </div>
        </div>

        <!-- Notifications récentes -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-3">Notifications</h3>
          <div class="space-y-3">
            <div 
              v-for="notification in recentNotifications" 
              :key="notification.id"
              class="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <div class="flex-shrink-0">
                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900">{{ notification.title }}</p>
                <p class="text-xs text-gray-500 truncate">{{ notification.message }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatTime(notification.time) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section directeur -->
      <div v-else-if="isDirecteur" class="space-y-6">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-900 mb-2">Vue d'ensemble</h3>
          <p class="text-xs text-gray-600">Supervision globale des opérations</p>
        </div>
        
        <!-- Équipes sous supervision -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-3">Équipes</h3>
          <div class="space-y-2">
            <div v-for="team in teams" :key="team.name" class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
              <span class="text-sm text-gray-700">{{ team.name }}</span>
              <span class="text-xs text-gray-500">{{ team.members }} membres</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
const authStore = useAuthStore()

// Vérifications de rôle
const isAdmin = computed(() => authStore.isAdmin)
const isDirecteur = computed(() => authStore.isDirecteur)

// Données simulées pour les statistiques
const stats = ref({
  users: 42,
  activeProjects: 15,
  pending: 8
})

// Actions rapides pour admin
const quickActions = [
  {
    name: 'Ajouter utilisateur',
    path: '/admin/create-user',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
  },
  {
    name: 'Nouveau projet',
    path: '/admin/projects/create',
    icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6'
  },
  {
    name: 'Générer rapport',
    path: '/admin/reports/generate',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  }
]

// Notifications récentes
const recentNotifications = ref([
  {
    id: 1,
    title: 'Nouveau utilisateur',
    message: 'Marie Dupont a rejoint l\'équipe',
    time: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 2,
    title: 'Projet terminé',
    message: 'Installation électrique Bâtiment A',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: 3,
    title: 'Contrôle en attente',
    message: 'Validation conformité NF C 15-100',
    time: new Date(Date.now() - 1000 * 60 * 60 * 4)
  }
])

// Équipes pour directeur
const teams = ref([
  { name: 'Équipe Alpha', members: 8 },
  { name: 'Équipe Beta', members: 6 },
  { name: 'Équipe Gamma', members: 12 }
])

// Utilitaire pour formater le temps
const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (minutes < 60) {
    return `${minutes}min`
  } else {
    return `${hours}h`
  }
}
</script>
