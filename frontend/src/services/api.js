import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { data, status } = error.response
      console.error(`API Error ${status}:`, data)
      return Promise.reject(new Error(data.error || data.message || 'An error occurred'))
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request)
      return Promise.reject(new Error('Network error - please check your connection'))
    } else {
      // Something else happened
      console.error('Request Error:', error.message)
      return Promise.reject(error)
    }
  }
)

// Logs API
export const logsAPI = {
  getLogs: (params) => api.get('/logs', { params }),
  getLogById: (id) => api.get(`/logs/${id}`),
  getDistinctValues: (field) => api.get(`/logs/distinct/${field}`),
  getLogStats: (params) => api.get('/logs/stats', { params }),
}

// Statistics API
export const statsAPI = {
  getSummary: (params) => api.get('/stats/summary', { params }),
  getSeverityDistribution: (params) => api.get('/stats/severity', { params }),
  getHostnameDistribution: (params) => api.get('/stats/hostnames', { params }),
  getSourceDistribution: (params) => api.get('/stats/sources', { params }),
  getCategoryDistribution: (params) => api.get('/stats/categories', { params }),
  getTimeSeriesData: (params) => api.get('/stats/timeseries', { params }),
  getOverview: (params) => api.get('/stats/overview', { params }),
}

export default api



