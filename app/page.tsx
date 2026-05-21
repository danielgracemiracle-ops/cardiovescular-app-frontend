'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { AnimatedParticles } from '@/components/animated-particles'
import { Heart, Activity, Brain, Shield, Sparkles, } from 'lucide-react'
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
        date: result.timestamp
          ? new Date(result.timestamp).toISOString()
          : new Date().toISOString(),
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
    <div className="min-h-screen relative isolate bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      
      <AnimatedParticles />
      
      <div className="center-blob" />
      <div className="bg-blob" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      
      <Toaster position="top-center" richColors />
      <Header />

      <main className="relative z-10 container mx-auto px-4 py-8">
        {!showResult && (
          <>
            <section className="text-center mb-10 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Powered by Machine Learning
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                Know Your{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  Heart Disease
                </span>{' '}
                Risk
              </h2>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                AI-powered cardiovascular risk analysis using machine learning
                to help identify potential heart disease risks early.
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
  <section className="mt-20">
    <div className="text-center mb-12">
      <h3 className="text-4xl font-bold text-foreground">
        How It Works
      </h3>

      <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
        Simple 3-step cardiovascular risk prediction powered by machine learning
      </p>
    </div>

    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
      
      {/* Line connector desktop */}
      <div className="hidden md:block absolute top-1/2 left-[18%] right-[18%] h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 -translate-y-1/2 rounded-full opacity-30" />

      <div className="relative z-10">
        <StepCard
          step={1}
          title="Enter Data"
          desc="Fill in your health information"
        />
      </div>

      <div className="relative z-10">
        <StepCard
          step={2}
          title="ML Analysis"
          desc="AI model analyzes your cardiovascular condition"
        />
      </div>

      <div className="relative z-10">
        <StepCard
          step={3}
          title="Get Results"
          desc="Receive risk prediction & recommendations"
        />
      </div>
    </div>
  </section>
)}
      </main>

      <footer className="relative z-10 border-t border-border mt-16 py-8">
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
    <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-xl hover:border-primary/40 hover:shadow-sm transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-2">
        {icon}
      </div>
      <h3 className="font-semibold text-sm mb-1 text-card-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  )
}

function StepCard({
  step,
  title,
  desc,
}: {
  step: number
  title: string
  desc: string
}) {
  return (
    <div className="group relative rounded-3xl border bg-card/80 backdrop-blur-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Step Number */}
      <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg">
        {step}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h4 className="text-2xl font-semibold mb-3 text-foreground">
          {title}
        </h4>

        <p className="text-muted-foreground leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  )
}