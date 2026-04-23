(function (global) {
  const STORAGE_KEY = 'site-language';
  const DEFAULT_LANGUAGE = 'ko';
  const SUPPORTED_LANGUAGES = ['ko', 'ja', 'en', 'zh'];
  const LANGUAGE_META = {
    ko: { flag: '🇰🇷', label: '한국어' },
    ja: { flag: '🇯🇵', label: '日本語' },
    en: { flag: '🇺🇸', label: 'English' },
    zh: { flag: '🇨🇳', label: '中文' }
  };
  const SWITCHER_ROOT_ID = 'language-switcher';
  function getLocalesPath() {
    const script = global.document.currentScript || global.document.querySelector('script[src*="scripts/i18n.js"]');
    const src = script ? script.getAttribute('src') || '' : '';

    if (!src) {
      return 'locales';
    }

    const normalized = src.split('?')[0];
    const basePath = normalized.replace(/scripts\/i18n\.js$/, '');
    return `${basePath}locales`;
  }

  let currentLanguage = DEFAULT_LANGUAGE;
  let currentDictionary = {};

  function normalizeLanguage(lang) {
    return SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
  }

  function getSavedLanguage() {
    try {
      const saved = global.localStorage.getItem(STORAGE_KEY);
      return normalizeLanguage(saved);
    } catch (_error) {
      return DEFAULT_LANGUAGE;
    }
  }

  function setSavedLanguage(lang) {
    try {
      global.localStorage.setItem(STORAGE_KEY, normalizeLanguage(lang));
    } catch (_error) {
      // no-op in restricted storage environments
    }
  }

  async function loadLocale(lang) {
    const normalizedLang = normalizeLanguage(lang);
    const localesPath = getLocalesPath();
    const response = await fetch(`${localesPath}/${normalizedLang}.json`, {
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error(`Failed to load locale: ${normalizedLang}`);
    }

    return response.json();
  }

  function getNestedValue(obj, keyPath) {
    return keyPath.split('.').reduce(function (acc, key) {
      return acc && Object.prototype.hasOwnProperty.call(acc, key) ? acc[key] : undefined;
    }, obj);
  }

  function applyTranslations(dict, root) {
    const base = root || global.document;
    const textNodes = base.querySelectorAll('[data-i18n]');
    const htmlNodes = base.querySelectorAll('[data-i18n-html]');
    const ariaNodes = base.querySelectorAll('[data-i18n-aria-label]');
    const titleNodes = base.querySelectorAll('[data-i18n-title]');

    textNodes.forEach(function (node) {
      const key = node.getAttribute('data-i18n');
      const translated = getNestedValue(dict, key);

      if (typeof translated === 'string') {
        node.textContent = translated;
      }
    });

    htmlNodes.forEach(function (node) {
      const key = node.getAttribute('data-i18n-html');
      const translated = getNestedValue(dict, key);

      if (typeof translated === 'string') {
        node.innerHTML = translated;
      }
    });

    ariaNodes.forEach(function (node) {
      const key = node.getAttribute('data-i18n-aria-label');
      const translated = getNestedValue(dict, key);

      if (typeof translated === 'string') {
        node.setAttribute('aria-label', translated);
      }
    });

    titleNodes.forEach(function (node) {
      const key = node.getAttribute('data-i18n-title');
      const translated = getNestedValue(dict, key);

      if (typeof translated === 'string') {
        node.setAttribute('title', translated);
      }
    });
  }

  function updateSwitcherUI(lang) {
    const root = global.document.getElementById(SWITCHER_ROOT_ID);
    if (!root) {
      return;
    }

    const meta = LANGUAGE_META[lang] || LANGUAGE_META[DEFAULT_LANGUAGE];
    const trigger = root.querySelector('.lang-switcher-trigger');
    const triggerFlag = root.querySelector('.lang-switcher-trigger-flag');
    const triggerLabel = root.querySelector('.lang-switcher-trigger-label');

    if (trigger) {
      trigger.setAttribute('aria-label', `${meta.label} selected. Change language`);
    }
    if (triggerFlag) {
      triggerFlag.textContent = meta.flag;
    }
    if (triggerLabel) {
      triggerLabel.textContent = meta.label;
    }

    root.querySelectorAll('.lang-switcher-option').forEach(function (button) {
      const optionLang = button.getAttribute('data-lang');
      const isActive = optionLang === lang;
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.classList.toggle('is-active', isActive);
    });
  }

  function closeSwitcherPanel() {
    const root = global.document.getElementById(SWITCHER_ROOT_ID);
    if (!root) {
      return;
    }
    root.classList.remove('is-open');
    const trigger = root.querySelector('.lang-switcher-trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  }

  function createLanguageSwitcher() {
    if (global.document.getElementById(SWITCHER_ROOT_ID)) {
      return;
    }

    const root = global.document.createElement('div');
    root.id = SWITCHER_ROOT_ID;
    root.className = 'lang-switcher';

    const trigger = global.document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'lang-switcher-trigger';
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = '<span class="lang-switcher-trigger-flag" aria-hidden="true">🇰🇷</span><span class="lang-switcher-trigger-label">한국어</span>';

    const panel = global.document.createElement('div');
    panel.className = 'lang-switcher-panel';
    panel.setAttribute('role', 'menu');
    panel.setAttribute('aria-label', 'Language selector');

    SUPPORTED_LANGUAGES.forEach(function (lang) {
      const meta = LANGUAGE_META[lang];
      const option = global.document.createElement('button');
      option.type = 'button';
      option.className = 'lang-switcher-option';
      option.setAttribute('role', 'menuitemradio');
      option.setAttribute('data-lang', lang);
      option.innerHTML = `<span class="lang-switcher-flag" aria-hidden="true">${meta.flag}</span><span class="lang-switcher-label">${meta.label}</span>`;
      option.addEventListener('click', function () {
        setLanguage(lang).then(function () {
          closeSwitcherPanel();
        });
      });
      panel.appendChild(option);
    });

    trigger.addEventListener('click', function () {
      const isOpen = root.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    global.document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) {
        root.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    global.document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        root.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    root.appendChild(panel);
    root.appendChild(trigger);
    global.document.body.appendChild(root);
  }

  async function setLanguage(lang) {
    const normalizedLang = normalizeLanguage(lang);
    const dict = await loadLocale(normalizedLang);

    currentLanguage = normalizedLang;
    currentDictionary = dict;
    setSavedLanguage(normalizedLang);
    applyTranslations(dict);
    updateSwitcherUI(normalizedLang);

    return { language: currentLanguage, dictionary: currentDictionary };
  }

  async function initializeI18n() {
    createLanguageSwitcher();
    const initialLanguage = getSavedLanguage();
    return setLanguage(initialLanguage);
  }

  global.i18n = {
    STORAGE_KEY,
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    loadLocale,
    applyTranslations,
    setLanguage,
    initializeI18n,
    getCurrentLanguage: function () {
      return currentLanguage;
    },
    getCurrentDictionary: function () {
      return currentDictionary;
    }
  };
})(window);
