;(function (window, document) {
  "use strict";

  var STORAGE_KEY = "gh_lang";
  var DEFAULT_LANG = "uk";

  function getNested(obj, key) {
    if (!obj || !key) return null;
    return key.split(".").reduce(function (acc, part) {
      return acc && acc[part] != null ? acc[part] : null;
    }, obj);
  }

  function getLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "uk" || saved === "en") return saved;
    return DEFAULT_LANG;
  }

  function translate(key, lang) {
    var pack = window.GH_TRANSLATIONS && window.GH_TRANSLATIONS[lang];
    return getNested(pack, key);
  }

  function applyToElement(el, value, isHtml) {
    if (value == null) return;
    if (isHtml) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  }

  function updateLangButtons(lang) {
    document.querySelectorAll(".gh-lang-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function applyLanguage(lang) {
    if (!window.GH_TRANSLATIONS || !window.GH_TRANSLATIONS[lang]) return;

    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    updateLangButtons(lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      applyToElement(el, translate(el.getAttribute("data-i18n"), lang), false);
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      applyToElement(el, translate(el.getAttribute("data-i18n-html"), lang), true);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var val = translate(el.getAttribute("data-i18n-placeholder"), lang);
      if (val != null) el.setAttribute("placeholder", val);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var val = translate(el.getAttribute("data-i18n-aria"), lang);
      if (val != null) el.setAttribute("aria-label", val);
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var val = translate(el.getAttribute("data-i18n-title"), lang);
      if (val != null) el.setAttribute("title", val);
    });

    var pageKey = document.body.getAttribute("data-i18n-page");
    if (pageKey) {
      var pageTitle = translate("meta." + pageKey, lang);
      var siteName = translate("meta.siteName", lang) || "Okhrimchuk and family";
      if (pageTitle) document.title = pageTitle + " | " + siteName;
    }

    document.dispatchEvent(
      new CustomEvent("gh:languagechange", { detail: { lang: lang } })
    );
  }

  function bindSwitcher() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".gh-lang-btn");
      if (!btn) return;
      var lang = btn.getAttribute("data-lang");
      if (lang === "uk" || lang === "en") applyLanguage(lang);
    });
  }

  window.GH_I18N = {
    getLang: getLang,
    setLang: applyLanguage,
    t: function (key) {
      return translate(key, getLang());
    }
  };

  bindSwitcher();
  applyLanguage(getLang());
})(window, document);
