## Context

The tower currently renders as a static snapshot. People are drawn at fixed positions determined by a seed value. The elevator shaft draws the same doors and indicator every frame. There is no game loop — rendering happens only on initial load and after placement clicks. There are no sound effects at all.

SimTower/Kairosoft games feel alive through small continuous animations and subtle audio. People walk back and forth, pause, and use stairs/elevators. The elevator shuttles between floors with a distinct ding at each stop. Ambient details like drifting clouds and a low building hum add presence.

This design supersedes `tower-animations` by combining all its animation work with a new sound layer.

## Goals / Non-Goals

**Goals:**
- Introduce a `requestAnimationFrame` game loop at ~30fps
- People walk along floors, change direction, and use staircases
- Elevator car moves between floors with door animations
- Ambient effects: drifting clouds, flickering window lights
- Synthesized sound effects: elevator ding, door whoosh, placement pop, ambient hum, footsteps
- All audio via Web Audio API — no external files
- Audio starts on first user gesture (autoplay policy)

**Non-Goals:**
- No pathfinding AI or complex behavior trees
- No external audio files (`.wav`, `.mp3`, `.ogg`)
- No new floor types or game mechanics
- No save/load of animation or audio state
- No collision detection between people
- No music or background track
- No sound volume/mixing UI

## Decisions

### Game loop via `requestAnimationFrame` at ~30fps
- Target 30fps (33ms per frame) rather than 60fps — pixel art doesn't need smooth interpolation and this saves battery on mobile
- Each frame: update animation state → call `renderAll()`
- Loop only starts when `towerGrid` has at least one cell (no point animating an empty lot)

### Person entities as objects
- Each person is an object: `{ x, floorIdx, direction, speed, state, timer }`
- States: `WALKING`, `PAUSED`, `USING_STAIRS`
- People are spawned when their floor type is placed (1 person per cell, max 30 total)
- People walk left/right within their floor's interior zone, bounce off walls, occasionally pause

### Elevator state machine
- Elevator has: `currentFloor` (float for smooth movement), `targetFloor` (int), `doorState` (`CLOSED`, `OPENING`, `OPEN`, `CLOSING`)
- Elevator picks a random occupied floor as target, moves there, opens doors briefly, repeats
- Movement speed: 1 pixel per frame
- Door animation: 4 frames open + 8 frames open + 4 frames close
- Green indicator light shows current floor

### Ambient effects
- Clouds: each cloud has an `x` position that increments slowly (0.2px/frame), wraps around canvas
- Window lights: random flicker — each lit window has ~1% chance per second of toggling

### Sound system via Web Audio API
- **Why synthesized?** No asset pipeline needed, zero file downloads, works offline, small code footprint
- **AudioContext**: Created lazily on first user click (canvas click), respects browser autoplay policy
- **Master gain**: Single `GainNode` at 0.3 volume so sounds are subtle, not overwhelming

#### Elevator sounds
- **Arrival ding**: Two-tone chime — 880Hz for 80ms, then 1320Hz for 120ms, exponential decay. Triggered when elevator arrives at target floor.
- **Movement whoosh**: Brief filtered noise burst (100ms, bandpass 400-800Hz). Triggered when elevator starts moving to a new floor.
- **Door open/close**: Short high click (2000Hz, 30ms). Triggered on door state transition.

#### Ambient sounds
- **Tower hum**: Low sine wave (60Hz) at very low volume (0.02), only active when tower has 3+ floors. Started once, runs continuously.
- **Footsteps**: Random quiet clicks (200-400Hz, 20ms) triggered occasionally when people are walking (~1% chance per walking person per second).

#### Placement sounds
- **Construction thud**: Low-frequency impact (~150Hz) layered with a metallic overtone (~800Hz), ~80ms with fast exponential decay. Triggered on successful `placeCell()`. Feels like a building block clicking into place.

### Rendering approach
- `renderAll()` is called every frame by the game loop
- Full redraw each frame — no dirty-rect optimization needed at 800x600
- Test pages remain unaffected via `window.preview = 1`

## Risks / Trade-offs

[Full redraw every frame may be slow on low-end mobile] → 800x600 pixel art canvas is small enough. Sky gradient is the heaviest part — could cache to offscreen canvas later if needed.

[Too many people could clutter floors] → Capped at 30 people total.

[Web Audio API not available in all browsers] → Graceful degradation — if `AudioContext` is unavailable, all sound calls are no-ops. Animation still works.

[AudioContext must be resumed after user gesture] → First canvas click creates/resumes the context. Until then, sounds are silently skipped.

[Synthesized sounds may not sound "good"] → They don't need to — SimTower/Kairosoft sounds are simple beeps and dings. The goal is presence, not quality.
