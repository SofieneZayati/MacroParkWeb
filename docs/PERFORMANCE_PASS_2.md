# Performance Pass 2 — audit and validation

Development branch: `performance-pass-2`. Work started 2026-09-05; final validation continued 2026-09-06. The merged baseline is `1b55563`.

## Confirmed problems and changes

1. **Healthy GPUs were forced into the lowest quality.** The installed Drei PerformanceMonitor increments `flipped` on every incline or decline, not just changes of direction. The old `flipflops={2}` therefore forced DPR 0.75 after three healthy sampling windows too. Removed that finite cutoff. Sustained low FPS still reduces DPR and disables shadows; the visitor can explicitly select Smoother motion.
2. **Multiple controllers moved the same camera.** The overview rig, active story, composition offset and parallax each changed the camera within one frame. Story cameras now have exclusive ownership. Pointer parallax belongs to the overview target; settled projection updates stop. Projection offsets reserve room for the interface without changing the physical story targets.
3. **Indicators incurred world-lighting cost.** Removed 17 point-light declarations across sequence/hardware/world components. Existing emissive LEDs, scan planes, bay outlines and charging/solar pulses communicate the same states. No point lights remain in the experience source.
4. **Completed animations kept doing work.** Parked cars no longer resample splines; hardware stops writing settled transforms. Charging pulses reuse existing vector positions and generated cable geometry is disposed on unmount.
5. **Rendering continued when it could not help.** Hidden tabs, explicit pause and the modal summary now stop rendering. Reduced motion uses demand rendering with final physical outcomes and static charging feedback. The clock keeps its scene time across pause/resume, and queued invalidations are cleared before entering manual time to prevent a spurious time jump.
6. **Some surfaces were physically hidden.** Home driveway and bay/guidance surfaces were below the raised site pads. Their elevations are corrected. Residence base bays no longer imply green authorization before a story grants it. Retail reservation visibility is reconciled after React/Suspense updates. Guided Retail parking ends aligned with the bay.

## Client experience improvements

- More legible place selection with architectural icons and linked building highlights on pointer hover or keyboard focus.
- Replay the active demonstration, view the scene without its decision panel, pause motion and choose a lighter quality setting.
- Retail entrance replay starts its own timeline. Changing solar or guest authorization resumes a paused scene so the physical result can update.
- Add/remove solar directly while seeing the EV scene.
- A clearer place → needs → setup journey and a useful next step once all needs are selected.
- Separate in-memory Home/Residence/Retail configurations survive switching places. Refreshing the page still starts a new visit; no personal data is persisted.
- Native modal summary with Escape, focus restoration, individual preview/remove controls and an empty state.
- Project details survive returning to the setup. The brief can be previewed, copied or downloaded as text; an optional configured email recipient opens a prepared message for the visitor to review/send. There is no fake CRM success.

## Local measurements

The local in-app Chromium browser exposed an **NVIDIA GeForce RTX 3060 / Direct3D11 ANGLE renderer**. Measurements came from real render-loop frame intervals, not an assumed refresh rate. `?perf=1` shows the most recent one-second interval, p95 frame time, draw calls, triangles, point lights, DPR and renderer. It sends nothing externally.

Representative steady-state observations during the production-browser pass:

| Scene / viewport | FPS | p95 frame interval | Draw calls | DPR |
| --- | ---: | ---: | ---: | ---: |
| Home EV + solar, 1280×720 | 144.0 | 7.2 ms | 111 | 1.08 |
| Residence protected space, 390×844 viewport | 144.0 | 7.2 ms | 84 | 1.10 |
| Residence reservation, 1280×720 | 144.0 | 7.1 ms | 114 | 1.10 |
| Retail moving arrivals, 1280×720 | 144.0 | 7.1 ms | 148 | 1.10 |
| Retail guidance, 1280×720 | 144.0 | 7.4 ms | 136 | 1.10 |

Some transition samples were 129–142 FPS while cameras, mounted content and viewport dimensions changed. Draw-call counts vary with culling, shadows and accumulated choices. The meter reports CPU-observed frame intervals, not GPU timer-query durations. These are **spot measurements on one GPU**, not a recorded before/after benchmark or a guarantee of zero stutter. A portrait viewport on this desktop GPU is **not a physical phone benchmark**. Phone thermals, low-end GPUs, Safari and extended sessions remain to be tested.

The production route remains approximately **258 kB / 361 kB First Load JS**, versus 254 kB / 356 kB at the merged Retail baseline. No new runtime dependencies or heavyweight assets were introduced.

## Verification

- Production build: Next.js 15.5.23, Node 24; compilation, TypeScript and static generation pass.
- Six `node:test` regressions run against the actual Zustand store: per-place configurations, dependent solar removal, replay without duplicate choices, empty modal state, authorization reset and full reset.
- Browser interactions exercised Home access/guest/EV, Residence protection/reservation/guest/EV, Retail arrivals/guidance/reservation/EV, solar toggles, accumulated needs, replay, pause/resume and scene-only view.
- Desktop and portrait screenshots were visually reviewed during testing. The new framing leaves the focal action outside the decision panel.
- Reduced-motion checks confirmed a final open Home garage, parked/authorized Residence car with lowered blocker, and an aligned Retail guidance car. Diagnostics confirm demand rendering.
- The WebGL fallback was exercised from place choice through setup review and the project-brief form at 320×568. It creates no canvas and has no horizontal overflow; fallback text no longer overlaps the chooser.
- Modal Escape returned focus to Review setup. Project details survived back-to-setup navigation. Clipboard contents matched the brief.
- Final interaction checks confirmed Replay → immediate Pause stays frozen; solar/guest changes resume rendering. Opening the brief at 320×568 starts at the top with Back and Close visible.
- A test brief was actually downloaded to the local Downloads folder and its contents verified (Home needs, solar, test project location and parking scale). No email was sent.
- No application console errors were observed in the exercised normal scenes.
- Existing CI screenshot URLs remain supported. The workflow adds store tests and reduced-motion/fallback captures. CI screenshot failures currently remain warnings in the inherited workflow; a green build alone must not be treated as proof that every screenshot exists.

## Reproduce

```sh
npm run build
npm start
node --test tests/experience-store.test.cjs
```

Open `http://localhost:3000/?perf=1`, choose a place and need, and allow the camera/quality to settle. Observe the actual selected renderer and repeat in the user's regular browser.

For deterministic QA, set `NEXT_PUBLIC_VISUAL_QA=1` before building. Existing `qaChooser`, `qaEnvironment`, `qaProblem`, `qaGuest` and `qaSolar` parameters remain supported. Add `qaReducedMotion=1` for the static physical outcomes or `qaNoWebGL=1` for the consultation fallback.

## Remaining launch work

1. Physical-phone, regular-browser and sustained thermal/performance checks; use these to decide whether further asset work fits the budget.
2. Choose the real MacroPark contact/CRM destination and implement confirmed delivery, consent/privacy details and any necessary backend.
3. Production hosting/domain, final copy and secondary SEO/accessibility content.
4. Consider a system/digital-twin reveal and selective premium assets only after performance sign-off. The procedural scenes and existing product stories remain intact.
