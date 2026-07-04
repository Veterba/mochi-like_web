import { sql } from '../db.js'

export async function list(userId) {
  return sql`select language, status from learning where user_id = ${userId}`
}

export async function set(userId, language, status) {
  await sql`
    insert into learning (user_id, language, status)
    values (${userId}, ${language}, ${status})
    on conflict (user_id, language) do update set status = excluded.status
  `
}

export async function remove(userId, language) {
  await sql`delete from learning where user_id = ${userId} and language = ${language}`
}
