# MacroPark Web — Progress Log

This file is the persistent checkpoint for the project. Update it after meaningful implementation or design decisions so work can resume without relying on chat history.

## Current status

**Project stage:** Phase 0 foundation complete; Phase 1 vertical slice implemented and in active visual polish.

**Current branch:** `phase-1-interactive-foundation`

**Pull request:** Draft PR #1 — `Phase 1: interactive MacroPark foundation`

**Build status:** Passing on Node 24 with the current GitHub Actions runtime.

**Current priority:** Browser/device visual review, then selective high-impact asset replacement instead of adding more feature breadth.

**Repository state at planning start:** Empty repository.

## Locked direction

- Client-facing, not technical.
- 3D interactive and visually guided.
- The experience should behave like an intelligent parking consultant.
- `gta.shrid.site` is inspiration only for interaction quality/polish, not a template to copy.
- The existing MacroPark project/site is product context only, not a design/template to reproduce.
- GitHub is the source of truth for this new website.
- Visitors should choose their environment and real-world needs, then see the solution happen visually.
- Features should be expressed as physical outcomes instead of technical terminology.
- Initial core environments: Home, Residence, Retail/Mall.
- EV charging and solar should be contextual add-ons within environments rather than isolated technical pages.
- Desktop should be cinematic; mobile must receive a deliberately adapted experience.
- Performance, reduced-motion behavior and fallback support are requirements from the beginning.
- The first prototype uses procedural geometry so interaction quality can be validated before investing in heavy production 3D assets.
- Experience navigation is driven by an explicit state machine rather than being hard-wired to scroll position.
- Client choices accumulate into one solution instead of resetting after each demonstration.
- Technical configuration remains hidden; the visitor expresses needs and MacroPark assembles the setup.
- Reservation and guest access are separate concepts: a guest can be authorized at the entrance while a reservation holds a specific parking bay.
- Never show a fake successful lead submission. Until a real email/CRM destination is configured, the project handoff creates a useful copyable brief instead.

## Core experience

1. Visitor enters a cinematic 3D scene.
2. A vehicle approaches a controlled parking entrance.
3. The entrance opens automatically for the vehicle.
4. The camera reveals the wider MacroPark world.
5. Visitor selects Home, Residence or Retail/Mall spatially.
6. Camera travels into the chosen environment.
7. Visitor chooses real-life parking needs one by one.
8. Each need creates a persistent physical response in the 3D environment.
9. The visitor can combine multiple needs into a single configuration.
10. If EV charging is selected, solar becomes an optional contextual upgrade.
11. The visitor reviews a personalized `Your MacroPark` summary built from those choices.
12. The visitor can turn the setup into a structured project brief with location, scale and project timing.
13. If a MacroPark contact email is configured, the brief opens as a prefilled consultation request; otherwise it remains copyable and useful without pretending it was submitted.

## Implementation checklist

### Phase 0 — Foundation

- [x] Initialize Next.js + TypeScript.
- [x] Add GitHub Actions production-build validation workflow.
- [x] Add React Three Fiber / Three.js foundation.
- [x] Add Drei and animation tooling dependencies.
- [x] Establish scene/state architecture.
- [x] Establish first-pass visual system and typography treatment.
- [x] Build responsive canvas/app shell.
- [x] Define first asset strategy: procedural-first, optimized custom GLB later.
- [ ] Validate performance baseline on real devices.
- [x] Add reduced-motion behavior.
- [x] Add explicit WebGL-unavailable fallback.

### Phase 1 — Vertical slice

- [x] Create opening environment.
- [x] Add procedural hero vehicle.
- [x] Add entrance/gate and recognition camera.
- [x] Add automatic arrival demonstration.
- [x] Build world reveal.
- [x] Build spatial environment selector.
- [x] Create camera choreography.
- [x] Build transitions into Home, Residence and Retail viewpoints.
- [x] Add environment-specific problem selection.
- [x] Add first physical solution reactions in 3D.
- [x] Add first-pass responsive/mobile treatment.
- [x] Validate initial production build in CI.
- [x] Add persistent multi-need configuration state.
- [x] Add personalized `Your MacroPark` summary.
- [x] Add contextual solar option after EV charging selection.
- [x] Add persistent 3D solution effects for guidance, protected spaces, access flow and solar.
- [x] Add explicit reserved-space scenarios for Residence and Retail/Mall.
- [x] Add a distinct 3D reserved-bay state instead of reusing guest access visuals.
- [x] Add functional project/consultation handoff from the personalized setup.
- [x] Add copyable structured project brief fallback when no contact destination is configured.
- [x] Document optional `NEXT_PUBLIC_MACROPARK_CONTACT_EMAIL` configuration in `.env.example`.
- [x] Validate the multi-need configurator production build in CI.
- [x] Add subtle pointer parallax, depth particles and active-environment lighting.
- [x] Ensure canvas-only cinematic polish disables itself for reduced-motion users.
- [x] Modernize CI to current Node 24 / Actions v7 runtime.
- [x] Validate the complete current client journey under Node 24.
- [ ] Performance-check the complete vertical slice on real devices.
- [ ] Refine transition timing and scene composition after browser review.

## Implemented interaction examples

### Home

- Automatic garage/access concept.
- Temporary guest arrival visualization.
- EV charger visualization.
- EV + solar canopy configuration path.

### Residence

- Protected assigned-space concept.
- Explicit time-window parking reservation scenario.
- Guest-access scenario separate from reservation logic.
- Shared EV charging scenario.
- Persistent protected-bay, reserved-bay and access indicators.
- EV + solar canopy configuration path.

### Retail / mall

- Entrance-flow / queue-reduction scenario.
- Free-space guidance visualization.
- Reserved / premium parking scenario.
- Customer EV charging visualization.
- Persistent guidance, reservation and flow effects.
- EV + solar canopy configuration path.

## Personalized configuration behavior

- Selecting a need adds it to the current setup rather than replacing previous choices.
- The visitor can return to the environment question and add additional needs.
- Previously selected needs are visibly marked.
- A compact `Your setup` dock appears once at least one need is selected.
- `Review setup` opens a personalized summary for the chosen environment.
- Individual needs can be removed from the summary.
- Solar is only offered when EV charging is part of the configuration.
- Removing EV charging automatically removes the solar add-on.
- Configured choices produce persistent visual effects in the 3D environment.
- Reservations use a warm amber physical bay state to remain visually distinct from access/availability green.

## Client handoff behavior

- `Turn this into a project` continues from the personalized setup instead of starting a generic contact form.
- The client can add project location/name, approximate parking scale and project timing.
- Name and email are optional at this prototype stage.
- A structured MacroPark project brief is generated from the selected environment and needs.
- The brief can always be copied.
- If `NEXT_PUBLIC_MACROPARK_CONTACT_EMAIL` is configured, `Request a consultation` opens the visitor's email app with the subject and complete project brief prefilled.
- Without a configured contact destination, the interface explicitly says delivery is not configured and copies the brief instead of faking a submission.

## Validation notes

- React Three Fiber is aligned to v9 for React 19 compatibility; Drei is on the compatible v10 line.
- The first scene has no required remote HDR/model dependency, so the initial render is self-contained apart from npm packages.
- The original CI failure was caused by `setup-node` npm caching requiring a lockfile before the new repository had one. Cache configuration was removed until a lockfile is committed.
- GitHub Actions run #11 completed successfully for the baseline vertical slice.
- Baseline build reported `/` at 238 kB route size and 340 kB First Load JS.
- GitHub Actions run #17 completed successfully after the multi-need configurator, personalized summary and persistent 3D solution effects were added.
- Configurator build reported `/` at 240 kB route size and 342 kB First Load JS.
- The CSS compatibility warning from that run was corrected.
- CI was modernized to `actions/checkout@v7`, `actions/setup-node@v7` and Node 24 with package-manager caching explicitly disabled while no lockfile is committed.
- Node 24 exposed a stricter TypeScript tuple-spread inference issue in `ScenePolish`; it was corrected by using explicit tuple typing/indexed vector assignment.
- GitHub Actions run #26 completed successfully under Node 24 after that correction.
- The first consultation-handoff CI attempt exposed a nullable-environment TypeScript issue inside the nested contact action; the environment name was stabilized before the callback and the rerun passed.
- GitHub Actions run #33 completed successfully for the consultation handoff.
- GitHub Actions run #36 completed successfully for the cumulative branch including explicit reservations and the 3D reserved-bay effect.
- Current build reports `/` at 243 kB route size and 345 kB First Load JS.
- The cumulative client experience therefore remains about +5 kB First Load JS above the original 340 kB baseline despite the added configurator, summary, solar, cinematic polish, handoff and reservations.
- npm currently emits a non-blocking `sharp` install-script approval warning under npm 11; the production build itself succeeds.

## Art direction

Production 3D replacement priorities and visual rules are recorded in `docs/ART_DIRECTION.md`.

Highest-impact replacement order after visual review:

1. Hero vehicle.
2. Entrance / camera / barrier kit.
3. Residence parking blocker.
4. EV charger + solar canopy.
5. Architecture only after the first four prove worthwhile.

## Decisions still intentionally open

These should be decided through iteration based on what produces the strongest client experience:

- Final opening copy.
- Final architectural/art direction of the shared world within the documented visual rules.
- Production vehicle model/style.
- Final balance of scroll versus direct interaction.
- Whether subtle optional sound materially improves the experience.
- Final brand accent palette.
- Actual MacroPark consultation email / CRM destination.

## Next action

1. Browser-review the full vertical slice on desktop.
2. Review mobile composition separately rather than assuming desktop scales down correctly.
3. Performance-check representative real hardware.
4. Tune camera timing, object placement and text timing from the actual rendered experience.
5. Replace only the highest-impact procedural assets with optimized production-quality assets.
6. Connect the project handoff to the final MacroPark email/CRM destination once chosen.
7. Expand beyond Home / Residence / Retail only after the core journey feels premium.

## Change log

### 2026-08-23 — Client handoff and reservations milestone

- Added `Turn this into a project` from the personalized MacroPark setup.
- Added project location, parking scale and project-timing context.
- Added automatic structured project-brief generation.
- Added copyable fallback so the prototype remains honest and functional before CRM/email integration.
- Added optional `NEXT_PUBLIC_MACROPARK_CONTACT_EMAIL` configuration for a prefilled consultation email.
- Added explicit parking reservations to Residence and Retail/Mall.
- Kept guest access separate from reserved-space behavior.
- Added a persistent amber reserved-bay visualization to the 3D scene.
- Fixed the TypeScript issue surfaced by the first handoff CI attempt.
- Completed a clean cumulative Node 24 production build after all changes.
- Current First Load JS: 345 kB.

### 2026-08-23 — Clean Node 24 validation checkpoint

- Updated GitHub Actions to current checkout/setup-node v7 runtime and Node 24.
- Synchronized the Phase 1 branch with the new `main` CI baseline without losing feature work.
- Fixed the TypeScript tuple inference issue surfaced only by the newer toolchain.
- Completed a clean production build on Node 24.
- Added `docs/ART_DIRECTION.md` to preserve the production-asset strategy.

### 2026-08-23 — Cinematic polish

- Added subtle pointer-driven camera parallax.
- Added low-cost depth particles to improve scale and atmosphere.
- Added environment-focused moving light so selected places feel physically emphasized.
- Explicitly disabled the canvas-only polish when `prefers-reduced-motion` is enabled.
- Cleaned the CSS compatibility warning surfaced by CI.

### 2026-08-23 — Intelligent configurator polish

- Changed one-feature-at-a-time state into an accumulating multi-need configuration.
- Added persistent selected-needs behavior and selected-state feedback.
- Added compact `Your setup` review dock.
- Added personalized `Your MacroPark` configuration summary.
- Added ability to remove individual needs from the configuration.
- Added contextual solar upgrade that only exists when EV charging is selected.
- Added 3D solution effects that persist across selections: guidance trail, protected-bay glow, guest-access indicator, access/flow pulse and solar canopy energy flow.
- Kept the interaction client-facing and plain-language; no technical configuration UI was introduced.
- Production CI passed after these additions.

### 2026-08-23 — CI repair and first validated build

- Diagnosed the initial CI failure as a missing lockfile conflict with `setup-node` npm caching.
- Removed premature cache configuration.
- GitHub Actions subsequently completed a full production build successfully.

### 2026-08-23 — Phase 0 / first vertical slice implementation

- Created `phase-1-interactive-foundation` development branch.
- Initialized Next.js + TypeScript application.
- Added React Three Fiber, Drei, Three.js, Zustand and GSAP dependencies.
- Added an explicit experience state machine.
- Added client-focused branching content for Home, Residence and Retail/Mall.
- Built procedural 3D arrival scene, vehicle, gate, recognition camera and scan effect.
- Built cinematic camera choreography and shared 3D world reveal.
- Added three interactive environments with problem-specific visual responses.
- Added responsive HUD, reduced-motion behavior and first-pass mobile treatment.
- Added a graceful WebGL fallback.
- Added GitHub Actions CI.
- Opened draft PR #1 for the phase.

### 2026-08-23 — Planning baseline

- Created repository vision in `README.md`.
- Added full product/experience/implementation roadmap in `docs/ROADMAP.md`.
- Added this persistent progress checkpoint.
- No application code had been created at that point.
