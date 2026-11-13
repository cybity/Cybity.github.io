import type { CSSProperties } from 'react'
import { services, socials } from '../lib/content'
import { ArrowUpRight, Discord, GitHub, Logo, XLogo } from './Icons'

const COPYRIGHT_YEAR = new Date().getFullYear()

function SocialIcon({ id }: { id: string }) {
  if (id === 'github') return <GitHub size={14} />
  if (id === 'x') return <XLogo size={12} />
  return <Discord size={16} />
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <a href="#top" className="footer__logo" aria-label="Cybity home">
            <Logo className="nav__mark" />
            <span>
              cybity<span className="nav__dot">.</span>
            </span>
          </a>
          <p>
            Offensive security, engineered.
            <br />
            We find the way in before someone else does.
          </p>
          <a className="footer__email" href="mailto:hello@cybity.security">
            hello@cybity.security
            <ArrowUpRight size={12} />
          </a>

          <div className="footer__socials">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                style={{ '--tone': social.color } as CSSProperties}
                aria-label={`${social.label} — ${social.handle}`}
              >
                <span className="footer__social-icon">
                  <SocialIcon id={social.id} />
                </span>
                <span className="footer__social-label">{social.handle}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer__cols">
          <div>
            <h4>Capabilities</h4>
            {services.slice(0, 5).map((service) => (
              <a key={service.id} href="#services">
                {service.short}
              </a>
            ))}
          </div>
          <div>
            <h4>Company</h4>
            <a href="#attack">ATT&amp;CK map</a>
            <a href="#method">Method</a>
            <a href="#team">Team</a>
            <a href="#notes">Field notes</a>
            <a href="#contact">Contact</a>
          </div>
          <div>
            <h4>Signal</h4>
            <a href="mailto:security@cybity.security">Disclosure</a>
            <a href="mailto:privacy@cybity.security">Privacy</a>
            <a href="mailto:hello@cybity.security">PGP on request</a>
            <span className="footer__status">
              <span className="live-dot" aria-hidden="true" />
              Systems nominal
            </span>
          </div>
        </div>
      </div>

      <div className="footer__wordmark" aria-hidden="true">
        <span>cybity</span>
        <i>®</i>
      </div>

      <div className="container footer__bottom">
        <span>© {COPYRIGHT_YEAR} Cybity Security Ltd.</span>
        <span className="footer__bottom-mid">
          Built for teams who would rather find it first.
        </span>
        <div>
          <a href="#top">Back to top ↑</a>
          <span className="footer__coords">51.5072° N / 0.1276° W</span>
        </div>
      </div>
    </footer>
  )
}
