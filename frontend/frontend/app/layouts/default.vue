<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header adaptatif selon le rôle -->
    <AppHeader />
    
    <!-- Navigation latérale (si besoin) -->
    <AppSidebar v-if="shouldShowSidebar" />
    
    <!-- Contenu principal -->
    <main :class="mainContentClasses">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Breadcrumb -->
        <AppBreadcrumb v-if="shouldShowBreadcrumb" />
        
        <!-- Contenu de la page -->
        <slot />
      </div>
    </main>
    
    <!-- Footer (optionnel) -->
    <AppFooter v-if="shouldShowFooter" />
  </div>
</template>

<script setup>
const route = useRoute()
const authStore = useAuthStore()

// Configuration selon le rôle et la page
const userRole = computed(() => authStore.user?.role)
const currentPath = computed(() => route.path)

// Déterminer si on doit afficher la sidebar
const shouldShowSidebar = computed(() => {
  // Afficher la sidebar pour les rôles admin/directeur et certaines pages
  const rolesWithSidebar = ['admin', 'directeur']
  const pagesWithSidebar = ['/admin']
  
  return rolesWithSidebar.includes(userRole.value) || 
         pagesWithSidebar.some(path => currentPath.value.startsWith(path))
})

// Déterminer si on doit afficher le breadcrumb
const shouldShowBreadcrumb = computed(() => {
  // Afficher le breadcrumb sauf sur les pages d'accueil de chaque rôle
  const homePages = ['/admin', '/directeur', '/chef-projet', '/coordonnateur', '/ingenieur-travaux', '/qualiticient']
  return !homePages.includes(currentPath.value)
})

// Déterminer si on doit afficher le footer
const shouldShowFooter = computed(() => {
  // Footer visible partout sauf admin
  return !currentPath.value.startsWith('/admin')
})

// Classes CSS pour le contenu principal
const mainContentClasses = computed(() => {
  return [
    'flex-1',
    shouldShowSidebar.value ? 'ml-64' : '', // Marge à gauche si sidebar
    'transition-all duration-300 ease-in-out'
  ].filter(Boolean).join(' ')
})

// Titre de la page selon le rôle
const getPageTitle = () => {
  const titles = {
    'admin': 'Administration',
    'directeur': 'Direction',
    'chef de projet': 'Gestion de Projets',
    'coordonnateur': 'Coordination',
    'ingenieur travaux': 'Ingénierie Travaux',
    'qualiticient': 'Contrôle Qualité'
  }
  return titles[userRole.value] || 'Quality Control'
}

// Titre dynamique de la page
useHead({
  titleTemplate: (title) => {
    if (title) {
      return `${title} - ${getPageTitle()}`
    }
    return getPageTitle()
  }
})
</script>