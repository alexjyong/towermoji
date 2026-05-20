# Towermoji — CLI Context

## Project Overview

**Towermoji** is a SimTower-inspired vertical building simulation game rendered entirely on a single `<canvas>` (800×600). It uses pixel-art interiors, emoji characters for people, and procedurally generated sound effects via Web Audio API.

- **Tech stack:** Vanilla HTML/CSS/JS — zero dependencies, no build step
- **Entry point:** `index.html` → loads `js/game.js` and `css/style.css`
- **Game logic:** All in `js/game.js` (~2000 lines, single monolithic file)
- **Rendering:** Canvas 2D context with `imageSmoothingEnabled = false` for crisp pixels

### Core Mechanics

- **Cell-based grid:** 5 cells per floor row, each independently typed (9 room types: Lobby, Office, Residential, Entertainment, Retail, Restaurant, Gym, Storage, Rooftop Garden)
- **Placement rules:** Left-to-right fill, ground floor must be Lobby, support-from-below constraint, 30-floor max height
- **Game loop:** `requestAnimationFrame` throttled to ~30fps, runs `updateAnimations()` → `renderAll()` each frame
- **Animated elements:** Walking/pausing people (emoji), elevator with door state machine, drifting clouds, flickering skyline windows, AC unit puffs on roof
- **Sound:** Procedural audio (elevator ding/whoosh, door clicks, placement thud, footsteps, tower hum) — initialized on first user click

### Architecture (`js/game.js`)

The file is organized in sections separated by comment dividers:

1. **Layout & Palette constants** — canvas dimensions, grid config, cell sizing
2. **Grid helpers** — `getFloorY()`, `getCellRect()`, `ensureFloorRow()`
3. **Tower rendering** — `drawTowerGrid()`, `drawTowerFrame()`, `drawTowerFloor()`, per-room interior draw functions
4. **Toolbar** — floor type selector UI with click handler
5. **Game loop** — `gameLoop()`, `updateAnimations()`, `renderAll()`
6. **Person entities** — spawn, walk, pause, staircase movement
7. **Elevator** — state machine (CLOSED→OPENING→OPEN→CLOSING), floor targeting
8. **AC unit animation** — puff particles that drift from the roof
9. **Toast notifications** — centered error popups with fade-in/out
10. **Ambient effects** — cloud drift, window light flicker
11. **Sound system** — Web Audio API oscillators/envelopes
12. **Click handler** — toolbar selection, cell placement with validation
13. **Background rendering** — sky gradient, clouds, skyline buildings

### Key State Variables

| Variable | Purpose |
|---|---|
| `towerGrid[floorIdx][cellIdx]` | Room type string or `null` |
| `selectedFloorType` | Currently selected room type from toolbar |
| `people[]` | Array of person entity objects |
| `elevator` | `{ currentFloor, targetFloor, doorState, doorOpen, ... }` |
| `gameRunning` | Boolean — game loop active only when tower has content |
| `window.preview` | Set by test pages to disable game loop/audio |

## Directory Structure

```
├── index.html                    # Main game entry point
├── css/style.css                 # Canvas centering, pixelated rendering
├── js/game.js                    # All game logic (~2000 lines)
├── test/                         # Static preview test pages
│   ├── floor-preview.html        # Color/size showcase for all room types
│   ├── grid-preview.html         # Pre-built sample tower
│   ├── animation-preview.html    # Live animations + sounds inspection
│   └── elevator-preview.html     # Elevator state machine test
├── src/render/                   # Empty (planned future module split)
├── src/ui/                       # Empty (planned future module split)
├── tests/integration/            # Empty (no automated tests yet)
├── openspec/                     # Spec-driven workflow (OpenSpec)
│   ├── config.yaml               # Schema: spec-driven
│   └── changes/                  # Completed change proposals
│       ├── simtower-game-world-background/   # v1: background, sky, skyline
│       ├── refactor-and-floor-poc/           # v2: file structure, floor visuals
│       ├── tower-grid-and-placement/         # v3: grid, click-to-place, toolbar
│       └── tower-animations-and-sound/       # v4: game loop, people, elevator, sound
└── _speckit-archive/             # Archived SpecifyKit artifacts
```

## Building and Running

No build step or dependencies. Open directly in a browser:

```bash
# Option 1: open file directly
open index.html

# Option 2: local HTTP server
python3 -m http.server 8080
# → http://localhost:8080
```

Test pages live in `test/` and can be opened directly.

## Development Conventions

### Code Style
- **Constants:** UPPERCASE with underscores (`CANVAS_W`, `GRID_COLS`)
- **Functions:** camelCase (`drawTowerGrid`, `updatePeople`)
- **State:** lowercase, declared at module level (`towerGrid`, `selectedFloorType`)
- **No classes or modules** — everything is function/procedural style with shared mutable state
- **Comments:** Section headers use `/* ═══════════════════════ */` dividers; inline comments are sparse

### Rendering Order (`renderAll()`)
1. `renderBackground()` — sky, clouds, skyline
2. `drawTowerGrid()` — floors, interiors, elevator, frame
3. `drawACPuffs()` — AC unit heat particles
4. `drawToolbar()` — bottom floor type selector
5. `drawSoundButton()` — toggle 🔊/🔇
6. `drawToast()` — error notification overlay

### Update Order (`updateAnimations()`)
People → Elevator → Clouds → Window lights → AC puffs → Toast → Tower hum

### Testing
- No automated test framework; validation is done via test pages in `test/`
- Test pages set `window.preview = 1` to disable the game loop and audio
- To verify: open test pages in browser, inspect visually

### Placement Validation
The `placeCell(floorIdx, cellIdx)` function enforces:
1. A floor type must be selected
2. Max 30 floors
3. Floor 0 (ground) can only be Lobby; Lobby cannot be placed above floor 0
4. Left-to-right fill (no gaps)
5. Support from below (needs cell directly beneath or be ground floor)
6. Validation failures now show a toast notification

### Sound Safety
All sound calls are guarded with `if (audioCtx)`. Audio is initialized on first canvas click. No sound plays until user interaction (browser autoplay policy compliance).

## OpenSpec Workflow

This project uses the **OpenSpec** spec-driven workflow (`openspec/config.yaml`). Feature work follows:
1. **Proposal** → `proposal.md` (what + why)
2. **Design** → `design.md` (technical approach)
3. **Spec** → `specs/*.md` (detailed requirements)
4. **Tasks** → `tasks.md` (actionable, dependency-ordered checklist)

Completed changes are in `openspec/changes/`. Active changes would go in `openspec/changes/` with a new directory.
