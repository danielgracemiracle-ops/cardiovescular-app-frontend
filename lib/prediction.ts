import type {
  HealthData,
  PredictionResult,
} from './types'

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
): Promise<any> {

  const modelInput = healthDataToModelInput(data)

  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: modelInput
    }),
  })

  if (!response.ok) {
    throw new Error('Prediction failed')
  }

  return response.json()
}