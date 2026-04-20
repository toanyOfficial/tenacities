(() => {
  const doc = document.documentElement;

  const track = document.createElement('div');
  track.className = 'progress-track';
  track.setAttribute('aria-hidden', 'true');

  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  track.appendChild(fill);

  document.body.prepend(track);

  const update = () => {
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
    fill.style.transform = `scaleX(${progress})`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();
