import fs from 'fs/promises'
import path from 'path'

const dataDir = path.join(__dirname, '../data')
const dataFilePath = path.join(dataDir, 'landing.json')
const historyDir = path.join(dataDir, 'landing-history')

type JsonRecord = Record<string, unknown>

const defaultConfig = {
  version: 2,
  status: 'published',
  updatedAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
  theme: 'luxury-silver',
  enable3DEffects: true,
  enableGlowBubbles: true,
  enableRevealAnimation: true,
  hideAllPrices: false,
  siteMeta: {
    title: 'Tiệm Bạc Ánh Xuân - Bạc Cao Cấp',
    favicon: '/favicon.svg',
  },
  contactLinks: {
    zalo: '',
    messenger: '',
    hotline: '',
    facebook: '',
    instagram: '',
    tiktok: '',
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
  hero: {
    badge: 'Bạc Cao Cấp Chế Tác Thủ Công',
    title: 'Tỏa Sáng Bạc Cao Cấp Mới',
    subtitle: 'Bộ sưu tập trang sức bạc cao cấp, chế tác thủ công tinh xảo.',
    buttonText: 'Xem Bộ Sưu Tập',
    buttonLink: '#collections',
    secondaryButtonText: 'Xem Toàn Bộ Sản Phẩm',
    secondaryButtonLink: '/products',
    image: '',
    image2: '',
    imageBg: '',
    imageAlt: 'Trang sức bạc cao cấp',
    image2Alt: 'Nhẫn bạc cao cấp',
    floatingLabel: 'Chế tác',
    floatingText: 'Bạc Đẹp Cao Cấp',
    topBadge: 'Bạc Cao Cấp',
    highlights: [
      'Bạc nguyên chất S925 tiêu chuẩn quốc tế',
      'Bảo hành đánh bóng làm mới trọn đời',
      'Đóng gói hộp quà sang trọng kèm túi nỉ cao cấp',
    ],
  },
  categories: {
    nhan: '',
    dayChuyen: '',
    bongTai: '',
    lacTay: '',
  },
  categoryItems: [
    {
      id: 'nhan',
      title: 'Nhẫn Bạc Nghệ Thuật',
      desc: 'Chế tác đính đá CZ lấp lánh, thanh lịch',
      badge: 'Best Seller',
      slug: 'nhan',
      image: '',
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
      image: '',
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
      image: '',
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
      image: '',
      alt: 'Lắc tay bạc',
      enabled: true,
      order: 4,
      layout: 'small',
    },
  ],
  productsSection: {
    eyebrow: 'Showroom',
    title: 'Sản Phẩm Độc Đáo',
    allTabText: 'Tất cả nổi bật',
    emptyText: 'Chưa có sản phẩm nào thuộc danh mục này.',
    quickViewText: 'Xem nhanh',
    detailText: 'Chi tiết',
    materialText: 'Bạc Cao Cấp',
  },
  commitmentsSection: {
    eyebrow: 'Lời Hứa Từ Sự Tận Tâm',
    title: 'Giá Trị Và Sự Tận Tâm',
  },
  commitments: [
    { icon: '💎', title: 'Bạc Cao Cấp Chuẩn', desc: 'Bạc cao cấp nguyên chất, không pha tạp', enabled: true, order: 1 },
    { icon: '✨', title: 'Bảo dưỡng trang sức', desc: 'Hỗ trợ tân trang, xi mạ và đánh bóng', enabled: true, order: 2 },
    { icon: '🎁', title: 'Hộp Quà Sang Trọng', desc: 'Đóng gói cao cấp, sẵn sàng làm quà tặng', enabled: true, order: 3 },
    { icon: '🚚', title: 'Giao hàng tận nơi', desc: 'Ưu đãi vận chuyển cho đơn phù hợp', enabled: true, order: 4 },
  ],
  about: {
    eyebrow: 'Di Sản & Chế Tác',
    title: 'Về Chúng Tôi',
    quote: 'Mỗi thiết kế trang sức bạc tại Ánh Xuân là một tác phẩm ghi dấu sự tận tụy của nghệ nhân.',
    content1: '',
    content2: '',
    image: '/craftsmanship.png',
    imageAlt: 'Jewelry Craftsmanship',
    imageCaption: 'Workbench - Tỉ mỉ từng chi tiết',
  },
  newsletter: {
    enabled: true,
    eyebrow: 'Thành Viên Độc Quyền',
    title: 'Nhận Ưu Đãi & Tin Tức Sớm Nhất',
    desc: 'Nhận thông báo sớm nhất về sản phẩm mới và chương trình khuyến mãi đặc quyền.',
    placeholder: 'Nhập email của bạn...',
    buttonText: 'Đăng ký ngay',
    successTitle: 'Đăng ký thành công!',
    successMessage: 'Cảm ơn bạn đã đồng hành cùng Tiệm Bạc Ánh Xuân.',
  },
  quickView: {
    descriptionTitle: 'Mô tả sản phẩm',
    statusLabel: 'Trạng thái:',
    availableText: 'Còn hàng',
    unavailableText: 'Hết hàng',
    materialLabel: 'Chất liệu:',
    materialText: 'Bạc Cao Cấp nguyên chất',
    detailButtonText: 'Xem chi tiết',
    contactButtonText: 'Liên hệ mua',
  },
  footer: {
    brandName: 'TIỆM BẠC ÁNH XUÂN',
    desc: 'Chuyên trang sức bạc cao cấp.',
    phone: '0909 999 999',
    email: 'info@tiembacanhxuan.vn',
    address: '123 Trần Hưng Đạo, Q.1, TP.HCM',
    hours: 'Thứ 2 - Thứ 7: 9:00 - 21:00\nChủ Nhật: 9:00 - 18:00',
    discoverTitle: 'Khám Phá',
    contactTitle: 'Liên Hệ',
    hoursTitle: 'Giờ Mở Cửa',
    copyright: 'Bảo lưu mọi quyền.',
    privacyText: 'Chính sách bảo mật',
    termsText: 'Điều khoản dịch vụ',
    links: [
      { label: 'Tất cả sản phẩm', url: '/products', enabled: true, order: 1 },
      { label: 'Nhẫn Bạc Cao Cấp', url: '/products?category=nhan', enabled: true, order: 2 },
      { label: 'Dây Chuyền Đính Đá', url: '/products?category=day-chuyen', enabled: true, order: 3 },
      { label: 'Bông Tai Ngọc Trai', url: '/products?category=bong-tai', enabled: true, order: 4 },
    ],
  },
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeDefaults<T>(defaults: T, value: unknown): T {
  if (Array.isArray(defaults)) {
    return Array.isArray(value) ? (value as T) : defaults
  }

  if (!isRecord(defaults)) {
    return (value ?? defaults) as T
  }

  const source = isRecord(value) ? value : {}
  const merged: JsonRecord = { ...defaults }

  Object.entries(defaults).forEach(([key, defaultValue]) => {
    merged[key] = mergeDefaults(defaultValue, source[key])
  })

  Object.entries(source).forEach(([key, sourceValue]) => {
    if (!(key in merged)) merged[key] = sourceValue
  })

  return merged as T
}

function normalizeLegacyConfig(config: JsonRecord) {
  const normalized = mergeDefaults(defaultConfig, config)

  if (isRecord(config.hero)) {
    normalized.hero = mergeDefaults(defaultConfig.hero, config.hero)
  }

  if (!Array.isArray(config.categoryItems) && isRecord(config.categories)) {
    const categories = config.categories
    normalized.categoryItems = defaultConfig.categoryItems.map((item) => ({
      ...item,
      image: String(categories[item.id === 'day-chuyen' ? 'dayChuyen' : item.id === 'bong-tai' ? 'bongTai' : item.id === 'lac-tay' ? 'lacTay' : 'nhan'] || item.image),
    }))
  }

  if (Array.isArray(config.commitments)) {
    normalized.commitments = config.commitments.map((item, index) => ({
      icon: '',
      title: '',
      desc: '',
      enabled: true,
      order: index + 1,
      ...(isRecord(item) ? item : {}),
    }))
  }

  return normalized
}

export type LandingConfig = typeof defaultConfig

export async function readLandingConfig(): Promise<LandingConfig> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8')
    const parsed = JSON.parse(data)
    return normalizeLegacyConfig(isRecord(parsed) ? parsed : {}) as LandingConfig
  } catch {
    return defaultConfig
  }
}

export async function writeLandingConfig(config: unknown, status: 'draft' | 'published' = 'published'): Promise<LandingConfig> {
  if (!isRecord(config)) {
    throw new Error('Invalid landing config')
  }

  const current = await readLandingConfig()
  const next = normalizeLegacyConfig({
    ...current,
    ...config,
    status,
    version: 2,
    updatedAt: new Date().toISOString(),
    publishedAt: status === 'published' ? new Date().toISOString() : current.publishedAt,
  })

  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(dataFilePath, JSON.stringify(next, null, 2), 'utf-8')
  return next as LandingConfig
}

export async function publishLandingConfig(config?: unknown): Promise<LandingConfig> {
  const current = config ? await writeLandingConfig(config, 'published') : await writeLandingConfig(await readLandingConfig(), 'published')
  await fs.mkdir(historyDir, { recursive: true })
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await fs.writeFile(path.join(historyDir, `${timestamp}.json`), JSON.stringify(current, null, 2), 'utf-8')
  return current
}

export async function listLandingHistory() {
  try {
    await fs.mkdir(historyDir, { recursive: true })
    const files = await fs.readdir(historyDir)
    return files
      .filter((file) => file.endsWith('.json'))
      .sort()
      .reverse()
      .map((file) => ({ id: file.replace(/\.json$/, ''), file }))
  } catch {
    return []
  }
}

export async function rollbackLandingConfig(id: string): Promise<LandingConfig> {
  if (!/^[\w-]+$/.test(id)) {
    throw new Error('Invalid history id')
  }

  const filePath = path.join(historyDir, `${id}.json`)
  const data = await fs.readFile(filePath, 'utf-8')
  const parsed = JSON.parse(data)
  return writeLandingConfig(parsed, 'published')
}
