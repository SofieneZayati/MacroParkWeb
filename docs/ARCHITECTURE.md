# MacroPark Web architecture

MacroPark is one client journey with a separate rendering system. Visitors choose a place, preview a solution, explicitly add it to their plan, then review or export a project brief. A failed GPU context must leave those decisions usable.

## Responsibility map

| Boundary | Files | Responsibility |
| --- | --- | --- |
| Journey coordinator | `components/experience/MacroParkExperience.tsx` | Composes the interface and dynamically loads the scene. Owns temporary display controls, readiness and fallback presentation. |
| Client interface | `components/experience/ui/` | Header, opening, place chooser, solution workbench, scene controls, icons and short presentation labels. `Experience.module.css` scopes their layout and visual states. |
| Opening lifecycle | `components/experience/hooks/useExperienceLifecycle.ts` | Initializes QA navigation once, exposes diagnostics mode and reduced-motion preference, and starts opening timers after the scene is ready. |
| Domain | `lib/experienceDomain.ts`, `lib/experienceContent.ts`, `lib/experienceConfiguration.ts` | Shared identifiers, available solutions and copy, plus configuration validation and normalization. No React or Zustand dependency. |
| Journey state | `components/experience/useExperienceStore.ts` | Current preview, included solutions, separate in-memory plans for each place, modal state, replay revisions and story authorization. |
| Rendering boundary | `components/experience/scene/ExperienceScene.tsx` | WebGL capability and failure handling, Canvas creation, adaptive graphics, page visibility, modal pause and scene composition. |
| Render scheduling | `components/experience/SceneRuntime.tsx` | Frame-loop suspension, demand rendering for reduced motion, camera framing around the panel, first-frame readiness and optional local diagnostics. |
| Physical demonstrations | `WorldScene.tsx`, `SolutionEffects.tsx`, `ScenePolish.tsx`, and the `*Sequence.tsx` files | Environment selection, geometry, vehicles, access, reservations, guidance, charging and solar stories. |
| Shared camera motion | `components/experience/storyCamera.ts`, `useStoryCamera.ts` | Camera damping, reduced-motion snapping and settled-state detection shared by Residence and Retail stories. |
| Review and handoff | `ConfigurationSummary.tsx`, `ConsultationHandoff.tsx`, their CSS modules, and `lib/projectBrief.ts` | Accessible native dialog, editable plan, project details, and one consistent text brief for preview, copy, download and an optional email draft. |

## Decisions and state

The workbench keeps all needs for the chosen place visible while one solution is previewed. `previewProblem` runs its demonstration without adding it. `addProblem` includes it without restarting the scene. Replay advances `demoRevision` so sequence components reset their local animation state deliberately.

Domain configuration rules are shared by the store and exported brief. They remove duplicates and solutions that do not belong to the selected place, and allow solar only when charging is included. Do not repeat those rules in interface components or export handlers.

The store retains separate configurations while switching places during the current visit. Project details remain in memory as well. There is no durable browser storage or backend submission in this architecture. The optional configured contact address opens an email draft; the interface must not claim that a message was sent.

Use selectors when reading the store so an unrelated animation or control update does not rerender the entire interface. Keep display-only state, such as whether controls are hidden, near the component that owns it.

## Rendering and animation

`ExperienceScene` receives `paused`, `sceneOnly`, `quality`, readiness/failure callbacks, and optional diagnostics presentation through its props. It reads the current place and summary state to coordinate rendering. The root and form components do not create WebGL contexts or manage frame scheduling.

`SceneRuntime` suspends rendering behind a modal, in a hidden document, or when the visitor pauses animation. Reduced motion uses demand rendering and static story outcomes. Preserve scene time when changing frame-loop mode; otherwise paused scenes can jump forward on resume.

The base camera in `WorldScene` yields to the active story camera. Each story calls its shared camera controller inside its existing frame callback after updating story progress. The controller does not add another frame subscription. Keep camera targets and timing with their physical story, and keep reusable interpolation and settled-state behavior in `storyCamera.ts`.

Prefer procedural geometry and emissive indicators. Completed vehicles and settled hardware should stop recomputing motion. Dispose generated geometry when its owner unmounts. Check the full scene before adding dynamic lights, shadows or new per-frame allocations.

## Styles and accessibility

Experience, summary and handoff styles are scoped CSS modules. Global CSS should contain shared document defaults and utilities rather than competing versions of the same panel layout.

The workbench uses keyboard-operable tabs; the plan uses a native modal dialog. Preserve focus when adding or removing a solution, changing places, and dismissing the dialog. Keep preview and inclusion as separate actions. A WebGL fallback must still offer place selection, solution selection and the brief.

## Development and verification

Use Node 24 and run these commands from the repository root:

```sh
npm install --no-audit --no-fund
npm run dev
```

Before review:

```sh
npm test
npm run typecheck
npm run build
npm start
```

`npm test` discovers every `tests/*.test.cjs` file using Node's built-in runner. Tests load the actual TypeScript modules through `tests/helpers/load-typescript.cjs`; they cover configuration invariants, preview/add/replay behavior, brief generation and camera settling. No additional test framework is required.

Production build validation is separate from browser verification. Check desktop and narrow layouts, keyboard navigation, add/remove/review, cross-place restoration, guest expiry, charging with solar, replay, pause/resume and the exported brief.

### Reproducible browser states

QA query parameters are enabled only when `NEXT_PUBLIC_VISUAL_QA=1` was set before building. On PowerShell:

```powershell
$env:NEXT_PUBLIC_VISUAL_QA = '1'
npm run build
npm start
```

| Query | State |
| --- | --- |
| `?qaChooser=1` | Place chooser without waiting for the opening. |
| `?qaEnvironment=home&qaProblem=automatic-access&qaPreview=1` | Preview with nothing added to the plan. |
| `?qaEnvironment=residence&qaProblem=guest-access&qaGuest=expired` | Included guest access with an expired visit. |
| `?qaEnvironment=retail&qaProblem=ev-charging&qaSolar=1` | Included charging and solar. |
| `?qaEnvironment=retail&qaProblem=parking-guidance&qaPreview=1&qaReducedMotion=1` | Static guidance preview for reduced-motion layout checks. |
| `?qaNoWebGL=1` | Usable consultation without a 3D canvas. |

Omitting `qaPreview=1` includes the requested solution, preserving existing screenshot states. Append `perf=1` to inspect local frame samples, draw calls, triangles, lights, DPR and renderer; this diagnostics option does not upload data.

### CI and its limits

The pull-request workflow builds with QA routes enabled, runs the entire test suite, then captures existing scene states plus 390-pixel and 320-pixel workbench previews. Captures use headless Chromium with SwiftShader. A failed or timed-out browser process, or a missing/empty screenshot, fails the capture step after the remaining cases are attempted. Available images are uploaded even when a capture fails.

These images are review artifacts, not automated visual assertions. A nonempty screenshot does not prove that the page is correct, unclipped, accessible or interactive. SwiftShader also does not represent a physical phone GPU or sustained device performance. Review the artifacts and run physical-device checks before treating those concerns as verified.

## Changing the experience

For a new solution, first add its domain identifier and environment content, then implement its physical story and workbench presentation. Keep configuration rules in the domain layer, and add meaningful store or brief tests for new invariants. Extend QA captures for important new states, including reduced motion where the story changes.

For layout changes, edit the relevant CSS module and verify 320-pixel, 390-pixel and desktop layouts. For camera changes, modify the story's targets and validate both narrow and wide framing; change the shared controller only when interpolation behavior itself must change. For handoff changes, keep `buildProjectBrief` as the single source of exported text and test the changed output contract.
