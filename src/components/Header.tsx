import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Sản Phẩm', path: '/products' },
]

export default function Header() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) return null

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 min-h-16 border-b border-white/80 bg-white/70 text-ink shadow-xs backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 py-2 sm:px-6 md:px-12">
        <Link
          to="/"
          className="min-w-0 flex-1 truncate font-display text-[18px] font-bold tracking-[1px] text-ink no-underline sm:text-[22px] sm:tracking-[1.5px]"
        >
          <span className="sm:hidden">ÁNH XUÂN</span>
          <span className="hidden sm:inline">TIỆM BẠC ÁNH XUÂN</span>
        </Link>
        <div className="flex shrink-0 items-center gap-4 sm:gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 font-body text-[13px] font-medium tracking-[0.2px] text-ink no-underline transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 sm:text-[14px] sm:tracking-[0.5px] ${
                  isActive ? 'after:scale-x-100 font-semibold text-action-blue' : 'opacity-80 hover:opacity-100'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
