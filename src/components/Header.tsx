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
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/60 backdrop-blur-xl border-b border-white/80 text-ink shadow-xs">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 md:px-12">
        <Link
          to="/"
          className="font-display text-[22px] font-bold tracking-[1.5px] text-ink no-underline"
        >
          TIỆM BẠC ÁNH XUÂN
        </Link>
        <div className="flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-[14px] font-medium tracking-[0.5px] text-ink no-underline relative py-1 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${
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
