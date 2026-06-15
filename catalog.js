/* ============================================================================
   UNCAPPED — Product Catalog (single source of truth)
   ----------------------------------------------------------------------------
   This drives the whole storefront: grid cards, quick-add, product pages,
   upsells and the cart. It is shaped to mirror Shopify so go-live is a 1:1 map.

   GO-LIVE: in Shopify, create each product using the SAME `handle` below.
   Then drop each size's variant ID into `variants` (see shopify-config.js for
   the helper that does this). Nothing else here needs to change.

   Fields:
     handle      kebab-case id — must match the Shopify product handle
     title       display name
     type        'shirt' | 'hat' | 'box'   (controls sizing UI)
     category    e.g. 'Heavyweight Tee'
     collection  'Shirts' | 'Hats' | 'Mystery Box'
     colorway    short colour note
     price       NUMBER in USD (no $)
     compareAt   optional NUMBER (shows a strikethrough "was" price)
     tag         optional ribbon ('Best Seller', 'New', 'Limited', 'Blackout', …)
     image       primary card/PDP image
     images      gallery (PDP) — extra angles can be added later
     sizes       array; shirts ['S','M','L','XL','XXL'], hats ['One Size']
     blurb       one-liner used on cards
     description full PDP copy
     fabric      spec line shown on the PDP
     upsell      array of handles shown in the PDP "Complete the hand" funnel
     variants    {} now → { 'S': 'gid://shopify/ProductVariant/123', … } on go-live
   ========================================================================== */
window.UNCAPPED = window.UNCAPPED || {};

const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const HAT_SIZES = ['One Size'];

window.UNCAPPED.catalog = [
  {
    handle: 'degen', title: 'Degen', type: 'shirt', category: 'Heavyweight Tee',
    collection: 'Shirts', colorway: 'Onyx', price: 68, tag: 'Best Seller',
    image: 'assets/degen-tee.webp', images: ['assets/degen-tee.webp'], sizes: SHIRT_SIZES,
    blurb: 'For the player who can’t quit a +EV spot.',
    description: 'Our best-seller, worn loud and proud. The Degen graphic is built for the ones who chase every draw and never duck a gamble. Heavyweight, garment-dyed, and made to outlast the swings.',
    fabric: '7.3 oz combed ring-spun cotton · garment-dyed · boxy premium fit',
    upsell: ['degen-trucker', 'bluff', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'bluff', title: 'Bluff', type: 'shirt', category: 'Heavyweight Tee',
    collection: 'Shirts', colorway: 'Onyx', price: 68, tag: 'Flagship',
    image: 'assets/bluff-tee.webp', images: ['assets/bluff-tee.webp'], sizes: SHIRT_SIZES,
    blurb: 'Sell the story. Make them fold.',
    description: 'The flagship piece — a crest for anyone who’s won a pot they had no business winning. Detailed front graphic, finished in muted gold and bone. Tailored heavyweight cut that reads premium on and off the felt.',
    fabric: '7.3 oz combed ring-spun cotton · garment-dyed · boxy premium fit',
    upsell: ['bluff-trucker', 'call', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'max-pain', title: 'Max Pain', type: 'shirt', category: 'Heavyweight Hoodie',
    collection: 'Shirts', colorway: 'Onyx', price: 128, tag: '',
    image: 'assets/max-pain-hoodie.webp', images: ['assets/max-pain-hoodie.webp'], sizes: SHIRT_SIZES,
    blurb: 'Heavyweight armor for the long session.',
    description: 'The drop’s flagship layer. A weighty fleece hoodie built for the rail, the late levels, and the cold walk home after running it up. Double-lined hood, dropped shoulders, and a print that earns a second look.',
    fabric: '14 oz brushed-back fleece · double-lined hood · ribbed cuffs & hem',
    upsell: ['degen', 'bluff', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'call', title: 'Call.', type: 'shirt', category: 'Heavyweight Tee',
    collection: 'Shirts', colorway: 'Onyx', price: 68, tag: 'New',
    image: 'assets/call-tee.webp', images: ['assets/call-tee.webp'], sizes: SHIRT_SIZES,
    blurb: 'One word. One decision. No flinch.',
    description: 'A hero-call in a single syllable. Clean front statement with a crimson accent — understated until you read it. For the player who trusts the read and pays it off.',
    fabric: '7.3 oz combed ring-spun cotton · garment-dyed · boxy premium fit',
    upsell: ['nit-cap', 'table-captain', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'table-captain', title: 'Table Captain', type: 'shirt', category: 'Heavyweight Tee',
    collection: 'Shirts', colorway: 'Onyx', price: 68, tag: '',
    image: 'assets/table-captain-tee.webp', images: ['assets/table-captain-tee.webp'], sizes: SHIRT_SIZES,
    blurb: 'Every table has one. Be it.',
    description: 'A crest for the seat that runs the table — the one talking, raising, and setting the tempo. Ship-wheel motif rendered in gold-leaf tones on heavyweight onyx.',
    fabric: '7.3 oz combed ring-spun cotton · garment-dyed · boxy premium fit',
    upsell: ['bluff', 'degen-trucker', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'nothin-funner', title: 'Nothin Funner', type: 'shirt', category: 'Heavyweight Tee',
    collection: 'Shirts', colorway: 'Onyx', price: 72, tag: 'Limited',
    image: 'assets/nothin-funner-tee.webp', images: ['assets/nothin-funner-tee.webp'], sizes: SHIRT_SIZES,
    blurb: 'There’s nothin funner than a deep run.',
    description: 'A limited-run love letter to the game. Full poker-night scene printed edge to edge — chips, cards, and the buzz of a table that won’t break. When it’s gone, it’s gone.',
    fabric: '7.3 oz combed ring-spun cotton · garment-dyed · oversized print',
    upsell: ['degen', 'nit-cap', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'limpin', title: 'Limpin Ain’t Easy', type: 'shirt', category: 'Heavyweight Tee',
    collection: 'Shirts', colorway: 'Onyx', price: 68, tag: '',
    image: 'assets/limpin-tee.webp', images: ['assets/limpin-tee.webp'], sizes: SHIRT_SIZES,
    blurb: 'A wink to the table for the ones who know.',
    description: 'Half villain, half inside-joke. A character piece with a crimson-heart accent for the players who limp in and still find a way to scoop. Dark, detailed, and deliberately a little ridiculous.',
    fabric: '7.3 oz combed ring-spun cotton · garment-dyed · boxy premium fit',
    upsell: ['degen', 'bluff-trucker', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'once', title: 'Once', type: 'shirt', category: 'Tonal Tee',
    collection: 'Shirts', colorway: 'Blackout', price: 72, tag: 'Blackout',
    image: 'assets/once-tee.webp', images: ['assets/once-tee.webp'], sizes: SHIRT_SIZES,
    blurb: 'Blackout capsule. Black on black, all night.',
    description: 'From the Blackout capsule — a tonal, high-density print that only reveals itself in the right light. Quiet luxury for the player who doesn’t need to announce it.',
    fabric: '7.3 oz heavyweight cotton · tonal high-density print',
    upsell: ['no-backers', 'raise', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'no-backers', title: 'No Backers', type: 'shirt', category: 'Tonal Tee',
    collection: 'Shirts', colorway: 'Blackout', price: 72, tag: 'Blackout',
    image: 'assets/no-backers-tee.webp', images: ['assets/no-backers-tee.webp'], sizes: SHIRT_SIZES,
    blurb: 'No backers. No excuses. Full action.',
    description: 'Blackout capsule. A lone-wolf crest for the players staked to nobody but themselves. Tonal black-on-black, embossed and understated — it hits different up close.',
    fabric: '7.3 oz heavyweight cotton · tonal high-density print',
    upsell: ['once', 'raise', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'raise', title: 'Raise', type: 'shirt', category: 'Tonal Tee',
    collection: 'Shirts', colorway: 'Blackout', price: 68, tag: 'Blackout',
    image: 'assets/raise-tee.webp', images: ['assets/raise-tee.webp'], sizes: SHIRT_SIZES,
    blurb: 'When in doubt. Blackout capsule.',
    description: 'Blackout capsule. The king-piece motif, rendered tonal and tactile. A reminder that passivity never won a tournament — when in doubt, raise.',
    fabric: '7.3 oz heavyweight cotton · tonal high-density print',
    upsell: ['no-backers', 'once', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'pocket-aces', title: 'Pocket Aces', type: 'shirt', category: 'Tonal Tee',
    collection: 'Shirts', colorway: 'Blackout', price: 68, tag: '',
    image: 'assets/pocket-aces-tee.webp', images: ['assets/pocket-aces-tee.webp'], sizes: SHIRT_SIZES,
    blurb: 'The best starting hand, worn quiet.',
    description: 'Blackout capsule. Two aces, tonal and minimal. The premium hand deserves a premium piece — black on black, no flash, all confidence.',
    fabric: '7.3 oz heavyweight cotton · tonal high-density print',
    upsell: ['raise', 'no-backers', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'degen-trucker', title: 'Degen Trucker', type: 'hat', category: 'Trucker Cap',
    collection: 'Hats', colorway: 'Black / Gold', price: 48, tag: '',
    image: 'assets/degen-trucker.webp', images: ['assets/degen-trucker.webp'], sizes: HAT_SIZES,
    blurb: 'Rail-ready. Snap it on and run it up.',
    description: 'The Degen crest on a structured trucker. Foam front, breathable mesh back, and a snap closure that fits every head at the table.',
    fabric: 'Structured 5-panel · foam front · mesh back · snapback (one size)',
    upsell: ['degen', 'bluff-trucker', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'bluff-trucker', title: 'Bluff Trucker', type: 'hat', category: 'Trucker Cap',
    collection: 'Hats', colorway: 'Black / Gold', price: 48, tag: '',
    image: 'assets/bluff-trucker.webp', images: ['assets/bluff-trucker.webp'], sizes: HAT_SIZES,
    blurb: 'Pull the brim. Sell the story.',
    description: 'The Bluff crest, embroidered on a premium trucker. Pull it low when you’re repping the river — foam front, mesh back, classic snap.',
    fabric: 'Structured 5-panel · foam front · mesh back · snapback (one size)',
    upsell: ['bluff', 'degen-trucker', 'the-true-gambler'], variants: {}
  },
  {
    handle: 'nit-cap', title: 'Nit Cap', type: 'hat', category: 'Dad Cap',
    collection: 'Hats', colorway: 'Onyx', price: 44, tag: '',
    image: 'assets/nit-cap.webp', images: ['assets/nit-cap.webp'], sizes: HAT_SIZES,
    blurb: 'Fold pre, flex post. An inside joke you can wear.',
    description: 'An unstructured onyx dad cap with a tonal crest and crimson accent. Low-profile, broken-in feel — for the nit who only plays the nuts and still has the best stack.',
    fabric: 'Unstructured 6-panel · brushed cotton · brass buckle (one size)',
    upsell: ['call', 'pocket-aces', 'the-true-gambler'], variants: {}
  }
];

/* The True Gambler — $250 mystery box (its own collection) */
window.UNCAPPED.box = {
  handle: 'the-true-gambler', title: 'The True Gambler', type: 'box', category: 'Mystery Box',
  collection: 'Mystery Box', colorway: 'Sealed', price: 250, tag: 'Limited',
  image: 'assets/uncapped-emblem.webp',
  images: ['assets/raise-tee.webp', 'assets/degen-tee.webp', 'assets/table-captain-tee.webp'],
  sizes: SHIRT_SIZES,
  blurb: 'Ante up. Let the house deal your fit.',
  description: 'A blind drop of Uncapped pieces — tees, headwear, and the occasional flagship — sealed until it lands on your doorstep. Always packed with more than you paid, hand-curated, and never the same box twice. You never know the cards you’re dealt. That’s the point.',
  fabric: 'Curated multi-piece drop · always valued above $250 · choose your shirt size',
  upsell: ['degen', 'bluff', 'max-pain'], variants: {}
};

/* Collections (for nav / Shopify collection mapping) */
window.UNCAPPED.collections = ['Shirts', 'Hats', 'Mystery Box'];

/* Discount codes the Beat-the-Dealer game hands out — create these in Shopify.
   Percentages are intentionally NOT shown anywhere in the UI. */
window.UNCAPPED.discounts = [
  { code: 'HOUSEMONEY', when: 'Awarded when the player beats the dealer at blackjack', suggested: '15% off first order' },
  { code: 'RAILBIRD',   when: 'Consolation when the player loses/busts',              suggested: '10% off first order' }
];
