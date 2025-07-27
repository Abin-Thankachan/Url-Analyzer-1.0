import { useState, useCallback } from 'react'
import { AnalyzeResponse, HistoryResponse, AnalyzeRequest, ApiError } from '@/interfaces/api.interface'
import { urlService } from '@/services'


interface UseUrlAnalysisReturn {
  analyzeUrl: (url: string) => Promise<AnalyzeResponse>
  getHistory: (page?: number, size?: number) => Promise<HistoryResponse>
  isAnalyzing: boolean
  isLoadingHistory: boolean
  error: string | null
  clearError: () => void
}

export function useUrlAnalysis(): UseUrlAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const analyzeUrl = useCallback(async (url: string): Promise<AnalyzeResponse> => {
    try {
      setIsAnalyzing(true)
      setError(null)
      const data: AnalyzeRequest = { url }
      const result = await urlService.analyze(data)
      return result
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to analyze URL. Please try again.'
      setError(errorMessage)
      throw error
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const getHistory = useCallback(async (page = 1, size = 10): Promise<HistoryResponse> => {
    try {
      setIsLoadingHistory(true)
      setError(null)
      const result = await urlService.getHistory(page, size)
      return result
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to load history. Please try again.'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  return {
    analyzeUrl,
    getHistory,
    isAnalyzing,
    isLoadingHistory,
    error,
    clearError,
  }
}
