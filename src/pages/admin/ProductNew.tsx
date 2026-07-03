import { useNavigate } from 'react-router-dom'
import ProductForm, { type ProductFormData } from '../../components/admin/ProductForm'
import { createProduct } from '../../api'

export default function ProductNew() {
  const navigate = useNavigate()

  async function handleSubmit(data: ProductFormData) {
    try {
      await createProduct({
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
      alert('Không thể tạo sản phẩm')
    }
  }

  return (
    <div>
      <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">Thêm sản phẩm</h1>
      <ProductForm onSubmit={handleSubmit} submitLabel="Tạo sản phẩm" />
    </div>
  )
}
