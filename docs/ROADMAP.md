# MacroPark Web — Product & Experience Roadmap

## 1. Product goal

Build a premium 3D interactive website that guides potential clients toward the MacroPark solution that fits their real parking situation.

The site is a **guided visual consultant**, not a technical product manual.

A visitor should be able to understand the value of MacroPark without knowing terms such as ANPR/LPR, IoT, access-control architecture, occupancy telemetry, APIs, or edge processing.

The experience should answer four client questions naturally:

1. **Is this made for a place like mine?**
2. **Can it solve the problem I actually have?**
3. **What would it look and feel like in practice?**
4. **How do I ask MacroPark to build this for me?**

---

## 2. Experience principles

### 2.1 Show, do not explain

Whenever possible, demonstrate a feature with an event in the 3D world.

Examples:

- Do not lead with “license plate recognition.” Show a car arrive and the gate open automatically.
- Do not lead with “visitor management.” Show a guest arriving during an allowed time window and being admitted.
- Do not lead with “parking occupancy.” Show a full floor, free spaces, and guidance to an available spot.
- Do not lead with “space protection.” Show an unauthorized vehicle unable to take a protected space.
- Do not lead with “smart charging.” Show chargers appearing where the client needs them and vehicles charging.

### 2.2 Problems before products

Ask visitors what they want to fix before showing the solution.

Useful prompts:

- “What should be easier here?”
- “What keeps going wrong?”
- “Who needs access?”
- “What do you want to automate?”
- “What should this parking do for you?”

### 2.3 The environment is the navigation

Primary navigation should come from interacting with the 3D world rather than choosing ordinary feature cards.

Potential environments:

- Private home / villa
- Residence / apartment building
- Office / company
- Retail / mall
- Hotel / hospitality
- Public / municipal parking
- Fleet / enterprise site

The first production experience should prioritize **Home, Residence, and Retail/Mall**. Other environments can be added after the interaction model is proven.

### 2.4 Progressive disclosure

Do not show every feature at once.

The visitor sees only what matters to their current choice, with optional deeper details later.

### 2.5 One coherent world

Prefer a single reusable 3D world and modular environments over unrelated scenes. Camera movement, lighting and spatial transitions should make the site feel continuous.

### 2.6 Premium but approachable

The site should feel advanced without looking like a developer dashboard or cyberpunk control room.

Target feeling:

- architectural
- automotive
- clean
- intelligent
- calm
- premium
- tactile
- trustworthy

---

## 3. High-level visitor journey

### Stage A — Arrival

A short cinematic interaction immediately demonstrates the premise.

Example:

1. A vehicle approaches a controlled entrance.
2. The entrance recognizes that this vehicle belongs there.
3. The barrier opens naturally.
4. The scene expands into the MacroPark world.

Minimal copy. The product should be understood before it is explained.

### Stage B — Identify the place

Prompt:

> **Where should parking feel smarter?**

The visitor explores a small 3D district containing several building types.

Hover/focus should make each place subtly come alive. Selecting a building transitions the camera physically into that environment.

### Stage C — Identify the need

Inside the selected environment, present a small number of human problems or outcomes.

The choices should be written in client language, for example:

- “Open automatically when I arrive.”
- “Stop other people taking my space.”
- “Make guest access easier.”
- “Help customers find parking.”
- “Reduce queues at the entrance.”
- “Add EV charging.”
- “Know which spaces are available.”

### Stage D — Demonstrate the solution

The world changes in response.

A gate opens, a parking lock moves, a route illuminates, a guest arrives, a charger activates, etc.

### Stage E — Build the solution

Allow the client to combine needs.

The environment becomes their personalized MacroPark configuration.

### Stage F — Conversion

End with a simple visual summary:

> **Your MacroPark**

Example:

- Automatic entrance
- Protected resident spaces
- Visitor access
- EV charging

CTA:

> **Let’s build this for your property**

The contact request should preserve the visitor’s selected environment and needs so MacroPark receives a qualified lead instead of a generic contact form submission.

---

## 4. Initial environment concepts

## 4.1 Private Home

### Client problems

- Garage/gate should open automatically.
- Multiple family members need access.
- Guests need temporary access.
- Service/delivery access needs to be controlled.
- Homeowner wants EV charging.
- Homeowner wants to know when selected vehicles arrive or leave.

### Visual demonstrations

- Resident vehicle approaches -> entrance opens.
- Unknown vehicle approaches -> remains closed.
- Guest is granted a time window -> entrance works during that window only.
- EV option selected -> charger appears beside the parking area.
- Solar option selected -> canopy/solar solution is added visually.

### Client-facing language

Prefer:

- “Your home recognizes your car.”
- “Give access without giving away a remote.”
- “Guests get access only when you want them to.”

Avoid leading with implementation terminology.

---

## 4.2 Residence

### Client problems

- Unauthorized cars take private spaces.
- Residents share/remain dependent on remotes or badges.
- Guest access creates calls and inconvenience.
- Airbnb/short-term visitors need temporary parking.
- Residents change vehicles.
- Building management does not know real occupancy.
- Residents need EV charging.

### Visual demonstrations

- Resident enters automatically.
- Private-space blocker lowers for the assigned vehicle.
- Unauthorized vehicle cannot occupy the protected space.
- Visitor receives temporary parking permission.
- A guest space becomes reserved before arrival.
- Occupied/free spaces become visually clear.
- Shared charging zone is added to the garage.

### Strong interactive moment

Show the same residence **before and after MacroPark** rather than relying on copy.

---

## 4.3 Retail / Mall

### Client problems

- Long entrance queues.
- Customers struggle to find spaces.
- Management does not know true occupancy.
- Premium/VIP spaces need control.
- EV charging is needed.
- Customers need easier exit/payment experiences.
- Security needs better visibility.

### Visual demonstrations

- Congested entrance transforms into smooth automated flow.
- Free spaces are highlighted and a route is drawn to one.
- Reserved/VIP space becomes protected.
- EV spaces become visible and bookable.
- “Find my car” can visually trace the path back to a parked vehicle.

---

## 5. Additional solution ideas to explore later

These are product/experience possibilities, not mandatory launch scope.

### Access & permissions

- Household/family access
- Resident access
- Employee access
- VIP access
- Guest access
- Temporary service-provider access
- Contractor access
- Delivery windows
- Event access
- Hotel-stay-linked access

### Parking control

- Space reservations
- Individual parking locks
- Visitor spots
- Premium spaces
- Accessible spaces
- Valet zones
- Loading zones
- Time-limited parking
- Overstay alerts

### Guidance

- Available-space guidance
- Floor availability
- Indoor route guidance
- Find-my-car experience
- Entrance selection based on destination or availability

### EV & energy

- EV charger placement
- Charger reservation
- Resident/customer charging rules
- Shared charger allocation
- Solar parking canopies
- Battery storage
- Smart load distribution
- Priority charging

### Commercial / operational

- Contactless payment
- Subscription parking
- Staff/customer differentiation
- Multi-property management
- Usage analytics
- Peak-time insight
- Optional security/event alerts

Again: these should be translated into **client outcomes** in the public website.

---

## 6. 3D world concept

### World structure

Create a stylized premium architectural district that can contain or transition between:

- villa
- residence
- mall/retail complex
- office
- hotel
- public parking structure

The visitor should feel that MacroPark can operate across an entire built environment.

### Interaction language

Use:

- camera travel
- doors/gates moving
- cars moving
- parking locks moving
- lighting
- road/floor guidance
- environmental transformation
- subtle labels
- spatial UI
- object focus
- day/night transitions where meaningful

Avoid relying on large grids of conventional cards.

### Camera rules

Camera motion should feel deliberate and cinematic, not like free-roam game controls.

Use guided camera states with limited user control where it adds delight.

### Scene continuity

Transitions should normally feel physical:

- rise above a building
- move through an entrance
- descend into a garage
- orbit around a selected object
- pull out to reveal the whole site

Avoid hard cuts unless they improve performance or storytelling.

---

## 7. Visual identity direction

### Overall style

- Premium modern architecture
- High-quality but optimized materials
- Clean roads/parking geometry
- Soft realistic lighting
- Restrained reflections
- Strong typography
- Minimal interface chrome

### Palette direction

Primary environment should stay neutral:

- charcoal
- graphite
- concrete
- warm architectural whites
- glass
- natural greenery

Use functional accents sparingly:

- green = accepted / ready / available
- amber = reserved / temporary / attention
- red = denied / unavailable
- cool electric accent = EV / energy / guidance

Do not make the experience look like RGB gaming software.

### Typography

Large, direct client language.

Examples:

- “Your space stays yours.”
- “Arrive. The gate already knows.”
- “Visitors get in without calling you.”
- “Turn empty parking into available parking.”
- “Add charging where people already stop.”

---

## 8. Technical direction

The implementation should support a high-end WebGL experience while maintaining a usable fallback.

Proposed foundation:

- Next.js
- TypeScript
- React Three Fiber / Three.js
- Drei
- GSAP for orchestrated transitions
- GSAP ScrollTrigger only where scroll-driven storytelling is appropriate
- Zustand or equivalent lightweight state machine/store
- Tailwind or a small structured design-token layer for interface styling
- GLTF/GLB for optimized models
- compressed textures/models where appropriate

This is an implementation choice, not part of the client-facing messaging.

### State-driven experience

Keep experience state explicit. Example conceptual states:

- `intro`
- `world-selection`
- `home`
- `residence`
- `retail`
- `problem-selection`
- `solution-demo`
- `configuration`
- `summary`
- `contact`

A state-driven structure will be more reliable than attaching the entire experience directly to scroll position.

---

## 9. Performance requirements

Performance is part of the design.

Requirements:

- Optimize geometry and textures from the beginning.
- Reuse modular assets.
- Use instancing for repeated parking elements, lights, markings, etc.
- Limit real-time shadows and expensive post-processing.
- Use baked lighting/material tricks when quality is equivalent.
- Load optional environments/assets only when needed.
- Adapt render quality/device pixel ratio to the device.
- Provide a strong mobile experience rather than shrinking the desktop scene blindly.
- Respect `prefers-reduced-motion`.
- Provide a non-WebGL fallback that still communicates the product and converts visitors.

Do not wait until the final phase to address performance.

---

## 10. Asset strategy

Prefer a coherent custom visual system over many unrelated stock/marketplace assets.

Reusable asset families:

- hero vehicle(s)
- architecture modules
- parking structure modules
- gates/barriers
- parking locks
- cameras
- EV chargers
- solar canopies
- road markings/signage
- parking signage
- vegetation
- lights

Assets may be modeled, procedurally created, generated, or sourced when licensing and visual consistency make sense.

Any generated imagery should support the 3D experience rather than replace it with static hero art.

---

## 11. Information architecture

The interactive experience is primary, but conventional navigation still needs to exist for usability and SEO.

Potential secondary routes:

- `/` — interactive experience
- `/solutions/home`
- `/solutions/residential`
- `/solutions/retail`
- `/solutions/business`
- `/solutions/hospitality`
- `/solutions/public`
- `/ev-charging`
- `/about`
- `/contact`

These pages can reuse scenes/assets but should be more direct and accessible for people arriving from search or links.

Do not build all secondary routes before the core experience is validated.

---

## 12. Implementation phases

## Phase 0 — Project foundation

Goal: create a maintainable base before production scene work.

- [ ] Initialize Next.js + TypeScript project.
- [ ] Establish linting/formatting.
- [ ] Establish base folder architecture.
- [ ] Add 3D dependencies.
- [ ] Add global design tokens and typography.
- [ ] Add experience-state architecture.
- [ ] Establish responsive canvas shell.
- [ ] Add WebGL/reduced-motion fallback strategy.
- [ ] Add lightweight performance instrumentation.

**Exit condition:** clean app shell runs locally and is ready to host interactive scenes.

---

## Phase 1 — Interaction prototype

Goal: prove that the central idea feels premium before creating lots of content.

Build one polished vertical slice:

- [ ] Cinematic entrance.
- [ ] Vehicle approaches controlled entrance.
- [ ] Automatic gate interaction.
- [ ] Reveal a small architectural MacroPark world.
- [ ] Present Home / Residence / Retail as spatial choices.
- [ ] Camera transition into at least one environment.
- [ ] Present one client problem inside that environment.
- [ ] Demonstrate one solution physically.
- [ ] Return/continue interaction cleanly.
- [ ] Validate desktop performance and basic mobile behavior.

**Exit condition:** the prototype alone makes the product understandable and feels worth continuing.

Do not expand scope until this is good.

---

## Phase 2 — Core guided experiences

Goal: complete the three highest-value environments.

### Home

- [ ] automatic entrance
- [ ] family access
- [ ] temporary guest access
- [ ] EV charging

### Residence

- [ ] automatic resident entrance
- [ ] protected private space
- [ ] temporary/reserved guest parking
- [ ] occupancy awareness
- [ ] shared EV charging

### Retail / Mall

- [ ] queue reduction
- [ ] available-space guidance
- [ ] premium/reserved spaces
- [ ] EV charging
- [ ] find-my-car concept

### Shared experience

- [ ] client selections persist while navigating
- [ ] “Your MacroPark” configuration updates visually
- [ ] scenes support entering/exiting without awkward resets

**Exit condition:** a client in any of the three core segments can reach a personalized solution.

---

## Phase 3 — Intelligent configurator & conversion

Goal: turn the interactive experience into a sales tool.

- [ ] Build selection model for environment/problems/options.
- [ ] Create recommendations based on choices.
- [ ] Generate client-facing summary.
- [ ] Preserve selected solution in contact flow.
- [ ] Contact form with qualified lead context.
- [ ] Add optional project/property details.
- [ ] Create shareable/revisitable configuration if useful.
- [ ] Instrument meaningful analytics events without harming performance/privacy.

**Exit condition:** MacroPark receives actionable lead context from the experience.

---

## Phase 4 — Additional verticals

Only after the first three are strong:

- [ ] Office / enterprise
- [ ] Hospitality / hotel
- [ ] Public parking
- [ ] Fleet/logistics if commercially relevant

Each new vertical must reuse the interaction language rather than becoming a separate mini-site.

---

## Phase 5 — Energy experience

- [ ] EV charger options by environment.
- [ ] Shared/premium charger behavior.
- [ ] Charger reservation concept where relevant.
- [ ] Solar canopy transformation.
- [ ] Energy flow visualization simplified for clients.
- [ ] Optional battery/storage concept if commercially useful.

**Rule:** communicate comfort, savings, convenience and future-readiness before technical energy data.

---

## Phase 6 — Content, SEO & accessibility

- [ ] Secondary solution pages.
- [ ] Metadata/OpenGraph.
- [ ] Structured content for search.
- [ ] Accessible keyboard navigation.
- [ ] Reduced-motion mode.
- [ ] Non-WebGL fallback.
- [ ] Screen-reader-friendly forms and content.
- [ ] Clear legal/privacy/contact information.

---

## Phase 7 — Production polish

- [ ] Performance budget pass.
- [ ] Mobile-specific scene tuning.
- [ ] Cross-browser testing.
- [ ] Loading transitions.
- [ ] Error/fallback states.
- [ ] Final motion polish.
- [ ] Final copy polish.
- [ ] Optional subtle sound design with user control.
- [ ] Image/model compression audit.
- [ ] Lighthouse/performance/accessibility pass.
- [ ] Production deployment setup.

---

## 13. Development workflow

### Branching

Use small, named branches for significant work rather than treating `main` as a scratchpad.

Suggested pattern:

- `foundation/...`
- `experience/...`
- `scene/...`
- `feature/...`
- `fix/...`

### Documentation discipline

After meaningful work:

1. Update [`PROGRESS.md`](PROGRESS.md).
2. Record important design/architecture decisions.
3. Record what is next.
4. Keep unfinished ideas in the roadmap rather than relying on chat memory.

### Scope discipline

Do not build all environments simultaneously.

The core interaction must be convincing first.

---

## 14. Current priority

Phases 1–4 are merged. The current development checkpoint is the **full client journey and architecture refactor, 2026-09-08**, on `performance-pass-2`. The historical phase checklists above describe the original roadmap; use [`PROGRESS.md`](PROGRESS.md) for implementation status and [`ARCHITECTURE.md`](ARCHITECTURE.md) for current code boundaries.

The core experience is now implemented:

> **Arrival -> choose your place -> explore needs in one workbench -> see the solution -> explicitly add it to your plan -> review and create a project brief.**

Previewing and adding are separate decisions. Each place retains its own in-memory plan. Optional solar belongs to charging and does not increase the solution count. Replay, pause and full-scene controls support the demonstration; **View settings** offers **Lighter graphics**.

The refactor separates interface composition, domain/configuration rules, rendering lifecycle, shared camera motion and brief generation without adding heavy assets or runtime dependencies. All 21 tests pass. Development-browser checks covered all place/solution tabs, add/remove and plan restoration, solar counts, keyboard navigation, modal focus and brief draft/copy/download. The 390×844, 320×568 and 844×390 layouts showed no page overflow, and reduced motion/WebGL fallback stayed usable.

The exact visual design can evolve during implementation, but the guiding principle should remain stable:

> **The visitor should feel the benefit before they have to understand the technology.**

The production build passes, with 115 kB First Load JS and a separately loaded 3D renderer. Fresh RTX 3060 spot samples reached 144 FPS; physical-device limits remain unverified. Next: run the updated GitHub CI workflow and validate physical phones, then finish the real consultation destination, production deployment/domain, accessible/SEO content and any justified selective visual asset upgrades. A system/digital-twin reveal remains a later step after performance sign-off.
