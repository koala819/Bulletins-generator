import { createTables } from '@/backend/migrations'

export async function initDatabase() {
  console.log('Initialisation de la base de données...')
  await createTables()
  console.log('Migration terminée.')
}

// Exécutez l'initialisation immédiatement
initDatabase().catch(console.error)
