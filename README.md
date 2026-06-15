# Uncapped Poker

Luxury poker apparel — built dark, finished in gold. A cinematic, **mobile-first** storefront designed for Meta ad traffic.

**Domain:** uncappedpoker.com (to be connected once the site is production-ready)

---

## What's here

| Path | Description |
|------|-------------|
| `index.html` | The full storefront — single-file, no build step. Dark-luxury aesthetic, scroll animations, mobile nav, sticky conversion bar, and the **Beat the AI** discount game. |
| `assets/` | Optimized WebP product tiles (uniform 900×900, dark-edge, ~60–140 KB each for fast mobile loads). |
| `design-source/` | Original high-res design files from Dan (raw artwork + cap mockups). |

## Current product line

**Graphic capsule:** Degen · Bluff · Max Pain · Call. · Table Captain · Nothin Funner · Limpin Ain't Easy
**Blackout (tonal) capsule:** Once · No Backers · Raise · Pocket Aces
**Headwear:** Degen Trucker · Bluff Trucker · Nit Cap

## Signature feature — Beat the AI

A high-card duel against "The House AI." Win 2 of 3 rounds to unlock a **15% discount** (`UNCAPPED15`); lose and you get a consolation **5%** (`RUNITBACK5`). Designed as an interactive hook for ad landing pages.

## Run locally

No build needed — open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Roadmap

1. **Logo** — finalize brand mark (the cracked-cap "Uncapped" emblem is the leading candidate).
2. **Headless Shopify** — wire cart / checkout / payments / inventory behind this custom front-end (Shopify Storefront API).
3. **Product specs** — sizes, materials, fits, pricing confirmation from Dan.
4. **Deploy** — host (Vercel/Netlify/Cloudflare Pages) and connect uncappedpoker.com.

---
© Uncapped Poker
