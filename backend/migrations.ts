import { db } from './db'

export const createStudentWithSessions = (
  firstname: string,
  lastname: string,
  subjects: {
    general: { name: string; module: string }[]
    pratic: { name: string; module: string }[]
  },
) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        // Insertion de l'étudiant
        const insertStudentQuery = `
          INSERT INTO students (firstname, lastname)
          VALUES (?, ?)
        `
        const studentId = await new Promise((resolve, reject) => {
          db.run(insertStudentQuery, [firstname, lastname], function (err) {
            if (err) {
              console.error(
                "Erreur lors de la création de l'étudiant:",
                err.message,
              )
              return reject(
                new Error("Erreur lors de la création de l'étudiant"),
              )
            }
            resolve(this.lastID)
          })
        })

        // Insertion des matières générales pour les deux sessions
        for (const subject of subjects.general) {
          for (let session = 1; session <= 2; session++) {
            const insertGeneralEducationQuery = `
              INSERT INTO general_education (student_id, subject_id, session, grade, class_average, appreciation)
              VALUES (?, (SELECT id FROM general_subjects WHERE name = ? AND module = ?), ?, ?, ?, ?)
            `
            await new Promise((resolve, reject) => {
              db.run(
                insertGeneralEducationQuery,
                [
                  studentId,
                  subject.name,
                  subject.module,
                  session,
                  null,
                  null,
                  null,
                ],
                function (err) {
                  if (err) {
                    console.error(
                      'Erreur lors de la création de la matière générale:',
                      err.message,
                    )
                    return reject(
                      new Error(
                        'Erreur lors de la création de la matière générale',
                      ),
                    )
                  }
                  resolve(this.lastID)
                },
              )
            })
          }
        }

        // Insertion des matières pratiques pour les deux sessions
        for (const subject of subjects.pratic) {
          for (let session = 1; session <= 2; session++) {
            const insertPraticEducationQuery = `
              INSERT INTO pratic_education (student_id, subject_id, session, grade, class_average, appreciation)
              VALUES (?, (SELECT id FROM pratic_subjects WHERE name = ? AND module = ?), ?, ?, ?, ?)
            `
            await new Promise((resolve, reject) => {
              db.run(
                insertPraticEducationQuery,
                [
                  studentId,
                  subject.name,
                  subject.module,
                  session,
                  null,
                  null,
                  null,
                ],
                function (err) {
                  if (err) {
                    console.error(
                      'Erreur lors de la création de la matière pratique:',
                      err.message,
                    )
                    return reject(
                      new Error(
                        'Erreur lors de la création de la matière pratique',
                      ),
                    )
                  }
                  resolve(this.lastID)
                },
              )
            })
          }
        }

        resolve(studentId)
      } catch (error: any) {
        console.error(
          "Erreur lors de la création de l'étudiant avec sessions:",
          error.message,
        )
        reject(error)
      }
    })
  })
}

export const createGeneralEducation = (
  fields: {
    student_id: number
    subject_id: number
    session: number
    grade: number
    class_average: number
    appreciation: string
  }[],
) => {
  return new Promise((resolve, reject) => {
    const tableName = 'general_education'

    db.serialize(() => {
      try {
        fields.forEach((field) => {
          const insertRowQuery = `
            INSERT INTO ${tableName} (student_id, subject_id, session, grade, class_average, appreciation)
            VALUES (${field.student_id}, ${field.subject_id}, ${field.session}, ${field.grade}, ${field.class_average}, '${field.appreciation}');
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
            }
          })
        })
        resolve(true)
      } catch (err: any) {
        console.error(
          "Erreur lors de la création des valeurs pour l'éducation générale:",
          err.message,
        )
        reject(err)
      }
    })
  })
}

export const createGeneralSubjects = (
  subjects: { name: string; module: string }[],
) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        // Suppression
        db.run(`DROP TABLE IF EXISTS ${'general_subjects'}`, (err: Error) => {
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
        CREATE TABLE IF NOT EXISTS general_subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            module TEXT NOT NULL
          );
      `
        db.run(createTableQuery, (err: Error) => {
          if (err) {
            console.error(
              'Erreur lors de la création de la table general_subjects:',
              err.message,
            )
            return reject(err)
          } else {
            console.log('Table general_subjects créée avec succès.')
            // Insertion des nouvelles matières
            for (const subject of subjects) {
              const insertQuery = `INSERT INTO general_subjects (name, module) VALUES (?, ?)`
              const values = [subject.name, subject.module]

              db.run(insertQuery, values, function (err) {
                if (err) {
                  console.error(
                    "Erreur lors de l'insertion de la matière:",
                    err.message,
                  )
                  return reject(err)
                } else {
                  console.log('Valeurs insérées avec succès.')
                  resolve(true)
                }
              })
            }
          }
        })
      } catch (error: any) {
        console.error(
          'Erreur lors de la création des matières générales:',
          error.message,
        )

        // Rollback de la transaction en cas d'erreur
        await new Promise((resolve, reject) => {
          db.run('ROLLBACK;', (err) => {
            if (err) return reject(err)
            resolve(true)
          })
        })

        reject(error)
      }
    })
  })
}

export const createPraticEducation = (
  fields: {
    student_id: number
    subject_id: number
    session: number
    grade: number
    class_average: number
    appreciation: string
  }[],
) => {
  return new Promise((resolve, reject) => {
    const tableName = 'pratic_education'

    db.serialize(() => {
      try {
        fields.forEach((field) => {
          const insertRowQuery = `
            INSERT INTO ${tableName} (student_id, subject_id, session, grade, class_average, appreciation)
            VALUES (${field.student_id}, ${field.subject_id}, ${field.session}, ${field.grade}, ${field.class_average}, '${field.appreciation}');
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
            }
          })
        })
        resolve(true)
      } catch (err: any) {
        console.error(
          "Erreur lors de la création des valeurs pour l'éducation pratique:",
          err.message,
        )
        reject(err)
      }
    })
  })
}

export const createPraticSubjects = (
  subjects: { name: string; module: string }[],
) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        // Suppression
        db.run(`DROP TABLE IF EXISTS pratic_subjects`, (err: Error) => {
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
          CREATE TABLE IF NOT EXISTS pratic_subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            module TEXT NOT NULL
          );
        `
        db.run(createTableQuery, (err: Error) => {
          if (err) {
            console.error(
              'Erreur lors de la création de la table pratic_subjects:',
              err.message,
            )
            return reject(err)
          } else {
            console.log('Table pratic_subjects créée avec succès.')
            // Insertion des nouvelles matières
            for (const subject of subjects) {
              const insertQuery = `INSERT INTO pratic_subjects (name, module) VALUES (?, ?)`
              const values = [subject.name, subject.module]

              db.run(insertQuery, values, function (err) {
                if (err) {
                  console.error(
                    "Erreur lors de l'insertion de la matière:",
                    err.message,
                  )
                  return reject(err)
                } else {
                  console.log('Valeurs insérées avec succès.')
                  resolve(true)
                }
              })
            }
          }
        })
      } catch (error: any) {
        console.error(
          'Erreur lors de la création des matières pratiques:',
          error.message,
        )

        // Rollback de la transaction en cas d'erreur
        await new Promise((resolve, reject) => {
          db.run('ROLLBACK;', (err) => {
            if (err) return reject(err)
            resolve(true)
          })
        })

        reject(error)
      }
    })
  })
}

export const createStudent = (firstname: string, lastname: string) => {
  return new Promise((resolve, reject) => {
    const insertQuery = `
      INSERT INTO students (firstname, lastname)
      VALUES (?, ?)
    `
    const values = [firstname, lastname]

    db.run(insertQuery, values, function (err) {
      if (err) {
        console.error("Erreur lors de la création de l'étudiant:", err.message)
        return reject(new Error("Erreur lors de la création de l'étudiant"))
      }
      resolve(this.lastID)
    })
  })
}

export const createTables = () => {
  console.log('Début de la création des tables...')
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        // Supprimer les tables existantes (sauf celles contenant les matières)
        db.run(`DROP TABLE IF EXISTS students;`)
        db.run(`DROP TABLE IF EXISTS general_subjects;`)
        db.run(`DROP TABLE IF EXISTS pratic_subjects;`)

        // Recréer les tables
        db.run(`
          CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL
          );
        `)

        db.run(`
          CREATE TABLE IF NOT EXISTS general_subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            module TEXT NOT NULL
          );
        `)

        db.run(`
          CREATE TABLE IF NOT EXISTS pratic_subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            module TEXT NOT NULL
          );
        `)

        db.run(`
          CREATE TABLE IF NOT EXISTS general_education (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject_id INTEGER,
            session INTEGER,
            grade REAL,
            class_average REAL,
            appreciation TEXT,
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (subject_id) REFERENCES general_subjects(id)
          );
        `)

        db.run(`
          CREATE TABLE IF NOT EXISTS pratic_education (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            subject_id INTEGER,
            session INTEGER,
            grade REAL,
            class_average REAL,
            appreciation TEXT,
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (subject_id) REFERENCES pratic_subjects(id)
          );
        `)

        console.log('Fin de la création des tables.')
        resolve(true)
      } catch (err: any) {
        console.error('Erreur lors de la création des tables:', err.message)
        reject(err)
      }
    })
  })
}

// export const createStudents = () => {
//   console.log('Début de la création des tables...')
//   return new Promise((resolve, reject) => {
//     db.serialize(() => {
//       try {
//         // Supprimer les tables existantes (sauf celles contenant les matières)
//         db.run(`DROP TABLE IF EXISTS students;`)
//         db.run(`DROP TABLE IF EXISTS general_subjects;`)
//         db.run(`DROP TABLE IF EXISTS pratic_subjects;`)

//         // Recréer les tables
//         db.run(`
//           CREATE TABLE IF NOT EXISTS students (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             firstname TEXT NOT NULL,
//             lastname TEXT NOT NULL
//           );
//         `)

//         db.run(`
//           CREATE TABLE IF NOT EXISTS general_subjects (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             module TEXT NOT NULL
//           );
//         `)

//         db.run(`
//           CREATE TABLE IF NOT EXISTS pratic_subjects (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL
//           );
//         `)

//         db.run(`
//           CREATE TABLE IF NOT EXISTS general_education (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             student_id INTEGER,
//             subject_id INTEGER,
//             session INTEGER,
//             grade REAL,
//             class_average REAL,
//             appreciation TEXT,
//             FOREIGN KEY (student_id) REFERENCES students(id),
//             FOREIGN KEY (subject_id) REFERENCES general_subjects(id)
//           );
//         `)

//         db.run(`
//           CREATE TABLE IF NOT EXISTS pratic_education (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             student_id INTEGER,
//             subject_id INTEGER,
//             session INTEGER,
//             grade REAL,
//             class_average REAL,
//             appreciation TEXT,
//             FOREIGN KEY (student_id) REFERENCES students(id),
//             FOREIGN KEY (subject_id) REFERENCES pratic_subjects(id)
//           );
//         `)

//         console.log('Fin de la création des tables.')
//         resolve(true)
//       } catch (err: any) {
//         console.error('Erreur lors de la création des tables:', err.message)
//         reject(err)
//       }
//     })
//   })
// }

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

export const deleteUnusedTable = (name: string) => {
  console.log('Deleting table:', name)
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`DROP TABLE IF EXISTS ${name}`, (err: Error) => {
        if (err) {
          console.error(
            'Erreur lors de la suppression de la table:',
            err.message,
          )
          return reject(err)
        } else {
          console.log('Table supprimée avec succès.')
          resolve(true)
        }
      })
    })
  })
}

export const getStudentsWithSubjects = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        students.id, 
        students.firstname, 
        students.lastname,
        general_subjects.name as general_subject,
        pratic_subjects.name as pratic_subject,
        general_education.session as general_session,
        general_education.grade as general_grade,
        general_education.class_average as general_class_average,
        general_education.appreciation as general_appreciation,
        pratic_education.session as pratic_session,
        pratic_education.grade as pratic_grade,
        pratic_education.class_average as pratic_class_average,
        pratic_education.appreciation as pratic_appreciation
      FROM students
      LEFT JOIN general_education ON students.id = general_education.student_id
      LEFT JOIN pratic_education ON students.id = pratic_education.student_id
      LEFT JOIN general_subjects ON general_education.subject_id = general_subjects.id
      LEFT JOIN pratic_subjects ON pratic_education.subject_id = pratic_subjects.id
    `

    db.all(query, (err, rows) => {
      if (err) {
        return reject(err)
      }
      console.log('rows', rows)

      resolve(rows)
    })
  })
}

// export const migrate = async () => {
//   try {
//     await createTables()
//     // Ajoutez ici d'autres initialisations si nécessaire
//     console.log('Migration completed successfully')
//   } catch (error) {
//     console.error('Migration failed:', error)
//     throw error
//   }
// }

export const updateGrade = (
  tableName: 'general_education' | 'pratic_education',
  studentId: number,
  subjectId: number,
  session: number,
  grade: number,
  classAverage: number,
  appreciation: string,
) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE ${tableName}
      SET grade = ?, class_average = ?, appreciation = ?
      WHERE student_id = ? AND subject_id = ? AND session = ?
    `
    db.run(
      query,
      [grade, classAverage, appreciation, studentId, subjectId, session],
      function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(this.changes)
        }
      },
    )
  })
}
