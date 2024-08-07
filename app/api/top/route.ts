import { NextRequest, NextResponse } from 'next/server'

import { getAll } from '@/backend/helpers'
import { createTopValues } from '@/backend/migrations'

export async function GET() {
  try {
    const data = await getAll('top_values')

    return NextResponse.json({ data: data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { statusText: 'Erreur lors de la sauvegarde de la configuration' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const fields = body

  try {
    // Transform attributes into array of objects with name and value
    const attributeFields = fields.map(
      (field: { name: string; value: string }) => {
        return {
          name: field.name,
          value: String(field.value),
        }
      },
    )
    // Create dynamic table with attributes
    await createTopValues(attributeFields)
    return new NextResponse('Configuration saved successfully', { status: 200 })
  } catch (error: any) {
    console.error('Error saving configuration:', error)
    return new NextResponse('Error saving configuration', { status: 500 })
  }
}
