(() => {
  const doc = document.documentElement;
  const homeSnap = document.body.classList.contains('home-snap');
  const scroller = homeSnap ? document.querySelector('.snap-root') : null;
  const isElementScroller = !!scroller;
  const header = document.querySelector('header');

  const syncHeaderHeight = () => {
    if (!homeSnap || !header) return;
    doc.style.setProperty('--header-height', `${Math.round(header.getBoundingClientRect().height)}px`);
  };

  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);

  const track = document.createElement('div');
  track.className = 'progress-track';
  track.setAttribute('aria-hidden', 'true');

  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  track.appendChild(fill);
  document.body.prepend(track);

  const getScrollTop = () => (isElementScroller ? scroller.scrollTop : (doc.scrollTop || document.body.scrollTop));
  const getScrollHeight = () => (isElementScroller ? scroller.scrollHeight - scroller.clientHeight : doc.scrollHeight - doc.clientHeight);

  const updateProgress = () => {
    const scrollTop = getScrollTop();
    const scrollHeight = getScrollHeight();
    const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
    fill.style.transform = `scaleX(${progress})`;
  };

  const navLinks = Array.from(document.querySelectorAll('header .nav-links a[href^="#"]'));
  const sectionMap = new Map(
    navLinks
      .map((link) => link.getAttribute('href')?.slice(1))
      .filter(Boolean)
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
        root: isElementScroller ? scroller : null,
        threshold: [0.35, 0.6, 0.8],
      }
    );

    sectionMap.forEach((el) => observer.observe(el));
    activate(sectionMap.keys().next().value);

    const scrollToHash = (hash, behavior = 'smooth') => {
      const id = hash?.replace('#', '');
      const target = id ? sectionMap.get(id) : null;
      if (!target) return;

      if (isElementScroller) {
        target.scrollIntoView({ behavior, block: 'start' });
      } else {
        target.scrollIntoView({ behavior, block: 'start' });
      }

      activate(id);
    };

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href?.startsWith('#')) return;
        e.preventDefault();
        history.pushState(null, '', href);
        scrollToHash(href, 'smooth');
      });
    });

    window.addEventListener('hashchange', () => scrollToHash(window.location.hash, 'auto'));

    if (window.location.hash) {
      requestAnimationFrame(() => scrollToHash(window.location.hash, 'auto'));
    }
  }

  const el = document.querySelector('.hero-logo');
  if (el) {
    el.style.opacity = '0.06';
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'heroLogoFadeIn 3.8s cubic-bezier(0.16, 1, 0.3, 1) 0s forwards';
  }

  updateProgress();
  (isElementScroller ? scroller : window).addEventListener('scroll', updateProgress, { passive: true });
})();
