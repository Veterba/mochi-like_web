import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { randomInt } from 'crypto'
import { sql } from '../db.js'
import { sendVerifyCode } from './mail.service.js'

export async function signup({ email, login, password }) {
  const password_hash = await bcrypt.hash(password, 10)
  const code = randomInt(100000, 1000000).toString()
  const [user] = await sql`
    insert into users (email, login, password_hash, nickname, email_verified, verify_code, verify_expires)
    values (${email}, ${login}, ${password_hash}, ${login}, false, ${code}, now() + interval '15 minutes')
    returning id, email
  `
  await sendVerifyCode(email, code)
  return { email: user.email }
}

export async function login({ identifier, password }) {
  const [user] = await sql`
    select id, email, login, nickname, avatar, password_hash, email_verified
    from users
    where email = ${identifier} or login = ${identifier}
  `
  if (!user) return null
  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return null
  if (!user.email_verified) return { unverified: true, email: user.email }
  const { password_hash, email_verified, ...rest } = user
  return rest
}

export async function verify(email, code) {
  const [user] = await sql`
    select id, email, login, nickname, avatar, verify_code, verify_expires
    from users
    where email = ${email}
  `
  if (!user || user.verify_code !== code || new Date(user.verify_expires) < new Date()) return null
  await sql`
    update users
    set email_verified = true, verify_code = null, verify_expires = null
    where id = ${user.id}
  `
  const { verify_code, verify_expires, ...rest } = user
  return rest
}

export async function resendCode(email) {
  const [user] = await sql`
    select id, email_verified from users where email = ${email}
  `
  if (user && !user.email_verified) {
    const code = randomInt(100000, 1000000).toString()
    await sql`
      update users
      set verify_code = ${code}, verify_expires = now() + interval '15 minutes'
      where id = ${user.id}
    `
    await sendVerifyCode(email, code)
  }
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
