import './env'

import express from 'express'
import cors from 'cors'
import path from 'path'
import authRoutes from './routes/auth'
import categoryRoutes from './routes/categories'
import productRoutes from './routes/products'
import uploadRoutes from './routes/upload'
import landingRoutes from './routes/landing'
import reviewRoutes from './routes/reviews'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/products', reviewRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/landing', landingRoutes)

if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../dist')
  app.use(express.static(clientDistPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
