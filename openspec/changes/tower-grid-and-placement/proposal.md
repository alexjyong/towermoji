## Why

The project renders static backgrounds and detailed SimTower-style floors but has no interactive building mechanic. The player cannot construct the tower, choose room types, or create mixed-use floors. Without a cell-based grid and toolbar, no tenants, elevators, or economy can exist.

SimTower (and the reference image) allows floors to be **mixed-use** — e.g., residential apartments on the left with a ramen shop facade on the right. The previous spec assumed one type per floor, which doesn't match the game model.

## What Changes

- Introduce a **2D cell grid** (`towerGrid[floor][cell]`) that tracks room types per cell, not per floor
- Each floor row is divided into ~5 horizontal cells across the interior zone
- Add a floor-type **toolbar** (emoji buttons for all 9 types) rendered on canvas
- **Click-to-place** mechanic: select a type from the toolbar, click an empty cell to build it
- Cells fill **left-to-right** within a floor; new floors require the one below to exist
- Floors can be **mixed-use** — different cell types on the same row
- Shop facades render on the rightmost cells when Retail or Restaurant types are placed there
- Tower starts with a fixed Lobby ground floor (all cells pre-filled)
- Max tower height: 30 floors

## Capabilities

### New Capabilities

- `tower-grid`: 2D cell-based grid system with per-cell placement, mixed-use floors, left-to-right fill constraint, and Lobby anchoring.
- `toolbar-ui`: Emoji-based floor type selector toolbar rendered on canvas at the bottom.
- `cell-placement`: Click-to-place mechanic enforcing placement rules (no gaps, sequential fill, max height cap). Triggers a brief placement flash animation.

### Modified Capabilities

- Existing `drawInterior()` and floor-type renderers must accept `(x, w)` bounding boxes to render within individual cells rather than the full floor width.

## Impact

- `js/game.js` — adds grid state, toolbar rendering, cell-by-cell interior rendering, click handling, placement logic
- `index.html` — no structural changes (canvas element already present)
- `test/floor-preview.html` — unchanged
- `test/elevator-preview.html` — unchanged
- No new dependencies — pure vanilla JS on canvas
