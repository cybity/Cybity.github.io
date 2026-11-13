import type { Article, MethodStep, Service, Social, TeamMember } from './types'

export const navLinks = [
  { href: '#services', label: 'Capabilities' },
  { href: '#attack', label: 'ATT&CK Map' },
  { href: '#method', label: 'Method' },
  { href: '#team', label: 'Team' },
  { href: '#notes', label: 'Field Notes' },
]

export const socials: Social[] = [
  {
    id: 'github',
    label: 'GitHub',
    handle: 'cybity',
    href: 'https://github.com/cybity',
    color: '#e6e9e1',
  },
  {
    id: 'x',
    label: 'X',
    handle: '@cybity_',
    href: 'https://x.com/cybity_',
    color: '#e6e9e1',
  },
  {
    id: 'discord',
    label: 'Discord',
    handle: 'Join the server',
    href: 'https://discord.com/invite/WyPuBvPD3Z',
    color: '#7983f5',
  },
]

export const team: TeamMember[] = [
  {
    id: 'fr6ey',
    name: 'fr6ey',
    handle: 'fr6ey',
    role: 'Founder · Red Team',
    focus: 'Adversary emulation, assumed breach, physical.',
    color: '#ff7a6b',
    links: [
      { id: 'github', label: 'GitHub', href: 'https://github.com/fr6ey' },
      { id: 'x', label: 'X', href: 'https://x.com/fr6ey' },
    ],
  },
  {
    id: 'prince',
    name: 'prince',
    handle: 'RezzPirate',
    role: 'Application Security',
    focus: 'Web, API, auth flows and business logic.',
    color: '#5ee1c8',
    links: [
      { id: 'github', label: 'GitHub', href: 'https://github.com/PirateXdec' },
      { id: 'x', label: 'X', href: 'https://x.com/RezzPirate' },
    ],
  },
  {
    id: 'l00pz',
    name: 'l00pz',
    handle: 'l00pz',
    role: 'AI / LLM Security',
    focus: 'Agents, tool abuse, RAG and guardrail bypass.',
    color: '#b18aff',
    links: [
      { id: 'github', label: 'GitHub', href: 'https://github.com/l00pzwastaken' },
      { id: 'x', label: 'X', href: 'https://x.com/l00pzwastaken' },
    ],
  },
  {
    id: 'subbu',
    name: 'subbu',
    handle: 'Subrama92965151',
    role: 'Cloud & Infrastructure',
    focus: 'Identity paths, Kubernetes and CI/CD trust.',
    color: '#6cb8ff',
    links: [
      { id: 'x', label: 'X', href: 'https://x.com/Subrama92965151' },
    ],
  },
  {
    id: 'tadano',
    name: 'tadano',
    handle: '_tadano__',
    role: 'Detection Engineering',
    focus: 'Telemetry, Sigma coverage and purple-team replay.',
    color: '#ffb86b',
    links: [
      { id: 'x', label: 'X', href: 'https://x.com/_tadano__' },
    ],
  },
]

export const services: Service[] = [
  {
    id: 'red-team',
    index: '01',
    title: 'Red Team Operations',
    short: 'Red Team',
    tagline: 'Goal-based. Full-scope. Assumed breach.',
    description:
      'We emulate a real adversary against your people, infrastructure, and detections — not just your perimeter. Objective-driven operations built around what an attacker would actually want.',
    deliverables: [
      'Full-scope or assumed-breach operation',
      'Social engineering & physical entry vectors',
      'Detection & response validation in real time',
      'Reproducible attack path with evidence',
    ],
    duration: '4–8 weeks',
    tags: ['Adversary emulation', 'Social engineering', 'Assumed breach'],
    color: '#ff7a6b',
  },
  {
    id: 'appsec',
    index: '02',
    title: 'Application Security',
    short: 'AppSec',
    tagline: 'Web, API, mobile, and everything between.',
    description:
      'Manual, business-logic-first testing of the software you ship. We go past the scanner and the OWASP top ten — into auth flows, tenant boundaries, and the assumptions your engineers never wrote down.',
    deliverables: [
      'Web, API, mobile & thick-client review',
      'Authorization and tenant-isolation testing',
      'Business logic & race-condition analysis',
      'Developer-ready remediation with retest',
    ],
    duration: '2–5 weeks',
    tags: ['Web & API', 'Business logic', 'AuthZ / IDOR'],
    color: '#5ee1c8',
  },
  {
    id: 'ai',
    index: '03',
    title: 'AI & LLM Security',
    short: 'AI / LLM',
    tagline: 'Red team the model, the agent, and its tools.',
    description:
      'Your AI feature is a new attack surface with old consequences. We test prompt injection, tool abuse, retrieval poisoning, data exfiltration, and guardrail bypass across the full agentic stack.',
    deliverables: [
      'Direct & indirect prompt injection campaigns',
      'Agent tool-call and permission abuse',
      'RAG poisoning and memory exfiltration tests',
      'Model, guardrail & pipeline threat model',
    ],
    duration: '2–4 weeks',
    tags: ['Prompt injection', 'Agentic abuse', 'RAG / memory'],
    color: '#b18aff',
  },
  {
    id: 'cloud',
    index: '04',
    title: 'Cloud & Infrastructure',
    short: 'Cloud',
    tagline: 'Identity is the new perimeter.',
    description:
      'AWS, Azure, GCP, Kubernetes, and the identity fabric holding it together. We follow the credentials, chain the trust relationships, and measure how far one foothold can really go.',
    deliverables: [
      'Cloud control-plane & IAM path analysis',
      'Kubernetes and container escape testing',
      'Active Directory & Entra ID attack paths',
      'CI/CD and software supply-chain review',
    ],
    duration: '3–6 weeks',
    tags: ['AWS / Azure / GCP', 'Identity', 'Kubernetes'],
    color: '#6cb8ff',
  },
  {
    id: 'adversary',
    index: '05',
    title: 'Adversary Simulation',
    short: 'Adversary',
    tagline: 'See yourself the way they do.',
    description:
      'A focused, intelligence-led engagement for teams that need signal fast. We map your external surface, emulate the initial foothold of relevant threat actors, and pressure-test the controls you already own.',
    deliverables: [
      'External attack-surface & OSINT map',
      'Threat-actor-informed intrusion simulation',
      'Initial-access control validation',
      'Prioritised exposure register',
    ],
    duration: '1–3 weeks',
    tags: ['OSINT', 'Initial access', 'Exposure mapping'],
    color: '#ffb86b',
  },
  {
    id: 'detection',
    index: '06',
    title: 'Detection Engineering',
    short: 'Purple Team',
    tagline: 'Turn findings into coverage.',
    description:
      'A finding without a detection is a future incident. We replay the operation with your defenders, build the telemetry, and leave you with detection-as-code mapped directly to ATT&CK.',
    deliverables: [
      'Purple-team replay & gap analysis',
      'ATT&CK coverage model + heatmap',
      'Sigma rules and detection-as-code',
      'SIEM / EDR tuning recommendations',
    ],
    duration: '2–4 weeks',
    tags: ['Purple team', 'Sigma', 'ATT&CK coverage'],
    color: '#c9f24e',
  },
]

export const methodSteps: MethodStep[] = [
  {
    id: 'scope',
    index: '01',
    title: 'Scope & threat model',
    window: 'Week 0 · 48 hours',
    summary:
      'We agree on the objectives, the rules of engagement, and what "winning" looks like for an adversary. No surprise outages, no ambiguity.',
    logs: [
      { kind: 'cmd', text: 'cybity scope init --client acme --op "q1-redteam"' },
      { kind: 'info', text: 'rules of engagement signed · 3 emergency contacts' },
      { kind: 'out', text: 'in-scope        18 domains · 4 clouds · 2 LLM agents' },
      { kind: 'out', text: 'objectives      finance data · admin console · CI/CD' },
      { kind: 'ok', text: 'baseline captured · monitoring window open' },
    ],
    metric: [
      { label: 'Targets', value: '34' },
      { label: 'Objectives', value: '03' },
      { label: 'RoE', value: 'SIGNED' },
    ],
  },
  {
    id: 'recon',
    index: '02',
    title: 'Reconnaissance',
    window: 'Week 1 · days 1–7',
    summary:
      'Passive first, then active. We build the map an attacker would build — and find the assets your inventory forgot about.',
    logs: [
      { kind: 'cmd', text: 'cybity recon --passive --active --resolve' },
      { kind: 'info', text: 'CT logs · ASN sweep · code search · archive crawl' },
      { kind: 'out', text: 'subdomains      1,284  (+212 unknown to client)' },
      { kind: 'warn', text: 'exposed         staging bucket · CI token (redacted)' },
      { kind: 'out', text: 'ranked          7 high-blast-radius paths' },
      { kind: 'ok', text: 'attack surface model synced to ATT&CK' },
    ],
    metric: [
      { label: 'Assets', value: '1,284' },
      { label: 'Exposures', value: '07' },
      { label: 'Noise', value: 'LOW' },
    ],
  },
  {
    id: 'access',
    index: '03',
    title: 'Initial access',
    window: 'Week 2 · days 8–14',
    summary:
      'We test the front door the way a motivated actor would: phishing, token theft, exposed services, or a deliberately weak trust boundary.',
    logs: [
      { kind: 'cmd', text: 'cybity access --vector identity --simulate' },
      { kind: 'info', text: 'phishing simulation · 42 targets · consent-aware' },
      { kind: 'out', text: 'sessions        3 (2 analyst-approved)' },
      { kind: 'out', text: 'token replay     /admin · MFA window 90s' },
      { kind: 'warn', text: 'detection       0 of 4 controls fired' },
      { kind: 'ok', text: 'foothold stable · objectives reachable' },
    ],
    metric: [
      { label: 'Footholds', value: '02' },
      { label: 'TTD', value: '11m' },
      { label: 'Detected', value: '0/4' },
    ],
  },
  {
    id: 'impact',
    index: '04',
    title: 'Deep exploitation',
    window: 'Week 3–5 · days 15–35',
    summary:
      'The quiet part: privilege escalation, lateral movement, data access. Every step is logged, evidenced, and stopped before it can cause real harm.',
    logs: [
      { kind: 'cmd', text: 'cybity execute --objective finance --canary' },
      { kind: 'info', text: 'avoids destructive actions · canary data only' },
      { kind: 'out', text: 'escalation      tenant admin via IdP misconfig' },
      { kind: 'out', text: 'lateral         k8s → internal registry → finance' },
      { kind: 'warn', text: 'dwell time      41 minutes · 0 alerts' },
      { kind: 'ok', text: 'objective achieved · full evidence chain captured' },
    ],
    metric: [
      { label: 'Privilege', value: 'TENANT' },
      { label: 'Dwell', value: '41m' },
      { label: 'Evidence', value: '100%' },
    ],
  },
  {
    id: 'report',
    index: '05',
    title: 'Debrief & retest',
    window: 'Week 6 · days 36–42',
    summary:
      'A report your engineers will actually use and your board will understand. Then we come back and verify the fixes — not just trust them.',
    logs: [
      { kind: 'cmd', text: 'cybity report build --audience exec,eng --retest' },
      { kind: 'out', text: 'findings        14 critical · 22 high · 31 medium' },
      { kind: 'info', text: 'each finding    repro steps · impact · fix · owner' },
      { kind: 'out', text: 'readout         exec brief + 2-hour engineering deep dive' },
      { kind: 'ok', text: 'retest window opened · 30-day remediation support' },
    ],
    metric: [
      { label: 'Critical', value: '14' },
      { label: 'Retest', value: '30d' },
      { label: 'Readout', value: 'YES' },
    ],
  },
]

export const articles: Article[] = [
  {
    id: 'agent-attack-surface',
    category: 'AI Security',
    title: 'The agent is the attack surface',
    date: 'Oct 2026',
    read: '8 min',
    standfirst:
      'Your system prompt is not a security boundary. Once a model can retrieve, decide, and call tools, the blast radius is whatever those tools can reach.',
    body: [
      'Most LLM security reviews still stop at the prompt: try to make the model say something it should not, then ship. That test tells you almost nothing about an agent that can read mail, query a warehouse, and open a pull request. The interesting failure mode is not a rude sentence — it is an authorised action taken for an unauthorised reason.',
      'Indirect prompt injection is the practical entry point. A single poisoned document in the retrieval set, an issue comment, or a calendar invite can redirect the agent’s plan. If that plan can invoke tools with the user’s privileges, the model becomes a confused deputy with a very real token.',
      'The fix is architectural before it is linguistic: least-privilege tool scopes, human confirmation for state-changing actions, egress allow-lists, and provenance-aware retrieval. Then test it adversarially — not with a list of magic strings, but with objectives, exactly like any other red team.',
    ],
    quote: 'A jailbreak is a demo. An agent taking the wrong action with the right token is an incident.',
    tone: '#b18aff',
  },
  {
    id: 'business-logic',
    category: 'Application Security',
    title: 'Business logic never shows up in your scanner',
    date: 'Sep 2026',
    read: '6 min',
    standfirst:
      'The highest-impact bugs we find rarely have a CVE. They live in workflows, tenant boundaries, and the space between two services that each trust the other.',
    body: [
      'Automated scanners are excellent at finding reflections, headers, and known signatures. They are structurally incapable of understanding that an invoice can be approved twice, that a trial can be extended forever, or that tenant A can invite a user into tenant B if the invitation endpoint checks the wrong identifier.',
      'The pattern repeats across industries: an endpoint validates that you are authenticated, then trusts a client-supplied object ID; a bulk operation applies authorisation once for the batch; a state machine allows a transition from a state that should be terminal. None of these produce a scanner alert.',
      'Finding them requires a model of the business: who can do what, to which object, in what sequence, and what the system assumes will never happen. That model is also what makes the report useful — a reproducible path to a real consequence, not a pile of theoretical severity.',
    ],
    quote: 'If the exploit needs a paragraph of business context, a scanner will never find it. That is exactly why we look.',
    tone: '#5ee1c8',
  },
  {
    id: 'assume-breach',
    category: 'Red Team',
    title: 'Assume breach is a budget line, not a slide',
    date: 'Aug 2026',
    read: '7 min',
    standfirst:
      'A red team that stops at the perimeter tells you whether you can be entered. It does not tell you what happens after — which is where the loss actually occurs.',
    body: [
      'The most useful engagements start with a credible foothold and a concrete objective. Can an attacker with one phished session reach the finance system? Can a compromised CI runner modify production? Can a low-privilege cloud role become organisation admin? These questions have answers, and the answers should drive your roadmap.',
      'Objective-based operations also produce better detection work. When the red team replays the operation with defenders in the room, every missed signal becomes a specific detection gap instead of a vague recommendation to "improve monitoring".',
      'The output is not a score. It is a map: the paths that worked, the controls that failed, the time it took, and the smallest set of changes that removes the path. That is a budget conversation your board can actually have.',
    ],
    quote: 'The question is not whether someone can get in. It is what they can do in the forty minutes before anyone notices.',
    tone: '#ff7a6b',
  },
]

export const stats = [
  { value: 140, suffix: '+', label: 'Engagements delivered', detail: 'Since 2019', tone: '#c9f24e' },
  { value: 1900, suffix: '+', label: 'Critical findings', detail: 'Reproduced & evidenced', tone: '#ff7a6b' },
  { value: 38, suffix: '', label: 'AI systems tested', detail: 'Agents, RAG, copilots', tone: '#b18aff' },
  { value: 7, suffix: 'yrs', label: 'Breaking things', detail: 'Operator-led', tone: '#5ee1c8' },
]

export const marqueeItems = [
  'Red teaming',
  'Web & API',
  'AI / LLM adversarial',
  'Cloud & identity',
  'Active Directory',
  'Adversary simulation',
  'Detection engineering',
  'Attack surface mapping',
]
