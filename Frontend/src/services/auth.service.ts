import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  RegisterResponse 
} from "@/interfaces/api.interface"
import { apiClient } from "./api-client"
import { env } from "@/config/environment"

class AuthService {
   static readonly AUTH_ENDPOINTS = {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  } as const

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterRequest, RegisterResponse>(
      AuthService.AUTH_ENDPOINTS.REGISTER, 
      data
    )
  }

  /**
   * Login user with credentials
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<LoginRequest, AuthResponse>(
      AuthService.AUTH_ENDPOINTS.LOGIN, 
      data
    )
  }

  /**
   * Logout current user (if backend supports it)
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(AuthService.AUTH_ENDPOINTS.LOGOUT, {})
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      // Clear local storage regardless of API response
      this.clearAuthData()
    }
  }

  /**
   * Refresh authentication token (if backend supports it)
   */
  async refreshToken(): Promise<AuthResponse> {
    return apiClient.post<{}, AuthResponse>(AuthService.AUTH_ENDPOINTS.REFRESH, {})
  }

  /**
   * Clear authentication data from local storage
   */
  clearAuthData(): void {
    localStorage.removeItem(env.authStorageKey)
  }

  /**
   * Save authentication data to local storage
   */
  saveAuthData(authData: AuthResponse): void {
    const dataToSave = {
      ...authData,
      isLoggedIn: true,
      timestamp: Date.now()
    }
    localStorage.setItem(env.authStorageKey, JSON.stringify(dataToSave))
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    const authData = localStorage.getItem(env.authStorageKey)
    if (!authData) return false

    try {
      const parsed = JSON.parse(authData)
      return !!(parsed.access_token && parsed.isLoggedIn)
    } catch {
      return false
    }
  }

  /**
   * Get current user data from storage
   */
  getCurrentUser(): any | null {
    const authData = localStorage.getItem(env.authStorageKey)
    if (!authData) return null

    try {
      const parsed = JSON.parse(authData)
      return parsed.user || null
    } catch {
      return null
    }
  }
}

// Export singleton instance
export const authService = new AuthService()

// Export the class for testing or other use cases
export { AuthService }
