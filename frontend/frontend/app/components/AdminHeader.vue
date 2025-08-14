<template>
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo et titre -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <h1 class="text-xl font-semibold text-gray-900">Quality Controle</h1>
            <p class="text-sm text-gray-600">{{ pageTitle }}</p>
          </div>
        </div>

        <!-- Actions et profil utilisateur -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5 5-5m-6-3a6 6 0 00-6 6v0a6 6 0 006 6h3"></path>
            </svg>
          </button>

          <!-- Profil utilisateur -->
          <div class="relative">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-blue-600">{{ userInitials }}</span>
              </div>
              <div class="hidden md:block text-left">
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
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Mon profil
              </a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Paramètres
              </a>
              <hr class="my-1">
              <button 
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pageTitle: {
    type: String,
    default: 'Administration'
  }
})

const authStore = useAuthStore()
const showUserMenu = ref(false)

const userInitials = computed(() => authStore.initials)
const userFullName = computed(() => authStore.fullName)
const userRole = computed(() => authStore.user?.role || '')

const handleLogout = async () => {
  await authStore.logout()
}

// Fermer le menu si on clique ailleurs
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>
