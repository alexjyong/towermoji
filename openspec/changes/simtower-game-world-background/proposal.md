## Why

The Towermoji project needs a visual foundation before any game mechanics can be built. This change establishes the game world background/stage — the static canvas that will eventually host the tower, tenants, and all interactive elements. Without this stage, there's nothing to build upon.

## What Changes

- Create a single HTML file with an embedded canvas element as the game rendering surface
- Implement pixel-art background rendering: blue sky with pixel clouds, teal/cyan city skyline silhouette on the horizon, and brown dirt ground strip at the bottom
- Canvas is centered, fixed size, side-on cross-section view (matching SimTower's perspective)
- Everything is static — no animation loop, no interactivity, no game mechanics yet

## Capabilities

### New Capabilities
- `game-world-background`: Canvas-based rendering of the static game world background (sky, clouds, city skyline, ground). Establishes the pixel art visual style and canvas infrastructure for all future rendering.

### Modified Capabilities
(None — no existing specs to modify)

## Impact

- Creates `index.html` as the main entry point
- Introduces canvas-based rendering (diverging from constitution's DOM-based preference, but user explicitly requested vanilla HTML/JS/CSS with pixel art graphics similar to terramoji which uses canvas)
- Establishes the visual foundation that all subsequent features will render on top of
- No dependencies added — pure vanilla JavaScript
