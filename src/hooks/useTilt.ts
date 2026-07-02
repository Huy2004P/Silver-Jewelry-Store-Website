import { useEffect, useRef } from 'react'

export function useTilt(active: boolean = true) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !active) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const xc = rect.width / 2
      const yc = rect.height / 2
      
      const dx = x - xc
      const dy = y - yc
      
      // Góc nghiêng tối đa là 10 độ
      const tiltX = (dy / yc) * -10
      const tiltY = (dx / xc) * 10

      el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    
    // Tạo cảm giác mượt mà khi di chuyển chuột
    el.style.transition = 'transform 0.15s ease-out'

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
      el.style.transform = ''
      el.style.transition = ''
    }
  }, [active])

  return ref
}
