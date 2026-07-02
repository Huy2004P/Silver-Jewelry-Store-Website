import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@tiembacanhxuan.vn' },
    update: {},
    create: {
      email: 'admin@tiembacanhxuan.vn',
      password: adminPassword,
      name: 'Admin',
    },
  })

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Nhẫn', slug: 'nhan' } }),
    prisma.category.create({ data: { name: 'Dây Chuyền', slug: 'day-chuyen' } }),
    prisma.category.create({ data: { name: 'Bông Tai', slug: 'bong-tai' } }),
    prisma.category.create({ data: { name: 'Lắc Tay', slug: 'lac-tay' } }),
  ])

  const [nhan, dayChuyen, bongTai, lacTay] = categories

  const products = [
    { name: 'Nhẫn Bạc Cao Cấp Đám Cưới', slug: 'nhan-bac-s925-dam-cuoi', description: 'Nhẫn cưới Bạc Cao Cấp cao cấp, thiết kế sang trọng, tinh tế. Phù hợp làm nhẫn cưới hoặc nhẫn kỷ niệm.', price: 1890000, categoryId: nhan.id, isFeatured: true },
    { name: 'Nhẫn Bạc Đính Đá Cubic', slug: 'nhan-bac-dinh-da-cubic', description: 'Nhẫn Bạc Cao Cấp đính đá cubic zirconia lấp lánh, kiểu dáng thời trang.', price: 1450000, categoryId: nhan.id, isFeatured: false },
    { name: 'Dây Chuyền Mặt Trăng', slug: 'day-chuyen-mat-trang', description: 'Dây chuyền Bạc Cao Cấp mặt trăng khắc họa tiết tinh tế, biểu tượng của vẻ đẹp huyền bí.', price: 2450000, categoryId: dayChuyen.id, isFeatured: true },
    { name: 'Dây Chuyền Trái Tim', slug: 'day-chuyen-trai-tim', description: 'Dây chuyền Bạc Cao Cấp mặt trái tim cách điệu, món quà ý nghĩa cho người thương.', price: 1750000, categoryId: dayChuyen.id, isFeatured: false },
    { name: 'Bông Tai Hoa Sen', slug: 'bong-tai-hoa-sen', description: 'Bông tai Bạc Cao Cấp hình hoa sen tinh khôi, thanh lịch và nhẹ nhàng.', price: 1250000, categoryId: bongTai.id, isFeatured: true },
    { name: 'Bông Tai Vòng Tròn', slug: 'bong-tai-vong-tron', description: 'Bông tai Bạc Cao Cấp vòng tròn đơn giản, phù hợp phong cách tối giản.', price: 890000, categoryId: bongTai.id, isFeatured: false },
    { name: 'Lắc Tay Tinh Thể', slug: 'lac-tay-tinh-the', description: 'Lắc tay Bạc Cao Cấp đính pha lê tinh thể trong suốt, lấp lánh dưới ánh sáng.', price: 2100000, categoryId: lacTay.id, isFeatured: true },
    { name: 'Lắc Tay Bạc Đan', slug: 'lac-tay-bac-dan', description: 'Lắc tay Bạc Cao Cấp kiểu đan móc thủ công, độc đáo và cá tính.', price: 1350000, categoryId: lacTay.id, isFeatured: false },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        images: JSON.stringify([`https://placehold.co/600x600/parchment/1d1d1f?text=${encodeURIComponent(product.name)}`]),
      },
    })
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
