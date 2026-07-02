import { useState, useEffect } from 'react'
import { getLandingConfig, type LandingConfig } from '../api'

export default function ContactWidget() {
  const [config, setConfig] = useState<LandingConfig | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    getLandingConfig()
      .then(setConfig)
      .catch(console.error)
  }, [])

  if (!config || !config.contactLinks) return null

  const { zalo, messenger, hotline } = config.contactLinks

  // Nếu không cấu hình link nào, không hiển thị widget
  if (!zalo && !messenger && !hotline) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Danh sách các liên kết liên hệ con */}
      {isOpen && (
        <div className="flex flex-col gap-3 items-end transition-all duration-300 animate-[fadeIn_0.2s_ease-out]">
          {zalo && (
            <a
              href={zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-full border border-white/80 bg-white/90 px-4 py-2.5 font-body text-[13px] font-bold text-ink shadow-lg backdrop-blur-xl hover:scale-105 hover:bg-white transition-all duration-300 no-underline"
            >
              <span className="text-[16px] text-blue-500">🔵</span> Chat Zalo
            </a>
          )}
          {messenger && (
            <a
              href={messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-full border border-white/80 bg-white/90 px-4 py-2.5 font-body text-[13px] font-bold text-ink shadow-lg backdrop-blur-xl hover:scale-105 hover:bg-white transition-all duration-300 no-underline"
            >
              <span className="text-[16px] text-indigo-500">⚡</span> Messenger
            </a>
          )}
          {hotline && (
            <a
              href={hotline}
              className="flex items-center gap-2.5 rounded-full border border-white/80 bg-white/90 px-4 py-2.5 font-body text-[13px] font-bold text-ink shadow-lg backdrop-blur-xl hover:scale-105 hover:bg-white transition-all duration-300 no-underline"
            >
              <span className="text-[16px] text-green-500">📞</span> Hotline
            </a>
          )}
        </div>
      )}

      {/* Nút bấm chính có vòng sóng lan tỏa */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-action-blue text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full bg-action-blue/30 animate-ping opacity-70 pointer-events-none" />
        
        {isOpen ? (
          <span className="text-[22px] font-light">&times;</span>
        ) : (
          <span className="text-[18px]">✨</span>
        )}
      </button>
    </div>
  )
}
