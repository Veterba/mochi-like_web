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

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: '5mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/learning', learningRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/flashcards', flashcardsRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 4200
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})
