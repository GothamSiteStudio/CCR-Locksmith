document.addEventListener('DOMContentLoaded', () => {
  const load = async (target, partial) => {
    const bases = [
      '',
      '../',
      '../../',
    ];
    for (const base of bases) {
      const url = `${base}partials/${partial}.html`;
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`Failed to load ${url}`);
        const html = await res.text();
        const tmp = document.createElement('div');
        tmp.innerHTML = html.trim();
        const fragment = document.createDocumentFragment();
        Array.from(tmp.childNodes).forEach((n) => fragment.appendChild(n));
        target.replaceWith(fragment);
        return; // success
      } catch (e) {
        // Try next base
      }
    }
    console.error(`Includes: could not load partial '${partial}'`);
  };

  // 1) Explicit placeholders: <div data-include="site-header"></div>
  document.querySelectorAll('[data-include]').forEach((el) => {
    const name = el.getAttribute('data-include');
    if (name) load(el, name);
  });

  // 2) Auto-replace existing sections if placeholders are not used
  const headerEl = document.querySelector('header.site-header');
  if (headerEl) load(headerEl, 'site-header');
  const trustEl = document.querySelector('div.trust-bar');
  if (trustEl) load(trustEl, 'trust-bar');
  const footerEl = document.querySelector('footer#footer');
  if (footerEl) load(footerEl, 'footer');
});
