## 1. Project Setup

- [x] 1.1 Create `index.html` with basic HTML5 boilerplate, centered canvas element (800×600), and inline script tag
- [x] 1.2 Set page body styling to center the canvas and provide a dark background behind it

## 2. Canvas Infrastructure

- [x] 2.1 Get the 2D rendering context from the canvas element
- [x] 2.2 Disable `imageSmoothingEnabled` on the context for crisp pixel art rendering
- [x] 2.3 Define layout constants (canvas width/height, horizon Y position, ground height, color palette)

## 3. Sky Layer

- [x] 3.1 Fill the upper portion of the canvas (above horizon) with solid mid-blue sky color (`#4A90D9`)

## 4. Cloud Layer

- [ ] 4.1 Implement a `drawCloud(x, y)` helper function that draws a pixel-art cloud shape using `fillRect` calls (hard-edged rectangles, no curves)
- [ ] 4.2 Place at least 5 clouds at varying positions across the sky region with different sizes

## 5. City Skyline Layer

- [ ] 5.1 Define an array of building definitions (x position, width, height, color from teal/cyan palette) with varying heights
- [ ] 5.2 Implement `drawBuilding(x, y, width, height, color)` that draws a rectangular building rising from the horizon
- [ ] 5.3 Add window patterns to each building using small filled rectangles in a grid pattern (lighter color than building body)
- [ ] 5.4 Render all buildings across the full canvas width at the horizon line

## 6. Ground Layer

- [ ] 6.1 Fill the bottom strip of the canvas with solid brown earth color (`#8B6914`)
- [ ] 6.2 Add subtle pixel-level texture variation to the ground (small darker/lighter rects) for dirt appearance

## 7. Integration & Verification

- [ ] 7.1 Create a `renderBackground()` function that calls all layer functions in order (sky → clouds → skyline → ground)
- [ ] 7.2 Invoke `renderBackground()` once on page load (via `DOMContentLoaded` or script at end of body)
- [ ] 7.3 Verify the page loads with no console errors and displays the complete background scene
- [ ] 7.4 Verify no animation loops are running (no `requestAnimationFrame`, no `setInterval`)
