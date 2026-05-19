## 0. Background Rendering (carried forward)

- [x] 0.1 Sky gradient renders above the tower area (from `simtower-game-world-background`)
- [x] 0.2 Pixel clouds render in the sky
- [x] 0.3 City skyline silhouette with lit windows renders on the horizon
- [x] 0.4 Textured ground strip renders at the bottom
- [x] 0.5 `renderBackground()` calls all of the above and is invoked by `renderAll()`

## 1. Grid State and Constants

- [x] 1.1 Add `GRID_COLS = 5` and `MAX_FLOORS = 30` constants
- [x] 1.2 Add `CELL_W` calculated from interior zone width ÷ `GRID_COLS`
- [x] 1.3 Add `towerGrid` initialized with one row: all cells set to `null` (empty lot)
- [x] 1.4 Add `selectedFloorType = null`
- [x] 1.5 Add helper `getCellRect(floorIdx, cellIdx)` returning `{ x, y, w, h }` for a given cell
- [x] 1.6 Add helper `getFloorY(floorIdx)` returning `GROUND_Y - (floorIdx + 1) * FLOOR_H`

## 2. Refactor Interior Rendering to Support Per-Cell Drawing

- [x] 2.1 Update `drawInterior(x, y, w, name, idx)` to render its content **only within the given bounding box** `(x, w)` instead of assuming full floor width
- [x] 2.2 Update `drawTowerFloor()` to accept optional `cells` array — when provided, iterates cells calling `drawInterior()` per cell with correct X offset
- [x] 2.3 `null` cells call `drawUnfinished()` for their cell area
- [x] 2.4 Legacy mode (no `cells` arg) preserved for `test/floor-preview.html` compatibility

## 3. Tower Grid Rendering

- [x] 3.1 Implement `drawTowerGrid()` — iterates `towerGrid` rows and calls `drawTowerFloor()` per row
- [x] 3.2 Draw a subtle highlight (dashed gold outline) on the first `null` cell of each row
- [x] 3.3 Call `drawTowerGrid()` in the main render flow after `renderBackground()`

## 4. Toolbar Rendering

- [x] 4.1 Define `TOOLBAR_H = 40` and `TOOLBAR_Y = CANVAS_H - TOOLBAR_H`
- [x] 4.2 Implement `drawToolbar()` — dark band at bottom with 9 emoji buttons evenly spaced
- [x] 4.3 Each button shows the floor emoji + name label
- [x] 4.4 Highlight the selected button with a distinct background/border
- [x] 4.5 Call `drawToolbar()` after tower rendering

## 5. Click Handling and Selection

- [x] 5.1 Add canvas `click` event listener
- [x] 5.2 On click, detect if Y falls within toolbar zone → update `selectedFloorType` and re-render
- [x] 5.3 On click outside toolbar, use `getCellRect()` to determine which cell was clicked

## 6. Cell Placement Logic

- [x] 6.1 Implement `placeCell(floorIdx, cellIdx)` — validates:
  - `selectedFloorType` is not null
  - Target cell is `null`
  - All cells to the left are non-null (left-to-right fill)
  - Row below exists with at least one non-null cell (or target is row 0)
  - Tower hasn't exceeded `MAX_FLOORS`
- [x] 6.2 On valid placement: set `towerGrid[floorIdx][cellIdx] = selectedFloorType`, flash the cell bright, re-render
- [x] 6.3 On invalid placement: do nothing (no error flash yet)
- [x] 6.4 Auto-create a new row in `towerGrid` when placing the first cell of a new floor

## 7. Main Render Loop

- [x] 7.1 Implement `renderAll()` calling: `renderBackground()` → `drawTowerGrid()` → `drawToolbar()`
- [x] 7.2 Replace the existing auto-render in `game.js` with `renderAll()` on `DOMContentLoaded`
- [x] 7.3 Call `renderAll()` after every state change (selection, placement)

## 8. Integration and Testing

- [x] 8.1 Verify in browser: Lobby renders at ground with all cells, toolbar shows all 9 types
- [x] 8.2 Verify: clicking a toolbar type selects it, clicking the highlighted cell above Lobby places it
- [x] 8.3 Verify: mixed floors work (e.g., Residential cell + Restaurant cell on same row)
- [x] 8.4 Verify: left-to-right constraint prevents skipping cells
- [x] 8.5 Verify: clicking Lobby or occupied cells does nothing
- [x] 8.6 Verify: clicking beyond max height does nothing
- [x] 8.7 Verify: clicking without a type selected does nothing
- [x] 8.8 Create `test/grid-preview.html` with a pre-built sample tower for visual inspection
