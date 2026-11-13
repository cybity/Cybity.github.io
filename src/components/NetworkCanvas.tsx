import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../lib/hooks'

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  hub: string | null
}

const HUB_LABELS = ['EDGE', 'IDENTITY', 'LLM', 'API', 'DATA']

export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let nodes: Node[] = []
    const pointer = { x: -9999, y: -9999, active: false }
    let frame = 0
    let started = performance.now()

    const seed = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.max(30, Math.min(84, Math.round((width * height) / 19000)))
      nodes = Array.from({ length: count }, (_, index) => {
        const isHub = index < HUB_LABELS.length
        return {
          x: Math.random() * width,
          y: isHub
            ? height * (0.18 + Math.random() * 0.62)
            : Math.random() * height,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          r: Math.random() * 1.6 + 0.6,
          hub: isHub ? HUB_LABELS[index] : null,
        }
      })
      started = performance.now()
    }

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height)
      const maxDistance = width < 700 ? 110 : 150
      const elapsed = (now - started) / 1000

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i]
        if (!reduced) {
          node.x += node.vx
          node.y += node.vy
          if (node.x < -20) node.x = width + 20
          if (node.x > width + 20) node.x = -20
          if (node.y < -20) node.y = height + 20
          if (node.y > height + 20) node.y = -20

          const dx = node.x - pointer.x
          const dy = node.y - pointer.y
          const distance = Math.hypot(dx, dy)
          if (pointer.active && distance < 170 && distance > 0.01) {
            const force = ((170 - distance) / 170) * 0.5
            node.x += (dx / distance) * force
            node.y += (dy / distance) * force
          }
        }

        for (let j = i + 1; j < nodes.length; j += 1) {
          const other = nodes[j]
          const dx = node.x - other.x
          const dy = node.y - other.y
          const distance = Math.hypot(dx, dy)
          if (distance > maxDistance) continue
          const alpha = (1 - distance / maxDistance) * 0.16
          const nearPointer =
            pointer.active &&
            Math.hypot(
              (node.x + other.x) / 2 - pointer.x,
              (node.y + other.y) / 2 - pointer.y,
            ) < 220
          ctx.strokeStyle = nearPointer
            ? `rgba(201, 242, 78, ${alpha * 2.1})`
            : `rgba(235, 240, 226, ${alpha})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        }
      }

      for (const node of nodes) {
        if (node.hub) {
          const pulse = reduced ? 0 : Math.sin(elapsed * 1.4 + node.x * 0.01) * 1.1
          ctx.strokeStyle = `rgba(201, 242, 78, ${0.42 + pulse * 0.08})`
          ctx.lineWidth = 0.9
          ctx.beginPath()
          ctx.arc(node.x, node.y, 7 + pulse, 0, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = 'rgba(201, 242, 78, 0.9)'
          ctx.beginPath()
          ctx.arc(node.x, node.y, 1.8, 0, Math.PI * 2)
          ctx.fill()
          if (width > 760) {
            const flip = node.x > width - 110
            ctx.font = '9px "IBM Plex Mono", monospace'
            ctx.fillStyle = 'rgba(201, 242, 78, 0.5)'
            ctx.textAlign = flip ? 'right' : 'left'
            ctx.fillText(node.hub, node.x + (flip ? -12 : 12), node.y + 3)
            ctx.textAlign = 'left'
          }
        } else {
          ctx.fillStyle = 'rgba(235, 240, 226, 0.38)'
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (!reduced) frame = requestAnimationFrame(draw)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = true
    }
    const onPointerLeave = () => {
      pointer.active = false
    }

    seed()
    started = performance.now()
    draw(started)
    const onResize = () => {
      seed()
      started = performance.now()
      draw(started)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
}
