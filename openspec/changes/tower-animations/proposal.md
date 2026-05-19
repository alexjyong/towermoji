## Why

The tower renders as a static image — people stand frozen, the elevator never moves, and there's no sense of life. SimTower and Kairosoft games feel alive because of small continuous animations: people walking between floors, elevators shuttling up and down, lights flickering, clouds drifting. Without these, the tower looks like a screenshot rather than a living building.

## What Changes

- Introduce a **game loop** (`requestAnimationFrame`) that runs at ~30fps and drives all animations
- People (emoji figures) **walk** along floor interiors and use staircases to move between floors
- The **elevator car** moves between floors, doors open/close, indicator light shows current floor
- **Ambient effects**: clouds drift slowly, window lights flicker, elevator indicator updates
- All animations are **lightweight** — no heavy particle systems, just position updates and re-renders

## Capabilities

### New Capabilities

- `game-loop`: `requestAnimationFrame` loop at ~30fps driving all animation state updates and re-renders
- `people-movement`: People walk along floors, pause, turn around, and use staircases to change floors
- `elevator-system`: Elevator car moves between occupied floors, doors animate open/close, floor indicator light updates
- `ambient-effects`: Clouds drift, window lights flicker randomly, subtle idle animations

### Modified Capabilities

- `renderAll()` moves from render-on-event to render-each-frame
- `person()` function becomes dynamic — each person has position, direction, speed, and state
- `drawElevator()` becomes dynamic — car position and door state are animated per frame

## Impact

- `js/game.js` — adds game loop, person entities, elevator state, animation tick logic
- No new dependencies — pure vanilla JS on canvas
- `index.html` — no structural changes
- Test pages — unaffected (they use `window.preview = 1` to suppress the game loop)
