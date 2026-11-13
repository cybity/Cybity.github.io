import type { CSSProperties, MouseEvent } from 'react'
import { socials, team } from '../lib/content'
import { ArrowUpRight, Discord, GitHub, XLogo } from './Icons'
import { SectionHead } from './SectionHead'

const discord = socials.find((social) => social.id === 'discord')

function MemberLinkIcon({ id }: { id: string }) {
  return id === 'github' ? <GitHub size={13} /> : <XLogo size={12} />
}

export function Team() {
  const onMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <section className="section section--team" id="team">
      <div className="container">
        <SectionHead
          index="04"
          label="Operators"
          title={
            <>
              Small crew.
              <br />A <em>direct line.</em>
            </>
          }
          intro="No account managers, no handoffs, no junior bench. The people who scope the work are the ones on the keyboard — and they stay reachable after the report lands."
          aside={<span className="mono-label">05 operators / one channel</span>}
        />

        <div className="team-grid reveal">
          {team.map((member, index) => (
            <article
              key={member.id}
              className="member"
              onMouseMove={onMove}
              style={{ '--tone': member.color } as CSSProperties}
            >
              <div className="member__top">
                <span className="member__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="member__badge">Operator</span>
              </div>

              <div className="member__avatar" aria-hidden="true">
                <span>{member.name}</span>
                <i />
              </div>

              <div className="member__ident">
                <h3>{member.name}</h3>
                <span className="member__role">{member.role}</span>
              </div>

              <p className="member__focus">{member.focus}</p>

              <div className="member__links">
                {member.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on ${link.label}`}
                  >
                    <MemberLinkIcon id={link.id} />
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="team__foot reveal">
          <div>
            <span className="mono-label">Signal, not sales</span>
            <p>Operators, researchers and builders compare notes in the Discord.</p>
          </div>
          {discord && (
            <a
              className="team__discord"
              href={discord.href}
              target="_blank"
              rel="noreferrer"
            >
              <Discord size={15} />
              Join the Discord
              <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
