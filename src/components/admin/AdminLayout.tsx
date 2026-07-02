import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

const menuItems = [
  { label: 'Sản phẩm', path: '/admin/products' },
  { label: 'Danh mục', path: '/admin/categories' },
  { label: 'Cấu hình Landing Page', path: '/admin/landing' },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-parchment">
      <aside className="w-56 shrink-0 border-r border-hairline bg-canvas p-6">
        <h2 className="font-display text-[20px] font-semibold text-ink">Admin</h2>
        <p className="mt-1 font-body text-[12px] text-ink-muted-48">Tiệm Bạc Ánh Xuân</p>
        <nav className="mt-8 flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-[8px] px-3 py-2 font-body text-[14px] no-underline ${
                location.pathname.startsWith(item.path)
                  ? 'bg-action-blue/10 text-action-blue'
                  : 'text-ink hover:bg-parchment'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 rounded-[8px] px-3 py-2 text-left font-body text-[14px] text-ink-muted-48 hover:bg-parchment"
          >
            Đăng xuất
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
