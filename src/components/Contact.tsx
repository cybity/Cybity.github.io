import { useState, type FormEvent } from 'react'
import { socials } from '../lib/content'
import { ArrowUpRight, Check, Discord } from './Icons'

const FOCUS_OPTIONS = [
  'Red team operation',
  'Web / API application test',
  'AI / LLM adversarial test',
  'Cloud & identity review',
  'Not sure yet',
]

const discord = socials.find((social) => social.id === 'discord')

export function Contact() {
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [reference, setReference] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setName(String(data.get('name') ?? ''))
    setEmail(String(data.get('email') ?? ''))
    setReference(
      `CYB-${new Date().getFullYear()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`,
    )
    setSent(true)
  }

  return (
    <section className="section section--contact" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="container contact">
        <div className="contact__copy">
          <span className="section-head__index">[06]</span>
          <span className="section-head__label">Contact</span>
          <h2>
            Let&apos;s find your
            <br />
            <em>weak point.</em>
          </h2>
          <p>
            Tell us what you are building, shipping, or worried about. We will come
            back with a scoped plan, a realistic timeline, and the smallest
            engagement that answers the biggest question.
          </p>

          <div className="contact__details">
            <a href="mailto:hello@cybity.security" className="contact__email">
              hello@cybity.security
              <ArrowUpRight size={14} />
            </a>
            <div className="contact__row">
              <span>Response time</span>
              <strong>Within 1 business day</strong>
            </div>
            <div className="contact__row">
              <span>Current availability</span>
              <strong>Q1 2027 · 2 slots</strong>
            </div>
            <div className="contact__row">
              <span>Operating</span>
              <strong>Remote / on-site · UTC ± 8</strong>
            </div>
            <div className="contact__row">
              <span>Disclosure</span>
              <a href="mailto:security@cybity.security">security@cybity.security</a>
            </div>
            {discord && (
              <div className="contact__row">
                <span>Community</span>
                <a
                  className="contact__discord"
                  href={discord.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Discord size={12} />
                  Join the Discord
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="contact__panel reveal">
          {sent ? (
            <div className="contact__success" role="status">
              <span className="contact__success-icon">
                <Check size={22} />
              </span>
              <span className="mono-label">Request logged</span>
              <h3>Thank you, {name || 'operator'}.</h3>
              <p>
                Your enquiry is in the queue. We will reply to{' '}
                <strong>{email}</strong> within one business day with next steps and a
                scoping call.
              </p>
              <div className="contact__reference">
                <span>Reference</span>
                <strong>{reference}</strong>
              </div>
              <button type="button" className="btn btn--ghost" onClick={() => setSent(false)}>
                Send another enquiry
                <ArrowUpRight size={13} />
              </button>
            </div>
          ) : (
            <form className="contact__form" onSubmit={onSubmit}>
              <div className="contact__form-head">
                <span className="mono-label">New enquiry</span>
                <span className="contact__secure">
                  <span className="live-dot" aria-hidden="true" />
                  Encrypted in transit
                </span>
              </div>

              <div className="contact__form-grid">
                <label className="field">
                  <span>Name</span>
                  <input type="text" name="name" placeholder="Ada Lovelace" required autoComplete="name" />
                </label>
                <label className="field">
                  <span>Work email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="ada@company.com"
                    required
                    autoComplete="email"
                  />
                </label>
                <label className="field">
                  <span>Company</span>
                  <input type="text" name="company" placeholder="Company name" autoComplete="organization" />
                </label>
                <label className="field">
                  <span>What are we testing?</span>
                  <select name="focus" defaultValue={FOCUS_OPTIONS[0]}>
                    {FOCUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field field--wide">
                  <span>Scope, context, or the thing that keeps you up at night</span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Three sentences is plenty. We will ask the rest."
                  />
                </label>
              </div>

              <div className="contact__submit">
                <button type="submit" className="btn btn--solid btn--wide">
                  Request an engagement
                  <ArrowUpRight />
                </button>
                <p>
                  No sales sequence. A human operator reads every enquiry. Prefer
                  encrypted? Use the PGP key on request.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
