# AGENTS.md — wemint.link

This repository contains the static front-end pages for `wemint.link`, a payment-link experience that lets creators and small businesses share a personalized link with a QR code, profile, and message.

## What this repo is
- Static HTML/CSS/JS pages (no build step required).
- Primary screens:
  - `checkout/checkout.html` — Payment Link Generator UI (form + live preview).
  - `globe/globe.html` — Marketing home page with dot background theme.
  - `dashboard/dashboard.html` — Creator dashboard mock (profile, links, inbox layout, preview phone).

## Design direction
- Clean, light UI with a subtle dot background.
- Friendly, creator-first tone.
- Emphasis on clarity and fast setup.
- Dashboard UI leans toward neutral gray surfaces and crisp controls.

## Assets
- Shared images/icons in `asset/` (favicons, phone mockups, QR, profile).
- Dashboard-specific assets live in `dashboard/image/`, `dashboard/favicon/`, `dashboard/social-icons/`.

## Run locally
- Open `checkout/checkout.html`, `globe/globe.html`, or `dashboard/dashboard.html` in a browser.
  - Example: double-click the file or serve with any simple static server.

## Editing notes
- Keep HTML semantic and accessible (labels, headings, button text).
- Prefer simple, readable CSS; avoid heavy dependencies.
- Maintain the dot background to align with the existing brand feel.
- Dashboard features to preserve:
  - Drag-and-drop reordering of links with inbox section included.
  - Inbox layout choices (Classic inline link, Banner bottom bar).
  - Preview phone with bottom-sheet form for Inbox.
  - Edit profile modal with visibility toggles (profile image, name, bio, social icons).
  - Social icons + WEMINT.LINK/YOU/>_MAKE YOURS footer group pinned to the bottom of the preview.
