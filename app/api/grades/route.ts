import { NextRequest, NextResponse } from 'next/server'

import { getStudentsWithSubjects } from '@/backend/helpers'
import { writeGrade } from '@/backend/helpers'

export async function GET() {
  try {
    const data = await getStudentsWithSubjects()
    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching students with grades:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    )
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
    return new NextResponse('Grade updated successfully', { status: 200 })
  } catch (error: any) {
    console.error('Error updating grade:', error)
    return new NextResponse('Error updating grade', { status: 500 })
  }
}
