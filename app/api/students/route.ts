import { NextRequest, NextResponse } from 'next/server'

import { getAll, insert } from '@/backend/helpers'

export async function GET() {
  try {
    const data = await getAll('students')
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
  const { firstname, lastname } = await req.json()

  if (!firstname || !lastname) {
    return new NextResponse('First name and last name are required', {
      status: 400,
    })
  }

  try {
    const studentId = await insert('students', { firstname, lastname })
    // console.log('Student created with id:', studentId)

    return new NextResponse(JSON.stringify({ id: studentId }), { status: 200 })
  } catch (error: any) {
    console.error('Error creating student:', error)
    return new NextResponse('Error creating student', { status: 500 })
  }
}
