# MacroPark Web — Progress Log

This file is the persistent project checkpoint. Keep it current after meaningful implementation, validation or product-direction changes so work can resume from GitHub without relying on chat history.

## Current status

**Project stage:** Phase 1 foundation and Phase 2 Home are merged. Phase 3 Residence is complete, validated and merge-ready. Retail/Mall is next.

**Stable branch:** `main`

**Current development branch:** `phase-3-residence-experience`

**Phase 1 PR:** #1 — merged into `main` as `d3794e5de78e672b4c5b5871c6ab880d9abebef4`.

**Phase 2 PR:** #2 — Home experience merged into `main` as `f576eec0921638ac1b58491e14558eb3658bc603`.

**Phase 3 PR:** #3 — `Phase 3: deepen Residence parking experience` — complete and merge-ready.

**Latest validation:** GitHub Actions run #109 passed Node 24 install, production compile, TypeScript validation, static generation, optimization, the 16-state headless WebGL visual-QA matrix and artifact upload on final Residence code commit `575aa46ec29626de87075888f15abfcb1e72814a`. Commits after that validated code head only update project documentation.

**Current performance baseline:** `/` is approximately 252 kB route size and 354 kB First Load JS, versus approximately 340 kB First Load JS for the original vertical-slice baseline and 352 kB after the completed Home phase.

**Current priority:** merge the completed Residence experience, then deepen Retail/Mall into a multi-car entrance → recognition → availability/guidance → actual parking → reservation/premium → EV story.

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

## Phase 2 — HOME EXPERIENCE — COMPLETE / MERGED

Goal: turn the Home environment from a feature demonstration into a short cinematic story that visually proves how MacroPark works in daily life.

### Phase 2A — Authorized arrival

- [x] Dedicated Home arrival vehicle enters the driveway.
- [x] Discreet driveway recognition camera / sensor.
- [x] Recognition animates as the car reaches the scan point.
- [x] Garage opening is triggered only after recognition.
- [x] Authorized vehicle continues toward the garage.
- [x] Problem-specific desktop camera choreography.
- [x] Dedicated mobile Home automatic-access QA capture.
- [x] Rolling/compressing garage-door behavior.
- [x] Full production build and visual validation.

### Phase 2B — Guest and denied access

- [x] Animated temporary guest arrival.
- [x] Temporary access window communicated without technical controls.
- [x] Client-facing `Guest expected` / `After visit` comparison.
- [x] Authorized guest continues after recognition.
- [x] Expired guest stops at recognition.
- [x] Green for active access; warm amber for expired access.
- [x] Calm, premium denial rather than alarm/security-dashboard styling.
- [x] Deterministic desktop active/expired and mobile guest QA states.
- [x] Complete guest flow validated in CI.

### Phase 2C — Home charging / energy

- [x] Physical parked vehicle, charger and cable.
- [x] Animated charging pulses through the cable.
- [x] Client-friendly charging halo and charger status.
- [x] Progressive solar-canopy deployment.
- [x] Visible solar-to-charger energy path.
- [x] Dedicated desktop/mobile charging composition.
- [x] Desktop/mobile EV + solar QA states.
- [x] Solar deployment respects `prefers-reduced-motion`.
- [x] Battery storage deferred until it materially improves the client story.
- [x] Complete Home charging / solar story validated in CI.

## Phase 3 — RESIDENCE EXPERIENCE — COMPLETE

Goal: make Residence feel like a complete daily parking story rather than a static set of features.

### Residence A — Resident arrival and protected bay

- [x] Animate a resident vehicle entering the residence parking area.
- [x] Add a discreet resident recognition moment.
- [x] Illuminate the resident's assigned bay only after recognition.
- [x] Keep the motorized blocker raised until authorization is confirmed.
- [x] Lower the blocker only for the authorized resident.
- [x] Continue the vehicle physically into the assigned bay.
- [x] Move the blocker to the bay entrance rather than underneath the parked car.
- [x] Raise bay, sensor and blocker effects above the actual finished parking surface.
- [x] Add clear assigned-bay outline / status lighting.
- [x] Add problem-specific desktop and mobile camera choreography.
- [x] Validate recognition and parked-result states with deterministic screenshots.

### Residence B — Visitors and reservations

- [x] Add an animated reservation arrival for a specific vehicle.
- [x] Keep reservation visually distinct from gate access.
- [x] Start the reserved bay in warm amber while it waits for the correct car.
- [x] Match the arriving vehicle at the recognition point.
- [x] Transition the reservation from amber waiting state to green authorized/occupied state.
- [x] Let the matched vehicle physically continue into the reserved bay.
- [x] Reuse the Home `Guest expected` / `After visit` interaction for Residence guest access.
- [x] Allow an active guest to proceed into the residence parking area.
- [x] Stop an expired guest calmly at recognition with warm amber feedback.
- [x] Validate reservation waiting/matched and guest active/expired states in desktop QA.
- [x] Validate expired guest behavior in portrait/mobile QA.

### Residence C — Shared EV / solar

- [x] Turn shared residence charging into a connected car/charger interaction.
- [x] Add a physical charging cable and animated charging pulses.
- [x] Add an illuminated shared charging bay and charger status.
- [x] Reuse the simplified energy-flow language established in Home.
- [x] Support optional Residence solar canopy through the normal configuration flow.
- [x] Add warm solar-to-shared-charger energy pulses when solar is enabled.
- [x] Add dedicated desktop and mobile charging composition.
- [x] Validate desktop EV + solar and mobile EV states.

## Residence Phase 3 validation notes

- `ResidenceAccessSequence.tsx` owns recognition-driven resident arrival and cinematic framing.
- `ResidenceReservationSequence.tsx` owns the amber waiting → matched green → parked reservation story.
- `ResidenceGuestSequence.tsx` owns active/expired visitor arrival while reusing the shared guest-preview state.
- `ResidenceChargingSequence.tsx` owns the parked vehicle, charger cable, charging pulses and optional solar-to-charger flow.
- `ParkingBlocker` now obeys Residence authorization during the protected-space story.
- Residence parking effects were raised onto the actual finished site surface after visual QA exposed that the earlier effects were being drawn inside the 0.22-unit site pad.
- Story cameras were moved into a clear central corridor instead of deleting landscaping that happened to cross the original camera line.
- GitHub Actions run #109 completed successfully on the final Residence code head.
- Run #109 produced all 16 requested visual-QA images and uploaded them successfully.
- Final build reported `/` at approximately 252 kB route size and 354 kB First Load JS.
- Final desktop EV + solar render clearly shows the charging car, cable, charger, bay outline, solar canopy and energy path without the foreground tree blocking the story.
- npm 11 continues to emit the same non-blocking `sharp` install-script approval warning; production builds pass.

## Next — PHASE 4 RETAIL / MALL EXPERIENCE

Goal: make Retail the most dynamic public-parking story while keeping the experience understandable to a non-technical client.

### Retail A — Entrance flow and recognition

- [ ] Animate multiple arriving vehicles with believable spacing rather than static queue props.
- [ ] Show recognition happening while traffic keeps moving.
- [ ] Visually demonstrate reduced stop-and-wait friction at the controlled entrance.
- [ ] Keep the sequence calm and premium rather than looking like traffic simulation software.

### Retail B — Availability and guidance

- [ ] Expand the existing guidance story into a broader availability system.
- [ ] Show useful availability information before the driver enters the parking rows.
- [ ] Keep the guided vehicle physically following the route to a free bay.
- [ ] Make the selected bay clearly free/available before the car arrives.
- [ ] Validate desktop and mobile guidance framing.

### Retail C — Reserved / premium parking

- [ ] Give a reserved or premium bay a distinct waiting state.
- [ ] Match the reserved vehicle on arrival.
- [ ] Let the matched vehicle proceed to its held bay.
- [ ] Release or normalize the reserved state after arrival.

### Retail D — EV / solar

- [ ] Connect a customer vehicle physically to a charger.
- [ ] Show charging as useful customer dwell time without technical telemetry.
- [ ] Support contextual solar canopy / energy flow.
- [ ] Validate desktop and mobile EV framing.

## After Retail

1. Add the MacroPark system/digital-twin reveal only after all physical client stories are strong.
2. Selectively replace procedural hero objects with optimized GLB assets only where screenshots prove the gain is worth the payload.
3. Performance-test representative desktop and mobile hardware.
4. Connect the project handoff to the final MacroPark email/CRM destination.
5. Finalize deployment/domain configuration, SEO/accessibility and production copy.

## Open decisions

- Final opening copy.
- Final brand accent palette.
- Whether the procedural hero vehicle remains or becomes a compressed GLB.
- Whether optional sound improves the experience enough to justify it.
- Final contact email / CRM destination.
- Final deployment/domain configuration.

## Change log

### 2026-08-24 — Residence Phase 3 complete

- Rebuilt the assigned-space story around recognition-driven authorization rather than instant feature activation.
- Added resident arrival, assigned-bay illumination, authorization-controlled blocker and physical parking.
- Corrected Residence parking effects to the actual finished site elevation and moved the blocker to the bay entrance.
- Added a dedicated reservation journey with amber waiting state, vehicle match, green authorization and physical parking.
- Added Residence active/expired guest access using the same client-facing comparison language established in Home.
- Added shared EV charging with a parked vehicle, physical cable, energy pulses and optional solar-to-charger flow.
- Added dedicated Residence camera choreography and expanded the visual-QA matrix to 16 deterministic desktop/mobile states.
- GitHub Actions run #109 passed the cumulative Phase 3 production build and full visual-QA workflow.
- Current First Load JS is approximately 354 kB.

### 2026-08-23 — Home Phase 2 complete

- Completed recognition-triggered Home arrival with a moving vehicle and rolling garage response.
- Replaced the static guest prop with animated active and expired guest-access stories.
- Added a simple client-facing comparison between an expected guest and an ended visit.
- Added physical EV charging with a parked vehicle, charger cable and animated energy pulses.
- Added progressive solar-canopy deployment and solar-to-charger energy flow.
- Added dedicated desktop/mobile cameras and deterministic visual-QA states for the deeper Home experience.
- Deferred battery storage until it materially improves the client story.
- GitHub Actions run #87 passed the cumulative Home Phase 2 production build and visual-QA workflow.
- Current First Load JS was approximately 352 kB.

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
