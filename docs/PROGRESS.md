# MacroPark Web — Progress Log

This file is the persistent project checkpoint. Keep it current after meaningful implementation, validation or product-direction changes so work can resume from GitHub without relying on chat history.

## Current status

**Project stage:** Phase 1 is merged. Phase 2 Home experience is complete and ready to merge. Residence is next.

**Stable branch:** `main`

**Current development branch:** `phase-2-home-experience`

**Phase 1 PR:** #1 — merged into `main` as `d3794e5de78e672b4c5b5871c6ab880d9abebef4`.

**Phase 2 PR:** #2 — `Phase 2: deepen Home arrival experience`.

**Latest validation:** GitHub Actions run #87 passed Node 24 install, production compile, TypeScript validation, static generation, optimization, headless WebGL visual QA and artifact upload.

**Current performance baseline:** `/` is approximately 249 kB route size and 352 kB First Load JS, versus approximately 340 kB First Load JS for the original vertical-slice baseline.

**Current priority:** merge the completed Home experience, then deepen Residence into a resident-arrival → assigned-bay → blocker-lowers → vehicle-parks story.

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
- Client-facing access denial should remain calm and premium: the system simply does not grant access when authorization is absent or expired.

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

### Visual / engineering foundation

- [x] Reusable premium procedural vehicle.
- [x] Reusable barrier / recognition-camera entrance kit.
- [x] Reusable parking blocker, EV charger and solar canopy family.
- [x] Upgraded villa, residence and retail architecture.
- [x] Desktop and mobile-specific camera composition.
- [x] Node 24 production-build validation.
- [x] Automated deterministic visual QA.
- [x] Reduced-motion canvas behavior.
- [x] WebGL-unavailable fallback.
- [ ] Real-device FPS / thermal / loading test remains outstanding.

## Phase 2 — HOME EXPERIENCE — COMPLETE

Goal: turn the Home environment from a feature demonstration into a short cinematic story that visually proves how MacroPark works in daily life.

### Phase 2A — Authorized arrival

- [x] Add a dedicated Home arrival vehicle that enters the driveway.
- [x] Add a discreet driveway recognition camera / sensor.
- [x] Animate recognition as the car reaches the scan point.
- [x] Trigger the garage opening only after recognition instead of immediately on selection.
- [x] Continue the vehicle toward the garage after authorization.
- [x] Add problem-specific desktop camera choreography for the sequence.
- [x] Add a dedicated mobile Home automatic-access QA capture.
- [x] Replace the floating-door motion with a rolling/compressing garage-door behavior.
- [x] Validate full production build and visual artifacts.

### Phase 2B — Guest and denied access

- [x] Animate a temporary guest arrival rather than showing only a static guest car.
- [x] Visually communicate the temporary access window without exposing technical controls.
- [x] Add a client-facing `Guest expected` / `After visit` comparison.
- [x] Let an authorized guest continue after recognition.
- [x] Stop an expired guest at the recognition point.
- [x] Use green for active temporary access and warm amber for expired access.
- [x] Keep denial calm and premium rather than alarm/security-dashboard styled.
- [x] Add deterministic desktop active/expired and mobile guest visual-QA states.
- [x] Validate the complete guest flow in production CI.

### Phase 2C — Home charging / energy

- [x] Make the EV connection physical with a parked vehicle, charger and visible cable.
- [x] Add animated charging pulses through the cable.
- [x] Add a client-friendly charging halo and charger-status pulse without technical telemetry.
- [x] Animate the solar canopy deployment instead of making it pop into the scene.
- [x] Add a visible solar-to-charger energy path when solar is enabled.
- [x] Give Home EV charging dedicated desktop and mobile camera composition.
- [x] Add desktop and mobile EV + solar visual-QA captures.
- [x] Keep solar deployment compatible with `prefers-reduced-motion`.
- [x] Decide on optional battery storage: defer it for now because it adds complexity without improving the current client story enough.
- [x] Validate the complete charging / solar story in production CI.

## Home Phase 2 validation notes

- Phase 2A introduced `HomeAccessSequence.tsx` and recognition-triggered garage behavior.
- Phase 2B introduced `HomeGuestSequence.tsx`, active/expired guest preview state and a simple client-facing comparison control.
- Phase 2C introduced `HomeChargingSequence.tsx`, an actual cable, charging pulses and solar-to-charger energy flow.
- The shared `EVCharger` now supports an animated charging state.
- The shared `SolarCanopy` now deploys progressively and respects reduced motion.
- GitHub Actions run #87 completed successfully after all Home Phase 2 work.
- Latest build reported `/` at approximately 249 kB route size and 352 kB First Load JS.
- In run #87, one redundant `mobile-home-access` headless Chrome capture hit its per-shot timeout; the production build remained green and the other 12 visual-QA images, including mobile Home guest and mobile Home EV + solar, uploaded successfully. Earlier mobile Home automatic-access captures had already been reviewed successfully.
- npm 11 still emits a non-blocking `sharp` install-script approval warning; production builds pass.

## Next — RESIDENCE EXPERIENCE

Goal: make Residence feel like a complete daily parking story rather than a static set of features.

### Residence A — Resident arrival and protected bay

- [ ] Animate a resident vehicle entering the residence parking area.
- [ ] Add a discreet resident recognition moment.
- [ ] Illuminate the resident's assigned bay after recognition.
- [ ] Keep the motorized blocker raised until authorization is confirmed.
- [ ] Lower the blocker only for the authorized resident.
- [ ] Continue the vehicle physically into the assigned bay.
- [ ] Add problem-specific desktop and mobile camera choreography.
- [ ] Validate with deterministic Residence protection screenshots.

### Residence B — Visitors and reservations

- [ ] Animate a pre-authorized visitor arrival.
- [ ] Visually separate gate access from a reserved parking bay.
- [ ] Show a specific reserved bay waiting for the visitor.
- [ ] Show an expired/unreserved arrival leaving the protected bay unavailable.
- [ ] Keep the time-window story understandable without technical controls.

### Residence C — Shared EV

- [ ] Turn shared residence charging into a connected car/charger interaction.
- [ ] Show charging access following resident/reservation authorization.
- [ ] Reuse the simplified energy-flow language established in Home.

## After Residence

1. Deepen Retail: entrance flow → occupancy/guidance → vehicle parking → premium reservation → EV.
2. Add the MacroPark system/digital-twin reveal only after the physical client stories are strong.
3. Selectively replace procedural hero objects with optimized GLB assets only where screenshots prove the gain is worth the payload.
4. Performance-test representative desktop and mobile hardware.
5. Connect the project handoff to the final MacroPark email/CRM destination.
6. Finalize deployment/domain configuration, SEO/accessibility and production copy.

## Open decisions

- Final opening copy.
- Final brand accent palette.
- Whether the procedural hero vehicle remains or becomes a compressed GLB.
- Whether optional sound improves the experience enough to justify it.
- Final contact email / CRM destination.
- Final deployment/domain configuration.

## Change log

### 2026-08-23 — Home Phase 2 complete

- Completed recognition-triggered Home arrival with a moving vehicle and rolling garage response.
- Replaced the static guest prop with animated active and expired guest-access stories.
- Added a simple client-facing comparison between an expected guest and an ended visit.
- Added physical EV charging with a parked vehicle, charger cable and animated energy pulses.
- Added progressive solar-canopy deployment and solar-to-charger energy flow.
- Added dedicated desktop/mobile cameras and deterministic visual-QA states for the deeper Home experience.
- Deferred battery storage until it materially improves the client story.
- GitHub Actions run #87 passed the cumulative Home Phase 2 production build and visual-QA workflow.
- Current First Load JS is approximately 352 kB.

### 2026-08-23 — Phase 1 locked and merged

- Completed the Retail guidance story with a moving vehicle following the route toward the selected free space.
- Added a physical illuminated availability structure so the destination reads as a real parking space rather than an abstract glow.
- Final Phase 1 CI run #70 passed build and visual QA.
- PR #1 was marked ready and squash-merged to `main`.
- Phase 2 was defined around a deeper Home client story instead of adding more environments.

### 2026-08-23 — Phase 1 visual / intelligent-client milestone

- Upgraded Home, Residence and Retail architecture.
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
