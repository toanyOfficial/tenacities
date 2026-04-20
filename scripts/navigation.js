(() => {
  const doc = document.documentElement;

  const track = document.createElement('div');
  track.className = 'progress-track';
  track.setAttribute('aria-hidden', 'true');

  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  track.appendChild(fill);
  document.body.prepend(track);

  const updateProgress = () => {
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
    fill.style.transform = `scaleX(${progress})`;
  };

  // Section-based navigation state
  const sectionIds = ['hero', 'background', 'philosophy', 'ci', 'history'];
  const navLinks = Array.from(document.querySelectorAll('header .nav-links a[href^="#"]'));

  if (navLinks.length) {
    const sectionMap = new Map(
      sectionIds
        .map((id) => [id, document.getElementById(id)])
        .filter(([, el]) => !!el)
    );

    const activate = (id) => {
      navLinks.forEach((a) => {
        const hit = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('is-active', hit);
        if (hit) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };

    if (sectionMap.size) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible?.target?.id) activate(visible.target.id);
        },
        {
          root: null,
          threshold: [0.25, 0.5, 0.75],
          rootMargin: '-20% 0px -55% 0px',
        }
      );

      sectionMap.forEach((el) => observer.observe(el));
      activate(sectionMap.keys().next().value);
    }
  }

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
})();
