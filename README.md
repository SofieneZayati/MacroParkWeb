# MacroPark Web

MacroPark Web is the client-facing interactive experience for MacroPark.

This project is **not** a technical dashboard and **not** a conventional feature-list landing page. The website should behave like an intelligent 3D sales experience: visitors identify their environment and parking problems, then watch MacroPark visually build and demonstrate the right solution around them.

## Core idea

> **Show the solution instead of explaining the technology.**

Every important capability must have a visible physical consequence:

- Automatic access -> the gate opens when the right vehicle arrives.
- Reserved parking -> a space becomes protected and ready for the expected vehicle.
- Private-space protection -> a parking lock rises or lowers.
- Visitor access -> a temporary guest vehicle is accepted only during its allowed window.
- Occupancy -> free spaces become visible and the driver is guided to one.
- EV charging -> the selected parking area gains chargers and charging feedback.
- Solar -> a solar canopy appears and powers the parking/charging experience.
- Security -> an unknown vehicle is denied without forcing the visitor to understand the underlying technology.

## Experience direction

The site should feel like a blend of:

- premium automotive configurator
- modern architectural visualization
- interactive product storytelling
- intelligent guided consultation

The visitor should mostly interact with **places, vehicles, gates, spaces, lights, cameras, chargers, and simple questions**, not technical diagrams.

## Primary journey

1. Enter a cinematic 3D parking world.
2. Choose a place: a private home, apartment building, or shop/mall.
3. Use the workbench to explore the needs for that place. Previewing leaves the plan unchanged.
4. Watch the environment react, then explicitly choose **Add to your plan**.
5. Switch between needs or choose **Review your plan** / **Your plan** to review the included solutions.
6. Create a project brief to keep or share.

Each place retains its own plan during the visit. Solar is an optional addition to charging and does not increase the solution count.

## Project source of truth

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — product, experience, design and implementation roadmap.
- [`docs/PROGRESS.md`](docs/PROGRESS.md) — current phase, completed work, decisions and next actions.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — interface, domain, state, rendering, camera and brief boundaries, with maintenance and QA instructions.
- [`docs/PERFORMANCE_PASS_2.md`](docs/PERFORMANCE_PASS_2.md) — performance findings, reproducible checks and device-test limitations.

These files should be updated as the project evolves so the plan and progress remain in GitHub rather than only in chat history.

## Run and verify

```sh
npm test
npm run typecheck
npm run build
npm start
```

Use Node 24. Run `npm run dev` for development, or open `http://localhost:3000` after starting the production build. Replay, pause and full-scene controls sit beside the preview. Open **View settings** and choose **Lighter graphics** if animation feels slow.

Append `?perf=1` for local FPS, frame-time, draw-call and renderer diagnostics. Nothing is uploaded.

Set `NEXT_PUBLIC_VISUAL_QA=1` **before building** to enable the existing deterministic `qaEnvironment`, `qaProblem`, `qaGuest`, `qaSolar` and `qaChooser` URLs, plus `qaReducedMotion=1` and `qaNoWebGL=1`. Add `qaPreview=1` to an environment/problem URL to preview the solution without adding it; omitting it preserves the existing selected-state captures.

Without a contact email configured, clients can preview, copy and download their project brief. `NEXT_PUBLIC_MACROPARK_CONTACT_EMAIL` enables a prepared email for the visitor to review and send; there is no CRM submission backend yet.

## Refactor checkpoint — 2026-09-08

The client interface now uses one workbench for choosing and previewing needs. Rendering, opening lifecycle, domain/configuration rules, shared camera motion and brief generation have separate owners. No heavy assets or runtime dependencies were added.

All 21 tests pass. Development-browser checks covered every Home, Residence and Retail tab, explicit add/remove, separate place plans, solar counts, keyboard tab navigation and modal focus. Brief draft/copy behavior and the contents of an actual downloaded brief were verified. Screenshots at 390×844, 320×568 and 844×390 showed no page overflow; reduced motion and the WebGL fallback remained usable.

The production build passes and reports 115 kB First Load JS (previously 361 kB); the 3D renderer now loads separately, so this is an initial-bundle reduction, not a total-download comparison. Representative production samples reached 144 FPS with p95 frame intervals of 7–7.2 ms on the local RTX 3060. Physical-phone benchmarking and the updated GitHub CI workflow have not yet been run; see [`docs/PROGRESS.md`](docs/PROGRESS.md) for the current verification record.
