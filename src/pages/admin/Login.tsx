import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await login(email, password)
      localStorage.setItem('admin_token', token)
      navigate('/admin/products')
    } catch {
      setError('Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4 py-8 sm:px-5">
      <div className="w-full max-w-md rounded-[18px] border border-hairline bg-canvas p-6 sm:p-8">
        <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">Đăng nhập Admin</h1>
        <p className="mt-2 font-body text-[14px] text-ink-muted-48">Tiệm Bạc Ánh Xuân</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="font-body text-[14px] text-ink-muted-48">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-[8px] border border-hairline px-4 py-2 font-body text-[17px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-body text-[14px] text-ink-muted-48">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-[8px] border border-hairline px-4 py-2 font-body text-[17px] text-ink outline-none focus:ring-2 focus:ring-action-blue-focus"
            />
          </div>
          {error && (
            <p className="font-body text-[14px] text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-action-blue px-6 py-3 font-body text-[17px] text-white transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  )
}
