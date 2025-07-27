import { 
  AnalyzeRequest, 
  AnalyzeResponse, 
  HistoryResponse 
} from "@/interfaces/api.interface"
import { apiClient } from "./api-client"

class UrlService {
  private readonly URL_ENDPOINTS = {
    ANALYZE: '/urls/analyze',
    HISTORY: '/urls/history',
  } as const

  /**
   * Analyze a URL and get word frequency data
   */
  async analyze(data: AnalyzeRequest): Promise<AnalyzeResponse> {
    return apiClient.post<AnalyzeRequest, AnalyzeResponse>(
      this.URL_ENDPOINTS.ANALYZE, 
      data, 
      {
        headers: { 'accept': 'application/json' }
      }
    )
  }

  /**
   * Get analysis history with pagination
   */
  async getHistory(page = 1, size = 10): Promise<HistoryResponse> {
    return apiClient.get<HistoryResponse>(this.URL_ENDPOINTS.HISTORY, {
      params: { page, size }
    })
  }
}

// Export singleton instance
export const urlService = new UrlService()

// Export the class for testing or other use cases
export { UrlService }
