# MacroPark Web — Progress Log

This file is the persistent project checkpoint. Keep it current after meaningful implementation, validation or product-direction changes so work can resume from GitHub without relying on chat history.

## Current status

**Project stage:** Phases 1–4 and Performance Pass 1 are merged. Performance Pass 2 and client-journey polish are implemented on the development branch. See `docs/PERFORMANCE_PASS_2.md` for findings, measurements and validation limits.

**Stable branch:** `main`

**Current development branch:** `performance-pass-2`

**Phase 1 PR:** #1 — merged into `main` as `d3794e5de78e672b4c5b5871c6ab880d9abebef4`.

**Phase 2 PR:** #2 — Home experience merged into `main` as `f576eec0921638ac1b58491e14558eb3658bc603`.

**Phase 3 PR:** #3 — Residence experience merged into `main` as `6ec8f7d1f2257438500247cae7dc0d6ca1576259`.

**Performance PR:** #4 — first rendering-performance pass merged into `main` as `ad2fb93a8af3912fcd55abab6271453a0aab2c46`.

**Phase 4 PR:** #5 — merged as `1b55563b8aed7c3abdfdde0f8be302424f7a9920`.

**Latest validation:** Local Node 24 production build, TypeScript/static generation and six state-regression tests pass. Desktop and portrait browser checks cover the Home, Residence and Retail stories, setup/handoff, replay, motion controls and responsive layout. Measurements use the actual RTX 3060 renderer exposed by the local browser, rather than SwiftShader. CI remains a separate check; the previous merged Retail run was #134.

**Current build baseline:** `/` is approximately 258 kB route size and 361 kB First Load JS. No runtime dependencies or downloaded 3D assets were added.

**Performance caveat:** Local steady-state samples were approximately 140–144 FPS at desktop/portrait viewport sizes on an RTX 3060. This is a single-device observation, not a measured before/after improvement, phone benchmark, thermal test or guarantee for other hardware.

**Current priority:** review Performance Pass 2 on the user's normal browser and representative physical phones before merging or adding a heavier system reveal. The production contact destination, deployment/domain and final content/SEO work remain open.

## 2026-09-05 — Performance Pass 2 and consultation polish

- Removed 17 remaining point-light declarations while preserving recognition indicators, charging, solar, guest and reservation stories.
- Fixed finite PerformanceMonitor fallback counting healthy samples as flips, which had forced fast devices to DPR 0.75. Adaptive quality can now recover; an explicit smoother-motion mode remains available.
- Gave each story exclusive camera ownership, retained deliberate mobile targets and composed scenes into the area left visible by the controls.
- Stopped completed car spline work and settled hardware updates; eliminated charging-pulse vector allocations and disposed generated cable geometries on unmount.
- Added true pause/hidden-tab/dialog rendering suspension and shared live reduced-motion handling.
- Raised previously occluded driveway/bay/guidance surfaces. Recognition stories now own authorization colors without a premature green base surface.
- Added replay, synchronized physical/DOM chooser highlights, direct solar controls, a clear progress trail and an unobstructed scene view.
- Preserved separate in-memory configurations across place changes; added an accessible native summary dialog, preview/remove actions and an empty-setup recovery state.
- Added retained in-memory project details, copy, full brief preview and a verified downloadable text brief. Personal details are not persisted or silently sent.
- Added opt-in local rendering diagnostics (`?perf=1`), six regression tests and reduced-motion/fallback CI capture cases.
- Final checks on 2026-09-06 verified static reduced-motion outcomes and the no-WebGL consultation journey at 320×568. Fixed fallback text overlap, Retail replay timing, and resuming a paused scene when solar or guest state changes.


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
- Performance budget is a product constraint: selected-environment culling, adaptive quality and restrained dynamic lighting/shadows must be preserved as later environments deepen.

## Phase 1 — COMPLETE / MERGED

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

## Phase 3 — RESIDENCE EXPERIENCE — COMPLETE / MERGED

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
- `ParkingBlocker` obeys Residence authorization during the protected-space story.
- Residence parking effects were raised onto the actual finished site surface after visual QA exposed that earlier effects were inside the site pad.
- Story cameras were moved into a clear central corridor instead of deleting landscaping that crossed the original camera line.
- GitHub Actions run #109 completed successfully on the final Residence visual code head.
- Final build before the performance pass reported `/` at approximately 252 kB route size and 354 kB First Load JS.
- Phase 3 PR #3 was squash-merged into `main` as `6ec8f7d1f2257438500247cae7dc0d6ca1576259`.

## Performance Pass 1 — COMPLETE / MERGED

Reason: production mode was still visibly too laggy, so performance became a blocker before deepening Retail.

### Runtime quality management

- [x] Replace up-to-1.7x supersampling with adaptive DPR.
- [x] Allow DPR to fall to 0.75 when sustained FPS is poor.
- [x] Start mobile on a lighter 0.8 DPR profile.
- [x] Disable dynamic shadows automatically on persistently struggling devices.
- [x] Disable shadows in the intro/chooser while all three worlds are visible.
- [x] Use cheaper basic shadows for selected-environment scenes.
- [x] Reduce the directional shadow map from 1024 to 512 and tighten its range.
- [x] Disable unnecessary WebGL MSAA/alpha/stencil overhead.

### Scene / lighting culling

- [x] Unmount Home/Residence/Retail environments that are not currently selected.
- [x] Unmount the decorative city during selected-environment close-ups.
- [x] Remove decorative continuous depth-particle and scene-glow animations.
- [x] Remove two global decorative point lights.
- [x] Remove duplicate Residence hardware already owned by the Phase 3 stories.
- [x] Replace decorative parking/path point lights with lightweight luminous geometry.

### Geometry / vehicle cost

- [x] Remove decorative trees, planters and small props from the shadow pass.
- [x] Simplify repeated façade/window geometry and materials.
- [x] Reduce decorative tree/plant/column segment counts.
- [x] Remove two real point lights from every lit procedural vehicle.
- [x] Restrict vehicle shadow casting to the main body rather than every submesh.
- [x] Reduce wheel radial segment counts while preserving silhouette.

### Performance validation notes

- GitHub Actions run #118 passed production build, TypeScript/static generation and all 16 deterministic visual-QA captures.
- Visual spot-checks after optimization remained acceptable for chooser, Home automatic access, Residence EV + solar and Retail guidance.
- Optimized build reports `/` at approximately 251 kB route size and 354 kB First Load JS.
- The bundle size is intentionally almost unchanged: this pass targets GPU/render workload rather than JavaScript payload.
- CI uses software WebGL and cannot establish real-world FPS. A production-mode real-device retest remains required.
- Performance PR #4 was squash-merged into `main` as `ad2fb93a8af3912fcd55abab6271453a0aab2c46`.
- npm 11 continues to emit the same non-blocking `sharp` install-script approval warning; production builds pass.

## Phase 4 — RETAIL / MALL EXPERIENCE — COMPLETE / MERGE-READY

Goal: make Retail the most dynamic public-parking story while keeping the experience understandable to a non-technical client and preserving the optimized render budget.

### Retail A — Entrance flow and recognition

- [x] Replace static queue props with multiple arriving vehicles using believable spacing.
- [x] Show recognition happening at one shared approach point while traffic keeps moving.
- [x] Visually demonstrate reduced stop-and-wait friction at the controlled entrance.
- [x] Keep the sequence calm and premium rather than looking like traffic simulation software.
- [x] Keep only the active Retail world mounted during the sequence.
- [x] Avoid attaching real point lights to the moving vehicles.
- [x] Add dedicated desktop/mobile entrance-flow camera choreography and QA.

### Retail B — Availability and guidance

- [x] Expand guidance into a pre-row availability system.
- [x] Show useful bay availability before the driver reaches the parking rows.
- [x] Keep the guided vehicle physically following the route to a free bay.
- [x] Make the selected bay clearly free/available before the car arrives.
- [x] Refine the first oversized availability gantry into a smaller approach-lane indicator.
- [x] Split the visual story into early availability and late destination-bay beats.
- [x] Validate desktop and mobile guidance framing.

### Retail C — Reserved / premium parking

- [x] Give the held premium bay a distinct warm amber waiting state.
- [x] Match the reserved vehicle at a physical recognition point.
- [x] Transition the held bay deterministically from amber to green after the match.
- [x] Let the matched vehicle physically proceed into the held bay.
- [x] Add reservation-specific desktop/mobile camera choreography.
- [x] Preserve a lightweight static reservation marker after the active story when the visitor adds other needs.

### Retail D — EV / solar

- [x] Connect a customer vehicle physically to the existing Retail charger row.
- [x] Add a real cable and lightweight charging pulses without new point lights.
- [x] Show charging as useful customer dwell time without technical telemetry.
- [x] Support contextual solar canopy and solar-to-charger energy flow.
- [x] Add dedicated desktop/mobile charging composition.
- [x] Validate desktop EV + solar and mobile EV framing.

## Retail Phase 4 validation notes

- `RetailEntranceSequence.tsx` owns the staggered multi-vehicle continuous entrance flow and shared recognition point.
- `RetailAvailabilityLayer.tsx` owns the lightweight pre-row availability structure and bay-status markers.
- The original large availability gantry was reduced/repositioned after screenshot QA showed it visually blocking the retail architecture.
- `RetailReservationSequence.tsx` owns the amber held-bay → recognition → green occupied-bay story.
- Reservation state switching uses direct Three.js group visibility for deterministic visual state during timed CI captures.
- `RetailChargingSequence.tsx` owns the customer vehicle, physical cable, charging pulses and optional solar-to-charger energy path while reusing the existing charger hardware.
- Shared `SolutionEffects` were further optimized: old point lights were removed from guidance, reservation, guest and flow-status helpers so multi-need configurations do not silently rebuild dynamic-light cost.
- Final Retail code head `2511b2516e94c4f56f84e75eb76c6ae955670b4c` passed GitHub Actions run #134.
- Run #134 reported `/` at approximately 254 kB route size and 356 kB First Load JS.
- All requested Retail screenshots were successfully captured and manually spot-checked: entrance desktop/mobile, availability, guided destination, reservation waiting/matched desktop/mobile and EV/solar desktop/mobile.
- One unrelated `desktop-residence-guest-active.png` regression capture timed out under software WebGL after the matrix grew; earlier Residence validation had already covered this state successfully. The workflow continued and uploaded 24 screenshots.
- The expanded Retail functionality added about 2 kB First Load JS over the post-optimization baseline.

## After Retail

1. Run a real-device production FPS / thermal / loading retest before adding another visually heavy phase.
2. If performance remains poor, do Performance Pass 2: reduce remaining per-frame hooks/lights, audit charging sequences, consider selective `frameloop`/invalidation and add a user-visible quality mode if necessary.
3. Add the MacroPark system/digital-twin reveal only after real-device performance is acceptable.
4. Selectively replace procedural hero objects with optimized GLB assets only where screenshots prove the gain is worth the payload.
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

### 2026-08-24 — Retail Phase 4 complete

- Replaced the static Retail queue with three staggered moving arrivals sharing a lightweight recognition point.
- Added a two-beat parking-guidance story: pre-row availability first, then a physically guided vehicle reaching the selected free bay.
- Added premium reservation with amber held state, vehicle matching, deterministic green occupied state and actual parking.
- Added customer EV charging using the existing charger row, a physical cable, charging pulses and optional solar energy flow.
- Added dedicated desktop/mobile camera choreography for entrance, reservation and charging stories.
- Removed residual point lights from shared configuration effects to preserve the Performance Pass 1 budget as multiple needs accumulate.
- Expanded deterministic QA to cover the deeper Retail stories; final code head passed run #134.
- Final build is approximately 254 kB route size / 356 kB First Load JS.
- One older Residence active-guest screenshot capture timed out under SwiftShader in the enlarged matrix; all Retail captures completed and prior Residence validation remains valid.

### 2026-08-24 — Performance Pass 1 merged

- Promoted performance from later polish to a blocking product constraint after production-mode lag was observed.
- Added adaptive DPR and mobile-first lightweight render settings.
- Added automatic shadow fallback and removed shadows from the multi-world intro/chooser.
- Unmounted inactive environments and decorative city geometry during close-up stories.
- Reduced global/dynamic lighting, shadow-map cost, decorative shadow casting and repeated geometry complexity.
- Removed per-vehicle point lights and reduced vehicle shadow/geometry cost.
- GitHub Actions run #118 passed build, TypeScript and the full 16-state WebGL regression matrix.
- PR #4 was squash-merged into `main` as `ad2fb93a8af3912fcd55abab6271453a0aab2c46`.
- Real-device production FPS must still be retested before final performance sign-off.

### 2026-08-24 — Residence Phase 3 complete / merged

- Rebuilt the assigned-space story around recognition-driven authorization rather than instant feature activation.
- Added resident arrival, assigned-bay illumination, authorization-controlled blocker and physical parking.
- Corrected Residence parking effects to the actual finished site elevation and moved the blocker to the bay entrance.
- Added a dedicated reservation journey with amber waiting state, vehicle match, green authorization and physical parking.
- Added Residence active/expired guest access using the same client-facing comparison language established in Home.
- Added shared EV charging with a parked vehicle, physical cable, energy pulses and optional solar-to-charger flow.
- Added dedicated Residence camera choreography and expanded the visual-QA matrix to 16 deterministic desktop/mobile states.
- GitHub Actions run #109 passed the cumulative Phase 3 production build and full visual-QA workflow.
- PR #3 was squash-merged into `main` as `6ec8f7d1f2257438500247cae7dc0d6ca1576259`.

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
