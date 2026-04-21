(() => {
  const doc = document.documentElement;
  const scroller = document.querySelector('.home-snap .snap-root') || window;
  const isElementScroller = scroller !== window;

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

  const sectionIds = ['hero', 'background', 'philosophy', 'ci', 'history'];
  const navLinks = Array.from(document.querySelectorAll('header .nav-links a[href^="#"]'));

  if (navLinks.length) {
    const sectionMap = new Map(sectionIds.map((id) => [id, document.getElementById(id)]).filter(([, el]) => !!el));

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
          threshold: [0.25, 0.5, 0.75],
          rootMargin: '-20% 0px -55% 0px',
        }
      );

      sectionMap.forEach((el) => observer.observe(el));
      activate(sectionMap.keys().next().value);
    }
  }

  // Philosophy shell: internal free-scroll, boundary jumps to neighbor sections
  const philosophyInner = document.querySelector('.philosophy-inner');
  const prevSection = document.getElementById('background');
  const nextSection = document.getElementById('ci');
  let lock = false;
  let boundaryArmed = null; // 'top' | 'bottom' | null
  let boundaryArmedAt = 0;
  const NEXT_INPUT_GAP = 140;

  const jumpTo = (el) => {
    if (!el) return;
    lock = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { lock = false; }, 420);
  };

  if (philosophyInner && isElementScroller) {
    philosophyInner.addEventListener(
      'wheel',
      (e) => {
        if (lock) {
          e.preventDefault();
          return;
        }

        const now = performance.now();
        const atTop = philosophyInner.scrollTop <= 0;
        const atBottom = philosophyInner.scrollTop + philosophyInner.clientHeight >= philosophyInner.scrollHeight - 1;

        // reset arm while actively reading inside content
        if (!atTop && !atBottom) {
          boundaryArmed = null;
          return;
        }

        if (e.deltaY < 0 && atTop) {
          e.preventDefault();
          if (boundaryArmed === 'top' && now - boundaryArmedAt > NEXT_INPUT_GAP) {
            boundaryArmed = null;
            jumpTo(prevSection);
          } else {
            boundaryArmed = 'top';
            boundaryArmedAt = now;
          }
          return;
        }

        if (e.deltaY > 0 && atBottom) {
          e.preventDefault();
          if (boundaryArmed === 'bottom' && now - boundaryArmedAt > NEXT_INPUT_GAP) {
            boundaryArmed = null;
            jumpTo(nextSection);
          } else {
            boundaryArmed = 'bottom';
            boundaryArmedAt = now;
          }
          return;
        }

        // opposite-direction input at boundary disarms
        boundaryArmed = null;
      },
      { passive: false }
    );
  }


  const el = document.querySelector('.hero-logo');
  if (el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'heroLogoFadeIn 2.6s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards';
  }

  updateProgress();
  (isElementScroller ? scroller : window).addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
})();
