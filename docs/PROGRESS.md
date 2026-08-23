# MacroPark Web — Progress Log

This file is the persistent checkpoint for the project. Update it after meaningful implementation or design decisions so work can resume without relying on chat history.

## Current status

**Project stage:** Planning complete, implementation not started.

**Current priority:** Phase 0 foundation followed immediately by the Phase 1 interaction prototype.

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

- [ ] Initialize Next.js + TypeScript.
- [ ] Configure project quality tooling.
- [ ] Add React Three Fiber / Three.js foundation.
- [ ] Add Drei and animation tooling.
- [ ] Establish scene/state architecture.
- [ ] Establish design tokens and typography.
- [ ] Build responsive canvas/app shell.
- [ ] Define asset-loading strategy.
- [ ] Define performance baseline.
- [ ] Define reduced-motion and WebGL fallback behavior.

### Phase 1 — Vertical slice

- [ ] Create opening environment.
- [ ] Add hero vehicle.
- [ ] Add entrance/gate.
- [ ] Add automatic arrival demonstration.
- [ ] Build world reveal.
- [ ] Build spatial environment selector.
- [ ] Create camera choreography.
- [ ] Build first environment transition.
- [ ] Add one problem-selection interaction.
- [ ] Add one physical solution demonstration.
- [ ] Add first-pass responsive/mobile treatment.
- [ ] Performance-check the complete vertical slice.

## Decisions still intentionally open

These should be decided during implementation based on what produces the strongest experience:

- Exact opening copy.
- Exact architectural style of the shared world.
- Whether the first fully implemented environment is Home or Residence.
- Exact vehicle model/style.
- How much scroll versus direct interaction controls progression.
- Whether subtle sound is valuable enough to include.
- Exact final brand accent colors.
- Whether generated imagery is needed beyond supporting textures/background assets.

## Next action

Start implementation with **Phase 0** on a dedicated development branch, then build the smallest convincing Phase 1 vertical slice before expanding to additional environments.

## Change log

### 2026-08-23 — Planning baseline

- Created repository vision in `README.md`.
- Added full product/experience/implementation roadmap in `docs/ROADMAP.md`.
- Added this persistent progress checkpoint.
- No application code has been created yet.
