(() => {
  const mount = document.querySelector('[data-header-mount]');

  if (!mount) {
    return;
  }

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
    })
    .catch((error) => {
      console.error('[header-loader] Unable to mount shared header:', error);
    });
})();
