
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ExternalLink, Download } from "lucide-react"
import { AnalyzeResponse } from "@/interfaces/api.interface"

interface AnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  data: AnalyzeResponse | null
}

export function AnalysisModal({ isOpen, onClose, data }: AnalysisModalProps) {
  if (!data) return null

  const chartConfig = {
    count: {
      label: "Word Count",
      color: "hsl(var(--chart-1))",
    },
  }

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Word,Count\n" +
      data.top_words.map((item) => `${item.word},${item.count}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `analysis-${data.url.replace(/[^a-zA-Z0-9]/g, "-")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Analysis Results
          </DialogTitle>
          <DialogDescription>Word frequency analysis for {data.url}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Analyzed on {new Date(data.analyzed_at).toLocaleDateString()} at {new Date(data.analyzed_at).toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-500">Showing {data.top_words.length} most frequent words</p>
            </div>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Word Frequency Chart</CardTitle>
              <CardDescription>Visual representation of the most frequently used words</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.top_words} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="word" angle={-45} textAnchor="end" height={80} fontSize={12} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
              <CardDescription>Complete list of word frequencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.top_words.map((item, index) => (
                  <div key={item.word} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium">{item.word}</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
