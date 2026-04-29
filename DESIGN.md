# Design System

## Color Palette

### Primary Colors
- **Black screens**: `#000000` (absolute black for CRT substrate)
- **Background gradient**: `#040706` to `#020303` (barely-green-tinted blacks)
- **Green phosphor** (primaries):
  - Bright accent: `#00ff00` (pure lime, rarely used)
  - Standard text: `#008f00`, `#009900`, `#00aa00`, `#00c800`, `#00d500` (various saturation levels)
  - Dim interactive: `#0a300a`, `#001f00` (text on bright green backgrounds)
  - Borders/outlines: `#0f2a0f`, `#0f4b0f`, `#1d8a1d` (subtle structured greens)
  - Backgrounds: `#031003`, `#030903`, `#071807`, `#071407`, `#081808`, `#0a2d0a`, `#0b300b`, `#146714`, `#188118` (very dark greens, almost black)

### Accent Colors
- **Cyan**: `#00ffcc` (glitch effect, cyan shift)
- **Purple**: `#9d00ff` (glitch effect, magenta shift)
- **Glow colors**: Bright green (`rgba(0, 255, 100)`, `rgba(0, 255, 140)`) for screen glow effects

### Neutral Colors (Monitor Hardware)
- **Bezel tones**: `#f0f1e2`, `#d8dbc6`, `#babda8`, `#a5a994` (off-white to taupe gradient)
- **Glass/screen border**: `#21231f` (dark gray-green)
- **Structural grays**: `#696d60`, `#d2d4c4`, `#8f947f`, `#d0d3bd`, `#a5aa92`, `#7f836f`, `#c4c8b1`, `#9ea28a`, `#727662` (monitor hardware spectrum)

## Typography

### Font Family
- **Primary (all content)**: "VT323", monospace (Google Font or local fallback)
  - Evokes 1980s terminal/bitmap aesthetic
  - Consistent character width essential for pseudo-glitch effects
  - Weight: Regular only (no bolding for contrast; use color instead)

### Type Hierarchy

**Text Rendering:**
- All text uses monospace exclusively
- Hierarchy achieved via:
  - **Scale**: 0.75rem (body) → 1rem (subheading) → 1.5rem (heading) → 2rem (hero)
  - **Color brightness**: Dim greens for body, bright greens for emphasis
  - **Letter spacing**: None (authentic terminal spacing)

**Copy Principles:**
- Short, scannable lines (terminal-style)
- Declarative tone ("Skills:", "Projects:", "Contact")
- No em dashes (use colons, periods, commas)
- Glitch text uses `data-text` attributes for pseudo-element duplication

## Spacing & Layout

### Sizing Units
- Emphasis on `rem` units (base 16px)
- Responsive padding: `clamp(1rem, 1.5vw, 1.5rem)` (fluid scaling)
- Component gaps: `0.4rem` to `0.85rem` (tight, terminal-like spacing)
- Vertical rhythm: `0.35rem` (tags), `0.5rem` (list items), `1rem` (cards), `1.5rem` (sections)

### Container & Layout
- **Monitor viewport**: 90vw (responsive), constrained by 3D perspective
- **Screen content**: `calc(100vh - 11rem)` (leaves room for monitor bezel/base)
- **Responsive breakpoint**: 900px (switches to mobile monitor layout)

## Visual Effects & Motion

### CRT Screen Effects
1. **Scanlines**: Repeating 2px transparent + 2px black (15% opacity) horizontal stripes
2. **CRT Flicker**: Green glow scan bar rolling top→bottom, `animation: crt-roll 4s linear infinite`
3. **Grain**: SVG-based turbulence filter (~12% opacity, screen blend mode)
4. **Screen reflection**: Radial gradient overlay (top 45% darker, edges lighter)

### Interactive Animations
- **Hover glow**: Box-shadow with green `#0d3a0d`, `#092109`
- **Glitch effect**: Cyan/purple shifted pseudo-elements, `opacity: 0` normally, animated on hover
- **Scroll reveal**: Y-translation (42px down), blur, desaturate → fade in with cubic-bezier easing
- **Radial hover**: Background color expands from center on hover (green tinted `#1a3a1a`)

### Easing
- Scroll reveals: `cubic-bezier(0.2, 0.8, 0.2, 1)` (anticipatory curve, smooth)
- Transitions: `ease` (default), `steps(2, end)` for discrete glitch shifts
- **No bounce, no elastic, no elastic-in-out** — all curves are smooth or stepped

## Constraints & Bans

### Absolute Bans (Match & Refuse)
- ❌ Gradient text (`background-clip: text`) — all text is single solid color
- ❌ Side-stripe borders (left/right `border-*` >1px) — use full borders or tinted backgrounds instead
- ❌ Glass-morphism as default — rare, purposeful only (slight translucency in screen reflections is OK)
- ❌ Hero-metric template (big number + small label + gradient) — anti-pattern in this domain
- ❌ Identical card grids — vary card heights, background gradients, content layout
- ❌ Modal as first thought — this is a single-page experience; no modals

### AI Slop Check
**Scene sentence**: "Developer using portfolio on a desktop in dim room, reviewing projects and skills on a CRT monitor. Wants to feel transported to 1980s computing era while still seeing modern, sharp design."

**Category-reflex test**: "Retro" portfolios often converge on: neon on black, vaporwave gradients, 80s synthwave clichés. This design differentiates via:
- Authentic CRT monitor shell (not just text effects)
- Restraint with green color (not neon everywhere)
- Monospace-only typography (no title/body contrast)
- Physics-accurate shadows & reflections on the bezel

## Component Tokens

### Monitor Shell
- **Bezel padding**: `clamp(1rem, 1.5vw, 1.5rem)`
- **Border radius**: 24px (rounded, slightly retro)
- **Bezel shadow**: `0 34px 70px rgba(0, 0, 0, 0.52)` (heavy, grounded)
- **Screen glass radius**: 42px top, 58px bottom (elongated oval for screen)
- **Screen glass border**: 7px solid `#21231f`

### Interactive Cards
- **Border**: 1px solid `#0a240a` (inset) / `#146714` (hover)
- **Background**: Linear gradient `135deg, #020202 0%, #071807 100%` (subtle diagonal)
- **Box-shadow**: Inset green glow on hover
- **Glow effect**: Radial mask at mouse position, mix-blend-mode: screen

### Buttons & Controls
- **Tab buttons**: `#146714` background, `#1d8a1d` border, hover to `#188118`
- **Chips**: `#031003` background, `#008f00` text, `#0f2a0f` border
- **Active state**: `#0a2d0a` background, `#00d500` text, `#00aa00` border

### Scrollbar
- **Track**: `#050805` (almost black)
- **Thumb**: `#195a19` (dark green), `border-radius: 999px`

## Implementation Notes

- All effects use CSS pseudo-elements (::before, ::after) to avoid extra DOM nodes
- Masks use `-webkit-mask-image` for broad browser support
- Animations respect `prefers-reduced-motion` (all animations disabled, opacity forced to 1)
- The monitor bezel uses 3D transforms (`translateZ`, `rotateX`) for depth
- Screen content is `position: relative` with `z-index: 1` (above pseudo-layer effects)
