import { db } from '@/backend/db'

interface GradeRow {
  class_average: number
}

export const createTableWithSchema = (tableName: string, schema: string) => {
  return new Promise((resolve, reject) => {
    const dropQuery = `DROP TABLE IF EXISTS ${tableName}`
    const createQuery = `CREATE TABLE IF NOT EXISTS ${tableName} ${schema}`

    db.run(dropQuery, (err) => {
      if (err) {
        reject(err)
      } else {
        db.run(createQuery, (err) => {
          if (err) reject(err)
          else resolve(true)
        })
      }
    })
  })
}

export const createTopValues = (fields: { name: string; value: string }[]) => {
  return new Promise((resolve, reject) => {
    const tableName = 'top_values'
    const columns = fields.map((field) => `"${field.name}" TEXT`).join(', ')
    const values = fields.map((field) => `'${field.value}'`).join(', ')

    db.serialize(() => {
      db.run(`DROP TABLE IF EXISTS ${tableName}`, (err: Error) => {
        if (err) {
          console.error(
            'Erreur lors de la suppression de la table:',
            err.message,
          )
          return reject(err)
        } else {
          console.log('Table supprimée avec succès.')
        }
      })

      const createTableQuery = `
        CREATE TABLE ${tableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ${columns}
        );
      `

      db.run(createTableQuery, (err: Error) => {
        if (err) {
          console.error(
            'Erreur lors de la création de la table dynamique:',
            err.message,
          )
          return reject(err)
        } else {
          console.log('Table dynamique créée avec succès.')

          const insertRowQuery = `
            INSERT INTO ${tableName} (${fields.map((field) => `"${field.name}"`).join(', ')})
            VALUES (${values});
          `

          db.run(insertRowQuery, (err: Error) => {
            if (err) {
              console.error(
                "Erreur lors de l'insertion des valeurs:",
                err.message,
              )
              return reject(err)
            } else {
              console.log('Valeurs insérées avec succès.')
              resolve(true)
            }
          })
        }
      })
    })
  })
}

export const getAll = (tableName: string) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

export const getGrades = (
  tableName: 'general_education' | 'pratic_education',
  studentId: number,
  session: number,
) => {
  return new Promise((resolve, reject) => {
    // console.log(
    //   'tableName',
    //   tableName,
    //   'studentId',
    //   studentId,
    //   'session',
    //   session,
    // )
    const query = `
      SELECT s.name, s.module, e.grade, e.class_average, e.appreciation
      FROM ${tableName} e
      JOIN ${tableName === 'general_education' ? 'general_subjects' : 'pratic_subjects'} s ON e.subject_id = s.id
      WHERE e.student_id = ? AND e.session = ?
    `
    db.all(query, [studentId, session], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

// export const getStudentsWithSubjects = () => {
//   return new Promise((resolve, reject) => {
//     const query = `
//       SELECT
//         students.id,
//         students.firstname,
//         students.lastname,
//         general_subjects.name as general_subject,
//         pratic_subjects.name as pratic_subject,
//         general_education.session as general_session,
//         general_education.grade as general_grade,
//         general_education.class_average as general_class_average,
//         general_education.appreciation as general_appreciation,
//         pratic_education.session as pratic_session,
//         pratic_education.grade as pratic_grade,
//         pratic_education.class_average as pratic_class_average,
//         pratic_education.appreciation as pratic_appreciation
//       FROM students
//       LEFT JOIN general_education ON students.id = general_education.student_id
//       LEFT JOIN pratic_education ON students.id = pratic_education.student_id
//       LEFT JOIN general_subjects ON general_education.subject_id = general_subjects.id
//       LEFT JOIN pratic_subjects ON pratic_education.subject_id = pratic_subjects.id
//     `

//     db.all(query, (err, rows) => {
//       if (err) {
//         return reject(err)
//       }
//       console.log('rows', rows)

//       resolve(rows)
//     })
//   })
// }

export const insert = (tableName: string, data: Record<string, any>) => {
  const keys = Object.keys(data)
  const values = Object.values(data)
  const placeholders = keys.map(() => '?').join(', ')

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`
    db.run(query, values, function (err) {
      if (err) reject(err)
      else resolve(this.lastID)
    })
  })
}

export const writeGrade = (
  tableName: 'general_education' | 'pratic_education',
  studentId: number,
  subjectId: number,
  session: number,
  grade: number,
) => {
  return new Promise((resolve, reject) => {
    const insertQuery = `
      INSERT INTO ${tableName} (student_id, subject_id, session, grade)
      VALUES (?, ?, ?, ?)
    `
    db.run(insertQuery, [studentId, subjectId, session, grade], function (err) {
      if (err) {
        reject(err)
      } else {
        // Calculate class average after inserting the new grade
        const averageQuery = `
          SELECT AVG(grade) as class_average 
          FROM ${tableName} 
          WHERE subject_id = ? AND session = ?
        `
        db.get(
          averageQuery,
          [subjectId, session],
          function (err, row: unknown) {
            if (err) {
              reject(err)
            } else {
              const { class_average } = row as GradeRow
              const updateQuery = `
              UPDATE ${tableName}
              SET class_average = ?
              WHERE subject_id = ? AND session = ?
            `
              db.run(
                updateQuery,
                [class_average, subjectId, session],
                function (err) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(this.changes)
                  }
                },
              )
            }
          },
        )
      }
    })
  })
}
