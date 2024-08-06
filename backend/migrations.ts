import { db } from './db'

export const migrate = () => {
  console.log('Début de la migration...')
  return new Promise((resolve) => {
    db.serialize(() => {
      // Table des étudiants (avec champs minimaux)
      db.run(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstname TEXT NOT NULL,
          lastname TEXT NOT NULL
        );
      `)

      // Table des attributs d'étudiants (pour les champs dynamiques)
      db.run(`
        CREATE TABLE IF NOT EXISTS student_attributes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER,
          attribute_name TEXT NOT NULL,
          attribute_value TEXT,
          FOREIGN KEY (student_id) REFERENCES students(id)
        );
      `)

      // Table de configuration des attributs (pour définir quels attributs sont disponibles)
      db.run(`
        CREATE TABLE IF NOT EXISTS student_config (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          attribute_name TEXT NOT NULL,
          is_required BOOLEAN DEFAULT false
        );
      `)

      // Table des matières
      db.run(
        `
      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        module TEXT
      );
    `,
        (err: Error) => {
          if (err) {
            console.error(
              'Erreur lors de la création de la table subjects:',
              err.message,
            )
          } else {
            console.log('Table subjects créée avec succès.')
          }
        },
      )

      // Table des notes et classements
      db.run(
        `
      CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        subject_id INTEGER,
        grade REAL,
        student_ranking INTEGER,
        class_average REAL,
        appreciation TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
      );
    `,
        (err: Error) => {
          if (err) {
            console.error(
              'Erreur lors de la création de la table grades:',
              err.message,
            )
          } else {
            console.log('Table grades créée avec succès.')
          }
        },
      )

      // Table du bilan disciplinaire
      db.run(
        `
      CREATE TABLE IF NOT EXISTS discipline (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        late_arrivals INTEGER,
        absences INTEGER,
        sanctions TEXT,
        praises TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id)
      );
    `,
        (err: Error) => {
          if (err) {
            console.error(
              'Erreur lors de la création de la table discipline:',
              err.message,
            )
          } else {
            console.log('Table discipline créée avec succès.')
          }
        },
      )

      resolve(true)
    })
    console.log('Fin de la migration.')
  })
}

export const createDynamicTable = (
  fields: { name: string; value: string }[],
) => {
  return new Promise((resolve, reject) => {
    const tableName = 'dynamic_attributes'
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
