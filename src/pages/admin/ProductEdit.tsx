import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm, { type ProductFormData } from '../../components/admin/ProductForm'
import { getProducts, updateProduct } from '../../api'

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initial, setInitial] = useState<ProductFormData | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getProducts()
      .then((products) => {
        const product = products.find((p) => p.id === parseInt(id))
        if (product) {
          setInitial({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: String(product.price),
            categoryId: String(product.categoryId),
            images: product.images,
            isFeatured: product.isFeatured,
            isAvailable: product.isAvailable,
            showPrice: product.showPrice,
          })
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(data: ProductFormData) {
    if (!id) return
    try {
      await updateProduct(parseInt(id), {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: parseFloat(data.price),
        images: data.images,
        categoryId: parseInt(data.categoryId),
        isFeatured: data.isFeatured,
        isAvailable: data.isAvailable,
        showPrice: data.showPrice,
      })
      navigate('/admin/products')
    } catch {
      alert('Không thể cập nhật sản phẩm')
    }
  }

  if (loading) {
    return <p className="font-body text-[17px] text-ink-muted-48">Đang tải...</p>
  }

  if (!initial) {
    return <p className="font-body text-[17px] text-ink-muted-48">Không tìm thấy sản phẩm</p>
  }

  return (
    <div>
      <h1 className="font-display text-[32px] font-semibold text-ink">Sửa sản phẩm</h1>
      <ProductForm initial={initial} onSubmit={handleSubmit} submitLabel="Cập nhật" />
    </div>
  )
}
