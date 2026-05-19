## Why

The tower renders as a static image — people stand frozen, the elevator never moves, there's no sense of life, and there's no audio feedback. SimTower and Kairosoft games feel alive because of small continuous animations (people walking, elevators shuttling, lights flickering) paired with subtle sound effects (elevator dings, footsteps, ambient hum). Without either, the tower looks like a screenshot rather than a living building.

This change **supersedes** `tower-animations` by keeping all its animation work and adding a sound layer on top.

## What Changes

### Animations (from superseded `tower-animations`)
- Introduce a **game loop** (`requestAnimationFrame`) that runs at ~30fps and drives all animations
- People (emoji figures) **walk** along floor interiors and use staircases to move between floors
- The **elevator car** moves between floors, doors open/close, indicator light shows current floor
- **Ambient effects**: clouds drift slowly, window lights flicker, elevator indicator updates

### Sound (new)
- Add a lightweight **audio system** using the Web Audio API (no external audio files)
- **Elevator sounds**: ding on arrival, whoosh on movement, door chime on open
- **Ambient sounds**: low tower hum when tower has multiple floors, occasional footstep ticks
- **Placement sounds**: construction thud when a cell is placed (block clicking into place)
- All sounds are **synthesized** — no `.wav` or `.mp3` files needed
- Audio starts only after a user gesture (browser autoplay policy compliance)

## Capabilities

### New Capabilities

- `game-loop`: `requestAnimationFrame` loop at ~30fps driving all animation state updates and re-renders
- `people-movement`: People walk along floors, pause, turn around, and use staircases to change floors
- `elevator-system`: Elevator car moves between occupied floors, doors animate open/close, floor indicator light updates
- `ambient-effects`: Clouds drift, window lights flicker randomly, subtle idle animations
- `sound-system`: Web Audio API synthesizer for elevator dings, footstep ticks, placement pops, and ambient hum

### Modified Capabilities

- `renderAll()` moves from render-on-event to render-each-frame
- `person()` function becomes dynamic — each person has position, direction, speed, and state
- `drawElevator()` becomes dynamic — car position and door state are animated per frame
- `placeCell()` triggers a placement sound on successful placement

## Impact

- `js/game.js` — adds game loop, person entities, elevator state, animation tick logic, and sound system
- No new dependencies — pure vanilla JS with Web Audio API on canvas
- `index.html` — no structural changes
- Test pages — unaffected (they use `window.preview = 1` to suppress the game loop and audio context)
