import 'dotenv/config'
import postgres from 'postgres'

export const sql = postgres(process.env.CONNECTION_STRING, {
  max: 10,
  ssl: { rejectUnauthorized: false },
})
