import { NextRequest, NextResponse } from 'next/server'

import { apiGet } from '@/backend/db'
import { createTableTopValues } from '@/backend/migrations'

export async function GET() {
  const query = 'SELECT * FROM top_values'
  try {
    const config = await apiGet(query)
    // console.log('\n\n\nconfig is', config)

    return NextResponse.json({ data: config }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { statusText: 'Erreur lors de la sauvegarde de la configuration' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  // console.log('Request body:', body)

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
    // console.log('attributeFields are', attributeFields)

    // Create dynamic table with attributes
    await createTableTopValues(attributeFields)
    return new NextResponse('Configuration saved successfully', { status: 200 })
  } catch (error: any) {
    console.error('Error saving configuration:', error)
    return new NextResponse('Error saving configuration', { status: 500 })
  }
}
