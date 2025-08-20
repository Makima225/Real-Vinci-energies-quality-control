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
              <li v-if="currentActiviteGenerale?.sous_projet_details">
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <button 
                    @click="navigateTo(`/admin/subprojects/${currentActiviteGenerale.sous_projet}`)"
                    class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                  >
                    Sous-projet parent
                  </button>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    Détails de l'activité générale
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <button 
              v-if="currentActiviteGenerale"
              @click="handleEditActiviteGenerale"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Modifier
            </button>
            
            <button 
              v-if="currentActiviteGenerale"
              @click="handleDeleteActiviteGenerale"
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
      <div v-if="activiteGeneraleLoading" class="flex items-center justify-center py-12">
        <div class="flex items-center">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-lg text-gray-600">Chargement de l'activité générale...</span>
        </div>
      </div>

      <!-- Détails de l'activité générale -->
      <div v-else-if="currentActiviteGenerale" class="space-y-8">
        <!-- Informations de l'activité générale -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ currentActiviteGenerale.titre }}</h1>
                <p class="mt-1 text-sm text-gray-500">Informations de l'activité générale</p>
              </div>
              <div class="flex items-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg class="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3"/>
                  </svg>
                  Activité générale
                </span>
              </div>
            </div>
          </div>
          <div class="px-6 py-5">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Titre de l'activité</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentActiviteGenerale.titre }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Sous-projet parent</dt>
                <dd class="mt-1">
                  <button 
                    v-if="currentActiviteGenerale.sous_projet_details"
                    @click="navigateTo(`/admin/subprojects/${currentActiviteGenerale.sous_projet}`)"
                    class="text-sm text-blue-600 hover:text-blue-900 font-medium underline"
                  >
                    {{ currentActiviteGenerale.sous_projet_details.titre }}
                  </button>
                  <span v-else class="text-sm text-gray-500 italic">Non défini</span>
                </dd>
              </div>
              
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Qualiticiens assignés</dt>
                <dd class="mt-1">
                  <div v-if="currentActiviteGenerale.qualiticient && currentActiviteGenerale.qualiticient.length > 0" class="flex flex-wrap gap-2">
                    <span 
                      v-for="qualiticient in currentActiviteGenerale.qualiticient" 
                      :key="qualiticient.id || qualiticient"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <div class="flex-shrink-0 h-6 w-6 mr-2">
                        <div class="h-6 w-6 rounded-full bg-blue-200 flex items-center justify-center">
                          <span class="text-xs font-medium text-blue-600">
                            {{ getQualiticiendInitials(qualiticient) }}
                          </span>
                        </div>
                      </div>
                      {{ getQualiticiendDisplayName(qualiticient) }}
                    </span>
                  </div>
                  <span v-else class="text-sm text-gray-500 italic">Aucun qualiticient assigné</span>
                </dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Date de création</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentActiviteGenerale.created_at) }}</dd>
              </div>
              
              <div v-if="currentActiviteGenerale.updated_at !== currentActiviteGenerale.created_at">
                <dt class="text-sm font-medium text-gray-500">Dernière modification</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentActiviteGenerale.updated_at) }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Section des activités spécifiques -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Activités Spécifiques
              </h3>
              <button 
                @click="handleCreateActiviteSpecifique"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Créer une activité spécifique
              </button>
            </div>
          </div>
          <div class="px-6 py-5">
            <!-- Messages pour les activités spécifiques -->
            <div v-if="activiteSpecifiqueSuccess" class="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-800">{{ activiteSpecifiqueSuccess }}</p>
                </div>
                <div class="ml-auto pl-3">
                  <button @click="clearActiviteSpecifiqueMessages" type="button" class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="activiteSpecifiqueError" class="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-800">{{ activiteSpecifiqueError }}</p>
                </div>
                <div class="ml-auto pl-3">
                  <button @click="clearActiviteSpecifiqueMessages" type="button" class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Loading state pour les activités spécifiques -->
            <div v-if="activiteSpecifiqueLoading" class="flex items-center justify-center py-8">
              <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="ml-2 text-gray-600">Chargement des activités spécifiques...</span>
            </div>

            <!-- Empty state pour les activités spécifiques -->
            <div v-else-if="activitesSpecifiques.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune activité spécifique</h3>
              <p class="mt-1 text-sm text-gray-500">Commencez par créer votre première activité spécifique.</p>
            </div>

            <!-- Liste des activités spécifiques -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="activiteSpecifique in activitesSpecifiques" 
                :key="activiteSpecifique.id"
                @click="handleActiviteSpecifiqueClick(activiteSpecifique)"
                class="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative group"
              >
                <!-- Actions icons -->
                <div class="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    @click.stop="handleEditActiviteSpecifique(activiteSpecifique)"
                    class="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    @click.stop="handleDeleteActiviteSpecifique(activiteSpecifique)"
                    class="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>

                <!-- Contenu de l'activité spécifique -->
                <div class="pr-16">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ activiteSpecifique.titre }}</h4>
                  <div class="text-sm text-gray-600">
                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      Activité spécifique
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="error && !activiteGeneraleLoading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Erreur de chargement</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <button 
            @click="loadActiviteGenerale"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de modification d'activité générale -->
    <ActiviteGeneraleEditModal
      :is-open="isEditModalOpen"
      :activite-generale="currentActiviteGenerale"
      :sous-projet-id="currentActiviteGenerale?.sous_projet"
      @close="closeEditModal"
      @updated="handleActiviteGeneraleUpdated"
    />

    <!-- Modal de suppression d'activité générale -->
    <ActiviteGeneraleDeleteModal
      :is-open="isDeleteModalOpen"
      :activite-generale="currentActiviteGenerale"
      @close="closeDeleteModal"
      @deleted="handleActiviteGeneraleDeleted"
    />

    <!-- Modal de création d'activité spécifique -->
    <ActiviteSpecifiqueCreateModal
      :is-open="isActiviteSpecifiqueModalOpen"
      :activite-generale-id="currentActiviteGenerale?.id"
      @close="closeActiviteSpecifiqueModal"
      @created="handleActiviteSpecifiqueCreated"
    />

    <!-- Modal de modification d'activité spécifique -->
    <ActiviteSpecifiqueEditModal
      :is-open="isEditActiviteSpecifiqueModalOpen"
      :activite-specifique="selectedActiviteSpecifique"
      :activite-generale-id="currentActiviteGenerale?.id"
      @close="closeEditActiviteSpecifiqueModal"
      @updated="handleActiviteSpecifiqueUpdated"
    />

    <!-- Modal de suppression d'activité spécifique -->
    <ActiviteSpecifiqueDeleteModal
      :is-open="isDeleteActiviteSpecifiqueModalOpen"
      :activite-specifique="selectedActiviteSpecifique"
      @close="closeDeleteActiviteSpecifiqueModal"
      @deleted="handleActiviteSpecifiqueDeleted"
    />
  </div>
</template>

<script setup>
import { useActiviteGeneraleManagement } from '~/composables/useActiviteGeneraleManagement'
import { useActiviteSpecifiqueManagement } from '~/composables/useActiviteSpecifiqueManagement'
import ActiviteGeneraleEditModal from '~/components/ActiviteGeneraleEditModal.vue'
import ActiviteGeneraleDeleteModal from '~/components/ActiviteGeneraleDeleteModal.vue'
import ActiviteSpecifiqueCreateModal from '~/components/ActiviteSpecifiqueCreateModal.vue'
import ActiviteSpecifiqueEditModal from '~/components/ActiviteSpecifiqueEditModal.vue'
import ActiviteSpecifiqueDeleteModal from '~/components/ActiviteSpecifiqueDeleteModal.vue'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// Récupérer l'ID de l'activité générale depuis l'URL
const route = useRoute()
const activiteGeneraleId = route.params.id

// Titre dynamique de la page
const pageTitle = ref('Détails de l\'activité générale')

// Composable pour la gestion des activités générales
const {
  currentActiviteGenerale,
  activiteGeneraleLoading,
  error,
  success,
  fetchActiviteGenerale,
  fetchQualiticiens,
  getQualiticiendDisplayName,
  clearMessages
} = useActiviteGeneraleManagement()

// Composable pour la gestion des activités spécifiques
const {
  activitesSpecifiques,
  activiteSpecifiqueLoading,
  error: activiteSpecifiqueError,
  success: activiteSpecifiqueSuccess,
  fetchActivitesSpecifiques,
  clearMessages: clearActiviteSpecifiqueMessages
} = useActiviteSpecifiqueManagement()

// État des modals
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isActiviteSpecifiqueModalOpen = ref(false)
const isEditActiviteSpecifiqueModalOpen = ref(false)
const isDeleteActiviteSpecifiqueModalOpen = ref(false)

// Activité spécifique sélectionnée pour les actions
const selectedActiviteSpecifique = ref(null)

// Charger l'activité générale
const loadActiviteGenerale = async () => {
  // Charger d'abord les qualiticiens pour avoir les noms
  await fetchQualiticiens()
  // Puis charger l'activité générale
  const result = await fetchActiviteGenerale(activiteGeneraleId)
  if (result.success && currentActiviteGenerale.value) {
    pageTitle.value = `${currentActiviteGenerale.value.titre} - Détails`
    // Charger les activités spécifiques après avoir chargé l'activité générale
    await loadActivitesSpecifiques()
  }
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

// Helper pour obtenir les initiales d'un qualiticient
const getQualiticiendInitials = (qualiticient) => {
  if (typeof qualiticient === 'object' && qualiticient.name && qualiticient.surname) {
    return `${qualiticient.name.charAt(0)}${qualiticient.surname.charAt(0)}`
  }
  return 'Q'
}

// Handlers pour les actions
const handleEditActiviteGenerale = () => {
  isEditModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🔄 Ouverture modal édition activité générale:', currentActiviteGenerale.value?.titre)
  }
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const handleActiviteGeneraleUpdated = async (updatedActiviteGenerale) => {
  if (import.meta.dev) {
    console.log('🟢 Activité générale modifiée:', updatedActiviteGenerale.titre)
  }
  
  // Recharger l'activité générale pour avoir les dernières données
  await loadActiviteGenerale()
}

const handleDeleteActiviteGenerale = () => {
  isDeleteModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🗑️ Ouverture modal suppression activité générale:', currentActiviteGenerale.value?.titre)
  }
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
}

const handleActiviteGeneraleDeleted = (deletedActiviteGenerale) => {
  if (import.meta.dev) {
    console.log('🟢 Activité générale supprimée:', deletedActiviteGenerale.titre)
  }
  
  // Rediriger vers la page du sous-projet parent après suppression
  if (currentActiviteGenerale.value?.sous_projet) {
    navigateTo(`/admin/subprojects/${currentActiviteGenerale.value.sous_projet}`)
  } else {
    navigateTo('/admin')
  }
}

// Handlers pour les activités spécifiques
const handleCreateActiviteSpecifique = () => {
  isActiviteSpecifiqueModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🔄 Ouverture modal création activité spécifique pour activité générale:', currentActiviteGenerale.value?.titre)
  }
}

const closeActiviteSpecifiqueModal = () => {
  isActiviteSpecifiqueModalOpen.value = false
}

// Handler pour le clic sur une carte d'activité spécifique
const handleActiviteSpecifiqueClick = (activiteSpecifique) => {
  // Naviguer vers la page de détails de l'activité spécifique
  navigateTo(`/admin/specific-activities/${activiteSpecifique.id}`)
  
  if (import.meta.dev) {
    console.log('🔗 Navigation vers activité spécifique:', activiteSpecifique.titre)
  }
}

const handleActiviteSpecifiqueCreated = async (newActiviteSpecifique) => {
  if (import.meta.dev) {
    console.log('🟢 Activité spécifique créée:', newActiviteSpecifique.titre)
  }
  
  // Recharger les activités spécifiques
  await loadActivitesSpecifiques()
}

// Handlers pour les actions sur les activités spécifiques
const handleEditActiviteSpecifique = (activiteSpecifique) => {
  selectedActiviteSpecifique.value = activiteSpecifique
  isEditActiviteSpecifiqueModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🔄 Ouverture modal édition activité spécifique:', activiteSpecifique.titre)
  }
}

const closeEditActiviteSpecifiqueModal = () => {
  isEditActiviteSpecifiqueModalOpen.value = false
  selectedActiviteSpecifique.value = null
}

const handleActiviteSpecifiqueUpdated = async (updatedActiviteSpecifique) => {
  if (import.meta.dev) {
    console.log('🟢 Activité spécifique modifiée:', updatedActiviteSpecifique.titre)
  }
  
  // Recharger les activités spécifiques
  await loadActivitesSpecifiques()
}

const handleDeleteActiviteSpecifique = (activiteSpecifique) => {
  selectedActiviteSpecifique.value = activiteSpecifique
  isDeleteActiviteSpecifiqueModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🗑️ Ouverture modal suppression activité spécifique:', activiteSpecifique.titre)
  }
}

const closeDeleteActiviteSpecifiqueModal = () => {
  isDeleteActiviteSpecifiqueModalOpen.value = false
  selectedActiviteSpecifique.value = null
}

const handleActiviteSpecifiqueDeleted = async (deletedActiviteSpecifique) => {
  if (import.meta.dev) {
    console.log('🟢 Activité spécifique supprimée:', deletedActiviteSpecifique.titre)
  }
  
  // Recharger les activités spécifiques
  await loadActivitesSpecifiques()
}

// Charger les activités spécifiques
const loadActivitesSpecifiques = async () => {
  if (currentActiviteGenerale.value?.id) {
    await fetchActivitesSpecifiques(currentActiviteGenerale.value.id)
  }
}

// Titre de la page avec meta
useHead({
  title: pageTitle
})

// Charger l'activité générale au montage
onMounted(async () => {
  await loadActiviteGenerale()
})

// Valider que l'ID est un nombre
if (!activiteGeneraleId || isNaN(Number(activiteGeneraleId))) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Activité générale introuvable'
  })
}
</script>
