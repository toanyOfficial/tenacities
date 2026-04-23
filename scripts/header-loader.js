(() => {
  const mount = document.querySelector('[data-header-mount]');

  if (!mount) {
    return;
  }

  const loadNavigationScript = () => {
    const existingScript = document.querySelector('script[src="scripts/navigation.js"]');
    if (existingScript) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'scripts/navigation.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load scripts/navigation.js'));
      document.body.appendChild(script);
    });
  };

  fetch('header.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load header.html (${response.status})`);
      }
      return response.text();
    })
    .then((html) => {
      const template = document.createElement('template');
      template.innerHTML = html.trim();

      const header = template.content.querySelector('header');
      if (!header) {
        throw new Error('header.html does not contain a <header> element');
      }

      mount.replaceWith(header);
      return loadNavigationScript();
    })
    .catch((error) => {
      console.error('[header-loader] Initialization failed:', error);
    });
})();
