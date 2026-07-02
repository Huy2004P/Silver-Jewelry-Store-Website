import { Router, Request, Response } from 'express'
import prisma from '../db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

// Lấy danh sách danh mục
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    })
    res.json(categories)
  } catch (error) {
    console.error('Categories error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Tạo mới danh mục
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug } = req.body
    if (!name || !slug) {
      res.status(400).json({ error: 'Thiếu tên hoặc slug của danh mục' })
      return
    }

    // Check trùng slug
    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      res.status(400).json({ error: 'Slug đã tồn tại, vui lòng chọn slug khác' })
      return
    }

    const category = await prisma.category.create({
      data: { name, slug }
    })
    res.status(201).json(category)
  } catch (error) {
    console.error('Create category error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Cập nhật danh mục
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const { name, slug } = req.body
    if (!name || !slug) {
      res.status(400).json({ error: 'Thiếu tên hoặc slug của danh mục' })
      return
    }

    // Check trùng slug nhưng không phải chính nó
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    })
    if (existing) {
      res.status(400).json({ error: 'Slug đã tồn tại, vui lòng chọn slug khác' })
      return
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug }
    })
    res.json(category)
  } catch (error) {
    console.error('Update category error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Xóa danh mục
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id)

    // Kiểm tra xem danh mục có sản phẩm nào không
    const productCount = await prisma.product.count({
      where: { categoryId: id }
    })

    if (productCount > 0) {
      res.status(400).json({ error: 'Danh mục này đang chứa sản phẩm, không thể xóa!' })
      return
    }

    await prisma.category.delete({ where: { id } })
    res.json({ message: 'Category deleted' })
  } catch (error) {
    console.error('Delete category error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
