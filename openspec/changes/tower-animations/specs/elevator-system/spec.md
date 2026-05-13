## ADDED Requirements

### Requirement: Elevator has animated state: current floor, target floor, and door state

The system SHALL track elevator state: `currentFloor` (float for smooth movement), `targetFloor` (integer), and `doorState` (`CLOSED`, `OPENING`, `OPEN`, `CLOSING`).

#### Scenario: Elevator starts at ground floor
- **WHEN** the game initializes
- **THEN** elevator `currentFloor` is 0 (ground floor) and `doorState` is `CLOSED`

### Requirement: Elevator moves between occupied floors

The system SHALL select a random occupied floor as the elevator's target, move the car smoothly to that floor, open doors briefly, then select a new target.

#### Scenario: Elevator moves to target floor
- **WHEN** elevator has a `targetFloor` and `doorState` is `CLOSED`
- **THEN** `currentFloor` increments/decrements toward `targetFloor` each frame

#### Scenario: Elevator opens doors on arrival
- **WHEN** elevator `currentFloor` reaches `targetFloor`
- **THEN** `doorState` transitions to `OPENING`, then `OPEN`

#### Scenario: Elevator selects new target after doors close
- **WHEN** elevator doors finish closing (`doorState` becomes `CLOSED`)
- **THEN** a new random occupied floor is selected as `targetFloor`

### Requirement: Elevator car renders at its current animated Y position

The system SHALL draw the elevator car at the Y position corresponding to `currentFloor` each frame, not at a fixed position per floor row.

#### Scenario: Elevator car moves smoothly
- **WHEN** `currentFloor` is 2.5 (between floor 2 and 3)
- **THEN** the elevator car renders halfway between those two floors

### Requirement: Elevator doors animate open and closed

The system SHALL render elevator doors in different positions based on `doorState`.

#### Scenario: Doors are closed
- **WHEN** `doorState` is `CLOSED`
- **THEN** both door panels meet in the center of the shaft

#### Scenario: Doors are open
- **WHEN** `doorState` is `OPEN`
- **THEN** both door panels are slid fully to the sides, revealing the car interior

### Requirement: Elevator indicator light shows current floor

The system SHALL render a small green light or number near the elevator shaft showing which floor the elevator is currently at.

#### Scenario: Indicator updates each frame
- **WHEN** the elevator moves between floors
- **THEN** the indicator light position updates to match `currentFloor`

### Requirement: Elevator only visits floors that exist and have cells

The system SHALL NOT target empty or non-existent floors.

#### Scenario: Elevator skips empty floors
- **WHEN** floor 3 has no cells placed
- **THEN** the elevator never selects floor 3 as a `targetFloor`
