import { useEffect, useState } from 'react'
import { getCategories, uploadImage, type Category } from '../../api'

export interface ProductFormData {
  name: string
  slug: string
  description: string
  price: string
  categoryId: string
  images: string[]
  isFeatured: boolean
  isAvailable: boolean
  showPrice: boolean
}

interface ProductFormProps {
  initial?: ProductFormData
  onSubmit: (data: ProductFormData) => Promise<void>
  submitLabel: string
}

const emptyForm: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: '',
  categoryId: '',
  images: [],
  isFeatured: false,
  isAvailable: true,
  showPrice: true,
}

export default function ProductForm({ initial, onSubmit, submitLabel }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initial ?? emptyForm)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    if (initial) setForm(initial)
  }, [initial])

  function updateField<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      updateField('images', [...form.images, url])
    } catch {
      alert('Upload ảnh thất bại')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function removeImage(index: number) {
    updateField('images', form.images.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-5">
      <div>
        <label htmlFor="name" className="font-body text-[14px] text-ink-muted-48">Tên sản phẩm</label>
        <input
          id="name"
          value={form.name}
          onChange={(e) => {
            updateField('name', e.target.value)
            if (!initial) updateField('slug', generateSlug(e.target.value))
          }}
          required
          className="mt-1 w-full rounded-[8px] border border-hairline px-4 py-2 font-body text-[17px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus"
        />
      </div>

      <div>
        <label htmlFor="slug" className="font-body text-[14px] text-ink-muted-48">Slug</label>
        <input
          id="slug"
          value={form.slug}
          onChange={(e) => updateField('slug', e.target.value)}
          required
          className="mt-1 w-full rounded-[8px] border border-hairline px-4 py-2 font-body text-[17px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus"
        />
      </div>

      <div>
        <label htmlFor="description" className="font-body text-[14px] text-ink-muted-48">Mô tả</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          required
          rows={4}
          className="mt-1 w-full rounded-[8px] border border-hairline px-4 py-2 font-body text-[17px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus"
        />
      </div>

      <div>
        <label htmlFor="price" className="font-body text-[14px] text-ink-muted-48">Giá (VND)</label>
        <input
          id="price"
          type="number"
          min="0"
          value={form.price}
          onChange={(e) => updateField('price', e.target.value)}
          required
          className="mt-1 w-full rounded-[8px] border border-hairline px-4 py-2 font-body text-[17px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus"
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="font-body text-[14px] text-ink-muted-48">Danh mục</label>
        <select
          id="categoryId"
          value={form.categoryId}
          onChange={(e) => updateField('categoryId', e.target.value)}
          required
          className="mt-1 w-full rounded-[8px] border border-hairline px-4 py-2 font-body text-[17px] text-ink outline-none"
        >
          <option value="">Chọn danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="font-body text-[14px] text-ink-muted-48">Ảnh sản phẩm</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {form.images.map((img, i) => (
            <div key={img} className="relative">
              <img src={img} alt="" className="h-20 w-20 rounded-[8px] object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="mt-3 font-body text-[14px]"
        />
        {uploading && <p className="mt-1 font-body text-[12px] text-ink-muted-48">Đang upload...</p>}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 font-body text-[14px] text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => updateField('isFeatured', e.target.checked)}
          />
          Sản phẩm nổi bật
        </label>
        <label className="flex items-center gap-2 font-body text-[14px] text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => updateField('isAvailable', e.target.checked)}
          />
          Còn hàng
        </label>
        <label className="flex items-center gap-2 font-body text-[14px] text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={form.showPrice}
            onChange={(e) => updateField('showPrice', e.target.checked)}
          />
          Hiển thị giá sản phẩm
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-action-blue px-6 py-3 font-body text-[17px] text-white transition-transform active:scale-95 disabled:opacity-50"
      >
        {loading ? 'Đang lưu...' : submitLabel}
      </button>
    </form>
  )
}
