## ADDED Requirements

### Requirement: Canvas renders all 9 floor types as a visual preview

The system SHALL render all 9 SimTower floor types on the canvas in a showcase layout so the player can evaluate their visual design.

#### Scenario: All floor types visible on load
- **WHEN** the page loads after refactor
- **THEN** all 9 floor types (Lobby, Office, Residential, Entertainment, Retail, Restaurant, Gym, Storage, Rooftop Garden) are rendered on canvas as colored rectangles with emoji identifiers

### Requirement: Each floor type has distinct visual identity

Each floor type SHALL be rendered with a unique base color and its associated emoji marker.

#### Scenario: Floor types are visually distinguishable
- **WHEN** multiple floor types are displayed side by side
- **THEN** each floor is identifiable by its color scheme and emoji (🏛️ Lobby, 🏢 Office, 🏠 Residential, 🎢 Entertainment, 🛒 Retail, 🍽️ Restaurant, 🏋️ Gym, 📦 Storage, 🌿 Rooftop Garden)

### Requirement: Floor dimensions match intended grid cell size

Each floor SHALL render at the target grid cell dimensions used for tower placement.

#### Scenario: Floor cells fit canvas width
- **WHEN** 20 floor cells are rendered side by side horizontally
- **THEN** they fill the 800px canvas width exactly (40px per cell)

### Requirement: Files are properly separated into HTML, CSS, and JS

The game SHALL load from separate `index.html`, `css/style.css`, and `js/game.js` files with no inline styles or scripts.

#### Scenario: Page loads correctly after refactor
- **WHEN** the browser opens `index.html`
- **THEN** the canvas renders identically to before (background + floor PoC), loaded from external CSS and JS files
