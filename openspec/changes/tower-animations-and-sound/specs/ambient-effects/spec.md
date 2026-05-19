## ADDED Requirements

### Requirement: Clouds drift slowly across the sky

The system SHALL update each cloud's X position by a small amount each frame (e.g., 0.2px/frame), wrapping around the canvas when they exit the opposite edge.

#### Scenario: Cloud moves right each frame
- **WHEN** a cloud exists at `x: 100`
- **THEN** after one frame, its `x` is approximately `100.2`

#### Scenario: Cloud wraps around canvas
- **WHEN** a cloud's `x` exceeds `CANVAS_W + cloudWidth`
- **THEN** its `x` resets to `-cloudWidth` (enters from left)

### Requirement: City skyline window lights flicker randomly

The system SHALL randomly toggle individual window lights in the city skyline buildings at a low frequency (~1% chance per window per second).

#### Scenario: Window light toggles
- **WHEN** a lit window in the skyline flickers
- **THEN** it changes from lit (`#FFE4A0`) to dark (`#4A6A7A`) or vice versa

### Requirement: Ambient animations do not impact performance

The system SHALL keep ambient effects lightweight — no per-pixel operations, no large allocations per frame.

#### Scenario: Cloud updates are cheap
- **WHEN** clouds update each frame
- **THEN** only the `x` position float is modified, no new objects are allocated
