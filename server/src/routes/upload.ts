import { Router, Response } from 'express'
import multer from 'multer'
import path from 'path'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../../public/uploads'))
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/
    const ext = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    if (ext && mime) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

router.post('/', authMiddleware, upload.single('file'), (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    const url = `/uploads/${req.file.filename}`
    res.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
