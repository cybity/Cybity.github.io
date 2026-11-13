import { useMemo, type CSSProperties } from 'react'
import { attack, heatColor, matchesQuery, matchesService, serviceColor } from '../lib/attack'
import type { Technique } from '../lib/types'

type Props = {
  query: string
  service: string | null
  focused: string | null
  selectedId: string | null
  sort: 'heat' | 'az'
  onFocusTactic: (tactic: string | null) => void
  onSelect: (technique: Technique) => void
}

export function AttackMatrix({
  query,
  service,
  focused,
  selectedId,
  sort,
  onFocusTactic,
  onSelect,
}: Props) {
  const filtering = query.trim().length > 0 || service !== null

  const columns = useMemo(
    () =>
      attack.tactics.map((tactic) => {
        const techniques = attack.techniques
          .filter((technique) => technique.tactics.includes(tactic.short))
          .slice()
          .sort((a, b) =>
            sort === 'heat'
              ? b.heat - a.heat || a.name.localeCompare(b.name)
              : a.name.localeCompare(b.name),
          )
        const matches = techniques.filter(
          (technique) =>
            matchesQuery(technique, query) && matchesService(technique, service),
        )
        return { tactic, techniques, matches: matches.length }
      }),
    [query, service, sort],
  )

  return (
    <div
      className={`matrix-wrap${focused ? ' has-focus' : ''}`}
      style={{ '--svc': service ? serviceColor[service] : undefined } as CSSProperties}
    >
      <div className="matrix" role="group" aria-label="MITRE ATT&CK enterprise matrix">
        {columns.map(({ tactic, techniques, matches }, index) => {
          const isFocused = focused === tactic.short
          const isDimmed = Boolean(focused) && !isFocused
          const averageHeat = Math.round(
            techniques.reduce((sum, technique) => sum + technique.heat, 0) /
              Math.max(1, techniques.length),
          )
          return (
            <div
              className={`tactic-col${isFocused ? ' is-focused' : ''}${isDimmed ? ' is-dimmed' : ''}`}
              key={tactic.short}
            >
              <button
                type="button"
                className="tactic-head"
                onClick={() => onFocusTactic(isFocused ? null : tactic.short)}
                aria-pressed={isFocused}
                title={`${tactic.name} — ${tactic.description}`}
              >
                <span className="tactic-head__top">
                  <span className="tactic-head__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="tactic-head__count">
                    {filtering ? `${matches}/${techniques.length}` : techniques.length}
                  </span>
                </span>
                <span className="tactic-head__name">{tactic.label}</span>
                <span className="tactic-head__meta">
                  {tactic.id}
                  <span className="tactic-head__focus">{isFocused ? 'FOCUSED' : 'FOCUS'}</span>
                </span>
                <span className="tactic-head__bar" aria-hidden="true">
                  <span
                    style={
                      {
                        width: `${averageHeat}%`,
                        '--heat-color': heatColor(averageHeat),
                      } as CSSProperties
                    }
                  />
                </span>
              </button>

              <div className="tactic-stack">
                {techniques.map((technique) => {
                  const matched =
                    matchesQuery(technique, query) &&
                    matchesService(technique, service)
                  const isSelected = selectedId === technique.id
                  return (
                    <button
                      type="button"
                      key={technique.id}
                      className={`tech${filtering && !matched ? ' is-dim' : ''}${
                        filtering && matched ? ' is-hit' : ''
                      }${isSelected ? ' is-selected' : ''}`}
                      onClick={() => onSelect(technique)}
                      title={`${technique.id} · ${technique.name}`}
                    >
                      <span className="tech__top">
                        <span className="tech__id">{technique.id}</span>
                        {technique.subs.length > 0 && (
                          <span className="tech__subs">+{technique.subs.length}</span>
                        )}
                      </span>
                      <span className="tech__name">{technique.name}</span>
                      <span
                        className="tech__heat"
                        style={
                          {
                            '--heat': technique.heat / 100,
                            '--heat-color': heatColor(technique.heat),
                          } as CSSProperties
                        }
                        aria-hidden="true"
                      />
                    </button>
                  )
                })}
                <div className="tactic-stack__end" aria-hidden="true">
                  <span />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
