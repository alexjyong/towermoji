## ADDED Requirements

### Requirement: Audio context is created lazily on first user gesture

The system SHALL create the `AudioContext` only after the first user click on the canvas, complying with browser autoplay policies.

#### Scenario: No audio context on page load
- **WHEN** the page loads and renders
- **THEN** no `AudioContext` is created and no sound plays

#### Scenario: Audio context on first click
- **WHEN** the user clicks the canvas for the first time
- **THEN** an `AudioContext` is created (or resumed if suspended) and sound becomes available

#### Scenario: Graceful fallback if Web Audio is unavailable
- **WHEN** `window.AudioContext` is `undefined`
- **THEN** all sound functions are no-ops and no errors are thrown

### Requirement: Master gain controls overall volume

The system SHALL route all sound through a single `GainNode` at a low volume (~0.3) so sounds are subtle background audio.

#### Scenario: All sounds pass through master gain
- **WHEN** any sound is played
- **THEN** its oscillator/node connects to the master gain node before the destination

### Requirement: Elevator arrival plays a two-tone ding

The system SHALL play a two-tone chime (880Hz for 80ms, then 1320Hz for 120ms with exponential decay) when the elevator arrives at its target floor.

#### Scenario: Ding plays on elevator arrival
- **WHEN** elevator `currentFloor` reaches `targetFloor` and doors begin opening
- **THEN** a two-tone ding sound is triggered through the audio system

#### Scenario: Ding does not play if audio is not initialized
- **WHEN** the elevator arrives but the user has not yet clicked the canvas
- **THEN** no sound is played and no error occurs

### Requirement: Elevator movement plays a brief whoosh

The system SHALL play a filtered noise burst (100ms, bandpass 400-800Hz) when the elevator starts moving to a new floor.

#### Scenario: Whoosh plays on movement start
- **WHEN** the elevator begins moving to a new `targetFloor`
- **THEN** a short whoosh sound is triggered

### Requirement: Door state changes play a click

The system SHALL play a short high-frequency click (2000Hz, 30ms) when elevator doors transition between states.

#### Scenario: Click on door open
- **WHEN** `doorState` transitions from `CLOSED` to `OPENING`
- **THEN** a brief click sound plays

#### Scenario: Click on door close
- **WHEN** `doorState` transitions from `OPEN` to `CLOSING`
- **THEN** a brief click sound plays

### Requirement: Tower hum plays when tower has multiple floors

The system SHALL start a low-frequency ambient hum (60Hz sine at 0.02 volume) when the tower reaches 3 or more floors, and stop it when the tower has fewer.

#### Scenario: Hum starts at 3 floors
- **WHEN** the tower reaches 3 placed floor rows
- **THEN** a continuous low hum begins

#### Scenario: Hum stops below 3 floors
- **WHEN** the tower has fewer than 3 placed floor rows
- **THEN** the ambient hum is silenced

### Requirement: Footstep sounds play randomly while people walk

The system SHALL trigger random quiet click sounds (200-400Hz, 20ms) at a low frequency (~1% chance per walking person per second).

#### Scenario: Footstep plays for walking person
- **WHEN** a person is in `WALKING` state and the random threshold is met
- **THEN** a short footstep click plays

#### Scenario: No footstep for paused person
- **WHEN** a person is in `PAUSED` or `USING_STAIRS` state
- **THEN** no footstep sound is triggered for that person

### Requirement: Cell placement plays a construction thud

The system SHALL play a short, weighted construction sound (low-frequency impact ~150Hz with a metallic overtone ~800Hz, ~80ms, fast decay) when a cell is successfully placed — like a building block clicking into place.

#### Scenario: Thud plays on cell placement
- **WHEN** `placeCell()` successfully places a cell
- **THEN** a construction thud sound is triggered

#### Scenario: No sound on failed placement
- **WHEN** a placement is rejected (no support, wrong type, etc.)
- **THEN** no sound is triggered
