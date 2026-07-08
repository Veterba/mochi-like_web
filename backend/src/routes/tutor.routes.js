import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { messageSchema, assessSchema } from '../validators/tutor.js'
import * as tutor from '../services/tutor.service.js'
import * as pronunciation from '../services/pronunciation.service.js'

const router = Router()
router.use(requireAuth)

router.get('/chats', async (req, res, next) => {
  try {
    res.json(await tutor.listChats(req.userId))
  } catch (err) { next(err) }
})

router.post('/chats', async (req, res, next) => {
  try {
    res.status(201).json(await tutor.createChat(req.userId))
  } catch (err) { next(err) }
})

router.delete('/chats/:id', async (req, res, next) => {
  try {
    await tutor.deleteChat(req.userId, req.params.id)
    res.status(204).end()
  } catch (err) { next(err) }
})

router.get('/chats/:id/messages', async (req, res, next) => {
  try {
    const messages = await tutor.getMessages(req.userId, req.params.id)
    if (!messages) return res.status(404).json({ error: 'Chat not found' })
    res.json(messages)
  } catch (err) { next(err) }
})

router.post('/chats/:id/messages', validate(messageSchema), async (req, res, next) => {
  try {
    const reply = await tutor.sendMessage(req.userId, req.params.id, req.body.content)
    if (!reply) return res.status(404).json({ error: 'Chat not found' })
    res.status(201).json(reply)
  } catch (err) {
    if (err.status === 429) {
      return res.status(503).json({ error: 'The tutor is busy right now — try again in a minute.' })
    }
    next(err)
  }
})

router.post('/assess', validate(assessSchema), async (req, res, next) => {
  try {
    const { text, audio, mimeType, lang, chatId } = req.body
    const result = await pronunciation.assess(req.userId, { text, audio, mimeType, lang })
    let reply = null
    if (chatId) {
      reply = await tutor.sendMessage(req.userId, chatId, pronunciation.formatEvidence(text, result))
      if (!reply) reply = null // chat not found — still return evidence
    }
    res.json({ ...result, reply })
  } catch (err) { next(err) }
})

router.get('/pronunciation-profile', async (req, res, next) => {
  try {
    res.json(await pronunciation.profile(req.userId))
  } catch (err) { next(err) }
})

export default router
