import { db } from './db'

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

export const createStudents = () => {
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
            name TEXT NOT NULL
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
