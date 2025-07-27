import { ApiError } from "@/interfaces/api.interface"
import { env } from "@/config/environment"

interface RequestConfig {
  headers?: Record<string, string>
  useFormData?: boolean
  params?: Record<string, any>
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * @description A generic API client for making HTTP requests.
 * Handles authentication, request building, and error handling.
 * This client can be used across different services to ensure consistent API interactions.
 */
class ApiClient {
  private readonly baseUrl: string
  private readonly authStorageKey: string

  constructor(baseUrl: string, authStorageKey = env.authStorageKey) {
    this.baseUrl = baseUrl
    this.authStorageKey = authStorageKey
  }

  private getAuthToken(): string | null {
    const authData = localStorage.getItem(this.authStorageKey)
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        return parsed.access_token
      } catch (error) {
        console.error('Failed to parse auth data:', error)
        return null
      }
    }
    return null
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    
    return url.toString()
  }

  private buildHeaders(config?: RequestConfig): Record<string, string> {
    const headers: Record<string, string> = {
      ...(config?.headers || {})
    }

    // Add Authorization header if token exists
    const token = this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      }
      
    if (!config?.useFormData) {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }

  private async makeRequest<TResponse>(
    method: HttpMethod,
    endpoint: string,
    payload?: any,
    config?: RequestConfig
  ): Promise<TResponse> {
    const url = this.buildUrl(endpoint, config?.params)
    const headers = this.buildHeaders(config)
      
    let body: any = undefined
    
    if (payload && ['POST', 'PUT', 'PATCH'].includes(method)) {
      if (config?.useFormData) {
        body = payload instanceof FormData ? payload : this.createFormData(payload)
      } else {
        body = JSON.stringify(payload)
      }
    }
    
    const requestConfig: RequestInit = {
      method,
      headers,
      body
    }

    try {
      const response = await fetch(url, requestConfig)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        )
      }

      return response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error occurred', 0, error)
    }
  }

  private createFormData(payload: Record<string, any>): FormData {
    const formData = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })
    return formData
  }

  // Generic HTTP methods
  async get<TResponse>(endpoint: string, config?: RequestConfig): Promise<TResponse> {
    return this.makeRequest<TResponse>('GET', endpoint, undefined, config)
  }

  async post<TPayload, TResponse>(
    endpoint: string, 
    payload: TPayload, 
    config?: RequestConfig
  ): Promise<TResponse> {
    return this.makeRequest<TResponse>('POST', endpoint, payload, config)
  }

  async put<TPayload, TResponse>(
    endpoint: string, 
    payload: TPayload, 
    config?: RequestConfig
  ): Promise<TResponse> {
    return this.makeRequest<TResponse>('PUT', endpoint, payload, config)
  }

  async patch<TPayload, TResponse>(
    endpoint: string, 
    payload: TPayload, 
    config?: RequestConfig
  ): Promise<TResponse> {
    return this.makeRequest<TResponse>('PATCH', endpoint, payload, config)
  }

  async delete<TResponse>(endpoint: string, config?: RequestConfig): Promise<TResponse> {
    return this.makeRequest<TResponse>('DELETE', endpoint, undefined, config)
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(env.apiBaseUrl)

// Export types for other services to use
export type { RequestConfig, HttpMethod }
