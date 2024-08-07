import { NextRequest, NextResponse } from 'next/server'

import { getGrades } from '@/backend/helpers'
import { writeGrade } from '@/backend/helpers'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get('studentId')
  const session = searchParams.get('session')

  if (!studentId || !session) {
    return new NextResponse('Student ID and session are required', {
      status: 400,
    })
  }

  try {
    const generalGrades = await getGrades(
      'general_education',
      parseInt(studentId),
      parseInt(session),
    )
    // console.log('\n\n\ngeneralGrades', generalGrades)
    const praticGrades = await getGrades(
      'pratic_education',
      parseInt(studentId),
      parseInt(session),
    )

    // console.log('praticGrades', praticGrades, '\n\n\n')

    return NextResponse.json(
      {
        general: generalGrades,
        pratic: praticGrades,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Error fetching grades:', error)
    return new NextResponse('Error fetching grades', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { studentId, subjectId, session, grade, type } = await req.json()

  if (!studentId || !subjectId || !session || !grade || !type) {
    return new NextResponse('All fields are required', { status: 400 })
  }

  try {
    // console.log('\n\n\ngrade in POST', grade)
    await writeGrade(
      type === 'general' ? 'general_education' : 'pratic_education',
      studentId,
      subjectId,
      session,
      grade,
    )
    return new NextResponse('Grade recorded successfully', { status: 200 })
  } catch (error: any) {
    console.error('Error recording grade:', error)
    return new NextResponse('Error recording grade', { status: 500 })
  }
}
