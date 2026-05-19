## 1. Game Loop

- [x] 1.1 Add `gameRunning = false` flag and `lastFrameTime = 0` tracker
- [x] 1.2 Implement `gameLoop(timestamp)` using `requestAnimationFrame`, throttled to ~30fps
- [x] 1.3 In each frame: call `updateAnimations()` then `renderAll()`
- [x] 1.4 Start the game loop in `DOMContentLoaded` only if `!window.preview` and `towerGrid` has content
- [x] 1.5 Restart the game loop when the first cell is placed (empty lot → first building)

## 2. Person Entities and Movement

- [x] 2.1 Define `people` array to hold person entity objects
- [x] 2.2 Define person structure: `{ x, floorIdx, direction (1/-1), speed, state ('WALKING'|'PAUSED'|'USING_STAIRS'), timer, emoji }`
- [x] 2.3 Implement `spawnPerson(floorIdx)` — creates a person at a random X within the floor's interior zone, capped at 30 total
- [x] 2.4 Call `spawnPerson()` when a cell is placed (in `placeCell()`, after successful placement)
- [x] 2.5 Implement `updatePeople()` — each frame: update walking X position, bounce off edges, toggle pause/walk timers
- [x] 2.6 Implement staircase usage — small chance per frame for a person to enter `USING_STAIRS`, move to adjacent floor after delay
- [x] 2.7 Replace static `person()` calls in interior draw functions with dynamic rendering from the `people` array
- [x] 2.8 Walking people render as 🚶, paused people render as 🧍

## 3. Elevator Animation

- [x] 3.1 Define elevator state: `{ currentFloor (float), targetFloor (int), doorState ('CLOSED'|'OPENING'|'OPEN'|'CLOSING'), doorTimer }`
- [x] 3.2 Initialize elevator at ground floor (currentFloor = 0)
- [x] 3.3 Implement `updateElevator()` — each frame: move toward targetFloor, handle door state machine
- [x] 3.4 Door state machine: CLOSED → OPENING (4 frames) → OPEN (8 frames) → CLOSING (4 frames) → CLOSED → pick new target
- [x] 3.5 Refactor `drawElevator(y)` to accept animated car Y position and door open amount
- [x] 3.6 Render elevator indicator light showing current floor number
- [x] 3.7 Elevator only targets floors that exist and have at least one placed cell

## 4. Ambient Effects

- [x] 4.1 Convert cloud positions from static to dynamic — each cloud has an `x` that increments 0.2px/frame
- [x] 4.2 Implement cloud wrap-around when exiting canvas edges
- [x] 4.3 Add window light flicker — each skyline window has a `lit` boolean that toggles ~1% per second
- [x] 4.4 Store window light states in a lightweight structure (no per-frame allocation)

## 5. Sound System

- [x] 5.1 Add `audioCtx = null` and `masterGain = null` variables
- [x] 5.2 Implement `initAudio()` — creates `AudioContext` and master `GainNode` at volume 0.3, called on first canvas click
- [x] 5.3 Implement `playElevatorDing()` — two-tone chime: 880Hz (80ms) + 1320Hz (120ms), exponential decay envelope
- [x] 5.4 Implement `playElevatorWhoosh()` — filtered noise burst (100ms, bandpass 400-800Hz)
- [x] 5.5 Implement `playDoorClick()` — short high click (2000Hz, 30ms)
- [x] 5.6 Implement `playPlacementThud()` — low-frequency impact (~150Hz + metallic overtone ~800Hz, 80ms, fast decay)
- [x] 5.7 Implement `playFootstep()` — random quiet click (200-400Hz, 20ms)
- [x] 5.8 Implement `startTowerHum()` and `stopTowerHum()` — 60Hz sine at 0.02 volume, managed by a persistent oscillator
- [x] 5.9 Call `initAudio()` on first canvas click (in `setupClickHandler`), guard all sound calls with `if (audioCtx)`
- [x] 5.10 Call `playPlacementThud()` in `placeCell()` after successful placement
- [x] 5.11 Call `playElevatorDing()` when elevator doors begin opening
- [x] 5.12 Call `playElevatorWhoosh()` when elevator starts moving to new floor
- [x] 5.13 Call `playDoorClick()` on door state transitions (open/close)
- [x] 5.14 Call `playFootstep()` randomly during `updatePeople()` for walking persons (~1% per second)
- [x] 5.15 Manage tower hum in `updateAnimations()` — start when tower has 3+ floors, stop otherwise

## 6. Integration and Testing

- [ ] 6.1 Verify: people walk back and forth on placed floors
- [ ] 6.2 Verify: people pause periodically and resume walking
- [ ] 6.3 Verify: people use staircases to move between floors
- [ ] 6.4 Verify: elevator moves between occupied floors with door animations
- [ ] 6.5 Verify: clouds drift across the sky
- [ ] 6.6 Verify: skyline window lights flicker
- [ ] 6.7 Verify: game loop does not run on empty lot (no tower placed yet)
- [ ] 6.8 Verify: test pages remain static (no animation loop, no audio)
- [ ] 6.9 Verify: performance is acceptable on mobile (no jank, ~30fps)
- [ ] 6.10 Verify: no sound plays until first user click
- [ ] 6.11 Verify: elevator ding plays on arrival at each floor
- [ ] 6.12 Verify: elevator whoosh plays on movement start
- [ ] 6.13 Verify: door clicks play on open/close transitions
- [ ] 6.14 Verify: placement pop plays on cell placement
- [ ] 6.15 Verify: tower hum is audible with 3+ floors and silent otherwise
- [ ] 6.16 Verify: footstep sounds play occasionally for walking people
- [ ] 6.17 Verify: no console errors when Web Audio API is unavailable
- [ ] 6.18 Create `test/animation-preview.html` with a pre-built tower to inspect all animations and sounds
