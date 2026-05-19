## ADDED Requirements

### Requirement: Game loop runs at ~30fps via requestAnimationFrame

The system SHALL use `requestAnimationFrame` to drive a continuous render loop targeting ~30fps (one frame every ~33ms).

#### Scenario: Game loop starts when tower has content
- **WHEN** `towerGrid` has at least one placed cell
- **THEN** the game loop begins and `renderAll()` is called each frame

#### Scenario: Game loop does not run on empty lot
- **WHEN** `towerGrid` is empty (no cells placed)
- **THEN** no game loop runs and the canvas shows only the static background

#### Scenario: Frame rate is throttled to ~30fps
- **WHEN** the device supports 60fps or higher
- **THEN** the loop skips alternate frames to target ~30fps

### Requirement: Game loop updates animation state then renders

The system SHALL update all animation state (people positions, elevator position, cloud positions) before calling `renderAll()` each frame.

#### Scenario: State updates before render
- **WHEN** a frame fires
- **THEN** animation tick runs first, then `renderAll()` draws the updated state

### Requirement: Test pages are unaffected by the game loop

The system SHALL NOT start the game loop when `window.preview` is defined (test/preview pages).

#### Scenario: Preview pages remain static
- **WHEN** `window.preview = 1` is set before `game.js` loads
- **THEN** no game loop starts and the page renders once statically
