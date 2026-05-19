## Context

The Towermoji project is a SimTower-inspired vertical building simulation. Currently, the project has no code — only specifications and a constitution defining the game's principles. This change creates the visual foundation: a static canvas rendering the game world background. The graphics style follows terramoji's pixel art aesthetic (16-bit retro, hard edges, no gradients or anti-aliasing).

The constitution specifies DOM-based rendering with CSS Grid, but the user explicitly requested canvas-based pixel art rendering similar to terramoji. This is a deliberate deviation for the visual style requirements.

## Goals / Non-Goals

**Goals:**
- Render a static game world background on a centered, fixed-size canvas
- Display a bright mid-blue sky filling the upper portion
- Show soft white pixel clouds scattered in the sky
- Render a dense teal/cyan city skyline silhouette along the horizon with rectangular buildings of varying heights and implied windows
- Show a flat brown dirt/earth strip at the bottom representing ground
- Establish pixel art rendering infrastructure for future game elements

**Non-Goals:**
- Game mechanics, building placement, tenant spawning
- UI panels, toolbars, or interactive elements
- Animation loops or tick-based updates
- Save/load functionality
- Any user interactivity beyond loading the page

## Decisions

**Canvas over DOM rendering**: The constitution prefers CSS Grid for tower layout, but pixel art graphics with hard edges and 16-bit aesthetics are more naturally expressed via canvas. Canvas also provides a single rendering surface for all future game elements (tenants, elevators, effects).

**Fixed canvas size (800×600)**: Provides a consistent aspect ratio (4:3) suitable for side-on tower views. Large enough to show detail but small enough to maintain the pixel art feel without scaling issues.

**`imageSmoothingEnabled = false`**: Ensures crisp, hard-edged pixels when any scaling occurs. This is essential for the retro pixel art aesthetic.

**Single render pass**: Since everything is static, the background renders once on load. No requestAnimationFrame loop needed yet — this keeps the initial implementation minimal and fast.

**Layered rendering approach**: Sky → Clouds → Skyline → Ground. Each layer renders independently, making it easy to modify individual components later without affecting others.

**Color palette**:
- Sky: `#4A90D9` (bright mid-blue)
- Clouds: `#E8E8E8` (soft white-gray)
- Skyline buildings: `#2A7B6E`, `#1F6B5E`, `#358B7E` (teal/cyan variants for depth)
- Ground: `#8B6914` (brown earth)

## Risks / Trade-offs

**Canvas rendering vs constitution's DOM preference** → This is a conscious trade-off. The pixel art style requires canvas. Future changes may need to revisit whether hybrid rendering (canvas for background, DOM for tower grid) makes sense.

**Fixed size may not suit all viewports** → The canvas is centered but doesn't resize. Future iterations should add responsive scaling if needed.

**No separation of concerns yet** → Everything lives in a single HTML file with inline scripts. This is appropriate for the first pass but will need refactoring as complexity grows.
