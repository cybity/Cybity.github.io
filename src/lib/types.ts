export type SubTechnique = {
  id: string
  name: string
}

export type Technique = {
  id: string
  name: string
  tactics: string[]
  desc: string
  platforms: string[]
  subs: SubTechnique[]
  heat: number
  services: string[]
}

export type Tactic = {
  id: string
  short: string
  name: string
  label: string
  description: string
}

export type AttackData = {
  source: string
  version: string
  modified: string
  generated: string
  tactics: Tactic[]
  techniques: Technique[]
  counts: {
    tactics: number
    techniques: number
    subtechniques: number
    groups: number
    software: number
  }
}

export type Service = {
  id: string
  index: string
  title: string
  short: string
  tagline: string
  description: string
  deliverables: string[]
  duration: string
  tags: string[]
  color: string
}

export type Social = {
  id: 'github' | 'x' | 'discord'
  label: string
  handle: string
  href: string
  color: string
}

export type TeamLink = {
  id: 'github' | 'x'
  label: string
  href: string
}

export type TeamMember = {
  id: string
  name: string
  handle: string
  role: string
  focus: string
  color: string
  links: TeamLink[]
}

export type MethodStep = {
  id: string
  index: string
  title: string
  window: string
  summary: string
  logs: { kind: 'cmd' | 'ok' | 'warn' | 'info' | 'out'; text: string }[]
  metric: { label: string; value: string }[]
}

export type Article = {
  id: string
  category: string
  title: string
  date: string
  read: string
  standfirst: string
  body: string[]
  quote: string
  tone: string
}
