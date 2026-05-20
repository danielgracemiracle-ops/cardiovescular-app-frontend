import type {
  HealthData,
  PredictionResult,
  RiskFactor,
  RiskLevel,
} from './types'

function generateId(): string {
  return `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function healthDataToModelInput(data: HealthData): number[] {
  const cholesterolMap = {
    normal: 1,
    above_normal: 2,
    well_above_normal: 3,
  }

  const glucoseMap = {
    normal: 1,
    above_normal: 2,
    well_above_normal: 3,
  }

  return [
    data.age,
    data.gender === 'male' ? 2 : 1,
    data.height,
    data.weight,
    data.systolicBP,
    data.diastolicBP,
    cholesterolMap[data.cholesterol],
    glucoseMap[data.glucose],
    data.smoking ? 1 : 0,
    data.alcohol ? 1 : 0,
    data.physicalActivity ? 1 : 0,
  ]
}

export async function predictCardiovascularRisk(
  data: HealthData
): Promise<PredictionResult> {

  const modelInput = healthDataToModelInput(data)

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/predict`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: modelInput,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Prediction failed')
  }

  const result = await response.json()

  const featureImportance: RiskFactor[] =
    (result.risk_factors || []).map((factor: any) => ({
      feature: factor.feature,
      importance: factor.importance,
      status: factor.status,
    }))

  return {
    id: generateId(),
    timestamp: new Date(),
    prediction: result.prediction,
    confidence: result.confidence,
    riskPercentage: result.risk_percentage,
    riskLevel: result.risk_level.toLowerCase() as RiskLevel,
    featureImportance,
    recommendations: result.recommendations || [],
    healthData: data,
  }
}