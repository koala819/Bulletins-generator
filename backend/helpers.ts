import { db } from '@/backend/db'

export const createTableWithSchema = async (
  tableName: string,
  schema: string,
) => {
  const dropQuery = `DROP TABLE IF EXISTS ${tableName} CASCADE`
  const createQuery = `CREATE TABLE IF NOT EXISTS ${tableName} ${schema}`

  try {
    await db(dropQuery)
    await db(createQuery)
    return true
  } catch (err) {
    throw err
  }
}

export const createTopValues = async (
  fields: { name: string; value: string }[],
) => {
  const tableName = 'top_values'
  const columns = fields.map((field) => `"${field.name}" TEXT`).join(', ')
  const values = fields.map((field) => `'${field.value}'`).join(', ')

  try {
    await db(`DROP TABLE IF EXISTS ${tableName}`)
    console.log('Table supprimée avec succès.')

    const createTableQuery = `
      CREATE TABLE ${tableName} (
        id SERIAL PRIMARY KEY,
        ${columns}
      );
    `
    await db(createTableQuery)
    console.log('Table dynamique créée avec succès.')

    const insertRowQuery = `
      INSERT INTO ${tableName} (${fields.map((field) => `"${field.name}"`).join(', ')})
      VALUES (${values});
    `
    await db(insertRowQuery)
    console.log('Valeurs insérées avec succès.')

    return true
  } catch (err) {
    console.error('Erreur:', err)
    throw err
  }
}

export const getAll = async (tableName: string) => {
  try {
    const rows = await db(`SELECT * FROM ${tableName}`)
    return rows
  } catch (err) {
    throw err
  }
}

export const getGrades = async (
  tableName: 'general_education' | 'pratic_education',
  studentId: number,
  session: number,
) => {
  const query = `
    SELECT s.name, s.module, e.grade, e.class_average, e.appreciation
    FROM ${tableName} e
    JOIN ${tableName === 'general_education' ? 'general_subjects' : 'pratic_subjects'} s ON e.subject_id = s.id
    WHERE e.student_id = $1 AND e.session = $2
  `
  try {
    const rows = await db(query, [studentId, session])
    return rows
  } catch (err) {
    throw err
  }
}

export const insert = async (tableName: string, data: Record<string, any>) => {
  const keys = Object.keys(data)
  const values = Object.values(data)
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')

  const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`
  try {
    const result = await db(query, values)
    return result[0].id
  } catch (err) {
    throw err
  }
}

export const writeGrade = async (
  tableName: 'general_education' | 'pratic_education',
  studentId: number,
  subjectId: number,
  session: number,
  grade: number,
) => {
  try {
    const insertQuery = `
      INSERT INTO ${tableName} (student_id, subject_id, session, grade)
      VALUES ($1, $2, $3, $4)
    `
    await db(insertQuery, [studentId, subjectId, session, grade])

    const averageQuery = `
      SELECT AVG(grade) as class_average 
      FROM ${tableName} 
      WHERE subject_id = $1 AND session = $2
    `
    const [{ class_average }] = await db(averageQuery, [subjectId, session])

    const updateQuery = `
      UPDATE ${tableName}
      SET class_average = $1
      WHERE subject_id = $2 AND session = $3
    `
    await db(updateQuery, [class_average, subjectId, session])

    return true
  } catch (err) {
    throw err
  }
}
