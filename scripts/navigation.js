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

    const pulseGroups = [
      {
        base: 12.2,
        main: philosophySection.querySelector('.philosophy-pulse-1'),
        highlight: philosophySection.querySelector('.philosophy-pulse-highlight-1'),
      },
      {
        base: 13.6,
        main: philosophySection.querySelector('.philosophy-pulse-2'),
        highlight: philosophySection.querySelector('.philosophy-pulse-highlight-2'),
      },
      {
        base: 11.4,
        main: philosophySection.querySelector('.philosophy-pulse-3'),
        highlight: philosophySection.querySelector('.philosophy-pulse-highlight-3'),
      },
    ];

    const applyPulseRandomTiming = ({ base, main, highlight }) => {
      if (!main || !highlight) return;
      const jitter = (Math.random() * 1.5) - 0.75;
      const duration = Math.max(9, base + jitter);
      const durationValue = `${duration.toFixed(2)}s`;
      main.style.setProperty('--pulse-duration', durationValue);
      highlight.style.setProperty('--pulse-duration', durationValue);
    };

    pulseGroups.forEach((group) => {
      if (!group.main || !group.highlight) return;
      applyPulseRandomTiming(group);
    });

    const philosophyContent = philosophySection.querySelector('.philosophy-content');
    const philosophyParagraphs = philosophyContent
      ? Array.from(philosophyContent.querySelectorAll('.source-p'))
      : [];
    const lastParagraph = philosophyParagraphs.length
      ? philosophyParagraphs[philosophyParagraphs.length - 1]
      : null;

    if (lastParagraph) {
      let hasBouncedAtEnd = false;
      let bounceLock = false;
      let isPhilosophyActive = false;
      let lastParagraphBottom = 0;
      let touchY = null;
      let bounceUnlockTimer = 0;
      let pendingDelta = 0;
      let endCheckRaf = 0;

      const clearBounceClass = () => {
        philosophySection.classList.remove('philosophy-bounce');
      };

      const measureLastParagraphBottom = () => {
        const rect = lastParagraph.getBoundingClientRect();
        if (isElementScroller) {
          const scrollerRect = snapRoot.getBoundingClientRect();
          lastParagraphBottom = snapRoot.scrollTop + (rect.bottom - scrollerRect.top);
          return;
        }
        lastParagraphBottom = window.scrollY + rect.bottom;
      };

      const viewportBottom = () => (
        isElementScroller
          ? (snapRoot.scrollTop + snapRoot.clientHeight)
          : (window.scrollY + window.innerHeight)
      );

      const atLastParagraphEnd = () => viewportBottom() >= (lastParagraphBottom - 1);

      const triggerPhilosophyBounce = () => {
        hasBouncedAtEnd = true;
        bounceLock = true;
        clearTimeout(bounceUnlockTimer);
        clearBounceClass();
        philosophySection.classList.add('philosophy-bounce');
        requestAnimationFrame(() => {
          philosophySection.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
        bounceUnlockTimer = window.setTimeout(() => {
          bounceLock = false;
        }, 460);
      };

      const checkBounceTrigger = (deltaY) => {
        if (deltaY <= 0) return;
        if (!isPhilosophyActive) return;
        if (hasBouncedAtEnd || bounceLock) return;
        if (!atLastParagraphEnd()) return;
        triggerPhilosophyBounce();
      };

      const scheduleBounceCheck = (deltaY) => {
        if (deltaY <= 0) return;
        pendingDelta = Math.max(pendingDelta, deltaY);
        if (endCheckRaf) return;
        endCheckRaf = window.requestAnimationFrame(() => {
          endCheckRaf = 0;
          const nextDelta = pendingDelta;
          pendingDelta = 0;
          checkBounceTrigger(nextDelta);
        });
      };

      const resetBounceState = () => {
        hasBouncedAtEnd = false;
        bounceLock = false;
        clearTimeout(bounceUnlockTimer);
        clearBounceClass();
      };

      philosophySection.addEventListener('animationend', (event) => {
        if (event.animationName === 'philosophyBounce') clearBounceClass();
      });

      const inputTarget = isElementScroller ? snapRoot : window;
      inputTarget.addEventListener('wheel', (event) => {
        scheduleBounceCheck(event.deltaY);
      }, { passive: true });

      inputTarget.addEventListener('touchstart', (event) => {
        if (!event.touches?.length) return;
        touchY = event.touches[0].clientY;
      }, { passive: true });

      inputTarget.addEventListener('touchmove', (event) => {
        if (!event.touches?.length || touchY == null) return;
        const nextY = event.touches[0].clientY;
        const deltaY = touchY - nextY;
        touchY = nextY;
        scheduleBounceCheck(deltaY);
      }, { passive: true });

      inputTarget.addEventListener('touchend', () => {
        touchY = null;
      }, { passive: true });

      if ('IntersectionObserver' in window) {
        const activeObserver = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            const active = !!entry?.isIntersecting && entry.intersectionRatio > 0.45;
            if (!active && isPhilosophyActive) resetBounceState();
            isPhilosophyActive = active;
            if (isPhilosophyActive) measureLastParagraphBottom();
          },
          {
            root: isElementScroller ? snapRoot : null,
            threshold: [0.25, 0.45, 0.6],
          }
        );
        activeObserver.observe(philosophySection);
      } else {
        isPhilosophyActive = true;
      }

      measureLastParagraphBottom();
      window.addEventListener('resize', measureLastParagraphBottom, { passive: true });
      window.addEventListener('orientationchange', measureLastParagraphBottom, { passive: true });
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
