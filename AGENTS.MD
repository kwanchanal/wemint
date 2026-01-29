# AGENTS.MD — wemint.app

## Product Overview

**wemint.app** is a bio-native monetization platform that turns a single bio link into a pay‑ready creator portfolio. We believe a bio + portfolio should express the creator’s identity, taste, and brand, so wemint.app strongly supports that layer. It combines tipping (Mint), link‑in‑bio, affiliate carts, and a lightweight digital storefront into one conversion‑optimized page.

### Core Thesis

> Creators shouldn't have to "go somewhere else" (a marketplace) to sell. The sale should happen where attention already lives: the bio link.

### Strategic Truth

> **Payment is the product—not just the page.**
> You get paid directly and instantly to your own wallet or bank. wemint.app never holds funds.
> Bio + portfolio express identity and taste; monetization should reinforce that brand, not replace it.

---

## What It Does

A single bio link where supporters can:

- **Discover** — View the creator's work, identity, and portfolio
- **Support** — “Mint” to tip + leave a short message + email
- **Browse** — Explore products and affiliate picks
- **Pay** — Complete payment instantly (wallet-first, bank second)
- **Download** — Get instant delivery
- **Book** — Schedule calls (optional)

---

## Problems We Solve

| Problem | Current Pain | Our Solution |
|---------|--------------|--------------|
| Marketplace dependency | Fees, algorithms, platform-owned audience | Creator owns the relationship |
| Global payout friction | Limited processors, KYC pain, slow withdrawals, cross-border failures | Wallet‑first payments + direct settlement |
| Bio links don't convert | Missing trust + identity + checkout | All-in-one conversion flow |
| Bank details don't sell | No story/portfolio/instant delivery | Payment-ready portfolio |

---

## What We Replace

- ❌ "List of links" that doesn't convert (too many steps)
- ❌ Non-branding bank account numbers or QR-only sharing
- ❌ Marketplace dependency for payouts and customer access

---

## Differentiators (Wedge)

### Payments‑First + Conversion‑First

- **Bio-native checkout** — Designed to maximize completion, not just page customization
- **Direct‑to‑creator payments** — Wallet‑first (crypto wallet primary, bank details fallback)
- **Low fees** — Optimized for small-ticket digital goods / micro-transactions
- **0% fee on donations** — When paid in USDC/USDT (no platform cost)
- **Instant settlement** — Direct to creator wallet/bank (wemint does not hold funds)
- **Trust & clarity** — License summaries, receipts, secure downloads, instant delivery

---

## Target Users

### Primary: Digital Creators Selling Downloads

- Templates, presets, icon packs
- Figma resources, design assets
- Ebooks, guides, PDFs
- 3D assets, models

### Especially Those Who Are:

- Creators with existing social audiences
- Cross-border sellers
- Creators in regions with payout constraints

### Supporter Value Proposition

> One click from social → Mint/support → optional message + email → instant delivery (if any), with clear licensing to reduce hesitation — all in a branded creator space.

---

## North Star Metric

### Time-to-First-Dollar

`Setup → First Sale from Bio`

All product decisions should optimize for reducing this time.

---

## Defensibility / Moat

1. **Payment success rate** — Measurable improvement over alternatives
2. **Settlement speed** — Faster than traditional processors
3. **Global access** — Work where others can't
4. **Risk controls** — Trust tiers / payout holds to keep fast payouts sustainable

---

## Architecture Principles

When building features, prioritize:

1. **Conversion over customization** — Every UI decision should reduce friction to purchase
2. **Payment reliability** — Checkout must never fail silently
3. **Instant gratification** — Downloads and confirmations must be immediate
4. **Trust signals** — Licensing, receipts, and security must be visible
5. **Global-first** — Assume cross-border; don't assume specific payment methods
6. **Identity-first** — Bio + portfolio should elevate creator taste and brand

---

## Development Guidelines

### Feature Prioritization

Ask: "Does this reduce time-to-first-dollar?"

### Checkout Flow

- Minimize steps
- Never redirect away from the bio page unnecessarily
- Show clear pricing and licensing upfront
- Provide instant feedback on payment status

### Payouts

- Design for multiple payout methods
- Build trust-tier system from the start
- Handle edge cases for regions with banking limitations

### Digital Delivery

- Secure, expiring download links
- Clear license terms attached to every download
- Receipt generation is mandatory

---

## Key Terminology

| Term | Definition |
|------|------------|
| Bio link | The single URL creators share in social profiles |
| Mint | Tip/support payment to a creator |
| Get minted | CTA used to encourage support |
| Bio-native | Designed specifically for the bio link context |
| Micro-transaction | Small-ticket purchases (typically < $20) |

---

## Success Metrics

- Time from signup to first sale
- Checkout completion rate
- Payment success rate by region
- Average settlement time
- Creator revenue per bio view

---

## Current Implementation

### Live Demo

🔗 **https://kwanchanal.github.io/wemint/**

### Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Icons**: Google Material Symbols
- **Fonts**: Google Sans
- **Hosting**: GitHub Pages
- **Storage**: localStorage (demo)

---

## Pages & Features

### 1. Dashboard (`dashboard.html`) — One‑Page Control Center (Demo)

Creator's main control panel + live bio preview.

**Core UI**
- Sidebar with collapsible sections (Biography, Monetize, Interactive, DApp, Appearance)
- Live phone preview of the bio page
- Rotating top banner message
- Sidebar signup card (“Love it? Sign Up…”)

**Link Management**
- Add/edit/delete links
- Enable/disable each link
- Layout picker (Classic / Featured)
- Preview updates in real time

**Profile & Social**
- Profile edit modal: Display name, Username (preview URL), Bio
- Social link slots (Instagram, TikTok, YouTube, X, Facebook, Discord)
- Social link modal (URL input) with localStorage persistence

**Design / Appearance**
- Design modal via “+ Design”
- Controls:
  - Profile Image URL
  - Background Image URL
  - Background Color (with color picker)
  - Button Color (links + CTA)
  - Profile Font Color
  - Button Font Color
- Reset to default green theme

**Footer Lock**
- wemint.app footer toggle is locked
- Attempt to disable shows tooltip: “Upgrade to Unlock”

---

## File Structure

```
wemintv2/
├── dashboard.html      # Creator dashboard + live preview (demo)
├── styles.css          # Global styles
├── app.js              # JavaScript functionality
├── favicon/            # Favicon assets
│   └── cookie.svg
├── AGENTS.MD           # This file
└── image/              # Reference images
```

---

## Data Storage

Settings are stored in `localStorage`:

| Key | Description |
|-----|-------------|
| `wemint_profile` | Display name, username, bio |
| `wemint_links` | Links data for dashboard + preview |
| `wemint_social_links` | Social link URLs by platform |
| `wemint_appearance` | Colors, images, font colors for preview |

---

## Design System

### Colors

| Variable | Default | Usage |
|----------|---------|-------|
| `--primary` | `#6366f1` | Buttons, links, accents |
| `--primary-dark` | `#4f46e5` | Hover states |
| `--accent` | `#10b981` | Success, positive actions |
| `--bg-primary` | `#f8fafc` | Page background |
| `--bg-secondary` | `#ffffff` | Cards, modals |
| `--text-primary` | `#0f172a` | Headings |
| `--text-secondary` | `#475569` | Body text |

### Typography

- **Font**: Google Sans (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Visual Direction

- **Identity-first** — Encourage creators to signal taste, style, and brand at a glance
- **Soft commerce** — Payments feel native to the bio, not a separate marketplace

### Components

- Cards with subtle shadows
- Apple-style minimal scrollbars
- Phone preview mockup
- Toggle switches
- Modal system (links, profile, social, design)

---

## Roadmap / TODO

### Phase 1 - MVP ✅
- [x] Bio page with products
- [x] Checkout flow (demo)
- [x] Dashboard with stats
- [x] Appearance customization
- [x] Profile settings
- [x] Social links management
- [x] Live preview

### Phase 2 - Backend Integration
- [ ] User authentication
- [ ] Database for products/orders
- [ ] Real payment processing (Stripe/Omise)
- [ ] File upload for digital products
- [ ] Email notifications

### Phase 3 - Advanced Features
- [ ] Analytics dashboard
- [ ] Multiple product types (courses, memberships)
- [ ] Custom domains
- [ ] Affiliate/referral system
- [ ] API for integrations

---

## References

UI/UX inspiration from:
- Beacons.ai
- Linktree
- Stan Store
- Gumroad

Screenshots available in `/reference` folder.
