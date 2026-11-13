export function ServiceGlyph({ id }: { id: string }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.2,
    strokeLinecap: 'square' as const,
  }

  if (id === 'red-team') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <g {...common}>
          <circle cx="24" cy="24" r="15" strokeOpacity="0.45" />
          <circle cx="24" cy="24" r="7" />
          <path d="M24 2v9M24 37v9M2 24h9M37 24h9" />
          <path d="M24 24 41 7" stroke="var(--svc, var(--accent))" />
          <circle cx="24" cy="24" r="1.8" fill="var(--svc, var(--accent))" stroke="none" />
        </g>
      </svg>
    )
  }

  if (id === 'appsec') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <g {...common}>
          <rect x="5" y="9" width="38" height="30" rx="1" />
          <path d="M5 16h38M9 12.5h.01M12.5 12.5h.01M16 12.5h.01" />
          <path d="m18 23-4 4 4 4M30 23l4 4-4 4M26 21l-4 12" />
          <path d="M38 40v4M32 42h12" stroke="var(--svc, var(--accent))" strokeOpacity="0.7" />
        </g>
      </svg>
    )
  }

  if (id === 'ai') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <g {...common}>
          <circle cx="24" cy="24" r="4.2" stroke="var(--svc, var(--accent))" />
          <circle cx="10" cy="12" r="2.5" />
          <circle cx="38" cy="12" r="2.5" />
          <circle cx="10" cy="36" r="2.5" />
          <circle cx="38" cy="36" r="2.5" />
          <circle cx="24" cy="6" r="2.5" />
          <circle cx="24" cy="42" r="2.5" />
          <path d="m21 21-8-7M27 21l8-7M21 27l-8 7M27 27l8 7M24 20V9M24 39v-11" strokeOpacity="0.55" />
          <path d="M32 15l-3 4M36 32l-6-3" stroke="var(--svc, var(--accent))" strokeOpacity="0.6" />
        </g>
      </svg>
    )
  }

  if (id === 'cloud') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <g {...common}>
          <path d="M14 34h20a7 7 0 0 0 .7-14A11 11 0 0 0 14 16a9 9 0 0 0 0 18Z" />
          <path d="M18 27h12M21 22h6M21 32h6" strokeOpacity="0.55" />
          <path d="M24 40v5M19 45h10" stroke="var(--svc, var(--accent))" strokeOpacity="0.7" />
        </g>
      </svg>
    )
  }

  if (id === 'adversary') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <g {...common}>
          <path d="M24 4 8 13v11c0 10 6.8 17.8 16 21 9.2-3.2 16-11 16-21V13L24 4Z" strokeOpacity="0.5" />
          <circle cx="24" cy="23" r="6" />
          <path d="M24 12v5M24 29v5M13 23h5M30 23h5" />
          <path d="m27 20-6 7" stroke="var(--svc, var(--accent))" />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <g {...common}>
        <path d="M4 24h6l4-12 6 24 5-17 4 10 3-5h12" />
        <path d="M4 40h40" strokeOpacity="0.25" />
        <path d="M30 8h14M36 4v8" stroke="var(--svc, var(--accent))" strokeOpacity="0.8" />
      </g>
    </svg>
  )
}
