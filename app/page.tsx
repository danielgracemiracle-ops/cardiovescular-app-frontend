'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { Heart, Activity, Brain, Shield, Sparkles, ArrowRight } from 'lucide-react'
import { toast, Toaster } from 'sonner'

import { Header } from '@/components/header'
import { HealthForm } from '@/components/health-form'
import { predictCardiovascularRisk } from '@/lib/prediction'
import type { HealthData, PredictionResult, HistoryEntry } from '@/lib/types'

// Dynamic import components that use Recharts — fixes SSR issues
const PredictionResultDisplay = dynamic(
  () => import('@/components/prediction-result').then((m) => m.PredictionResultDisplay),
  { ssr: false }
)
const PredictionHistory = dynamic(
  () => import('@/components/prediction-history').then((m) => m.PredictionHistory),
  { ssr: false }
)

const HISTORY_KEY = 'cardioinsight-history'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        // ignore corrupt history
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  const handleSubmit = async (data: HealthData) => {
    setIsLoading(true)
    try {
      const prediction = await predictCardiovascularRisk(data)
      setResult(prediction)
      setShowResult(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred'
      toast.error('Prediction failed', { description: msg })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!result) return
    setHistory((prev) => [
      {
        id: result.id,
        date: result.timestamp.toISOString(),
        riskLevel: result.riskLevel,
        riskPercentage: result.riskPercentage,
        healthData: result.healthData,
      },
      ...prev,
    ])
    setShowResult(false)
    setResult(null)
    toast.success('Result saved to history')
  }

  const handleClose = () => {
    setShowResult(false)
    setResult(null)
  }

  const handleClearHistory = () => {
    setHistory([])
    toast.info('History cleared')
  }

  const handleSelectHistory = async (entry: HistoryEntry) => {
    setIsLoading(true)
    try {
      const prediction = await predictCardiovascularRisk(entry.healthData)
      setResult({ ...prediction, id: entry.id, timestamp: new Date(entry.date) })
      setShowResult(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred'
      toast.error('Failed to load', { description: msg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" richColors />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {!showResult && (
          <>
            <section className="text-center mb-10 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Powered by Machine Learning
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance text-foreground">
                Know Your <span className="text-primary">Heart Disease</span> Risk
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
                Enter your health data and get instant cardiovascular disease risk prediction.
                Early detection is the key to prevention.
              </p>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              <FeatureCard
                icon={<Heart className="h-5 w-5 text-primary" />}
                title="Accurate Prediction"
                desc="ML model trained on 70k records"
              />
              <FeatureCard
                icon={<Activity className="h-5 w-5 text-primary" />}
                title="Complete Analysis"
                desc="Multi-factor evaluation"
              />
              <FeatureCard
                icon={<Brain className="h-5 w-5 text-primary" />}
                title="Recommendations"
                desc="Personal health advice"
              />
              <FeatureCard
                icon={<Shield className="h-5 w-5 text-primary" />}
                title="Privacy Safe"
                desc="Data stored locally"
              />
            </section>
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {showResult && result ? (
              <PredictionResultDisplay
                result={result}
                onSave={handleSave}
                onClose={handleClose}
              />
            ) : (
              <HealthForm onSubmit={handleSubmit} isLoading={isLoading} />
            )}
          </div>

          <div className="lg:col-span-1">
            <PredictionHistory
              history={history}
              onClear={handleClearHistory}
              onSelectEntry={handleSelectHistory}
            />
          </div>
        </div>

        {!showResult && (
          <section className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-foreground">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StepCard step={1} title="Enter Data" desc="Fill in your health information" />
              <StepCard step={2} title="ML Analysis" desc="Model processes and calculates risk" />
              <StepCard step={3} title="Get Results" desc="View risk level & recommendations" />
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">CardioInsight</p>
          <p className="text-xs leading-relaxed max-w-2xl mx-auto">
            This application is not a substitute for professional medical consultation. Always consult 
            a doctor for accurate diagnosis.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-2">
        {icon}
      </div>
      <h3 className="font-semibold text-sm mb-1 text-card-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  )
}

function StepCard({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div className="relative p-6 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">
          {step}
        </div>
        {step < 3 && (
          <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <h4 className="font-semibold mb-1 text-card-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}
