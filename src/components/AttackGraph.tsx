import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { attack } from '../lib/attack'
import type { Technique } from '../lib/types'
import { useReducedMotion } from '../lib/hooks'
import { Minus, Plus, Reset } from './Icons'

const W = 1600
const H = 1000
const CX = W / 2
const CY = H / 2
const HUB_RX = 560
const HUB_RY = 340

const TACTIC_COLORS = [
  '#ff8a75',
  '#ffb06b',
  '#f0d264',
  '#c9f24e',
  '#9be36f',
  '#5ee1c8',
  '#4fd0e8',
  '#6cb8ff',
  '#8ba7ff',
  '#b18aff',
  '#d08aff',
  '#ff8fb8',
  '#ff6b9d',
  '#ff7a6b',
  '#ffa06b',
]

const colorByTactic = new Map(
  attack.tactics.map((tactic, index) => [
    tactic.short,
    TACTIC_COLORS[index % TACTIC_COLORS.length],
  ]),
)

function withAlpha(hex: string, alpha: number): string {
  const value = Number.parseInt(hex.slice(1), 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

type GraphNode = {
  id: string
  kind: 'hub' | 'tech'
  x: number
  y: number
  label: string
  tactic?: string
  technique?: Technique
  heat?: number
  count?: number
}

type Edge = {
  a: GraphNode
  b: GraphNode
  secondary: boolean
}

type Graph = {
  nodes: GraphNode[]
  hubs: GraphNode[]
  edges: Edge[]
  adjacency: Map<string, Set<string>>
  countsByHub: Map<string, number>
}

function nodeColor(node: GraphNode): string {
  const short = node.kind === 'hub' ? node.tactic : node.technique?.tactics[0]
  return (short && colorByTactic.get(short)) || '#c9f24e'
}

function buildGraph(): Graph {
  const nodes: GraphNode[] = []
  const hubs: GraphNode[] = []
  const hubByTactic = new Map<string, GraphNode>()

  attack.tactics.forEach((tactic, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / attack.tactics.length
    const hub: GraphNode = {
      id: `hub-${tactic.short}`,
      kind: 'hub',
      x: CX + Math.cos(angle) * HUB_RX,
      y: CY + Math.sin(angle) * HUB_RY,
      label: tactic.label,
      tactic: tactic.short,
      count: 0,
    }
    hubs.push(hub)
    hubByTactic.set(tactic.short, hub)
    nodes.push(hub)
  })

  const byPrimary = new Map<string, Technique[]>()
  for (const technique of attack.techniques) {
    const primary = technique.tactics[0] ?? 'impact'
    const list = byPrimary.get(primary) ?? []
    list.push(technique)
    byPrimary.set(primary, list)
  }

  byPrimary.forEach((techniques, short) => {
    const hub = hubByTactic.get(short)
    if (!hub) return
    hub.count = techniques.length
    const clusterIndex = attack.tactics.findIndex((tactic) => tactic.short === short)

    techniques.forEach((technique, index) => {
      const ring = index < 6 ? 0 : index < 18 ? 1 : 2
      const radius = [34, 50, 66][ring]
      const angle = index * 2.399963 + clusterIndex * 0.83 + ring * 0.65
      nodes.push({
        id: technique.id,
        kind: 'tech',
        x: hub.x + Math.cos(angle) * radius,
        y: hub.y + Math.sin(angle) * radius,
        label: technique.name,
        technique,
        heat: technique.heat,
      })
    })
  })

  const edges: Edge[] = []
  const adjacency = new Map<string, Set<string>>()
  const link = (a: string, b: string) => {
    const set = adjacency.get(a) ?? new Set<string>()
    set.add(b)
    adjacency.set(a, set)
  }

  const techNodes = nodes.filter((node) => node.kind === 'tech')
  for (const node of techNodes) {
    const technique = node.technique
    if (!technique) continue
    technique.tactics.forEach((short, index) => {
      const hub = hubByTactic.get(short)
      if (!hub) return
      edges.push({ a: hub, b: node, secondary: index > 0 })
      link(hub.id, node.id)
      link(node.id, hub.id)
    })
  }

  const countsByHub = new Map<string, number>()
  byPrimary.forEach((techniques, short) => countsByHub.set(short, techniques.length))

  return { nodes, hubs, edges, adjacency, countsByHub }
}

type Props = {
  selectedId: string | null
  onSelect: (technique: Technique) => void
}

export function AttackGraph({ selectedId, onSelect }: Props) {
  const graph = useMemo(buildGraph, [])
  const boardRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reduced = useReducedMotion()
  const [hover, setHover] = useState<{ node: GraphNode; x: number; y: number } | null>(
    null,
  )
  const hoverRef = useRef<GraphNode | null>(null)
  const view = useRef({ zoom: 1, panX: 0, panY: 0 })
  const renderRef = useRef({ scale: 1, ox: 0, oy: 0 })
  const visibleRef = useRef(true)
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    const board = boardRef.current
    if (!board) return
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
    })
    observer.observe(board)
    return () => observer.disconnect()
  }, [])

  const zoomAt = useCallback((factor: number, sx: number, sy: number) => {
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const fit = Math.min(rect.width / W, rect.height / H)
    const current = view.current
    const scale0 = fit * current.zoom
    const worldX = (sx - W / 2 - current.panX) / scale0 + W / 2
    const worldY = (sy - H / 2 - current.panY) / scale0 + H / 2
    const zoom1 = Math.min(4, Math.max(0.65, current.zoom * factor))
    const scale1 = fit * zoom1
    current.zoom = zoom1
    current.panX = sx - W / 2 - (worldX - W / 2) * scale1
    current.panY = sy - H / 2 - (worldY - H / 2) * scale1
    hoverRef.current = null
    setHover(null)
  }, [])

  const zoomCenter = (factor: number) => {
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    zoomAt(factor, rect.width / 2, rect.height / 2)
  }

  const reset = () => {
    view.current = { zoom: 1, panX: 0, panY: 0 }
    hoverRef.current = null
    setHover(null)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const board = boardRef.current
    if (!canvas || !board) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let cw = 0
    let ch = 0
    let dpr = 1
    const drag = {
      active: false,
      sx: 0,
      sy: 0,
      panX: 0,
      panY: 0,
      moved: 0,
    }

    const findNode = (sx: number, sy: number): GraphNode | null => {
      const { scale, ox, oy } = renderRef.current
      let best: GraphNode | null = null
      let bestDistance = Infinity
      for (const node of graph.nodes) {
        const x = ox + node.x * scale
        const y = oy + node.y * scale
        const distance = Math.hypot(sx - x, sy - y)
        const hit = node.kind === 'hub' ? 12 : Math.max(7, 4 + (node.heat ?? 0) / 30)
        if (distance < hit && distance < bestDistance) {
          best = node
          bestDistance = distance
        }
      }
      return best
    }

    const setHovered = (node: GraphNode | null) => {
      if (hoverRef.current?.id === node?.id) return
      hoverRef.current = node
      if (!node) {
        setHover(null)
        return
      }
      const { scale, ox, oy } = renderRef.current
      const x = ox + node.x * scale
      const y = oy + node.y * scale
      const rect = board.getBoundingClientRect()
      setHover({
        node,
        x: Math.max(130, Math.min(x, rect.width - 130)),
        y: Math.max(70, Math.min(y, rect.height - 70)),
      })
    }

    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        frame = requestAnimationFrame(draw)
        return
      }
      if (rect.width !== cw || rect.height !== ch) {
        cw = rect.width
        ch = rect.height
        dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.floor(cw * dpr)
        canvas.height = Math.floor(ch * dpr)
      }
      if (!visibleRef.current) {
        frame = requestAnimationFrame(draw)
        return
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cw, ch)

      const fit = Math.min(cw / W, ch / H)
      const scale = fit * view.current.zoom
      const ox = cw / 2 - (W / 2) * scale + view.current.panX
      const oy = ch / 2 - (H / 2) * scale + view.current.panY
      renderRef.current = { scale, ox, oy }

      const toX = (x: number) => ox + x * scale
      const toY = (y: number) => oy + y * scale
      const activeId = hoverRef.current?.id ?? selectedId ?? null
      const activeNode = activeId
        ? graph.nodes.find((node) => node.id === activeId) ?? null
        : null
      const activeColor = activeNode ? nodeColor(activeNode) : '#c9f24e'

      // Orbital guide
      ctx.beginPath()
      ctx.ellipse(toX(CX), toY(CY), HUB_RX * scale, HUB_RY * scale, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(235, 240, 225, 0.06)'
      ctx.setLineDash([2, 8])
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.setLineDash([])

      // Hub center mark
      const centerX = toX(CX)
      const centerY = toY(CY)
      ctx.fillStyle = 'rgba(235, 240, 225, 0.28)'
      ctx.font = '500 9px "IBM Plex Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('CYBITY // ADVERSARY MAP', centerX, centerY - 8)
      ctx.fillStyle = 'rgba(235, 240, 225, 0.16)'
      ctx.fillText(`${attack.counts.techniques} TECHNIQUES`, centerX, centerY + 8)

      // Edges
      for (const edge of graph.edges) {
        const active =
          activeId !== null && (edge.a.id === activeId || edge.b.id === activeId)
        const ax = toX(edge.a.x)
        const ay = toY(edge.a.y)
        const bx = toX(edge.b.x)
        const by = toY(edge.b.y)
        if (activeId) {
          ctx.strokeStyle = active
            ? withAlpha(activeColor, 0.45)
            : 'rgba(235, 240, 225, 0.025)'
          ctx.lineWidth = active ? 1 : 0.5
        } else {
          ctx.strokeStyle = edge.secondary
            ? 'rgba(235, 240, 225, 0.045)'
            : 'rgba(235, 240, 225, 0.09)'
          ctx.lineWidth = edge.secondary ? 0.5 : 0.7
        }
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(bx, by)
        ctx.stroke()
      }

      const related = activeId ? graph.adjacency.get(activeId) : undefined

      // Technique nodes
      for (const node of graph.nodes) {
        if (node.kind !== 'tech') continue
        const x = toX(node.x)
        const y = toY(node.y)
        const heat = node.heat ?? 40
        const t = heat / 100
        const radius = 1.8 + heat / 42
        const isActive = node.id === activeId
        const isRelated = related?.has(node.id) ?? false
        const base = nodeColor(node)
        const fill = isActive
          ? withAlpha(base, 1)
          : isRelated
            ? withAlpha(base, 0.95)
            : withAlpha(base, 0.3 + t * 0.55)
        ctx.beginPath()
        ctx.arc(x, y, radius + (isActive ? 1.6 : 0), 0, Math.PI * 2)
        ctx.fillStyle = fill
        ctx.fill()
        if (isActive) {
          ctx.beginPath()
          ctx.arc(x, y, radius + 5, 0, Math.PI * 2)
          ctx.strokeStyle = withAlpha(base, 0.7)
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Tactics hubs
      for (const hub of graph.hubs) {
        const x = toX(hub.x)
        const y = toY(hub.y)
        const isActive = hub.id === activeId
        const isRelated = related?.has(hub.id) ?? false
        const color = nodeColor(hub)
        const pulse = reduced ? 0 : Math.sin(now / 900 + hub.x * 0.01) * 0.7

        ctx.beginPath()
        ctx.arc(x, y, 10 + pulse, 0, Math.PI * 2)
        ctx.strokeStyle = isActive
          ? withAlpha(color, 0.95)
          : isRelated
            ? withAlpha(color, 0.6)
            : withAlpha(color, 0.3)
        ctx.lineWidth = 0.8
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, 5.2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(7, 8, 9, 0.95)'
        ctx.fill()
        ctx.strokeStyle = withAlpha(color, 0.85)
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        const dx = hub.x - CX
        const dy = hub.y - CY
        const length = Math.hypot(dx, dy) || 1
        const labelOffset = 66 * scale + 14
        const lx = x + (dx / length) * labelOffset
        const ly = y + (dy / length) * labelOffset
        ctx.font = '500 9.5px "IBM Plex Mono", monospace'
        ctx.textAlign = dx < -30 ? 'right' : dx > 30 ? 'left' : 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = isActive
          ? color
          : isRelated
            ? 'rgba(230, 240, 220, 0.85)'
            : 'rgba(230, 240, 225, 0.5)'
        ctx.fillText(hub.label.toUpperCase(), lx, ly)
      }

      // Travelling packets
      if (!reduced && !activeId) {
        graph.hubs.forEach((hub, index) => {
          const edges = graph.edges.filter(
            (edge) => edge.a.id === hub.id && !edge.secondary,
          )
          if (edges.length === 0) return
          const edge = edges[index % edges.length]
          const phase = (now / 4600 + index * 0.117) % 1
          const px = toX(hub.x + (edge.b.x - hub.x) * phase)
          const py = toY(hub.y + (edge.b.y - hub.y) * phase)
          ctx.beginPath()
          ctx.arc(px, py, 1.4, 0, Math.PI * 2)
          ctx.fillStyle = withAlpha(nodeColor(hub), Math.sin(phase * Math.PI) * 0.7)
          ctx.fill()
        })
      }

      frame = requestAnimationFrame(draw)
    }

    const onPointerDown = (event: PointerEvent) => {
      drag.active = true
      drag.sx = event.clientX
      drag.sy = event.clientY
      drag.panX = view.current.panX
      drag.panY = view.current.panY
      drag.moved = 0
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = 'grabbing'
      setHovered(null)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const sx = event.clientX - rect.left
      const sy = event.clientY - rect.top
      if (drag.active) {
        const dx = event.clientX - drag.sx
        const dy = event.clientY - drag.sy
        drag.moved = Math.max(drag.moved, Math.hypot(dx, dy))
        view.current.panX = drag.panX + dx
        view.current.panY = drag.panY + dy
        return
      }
      const node = findNode(sx, sy)
      setHovered(node)
      canvas.style.cursor = node ? 'pointer' : 'grab'
    }

    const onPointerUp = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const sx = event.clientX - rect.left
      const sy = event.clientY - rect.top
      const wasDrag = drag.moved > 5
      drag.active = false
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId)
      }
      canvas.style.cursor = 'grab'
      if (wasDrag) return
      const node = findNode(sx, sy)
      if (!node) return
      if (node.kind === 'hub') {
        const fit = Math.min(rect.width / W, rect.height / H)
        const zoom = 1.9
        const scale = fit * zoom
        view.current.zoom = zoom
        view.current.panX = (W / 2 - node.x) * scale
        view.current.panY = (H / 2 - node.y) * scale
        setHovered(null)
        return
      }
      if (node.technique) {
        onSelectRef.current(node.technique)
      }
    }

    const onPointerLeave = () => {
      drag.active = false
      setHovered(null)
      canvas.style.cursor = 'grab'
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const factor = event.deltaY < 0 ? 1.12 : 0.9
      zoomAt(
        factor,
        event.clientX - rect.left,
        event.clientY - rect.top,
      )
    }

    frame = requestAnimationFrame(draw)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerLeave)
    canvas.addEventListener('pointerleave', onPointerLeave)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      cancelAnimationFrame(frame)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerLeave)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [graph, reduced, selectedId, zoomAt])

  const hoverTactic = hover?.node.tactic
  const hoverCount = hoverTactic ? graph.countsByHub.get(hoverTactic) ?? 0 : 0
  const hoverColor = hover ? nodeColor(hover.node) : undefined

  return (
    <div className="attack-graph" ref={boardRef}>
      <canvas
        ref={canvasRef}
        className="attack-graph__canvas"
        role="img"
        aria-label={`Interactive MITRE ATT&CK constellation with ${attack.counts.tactics} tactic hubs and ${attack.counts.techniques} techniques. Use the matrix view for a fully accessible list.`}
      />

      <div className="graph-ui">
        <div className="graph-ui__status">
          <span className="mono-label">Constellation / enterprise</span>
          <strong>
            {attack.counts.tactics} hubs <span>/</span> {attack.counts.techniques} techniques
          </strong>
        </div>
        <div className="graph-controls">
          <button type="button" onClick={() => zoomCenter(1.35)} aria-label="Zoom in">
            <Plus />
          </button>
          <button type="button" onClick={() => zoomCenter(0.75)} aria-label="Zoom out">
            <Minus />
          </button>
          <button type="button" onClick={reset} aria-label="Reset view">
            <Reset />
          </button>
        </div>
      </div>

      <div className="graph-hint">
        <span>Drag to pan</span>
        <i aria-hidden="true">/</i>
        <span>Scroll to zoom</span>
        <i aria-hidden="true">/</i>
        <span>Click a node to inspect</span>
      </div>

      {hover && (
        <div
          className="graph-tip"
          style={{ left: hover.x, top: hover.y, '--tone': hoverColor } as CSSProperties}
          role="status"
        >
          <span className="graph-tip__kind">
            <i className="graph-tip__tone" aria-hidden="true" />
            {hover.node.kind === 'hub' ? `TACTIC · ${hoverCount} techniques` : hover.node.id}
          </span>
          <strong>{hover.node.label}</strong>
          {hover.node.kind === 'tech' ? (
            <span className="graph-tip__meta">
              Activity {hover.node.heat} · {hover.node.technique?.subs.length ?? 0} sub-techniques
            </span>
          ) : (
            <span className="graph-tip__meta">Click to focus this cluster</span>
          )}
        </div>
      )}
    </div>
  )
}
