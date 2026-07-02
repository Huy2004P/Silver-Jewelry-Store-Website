import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteProduct, formatPrice, getProducts, type Product } from '../../api'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  function loadProducts() {
    setLoading(true)
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Không thể xóa sản phẩm')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[32px] font-semibold text-ink">Sản phẩm</h1>
        <Link
          to="/admin/products/new"
          className="rounded-full bg-action-blue px-5 py-2 font-body text-[14px] text-white no-underline transition-transform active:scale-95"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 font-body text-[17px] text-ink-muted-48">Đang tải...</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-[18px] border border-hairline bg-canvas">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-hairline text-left">
                <th className="px-4 py-3 font-body text-[12px] font-semibold text-ink-muted-48">Ảnh</th>
                <th className="px-4 py-3 font-body text-[12px] font-semibold text-ink-muted-48">Tên</th>
                <th className="px-4 py-3 font-body text-[12px] font-semibold text-ink-muted-48">Danh mục</th>
                <th className="px-4 py-3 font-body text-[12px] font-semibold text-ink-muted-48">Giá</th>
                <th className="px-4 py-3 font-body text-[12px] font-semibold text-ink-muted-48">Nổi bật</th>
                <th className="px-4 py-3 font-body text-[12px] font-semibold text-ink-muted-48">Còn hàng</th>
                <th className="px-4 py-3 font-body text-[12px] font-semibold text-ink-muted-48">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-hairline last:border-0">
                  <td className="px-4 py-3">
                    <img
                      src={product.images[0] ?? ''}
                      alt={product.name}
                      className="h-12 w-12 rounded-[8px] object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-body text-[14px] text-ink">{product.name}</td>
                  <td className="px-4 py-3 font-body text-[14px] text-ink-muted-48">
                    {product.category.name}
                  </td>
                  <td className="px-4 py-3 font-body text-[14px] text-ink">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 font-body text-[14px] text-ink-muted-48">
                    {product.isFeatured ? '✓' : '—'}
                  </td>
                  <td className="px-4 py-3 font-body text-[14px] text-ink-muted-48">
                    {product.isAvailable ? '✓' : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="font-body text-[14px] text-action-blue no-underline"
                      >
                        Sửa
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        className="font-body text-[14px] text-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
