# AGENTS.MD — wemint.app

## Product Overview

**wemint.app** is a bio-native monetization platform that transforms a single bio link into a pay-ready portfolio. It combines link-in-bio, portfolio, and a Shopify-lite digital storefront into one conversion-optimized experience.

### Core Thesis

> Creators shouldn't have to "go somewhere else" (a marketplace) to sell. The sale should happen where attention already lives: the bio link.

### Strategic Truth

> **Payment is the product—not just the page.**

---

## What It Does

A single bio link where buyers can:

- **Discover** — View the creator's work, identity, and portfolio
- **Browse** — Explore digital products
- **Pay** — Complete purchase in seconds
- **Download** — Get instant delivery
- **Book** — Schedule demos or calls

---

## Problems We Solve

| Problem | Current Pain | Our Solution |
|---------|--------------|--------------|
| Marketplace dependency | Fees, algorithms, platform-owned audience | Creator owns the relationship |
| Global payout friction | Limited processors, KYC pain, slow withdrawals, cross-border failures | Borderless payouts |
| Bio links don't convert | Missing trust + identity + checkout | All-in-one conversion flow |
| Bank details don't sell | No story/portfolio/instant delivery | Payment-ready portfolio |

---

## What We Replace

- ❌ "List of links" that doesn't convert (too many steps)
- ❌ Non-branding bank account numbers or QR-only sharing
- ❌ Marketplace dependency for payouts and customer access

---

## Differentiators (Wedge)

### Payments-First + Conversion-First

- **Bio-native checkout** — Designed to maximize completion, not just page customization
- **Borderless payouts** — Less dependent on banks/country limits
- **Low fees** — Optimized for small-ticket digital goods / micro-transactions
- **Fast settlement** — Near-instant where eligible
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

### Buyer Value Proposition

> One click from social → browse → pay → instant download, with clear licensing to reduce hesitation.

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
| Trust tier | Risk level assigned to creator affecting payout speed |
| Payout hold | Temporary delay on funds for risk mitigation |
| Bio-native | Designed specifically for the bio link context |
| Micro-transaction | Small-ticket purchases (typically < $20) |

---

## Success Metrics

- Time from signup to first sale
- Checkout completion rate
- Payment success rate by region
- Average settlement time
- Creator revenue per bio view
