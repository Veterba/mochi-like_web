import { sql } from '../db.js'

export async function list(userId) {
  const rows = await sql`
    select to_char(day, 'YYYY-MM-DD') as day from activity where user_id = ${userId}
  `
  return rows.map(r => r.day)
}

export async function markToday(userId) {
  await sql`
    insert into activity (user_id, day) values (${userId}, current_date)
    on conflict do nothing
  `
}
