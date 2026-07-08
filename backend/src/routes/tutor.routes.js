import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { messageSchema } from '../validators/tutor.js'
import * as tutor from '../services/tutor.service.js'

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
  } catch (err) { next(err) }
})

export default router
