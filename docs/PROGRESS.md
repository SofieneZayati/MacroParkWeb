# MacroPark Web — Progress Log

This file is the persistent checkpoint for the project. Update it after meaningful implementation or design decisions so work can resume without relying on chat history.

## Current status

**Project stage:** Phase 0 foundation implemented; Phase 1 vertical slice in active development.

**Current branch:** `phase-1-interactive-foundation`

**Pull request:** Draft PR #1 — `Phase 1: interactive MacroPark foundation`

**Current priority:** Browser-review and polish the first interactive sequence, then validate performance before expanding content breadth.

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

## Core experience to prove first

1. Visitor enters a cinematic 3D scene.
2. A vehicle approaches a controlled parking entrance.
3. The entrance opens automatically for the vehicle.
4. The camera reveals the wider MacroPark world.
5. Visitor selects Home, Residence or Retail/Mall spatially.
6. Camera travels into the chosen environment.
7. Visitor chooses one real-life parking problem.
8. The environment physically changes to demonstrate MacroPark solving it.
9. Visitor can continue toward a personalized MacroPark setup.

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
- [x] Validate production build in CI.
- [ ] Performance-check the complete vertical slice.
- [ ] Refine transition timing and scene composition after browser review.

## Implemented interaction examples

### Home

- Automatic garage/access concept.
- Temporary guest arrival visualization.
- EV charger visualization.

### Residence

- Protected assigned-space concept.
- Guest-access scenario.
- Shared EV charging scenario.

### Retail / mall

- Entrance-flow / queue-reduction scenario.
- Free-space guidance visualization.
- Customer EV charging visualization.

## Decisions still intentionally open

These should be decided through iteration based on what produces the strongest client experience:

- Final opening copy.
- Final architectural/art direction of the shared world.
- Production vehicle model/style.
- Final balance of scroll versus direct interaction.
- Whether subtle optional sound materially improves the experience.
- Final brand accent palette.
- Which procedural assets should be replaced by custom GLB models first.
- How the personalized solution summary and lead-capture flow should look.

## Validation notes

- React Three Fiber is aligned to v9 for React 19 compatibility; Drei is on the compatible v10 line.
- The first scene has no required remote HDR/model dependency, so the initial render is self-contained apart from npm packages.
- The initial CI failure was caused by `actions/setup-node` npm caching requiring a lockfile that did not exist yet; npm caching was removed until a lockfile is committed.
- GitHub Actions run #11 completed successfully on 2026-08-23 using Node 22.
- Dependency installation completed successfully.
- `next build` compiled successfully, completed type checking, generated all static pages and finished production optimization.
- Current production output reports `/` at 238 kB route size and 340 kB First Load JS. This is acceptable for the procedural prototype but is now a concrete performance baseline to improve as production 3D assets are introduced.
- This session's local execution environment cannot resolve GitHub/npm hosts, so GitHub Actions is the authoritative production-build validation for now.

## Next action

1. Browser-review the first vertical slice and refine camera/animation composition.
2. Performance-check desktop and mobile using the 340 kB First Load JS baseline.
3. Add richer environment behavior and stronger spatial transitions.
4. Add solar/energy visualization and accumulated client choices.
5. Build the personalized `Your MacroPark` solution summary and lead-capture path.

## Change log

### 2026-08-23 — CI/build validation fixed

- Investigated the failed GitHub Actions job instead of assuming a code failure.
- Confirmed the failure happened in `setup-node` because npm caching required a missing lockfile.
- Removed premature npm cache configuration.
- Re-ran the PR workflow through the subsequent branch update.
- GitHub Actions run #11 passed dependency installation, production compilation, type checking, static generation and optimization.
- Recorded the current 340 kB First Load JS value as the first performance baseline.

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
- Added GitHub Actions CI and corrected the workflow so it does not depend on a lockfile that does not exist yet.
- Opened draft PR #1 for the phase.
- Local build validation could not run because the execution environment could not resolve external package hosts.

### 2026-08-23 — Planning baseline

- Created repository vision in `README.md`.
- Added full product/experience/implementation roadmap in `docs/ROADMAP.md`.
- Added this persistent progress checkpoint.
- No application code had been created at that point.
