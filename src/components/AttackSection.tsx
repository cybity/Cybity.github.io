import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { attack, attackServices, matchesQuery, matchesService, tacticByShort } from '../lib/attack'
import type { Technique } from '../lib/types'
import { useReducedMotion } from '../lib/hooks'
import { AttackGraph } from './AttackGraph'
import { AttackMatrix } from './AttackMatrix'
import { ArrowUpRight, Close, Search } from './Icons'
import { SectionHead } from './SectionHead'
import { TechniqueDrawer } from './TechniqueDrawer'

type View = 'matrix' | 'graph'
type Sort = 'heat' | 'az'

export function AttackSection() {
  const [view, setView] = useState<View>('matrix')
  const [query, setQuery] = useState('')
  const [service, setService] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const [sort, setSort] = useState<Sort>('heat')
  const [selected, setSelected] = useState<Technique | null>(null)
  const deferredQuery = useDeferredValue(query)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const reduced = useReducedMotion()

  const filtered = useMemo(
    () =>
      attack.techniques.filter(
        (technique) =>
          matchesQuery(technique, deferredQuery) &&
          matchesService(technique, service),
      ),
    [deferredQuery, service],
  )

  const filtering = deferredQuery.trim().length > 0 || service !== null

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const inField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      if (event.key === '/' && !inField && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const resetFilters = () => {
    setQuery('')
    setService(null)
    setFocused(null)
  }

  const focusFromDrawer = (tactic: string) => {
    setFocused(tactic)
    setView('matrix')
    setSelected(null)
    window.setTimeout(() => {
      document.getElementById('attack')?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })
    }, 60)
  }

  return (
    <section className="section section--attack" id="attack">
      <div className="container">
        <SectionHead
          index="02"
          label="Threat intelligence"
          title={
            <>
              The whole board.
              <br />
              <em>One map.</em>
            </>
          }
          intro={
            <>
              Every enterprise technique in MITRE ATT&amp;CK® — {attack.counts.techniques}{' '}
              techniques, {attack.counts.subtechniques} sub-techniques, {attack.counts.tactics}{' '}
              tactics. Search it, filter it by the work we do, or switch to the
              constellation and explore the connections.
            </>
          }
          aside={
            <div className="attack-version">
              <span className="mono-label">Enterprise matrix</span>
              <strong>v{attack.version}</strong>
            </div>
          }
        />

        <div className="attack-panel reveal">
          <div className="attack-panel__toolbar">
            <label className="attack-search">
              <Search size={16} />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search technique, ID, or tactic…"
                aria-label="Search MITRE ATT&CK techniques"
                spellCheck={false}
              />
              {query ? (
                <button
                  type="button"
                  className="attack-search__clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <Close size={13} />
                </button>
              ) : (
                <kbd>/</kbd>
              )}
            </label>

            <div className="view-switch" role="group" aria-label="Map visualisation">
              <button
                type="button"
                className={view === 'matrix' ? 'is-active' : ''}
                onClick={() => setView('matrix')}
                aria-pressed={view === 'matrix'}
              >
                Matrix
              </button>
              <button
                type="button"
                className={view === 'graph' ? 'is-active' : ''}
                onClick={() => setView('graph')}
                aria-pressed={view === 'graph'}
              >
                Constellation
              </button>
              <span className={`view-switch__thumb is-${view}`} aria-hidden="true" />
            </div>
          </div>

          <div className="attack-panel__filters">
            <div className="filter-chips">
              <button
                type="button"
                className={service === null ? 'is-active' : ''}
                onClick={() => setService(null)}
              >
                All services
              </button>
              {attackServices.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={service === item.id ? 'is-active' : ''}
                  onClick={() => setService(service === item.id ? null : item.id)}
                  aria-pressed={service === item.id}
                  style={{ '--svc': item.color } as CSSProperties}
                >
                  <i aria-hidden="true" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="attack-panel__meta">
              {focused && (
                <button
                  type="button"
                  className="focus-chip"
                  onClick={() => setFocused(null)}
                >
                  Focus: {tacticByShort[focused]?.label ?? focused}
                  <Close size={10} />
                </button>
              )}
              {view === 'matrix' && (
                <button
                  type="button"
                  className="sort-btn"
                  onClick={() => setSort(sort === 'heat' ? 'az' : 'heat')}
                  title="Change technique ordering"
                >
                  Sort: {sort === 'heat' ? 'Activity' : 'A–Z'}
                </button>
              )}
              <span className="attack-count">
                <strong>{filtered.length}</strong> / {attack.counts.techniques}
              </span>
            </div>
          </div>

          <div className="attack-panel__stage">
            {view === 'matrix' ? (
              <AttackMatrix
                query={deferredQuery}
                service={service}
                focused={focused}
                selectedId={selected?.id ?? null}
                sort={sort}
                onFocusTactic={setFocused}
                onSelect={setSelected}
              />
            ) : (
              <AttackGraph selectedId={selected?.id ?? null} onSelect={setSelected} />
            )}

            {filtering && filtered.length === 0 && (
              <div className="attack-empty" role="status">
                <span>No techniques match that filter.</span>
                <button type="button" onClick={resetFilters}>
                  Reset filters
                  <Close size={11} />
                </button>
              </div>
            )}

            {view === 'matrix' && (
              <div className="attack-scroll-hint" aria-hidden="true">
                <span>Scroll to explore</span>
                <span className="attack-scroll-hint__line" />
                <span>15 tactics</span>
              </div>
            )}
          </div>

          <div className="attack-panel__foot">
            <div className="heat-legend">
              <span className="mono-label">Activity</span>
              <span className="heat-legend__bar" aria-hidden="true" />
              <span>Low</span>
              <span>High</span>
              <span className="heat-legend__note">illustrative index</span>
            </div>
            <div className="attack-source">
              Data: MITRE ATT&amp;CK® Enterprise v{attack.version} · {attack.modified}{' '}
              <a
                href="https://attack.mitre.org/"
                target="_blank"
                rel="noreferrer"
                aria-label="MITRE ATT&CK website"
              >
                source
                <ArrowUpRight size={10} />
              </a>
            </div>
          </div>
        </div>

        <div className="attack-ticker reveal">
          <span className="mono-label">Also in the matrix</span>
          <div>
            <span>
              <strong>{attack.counts.groups}</strong> tracked threat groups
            </span>
            <span>
              <strong>{attack.counts.software}</strong> software families
            </span>
            <span>
              <strong>{attack.counts.subtechniques}</strong> sub-techniques
            </span>
            <span>
              <strong>v{attack.version}</strong> published {attack.modified}
            </span>
          </div>
        </div>
      </div>

      <TechniqueDrawer
        technique={selected}
        onClose={() => setSelected(null)}
        onFocusTactic={focusFromDrawer}
      />
    </section>
  )
}
