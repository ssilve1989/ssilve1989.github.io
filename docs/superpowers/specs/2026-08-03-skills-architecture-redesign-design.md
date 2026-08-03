# Skills section: architecture & systems redesign

## Context

The Skills section (`src/components/Skills.astro`) currently presents four
tech-stack categories (AI & Productivity, Backend & Microservices, DevOps &
Cloud, Frontend & Languages), each listing named technologies (Node.js,
TypeScript, Docker, ...) with a hand-curated competency tier chip (Core
Strength / Working Knowledge / Practiced Skill) built in a prior iteration.

As AI tooling increasingly generates the code itself, the specific technology
a snippet is written in matters less than whether the person directing and
reviewing that code understands the system it runs in — distributed systems
behavior, event flow, deployment topology, data consistency. This redesign
replaces the tech-stack framing entirely with an architecture/systems-concept
framing, and gives it a materially more "eye-catching" presentation: animated
diagrams that illustrate each concept rather than a list of chips.

This fully retires the tier-chip system (Core Strength / Working Knowledge /
Practiced Skill). The new section is not a competency scale — there is no
per-item rating at all.

## Goals

- Replace all four tech-stack categories with 5 architecture/systems-concept
  categories, each grounded in real, verifiable work from `src/content/experience/`.
- Each category gets one bespoke animated diagram illustrating the concept,
  not a generic renderer — diagrams are hand-built per category.
- Presentation is materially more "eye-catching": full-width alternating
  showcase rows, not a card grid.
- Diagrams respect `prefers-reduced-motion` (freeze on a meaningful static
  frame) and pause when scrolled off-screen (no wasted animation cycles).
- Diagrams carry an `aria-label` text equivalent so screen reader users get
  the same information as the animation.

## Non-goals

- No per-skill (as opposed to per-category) diagrams — rejected in
  brainstorming as too large a build (20 bespoke animations) for a resume
  section.
- No interactive tab/selector navigation — rejected in favor of a scrollable
  showcase, which fits a static portfolio site better than app-like state.
- No Canvas 2D rendering — SVG + CSS/GSAP chosen instead (see Technical design).
- No competency rating of any kind (tiers, years, percentages) — explicitly
  rejected per the prior tier-system critique that any single-axis score
  misrepresents skills with different maturity ceilings.

## Content model

Replaces the skills collection schema in `src/content.config.ts`:

```ts
const skillsCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/skills" }),
  schema: z.object({
    category: z.string(),
    slug: z.string(),       // maps to a hand-built diagram component
    summary: z.string(),    // 1-2 sentence explanation of the concept
    concepts: z.array(z.string()), // supporting tags, no tool names as headline
  }),
});
```

The four existing JSON files (`ai-productivity.json`, `backend.json`,
`devops.json`, `technical.json`) are replaced by five new files, one per
category below. `slug` is a plain identifier (e.g. `distributed-systems`)
that `Skills.astro` uses to pick which diagram component to render — the
diagram is not data-driven; there is no generic "diagram renderer."

## The 5 categories

Each was mined from real experience data (`src/content/experience/*.md`),
not invented — see grounding notes.

### 1. Distributed Systems & Service Architecture (`distributed-systems`)

> Designing how independent services find each other, communicate, and keep
> working when one of them doesn't.

Concepts: Service decomposition · API gateways · gRPC / service-to-service
comms · Fault tolerance & failover · Load balancing

Grounding: TruMid achievement "Develop highly scalable gRPC microservices in
Node.js"; former Backend & Microservices category (Microservices
Architecture, gRPC/Protocol Buffers, REST APIs/GraphQL).

Diagram: Client → Gateway → three Service nodes (A/B/C) → shared Data node.
Packets travel Gateway→Service→Data on a loop. Periodically Service C shows
a "down" state (dimmed, red stroke, a small "⚠ down" badge) and its packet
is replaced by an amber reroute packet riding the Service B path — a visible
failover. **Prototyped and approved** (see prior artifact).

### 2. Event-Driven & Asynchronous Systems (`event-driven`)

> Decoupling producers from consumers so each can fail, scale, and deploy independently.

Concepts: Message / event buses · Pub-sub patterns · Reactive streams (RxJS)
· Eventual consistency · Decoupled communication

Grounding: TruMid RxJS work; former "event-driven design" line in
Microservices Architecture's description.

Diagram: A Publisher node (left) emits an event into a central Event Bus
node, which briefly shows a small queued-count badge. Three Subscriber nodes
(right) each receive the event at staggered, independent times (not
simultaneously) — visually distinct from Diagram 1's direct request/response
hops, to make the "decoupled, async delivery" idea legible at a glance.

Timing: publish-to-bus travel ~1.5s; each subscriber picks up the queued
event on its own stagger (~1s, ~2.5s, ~4.5s after publish) within an overall
~8s loop, so the three pickups are visibly spread out rather than
simultaneous.

### 3. Deployment & Delivery Architecture (`deployment-delivery`)

> Getting code from commit to running safely, repeatedly, without hand-holding.

Concepts: CI/CD pipelines · Containerization & orchestration ·
Infrastructure as code · Build systems · Automated release gates

Grounding: former DevOps & Cloud category (CI/CD Pipelines,
Docker/Kubernetes, Bazel Build System, AWS Cloud Services).

Diagram: A Commit node feeds a left-to-right pipeline (Build → Test →
Deploy stage nodes), each pulsing as the packet passes through. On deploy,
a cluster of three Container nodes on the right scale in from zero,
staggered (rollout/replication). Periodically the packet bounces back from
Test to Build (a failed gate, red, same reject-narrative device as Diagram 5)
instead of reaching Deploy, showing the gate actually gates.

Timing: commit→build→test travel ~2.5s per stage; on a ~10s outer loop, one
pass (~20% of the cycle, matching Diagram 1's incident window) fails at Test
and bounces back to Build instead of continuing to Deploy/containers.

### 4. Data Architecture & Storage (`data-architecture`)

> Choosing what's fast, what's durable, and how they stay consistent with each other.

Concepts: Schema design · Caching strategy · Data pipelines / ETL ·
Read/write path tradeoffs · Polyglot persistence

Grounding: former Database Design skill (PostgreSQL, MongoDB, Redis, query
optimization); Digital Reasoning ETL work ("Wrote ETL code in Groovy and
Python for large-scale data processing").

Diagram: A Write packet enters and forks into two simultaneous paths — a
Cache node (fast path) and a Store node (durable path). A later Read packet
takes the fast path through the warm cache on one cycle (cache hit), and on
the next cycle takes the slow path through the Store when the cache has
expired (cache miss), re-populating the cache on the way back — both
outcomes shown across the loop.

Timing: write-fork travel ~2s; read cycles alternate hit/miss every ~5s, so
each outcome is on screen long enough to read before it switches.

### 5. AI-Augmented Systems Engineering (`ai-augmented-engineering`)

> Directing AI agents inside real architectural constraints and reviewing
> what they produce for runtime correctness, not syntax.

Concepts: Agent orchestration · Architectural review of generated code ·
Prompt & context engineering · Runtime reasoning over syntax

Grounding: TruMid achievement "Tailor AI agents and tools to dramatically
increase team productivity and code quality"; this category is the literal
thesis of the whole redesign — this is the skill that matters more as AI
writes more of the code itself.

Diagram: An Architect node ("You," gently breathing/pulsing — always
directing) fans out to three AI Agent nodes. Each agent periodically emits a
code-fragment marker down into a shared Review node. Most fragments pass
through Review and continue down into a Production System node, turning
green (accepted); one fragment is shown turning red and bouncing back up out
of Review (rejected) rather than reaching production. **Prototyped and
approved** (see prior artifact).

## Layout

Full-width row per category (`grid md:grid-cols-2 gap-12`), alternating
`diagram-left/text-right` and `text-left/diagram-right` via `md:order-*` on
odd/even rows, stacking diagram-then-text on mobile regardless of row parity.
Each row: an eyebrow (`01 — Systems Architecture`, ...), category name as
`h3`, one-to-two sentence summary, and the concept tags as neutral pill
badges (no tier coloring — these aren't ranked). The diagram sits in a
bordered panel (`rounded-xl border`, matching the site's existing card
language) rather than a full-bleed graphic, keeping it contained and
theme-consistent.

## Technical design

**Animation stack**: GSAP core (free, ~9kb gzip, includes MotionPathPlugin
as of the 2024 licensing change) added as the site's first JS animation
dependency, per explicit choice in brainstorming. Each diagram is a
standalone Astro component (`src/components/diagrams/DistributedSystems.astro`,
etc.) with hand-authored SVG nodes/paths and a `<script>` that:

1. Checks `window.matchMedia('(prefers-reduced-motion: reduce)')` — if set,
   skip GSAP entirely and leave the SVG on its static default state.
2. Otherwise, builds a GSAP timeline: `MotionPathPlugin` moves packet
   markers along the hand-authored paths, staggered per the narrative above;
   node pulses and state changes (down/reject/accept) are plain GSAP
   tweens keyed to the same timeline.
3. Wraps the timeline start in an `IntersectionObserver` on the diagram's
   container: play on enter, `timeline.pause()` on exit — no off-screen
   animation cycles.

The CSS/SVG prototype (approved) stands in 1:1 for this — same node
layout, same paths, same narrative beats; GSAP replaces the CSS
`@keyframes`/`offset-path` choreography with equivalent timeline calls plus
cleaner easing and the scroll-triggered play/pause behavior CSS-only
couldn't give us for free.

**Accessibility**: every diagram's `<svg>` carries `role="img"` and an
`aria-label` describing the concept in one sentence (as in the prototype),
so the animation is a supplement, not the only way to get the information —
the summary paragraph next to it already carries the same content in prose.

**Component structure**:

```
src/components/Skills.astro                 — fetches collection, renders showcase rows
src/components/diagrams/
  DistributedSystems.astro
  EventDriven.astro
  DeploymentDelivery.astro
  DataArchitecture.astro
  AiAugmentedEngineering.astro
```

`Skills.astro` maps each entry's `slug` to its diagram component via a
static lookup object (5 entries, no dynamic import magic needed for 5
known items).

## Migration

- `src/content.config.ts`: replace the skills schema as above.
- Delete `src/content/skills/{ai-productivity,backend,devops,technical}.json`;
  add 5 new JSON files, one per category above.
- Rewrite `src/components/Skills.astro`: remove `TIER_STYLES`, tier chip
  markup, and `formatYears`; add the showcase-row layout and diagram lookup.
- Add `src/components/diagrams/*.astro` (5 new files).
- Add `gsap` as a dependency (`npm install gsap`).

## Verification plan

- `npm run build` — schema and component compile cleanly.
- `npx biome check` on all touched files.
- Manual browser check (light + dark) of all 5 rows, confirming each
  diagram animates, alternation is correct, and mobile stacking works.
- Toggle OS `prefers-reduced-motion` (or DevTools emulation) and confirm
  every diagram freezes with no animation and no console errors.
- Scroll a diagram off-screen and confirm (via a quick `console.log` or
  DevTools performance check) that its timeline pauses.
