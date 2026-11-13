import type { ReactNode } from 'react'

type Props = {
  index: string
  label: string
  title: ReactNode
  intro?: ReactNode
  aside?: ReactNode
  dark?: boolean
}

export function SectionHead({ index, label, title, intro, aside }: Props) {
  return (
    <header className="section-head reveal">
      <div className="section-head__top">
        <span className="section-head__index">[{index}]</span>
        <span className="section-head__label">{label}</span>
        <span className="section-head__line" aria-hidden="true" />
        {aside && <div className="section-head__aside">{aside}</div>}
      </div>
      <div className="section-head__main">
        <h2>{title}</h2>
        {intro && <p className="section-head__intro">{intro}</p>}
      </div>
    </header>
  )
}
