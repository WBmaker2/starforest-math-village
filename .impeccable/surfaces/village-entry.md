---
version: 1
slug: "village-entry"
primary_target: "grade3/index.html"
related_targets:
  - "lower/index.html"
  - "grade4/index.html"
  - "grade5/index.html"
  - "grade6/index.html"
---

# Village entry surface brief

## Scope and mode

- Target: the entry/map screens of `lower/index.html` (grades 1–2) and `grade3/index.html`–`grade6/index.html` (grades 3–6). Mode: Operate.
- Audience: elementary students arriving from a class link, with the teacher preparing or projecting the same screen.
- Job: find today's unit house on the map and enter it; then reach the village living areas without losing the map.
- Proof: the real illustrated maps, six unit houses per grade, the real progress store, and the existing star/seed loop. No invented content.

## Chosen direction

**마을 광장** — the map is the village square and the first screen. A signboard bar holds the grade, semester, purse, and village menu; a wooden sign introduces the village; the map stage carries the today's-path card and the house pins. Below, four living tiles hold the deeper rooms.

The existing storybook world stays. The landing's chalkboard is not imported.

## Direction contract

THESIS: A village square where the map is the first thing a student sees; it refuses an app dashboard that explains itself before showing the village.

OWN-WORLD: Warm paper, illustrated maps, leaf green and star amber, wooden signboard, grade district colors, hand-drawn seals. One shared shell, six distinct districts.

STORY: A student arrives, sees today's path on the map, taps a house or the fixed primary action, and enters. The living hub below keeps the deeper rooms available without competing with the map.

FIRST VIEWPORT: Header with grade selector, semester segmented control, purse, and menu; village sign with grade seal, h1, one-line lead, and chips; map stage with today's path and pins; fixed primary action. On phones the map is full width and the hub's first row follows; on desktop the map is capped by viewport height so the sign and action fit together.

SIGNATURE: The amber today's-path card and the next-house pin flag, backed by a fixed primary action that names the current next step or the house at the door.

FORM: Illustrated village square / school map, not a dashboard and not a chalkboard.

## Boundaries

- Keep: all six grades, both semesters, six unit houses, the existing maps and avatar art, the learning engine, the store, all named IDs and anchors, the teacher's class links, the star/seed loop.
- Replace: the long intro/avatar-first order, the overflowing seven-link header, the repeated white cards, the emoji zone bar, the multiple pulses, the PWA banner over the map.
- Do not touch: lesson dialogs, question data, store structure, landing (`index.html`, `landing.css`), village art originals.
- Anti-goals: a dashboard of cards, a fantasy game HUD, a poster with no working house controls, emoji as the icon system.

## Decisions

- Mobile living navigation: bottom dock, visible only while a living group is open.
- Third-grade second-semester map: keep `map-a.jpg`, add a watermill seal; dedicated map later.
- First run: a three-step sheet (name → look → enter); returning users get an inline card/hub.
- Time of day: a small chip and popover, with the choice persisted.
- Sign title: keep the existing h1 and put grade/semester/place chips below it.
- Mobile lead: one line.

## Finish

The build ends with the responsive/keyboard/print checks, the finish review, `DESIGN.md`, and every raster carrying its provenance. The existing cream page background is an intentional part of the storybook world, not a default surface.
