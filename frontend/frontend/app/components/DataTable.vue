<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th 
              v-for="header in headers" 
              :key="header.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ header.label }}
            </th>
            <th v-if="showActions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-50">
            <td 
              v-for="header in headers" 
              :key="header.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <slot :name="header.key" :item="item" :value="item[header.key]">
                {{ item[header.key] }}
              </slot>
            </td>
            <td v-if="showActions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <slot name="actions" :item="item" :index="index">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="$emit('edit', item)"
                    class="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    Modifier
                  </button>
                  <button 
                    @click="$emit('delete', item)"
                    class="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="data.length === 0" class="px-6 py-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune donnée</h3>
      <p class="mt-1 text-sm text-gray-500">{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  headers: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  showActions: {
    type: Boolean,
    default: true
  },
  emptyMessage: {
    type: String,
    default: 'Aucun élément à afficher'
  }
})

defineEmits(['edit', 'delete'])
</script>
