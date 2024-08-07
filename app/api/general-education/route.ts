import { NextRequest, NextResponse } from 'next/server'

import { createTableWithSchema, getAll, insert } from '@/backend/helpers'

export async function GET() {
  try {
    const data = await getAll('general_subjects')
    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error(error.message)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const subjects = await req.json()
  // console.log('Request body:', subjects)

  if (!subjects) {
    return new NextResponse('Subjects are required', {
      status: 400,
    })
  }

  try {
    const schema = `(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      module TEXT NOT NULL
    )`

    await createTableWithSchema('general_subjects', schema)

    for (const subject of subjects) {
      await insert('general_subjects', subject)
    }

    return new NextResponse('Matières sauvegardées avec succès', {
      status: 200,
    })
  } catch (error: any) {
    console.error('Error saving subjects:', error)
    return new NextResponse('Error saving subjects', { status: 500 })
  }
}
