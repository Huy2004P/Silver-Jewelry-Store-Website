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
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Danh sách các liên kết liên hệ con */}
      {isOpen && (
        <div className="flex max-w-full flex-col items-end gap-3 transition-all duration-300 animate-[fadeIn_0.2s_ease-out]">
          {zalo && (
            <a
              href={zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex max-w-full items-center gap-2.5 rounded-full border border-white/80 bg-white/90 px-4 py-2.5 font-body text-[13px] font-bold text-ink shadow-lg backdrop-blur-xl transition-all duration-300 no-underline hover:scale-105 hover:bg-white"
            >
              <span className="text-[16px] text-blue-500">🔵</span> Chat Zalo
            </a>
          )}
          {messenger && (
            <a
              href={messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="flex max-w-full items-center gap-2.5 rounded-full border border-white/80 bg-white/90 px-4 py-2.5 font-body text-[13px] font-bold text-ink shadow-lg backdrop-blur-xl transition-all duration-300 no-underline hover:scale-105 hover:bg-white"
            >
              <span className="text-[16px] text-indigo-500">⚡</span> Messenger
            </a>
          )}
          {hotline && (
            <a
              href={hotline}
              className="flex max-w-full items-center gap-2.5 rounded-full border border-white/80 bg-white/90 px-4 py-2.5 font-body text-[13px] font-bold text-ink shadow-lg backdrop-blur-xl transition-all duration-300 no-underline hover:scale-105 hover:bg-white"
            >
              <span className="text-[16px] text-green-500">📞</span> Hotline
            </a>
          )}
        </div>
      )}

      {/* Nút bấm chính có vòng sóng lan tỏa */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-action-blue text-white shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
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
