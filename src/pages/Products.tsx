import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getCategories, getProducts, getLandingConfig, type Category, type Product, type LandingConfig } from '../api'

type SortOption = '' | 'price_asc' | 'price_desc'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [landingData, setLandingData] = useState<LandingConfig | null>(null)

  const activeCategory = searchParams.get('category') ?? 'all'
  const sort = (searchParams.get('sort') ?? '') as SortOption

  useEffect(() => {
    getLandingConfig().then(setLandingData).catch(console.error)
  }, [])

  // Áp dụng theme màu sắc cho body
  useEffect(() => {
    if (landingData?.theme) {
      document.body.className = `theme-${landingData.theme}`
    } else {
      document.body.className = ''
    }
    return () => {
      document.body.className = ''
    }
  }, [landingData])

  // Hiệu ứng 3D Parallax Tilt cho các thẻ bài
  useEffect(() => {
    if (!landingData?.enable3DEffects) return

    const elements = document.querySelectorAll('.tilt-card')
    const cleanups: (() => void)[] = []

    elements.forEach((el) => {
      const htmlEl = el as HTMLElement
      const handleMouseMove = (e: MouseEvent) => {
        const rect = htmlEl.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const xc = rect.width / 2
        const yc = rect.height / 2
        const dx = x - xc
        const dy = y - yc
        const tiltX = (dy / yc) * -8
        const tiltY = (dx / xc) * 8
        htmlEl.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.015, 1.015, 1.015)`
      }

      const handleMouseLeave = () => {
        htmlEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      }

      htmlEl.addEventListener('mousemove', handleMouseMove)
      htmlEl.addEventListener('mouseleave', handleMouseLeave)
      htmlEl.style.transition = 'transform 0.15s ease-out'

      cleanups.push(() => {
        htmlEl.removeEventListener('mousemove', handleMouseMove)
        htmlEl.removeEventListener('mouseleave', handleMouseLeave)
        htmlEl.style.transform = ''
        htmlEl.style.transition = ''
      })
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [landingData, products])

  // Hiệu ứng Scroll Reveal (Fade & Slide in) khi cuộn trang
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.08 }
    )

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [products])

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    getProducts({
      category: activeCategory === 'all' ? undefined : activeCategory,
      search: searchParams.get('search') ?? undefined,
      sort: sort || undefined,
    })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeCategory, searchParams, sort])

  function setCategory(slug: string) {
    const next = new URLSearchParams(searchParams)
    if (slug === 'all') next.delete('category')
    else next.set('category', slug)
    setSearchParams(next)
  }

  function setSort(value: SortOption) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('sort', value)
    else next.delete('sort')
    setSearchParams(next)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const next = new URLSearchParams(searchParams)
    if (search.trim()) next.set('search', search.trim())
    else next.delete('search')
    setSearchParams(next)
  }

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-5 sm:py-section">
        <h1 className="font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.2px] text-ink sm:text-[40px] sm:tracking-[-0.374px]">
          Bộ Sưu Tập
        </h1>
        <p className="mt-2 max-w-2xl font-body text-[16px] font-normal leading-[1.55] tracking-[-0.2px] text-ink-muted-48 sm:text-[17px] sm:tracking-[-0.374px]">
          Khám phá toàn bộ trang sức Bạc Cao Cấp cao cấp
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`shrink-0 rounded-full px-4 py-2 font-body text-[14px] tracking-[-0.224px] transition-transform active:scale-95 ${activeCategory === 'all'
                ? 'bg-action-blue text-white'
                : 'border border-hairline bg-canvas text-ink'
              }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.slug)}
              className={`shrink-0 rounded-full px-4 py-2 font-body text-[14px] tracking-[-0.224px] transition-transform active:scale-95 ${activeCategory === cat.slug
                  ? 'bg-action-blue text-white'
                  : 'border border-hairline bg-canvas text-ink'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="flex w-full gap-2 sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="h-11 min-w-0 flex-1 rounded-full border border-hairline bg-canvas px-5 font-body text-[16px] tracking-[-0.2px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus sm:w-72 sm:text-[17px] sm:tracking-[-0.374px]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-action-blue px-5 py-2 font-body text-[14px] text-white transition-transform active:scale-95"
            >
              Tìm
            </button>
          </form>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-11 w-full rounded-full border border-hairline bg-canvas px-4 font-body text-[14px] tracking-[-0.224px] text-ink outline-none sm:w-auto"
          >
            <option value="">Mặc định</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
          </select>
        </div>

        {loading ? (
          <p className="mt-12 text-center font-body text-[17px] text-ink-muted-48">Đang tải...</p>
        ) : products.length === 0 ? (
          <p className="mt-12 text-center font-body text-[17px] text-ink-muted-48">
            Không tìm thấy sản phẩm nào.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image={product.images[0] ?? ''}
                category={product.category.name}
                showPrice={!(landingData?.hideAllPrices || !product.showPrice)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
