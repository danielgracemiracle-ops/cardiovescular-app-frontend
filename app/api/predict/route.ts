import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/predict`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Prediction failed' },
      { status: 500 }
    )
  }
}