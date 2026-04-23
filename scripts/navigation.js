(() => {
  const resolveRootPrefix = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length) return '';
    const fileLike = parts[parts.length - 1].includes('.');
    const depth = fileLike ? (parts.length - 1) : parts.length;
    return '../'.repeat(Math.max(0, depth));
  };
  const rootPrefix = resolveRootPrefix();
  const isKakaoInApp = /KAKAOTALK/i.test(window.navigator.userAgent || '');
  if (isKakaoInApp) {
    document.documentElement.classList.add('is-kakao-inapp');
    document.body.classList.add('is-kakao-inapp');
  }
  const isHomePage = document.body.classList.contains('home-snap');
  const headerHost = document.querySelector('header');
  if (headerHost && !isHomePage) {
    fetch(`${rootPrefix}index.html`)
      .then((response) => response.text())
      .then((html) => {
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const sourceHeader = parsed.querySelector('header');
        if (!sourceHeader) return;
        headerHost.innerHTML = sourceHeader.innerHTML;
        const navLinks = headerHost.querySelectorAll('a[href^="#"]');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href') || '';
          link.setAttribute('href', `${rootPrefix}index.html${href}`);
        });
        const logo = headerHost.querySelector('.tab-icon-logo');
        if (logo) logo.setAttribute('src', `${rootPrefix}assets/logos/Tenacities.png`);
      })
      .catch(() => {});
  }

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
    let heroFadeToken = 0;
    let heroLogoReady = false;
    let heroActive = false;

    const waitForLogoReady = () => new Promise((resolve) => {
      const finalize = async () => {
        if (typeof el.decode === 'function') {
          try {
            await el.decode();
          } catch (_) {
            // Ignore decode errors and proceed with loaded image.
          }
        }
        resolve();
      };

      if (el.complete && el.naturalWidth > 0) {
        finalize();
        return;
      }

      const onLoad = () => {
        el.removeEventListener('error', onError);
        finalize();
      };
      const onError = () => {
        el.removeEventListener('load', onLoad);
        resolve();
      };
      el.addEventListener('load', onLoad, { once: true });
      el.addEventListener('error', onError, { once: true });
    });

    const replayHeroLogoFade = () => {
      window.cancelAnimationFrame(heroFadeRaf);
      heroFadeToken += 1;
      const currentToken = heroFadeToken;
      el.classList.add('is-fade-ready');
      el.classList.remove('is-fading');
      void el.offsetWidth;
      heroFadeRaf = window.requestAnimationFrame(() => {
        if (currentToken !== heroFadeToken) return;
        el.classList.add('is-fading');
      });
    };
    const handleHeroActiveChange = (id) => {
      heroActive = (id === 'hero');
      if (heroActive && heroLogoReady) replayHeroLogoFade();
    };
    window.addEventListener('tenacities:active-section-change', (event) => {
      handleHeroActiveChange(event.detail?.id || '');
    });

    window.requestAnimationFrame(async () => {
      handleHeroActiveChange(getCurrentActiveSectionId());
      await waitForLogoReady();
      heroLogoReady = true;
      el.classList.add('is-fade-ready');
      if (heroActive) replayHeroLogoFade();
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
    const introParts = ['part1', 'part2', 'part3', 'part4']
      .map((part) => philosophySection.querySelector(`[data-philosophy-intro="${part}"]`))
      .filter(Boolean);

    if (introParts.length) {
      let hasPhilosophyIntroPlayed = false;
      let hasPhilosophyIntroStarted = false;
      const introTimers = [];

      philosophySection.classList.add('philosophy-intro-pending');

      const playPhilosophyIntroOnce = () => {
        if (hasPhilosophyIntroPlayed || hasPhilosophyIntroStarted) return;
        hasPhilosophyIntroStarted = true;
        const initialDelay = 120;
        const stepDelay = 560;

        introParts.forEach((part, index) => {
          const timerId = window.setTimeout(() => {
            part.classList.add('is-philosophy-intro-visible');
          }, initialDelay + (index * stepDelay));
          introTimers.push(timerId);
        });

        const completeDelay = initialDelay + ((introParts.length - 1) * stepDelay) + 900;
        const completeTimerId = window.setTimeout(() => {
          hasPhilosophyIntroPlayed = true;
          philosophySection.classList.remove('philosophy-intro-pending');
          philosophySection.classList.add('philosophy-intro-complete');
          introParts.forEach((part) => {
            part.classList.add('is-philosophy-intro-visible');
          });
          introTimers.length = 0;
        }, completeDelay);
        introTimers.push(completeTimerId);
      };

      window.addEventListener('tenacities:active-section-change', (event) => {
        if (event.detail?.id !== 'philosophy') return;
        playPhilosophyIntroOnce();
      });
      window.requestAnimationFrame(() => {
        if (getCurrentActiveSectionId() !== 'philosophy') return;
        playPhilosophyIntroOnce();
      });
    }

    const pulseGroups = [
      {
        base: 12.2,
        main: philosophySection.querySelector('.philosophy-pulse-1'),
        highlight: philosophySection.querySelector('.philosophy-pulse-highlight-1'),
        aura: philosophySection.querySelector('.philosophy-pulse-aura-1'),
      },
      {
        base: 13.6,
        main: philosophySection.querySelector('.philosophy-pulse-2'),
        highlight: philosophySection.querySelector('.philosophy-pulse-highlight-2'),
        aura: philosophySection.querySelector('.philosophy-pulse-aura-2'),
      },
      {
        base: 11.4,
        main: philosophySection.querySelector('.philosophy-pulse-3'),
        highlight: philosophySection.querySelector('.philosophy-pulse-highlight-3'),
        aura: philosophySection.querySelector('.philosophy-pulse-aura-3'),
      },
    ];

    const isMobilePulseMode = window.matchMedia('(max-width: 768px)').matches
      || window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const makePulseFlowState = (group, index) => {
      const { base, main, highlight, aura } = group;
      if (!main) return null;
      const lightningEnabled = !isKakaoInApp;
      const randomFactor = isMobilePulseMode ? 1 : (0.9 + (Math.random() * 0.2));
      const baseDuration = Math.max(9, base);
      const currentDuration = baseDuration * randomFactor;
      const startOffset = -((index + 1) * 240);
      return {
        main,
        highlight: lightningEnabled ? highlight : null,
        aura: lightningEnabled ? aura : null,
        offset: startOffset,
        speed: 1000 / currentDuration,
        targetSpeed: 1000 / currentDuration,
        cycleDistance: 1000,
      };
    };

    const pulseFlowStates = pulseGroups
      .map((group, index) => makePulseFlowState(group, index))
      .filter(Boolean);

    const chooseNextTargetSpeed = (baseDuration) => {
      if (isMobilePulseMode || isKakaoInApp) {
        return 1000 / Math.max(9, baseDuration);
      }
      const randomFactor = 0.9 + (Math.random() * 0.2);
      return 1000 / (Math.max(9, baseDuration) * randomFactor);
    };

    if (pulseFlowStates.length) {
      let lastTimestamp = performance.now();
      const isCoarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      const stepPulseFlow = (timestamp) => {
        const dt = Math.min(0.033, Math.max(0.001, (timestamp - lastTimestamp) / 1000));
        lastTimestamp = timestamp;

        pulseFlowStates.forEach((state, index) => {
          const smoothing = 1 - Math.exp(-dt * (isCoarsePointer ? 2.1 : 2.8));
          state.speed += (state.targetSpeed - state.speed) * smoothing;
          state.offset -= state.speed * dt;

          if (state.offset <= -state.cycleDistance) {
            state.offset += state.cycleDistance;
            state.targetSpeed = chooseNextTargetSpeed(pulseGroups[index].base);
          }

          const normalizedOffset = isMobilePulseMode
            ? Math.round(state.offset)
            : state.offset;
          const offsetValue = normalizedOffset.toFixed(isMobilePulseMode ? 0 : 3);
          state.main.style.strokeDashoffset = offsetValue;
          if (state.highlight) state.highlight.style.strokeDashoffset = offsetValue;
          if (state.aura) state.aura.style.strokeDashoffset = offsetValue;
        });

        window.requestAnimationFrame(stepPulseFlow);
      };

      window.requestAnimationFrame(stepPulseFlow);
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
