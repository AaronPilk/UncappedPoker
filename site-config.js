/* ============================================================================
   UNCAPPED — Site config (analytics + waitlist)
   Paste your keys here. Everything degrades gracefully if left blank.
   ========================================================================== */
window.UNCAPPED = window.UNCAPPED || {};

window.UNCAPPED.site = {
  // Meta (Facebook/Instagram) Pixel — get this from Meta Events Manager.
  // Paste just the numeric ID (e.g. '1234567890123456'). Blank = pixel off.
  metaPixelId: '',

  // Waitlist / newsletter capture endpoint. Create a free form at
  // formspree.io (or getform.io) and paste its POST URL here, e.g.
  // 'https://formspree.io/f/abcdwxyz'. Blank = form shows a confirmation
  // but does not store the email.
  waitlistEndpoint: ''
};
