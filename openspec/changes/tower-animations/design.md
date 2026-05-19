## Context

The tower currently renders as a static snapshot. People are drawn at fixed positions determined by a seed value. The elevator shaft draws the same doors and indicator every frame. There is no game loop — rendering happens only on initial load and after placement clicks.

SimTower/Kairosoft games feel alive through small continuous animations. People walk back and forth, pause, and use stairs/elevators. The elevator shuttles between floors with doors opening and closing. Ambient details like drifting clouds and flickering lights add life.

## Goals / Non-Goals

**Goals:**
- Introduce a `requestAnimationFrame` game loop at ~30fps
- People walk along floors, change direction, and use staircases
- Elevator car moves between floors with door animations
- Ambient effects: drifting clouds, flickering window lights
- All animations are lightweight and performant on mobile

**Non-Goals:**
- No pathfinding AI or complex behavior trees
- No sound effects or audio
- No new floor types or game mechanics
- No save/load of animation state
- No collision detection between people

## Decisions

**Game loop via `requestAnimationFrame` at ~30fps**
- Target 30fps (33ms per frame) rather than 60fps — pixel art doesn't need smooth interpolation and this saves battery on mobile
- Each frame: update animation state → call `renderAll()`
- Loop only starts when `towerGrid` has at least one cell (no point animating an empty lot)

**Person entities as objects**
- Each person is an object: `{ x, floorIdx, direction, speed, state, timer }`
- States: `WALKING`, `PAUSED`, `USING_STAIRS`
- People are spawned when their floor type is placed (1 person per cell, max 30 total)
- People walk left/right within their floor's interior zone, bounce off walls, occasionally pause

**Elevator state machine**
- Elevator has: `currentFloor` (float for smooth movement), `targetFloor` (int), `doorState` (`CLOSED`, `OPENING`, `OPEN`, `CLOSING`)
- Elevator picks a random occupied floor as target, moves there, opens doors briefly, repeats
- Movement speed: 1 pixel per frame
- Door animation: 4 frames open + 8 frames open + 4 frames close
- Green indicator light shows current floor

**Ambient effects**
- Clouds: each cloud has an `x` position that increments slowly (0.2px/frame), wraps around canvas
- Window lights: random flicker — each lit window has ~1% chance per second of toggling

**Rendering approach**
- `renderAll()` is called every frame by the game loop
- Full redraw each frame — no dirty-rect optimization needed at 800x600
- Test pages remain unaffected via `window.preview = 1`

## Risks / Trade-offs

[Full redraw every frame may be slow on low-end mobile] → 800x600 pixel art canvas is small enough. Sky gradient is the heaviest part — could cache to offscreen canvas later if needed.

[Too many people could clutter floors] → Capped at 30 people total.

[Animation state complicates the codebase] → Animation state is isolated in its own section of `game.js`.
