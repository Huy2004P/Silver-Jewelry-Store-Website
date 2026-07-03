import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  formatPrice,
  getCategories,
  getLandingConfig,
  getProducts,
  type Category,
  type LandingCategoryItem,
  type LandingConfig,
  type Product,
} from '../api'

type SectionKey = keyof NonNullable<LandingConfig['sections']>

const defaultSections: Record<SectionKey, { enabled: boolean; order: number }> = {
  hero: { enabled: true, order: 1 },
  categories: { enabled: true, order: 2 },
  products: { enabled: true, order: 3 },
  commitments: { enabled: true, order: 4 },
  about: { enabled: true, order: 5 },
  newsletter: { enabled: true, order: 6 },
  footer: { enabled: true, order: 7 },
}

const fallbackCategories: Category[] = [
  { id: 1, name: 'Nhẫn', slug: 'nhan' },
  { id: 2, name: 'Dây Chuyền', slug: 'day-chuyen' },
  { id: 3, name: 'Bông Tai', slug: 'bong-tai' },
  { id: 4, name: 'Lắc Tay', slug: 'lac-tay' },
]

const fallbackProducts: Product[] = [
  {
    id: 1,
    name: 'Nhẫn Bạc Cao Cấp Đám Cưới',
    slug: 'nhan-bac-s925-dam-cuoi',
    description: 'Nhẫn cưới bạc cao cấp với thiết kế thanh lịch, phù hợp cho những khoảnh khắc đặc biệt.',
    price: 1890000,
    images: ['/cat-nhan.png'],
    categoryId: 1,
    category: fallbackCategories[0],
    isFeatured: true,
    isAvailable: true,
    showPrice: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Dây Chuyền Mặt Trăng',
    slug: 'day-chuyen-mat-trang',
    description: 'Dây chuyền bạc tinh tế với vẻ đẹp sang trọng và nhẹ nhàng.',
    price: 2450000,
    images: ['/cat-day-chuyen.png'],
    categoryId: 2,
    category: fallbackCategories[1],
    isFeatured: true,
    isAvailable: true,
    showPrice: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Bông Tai Hoa Sen',
    slug: 'bong-tai-hoa-sen',
    description: 'Bông tai bạc mang phong cách thanh khiết, phù hợp nhiều dịp.',
    price: 1250000,
    images: ['/cat-bong-tai.png'],
    categoryId: 3,
    category: fallbackCategories[2],
    isFeatured: true,
    isAvailable: true,
    showPrice: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Lắc Tay Bạc Đan',
    slug: 'lac-tay-bac-dan',
    description: 'Lắc tay bạc thủ công độc đáo, tạo điểm nhấn cho phong cách của bạn.',
    price: 1350000,
    images: ['/cat-lac-tay.png'],
    categoryId: 4,
    category: fallbackCategories[3],
    isFeatured: true,
    isAvailable: true,
    showPrice: true,
    createdAt: new Date().toISOString(),
  },
]

function getFallbackProducts(selectedCat: string): Product[] {
  if (selectedCat === 'all') return fallbackProducts
  return fallbackProducts.filter((product) => product.category.slug === selectedCat)
}

export default function Home() {
  const [landingData, setLandingData] = useState<LandingConfig | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0, rootMargin: '100px' }
    )

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  useEffect(() => {
    getLandingConfig().then(setLandingData).catch(console.error)
    getCategories()
      .then((data) => setCategories(data.length ? data : fallbackCategories))
      .catch(() => setCategories(fallbackCategories))
  }, [])

  useEffect(() => {
    const query = selectedCat === 'all' ? { featured: true } : { category: selectedCat }
    let active = true

    getProducts(query)
      .then((data) => {
        if (!active) return

        const normalized = Array.isArray(data) ? data.filter(Boolean) : []
        if (normalized.length === 0) {
          setProducts(getFallbackProducts(selectedCat))
          return
        }

        setProducts(
          normalized.map((product) => ({
            ...product,
            category: product.category ?? fallbackCategories[0],
            images: Array.isArray(product.images) ? product.images : [],
          }))
        )
      })
      .catch(() => {
        if (!active) return
        setProducts(getFallbackProducts(selectedCat))
      })

    return () => {
      active = false
    }
  }, [selectedCat])

  useEffect(() => {
    document.body.className = landingData?.theme ? `theme-${landingData.theme}` : ''
    return () => {
      document.body.className = ''
    }
  }, [landingData?.theme])

  useEffect(() => {
    if (!landingData?.enable3DEffects) return
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return

    const elements = document.querySelectorAll<HTMLElement>('.tilt-card')
    const cleanups: (() => void)[] = []

    elements.forEach((el) => {
      let frame = 0

      const handleMouseMove = (event: MouseEvent) => {
        if (frame) cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          const px = x / rect.width
          const py = y / rect.height
          const tiltX = (py - 0.5) * -12
          const tiltY = (px - 0.5) * 12

          el.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
          el.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
          el.style.setProperty('--glare-x', `${(px * 100).toFixed(2)}%`)
          el.style.setProperty('--glare-y', `${(py * 100).toFixed(2)}%`)
          el.classList.add('is-tilting')
        })
      }

      const handleMouseLeave = () => {
        if (frame) cancelAnimationFrame(frame)
        frame = 0
        el.classList.remove('is-tilting')
        el.style.setProperty('--tilt-x', '0deg')
        el.style.setProperty('--tilt-y', '0deg')
        el.style.setProperty('--glare-x', '50%')
        el.style.setProperty('--glare-y', '50%')
      }

      el.addEventListener('mousemove', handleMouseMove)
      el.addEventListener('mouseleave', handleMouseLeave)

      cleanups.push(() => {
        if (frame) cancelAnimationFrame(frame)
        el.removeEventListener('mousemove', handleMouseMove)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [landingData, products])

  const sectionOrder = useMemo(() => {
    const sections = landingData?.sections || defaultSections
    return (Object.keys(defaultSections) as SectionKey[])
      .filter((key) => sections[key]?.enabled ?? true)
      .sort((a, b) => (sections[a]?.order ?? defaultSections[a].order) - (sections[b]?.order ?? defaultSections[b].order))
  }, [landingData?.sections])

  if (!landingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f4f7]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-action-blue border-t-transparent" />
      </div>
    )
  }

  const isPriceHidden = (product: Product) => landingData.hideAllPrices || !product.showPrice

  const categoryItems = getCategoryItems(landingData)
  const commitments = [...landingData.commitments]
    .filter((item) => item.enabled ?? true)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const footerLinks = [...(landingData.footer.links || [])]
    .filter((link) => link.enabled)
    .sort((a, b) => a.order - b.order)

  function handleNewsletterSubmit(event: FormEvent) {
    event.preventDefault()
    if (!newsletterEmail.trim()) return
    setSubscribed(true)
    setNewsletterEmail('')
  }

  const sectionMap: Record<SectionKey, ReactNode> = {
    hero: (
      <HeroSection landingData={landingData} />
    ),
    categories: (
      <CategorySection items={categoryItems} />
    ),
    products: (
      <ProductsSection
        categories={categories}
        products={products}
        selectedCat={selectedCat}
        onSelectCat={setSelectedCat}
        isPriceHidden={isPriceHidden}
        landingData={landingData}
        onQuickView={(product) => {
          setQuickViewProduct(product)
          setActiveImageIdx(0)
        }}
      />
    ),
    commitments: (
      <CommitmentsSection landingData={landingData} commitments={commitments} />
    ),
    about: (
      <AboutSection landingData={landingData} />
    ),
    newsletter: landingData.newsletter?.enabled !== false ? (
      <NewsletterSection
        landingData={landingData}
        email={newsletterEmail}
        subscribed={subscribed}
        onEmailChange={setNewsletterEmail}
        onSubmit={handleNewsletterSubmit}
      />
    ) : null,
    footer: (
      <LandingFooter landingData={landingData} links={footerLinks} />
    ),
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-[#faf9f6] via-[#fbfcff] to-[#f7f8fa]">
      {landingData.enableGlowBubbles && (
        <>
          <div className="absolute right-[-10%] top-[5%] z-0 hidden h-[600px] w-[600px] rounded-full bg-blue-200/50 blur-[130px] animate-pulse sm:block" />
          <div className="absolute left-[-15%] top-[32%] z-0 hidden h-[700px] w-[700px] rounded-full bg-rose-200/50 blur-[140px] animate-pulse sm:block" style={{animationDelay: '1s'}} />
          <div className="absolute bottom-[6%] right-[-10%] z-0 hidden h-[600px] w-[600px] rounded-full bg-teal-100/50 blur-[120px] animate-pulse sm:block" style={{animationDelay: '2s'}} />
        </>
      )}

      {sectionOrder.map((key) => (
        <div key={key}>{sectionMap[key]}</div>
      ))}

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          landingData={landingData}
          activeImageIdx={activeImageIdx}
          setActiveImageIdx={setActiveImageIdx}
          isPriceHidden={isPriceHidden}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}

function HeroSection({ landingData }: { landingData: LandingConfig }) {
  const heroBg = landingData.hero.imageBg || landingData.hero.image || '/hero.png'
  const heroMain = landingData.hero.image || landingData.hero.imageBg || '/cat-day-chuyen.png'
  const heroFloat = landingData.hero.image2 || landingData.hero.image || '/cat-nhan.png'

  return (
    <section className="relative z-10 flex min-h-[100svh] items-center overflow-hidden px-4 py-24 text-ink sm:px-6 md:px-12">
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.src = '/hero.png' }} />
        <div className="absolute inset-0 bg-white/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#faf9f6]/40 to-[#faf9f6]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="space-y-6 text-center md:col-span-7 md:space-y-8 md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-gradient-to-r from-white/70 to-white/40 px-4 py-1.5 font-body text-[12px] font-bold uppercase tracking-[2px] text-action-blue shadow-lg shadow-white/20 backdrop-blur-xl hover:shadow-xl hover:from-white/80 transition-all">
            ✨ {landingData.hero.badge || 'Bạc Cao Cấp Chế Tác Thủ Công'}
          </span>
          <h1 className="font-display text-[34px] font-bold leading-[1.08] tracking-[-0.01em] text-ink max-[380px]:text-[32px] sm:text-[46px] lg:text-[64px] lg:tracking-[-0.03em]">
            {landingData.hero.title}
          </h1>
          <p className="mx-auto max-w-[620px] font-body text-[16px] font-light leading-[1.6] text-ink-muted-80 md:mx-0 md:text-[18px]">
            {landingData.hero.subtitle}
          </p>
          <ul className="mx-auto max-w-[520px] list-none space-y-3 p-0 text-left font-body text-[14px] font-medium text-ink-muted-80 md:mx-0 md:space-y-3.5 md:text-[15px]">
            {(landingData.hero.highlights || []).filter(Boolean).map((highlight) => (
              <li key={highlight} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-action-blue/10 text-[11px] font-bold text-action-blue">✓</span>
                {highlight}
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4 md:justify-start">
            <a href={landingData.hero.buttonLink || '#collections'} className="rounded-full bg-action-blue px-8 py-4 text-center font-body text-[15px] font-bold text-white no-underline shadow-lg shadow-action-blue/20 transition-all duration-300 hover:scale-105 hover:bg-action-blue-focus">
              {landingData.hero.buttonText}
            </a>
            <Link to={landingData.hero.secondaryButtonLink || '/products'} className="rounded-full border border-ink/20 px-8 py-4 text-center font-body text-[15px] font-bold text-ink no-underline transition-all duration-300 hover:bg-ink/5">
              {landingData.hero.secondaryButtonText || 'Xem Toàn Bộ Sản Phẩm'}
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex h-[330px] w-full items-center justify-center sm:h-[420px] md:col-span-5 md:h-[520px]">
          <div className="tilt-card absolute left-2 top-6 h-[250px] w-[72%] overflow-hidden rounded-[24px] border border-white/80 bg-white/60 p-1.5 shadow-2xl shadow-blue-500/20 backdrop-blur-xl transition-all duration-300 hover:shadow-3xl hover:shadow-blue-500/30 sm:left-6 sm:h-[330px] md:h-[380px]">
            <img src={heroMain} alt={landingData.hero.imageAlt || 'Trang sức bạc'} className="h-full w-full rounded-[24px] object-cover" onError={(event) => { event.currentTarget.src = '/cat-day-chuyen.png' }} />
          </div>
          <div className="tilt-card absolute bottom-6 right-0 aspect-square w-[56%] overflow-hidden rounded-[22px] border-[5px] border-white/85 bg-white/70 p-1 shadow-2xl shadow-rose-500/20 backdrop-blur-xl transition-all duration-300 hover:shadow-3xl hover:shadow-rose-500/30 sm:bottom-8 sm:right-2 sm:w-[58%] sm:rounded-[24px] sm:border-[6px]">
            <img src={heroFloat} alt={landingData.hero.image2Alt || 'Nhẫn bạc'} className="h-full w-full rounded-[18px] object-cover" onError={(event) => { event.currentTarget.src = '/cat-nhan.png' }} />
          </div>
          <div className="absolute bottom-7 left-0 max-w-[160px] rounded-[16px] border border-white/85 bg-white/65 px-3 py-2 text-center shadow-lg backdrop-blur-xl sm:bottom-12 sm:left-2 sm:max-w-[170px] sm:px-4 sm:py-2.5">
            <span className="block font-body text-[10px] font-bold uppercase tracking-[1px] text-ink-muted-48">{landingData.hero.floatingLabel || 'Chế tác'}</span>
            <span className="font-body text-[12.5px] font-bold text-action-blue">{landingData.hero.floatingText || 'Bạc Đẹp Cao Cấp'}</span>
          </div>
          <div className="absolute right-2 top-2 rounded-full bg-ink/90 px-3 py-1.5 text-center text-white shadow-md sm:right-6 sm:px-4">
            <span className="font-body text-[10.5px] font-bold uppercase tracking-[1.5px]">{landingData.hero.topBadge || 'Bạc Cao Cấp'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function CategorySection({ items }: { items: LandingCategoryItem[] }) {
  return (
    <section id="collections" className="relative z-10 border-b border-divider-soft/50 bg-gradient-to-b from-transparent via-white/20 to-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading eyebrow="Danh Mục Sản Phẩm" title="Dòng Sản Phẩm Tiêu Biểu" centered />
        <div className="mt-10 grid grid-cols-1 auto-rows-[220px] gap-5 sm:mt-16 sm:auto-rows-[240px] sm:gap-6 md:grid-cols-4">
          {items.map((item) => (
            <Link key={item.id} to={`/products?category=${item.slug}`} className={`tilt-card reveal-on-scroll relative overflow-hidden rounded-[28px] border border-white/90 bg-gradient-to-br from-white/60 to-white/30 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-action-blue/20 hover:border-white ${categoryCardClass(item.layout)}`}>
              <img src={item.image || '/cat-nhan.png'} alt={item.alt || item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-110" onError={(event) => { event.currentTarget.src = '/cat-nhan.png' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black-pure/85 via-black-pure/35 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white sm:bottom-8 sm:left-8 sm:right-8">
                {item.badge && <span className="font-body text-[11px] font-bold uppercase tracking-[2px] text-sky-link">{item.badge}</span>}
                <h3 className="font-display text-[24px] font-bold leading-tight sm:text-[28px]">{item.title}</h3>
                <p className="font-body text-[13px] font-light text-body-muted">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductsSection({
  categories,
  products,
  selectedCat,
  onSelectCat,
  isPriceHidden,
  landingData,
  onQuickView,
}: {
  categories: Category[]
  products: Product[]
  selectedCat: string
  onSelectCat: (slug: string) => void
  isPriceHidden: (product: Product) => boolean
  landingData: LandingConfig
  onQuickView: (product: Product) => void
}) {
  const section = landingData.productsSection
  return (
    <section className="relative z-10 border-b border-divider-soft/50 bg-gradient-to-b from-transparent via-blue-50/10 to-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between border-b border-divider-soft/40 pb-8 md:flex-row md:items-end">
          <SectionHeading eyebrow={section?.eyebrow || 'Showroom'} title={section?.title || 'Sản Phẩm Độc Đáo'} />
          <div className="mt-6 flex flex-wrap gap-2 md:mt-0">
            <FilterButton active={selectedCat === 'all'} onClick={() => onSelectCat('all')}>{section?.allTabText || 'Tất cả nổi bật'}</FilterButton>
            {categories.map((cat) => (
              <FilterButton key={cat.id} active={selectedCat === cat.slug} onClick={() => onSelectCat(cat.slug)}>{cat.name}</FilterButton>
            ))}
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {products.length === 0 ? (
            <div className="col-span-full py-16 text-center text-ink-muted-48">{section?.emptyText || 'Chưa có sản phẩm nào thuộc danh mục này.'}</div>
          ) : products.map((product) => (
            <article key={product.id} className="tilt-card reveal-on-scroll flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/90 bg-gradient-to-br from-white/90 to-white/70 p-4 shadow-lg shadow-black/8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-action-blue/50 hover:bg-white hover:shadow-2xl hover:shadow-action-blue/15">
              <div>
                <div className="relative aspect-square overflow-hidden rounded-[16px] border border-white/40 bg-white/90">
                  <img src={product.images?.[0] || productFallbackImage(product)} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" onError={(event) => { event.currentTarget.src = productFallbackImage(product) }} />
                  {!product.isAvailable && <div className="absolute inset-0 flex items-center justify-center bg-black-pure/40"><span className="rounded-full bg-red-600 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-[1px] text-white">Tạm hết hàng</span></div>}
                  <button onClick={() => onQuickView(product)} className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-5 py-2.5 font-body text-[13px] font-bold text-ink shadow-md transition-all hover:bg-black-pure hover:text-white">
                    {section?.quickViewText || 'Xem nhanh'}
                  </button>
                </div>
                <div className="mt-5 space-y-1">
                  <span className="font-body text-[10px] font-bold uppercase tracking-[1px] text-action-blue">{product.category?.name || 'Khác'}</span>
                  <h3 className="font-body text-[16px] font-bold leading-snug text-ink hover:text-action-blue">
                    <Link to={`/products/${product.slug}`} className="text-current no-underline">{product.name}</Link>
                  </h3>
                  <p className="font-body text-[15px] font-semibold text-ink/90">{isPriceHidden(product) ? 'Liên hệ' : formatPrice(product.price)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/40 pt-3">
                <span className="text-[11.5px] font-semibold text-ink-muted-48">{section?.materialText || 'Bạc Cao Cấp'}</span>
                <Link to={`/products/${product.slug}`} className="font-body text-[12px] font-bold text-action-blue no-underline hover:underline">{section?.detailText || 'Chi tiết'} &rarr;</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function CommitmentsSection({ landingData, commitments }: { landingData: LandingConfig; commitments: LandingConfig['commitments'] }) {
  return (
    <section className="relative z-10 border-b border-divider-soft/50 bg-gradient-to-b from-transparent via-rose-50/10 to-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1440px] space-y-10 sm:space-y-16">
        <SectionHeading eyebrow={landingData.commitmentsSection?.eyebrow || 'Lời Hứa Từ Sự Tận Tâm'} title={landingData.commitmentsSection?.title || 'Giá Trị Và Sự Tận Tâm'} centered />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item, index) => (
            <div key={`${item.title}-${index}`} className="tilt-card reveal-on-scroll rounded-[28px] border border-white/90 bg-gradient-to-br from-white/80 to-white/50 p-8 text-center shadow-lg shadow-black/8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-action-blue/50 hover:bg-white hover:shadow-2xl hover:shadow-action-blue/15">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border-2 border-action-blue/30 bg-gradient-to-br from-action-blue/10 to-transparent shadow-md"><span className="text-3xl">{item.icon}</span></div>
              <h3 className="mt-6 font-body text-[18px] font-bold text-ink">{item.title}</h3>
              <p className="mt-3 font-body text-[13.5px] font-light leading-relaxed text-ink-muted-48">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection({ landingData }: { landingData: LandingConfig }) {
  return (
    <section className="relative z-10 border-b border-divider-soft/50 px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16">
          <div className="space-y-8 md:col-span-7">
            <SectionHeading eyebrow={landingData.about.eyebrow || 'Di Sản & Chế Tác'} title={landingData.about.title} />
            {landingData.about.quote && <blockquote className="border-l-4 border-action-blue/30 pl-5 font-display text-[18px] italic leading-[1.6] text-ink-muted-80 sm:pl-6 sm:text-[20px]">"{landingData.about.quote}"</blockquote>}
            <div className="space-y-4 font-body text-[16px] font-light leading-[1.75] text-ink-muted-48">
              <p>{landingData.about.content1}</p>
              <p>{landingData.about.content2}</p>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/55 p-2 shadow-xl shadow-ink/5 backdrop-blur-xl">
              <img src={landingData.about.image || '/craftsmanship.png'} alt={landingData.about.imageAlt || 'Jewelry Craftsmanship'} className="h-full w-full rounded-[20px] object-cover" />
              {landingData.about.imageCaption && <div className="absolute bottom-6 left-8 text-[11px] font-bold uppercase tracking-[1.5px] text-white">{landingData.about.imageCaption}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function NewsletterSection({
  landingData,
  email,
  subscribed,
  onEmailChange,
  onSubmit,
}: {
  landingData: LandingConfig
  email: string
  subscribed: boolean
  onEmailChange: (email: string) => void
  onSubmit: (event: FormEvent) => void
}) {
  const newsletter = landingData.newsletter
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1100px] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1d1d1f] via-[#0f0f12] to-[#0a0a0c] px-5 py-12 text-white shadow-3xl shadow-black/50 backdrop-blur-sm sm:rounded-[36px] sm:px-8 sm:py-16 md:p-20">
        <div className="absolute inset-0 bg-gradient-to-b from-action-blue/5 to-transparent rounded-[36px]" />
        <div className="relative z-10 mx-auto max-w-[650px] space-y-6 text-center">
          <span className="font-body text-[12px] font-bold uppercase tracking-[3px] text-sky-link">{newsletter?.eyebrow || 'Thành Viên Độc Quyền'}</span>
          <h2 className="font-display text-[42px] font-semibold tracking-tight max-[640px]:text-[30px]">{newsletter?.title || 'Nhận Ưu Đãi & Tin Tức Sớm Nhất'}</h2>
          <p className="font-body text-[14.5px] font-light leading-relaxed text-white/70">{newsletter?.desc}</p>
          {subscribed ? (
            <div className="rounded-[16px] border border-white/20 bg-white/10 p-6 font-body text-[15px] text-white backdrop-blur-sm">
              <strong>{newsletter?.successTitle || 'Đăng ký thành công!'}</strong> {newsletter?.successMessage}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input type="email" required placeholder={newsletter?.placeholder || 'Nhập email của bạn...'} value={email} onChange={(event) => onEmailChange(event.target.value)} className="flex-1 rounded-full border border-white/15 bg-white/10 px-6 py-4 font-body text-[14.5px] text-white outline-none placeholder:text-white/40 focus:border-white focus:bg-white/15" />
              <button type="submit" className="rounded-full bg-white px-8 py-4 font-body text-[15px] font-bold text-black-pure shadow-lg transition-all hover:bg-slate-100">{newsletter?.buttonText || 'Đăng ký ngay'}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function LandingFooter({ landingData, links }: { landingData: LandingConfig; links: NonNullable<LandingConfig['footer']['links']> }) {
  const footer = landingData.footer
  return (
    <footer className="relative z-10 border-t border-white/50 bg-white/40 px-4 py-14 backdrop-blur-md sm:px-6 sm:py-20 md:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="font-display text-[22px] font-bold tracking-[1.5px] text-ink">{footer.brandName || 'TIỆM BẠC ÁNH XUÂN'}</h3>
            <p className="font-body text-[13.5px] font-light leading-relaxed text-ink-muted-48">{footer.desc}</p>
            <div className="flex gap-3 pt-2">
              {landingData.contactLinks?.facebook && <SocialLink href={landingData.contactLinks.facebook}>FB</SocialLink>}
              {landingData.contactLinks?.instagram && <SocialLink href={landingData.contactLinks.instagram}>IG</SocialLink>}
              {landingData.contactLinks?.tiktok && <SocialLink href={landingData.contactLinks.tiktok}>TT</SocialLink>}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-body text-[12px] font-bold uppercase tracking-[2px] text-ink">{footer.discoverTitle || 'Khám Phá'}</h4>
            <ul className="m-0 list-none space-y-2.5 p-0 font-body text-[13.5px] font-light text-ink-muted-48">
              {links.map((link) => <li key={`${link.label}-${link.url}`}><Link to={link.url} className="text-current no-underline hover:text-action-blue">{link.label}</Link></li>)}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-body text-[12px] font-bold uppercase tracking-[2px] text-ink">{footer.contactTitle || 'Liên Hệ'}</h4>
            <p className="font-body text-[13.5px] font-light leading-relaxed text-ink-muted-48">
              Điện thoại: {footer.phone}<br />
              Email: {footer.email}<br />
              Địa chỉ: {footer.address}
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-body text-[12px] font-bold uppercase tracking-[2px] text-ink">{footer.hoursTitle || 'Giờ Mở Cửa'}</h4>
            <p className="whitespace-pre-line font-body text-[13.5px] font-light leading-relaxed text-ink-muted-48">{footer.hours}</p>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/50 pt-8 text-center md:flex-row md:text-left">
          <p className="font-body text-[12px] font-light text-ink-muted-48">&copy; {new Date().getFullYear()} {footer.brandName || 'Tiệm Bạc Ánh Xuân'}. {footer.copyright || 'Bảo lưu mọi quyền.'}</p>
          <div className="flex gap-6 font-body text-[12px] font-light text-ink-muted-48">
            <span>{footer.privacyText || 'Chính sách bảo mật'}</span>
            <span>{footer.termsText || 'Điều khoản dịch vụ'}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function QuickViewModal({
  product,
  landingData,
  activeImageIdx,
  setActiveImageIdx,
  isPriceHidden,
  onClose,
}: {
  product: Product
  landingData: LandingConfig
  activeImageIdx: number
  setActiveImageIdx: (index: number) => void
  isPriceHidden: (product: Product) => boolean
  onClose: () => void
}) {
  const quickView = landingData.quickView
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black-pure/45 p-3 backdrop-blur-md sm:p-4">
      <div className="relative my-auto max-h-[calc(100svh-1.5rem)] w-full max-w-[900px] overflow-y-auto rounded-[24px] border border-white/80 bg-white/75 shadow-2xl backdrop-blur-2xl md:flex md:rounded-[28px]">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-xl text-ink shadow hover:bg-white">&times;</button>
        <div className="flex flex-col justify-between bg-white/30 p-4 sm:p-6 md:w-1/2">
          <div className="aspect-square w-full overflow-hidden rounded-[18px] border border-white/50 bg-white">
            <img src={product.images?.[activeImageIdx] || productFallbackImage(product)} alt={product.name} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.src = productFallbackImage(product) }} />
          </div>
          {(product.images?.length ?? 0) > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {product.images?.map((img, index) => (
                <button key={img} onClick={() => setActiveImageIdx(index)} className={`h-16 w-16 shrink-0 overflow-hidden rounded-[10px] border-2 bg-white ${activeImageIdx === index ? 'border-action-blue' : 'border-transparent'}`}>
                  <img src={img || productFallbackImage(product)} alt="" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.src = productFallbackImage(product) }} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between p-5 sm:p-8 md:w-1/2">
          <div>
            <span className="rounded-full bg-action-blue/10 px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[1px] text-action-blue">{product.category?.name || 'Khác'}</span>
            <h2 className="mt-4 font-display text-[28px] font-bold text-ink">{product.name}</h2>
            <p className="mt-2 font-body text-[20px] font-semibold text-ink">{isPriceHidden(product) ? 'Liên hệ' : formatPrice(product.price)}</p>
            <div className="mt-6 space-y-4">
              <h4 className="font-body text-[12px] font-bold uppercase tracking-[1.5px] text-ink-muted-48">{quickView?.descriptionTitle || 'Mô tả sản phẩm'}</h4>
              <p className="max-h-[180px] overflow-y-auto pr-2 font-body text-[15px] leading-relaxed text-ink-muted-80">{product.description}</p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <InfoRow label={quickView?.statusLabel || 'Trạng thái:'} value={product.isAvailable ? (quickView?.availableText || 'Còn hàng') : (quickView?.unavailableText || 'Hết hàng')} />
            <InfoRow label={quickView?.materialLabel || 'Chất liệu:'} value={quickView?.materialText || 'Bạc Cao Cấp nguyên chất'} />
            <div className="flex flex-col gap-3 pt-3 sm:flex-row">
              <Link to={`/products/${product.slug}`} onClick={onClose} className="flex-1 rounded-full border border-action-blue py-3 text-center font-body text-[14px] font-semibold text-action-blue transition-all hover:bg-action-blue/5">{quickView?.detailButtonText || 'Xem chi tiết'}</Link>
              <a href={landingData.contactLinks?.zalo || landingData.contactLinks?.hotline || 'tel:0909999999'} target={landingData.contactLinks?.zalo ? '_blank' : undefined} rel={landingData.contactLinks?.zalo ? 'noopener noreferrer' : undefined} className="flex-1 rounded-full bg-action-blue py-3 text-center font-body text-[14px] font-semibold text-white no-underline shadow transition-all hover:bg-action-blue-focus">{quickView?.contactButtonText || 'Liên hệ mua'}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getCategoryItems(landingData: LandingConfig): LandingCategoryItem[] {
  const items = landingData.categoryItems?.length ? landingData.categoryItems : [
    { id: 'nhan', title: 'Nhẫn Bạc Nghệ Thuật', desc: 'Chế tác đính đá CZ lấp lánh, thanh lịch', badge: 'Best Seller', slug: 'nhan', image: landingData.categories?.nhan || '/cat-nhan.png', alt: 'Nhẫn bạc', enabled: true, order: 1, layout: 'large' as const },
    { id: 'day-chuyen', title: 'Dây Chuyền', desc: 'Mặt đá phong thủy kiêu sa', badge: 'Mới Nhất', slug: 'day-chuyen', image: landingData.categories?.dayChuyen || '/cat-day-chuyen.png', alt: 'Dây chuyền bạc', enabled: true, order: 2, layout: 'tall' as const },
    { id: 'bong-tai', title: 'Bông Tai', desc: 'Nhẹ nhàng và tinh khiết', slug: 'bong-tai', image: landingData.categories?.bongTai || '/cat-bong-tai.png', alt: 'Bông tai bạc', enabled: true, order: 3, layout: 'small' as const },
    { id: 'lac-tay', title: 'Lắc Tay', desc: 'Điểm xuyết nơi cổ tay', slug: 'lac-tay', image: landingData.categories?.lacTay || '/cat-lac-tay.png', alt: 'Lắc tay bạc', enabled: true, order: 4, layout: 'small' as const },
  ]

  return [...items].filter((item) => item.enabled).sort((a, b) => a.order - b.order)
}

function categoryCardClass(layout?: string) {
  if (layout === 'large') return 'md:col-span-2 md:row-span-2'
  if (layout === 'tall') return 'md:col-span-1 md:row-span-2'
  return 'md:col-span-1 md:row-span-1'
}

function productFallbackImage(product: Product) {
  const slug = product.category?.slug
  if (slug === 'day-chuyen') return '/cat-day-chuyen.png'
  if (slug === 'bong-tai') return '/cat-bong-tai.png'
  if (slug === 'lac-tay') return '/cat-lac-tay.png'
  return '/cat-nhan.png'
}

function SectionHeading({ eyebrow, title, centered = false }: { eyebrow: string; title: string; centered?: boolean }) {
  return (
    <div className={`space-y-4 ${centered ? 'text-center' : ''}`}>
      <span className={`font-body text-[12px] font-bold uppercase tracking-[3px] bg-gradient-to-r from-action-blue to-sky-link bg-clip-text text-transparent ${centered ? 'flex items-center justify-center gap-1.5' : 'flex items-center gap-1.5'}`}>
        <span>✦</span> {eyebrow} <span>✦</span>
      </span>
      <h2 className="font-display text-[34px] font-bold text-ink drop-shadow-sm sm:text-[40px] lg:text-[48px]">{title}</h2>
      <div className={`${centered ? 'mx-auto' : ''} h-1 w-32 bg-gradient-to-r from-action-blue via-action-blue to-transparent rounded-full shadow-lg shadow-action-blue/30`} />
    </div>
  )
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className={`shrink-0 rounded-full px-5 py-2.5 font-body text-[13px] font-semibold transition-all duration-300 sm:px-6 ${active ? 'bg-gradient-to-r from-action-blue to-sky-link text-white shadow-lg shadow-action-blue/40 hover:shadow-xl' : 'border border-white/80 bg-gradient-to-br from-white/70 to-white/40 text-ink backdrop-blur-xl hover:bg-white/80 hover:shadow-md'}`}>
      {children}
    </button>
  )
}

function SocialLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/60 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-ink hover:text-white">
      {children}
    </a>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/40 pb-3 text-[14px] sm:flex-row sm:items-center sm:justify-between">
      <span className="text-ink-muted-48">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  )
}
