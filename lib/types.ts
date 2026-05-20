// =========================
// DATA TYPES — CardioInsight
// =========================

export type Gender = 'male' | 'female'
export type CholesterolLevel = 'normal' | 'above_normal' | 'well_above_normal'
export type GlucoseLevel = 'normal' | 'above_normal' | 'well_above_normal'
export type RiskLevel = 'low' | 'medium' | 'high'
export type FactorStatus = 'good' | 'warning' | 'danger'

/** Data form yang diisi user di HealthForm */
export interface HealthData {
  age: number
  gender: Gender
  height: number
  weight: number
  systolicBP: number
  diastolicBP: number
  cholesterol: CholesterolLevel
  glucose: GlucoseLevel
  smoking: boolean
  alcohol: boolean
  physicalActivity: boolean
}

/** Faktor risiko personal — dipakai di Recharts bar chart */
export interface RiskFactor {
  feature: string
  importance: number
  status: FactorStatus
}

/** Hasil prediksi lengkap */
export interface PredictionResult {
  id: string
  timestamp: Date
  prediction: number          // 0 = sehat, 1 = berisiko
  confidence: number          // 0-1
  riskPercentage: number      // 0-100
  riskLevel: RiskLevel
  featureImportance: RiskFactor[]
  recommendations: string[]
  healthData: HealthData
}

/** Entry di history (localStorage) */
export interface HistoryEntry {
  id: string
  date: string
  riskLevel: RiskLevel
  riskPercentage: number
  healthData: HealthData
}
