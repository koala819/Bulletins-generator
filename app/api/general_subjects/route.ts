import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/backend/db'

export async function GET() {
  try {
    const data = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM general_subjects`, (err, rows) => {
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
  const { name } = await req.json()

  try {
    const insertQuery = `INSERT INTO general_subjects (name) VALUES (?)`
    const values = [name]

    await new Promise((resolve, reject) => {
      db.run(insertQuery, values, function (err) {
        if (err) {
          console.error(
            "Erreur lors de l'insertion de la matière:",
            err.message,
          )
          return reject(err)
        }
        resolve(this.lastID)
      })
    })

    return new NextResponse('Matière ajoutée avec succès', { status: 200 })
  } catch (error: any) {
    console.error('Error adding subject:', error)
    return new NextResponse('Error adding subject', { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()

  try {
    const deleteQuery = `DELETE FROM general_subjects WHERE id = ?`
    const values = [id]

    await new Promise((resolve, reject) => {
      db.run(deleteQuery, values, function (err) {
        if (err) {
          console.error(
            'Erreur lors de la suppression de la matière:',
            err.message,
          )
          return reject(err)
        }
        resolve(this.changes)
      })
    })

    return new NextResponse('Matière supprimée avec succès', { status: 200 })
  } catch (error: any) {
    console.error('Error deleting subject:', error)
    return new NextResponse('Error deleting subject', { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const { id, name } = await req.json()

  try {
    const updateQuery = `UPDATE general_subjects SET name = ? WHERE id = ?`
    const values = [name, id]

    await new Promise((resolve, reject) => {
      db.run(updateQuery, values, function (err) {
        if (err) {
          console.error(
            'Erreur lors de la mise à jour de la matière:',
            err.message,
          )
          return reject(err)
        }
        resolve(this.changes)
      })
    })

    return new NextResponse('Matière mise à jour avec succès', { status: 200 })
  } catch (error: any) {
    console.error('Error updating subject:', error)
    return new NextResponse('Error updating subject', { status: 500 })
  }
}
