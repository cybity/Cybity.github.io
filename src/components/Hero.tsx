import { ArrowDown, ArrowUpRight } from './Icons'
import { HeroHud } from './HeroHud'
import { NetworkCanvas } from './NetworkCanvas'
import { attack } from '../lib/attack'

export function Hero() {
  return (
    <section className="hero" id="top">
      <NetworkCanvas />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__copy">
          <div className="hero__eyebrow reveal in">
            <span className="pill">
              <span className="live-dot" aria-hidden="true" />
              Offensive security studio
            </span>
            <span className="hero__eyebrow-meta">EST. 2019 · OPERATING GLOBALLY</span>
          </div>

          <h1 className="hero__title">
            We break it
            <span className="hero__title-line">
              before <em>they do.</em>
            </span>
          </h1>

          <div className="hero__sub">
            <p>
              Cybity is an offensive security company. We red team, break
              applications, and stress-test AI systems — then hand you the exact
              path an adversary would take.
            </p>
            <div className="hero__ctas">
              <a className="btn btn--solid" href="#contact">
                Book a red team
                <ArrowUpRight />
              </a>
              <a className="btn btn--ghost" href="#attack">
                Explore the ATT&amp;CK map
                <ArrowDown />
              </a>
            </div>
          </div>
        </div>

        <div className="hero__side reveal in">
          <HeroHud />
        </div>
      </div>

      <div className="container hero__foot">
        <div className="hero__availability">
          <span className="status-ring" aria-hidden="true" />
          <span>
            AVAILABLE FOR Q1 2027 — <strong>2 slots open</strong>
          </span>
        </div>
        <div className="hero__coverage">
          <span className="mono-label">Live coverage</span>
          <span className="hero__coverage-count">
            {attack.counts.tactics} tactics
            <span aria-hidden="true">/</span>
            {attack.counts.techniques} techniques
          </span>
        </div>
        <a className="hero__scroll" href="#services">
          <span>Scroll to explore</span>
          <span className="hero__scroll-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
