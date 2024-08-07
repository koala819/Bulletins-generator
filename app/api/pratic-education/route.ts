import { NextRequest, NextResponse } from 'next/server'

import { getAll } from '@/backend/helpers'
import { createPraticSubjects } from '@/backend/migrations'

export async function GET() {
  try {
    const data = await getAll('pratic_subjects')
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { statusText: 'Erreur lors de la sauvegarde de la configuration' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const subjects = await req.json()
  console.log('Request body:', subjects)

  try {
    await createPraticSubjects(subjects)

    return new NextResponse('Matières sauvegardées avec succès', {
      status: 200,
    })
  } catch (error: any) {
    console.error('Error saving subjects:', error)
    return new NextResponse('Error saving subjects', { status: 500 })
  }
}
