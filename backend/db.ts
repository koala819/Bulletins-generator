import { TableColumn } from '@/types/models'

import path from 'path'
import sqlite3 from 'sqlite3'

const dbPath = path.join(process.cwd(), 'profile.db')
// console.log('Chemin de la base de données:', dbPath)
export const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the profile database.')
  },
)

export const apiGet = async (query: string) => {
  return await new Promise((resolve, reject) => {
    db.all(query, (err: Error, row) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      return resolve(row)
    })
  })
}

export const apiPost = async (query: string, values: any[]) => {
  return new Promise((resolve, reject) => {
    db.run(query, values, function (err) {
      if (err) {
        console.error('Erreur SQL:', err)
        reject(err)
      } else {
        resolve(this.lastID)
      }
    })
  })
}

export const apiRun = async (query: string) => {
  return new Promise((resolve, reject) => {
    db.run(query, (err: Error) => {
      if (err) {
        console.error('Erreur SQL:', err)
        return reject(err)
      }
      resolve(true)
    })
  })
}

// Function to check if a column exists in a table
export const columnExists = async (tableName: string, columnName: string) => {
  const query = `PRAGMA table_info(${tableName})`
  const columns = (await apiGet(query)) as TableColumn[]
  return columns.some((col: TableColumn) => col.name === columnName)
}
