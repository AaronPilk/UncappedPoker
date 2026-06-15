/* ============================================================================
   UNCAPPED — Storefront commerce layer
   Renders the product grid, quick-add, product pages + upsells and the cart.
   Checkout uses Shopify's hosted checkout when shopify-config.js is live;
   until then it runs in demo mode. Data comes from catalog.js.
   ========================================================================== */
(function () {
  'use strict';
  var CAT = (window.UNCAPPED && window.UNCAPPED.catalog) || [];
  var BOX = (window.UNCAPPED && window.UNCAPPED.box) || null;
  var CFG = (window.UNCAPPED && window.UNCAPPED.shopify) || { live: false };
  var ALL = BOX ? CAT.concat([BOX]) : CAT.slice();
  var byHandle = {}; ALL.forEach(function (p) { byHandle[p.handle] = p; });
  var FUL = (window.UNCAPPED && window.UNCAPPED.fulfillment) || { madeToOrder: false };
  var FEAT = (window.UNCAPPED && window.UNCAPPED.featured) || CAT.slice(0, 8).map(function (p) { return p.handle; });
  function mto(p) { return !!(FUL.madeToOrder && !p.inStock); }

  var money = function (n) { return '$' + (Number(n) % 1 === 0 ? Number(n).toFixed(0) : Number(n).toFixed(2)); };
  var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  /* ---------------- styles ---------------- */
  var css = `
  .uc-scrim{position:fixed;inset:0;background:rgba(5,5,7,.66);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .4s var(--ease);z-index:980}
  body.uc-open .uc-scrim{opacity:1;pointer-events:auto}
  /* cart drawer */
  .uc-drawer{position:fixed;top:0;right:0;height:100%;width:min(420px,92vw);background:var(--bg-2);border-left:1px solid var(--line);
    z-index:985;transform:translateX(100%);transition:transform .45s var(--ease);display:flex;flex-direction:column}
  body.uc-cart .uc-drawer{transform:none}
  .uc-d-head{display:flex;align-items:center;justify-content:space-between;padding:24px 22px;border-bottom:1px solid var(--line)}
  .uc-d-head h3{font-family:'Playfair Display',serif;font-size:22px;letter-spacing:.02em}
  .uc-x{background:none;border:1px solid var(--line);color:var(--ink);width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:16px;transition:.3s var(--ease)}
  .uc-x:hover{border-color:var(--gold-bright);color:var(--gold-bright)}
  .uc-items{flex:1;overflow-y:auto;padding:14px 22px}
  .uc-empty{color:var(--ink-dim);text-align:center;margin-top:60px;font-size:14px}
  .uc-li{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid var(--line)}
  .uc-li img{width:64px;height:80px;object-fit:cover;border-radius:8px;background:#0d0d0f;flex:none}
  .uc-li .n{font-weight:600;font-size:14px}
  .uc-li .s{font-size:11px;color:var(--ink-dim);letter-spacing:.08em;text-transform:uppercase;margin-top:3px}
  .uc-li .p{font-family:'JetBrains Mono',monospace;color:var(--gold-bright);font-size:13px;margin-top:6px}
  .uc-qty{display:inline-flex;align-items:center;gap:10px;margin-top:8px}
  .uc-qty button{width:24px;height:24px;border:1px solid var(--line);background:none;color:var(--ink);border-radius:6px;cursor:pointer;font-size:14px;line-height:1}
  .uc-qty button:hover{border-color:var(--gold-bright);color:var(--gold-bright)}
  .uc-rm{background:none;border:none;color:var(--ink-dim);font-size:11px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;margin-left:auto;align-self:flex-start}
  .uc-rm:hover{color:var(--crimson)}
  .uc-foot{padding:20px 22px calc(20px + env(safe-area-inset-bottom));border-top:1px solid var(--line)}
  .uc-sub{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}
  .uc-sub .l{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-dim)}
  .uc-sub .v{font-family:'Playfair Display',serif;font-size:26px;color:var(--gold-bright)}
  .uc-note{font-size:11px;color:var(--ink-dim);margin-bottom:14px}
  .uc-checkout{width:100%;padding:17px;border:none;border-radius:46px;background:var(--gold-bright);color:#000;
    font-size:12px;letter-spacing:.22em;text-transform:uppercase;cursor:pointer;transition:.3s var(--ease)}
  .uc-checkout:hover{filter:brightness(1.06)} .uc-checkout:disabled{opacity:.5;cursor:default}
  .uc-demo{margin-top:12px;font-size:12px;color:var(--gold);text-align:center;min-height:16px}
  /* quick-add + pdp modal shells */
  .uc-modal{position:fixed;inset:0;z-index:990;display:flex;align-items:center;justify-content:center;padding:20px;
    opacity:0;pointer-events:none;transition:opacity .35s var(--ease)}
  body.uc-qa .uc-modal.qa,body.uc-pdp .uc-modal.pdp{opacity:1;pointer-events:auto}
  .uc-card{background:var(--bg-2);border:1px solid var(--line);border-radius:18px;max-width:420px;width:100%;padding:26px;position:relative;transform:translateY(16px);transition:transform .4s var(--ease)}
  body.uc-qa .qa .uc-card{transform:none}
  .uc-card .uc-x{position:absolute;top:16px;right:16px}
  .uc-card .qa-img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:12px;background:#0d0d0f;margin-bottom:18px}
  .uc-card h3{font-family:'Playfair Display',serif;font-size:24px;margin-bottom:4px}
  .uc-card .qa-cat{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim)}
  .uc-card .qa-price{font-family:'JetBrains Mono',monospace;color:var(--gold-bright);font-size:18px;margin:12px 0}
  .uc-sizes{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 20px}
  .uc-size{min-width:46px;padding:11px 12px;border:1px solid var(--line);background:none;color:var(--ink);border-radius:10px;cursor:pointer;font-size:13px;letter-spacing:.04em;transition:.25s var(--ease)}
  .uc-size:hover{border-color:var(--gold)}
  .uc-size.sel{background:var(--gold-bright);color:#000;border-color:var(--gold-bright)}
  .uc-add{width:100%;padding:16px;border:none;border-radius:46px;background:var(--gold-bright);color:#000;font-size:12px;letter-spacing:.22em;text-transform:uppercase;cursor:pointer;transition:.3s var(--ease)}
  .uc-add:hover{filter:brightness(1.06)}
  .uc-hint{font-size:11px;color:var(--crimson);min-height:14px;margin-top:8px;text-align:center;letter-spacing:.04em}
  /* PDP full overlay */
  .uc-modal.pdp{align-items:flex-start;overflow-y:auto;background:var(--bg)}
  .uc-pdp-wrap{max-width:1100px;width:100%;margin:0 auto;padding:90px 22px 80px}
  .uc-pdp-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,60px);align-items:start}
  @media(max-width:760px){.uc-pdp-grid{grid-template-columns:1fr}}
  .uc-pdp-media{position:relative;border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#0c0c0e}
  .uc-pdp-media img{width:100%;aspect-ratio:1;object-fit:cover;display:block}
  .uc-pdp-media .tag{position:absolute;top:16px;left:16px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-bright);border:1px solid var(--line);padding:6px 12px;border-radius:30px;background:rgba(8,9,10,.6)}
  .uc-back{position:fixed;top:18px;left:18px;z-index:5;background:rgba(8,9,10,.6);border:1px solid var(--line);color:var(--ink);border-radius:30px;padding:9px 16px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer}
  .uc-back:hover{border-color:var(--gold-bright);color:var(--gold-bright)}
  .uc-pdp-info .eyebrow{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold)}
  .uc-pdp-info h1{font-family:'Playfair Display',serif;font-size:clamp(34px,5vw,60px);line-height:1;margin:12px 0 10px}
  .uc-pdp-info .qa-price{font-size:22px}
  .uc-pdp-info .desc{color:var(--ink-dim);margin:16px 0;line-height:1.6}
  .uc-pdp-info .fabric{font-size:12px;color:var(--ink-dim);border-top:1px solid var(--line);padding-top:16px;margin-top:8px;letter-spacing:.02em}
  .uc-upsell{max-width:1100px;margin:60px auto 0;padding:0 22px}
  .uc-upsell h3{font-family:'Playfair Display',serif;font-size:clamp(24px,3vw,38px);margin-bottom:6px}
  .uc-upsell .lbl{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);margin-bottom:20px}
  .uc-upsell-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  @media(max-width:620px){.uc-upsell-grid{grid-template-columns:repeat(3,1fr);gap:8px}}
  .uc-up{cursor:pointer;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--surface);transition:.4s var(--ease)}
  .uc-up:hover{border-color:var(--gold);transform:translateY(-4px)}
  .uc-up img{width:100%;aspect-ratio:1;object-fit:cover;display:block}
  .uc-up .m{padding:12px 14px;display:flex;justify-content:space-between;gap:8px}
  .uc-up .m h4{font-size:13px;font-weight:600}.uc-up .m .p{font-family:'JetBrains Mono',monospace;color:var(--gold-bright);font-size:12px;white-space:nowrap}
  /* mobile cart FAB */
  .uc-fab{position:fixed;right:16px;bottom:84px;z-index:870;width:54px;height:54px;border-radius:50%;display:none;
    align-items:center;justify-content:center;background:var(--gold-bright);color:#000;border:none;cursor:pointer;
    box-shadow:0 14px 30px rgba(0,0,0,.5);font-size:11px;font-weight:700;letter-spacing:.04em}
  .uc-fab .b{position:absolute;top:-4px;right:-4px;background:var(--crimson);color:#fff;border-radius:50%;min-width:20px;height:20px;font-size:11px;display:flex;align-items:center;justify-content:center;padding:0 5px}
  @media(max-width:860px){.uc-fab{display:flex}}
  /* made-to-order badge */
  .uc-mto{position:absolute;bottom:12px;left:12px;z-index:2;font-size:9px;letter-spacing:.18em;text-transform:uppercase;
    color:var(--ink);background:rgba(8,9,10,.72);border:1px solid var(--line);padding:6px 11px;border-radius:30px;backdrop-filter:blur(4px)}
  .uc-ship{font-size:12px;color:var(--ink-dim);margin-top:12px;display:flex;align-items:center;gap:8px;letter-spacing:.02em}
  .uc-ship::before{content:"●";color:var(--gold-bright);font-size:8px}
  /* shop all cta */
  .uc-shopall-cta{display:flex;justify-content:center;margin-top:clamp(34px,5vw,54px)}
  .uc-shopall-btn{background:none;border:1px solid var(--gold);color:var(--gold-bright);cursor:pointer;
    padding:17px 40px;border-radius:46px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;transition:.35s var(--ease)}
  .uc-shopall-btn:hover{background:var(--gold-bright);color:#000;border-color:var(--gold-bright)}
  /* shop all overlay */
  .uc-modal.shopall{align-items:flex-start;overflow-y:auto;background:var(--bg)}
  .uc-sa-wrap{max-width:1200px;width:100%;margin:0 auto;padding:84px 22px 80px}
  .uc-sa-head{text-align:center;margin-bottom:40px}
  .uc-sa-head .lbl{font-size:11px;letter-spacing:.4em;text-transform:uppercase;color:var(--gold)}
  .uc-sa-head h2{font-family:'Playfair Display',serif;font-size:clamp(38px,6vw,72px);margin-top:10px}
  .uc-sa-group{margin-top:46px}
  .uc-sa-group > .g-title{font-family:'Playfair Display',serif;font-size:clamp(22px,3vw,32px);margin-bottom:20px;display:flex;align-items:baseline;gap:12px}
  .uc-sa-group > .g-title span{font-size:12px;color:var(--ink-dim);font-family:'Inter',sans-serif;letter-spacing:.1em}
  .uc-sa-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(12px,2vw,24px)}
  @media(max-width:900px){.uc-sa-grid{grid-template-columns:repeat(2,1fr)}}
  body.uc-shopall .uc-modal.shopall{opacity:1;pointer-events:auto}
  `;
  document.head.appendChild(el('style', null, css));

  /* ---------------- DOM shells ---------------- */
  var root = el('div'); root.innerHTML =
    '<div class="uc-scrim" data-uc-close></div>' +
    '<aside class="uc-drawer" aria-label="Cart">' +
      '<div class="uc-d-head"><h3>Your Bag</h3><button class="uc-x" data-uc-close>✕</button></div>' +
      '<div class="uc-items" id="ucItems"></div>' +
      '<div class="uc-foot">' +
        '<div class="uc-sub"><span class="l">Subtotal</span><span class="v" id="ucSub">$0</span></div>' +
        '<div class="uc-note">Shipping &amp; taxes calculated at checkout.</div>' +
        '<button class="uc-checkout" id="ucCheckout">Checkout</button>' +
        '<div class="uc-demo" id="ucDemo"></div>' +
      '</div>' +
    '</aside>' +
    '<div class="uc-modal qa"><div class="uc-card" id="ucQa"></div></div>' +
    '<div class="uc-modal pdp"><button class="uc-back" data-uc-close>← Back</button><div id="ucPdp"></div></div>' +
    '<div class="uc-modal shopall"><button class="uc-back" data-uc-close>← Back</button><div id="ucShopAll"></div></div>' +
    '<button class="uc-fab" id="ucFab" aria-label="Open cart">BAG<span class="b" id="ucFabB">0</span></button>';
  document.body.appendChild(root);

  var $items = document.getElementById('ucItems'), $sub = document.getElementById('ucSub'),
      $demo = document.getElementById('ucDemo'), $qa = document.getElementById('ucQa'),
      $pdp = document.getElementById('ucPdp'), $fab = document.getElementById('ucFab'),
      $fabB = document.getElementById('ucFabB'), $shopAll = document.getElementById('ucShopAll');

  /* ---------------- cart state ---------------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem('uncapped_cart') || '[]'); } catch (e) { cart = []; }
  function save() { try { localStorage.setItem('uncapped_cart', JSON.stringify(cart)); } catch (e) {} }
  function count() { return cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function subtotal() { return cart.reduce(function (n, i) { var p = byHandle[i.handle]; return n + (p ? p.price : 0) * i.qty; }, 0); }

  function addToCart(handle, size, qty) {
    qty = qty || 1;
    var line = cart.filter(function (i) { return i.handle === handle && i.size === size; })[0];
    if (line) line.qty += qty; else cart.push({ handle: handle, size: size, qty: qty });
    save(); renderCart(); syncCount(); openCart();
  }
  function setQty(idx, q) { if (q <= 0) cart.splice(idx, 1); else cart[idx].qty = q; save(); renderCart(); syncCount(); }

  /* ---------------- open/close ---------------- */
  function openCart() { document.body.classList.add('uc-open', 'uc-cart'); }
  function closeAll() {
    document.body.classList.remove('uc-open', 'uc-cart', 'uc-qa', 'uc-pdp', 'uc-shopall');
    var h = location.hash;
    if (h.indexOf('#product/') === 0 || h === '#shop-all') history.replaceState(null, '', location.pathname);
  }
  document.addEventListener('click', function (e) { if (e.target.closest('[data-uc-close]')) { e.preventDefault(); closeAll(); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  /* ---------------- grid ---------------- */
  var io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: .14 })
    : null;

  function card(p) {
    return '<div class="card reveal" data-handle="' + p.handle + '">' +
      '<div class="ph">' + (p.tag ? '<span class="tag">' + p.tag + '</span>' : '') +
        (mto(p) ? '<span class="uc-mto">' + FUL.badge + '</span>' : '') +
        '<img src="' + p.image + '" alt="' + p.title + ' — Uncapped Poker" loading="lazy" width="900" height="1080"></div>' +
      '<div class="meta"><div><h3>' + p.title + '</h3><div class="cat">' + p.category + ' · ' + p.colorway + '</div></div>' +
        '<div class="price">' + money(p.price) + '</div></div>' +
      '<div class="add" data-h data-add="' + p.handle + '">' + (mto(p) ? FUL.cta : 'Add to Cart') + '</div></div>';
  }
  var grid = document.getElementById('productGrid');
  if (grid) {
    var featured = FEAT.map(function (h) { return byHandle[h]; }).filter(Boolean);
    grid.innerHTML = featured.map(card).join('');
    grid.querySelectorAll('.card').forEach(function (c) { io ? io.observe(c) : c.classList.add('in'); });
    // "Shop All" CTA under the featured grid
    var shopSec = grid.parentElement;
    if (shopSec && !document.getElementById('ucShopAllBtn')) {
      var wrap = el('div', 'uc-shopall-cta');
      wrap.innerHTML = '<button id="ucShopAllBtn" class="uc-shopall-btn" data-h>Shop All ' + (CAT.length) + ' Designs →</button>';
      shopSec.appendChild(wrap);
      document.getElementById('ucShopAllBtn').addEventListener('click', function () { location.hash = '#shop-all'; });
    }
  }

  /* card clicks: image/title → PDP, Add → quick-add (or direct for hats) */
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault(); e.stopPropagation();
      var p = byHandle[add.getAttribute('data-add')];
      if (p.sizes.length === 1) addToCart(p.handle, p.sizes[0], 1); else openQuickAdd(p.handle);
      return;
    }
    var c = e.target.closest('.card[data-handle]');
    if (c) { location.hash = '#product/' + c.getAttribute('data-handle'); }
  });

  /* mystery box button */
  var gambler = document.getElementById('gamblerAdd');
  if (gambler && BOX) gambler.addEventListener('click', function () { openQuickAdd(BOX.handle); });

  /* ---------------- quick-add ---------------- */
  var qaPick = null, qaHandle = null;
  function openQuickAdd(handle) {
    var p = byHandle[handle]; if (!p) return; qaHandle = handle; qaPick = null;
    $qa.innerHTML =
      '<button class="uc-x" data-uc-close>✕</button>' +
      '<img class="qa-img" src="' + p.image + '" alt="">' +
      '<div class="qa-cat">' + p.category + ' · ' + p.colorway + '</div>' +
      '<h3>' + p.title + '</h3>' +
      '<div class="qa-price">' + money(p.price) + '</div>' +
      '<div class="uc-sizes">' + p.sizes.map(function (s) { return '<button class="uc-size" data-size="' + s + '">' + s + '</button>'; }).join('') + '</div>' +
      '<button class="uc-add" id="ucQaAdd">' + (mto(p) ? FUL.cta : 'Add to Bag') + '</button>' +
      '<div class="uc-hint" id="ucQaHint"></div>' +
      (mto(p) ? '<div class="uc-ship">' + FUL.note + '</div>' : '');
    $qa.querySelectorAll('.uc-size').forEach(function (b) {
      b.addEventListener('click', function () {
        $qa.querySelectorAll('.uc-size').forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel'); qaPick = b.getAttribute('data-size'); document.getElementById('ucQaHint').textContent = '';
      });
    });
    document.getElementById('ucQaAdd').addEventListener('click', function () {
      if (p.sizes.length > 1 && !qaPick) { document.getElementById('ucQaHint').textContent = 'Pick a size first.'; return; }
      addToCart(p.handle, qaPick || p.sizes[0], 1); document.body.classList.remove('uc-qa');
    });
    document.body.classList.add('uc-open', 'uc-qa');
  }

  /* ---------------- PDP + upsell ---------------- */
  function renderPDP(handle) {
    var p = byHandle[handle]; if (!p) { closeAll(); return; }
    var sel = null;
    var ups = (p.upsell || []).map(function (h) { return byHandle[h]; }).filter(Boolean).slice(0, 3);
    $pdp.innerHTML =
      '<div class="uc-pdp-wrap"><div class="uc-pdp-grid">' +
        '<div class="uc-pdp-media">' + (p.tag ? '<span class="tag">' + p.tag + '</span>' : '') + '<img src="' + p.image + '" alt="' + p.title + '"></div>' +
        '<div class="uc-pdp-info">' +
          '<div class="eyebrow">' + p.collection + ' · ' + p.category + '</div>' +
          '<h1>' + p.title + '</h1>' +
          '<div class="qa-price">' + money(p.price) + '</div>' +
          '<p class="desc">' + p.description + '</p>' +
          '<div class="uc-sizes" id="ucPdpSizes">' + p.sizes.map(function (s) { return '<button class="uc-size" data-size="' + s + '">' + s + '</button>'; }).join('') + '</div>' +
          '<button class="uc-add" id="ucPdpAdd">' + (mto(p) ? FUL.cta : 'Add to Bag') + ' — ' + money(p.price) + '</button>' +
          '<div class="uc-hint" id="ucPdpHint"></div>' +
          (mto(p) ? '<div class="uc-ship">' + FUL.note + '</div>' : '') +
          '<div class="fabric">' + p.fabric + '</div>' +
        '</div>' +
      '</div></div>' +
      (ups.length ? ('<div class="uc-upsell"><div class="lbl">Complete the Hand</div><h3>Pairs well with</h3>' +
        '<div class="uc-upsell-grid">' + ups.map(function (u) {
          return '<div class="uc-up" data-go="' + u.handle + '"><img src="' + u.image + '" alt="' + u.title + '"><div class="m"><h4>' + u.title + '</h4><span class="p">' + money(u.price) + '</span></div></div>';
        }).join('') + '</div></div>') : '');
    $pdp.querySelectorAll('#ucPdpSizes .uc-size').forEach(function (b) {
      b.addEventListener('click', function () {
        $pdp.querySelectorAll('#ucPdpSizes .uc-size').forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel'); sel = b.getAttribute('data-size'); document.getElementById('ucPdpHint').textContent = '';
      });
    });
    document.getElementById('ucPdpAdd').addEventListener('click', function () {
      if (p.sizes.length > 1 && !sel) { document.getElementById('ucPdpHint').textContent = 'Pick a size first.'; return; }
      addToCart(p.handle, sel || p.sizes[0], 1);
    });
    $pdp.querySelectorAll('.uc-up').forEach(function (u) {
      u.addEventListener('click', function () { location.hash = '#product/' + u.getAttribute('data-go'); });
    });
    document.body.classList.add('uc-pdp');
    $pdp.parentElement.scrollTop = 0;
  }
  function openShopAll() {
    var cols = (window.UNCAPPED && window.UNCAPPED.collections) || ['Shirts', 'Hats', 'Mystery Box'];
    var groups = cols.map(function (coll) {
      var items = ALL.filter(function (p) { return p.collection === coll; });
      if (!items.length) return '';
      return '<div class="uc-sa-group"><div class="g-title">' + coll + ' <span>' + items.length + '</span></div>' +
        '<div class="uc-sa-grid">' + items.map(card).join('') + '</div></div>';
    }).join('');
    $shopAll.innerHTML = '<div class="uc-sa-wrap"><div class="uc-sa-head"><div class="lbl">The Full Spread</div><h2>Every Design</h2></div>' + groups + '</div>';
    $shopAll.querySelectorAll('.card').forEach(function (c) { c.classList.add('in'); }); // not scroll-observed here
    document.body.classList.add('uc-open', 'uc-shopall');
    $shopAll.parentElement.scrollTop = 0;
  }
  function route() {
    var h = location.hash;
    if (h.indexOf('#product/') === 0) {
      var hd = decodeURIComponent(h.replace('#product/', ''));
      if (byHandle[hd]) { document.body.classList.remove('uc-shopall'); document.body.classList.add('uc-open'); renderPDP(hd); return; }
    }
    if (h === '#shop-all') { document.body.classList.remove('uc-pdp'); openShopAll(); return; }
    document.body.classList.remove('uc-pdp', 'uc-shopall');
    if (!document.body.classList.contains('uc-cart') && !document.body.classList.contains('uc-qa')) document.body.classList.remove('uc-open');
  }
  window.addEventListener('hashchange', route);

  /* ---------------- cart render + checkout ---------------- */
  function renderCart() {
    if (!cart.length) { $items.innerHTML = '<div class="uc-empty">Your bag is empty.<br>The felt is calling.</div>'; }
    else {
      $items.innerHTML = cart.map(function (i, idx) {
        var p = byHandle[i.handle]; if (!p) return '';
        return '<div class="uc-li"><img src="' + p.image + '" alt="">' +
          '<div style="flex:1"><div class="n">' + p.title + '</div>' +
          '<div class="s">' + (i.size && i.size !== 'One Size' ? 'Size ' + i.size : p.category) + '</div>' +
          '<div class="p">' + money(p.price) + '</div>' +
          '<div class="uc-qty"><button data-dec="' + idx + '">−</button><span>' + i.qty + '</span><button data-inc="' + idx + '">+</button></div></div>' +
          '<button class="uc-rm" data-rm="' + idx + '">Remove</button></div>';
      }).join('');
    }
    $sub.textContent = money(subtotal());
    document.getElementById('ucCheckout').disabled = !cart.length;
  }
  $items.addEventListener('click', function (e) {
    var inc = e.target.getAttribute('data-inc'), dec = e.target.getAttribute('data-dec'), rm = e.target.getAttribute('data-rm');
    if (inc != null) setQty(+inc, cart[+inc].qty + 1);
    else if (dec != null) setQty(+dec, cart[+dec].qty - 1);
    else if (rm != null) setQty(+rm, 0);
  });

  function syncCount() {
    var n = count();
    document.querySelectorAll('.nav-cart').forEach(function (a) { a.textContent = 'Cart · ' + n; });
    $fabB.textContent = n;
  }
  /* cart openers */
  document.querySelectorAll('.nav-cart').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); openCart(); }); });
  $fab.addEventListener('click', openCart);

  /* checkout */
  document.getElementById('ucCheckout').addEventListener('click', function () {
    if (!cart.length) return;
    if (CFG.live && CFG.domain && CFG.storefrontToken) { liveCheckout(this); }
    else { $demo.textContent = 'Secure checkout opens once Shopify payments are live.'; setTimeout(function () { $demo.textContent = ''; }, 3500); }
  });

  /* ---- Shopify hosted checkout (used when live) ---- */
  function loadBuySDK() {
    return new Promise(function (res, rej) {
      if (window.ShopifyBuy) return res(window.ShopifyBuy);
      var s = document.createElement('script');
      s.src = 'https://sdks.shopifycdn.com/js-buy-sdk/v2/latest/index.umd.min.js';
      s.onload = function () { res(window.ShopifyBuy); }; s.onerror = rej; document.head.appendChild(s);
    });
  }
  function variantId(handle, size) {
    var v = (CFG.variants || {})[handle]; return v ? (v[size] || v['One Size'] || null) : null;
  }
  function liveCheckout(btn) {
    btn.disabled = true; $demo.textContent = 'Building your secure checkout…';
    loadBuySDK().then(function (ShopifyBuy) {
      var client = ShopifyBuy.buildClient({ domain: CFG.domain, storefrontAccessToken: CFG.storefrontToken });
      // resolve any missing variant IDs by product handle, then create checkout
      var needed = cart.filter(function (i) { return !variantId(i.handle, i.size); });
      var lookups = needed.map(function (i) {
        return client.product.fetchByHandle(i.handle).then(function (prod) {
          CFG.variants[i.handle] = CFG.variants[i.handle] || {};
          (prod.variants || []).forEach(function (vr) {
            var sz = (vr.selectedOptions && vr.selectedOptions[0] && vr.selectedOptions[0].value) || 'One Size';
            CFG.variants[i.handle][sz] = vr.id;
          });
        }).catch(function () {});
      });
      return Promise.all(lookups).then(function () {
        var lineItems = cart.map(function (i) { return { variantId: variantId(i.handle, i.size), quantity: i.qty }; })
          .filter(function (li) { return li.variantId; });
        if (!lineItems.length) throw new Error('no-variants');
        return client.checkout.create().then(function (co) {
          return client.checkout.addLineItems(co.id, lineItems).then(function (c2) { window.location.href = c2.webUrl; });
        });
      });
    }).catch(function () {
      btn.disabled = false; $demo.textContent = 'Checkout is being finalized — please try again shortly.';
    });
  }

  /* ---------------- init ---------------- */
  renderCart(); syncCount(); route();
})();
