<template>
  <form @submit.prevent="$emit('submit')" class="space-y-6">
    <div class="bg-white shadow-sm rounded-lg border border-gray-200">
      <!-- Header -->
      <div v-if="title || subtitle" class="px-6 py-4 border-b border-gray-200">
        <h2 v-if="title" class="text-lg font-medium text-gray-900">{{ title }}</h2>
        <p v-if="subtitle" class="mt-1 text-sm text-gray-600">{{ subtitle }}</p>
      </div>
      
      <!-- Content -->
      <div class="px-6 py-6">
        <slot />
      </div>
      
      <!-- Actions -->
      <div v-if="showActions" class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <BaseButton
          v-if="showCancel"
          type="button"
          variant="secondary"
          @click="$emit('cancel')"
          :disabled="loading"
        >
          {{ cancelText }}
        </BaseButton>
        
        <BaseButton
          type="submit"
          variant="primary"
          :loading="loading"
          :disabled="disabled"
        >
          {{ submitText }}
        </BaseButton>
      </div>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  submitText: {
    type: String,
    default: 'Enregistrer'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['submit', 'cancel'])
</script>
