(() => {
  const resolveRootPrefix = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length) return '';
    const fileLike = parts[parts.length - 1].includes('.');
    const depth = fileLike ? (parts.length - 1) : parts.length;
    return '../'.repeat(Math.max(0, depth));
  };
  const headerRootPrefix = resolveRootPrefix();
  const homeScoped = headerRootPrefix.length === 0;
  const linkHref = (hash) => (homeScoped ? hash : `${headerRootPrefix}index.html${hash}`);
  const heroLogoSrc = `${headerRootPrefix}examples/Tenacities.png`;
  const unifiedHeaderHtml = `
  <div class="container nav">
    <strong><a class="brand-link" href="${linkHref('#hero')}">Tenacities</a></strong>
    <nav class="nav-links">
      <a href="${linkHref('#hero')}" aria-label="Hero"><span class="tab-label">Hero</span><span class="tab-icon" aria-hidden="true"><img class="tab-icon-logo" src="${heroLogoSrc}" alt="" /></span></a>
      <a href="${linkHref('#background')}" aria-label="Background"><span class="tab-label">Background</span><span class="tab-icon" aria-hidden="true">🍃</span></a>
      <a href="${linkHref('#philosophy')}" aria-label="Philosophy"><span class="tab-label">Philosophy</span><span class="tab-icon" aria-hidden="true">🧭</span></a>
      <a href="${linkHref('#ci')}" aria-label="CI"><span class="tab-label">CI</span><span class="tab-icon" aria-hidden="true">🎨</span></a>
      <a href="${linkHref('#history')}" aria-label="History"><span class="tab-label">History</span><span class="tab-icon" aria-hidden="true">📜</span></a>
    </nav>
  </div>`;
  const headerHost = document.querySelector('header');
  if (headerHost) headerHost.innerHTML = unifiedHeaderHtml;

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
  let activeSectionId = '';
  const emitActiveSectionChange = (id) => {
    window.dispatchEvent(new CustomEvent('tenacities:active-section-change', { detail: { id } }));
  };
  const getCurrentActiveSectionId = () => {
    const current = navLinks.find((link) => link.getAttribute('aria-current') === 'true');
    const href = current?.getAttribute('href') || '';
    return href.startsWith('#') ? href.slice(1) : '';
  };

  if (navLinks.length) {
    const sectionMap = new Map(sectionIds.map((id) => [id, document.getElementById(id)]).filter(([, el]) => !!el));
    const brandLink = document.querySelector('header .brand-link[href="#hero"]');

    const activate = (id) => {
      navLinks.forEach((a) => {
        const hit = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('is-active', hit);
        if (hit) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      if (id && activeSectionId !== id) {
        activeSectionId = id;
        emitActiveSectionChange(id);
      }
    };

    if (sectionMap.size) {
      const sections = Array.from(sectionMap.values());
      const resolveSectionTop = (section) => (
        isElementScroller
          ? section.offsetTop
          : (window.scrollY + section.getBoundingClientRect().top - getHeaderHeightPx())
      );
      const getSnapAlignedSectionId = () => {
        const currentTop = isElementScroller
          ? snapRoot.scrollTop
          : (window.scrollY + getHeaderHeightPx());
        let winner = sections[0];
        let minDistance = Number.POSITIVE_INFINITY;
        sections.forEach((section) => {
          const distance = Math.abs(resolveSectionTop(section) - currentTop);
          if (distance < minDistance) {
            minDistance = distance;
            winner = section;
          }
        });
        return winner?.id || sections[0]?.id;
      };
      let activeSyncRaf = 0;
      const syncActiveToSnapPosition = () => {
        if (activeSyncRaf) return;
        activeSyncRaf = window.requestAnimationFrame(() => {
          activeSyncRaf = 0;
          const nextId = getSnapAlignedSectionId();
          if (nextId) activate(nextId);
        });
      };

      syncActiveToSnapPosition();
      scroller.addEventListener('scroll', syncActiveToSnapPosition, { passive: true });
      window.addEventListener('resize', syncActiveToSnapPosition, { passive: true });

      navLinks.forEach((a) => {
        a.addEventListener('click', (e) => {
          const href = a.getAttribute('href') || '';
          if (!href.startsWith('#')) return;
          const target = sectionMap.get(href.slice(1));
          if (!target) return;
          e.preventDefault();
          if (isElementScroller) {
            snapRoot.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
          } else {
            const top = window.scrollY + target.getBoundingClientRect().top - getHeaderHeightPx();
            window.scrollTo({ top, behavior: 'smooth' });
          }
          history.replaceState(null, '', href);
        });
      });

      if (brandLink) {
        brandLink.addEventListener('click', (e) => {
          const heroTarget = sectionMap.get('hero');
          if (!heroTarget) return;
          e.preventDefault();
          if (isElementScroller) {
            snapRoot.scrollTo({ top: heroTarget.offsetTop, behavior: 'smooth' });
          } else {
            const top = window.scrollY + heroTarget.getBoundingClientRect().top - getHeaderHeightPx();
            window.scrollTo({ top, behavior: 'smooth' });
          }
          history.replaceState(null, '', '#hero');
        });
      }
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
    let heroFadeRaf = 0;
    const replayHeroLogoFade = () => {
      window.cancelAnimationFrame(heroFadeRaf);
      el.style.opacity = '0.06';
      el.style.animation = 'none';
      heroFadeRaf = window.requestAnimationFrame(() => {
        el.style.animation = 'heroLogoFadeIn 3.8s cubic-bezier(0.16, 1, 0.3, 1) 0s forwards';
      });
    };
    const handleHeroActiveChange = (id) => {
      if (id === 'hero') replayHeroLogoFade();
    };
    window.addEventListener('tenacities:active-section-change', (event) => {
      handleHeroActiveChange(event.detail?.id || '');
    });
    window.requestAnimationFrame(() => {
      handleHeroActiveChange(getCurrentActiveSectionId());
    });
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

    let backgroundActive = false;
    const replayBackgroundFade = () => {
      backgroundSection.classList.remove('bg-visible');
      window.requestAnimationFrame(() => {
        backgroundSection.classList.add('bg-visible');
      });
    };
    const handleBackgroundActiveChange = (id) => {
      if (id === 'background') {
        if (!backgroundActive) replayBackgroundFade();
        backgroundActive = true;
        return;
      }
      if (backgroundActive) {
        backgroundActive = false;
        backgroundSection.classList.remove('bg-visible');
      }
    };
    window.addEventListener('tenacities:active-section-change', (event) => {
      handleBackgroundActiveChange(event.detail?.id || '');
    });
    window.requestAnimationFrame(() => {
      handleBackgroundActiveChange(getCurrentActiveSectionId());
    });
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
      let philosophyActive = false;
      const replayPhilosophyFade = () => {
        philosophyInner.classList.remove('philosophy-visible');
        window.requestAnimationFrame(() => {
          philosophyInner.classList.add('philosophy-visible');
        });
      };
      const handlePhilosophyActiveChange = (id) => {
        if (id === 'philosophy') {
          if (!philosophyActive) replayPhilosophyFade();
          philosophyActive = true;
          return;
        }
        if (philosophyActive) {
          philosophyActive = false;
          philosophyInner.classList.remove('philosophy-visible');
        }
      };
      window.addEventListener('tenacities:active-section-change', (event) => {
        handlePhilosophyActiveChange(event.detail?.id || '');
      });
      window.requestAnimationFrame(() => {
        handlePhilosophyActiveChange(getCurrentActiveSectionId());
      });
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
      let isBouncing = false;
      let isPhilosophyActive = false;
      let lastParagraphBottom = 0;
      let touchY = null;
      let pendingDelta = 0;
      let endCheckRaf = 0;

      const clearBounceClass = () => {
        if (!philosophyContent) return;
        philosophyContent.classList.remove('philosophy-bounce');
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
        if (!philosophyContent) return;
        hasBouncedAtEnd = true;
        isBouncing = true;
        clearBounceClass();
        philosophyContent.classList.add('philosophy-bounce');
      };

      const checkBounceTrigger = (deltaY) => {
        if (deltaY <= 0) return;
        if (!isPhilosophyActive) return;
        if (hasBouncedAtEnd || isBouncing) return;
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
        isBouncing = false;
        clearBounceClass();
      };

      if (philosophyContent) {
        philosophyContent.addEventListener('animationend', (event) => {
          if (event.animationName !== 'philosophyBounce') return;
          isBouncing = false;
          clearBounceClass();
        });
      }

      const inputTarget = isElementScroller ? snapRoot : window;
      inputTarget.addEventListener('wheel', (event) => {
        if (isBouncing) return;
        scheduleBounceCheck(event.deltaY);
      }, { passive: true });

      inputTarget.addEventListener('touchstart', (event) => {
        if (!event.touches?.length) return;
        touchY = event.touches[0].clientY;
      }, { passive: true });

      inputTarget.addEventListener('touchmove', (event) => {
        if (!event.touches?.length || touchY == null) return;
        if (isBouncing) return;
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
