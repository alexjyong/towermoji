## ADDED Requirements

### Requirement: Toolbar displays all 9 floor types as selectable emoji buttons

The system SHALL render a horizontal toolbar on the canvas containing one button per floor type, each showing the floor's emoji identifier and name label.

#### Scenario: All floor types visible on load
- **WHEN** the page loads
- **THEN** the toolbar displays 9 buttons: 🏛️ Lobby, 🏢 Office, 🏠 Residential, 🎵 Entertainment, 🛍️ Retail, 🍽️ Restaurant, 🏋️ Gym, 📦 Storage, 🌿 Rooftop Garden

#### Scenario: Selected floor type is visually highlighted
- **WHEN** the player clicks a toolbar button
- **THEN** that button renders with a distinct highlight (e.g., brighter background or border) and all other buttons render unhighlighted

### Requirement: Toolbar occupies a fixed zone at the bottom of the canvas

The system SHALL render the toolbar in a fixed horizontal band at the bottom of the canvas, separate from the tower rendering area.

#### Scenario: Toolbar does not overlap tower floors
- **WHEN** the tower is rendered
- **THEN** the toolbar zone does not overlap any floor cells and is positioned below the ground area

### Requirement: Clicking a toolbar button selects that floor type

The system SHALL track a `selectedFloorType` variable that updates when the player clicks a toolbar button.

#### Scenario: Selection changes on click
- **WHEN** the player clicks the Office toolbar button
- **THEN** `selectedFloorType` is set to `'Office'` and the Office button is highlighted

#### Scenario: Re-clicking same button keeps it selected
- **WHEN** the player clicks an already-selected toolbar button
- **THEN** `selectedFloorType` remains unchanged and the button stays highlighted
