<template>
  <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo et titre adaptatif -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <h1 class="text-xl font-semibold text-gray-900">Quality Control</h1>
            <p class="text-sm text-gray-600">{{ getCurrentSpaceTitle() }}</p>
          </div>
        </div>

        <!-- Navigation principale -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink 
            v-for="item in navigationItems" 
            :key="item.path"
            :to="item.path"
            class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 bg-blue-50"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- Actions utilisateur -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5 5-5m-6-3a6 6 0 00-6 6v0a6 6 0 006 6h3"></path>
            </svg>
            <!-- Badge de notification (optionnel) -->
            <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <!-- Menu utilisateur -->
          <div class="relative">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-blue-600">{{ userInitials }}</span>
              </div>
              <div class="hidden lg:block text-left">
                <p class="text-sm font-medium text-gray-900">{{ userFullName }}</p>
                <p class="text-xs text-gray-500 capitalize">{{ userRole }}</p>
              </div>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Menu déroulant -->
            <div 
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Mon profil
              </NuxtLink>
              <NuxtLink to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Paramètres
              </NuxtLink>
              <hr class="my-1">
              <button 
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                Se déconnecter
              </button>
            </div>
          </div>

          <!-- Menu mobile -->
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation mobile -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-4">
        <div class="space-y-1">
          <NuxtLink 
            v-for="item in navigationItems" 
            :key="item.path"
            :to="item.path"
            class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            active-class="text-blue-600 bg-blue-50"
            @click="showMobileMenu = false"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const route = useRoute()
const authStore = useAuthStore()
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

// Données utilisateur
const userInitials = computed(() => authStore.initials)
const userFullName = computed(() => authStore.fullName)
const userRole = computed(() => authStore.user?.role || '')

// Navigation selon le rôle
const navigationItems = computed(() => {
  const role = userRole.value
  const baseItems = []

  switch (role) {
    case 'admin':
      return [
        { name: 'Tableau de bord', path: '/admin' },
        { name: 'Utilisateurs', path: '/admin/users' },
        { name: 'Projets', path: '/admin/projects' },
        { name: 'Rapports', path: '/admin/reports' },
        { name: 'Paramètres', path: '/admin/settings' }
      ]
    
    case 'directeur':
      return [
        { name: 'Tableau de bord', path: '/directeur' },
        { name: 'Vue d\'ensemble', path: '/directeur/overview' },
        { name: 'Équipes', path: '/directeur/teams' },
        { name: 'Performance', path: '/directeur/performance' }
      ]
    
    case 'chef de projet':
      return [
        { name: 'Mes Projets', path: '/chef-projet' },
        { name: 'Planning', path: '/chef-projet/planning' },
        { name: 'Équipe', path: '/chef-projet/team' },
        { name: 'Ressources', path: '/chef-projet/resources' }
      ]
    
    case 'coordonnateur':
      return [
        { name: 'Coordination', path: '/coordonnateur' },
        { name: 'Affectations', path: '/coordonnateur/assignments' },
        { name: 'Suivi', path: '/coordonnateur/tracking' }
      ]
    
    case 'ingenieur travaux':
      return [
        { name: 'Mes Travaux', path: '/ingenieur-travaux' },
        { name: 'Chantiers', path: '/ingenieur-travaux/sites' },
        { name: 'Contrôles', path: '/ingenieur-travaux/controls' }
      ]
    
    case 'qualiticient':
      return [
        { name: 'Contrôles', path: '/qualiticient' },
        { name: 'Inspections', path: '/qualiticient/inspections' },
        { name: 'Rapports', path: '/qualiticient/reports' }
      ]
    
    default:
      return []
  }
})

// Titre de l'espace actuel
const getCurrentSpaceTitle = () => {
  const titles = {
    'admin': 'Administration',
    'directeur': 'Direction',
    'chef de projet': 'Gestion de Projets',
    'coordonnateur': 'Coordination',
    'ingenieur travaux': 'Ingénierie Travaux',
    'qualiticient': 'Contrôle Qualité'
  }
  return titles[userRole.value] || 'Espace utilisateur'
}

// Déconnexion
const handleLogout = async () => {
  showUserMenu.value = false
  await authStore.logout()
}

// Fermer les menus si on clique ailleurs
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showUserMenu.value = false
    }
    if (!e.target.closest('.md\\:hidden')) {
      showMobileMenu.value = false
    }
  })
})
</script>
