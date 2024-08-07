import { db } from '@/backend/db'

export const getAll = (tableName: string) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

export const insert = (tableName: string, data: Record<string, any>) => {
  const keys = Object.keys(data)
  const values = Object.values(data)
  const placeholders = keys.map(() => '?').join(', ')

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`
    db.run(query, values, function (err) {
      if (err) reject(err)
      else resolve(this.lastID)
    })
  })
}
