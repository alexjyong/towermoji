## 1. File Structure Setup

- [x] 1.1 Create `css/style.css` and move inline `<style>` block from `index.html` into it
- [x] 1.2 Create `js/game.js` and move inline `<script>` block from `index.html` into it
- [x] 1.3 Strip `index.html` to minimal shell — just `<canvas>`, CSS link, JS script tag

## 2. Refactor Verification

- [x] 2.1 Open `index.html` in browser and verify background renders identically (sky, clouds, skyline, ground)
- [x] 2.2 Confirm no inline styles or scripts remain in `index.html`

## 3. Floor Type Definitions

- [x] 3.1 Define a `FLOOR_TYPES` constant array with all 9 types: name, emoji, base color, and accent color
- [x] 3.2 Choose canvas-appropriate dimensions: cell width (40px to fit 20 across 800px), floor height (~16px)

## 4. Floor Rendering Function

- [x] 4.1 Create `drawFloor(x, y, type)` function that renders a colored rectangle with the floor's emoji centered
- [x] 4.2 Add subtle visual detail per floor type (e.g., window lines for office, door marks for lobby) — keep it simple, this is a PoC

## 5. Floor Showcase Test Page

- [x] 5.1 Create `test/floor-preview.html` — a standalone test page that loads the same CSS/JS and renders all 9 floor types
- [x] 5.2 Layout floors in a grid (3×3 or stacked column) with type labels so they're easy to compare visually
- [x] 5.3 Verify `index.html` is untouched by the PoC — showcase lives only on the test page
