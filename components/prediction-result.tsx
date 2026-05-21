'use client'

import 'react-circular-progressbar/dist/styles.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import jsPDF from 'jspdf'
import { toPng } from 'html-to-image'
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

const RISK_THEME: Record<
  RiskLevel,
  { color: string; label: string; bgClass: string }
> = {
  low: {
    color: '#16a34a',
    label: 'Low Risk',
    bgClass: 'bg-green-100',
  },
  medium: {
    color: '#d4a017',
    label: 'Medium Risk',
    bgClass: 'bg-yellow-100',
  },
  high: {
    color: '#dc2626',
    label: 'High Risk',
    bgClass: 'bg-red-100',
  },
}

const STATUS_COLOR: Record<FactorStatus, string> = {
  good: '#16a34a',
  warning: '#d4a017',
  danger: '#dc2626',
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


const exportPDF = async () => {

  const element = document.getElementById('pdf-export')

  if (!element) return

  // tampilkan sementara
  element.style.visibility = 'visible'

  const dataUrl = await toPng(element, {
    cacheBust: true,
    backgroundColor: '#ffffff',
    pixelRatio: 2,
    skipFonts: true,
  })

  // sembunyikan lagi
  element.style.visibility = 'hidden'

  const pdf = new jsPDF('p', 'mm', 'a4')

  const imgProps = pdf.getImageProperties(dataUrl)

  const pdfWidth = 190
  const pdfHeight =
    (imgProps.height * pdfWidth) / imgProps.width

  pdf.addImage(dataUrl, 'PNG', 10, 10, pdfWidth, pdfHeight)

  pdf.save('cardioinsight-report.pdf')
}

  return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50">
  <div
    id="result-section"
    className="space-y-5 animate-fade-in p-4"
  >
     {/* Main Risk Card */}
<div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.08)]">

  {/* Glow Effects */}
  <div className="absolute -top-24 -left-24 w-72 h-72 bg-green-300/30 rounded-full blur-3xl" />
  <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl" />

  <div className="relative z-10 p-6 space-y-6">

    {/* Header */}
    <div className="text-center space-y-3">

      <div
        className="mx-auto flex items-center justify-center w-20 h-20 rounded-full shadow-lg"
        style={{
          background: `${theme.color}15`,
        }}
      >
        <RiskIcon
          className="w-10 h-10"
          style={{ color: theme.color }}
        />
      </div>

      <div>
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: theme.color }}
        >
          {theme.label}
        </h1>

        <p className="text-gray-500 mt-1">
          Cardiovascular risk prediction result
        </p>
      </div>

    </div>

    {/* Circular Progress */}
    <div className="flex flex-col items-center justify-center">

      <div className="w-56 h-56">
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

      <p className="text-lg font-semibold text-gray-700 mt-4">
        Risk Probability
      </p>

      <p className="text-xs text-gray-500 mt-1">
        Generated Report
      </p>

    </div>

    {/* Risk Bar */}
    <div className="space-y-3">

      <div className="flex justify-between text-xs font-medium text-gray-500">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>

      <div className="relative h-4 rounded-full bg-gray-200 overflow-hidden">

        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${result.riskPercentage}%`,
            background: `linear-gradient(to right, ${theme.color}, ${theme.color}99)`,
          }}
        />

        <div className="absolute inset-y-0 left-[40%] w-px bg-white/50" />
        <div className="absolute inset-y-0 left-[65%] w-px bg-white/50" />

      </div>

    </div>

  </div>
</div>

{/* Factor Importance */}
<Card className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg">

  <CardHeader>
    <div className="flex items-center gap-2">

      <TrendingUp className="h-5 w-5 text-green-700" />

      <div>
        <CardTitle>Contributing Factors</CardTitle>

        <CardDescription>
          Each factor&apos;s contribution to the prediction
        </CardDescription>
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
<Card className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg">

  <CardHeader>

    <div className="flex items-center gap-2">

      <Lightbulb className="h-5 w-5 text-green-700" />

      <div>
        <CardTitle>Health Recommendations</CardTitle>

        <CardDescription>
          Personalized advice based on your data
        </CardDescription>
      </div>

    </div>

  </CardHeader>

  <CardContent>

    <ul className="space-y-3">

      {(result?.recommendations || []).map((rec, i) => (

        <li
          key={i}
          className="flex items-start gap-3 p-3 rounded-lg bg-green-50"
        >

          <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700">
            {i + 1}
          </div>

          <span className="text-sm leading-relaxed">
            {rec}
          </span>

        </li>

      ))}

    </ul>

    <div className="mt-5 p-4 rounded-lg bg-gray-200/60 border border-gray-200">

      <p className="text-xs text-gray-500 text-center leading-relaxed">

        <strong className="text-black">
          Disclaimer:
        </strong>{' '}

        This prediction result is not a medical diagnosis.
        Always consult a doctor or healthcare professional.

      </p>

    </div>

  </CardContent>
</Card>

      <div
  id="pdf-export"
  style={{
    position: 'fixed',
    top: '0',
    left: '0',
    width: '800px',

    background: '#ffffff',
    color: '#000000',
    padding: '32px',
    fontFamily: 'Arial',

    zIndex: -1,
    opacity: 1,

    pointerEvents: 'none',

    visibility: 'hidden',
  }}
>
  <h1
    style={{
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '24px',
      color: theme.color,
    }}
  >
    CardioInsight Report
  </h1>

  <div
    style={{
      border: '1px solid #e5e7eb',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
    }}
  >
    <h2
      style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: theme.color,
        marginBottom: '16px',
      }}
    >
      {theme.label}
    </h2>

    <div
      style={{
        width: '160px',
        height: '160px',
        borderRadius: '999px',
        border: `12px solid ${theme.color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto',
        fontSize: '42px',
        fontWeight: 'bold',
        color: theme.color,
      }}
    >
      {Math.round(result.riskPercentage)}%
    </div>

    <p
      style={{
        textAlign: 'center',
        fontSize: '18px',
      }}
    >
      Risk Probability
    </p>
  </div>

  <div
    style={{
      border: '1px solid #e5e7eb',
      borderRadius: '16px',
      padding: '24px',
    }}
  >
    <h2
      style={{
        fontSize: '22px',
        fontWeight: 'bold',
        marginBottom: '16px',
      }}
    >
      Recommendations
    </h2>

    <ul style={{ paddingLeft: '20px' }}>
      {(result?.recommendations || []).map((rec, i) => (
        <li
          key={i}
          style={{
            marginBottom: '14px',
            fontSize: '16px',
            lineHeight: '1.7',
          }}
        >
          {rec}
        </li>
      ))}
    </ul>
  </div>
</div>

      {/* Actions */}
      <div className="sticky bottom-4 flex gap-3 pt-2">
        <Button
  onClick={onSave}
  className="flex-1 rounded-xl h-12 text-base font-semibold shadow-lg"
>
          <Save className="h-4 w-4 mr-2" />
          Save Result
        </Button>
         <Button
  variant="outline"
  onClick={exportPDF}
  className="rounded-xl h-12 px-6 border-white/30 bg-white/60 backdrop-blur-md"
>
            Download PDF
          </Button>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>


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
