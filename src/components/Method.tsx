import { useEffect, useState, type CSSProperties } from 'react'
import { methodSteps } from '../lib/content'
import { useReducedMotion } from '../lib/hooks'
import { Reset } from './Icons'
import { SectionHead } from './SectionHead'

const PREFIX = {
  cmd: '$',
  ok: '✓',
  warn: '!',
  info: '·',
  out: '→',
} as const

export function Method() {
  const [active, setActive] = useState(0)
  const [runId, setRunId] = useState(0)
  const [visible, setVisible] = useState(0)
  const reduced = useReducedMotion()
  const step = methodSteps[active]

  useEffect(() => {
    setVisible(0)
    if (reduced) {
      setVisible(step.logs.length)
      return
    }
    const timer = window.setInterval(() => {
      setVisible((value) => {
        if (value >= step.logs.length) {
          window.clearInterval(timer)
          return value
        }
        return value + 1
      })
    }, 260)
    return () => window.clearInterval(timer)
  }, [active, runId, reduced, step.logs.length])

  return (
    <section className="section section--method" id="method">
      <div className="container">
        <SectionHead
          index="03"
          label="Method"
          title={
            <>
              Six weeks.
              <br />
              <em>Zero guesswork.</em>
            </>
          }
          intro="A tight, repeatable operation. You always know what we are doing, what we have found, and what it means — from the first scoping call to the retest."
          aside={<span className="mono-label">05 phases / one report</span>}
        />

        <div className="method-grid">
          <div className="method-steps reveal">
            {methodSteps.map((item, index) => {
              const isActive = index === active
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`method-step${isActive ? ' is-active' : ''}`}
                  onClick={() => {
                    setActive(index)
                    setRunId((value) => value + 1)
                  }}
                  aria-pressed={isActive}
                >
                  <span className="method-step__index">{item.index}</span>
                  <span className="method-step__body">
                    <span className="method-step__title">{item.title}</span>
                    <span className="method-step__window">{item.window}</span>
                  </span>
                  <span className="method-step__dot" aria-hidden="true" />
                </button>
              )
            })}
            <div className="method-steps__foot">
              <span className="mono-label">Every phase is evidenced.</span>
              <span className="mono-label">Nothing is theoretical.</span>
            </div>
          </div>

          <div className="console reveal" style={{ '--delay': '0.1s' } as CSSProperties}>
            <div className="console__bar">
              <div className="console__lights" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span className="console__path">cybity@ops: ~/engagements/acme</span>
              <span className="console__run">
                RUN {String(active + 1).padStart(2, '0')}/05
              </span>
            </div>

            <div className="console__body">
              <div className="console__summary">
                <span className="mono-label">Phase {step.index}</span>
                <p>{step.summary}</p>
              </div>

              <div className="console__log" aria-live="polite">
                {step.logs.slice(0, visible).map((line, index) => (
                  <div className={`console__line console__line--${line.kind}`} key={`${runId}-${index}`}>
                    <span className="console__prefix">{PREFIX[line.kind]}</span>
                    <span>{line.text}</span>
                  </div>
                ))}
                <span className="console__cursor" aria-hidden="true">
                  █
                </span>
              </div>
            </div>

            <div className="console__foot">
              <div className="console__metrics">
                {step.metric.map((metric) => (
                  <div key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="console__replay"
                onClick={() => setRunId((value) => value + 1)}
              >
                <Reset size={12} />
                Replay
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
