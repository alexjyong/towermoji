const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

/* ── Layout & Palette ─────────────────────────────── */

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GROUND_HEIGHT = 100;
const GROUND_Y = CANVAS_HEIGHT - GROUND_HEIGHT;
const HORIZON_Y = GROUND_Y;

/* Grid cell dimensions for tower floors */
const FLOOR_CELL_W = 40;   // 20 cells × 40px = 800px canvas width
const FLOOR_H      = 24;   /* side-view interior — room for walls + props */

const COLORS = {
  sky: '#4A90D9',
  cloud: '#E8E8E8',
  ground: '#8B6914',
  groundDark: '#7A5C12',
  groundLight: '#9C7618',
  buildings: ['#2A7B6E', '#1F6B5E', '#358B7E']
};

/* ── Floor Types ──────────────────────────────────── */

const FLOOR_TYPES = [
  { name: 'Lobby',          emoji: '🏛️', base: '#8B6F47', accent: '#A0845C' },   // brown wood paneling
  { name: 'Office',         emoji: '🏢', base: '#D4CEC2', accent: '#E8E3DB' },    // gray-beige walls
  { name: 'Residential',    emoji: '🏠', base: '#F0D9A0', accent: '#FFF5CC' },   // warm yellow lighting
  { name: 'Entertainment',  emoji: '🎢', base: '#8B3FC4', accent: '#AB5DDE' },
  { name: 'Retail',         emoji: '🛒', base: '#6AAF7E', accent: '#8FCC9C' },
  { name: 'Restaurant',     emoji: '🍽️', base: '#CD4F39', accent: '#E07050' },
  { name: 'Gym',            emoji: '🏋️', base: '#E88A2D', accent: '#F0A85C' },
  { name: 'Storage',        emoji: '📦', base: '#8A8A8A', accent: '#A6A6A6' },
  { name: 'Rooftop Garden', emoji: '🌿', base: '#4E9A52', accent: '#73C278' }
];

/* ── Background Layers ────────────────────────────── */

function drawSky() {
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(0, 0, CANVAS_WIDTH, HORIZON_Y);
}

function drawCloud(x, y) {
  ctx.fillStyle = COLORS.cloud;
  const rows = [
    { offset: 0, w: 64 },
    { offset: -16, w: 48 },
    { offset: 16, w: 48 },
    { offset: -32, w: 32 },
    { offset: 32, w: 32 }
  ];
  rows.forEach(row => {
    ctx.fillRect(x + row.offset, y, row.w, 12);
  });
}

const CLOUDS = [
  { x: 80, y: 60 },
  { x: 300, y: 100 },
  { x: 520, y: 50 },
  { x: 680, y: 130 },
  { x: 180, y: 160 }
];

function drawClouds() {
  CLOUDS.forEach(c => drawCloud(c.x, c.y));
}

const BUILDINGS = [
  { w: 40, h: 80, ci: 0 },
  { w: 30, h: 120, ci: 1 },
  { w: 50, h: 60, ci: 2 },
  { w: 35, h: 140, ci: 0 },
  { w: 45, h: 90, ci: 1 },
  { w: 25, h: 110, ci: 2 },
  { w: 55, h: 70, ci: 0 },
  { w: 30, h: 130, ci: 1 },
  { w: 40, h: 95, ci: 2 },
  { w: 35, h: 150, ci: 0 },
  { w: 50, h: 75, ci: 1 },
  { w: 28, h: 105, ci: 2 },
  { w: 42, h: 85, ci: 0 },
  { w: 36, h: 125, ci: 1 },
  { w: 48, h: 65, ci: 2 },
  { w: 32, h: 115, ci: 0 },
  { w: 44, h: 88, ci: 1 },
  { w: 38, h: 135, ci: 2 }
];

function drawBuilding(x, baseY, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, baseY - h, w, h);

  const winW = 6, winH = 8, gapX = 10, gapY = 12;
  const marginX = 6, marginY = 8;
  ctx.fillStyle = '#A8DADC';
  for (let wy = baseY - h + marginY; wy < baseY - marginY; wy += winH + gapY) {
    for (let wx = x + marginX; wx < x + w - marginX; wx += winW + gapX) {
      ctx.fillRect(wx, wy, winW, winH);
    }
  }
}

function drawSkyline() {
  let cx = 0;
  BUILDINGS.forEach(b => {
    const color = COLORS.buildings[b.ci];
    drawBuilding(cx, HORIZON_Y, b.w, b.h, color);
    cx += b.w;
  });
}

function drawGround() {
  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, GROUND_HEIGHT);

  const tileSize = 8;
  for (let ty = GROUND_Y; ty < CANVAS_HEIGHT; ty += tileSize) {
    for (let tx = 0; tx < CANVAS_WIDTH; tx += tileSize) {
      if ((tx + ty) % 16 === 0) {
        ctx.fillStyle = COLORS.groundDark;
      } else if ((tx * ty) % 23 === 0) {
        ctx.fillStyle = COLORS.groundLight;
      } else {
        continue;
      }
      ctx.fillRect(tx, ty, tileSize, tileSize);
    }
  }
}

/* ── Floor Rendering (side-view cross-section PoC) ─── */

const WALL_W = 8;   // left/right wall thickness in pixels

function drawFloor(x, y, name) {
  const t = FLOOR_TYPES.find(f => f.name === name);
  if (!t) return;

  const w = CANVAS_WIDTH;
  const ix = x + WALL_W;           // interior start (after left wall)
  const iw = w - WALL_W * 2;       // interior width (~784px)

  /* ── Base fill (interior color) ─────────────── */
  ctx.fillStyle = t.base;
  ctx.fillRect(x, y, w, FLOOR_H);

  /* ── Structural beams (ceiling / floor lines) ── */
  ctx.fillStyle = '#2D2D2D';
  ctx.fillRect(x, y, w, 1);                    // ceiling line
  ctx.fillRect(x, y + FLOOR_H - 1, w, 1);      // floor line

  /* ── Left wall with windows ─────────────────── */
  drawWallWindows(x, y, false, name);

  /* ── Right wall with windows ────────────────── */
  drawWallWindows(x + w - WALL_W, y, true, name);

  /* ── Interior pixel-art details ──────────────── */
  drawFloorInterior(ix, y, iw, FLOOR_H, name);

  /* ── Type emoji identifier (bottom-right corner) */
  ctx.font = `${Math.floor(FLOOR_H * 0.5)}px serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(t.emoji, x + w - WALL_W - 2, y + FLOOR_H / 2);
}

/** Draw a left or right wall strip with window panes */
function drawWallWindows(wx, wy, isRight, name) {
  // Wall background (darker than interior)
  ctx.fillStyle = shadeColor('#3D3D3D', -10);
  ctx.fillRect(wx, wy, WALL_W, FLOOR_H);

  // Window glass panes (2 per wall, stacked vertically in the space)
  const winH = Math.floor((FLOOR_H - 6) / 2);
  const winGap = 3;
  ctx.fillStyle = '#C8E0F4';  // window glass
  for (let row = 0; row < 2; row++) {
    const wy2 = wy + 1 + row * (winH + winGap);
    if (isRight) {
      ctx.fillRect(wx, wy2, WALL_W - 2, winH);
    } else {
      ctx.fillRect(wx + 2, wy2, WALL_W - 2, winH);
    }
  }

  // Special: Lobby gets entrance doors instead of full windows on left wall
  if (name === 'Lobby' && !isRight) {
    ctx.fillStyle = '#8B6914';  // door wood frame
    ctx.fillRect(wx + 1, wy + 2, WALL_W - 2, FLOOR_H - 3);
    ctx.fillStyle = '#D4AF37';  // glass panels in doors
    for (let row = 0; row < 2; row++) {
      ctx.fillRect(wx + 2, wy + 3 + row * ((FLOOR_H - 4) / 2), WALL_W - 5, Math.floor((FLOOR_H - 6) / 2));
    }
  }

  // Special: Rooftop — no windows, open sky
  if (name === 'Rooftop Garden') {
    ctx.fillStyle = COLORS.sky;
    ctx.fillRect(wx + 1, wy + 1, WALL_W - 3, FLOOR_H - 2);
    // Small railing posts
    ctx.fillStyle = '#6B8E5A';
    for (let rp = 0; rp < 3; rp++) {
      ctx.fillRect(isRight ? wx : wx + 2, wy + 1 + rp * ((FLOOR_H - 2) / 2), 2, 2);
    }
  }
}

/** Draw interior pixel-art details for each floor type */
function drawFloorInterior(ix, iy, iw, ih, name) {
  const cy = iy + Math.floor(ih / 2); // center Y of the floor

  switch (name) {

    case 'Lobby': {
      // Brown wood paneling — vertical grain lines across the floor
      ctx.fillStyle = shadeColor('#8B6F47', 8);
      for (let px = ix + 12; px < ix + iw; px += 20) {
        ctx.fillRect(px, iy + 2, 1, ih - 4);     // subtle grain
      }
      // Polished floor strip at bottom (lighter band)
      ctx.fillStyle = shadeColor('#8B6F47', -12);
      ctx.fillRect(ix, iy + ih - 5, iw, 4);

      // Sparse rows of simple rectangular benches/couches
      const benchH = 5;
      for (let bx = ix + 60; bx < ix + iw - 80; bx += 120) {
        // Bench seat (dark brown rect)
        ctx.fillStyle = '#4A3728';
        ctx.fillRect(bx, cy - benchH / 2, 50, benchH);
        // Bench backrest (slightly taller)
        ctx.fillStyle = '#5C4634';
        ctx.fillRect(bx, iy + 2, 50, 3);
        // Simple legs
        ctx.fillStyle = '#3A2818';
        const legTop = cy + benchH / 2;
        const legBottom = iy + ih - 2;
        ctx.fillRect(bx + 2, legTop, 2, legBottom - legTop);
        ctx.fillRect(bx + 46, legTop, 2, legBottom - legTop);
      }

      break;
    }

    case 'Office': {
      // Shelving unit along the back wall (top of interior)
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(ix + iw - 100, iy + 1, 96, 4);         // shelf surface
      // Books on shelves (small colored rects)
      const bookColors = ['#C0392B', '#2980B9', '#27AE60', '#F39C12', '#8E44AD'];
      for (let bk = ix + iw - 96; bk < ix + iw - 6; bk += 6) {
        ctx.fillStyle = bookColors[Math.floor((bk - ix) / 6) % bookColors.length];
        ctx.fillRect(bk, iy + 1, 4, 3);
      }

      // Clustered desk rows across the open floor plan
      for (let dx = ix + 20; dx < ix + iw - 120; dx += 56) {
        // Desk surface (light wood)
        ctx.fillStyle = '#C9B896';
        ctx.fillRect(dx, cy - 1, 30, 4);
        // Monitor on desk (dark screen with light glow)
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(dx + 8, iy + 2, 14, 5);              // monitor body
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(dx + 9, iy + 3, 12, 3);              // screen glow
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(dx + 14, cy - 1, 2, 2);              // monitor stand
        // Office chair (small dark circle ≈ rect) below desk
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(dx + 10, cy + 3, 8, 4);
      }

      break;
    }

    case 'Residential': {
      // Divide into ~9-10 condo units (each ~76px wide)
      const unitW = 76;
      let ux = ix;
      while (ux + unitW < ix + iw - 10) {
        // Unit divider wall (thin vertical line, full height)
        ctx.fillStyle = shadeColor('#F0D9A0', -25);
        ctx.fillRect(ux, iy + 1, 2, ih - 2);

        // Doorway in the divider (small gap at bottom with door emoji)
        if (ux > ix) {
          ctx.font = '6px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🚪', ux + 1, cy + 3);
        }

        // Floor lamp on side table (left corner of unit)
        ctx.fillStyle = '#D4A050';                        // table top
        ctx.fillRect(ux + 4, cy - 2, 6, 2);
        ctx.fillStyle = '#8B7355';                        // lamp pole
        const poleTop = iy + 1;
        const poleBottom = cy - 2;
        ctx.fillRect(ux + 6, poleTop, 2, poleBottom - poleTop);
        ctx.fillStyle = '#FFF5CC';                        // warm lamp shade glow
        ctx.fillRect(ux + 4, poleTop, 5, 3);

        // Small sofa/armchair (center of unit)
        ctx.fillStyle = '#6B8E9B';
        ctx.fillRect(ux + 20, cy - 2, 16, 5);            // seat
        ctx.fillStyle = '#7BA3B0';
        ctx.fillRect(ux + 20, iy + 2, 16, 3);            // backrest

        // Compact dining table (right side)
        ctx.fillStyle = '#C9B896';
        ctx.fillRect(ux + 46, cy - 1, 10, 3);            // tabletop
        const tLegTop = cy + 2;
        const tLegBot = iy + ih - 2;
        ctx.fillRect(ux + 50, tLegTop, 2, tLegBot - tLegTop);// table leg

        // Simple wall decoration (small rect on back wall)
        ctx.fillStyle = shadeColor('#F0D9A0', -10);
        ctx.fillRect(ux + 30, iy + 2, 8, 4);

        ux += unitW;
      }

      break;
    }

    case 'Entertainment': {
      // Checkerboard dance floor pattern
      const cell = 8;
      for (let ey = iy + 1; ey < iy + ih - 2; ey += cell) {
        for (let ex = ix; ex < ix + iw; ex += cell) {
          if (((ex - ix) / cell + (ey - iy) / cell) % 2 === 0) {
            ctx.fillStyle = shadeColor('#8B3FC4', 15);
            ctx.fillRect(ex, ey, cell, cell);
          }
        }
      }
      // Neon glow dots along ceiling line
      const neonColors = ['#FF1493', '#00FFFF', '#FF69B4', '#7FFF00'];
      for (let nx = ix + 8; nx < ix + iw - 8; nx += 24) {
        ctx.fillStyle = neonColors[Math.floor((nx - ix) / 24) % neonColors.length];
        ctx.fillRect(nx, iy + 1, 6, 3);
      }
      // Party emoji scattered
      ctx.font = '8px serif';
      ctx.textAlign = 'center';
      for (let px = ix + 50; px < ix + iw - 20; px += 90) {
        ctx.fillText('🎉', px, cy + 3);
      }
      break;
    }

    case 'Retail': {
      // Shelving units — tall rects with colored "items" on shelves
      for (let sx = ix + 16; sx < ix + iw - 24; sx += 56) {
        ctx.fillStyle = '#8B7355';                // shelf wood frame
        ctx.fillRect(sx, iy + 1, 32, ih - 2);
        ctx.fillStyle = '#C9A86B';                 // shelf surface
        for (let sh = 0; sh < 3; sh++) {
          const sy = iy + 2 + sh * ((ih - 4) / 3);
          ctx.fillRect(sx + 1, sy, 30, 2);
        }
        // Colored "products" on shelves
        const products = ['#E74C3C', '#3498DB', '#F39C12'];
        for (let sh = 0; sh < 3; sh++) {
          ctx.fillStyle = products[sh];
          const sy = iy + 2 + sh * ((ih - 4) / 3);
          for (let item = 0; item < 4; item++) {
            ctx.fillRect(sx + 3 + item * 7, sy + 1, 5, (ih - 6) / 3 - 2);
          }
        }
      }
      break;
    }

    case 'Restaurant': {
      // Tables with chairs — small circles around a square
      for (let tx = ix + 40; tx < ix + iw - 30; tx += 70) {
        ctx.fillStyle = '#8B0000';                 // table top
        ctx.fillRect(tx, cy - 4, 12, 8);
        // Chair squares around table
        ctx.fillStyle = '#CD5C5C';
        ctx.fillRect(tx + 2, iy + 1, 6, 3);       // chair above
        ctx.fillRect(tx + 2, iy + ih - 4, 6, 3);  // chair below
      }
      // Checkered floor pattern (red/white at bottom)
      const tCell = 6;
      for (let fx = ix; fx < ix + iw; fx += tCell) {
        if ((Math.floor((fx - ix) / tCell)) % 2 === 0) {
          ctx.fillStyle = shadeColor('#CD4F39', 15);
          ctx.fillRect(fx, iy + ih - 3, tCell, 2);
        }
      }
      // Chef emoji near one end
      ctx.font = '8px serif';
      ctx.textAlign = 'left';
      ctx.fillText('👨‍🍳', ix + 10, cy + 4);
      break;
    }

    case 'Gym': {
      // Treadmill shapes — horizontal rects with vertical posts
      for (let gx = ix + 24; gx < ix + iw - 30; gx += 64) {
        ctx.fillStyle = '#555';                     // treadmill base
        ctx.fillRect(gx, cy - 1, 28, 4);
        ctx.fillStyle = '#777';                     // console post
        ctx.fillRect(gx + 24, iy + 2, 3, ih - 4);
      }
      // Weight icon scattered
      ctx.font = '7px serif';
      ctx.textAlign = 'center';
      for (let wx = ix + 80; wx < ix + iw - 20; wx += 96) {
        ctx.fillText('🏋️', wx, cy + 4);
      }
      break;
    }

    case 'Storage': {
      // Stacked box rectangles of varying sizes
      const boxColors = ['#8B7355', '#A0926C', '#6B5B3E'];
      let bx = ix + 12;
      while (bx < ix + iw - 20) {
        const bw = 14 + Math.floor(((bx * 7) % 10));
        ctx.fillStyle = boxColors[Math.floor((bx - ix) / 30) % boxColors.length];
        // Bottom stack
        ctx.fillRect(bx, iy + ih - 10, bw, 9);
        // Top stack (offset slightly)
        ctx.fillRect(bx + 2, iy + ih - 18, bw - 4, 7);
        bx += bw + 4;
      }
      // Box emoji near left edge
      ctx.font = '8px serif';
      ctx.textAlign = 'left';
      ctx.fillText('📦', ix + 16, cy);
      break;
    }

    case 'Rooftop Garden': {
      // Grass texture at bottom half of floor
      ctx.fillStyle = shadeColor('#4E9A52', -10);
      for (let gx = ix; gx < ix + iw; gx += 6) {
        const gh = 3 + ((gx * 3) % 4);             // varied grass blade height
        ctx.fillRect(gx, iy + ih - gh, 2, gh);
      }
      // Flower emoji scattered in the "grass"
      ctx.font = '7px serif';
      ctx.textAlign = 'center';
      const flowers = ['🌸', '🌼', '🌻'];
      for (let fx = ix + 30; fx < ix + iw - 20; fx += 60) {
        ctx.fillText(flowers[Math.floor((fx - ix) / 60) % flowers.length], fx, cy + 5);
      }
      // Small tree emoji at edges
      ctx.font = '10px serif';
      ctx.textAlign = 'left';
      ctx.fillText('🌳', ix + 20, iy + 8);
      ctx.textAlign = 'right';
      ctx.fillText('🌳', ix + iw - 16, iy + 8);
      break;
    }
  }
}

/** Utility: lighten or darken a hex color by N percent */
function shadeColor(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));
  return `rgb(${r},${g},${b})`;
}

/* ── Main Render (index.html only) ─────────────────── */

function renderBackground() {
  drawSky();
  drawClouds();
  drawSkyline();
  drawGround();
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.renderMode === 'undefined') {
    renderBackground();
  }
});
