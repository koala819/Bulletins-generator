import { columnExists, db } from './db'

export const migrate = () => {
  console.log('Début de la migration...')
  return new Promise((resolve) => {
    db.serialize(async () => {
      // Table des étudiants (avec champs minimaux)
      db.run(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstname TEXT NOT NULL,
          lastname TEXT NOT NULL
        );
      `)

      // Ajout des colonnes dans general_education si elles n'existent pas
      const generalEducationColumns = [
        { name: 'student_id', type: 'INTEGER' },
        { name: 'session', type: 'TEXT' },
        { name: 'dateSession', type: 'TEXT' },
      ]
      for (const column of generalEducationColumns) {
        if (!(await columnExists('general_education', column.name))) {
          db.run(
            `ALTER TABLE general_education ADD COLUMN ${column.name} ${column.type};`,
            (err: Error) => {
              if (err) {
                console.error(
                  `Erreur lors de la mise à jour de la table general_education:`,
                  err.message,
                )
              } else {
                console.log(
                  `Colonne ${column.name} ajoutée à la table general_education avec succès.`,
                )
              }
            },
          )
        }
      }

      // Ajout des colonnes dans pratic_education si elles n'existent pas
      const praticEducationColumns = [
        { name: 'student_id', type: 'INTEGER' },
        { name: 'session', type: 'TEXT' },
        { name: 'dateSession', type: 'TEXT' },
      ]
      for (const column of praticEducationColumns) {
        if (!(await columnExists('pratic_education', column.name))) {
          db.run(
            `ALTER TABLE pratic_education ADD COLUMN ${column.name} ${column.type};`,
            (err: Error) => {
              if (err) {
                console.error(
                  `Erreur lors de la mise à jour de la table pratic_education:`,
                  err.message,
                )
              } else {
                console.log(
                  `Colonne ${column.name} ajoutée à la table pratic_education avec succès.`,
                )
              }
            },
          )
        }
      }

      resolve(true)
    })
    console.log('Fin de la migration.')
  })
}

export const createTableGeneralEducationValues = (
  fields: { name: string; value: string }[],
) => {
  return new Promise((resolve, reject) => {
    const tableName = 'general_education'
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
      // console.log('tableName is', tableName, 'columns are', columns)

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

export const createTablePraticEducationValues = (
  fields: { name: string; value: string }[],
) => {
  return new Promise((resolve, reject) => {
    const tableName = 'pratic_education'
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
      // console.log('tableName is', tableName, 'columns are', columns)

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

export const createTableTopValues = (
  fields: { name: string; value: string }[],
) => {
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
      console.log('tableName is', tableName, 'columns are', columns)

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
