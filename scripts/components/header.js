(() => {
  const MAIN_HEADER_DOM = `
<header>
  <div class="container nav">
    <strong><a class="brand-link" href="#hero">Tenacities</a></strong>
    <nav class="nav-links">
      <a href="#hero" aria-label="Hero" class=""><span class="tab-label">Hero</span><span class="tab-icon" aria-hidden="true"><img class="tab-icon-logo" src="examples/Tenacities.png" alt="" /></span></a>
      <a href="#background" aria-label="Background" class=""><span class="tab-label">Background</span><span class="tab-icon" aria-hidden="true">🍃</span></a>
      <a href="#philosophy" aria-label="Philosophy" class=""><span class="tab-label">Philosophy</span><span class="tab-icon" aria-hidden="true">🧭</span></a>
      <a href="#ci" aria-label="CI" class=""><span class="tab-label">CI</span><span class="tab-icon" aria-hidden="true">🎨</span></a>
      <a href="#history" aria-label="History" class=""><span class="tab-label">History</span><span class="tab-icon" aria-hidden="true">📜</span></a>
    </nav>
  </div>
</header>`;

  const resolveRootPrefix = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length) return '';
    const fileLike = parts[parts.length - 1].includes('.');
    const depth = fileLike ? (parts.length - 1) : parts.length;
    return '../'.repeat(Math.max(0, depth));
  };

  const renderHeader = ({ activeId = '', home = false } = {}) => {
    const rootPrefix = resolveRootPrefix();
    const parsed = new DOMParser().parseFromString(MAIN_HEADER_DOM, 'text/html');
    const header = parsed.querySelector('header');
    if (!header) return '';

    const brand = header.querySelector('.brand-link');
    if (brand && !home) {
      brand.setAttribute('href', `${rootPrefix}index.html#hero`);
    }

    const navLinks = Array.from(header.querySelectorAll('.nav-links a'));
    navLinks.forEach((link) => {
      const rawHref = link.getAttribute('href') || '';
      const targetId = rawHref.startsWith('#') ? rawHref.slice(1) : '';
      if (!home && targetId) {
        link.setAttribute('href', `${rootPrefix}index.html#${targetId}`);
      }

      const isActive = !!targetId && targetId === activeId;
      link.setAttribute('class', isActive ? 'is-active' : '');
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

    const logo = header.querySelector('.tab-icon-logo');
    if (logo && !home) {
      logo.setAttribute('src', `${rootPrefix}examples/Tenacities.png`);
    }

    return header.outerHTML;
  };

  window.TenacitiesHeader = {
    renderHeader,
    render: renderHeader,
    template: MAIN_HEADER_DOM,
  };
})();
