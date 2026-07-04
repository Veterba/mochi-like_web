import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { profileSchema } from '../validators/profile.js'
import * as profile from '../services/profile.service.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res, next) => {
  try {
    res.json(await profile.getProfile(req.userId))
  } catch (err) { next(err) }
})

router.patch('/', validate(profileSchema), async (req, res, next) => {
  try {
    res.json(await profile.updateProfile(req.userId, req.body))
  } catch (err) { next(err) }
})

export default router
