// composables/useFetchAPI.js
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

export function useFetchAPI() {
  const config = useRuntimeConfig()
  const loading = ref(false)
  const error = ref(null)

  // Configuration pour le développement avec fallback
  const getApiUrl = () => {
    // En développement, utiliser une URL par défaut si pas configurée
    if (process.dev) {
      return config.public?.apiBase || 'http://localhost:8000/api'
    }
    // En production, exiger la configuration
    const apiUrl = config.public?.apiBase
    if (!apiUrl) {
      throw new Error('API_BASE_URL n\'est pas configuré dans nuxt.config.js')
    }
    return apiUrl
  }

  const buildUrl = (endpoint) => {
    const apiUrl = getApiUrl()
    
    if (!endpoint || endpoint === 'undefined') {
      return apiUrl
    }
    return apiUrl.replace(/\/$/, '') + '/' + endpoint.replace(/^\//, '')
  }

  const makeRequest = async (endpoint, options = {}) => {
    loading.value = true
    error.value = null

    try {
      const url = endpoint.startsWith('http') ? endpoint : buildUrl(endpoint)
      
      // En développement, log des requêtes pour debug
      if (process.dev) {
        console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`)
      }

      // Gestion du token côté client uniquement
      const token = import.meta.client ? localStorage.getItem('token') : null

      // Copie les headers de l'utilisateur
      const headers = { ...options.headers }

      // Si ce n'est PAS du FormData, on met Content-Type
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }

      // Protéger l'accès au token côté serveur
      if (token && options.includeAuth !== false && import.meta.client) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(url, {
        ...options,
        headers
      })

      // En développement, log des réponses
      if (process.dev) {
        console.log(`✅ API Response: ${response.status} ${response.statusText}`)
        if (!response.ok) {
          console.error(`❌ API Error: ${response.status} ${response.statusText}`)
        }
      }

      loading.value = false
      return response
    } catch (err) {
      error.value = err
      loading.value = false
      
      // En développement, log détaillé des erreurs
      if (process.dev) {
        console.error('❌ API Request Failed:', err)
      }
      
      throw err
    }
  }

  // Support pour l'ancienne syntaxe (comme fonction)
  const urlBuilder = (endpoint) => buildUrl(endpoint)

  // Support pour la nouvelle syntaxe (comme objet)
  urlBuilder.get = (endpoint, options = {}) => makeRequest(endpoint, { method: 'GET', ...options })
  urlBuilder.post = (endpoint, data, options = {}) => makeRequest(endpoint, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
    ...options
  })
  urlBuilder.put = (endpoint, data, options = {}) => makeRequest(endpoint, {
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data),
    ...options
  })
  urlBuilder.patch = (endpoint, data, options = {}) => makeRequest(endpoint, {
    method: 'PATCH',
    body: data instanceof FormData ? data : JSON.stringify(data),
    ...options
  })
  urlBuilder.delete = (endpoint, options = {}) => makeRequest(endpoint, { method: 'DELETE', ...options })

  // Propriétés réactives
  urlBuilder.loading = loading
  urlBuilder.error = error

  // Utilitaire pour debug en développement
  if (process.dev) {
    urlBuilder.getApiUrl = getApiUrl
  }

  return urlBuilder
}