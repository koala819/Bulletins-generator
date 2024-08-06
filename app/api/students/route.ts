import { NextRequest, NextResponse } from 'next/server'

import { createStudent, getStudentsWithSubjects } from '@/backend/migrations'

export async function GET() {
  try {
    const students = await getStudentsWithSubjects()
    return new NextResponse(JSON.stringify({ data: students }), { status: 200 })
  } catch (error: any) {
    console.error('Error fetching students:', error)
    return new NextResponse('Error fetching students', { status: 500 })
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
    const studentId = await createStudent(firstname, lastname)

    return new NextResponse(JSON.stringify({ id: studentId }), { status: 200 })
  } catch (error: any) {
    console.error('Error creating student:', error)
    return new NextResponse('Error creating student', { status: 500 })
  }
}

// import { NextRequest, NextResponse } from 'next/server'

// import { db } from '@/backend/db'
// import { apiGet, apiPost, apiRun } from '@/backend/db'

// export async function GET() {
//   const query = `
//     SELECT
//       students.id, students.firstname, students.lastname,
//       subjects.name as subject,
//       general_education.grade as general_grade, general_education.class_average as general_class_average, general_education.appreciation as general_appreciation,
//       pratic_education.grade as pratic_grade, pratic_education.class_average as pratic_class_average, pratic_education.appreciation as pratic_appreciation
//     FROM students
//     LEFT JOIN general_education ON students.id = general_education.student_id
//     LEFT JOIN pratic_education ON students.id = pratic_education.student_id
//     LEFT JOIN subjects ON subjects.id = general_education.subject_id OR subjects.id = pratic_education.subject_id
//   `

//   try {
//     const data = await new Promise((resolve, reject) => {
//       db.all(query, (err, rows) => {
//         if (err) {
//           return reject(err)
//         }
//         return resolve(rows)
//       })
//     })

//     return NextResponse.json({ data }, { status: 200 })
//   } catch (error: any) {
//     console.error(error.message)
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 },
//     )
//   }
// }

// export async function POST(req: NextRequest) {
//   const body = await req.json()
//   const { firstname, lastname, session, dateSession } = body

//   // Begin transaction
//   const beginTransaction = 'BEGIN TRANSACTION;'
//   const commitTransaction = 'COMMIT;'
//   const rollbackTransaction = 'ROLLBACK;'

//   try {
//     await apiRun(beginTransaction)

//     // Insert into students table
//     const studentQuery = `
//       INSERT INTO students(firstname, lastname)
//       VALUES(?, ?)
//     `
//     const studentValues = [firstname, lastname]
//     const studentId = await apiPost(studentQuery, studentValues)

//     // Insert into general_education table
//     const generalEducationQuery = `
//       INSERT INTO general_education(student_id, session, dateSession)
//       VALUES(?, ?, ?)
//     `
//     const generalEducationValues = [studentId, session, dateSession]
//     await apiPost(generalEducationQuery, generalEducationValues)

//     // Insert into pratic_education table
//     const praticEducationQuery = `
//       INSERT INTO pratic_education(student_id, session, dateSession)
//       VALUES(?, ?, ?)
//     `
//     const praticEducationValues = [studentId, session, dateSession]
//     await apiPost(praticEducationQuery, praticEducationValues)

//     // Commit transaction
//     await apiRun(commitTransaction)

//     return NextResponse.json(
//       { statusText: 'Successfully created student' },
//       { status: 200 },
//     )
//   } catch (err: any) {
//     console.error('Erreur détaillée:', err)
//     await apiRun(rollbackTransaction)
//     return NextResponse.json({ error: err.message }, { status: 400 })
//   }
// }
