(function (global) {
  const STORAGE_KEY = 'site-language';
  const DEFAULT_LANGUAGE = 'ko';
  const SUPPORTED_LANGUAGES = ['ko', 'ja', 'en', 'zh'];
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

  async function setLanguage(lang) {
    const normalizedLang = normalizeLanguage(lang);
    const dict = await loadLocale(normalizedLang);

    currentLanguage = normalizedLang;
    currentDictionary = dict;
    setSavedLanguage(normalizedLang);
    applyTranslations(dict);

    return { language: currentLanguage, dictionary: currentDictionary };
  }

  async function initializeI18n() {
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
