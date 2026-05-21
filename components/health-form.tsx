'use client'

import { useState } from 'react'
import { InfoTooltip } from '@/components/info-tooltip'
import {
  User, Activity, HeartPulse, ArrowRight, ArrowLeft, Loader2, RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input, Label, Select, Switch } from '@/components/ui/form-controls'
import type { HealthData } from '@/lib/types'
import { cn } from '@/lib/utils'

interface HealthFormProps {
  onSubmit: (data: HealthData) => void
  isLoading?: boolean
}

const INITIAL: HealthData = {
  age: 35,
  gender: 'male',
  height: 170,
  weight: 70,
  systolicBP: 120,
  diastolicBP: 80,
  cholesterol: 'normal',
  glucose: 'normal',
  smoking: false,
  alcohol: false,
  physicalActivity: true,
}

const STEPS = [
  { id: 1, title: 'Personal Data', icon: User, desc: 'Your basic information' },
  { id: 2, title: 'Vital Signs', icon: HeartPulse, desc: 'Blood pressure & lab results' },
  { id: 3, title: 'Lifestyle', icon: Activity, desc: 'Daily habits' },
]

export function HealthForm({ onSubmit, isLoading }: HealthFormProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<HealthData>(INITIAL)
  const [confirmed, setConfirmed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = <K extends keyof HealthData>(key: K, value: HealthData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {}
    if (s === 1) {
      if (data.age < 1 || data.age > 120) e.age = 'Age must be 1-120 years'
      if (data.height < 50 || data.height > 250) e.height = 'Height must be 50-250 cm'
      if (data.weight < 20 || data.weight > 300) e.weight = 'Weight must be 20-300 kg'
    }
    if (s === 2) {
      if (data.systolicBP < 70 || data.systolicBP > 250)
        e.systolicBP = 'Systolic must be 70-250 mmHg'
      if (data.diastolicBP < 40 || data.diastolicBP > 150)
        e.diastolicBP = 'Diastolic must be 40-150 mmHg'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1)
  }

  const handleSubmit = () => {
    if (validateStep(3)) onSubmit(data)
  }

  const bmi = data.height > 0 ? data.weight / Math.pow(data.height / 100, 2) : 0
  const bmiCategory =
    bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
  const bmiColor =
    bmi < 18.5
      ? 'text-amber-500'
      : bmi < 25
      ? 'text-risk-low'
      : bmi < 30
      ? 'text-risk-medium'
      : 'text-risk-high'

  return (
    <Card className="glass-card hover-lift overflow-hidden animate-fade-in rounded-3xl">
      <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-t-3xl pt-10 pb-10 px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
        
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <HeartPulse className="h-7 w-7 text-white" />
          </div>
        
          <div>
            <CardTitle className="text-3xl font-bold">
              Health Data
            </CardTitle>
        
            <CardDescription className="text-base mt-1">
              Step {step} of {STEPS.length}: {STEPS[step - 1].desc}
            </CardDescription>
          </div>
        </div>
        
        {/* Progress Stepper */}
        <div className="mt-10 px-10">
          
          <div className="relative flex justify-between items-center max-w-xl mx-auto">
          
            {/* Background Line */}
            <div className="absolute top-6 left-[7%] right-[7%] h-1 bg-border rounded-full" />
          
            {/* Active Line */}
            <div
              className="absolute top-6 left-[7%] h-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
              style={{
                width:
                  step === 1
                    ? '0%'
                    : step === 2
                    ? '43%'
                    : '86%',
              }}
            />
        
            {STEPS.map((s) => (
              <div
                key={s.id}
                className="relative z-10 flex flex-col items-center"
              >
              
                {/* Circle */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all duration-300',
                    step >= s.id
                      ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white border-white shadow-xl scale-110'
                      : 'bg-background text-muted-foreground border-border'
                  )}
                >
                  {s.id}
                </div>
                
                {/* Label */}
                <span
                  className={cn(
                    'mt-3 text-sm font-medium text-center whitespace-nowrap',
                    step >= s.id
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="age">Age (years)</Label>
                      
                  <InfoTooltip
                    text="Age is one of the strongest risk factors for cardiovascular disease. Risk generally increases as you get older."
                  />
                </div>

                <Input
                  id="age"
                  type="number"
                  value={data.age}
                  onChange={(e) => update('age', Number(e.target.value))}
                />
                {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  id="gender"
                  value={data.gender}
                  onChange={(e) => update('gender', e.target.value as 'male' | 'female')}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="height">Height (cm)</Label>

                  <InfoTooltip
                    text="Height is used together with weight to calculate Body Mass Index (BMI)."
                  />
                </div>

                <Input
                  id="height"
                  type="number"
                  value={data.height}
                  onChange={(e) => update('height', Number(e.target.value))}
                />
                {errors.height && <p className="text-xs text-destructive">{errors.height}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="weight">Weight (kg)</Label>

                  <InfoTooltip
                    text="Body weight is used to calculate BMI, which helps estimate obesity-related cardiovascular risk."
                  />
                </div>

                <Input
                  id="weight"
                  type="number"
                  value={data.weight}
                  onChange={(e) => update('weight', Number(e.target.value))}
                />
                {errors.weight && <p className="text-xs text-destructive">{errors.weight}</p>}
              </div>
            </div>

            {bmi > 0 && (
              <div className="p-4 rounded-lg bg-muted border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Body Mass Index (BMI)</p>
                    <p className={cn('text-2xl font-bold', bmiColor)}>{bmi.toFixed(1)}</p>
                  </div>
                  <span className={cn('text-sm font-medium', bmiColor)}>{bmiCategory}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sys">Systolic BP (mmHg)</Label>

                  <InfoTooltip
                    text="Systolic blood pressure measures the pressure in your arteries when your heart beats."
                  />
                </div>

                <Input
                  id="sys"
                  type="number"
                  value={data.systolicBP}
                  onChange={(e) => update('systolicBP', Number(e.target.value))}
                />
                {errors.systolicBP && (
                  <p className="text-xs text-destructive">{errors.systolicBP}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="dia">Diastolic BP (mmHg)</Label>

                  <InfoTooltip
                    text="Diastolic blood pressure measures the pressure in your arteries when your heart rests between beats."
                  />
                </div>

                <Input
                  id="dia"
                  type="number"
                  value={data.diastolicBP}
                  onChange={(e) => update('diastolicBP', Number(e.target.value))}
                />
                {errors.diastolicBP && (
                  <p className="text-xs text-destructive">{errors.diastolicBP}</p>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">
                Normal: &lt;120/80 mmHg. Hypertension: ≥130/80 mmHg.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="chol">Cholesterol Level</Label>

                <InfoTooltip
                  text="Cholesterol is a fatty substance in your blood. High cholesterol can increase the risk of heart disease and stroke."
                />
              </div>

              <Select
                id="chol"
                value={data.cholesterol}
                onChange={(e) => update('cholesterol', e.target.value as HealthData['cholesterol'])}
              >
                <option value="normal">Normal</option>
                <option value="above_normal">Above Normal</option>
                <option value="well_above_normal">Well Above Normal</option>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="gluc">Glucose Level</Label>

                <InfoTooltip
                  text="Glucose refers to blood sugar levels. High glucose may indicate diabetes risk and cardiovascular complications."
                />
              </div>

              <Select
                id="gluc"
                value={data.glucose}
                onChange={(e) => update('glucose', e.target.value as HealthData['glucose'])}
              >
                <option value="normal">Normal</option>
                <option value="above_normal">Above Normal</option>
                <option value="well_above_normal">Well Above Normal</option>
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <ToggleRow
              label="Smoking"
              desc="Do you smoke?"
              tooltip="Smoking damages blood vessels and significantly increases the risk of cardiovascular disease."
              checked={data.smoking}
              onChange={(v) => update('smoking', v)}
            />
            <ToggleRow
              label="Alcohol Consumption"
              desc="Do you consume alcohol?"
              tooltip="Excessive alcohol consumption may increase blood pressure and heart disease risk."
              checked={data.alcohol}
              onChange={(v) => update('alcohol', v)}
            />
            <ToggleRow
              label="Physical Activity"
              desc="Do you exercise regularly?"
              tooltip="Regular physical activity helps maintain healthy blood pressure, weight, and heart function."
              checked={data.physicalActivity}
              onChange={(v) => update('physicalActivity', v)}
            />
            <div className="mt-6 p-5 rounded-2xl border border-border bg-muted/40 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Review Your Health Data
                </h3>

                <p className="text-sm text-muted-foreground">
                  Please review your information before prediction.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">

                <SummaryItem label="Age" value={`${data.age} years`} />

                <SummaryItem
                  label="Gender"
                  value={data.gender === 'male' ? 'Male' : 'Female'}
                />

                <SummaryItem
                  label="Height"
                  value={`${data.height} cm`}
                />

                <SummaryItem
                  label="Weight"
                  value={`${data.weight} kg`}
                />

                <SummaryItem
                  label="BMI"
                  value={`${bmi.toFixed(1)} (${bmiCategory})`}
                />

                <SummaryItem
                  label="Blood Pressure"
                  value={`${data.systolicBP}/${data.diastolicBP} mmHg`}
                />

                <SummaryItem
                  label="Cholesterol"
                  value={data.cholesterol.replaceAll('_', ' ')}
                />

                <SummaryItem
                  label="Glucose"
                  value={data.glucose.replaceAll('_', ' ')}
                />

                <SummaryItem
                  label="Smoking"
                  value={data.smoking ? 'Yes' : 'No'}
                />

                <SummaryItem
                  label="Alcohol"
                  value={data.alcohol ? 'Yes' : 'No'}
                />

                <SummaryItem
                  label="Physical Activity"
                  value={data.physicalActivity ? 'Active' : 'Inactive'}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-background border border-border p-4">

                <div>
                  <p className="font-medium">
                    Confirm Information
                  </p>

                  <p className="text-sm text-muted-foreground">
                    I confirm the information above is accurate.
                  </p>
                </div>

                <Switch
                  checked={confirmed}
                  onCheckedChange={setConfirmed}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isLoading}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => {
                setData(INITIAL)
                setErrors({})
                setConfirmed(false)
              }}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}

          {step < STEPS.length ? (
            <Button onClick={handleNext} disabled={isLoading}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !confirmed}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Predict Now'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-background border border-border p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="font-semibold capitalize">
        {value}
      </p>
    </div>
  )
}

function ToggleRow({
  label, desc, tooltip, checked, onChange,
}: {
  label: string
  desc: string
  tooltip: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium">{label}</p>

          <InfoTooltip text={tooltip} />
        </div>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
