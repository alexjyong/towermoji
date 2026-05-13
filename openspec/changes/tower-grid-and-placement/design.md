## Context

The project renders SimTower-style floors with detailed interiors, elevator shafts, staircases, and shop facades. Each floor is 48px tall and spans the full canvas width. The rendering is split into structural columns (floor label, left stairs, elevator shaft, interior, right stairs) with room-level detail inside each floor type.

What's missing is the game's core interaction: a **cell-based grid** that lets the player build floors piece-by-piece (SimTower style), selecting room types from a toolbar and clicking to place them one cell at a time. Floors can be **mixed-use** — e.g., left half residential, right half retail with a shop facade.

## Goals / Non-Goals

**Goals:**
- Player builds floors **cell by cell** — not entire floors at once
- Each floor row is divided into horizontal cells (segments) that can be independently placed
- Mixed-use floors are supported (e.g., Residential + Shop on same floor)
- Toolbar shows all buildable room types as emoji buttons
- Floors grow from a fixed Lobby ground floor upward
- Real-time canvas rendering updates after each placement

**Non-Goals:**
- No tenant simulation, no elevator movement, no economy — those come later
- No demolish/replace mechanic yet
- No save/load persistence
- No animation loop — render-on-event model

## Decisions

**Grid stored as 2D array: `towerGrid[floorIndex][cellIndex]`**
- Each floor row has `GRID_COLS` cells (e.g., 5 cells across the interior zone)
- Grid starts **empty** — no pre-placed Lobby. Player places the first cell to begin building.
- Unbuilt cells are `null`
- A floor is "complete" when all its cells are non-null (no gaps)
- The ground floor (index 0) can be any type, any width — tiny tower or wide building, player's choice
- You can expand the ground floor later by placing more cells in row 0

**Cell width derived from available interior space**
- Canvas width: 800px. After structural columns (label 26px, stairs 28px, shaft 22px, right stairs 28px) there are ~714px of interior space.
- Interior divided into `GRID_COLS = 5` cells → ~142px per cell.
- Each cell can be assigned a floor type. Adjacent cells of the same type blend into a larger room.
- The rightmost cell(s) can hold **shop facades** (storefront windows + signs).

**Toolbar rendered on canvas**
- 40px-tall band at the very bottom of the canvas (below ground)
- Shows all 9 floor type emojis; clicking selects the type
- Selected type is visually highlighted
- Alternative: DOM-based toolbar. Rejected — keeps everything in canvas.

**Placement rules**
- Cells must be filled **left-to-right** within a floor — you can't skip a cell
- New floors (rows) can only be started when the floor below has at least one cell at that position or to its left
- The **first placement** creates row 0 (ground floor) at cell 0 — no pre-existing Lobby
- Ground floor can be any type, any width — player decides
- Max tower height: 30 floors

**Shop facades are a property of the rightmost cell(s)**
- When a Retail or Restaurant type is placed in the rightmost cell(s), the shop facade renders there
- The same floor can have Residential on the left + Shop on the right

**Render approach: `drawTowerGrid()` iterates `towerGrid` and calls existing `drawTowerFloor()` per row, but the interior is assembled cell-by-cell**
- The structural columns (labels, stairs, elevator) render per row as before
- The interior zone is split into cells; each non-null cell renders its floor type's content at its X offset
- `null` cells render as unfinished/construction

## Risks / Trade-offs

[Cell-by-cell placement is more complex than one-type-per-floor] → This is the correct SimTower model. The extra complexity is necessary for mixed-use floors and matches the reference.

[Cells at 142px wide may feel large for mouse clicking] → Acceptable for desktop. Touch targets are generous.

[Rendering interior cell-by-cell requires refactoring `drawInterior()` ] → The current `drawInterior()` fills the full width. It needs to be adapted to accept an `(x, w)` bounding box per cell. This is a clean refactor since each floor type's interior is already self-contained.
