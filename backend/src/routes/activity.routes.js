import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import * as activity from '../services/activity.service.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res, next) => {
  try {
    res.json(await activity.list(req.userId))
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    await activity.markToday(req.userId)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

export default router
