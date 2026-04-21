(() => {
  const doc = document.documentElement;
  const header = document.querySelector('header');
  const snapRoot = document.querySelector('.home-snap .snap-root');
  const scroller = snapRoot || window;
  const isElementScroller = !!snapRoot;

  const track = document.createElement('div');
  track.className = 'progress-track';
  track.setAttribute('aria-hidden', 'true');

  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  track.appendChild(fill);
  document.body.prepend(track);

  const updateHeaderHeightVar = () => {
    if (!header) return;
    const next = Math.round(header.getBoundingClientRect().height) + 3;
    doc.style.setProperty('--header-height', `${next}px`);
  };
  const getHeaderHeightPx = () => {
    if (!header) return 0;
    return Math.round(header.getBoundingClientRect().height) + 3;
  };

  const getScrollTop = () => (
    isElementScroller
      ? snapRoot.scrollTop
      : (doc.scrollTop || document.body.scrollTop || window.scrollY || 0)
  );
  const getScrollHeight = () => (
    isElementScroller
      ? Math.max(0, snapRoot.scrollHeight - snapRoot.clientHeight)
      : Math.max(0, doc.scrollHeight - window.innerHeight)
  );

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
          root: isElementScroller ? snapRoot : null,
          threshold: [0.25, 0.5, 0.75],
          rootMargin: isElementScroller ? '0px 0px -55% 0px' : `-${getHeaderHeightPx()}px 0px -55% 0px`,
        }
      );

      sectionMap.forEach((el) => observer.observe(el));
      activate(sectionMap.keys().next().value);

      navLinks.forEach((a) => {
        a.addEventListener('click', (e) => {
          const href = a.getAttribute('href') || '';
          if (!href.startsWith('#')) return;
          const target = sectionMap.get(href.slice(1));
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', href);
          activate(target.id);
        });
      });
    }
  }

  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
    }
  }

  const el = document.querySelector('.hero-logo');
  if (el) {
    el.style.opacity = '0.06';
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'heroLogoFadeIn 3.8s cubic-bezier(0.16, 1, 0.3, 1) 0s forwards';
  }

  const backgroundSection = document.getElementById('background');
  if (backgroundSection) {
    const paragraphs = Array.from(backgroundSection.querySelectorAll('.source-p'));
    paragraphs.forEach((p, index) => p.style.setProperty('--bg-fade-index', String(index)));

    if ('IntersectionObserver' in window) {
      let played = false;
      const backgroundObserver = new IntersectionObserver(
        (entries) => {
          if (played) return;
          const entry = entries[0];
          if (!entry?.isIntersecting) return;
          backgroundSection.classList.add('bg-visible');
          played = true;
          backgroundObserver.disconnect();
        },
        {
          root: isElementScroller ? snapRoot : null,
          threshold: 0.45,
          rootMargin: isElementScroller ? '0px' : `-${getHeaderHeightPx()}px 0px -35% 0px`,
        }
      );
      backgroundObserver.observe(backgroundSection);
    } else {
      backgroundSection.classList.add('bg-visible');
    }
  }

  updateHeaderHeightVar();
  if (header && 'ResizeObserver' in window) {
    const ro = new ResizeObserver(updateHeaderHeightVar);
    ro.observe(header);
  }

  updateProgress();
  scroller.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', () => {
    updateHeaderHeightVar();
    updateProgress();
  });
})();
