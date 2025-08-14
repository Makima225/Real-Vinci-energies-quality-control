<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="$emit('click')"
    class="w-full flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="[
      variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : '',
      variant === 'secondary' ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500' : '',
      variant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : '',
      disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'
    ]"
  >
    <div v-if="loading" class="flex items-center">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ loadingText }}
    </div>
    <span v-else>
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Chargement...'
  }
})

defineEmits(['click'])
</script>
