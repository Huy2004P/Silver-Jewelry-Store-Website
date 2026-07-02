import { Router, Request, Response } from 'express'
import prisma from '../db'

const router = Router()

// GET /api/products/:productId/reviews
router.get('/:productId/reviews', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId)
    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID' })
      return
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    })

    res.json(reviews)
  } catch (error) {
    console.error('Get reviews error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/products/:productId/reviews
router.post('/:productId/reviews', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId)
    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID' })
      return
    }

    const { name, rating, comment } = req.body

    if (!name || !rating || !comment) {
      res.status(400).json({ error: 'Name, rating, and comment are required' })
      return
    }

    const parsedRating = parseInt(rating)
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      res.status(400).json({ error: 'Rating must be between 1 and 5' })
      return
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    const review = await prisma.review.create({
      data: {
        name,
        rating: parsedRating,
        comment,
        productId,
      }
    })

    res.status(201).json(review)
  } catch (error) {
    console.error('Create review error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
