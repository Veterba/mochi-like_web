import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sql } from '../db.js'

export async function signup({ email, login, password }) {
  const password_hash = await bcrypt.hash(password, 10)
  const [user] = await sql`
    insert into users (email, login, password_hash, nickname)
    values (${email}, ${login}, ${password_hash}, ${login})
    returning id, email, login, nickname, avatar
  `
  return user
}

export async function login({ identifier, password }) {
  const [user] = await sql`
    select id, email, login, nickname, avatar, password_hash
    from users
    where email = ${identifier} or login = ${identifier}
  `
  if (!user) return null
  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return null
  const { password_hash, ...rest } = user
  return rest
}

export async function getById(id) {
  const [user] = await sql`
    select id, email, login, nickname, avatar from users where id = ${id}
  `
  return user
}

export function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}
