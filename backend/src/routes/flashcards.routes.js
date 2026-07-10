import { Router } from 'express'
import Joi from 'joi'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { nameSchema, cardSchema } from '../validators/flashcards.js'
import * as fc from '../services/flashcards.service.js'

const router = Router()
router.use(requireAuth)

const learnedSchema = Joi.object({
  count: Joi.number().integer().min(1).max(1000).required()
})

router.get('/stats', async (req, res, next) => {
  try {
    res.json(await fc.stats(req.userId))
  } catch (err) { next(err) }
})

router.post('/learned', validate(learnedSchema), async (req, res, next) => {
  try {
    await fc.incrementLearned(req.userId, req.body.count)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

router.get('/', async (req, res, next) => {
  try {
    res.json(await fc.getTree(req.userId))
  } catch (err) { next(err) }
})

router.post('/folders', validate(nameSchema), async (req, res, next) => {
  try {
    res.status(201).json(await fc.createFolder(req.userId, req.body.name))
  } catch (err) { next(err) }
})

router.delete('/folders/:id', async (req, res, next) => {
  try {
    await fc.deleteFolder(req.userId, req.params.id)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

router.post('/folders/:id/topics', validate(nameSchema), async (req, res, next) => {
  try {
    const topic = await fc.createTopic(req.userId, req.params.id, req.body.name)
    if (!topic) return res.status(404).json({ error: 'Not found' })
    res.status(201).json(topic)
  } catch (err) { next(err) }
})

router.delete('/topics/:id', async (req, res, next) => {
  try {
    await fc.deleteTopic(req.userId, req.params.id)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

router.post('/topics/:id/cards', validate(cardSchema), async (req, res, next) => {
  try {
    const card = await fc.createCard(req.userId, req.params.id, req.body.front, req.body.back)
    if (!card) return res.status(404).json({ error: 'Not found' })
    res.status(201).json(card)
  } catch (err) { next(err) }
})

router.delete('/cards/:id', async (req, res, next) => {
  try {
    await fc.deleteCard(req.userId, req.params.id)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

export default router
