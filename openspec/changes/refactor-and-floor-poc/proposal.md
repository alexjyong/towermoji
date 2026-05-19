## Why

The game is currently a single monolithic `index.html` with inline CSS and JS. This needs to be split into separate files for maintainability, and we need a visual PoC of floor types on canvas before committing to any particular look.

## What Changes

- Extract `<style>` block from `index.html` → `css/style.css`
- Extract `<script>` block from `index.html` → `js/game.js`
- Strip `index.html` down to minimal shell (canvas element + script/css links)
- Add a canvas-rendered visual PoC showing all 9 floor types so we can evaluate their look before building the placement mechanic

## Capabilities

### New Capabilities

- `floor-visuals`: Canvas rendering of all 9 SimTower floor types with distinct colors and emoji identifiers — purely visual, no game logic

### Modified Capabilities

*(none — this is a refactor plus visual exploration, not a behavior change)*

## Impact

- `index.html` — stripped to minimal shell
- New files: `css/style.css`, `js/game.js`
- Background rendering code moved from inline script to `js/game.js`
- No behavioral changes visible to the player (until floor PoC is added)
