import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ContactWidget from './components/ContactWidget'
import { getLandingConfig } from './api'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProductList from './pages/admin/ProductList'
import ProductNew from './pages/admin/ProductNew'
import ProductEdit from './pages/admin/ProductEdit'
import CategoryList from './pages/admin/CategoryList.tsx'
import LandingConfig from './pages/admin/LandingConfig.tsx'
import AuthGuard from './components/admin/AuthGuard'
import AdminLayout from './components/admin/AdminLayout'

const fallbackTitle = 'Tiệm Bạc Ánh Xuân - Bạc Cao Cấp'
const fallbackFavicon = '/favicon.svg'

function BrowserMeta() {
  useEffect(() => {
    getLandingConfig()
      .then((config) => {
        document.title = config.siteMeta?.title || fallbackTitle

        const href = config.siteMeta?.favicon || fallbackFavicon
        let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
        if (!icon) {
          icon = document.createElement('link')
          icon.rel = 'icon'
          document.head.appendChild(icon)
        }
        icon.href = href
      })
      .catch(console.error)
  }, [])

  return null
}

function PublicLayout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
        </Routes>
      </main>
      {!isHomePage && <Footer />}
      <ContactWidget />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <>
        <BrowserMeta />
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AuthGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductNew />} />
              <Route path="products/:id/edit" element={<ProductEdit />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="landing" element={<LandingConfig />} />
            </Route>
          </Route>
        </Routes>
      </>
    )
  }

  return (
    <>
      <BrowserMeta />
      <PublicLayout />
    </>
  )
}
