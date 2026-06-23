import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  register: (data: { email: string; password: string; full_name?: string }) =>
    api.post('/api/auth/register', data),
}

// User API
export const userApi = {
  getMe: () => api.get('/api/users/me'),
  updateMe: (data: { full_name?: string; password?: string }) =>
    api.put('/api/users/me', data),
}

// Templates API
export const templatesApi = {
  list: () => api.get('/api/templates/'),
  get: (id: number) => api.get(`/api/templates/${id}`),
  create: (data: { name: string; content: string; keywords?: string[]; is_default?: boolean }) =>
    api.post('/api/templates/', data),
  update: (id: number, data: { name?: string; content?: string; keywords?: string[]; is_default?: boolean }) =>
    api.put(`/api/templates/${id}`, data),
  delete: (id: number) => api.delete(`/api/templates/${id}`),
}

// Job Configs API
export const jobConfigsApi = {
  list: () => api.get('/api/job-configs/'),
  get: (id: number) => api.get(`/api/job-configs/${id}`),
  create: (data: {
    name: string
    keywords: string[]
    cities?: string[]
    salary_range?: string
    education?: string
    company_size?: string[]
    is_active?: boolean
  }) => api.post('/api/job-configs/', data),
  update: (id: number, data: {
    name?: string
    keywords?: string[]
    cities?: string[]
    salary_range?: string
    education?: string
    company_size?: string[]
    is_active?: boolean
  }) => api.put(`/api/job-configs/${id}`, data),
  delete: (id: number) => api.delete(`/api/job-configs/${id}`),
}

// Deliveries API
export const deliveriesApi = {
  list: (params?: { status?: string; search?: string; page?: number; page_size?: number }) =>
    api.get('/api/deliveries/', { params }),
  get: (id: number) => api.get(`/api/deliveries/${id}`),
  create: (data: {
    job_title: string
    company_name: string
    salary?: string
    location?: string
    job_url?: string
    job_description?: string
    template_id?: number
    job_config_id?: number
    ai_score?: number
    ai_reason?: string
  }) => api.post('/api/deliveries/', data),
  update: (id: number, data: { status?: string; notes?: string }) =>
    api.put(`/api/deliveries/${id}`, data),
  delete: (id: number) => api.delete(`/api/deliveries/${id}`),
  getStats: () => api.get('/api/deliveries/stats'),
  export: () => api.get('/api/deliveries/export', { responseType: 'text' }),
}

// AI API
export const aiApi = {
  score: (data: {
    job_title: string
    job_description: string
    company_description?: string
    target_keywords?: string[]
  }) => api.post('/api/ai/score', data),
  generateMessage: (data: {
    job_title: string
    job_description: string
    company_name: string
    user_experience?: string
    user_skills?: string
  }) => api.post('/api/ai/generate-message', data),
}
