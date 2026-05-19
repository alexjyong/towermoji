# Feature Specification: Towermoji — SimTower Spin-off

**Feature Branch**: `001-tower-mvp`
**Created**: 2026-05-01
**Status**: Draft
**Input**: User description: "SimTower-inspired vertical building simulation — construct floors of different types, tenants spawn and move between floors via elevators, events like fire and theft occur, player manages tower layout"

---

## Concept

Build a skyscraper one floor at a time. Each floor has a type (office, residential, entertainment, retail, restaurant, gym, storage, rooftop). Tenants spawn, walk between floors using elevators, and generate income or happiness. Disasters (fire, theft) can occur and need management. The goal: keep your tower profitable and your tenants happy using only emoji + CSS.

---

## Clarifications

- Q: Tower dimensions? → A: 20 cells wide × up to 30 floors tall, grows upward as player builds
- Q: Do tenants move automatically? → A: Yes — tenants path to floors matching their needs (office workers go to office floors, residents to residential, etc.)
- Q: Elevators — manual or auto? → A: Player places elevators; they auto-run between connected floors
- Q: Income/economy? → A: Simple — each occupied floor generates coins per tick; unhappy tenants leave
- Q: Fire/robbery mechanics? → A: Random events that spread on a floor; player places sprinklers 🔥→🧯 or security 🚨 to mitigate

---

## User Scenarios & Testing

### User Story 1 — Build Your First Floor (Priority: P1)

On page load, the player sees a Lobby ground floor 🏛️ with entrance doors and a concierge desk. Using the toolbar, they select a floor type and click above the lobby to construct the first real floor of the tower. The lobby is always present — it's the tower's entrance and the spawn point for all tenants.

**Why this priority**: Nothing exists until the player can build. This is the foundation of the entire loop.

**Acceptance**:
1. **Given** the page loads, **When** the player views the grid, **Then** a Lobby floor is visible at the bottom with CSS marble styling and 🏛️ marker
2. **Given** the lobby exists, **When** the player selects Office from toolbar and clicks the cell above the lobby, **Then** an office floor appears with CSS styling
3. **Given** one floor exists above lobby, **When** the player clicks the cell above it, **Then** a new floor is stacked on top
4. **Given** the toolbar is visible, **When** the player selects a different floor type, **Then** subsequent clicks build that type

---

### User Story 2 — Tenants Spawn & Occupy Floors (Priority: P1)

After floors are built, matching tenants automatically appear and occupy compatible floors.

**Why this priority**: Empty floors are just decoration — tenants make it a simulation.

**Acceptance**:
1. **Given** an office floor exists, **When** the simulation runs, **Then** office worker tenants (👨💼👩💼) spawn on that floor
2. **Given** a residential floor exists, **When** the simulation runs, **Then** resident tenants (🏠 people) spawn
3. **Given** an entertainment floor exists, **When** the simulation runs, **Then** party-goers (🎉) spawn
4. **Given** a floor is at tenant capacity, **When** more tenants try to spawn, **Then** they don't appear (cap enforced)

---

### User Story 3 — Elevators Connect Floors (Priority: P2)

The player places elevator shafts that allow tenants to move between floors. Tenants use elevators to reach their destination floors.

**Why this priority**: Without elevators, tenants are trapped on their spawn floor — the tower feels dead.

**Acceptance**:
1. **Given** multiple floors exist, **When** the player places an elevator, **Then** 🛗 emoji appears and tenants can use it
2. **Given** an elevator connects floors 1–5, **When** a tenant on floor 1 wants to go to floor 3, **Then** the tenant moves through the elevator
3. **Given** no elevator connects two floors, **When** a tenant tries to cross, **Then** they wait (don't teleport)

---

### User Story 4 — Tower Generates Income (Priority: P2)

Occupied floors generate coins per tick displayed in a header bar. Unoccupied or unhappy floors generate less.

**Why this priority**: Income is the score and the progression driver — it gives the player a reason to optimize layout.

**Acceptance**:
1. **Given** occupied floors exist, **When** a tick passes, **Then** the coin counter increases
2. **Given** a floor has unhappy tenants, **When** a tick passes, **Then** income from that floor is reduced
3. **Given** all tenants leave a floor, **When** a tick passes, **Then** that floor generates zero income

---

### User Story 5 — Disasters Strike (Priority: P3)

Random events — fire 🔥 and theft 🚨 — occur on occupied floors. Fire spreads to adjacent cells; theft drains income. Player places sprinklers 🧯 and security guards 🛡️ to prevent/mitigate.

**Why this priority**: Disasters add tension and give the player active management beyond layout optimization.

**Acceptance**:
1. **Given** an occupied floor exists, **When** a fire event triggers, **Then** 🔥 appears on a random cell and spreads to neighbors
2. **Given** fire is present, **When** tenants are on burning cells, **Then** they flee the floor
3. **Given** a sprinkler 🧯 is on the same floor, **When** fire is adjacent, **Then** the fire is extinguished
4. **Given** a theft 🚨 event triggers, **When** no security 🛡️ is present, **Then** income is reduced that tick
5. **Given** security 🛡️ is on the floor, **When** theft attempts, **Then** it is blocked

---

### User Story 6 — Inspect Floors (Priority: P3)

The player toggles Inspect mode and clicks any floor to see tenant count, happiness, income, and floor type in a tooltip.

**Acceptance**:
1. **Given** a floor has tenants, **When** the player inspects it, **Then** the tooltip shows tenant count, average happiness, and income
2. **Given** a floor has an active disaster, **When** the player inspects it, **Then** the tooltip warns about the event

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST support 9 floor types: Lobby, Office, Residential, Entertainment, Retail, Restaurant, Gym, Storage, Rooftop Garden
- **FR-002**: Each floor type MUST have a distinct CSS color scheme, CSS-decorated details (windows, doors, patterns), and an emoji identifier
- **FR-003**: Tenants MUST spawn on compatible floor types automatically (one tenant type per floor type)
- **FR-004**: Tenant capacity per floor MUST be capped (10 tenants per floor)
- **FR-005**: Elevators MUST be placed by the player and auto-transport tenants between connected floors
- **FR-006**: Tenants MUST have a happiness value (0–100) that affects income
- **FR-007**: Occupied floors MUST generate coins per tick proportional to tenant count × happiness
- **FR-008**: Fire events MUST spawn randomly on occupied floors and spread to adjacent cells each tick
- **FR-009**: Theft events MUST drain income from affected floors
- **FR-010**: Sprinklers (🧯) MUST extinguish adjacent fire each tick
- **FR-011**: Security guards (🛡️) MUST block theft events on their floor
- **FR-012**: Unhappy tenants (happiness < 20) MUST leave the tower
- **FR-013**: Inspect tooltip MUST show floor type, tenant count, happiness, and income
- **FR-014**: Tower MUST grow upward from a Lobby ground floor — no floating floors, lobby cannot be demolished
- **FR-015**: All tenants MUST spawn at the Lobby entrance and travel to their destination floors via elevator
- **FR-016**: Player MUST be able to demolish a floor (toolbar tool) to replace it (lobby excluded)

### Key Entities

| Entity | Description |
|--------|-------------|
| **Floor** | A row of 20 cells with a `type`, `tenants[]`, `happiness`, `income`, and optional `disaster`. Each cell can also hold a CSS-decorated detail (window, door, plant, artwork) |
| **Tenant** | Emoji entity with `type` (worker/resident/partygoer/etc.), `happiness` (0–100), `currentFloor`, `destinationFloor` |
| **Elevator** | Player-placed shaft connecting a range of floors; transports tenants automatically |
| **Disaster** | Temporary state on a floor: `Fire` (spreads) or `Theft` (drains income) |
| **Utility** | Player-placed mitigation: Sprinkler 🧯 (stops fire), Security 🛡️ (stops theft) |
| **CoinBalance** | Global counter — income minus costs, displayed in header |

### CSS Floor Graphics

Each floor type renders with CSS-generated details overlaid on the base color:

| Floor Type | CSS Details |
|------------|------------|
| Lobby | Polished floor pattern (CSS repeating gradient), entrance doors on edges, potted plants 🪴 at corners, concierge desk |
| Office | Window strips along edges, cubicle grid pattern (CSS `background-image`), desk rows |
| Residential | Balcony rails, window boxes with flowers, warm interior lighting gradient |
| Entertainment | Neon sign strip (CSS `text-shadow` glow), checker/dance-floor pattern |
| Retail | Display windows, shelving pattern, price-tag accents |
| Restaurant | Table-and-chair pattern (CSS radial circles), warm amber overlay |
| Gym | Equipment silhouettes (CSS shapes), rubber-floor texture |
| Storage | Crate grid pattern, muted tones, lock icons |
| Rooftop Garden | Grass texture gradient, flower dots, sky backdrop above |

CSS details are static per floor type — they don't animate. Emoji entities (tenants, elevators, disasters) render on top of the CSS layer.

### Floor Type → Tenant Mapping

| Floor Type | Emoji | Tenant Emoji | CSS Theme |
|------------|-------|-------------|-----------|
| Lobby | 🏛️ | 🚶 (transit) | Polished marble, gold trim |
| Office | 🏢 | 👨💼👩💼 | Cool blue |
| Residential | 🏠 | 👨👩👧 | Warm beige |
| Entertainment | 🎢 | 🎉 | Neon purple |
| Retail | 🛒 | 🧑🦱 | Green |
| Restaurant | 🍽️ | 🍽️ | Red |
| Gym | 🏋️ | 🏃 | Orange |
| Storage | 📦 | (none) | Gray |
| Rooftop Garden | 🌿 | 🧘 | Green gradient |

## Success Criteria

- **SC-001**: Player can build a 3-floor tower within 5 clicks
- **SC-002**: Tenants spawn on all floor types within 5 ticks of construction
- **SC-003**: Elevator transport is visible — tenants animate between floors
- **SC-004**: Income counter updates each tick and reflects occupancy
- **SC-005**: Fire event is visible, spreads, and can be stopped by sprinkler
- **SC-006**: Tower maintains 60fps at 15 floors with active tenants and elevators

## Assumptions

- Tenant AI is simple: spawn at Lobby, travel via elevator to compatible floor, occasionally change destination
- No pathfinding — tenants move directly to elevator, ride it, then walk to destination cell
- Fire spreads to all 4 adjacent cells per tick (no probability — deterministic spread)
- Income is abstract — no currency name, just coins displayed as 💰 +number
- Demolishing a floor evacuates tenants (they return to lobby, don't die)
- Rooftop Garden can only be placed on the highest floor
- Storage floors hold no tenants but can hold sprinklers/security for protecting adjacent floors
- Lobby is always present, cannot be demolished, and serves as the tenant spawn/exit point
- CSS floor details are static per type — no animation, just visual flavor (windows, doors, patterns)
- Same seed = same tower events (deterministic simulation per Constitution III)
