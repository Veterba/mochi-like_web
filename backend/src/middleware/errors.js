export function errorHandler(err, req, res, next) {
  if (err.code === '23505') return res.status(409).json({ error: 'Already exists' })
  if (err.code === '22P02') return res.status(400).json({ error: 'Invalid id' })
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
