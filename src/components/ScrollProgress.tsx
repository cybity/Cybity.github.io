import { useEffect, useRef } from 'react'

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const bar = ref.current
      if (!bar) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max <= 0 ? 0 : Math.min(1, window.scrollY / max)
      bar.style.transform = `scaleX(${progress})`
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div className="scroll-progress" ref={ref} aria-hidden="true" />
}
