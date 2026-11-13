import { useEffect, useState } from 'react'
import { useReducedMotion } from '../lib/hooks'

const EVENTS = [
  { id: 'T1566', label: 'Phishing link opened', sev: 'HIGH', tone: 'high' },
  { id: 'AI-03', label: 'Indirect prompt injection', sev: 'HIGH', tone: 'high' },
  { id: 'T1078', label: 'Valid account reuse', sev: 'MED', tone: 'med' },
  { id: 'T1552', label: 'Secret found in CI logs', sev: 'HIGH', tone: 'high' },
  { id: 'T1098', label: 'OAuth grant persisted', sev: 'MED', tone: 'med' },
  { id: 'T1021', label: 'Lateral movement path', sev: 'MED', tone: 'med' },
  { id: 'AI-07', label: 'Agent tool-call abuse', sev: 'HIGH', tone: 'high' },
  { id: 'T1190', label: 'Public app exploited', sev: 'HIGH', tone: 'high' },
  { id: 'T1486', label: 'Data impact simulated', sev: 'LOW', tone: 'low' },
] as const

export function HeroHud() {
  const reduced = useReducedMotion()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (reduced) return
    const timer = window.setInterval(() => setTick((value) => value + 1), 3400)
    return () => window.clearInterval(timer)
  }, [reduced])

  const rows = [0, 1, 2].map((offset) => {
    const event = EVENTS[(tick + offset) % EVENTS.length]
    return { ...event, key: `${event.id}-${tick}-${offset}` }
  })

  return (
    <aside className="hud" aria-label="Live adversary simulation preview">
      <div className="hud__head">
        <span className="hud__id">
          <span className="live-dot" aria-hidden="true" />
          SIM // 0x7A
        </span>
        <span className="hud__state">ACTIVE</span>
      </div>

      <div className="hud__body">
        <div className="radar" aria-hidden="true">
          <svg viewBox="0 0 132 132">
            <defs>
              <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#5ee1c8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#5ee1c8" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="sweepFill" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5ee1c8" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#5ee1c8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx="66" cy="66" r="60" fill="url(#radarGlow)" />
            {[18, 32, 46, 60].map((radius) => (
              <circle
                key={radius}
                cx="66"
                cy="66"
                r={radius}
                fill="none"
                stroke="rgba(94,225,200,0.16)"
                strokeWidth="0.7"
              />
            ))}
            <path
              d="M66 6v120M6 66h120"
              stroke="rgba(94,225,200,0.12)"
              strokeWidth="0.7"
            />
            <g className="radar-sweep">
              <path d="M66 66 L66 6 A60 60 0 0 1 110 33 Z" fill="url(#sweepFill)" />
              <path d="M66 66V6" stroke="#5ee1c8" strokeOpacity="0.55" strokeWidth="0.9" />
            </g>
            <circle className="radar-blip" cx="94" cy="42" r="2.4" fill="#5ee1c8" />
            <circle className="radar-blip radar-blip--slow" cx="42" cy="84" r="2" fill="#ffb86b" />
            <circle className="radar-blip" cx="78" cy="95" r="1.7" fill="#ff7a6b" />
            <circle cx="66" cy="66" r="2.2" fill="#eef2e7" />
          </svg>
          <span className="radar__label">SURFACE</span>
        </div>

        <div className="hud__feed" aria-hidden="true">
          <div className="hud__feed-label">EVENT STREAM</div>
          {rows.map((row) => (
            <div className={`feed-row feed-row--${row.tone}`} key={row.key}>
              <div className="feed-row__top">
                <span className="feed-row__id">{row.id}</span>
                <span className="feed-row__sev">{row.sev}</span>
              </div>
              <span className="feed-row__name">{row.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hud__foot">
        <div>
          <span>PATHS</span>
          <strong>07</strong>
        </div>
        <div>
          <span>CRITICAL</span>
          <strong className="is-hot">03</strong>
        </div>
        <div>
          <span>TARGETS</span>
          <strong>214</strong>
        </div>
      </div>
    </aside>
  )
}
