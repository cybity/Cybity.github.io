import { useState, type CSSProperties, type MouseEvent } from 'react'
import { services } from '../lib/content'
import { ArrowUpRight, Plus } from './Icons'
import { SectionHead } from './SectionHead'
import { ServiceGlyph } from './ServiceGlyph'

export function Services() {
  const [openId, setOpenId] = useState<string | null>(null)

  const onMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <section className="section services" id="services">
      <div className="container">
        <SectionHead
          index="01"
          label="Capabilities"
          title={
            <>
              Six ways to stress
              <br />a <em>system.</em>
            </>
          }
          intro="Offensive security is not a product. It is a set of adversarial skills pointed at the things you actually depend on — people, code, cloud, and increasingly, models."
          aside={
            <span className="mono-label">
              {services.length.toString().padStart(2, '0')} disciplines / one team
            </span>
          }
        />

        <div className="services__grid reveal">
          {services.map((service) => {
            const open = openId === service.id
            return (
              <article
                key={service.id}
                className={`service-card${open ? ' is-open' : ''}`}
                onMouseMove={onMove}
                style={{ '--svc': service.color } as CSSProperties}
              >
                <button
                  type="button"
                  className="service-card__toggle"
                  onClick={() => setOpenId(open ? null : service.id)}
                  aria-expanded={open}
                  aria-controls={`service-${service.id}`}
                >
                  <span className="service-card__top">
                    <span className="service-card__index">{service.index}</span>
                    <span className="service-card__glyph">
                      <ServiceGlyph id={service.id} />
                    </span>
                  </span>
                  <span className="service-card__body">
                    <span className="service-card__title">{service.title}</span>
                    <span className="service-card__tagline">{service.tagline}</span>
                    <span className="service-card__desc">{service.description}</span>
                    <span className="service-card__tags">
                      {service.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </span>
                  </span>
                  <span className="service-card__bottom">
                    <span className="service-card__cta">
                      {open ? 'Close detail' : 'See the detail'}
                    </span>
                    <span className="service-card__plus" aria-hidden="true">
                      <Plus />
                    </span>
                  </span>
                </button>

                <div className="service-card__details" id={`service-${service.id}`}>
                  <div className="service-card__details-inner">
                    <div className="service-card__details-head">
                      <span className="mono-label">What you get</span>
                      <span className="service-card__duration">{service.duration}</span>
                    </div>
                    <ul>
                      {service.deliverables.map((item) => (
                        <li key={item}>
                          <ArrowUpRight size={11} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a className="service-card__link" href="#contact" tabIndex={open ? 0 : -1}>
                      Scope this engagement
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="services__foot reveal">
          <span className="mono-label">Not sure where to start?</span>
          <a href="#contact">
            We will help you pick the smallest engagement that answers the biggest question.
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  )
}
