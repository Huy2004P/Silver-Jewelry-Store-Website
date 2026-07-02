import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../db'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'tiem-bac-anh-xuan-secret-key-2024'

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
