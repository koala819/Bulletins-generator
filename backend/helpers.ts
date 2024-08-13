import { db } from './db'

import { QueryResult, QueryResultRow } from '@vercel/postgres'

export const createTableWithSchema = async (
  tableName: string,
  schema: string,
) => {
  try {
    await db`DROP TABLE IF EXISTS ${tableName}`
    await db`CREATE TABLE IF NOT EXISTS ${tableName} ${schema}`
    return true
  } catch (error) {
    console.error('Error creating table:', error)
    throw error
  }
}

export const createTopValues = async (
  fields: { name: string; value: string }[],
) => {
  const tableName = 'top_values'
  const columns = fields.map((field) => `"${field.name}" TEXT`).join(', ')
  const values = fields.map((field) => field.value)

  try {
    await db`DROP TABLE IF EXISTS ${tableName}`

    await db`
      CREATE TABLE ${tableName} (
        id SERIAL PRIMARY KEY,
        ${columns}
      )
    `

    const insertQuery = `
      INSERT INTO ${tableName} (${fields.map((field) => `"${field.name}"`).join(', ')})
      VALUES (${fields.map((_, index) => `$${index + 1}`).join(', ')})
    `

    await db.query(insertQuery, values)

    return true
  } catch (error) {
    console.error('Error creating top values:', error)
    throw error
  }
}

export const getAll = async (tableName: string) => {
  try {
    const result = await db`SELECT * FROM ${tableName}`
    return result
  } catch (error) {
    console.error('Error getting all rows:', error)
    throw error
  }
}

export const getGrades = async (
  tableName: 'general_education' | 'pratic_education',
  studentId: number,
  session: number,
) => {
  try {
    const result = await db`
      SELECT s.name, s.module, e.grade, e.class_average, e.appreciation
      FROM ${tableName} e
      JOIN ${tableName === 'general_education' ? 'general_subjects' : 'pratic_subjects'} s ON e.subject_id = s.id
      WHERE e.student_id = ${studentId} AND e.session = ${session}
    `
    return result
  } catch (error) {
    console.error('Error getting grades:', error)
    throw error
  }
}

export const insert = async (tableName: string, data: Record<string, any>) => {
  const keys = Object.keys(data)
  const values = Object.values(data)
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')

  try {
    const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`
    const result = await db.query(query, values)
    return result.rows[0].id
  } catch (error) {
    console.error('Error inserting data:', error)
    throw error
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
    await db`
      INSERT INTO ${tableName} (student_id, subject_id, session, grade)
      VALUES (${studentId}, ${subjectId}, ${session}, ${grade})
    `

    const result: QueryResult<QueryResultRow> = await db`
      SELECT AVG(grade) as class_average 
      FROM ${tableName} 
      WHERE subject_id = ${subjectId} AND session = ${session}
    `

    const classAverage = result.rows[0]?.class_average ?? null

    if (classAverage !== null) {
      await db`
        UPDATE ${tableName}
        SET class_average = ${classAverage}
        WHERE subject_id = ${subjectId} AND session = ${session}
      `
    }

    return true
  } catch (error) {
    console.error('Error writing grade:', error)
    throw error
  }
}
