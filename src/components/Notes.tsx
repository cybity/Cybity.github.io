import { useState, type CSSProperties } from 'react'
import { articles } from '../lib/content'
import { ArrowUpRight } from './Icons'
import { SectionHead } from './SectionHead'

export function Notes() {
  const [active, setActive] = useState(0)
  const article = articles[active]

  return (
    <section className="section section--notes" id="notes">
      <div className="container">
        <SectionHead
          index="05"
          label="Field notes"
          title={
            <>
              What we are seeing
              <br />
              <em>in the wild.</em>
            </>
          }
          intro="Short, practical notes from the keyboard. No newsletter filler — just the failure modes we keep finding and what to do about them."
          aside={<span className="mono-label">Research / 2026</span>}
        />

        <div className="notes-grid reveal">
          <div className="notes-list">
            {articles.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`note-item${index === active ? ' is-active' : ''}`}
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                style={{ '--tone': item.tone } as CSSProperties}
              >
                <span className="note-item__top">
                  <span className="note-item__category">{item.category}</span>
                  <span className="note-item__meta">
                    {item.date} · {item.read}
                  </span>
                </span>
                <span className="note-item__title">{item.title}</span>
                <span className="note-item__arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </button>
            ))}
            <div className="notes-list__foot">
              <span className="mono-label">More field notes, quarterly.</span>
              <span className="mono-label">Signal only.</span>
            </div>
          </div>

          <article
            className="note-panel"
            key={article.id}
            style={{ '--tone': article.tone } as CSSProperties}
          >
            <div className="note-panel__head">
              <span className="note-panel__category">{article.category}</span>
              <span className="note-panel__meta">
                {article.date} · {article.read} read
              </span>
            </div>
            <h3>{article.title}</h3>
            <p className="note-panel__standfirst">{article.standfirst}</p>
            <div className="note-panel__body">
              {article.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <blockquote>{article.quote}</blockquote>
            <div className="note-panel__foot">
              <span className="mono-label">Cybity research desk</span>
              <span className="mono-label">
                {String(active + 1).padStart(2, '0')} / {String(articles.length).padStart(2, '0')}
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
