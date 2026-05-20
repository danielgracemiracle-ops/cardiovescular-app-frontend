'use client'

import { History, Trash2, Calendar, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { HistoryEntry, RiskLevel } from '@/lib/types'

interface Props {
  history: HistoryEntry[]
  onClear: () => void
  onSelectEntry: (entry: HistoryEntry) => void
}

const RISK_COLOR: Record<RiskLevel, string> = {
  low: 'var(--risk-low)',
  medium: 'var(--risk-medium)',
  high: 'var(--risk-high)',
}

const RISK_LABEL: Record<RiskLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function PredictionHistory({ history, onClear, onSelectEntry }: Props) {
  if (history.length === 0) {
    return (
      <Card className="sticky top-24">
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Prediction History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
              <History className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No history yet. Make your first prediction!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>History</CardTitle>
              <CardDescription>{history.length} saved results</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelectEntry(entry)}
            className="w-full p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: RISK_COLOR[entry.riskLevel] }}
              >
                {entry.riskPercentage}%
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="font-medium text-sm"
                  style={{ color: RISK_COLOR[entry.riskLevel] }}
                >
                  {RISK_LABEL[entry.riskLevel]} Risk
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3 w-3" />
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
