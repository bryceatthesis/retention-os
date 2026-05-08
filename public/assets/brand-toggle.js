/**
 * Brand toggle — persists to localStorage and sets data-active-brand on
 * the <body>. Pages can opt out of the "Both" state via the
 * data-disable-both attribute on <body> (set by Base.astro).
 *
 * No framework — three buttons, one click handler, plain DOM.
 */

(function () {
  const STORAGE_KEY = 'lcc.brand';
  const ALLOWED = ['thesis', 'stasis', 'both'];

  function read() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v && ALLOWED.includes(v)) return v;
    } catch (err) {}
    return 'thesis';
  }

  function write(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (err) {}
  }

  function apply(value) {
    const disableBoth = document.body.dataset.disableBoth === 'true';
    if (value === 'both' && disableBoth) value = 'thesis';
    document.body.dataset.activeBrand = value;
    document.querySelectorAll('.brand-toggle button').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.brand === value ? 'true' : 'false');
    });
    document.dispatchEvent(new CustomEvent('lcc:brand-change', { detail: { brand: value } }));
  }

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest('.brand-toggle button');
    if (!btn) return;
    const value = btn.dataset.brand;
    if (!value || !ALLOWED.includes(value)) return;
    write(value);
    apply(value);
  });

  // Apply on load.
  apply(read());

  // Modal helpers (CreativePreview).
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const opener = target.closest('[data-open-creative]');
    if (opener) {
      const id = opener.getAttribute('data-open-creative');
      const modal = document.getElementById(`creative-modal-${id}`);
      if (modal) modal.setAttribute('open', '');
      return;
    }
    if (target.matches('.modal-backdrop, .modal__close')) {
      const modal = target.closest('.modal-backdrop');
      if (modal) modal.removeAttribute('open');
    }
  });
})();
