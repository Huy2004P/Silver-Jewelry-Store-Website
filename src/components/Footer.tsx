import { useEffect, useState } from 'react'
import { getLandingConfig, type LandingFooter } from '../api'

const fallbackFooter: LandingFooter = {
  desc: 'Bạc Cao Cấp Cao Cấp - Thủ công tinh xảo, đẳng cấp bền vững.',
  phone: '0909 999 999',
  email: 'info@tiembacanhxuan.vn',
  address: '123 Trần Hưng Đạo, Q.1, TP.HCM',
  hours: 'Thứ 2 - Thứ 7: 9:00 - 21:00\nChủ Nhật: 9:00 - 18:00',
}

export default function Footer() {
  const [footer, setFooter] = useState<LandingFooter>(fallbackFooter)

  useEffect(() => {
    getLandingConfig()
      .then((config) => setFooter(config.footer || fallbackFooter))
      .catch(console.error)
  }, [])

  return (
    <footer className="bg-parchment px-5 py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h4 className="font-body text-[14px] font-semibold tracking-[-0.224px] text-ink-muted-48">
              TIỆM BẠC ÁNH XUÂN
            </h4>
            <p className="mt-2 font-body text-[12px] font-normal tracking-[-0.12px] text-ink-muted-48">
              {footer.desc || fallbackFooter.desc}
            </p>
          </div>
          <div>
            <h4 className="font-body text-[14px] font-semibold tracking-[-0.224px] text-ink-muted-48">
              LIÊN HỆ
            </h4>
            <p className="mt-2 font-body text-[12px] font-normal leading-[2.41] tracking-[-0.12px] text-ink-muted-48">
              Điện thoại: {footer.phone || fallbackFooter.phone}
              <br />
              Email: {footer.email || fallbackFooter.email}
              <br />
              Địa chỉ: {footer.address || fallbackFooter.address}
            </p>
          </div>
          <div>
            <h4 className="font-body text-[14px] font-semibold tracking-[-0.224px] text-ink-muted-48">
              GIỜ MỞ CỬA
            </h4>
            <p className="mt-2 whitespace-pre-line font-body text-[12px] font-normal leading-[2.41] tracking-[-0.12px] text-ink-muted-48">
              {footer.hours || fallbackFooter.hours}
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-hairline pt-6 text-center">
          <p className="font-body text-[10px] font-normal tracking-[-0.08px] text-ink-muted-48">
            &copy; {new Date().getFullYear()} Tiệm Bạc Ánh Xuân. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
