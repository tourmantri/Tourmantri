# Tourmantri Workspace Guidelines & Instructions

## Project Context
- **Brand**: Tourmantri (Tour Designer / Travel Agency)
- **Domain**: [tourmantri.com](https://tourmantri.com)
- **Repo**: [github.com/tourmantri/Tourmantri](https://github.com/tourmantri/Tourmantri)
- **Stack**: Pure Vanilla HTML5, CSS3, ES6+ JavaScript (Zero dependencies, standalone browser-ready).

## Key Architecture & Design Rules
1. **Zero-Dependency Architecture**: Do not introduce Node, npm build steps, or external bundlers. Keep all scripts and stylesheets directly linked from `index.html`.
2. **Color Palette**:
   - Primary: `#ff7200` (Dark mode: `#ff8522`)
   - Secondary: `#e53935` (Warm crimson red, rgb `229, 57, 53` - no pinkish hues in dark mode)
   - Backgrounds: Dark (`#0f0d0b`, `#171412`, `#221f1c`), Light (`#faf8f5`, `#ffffff`, `#f5f1eb`)
3. **Logo Standards**:
   - Header height: 104px (scrolled: 68px), Footer height: 85px. Flat styling without 3D/emboss.
   - Dark mode: Use `filter: invert(1) hue-rotate(180deg)` to make text white while keeping orange/red accents.
4. **Pricing**: Format all pricing in INR with `₹` and `.toLocaleString('en-IN')`.
5. **State**: Persistent client-side state stored in `localStorage` (bookings, wishlists, itineraries, theme).
6. **Detailed Reference**: Refer to the workspace skill in `.agents/skills/tourmantri-app/SKILL.md` for complete package IDs, itineraries, and design tokens.
