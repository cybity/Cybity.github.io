import { useEffect, useState, type CSSProperties } from 'react'
import { navLinks, socials } from '../lib/content'
import { useScrolled } from '../lib/hooks'
import { ArrowUpRight, Close, Discord, GitHub, Logo, Menu, XLogo } from './Icons'

const CURRENT_YEAR = new Date().getFullYear()

function SocialIcon({ id }: { id: string }) {
  if (id === 'github') return <GitHub size={15} />
  if (id === 'x') return <XLogo size={13} />
  return <Discord size={17} />
}

export function Nav() {
  const scrolled = useScrolled(20)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <a className="nav__logo" href="#top" aria-label="Cybity home">
          <Logo className="nav__mark" />
          <span className="nav__word">
            cybity<span className="nav__dot">.</span>
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a className="nav__status" href="#contact">
            <span className="live-dot" aria-hidden="true" />
            Open for Q1
          </a>
          <a className="btn btn--sm" href="#contact">
            Start an engagement
            <ArrowUpRight size={13} />
          </a>
          <button
            className="nav__burger"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu />
          </button>
        </div>
      </header>

      <div
        className={`mobile-menu${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
        <div className="mobile-menu__top">
          <span className="mono-label">// Index</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="icon-btn"
          >
            <Close />
          </button>
        </div>
        <nav className="mobile-menu__links" aria-label="Mobile">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ '--i': index } as CSSProperties}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {link.label}
              <ArrowUpRight />
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            style={{ '--i': navLinks.length } as CSSProperties}
          >
            <span>{String(navLinks.length + 1).padStart(2, '0')}</span>
            Start an engagement
            <ArrowUpRight />
          </a>
        </nav>
        <div className="mobile-menu__socials">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${social.label} — ${social.handle}`}
            >
              <SocialIcon id={social.id} />
              {social.label}
            </a>
          ))}
        </div>
        <div className="mobile-menu__foot">
          <span>hello@cybity.security</span>
          <span>UTC · {CURRENT_YEAR}</span>
        </div>
      </div>
    </>
  )
}
