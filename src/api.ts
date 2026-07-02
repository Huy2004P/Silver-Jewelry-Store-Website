import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Category {
  id: number
  name: string
  slug: string
  _count?: { products: number }
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  categoryId: number
  category: Category
  isFeatured: boolean
  isAvailable: boolean
  showPrice: boolean
  createdAt: string
}

export interface LoginResponse {
  token: string
  user: { id: number; email: string; name: string }
}

export interface ProductInput {
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  categoryId: number
  isFeatured: boolean
  isAvailable: boolean
  showPrice?: boolean
}

export interface ProductQuery {
  category?: string
  search?: string
  sort?: 'price_asc' | 'price_desc'
  featured?: boolean
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
  return data
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories')
  return data
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const params: Record<string, string> = {}
  if (query.category) params.category = query.category
  if (query.search) params.search = query.search
  if (query.sort) params.sort = query.sort
  if (query.featured) params.featured = 'true'
  const { data } = await api.get<Product[]>('/products', { params })
  return data
}

export async function getProduct(slug: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${slug}`)
  return data
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data } = await api.post<Product>('/products', input)
  return data
}

export async function updateProduct(id: number, input: Partial<ProductInput>): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, input)
  return data
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`)
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post<{ url: string }>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.url
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export interface LandingHero {
  badge?: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  image: string
  image2?: string
  imageBg?: string
  imageAlt?: string
  image2Alt?: string
  floatingLabel?: string
  floatingText?: string
  topBadge?: string
  highlights?: string[]
}

export interface LandingCommitment {
  icon: string
  title: string
  desc: string
  enabled?: boolean
  order?: number
}

export interface LandingAbout {
  eyebrow?: string
  title: string
  quote?: string
  content1: string
  content2: string
  image?: string
  imageAlt?: string
  imageCaption?: string
}

export interface LandingFooter {
  brandName?: string
  desc: string
  phone: string
  email: string
  address: string
  hours: string
  discoverTitle?: string
  contactTitle?: string
  hoursTitle?: string
  copyright?: string
  privacyText?: string
  termsText?: string
  links?: LandingFooterLink[]
}

export interface LandingCategories {
  nhan: string
  dayChuyen: string
  bongTai: string
  lacTay: string
}

export interface LandingSectionSetting {
  enabled: boolean
  order: number
}

export interface LandingCategoryItem {
  id: string
  title: string
  desc: string
  badge?: string
  slug: string
  image: string
  alt?: string
  enabled: boolean
  order: number
  layout?: 'large' | 'tall' | 'small'
}

export interface LandingProductsSection {
  eyebrow: string
  title: string
  allTabText: string
  emptyText: string
  quickViewText: string
  detailText: string
  materialText: string
}

export interface LandingCommitmentsSection {
  eyebrow: string
  title: string
}

export interface LandingNewsletter {
  enabled: boolean
  eyebrow: string
  title: string
  desc: string
  placeholder: string
  buttonText: string
  successTitle: string
  successMessage: string
}

export interface LandingQuickView {
  descriptionTitle: string
  statusLabel: string
  availableText: string
  unavailableText: string
  materialLabel: string
  materialText: string
  detailButtonText: string
  contactButtonText: string
}

export interface LandingFooterLink {
  label: string
  url: string
  enabled: boolean
  order: number
}

export interface SiteMeta {
  title: string
  favicon: string
}

export interface LandingConfig {
  version?: number
  status?: 'draft' | 'published'
  updatedAt?: string
  publishedAt?: string
  siteMeta?: SiteMeta
  hero: LandingHero
  categories: LandingCategories
  categoryItems?: LandingCategoryItem[]
  commitments: LandingCommitment[]
  sections?: Record<'hero' | 'categories' | 'products' | 'commitments' | 'about' | 'newsletter' | 'footer', LandingSectionSetting>
  productsSection?: LandingProductsSection
  commitmentsSection?: LandingCommitmentsSection
  about: LandingAbout
  newsletter?: LandingNewsletter
  quickView?: LandingQuickView
  footer: LandingFooter
  theme?: string
  enable3DEffects?: boolean
  enableGlowBubbles?: boolean
  enableRevealAnimation?: boolean
  hideAllPrices?: boolean
  contactLinks?: {
    zalo: string
    messenger: string
    hotline: string
    facebook: string
    instagram: string
    tiktok?: string
  }
}

export interface Review {
  id: number
  name: string
  rating: number
  comment: string
  productId: number
  createdAt: string
}

export async function getLandingConfig(): Promise<LandingConfig> {
  const { data } = await api.get<LandingConfig>('/landing')
  return data
}

export async function updateLandingConfig(config: LandingConfig): Promise<LandingConfig> {
  const { data } = await api.put<LandingConfig>('/landing', config)
  return data
}

export async function saveLandingDraft(config: LandingConfig): Promise<LandingConfig> {
  const { data } = await api.put<LandingConfig>('/landing/admin/draft', config)
  return data
}

export async function publishLandingConfig(config: LandingConfig): Promise<LandingConfig> {
  const { data } = await api.post<LandingConfig>('/landing/admin/publish', config)
  return data
}

export async function getLandingHistory(): Promise<{ id: string; file: string }[]> {
  const { data } = await api.get<{ id: string; file: string }[]>('/landing/admin/history')
  return data
}

export async function rollbackLandingConfig(id: string): Promise<LandingConfig> {
  const { data } = await api.post<LandingConfig>(`/landing/admin/rollback/${id}`)
  return data
}

export async function createCategory(input: { name: string; slug: string }): Promise<Category> {
  const { data } = await api.post<Category>('/categories', input)
  return data
}

export async function updateCategory(id: number, input: { name: string; slug: string }): Promise<Category> {
  const { data } = await api.put<Category>(`/categories/${id}`, input)
  return data
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`)
}

export async function getProductReviews(productId: number): Promise<Review[]> {
  const { data } = await api.get<Review[]>(`/products/${productId}/reviews`)
  return data
}

export async function createReview(productId: number, input: { name: string; rating: number; comment: string }): Promise<Review> {
  const { data } = await api.post<Review>(`/products/${productId}/reviews`, input)
  return data
}
