## ADDED Requirements

### Requirement: Ground floor must be Lobby

The system SHALL only allow placing `'Lobby'` cells in row 0 (ground floor). Any other type selected when clicking a ground-floor cell is rejected.

#### Scenario: Cannot place non-Lobby on ground floor
- **WHEN** the player has selected `'Office'` and clicks an empty cell in row 0
- **THEN** no cell is placed

#### Scenario: Can place Lobby on ground floor
- **WHEN** the player has selected `'Lobby'` and clicks an empty cell in row 0
- **THEN** the cell is set to `'Lobby'`

### Requirement: The first placement creates the ground floor

The system SHALL allow placing the very first cell even when `towerGrid` is empty, creating row 0 at cell 0.

#### Scenario: First cell creates ground floor
- **WHEN** `towerGrid` is empty and the player has selected `'Lobby'` and clicks to place
- **THEN** row 0 is created with cell 0 set to `'Lobby'`

#### Scenario: First cell rejected if not Lobby
- **WHEN** `towerGrid` is empty and the player has selected `'Office'` and clicks to place
- **THEN** no cell is placed — ground floor must be Lobby

### Requirement: Clicking an empty cell places the selected floor type

The system SHALL place a cell of the selected type when the player clicks a `null` cell in `towerGrid`.

#### Scenario: Placing first cell above Lobby
- **WHEN** the tower has only the Lobby row and the player has selected 'Office' and clicks the first empty cell of the next row
- **THEN** that cell is set to `'Office'` in `towerGrid` and renders accordingly

#### Scenario: Placing a different type in the next cell creates a mixed-use floor
- **WHEN** a floor row has its first cell as 'Residential' and the player selects 'Restaurant' and clicks the next empty cell in the same row
- **THEN** that cell is set to `'Restaurant'` and the floor shows Residential on the left and Restaurant on the right

### Requirement: Cells fill left-to-right within a floor row

The system SHALL NOT allow placing a cell if the cell immediately to its left in the same row is `null`.

#### Scenario: Cannot skip a cell
- **WHEN** row 1 has cell 0 filled and cells 1–4 are `null`, and the player clicks cell 2
- **THEN** no cell is placed and `towerGrid` is unchanged

#### Scenario: First empty cell is the only placeable target in a row
- **WHEN** row 1 has cells 0–1 filled and cells 2–4 are `null`
- **THEN** only cell 2 accepts a placement click; cells 3 and 4 are ignored

### Requirement: New floor rows require the row below to exist

The system SHALL NOT allow placing a cell in a new row unless the row directly below has at least one non-null cell at the same column index or to its left.

#### Scenario: Cannot build floating floors
- **WHEN** row 0 has only cell 0 filled and the player attempts to click a cell in row 1 at column 2
- **THEN** no cell is placed — there's no support below that position

#### Scenario: New row opens when previous row has support
- **WHEN** row 0 has cell 0 filled and the player clicks cell 0 of row 1
- **THEN** row 1 is created and cell 0 is filled


### Requirement: Cell placement triggers a brief visual animation

The system SHALL play a short placement animation when a cell is successfully placed.

#### Scenario: Placed cell flashes briefly
- **WHEN** a new cell is placed in the grid
- **THEN** the cell renders with a bright accent flash for one frame before re-rendering normally

### Requirement: No cell is placed if no type is selected

The system SHALL ignore placement clicks when the player has not selected a floor type from the toolbar.

#### Scenario: Click without selection does nothing
- **WHEN** no floor type is selected and the player clicks an empty cell
- **THEN** no cell is placed and `towerGrid` is unchanged

### Requirement: Shop facades render on rightmost cells of Restaurant and Retail types

When a Restaurant or Retail type is placed in the **rightmost cell(s)** of a floor row, the shop facade (storefront windows, awning, sign) renders within that cell's area.

#### Scenario: Restaurant in rightmost cell shows shop facade
- **WHEN** a Restaurant type is placed in the last cell of a floor row
- **THEN** the right side of that cell renders a shop facade with windows and a sign
