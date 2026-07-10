import { sql } from '../db.js'

export async function getTree(userId) {
  const folders = await sql`select id, name from folders where user_id = ${userId} order by created_at`
  if (!folders.length) return []

  const folderIds = folders.map(f => f.id)

  const topics = await sql`select id, folder_id, name from topics where folder_id in ${sql(folderIds)} order by created_at`
  const topicIds = topics.map(t => t.id)

  const cards = topicIds.length
    ? await sql`select id, topic_id, front, back from cards where topic_id in ${sql(topicIds)} order by created_at`
    : []

  const cardsByTopic = {}
  for (const c of cards) {
    if (!cardsByTopic[c.topic_id]) cardsByTopic[c.topic_id] = []
    cardsByTopic[c.topic_id].push({ id: c.id, front: c.front, back: c.back })
  }

  const topicsByFolder = {}
  for (const t of topics) {
    if (!topicsByFolder[t.folder_id]) topicsByFolder[t.folder_id] = []
    topicsByFolder[t.folder_id].push({ id: t.id, name: t.name, cards: cardsByTopic[t.id] || [] })
  }

  return folders.map(f => ({ id: f.id, name: f.name, topics: topicsByFolder[f.id] || [] }))
}

export async function createFolder(userId, name) {
  const [folder] = await sql`
    insert into folders (user_id, name) values (${userId}, ${name}) returning id, name
  `
  return folder
}

export async function deleteFolder(userId, id) {
  await sql`delete from folders where id = ${id} and user_id = ${userId}`
}

export async function createTopic(userId, folderId, name) {
  const [folder] = await sql`select id from folders where id = ${folderId} and user_id = ${userId}`
  if (!folder) return null
  const [topic] = await sql`
    insert into topics (folder_id, name) values (${folderId}, ${name}) returning id, name
  `
  return topic
}

export async function deleteTopic(userId, id) {
  await sql`
    delete from topics where id = ${id}
    and folder_id in (select id from folders where user_id = ${userId})
  `
}

export async function createCard(userId, topicId, front, back) {
  const [topic] = await sql`
    select t.id from topics t
    join folders f on f.id = t.folder_id
    where t.id = ${topicId} and f.user_id = ${userId}
  `
  if (!topic) return null
  const [card] = await sql`
    insert into cards (topic_id, front, back) values (${topicId}, ${front}, ${back}) returning id, front, back
  `
  return card
}

export async function deleteCard(userId, id) {
  await sql`
    delete from cards where id = ${id}
    and topic_id in (
      select t.id from topics t
      join folders f on f.id = t.folder_id
      where f.user_id = ${userId}
    )
  `
}

export async function incrementLearned(userId, n) {
  await sql`update users set cards_learned = cards_learned + ${n} where id = ${userId}`
}

export async function stats(userId) {
  const [row] = await sql`
    select
      (
        select count(*)::int from cards c
        join topics t on t.id = c.topic_id
        join folders f on f.id = t.folder_id
        where f.user_id = ${userId}
      ) as "cardsAdded",
      (select cards_learned from users where id = ${userId}) as "cardsLearned"
  `
  return row ?? { cardsAdded: 0, cardsLearned: 0 }
}
