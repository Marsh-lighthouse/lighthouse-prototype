# Mercer Lighthouse — Design System

Everything here is defined in **`brand.css`** as CSS custom properties on `:root`. Components
read the variables (never hard-coded hex), so re-tinting a variable re-tints the whole UI.
The **Tweaks** panel and the **brand switcher** work purely by rewriting these variables live.

### Token files (for developers)

| File | Format | Use it for |
|------|--------|------------|
| **`design-tokens.json`** | W3C DTCG JSON | The machine-readable source of truth — feed it to Style Dictionary, Figma Tokens, a Tailwind generator, etc. Colours, type, spacing, radius, **device/phone frames**, breakpoints. |
| **`tokens.css`** | CSS custom properties | One-import token layer including the **phone/device tokens** (which were hard-coded in `device-preview.css` before). `@import "tokens.css";` |
| **`brand/marsh-tokens.css`** | CSS custom properties | The canonical colour scale from Marsh's Color Guidelines PDF (full 1000→250 ramps). |
| **`brand.css`** | CSS custom properties | The **app runtime** foundation — fonts + the live theming knobs the pages actually load. |

`tokens.css`, `marsh-tokens.css`, and `brand.css` all agree on values; `brand.css` is what ships
at runtime, the other two are the design-system reference layer.

- [1. Colours](#1-colours)
- [2. Typography](#2-typography)
- [3. Type scale & spacing](#3-type-scale--spacing)
- [4. Themeable tokens (Tweaks)](#4-themeable-tokens-tweaks)
- [5. Side-menu (rail) tokens](#5-side-menu-rail-tokens)
- [6. Client brands](#6-client-brands)
- [7. Phone / tablet & responsive styles](#7-phone--tablet--responsive-styles)
- [8. Login visual variants](#8-login-visual-variants)
- [9. Dark mode](#9-dark-mode)
- [10. Border radius](#10-border-radius)
- [11. Brand principles & graphic language](#11-brand-principles--graphic-language)

---

## 1. Colours

### Brand core
| Token | Hex | Use |
|-------|-----|-----|
| `--midnight` | `#000F47` | Primary brand colour — rails, headings, solid fills |
| `--sky` | `#CEECFF` | Light brand accent, highlights on dark |
| `--white` | `#FFFFFF` | Surfaces |

### Blue scale (accent family)
| Token | Hex |
|-------|-----|
| `--blue-750` | `#0B4BFF` |
| `--blue-500` | `#82BAFF` |
| `--blue-250` | `#CEECFF` |

### Gold — **action only**
Gold signals *action* (CTAs) and nothing else — never body text or decoration.
| Token | Hex |
|-------|-----|
| `--gold-1000` | `#CB7E03` (readable gold text) |
| `--gold-750` | `#FFBF00` (CTA fill) |
| `--gold-250` | `#FFF3DA` (tint) |

### Supporting
| Token | Hex | | Token | Hex |
|-------|-----|-|-------|-----|
| `--green-1000` | `#2F7500` | | `--purple-1000` | `#5E017F` |
| `--green-750` | `#6ABF30` | | `--purple-750` | `#8F20DE` |
| | | | `--purple-500` | `#DEB1FF` |
| | | | `--purple-250` | `#F5E8FF` |

Purple = the **360° Perspective** program accent; green = success / completed states.

### Neutrals — warm, derived from the brand
The base warm neutrals are:
| Token | Hex | Use |
|-------|-----|-----|
| `--ink` | `#3D3C37` | Primary body text on light |
| `--muted` | `#7B7974` | Secondary text / captions |
| `--line` | `#B9B6B1` | Borders / rules |
| `--cream` | `#F7F3EE` | Page canvas |

⚠️ **Important:** on `:root` these three are then **overridden** as tints of `--primary`
(so the whole platform reads as one blue family and re-tints per client brand):

```css
--ink:   color-mix(in srgb, var(--primary) 88%, #ffffff);   /* body text     */
--muted: color-mix(in srgb, var(--primary) 72%, #ffffff);   /* secondary     */
--line:  color-mix(in srgb, var(--primary) 18%, #ffffff);   /* borders/rules */
```

### Status
| Token | Hex |
|-------|-----|
| `--success` | `#14853D` |
| `--danger` | `#C53532` |
| `--warning` | `#FFBE00` |

---

## 2. Typography

Two families, exposed as `--serif` and `--sans`:

| Variable | Stack | Role |
|----------|-------|------|
| `--serif` | `"Marsh Serif", Georgia, "Times New Roman", serif` | **Display** — headlines, section heads, big numerals, quotes |
| `--sans` | `"Noto Sans", system-ui, -apple-system, sans-serif` | **Body / UI** — sub-heads, body, labels, captions |

Rules from the brand's typography guidelines:
- **Marsh Serif is weight 400 only** — never bold. Use generous size + sentence case.
- **Noto Sans**: sub-heads `700`, body `400`, labels/captions `700`. Sentence case throughout.
- Text is predominantly **Midnight Blue / Sky Blue / White**. Gold is action-only.

Headings use the `.serif` class, which reads two swappable knobs so Tweaks can flip the whole
platform between serif and sans headings:
```css
.serif { font-family: var(--heading-family, var(--serif));
         font-weight: var(--heading-weight, 400); }
```

**Fonts are bundled** in `fonts/` and declared via `@font-face` in `brand.css`:
Marsh Serif (`.woff2`, regular + italic) and Noto Sans (variable `.ttf`, weights 100–900).

---

## 3. Type scale & spacing

Platform-wide scale (serif for headings, sans for body/labels).

**Minimum font size = 14px (hard floor).** Per the dev requirement, nothing renders below
14px, and fractional sizes (12.5 / 13.5 / 16.5 …) are not used. Every font size across the
product is `max(14, floor(size))` — so old 8–13.5px text became 14px and `.5` sizes were
rounded down to whole px. (Applied to all `app-*.jsx`, the product CSS, and the login HTML;
the Tweaks/authoring panel is excluded as non-product chrome.)

| Token | Size | Use |
|-------|------|-----|
| `--text-display` | `40px` | Hero / page H1 (serif) |
| `--text-h1` | `28px` | Section heading (serif) |
| `--text-h2` | `21px` | Card title / small heading (serif) |
| `--text-body` | `15px` | Body copy (sans) |
| `--text-small` | `14px` | Small / secondary (sans) — floor |
| `--text-label` | `14px` | Labels / eyebrows / captions (sans, 700) — floor |

Layout:
| Token | Value | Use |
|-------|-------|-----|
| `--content-max` | `848px` | Caps the content column so every routed page lines up |
| `--fol-mx` | `0` \| `auto` | Content horizontal margin — `0` = left-aligned, `auto` = centred (toggled by Tweaks → *Layout*) |

Page wrappers add **56px** horizontal padding; the rail is **256px** expanded / **74px** collapsed.

---

## 4. Themeable tokens (Tweaks)

These five are what the **Tweaks panel** (and brand switcher) rewrite live on `:root`. They are
the knobs to change if you want to re-skin the platform:

| Token | Role | Default | Tweaks options |
|-------|------|---------|----------------|
| `--primary` | Rails, headings, solid fills, and the source of all derived neutrals | `#000F47` | `#000F47` · `#5E017F` · `#2F7500` · `#3D3C37` |
| `--accent` | Links, active nav, rings, eyebrows | `#0B4BFF` | `#0B4BFF` · `#8F20DE` · `#2F7500` · `#CB7E03` · `#000F47` |
| `--action` | Primary CTA fill | `#FFBF00` | `#FFBF00` · `#CEECFF` · `#DFECD7` · `#FFD98A` |
| `--action-text` | Text colour on `--action` fills | `#000F47` | (flips to white for client brands) |
| `--canvas` | Page background tone | `#F7F3EE` | `#F7F3EE` · `#FFFFFF` |

**Tweaks colour swatches → token names.** Every colour swatch in the Tweaks panel is labelled
with its official Marsh colour-guideline token name (scale `1000 → 250`); the name shows on hover
(tooltip + `aria-label`) so a developer can map each Tweak straight to a token:

| Tweaks control | Writes | Swatch options (token · hex) |
|----------------|--------|------------------------------|
| **Primary** | `--primary` | Blue-1000 · Midnight Blue `#000F47` · Purple-1000 `#5E017F` · Green-1000 `#2F7500` · Neutral-1000 `#3D3C37` |
| **Highlights** | `--accent` | Blue-750 `#0B4BFF` · Purple-750 `#8F20DE` · Green-1000 `#2F7500` · Gold-1000 `#CB7E03` · Blue-1000 · Midnight Blue `#000F47` |
| **CTA fill** | `--action` | Gold-750 `#FFBF00` · Blue-250 · Sky Blue `#CEECFF` · Green-250 `#DFECD7` · Gold-500 `#FFD98A` |
| **Canvas** | `--canvas` | Neutral-250 · Cream `#F7F3EE` · White `#FFFFFF` |

(Names come from `brand/marsh-tokens.css` / `design-tokens.json` — the same scale as the swatch
chart in the Color Guidelines PDF.)

Other Tweaks controls: **Heading font** (Serif ⇄ Sans), **Side menu** (Midnight ⇄ White),
**Layout** (Left ⇄ Center), **Appearance** (Light ⇄ Dark, Folio only), **Border radius**, and
**Device preview** (Desktop / iPad / Mobile).

---

## 5. Side-menu (rail) tokens

The side rail is themed independently (Tweaks → *Side menu*: Midnight or White):

| Token | Midnight (default) | White |
|-------|--------------------|-------|
| `--rail-bg` | `var(--primary)` | `#FFFFFF` |
| `--rail-fg` | `rgba(255,255,255,.62)` | `var(--primary)` |
| `--rail-icon` | `rgba(255,255,255,.5)` | `var(--primary)` |
| `--rail-active-bg` | `rgba(206,236,255,.14)` | `rgba(11,75,255,.08)` |
| `--rail-active-fg` | `#ffffff` | `#000F47` |
| `--rail-active-icon` | `#CEECFF` | `#0B4BFF` |
| `--rail-border` | `rgba(255,255,255,.08)` | `rgba(0,15,71,.10)` |

---

## 6. Client brands

The brand switcher (`client-brand.js`, chip in the bottom control bar) overrides the colour
tokens and swaps logos. Active brand is set via `html[data-client-brand="…"]`; **Marsh** is the
default and owns the tokens from §4.

| Brand | `--primary` | `--accent` | `--action` | `--action-text` |
|-------|-------------|-----------|-----------|-----------------|
| **Marsh** (default) | `#000F47` | `#0B4BFF` | `#FFBF00` | `#000F47` |
| **DGE** | `#81A0BD` | `#54779B` | `#81A0BD` | `#FFFFFF` |
| **Generali** | `#AA1B17` | `#AA1B17` | `#AA1B17` | `#FFFFFF` |

**Client brands + text (WCAG 2.1 AA).** The client primaries are reserved for **fills**
(buttons, badges) and the **side rail** only — they must never carry running text (DGE
steel-blue is ~2.6:1 on white, failing AA). So under a client brand, `client-brand.css`
neutralises the text tokens to greys that pass AA on the cream/white canvas:

| Token | Client-brand value | Contrast (on cream) |
|-------|--------------------|---------------------|
| headings / body (`--ink`, inline `color:var(--primary)`) | `#262626` | ≈13:1 (AAA) |
| secondary (`--muted`) | `#595959` | ≈6:1 (AA) |
| borders (`--line`) | `#D4D4D4` | — |

Marsh keeps its **blue-tinted** neutrals (which already pass AA), so its text stays on-brand.
When a client brand is active it **owns** the colour variables and the Tweaks colour controls
step aside. (Login form titles/labels colour via stylesheet, so they're neutralised too.)

> **General WCAG note:** the CTA label colour (`--action-text`) auto-switches to white on dark
> fills / midnight on light fills (see §4), and small status/accent text uses the accent colour,
> which meets AA for Marsh blue, DGE steel (as an accent, not body text), and Generali red.

**Side-rail contrast (WCAG 2.1 AA · 1.4.3 / 1.4.11).** The rail fill is `--primary`, so its
foreground must adapt to the brand: `lh-tweaks.jsx` computes the primary's relative luminance
and, above the ~0.18 crossover (DGE steel `#81A0BD` ≈ 0.335), flips the rail text/icons from
white to **dark ink** — white on steel is only ~2.7:1. Opacities were also raised across the
board (nav labels `.62→.78`, icons `.5→.72`, group headers `.5→.72`; the old group value was
~4.4:1, below AA). Measured: Marsh midnight rail 8–18:1; DGE steel rail 4.4–6.6:1 — all pass.
`brand.css` holds the same raised defaults for first paint. The `White` side-menu preset also
darkened its group header (`#9A9892 → #6B6A64`) and border to pass.

**Keyboard operability + focus (WCAG 2.1 · 2.1.1 / 2.4.7).** Rail nav items were click-only
`<div>`s (not focusable); they now carry `role="button"`, `tabIndex={0}`, `aria-current`, and an
Enter/Space `onKeyDown` (both `EdRail` and `BRail`). A global `:focus-visible` ring (in
`brand.css`) gives every interactive element a visible keyboard indicator — scoped to
`--rail-active-fg` inside the rail so it stays visible on either a dark or light rail fill.

**Small muted text.** The Marsh **Neutral-750** primitive (`#7B7974`) is ~4.2:1 on cream — it
stays in the palette, but text usages (chrome menu labels, chips) were darkened to `#6D6B66`
(≈4.8–5:1). Accent "In progress"/status pills were made **opaque** (`accent 10–12% + #fff`
instead of `… transparent`) so their text contrast no longer depends on the backdrop behind them.
Status green `--success` was darkened `#14853D → #0E7A38` (11px ✓ labels were ~4.1:1).

**`--surface-deep` — dark decorative panels under a light client primary.** Video heroes, the
dashboard progress panel, avatars, chat bubbles and the FAB paint a *dark surface* + white text
(via `eMID`/`bMID` = `var(--primary)`). That assumes a dark primary — true for Marsh navy and
Generali red, but DGE's steel `#81A0BD` is light, so white dropped to ~2.7:1. Those **backgrounds**
now use `--surface-deep` (defaults to `--primary`; DGE overrides it to `#16283D`), while
`color: var(--primary)` **text** stays neutralised. Client CTAs follow the same rule: DGE's
`--action-text` and `.lg-btn` text are dark navy (white on steel failed), Generali stays white on
red. Semi-transparent white labels on those surfaces were raised to `.82` so they also clear AA on
the *lighter* Generali red.

**Verified.** An automated per-node contrast sweep (WCAG 1.4.3 thresholds, alpha-composited
backgrounds) was run across every screen — the 3 login pages, the Folio dashboard (all 5 card
samples) + program flow + IDP/scheduling/insights + 360, and the Peekaboo boardroom + its pages —
in **all three brands** (Marsh, DGE, Generali). All report **zero** text-contrast failures. (The
only excluded item is the `← All directions` design-gallery nav chip injected outside the app root.)

### Dark mode — real per-brand tokens (not a filter)

Dark mode used to be a `filter: invert(1) hue-rotate(180deg)` hack: off-brand colours and
impossible to verify (CSS filters aren't visible to computed-style tooling). It's now a proper
**token theme**, derived (no official brand dark spec) and contrast-verified like light mode.

**Split of responsibility** (because inline styles beat any stylesheet):
- **CSS tokens** (`dark-theme.css`, on `html[data-theme="dark"]`): `--card #151E30`, `--surface-deep
  #1E2C46`, `--ink #E9EEF6`, `--muted #A4B2C6`, `--line rgba(255,255,255,.15)`, `--sky-surface
  #1C2A44`, brightened status text (`--success/--danger/--warning`), plus a light-ink flip of the
  client text-neutralisation and a safety net for straggler white backgrounds.
- **Inline tokens** (theme-aware JS in `lh-tweaks.jsx` for Marsh + rail, `client-brand.js` for
  clients, both reading `data-theme`): `--canvas #0B1220`, a light `--primary` for emphasis text,
  a brighter `--accent` (Marsh `#7BA6FF`), gold CTA kept, and a dark rail for every brand.

**Token overloads resolved.** A single brand token can't be both a dark *surface* and dark *text*
in dark mode. So surfaces were split off into their own tokens: `--card` (was inline `#fff` ×96),
`--surface-deep` (dark decorative panels), `--sky-surface` (Peekaboo's sky panels/active nav),
and solid `--success-fill`/`--danger-fill` (status badges that carry white content, kept dark in
both modes while the *text* `--success`/`--danger` lighten). Input text moved from `#3D3C37` to
`--ink`.

**Result:** the contrast scan runs natively in dark mode (real colours) and reports **zero**
failures across Folio + Peekaboo, all three brands, both themes. Photos are left untouched (no
counter-inversion), gold stays gold, and each brand keeps its hue family.

---

## 7. Phone / tablet & responsive styles

All device framing + reflow lives in **`device-preview.css`**, driven by an attribute the
Tweaks *Device preview* control sets:

| State | Attribute | Frame |
|-------|-----------|-------|
| **Desktop** | *(no attribute)* | Full width, no bezel |
| **Mobile** | `html[data-device="mobile"]` | **390 × 844** phone, 11px bezel, `44px` radius, dark stage |
| **iPad** | `html[data-device="ipad"]` | **1024 × 1366** tablet, 13px bezel, `28px` radius |

Two layers apply per device:

**1. Frame** — `#root` (or `.lg-split` on auth pages) is wrapped in a bezel on a `#000F47`
stage. Floating controls are anchored `position:absolute` to the frame (not `fixed`) to avoid a
Chrome `zoom` repaint bug.

**2. Reflow** (mobile, 390px) — the practical rules a developer will reuse:
- Side rail / sidebar **collapses away** (`.ed-rail`, `.lh-rail` → `display:none`); a slim
  brand bar / hamburger top bar replaces it.
- Every multi-column inline grid **stacks to one column**
  (`[style*="grid-template-columns"] → 1fr`).
- 3-up **stat strips stay one row** but shrink to fit; headings scale down
  (`h1 → 33px`, `h2 → 23px`).
- Page gutters tighten to **18px** (`--fol-px: 18px`); tablet uses **30px**.
- Full-screen modals / popovers are re-anchored **inside the device frame**.
- The weekly calendar keeps 7 columns and scrolls horizontally instead of collapsing.

**CSS breakpoints** used elsewhere (not the device frame):
| Breakpoint | Where | Effect |
|------------|-------|--------|
| `max-width: 980px` | Landing grid | 3 cols → 2 |
| `max-width: 920px` | Landing / auth | 1 col; login hides the feature panel, hero shrinks |

Chrome classes are shared across both directions so one rule set covers them:
`.lh-rail` / `.lh-topbar` / `.lh-page` and the Folio `ed-*` family.

---

## 8. Login visual variants

`Login.html` / `Sign Up` / `Forgot Password` share **7 background styles**, switched by the
chip in the control bar (stored in `localStorage["lh-login-style"]`, applied via
`html[data-login-style="…"]` — `split` is the default and needs no attribute):

| Variant | Look |
|---------|------|
| **split** *(default)* | Form left, feature photo right |
| **spotlight** | Photo full-bleed, white centred card |
| **cinematic** | Full-bleed video, midnight glass card *(video not bundled → poster)* |
| **midnight** | Dark AI ambience — animated rotating gradients + aurora blobs |
| **showcase** | Minimal form + ghosted desktop product mock over the M-pattern |
| **celestial** | Animated night sky — stars, shooting stars, neural constellation, nebulae |
| **aura** | Framed AI-plexus video card on a white border |

Dark variants (cinematic / midnight / celestial) flip form text, labels, and footer to light,
and the language switcher to an outline button.

---

## 9. Dark mode

Folio, Peekaboo and Boardroom support a dark theme on `html[data-theme="dark"]`. It is a **real
per-brand token palette** (derived — no official brand dark spec yet), **not** a filter. Every
value below is WCAG 2.1 AA verified by the contrast scan, in all three brands. This section is the
authoritative colour reference.

**Toggle / plumbing.** Folio: Tweaks → *Appearance*; Peekaboo/Boardroom: the top-bar ☀/☾ button.
State in `localStorage["lh-theme"]`, broadcast via the `lh-theme-change` event.
**Where each token is applied** (inline styles beat stylesheets, so it's split):
- **CSS-set** (`dark-theme.css`, `html[data-theme="dark"]`): surfaces, text, borders, status.
- **Inline-set, theme-aware JS** (`lh-tweaks.jsx` = Marsh + rail, `client-brand.js` = clients, both
  read `data-theme`): `--canvas`, `--primary`, `--accent`, `--action`, `--action-text`, `--rail-*`.

### 9.1 Core tokens — light vs dark (brand-agnostic)

| Token | Light | Dark |
|-------|-------|------|
| `--canvas` (page) | `#F7F3EE` | `#0B1220` |
| `--card` (surface) | `#FFFFFF` | `#151E30` |
| `--surface-deep` (dark panels) | `= --primary` | `#1E2C46` |
| `--sky-surface` (Peekaboo panels/active nav) | `#CEECFF` | `#1C2A44` |
| `--ink` (body/heading text) | `color-mix(--primary 88%, #fff)` ≈ `#1F2C5D` | `#E9EEF6` |
| `--muted` (secondary text) | `color-mix(--primary 72%, #fff)` ≈ `#47527B` | `#A4B2C6` |
| `--line` (borders) | `color-mix(--primary 18%, #fff)` ≈ `#D1D4DE` | `rgba(255,255,255,.15)` |
| `--success` / `--danger` / `--warning` (**text**) | `#0E7A38` / `#C53532` / `#FFBE00` | `#46D07C` / `#FF7B7B` / `#FBBF24` |
| `--success-fill` / `--danger-fill` (**badges, white content**) | `#0E7A38` / `#C0322F` | *(same — dark in both)* |
| `--accent-2` (secondary accent — Marsh Purple-750, stat highlights) | `#8F20DE` | `#C89BF2` |
| `--on-accent` (content ON an accent/success fill — e.g. step circles) | `#FFFFFF` | `#0B1220` |

*Client brands override `--ink`/`--muted`/`--line` to neutral greys in light mode (`#262626` /
`#595959` / `#D4D4D4`); in dark mode all brands take the dark values above.*

### 9.2 Brand colours — light vs dark

`--primary` and `--accent` below drive **fills / active states**; client-brand **running text** is
neutralised (light `#262626`, dark `#E9EEF6`) — see §6.

| Brand | Token | Light | Dark |
|-------|-------|-------|------|
| **Marsh** | `--primary` | `#000F47` | `#DCE6F8` |
| | `--accent` | `#0B4BFF` | `#7BA6FF` |
| | `--action` (CTA) | `#FFBF00` | `#FFBF00` |
| | `--action-text` | `#000F47` | `#0B1220` |
| **DGE** | `--primary` | `#81A0BD` | `#9DBBD8` |
| | `--accent` | `#54779B` | `#9DBBD8` |
| | `--action` (CTA) | `#81A0BD` | `#81A0BD` |
| | `--action-text` | `#000F47` | `#0B1220` |
| **Generali** | `--primary` | `#AA1B17` | `#F0A6A2` |
| | `--accent` | `#AA1B17` | `#FF8A85` |
| | `--action` (CTA) | `#AA1B17` | `#D23A34` |
| | `--action-text` | `#FFFFFF` | `#FFFFFF` |

### 9.3 Rail (side menu) — dark

In dark mode every brand gets a dark rail: `--rail-bg #0B1526`, `--rail-fg rgba(255,255,255,.82)`,
`--rail-icon rgba(255,255,255,.75)`, `--rail-active-fg #fff`, `--rail-active-icon` = the brand's
light accent (Marsh `#A9C7F0`, DGE `#9DBBD8`, Generali `#FF8A85`), `--rail-group
rgba(255,255,255,.7)`, `--rail-border rgba(255,255,255,.1)`. (Light-mode rail values are in §4.)

### 9.4 Tweaks relationship

The **Tweaks colour pickers edit the LIGHT palette only** (*Primary*, *Highlights*, *CTA fill*,
*Canvas* — named against the Marsh token scale). Dark mode uses the fixed derived palette in
§9.1–9.3 and is **not** editable. For in-app checking, the Tweaks panel has a read-only
**"Dark palette · reference"** section (`DarkPaletteRef` in `lh-tweaks.jsx`): labeled swatches +
hex for the active brand's dark values, updating live with the brand chip. It mirrors this table —
if the two ever diverge, this table is authoritative. If official brand dark specs arrive later,
drop them into `dark-theme.css` + the two JS palettes **and** `DarkPaletteRef`.

---

## 10. Border radius

A single global control (`radius-tweak.js`, Tweaks → *Border radius* slider, `0–20px`, default
`8px`) sets a uniform radius on every box/button/input/panel via an `!important` stylesheet rule
(so it wins over inline styles and also covers nodes React mounts later). True circles
(`border-radius:50%` — avatars, dots, rings) are excluded. State: `localStorage["lh-radius"]`
(absent = native varied radii).

---

## 11. Brand principles & graphic language

Source: **Marsh Visual Guidelines — Graphic** (`guidelines/graphic-guidelines.md` + the
`graphic-guidelines.pdf` and page renders in `guidelines/`). Every graphic element is built from
the **Marsh symbol (the "M")** and used *with purpose and restraint* — clear, confident, consistent.

### Foundational principles
- **Lead with the core colours** — Sky Blue + Midnight Blue + White. **Gold = action only**, used sparingly.
- **Limited palette** and **generous whitespace**.
- **No gradients, shadows, or transparency** on graphic elements. *(The UI honours this — flat
  surfaces, thin rules; the only gradients/animation live in the optional decorative **login
  background variants**, §8, which are deliberately outside the core system.)*

### The frame
The most recognizable brand element; the primary entry point on high-impact communications.
- **Default:** consistent side margins; the image area is ~half the canvas height and **always
  touches the bottom edge**; default frame colour **Sky Blue**.
- **Extended frame:** height may flex to the format, but structure stays clear and intentional.
- **Alternative layouts:** *Reverse*, *Top-aligned*, *Reverse top-aligned*.
- **Colours:** Sky Blue (default), White, or Midnight Blue — chosen for contrast against the image.

### Window treatment
Marsh logo / M / arrow at large scale with imagery placed inside it. Used **with restraint** for
special moments; **always with the Marsh logo**, never as a decorative device.

### Arrow graphic
Formed by flipping both sides of the M into a forward-pointing arrow — growth, progress, momentum.
Use for directional cues; **always use approved arrow assets, never recreate it**.

### Patterns
Built from the **M symbol** (mirrored to form the arrow motif); consistent spacing, orderly.
Patterns support the design, never dominate. Two modes — **Expressive** (multicolour: core
palette + one accent on the M; covers / large environments) and **Discreet** (single-colour,
softer, finer scale; backgrounds / supporting layouts). **Never mix expressive and discreet in one
layout.** *(Pattern asset in the repo: `images/m-pattern.png`, used by the Showcase login variant.)*

### Line elements
Structure content and hierarchy. **Always thin — 1px digital / .25pt print** (the UI's `--line`
token). Group information, guide the eye, separate sections, or underline links/key statements.
**Never decorative.**

### Avoid
- Distorting or over-scaling the frame or supergraphic.
- Inconsistent side-margin widths; frames not aligned to the grid.
- Using multiple graphic elements at once without distinct purposes.
- Overusing the M (impact, not dominance).
- Mixing expressive and discreet patterns in a single layout.
- Treating the frame or line elements as decorative borders.
- **Gradients, shadows, or transparency on any graphic element.**
