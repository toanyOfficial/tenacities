const MAIN_HEADER_TEMPLATE = `
  <div class="container nav">
    <strong><a class="brand-link" href="__BASE__#hero">Tenacities</a></strong>
    <nav class="nav-links">
      <a href="__BASE__#hero" aria-label="Hero"><span class="tab-label">Hero</span><span class="tab-icon" aria-hidden="true"><img class="tab-icon-logo" src="__ROOT__examples/Tenacities.png" alt="" /></span></a>
      <a href="__BASE__#background" aria-label="Background"><span class="tab-label">Background</span><span class="tab-icon" aria-hidden="true">🍃</span></a>
      <a href="__BASE__#philosophy" aria-label="Philosophy"><span class="tab-label">Philosophy</span><span class="tab-icon" aria-hidden="true">🧭</span></a>
      <a href="__BASE__#ci" aria-label="CI"><span class="tab-label">CI</span><span class="tab-icon" aria-hidden="true">🎨</span></a>
      <a href="__BASE__#history" aria-label="History"><span class="tab-label">History</span><span class="tab-icon" aria-hidden="true">📜</span></a>
    </nav>
  </div>
`;

export const buildMainHeaderTemplate = ({ rootPrefix = '' } = {}) => {
  const basePath = rootPrefix ? `${rootPrefix}index.html` : '';
  return MAIN_HEADER_TEMPLATE
    .replaceAll('__ROOT__', rootPrefix)
    .replaceAll('__BASE__', basePath);
};

export const mountMainHeader = ({ headerHost = document.querySelector('header'), rootPrefix = '' } = {}) => {
  if (!headerHost) return;
  headerHost.innerHTML = buildMainHeaderTemplate({ rootPrefix });
};
