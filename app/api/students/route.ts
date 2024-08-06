import { NextRequest, NextResponse } from 'next/server'

import { apiGet, apiPost, apiRun } from '@/backend/db'

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
  const { firstname, lastname, session, dateSession } = body

  // Begin transaction
  const beginTransaction = 'BEGIN TRANSACTION;'
  const commitTransaction = 'COMMIT;'
  const rollbackTransaction = 'ROLLBACK;'

  try {
    await apiRun(beginTransaction)

    // Insert into students table
    const studentQuery = `
      INSERT INTO students(firstname, lastname)
      VALUES(?, ?)
    `
    const studentValues = [firstname, lastname]
    const studentId = await apiPost(studentQuery, studentValues)

    // Insert into general_education table
    const generalEducationQuery = `
      INSERT INTO general_education(student_id, session, dateSession)
      VALUES(?, ?, ?)
    `
    const generalEducationValues = [studentId, session, dateSession]
    await apiPost(generalEducationQuery, generalEducationValues)

    // Insert into pratic_education table
    const praticEducationQuery = `
      INSERT INTO pratic_education(student_id, session, dateSession)
      VALUES(?, ?, ?)
    `
    const praticEducationValues = [studentId, session, dateSession]
    await apiPost(praticEducationQuery, praticEducationValues)

    // Commit transaction
    await apiRun(commitTransaction)

    return NextResponse.json(
      { statusText: 'Successfully created student' },
      { status: 200 },
    )
  } catch (err: any) {
    console.error('Erreur détaillée:', err)
    await apiRun(rollbackTransaction)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
