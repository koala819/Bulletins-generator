import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/backend/db'

export async function GET() {
  const query = `
    SELECT 
      students.id, students.firstname, students.lastname,
      general_subjects.name as general_subject,
      general_education.grade as general_grade, general_education.class_average as general_class_average, general_education.appreciation as general_appreciation,
      general_education.session as general_session,
      pratic_subjects.name as pratic_subject,
      pratic_education.grade as pratic_grade, pratic_education.class_average as pratic_class_average, pratic_education.appreciation as pratic_appreciation,
      pratic_education.session as pratic_session
    FROM students
    LEFT JOIN general_education ON students.id = general_education.student_id
    LEFT JOIN pratic_education ON students.id = pratic_education.student_id
    LEFT JOIN general_subjects ON general_subjects.id = general_education.subject_id
    LEFT JOIN pratic_subjects ON pratic_subjects.id = pratic_education.subject_id
  `

  try {
    const data = await new Promise((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) {
          return reject(err)
        }
        return resolve(rows)
      })
    })

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
  const body = await req.json()
  const { firstname, lastname, generalEducation, praticEducation } = body

  // Begin transaction
  const beginTransaction = 'BEGIN TRANSACTION;'
  const commitTransaction = 'COMMIT;'
  const rollbackTransaction = 'ROLLBACK;'

  try {
    await new Promise((resolve, reject) => {
      db.run(beginTransaction, (err) => {
        if (err) return reject(err)
        resolve(true)
      })
    })

    // Insert into students table
    const studentQuery = `
      INSERT INTO students(firstname, lastname)
      VALUES(?, ?)
    `
    const studentValues = [firstname, lastname]
    const studentId = await new Promise((resolve, reject) => {
      db.run(studentQuery, studentValues, function (err) {
        if (err) return reject(err)
        resolve(this.lastID)
      })
    })

    // Insert into general_education table
    for (const entry of generalEducation) {
      const generalEducationQuery = `
        INSERT INTO general_education(student_id, subject_id, session, grade, class_average, appreciation)
        VALUES(?, ?, ?, ?, ?, ?)
      `
      const generalEducationValues = [
        studentId,
        entry.subject_id,
        entry.session,
        entry.grade,
        entry.class_average,
        entry.appreciation,
      ]
      await new Promise((resolve, reject) => {
        db.run(generalEducationQuery, generalEducationValues, (err) => {
          if (err) return reject(err)
          resolve(true)
        })
      })
    }

    // Insert into pratic_education table
    for (const entry of praticEducation) {
      const praticEducationQuery = `
        INSERT INTO pratic_education(student_id, subject_id, session, grade, class_average, appreciation)
        VALUES(?, ?, ?, ?, ?, ?)
      `
      const praticEducationValues = [
        studentId,
        entry.subject_id,
        entry.session,
        entry.grade,
        entry.class_average,
        entry.appreciation,
      ]
      await new Promise((resolve, reject) => {
        db.run(praticEducationQuery, praticEducationValues, (err) => {
          if (err) return reject(err)
          resolve(true)
        })
      })
    }

    // Commit transaction
    await new Promise((resolve, reject) => {
      db.run(commitTransaction, (err) => {
        if (err) return reject(err)
        resolve(true)
      })
    })

    return NextResponse.json(
      { statusText: 'Successfully created student' },
      { status: 200 },
    )
  } catch (err: any) {
    console.error('Erreur détaillée:', err)
    await new Promise((resolve, reject) => {
      db.run(rollbackTransaction, (rollbackErr) => {
        if (rollbackErr) return reject(rollbackErr)
        resolve(true)
      })
    })
    return NextResponse.json({ error: err.message }, { status: 400 })
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
