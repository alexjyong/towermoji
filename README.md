# Towermoji

A **SimTower-inspired** vertical building simulation rendered entirely on a `<canvas>` with pixel-art interiors and emoji characters — generated as a proof of concept by **Qwen 3.6 27B**.

> This entire project was built autonomously by Qwen 3.6 27B running in two configurations:
> - **Locally** on a MacBook with M5 Pro chip
> - **In the cloud** on GCP with an A100 80GB GPU

The goal was to evaluate how far a single LLM session can take a greenfield, non-trivial interactive game — from zero to a playable prototype.

## What It Does

- **Click-to-build** a multi-floor tower with 9 room types (Lobby, Office, Residential, Entertainment, Retail, Restaurant, Gym, Storage, Rooftop Garden)
- **Mixed-use floors** — place different room types side by side on the same row
- **SimTower-style interiors** — each room type renders detailed pixel-art furniture, people, and shop facades
- **Placement rules** — left-to-right fill, ground-floor Lobby requirement, support-from-below constraint, 30-floor max height

## Running

Open `index.html` in a browser — no build step or dependencies required.

```bash
# Or serve via a local server:
python3 -m http.server 8080
# → http://localhost:8080
```

## Project Structure

```
├── index.html            # Main game entry point
├── css/style.css         # Canvas styling
├── js/game.js            # All game logic (~1200 lines)
├── test/
│   ├── floor-preview.html # Floor type color/size showcase
│   └── grid-preview.html  # Pre-built sample tower (all 9 types)
└── openspec/             # Feature specs & implementation tasks
```

## Feature Status

| Feature | Status |
|---|---|
| Game world background (sky, clouds, skyline, ground) | ✅ Done |
| File structure refactor + floor visual PoC | ✅ Done |
| Tower grid & click-to-place mechanic | ✅ Done |
| Game loop, people movement, elevator, ambient effects | 📋 Spec'd, not implemented |

## Implementation Details

- **Single canvas** (800×600, `imageSmoothingEnabled = false` for crisp pixels)
- **No frameworks** — vanilla HTML/CSS/JS, zero dependencies
- **Cell-based grid** — 5 cells per floor row, each independently typed
- **Placement validation** — ground floor = Lobby only, left-to-right fill, support check
- **Ghost preview** — empty lot shows a semi-transparent floor silhouette with placement hint

## Open Questions / Lessons Learned

- Canvas-only rendering works well for pixel art but makes hit testing and UI more manual than DOM-based approaches
- The spec-driven workflow (OpenSpec → design → tasks → implement) kept the LLM focused and produced clean, well-structured code
- ~1200 lines of game logic in a single file is workable for a PoC but would benefit from module splitting in a production version

---
