<template>
  <nav class="flex mb-6" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-4">
      <li>
        <div>
          <NuxtLink to="/" class="text-gray-400 hover:text-gray-500">
            <svg class="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            <span class="sr-only">Accueil</span>
          </NuxtLink>
        </div>
      </li>
      
      <li v-for="(item, index) in breadcrumbItems" :key="index">
        <div class="flex items-center">
          <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          
          <NuxtLink 
            v-if="!item.current"
            :to="item.path"
            class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            {{ item.name }}
          </NuxtLink>
          
          <span 
            v-else
            class="ml-4 text-sm font-medium text-gray-900"
            aria-current="page"
          >
            {{ item.name }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const route = useRoute()
const authStore = useAuthStore()

// Générer les éléments du breadcrumb
const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items = []
  
  // Construire le breadcrumb selon le rôle et le chemin
  const userRole = authStore.user?.role
  
  // Premier niveau selon le rôle
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0]
    const roleNames = {
      'admin': 'Administration',
      'directeur': 'Direction',
      'chef-projet': 'Gestion de Projets',
      'coordonnateur': 'Coordination',
      'ingenieur-travaux': 'Ingénierie Travaux',
      'qualiticient': 'Contrôle Qualité'
    }
    
    items.push({
      name: roleNames[firstSegment] || 'Accueil',
      path: `/${firstSegment}`,
      current: pathSegments.length === 1
    })
  }
  
  // Segments suivants
  for (let i = 1; i < pathSegments.length; i++) {
    const segment = pathSegments[i]
    const path = '/' + pathSegments.slice(0, i + 1).join('/')
    
    // Noms personnalisés pour certaines pages
    const pageNames = {
      'users': 'Utilisateurs',
      'projects': 'Projets',
      'reports': 'Rapports',
      'settings': 'Paramètres',
      'create': 'Créer',
      'edit': 'Modifier',
      'overview': 'Vue d\'ensemble',
      'teams': 'Équipes',
      'performance': 'Performance',
      'planning': 'Planning',
      'team': 'Équipe',
      'resources': 'Ressources',
      'assignments': 'Affectations',
      'tracking': 'Suivi',
      'sites': 'Chantiers',
      'controls': 'Contrôles',
      'inspections': 'Inspections'
    }
    
    items.push({
      name: pageNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      path: path,
      current: i === pathSegments.length - 1
    })
  }
  
  return items
})
</script>
