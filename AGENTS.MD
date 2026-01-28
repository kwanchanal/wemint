# AGENTS.MD — wemint.app

## Product Overview

**wemint.app** is a bio-native monetization platform that turns a single bio link into a pay-ready creator hub. It combines tipping (Mint), link‑in‑bio, affiliate carts, and a lightweight digital storefront into one conversion‑optimized page.

### Core Thesis

> Creators shouldn't have to "go somewhere else" (a marketplace) to sell. The sale should happen where attention already lives: the bio link.

### Strategic Truth

> **Payment is the product—not just the page.**
> You get paid directly and instantly to your own wallet or bank. wemint.app never holds funds.

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
- **Wallet‑first** — Crypto wallet as the primary option, bank details as fallback
- **Low fees** — Optimized for small-ticket digital goods / micro-transactions
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

> One click from social → Mint/support → optional message + email → instant delivery (if any), with clear licensing to reduce hesitation.

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

🔗 **https://kwanchanal.github.io/wemintapp/**

### Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Hosting**: GitHub Pages
- **Storage**: localStorage (for demo purposes)

---

## Pages & Features

### 1. Bio Page (`index.html`)

The public-facing page that buyers see.

**Components:**
- Profile header (avatar, name, handle, bio)
- Social links (from creator settings)
- Mint / Get Minted panel (tip + short message + email)
- Affiliate links grid with platform badge + Shop Now CTA
- Products grid with badges (Best Seller, New)
- Quick links section (from creator settings)
- Email signup form

**Payment Flow:**
- Product detail modal with features & license info
- Payment modal with wallet‑first options (crypto wallet primary, bank details secondary)
- Success modal with instant download button

### 2. Dashboard (`dashboard.html`) — One‑Page Control Center

Creator's main control panel.

**Components:**
- Stats overview (Revenue, Sales, Views, Conversion Rate)
- Quick actions (Add Affiliate Link, Add Product, Add Quick Link, Payment)
- Appearance settings (Theme, Button Color, Font Color, Button Style, Font)
- Profile settings (avatar, name, username, bio)
- Social links (icon row + add/edit modal)
- Section visibility toggles (Affiliate / Products / Quick Links)
- Affiliate links table (demo data)
- Products table with edit/delete actions
- Quick links table with add/edit/toggle
- Recent sales feed
- Payment details (direct to creator; wemint never holds funds)
- Live phone preview of bio page

### 3. Appearance (`appearance.html`) [Legacy/Standalone]

Customize the look and feel of the bio page.

**Features:**
- **Themes**: 6 pre-built themes
  - Purple Gradient (default)
  - Ocean Blue
  - Fresh Green
  - Pink Sunset
  - Dark Mode
  - Light Mode
- **Button Color**: preset colors + custom hex input
- **Font Color**: preset colors + custom hex input
- **Button Style**: Rounded, Pill, Square
- **Font**: Inter, Poppins, Roboto, Playfair Display

### 4. Settings (`settings.html`) [Legacy/Standalone]

Manage profile and social links.

**Profile Settings:**
- Display name
- Username (changes URL: `/@username`)
- Profile avatar (upload or remove)
- Bio (160 character limit)

**Social Links:**
- Toggle visibility for each platform
- Custom URL input for each
- Supported platforms:
  - Instagram
  - TikTok
  - YouTube
  - X (Twitter)
  - Facebook
  - LinkedIn
  - Website
  - Email

---

## File Structure

```
wemintapp/
├── index.html          # Bio page (public)
├── dashboard.html      # Creator dashboard
├── appearance.html     # Legacy standalone appearance page
├── settings.html       # Legacy standalone settings page
├── styles.css          # Global styles
├── app.js              # JavaScript functionality
├── AGENTS.MD           # This file
└── reference/          # UI reference screenshots
```

---

## Data Storage

Settings are stored in `localStorage`:

| Key | Description |
|-----|-------------|
| `wemint_profile` | Display name, username, bio, avatar, social links |
| `wemint_appearance` | Theme, button color, button style, font, font color |
| `wemint_products` | Products data for dashboard + bio page |
| `wemint_quick_links` | Quick links data |
| `wemint_sections` | Section visibility toggles for bio page |

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

- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Components

- Cards with subtle shadows
- Apple-style minimal scrollbars
- Phone mockup preview
- Toggle switches for settings
- Modal system for checkout flow

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
