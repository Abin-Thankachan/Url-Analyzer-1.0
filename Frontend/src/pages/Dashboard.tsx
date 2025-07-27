import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, BarChart3, Clock, ExternalLink, LogOut, User, RefreshCw } from "lucide-react"
import { AnalysisModal } from "@/components/analysis-modal"
import { useAuth } from "@/contexts/auth-context"
import { useUrlAnalysis } from "@/hooks/use-url-analysis"
import { AnalyzeResponse, HistoryResponse } from "@/interfaces/api.interface"


interface HistoryItem extends AnalyzeResponse {
  timestamp: Date
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { analyzeUrl, getHistory, isAnalyzing, isLoadingHistory, error, clearError } = useUrlAnalysis()
  const [url, setUrl] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [currentResults, setCurrentResults] = useState<AnalyzeResponse | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyPage, setHistoryPage] = useState(1)
  const [historyData, setHistoryData] = useState<HistoryResponse | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const response = await getHistory(historyPage, 10)
      setHistoryData(response)
      const historyWithTimestamp = response.items.map(item => ({
        ...item,
        timestamp: new Date(item.analyzed_at)
      }))
      setHistory(historyWithTimestamp)
    } catch (error) {
      console.error("Failed to load history:", error)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const analyzeWebpage = async () => {
    if (!url) return

    clearError()
    try {
      const result = await analyzeUrl(url)
      setCurrentResults(result)
      setShowResults(true)
      setUrl("") // Clear the input
      // Reload history to show the new analysis
      loadHistory()
    } catch (error) {
      console.error("Analysis failed:", error)
    }
  }

  const viewPreviousResult = (item: AnalyzeResponse) => {
    setCurrentResults(item)
    setShowResults(true)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Web Page Analyzer</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.username}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700">
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Analyze Web Page</CardTitle>
                <CardDescription>
                  Enter a URL to analyze the most frequently used words on the page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                <Button onClick={analyzeWebpage} disabled={!url || isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analyze Page
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analysis History */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Analysis</CardTitle>
                    <CardDescription>Your previous web page analyses</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadHistory}
                    disabled={isLoadingHistory}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No analysis history yet</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => viewPreviousResult(item)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.url}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {item.timestamp.toLocaleDateString()} at{" "}
                                {item.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">
                              {item.top_words.length} words analyzed
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Results Modal */}
      {showResults && currentResults && (
        <AnalysisModal
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          data={currentResults}
        />
      )}
    </div>
  )
}
