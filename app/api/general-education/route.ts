import { NextRequest, NextResponse } from 'next/server'

import { apiGet } from '@/backend/db'
import { createGeneralSubjects } from '@/backend/migrations'

export async function GET() {
  const query = 'SELECT * FROM general_subjects'
  try {
    const config = await apiGet(query)
    // console.log('\n\n\nconfig is', config)

    return NextResponse.json({ data: config }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { statusText: 'Erreur lors de la sauvegarde de la configuration' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const subjects = await req.json()
  console.log('Request body:', subjects)

  try {
    await createGeneralSubjects(subjects)

    return new NextResponse('Matières sauvegardées avec succès', {
      status: 200,
    })
  } catch (error: any) {
    console.error('Error saving subjects:', error)
    return new NextResponse('Error saving subjects', { status: 500 })
  }
}

// export async function POST(req: NextRequest) {
//   const body = await req.json()
//   console.log('Request body:', body)

//   const fields = body

//   try {
//     // Transform attributes into array of objects with name and value
//     const attributeFields = fields.map(
//       (field: { name: string; value: string }) => {
//         return {
//           name: field.name,
//           value: String(field.value),
//         }
//       },
//     )

//     console.log('attributeFields are', attributeFields)

//     // Create dynamic table with attributes
//     await createTableGeneralEducationValues(attributeFields)
//     return new NextResponse('Configuration saved successfully', { status: 200 })
//   } catch (error: any) {
//     console.error('Error saving configuration:', error)
//     return new NextResponse('Error saving configuration', { status: 500 })
//   }

//   // try {
//   //   // Insérer l'étudiant
//   //   const insertStudentQuery = `
//   //       INSERT INTO students(firstname, lastname)
//   //       VALUES(?, ?)
//   //     `
//   //   const studentId = await apiPost(insertStudentQuery, [firstname, lastname])

//   //   // Insérer les attributs
//   //   const insertAttributeQuery = `
//   //       INSERT INTO student_attributes(student_id, attribute_name, attribute_value)
//   //       VALUES(?, ?, ?)
//   //     `
//   //   for (const [name, value] of Object.entries(attributes)) {
//   //     await apiPost(insertAttributeQuery, [studentId, name, value])
//   //   }

//   //   return NextResponse.json(
//   //     { statusText: 'Successfully created student' },
//   //     { status: 200 },
//   //   )
//   // } catch (err: any) {
//   //   console.error('Erreur détaillée:', err)
//   //   return NextResponse.json({ error: err.message }, { status: 400 })
//   // }
//   // return NextResponse.json({ error: 'Tutute' }, { status: 400 })
// }
