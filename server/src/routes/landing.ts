import { Router, Request, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import {
  listLandingHistory,
  publishLandingConfig,
  readLandingConfig,
  rollbackLandingConfig,
  writeLandingConfig,
} from '../services/landingConfig'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    res.json(await readLandingConfig())
  } catch (error) {
    console.error('Get landing config error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/admin', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    res.json(await readLandingConfig())
  } catch (error) {
    console.error('Get admin landing config error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/admin/history', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    res.json(await listLandingHistory())
  } catch (error) {
    console.error('Get landing history error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    res.json(await publishLandingConfig(req.body))
  } catch (error) {
    console.error('Update landing config error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/admin/draft', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    res.json(await writeLandingConfig(req.body, 'draft'))
  } catch (error) {
    console.error('Save landing draft error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/admin/publish', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    res.json(await publishLandingConfig(Object.keys(req.body || {}).length > 0 ? req.body : undefined))
  } catch (error) {
    console.error('Publish landing config error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/admin/rollback/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    res.json(await rollbackLandingConfig(req.params.id))
  } catch (error) {
    console.error('Rollback landing config error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
