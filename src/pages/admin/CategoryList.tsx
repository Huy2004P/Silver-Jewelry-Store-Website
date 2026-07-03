import { useEffect, useState } from 'react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category
} from '../../api'

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  function loadCategories() {
    setLoading(true)
    getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false))
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

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || !newSlug.trim()) return
    setAdding(true)
    try {
      await createCategory({ name: newName, slug: newSlug })
      setNewName('')
      setNewSlug('')
      loadCategories()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Không thể thêm danh mục')
    } finally {
      setAdding(false)
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditSlug(cat.slug)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditSlug('')
  }

  async function handleSave(id: number) {
    if (!editName.trim() || !editSlug.trim()) return
    setSaving(true)
    try {
      await updateCategory(id, { name: editName, slug: editSlug })
      setEditingId(null)
      loadCategories()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Không thể cập nhật danh mục')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa danh mục "${name}"?`)) return
    try {
      await deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.error || 'Không thể xóa danh mục')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">Danh mục sản phẩm</h1>
      </div>

      <form onSubmit={handleAdd} className="mt-6 max-w-xl rounded-[18px] border border-hairline bg-canvas p-4 sm:p-6">
        <h3 className="mb-4 font-body text-[17px] font-semibold text-ink">Thêm danh mục mới</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="font-body text-[12px] text-ink-muted-48">Tên danh mục</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value)
                setNewSlug(generateSlug(e.target.value))
              }}
              className="mt-1 w-full rounded-[8px] border border-hairline px-3 py-2 font-body text-[14px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus"
            />
          </div>
          <div>
            <label className="font-body text-[12px] text-ink-muted-48">Slug</label>
            <input
              type="text"
              required
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              className="mt-1 w-full rounded-[8px] border border-hairline px-3 py-2 font-body text-[14px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={adding}
          className="mt-4 w-full rounded-full bg-action-blue px-5 py-2 font-body text-[14px] text-white transition-transform active:scale-95 disabled:opacity-50 sm:w-auto"
        >
          {adding ? 'Đang thêm...' : 'Thêm danh mục'}
        </button>
      </form>

      {loading ? (
        <p className="mt-8 font-body text-[17px] text-ink-muted-48">Đang tải...</p>
      ) : (
        <div className="-mx-4 mt-6 overflow-x-auto border-y border-hairline bg-canvas sm:mx-0 sm:mt-8 sm:rounded-[18px] sm:border">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-hairline text-left">
                <th className="px-6 py-3 font-body text-[12px] font-semibold text-ink-muted-48">ID</th>
                <th className="px-6 py-3 font-body text-[12px] font-semibold text-ink-muted-48">Tên danh mục</th>
                <th className="px-6 py-3 font-body text-[12px] font-semibold text-ink-muted-48">Slug</th>
                <th className="px-6 py-3 font-body text-[12px] font-semibold text-ink-muted-48">Số sản phẩm</th>
                <th className="px-6 py-3 font-body text-[12px] font-semibold text-ink-muted-48">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isEditing = editingId === cat.id
                return (
                  <tr key={cat.id} className="border-b border-hairline last:border-0">
                    <td className="px-6 py-4 font-body text-[14px] text-ink-muted-48">{cat.id}</td>
                    <td className="px-6 py-4 font-body text-[14px] text-ink">
                      {isEditing ? (
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => {
                            setEditName(e.target.value)
                            setEditSlug(generateSlug(e.target.value))
                          }}
                          className="w-full rounded-[6px] border border-hairline px-2 py-1 font-body text-[14px]"
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td className="px-6 py-4 font-body text-[14px] text-ink-muted-48">
                      {isEditing ? (
                        <input
                          type="text"
                          required
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-full rounded-[6px] border border-hairline px-2 py-1 font-body text-[14px]"
                        />
                      ) : (
                        cat.slug
                      )}
                    </td>
                    <td className="px-6 py-4 font-body text-[14px] text-ink">
                      {cat._count?.products ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSave(cat.id)}
                            className="font-body text-[14px] font-semibold text-action-blue"
                          >
                            {saving ? 'Lưu...' : 'Lưu'}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="font-body text-[14px] text-ink-muted-48"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => startEdit(cat)}
                            className="font-body text-[14px] text-action-blue"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="font-body text-[14px] text-red-600"
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
