<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
  
    
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

      <!-- Messages pour les projets -->
      <div v-if="projectSuccess" class="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{{ projectSuccess }}</p>
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

      <div v-if="projectError" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ projectError }}</p>
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

      <!-- Projets -->
      <DashboardCard 
        title="Projets" 
        subtitle="Liste des projets"
        class="mb-8"
      >
        <!-- Loading state -->
        <div v-if="projectsLoading" class="flex items-center justify-center py-8">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-2 text-gray-600">Chargement des projets...</span>
        </div>

        <!-- Empty state -->
        <div v-else-if="projects.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun projet</h3>
          <p class="mt-1 text-sm text-gray-500">Commencez par créer votre premier projet.</p>
        </div>

        <!-- Projects grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="project in projects" 
            :key="project.id"
            @click="handleProjectClick(project)"
            class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative group"
          >
            <!-- Actions icons -->
            <div class="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                @click.stop="handleEditProject(project)"
                class="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                title="Modifier"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button 
                @click.stop="handleDeleteProject(project)"
                class="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                title="Supprimer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>

            <!-- Project content -->
            <div class="pr-16">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ project.titre }}</h3>
              
              <div class="space-y-2 text-sm">
                <div class="flex">
                  <span class="font-medium text-gray-600 w-24">Client:</span>
                  <span class="text-gray-900">{{ project.client }}</span>
                </div>
                
                <div class="flex">
                  <span class="font-medium text-gray-600 w-24">Lieu:</span>
                  <span class="text-gray-900">{{ project.Emplacement }}</span>
                </div>
                
                <div class="flex">
                  <span class="font-medium text-gray-600 w-24">Référence:</span>
                  <span class="text-gray-900">{{ project.Reference_affaire }}</span>
                </div>
                
                <div class="flex">
                  <span class="font-medium text-gray-600 w-24">Coordinateur:</span>
                  <span v-if="project.coordonnateur_details" class="text-gray-900">
                    {{ project.coordonnateur_details.name }} {{ project.coordonnateur_details.surname }}
                  </span>
                  <span v-else class="text-gray-500 italic">Non assigné</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>

      <!-- Modal de modification de projet -->
      <ProjectEditModal
        :is-open="isEditModalOpen"
        :project="selectedProject"
        @close="closeEditModal"
        @updated="handleProjectUpdated"
      />

      <!-- Modal de suppression de projet -->
      <ProjectDeleteModal
        :is-open="isDeleteModalOpen"
        :project="selectedProject"
        @close="closeDeleteModal"
        @deleted="handleProjectDeleted"
      />

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
import { useProjectManagement } from '~/composables/useProjectManagement'
import ProjectEditModal from '~/components/ProjectEditModal.vue'
import ProjectDeleteModal from '~/components/ProjectDeleteModal.vue'

// Middleware d'authentification pour les admins
definePageMeta({
  middleware: 'auth'
})

// Titre de la page
useHead({
  title: 'Administration - Quality Controle'
})

const authStore = useAuthStore()

// Composable pour la gestion des projets
const {
  projects,
  projectsLoading,
  error: projectError,
  success: projectSuccess,
  fetchProjects,
  deleteProject,
  clearMessages
} = useProjectManagement()

// État pour le modal de modification
const isEditModalOpen = ref(false)
const selectedProject = ref(null)

// État pour le modal de suppression
const isDeleteModalOpen = ref(false)

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

// Handlers pour les actions sur les projets
const handleProjectClick = (project) => {
  // Rediriger vers la page de détails du projet
  navigateTo(`/admin/projets/${project.id}`)
}

const handleEditProject = (project) => {
  // Ouvrir le modal de modification
  selectedProject.value = project
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  selectedProject.value = null
}

const handleProjectUpdated = (updatedProject) => {
  // Le projet a été mis à jour, la liste sera rechargée automatiquement
  console.log('Projet mis à jour:', updatedProject.titre)
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedProject.value = null
}

const handleProjectDeleted = async (deletedProject) => {
  // Le projet a été supprimé, recharger la liste
  console.log('Projet supprimé:', deletedProject.titre)
  await fetchProjects()
}

const handleDeleteProject = async (project) => {
  // Ouvrir le modal de confirmation de suppression
  selectedProject.value = project
  isDeleteModalOpen.value = true
}

const quickActions = [
  {
    name: 'Créer un utilisateur',
    description: 'Ajouter un nouvel utilisateur',
    route: '/admin/create-user',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    iconPath: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
  },
  {
    name: 'Créer un projet',
    description: 'Ajouter un nouveau projet',
    route: '/admin/create-project',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    iconPath: 'M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z'
  },
  {
    name: 'Gérer les utilisateurs',
    description: 'Modifier ou supprimer',
    route: '/admin/users',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
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

// Charger les données au montage
onMounted(async () => {
  // Charger les projets
  await fetchProjects()
  
  if (import.meta.dev) {
    console.log('🏠 Page admin chargée pour:', authStore.fullName)
  }
})
</script>