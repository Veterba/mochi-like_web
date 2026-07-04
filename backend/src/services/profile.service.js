import { sql } from '../db.js'

export async function getProfile(userId) {
  const [user] = await sql`
    select id, email, login, nickname, avatar from users where id = ${userId}
  `
  return user
}

export async function updateProfile(userId, patch) {
  const keys = Object.keys(patch)
  const [user] = await sql`
    update users
    set ${sql(patch, keys)}
    where id = ${userId}
    returning nickname, avatar
  `
  return user
}
