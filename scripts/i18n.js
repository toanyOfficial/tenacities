(() => {
  const STORAGE_KEY = 'tenacities.lang';
  const SUPPORTED = ['ko', 'ja', 'en', 'zh'];
  const FLAG = { ko: '🇰🇷', ja: '🇯🇵', en: '🇺🇸', zh: '🇨🇳' };
  const ROOT_PREFIX = (() => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length) return '';
    const fileLike = parts[parts.length - 1].includes('.');
    const depth = fileLike ? parts.length - 1 : parts.length;
    return '../'.repeat(Math.max(0, depth));
  })();

  const getByPath = (obj, path) => path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

  const normalizeLang = (lang) => (SUPPORTED.includes(lang) ? lang : 'ko');

  let activeLang = normalizeLang(localStorage.getItem(STORAGE_KEY) || 'ko');
  let currentLocale = null;

  const applyTranslations = (locale) => {
    document.documentElement.lang = activeLang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = getByPath(locale, key);
      if (typeof value === 'string') el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const value = getByPath(locale, key);
      if (typeof value === 'string') el.innerHTML = value;
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      const value = getByPath(locale, key);
      if (typeof value === 'string') el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria-label');
      const value = getByPath(locale, key);
      if (typeof value === 'string') el.setAttribute('aria-label', value);
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const key = el.getAttribute('data-i18n-alt');
      const value = getByPath(locale, key);
      if (typeof value === 'string') el.setAttribute('alt', value);
    });
  };

  const loadLocale = async (lang) => {
    const response = await fetch(`${ROOT_PREFIX}locales/${lang}.json`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Failed to load locale: ${lang}`);
    return response.json();
  };

  const setLang = async (lang) => {
    activeLang = normalizeLang(lang);
    localStorage.setItem(STORAGE_KEY, activeLang);
    currentLocale = await loadLocale(activeLang);
    applyTranslations(currentLocale);
    updateBubbleUI();
  };

  const switchLanguage = async (lang) => {
    try {
      await setLang(lang);
    } catch (err) {
      if (lang !== 'ko') {
        await setLang('ko');
      }
    }
  };

  let bubbleButton;
  let panel;

  const updateBubbleUI = () => {
    if (!bubbleButton || !panel) return;
    bubbleButton.textContent = FLAG[activeLang] || '🌐';
    const pickerAria = currentLocale
      ? getByPath(currentLocale, 'lang.pickerAria')
      : null;
    bubbleButton.setAttribute('aria-label', pickerAria || 'Select language');

    panel.querySelectorAll('[data-lang-option]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.langOption === activeLang);
    });
  };

  const buildLanguageUI = () => {
    const wrap = document.createElement('div');
    wrap.className = 'lang-fab-wrap';

    bubbleButton = document.createElement('button');
    bubbleButton.type = 'button';
    bubbleButton.className = 'lang-fab';
    bubbleButton.setAttribute('aria-haspopup', 'true');
    bubbleButton.setAttribute('aria-expanded', 'false');
    bubbleButton.textContent = FLAG[activeLang] || '🌐';

    panel = document.createElement('div');
    panel.className = 'lang-panel';
    panel.hidden = true;

    const items = [
      { code: 'ko', label: '한국어' },
      { code: 'ja', label: '日本語' },
      { code: 'en', label: 'English' },
      { code: 'zh', label: '中文' },
    ];

    items.forEach(({ code, label }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-option';
      btn.dataset.langOption = code;
      btn.innerHTML = `<span class="flag">${FLAG[code]}</span><span>${label}</span>`;
      btn.addEventListener('click', async () => {
        panel.hidden = true;
        bubbleButton.setAttribute('aria-expanded', 'false');
        await switchLanguage(code);
      });
      panel.appendChild(btn);
    });

    bubbleButton.addEventListener('click', () => {
      const willOpen = panel.hidden;
      panel.hidden = !willOpen;
      bubbleButton.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (event) => {
      if (!wrap.contains(event.target)) {
        panel.hidden = true;
        bubbleButton.setAttribute('aria-expanded', 'false');
      }
    });

    wrap.append(bubbleButton, panel);
    document.body.appendChild(wrap);
  };

  document.addEventListener('DOMContentLoaded', async () => {
    buildLanguageUI();
    updateBubbleUI();
    await switchLanguage(activeLang);
  });
})();
