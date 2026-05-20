## ADDED Requirements

### Requirement: Each person is an entity with position, direction, and state

The system SHALL track people as objects with properties: `x` (horizontal position), `floorIdx` (which floor they're on), `direction` (1=right, -1=left), `speed`, `state`, and `timer`.

#### Scenario: Person entity structure
- **WHEN** a person is created
- **THEN** it has properties: `{ x, floorIdx, direction, speed, state: 'WALKING', timer: 0 }`

### Requirement: People walk along their floor's interior zone

The system SHALL update each person's `x` position each frame based on their `direction` and `speed`, bounded by their floor's interior zone edges.

#### Scenario: Person walks right
- **WHEN** a person has `direction: 1` and `state: 'WALKING'`
- **THEN** their `x` increases by `speed` each frame

#### Scenario: Person bounces off interior zone edges
- **WHEN** a person reaches the left or right edge of their floor's interior zone
- **THEN** their `direction` is reversed and they walk the other way

### Requirement: People pause periodically while walking

The system SHALL transition people from `WALKING` to `PAUSED` state after a random interval, then back to `WALKING` after a pause duration.

#### Scenario: Person pauses
- **WHEN** a walking person's walk timer expires
- **THEN** their state changes to `PAUSED` and `x` stops updating

#### Scenario: Person resumes walking
- **WHEN** a paused person's pause timer expires
- **THEN** their state changes back to `WALKING`

### Requirement: People occasionally use staircases to change floors

The system SHALL transition some people to `USING_STAIRS` state, moving them to the floor above or below.

#### Scenario: Person uses stairs to go up
- **WHEN** a person enters `USING_STAIRS` state and the floor above exists and has cells
- **THEN** after a brief animation, the person appears on the floor above at the staircase position

#### Scenario: Person uses stairs to go down
- **WHEN** a person enters `USING_STAIRS` state and `floorIdx > 0`
- **THEN** after a brief animation, the person appears on the floor below at the staircase position

### Requirement: People are spawned when cells are placed

The system SHALL create 1 person entity for each newly placed cell (except Lobby which gets 1 person for the whole row).

#### Scenario: Placing a Residential cell spawns a person
- **WHEN** a Residential cell is placed
- **THEN** one person entity is created on that floor

#### Scenario: Total people are capped
- **WHEN** the total number of people would exceed 30
- **THEN** no new person is spawned

### Requirement: People render as emojis at their current positions

The system SHALL draw each person as an emoji at their `(x, floorY)` position each frame, replacing the static seed-based placement.

#### Scenario: Person renders at dynamic position
- **WHEN** a person entity exists at `x: 200, floorIdx: 2`
- **THEN** the person emoji renders at pixel x=200 on floor 2's Y position

#### Scenario: Walking people use walking emoji, paused people use standing emoji
- **WHEN** a person is in `WALKING` state
- **THEN** they render as a walking emoji (🚶)
- **WHEN** a person is in `PAUSED` state
- **THEN** they render as a standing emoji (🧍)
