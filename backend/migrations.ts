// migrations.ts
import { db } from './db'

export const createTables = async () => {
  console.log('Début de la création des tables...')
  try {
    await db`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL
      )
    `

    await db`
      CREATE TABLE IF NOT EXISTS general_subjects (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        module TEXT NOT NULL
      )
    `

    await db`
      CREATE TABLE IF NOT EXISTS pratic_subjects (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        module TEXT NOT NULL
      )
    `

    await db`
      CREATE TABLE IF NOT EXISTS general_education (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        subject_id INTEGER REFERENCES general_subjects(id),
        session INTEGER,
        grade INTEGER,
        class_average REAL,
        appreciation TEXT
      )
    `

    await db`
      CREATE TABLE IF NOT EXISTS pratic_education (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        subject_id INTEGER REFERENCES pratic_subjects(id),
        session INTEGER,
        grade INTEGER,
        class_average REAL,
        appreciation TEXT
      )
    `

    console.log('Fin de la création des tables.')
    return true
  } catch (error) {
    console.error('Erreur lors de la création des tables:', error)
    throw error
  }
}

export const deleteUnusedTable = async (name: string) => {
  console.log('Deleting table:', name)
  try {
    await db`DROP TABLE IF EXISTS ${name}`
    console.log('Table supprimée avec succès.')
    return true
  } catch (error) {
    console.error('Erreur lors de la suppression de la table:', error)
    throw error
  }
}

export const updateGrade = async (
  tableName: 'general_education' | 'pratic_education',
  studentId: number,
  subjectId: number,
  session: number,
  grade: number,
  classAverage: number,
  appreciation: string,
) => {
  try {
    await db`
      UPDATE ${tableName}
      SET grade = ${grade}, class_average = ${classAverage}, appreciation = ${appreciation}
      WHERE student_id = ${studentId} AND subject_id = ${subjectId} AND session = ${session}
    `
    return true
  } catch (error) {
    console.error('Error updating grade:', error)
    throw error
  }
}

export const createStudentWithSessions = async (
  firstname: string,
  lastname: string,
  subjects: {
    general: { name: string; module: string }[]
    pratic: { name: string; module: string }[]
  },
) => {
  try {
    const [student] = await db`
      INSERT INTO students (firstname, lastname)
      VALUES (${firstname}, ${lastname})
      RETURNING id
    `
    const studentId = student.id

    for (const subject of subjects.general) {
      for (let session = 1; session <= 2; session++) {
        await db`
          INSERT INTO general_education (student_id, subject_id, session, grade, class_average, appreciation)
          VALUES (
            ${studentId},
            (SELECT id FROM general_subjects WHERE name = ${subject.name} AND module = ${subject.module}),
            ${session},
            NULL,
            NULL,
            NULL
          )
        `
      }
    }

    for (const subject of subjects.pratic) {
      for (let session = 1; session <= 2; session++) {
        await db`
          INSERT INTO pratic_education (student_id, subject_id, session, grade, class_average, appreciation)
          VALUES (
            ${studentId},
            (SELECT id FROM pratic_subjects WHERE name = ${subject.name} AND module = ${subject.module}),
            ${session},
            NULL,
            NULL,
            NULL
          )
        `
      }
    }

    return studentId
  } catch (error) {
    console.error(
      "Erreur lors de la création de l'étudiant avec sessions:",
      error,
    )
    throw error
  }
}

export const createGeneralEducation = async (
  fields: {
    student_id: number
    subject_id: number
    session: number
    grade: number
    class_average: number
    appreciation: string
  }[],
) => {
  try {
    for (const field of fields) {
      await db`
        INSERT INTO general_education (student_id, subject_id, session, grade, class_average, appreciation)
        VALUES (${field.student_id}, ${field.subject_id}, ${field.session}, ${field.grade}, ${field.class_average}, ${field.appreciation})
      `
    }
    return true
  } catch (error) {
    console.error(
      "Erreur lors de la création des valeurs pour l'éducation générale:",
      error,
    )
    throw error
  }
}

export const createPraticEducation = async (
  fields: {
    student_id: number
    subject_id: number
    session: number
    grade: number
    class_average: number
    appreciation: string
  }[],
) => {
  try {
    for (const field of fields) {
      await db`
        INSERT INTO pratic_education (student_id, subject_id, session, grade, class_average, appreciation)
        VALUES (${field.student_id}, ${field.subject_id}, ${field.session}, ${field.grade}, ${field.class_average}, ${field.appreciation})
      `
    }
    return true
  } catch (error) {
    console.error(
      "Erreur lors de la création des valeurs pour l'éducation pratique:",
      error,
    )
    throw error
  }
}
