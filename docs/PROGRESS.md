# MacroPark Web — Progress Log

This file is the persistent project checkpoint. Keep it current after meaningful implementation, validation or product-direction changes so work can resume from GitHub without relying on chat history.

## Current status

**Project stage:** Phase 1 complete and merged. Phase 2 begins with the Home experience.

**Stable branch:** `main`

**Phase 1 PR:** #1 — merged into `main` as `d3794e5de78e672b4c5b5871c6ab880d9abebef4`.

**Latest Phase 1 validation:** GitHub Actions run #70 passed Node 24 install, production compile, TypeScript validation, static generation, optimization, headless WebGL visual QA and screenshot artifact upload.

**Current performance baseline:** approximately 349 kB First Load JS on `/`, versus approximately 340 kB for the original vertical-slice baseline.

**Current priority:** deepen Home into an end-to-end physical arrival story before expanding more environments.

## Locked product direction

- Client-facing, not technical.
- 3D interactive and visually guided.
- The site behaves like an intelligent parking consultant rather than a feature catalog.
- `gta.shrid.site` is inspiration only for interaction quality/polish; it is not a template to copy.
- The previous MacroPark project page is product context only; this repository is the new website.
- The environment is the primary navigation: Home, Residence and Retail/Mall.
- Visitors express real-life needs; MacroPark demonstrates physical outcomes.
- Client choices accumulate into one coherent solution.
- Reservation and guest access remain separate concepts.
- EV charging and solar are contextual additions inside each environment.
- Desktop receives cinematic composition; mobile receives intentionally different camera/UI composition.
- Reduced motion, WebGL fallback and performance remain requirements.
- Never fake a successful lead submission. The project brief remains useful even before a real CRM/email destination is connected.
- Procedural-first remains the asset strategy until a heavier GLB clearly produces a worthwhile visual gain.

## Phase 1 — COMPLETE

Phase 1 established the full client journey and reusable 3D architecture.

### Experience

- [x] Cinematic arrival with vehicle recognition and controlled barrier.
- [x] 3D world reveal.
- [x] Spatial Home / Residence / Retail selector.
- [x] Environment-specific client questions and problem selection.
- [x] Contextual recommended-next-step behavior.
- [x] Persistent multi-need configuration.
- [x] Personalized `Your MacroPark` summary.
- [x] Functional project/consultation brief handoff.
- [x] Honest copy/share fallback before CRM integration.

### Home

- [x] Automatic-access concept.
- [x] Animated garage door.
- [x] Guest-arrival visualization.
- [x] EV charger.
- [x] EV + solar canopy path.

### Residence

- [x] Assigned-space protection.
- [x] Motorized parking blocker.
- [x] Guest-access scenario.
- [x] Explicit parking reservations distinct from guest access.
- [x] Shared EV charging.
- [x] EV + solar path.

### Retail / mall

- [x] Queue / entrance-flow scenario.
- [x] Free-space guidance.
- [x] Vehicle physically follows the guidance route.
- [x] Illuminated free-space destination indicator.
- [x] Premium/reserved parking.
- [x] Customer EV charging.
- [x] EV + solar path.

### Visual system

- [x] Reusable premium procedural vehicle.
- [x] Reusable barrier / recognition-camera entrance kit.
- [x] Reusable parking blocker, EV charger and solar canopy family.
- [x] Upgraded villa, residence and retail architecture.
- [x] Landscaping, glazing, parking surfaces and environmental lighting.
- [x] Pointer parallax, depth particles and environment-focused lighting.
- [x] Problem-specific camera framing where required.
- [x] Mobile-specific camera framing.
- [x] MacroPark application/favicon mark.

### Engineering / QA

- [x] Next.js + TypeScript + React Three Fiber / Three.js architecture.
- [x] Explicit Zustand experience state machine.
- [x] Node 24 GitHub Actions production-build validation.
- [x] Automated deterministic visual-QA states.
- [x] Desktop arrival / chooser / Home / Residence / Retail captures.
- [x] Mobile chooser / Home / Residence captures.
- [x] Resilient screenshot capture so flaky headless Chrome does not falsely fail a healthy production build.
- [x] Reduced-motion canvas behavior.
- [x] WebGL-unavailable fallback.
- [ ] Real-device FPS / thermal / loading test remains outstanding.

## Phase 2 — HOME EXPERIENCE

Goal: turn the Home environment from a feature demonstration into a short cinematic story that visually proves how MacroPark works in daily life.

### Phase 2A — Authorized arrival — CURRENT

- [ ] Add a dedicated Home arrival vehicle that enters the driveway.
- [ ] Add a discreet driveway recognition camera / sensor.
- [ ] Animate recognition as the car reaches the scan point.
- [ ] Trigger the garage opening only after recognition instead of immediately on selection.
- [ ] Continue the vehicle toward the garage after authorization.
- [ ] Add problem-specific desktop camera choreography for the sequence.
- [ ] Add a dedicated mobile Home automatic-access QA capture.
- [ ] Validate full production build and visual artifacts.

### Phase 2B — Guest and denied access

- [ ] Animate a temporary guest arrival rather than showing only a static guest car.
- [ ] Visually communicate the temporary access window without exposing technical controls.
- [ ] Add an unknown/expired vehicle denial demonstration.
- [ ] Keep denial calm and premium rather than alarm/security-dashboard styled.

### Phase 2C — Home charging / energy

- [ ] Make the EV connection/charging state more physical.
- [ ] Add a clearer battery/energy-flow story without technical telemetry.
- [ ] Improve solar-canopy transformation and relationship to the driveway.
- [ ] Decide whether optional battery storage materially improves the client story.

## After Home

Once Home reaches the desired quality bar:

1. Deepen Residence: gate → resident arrival → assigned bay → blocker lowers → visitor/reservation flow.
2. Deepen Retail: entrance flow → occupancy/guidance → vehicle parking → premium reservation → EV.
3. Add the MacroPark system/digital-twin reveal only after the physical client stories are strong.
4. Selectively replace procedural hero objects with optimized GLB assets only where screenshots prove the gain is worth the payload.
5. Performance-test representative desktop and mobile hardware.
6. Connect the project handoff to the final MacroPark email/CRM destination.

## Open decisions

- Final opening copy.
- Final brand accent palette.
- Whether the procedural hero vehicle remains or becomes a compressed GLB.
- Whether optional sound improves the experience enough to justify it.
- Final contact email / CRM destination.
- Final deployment/domain configuration.

## Validation notes

- React Three Fiber remains aligned to the React 19-compatible v9 line; Drei uses the compatible v10 line.
- CI uses Node 24 and current Actions v7 runtimes.
- npm 11 may emit a non-blocking `sharp` install-script approval warning; production builds pass.
- The app intentionally has no required remote HDR/model dependency for the core render.
- Phase 1 was merged only after the final Retail-guidance sequence passed production build and visual QA.

## Change log

### 2026-08-23 — Phase 1 locked and merged

- Completed the Retail guidance story with a moving vehicle following the route toward the selected free space.
- Added a physical illuminated availability structure so the destination reads as a real parking space rather than an abstract glow.
- Final Phase 1 CI run #70 passed build and visual QA.
- PR #1 was marked ready and squash-merged to `main`.
- Phase 2 was defined around a deeper Home client story instead of adding more environments.

### 2026-08-23 — Phase 1 visual / intelligent-client milestone

- Upgraded Home, Residence and Retail architecture.
- Added an actually opening Home garage.
- Added contextual recommended-next-step behavior after each demonstrated need.
- Added mobile-specific environment cameras.
- Added reliable automated visual QA with deep desktop and mobile states.
- Added the MacroPark application icon.

### 2026-08-23 — Phase 1 functional foundation

- Built the initial 3D journey, recognition entrance, three environments, multi-need configuration, reservations, EV/solar, project handoff, responsive UI, reduced-motion support and WebGL fallback.
- Added premium procedural vehicle/entrance/hardware components.
- Established GitHub Actions validation and persistent project documentation.

### 2026-08-23 — Planning baseline

- Repository started empty.
- Added product vision, roadmap and persistent progress documentation.
