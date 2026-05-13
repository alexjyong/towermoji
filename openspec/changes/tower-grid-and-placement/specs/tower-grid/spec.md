## ADDED Requirements

### Requirement: Tower grid is a 2D array of floor types per cell

The system SHALL maintain a `towerGrid` 2D array where `towerGrid[floorIndex][cellIndex]` holds a floor type name string or `null` (unbuilt).

#### Scenario: Tower starts empty
- **WHEN** the game initializes
- **THEN** `towerGrid` is an empty array `[]`

#### Scenario: Unbuilt cells are null
- **WHEN** a new floor row is created
- **THEN** all cells in that row are `null` until the player places them

### Requirement: Each floor row is divided into a fixed number of cells

The system SHALL divide the interior zone of each floor into `GRID_COLS` cells (e.g., 5), each spanning an equal portion of the available width.

#### Scenario: Cells span the interior zone
- **WHEN** a floor is rendered
- **THEN** the interior zone (between the elevator shaft and right staircase) is divided into `GRID_COLS` equal-width cells

### Requirement: Tower height is capped at 30 floors

The system SHALL prevent creating more than 30 floor rows total.

#### Scenario: Placement blocked at max height
- **WHEN** `towerGrid` has 30 rows and the player attempts to place a cell in a 31st row
- **THEN** the cell is not placed and `towerGrid` is unchanged

### Requirement: Empty cells beyond placed cells are not rendered

The system SHALL only render cells that have been placed. Cells beyond the rightmost placed cell in a row are not drawn — they show as background (sky/ground).

#### Scenario: Unplaced cells show as background
- **WHEN** row 0 has only cell 0 placed and cells 1–4 are `null`
- **THEN** only cell 0 renders; cells 1–4 show the background behind them

#### Scenario: Built cell renders its floor type
- **WHEN** a cell in `towerGrid` is `'Residential'`
- **THEN** that cell's area renders the Residential interior (walls, furniture, people)

### Requirement: Structural elements render only for rows with content

The system SHALL render the floor number label, left staircase, elevator shaft, and floor beams only for rows that have at least one placed cell. The right staircase renders only when all cells in a row are placed.

#### Scenario: Row with one cell shows partial structure
- **WHEN** a floor row has only cell 0 placed
- **THEN** the label, left staircase, and elevator shaft render; the right staircase does not

#### Scenario: Full row shows all structure
- **WHEN** a floor row has all `GRID_COLS` cells placed
- **THEN** all structural elements render including the right staircase
