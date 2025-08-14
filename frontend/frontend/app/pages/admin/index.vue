<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AdminHeader page-title="Tableau de bord administrateur" />
    
    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistiques principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Utilisateurs"
          subtitle="Total des comptes"
          :value="stats.totalUsers"
          :trend="`+${stats.newUsersThisMonth} ce mois`"
          trend-direction="up"
          icon="users"
          color="blue"
        />
        
        <StatsCard
          title="Projets actifs"
          subtitle="En cours"
          :value="stats.activeProjects"
          :trend="`${stats.completedThisWeek} terminés cette semaine`"
          trend-direction="up"
          icon="projects"
          color="green"
        />
        
        <StatsCard
          title="Contrôles qualité"
          subtitle="Ce mois"
          :value="stats.qualityChecks"
          :trend="`${stats.pendingChecks} en attente`"
          trend-direction="neutral"
          icon="tasks"
          color="orange"
          :show-progress="true"
          :progress-value="stats.completedChecks"
          :progress-max="stats.qualityChecks"
        />
        
        <StatsCard
          title="Rapports"
          subtitle="Générés"
          :value="stats.reports"
          :trend="`${stats.reportsToday} aujourd'hui`"
          trend-direction="up"
          icon="reports"
          color="purple"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Utilisateurs récents -->
        <DashboardCard 
          title="Utilisateurs récents" 
          subtitle="Dernières inscriptions"
          action-text="Voir tous"
          @action="navigateTo('/admin/users')"
        >
          <DataTable
            title=""
            :headers="userHeaders"
            :data="recentUsers"
            :show-actions="false"
            empty-message="Aucun utilisateur récent"
          >
            <template #role="{ value }">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                    :class="getRoleColor(value)">
                {{ value }}
              </span>
            </template>
            
            <template #is_active="{ value }">
              <span class="inline-flex items-center">
                <div class="w-2 h-2 rounded-full mr-2" 
                     :class="value ? 'bg-green-400' : 'bg-red-400'"></div>
                {{ value ? 'Actif' : 'Inactif' }}
              </span>
            </template>
          </DataTable>
        </DashboardCard>

        <!-- Activité récente -->
        <DashboardCard 
          title="Activité récente" 
          subtitle="Dernières actions"
        >
          <div class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" 
                 class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-full flex items-center justify-center"
                     :class="getActivityIcon(activity.type).bg">
                  <svg class="w-4 h-4" :class="getActivityIcon(activity.type).color" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          :d="getActivityIcon(activity.type).path"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ activity.action }}</p>
                <p class="text-sm text-gray-500">{{ activity.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatTime(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      <!-- Actions rapides -->
      <DashboardCard 
        title="Actions rapides" 
        subtitle="Raccourcis d'administration"
        class="mt-8"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <button 
            v-for="action in quickActions" 
            :key="action.name"
            @click="navigateTo(action.route)"
            class="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                 :class="action.iconBg">
              <svg class="w-6 h-6" :class="action.iconColor" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      :d="action.iconPath"></path>
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900 group-hover:text-gray-700">
              {{ action.name }}
            </span>
            <span class="text-xs text-gray-500 mt-1 text-center">
              {{ action.description }}
            </span>
          </button>
        </div>
      </DashboardCard>
    </div>
  </div>
</template>

<script setup>
// Middleware d'authentification pour les admins
definePageMeta({
  middleware: 'auth'
})

// Titre de la page
useHead({
  title: 'Administration - Quality Controle'
})

const authStore = useAuthStore()

// Données simulées (à remplacer par de vrais appels API)
const stats = ref({
  totalUsers: 42,
  newUsersThisMonth: 8,
  activeProjects: 15,
  completedThisWeek: 3,
  qualityChecks: 128,
  pendingChecks: 12,
  completedChecks: 116,
  reports: 89,
  reportsToday: 5
})

const userHeaders = [
  { key: 'name', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rôle' },
  { key: 'is_active', label: 'Statut' }
]

const recentUsers = ref([
  { 
    name: 'Marie Dubois', 
    email: 'marie.dubois@vinci.com', 
    role: 'qualiticient',
    is_active: true 
  },
  { 
    name: 'Pierre Martin', 
    email: 'pierre.martin@vinci.com', 
    role: 'ingenieur travaux',
    is_active: true 
  },
  { 
    name: 'Sophie Leroy', 
    email: 'sophie.leroy@vinci.com', 
    role: 'chef de projet',
    is_active: false 
  }
])

const recentActivity = ref([
  {
    id: 1,
    type: 'user',
    action: 'Nouvel utilisateur',
    description: 'Marie Dubois a rejoint l\'équipe',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 2,
    type: 'project',
    action: 'Projet terminé',
    description: 'Installation électrique Batiment A',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: 3,
    type: 'quality',
    action: 'Contrôle qualité',
    description: 'Validation conformité NF C 15-100',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
  }
])

const quickActions = [
  {
    name: 'Gérer les utilisateurs',
    description: 'Ajouter, modifier ou supprimer',
    route: '/admin/users',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
  },
  {
    name: 'Projets',
    description: 'Gérer les projets actifs',
    route: '/admin/projects',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
  },
  {
    name: 'Rapports',
    description: 'Générer et consulter',
    route: '/admin/reports',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z'
  },
  {
    name: 'Paramètres',
    description: 'Configuration système',
    route: '/admin/settings',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    iconPath: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z'
  }
]

// Méthodes utilitaires
const getRoleColor = (role) => {
  const colors = {
    'admin': 'bg-red-100 text-red-800',
    'directeur': 'bg-purple-100 text-purple-800',
    'chef de projet': 'bg-blue-100 text-blue-800',
    'coordonnateur': 'bg-green-100 text-green-800',
    'ingenieur travaux': 'bg-yellow-100 text-yellow-800',
    'qualiticient': 'bg-orange-100 text-orange-800'
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}

const getActivityIcon = (type) => {
  const icons = {
    user: {
      bg: 'bg-blue-100',
      color: 'text-blue-600',
      path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    project: {
      bg: 'bg-green-100',
      color: 'text-green-600',
      path: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
    },
    quality: {
      bg: 'bg-orange-100',
      color: 'text-orange-600',
      path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }
  return icons[type] || icons.user
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (minutes < 60) {
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
  }
}

// Charger les données au montage
onMounted(async () => {
  // Ici vous pouvez charger les vraies données depuis votre API
  if (import.meta.dev) {
    console.log('🏠 Page admin chargée pour:', authStore.fullName)
  }
})
</script>