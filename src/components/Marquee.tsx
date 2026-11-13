import { marqueeItems } from '../lib/content'

export function Marquee() {
  const content = (
    <div className="marquee__group">
      {marqueeItems.map((item) => (
        <span key={item}>
          {item}
          <i aria-hidden="true">✦</i>
        </span>
      ))}
    </div>
  )

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {content}
        {content}
      </div>
    </div>
  )
}
