import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errors.js'
import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'
import learningRoutes from './routes/learning.routes.js'
import activityRoutes from './routes/activity.routes.js'
import flashcardsRoutes from './routes/flashcards.routes.js'
import tutorRoutes from './routes/tutor.routes.js'

const app = express()

const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',')
app.use(cors({ origin: origins, credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: '5mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/learning', learningRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/flashcards', flashcardsRoutes)
app.use('/api/tutor', tutorRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 4200
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})
