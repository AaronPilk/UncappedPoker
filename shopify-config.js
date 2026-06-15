/* ============================================================================
   UNCAPPED — Shopify connection
   ----------------------------------------------------------------------------
   This is the ONLY file you touch to go live. Until `live` is true the site
   runs in demo mode (cart works, checkout shows a friendly "coming soon").

   ── GO-LIVE CHECKLIST ──────────────────────────────────────────────────────
   1. Create the Shopify store (any plan that includes the Storefront API).
   2. In Shopify admin → Settings → Apps and sales channels → Develop apps →
      create an app → enable the **Storefront API** → install → copy the
      "Storefront API access token" (public).
   3. Set `domain` to your *.myshopify.com domain and paste the token below.
   4. Create each product in Shopify using the SAME handle as in catalog.js,
      with sizes S–XXL (shirts) or One Size (hats). Then map the size→variant
      IDs in `variants` below (Shopify variant IDs look like
      'gid://shopify/ProductVariant/1234567890').  Tip: you can also fetch them
      automatically — see store.js `loadVariantsFromShopify()`.
   5. Create the discount codes HOUSEMONEY and RAILBIRD (see catalog.js).
   6. Flip `live` to true, push, done. Checkout now goes to Shopify.
   ========================================================================== */
window.UNCAPPED = window.UNCAPPED || {};

window.UNCAPPED.shopify = {
  live: false,                       // ← set true once the token below is filled + products are Active
  domain: 'uncapped-poker.myshopify.com', // ✓ your store (preset)
  storefrontToken: '',               // ← paste Storefront API public access token here (last step)

  // Optional: hard-code variant IDs per product handle + size.
  // If left empty AND live=true, store.js will look them up from Shopify by handle.
  // Example:
  //   variants: { 'degen': { 'S':'gid://shopify/ProductVariant/111', 'M':'…' }, … }
  variants: {},

  // Where the cart's checkout button sends the buyer. Leave as 'shopify' to use
  // Shopify's secure hosted checkout (recommended for headless on Cloudflare).
  checkoutMode: 'shopify'
};
