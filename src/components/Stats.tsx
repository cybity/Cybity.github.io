import type { CSSProperties } from 'react'
import { stats } from '../lib/content'
import { useCountUp, useInView } from '../lib/hooks'

function Stat({
  value,
  suffix,
  label,
  detail,
  tone,
  active,
}: {
  value: number
  suffix: string
  label: string
  detail: string
  tone: string
  active: boolean
}) {
  const count = useCountUp(value, active)
  return (
    <div className="stat" style={{ '--tone': tone } as CSSProperties}>
      <div className="stat__value">
        {count.toLocaleString('en-US')}
        <span>{suffix}</span>
      </div>
      <div className="stat__label">{label}</div>
      <div className="stat__detail">{detail}</div>
    </div>
  )
}

export function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3)

  return (
    <section className="stats" aria-label="Cybity in numbers" ref={ref}>
      <div className="container stats__grid">
        {stats.map((stat) => (
          <Stat key={stat.label} {...stat} active={inView} />
        ))}
      </div>
    </section>
  )
}
