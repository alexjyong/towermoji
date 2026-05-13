const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

/* ═══════════════════════════════════════════════════
   LAYOUT & PALETTE — SimTower/Kairosoft pixel art style
   ═══════════════════════════════════════════════════ */

const CANVAS_W    = 800;
const CANVAS_H    = 600;
const GROUND_Y    = CANVAS_H - 80;
const FLOOR_H     = 48;
const STAIR_W     = 28;
const SHAFT_W     = 22;
const LABEL_W     = 26;
const SHAFT_X     = 62;

// Grid constants
const GRID_COLS   = 5;
const MAX_FLOORS  = 30;

// Interior zone: between elevator shaft and right staircase
const INTERIOR_X  = SHAFT_X + SHAFT_W + 2;
const INTERIOR_W  = CANVAS_W - INTERIOR_X - STAIR_W - 2;
const CELL_W      = Math.floor(INTERIOR_W / GRID_COLS);

// Toolbar
const TOOLBAR_H   = 56;
const TOOLBAR_Y   = CANVAS_H - TOOLBAR_H;

// Grid state
let towerGrid = [];       // towerGrid[floorIdx][cellIdx] = type name or null
let selectedFloorType = null;

function initGrid() {
  // Start with nothing — empty lot. Player places the first cell to begin.
  towerGrid = [];
}

initGrid();

/* ═══════════════════════════════════════════════════
   GRID HELPERS
   ═══════════════════════════════════════════════════ */

function getFloorY(floorIdx) {
  return GROUND_Y - (floorIdx + 1) * FLOOR_H;
}

function getCellRect(floorIdx, cellIdx) {
  return {
    x: INTERIOR_X + cellIdx * CELL_W,
    y: getFloorY(floorIdx),
    w: CELL_W,
    h: FLOOR_H,
  };
}

function ensureFloorRow(floorIdx) {
  while (towerGrid.length <= floorIdx) {
    towerGrid.push(new Array(GRID_COLS).fill(null));
  }
}

const COLORS = {
  sky:        '#7EC8E3',
  cloud:      '#F0F4F8',
  ground:     '#A0805A',
  frame:      '#2D2D2D',
  unfinished: '#7A7A82',
  window:     '#B8D4E8',
};

const FLOOR_TYPES = [
  { name:'Lobby',          emoji:'🏛️', wall:'#E8D5B7', flr:'#C4A87A' },
  { name:'Office',         emoji:'🏢', wall:'#D8D4CC', flr:'#B8B4AC' },
  { name:'Residential',    emoji:'🏠', wall:'#F5E6C8', flr:'#D8C4A0' },
  { name:'Entertainment',  emoji:'🎵', wall:'#2A1A3A', flr:'#1A0A2A' },
  { name:'Retail',         emoji:'🛍️', wall:'#E0D8CC', flr:'#C8C0B4' },
  { name:'Restaurant',     emoji:'🍽️', wall:'#E8C8A0', flr:'#C8A878' },
  { name:'Gym',            emoji:'🏋️', wall:'#D8C8B0', flr:'#B8A890' },
  { name:'Storage',        emoji:'📦', wall:'#B0A898', flr:'#908878' },
  { name:'Rooftop Garden', emoji:'🌿', wall:'#5AA05A', flr:'#4A8A4A' },
];

const SHOPS = [
  { name:'Ice Cream', sign:'ICE CREAM', col:'#FF69B4', glow:'#FFB4D8', glass:'#FFE4F0', curt:'#FF69B4' },
  { name:'Burger',    sign:'BURGER',    col:'#FFD700', glow:'#FFF4A0', glass:'#FFF0C0', curt:'#FF4500' },
  { name:'Ramen',     sign:'ラーメン',   col:'#FFFFFF', glow:'#FFE0E0', glass:'#FFCCCC', curt:'#CD3333' },
  { name:'Soba',      sign:'そば',      col:'#FF8C00', glow:'#FFB060', glass:'#FFE0C0', curt:'#CD4F00' },
  { name:'Cafe',      sign:'CAFE',      col:'#FFD700', glow:'#FFE8A0', glass:'#FFF8D0', curt:'#8B6914' },
  { name:'Clothing',  sign:'SHOP',      col:'#87CEEB', glow:'#B0E0F0', glass:'#E0F0FF', curt:'#4682B4' },
  { name:'Bookstore', sign:'BOOK',      col:'#90EE90', glow:'#B8FFB8', glass:'#E0FFE0', curt:'#228B22' },
];

const PEOPLE_EMOJI = ['🚶','🚶‍♀️','🚶‍♂️','🚶','🚶‍♀️','🚶‍♂️','🧍','🧍‍♀️','🧍‍♂️','🚶‍♀️','🚶‍♂️','🧍','🚶'];

/* ═══════════════════════════════════════════════════
   BACKGROUND
   ═══════════════════════════════════════════════════ */

function drawSky() {
  for (let y = 0; y < GROUND_Y; y++) {
    const t = y / GROUND_Y;
    ctx.fillStyle = `rgb(${Math.round(126+42*t)},${Math.round(200+16*t)},${Math.round(227+13*t)})`;
    ctx.fillRect(0, y, CANVAS_W, 1);
  }
}

function drawCloud(cx, cy) {
  ctx.fillStyle = COLORS.cloud;
  [[0,56],[-14,40],[14,44],[-26,28],[26,30]].forEach(([o,w]) => ctx.fillRect(cx+o, cy, w, 10));
  ctx.fillStyle = '#D8E0E8';
  [[0,54],[-14,38],[14,42]].forEach(([o,w]) => ctx.fillRect(cx+o+1, cy+8, w-2, 3));
}

function drawClouds() {
  [[120,40],[350,80],[580,30],[720,100],[200,130],[480,150]].forEach(([x,y]) => drawCloud(x,y));
}

const CITY = [
  {w:35,h:70},{w:25,h:105},{w:40,h:50},{w:30,h:120},{w:38,h:80},
  {w:22,h:95},{w:48,h:60},{w:26,h:110},{w:34,h:85},{w:30,h:130},
  {w:42,h:65},{w:24,h:90},{w:36,h:75},{w:28,h:108},{w:44,h:55},
];
const CITY_COLS = ['#5B8B7A','#4A7B6A','#6B9B8A'];

function drawCitySkyline() {
  let x = 0;
  CITY.forEach((b, i) => {
    const c = CITY_COLS[i % 3];
    ctx.fillStyle = c;
    ctx.fillRect(x, GROUND_Y - b.h, b.w, b.h);
    ctx.fillStyle = shade(c, 10);
    ctx.fillRect(x, GROUND_Y - b.h, b.w, 3);
    ctx.fillStyle = shade(c, -15);
    ctx.fillRect(x, GROUND_Y - 4, b.w, 4);
    for (let wy = GROUND_Y - b.h + 8; wy < GROUND_Y - 8; wy += 10) {
      for (let wx = x + 5; wx < x + b.w - 5; wx += 9) {
        ctx.fillStyle = ((wx*7+wy*13)%5) < 3 ? '#FFE4A0' : '#4A6A7A';
        ctx.fillRect(wx, wy, 5, 6);
      }
    }
    x += b.w;
  });
}

function drawGround() {
  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
  for (let ty = GROUND_Y; ty < CANVAS_H; ty += 6) {
    for (let tx = 0; tx < CANVAS_W; tx += 6) {
      const h = (tx*31+ty*17)%100;
      if (h < 25) ctx.fillStyle = '#8B6E45';
      else if (h < 40) ctx.fillStyle = '#B8966E';
      else continue;
      ctx.fillRect(tx, ty, 4, 4);
    }
  }
  ctx.fillStyle = '#7A5C32';
  ctx.fillRect(0, GROUND_Y, CANVAS_W, 3);
}

/* ═══════════════════════════════════════════════════
   TOWER STRUCTURE
   ═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   TOWER GRID RENDERING
   ═══════════════════════════════════════════════════ */

function drawTowerGrid() {
  const n = towerGrid.length;
  if (n === 0) return;

  // Find the highest floor that has at least one cell
  let highestFloor = -1;
  for (let fi = 0; fi < n; fi++) {
    if (towerGrid[fi].some(c => c !== null)) {
      highestFloor = fi;
    }
  }
  if (highestFloor < 0) return;
  const top = getFloorY(highestFloor);

  for (let fi = 0; fi <= highestFloor; fi++) {
    const y = getFloorY(fi);
    const floorNum = fi + 1;
    const cells = towerGrid[fi];
    const hasAnyCell = cells.some(c => c !== null);

    if (hasAnyCell) {
      // Determine the dominant type for the row label
      const dominant = cells.find(c => c !== null);
      drawTowerFloor(y, dominant, floorNum, cells);
    }

    // Highlight first empty cell (placement target) — only on rows that exist
    if (cells) {
      const firstEmpty = cells.indexOf(null);
      if (firstEmpty !== -1) {
        const cr = getCellRect(fi, firstEmpty);
        ctx.strokeStyle = '#FFD70088';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(cr.x + 1, cr.y + 1, cr.w - 2, cr.h - 2);
        ctx.setLineDash([]);
      }
    }
  }
  drawTowerFrame(top);
}

function drawTower(floorList) {
  // Legacy: render from a flat array (used by test pages)
  const n = floorList.length;
  const top = GROUND_Y - n * FLOOR_H;
  for (let i = 0; i < n; i++) {
    const y = top + i * FLOOR_H;
    const floorNum = n - i;
    drawTowerFloor(y, floorList[i], floorNum);
  }
  drawTowerFrame(top);
}

function drawTowerFloor(y, name, idx, cells) {
  // cells: optional array of cell types (GRID_COLS length). If provided, render per-cell.
  // If omitted, render the whole interior as one type (legacy mode for test pages).
  const t = name ? FLOOR_TYPES.find(f => f.name === name) : null;
  const hasAnyCell = cells ? cells.some(c => c !== null) : !!t;

  // In grid mode, count contiguous placed cells from left
  let placedCount = GRID_COLS;
  if (cells) {
    placedCount = 0;
    for (let ci = 0; ci < GRID_COLS; ci++) {
      if (cells[ci] !== null) placedCount++;
      else break;
    }
  }

  // Calculate the right edge of the built area
  const builtRight = INTERIOR_X + placedCount * CELL_W;

  // Label column — only draw if this row has content
  if (hasAnyCell) {
    ctx.fillStyle = '#1A1A2A';
    ctx.fillRect(0, y, LABEL_W, FLOOR_H);
    ctx.fillStyle = '#3D3D4D';
    ctx.fillRect(LABEL_W, y, 1, FLOOR_H);
    ctx.fillStyle = '#AABBCC';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`${idx}`, LABEL_W/2, y + FLOOR_H/2);
  }

  // Left staircase — only if row has content
  if (hasAnyCell) drawStairs(LABEL_W, y, false);

  // Elevator shaft — only if row has content
  if (hasAnyCell) drawElevator(y);

  // Interior content
  if (cells) {
    // Grid mode: render only placed cells
    for (let ci = 0; ci < placedCount; ci++) {
      const cellType = cells[ci];
      const cellX = INTERIOR_X + ci * CELL_W;
      if (cellType) {
        drawInterior(cellX, y, CELL_W, cellType, idx);
      }
    }
  } else if (t) {
    // Legacy mode: full floor, one type
    drawInterior(INTERIOR_X, y, INTERIOR_W, name, idx);
  } else {
    drawUnfinished(INTERIOR_X, y, INTERIOR_W);
  }

  // Right staircase — only if row is fully built (all cells placed)
  if (placedCount === GRID_COLS) {
    drawStairs(CANVAS_W - STAIR_W, y, true);
  }

  // Floor beams — span only the built area
  if (hasAnyCell) {
    ctx.fillStyle = COLORS.frame;
    ctx.fillRect(0, y, builtRight, 2);
    ctx.fillRect(0, y + FLOOR_H - 2, builtRight, 2);
  }
}

function drawTowerFrame(top) {
  const bot = GROUND_Y;
  // Find the widest built row to determine frame width
  let maxPlaced = 0;
  for (let fi = 0; fi < towerGrid.length; fi++) {
    let count = 0;
    for (let ci = 0; ci < GRID_COLS; ci++) {
      if (towerGrid[fi][ci] !== null) count++;
      else break;
    }
    if (count > maxPlaced) maxPlaced = count;
  }
  const frameRight = INTERIOR_X + maxPlaced * CELL_W;

  // Left structural beam — stop before the label column so numbers show through
  ctx.fillStyle = '#2D2D3D';
  ctx.fillRect(LABEL_W + 1, top, STAIR_W + 4, bot - top + 4);
  // Right beam only if tower is fully wide
  if (maxPlaced === GRID_COLS) {
    ctx.fillRect(CANVAS_W - STAIR_W - 2, top, STAIR_W + 2, bot - top + 4);
  }
  // Roof beam
  ctx.fillStyle = '#3D3D4D';
  ctx.fillRect(0, top - 4, frameRight, 6);
  // AC unit on roof
  ctx.fillStyle = '#6A6A7A';
  ctx.fillRect(300, top - 18, 20, 14);
  ctx.fillRect(306, top - 22, 8, 4);
  // Ground beam
  ctx.fillStyle = '#3D3D4D';
  ctx.fillRect(0, bot - 2, frameRight, 4);
}

function drawStairs(x, y, right) {
  ctx.fillStyle = '#4A4A5A';
  ctx.fillRect(x, y, STAIR_W, FLOOR_H);
  for (let s = 0; s < FLOOR_H; s += 4) {
    ctx.fillStyle = '#8B8B9B';
    ctx.fillRect(x + 2, y + s + 1, STAIR_W - 4, 3);
    ctx.fillStyle = '#5A5A6A';
    ctx.fillRect(x + 2, y + s + 1, STAIR_W - 4, 1);
  }
  ctx.fillStyle = '#9B9BAB';
  for (let p = 0; p < 3; p++) {
    ctx.fillRect(right ? x + STAIR_W - 4 : x + 2, y + 6 + p * 14, 2, 6);
  }
  ctx.fillStyle = '#B0B0C0';
  ctx.fillRect(right ? x + STAIR_W - 3 : x + 3, y + 2, 1, FLOOR_H - 4);
}

function drawElevator(y) {
  ctx.fillStyle = '#1A1A28';
  ctx.fillRect(SHAFT_X, y + 2, SHAFT_W, FLOOR_H - 4);
  ctx.fillStyle = '#5A5A6A';
  ctx.fillRect(SHAFT_X - 2, y + 2, 2, FLOOR_H - 4);
  ctx.fillRect(SHAFT_X + SHAFT_W, y + 2, 2, FLOOR_H - 4);
  ctx.fillStyle = '#7A7A8A';
  ctx.fillRect(SHAFT_X, y + 4, SHAFT_W, 2);
  ctx.fillRect(SHAFT_X, y + FLOOR_H - 6, SHAFT_W, 2);
  const dh = FLOOR_H - 12;
  ctx.fillStyle = '#A0A0B0';
  ctx.fillRect(SHAFT_X + 1, y + 6, Math.floor(SHAFT_W/2) - 1, dh);
  ctx.fillRect(SHAFT_X + Math.floor(SHAFT_W/2), y + 6, SHAFT_W - Math.floor(SHAFT_W/2) - 1, dh);
  ctx.fillStyle = '#808090';
  ctx.fillRect(SHAFT_X + SHAFT_W/2, y + 6, 1, dh);
  ctx.fillStyle = '#C0C0D0';
  ctx.fillRect(SHAFT_X + SHAFT_W/2 - 3, y + FLOOR_H/2 - 1, 1, 4);
  ctx.fillRect(SHAFT_X + SHAFT_W/2 + 2, y + FLOOR_H/2 - 1, 1, 4);
  ctx.fillStyle = '#44FF44';
  ctx.fillRect(SHAFT_X + SHAFT_W/2 - 1, y + 3, 2, 2);
}

/* ═══════════════════════════════════════════════════
   INTERIORS
   ═══════════════════════════════════════════════════ */

function drawInterior(x, y, w, name, idx) {
  const t = FLOOR_TYPES.find(f => f.name === name);
  const bot = y + FLOOR_H - 4;
  const top = y + 2;
  ctx.fillStyle = t.wall;
  ctx.fillRect(x, top, w, FLOOR_H - 4);
  ctx.fillStyle = t.flr;
  ctx.fillRect(x, bot - 2, w, 3);

  if (name === 'Residential') drawRes(x, y, w, idx);
  else if (name === 'Office') drawOff(x, y, w);
  else if (name === 'Restaurant') drawRest(x, y, w, idx);
  else if (name === 'Retail') drawRet(x, y, w, idx);
  else if (name === 'Entertainment') drawEnt(x, y, w);
  else if (name === 'Gym') drawGymFn(x, y, w);
  else if (name === 'Lobby') drawLob(x, y, w);
  else if (name === 'Storage') drawStor(x, y, w);
  else if (name === 'Rooftop Garden') drawRoof(x, y, w);
}

function drawRes(x, y, w, idx) {
  const bot = y + FLOOR_H - 4;
  const top = y + 2;
  ctx.fillStyle = shade('#F5E6C8', -5);
  for (let px = x; px < x+w; px += 20) ctx.fillRect(px+10, top, 1, FLOOR_H-4);

  const uW = 70;
  let ux = x;
  while (ux + uW < x + w - 10) {
    if (ux > x) {
      ctx.fillStyle = shade('#F5E6C8', -25);
      ctx.fillRect(ux, top, 3, FLOOR_H-4);
      ctx.fillStyle = '#A08060';
      ctx.fillRect(ux - 1, bot - 12, 6, 10);
      ctx.fillStyle = '#D4B896';
      ctx.fillRect(ux, bot - 11, 4, 8);
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(ux + 3, bot - 6, 1, 1);
    }
    // Kitchen
    ctx.fillStyle = '#C8C0B4';
    ctx.fillRect(ux + 4, top, 16, 8);
    ctx.fillStyle = '#E0E0E8';
    ctx.fillRect(ux + 5, bot - 12, 6, 10);
    ctx.fillStyle = '#4A4A5A';
    ctx.fillRect(ux + 13, bot - 8, 5, 6);
    ctx.fillStyle = '#CD3333';
    ctx.fillRect(ux + 14, bot - 10, 3, 3);
    // Bed
    ctx.fillStyle = '#7B5B8A';
    ctx.fillRect(ux + 24, bot - 5, 16, 3);
    ctx.fillStyle = '#FFF5E0';
    ctx.fillRect(ux + 24, bot - 5, 5, 2);
    ctx.fillStyle = '#5B3B6A';
    ctx.fillRect(ux + 24, bot - 7, 16, 2);
    // Table
    ctx.fillStyle = '#A0845C';
    ctx.fillRect(ux + 44, bot - 4, 10, 2);
    // Plant
    drawPlant(ux + uW - 12, bot, 6);
    // Picture
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(ux + 34, top + 2, 8, 6);
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(ux + 35, top + 3, 6, 4);
    ctx.fillStyle = '#4A7A4A';
    ctx.fillRect(ux + 36, top + 4, 2, 2);
    // Person
    person(ux + 20, bot, idx*3+1);
    ux += uW;
  }
  drawWin(x+w-28, y+8, 22, 10);
  drawWin(x+w-28, y+24, 22, 10);
}

function drawOff(x, y, w) {
  const bot = y + FLOOR_H - 4;
  ctx.fillStyle = '#C8C4BC';
  for (let cx2=x; cx2<x+w; cx2+=12)
    for (let cy=y; cy<y+FLOOR_H; cy+=12)
      if ((Math.floor((cx2-x)/12)+Math.floor((cy-y)/12))%2===0) ctx.fillRect(cx2, cy, 11, 11);

  for (let dx=x+20; dx<x+w-50; dx+=50) {
    ctx.fillStyle = '#B8A888';
    ctx.fillRect(dx, bot-7, 24, 3);
    ctx.fillStyle = '#908068';
    ctx.fillRect(dx+2, bot-4, 1, 4);
    ctx.fillRect(dx+20, bot-4, 1, 4);
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(dx+6, bot-14, 12, 7);
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(dx+7, bot-13, 10, 5);
    ctx.fillRect(dx+10, bot-7, 4, 2);
    ctx.fillStyle = '#D0D0D8';
    ctx.fillRect(dx+7, bot-4, 8, 1);
    ctx.fillStyle = '#4A4A5A';
    ctx.fillRect(dx+5, bot, 8, 3);
    ctx.fillStyle = '#3A3A4A';
    ctx.fillRect(dx+5, bot+3, 2, 1);
    ctx.fillRect(dx+11, bot+3, 2, 1);
    person(dx+16, bot, dx%5);
  }
  ctx.fillStyle = '#8A8A9A';
  ctx.fillRect(x+w-40, bot-14, 12, 12);
  for (let d=0;d<4;d++) {
    ctx.fillStyle = shade('#8A8A9A', d%2===0?5:-5);
    ctx.fillRect(x+w-39, bot-13+d*3, 10, 3);
    ctx.fillStyle = '#D0D0D0';
    ctx.fillRect(x+w-34, bot-12+d*3, 3, 1);
  }
  for (let wy=y+6; wy<y+FLOOR_H-10; wy+=12) {
    drawWin(x+w-55, wy, 18, 8);
    drawWin(x+w-32, wy, 18, 8);
  }
}

function drawRest(x, y, w, idx) {
  const bot = y + FLOOR_H - 4;
  const top = y + 2;
  ctx.fillStyle = '#D8A070';
  for (let fx=x; fx<x+w; fx+=16) {
    ctx.fillStyle = (Math.floor(fx/16))%2===0 ? '#D8A070' : '#C89060';
    ctx.fillRect(fx, top, 16, FLOOR_H-4);
    ctx.fillStyle = '#B88050';
    ctx.fillRect(fx, top, 1, FLOOR_H-4);
  }
  const split = x + Math.floor(w*0.45);
  // Kitchen counter
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(x+10, top, 55, 8);
  ctx.fillStyle = '#A08A6A';
  ctx.fillRect(x+11, top+1, 53, 6);
  ctx.fillStyle = '#2C3E50';
  ctx.fillRect(x+15, top-6, 35, 7);
  ctx.fillStyle = '#FFD700';
  ctx.font = '6px monospace';
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText('MENU', x+18, top-5);
  // Tables
  for (let tx=x+16; tx<split-20; tx+=40) {
    ctx.fillStyle = '#A0845C';
    ctx.fillRect(tx, bot-7, 14, 2);
    ctx.fillStyle = '#806A44';
    ctx.fillRect(tx+6, bot-5, 2, 5);
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(tx+1, bot-11, 4, 2);
    ctx.fillRect(tx+9, bot-11, 4, 2);
    ctx.fillRect(tx+1, bot-4, 4, 2);
    ctx.fillRect(tx+9, bot-4, 4, 2);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(tx+4, bot-8, 4, 2);
  }
  person(x+30, bot, 7);
  person(split-30, bot, 8);
  // Shop facade right side
  drawShop(split, y, x+w-split, idx);
}

function drawRet(x, y, w, idx) {
  const bot = y + FLOOR_H - 4;
  const top = y + 2;
  for (let fx=x; fx<x+w; fx+=10)
    for (let fy=top; fy<y+FLOOR_H-2; fy+=10)
      if ((Math.floor((fx-x)/10)+Math.floor((fy-top)/10))%2===0)
        ctx.fillStyle='#E0D8CC', ctx.fillRect(fx,fy,10,10);
  const split = x + Math.floor(w*0.4);
  for (let sx=x+10; sx<split-30; sx+=40) shelf(sx, top+2, 30, FLOOR_H-14);
  ctx.fillStyle = '#3498DB';
  ctx.fillRect(split-50, bot-5, 8, 4);
  ctx.fillStyle = '#555';
  ctx.fillRect(split-49, bot, 1, 1);
  ctx.fillRect(split-44, bot, 1, 1);
  person(split-30, bot, 9);
  drawShop(split, y, x+w-split, idx+3);
}

function drawEnt(x, y, w) {
  const bot = y + FLOOR_H - 4;
  const top = y + 2;
  // Dark club interior
  ctx.fillStyle = '#1A1A2A';
  ctx.fillRect(x, top, w, FLOOR_H-4);
  // Neon sign strip along ceiling
  const neon = ['#FF1493','#00FFFF','#FF69B4','#7FFF00','#FF4500','#9933FF'];
  for (let nx=x+8; nx<x+w-20; nx+=16) {
    const c = neon[Math.floor((nx-x)/16)%neon.length];
    ctx.fillStyle = c;
    ctx.fillRect(nx, top, 8, 2);
    ctx.fillStyle = c+'33';
    ctx.fillRect(nx-2, top-1, 12, 5);
  }
  // Bar counter
  ctx.fillStyle = '#6B4226';
  ctx.fillRect(x+30, top+4, 50, 6);
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(x+32, top+2, 46, 3);
  // Bottles on shelf
  const bottleC = ['#27AE60','#E74C3C','#F39C12','#8E44AD','#3498DB'];
  for (let b=0; b<5; b++) {
    ctx.fillStyle = bottleC[b];
    ctx.fillRect(x+34+b*10, top-2, 4, 5);
  }
  // Stools
  ctx.fillStyle = '#4A3728';
  for (let s=0; s<4; s++) ctx.fillRect(x+36+s*12, bot-4, 5, 3);
  // Arcade cabinet
  ctx.fillStyle = '#333';
  ctx.fillRect(x+w-60, bot-22, 16, 20);
  ctx.fillStyle = '#2ECC71';
  ctx.fillRect(x+w-58, bot-20, 12, 10);
  ctx.fillStyle = '#1A1A2A';
  ctx.fillRect(x+w-57, bot-18, 10, 1);
  ctx.fillRect(x+w-57, bot-15, 10, 1);
  ctx.fillRect(x+w-57, bot-12, 10, 1);
  // People
  for (let px=x+20; px<x+w-70; px+=30) person(px, bot, Math.floor((px-x)/30));
}

function drawGymFn(x, y, w) {
  const bot = y + FLOOR_H - 4;
  ctx.fillStyle = '#8A7A6A';
  ctx.fillRect(x, y+2, w, FLOOR_H-4);
  for (let lx=x+16; lx<x+w; lx+=16) { ctx.fillStyle='#7A6A5A'; ctx.fillRect(lx, y+2, 1, FLOOR_H-4); }
  for (let gx=x+16; gx<x+w-60; gx+=45) {
    ctx.fillStyle='#555'; ctx.fillRect(gx, bot-3, 28, 3);
    ctx.fillStyle='#333'; ctx.fillRect(gx+2, bot-2, 24, 2);
    ctx.fillStyle='#666'; ctx.fillRect(gx+24, bot-16, 2, 13);
    ctx.fillStyle='#2ECC71'; ctx.fillRect(gx+20, bot-18, 8, 2);
    ctx.fillStyle='#555'; ctx.fillRect(gx+24, bot-14, 1, 7);
    person(gx+12, bot, gx%4+2);
  }
  ctx.fillStyle='#555';
  ctx.fillRect(x+w-40, bot-16, 2, 14);
  ctx.fillRect(x+w-18, bot-16, 2, 14);
  for (let s=0; s<4; s++) {
    ctx.fillRect(x+w-40, bot-15+s*3, 22, 1);
    ctx.fillStyle=s%2===0?'#444':'#555';
    ctx.fillRect(x+w-36, bot-17+s*3, 4, 2);
    ctx.fillRect(x+w-28, bot-17+s*3, 4, 2);
    ctx.fillStyle=['#E74C3C','#3498DB','#27AE60','#F39C12'][s];
    ctx.fillRect(x+w-37, bot-18+s*3, 1, 4);
    ctx.fillRect(x+w-33, bot-18+s*3, 1, 4);
  }
}

function drawLob(x, y, w) {
  const bot = y + FLOOR_H - 4;
  const top = y + 2;
  ctx.fillStyle = '#D4C4A8';
  ctx.fillRect(x, top, w, FLOOR_H-4);
  for (let ty=top; ty<y+FLOOR_H-2; ty+=12)
    for (let tx=x; tx<x+w; tx+=12)
      if (((Math.floor((tx-x)/12)+Math.floor((ty-top)/12))%2)===0)
        ctx.fillStyle='#E8D8BC', ctx.fillRect(tx,ty,11,11);
  ctx.fillStyle='#D4AF37'; ctx.fillRect(x, top, w, 1);
  // Concierge desk
  ctx.fillStyle='#6B4226'; ctx.fillRect(x+60, bot-8, 28, 3);
  ctx.fillStyle='#5B3216';
  ctx.fillRect(x+63, bot-5, 2, 5);
  ctx.fillRect(x+83, bot-5, 2, 5);
  ctx.fillStyle='#2C3E50'; ctx.fillRect(x+70, bot-16, 10, 7);
  ctx.fillStyle='#87CEEB'; ctx.fillRect(x+71, bot-15, 8, 5);
  person(x+75, bot, 7);
  drawPlant(x+20, bot, 8);
  drawPlant(x+w-40, bot, 8);
  sofa(x+140, bot);
  sofa(x+w-120, bot);
  ctx.fillStyle='#A0845C';
  ctx.fillRect(x+150, bot+3, 12, 2);
  ctx.fillRect(x+w-110, bot+3, 12, 2);
  // Entrance doors
  ctx.fillStyle='#8B6914';
  ctx.fillRect(x+w-30, top, 2, FLOOR_H-4);
  ctx.fillRect(x+w-4, top, 2, FLOOR_H-4);
  ctx.fillStyle='#B8D4E8';
  ctx.fillRect(x+w-28, top+2, 24, FLOOR_H-8);
  // Directory
  ctx.fillStyle='#4A4A5A'; ctx.fillRect(x+10, top+2, 30, 14);
  ctx.fillStyle='#FFF';
  for (let li=0; li<5; li++) ctx.fillRect(x+13, top+4+li*3, 20, 1);
}

function drawStor(x, y, w) {
  const bot = y + FLOOR_H - 4;
  ctx.fillStyle='#909090'; ctx.fillRect(x, y+2, w, FLOOR_H-4);
  ctx.fillStyle='#808080';
  for (let sx=x+4; sx<x+w; sx+=10) {
    const sy=y+((sx*7+3)%(FLOOR_H-6))+2;
    ctx.fillRect(sx, sy, 2, 2);
  }
  const crateC = ['#8B7355','#A0926C','#6B5B3E','#7A6B4A','#9B8B65'];
  for (let cx=x+16; cx<x+w-60; cx+=36) {
    const c = crateC[Math.floor(cx/36)%crateC.length];
    ctx.fillStyle=c; ctx.fillRect(cx, bot-10, 20, 10);
    ctx.fillStyle=shade(c,-15); ctx.fillRect(cx+9, bot-10, 2, 10); ctx.fillRect(cx, bot-5, 20, 2);
    ctx.fillStyle=crateC[(Math.floor(cx/36)+1)%crateC.length];
    ctx.fillRect(cx+3, bot-18, 14, 8);
    ctx.fillStyle='#FFF'; ctx.fillRect(cx+5, bot-7, 6, 2);
  }
  ctx.fillStyle='#4A6FA5'; ctx.fillRect(x+w-40, bot-18, 12, 18);
  ctx.fillStyle='#87CEEB88'; ctx.fillRect(x+w-39, bot-17, 10, 9);
  const pc = ['#E74C3C','#F39C12','#27AE60','#3498DB','#9B59B6','#E67E22'];
  for (let r=0;r<3;r++) for (let c=0;c<3;c++) {
    ctx.fillStyle=pc[r*3+c]; ctx.fillRect(x+w-38+c*3, bot-16+r*3, 2, 2);
  }
  ctx.fillStyle='#333'; ctx.fillRect(x+w-38, bot-5, 8, 2);
  person(x+100, bot, 9);
}

function drawRoof(x, y, w) {
  const bot = y + FLOOR_H - 4;
  ctx.fillStyle=COLORS.sky; ctx.fillRect(x, y+2, w, Math.floor(FLOOR_H*0.35));
  ctx.fillStyle='#5AA05A'; ctx.fillRect(x, y+Math.floor(FLOOR_H*0.35), w, FLOOR_H*0.65);
  ctx.fillStyle='#4A8A4A';
  for (let gx=x; gx<x+w; gx+=4) { const gh=2+((gx*3+7)%5); ctx.fillRect(gx, bot-gh+2, 1, gh); }
  for (let fx=x+16; fx<x+w-30; fx+=40) {
    ctx.fillStyle='#B5651D'; ctx.fillRect(fx, bot-4, 8, 4);
    ctx.fillStyle='#228B22'; ctx.fillRect(fx+3, bot-11, 2, 7);
    ctx.fillStyle=['#FF69B4','#FFD700','#FF4500','#FF1493','#99FF99'][Math.floor(fx/40)%5];
    ctx.fillRect(fx+2, bot-13, 4, 2);
  }
  sofa(x+Math.floor(w/2)-10, bot);
  [x+30, x+Math.floor(w/2)+30, x+w-50].forEach(tx => {
    ctx.fillStyle='#5C3A1E'; ctx.fillRect(tx, bot-14, 4, 10);
    ctx.fillStyle='#32CD32'; ctx.fillRect(tx-2, bot-22, 8, 4);
    ctx.fillStyle='#228B22'; ctx.fillRect(tx-3, bot-26, 10, 4);
    ctx.fillStyle='#32CD32'; ctx.fillRect(tx-2, bot-29, 8, 4);
  });
}

function drawUnfinished(x, y, w) {
  const h = FLOOR_H - 4;
  ctx.fillStyle = COLORS.unfinished;
  ctx.fillRect(x, y+2, w, h);
  ctx.fillStyle = '#6A6A72';
  for (let dx=x+4; dx<x+w; dx+=8) { const dy=y+2+((dx*11)%h); ctx.fillRect(dx,dy,2,2); }
  ctx.fillStyle = '#5A5A62';
  for (let lx=x+20; lx<x+w; lx+=40) ctx.fillRect(lx, y+2, 1, h);
  for (let ly=y+10; ly<y+h; ly+=20) ctx.fillRect(x, ly, w, 1);
  ctx.fillStyle = '#6A6A72';
  [60,200,400,600].forEach(px => ctx.fillRect(x+px, y+1, 8, h+1));
}

/* ═══════════════════════════════════════════════════
   SHOP FACADE (right side storefronts)
   ═══════════════════════════════════════════════════ */

function drawShop(x, y, w, idx) {
  const shop = SHOPS[idx % SHOPS.length];
  const bot = y + FLOOR_H - 4;
  const top = y + 2;
  ctx.fillStyle = '#2A2A3A';
  ctx.fillRect(x, top, w, FLOOR_H-4);
  // Awning
  ctx.fillStyle = shop.curt;
  ctx.fillRect(x, top, w, 4);
  for (let aw=x; aw<x+w; aw+=8) {
    ctx.fillRect(aw, top+4, 8, 2);
    ctx.fillRect(aw, top+3, 2, 1);
    ctx.fillRect(aw+6, top+3, 2, 1);
  }
  // Display windows
  const pad = 3;
  const winW = Math.floor((w - pad*3)/2);
  const winH = FLOOR_H - 18;
  ctx.fillStyle = shop.glass;
  ctx.fillRect(x+pad, top+8, winW, winH);
  ctx.fillRect(x+pad*2+winW, top+8, winW, winH);
  ctx.fillStyle = shop.glow+'44';
  ctx.fillRect(x+pad-2, top+6, winW+4, winH+4);
  ctx.fillRect(x+pad*2+winW-2, top+6, winW+4, winH+4);
  // Window frames
  ctx.fillStyle = '#4A4A5A';
  [x+pad-1, x+pad*2+winW-1].forEach(wx => {
    ctx.fillRect(wx, top+8, 1, winH);
    ctx.fillRect(wx+winW, top+8, 1, winH);
    ctx.fillRect(wx, top+8, winW+2, 1);
    ctx.fillRect(wx, top+8+winH, winW+2, 1);
  });
  // Display items
  const dc = ['#FF6B6B','#4ECDC4','#FFE66D','#A8E6CF'];
  for (let d=0;d<3;d++) { ctx.fillStyle=dc[d%dc.length]; ctx.fillRect(x+pad+3+d*7, bot-8, 5, 5); }
  ctx.fillStyle='#6B5B3E'; ctx.fillRect(x+pad+1, bot-10, winW-2, 1);
  ctx.fillStyle='#FFB4D8'; ctx.fillRect(x+pad*2+winW+3, top+12, 6, 6);
  ctx.fillStyle='#B4D8FF'; ctx.fillRect(x+pad*2+winW+12, top+14, 5, 5);
  // Sign
  ctx.fillStyle = shop.glow+'22';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(shop.sign, x+w/2, bot-3);
  ctx.fillStyle = shop.col;
  ctx.font = 'bold 10px monospace';
  ctx.fillText(shop.sign, x+w/2, bot-3);
  // Door
  ctx.fillStyle='#8B6914'; ctx.fillRect(x+w-12, top+6, 10, FLOOR_H-10);
  ctx.fillStyle='#B8D4E8'; ctx.fillRect(x+w-11, top+7, 8, FLOOR_H-14);
  ctx.fillStyle='#FFD700'; ctx.fillRect(x+w-10, top+FLOOR_H/2, 1, 2);
}

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */

function person(x, baseY, seed) {
  const emoji = PEOPLE_EMOJI[seed % PEOPLE_EMOJI.length];
  const sz = Math.floor(FLOOR_H * 0.7);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(emoji, x, baseY + 1);
}

function drawPlant(x, baseY, h) {
  ctx.fillStyle='#B5651D'; ctx.fillRect(x-1, baseY-4, 5, 4);
  ctx.fillStyle='#228B22'; ctx.fillRect(x+1, baseY-4-h+4, 1, h-2);
  ctx.fillStyle='#32CD32';
  ctx.fillRect(x-1, baseY-4-h+3, 3, 2);
  ctx.fillRect(x+2, baseY-4-h+5, 3, 2);
}

function sofa(x, baseY) {
  ctx.fillStyle='#6B4423'; ctx.fillRect(x, baseY-5, 18, 5);
  ctx.fillStyle='#8B5E3C'; ctx.fillRect(x, baseY-9, 18, 4);
  ctx.fillStyle='#5C3A1E';
  ctx.fillRect(x-1, baseY-8, 3, 7);
  ctx.fillRect(x+16, baseY-8, 3, 7);
  ctx.fillStyle='#3A2818';
  ctx.fillRect(x+1, baseY, 2, 1);
  ctx.fillRect(x+15, baseY, 2, 1);
}

function shelf(x, topY, w, h) {
  ctx.fillStyle='#8B7355';
  ctx.fillRect(x, topY, 2, h); ctx.fillRect(x+w-2, topY, 2, h);
  const ns = Math.max(2, Math.floor(h/6));
  const sp = Math.floor(h/ns);
  ctx.fillStyle='#A0845C';
  for (let s=0; s<ns; s++) ctx.fillRect(x, topY+1+s*sp, w, 1);
  const ic = ['#E74C3C','#3498DB','#27AE60','#F39C12','#9B59B6','#E67E22','#1ABC9C'];
  for (let s=0; s<ns; s++) {
    let ix=x+3;
    while (ix+3<x+w-3) {
      ctx.fillStyle=ic[(ix+s*3)%ic.length];
      ctx.fillRect(ix, topY+2+s*sp-Math.max(1,sp-3)+1, 3, Math.max(1,sp-3));
      ix+=5;
    }
  }
}

function drawWin(x, y, w, h) {
  ctx.fillStyle='#5A5A6A'; ctx.fillRect(x-1, y-1, w+2, h+2);
  ctx.fillStyle=COLORS.window; ctx.fillRect(x, y, w, h);
  ctx.fillStyle='#FFFFFF44'; ctx.fillRect(x+2, y+1, w/3, 1);
  ctx.fillStyle='#5A5A6A';
  ctx.fillRect(x+w/2, y, 1, h);
  ctx.fillRect(x, y+h/2, w, 1);
}

function shade(hex, amt) {
  let r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  r=Math.min(255,Math.max(0,r+amt));
  g=Math.min(255,Math.max(0,g+amt));
  b=Math.min(255,Math.max(0,b+amt));
  return `rgb(${r},${g},${b})`;
}

/* ═══════════════════════════════════════════════════
   TOOLBAR
   ═══════════════════════════════════════════════════ */

function drawToolbar() {
  const pad = 6;
  const btnCount = FLOOR_TYPES.length;
  const totalPad = pad * (btnCount + 1);
  const btnW = Math.floor((CANVAS_W - totalPad) / btnCount);
  const by = TOOLBAR_Y + 4;
  const bh = TOOLBAR_H - 8;

  // Background
  ctx.fillStyle = '#1A1A2A';
  ctx.fillRect(0, TOOLBAR_Y, CANVAS_W, TOOLBAR_H);
  ctx.fillStyle = '#3D3D4D';
  ctx.fillRect(0, TOOLBAR_Y, CANVAS_W, 2);

  FLOOR_TYPES.forEach((ft, i) => {
    const bx = pad + i * (btnW + pad);

    const isSelected = selectedFloorType === ft.name;
    ctx.fillStyle = isSelected ? '#4A4A6A' : '#2A2A3A';
    ctx.fillRect(bx, by, btnW, bh);

    if (isSelected) {
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx + 1, by + 1, btnW - 2, bh - 2);
    }

    // Emoji
    ctx.font = '22px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFF';
    ctx.fillText(ft.emoji, bx + btnW / 2, by + bh / 2 - 8);

    // Name
    ctx.font = '10px monospace';
    ctx.fillStyle = isSelected ? '#FFD700' : '#AAA';
    ctx.fillText(ft.name, bx + btnW / 2, by + bh / 2 + 12);
  });
}

/* ═══════════════════════════════════════════════════
   MAIN RENDER
   ═══════════════════════════════════════════════════ */

function renderBackground() {
  drawSky();
  drawClouds();
  drawCitySkyline();
  drawGround();
}

function renderAll() {
  renderBackground();
  drawTowerGrid();
  drawToolbar();
}

// Default floor stack for preview — matches SimTower style
const DEFAULT_FLOORS = [
  'Rooftop Garden',        // 8: top of screen (small Y)
  'Entertainment',         // 7
  'Gym',                   // 6
  null,                    // 5: unfinished
  'Office',                // 4
  'Residential',           // 3
  'Retail',                // 2
  'Restaurant',            // 1
  'Lobby',                 // 0: ground floor (large Y, near GROUND_Y)
];

// index.html renders background + empty grid + toolbar; test pages set window.preview = 1
if (typeof window.preview !== 'undefined') {
  // test/preview page — don't auto-render
} else {
  document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    setupClickHandler();
  });
}

/* ═══════════════════════════════════════════════════
   CLICK HANDLING
   ═══════════════════════════════════════════════════ */

function setupClickHandler() {
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    // Check toolbar click
    if (my >= TOOLBAR_Y) {
      handleToolbarClick(mx, my);
      return;
    }

    // Check cell click
    handleCellClick(mx, my);
  });
}

function handleToolbarClick(mx, my) {
  const pad = 6;
  const btnCount = FLOOR_TYPES.length;
  const totalPad = pad * (btnCount + 1);
  const btnW = Math.floor((CANVAS_W - totalPad) / btnCount);

  for (let i = 0; i < FLOOR_TYPES.length; i++) {
    const bx = pad + i * (btnW + pad);
    if (mx >= bx && mx < bx + btnW) {
      selectedFloorType = FLOOR_TYPES[i].name;
      renderAll();
      return;
    }
  }
}

function handleCellClick(mx, my) {
  if (!selectedFloorType) return;
  if (towerGrid.length === 0) {
    // First ever placement — create ground floor
    if (towerGrid.length >= MAX_FLOORS) return;
    ensureFloorRow(0);
    placeCell(0, 0);
    return;
  }

  // Find which floor row and cell column was clicked
  for (let fi = 0; fi < towerGrid.length; fi++) {
    const y = getFloorY(fi);
    if (my >= y && my < y + FLOOR_H) {
      // Determine cell index from X position
      const ci = Math.floor((mx - INTERIOR_X) / CELL_W);
      if (ci >= 0 && ci < GRID_COLS) {
        // If this is a new row (beyond current grid), validate support
        if (fi >= towerGrid.length) {
          ensureFloorRow(fi);
        }
        placeCell(fi, ci);
      }
      return;
    }
  }
}

/* ═══════════════════════════════════════════════════
   CELL PLACEMENT
   ═══════════════════════════════════════════════════ */

function placeCell(floorIdx, cellIdx) {
  if (!selectedFloorType) return;
  if (towerGrid.length >= MAX_FLOORS && floorIdx >= towerGrid.length) return;

  ensureFloorRow(floorIdx);
  const cells = towerGrid[floorIdx];

  // Target cell must be null
  if (cells[cellIdx] !== null) return;

  // Left-to-right fill: all cells to the left must be non-null
  for (let c = 0; c < cellIdx; c++) {
    if (cells[c] === null) return;
  }

  // Support check: row below must have a cell at this column or to its left
  if (floorIdx > 0) {
    const below = towerGrid[floorIdx - 1];
    let hasSupport = false;
    for (let c = 0; c <= cellIdx && c < below.length; c++) {
      if (below[c] !== null) { hasSupport = true; break; }
    }
    if (!hasSupport) return;
  }

  // Place the cell
  cells[cellIdx] = selectedFloorType;

  // Flash animation
  flashCell(floorIdx, cellIdx);
}

function flashCell(floorIdx, cellIdx) {
  const cr = getCellRect(floorIdx, cellIdx);
  const flashColor = '#FFFFFF88';
  ctx.fillStyle = flashColor;
  ctx.fillRect(cr.x, cr.y, cr.w, cr.h);

  // Re-render after a brief delay
  setTimeout(() => {
    renderAll();
  }, 150);
}
