(function (global) {
  const STORAGE_KEY = 'site-language';
  const DEFAULT_LANGUAGE = 'ko';
  const SUPPORTED_LANGUAGES = ['ko', 'ja', 'en', 'zh'];
  const LOCALES_PATH = 'locales';

  let currentLanguage = DEFAULT_LANGUAGE;
  let currentDictionary = {};

  function normalizeLanguage(lang) {
    return SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
  }

  function getSavedLanguage() {
    const saved = global.localStorage.getItem(STORAGE_KEY);
    return normalizeLanguage(saved);
  }

  function setSavedLanguage(lang) {
    global.localStorage.setItem(STORAGE_KEY, normalizeLanguage(lang));
  }

  async function loadLocale(lang) {
    const normalizedLang = normalizeLanguage(lang);
    const response = await fetch(`${LOCALES_PATH}/${normalizedLang}.json`, {
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
    const nodes = base.querySelectorAll('[data-i18n]');

    nodes.forEach(function (node) {
      const key = node.getAttribute('data-i18n');
      const translated = getNestedValue(dict, key);

      if (typeof translated === 'string') {
        node.textContent = translated;
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
