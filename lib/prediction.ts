import type {
  HealthData,
  PredictionResult,
} from './types'

export async function predictCardiovascularRisk(
  data: HealthData
): Promise<PredictionResult> {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Prediction failed')
  }

  return response.json()
}