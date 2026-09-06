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
3. Preview a solution for a need. Previewing does not add anything to the saved setup.
4. Watch the environment react, then explicitly choose **Add to my setup**.
5. Explore other needs or review the selected solutions in **My setup**.
6. Create a project brief to keep or share.

## Project source of truth

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — product, experience, design and implementation roadmap.
- [`docs/PROGRESS.md`](docs/PROGRESS.md) — current phase, completed work, decisions and next actions.
- [`docs/PERFORMANCE_PASS_2.md`](docs/PERFORMANCE_PASS_2.md) — performance findings, reproducible checks and device-test limitations.

These files should be updated as the project evolves so the plan and progress remain in GitHub rather than only in chat history.

## Run and verify

```sh
npm run build
npm start
node --test tests/experience-store.test.cjs
```

Open `http://localhost:3000`. Append `?perf=1` for local FPS, frame-time, draw-call and renderer diagnostics. Nothing is uploaded. Quality and animation controls are grouped under **View options**.

Set `NEXT_PUBLIC_VISUAL_QA=1` **before building** to enable the existing deterministic `qaEnvironment`, `qaProblem`, `qaGuest`, `qaSolar` and `qaChooser` URLs, plus `qaReducedMotion=1` and `qaNoWebGL=1`. Add `qaPreview=1` to an environment/problem URL to preview the solution without adding it; omitting it preserves the existing selected-state captures.

Without a contact email configured, clients can preview, copy and download their project brief. `NEXT_PUBLIC_MACROPARK_CONTACT_EMAIL` enables a prepared email for the visitor to review and send; there is no CRM submission backend yet.
