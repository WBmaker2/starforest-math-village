---
version: 2
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Landing surface brief

## Scope and mode

- Target: `index.html` only. Visitor mode: Persuade.
- Audience: elementary teachers preparing a lesson and handing a class link to students. Secondary: parents and students who arrive from that link.
- Job: choose a grade and semester, read the six unit places in one glance, then open the village or copy the class address.
- Proof: the real six-grade/two-semester structure, real village plates, the hands-on tools, and the no-signup/local-storage promise. No invented testimonials or statistics.
- Constraints: static HTML/CSS/JS, no backend, localStorage only, Korean, isolated landing CSS, classroom tablets and phones, offline PWA.

## Chosen direction

**칠판 수업 보드** — the landing is the chalkboard where a teacher prepares today's math class. Grades are lesson-list cells; the selected cell gets a hand-drawn chalk ring, and the plan below updates in place. The existing village imagery is pinned to the board as real class material, not decoration.

## Direction contract

THESIS: A working chalkboard for today's lesson; it refuses the brochure hero with six equal grade cards.

OWN-WORLD: Deep green chalkboard, warm wood frame and ledge, chalk-white handwriting, amber "today's class" mark, coral underline, sage doodles. Gaegu display, Gowun Dodum body, Jua on the brand plaque. The grade picker is a two-by-three lesson list, not a card grid.

STORY: A teacher reads today's date and semester, picks a grade, checks the unit places in the class plan, then opens the village or copies the class address. Below, the board keeps the proof: real village plates, the hands-on tools, the two entrances, the star-and-seed loop, and classroom facts.

FIRST VIEWPORT: Full chalkboard framed in wood. Left: chalk headline "오늘의 수학은, 어느 마을에서?", one-sentence lead, four facts, a hand-drawn hint. Right: "오늘의 수업 목록" with six grade cells, a semester switch, and an amber chalk ring on the selected cell. Below: "오늘의 수업 계획" with the unit places, a teacher note, and a wooden rail with the primary `마을 열기` and secondary `학급 주소 복사`. On phones, the rail becomes a fixed bottom dock.

SIGNATURE: The amber chalk ring draws around the selected grade while the plan, note, and both actions update together.

FORM: Classroom chalkboard / lesson plan, not a generic dark theme.

FINISH: unreviewed and undocumented is unfinished; the build ends with the finish review, DESIGN.md, and every shipping raster carrying its provenance.

## Boundaries

- Keep: product truth, all six grades, both semesters, five-to-six real unit places per grade, teacher link copy, local-storage promise, browser-only start, brand name, Korean copy, existing village functionality.
- Replace: the old cream/green storybook landing, gradient showcase hero, six duplicate grade cards, six equal play cards, four equal trust cards, and the long brochure order.
- Do not touch: `lower/`, `grade3/`–`grade6/` screens, their CSS/JS, or the shared `styles.css` tokens they rely on. The landing loads only `assets/css/landing.css`.
- Anti-goals: fantasy RPG landing, fake school logos/testimonials, a dark sci-fi dashboard, a poster with no working grade control, or a generic split hero with a card grid.

## Open decisions

- PWA manifest background/theme color: landing meta is chalkboard `#1B2A24`; the manifest stays green until village surfaces adopt the new tokens.
- Font delivery: Google Fonts with `display=swap` for now; self-host the woff2 subset later if offline title fidelity becomes a requirement.
- The landing hides the automatic PWA install banner; the footer keeps the offline install note.
