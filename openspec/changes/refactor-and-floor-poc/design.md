## Context

`index.html` currently contains ~200 lines of inline CSS and JS. The background rendering works but all code lives in one file. No game logic exists yet — just static scene painting.

## Goals / Non-Goals

**Goals:**
- Separate concerns: HTML structure, CSS styling, JS logic into their own files
- Render all 9 floor types on canvas as a visual PoC so we can evaluate colors, sizes, and emoji placement before building the placement mechanic

**Non-Goals:**
- No game logic (no grid system, no click-to-place, no tenant simulation)
- No toolbar UI
- No animation or interactivity for floors — static preview only

## Decisions

**File structure: flat `css/` and `js/` directories**
- Simple enough that we don't need nested module structure
- Single `js/game.js` for now — no splitting into multiple JS files until there's actual game logic

**Floor PoC rendering approach: draw each floor type side-by-side on canvas**
- Not a tower yet, just a showcase row/column of all 9 types
- Each floor shows its color scheme + emoji identifier
- This lets us iterate on the visual design before committing to grid coordinates

**Floor dimensions for canvas (tentative):**
- Canvas: 800×600 (unchanged)
- Floor cell: ~40px wide × 16px tall (20 cells = 800px, fits width perfectly)
- Max tower height: ~30 floors (480px), leaving room for background sky above

## Risks / Trade-offs

[Single JS file becomes unwieldy] → Acceptable for now; split when it exceeds 500 lines. This is a PoC, not production code yet.

[Floor color choices may need iteration] → The PoC exists precisely to solve this. We'll evaluate visually and adjust before building placement logic.
