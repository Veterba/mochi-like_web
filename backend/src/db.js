import 'dotenv/config'
import postgres from 'postgres'

export const sql = postgres(process.env.CONNECTION_STRING || process.env.DATABASE_URL, {
  max: 10,
  ssl: { rejectUnauthorized: false },
})
