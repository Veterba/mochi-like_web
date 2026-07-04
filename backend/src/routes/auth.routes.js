import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import { signupSchema, loginSchema } from '../validators/auth.js'
import * as auth from '../services/auth.service.js'

const router = Router()

const COOKIE_OPTS = { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 3600 * 1000 }

router.post('/signup', validate(signupSchema), async (req, res, next) => {
  try {
    const { email, login, password } = req.body
    const user = await auth.signup({ email, login, password })
    res.cookie('token', auth.signToken(user.id), COOKIE_OPTS)
    res.status(201).json(user)
  } catch (err) { next(err) }
})

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const user = await auth.login(req.body)
    if (!user) return res.status(401).json({ error: 'Wrong credentials' })
    res.cookie('token', auth.signToken(user.id), COOKIE_OPTS)
    res.json(user)
  } catch (err) { next(err) }
})

router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ ok: true })
})

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await auth.getById(req.userId)
    if (!user) return res.status(404).json({ error: 'Not found' })
    res.json(user)
  } catch (err) { next(err) }
})

export default router
