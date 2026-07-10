import { sql } from '../db.js'
import { tutorReply } from './llm.js'

const HISTORY_LIMIT = 20 // messages sent to the model per request (cost cap)

export async function listChats(userId) {
  return sql`
    select id, title, created_at from chats
    where user_id = ${userId}
    order by created_at desc
  `
}

export async function createChat(userId) {
  const [chat] = await sql`
    insert into chats (user_id) values (${userId})
    returning id, title, created_at
  `
  return chat
}

export async function deleteChat(userId, chatId) {
  await sql`delete from chats where id = ${chatId} and user_id = ${userId}`
}

async function ownChat(userId, chatId) {
  const [chat] = await sql`
    select id, title from chats where id = ${chatId} and user_id = ${userId}
  `
  return chat
}

export async function getMessages(userId, chatId) {
  if (!(await ownChat(userId, chatId))) return null
  return sql`
    select id, role, content, created_at from chat_messages
    where chat_id = ${chatId}
    order by created_at asc
  `
}

export async function sendMessage(userId, chatId, content, override) {
  const chat = await ownChat(userId, chatId)
  if (!chat) return null

  await sql`
    insert into chat_messages (chat_id, role, content)
    values (${chatId}, 'user', ${content})
  `

  if (chat.title === 'New chat') {
    const title = content.slice(0, 40)
    await sql`update chats set title = ${title} where id = ${chatId}`
  }

  const recent = await sql`
    select role, content from (
      select role, content, created_at from chat_messages
      where chat_id = ${chatId}
      order by created_at desc
      limit ${HISTORY_LIMIT}
    ) t order by created_at asc
  `

  const reply = await tutorReply(recent, override)

  const [message] = await sql`
    insert into chat_messages (chat_id, role, content)
    values (${chatId}, 'assistant', ${reply})
    returning id, role, content, created_at
  `
  return message
}
