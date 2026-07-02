import { Router, Request, Response } from 'express'
import prisma from '../db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

function hasField(body: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(body, key)
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, sort, featured } = req.query

    const where: Record<string, unknown> = {}

    if (category && category !== 'all') {
      where.category = { slug: category }
    }

    if (search) {
      where.name = { contains: String(search) }
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sort === 'price_asc') orderBy = { price: 'asc' }
    if (sort === 'price_desc') orderBy = { price: 'desc' }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    })

    const parsed = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
    }))

    res.json(parsed)
  } catch (error) {
    console.error('Products list error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    })

    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    res.json({ ...product, images: JSON.parse(product.images) })
  } catch (error) {
    console.error('Product detail error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description, price, images, categoryId, isFeatured, isAvailable, showPrice } = req.body

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        images: JSON.stringify(images || []),
        categoryId: parseInt(categoryId),
        isFeatured: isFeatured || false,
        isAvailable: isAvailable ?? true,
        showPrice: showPrice ?? true,
      },
      include: { category: true },
    })

    res.status(201).json({ ...product, images: JSON.parse(product.images) })
  } catch (error) {
    console.error('Product create error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const { name, slug, description, price, images, categoryId, isFeatured, isAvailable, showPrice } = req.body
    const body = req.body as Record<string, unknown>

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: hasField(body, 'name') ? name : undefined,
        slug: hasField(body, 'slug') ? slug : undefined,
        description: hasField(body, 'description') ? description : undefined,
        price: hasField(body, 'price') ? parseFloat(price) : undefined,
        images: hasField(body, 'images') ? JSON.stringify(images || []) : undefined,
        categoryId: hasField(body, 'categoryId') ? parseInt(categoryId) : undefined,
        isFeatured: hasField(body, 'isFeatured') ? isFeatured : undefined,
        isAvailable: hasField(body, 'isAvailable') ? isAvailable : undefined,
        showPrice: hasField(body, 'showPrice') ? showPrice : undefined,
      },
      include: { category: true },
    })

    res.json({ ...product, images: JSON.parse(product.images) })
  } catch (error) {
    console.error('Product update error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    await prisma.product.delete({ where: { id } })
    res.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('Product delete error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
