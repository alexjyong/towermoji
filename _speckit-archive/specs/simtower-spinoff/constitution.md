<!--
Sync Impact Report:
- Version: 1.0.0 (initial)
- Derived from Terramoji constitution v1.2.0, adapted for vertical building simulation
- Modified principles: II (floors replace biomes as base terrain), IV (floor-focused toolbar)
- Added sections: None — same 5 principles, adapted scope
-->

# Towermoji Constitution

## Core Principles

### I. Simplicity First

The first pass is a basic proof of concept. Features are scoped to the minimum viable tower simulation: floor construction, floor type placement, tenant spawning and movement, elevator operation, and player inspection. No networking, no save/load, no multiplayer, no complex economy. If it does not directly serve the core loop of "build floors → watch tenants move → manage tower → inspect results," it is deferred.

**Why**: A focused MVP prevents scope creep and delivers a playable prototype quickly. Complexity can be layered in subsequent iterations.

### II. Emoji-First Graphics (Entities) + CSS Floors

Visual rendering is split into two tiers:

- **Entities** (tenants, elevators, mail, fire, robbery, discrete objects) are rendered using emoji characters. Emoji provide identity and readability for all interactive or movable game objects.
- **Special floor markers** are permanent emoji displayed on specific floor types. Restaurant floors show 🍽️, gym floors show 🏋️, rooftop gardens show 🌿. Special-floor markers are treated as entities — they are emoji, not floor styling.
- **Base floor tiles** are rendered using CSS gradients, patterns, and textures. No external image assets, no sprite sheets, no canvas drawing for floors. CSS provides color, subtle texture, and visual distinction between floor types (e.g., warm tones for residential, cool blues for office, gold for entertainment).

No external assets of any kind — all visuals are emoji + CSS. This constraint keeps the project self-contained and eliminates asset pipeline complexity.

**Why**: CSS provides richer, less repetitive floor visuals than emoji-per-cell. Emoji are reserved for the things that move and change — tenants, elevators, events.

### III. Simulation Integrity

The game world MUST maintain consistent simulation rules. Tenants follow predictable behaviors based on floor types and elevator availability. Floor changes propagate effects to occupants. Time advances in discrete ticks, and all entities update synchronously per tick. The simulation must be deterministic given the same initial seed.

**Why**: A simulation game's credibility depends on consistent, observable cause-and-effect. Players must be able to form mental models of the tower's rules.

### IV. Interactive by Default

Players MUST be able to place floor types via a toolbar and inspect any floor on the tower. The interface is immediate — no menus deeper than one level, no confirmation dialogs for placement. Inspection reveals tenant counts, floor happiness, and resource levels at a glance.

**Why**: The core loop is "interact → observe → iterate." Friction between intention and action breaks the simulation experience.

### V. Incremental Scope

Features are delivered in vertical slices: floor construction ships with floor type placement, which ships with tenant spawning, which ships with elevator management, which ships with inspection. Each slice must be independently playable and demonstrable. No feature is "complete" until it can be exercised through the UI.

**Why**: Vertical slices provide early validation, prevent hidden integration debt, and ensure each commit delivers observable value.

## Technical Constraints

**Platform**: Web-based, targeting modern browsers (Chrome, Firefox, Safari). No native desktop or mobile app for the first pass.

**Technology Stack**: HTML5, CSS3, and vanilla JavaScript (ES2022+). No framework dependency for the first pass — React, Vue, or similar may be introduced only if complexity justifies it.

**Rendering**: DOM-based rendering with CSS Grid for the tower layout. Canvas is reserved for particle effects or overlay rendering if needed later.

**State Management**: A single simulation state object, updated per tick. No reactive framework — state changes are explicit, batched per tick, and applied to the DOM in a single render pass.

**Performance**: The simulation MUST maintain 60fps rendering on a 20-column × 30-row tower grid. Grid size is configurable but defaults to 20×30 for the MVP.

**No External Assets**: The game MUST run with zero external image, audio, or font dependencies. All visuals are emoji + CSS. All audio (if any) is deferred past MVP.

## Development Workflow

**Commit Discipline**: Each commit represents a single, verifiable change. Feature work is branched using sequential feature branch naming (e.g., `001-floor-construction`).

**Code Review**: All changes MUST be reviewed before merge. Reviewers verify compliance with constitution principles — particularly Simplicity First and Emoji-First Graphics.

**Testing**: Unit tests cover simulation logic (tick advancement, tenant behavior, elevator routing, floor effects). Integration tests verify the full render cycle: state change → DOM update. Tests are written before simulation logic changes.

**Documentation**: `README.md` is kept current with setup instructions, feature status, and known limitations. Each feature branch includes a brief description in the branch name and commit messages.

**Quickstart Validation**: After each feature merge, the game MUST be launchable via a single command and reachable within 10 seconds. If quickstart breaks, it is treated as a blocker.

## Governance

This constitution supersedes all other development practices for the Towermoji project. No feature, tool, or pattern is adopted that violates the core principles without an explicit amendment.

**Amendments**: Constitution changes require:
1. A proposed change describing the modification and rationale
2. Review against existing principles for conflicts
3. Version increment per semantic versioning rules below
4. Updated date and sync impact report

**Versioning Policy**:
- **MAJOR**: Principle removal, redefinition, or backward-incompatible governance change
- **MINOR**: New principle added, section expanded, or material guidance change
- **PATCH**: Wording clarification, typo fix, or non-semantic refinement

**Compliance**: Every PR and feature plan MUST reference applicable constitution principles. The plan template's Constitution Check gate enforces this.

**Version**: 1.0.0 | **Ratified**: 2026-05-01
