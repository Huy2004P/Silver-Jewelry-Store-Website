import { Link } from 'react-router-dom'

interface ProductCardProps {
  slug: string
  name: string
  price: number
  image: string
  category?: string
  showPrice?: boolean
}

export default function ProductCard({ slug, name, price, image, category, showPrice = true }: ProductCardProps) {
  return (
    <Link to={`/products/${slug}`} className="tilt-card reveal-on-scroll group block no-underline">
      <div className="h-full overflow-hidden rounded-[18px] border border-hairline bg-canvas p-4 transition-all duration-300 hover:shadow-lg sm:p-6">
        <div className="aspect-square overflow-hidden rounded-[8px] bg-parchment">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="mt-4">
          {category && (
            <p className="font-body text-[12px] font-normal tracking-[-0.12px] text-ink-muted-48">
              {category}
            </p>
          )}
          <h3 className="mt-1 break-words font-body text-[16px] font-semibold tracking-[-0.2px] text-ink sm:text-[17px] sm:tracking-[-0.374px]">
            {name}
          </h3>
          <span className="mt-1 inline-block rounded-full bg-action-blue/10 px-2 py-0.5 font-body text-[10px] tracking-[-0.08px] text-action-blue">
            Bạc Cao Cấp
          </span>
          <p className="mt-2 font-body text-[16px] font-normal tracking-[-0.2px] text-ink sm:text-[17px] sm:tracking-[-0.374px]">
            {showPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price) : 'Liên hệ'}
          </p>
        </div>
      </div>
    </Link>
  )
}
