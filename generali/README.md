# Mercer Lighthouse — Dashboard Prototype

A static, front-end prototype of the **Mercer Lighthouse** leadership-assessment platform
(Marsh × Mercer brand). It presents two dashboard **directions** plus a full authentication
flow, all sharing one brand foundation and a live **Tweaks** panel for switching colours,
fonts, theme, and device preview.

> **Design system reference:** see **[DESIGN.md](DESIGN.md)** for the full colour palette,
> typography, and phone/device styles.

---

## Running it

The dashboard pages compile **React JSX in the browser** via Babel (loaded from unpkg), and
Babel fetches the `.jsx` files over HTTP. **You must serve the folder over HTTP** — opening the
files directly with `file://` will not work (the browser blocks the JSX fetches).

```bash
# from the project root
python3 -m http.server 8100
```

Then open **http://127.0.0.1:8100/Lighthouse.html**.

Any static server works (`npx serve`, `php -S`, VS Code Live Server, etc.). No build step,
no `npm install` — everything is plain HTML/CSS/JS + in-browser JSX.

---

## Pages

| File | What it is |
|------|------------|
| **Lighthouse.html** | Landing / directory — pick a direction or start from Login |
| **Login.html** | Sign-in (Participant / SSO / Magic Link) + login-style switcher |
| **Sign Up.html** | Registration |
| **Forgot Password.html** | Password recovery |
| **Folio.html** | **Direction A** — editorial dashboard (midnight rail, big serif greeting) |
| **Peekaboo.html** | **Direction B** — split sky-blue hero + collapsible white rail |
| **Boardroom.html** | Alias of Peekaboo (the landing links here) |

The two dashboards share the **same content and flows** (dashboard → program detail →
assessment / 360° / IDP / scheduling / insights); only the chrome differs.

---

## File structure

```
Lighthouse.html, Login.html, Sign Up.html, Forgot Password.html   ← auth + landing
Folio.html, Peekaboo.html, Boardroom.html                         ← dashboards

design-tokens.json     ← DESIGN TOKENS (W3C JSON) — colours, type, spacing, phone/device, breakpoints
tokens.css             ← the same tokens as CSS variables (one import; includes phone/device tokens)
brand/marsh-tokens.css ← canonical colour scale (Marsh Color Guidelines)
brand.css              ← app runtime: fonts + live theming knobs (what the pages load — see DESIGN.md)
client-brand.(css|js)  ← Marsh / DGE / Generali brand switcher
login-styles.(css|js)  ← the 7 login visual variants (split, cinematic, aura, …)
device-preview.css     ← phone / tablet frames + responsive reflow
cookie-banner.(css|js) ← consent banner + Manage-Cookies panel
language-switcher.js   ← EN / AR (RTL) strings
login-*.js             ← login translations, error states, type switch, loader
radius-tweak.js        ← global border-radius control

tweaks-panel.jsx       ← reusable Tweaks UI shell + controls
lh-tweaks.jsx          ← the Lighthouse Tweaks panel (colours / fonts / theme / device)
app-shared.jsx         ← shared data model (LH) + icon set (I)
app-editorial.jsx      ← Direction A shell (DashEditorial)
app-boardroom.jsx      ← Direction B shell (DashBoardroom)
app-ed-detail/assess/growth/idp/c360.jsx  ← shared flow pages used by both directions

brand/                 ← Mercer Lighthouse logos + client (DGE / Generali) logos + marsh-tokens.css
fonts/                 ← Marsh Serif (display) + Noto Sans (body)
images/                ← login hero, patterns, partner icon
guidelines/            ← Marsh brand guidelines: graphic-guidelines.md + page renders (pages/)

README.md              ← this file
DESIGN.md              ← the full design system (colours, type, tokens, phone styles, graphic language)
```

---

## How the theming works (quick version)

Everything is driven by **CSS custom properties on `:root`** defined in `brand.css`. The
Tweaks panel (bottom-right gear) and the brand switcher just rewrite those variables live —
no rebuild. The five you'll touch most:

| Variable | Role | Default |
|----------|------|---------|
| `--primary` | Rails, headings, solid fills | `#000F47` midnight |
| `--accent`  | Links, active nav, rings, eyebrows | `#0B4BFF` blue |
| `--action`  | Primary CTA fill | `#FFBF00` gold |
| `--canvas`  | Page background | `#F7F3EE` cream |
| `--action-text` | Text on `--action` fills | `#000F47` |

Body text, secondary text, and borders are **derived** from `--primary` with `color-mix`, so
re-tinting the brand re-tints the whole UI. Full details, including the type scale and every
palette value, are in **[DESIGN.md](DESIGN.md)**.

---

## Localisation

English + Arabic, with full **RTL** support (`html[dir="rtl"]`). Strings live in
`language-switcher.js` (app) and `login-translations.js` (auth pages).

---

## Notes / known substitutions

- `images/marsh-login.jpg` is a royalty-free stand-in for the original licensed studio photo.
- The **Cinematic** login variant's background video and the **DGE/Generali** login feature
  photos are not bundled; they fall back to a poster / solid colour panel.
