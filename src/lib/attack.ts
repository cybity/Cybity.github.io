import raw from '../data/attack.json'
import type { AttackData, Technique } from './types'

export const attack = raw as unknown as AttackData

export const tacticByShort = Object.fromEntries(
  attack.tactics.map((tactic) => [tactic.short, tactic]),
)

export const techniqueById = Object.fromEntries(
  attack.techniques.map((technique) => [technique.id, technique]),
)

export const attackServices = [
  { id: 'red-team', label: 'Red Team', title: 'Red Team Operations', color: '#ff7a6b' },
  { id: 'appsec', label: 'AppSec', title: 'Application Security', color: '#5ee1c8' },
  { id: 'ai', label: 'AI / LLM', title: 'AI & LLM Security', color: '#b18aff' },
  { id: 'cloud', label: 'Cloud', title: 'Cloud & Infrastructure', color: '#6cb8ff' },
  { id: 'adversary', label: 'Adversary', title: 'Adversary Simulation', color: '#ffb86b' },
] as const

export const serviceLabel = Object.fromEntries(
  attackServices.map((service) => [service.id, service.label]),
) as Record<string, string>

export const serviceColor = Object.fromEntries(
  attackServices.map((service) => [service.id, service.color]),
) as Record<string, string>

export function heatColor(heat: number): string {
  if (heat >= 66) return '#ff7a6b'
  if (heat >= 33) return '#ffb86b'
  return '#5ee1c8'
}

export function primaryTactic(technique: Technique): string {
  return technique.tactics[0] ?? 'impact'
}

export function matchesQuery(technique: Technique, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    technique.name.toLowerCase().includes(q) ||
    technique.id.toLowerCase().includes(q) ||
    technique.tactics.some((tactic) => {
      const meta = tacticByShort[tactic]
      return meta ? meta.name.toLowerCase().includes(q) : false
    })
  )
}

export function matchesService(technique: Technique, service: string | null): boolean {
  return !service || technique.services.includes(service)
}
