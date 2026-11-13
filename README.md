# Cybity

Marketing site for Cybity, an offensive security studio: red teaming, application
and API testing, cloud and identity work, adversary simulation, detection
engineering, and AI/LLM adversarial testing.

The site is a static Vite + React + TypeScript single page with an interactive
MITRE ATT&CK map, a constellation view, and a technique detail drawer.

## Stack

- React 19 + TypeScript
- Vite 8
- Hand-written CSS (`src/styles/`), no CSS framework
- Fonts: Space Grotesk, Instrument Serif, IBM Plex Mono

## Development

```bash
npm install
npm run dev      # dev server with HMR
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

Node 20+ is recommended.

## Structure

```
index.html                 metadata, JSON-LD, font loading
public/og.jpg              social share card (1200x630 @2x)
src/
  components/              one component per section + ATT&CK views
  data/attack.json         generated ATT&CK Enterprise dataset
  lib/
    attack.ts              dataset selectors and filters
    content.ts             all marketing copy, services, method, field notes,
                           team members, and social links
    hooks.ts               reveal, count-up, media query, clock hooks
    types.ts
  styles/
    base.css               tokens, nav, hero, typography, reveal
    sections.css           services, method, notes, contact, footer
    attack.css             matrix, graph, drawer
    responsive.css         breakpoints + reduced motion
scripts/
  generate_attack_data.py  rebuilds src/data/attack.json from ATT&CK STIX
```

### Editing content

Almost all copy lives in `src/lib/content.ts`: navigation labels, services and
their deliverables, the six-week method phases and console transcript, field
notes, stats, team members, social links, and footer links. Component markup
stays untouched for copy-only changes.

### Social links and team

`socials` in `content.ts` holds the company GitHub, X, and Discord links. They
are rendered in the footer, the mobile menu, and (for Discord) the contact panel
and team section.

`team` holds the five operator profiles: name, handle, role, focus line, accent
colour, and per-member GitHub/X links. Member roles and focus lines are
placeholder marketing copy — edit them in `content.ts` before launch. Adding a
member is a matter of appending an object to the array; the grid reflows
automatically (5 → 3 → 2 → 1 columns).

### Colour system

The brand lime (`--accent`, `#c9f24e`) stays reserved for primary calls to
action. Everything else uses situational tokens defined in `base.css`:

| Token     | Colour    | Used for                                  |
| --------- | --------- | ----------------------------------------- |
| `--teal`  | `#5ee1c8` | AppSec, radar, terminal, low severity     |
| `--violet`| `#b18aff` | AI/LLM work, team section, medium-high    |
| `--blue`  | `#6cb8ff` | Cloud and infrastructure, contact         |
| `--amber` | `#ffb86b` | Method, warnings, mid heat                |
| `--red`   | `#ff7a6b` | Red team, high severity, high heat        |
| `--rose`  | `#ff8fb8` | Field notes                               |
| `--discord`| `#7983f5`| Discord calls to action                   |

Services, field notes, stats, and ATT&CK service filters each carry their own
accent colour via the `--svc` / `--tone` custom properties. The ATT&CK heat
scale is semantic: teal (low) → amber (mid) → red (high), and the constellation
graph assigns a distinct colour to each of the 15 tactics.

### Updating the ATT&CK data

`src/data/attack.json` is generated from the official MITRE ATT&CK Enterprise
STIX bundle. It currently contains ATT&CK Enterprise **v20.1** (2026-11-05):
15 tactics, 227 techniques, and 479 sub-techniques.

```bash
curl -L -o /tmp/attack.json \
  https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json
python3 scripts/generate_attack_data.py /tmp/attack.json
```

The script compacts descriptions, preserves the tactic order used by the matrix,
and tags each technique with the Cybity services that test it.

## Deployment

The build output is fully static. Deploy `dist/` to any static host.

### GitHub Pages

`.github/workflows/deploy.yml` builds and publishes the site on every push to
`main`. In the repository settings, set **Pages → Build and deployment → Source**
to **GitHub Actions**, then push.

The workflow derives the Vite base path from the repository name:

- project page (`github.com/<user>/<repo>`) → `/<repo>/`
- user/org page (`github.com/<user>/<user>.github.io`) → `/`

For a custom domain, add a repository variable `BASE_PATH` with the value `/`
(under **Settings → Secrets and variables → Actions → Variables**). Custom
domains also need a `public/CNAME` file containing the domain.

To test a project-page build locally:

```bash
BASE_PATH=/cybity/ npm run build
npm run preview
```

Before pointing a production domain (or the Pages URL) at the site, update the
absolute URLs in `index.html`:

- `<link rel="canonical">`
- `og:url`, `og:image`, `twitter:image`
- the `url` field in the JSON-LD `ProfessionalService` block

They currently use the `https://cybity.security/` placeholder. For example, a
project page URL is `https://<user>.github.io/<repo>/`.

## Accessibility and motion

- The mobile menu traps body scroll and closes on Escape.
- The technique drawer closes on Escape and restores focus.
- All interactive controls have accessible labels and pressed/expanded state.
- `prefers-reduced-motion` disables reveal transitions, the marquee, radar sweep,
  and canvas motion.

## Notes

The ATT&CK dataset is bundled into the main JS chunk (~150 KB gzipped), which
keeps the map available without a second request. If bundle size becomes a
priority, split `src/data/attack.json` behind a dynamic import.
