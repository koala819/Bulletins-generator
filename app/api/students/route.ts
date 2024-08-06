import { NextRequest, NextResponse } from 'next/server'

import { apiGet, apiPost } from '@/backend/db'

export async function GET() {
  const query = 'SELECT * from students'

  let status, body
  try {
    await apiGet(query)
      .then((res) => {
        status = 200
        body = res
      })
      .catch((err: Error) => {
        status = 400
        body = { error: err }
      })

    return NextResponse.json(body, status)
  } catch (error: any) {
    console.error(error.message)
    return NextResponse.json({ success: false, message: error.message }, status)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    firstname,
    lastname,
    promotion,
    year,
    formation,
    category,
    session,
    dateSession,
  } = body

  const query = `
    INSERT INTO students(firstname, lastname, promotion, year, formation, category, session, dateSession)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?)
  `
  const values = [
    firstname,
    lastname,
    promotion,
    year,
    formation,
    category,
    session,
    dateSession,
  ]
  // console.log('\n\n\nstudents values are', values)

  try {
    await apiPost(query, values)
    return NextResponse.json(
      { statusText: 'Successfully created student' },
      { status: 200 },
    )
  } catch (err: any) {
    console.error('Erreur détaillée:', err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
