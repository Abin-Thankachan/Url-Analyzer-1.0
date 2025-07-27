import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/auth.service'
import { ApiError, AuthResponse, LoginRequest, RegisterRequest, RegisterResponse } from '@/interfaces/api.interface'
import env from '@/config/environment'

interface User {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<RegisterResponse>
  logout: () => void
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


interface AuthData {
  access_token: string
  token_type: string
  user: User
  isLoggedIn: boolean
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const saveAuthData = (authResponse: AuthResponse) => {
    const authData: AuthData = {
      access_token: authResponse.access_token,
      token_type: authResponse.token_type,
      user: authResponse.user,
      isLoggedIn: true,
    }
    localStorage.setItem(env.authStorageKey, JSON.stringify(authData))
    setUser(authResponse.user)
  }

  const clearAuthData = () => {
    localStorage.removeItem(env.authStorageKey)
    setUser(null)
  }

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authService.login(credentials)
      saveAuthData(response)
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError('Login failed. Please try again.')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authService.register(data)
      // Don't automatically log in after registration
      // Just return the response to indicate success
      return response
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError('Registration failed. Please try again.')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    clearAuthData()
    setError(null)
  }

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authData = localStorage.getItem(env.authStorageKey)
        if (authData) {
          const { user: storedUser, isLoggedIn }: AuthData = JSON.parse(authData)
          if (isLoggedIn && storedUser) {
            setUser(storedUser)
          } else {
            clearAuthData()
          }
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
