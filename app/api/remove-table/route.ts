import { NextResponse } from 'next/server'

import { deleteUnusedTable } from '@/backend/migrations'

export async function DELETE() {
  try {
    await deleteUnusedTable('pratic_education')
    return new NextResponse('Deleted table successfully', { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la suppression de la table:', error)
    return new NextResponse('Failed to delete table', { status: 500 })
  }
}
