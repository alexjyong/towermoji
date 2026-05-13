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

### Requirement: Empty cells are visually distinct from built cells

The system SHALL render `null` cells with an unfinished/construction appearance (gray, rebar) and render built cells with their assigned floor type's interior detail.

#### Scenario: Null cell renders as unfinished
- **WHEN** a cell in `towerGrid` is `null`
- **THEN** that cell's area renders as unfinished construction

#### Scenario: Built cell renders its floor type
- **WHEN** a cell in `towerGrid` is `'Residential'`
- **THEN** that cell's area renders the Residential interior (walls, furniture, people)

### Requirement: Structural columns render per row regardless of cell state

The system SHALL render the floor number label, left staircase, elevator shaft, and right staircase for every row in `towerGrid`, regardless of whether the interior cells are built.

#### Scenario: Row renders structural elements even if all cells are null
- **WHEN** a floor row exists but all its cells are `null`
- **THEN** the label, staircases, and elevator shaft still render for that row
