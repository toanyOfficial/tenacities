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
    const backgroundContent = backgroundSection.querySelector('.reading-width');
    const paragraphs = Array.from(backgroundSection.querySelectorAll('.source-p'));
    paragraphs.forEach((p, index) => p.style.setProperty('--bg-fade-index', String(index)));

    const optimizeBackgroundTypography = () => {
      if (!backgroundContent) return;

      const minScale = 0.58;
      const maxScale = 1.36;
      const baseFontRem = 0.96;
      const baseLineHeight = 1.32;
      const baseGapRem = 0.4;

      const applyScale = (scale) => {
        const bodyFont = baseFontRem * scale;
        backgroundContent.style.setProperty('--bg-font-size', `${bodyFont.toFixed(4)}rem`);
        backgroundContent.style.setProperty('--bg-line-height', `${(baseLineHeight * (0.94 + (scale * 0.06))).toFixed(4)}`);
        backgroundContent.style.setProperty('--bg-paragraph-gap', `${(baseGapRem * (0.8 + (scale * 0.2))).toFixed(4)}rem`);
      };

      const fits = () => {
        const available = Math.floor(window.innerHeight * 0.7);
        const required = backgroundContent.scrollHeight;
        return required <= available;
      };

      applyScale(minScale);
      if (!fits()) {
        let fallbackScale = minScale;
        for (let i = 0; i < 6; i += 1) {
          fallbackScale *= 0.92;
          applyScale(fallbackScale);
          if (fits()) break;
        }
        return;
      }

      applyScale(maxScale);
      if (fits()) return;

      let low = minScale;
      let high = maxScale;
      for (let i = 0; i < 7; i += 1) {
        const mid = (low + high) / 2;
        applyScale(mid);
        if (fits()) low = mid;
        else high = mid;
      }
      applyScale(low);
    };

    let optimizeTimer = 0;
    const scheduleBackgroundOptimization = () => {
      window.cancelAnimationFrame(optimizeTimer);
      optimizeTimer = window.requestAnimationFrame(() => {
        optimizeBackgroundTypography();
        window.requestAnimationFrame(optimizeBackgroundTypography);
      });
    };

    scheduleBackgroundOptimization();
    window.addEventListener('resize', scheduleBackgroundOptimization, { passive: true });
    window.addEventListener('orientationchange', scheduleBackgroundOptimization, { passive: true });

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

  const philosophySection = document.getElementById('philosophy');
  if (philosophySection) {
    const philosophyInner = philosophySection.querySelector('.philosophy-editorial');
    const philosophyBlocks = Array.from(philosophySection.querySelectorAll('.philosophy-block'));
    philosophyBlocks.forEach((block, index) => {
      const order = Number(block.getAttribute('data-philosophy-order'));
      block.style.setProperty('--philosophy-sequence', String(Number.isFinite(order) ? order : index));
    });

    if (philosophyInner) {
      if ('IntersectionObserver' in window) {
        let played = false;
        const philosophyObserver = new IntersectionObserver(
          (entries) => {
            if (played) return;
            const entry = entries[0];
            if (!entry?.isIntersecting) return;
            philosophyInner.classList.add('philosophy-visible');
            played = true;
            philosophyObserver.disconnect();
          },
          {
            root: isElementScroller ? snapRoot : null,
            threshold: 0.01,
            rootMargin: isElementScroller ? '0px 0px -12% 0px' : `-${getHeaderHeightPx()}px 0px -12% 0px`,
          }
        );
        philosophyObserver.observe(philosophySection);
      } else {
        philosophyInner.classList.add('philosophy-visible');
      }
    }

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const hasGsapMotionPath =
      typeof window.gsap !== 'undefined' &&
      typeof window.MotionPathPlugin !== 'undefined';

    if (!prefersReducedMotion && hasGsapMotionPath) {
      const { gsap, MotionPathPlugin } = window;
      gsap.registerPlugin(MotionPathPlugin);

      const motionNodes = [
        {
          node: philosophySection.querySelector('.philosophy-light-node-1'),
          path: '#philosophy-curve-1',
          duration: 13.8,
          start: 0.08,
          end: 0.92,
          delay: -3.2,
        },
        {
          node: philosophySection.querySelector('.philosophy-light-node-2'),
          path: '#philosophy-curve-2',
          duration: 16.1,
          start: 0.1,
          end: 0.88,
          delay: -7.1,
        },
        {
          node: philosophySection.querySelector('.philosophy-light-node-3'),
          path: '#philosophy-curve-3',
          duration: 9.4,
          start: 0.14,
          end: 0.84,
          delay: -2.4,
        },
      ];

      motionNodes.forEach(({ node, path, duration, start, end, delay }) => {
        const pathNode = philosophySection.querySelector(path);
        if (!node || !pathNode) return;
        gsap.to(node, {
          duration,
          repeat: -1,
          ease: 'none',
          delay,
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start,
            end,
          },
        });
      });
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
