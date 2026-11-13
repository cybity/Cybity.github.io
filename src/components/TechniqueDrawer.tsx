import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { attack, serviceColor, serviceLabel, tacticByShort } from '../lib/attack'
import type { Technique } from '../lib/types'
import { ArrowUpRight, Check, Close, Copy } from './Icons'

type Props = {
  technique: Technique | null
  onClose: () => void
  onFocusTactic: (tactic: string) => void
}

export function TechniqueDrawer({ technique, onClose, onFocusTactic }: Props) {
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!technique) {
      triggerRef.current?.focus?.()
      triggerRef.current = null
      return
    }
    setCopied(false)
    triggerRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [technique, onClose])

  const copyId = async () => {
    if (!technique) return
    try {
      await navigator.clipboard.writeText(technique.id)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const baseId = technique?.id.split('.')[0]

  return (
    <>
      <div
        className={`drawer-backdrop${technique ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`drawer${technique ? ' is-open' : ''}`}
        role="dialog"
        aria-modal={technique ? true : undefined}
        aria-label={technique ? `${technique.id} ${technique.name}` : 'Technique details'}
        aria-hidden={!technique}
      >
        {technique && (
          <>
            <div className="drawer__head">
              <div className="drawer__label">
                <span className="mono-label">Technique</span>
                <span className="drawer__source">
                  MITRE ATT&amp;CK® · v{attack.version}
                </span>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="icon-btn"
                onClick={onClose}
                aria-label="Close technique details"
              >
                <Close />
              </button>
            </div>

            <div className="drawer__scroll">
              <div className="drawer__ident">
                <span className="drawer__id">{technique.id}</span>
                <div className="drawer__heat" title="Illustrative activity index">
                  <span>Activity index</span>
                  <div className="heat-meter">
                    <span style={{ width: `${technique.heat}%` }} />
                  </div>
                  <strong>{technique.heat}</strong>
                </div>
              </div>

              <h3>{technique.name}</h3>

              <div className="drawer__tactics">
                {technique.tactics.map((short) => {
                  const tactic = tacticByShort[short]
                  if (!tactic) return null
                  return (
                    <button
                      key={short}
                      type="button"
                      onClick={() => onFocusTactic(short)}
                      title={`Focus the ${tactic.name} column`}
                    >
                      {tactic.label}
                      <ArrowUpRight size={10} />
                    </button>
                  )
                })}
              </div>

              <p className="drawer__desc">{technique.desc}</p>

              <div className="drawer__section">
                <div className="drawer__section-head">
                  <span className="mono-label">Platforms</span>
                  <span>{technique.platforms.length.toString().padStart(2, '0')}</span>
                </div>
                <div className="drawer__chips">
                  {technique.platforms.map((platform) => (
                    <span key={platform}>{platform}</span>
                  ))}
                </div>
              </div>

              <div className="drawer__section">
                <div className="drawer__section-head">
                  <span className="mono-label">Cybity services</span>
                  <span>{technique.services.length.toString().padStart(2, '0')}</span>
                </div>
                <div className="drawer__chips drawer__chips--accent">
                  {technique.services.map((service) => (
                    <span
                      key={service}
                      style={{ '--svc': serviceColor[service] } as CSSProperties}
                    >
                      {serviceLabel[service] ?? service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="drawer__section">
                <div className="drawer__section-head">
                  <span className="mono-label">Sub-techniques</span>
                  <span>{technique.subs.length.toString().padStart(2, '0')}</span>
                </div>
                {technique.subs.length === 0 ? (
                  <p className="drawer__empty">
                    No sub-techniques for this entry. The parent technique is the full
                    granularity.
                  </p>
                ) : (
                  <ul className="drawer__subs">
                    {technique.subs.map((sub) => (
                      <li key={sub.id}>
                        <span>{sub.id}</span>
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="drawer__note">
                Activity index is derived from ATT&amp;CK sub-technique breadth and is
                illustrative, not a measurement of your environment.
              </p>
            </div>

            <div className="drawer__foot">
              <button type="button" className="drawer__copy" onClick={copyId}>
                {copied ? <Check /> : <Copy />}
                {copied ? 'Copied' : `Copy ${technique.id}`}
              </button>
              <a
                href={`https://attack.mitre.org/techniques/${baseId}/`}
                target="_blank"
                rel="noreferrer"
              >
                Open on ATT&amp;CK
                <ArrowUpRight size={12} />
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
