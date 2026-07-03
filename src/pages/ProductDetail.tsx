import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatPrice, getProduct, getLandingConfig, getProductReviews, createReview, type Product, type LandingConfig, type Review } from '../api'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  const [landingData, setLandingData] = useState<LandingConfig | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [revName, setRevName] = useState('')
  const [revRating, setRevRating] = useState(5)
  const [revComment, setRevComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  useEffect(() => {
    getLandingConfig().then(setLandingData).catch(console.error)
  }, [])

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getProduct(slug)
      .then((data) => {
        setProduct(data)
        setActiveImage(0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (product) {
      getProductReviews(product.id).then(setReviews).catch(console.error)
    }
  }, [product])

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

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product || !revName || !revComment) return
    setSubmittingReview(true)
    try {
      const newReview = await createReview(product.id, {
        name: revName,
        rating: revRating,
        comment: revComment,
      })
      setReviews([newReview, ...reviews])
      setRevName('')
      setRevComment('')
      setRevRating(5)
      setReviewSuccess(true)
      setTimeout(() => setReviewSuccess(false), 4000)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-11">
        <div className="mx-auto max-w-[1440px] px-5 py-section">
          <p className="font-body text-[17px] text-ink-muted-48">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-11">
        <div className="mx-auto max-w-[1440px] px-5 py-section">
          <h1 className="font-display text-[40px] font-semibold text-ink">Không tìm thấy sản phẩm</h1>
          <Link to="/products" className="mt-4 inline-block font-body text-[17px] text-action-blue no-underline">
            ← Quay lại bộ sưu tập
          </Link>
        </div>
      </div>
    )
  }

  const isPriceHidden = landingData?.hideAllPrices || !product.showPrice

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-5 sm:py-section">
        <Link to="/products" className="font-body text-[14px] text-action-blue no-underline">
          ← Bộ sưu tập
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="aspect-square overflow-hidden rounded-[18px] bg-parchment">
              <img
                src={product.images[activeImage] ?? ''}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700"
                style={{ boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px 0' }}
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-[8px] border-2 cursor-pointer sm:h-20 sm:w-20 ${
                      i === activeImage ? 'border-action-blue' : 'border-hairline'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="font-body text-[14px] tracking-[-0.224px] text-ink-muted-48">
              {product.category.name}
            </p>
            <h1 className="mt-2 break-words font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.2px] text-ink sm:text-[40px] sm:tracking-[-0.374px]">
              {product.name}
            </h1>
            <span className="mt-3 inline-block rounded-full bg-action-blue/10 px-3 py-1 font-body text-[12px] text-action-blue">
              Bạc Cao Cấp Chuẩn
            </span>
            <p className="mt-6 font-display text-[28px] font-semibold text-ink">
              {isPriceHidden ? 'Liên hệ' : formatPrice(product.price)}
            </p>
            {!product.isAvailable && (
              <p className="mt-2 font-body text-[14px] text-red-500 font-medium">Tạm hết hàng</p>
            )}
            <p className="mt-8 font-body text-[16px] font-normal leading-[1.6] tracking-[-0.2px] text-ink-muted-48 sm:text-[17px] sm:tracking-[-0.374px]">
              {product.description}
            </p>

            {/* Quick Contact Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-[420px]">
              <a
                href={landingData?.contactLinks?.zalo || "https://zalo.me/0909999999"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center rounded-full border border-action-blue py-3.5 font-body text-[14px] font-semibold text-action-blue hover:bg-action-blue/5 transition-all no-underline cursor-pointer"
              >
                💬 Chat Zalo tư vấn
              </a>
              <a
                href={landingData?.contactLinks?.hotline || "tel:0909999999"}
                className="flex-1 text-center rounded-full bg-action-blue py-3.5 font-body text-[14px] font-semibold text-white hover:bg-action-blue-focus transition-all shadow-md shadow-action-blue/15 no-underline cursor-pointer"
              >
                📞 Gọi Hotline ngay
              </a>
            </div>
          </div>
        </div>

        {/* Review & Ratings Section */}
        <div className="mt-14 max-w-4xl border-t border-hairline pt-12 sm:mt-20 sm:pt-16">
          <h2 className="font-display text-[28px] font-bold text-ink sm:text-[32px]">Đánh Giá & Nhận Xét</h2>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Reviews list */}
            <div className="md:col-span-7 space-y-6">
              {reviews.length === 0 ? (
                <p className="text-ink-muted-48 italic">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="rounded-[16px] bg-white/40 border border-white/60 p-5 shadow-xs">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="font-body text-[15px] font-bold text-ink">{rev.name}</h4>
                      <span className="text-[12px] text-ink-muted-48">
                        {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {/* Stars */}
                    <div className="mt-1 flex text-yellow-500 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="mr-0.5">{i < rev.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <p className="mt-3 font-body text-[14.5px] text-ink-muted-80 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write a review form */}
            <div className="md:col-span-5 bg-white/50 border border-white/80 rounded-[24px] p-6 shadow-md backdrop-blur-xl">
              <h3 className="font-body text-[18px] font-bold text-ink">Gửi nhận xét của bạn</h3>
              
              {reviewSuccess && (
                <div className="mt-4 rounded-lg bg-green-50 text-green-700 p-3 text-[13.5px] font-medium border border-green-200">
                  ✨ Đánh giá của bạn đã được gửi thành công!
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block font-body text-[13px] font-bold text-ink-muted-48 uppercase">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="mt-1.5 w-full rounded-full border border-hairline bg-canvas px-4 py-2.5 font-body text-[14px] outline-none focus:ring-1 focus:ring-action-blue"
                  />
                </div>

                <div>
                  <label className="block font-body text-[13px] font-bold text-ink-muted-48 uppercase">Đánh giá sao</label>
                  <div className="mt-1.5 flex gap-1.5 text-yellow-500 text-2xl cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRevRating(star)}
                        className="hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                      >
                        {star <= revRating ? '★' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-body text-[13px] font-bold text-ink-muted-48 uppercase">Nhận xét</label>
                  <textarea
                    required
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    rows={3}
                    placeholder="Chia sẻ cảm nhận của bạn..."
                    className="mt-1.5 w-full rounded-[16px] border border-hairline bg-canvas px-4 py-2.5 font-body text-[14px] outline-none focus:ring-1 focus:ring-action-blue resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full rounded-full bg-action-blue py-3 font-body text-[14px] font-bold text-white hover:bg-action-blue-focus disabled:opacity-50 transition-all cursor-pointer"
                >
                  {submittingReview ? 'Đang gửi...' : 'Gửi nhận xét'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
