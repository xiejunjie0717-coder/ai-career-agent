// User types
export interface User {
  id: number
  email: string
  full_name?: string
  is_active: boolean
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

// Template types
export interface MessageTemplate {
  id: number
  user_id: number
  name: string
  content: string
  keywords: string[]
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CreateTemplateRequest {
  name: string
  content: string
  keywords?: string[]
  is_default?: boolean
}

// Job Config types
export interface JobConfig {
  id: number
  user_id: number
  name: string
  keywords: string[]
  cities: string[]
  salary_range?: string
  education?: string
  company_size: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateJobConfigRequest {
  name: string
  keywords: string[]
  cities?: string[]
  salary_range?: string
  education?: string
  company_size?: string[]
  is_active?: boolean
}

// Delivery Record types
export enum DeliveryStatus {
  PENDING = 'pending',
  SENT = 'sent',
  REPLIED = 'replied',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
}

export interface DeliveryRecord {
  id: number
  user_id: number
  template_id?: number
  job_config_id?: number
  job_title: string
  company_name: string
  salary?: string
  location?: string
  job_url?: string
  job_description?: string
  ai_score?: number
  ai_reason?: string
  status: DeliveryStatus
  sent_at?: string
  replied_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Stats types
export interface Stats {
  today_sent: number
  total_sent: number
  total_replied: number
  total_interview: number
  total_offer: number
  reply_rate: number
  interview_rate: number
  offer_rate: number
}

// AI types
export interface AIScoreRequest {
  job_title: string
  job_description: string
  company_description?: string
  target_keywords?: string[]
}

export interface AIScoreResponse {
  score: number
  reason: string
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
