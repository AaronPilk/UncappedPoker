# Uncapped — Shopify Go-Live Guide

The storefront is already built to plug into Shopify with **zero rebuild**. Today it runs in **demo mode**: the cart, quick-add, product pages, and upsells all work, and Checkout shows a "coming soon" note. Flipping to live = filling in two keys and mapping product IDs.

How the pieces fit:

| File | Role | Touch on go-live? |
|------|------|-------------------|
| `catalog.js` | Single source of truth for all products (titles, prices, sizes, descriptions, upsells). Each has a `handle`. | Only if products change |
| `shopify-config.js` | Your store domain + Storefront token + `live` flag. | **Yes — this is the main one** |
| `store.js` | Renders grid, quick-add, cart, product pages, and runs checkout. | No |

The customer browses your custom site the entire time; Shopify only handles the final, secure payment page.

---

## Step 1 — Create the Shopify store
Sign up at shopify.com (any plan that includes the **Storefront API** — all paid plans do). Dan should be the account owner.

## Step 2 — Add the products
Create each product below in Shopify. **The handle must match `catalog.js` exactly** (Shopify auto-generates the handle from the title — just confirm it matches).

**Shirts** — give each the variant option **Size: S, M, L, XL, XXL**

| Handle | Title | Price |
|--------|-------|-------|
| `degen` | Degen | $68 |
| `bluff` | Bluff | $68 |
| `max-pain` | Max Pain (hoodie) | $128 |
| `call` | Call. | $68 |
| `table-captain` | Table Captain | $68 |
| `nothin-funner` | Nothin Funner | $72 |
| `limpin` | Limpin Ain't Easy | $68 |
| `once` | Once | $72 |
| `no-backers` | No Backers | $72 |
| `raise` | Raise | $68 |
| `pocket-aces` | Pocket Aces | $68 |

**Hats** — variant option **Size: One Size**

| Handle | Title | Price |
|--------|-------|-------|
| `degen-trucker` | Degen Trucker | $48 |
| `bluff-trucker` | Bluff Trucker | $48 |
| `nit-cap` | Nit Cap | $44 |

**Mystery Box** — variant option **Size: S, M, L, XL, XXL** (the buyer's shirt size)

| Handle | Title | Price |
|--------|-------|-------|
| `the-true-gambler` | The True Gambler | $250 |

> Product descriptions, fabric specs, and the "pairs well with" upsells are already written in `catalog.js` — copy them into each Shopify product's description, or leave them as-is on the site (the site shows them either way).

**Collections (optional but recommended):** `Shirts`, `Hats`, `Mystery Box`.

**Images:** upload the matching files from `assets/` (e.g. `assets/degen-tee.webp`) to each product, or keep using the site's images — both work.

## Step 3 — Get the Storefront API token
Shopify admin → **Settings → Apps and sales channels → Develop apps → Create an app** → **Configure Storefront API scopes** (enable read products + checkout) → **Install app** → copy the **Storefront API access token** (the public one).

## Step 4 — Fill in `shopify-config.js`
```js
window.UNCAPPED.shopify = {
  live: true,                                   // ← flip to true
  domain: 'uncapped-poker.myshopify.com',       // ← your store domain
  storefrontToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // ← token from step 3
  variants: {},                                 // leave empty — auto-resolved by handle
  checkoutMode: 'shopify'
};
```
That's it — `store.js` automatically looks up each product's size→variant IDs from Shopify by handle at checkout, builds a secure Shopify checkout, and redirects the buyer to pay. (If you'd rather hard-code variant IDs for speed, the `variants` format is documented in the file.)

## Step 5 — Create the discount codes
The Beat-the-Dealer blackjack game hands out codes (the % is intentionally hidden from players). Create these in Shopify admin → **Discounts**:

| Code | When it's given | Suggested value |
|------|-----------------|-----------------|
| `HOUSEMONEY` | Player beats the dealer | 15% off first order |
| `RAILBIRD` | Consolation (player loses/busts) | 10% off first order |

Set them to "first order only" / one-time use as you prefer. Buyers enter the code on Shopify's checkout page.

## Step 6 — Brand the checkout (match the site)
The whole site is your custom design; the **only** Shopify-styled screen is the final payment page. Brand it so it feels like Uncapped:

Shopify admin → **Settings → Checkout → Customize** (opens the checkout & branding editor). Set:

- **Logo:** upload the Uncapped wordmark/emblem; left or centered.
- **Background:** dark — `#08090a` (main) / `#0e0f11` (panels).
- **Primary / accent + buttons:** gold — `#e7c873` (bright) with `#c9a86a` as the secondary gold.
- **Body text:** off-white `#f4f0e6`; muted text `#9a958a`.
- **Error/sale accent (optional):** crimson `#b3303a`.
- **Typography:** a clean sans for body; if available, a serif (Playfair-style) for headings to echo the site.

Also worth branding while you're there: **Settings → Notifications** (order/shipping emails — add logo + colors) and the **Order status page**.

> Exact brand hex (from the site's `--` variables): bg `#08090a`, panel `#0e0f11`, ink `#f4f0e6`, muted `#9a958a`, gold `#c9a86a`, gold-bright `#e7c873`, crimson `#b3303a`.

## Step 7 — Ship it
Commit and push. Cloudflare auto-deploys. `uncappedpoker.com` now takes real orders.

```
git add -A && git commit -m "Shopify live" && git push
```

---

### Test before announcing
1. Add a shirt → pick a size → Checkout → confirm it lands on Shopify's checkout with the right item/size/price.
2. Place a test order (Shopify has a Bogus Gateway test mode, or use a real card and refund).
3. Try a discount code at checkout.
4. Confirm the $250 box and a hat both check out correctly.

Ping me when the account exists and I can do steps 2–5 for you using the Shopify tools, and run the test pass.
