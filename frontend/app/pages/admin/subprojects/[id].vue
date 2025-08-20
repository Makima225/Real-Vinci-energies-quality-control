<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header avec navigation -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Breadcrumb -->
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <button 
                  @click="navigateTo('/admin')"
                  class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Administration
                </button>
              </li>
              <li v-if="currentSousProjet?.projet">
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <button 
                    @click="navigateTo(`/admin/projets/${currentSousProjet.projet}`)"
                    class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                  >
                    Projet parent
                  </button>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    Détails du sous-projet
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <button 
              v-if="currentSousProjet"
              @click="handleEditSousProjet"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Modifier
            </button>
            
            <button 
              v-if="currentSousProjet"
              @click="handleDeleteSousProjet"
              class="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="success" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div class="bg-green-50 border border-green-200 rounded-md p-4">
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
            <button @click="clearMessages" type="button" class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
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
            <button @click="clearMessages" type="button" class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- État de chargement -->
      <div v-if="sousProjetLoading" class="flex items-center justify-center py-12">
        <div class="flex items-center">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-lg text-gray-600">Chargement du sous-projet...</span>
        </div>
      </div>

      <!-- Détails du sous-projet -->
      <div v-else-if="currentSousProjet" class="space-y-8">
        <!-- Informations du sous-projet -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ currentSousProjet.titre }}</h1>
                <p class="mt-1 text-sm text-gray-500">Informations du sous-projet</p>
              </div>
              <div class="flex items-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <svg class="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3"/>
                  </svg>
                  Sous-projet
                </span>
              </div>
            </div>
          </div>
          <div class="px-6 py-5">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Titre du sous-projet</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentSousProjet.titre }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Projet parent</dt>
                <dd class="mt-1">
                  <button 
                    v-if="currentSousProjet.projet_details"
                    @click="navigateTo(`/admin/projets/${currentSousProjet.projet}`)"
                    class="text-sm text-blue-600 hover:text-blue-900 font-medium underline"
                  >
                    {{ currentSousProjet.projet_details.titre }}
                  </button>
                  <span v-else class="text-sm text-gray-500 italic">Non défini</span>
                </dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Chef de projet</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <span v-if="currentSousProjet.chef_projet_details">
                    {{ currentSousProjet.chef_projet_details.name }} {{ currentSousProjet.chef_projet_details.surname }}
                    <span v-if="currentSousProjet.chef_projet_details.email" class="text-gray-500">
                      ({{ currentSousProjet.chef_projet_details.email }})
                    </span>
                  </span>
                  <span v-else class="text-gray-500 italic">Non assigné</span>
                </dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Ingénieur travaux</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <span v-if="currentSousProjet.ingenieur_travaux_details">
                    {{ currentSousProjet.ingenieur_travaux_details.name }} {{ currentSousProjet.ingenieur_travaux_details.surname }}
                    <span v-if="currentSousProjet.ingenieur_travaux_details.email" class="text-gray-500">
                      ({{ currentSousProjet.ingenieur_travaux_details.email }})
                    </span>
                  </span>
                  <span v-else class="text-gray-500 italic">Non assigné</span>
                </dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Date de création</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentSousProjet.created_at) }}</dd>
              </div>
              
              <div v-if="currentSousProjet.updated_at !== currentSousProjet.created_at">
                <dt class="text-sm font-medium text-gray-500">Dernière modification</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentSousProjet.updated_at) }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Activités générales -->
        <div v-if="currentSousProjet.projet_details" class="bg-white shadow rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Activités générales
              </h3>
              <button 
                @click="handleCreateActiviteGenerale"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Créer une activité générale
              </button>
            </div>
          </div>
          <div class="px-6 py-5">
            <!-- Messages pour les activités générales -->
            <div v-if="activiteGeneraleSuccess" class="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-800">{{ activiteGeneraleSuccess }}</p>
                </div>
                <div class="ml-auto pl-3">
                  <button @click="clearActiviteGeneraleMessages" type="button" class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="activiteGeneraleError" class="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-800">{{ activiteGeneraleError }}</p>
                </div>
                <div class="ml-auto pl-3">
                  <button @click="clearActiviteGeneraleMessages" type="button" class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Loading state pour les activités générales -->
            <div v-if="activitesGeneralesLoading" class="flex items-center justify-center py-8">
              <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="ml-2 text-gray-600">Chargement des activités générales...</span>
            </div>

            <!-- Empty state pour les activités générales -->
            <div v-else-if="activitesGenerales.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune activité générale</h3>
              <p class="mt-1 text-sm text-gray-500">Commencez par créer votre première activité générale.</p>
            </div>

            <!-- Liste des activités générales -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="activiteGenerale in activitesGenerales" 
                :key="activiteGenerale.id"
                class="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative group"
              >
                <!-- Actions icons -->
                <div class="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="handleEditActiviteGenerale(activiteGenerale)"
                    class="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="handleDeleteActiviteGenerale(activiteGenerale)"
                    class="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>

                <!-- Contenu de l'activité générale -->
                <div class="pr-16">
                  <h4 class="text-lg font-semibold text-gray-900 mb-3">{{ activiteGenerale.titre }}</h4>
                  
                  <!-- Qualiticiens assignés -->
                  <div class="space-y-2">
                    <div v-if="activiteGenerale.qualiticient && activiteGenerale.qualiticient.length > 0">
                      <span class="text-sm font-medium text-gray-600">Qualiticiens assignés:</span>
                      <div class="mt-1 flex flex-wrap gap-1">
                        <span 
                          v-for="qualiticient in activiteGenerale.qualiticient" 
                          :key="qualiticient.id || qualiticient"
                          class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {{ getQualiticiendDisplayName(qualiticient) }}
                        </span>
                      </div>
                    </div>
                    <div v-else>
                      <span class="text-sm text-gray-500 italic">Aucun qualiticient assigné</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="error && !sousProjetLoading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Erreur de chargement</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <button 
            @click="loadSousProjet"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de modification de sous-projet -->
    <SousProjetEditModal
      :is-open="isEditModalOpen"
      :sous-projet="currentSousProjet"
      :projet-id="currentSousProjet?.projet"
      @close="closeEditModal"
      @updated="handleSousProjetUpdated"
    />

    <!-- Modal de suppression de sous-projet -->
    <SousProjetDeleteModal
      :is-open="isDeleteModalOpen"
      :sous-projet="currentSousProjet"
      @close="closeDeleteModal"
      @deleted="handleSousProjetDeleted"
    />

    <!-- Modal de création d'activité générale -->
    <ActiviteGeneraleCreateModal
      :is-open="isActiviteGeneraleModalOpen"
      :sous-projet-id="sousProjetId"
      @close="closeActiviteGeneraleModal"
      @created="handleActiviteGeneraleCreated"
    />

    <!-- Modal de modification d'activité générale -->
    <ActiviteGeneraleEditModal
      :is-open="isEditActiviteGeneraleModalOpen"
      :activite-generale="selectedActiviteGenerale"
      :sous-projet-id="sousProjetId"
      @close="closeEditActiviteGeneraleModal"
      @updated="handleActiviteGeneraleUpdated"
    />

    <!-- Modal de suppression d'activité générale -->
    <ActiviteGeneraleDeleteModal
      :is-open="isDeleteActiviteGeneraleModalOpen"
      :activite-generale="selectedActiviteGenerale"
      @close="closeDeleteActiviteGeneraleModal"
      @deleted="handleActiviteGeneraleDeleted"
    />
  </div>
</template>

<script setup>
import { useSousProjetManagement } from '~/composables/useSousProjetManagement'
import { useActiviteGeneraleManagement } from '~/composables/useActiviteGeneraleManagement'
import SousProjetEditModal from '~/components/SousProjetEditModal.vue'
import SousProjetDeleteModal from '~/components/SousProjetDeleteModal.vue'
import ActiviteGeneraleCreateModal from '~/components/ActiviteGeneraleCreateModal.vue'
import ActiviteGeneraleEditModal from '~/components/ActiviteGeneraleEditModal.vue'
import ActiviteGeneraleDeleteModal from '~/components/ActiviteGeneraleDeleteModal.vue'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// Récupérer l'ID du sous-projet depuis l'URL
const route = useRoute()
const sousProjetId = route.params.id

// Titre dynamique de la page
const pageTitle = ref('Détails du sous-projet')

// Composable pour la gestion des sous-projets
const {
  currentSousProjet,
  sousProjetLoading,
  error,
  success,
  fetchSousProjet,
  clearMessages
} = useSousProjetManagement()

// Composable pour la gestion des activités générales
const {
  activitesGenerales,
  activitesGeneralesLoading,
  error: activiteGeneraleError,
  success: activiteGeneraleSuccess,
  fetchActivitesGenerales,
  fetchQualiticiens,
  getQualiticiendDisplayName,
  clearMessages: clearActiviteGeneraleMessages
} = useActiviteGeneraleManagement()

// État des modals
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isActiviteGeneraleModalOpen = ref(false)
const isEditActiviteGeneraleModalOpen = ref(false)
const isDeleteActiviteGeneraleModalOpen = ref(false)

// Activité générale sélectionnée pour les actions
const selectedActiviteGenerale = ref(null)

// Charger le sous-projet
const loadSousProjet = async () => {
  const result = await fetchSousProjet(sousProjetId)
  if (result.success && currentSousProjet.value) {
    pageTitle.value = `${currentSousProjet.value.titre} - Détails`
    // Charger les activités générales après avoir chargé le sous-projet
    await loadActivitesGenerales()
  }
}

// Charger les activités générales
const loadActivitesGenerales = async () => {
  // Charger d'abord les qualiticiens pour avoir les noms
  await fetchQualiticiens()
  // Puis charger les activités générales
  await fetchActivitesGenerales(sousProjetId)
}

// Formatage des dates
const formatDate = (dateString) => {
  if (!dateString) return 'Non spécifié'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Handlers pour les actions
const handleEditSousProjet = () => {
  isEditModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🔄 Ouverture modal édition sous-projet:', currentSousProjet.value?.titre)
  }
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const handleSousProjetUpdated = async (updatedSousProjet) => {
  if (import.meta.dev) {
    console.log('🟢 Sous-projet modifié:', updatedSousProjet.titre)
  }
  
  // Recharger le sous-projet pour avoir les dernières données
  await loadSousProjet()
}

const handleDeleteSousProjet = () => {
  isDeleteModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🗑️ Ouverture modal suppression sous-projet:', currentSousProjet.value?.titre)
  }
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
}

const handleSousProjetDeleted = (deletedSousProjet) => {
  if (import.meta.dev) {
    console.log('🟢 Sous-projet supprimé:', deletedSousProjet.titre)
  }
  
  // Rediriger vers la page d'administration après suppression
  navigateTo('/admin')
}

// Handlers pour les activités générales
const handleCreateActiviteGenerale = () => {
  isActiviteGeneraleModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🔄 Ouverture modal création activité générale pour sous-projet:', currentSousProjet.value?.titre)
  }
}

const closeActiviteGeneraleModal = () => {
  isActiviteGeneraleModalOpen.value = false
}

const handleActiviteGeneraleCreated = async (newActiviteGenerale) => {
  if (import.meta.dev) {
    console.log('🟢 Activité générale créée:', newActiviteGenerale.titre)
  }
  
  // Recharger la liste des activités générales
  await loadActivitesGenerales()
}

// Handlers pour les actions sur les activités générales
const handleEditActiviteGenerale = (activiteGenerale) => {
  selectedActiviteGenerale.value = activiteGenerale
  isEditActiviteGeneraleModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🔄 Ouverture modal édition activité générale:', activiteGenerale.titre)
  }
}

const closeEditActiviteGeneraleModal = () => {
  isEditActiviteGeneraleModalOpen.value = false
  selectedActiviteGenerale.value = null
}

const handleActiviteGeneraleUpdated = async (updatedActiviteGenerale) => {
  if (import.meta.dev) {
    console.log('🟢 Activité générale modifiée:', updatedActiviteGenerale.titre)
  }
  
  // Recharger la liste des activités générales
  await loadActivitesGenerales()
}

const handleDeleteActiviteGenerale = (activiteGenerale) => {
  selectedActiviteGenerale.value = activiteGenerale
  isDeleteActiviteGeneraleModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🗑️ Ouverture modal suppression activité générale:', activiteGenerale.titre)
  }
}

const closeDeleteActiviteGeneraleModal = () => {
  isDeleteActiviteGeneraleModalOpen.value = false
  selectedActiviteGenerale.value = null
}

const handleActiviteGeneraleDeleted = async (deletedActiviteGenerale) => {
  if (import.meta.dev) {
    console.log('🟢 Activité générale supprimée:', deletedActiviteGenerale.titre)
  }
  
  // Recharger la liste des activités générales
  await loadActivitesGenerales()
}

// Titre de la page avec meta
useHead({
  title: pageTitle
})

// Charger le sous-projet au montage
onMounted(async () => {
  await loadSousProjet()
})

// Valider que l'ID est un nombre
if (!sousProjetId || isNaN(Number(sousProjetId))) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Sous-projet introuvable'
  })
}
</script>