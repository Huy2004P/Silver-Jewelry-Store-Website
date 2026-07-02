import { useEffect, useState, type ReactNode } from 'react'
import {
  publishLandingConfig,
  getLandingHistory,
  rollbackLandingConfig,
  saveLandingDraft,
  uploadImage,
  type LandingCategoryItem,
  type LandingCommitment,
  type LandingConfig,
  type LandingFooterLink,
} from '../../api'
import { getLandingConfig } from '../../api'

const sectionLabels: Record<keyof NonNullable<LandingConfig['sections']>, string> = {
  hero: 'Hero',
  categories: 'Danh mục nổi bật',
  products: 'Sản phẩm nổi bật',
  commitments: 'Cam kết',
  about: 'Câu chuyện thương hiệu',
  newsletter: 'Newsletter',
  footer: 'Footer landing',
}

const emptyConfig: LandingConfig = {
  version: 2,
  status: 'draft',
  theme: 'luxury-silver',
  enable3DEffects: true,
  enableGlowBubbles: true,
  enableRevealAnimation: true,
  hideAllPrices: false,
  siteMeta: {
    title: 'Tiệm Bạc Ánh Xuân - Bạc Cao Cấp',
    favicon: '/favicon.svg',
  },
  sections: {
    hero: { enabled: true, order: 1 },
    categories: { enabled: true, order: 2 },
    products: { enabled: true, order: 3 },
    commitments: { enabled: true, order: 4 },
    about: { enabled: true, order: 5 },
    newsletter: { enabled: true, order: 6 },
    footer: { enabled: true, order: 7 },
  },
  contactLinks: {
    zalo: '',
    messenger: '',
    hotline: '',
    facebook: '',
    instagram: '',
    tiktok: '',
  },
  hero: {
    badge: '',
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '#collections',
    secondaryButtonText: '',
    secondaryButtonLink: '/products',
    image: '',
    image2: '',
    imageBg: '',
    imageAlt: '',
    image2Alt: '',
    floatingLabel: '',
    floatingText: '',
    topBadge: '',
    highlights: ['', '', ''],
  },
  categories: {
    nhan: '',
    dayChuyen: '',
    bongTai: '',
    lacTay: '',
  },
  categoryItems: [],
  productsSection: {
    eyebrow: '',
    title: '',
    allTabText: '',
    emptyText: '',
    quickViewText: '',
    detailText: '',
    materialText: '',
  },
  commitmentsSection: {
    eyebrow: '',
    title: '',
  },
  commitments: [],
  about: {
    eyebrow: '',
    title: '',
    quote: '',
    content1: '',
    content2: '',
    image: '',
    imageAlt: '',
    imageCaption: '',
  },
  newsletter: {
    enabled: true,
    eyebrow: '',
    title: '',
    desc: '',
    placeholder: '',
    buttonText: '',
    successTitle: '',
    successMessage: '',
  },
  quickView: {
    descriptionTitle: '',
    statusLabel: '',
    availableText: '',
    unavailableText: '',
    materialLabel: '',
    materialText: '',
    detailButtonText: '',
    contactButtonText: '',
  },
  footer: {
    brandName: '',
    desc: '',
    phone: '',
    email: '',
    address: '',
    hours: '',
    discoverTitle: '',
    contactTitle: '',
    hoursTitle: '',
    copyright: '',
    privacyText: '',
    termsText: '',
    links: [],
  },
}

function sortByOrder<T extends { order?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

function normalizeConfig(data: LandingConfig): LandingConfig {
  return {
    ...emptyConfig,
    ...data,
    siteMeta: { ...emptyConfig.siteMeta, ...(data.siteMeta || {}) } as NonNullable<LandingConfig['siteMeta']>,
    sections: { ...emptyConfig.sections, ...(data.sections || {}) } as NonNullable<LandingConfig['sections']>,
    contactLinks: { ...emptyConfig.contactLinks, ...(data.contactLinks || {}) } as NonNullable<LandingConfig['contactLinks']>,
    hero: {
      ...emptyConfig.hero,
      ...data.hero,
      highlights: data.hero.highlights?.length ? data.hero.highlights : emptyConfig.hero.highlights,
    },
    categories: { ...emptyConfig.categories, ...(data.categories || {}) },
    categoryItems: data.categoryItems?.length ? sortByOrder(data.categoryItems) : [
      {
        id: 'nhan',
        title: 'Nhẫn Bạc Nghệ Thuật',
        desc: 'Chế tác đính đá CZ lấp lánh, thanh lịch',
        badge: 'Best Seller',
        slug: 'nhan',
        image: data.categories?.nhan || '',
        alt: 'Nhẫn bạc',
        enabled: true,
        order: 1,
        layout: 'large',
      },
      {
        id: 'day-chuyen',
        title: 'Dây Chuyền',
        desc: 'Mặt đá phong thủy kiêu sa',
        badge: 'Mới Nhất',
        slug: 'day-chuyen',
        image: data.categories?.dayChuyen || '',
        alt: 'Dây chuyền bạc',
        enabled: true,
        order: 2,
        layout: 'tall',
      },
      {
        id: 'bong-tai',
        title: 'Bông Tai',
        desc: 'Nhẹ nhàng và tinh khiết',
        badge: '',
        slug: 'bong-tai',
        image: data.categories?.bongTai || '',
        alt: 'Bông tai bạc',
        enabled: true,
        order: 3,
        layout: 'small',
      },
      {
        id: 'lac-tay',
        title: 'Lắc Tay',
        desc: 'Điểm xuyết nơi cổ tay',
        badge: '',
        slug: 'lac-tay',
        image: data.categories?.lacTay || '',
        alt: 'Lắc tay bạc',
        enabled: true,
        order: 4,
        layout: 'small',
      },
    ],
    productsSection: { ...emptyConfig.productsSection, ...(data.productsSection || {}) } as NonNullable<LandingConfig['productsSection']>,
    commitmentsSection: { ...emptyConfig.commitmentsSection, ...(data.commitmentsSection || {}) } as NonNullable<LandingConfig['commitmentsSection']>,
    commitments: sortByOrder(data.commitments || []),
    about: { ...emptyConfig.about, ...data.about },
    newsletter: { ...emptyConfig.newsletter, ...(data.newsletter || {}) } as NonNullable<LandingConfig['newsletter']>,
    quickView: { ...emptyConfig.quickView, ...(data.quickView || {}) } as NonNullable<LandingConfig['quickView']>,
    footer: { ...emptyConfig.footer, ...data.footer, links: sortByOrder(data.footer.links || []) },
  }
}

export default function LandingConfigPage() {
  const [config, setConfig] = useState<LandingConfig>(emptyConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [history, setHistory] = useState<{ id: string; file: string }[]>([])

  useEffect(() => {
    getLandingConfig()
      .then((data) => setConfig(normalizeConfig(data)))
      .catch(console.error)
      .finally(() => setLoading(false))
    getLandingHistory().then(setHistory).catch(console.error)
  }, [])

  function setTopLevel<K extends keyof LandingConfig>(key: K, value: LandingConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  function updateHero(key: keyof LandingConfig['hero'], value: string | string[]) {
    setConfig((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }))
  }

  function updateSection(key: keyof NonNullable<LandingConfig['sections']>, field: 'enabled' | 'order', value: boolean | number) {
    setConfig((prev) => ({
      ...prev,
      sections: {
        ...(prev.sections || emptyConfig.sections),
        [key]: {
          ...((prev.sections || emptyConfig.sections)?.[key] || { enabled: true, order: 1 }),
          [field]: value,
        },
      } as NonNullable<LandingConfig['sections']>,
    }))
  }

  function updateCategoryItem(index: number, field: keyof LandingCategoryItem, value: string | boolean | number) {
    setConfig((prev) => {
      const items = [...(prev.categoryItems || [])]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, categoryItems: items }
    })
  }

  function addCategoryItem() {
    setConfig((prev) => ({
      ...prev,
      categoryItems: [
        ...(prev.categoryItems || []),
        {
          id: `custom-${Date.now()}`,
          title: '',
          desc: '',
          badge: '',
          slug: '',
          image: '',
          alt: '',
          enabled: true,
          order: (prev.categoryItems?.length || 0) + 1,
          layout: 'small',
        },
      ],
    }))
  }

  function removeCategoryItem(index: number) {
    setConfig((prev) => ({
      ...prev,
      categoryItems: (prev.categoryItems || []).filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function updateCommitment(index: number, field: keyof LandingCommitment, value: string | boolean | number) {
    setConfig((prev) => {
      const items = [...prev.commitments]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, commitments: items }
    })
  }

  function addCommitment() {
    setConfig((prev) => ({
      ...prev,
      commitments: [
        ...prev.commitments,
        { icon: '', title: '', desc: '', enabled: true, order: prev.commitments.length + 1 },
      ],
    }))
  }

  function removeCommitment(index: number) {
    setConfig((prev) => ({
      ...prev,
      commitments: prev.commitments.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function updateFooterLink(index: number, field: keyof LandingFooterLink, value: string | boolean | number) {
    setConfig((prev) => {
      const links = [...(prev.footer.links || [])]
      links[index] = { ...links[index], [field]: value }
      return { ...prev, footer: { ...prev.footer, links } }
    })
  }

  function addFooterLink() {
    setConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        links: [
          ...(prev.footer.links || []),
          { label: '', url: '', enabled: true, order: (prev.footer.links?.length || 0) + 1 },
        ],
      },
    }))
  }

  function removeFooterLink(index: number) {
    setConfig((prev) => ({
      ...prev,
      footer: { ...prev.footer, links: (prev.footer.links || []).filter((_, itemIndex) => itemIndex !== index) },
    }))
  }

  async function uploadToField(file: File, key: string, applyUrl: (url: string) => void) {
    setUploadingKey(key)
    try {
      applyUrl(await uploadImage(file))
    } catch {
      alert('Upload ảnh thất bại')
    } finally {
      setUploadingKey(null)
    }
  }

  async function handleSave(mode: 'draft' | 'publish') {
    setSaving(mode)
    try {
      const next = mode === 'draft' ? await saveLandingDraft(config) : await publishLandingConfig(config)
      setConfig(normalizeConfig(next))
      getLandingHistory().then(setHistory).catch(console.error)
      alert(mode === 'draft' ? 'Đã lưu nháp cấu hình landing.' : 'Đã xuất bản landing page.')
    } catch {
      alert('Không thể lưu cấu hình landing')
    } finally {
      setSaving(null)
    }
  }

  async function handleRollback(id: string) {
    if (!confirm('Khôi phục bản xuất bản này? Cấu hình hiện tại sẽ được thay bằng snapshot đã chọn.')) return
    setSaving('publish')
    try {
      const next = await rollbackLandingConfig(id)
      setConfig(normalizeConfig(next))
      alert('Đã rollback landing page.')
    } catch {
      alert('Không thể rollback landing page')
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return <p className="font-body text-[17px] text-ink-muted-48">Đang tải cấu hình...</p>
  }

  return (
    <div className="max-w-6xl space-y-8 pb-12">
      <div className="sticky top-0 z-10 -mx-2 flex flex-wrap items-center justify-between gap-4 bg-pearl/95 px-2 py-4 backdrop-blur">
        <div>
          <h1 className="font-display text-[32px] font-semibold text-ink">Quản trị Landing Page</h1>
          <p className="font-body text-[13px] text-ink-muted-48">
            Trạng thái: {config.status || 'published'} {config.updatedAt ? `- cập nhật ${new Date(config.updatedAt).toLocaleString('vi-VN')}` : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saving !== null}
            className="rounded-full border border-hairline px-5 py-2.5 font-body text-[14px] font-semibold text-ink disabled:opacity-50"
          >
            {saving === 'draft' ? 'Đang lưu...' : 'Lưu nháp'}
          </button>
          <button
            type="button"
            onClick={() => handleSave('publish')}
            disabled={saving !== null}
            className="rounded-full bg-action-blue px-5 py-2.5 font-body text-[14px] font-semibold text-white disabled:opacity-50"
          >
            {saving === 'publish' ? 'Đang xuất bản...' : 'Xuất bản'}
          </button>
        </div>
      </div>

      <AdminPanel title="Tổng quan giao diện">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SelectField
            label="Theme"
            value={config.theme || 'luxury-silver'}
            onChange={(value) => setTopLevel('theme', value)}
            options={[
              ['luxury-silver', 'Luxury Silver'],
              ['warm-rose-gold', 'Warm Rose Gold'],
              ['royal-emerald', 'Royal Emerald'],
            ]}
          />
          <ToggleField label="Ẩn toàn bộ giá" checked={config.hideAllPrices ?? false} onChange={(value) => setTopLevel('hideAllPrices', value)} />
          <ToggleField label="Hiệu ứng 3D" checked={config.enable3DEffects ?? true} onChange={(value) => setTopLevel('enable3DEffects', value)} />
          <ToggleField label="Glow bubbles" checked={config.enableGlowBubbles ?? true} onChange={(value) => setTopLevel('enableGlowBubbles', value)} />
          <ToggleField label="Reveal animation" checked={config.enableRevealAnimation ?? true} onChange={(value) => setTopLevel('enableRevealAnimation', value)} />
        </div>
      </AdminPanel>

      <AdminPanel title="Thông tin trình duyệt">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            label="Tiêu đề tab"
            value={config.siteMeta?.title || ''}
            onChange={(value) => setConfig((prev) => ({
              ...prev,
              siteMeta: { ...(prev.siteMeta || emptyConfig.siteMeta!), title: value },
            }))}
          />
          <ImageField
            label="Icon tab / favicon"
            value={config.siteMeta?.favicon || ''}
            uploading={uploadingKey === 'site-favicon'}
            onChange={(value) => setConfig((prev) => ({
              ...prev,
              siteMeta: { ...(prev.siteMeta || emptyConfig.siteMeta!), favicon: value },
            }))}
            onUpload={(file) => uploadToField(file, 'site-favicon', (url) => setConfig((prev) => ({
              ...prev,
              siteMeta: { ...(prev.siteMeta || emptyConfig.siteMeta!), favicon: url },
            })))}
          />
        </div>
      </AdminPanel>

      <AdminPanel title="Lịch sử xuất bản">
        {history.length === 0 ? (
          <p className="font-body text-[14px] text-ink-muted-48">Chưa có snapshot xuất bản.</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-[8px] border border-hairline bg-white p-3">
                <span className="font-body text-[13px] text-ink">{item.id}</span>
                <button
                  type="button"
                  onClick={() => handleRollback(item.id)}
                  disabled={saving !== null}
                  className="rounded-full border border-hairline px-3 py-1.5 font-body text-[12px] font-semibold text-ink disabled:opacity-50"
                >
                  Rollback
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>

      <AdminPanel title="Bật/tắt và sắp xếp section">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {Object.entries(sectionLabels).map(([key, label]) => {
            const sectionKey = key as keyof NonNullable<LandingConfig['sections']>
            const section = config.sections?.[sectionKey] || { enabled: true, order: 1 }
            return (
              <div key={key} className="grid grid-cols-[1fr_120px_80px] items-center gap-3 rounded-[8px] border border-hairline bg-white p-3">
                <ToggleField label={label} checked={section.enabled} onChange={(value) => updateSection(sectionKey, 'enabled', value)} />
                <NumberField label="Thứ tự" value={section.order} onChange={(value) => updateSection(sectionKey, 'order', value)} />
              </div>
            )
          })}
        </div>
      </AdminPanel>

      <AdminPanel title="Hero">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField label="Badge" value={config.hero.badge || ''} onChange={(value) => updateHero('badge', value)} />
          <TextField label="Tiêu đề chính" value={config.hero.title} onChange={(value) => updateHero('title', value)} />
          <TextAreaField label="Mô tả" value={config.hero.subtitle} onChange={(value) => updateHero('subtitle', value)} />
          <TextField label="Nút chính" value={config.hero.buttonText} onChange={(value) => updateHero('buttonText', value)} />
          <TextField label="Link nút chính" value={config.hero.buttonLink || ''} onChange={(value) => updateHero('buttonLink', value)} />
          <TextField label="Nút phụ" value={config.hero.secondaryButtonText || ''} onChange={(value) => updateHero('secondaryButtonText', value)} />
          <TextField label="Link nút phụ" value={config.hero.secondaryButtonLink || ''} onChange={(value) => updateHero('secondaryButtonLink', value)} />
          <TextField label="Nhãn ảnh nổi" value={config.hero.floatingLabel || ''} onChange={(value) => updateHero('floatingLabel', value)} />
          <TextField label="Text ảnh nổi" value={config.hero.floatingText || ''} onChange={(value) => updateHero('floatingText', value)} />
          <TextField label="Badge góc phải" value={config.hero.topBadge || ''} onChange={(value) => updateHero('topBadge', value)} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <ImageField label="Ảnh nền lớn" value={config.hero.imageBg || ''} uploading={uploadingKey === 'hero-bg'} onUpload={(file) => uploadToField(file, 'hero-bg', (url) => updateHero('imageBg', url))} onChange={(value) => updateHero('imageBg', value)} />
          <ImageField label="Ảnh chính" value={config.hero.image || ''} uploading={uploadingKey === 'hero-main'} onUpload={(file) => uploadToField(file, 'hero-main', (url) => updateHero('image', url))} onChange={(value) => updateHero('image', value)} />
          <ImageField label="Ảnh nổi" value={config.hero.image2 || ''} uploading={uploadingKey === 'hero-float'} onUpload={(file) => uploadToField(file, 'hero-float', (url) => updateHero('image2', url))} onChange={(value) => updateHero('image2', value)} />
        </div>
        <div className="mt-4 space-y-3">
          <h3 className="font-body text-[14px] font-bold text-ink">Điểm nhấn hero</h3>
          {(config.hero.highlights || []).map((highlight, index) => (
            <TextField
              key={index}
              label={`Điểm nhấn ${index + 1}`}
              value={highlight}
              onChange={(value) => {
                const highlights = [...(config.hero.highlights || [])]
                highlights[index] = value
                updateHero('highlights', highlights)
              }}
            />
          ))}
        </div>
      </AdminPanel>

      <AdminPanel title="Danh mục nổi bật">
        <div className="space-y-4">
          {(config.categoryItems || []).map((item, index) => (
            <div key={item.id} className="rounded-[12px] border border-hairline bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <ToggleField label={`Hiển thị mục ${index + 1}`} checked={item.enabled} onChange={(value) => updateCategoryItem(index, 'enabled', value)} />
                <button type="button" onClick={() => removeCategoryItem(index)} className="rounded-full border border-red-200 px-3 py-1 text-[12px] text-red-600">Xóa</button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <TextField label="Tên" value={item.title} onChange={(value) => updateCategoryItem(index, 'title', value)} />
                <TextField label="Slug danh mục" value={item.slug} onChange={(value) => updateCategoryItem(index, 'slug', value)} />
                <TextField label="Badge" value={item.badge || ''} onChange={(value) => updateCategoryItem(index, 'badge', value)} />
                <NumberField label="Thứ tự" value={item.order} onChange={(value) => updateCategoryItem(index, 'order', value)} />
                <TextAreaField label="Mô tả" value={item.desc} onChange={(value) => updateCategoryItem(index, 'desc', value)} />
                <ImageField label="Ảnh" value={item.image} uploading={uploadingKey === `cat-${index}`} onChange={(value) => updateCategoryItem(index, 'image', value)} onUpload={(file) => uploadToField(file, `cat-${index}`, (url) => updateCategoryItem(index, 'image', url))} />
              </div>
            </div>
          ))}
          <button type="button" onClick={addCategoryItem} className="rounded-full border border-hairline px-4 py-2 font-body text-[13px] font-semibold">Thêm danh mục nổi bật</button>
        </div>
      </AdminPanel>

      <AdminPanel title="Sản phẩm nổi bật và quick view">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextField label="Eyebrow" value={config.productsSection?.eyebrow || ''} onChange={(value) => setConfig((prev) => ({ ...prev, productsSection: { ...prev.productsSection!, eyebrow: value } }))} />
          <TextField label="Tiêu đề" value={config.productsSection?.title || ''} onChange={(value) => setConfig((prev) => ({ ...prev, productsSection: { ...prev.productsSection!, title: value } }))} />
          <TextField label="Tab tất cả" value={config.productsSection?.allTabText || ''} onChange={(value) => setConfig((prev) => ({ ...prev, productsSection: { ...prev.productsSection!, allTabText: value } }))} />
          <TextField label="Text rỗng" value={config.productsSection?.emptyText || ''} onChange={(value) => setConfig((prev) => ({ ...prev, productsSection: { ...prev.productsSection!, emptyText: value } }))} />
          <TextField label="Nút xem nhanh" value={config.productsSection?.quickViewText || ''} onChange={(value) => setConfig((prev) => ({ ...prev, productsSection: { ...prev.productsSection!, quickViewText: value } }))} />
          <TextField label="Nút chi tiết" value={config.productsSection?.detailText || ''} onChange={(value) => setConfig((prev) => ({ ...prev, productsSection: { ...prev.productsSection!, detailText: value } }))} />
          <TextField label="Chất liệu trên card" value={config.productsSection?.materialText || ''} onChange={(value) => setConfig((prev) => ({ ...prev, productsSection: { ...prev.productsSection!, materialText: value } }))} />
          <TextField label="Tiêu đề mô tả quick view" value={config.quickView?.descriptionTitle || ''} onChange={(value) => setConfig((prev) => ({ ...prev, quickView: { ...prev.quickView!, descriptionTitle: value } }))} />
          <TextField label="Nút liên hệ mua" value={config.quickView?.contactButtonText || ''} onChange={(value) => setConfig((prev) => ({ ...prev, quickView: { ...prev.quickView!, contactButtonText: value } }))} />
        </div>
      </AdminPanel>

      <AdminPanel title="Cam kết thương hiệu">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField label="Eyebrow" value={config.commitmentsSection?.eyebrow || ''} onChange={(value) => setConfig((prev) => ({ ...prev, commitmentsSection: { ...prev.commitmentsSection!, eyebrow: value } }))} />
          <TextField label="Tiêu đề" value={config.commitmentsSection?.title || ''} onChange={(value) => setConfig((prev) => ({ ...prev, commitmentsSection: { ...prev.commitmentsSection!, title: value } }))} />
        </div>
        <div className="mt-4 space-y-4">
          {config.commitments.map((item, index) => (
            <div key={index} className="rounded-[12px] border border-hairline bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <ToggleField label={`Hiển thị cam kết ${index + 1}`} checked={item.enabled ?? true} onChange={(value) => updateCommitment(index, 'enabled', value)} />
                <button type="button" onClick={() => removeCommitment(index)} className="rounded-full border border-red-200 px-3 py-1 text-[12px] text-red-600">Xóa</button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <TextField label="Icon" value={item.icon} onChange={(value) => updateCommitment(index, 'icon', value)} />
                <TextField label="Tiêu đề" value={item.title} onChange={(value) => updateCommitment(index, 'title', value)} />
                <NumberField label="Thứ tự" value={item.order || index + 1} onChange={(value) => updateCommitment(index, 'order', value)} />
                <TextAreaField label="Mô tả" value={item.desc} onChange={(value) => updateCommitment(index, 'desc', value)} />
              </div>
            </div>
          ))}
          <button type="button" onClick={addCommitment} className="rounded-full border border-hairline px-4 py-2 font-body text-[13px] font-semibold">Thêm cam kết</button>
        </div>
      </AdminPanel>

      <AdminPanel title="Câu chuyện thương hiệu">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField label="Eyebrow" value={config.about.eyebrow || ''} onChange={(value) => setConfig((prev) => ({ ...prev, about: { ...prev.about, eyebrow: value } }))} />
          <TextField label="Tiêu đề" value={config.about.title} onChange={(value) => setConfig((prev) => ({ ...prev, about: { ...prev.about, title: value } }))} />
          <TextAreaField label="Quote" value={config.about.quote || ''} onChange={(value) => setConfig((prev) => ({ ...prev, about: { ...prev.about, quote: value } }))} />
          <TextAreaField label="Nội dung 1" value={config.about.content1} onChange={(value) => setConfig((prev) => ({ ...prev, about: { ...prev.about, content1: value } }))} />
          <TextAreaField label="Nội dung 2" value={config.about.content2} onChange={(value) => setConfig((prev) => ({ ...prev, about: { ...prev.about, content2: value } }))} />
          <TextField label="Caption ảnh" value={config.about.imageCaption || ''} onChange={(value) => setConfig((prev) => ({ ...prev, about: { ...prev.about, imageCaption: value } }))} />
          <ImageField label="Ảnh câu chuyện" value={config.about.image || ''} uploading={uploadingKey === 'about'} onChange={(value) => setConfig((prev) => ({ ...prev, about: { ...prev.about, image: value } }))} onUpload={(file) => uploadToField(file, 'about', (url) => setConfig((prev) => ({ ...prev, about: { ...prev.about, image: url } })))} />
        </div>
      </AdminPanel>

      <AdminPanel title="Newsletter">
        <div className="mb-4">
          <ToggleField label="Hiển thị newsletter" checked={config.newsletter?.enabled ?? true} onChange={(value) => setConfig((prev) => ({ ...prev, newsletter: { ...prev.newsletter!, enabled: value } }))} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {(['eyebrow', 'title', 'desc', 'placeholder', 'buttonText', 'successTitle', 'successMessage'] as const).map((key) => (
            <TextField key={key} label={key} value={config.newsletter?.[key] || ''} onChange={(value) => setConfig((prev) => ({ ...prev, newsletter: { ...prev.newsletter!, [key]: value } }))} />
          ))}
        </div>
      </AdminPanel>

      <AdminPanel title="Footer và liên hệ">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(['brandName', 'desc', 'phone', 'email', 'address', 'hours', 'discoverTitle', 'contactTitle', 'hoursTitle', 'copyright', 'privacyText', 'termsText'] as const).map((key) => (
            key === 'desc' || key === 'hours' ? (
              <TextAreaField key={key} label={key} value={config.footer[key] || ''} onChange={(value) => setConfig((prev) => ({ ...prev, footer: { ...prev.footer, [key]: value } }))} />
            ) : (
              <TextField key={key} label={key} value={config.footer[key] || ''} onChange={(value) => setConfig((prev) => ({ ...prev, footer: { ...prev.footer, [key]: value } }))} />
            )
          ))}
          {(['zalo', 'messenger', 'hotline', 'facebook', 'instagram', 'tiktok'] as const).map((key) => (
            <TextField key={key} label={`Link ${key}`} value={config.contactLinks?.[key] || ''} onChange={(value) => setConfig((prev) => ({ ...prev, contactLinks: { ...prev.contactLinks!, [key]: value } }))} />
          ))}
        </div>
        <div className="mt-5 space-y-3">
          <h3 className="font-body text-[14px] font-bold text-ink">Link nhanh footer</h3>
          {(config.footer.links || []).map((link, index) => (
            <div key={index} className="grid grid-cols-1 items-end gap-3 rounded-[8px] border border-hairline bg-white p-3 md:grid-cols-[1fr_1fr_100px_120px_60px]">
              <TextField label="Label" value={link.label} onChange={(value) => updateFooterLink(index, 'label', value)} />
              <TextField label="URL" value={link.url} onChange={(value) => updateFooterLink(index, 'url', value)} />
              <NumberField label="Thứ tự" value={link.order} onChange={(value) => updateFooterLink(index, 'order', value)} />
              <ToggleField label="Hiển thị" checked={link.enabled} onChange={(value) => updateFooterLink(index, 'enabled', value)} />
              <button type="button" onClick={() => removeFooterLink(index)} className="rounded-full border border-red-200 px-3 py-2 text-[12px] text-red-600">Xóa</button>
            </div>
          ))}
          <button type="button" onClick={addFooterLink} className="rounded-full border border-hairline px-4 py-2 font-body text-[13px] font-semibold">Thêm link footer</button>
        </div>
      </AdminPanel>
    </div>
  )
}

function AdminPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[18px] border border-hairline bg-canvas p-6">
      <h2 className="mb-5 border-b border-hairline pb-2 font-display text-[22px] font-semibold text-ink">{title}</h2>
      {children}
    </section>
  )
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block font-body text-[13px] text-ink-muted-48">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-[8px] border border-hairline px-3 py-2 font-body text-[14px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus"
      />
    </label>
  )
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block font-body text-[13px] text-ink-muted-48">
      {label}
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1.5 w-full rounded-[8px] border border-hairline px-3 py-2 font-body text-[14px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus"
      />
    </label>
  )
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block font-body text-[13px] text-ink-muted-48">
      {label}
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-[8px] border border-hairline px-3 py-2 font-body text-[14px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus"
      />
    </label>
  )
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 font-body text-[14px] text-ink">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: [string, string][]
  onChange: (value: string) => void
}) {
  return (
    <label className="block font-body text-[13px] text-ink-muted-48">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-[8px] border border-hairline px-3 py-2 font-body text-[14px] text-ink outline-none"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </label>
  )
}

function ImageField({
  label,
  value,
  uploading,
  onChange,
  onUpload,
}: {
  label: string
  value: string
  uploading: boolean
  onChange: (value: string) => void
  onUpload: (file: File) => void
}) {
  return (
    <div className="space-y-2">
      <TextField label={label} value={value} onChange={onChange} />
      {value && (
        <div className="aspect-video overflow-hidden rounded-[8px] border border-hairline bg-white">
          <img src={value} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onUpload(file)
          event.target.value = ''
        }}
        className="font-body text-[12px]"
      />
      {uploading && <p className="font-body text-[12px] text-ink-muted-48">Đang upload...</p>}
    </div>
  )
}
