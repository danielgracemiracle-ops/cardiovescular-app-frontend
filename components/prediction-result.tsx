'use client'

import 'react-circular-progressbar/dist/styles.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { Heart, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { PredictionResult, FactorStatus, RiskLevel } from '@/lib/types'

interface Props {
  result: PredictionResult
  onSave: () => void
  onClose: () => void
}

const RISK_THEME: Record<RiskLevel, { color: string; label: string; bgClass: string }> = {
  low: {
    color: 'var(--risk-low)',
    label: 'Low Risk',
    bgClass: 'bg-risk-low/10',
  },
  medium: {
    color: 'var(--risk-medium)',
    label: 'Medium Risk',
    bgClass: 'bg-risk-medium/10',
  },
  high: {
    color: 'var(--risk-high)',
    label: 'High Risk',
    bgClass: 'bg-risk-high/10',
  },
}

const STATUS_COLOR: Record<FactorStatus, string> = {
  good: 'var(--risk-low)',
  warning: 'var(--risk-medium)',
  danger: 'var(--risk-high)',
}

export function PredictionResultDisplay({ result, onSave, onClose }: Props) {
  const riskLevel = (result?.riskLevel || 'low').toLowerCase() as RiskLevel

  const theme = RISK_THEME[riskLevel]

  const RiskIcon =
    riskLevel === 'low'
    ? CheckCircle
    : riskLevel === 'medium'
    ? AlertTriangle
    : Heart

  const chartData = (result?.featureImportance || [])
  .slice(0, 7)
  .map((f) => ({
    name: f.feature,
    value: f.importance,
    status: f.status,
  }))

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Main Risk Card */}
      <Card className="glass-card soft-glow hover-lift overflow-hidden border-2 shadow-2xl">
        <CardHeader className={`text-center ${theme.bgClass}`}>
          <div className="flex justify-center mb-3">
            <div
              className="p-4 rounded-full"
              style={{ backgroundColor: `color-mix(in oklch, ${theme.color} 20%, transparent)` }}
            >
              <RiskIcon className="h-8 w-8" style={{ color: theme.color }} />
            </div>
          </div>
          <CardTitle className="text-2xl" style={{ color: theme.color }}>
            {theme.label}
          </CardTitle>
          <CardDescription>Your cardiovascular disease risk prediction result</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-44 h-44 mb-4">
              <CircularProgressbar
                value={result.riskPercentage}
                text={`${Math.round(result.riskPercentage)}%`}
                styles={buildStyles({
                  textColor: theme.color,
                  pathColor: theme.color,
                  trailColor: '#e5e7eb',
                  textSize: '18px',
                  pathTransitionDuration: 1.5,
                })}
              />
            </div>
              
            <p className="text-sm text-muted-foreground">
              Risk Probability
            </p>
          </div>

          {/* Risk Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${result.riskPercentage}%`, backgroundColor: theme.color }}
              />
              <div className="absolute inset-y-0 left-[40%] w-px bg-white/50" />
              <div className="absolute inset-y-0 left-[65%] w-px bg-white/50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Factor Importance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Contributing Factors</CardTitle>
              <CardDescription>Each factor&apos;s contribution to the prediction</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
             <BarChart
               data={chartData}
               layout="vertical"
               margin={{ left: 0, right: 20, top: 5, bottom: 5 }}
             >
           
               <defs>
                 <linearGradient id="colorRisk" x1="0" y1="0" x2="1" y2="0">
                   <stop offset="0%" stopColor="#10b981" />
                   <stop offset="100%" stopColor="#06b6d4" />
                 </linearGradient>
               </defs>
           
               <XAxis
                 type="number"
                 domain={[0, 100]}
                 tick={{ fontSize: 11 }}
               />
           
               <YAxis
                 dataKey="name"
                 type="category"
                 width={100}
                 tick={{ fontSize: 12 }}
               />
           
               <Tooltip
                 formatter={(v: number) => [`${v}%`, 'Contribution']}
                 contentStyle={{
                   backgroundColor: 'var(--card)',
                   border: '1px solid var(--border)',
                   borderRadius: '8px',
                 }}
               />
           
               <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={STATUS_COLOR[entry.status]}
                    />
                  ))}
                </Bar>
           
             </BarChart>
           </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center text-xs">
            <LegendItem color={STATUS_COLOR.good} label="Good" />
            <LegendItem color={STATUS_COLOR.warning} label="Needs Attention" />
            <LegendItem color={STATUS_COLOR.danger} label="At Risk" />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Health Recommendations</CardTitle>
              <CardDescription>Personalized advice based on your data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {(result?.recommendations || []).map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-primary/5"
              >
                <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary">
                  {i + 1}
                </div>
                <span className="text-sm leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 p-4 rounded-lg bg-muted/60 border border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> This prediction result is not a 
              medical diagnosis. Always consult a doctor or healthcare professional for accurate health 
              assessment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={onSave} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save Result
        </Button>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  )
}
