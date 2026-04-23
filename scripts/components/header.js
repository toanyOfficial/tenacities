(() => {
  const navItems = [
    {
      id: 'hero',
      label: 'Hero',
      icon: '<img class="tab-icon-logo" src="{ROOT_PREFIX}examples/Tenacities.png" alt="" />',
    },
    { id: 'background', label: 'Background', icon: '🍃' },
    { id: 'philosophy', label: 'Philosophy', icon: '🧭' },
    { id: 'ci', label: 'CI', icon: '🎨' },
    { id: 'history', label: 'History', icon: '📜' },
  ];

  const resolveRootPrefix = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length) return '';
    const fileLike = parts[parts.length - 1].includes('.');
    const depth = fileLike ? (parts.length - 1) : parts.length;
    return '../'.repeat(Math.max(0, depth));
  };

  const renderHeader = ({ activeId = '', home = false } = {}) => {
    const rootPrefix = resolveRootPrefix();
    const navHTML = navItems.map(({ id, label, icon }) => {
      const active = activeId === id;
      const href = home ? `#${id}` : `${rootPrefix}index.html#${id}`;
      const className = active ? 'is-active' : '';
      const ariaCurrent = active ? ' aria-current="true"' : '';
      const iconMarkup = icon.replace('{ROOT_PREFIX}', rootPrefix);

      return `<a href="${href}" aria-label="${label}" class="${className}"${ariaCurrent}><span class="tab-label">${label}</span><span class="tab-icon" aria-hidden="true">${iconMarkup}</span></a>`;
    }).join('\n      ');

    const brandHref = home ? '#hero' : `${rootPrefix}index.html#hero`;

    return `<header>
  <div class="container nav">
    <strong><a class="brand-link" href="${brandHref}">Tenacities</a></strong>
    <nav class="nav-links">
      ${navHTML}
    </nav>
  </div>
</header>`;
  };

  window.TenacitiesHeader = {
    renderHeader,
    render: renderHeader,
  };
})();
