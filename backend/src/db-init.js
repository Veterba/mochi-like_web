import { readFileSync } from 'node:fs'
import { sql } from './db.js'

const schemaText = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8')

await sql.unsafe(schemaText)
console.log('Schema initialized')
await sql.end()
process.exit(0)
