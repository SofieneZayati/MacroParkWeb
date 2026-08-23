# MacroPark Web — 3D Art Direction

This document defines how the prototype should evolve from procedural geometry into a premium client-facing visual experience without sacrificing load time or clarity.

## Target feeling

MacroPark should feel like a modern automotive configurator crossed with architectural visualization: calm, intelligent, premium and physically believable.

Avoid cyberpunk dashboards, excessive neon, sci-fi hologram clutter, game-like HUDs and overly technical labels. Technology should be visible mainly through what the environment does.

## Visual language

- Clean contemporary architecture.
- Warm neutral concrete, graphite asphalt, brushed metal and soft glass.
- Restrained green accent for successful/available/active states.
- Warm amber only for energy/solar moments.
- Red only for denial/error states when needed.
- Large areas of visual calm so motion and interaction remain legible.
- Cars should feel premium but brand-neutral.
- Parking equipment should look installable in the real world, not futuristic for its own sake.

## Asset replacement priority

Do not replace every procedural mesh at once. Replace the objects the visitor notices most.

### Priority 1 — Hero vehicle

Replace the procedural arrival car first.

Requirements:
- Generic premium EV/sedan silhouette.
- No recognizable manufacturer branding.
- Optimized GLB.
- Separate wheel meshes if wheel rotation is later needed.
- Clean body material, glass, headlights and rear lights.
- Target compressed payload: roughly 0.5–1.5 MB depending on visual gain.

### Priority 2 — MacroPark entrance kit

Create one consistent entrance kit:
- barrier housing and arm;
- ANPR/LPN camera;
- mounting post;
- compact status light;
- optional intercom / QR fallback surface.

This becomes reusable across residence, retail and later office/hotel/public scenes.

### Priority 3 — Parking protection hardware

Create a believable motorized parking-space blocker for the Residence experience.

It should have a simple animation state:
- protected / raised;
- authorized vehicle approaching;
- lowering;
- parked / clear.

### Priority 4 — EV + solar kit

Create one modular family:
- wall charger for Home;
- pedestal charger for Residence/Retail;
- solar canopy support structure;
- modular photovoltaic panel;
- optional battery cabinet for later storytelling.

### Priority 5 — Architecture modules

Only after the interaction is proven should the buildings be upgraded.

Build modular pieces rather than giant unique scenes:
- villa shell;
- apartment/residence facade;
- parking deck;
- retail facade;
- columns, curbs, planters, trees and lights.

## Environment direction

### Home

Contemporary villa, clean driveway, planted edges, warm interior light. The garage should be visually obvious without making the home look like a showroom.

### Residence

Premium but realistic apartment complex / private residence parking. Assigned bays and parking protection should be readable immediately.

### Retail / Mall

Larger scale, brighter signage and more moving vehicles, but still visually controlled. Parking guidance should be readable from the camera position without relying on text-heavy UI.

## Motion rules

- Camera movement should feel weighted and cinematic, never twitchy.
- Interactive hover response should be subtle.
- Physical objects should animate before explanatory text whenever possible.
- Avoid simultaneous motion in too many parts of the scene.
- A client should understand what changed even with audio muted.
- Reduced-motion mode must remain fully usable and understandable.

## Performance rules

- Prefer GLB + Meshopt/Draco where appropriate.
- Reuse materials and geometry aggressively.
- Instance repeated parking equipment, lights and vegetation.
- Bake detail into textures instead of adding unnecessary geometry.
- Use 1K textures by default; justify 2K assets individually.
- Avoid 4K textures in the initial experience.
- Use baked lighting where it improves consistency and reduces real-time shadow cost.
- Keep only the most important moving objects casting dynamic shadows.
- Lazy-load environment-specific production assets after the opening experience.

## Generated imagery

Generated imagery may be useful for:
- early architectural mood exploration;
- environment moodboards;
- subtle distant city/background plates;
- material/style references.

Do not use generated still images as a substitute for objects the client is expected to interact with. Important interactive objects should remain true 3D assets.

## Next visual milestone

After browser/device review of the procedural prototype, replace only:

1. hero vehicle;
2. entrance/camera/barrier kit;
3. parking blocker;
4. EV charger + solar canopy.

Then compare perceived quality, load time and frame rate before upgrading architecture.
