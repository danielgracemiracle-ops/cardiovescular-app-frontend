import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/health`
    )

    const result = await response.json()

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { status: 'unhealthy' },
      { status: 500 }
    )
  }
}