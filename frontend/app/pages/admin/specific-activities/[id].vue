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
              <li v-if="currentActiviteSpecifique?.activite_generale_details">
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <button 
                    @click="navigateTo(`/admin/general-activities/${currentActiviteSpecifique.activite_generale}`)"
                    class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                  >
                    Activité générale parent
                  </button>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    Détails de l'activité spécifique
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <button 
              v-if="currentActiviteSpecifique"
              @click="handleEditActiviteSpecifique"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Modifier
            </button>
            
            <button 
              v-if="currentActiviteSpecifique"
              @click="handleDeleteActiviteSpecifique"
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
      <div v-if="activiteSpecifiqueLoading" class="flex items-center justify-center py-12">
        <div class="flex items-center">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-lg text-gray-600">Chargement de l'activité spécifique...</span>
        </div>
      </div>

      <!-- Détails de l'activité spécifique -->
      <div v-else-if="currentActiviteSpecifique" class="space-y-8">
        <!-- Informations de l'activité spécifique -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ currentActiviteSpecifique.titre }}</h1>
                <p class="mt-1 text-sm text-gray-500">Informations de l'activité spécifique</p>
              </div>
              <div class="flex items-center space-x-3">
                <button 
                  @click="handleAddPlanReference"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Ajouter un plan ref
                </button>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <svg class="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3"/>
                  </svg>
                  Activité spécifique
                </span>
              </div>
            </div>
          </div>
          <div class="px-6 py-5">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Titre de l'activité</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentActiviteSpecifique.titre }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Activité générale parent</dt>
                <dd class="mt-1">
                  <button 
                    v-if="currentActiviteSpecifique.activite_generale_details"
                    @click="navigateTo(`/admin/general-activities/${currentActiviteSpecifique.activite_generale}`)"
                    class="text-sm text-blue-600 hover:text-blue-900 font-medium underline"
                  >
                    {{ currentActiviteSpecifique.activite_generale_details.titre }}
                  </button>
                  <span v-else class="text-sm text-gray-500 italic">Non défini</span>
                </dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Date de création</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentActiviteSpecifique.created_at) }}</dd>
              </div>
              
              <div v-if="currentActiviteSpecifique.updated_at !== currentActiviteSpecifique.created_at">
                <dt class="text-sm font-medium text-gray-500">Dernière modification</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentActiviteSpecifique.updated_at) }}</dd>
              </div>

              <!-- Plans de référence -->
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500 mb-2">Plans de référence</dt>
                <dd>
                  <div v-if="planReferenceLoading" class="flex items-center text-sm text-gray-500">
                    <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement...
                  </div>
                  <div v-else-if="hasPlansReference" class="space-y-2">
                    <div 
                      v-for="plan in plansReference" 
                      :key="plan.id"
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div class="flex items-center">
                        <svg class="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="text-sm text-gray-700">{{ plan.nom }}</span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <button 
                          @click="handleEditPlanReference(plan)"
                          class="p-1 text-gray-400 hover:text-blue-600"
                          title="Modifier"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button 
                          @click="handleDeletePlanReference(plan)"
                          class="p-1 text-gray-400 hover:text-red-600"
                          title="Supprimer"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-500 italic">
                    Aucun plan de référence
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Section de l'activité générale parent (informations réduites) -->
        <div v-if="currentActiviteSpecifique.activite_generale_details" class="bg-white shadow rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Activité générale parent
            </h3>
          </div>
          <div class="px-6 py-5">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-gray-900 mb-2">
                  {{ currentActiviteSpecifique.activite_generale_details.titre }}
                </h4>
                <p class="text-sm text-gray-600 mb-3">
                  Cliquez pour voir les détails complets de l'activité générale
                </p>
                
                <!-- Qualiticiens de l'activité générale -->
                <div v-if="currentActiviteSpecifique.activite_generale_details.qualiticient && currentActiviteSpecifique.activite_generale_details.qualiticient.length > 0">
                  <span class="text-sm font-medium text-gray-600 mb-2 block">Qualiticiens assignés:</span>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="qualiticient in currentActiviteSpecifique.activite_generale_details.qualiticient" 
                      :key="qualiticient.id || qualiticient"
                      class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ getQualiticiendDisplayName(qualiticient) }}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                @click="navigateTo(`/admin/general-activities/${currentActiviteSpecifique.activite_generale}`)"
                class="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Voir l'activité générale
              </button>
            </div>
          </div>
        </div>

        <!-- Section Fiches de contrôles -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Fiches de contrôles
              </h3>
              <button 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Créer une fiche de contrôle
              </button>
            </div>
          </div>
          <div class="px-6 py-5">
            <div class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h4 class="mt-2 text-lg font-medium text-gray-900">Aucune fiche de contrôle</h4>
              <p class="mt-1 text-sm text-gray-500">
                Commencez par créer votre première fiche de contrôle pour cette activité spécifique.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="error && !activiteSpecifiqueLoading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Erreur de chargement</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <button 
            @click="loadActiviteSpecifique"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de modification d'activité spécifique -->
    <ActiviteSpecifiqueEditModal
      :is-open="isEditModalOpen"
      :activite-specifique="currentActiviteSpecifique"
      :activite-generale-id="currentActiviteSpecifique?.activite_generale"
      @close="closeEditModal"
      @updated="handleActiviteSpecifiqueUpdated"
    />

    <!-- Modal de suppression d'activité spécifique -->
    <ActiviteSpecifiqueDeleteModal
      :is-open="isDeleteModalOpen"
      :activite-specifique="currentActiviteSpecifique"
      @close="closeDeleteModal"
      @deleted="handleActiviteSpecifiqueDeleted"
    />

    <!-- Modal de création de plan de référence -->
    <PlanReferenceCreateModal
      :is-open="isPlanReferenceCreateModalOpen"
      :activite-specifique-id="activiteSpecifiqueId"
      @close="closePlanReferenceCreateModal"
      @created="handlePlanReferenceCreated"
    />

    <!-- Modal d'édition de plan de référence -->
    <PlanReferenceEditModal
      :is-open="isPlanReferenceEditModalOpen"
      :plan-reference="selectedPlanReference"
      @close="closePlanReferenceEditModal"
      @updated="handlePlanReferenceUpdated"
    />

    <!-- Modal de suppression de plan de référence -->
    <PlanReferenceDeleteModal
      :is-open="isPlanReferenceDeleteModalOpen"
      :plan-reference="selectedPlanReference"
      @close="closePlanReferenceDeleteModal"
      @deleted="handlePlanReferenceDeleted"
    />
  </div>
</template>

<script setup>
import { useActiviteSpecifiqueManagement } from '~/composables/useActiviteSpecifiqueManagement'
import { useActiviteGeneraleManagement } from '~/composables/useActiviteGeneraleManagement'
import { usePlanReferenceManagement } from '~/composables/usePlanReferenceManagement'
import ActiviteSpecifiqueEditModal from '~/components/ActiviteSpecifiqueEditModal.vue'
import ActiviteSpecifiqueDeleteModal from '~/components/ActiviteSpecifiqueDeleteModal.vue'
import PlanReferenceCreateModal from '~/components/PlanReferenceCreateModal.vue'
import PlanReferenceEditModal from '~/components/PlanReferenceEditModal.vue'
import PlanReferenceDeleteModal from '~/components/PlanReferenceDeleteModal.vue'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// Récupérer l'ID de l'activité spécifique depuis l'URL
const route = useRoute()
const activiteSpecifiqueId = route.params.id

// Titre dynamique de la page
const pageTitle = ref('Détails de l\'activité spécifique')

// Composable pour la gestion des activités spécifiques
const {
  currentActiviteSpecifique,
  activiteSpecifiqueLoading,
  error,
  success,
  fetchActiviteSpecifique,
  clearMessages
} = useActiviteSpecifiqueManagement()

// Composable pour la gestion des activités générales (pour les qualiticiens)
const {
  fetchQualiticiens,
  getQualiticiendDisplayName
} = useActiviteGeneraleManagement()

// Composable pour la gestion des plans de référence
const {
  plansReference,
  planReferenceLoading,
  hasPlansReference,
  fetchPlansReference
} = usePlanReferenceManagement()

// État des modals
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isPlanReferenceCreateModalOpen = ref(false)
const isPlanReferenceEditModalOpen = ref(false)
const isPlanReferenceDeleteModalOpen = ref(false)
const selectedPlanReference = ref(null)

// Charger l'activité spécifique
const loadActiviteSpecifique = async () => {
  // Charger d'abord les qualiticiens pour avoir les noms
  await fetchQualiticiens()
  // Puis charger l'activité spécifique
  const result = await fetchActiviteSpecifique(activiteSpecifiqueId)
  if (result.success && currentActiviteSpecifique.value) {
    pageTitle.value = `${currentActiviteSpecifique.value.titre} - Détails`
    // Charger les plans de référence pour cette activité
    await fetchPlansReference(activiteSpecifiqueId)
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

// Handlers pour les actions
const handleEditActiviteSpecifique = () => {
  isEditModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🔄 Ouverture modal édition activité spécifique:', currentActiviteSpecifique.value?.titre)
  }
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const handleActiviteSpecifiqueUpdated = async (updatedActiviteSpecifique) => {
  if (import.meta.dev) {
    console.log('🟢 Activité spécifique modifiée:', updatedActiviteSpecifique.titre)
  }
  
  // Recharger l'activité spécifique pour avoir les dernières données
  await loadActiviteSpecifique()
}

const handleDeleteActiviteSpecifique = () => {
  isDeleteModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🗑️ Ouverture modal suppression activité spécifique:', currentActiviteSpecifique.value?.titre)
  }
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
}

const handleActiviteSpecifiqueDeleted = (deletedActiviteSpecifique) => {
  if (import.meta.dev) {
    console.log('🟢 Activité spécifique supprimée:', deletedActiviteSpecifique.titre)
  }
  
  // Rediriger vers la page de l'activité générale parent après suppression
  if (currentActiviteSpecifique.value?.activite_generale) {
    navigateTo(`/admin/general-activities/${currentActiviteSpecifique.value.activite_generale}`)
  } else {
    navigateTo('/admin')
  }
}

// Handlers pour les plans de référence
const handleAddPlanReference = () => {
  isPlanReferenceCreateModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🔄 Ouverture modal création plan de référence')
  }
}

const closePlanReferenceCreateModal = () => {
  isPlanReferenceCreateModalOpen.value = false
}

const handlePlanReferenceCreated = async (newPlanReference) => {
  if (import.meta.dev) {
    console.log('🟢 Plan de référence créé:', newPlanReference.nom)
  }
  
  // Recharger les plans de référence
  await fetchPlansReference(activiteSpecifiqueId)
}

// Handlers pour l'édition de plan de référence
const handleEditPlanReference = (plan) => {
  selectedPlanReference.value = plan
  isPlanReferenceEditModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🔄 Ouverture modal édition plan de référence:', plan.nom)
  }
}

const closePlanReferenceEditModal = () => {
  isPlanReferenceEditModalOpen.value = false
  selectedPlanReference.value = null
}

const handlePlanReferenceUpdated = async (updatedPlanReference) => {
  if (import.meta.dev) {
    console.log('🟢 Plan de référence modifié:', updatedPlanReference.nom)
  }
  
  // Recharger les plans de référence
  await fetchPlansReference(activiteSpecifiqueId)
}

// Handlers pour la suppression de plan de référence
const handleDeletePlanReference = (plan) => {
  selectedPlanReference.value = plan
  isPlanReferenceDeleteModalOpen.value = true
  
  if (import.meta.dev) {
    console.log('🔄 Ouverture modal suppression plan de référence:', plan.nom)
  }
}

const closePlanReferenceDeleteModal = () => {
  isPlanReferenceDeleteModalOpen.value = false
  selectedPlanReference.value = null
}

const handlePlanReferenceDeleted = async (deletedPlanReference) => {
  if (import.meta.dev) {
    console.log('🟢 Plan de référence supprimé:', deletedPlanReference.nom)
  }
  
  // Recharger les plans de référence
  await fetchPlansReference(activiteSpecifiqueId)
}

// Titre de la page avec meta
useHead({
  title: pageTitle
})

// Charger l'activité spécifique au montage
onMounted(async () => {
  await loadActiviteSpecifique()
})

// Valider que l'ID est un nombre
if (!activiteSpecifiqueId || isNaN(Number(activiteSpecifiqueId))) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Activité spécifique introuvable'
  })
}
</script>
