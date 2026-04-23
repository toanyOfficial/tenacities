(() => {
  const headerTemplate = ({ rootPrefix = '', homeScoped = false }) => {
    const linkHref = (hash) => (homeScoped ? hash : `${rootPrefix}index.html${hash}`);
    const logoSrc = `${rootPrefix}examples/Tenacities.png`;
    return `
  <div class="container nav">
    <strong><a class="brand-link" href="${linkHref('#hero')}">Tenacities</a></strong>
    <nav class="nav-links">
      <a href="${linkHref('#hero')}" aria-label="Hero"><span class="tab-label">Hero</span><span class="tab-icon" aria-hidden="true"><img class="tab-icon-logo" src="${logoSrc}" alt="" /></span></a>
      <a href="${linkHref('#background')}" aria-label="Background"><span class="tab-label">Background</span><span class="tab-icon" aria-hidden="true">🍃</span></a>
      <a href="${linkHref('#philosophy')}" aria-label="Philosophy"><span class="tab-label">Philosophy</span><span class="tab-icon" aria-hidden="true">🧭</span></a>
      <a href="${linkHref('#ci')}" aria-label="CI"><span class="tab-label">CI</span><span class="tab-icon" aria-hidden="true">🎨</span></a>
      <a href="${linkHref('#history')}" aria-label="History"><span class="tab-label">History</span><span class="tab-icon" aria-hidden="true">📜</span></a>
    </nav>
  </div>`;
  };

  window.renderSharedHeader = (headerElement, options = {}) => {
    if (!headerElement) return;
    headerElement.innerHTML = headerTemplate(options);
  };
})();
