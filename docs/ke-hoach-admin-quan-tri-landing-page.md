# Kế hoạch tùy chỉnh admin quản trị toàn bộ Landing Page

## Mục tiêu

Biến trang `/admin/landing` thành khu quản trị đầy đủ cho toàn bộ nội dung, hình ảnh, hiển thị và hành vi của landing page. Admin có thể chỉnh sửa mà không cần sửa code, lưu nháp, xem trước, xuất bản, và hoàn tác khi cấu hình sai.

## Hiện trạng

- Frontend đang lấy cấu hình qua `getLandingConfig()` từ `/api/landing`.
- Backend đang lưu cấu hình trong `server/src/data/landing.json`.
- Admin hiện đã quản lý được một phần:
  - Hero: tiêu đề, mô tả, nút, ảnh.
  - Category images: nhẫn, dây chuyền, bông tai, lắc tay.
  - Commitments: icon, tiêu đề, mô tả.
  - About: tiêu đề, nội dung.
  - Footer: mô tả, điện thoại, email, địa chỉ, giờ mở cửa.
  - Theme, hiệu ứng 3D, glow bubbles, ẩn toàn bộ giá, contact links.
- Trang `Home.tsx` vẫn còn nhiều nội dung hardcode như tiêu đề section, subtitle, CTA, social labels, câu quote, newsletter text, quick view labels, tên cột footer.

## Phạm vi cần quản trị

### 1. Cấu trúc trang

Cho admin bật/tắt và sắp xếp các section:

- Hero.
- Commitments.
- Categories/Bento grid.
- Featured products.
- About.
- Quote/brand story.
- Newsletter.
- Footer landing.
- Floating contact widget.

Mỗi section nên có:

- `enabled`: bật/tắt.
- `order`: thứ tự hiển thị.
- `anchorId`: id để link tới section.
- `title`, `subtitle`, `description` tùy section.

### 2. Hero

Admin cần chỉnh được:

- Tiêu đề chính.
- Subtitle.
- Text nút CTA.
- Link nút CTA.
- Ảnh nền, ảnh chính, ảnh nổi.
- Alt text cho ảnh.
- Layout mode: mặc định, tập trung ảnh, tập trung text.
- Overlay/brightness nếu ảnh khó đọc.

### 3. Danh mục nổi bật

Admin cần chỉnh được danh sách danh mục hiển thị thay vì cố định 4 mục:

- Tên hiển thị.
- Slug/link danh mục.
- Ảnh.
- Alt text.
- Mô tả ngắn.
- Thứ tự.
- Bật/tắt từng item.

### 4. Sản phẩm nổi bật

Admin cần chỉnh được:

- Tiêu đề section.
- Subtitle.
- Số lượng sản phẩm hiển thị.
- Chế độ chọn sản phẩm:
  - Tự động theo `isFeatured`.
  - Chọn thủ công theo product id.
  - Theo danh mục.
- CTA xem tất cả.
- Hiển thị/ẩn giá theo toàn trang và theo từng sản phẩm.

### 5. Cam kết thương hiệu

Nâng từ mảng cố định 4 mục thành danh sách động:

- Icon hoặc ảnh.
- Tiêu đề.
- Mô tả.
- Thứ tự.
- Bật/tắt từng mục.

### 6. About/Brand story

Admin cần chỉnh được:

- Tiêu đề.
- Nội dung nhiều đoạn.
- Ảnh minh họa nếu cần.
- Quote nổi bật.
- Tên người/nguồn quote nếu có.
- CTA phụ.

### 7. Newsletter

Admin cần chỉnh được:

- Bật/tắt section.
- Tiêu đề.
- Mô tả.
- Placeholder input.
- Text nút submit.
- Thông báo thành công.
- Email nhận đăng ký hoặc webhook/API nhận lead.

### 8. Footer

Admin cần chỉnh được:

- Mô tả thương hiệu.
- Số điện thoại.
- Email.
- Địa chỉ.
- Giờ mở cửa.
- Danh sách link nhanh.
- Social links: Facebook, Instagram, Zalo, Messenger, TikTok nếu cần.
- Copyright text.

### 9. Theme và giao diện

Admin cần chỉnh được:

- Theme preset: luxury silver, rose gold, emerald.
- Màu chính, màu phụ, màu nền, màu chữ.
- Font scale cơ bản.
- Border radius preset.
- Bật/tắt hiệu ứng:
  - 3D parallax.
  - Glow bubbles.
  - Reveal animation.
  - Quick view modal.

## Thiết kế dữ liệu đề xuất

Thay `LandingConfig` hiện tại bằng schema có version để dễ migrate:

```ts
interface LandingConfigV2 {
  version: 2
  status: 'draft' | 'published'
  updatedAt: string
  publishedAt?: string
  global: {
    theme: string
    hideAllPrices: boolean
    effects: {
      enable3DEffects: boolean
      enableGlowBubbles: boolean
      enableRevealAnimation: boolean
    }
    contactLinks: {
      zalo: string
      messenger: string
      hotline: string
      facebook: string
      instagram: string
      tiktok?: string
    }
  }
  sections: {
    hero: HeroSection
    commitments: CommitmentSection
    categories: CategorySection
    featuredProducts: FeaturedProductsSection
    about: AboutSection
    newsletter: NewsletterSection
    footer: FooterSection
  }
}
```

Giữ backward compatibility bằng cách backend tự migrate `landing.json` cũ sang V2 khi đọc.

## Backend cần làm

### Giai đoạn 1: Chuẩn hóa API

- Tạo service `landingConfigService`.
- Tách logic đọc/ghi file khỏi route.
- Thêm validate dữ liệu trước khi ghi.
- Thêm default config để khi file thiếu field vẫn chạy được.
- API đề xuất:
  - `GET /api/landing`: lấy bản published cho website.
  - `GET /api/admin/landing`: lấy bản draft/published cho admin.
  - `PUT /api/admin/landing/draft`: lưu nháp.
  - `POST /api/admin/landing/publish`: xuất bản.
  - `POST /api/admin/landing/rollback`: hoàn tác về bản publish trước.

### Giai đoạn 2: Lưu lịch sử

- Lưu các bản config theo timestamp trong `server/src/data/landing-history/`.
- Mỗi lần publish tạo snapshot.
- Admin xem được lịch sử cơ bản: thời gian, người sửa nếu có user id, trạng thái.

### Giai đoạn 3: Nâng cấp lưu trữ

Khi website ổn định hơn, chuyển từ JSON file sang database:

- Bảng `LandingConfig`.
- Bảng `LandingRevision`.
- Bảng `MediaAsset` nếu muốn quản lý ảnh tập trung.

## Frontend admin cần làm

### Giai đoạn 1: Chia nhỏ form

Tách `src/pages/admin/LandingConfig.tsx` thành:

- `LandingConfigPage`.
- `HeroEditor`.
- `SectionVisibilityEditor`.
- `CategoryGridEditor`.
- `FeaturedProductsEditor`.
- `CommitmentsEditor`.
- `AboutEditor`.
- `NewsletterEditor`.
- `FooterEditor`.
- `ThemeEditor`.
- `ContactLinksEditor`.
- `MediaPicker`.

Lợi ích: dễ sửa, ít lỗi state, dễ thêm field mới.

### Giai đoạn 2: UX quản trị

- Sidebar hoặc tabs theo section.
- Nút `Lưu nháp`, `Xem trước`, `Xuất bản`.
- Trạng thái dirty: cảnh báo khi rời trang mà chưa lưu.
- Validate inline:
  - URL hợp lệ.
  - Email hợp lệ.
  - Số điện thoại/link `tel:` hợp lệ.
  - Ảnh bắt buộc cho section đang bật.
- Preview ảnh sau upload.
- Cho xóa ảnh hoặc thay ảnh.

### Giai đoạn 3: Preview

- Preview desktop/mobile trong admin.
- Preview dùng draft config, không ảnh hưởng website public.
- Có nút mở preview ở tab mới: `/admin/landing/preview`.

## Frontend public cần làm

- Refactor `Home.tsx` thành các section component:
  - `HeroSection`.
  - `CommitmentsSection`.
  - `CategorySection`.
  - `FeaturedProductsSection`.
  - `AboutSection`.
  - `NewsletterSection`.
  - `LandingFooterSection`.
  - `QuickViewModal`.
- Mỗi section nhận config qua props.
- Không để text hardcode trong component, trừ fallback rất ngắn.
- Dùng `enabled` và `order` để render section.
- Footer dùng chung và footer landing dùng cùng nguồn dữ liệu.

## Migration đề xuất

### Bước 1

Giữ API hiện tại, thêm default/fallback đầy đủ để không vỡ website.

### Bước 2

Thêm schema V2 nhưng backend vẫn đọc được schema cũ.

### Bước 3

Refactor admin thành nhiều editor nhỏ, vẫn ghi ra JSON cũ hoặc JSON V2.

### Bước 4

Refactor `Home.tsx` dùng section config mới.

### Bước 5

Thêm draft/publish/rollback.

### Bước 6

Nếu cần, chuyển lưu trữ sang Prisma/database.

## Checklist triển khai

- [ ] Thiết kế `LandingConfigV2`.
- [ ] Tạo default config V2.
- [ ] Tạo migration từ config hiện tại sang V2.
- [ ] Tạo service đọc/ghi/validate config.
- [ ] Tách API public và admin.
- [ ] Tách `LandingConfig.tsx` thành các editor nhỏ.
- [ ] Thêm editor bật/tắt và sắp xếp section.
- [ ] Thêm editor danh mục động.
- [ ] Thêm editor sản phẩm nổi bật.
- [ ] Thêm editor newsletter.
- [ ] Thêm editor footer đầy đủ.
- [ ] Thêm preview draft.
- [ ] Thêm publish/rollback.
- [ ] Refactor `Home.tsx` thành section components.
- [ ] Xóa text hardcode khỏi landing public.
- [ ] Build frontend/server.
- [ ] Index lại codebase sau khi hoàn tất.

## Rủi ro và cách giảm thiểu

- Schema thay đổi làm vỡ landing đang chạy: cần migration và fallback.
- Admin form quá dài, khó dùng: chia tab theo section.
- Config JSON bị ghi lỗi: validate trước khi ghi và lưu backup trước khi overwrite.
- Preview khác public: dùng cùng component render, chỉ khác nguồn config.
- Upload ảnh rải rác khó quản lý: sau giai đoạn đầu nên thêm media library.

## Ưu tiên đề xuất

Làm theo thứ tự:

1. Chuẩn hóa schema và service backend.
2. Refactor admin thành các editor nhỏ.
3. Refactor `Home.tsx` để mọi text/section đọc từ config.
4. Thêm preview.
5. Thêm draft/publish/rollback.
6. Chuyển sang database nếu cần quản trị chuyên nghiệp hơn.
