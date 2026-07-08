import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import { signupSchema, loginSchema, verifySchema, resendSchema } from '../validators/auth.js'
import * as auth from '../services/auth.service.js'

const router = Router()

const COOKIE_OPTS = { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 3600 * 1000 }

router.post('/signup', validate(signupSchema), async (req, res, next) => {
  try {
    const { email, login, password } = req.body
    const result = await auth.signup({ email, login, password })
    res.status(201).json({ needsVerification: true, email: result.email })
  } catch (err) { next(err) }
})

router.post('/verify', validate(verifySchema), async (req, res, next) => {
  try {
    const { email, code } = req.body
    const user = await auth.verify(email, code)
    if (!user) return res.status(400).json({ error: 'Invalid or expired code' })
    const token = auth.signToken(user.id)
    res.cookie('token', token, COOKIE_OPTS)
    res.json({ user, token })
  } catch (err) { next(err) }
})

router.post('/resend', validate(resendSchema), async (req, res, next) => {
  try {
    await auth.resendCode(req.body.email)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await auth.login(req.body)
    if (!result) return res.status(401).json({ error: 'Wrong credentials' })
    if (result.unverified) {
      return res.status(403).json({ error: 'Email not verified', needsVerification: true, email: result.email })
    }
    const token = auth.signToken(result.id)
    res.cookie('token', token, COOKIE_OPTS)
    res.json({ user: result, token })
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
