import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { learningSchema } from '../validators/learning.js'
import * as learning from '../services/learning.service.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res, next) => {
  try {
    res.json(await learning.list(req.userId))
  } catch (err) { next(err) }
})

router.put('/:language', validate(learningSchema), async (req, res, next) => {
  try {
    await learning.set(req.userId, req.params.language, req.body.status)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

router.delete('/:language', async (req, res, next) => {
  try {
    await learning.remove(req.userId, req.params.language)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

export default router
