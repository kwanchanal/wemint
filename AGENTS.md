# AGENTS.md — wemint.link
this repository contanins pages for 'wemint.link', a platform to create links that provide digital touchpoint for individuals and brands, no fancy digital design background needed.

## Product Philosophy
Most people don’t need a full website.
They just need a simple page that works.

Most people don’t know how to start one.
wemint.link removes that friction completely.

## Core product

- `wemint.link` helps people create a landing link in minutes.
- One shareable link to a simple page with profile, links, media, and contact entry points.
- Built for individuals and small brands to create their first digital touchpoint quickly.
- Manage inbound interest and basic analytics in one place.

## Each page includes:
- Basic identity (name, image, short description)
- Key links or services
- Clear call-to-action (CTA)

## In this repo
- Static HTML/CSS/JS pages (no build step required).
- Primary screens:
  - `dashboard/dashboard.html` — dashboard including personal preview
  - `dashboard/discover.html` — pre-built design themes to give you some idea

### Inbox (Core)
- Visitors can contact directly from the page
- No login required
- Works as a simple inquiry tool

### Live Preview
- Mobile-first preview
- Reflects real user experience

## Design Direction
- Clean, light UI with a subtle dot background. Referenced from 

## Assets
- Shared images/icons in `asset/` (favicons, phone mockups, QR, profile).
- Dashboard-specific assets live in `dashboard/image/`, `dashboard/favicon/`, `dashboard/social-icons/`.

## Run locally
- Open `globe/globe.html` or `dashboard/dashboard.html` in a browser.
  - Example: double-click the file or serve with any simple static server.

## Editing Notes
- Keep HTML semantic and accessible (labels, headings, button text).
- Prefer simple, readable CSS; avoid heavy dependencies.
- Maintain the dot background to align with the existing brand feel.
- Dashboard features to preserve:
  - Drag-and-drop reordering of links with inbox section included.
  - Inbox layout choices (Classic inline link, Banner bottom bar).
  - Preview phone with bottom-sheet form for Inbox.
  - Edit profile modal with visibility toggles (profile image, name, bio, social icons).
  - Social icons + WEMINT.LINK/YOU/>_MAKE YOURS footer group pinned to the bottom of the preview.

---

## Repo structure

```
wemintlink/
├── index.html / index.css / index.js    # Public landing page
├── dashboard/                           # Main dashboard app
│   ├── dashboard.html                   # Editor with live phone preview
│   ├── discover.html                    # Theme gallery
│   ├── app.js                           # Core dashboard logic (~2,457 lines)
│   ├── styles.css                       # Dashboard styles (~3,073 lines)
│   ├── image/                           # Dashboard UI images and phone frames
│   ├── favicon/                         # Dashboard favicons
│   └── social-icons/                    # Social media SVG icons
├── globe/                               # Standalone pixel globe demo
├── theme/                               # Portfolio theme previews (01–05, kwan)
│   └── *-assets/                        # Bundled SVGs per theme
├── asset/                               # Shared global assets (favicons, mockups, profiles)
├── flash/                               # Flash card carousel images
├── mockup/                              # Marketing images and banners
└── postit/                              # Desktop-only warning image
```

---

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Public landing page: hero, orbit avatars, flash card carousel, feature cards, pricing, CTA |
| `dashboard/dashboard.html` | Core dashboard: link editor, live phone preview, profile/inbox/appearance editors |
| `dashboard/discover.html` | Theme gallery: browse all available portfolio themes |
| `globe/globe.html` | Standalone animated pixel globe (canvas-based, decorative) |
| `theme/01.html` – `theme/05.html` | Standalone themed portfolio previews with bundled SVG assets |
| `theme/kwan.html` | Kwan's personal portfolio theme |

---

## Feature spec

### Dashboard — Link management
- Add, edit, delete links with label, URL, and icon
- Drag-and-drop reorder — inbox section moves with its position in the list
- Visibility toggle per link

### Dashboard — Profile editor
- Avatar upload with image cropping (Cropper.js)
- Name, bio, social icon links
- Per-field visibility toggles (profile image / name / bio / social icons)

### Dashboard — Appearance editor
- Theme picker that loads bundled SVG assets from `theme/*-assets/`
- Background color, button style/color, font color via color picker
- Live preview syncs instantly — no save button needed

### Dashboard — Inbox configuration
- Field picker modal: add/remove/reorder form fields (name, email, phone, message, etc.)
- Layout choice: **Classic inline link** (shows link in page) or **Banner bottom bar** (sticky CTA bar)
- Visitors submit without login; no backend — submissions handled externally

### Dashboard — Banner manager
- Carousel of promotional items
- Each banner: image, title, price, link
- Add / remove / reorder

### Dashboard — Live phone preview
- iPhone mockup frame rendered via `dashboard/image/frame/` PNGs
- All editor inputs sync to preview in real-time
- Mobile-first — reflects real visitor experience

### Landing page — `index.html`
- Orbit avatar animation around a globe
- Flash card image carousel (6 images, auto-rotate every ~3s)
- Typing effects ("YOU", contact section)
- Scroll-reveal via IntersectionObserver
- Responsive mobile nav

---

## Architecture

### State management
`app.js` manages all state through `localStorage`. No backend, no API calls.

| Key area | What's stored |
|----------|--------------|
| Profile | name, bio, avatar, social links, per-field visibility |
| Links | ordered array: label, URL, icon, visibility |
| Appearance | theme ID, background color, button style/color, font color |
| Inbox | field definitions, layout choice |
| Banners | ordered array: image, title, price, link |

### Theme system
Each theme in `theme/` has a matching `*-assets/` folder with SVG components. Dashboard loads these dynamically by theme ID. Each theme also has a standalone `theme/0N.html` for direct preview.

### No build tooling
External libraries via CDN only — no npm, no webpack, no framework:
- **Cropper.js** — image cropping
- **html2canvas** — screenshot/export
- **tweakcn live-preview** — theme preview utility
- **Google Material Symbols** — icons

---

## CSS system

- `dashboard/styles.css` uses CSS custom properties throughout:
  `--background`, `--foreground`, `--primary`, `--accent`, `--radius`
- `index.css` handles landing page only — do not mix scopes
- New dashboard UI should use existing custom properties, not hardcoded values

