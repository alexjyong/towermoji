## 1. Game Loop

- [ ] 1.1 Add `gameRunning = false` flag and `lastFrameTime = 0` tracker
- [ ] 1.2 Implement `gameLoop(timestamp)` using `requestAnimationFrame`, throttled to ~30fps
- [ ] 1.3 In each frame: call `updateAnimations()` then `renderAll()`
- [ ] 1.4 Start the game loop in `DOMContentLoaded` only if `!window.preview` and `towerGrid` has content
- [ ] 1.5 Restart the game loop when the first cell is placed (empty lot → first building)

## 2. Person Entities and Movement

- [ ] 2.1 Define `people` array to hold person entity objects
- [ ] 2.2 Define person structure: `{ x, floorIdx, direction (1/-1), speed, state ('WALKING'|'PAUSED'|'USING_STAIRS'), timer, emoji }`
- [ ] 2.3 Implement `spawnPerson(floorIdx)` — creates a person at a random X within the floor's interior zone, capped at 30 total
- [ ] 2.4 Call `spawnPerson()` when a cell is placed (in `placeCell()`, after successful placement)
- [ ] 2.5 Implement `updatePeople()` — each frame: update walking X position, bounce off edges, toggle pause/walk timers
- [ ] 2.6 Implement staircase usage — small chance per frame for a person to enter `USING_STAIRS`, move to adjacent floor after delay
- [ ] 2.7 Replace static `person()` calls in interior draw functions with dynamic rendering from the `people` array
- [ ] 2.8 Walking people render as 🚶, paused people render as 🧍

## 3. Elevator Animation

- [ ] 3.1 Define elevator state: `{ currentFloor (float), targetFloor (int), doorState ('CLOSED'|'OPENING'|'OPEN'|'CLOSING'), doorTimer }`
- [ ] 3.2 Initialize elevator at ground floor (currentFloor = 0)
- [ ] 3.3 Implement `updateElevator()` — each frame: move toward targetFloor, handle door state machine
- [ ] 3.4 Door state machine: CLOSED → OPENING (4 frames) → OPEN (8 frames) → CLOSING (4 frames) → CLOSED → pick new target
- [ ] 3.5 Refactor `drawElevator(y)` to accept animated car Y position and door open amount
- [ ] 3.6 Render elevator indicator light showing current floor number
- [ ] 3.7 Elevator only targets floors that exist and have at least one placed cell

## 4. Ambient Effects

- [ ] 4.1 Convert cloud positions from static to dynamic — each cloud has an `x` that increments 0.2px/frame
- [ ] 4.2 Implement cloud wrap-around when exiting canvas edges
- [ ] 4.3 Add window light flicker — each skyline window has a `lit` boolean that toggles ~1% per second
- [ ] 4.4 Store window light states in a lightweight structure (no per-frame allocation)

## 5. Integration and Testing

- [ ] 5.1 Verify: people walk back and forth on placed floors
- [ ] 5.2 Verify: people pause periodically and resume walking
- [ ] 5.3 Verify: people use staircases to move between floors
- [ ] 5.4 Verify: elevator moves between occupied floors with door animations
- [ ] 5.5 Verify: clouds drift across the sky
- [ ] 5.6 Verify: skyline window lights flicker
- [ ] 5.7 Verify: game loop does not run on empty lot (no tower placed yet)
- [ ] 5.8 Verify: test pages remain static (no animation loop)
- [ ] 5.9 Verify: performance is acceptable on mobile (no jank, ~30fps)
- [ ] 5.10 Create `test/animation-preview.html` with a pre-built tower to inspect all animations
