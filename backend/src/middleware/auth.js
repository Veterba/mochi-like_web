import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined)

  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.sub
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
