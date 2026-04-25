(function () {
  const params = new URLSearchParams(window.location.search);
  const ref = document.referrer;

  const isInitialized = sessionStorage.getItem("utm_initialized");

  const SEARCH_ENGINES = {
    "google.com": "google",
    "bing.com": "bing",
    "yahoo.com": "yahoo",
    "duckduckgo.com": "duckduckgo",
    "search.brave.com": "brave",
    "ecosia.org": "ecosia",
    "startpage.com": "startpage",
    "qwant.com": "qwant",
    "baidu.com": "baidu",
    "yandex.ru": "yandex",
    "search.yahoo.co.jp": "yahoo_japan",
    "google.de": "google",
    "google.co.uk": "google",
    "google.fr": "google",
    "google.es": "google",
    "google.it": "google",
    "bing.co.uk": "bing",
    "bing.de": "bing",
    "metager.de": "metager",
  };

  const AI_SOURCES = {
    "chat.openai.com": "chatgpt",
    "chatgpt.com": "chatgpt",
    "perplexity.ai": "perplexity",
    "claude.ai": "claude",
    "copilot.microsoft.com": "copilot",
  };

  const SOCIAL_SOURCES = {
    "facebook.com": "facebook",
    "instagram.com": "instagram",
    "x.com": "twitter",
    "t.co": "twitter",
    "linkedin.com": "linkedin",
    "tiktok.com": "tiktok",
    "youtube.com": "youtube",
  };

  function match(ref, map) {
    for (const d in map) {
      if (ref.includes(d)) return map[d];
    }
    return null;
  }

  let source = params.get("utm_source");
  let medium = params.get("utm_medium");
  let campaign = params.get("utm_campaign");

  // ======================================
  // 1. UTMs vorhanden → IMMER übernehmen
  // ======================================

  if (source) {
    sessionStorage.setItem("utm_source", source);
    sessionStorage.setItem("utm_medium", medium || "");
    sessionStorage.setItem("utm_campaign", campaign || "");
    sessionStorage.setItem("utm_initialized", "true");
  }

  // ======================================
  // 2. KEINE UTMs → nur beim ersten Besuch setzen
  // ======================================

  else if (!isInitialized) {

    if (ref) {
      const search = match(ref, SEARCH_ENGINES);
      const ai = match(ref, AI_SOURCES);
      const social = match(ref, SOCIAL_SOURCES);

      if (search) {
        source = search;
        medium = "organic";
      } else if (ai) {
        source = ai;
        medium = "ai_referral";
      } else if (social) {
        source = social;
        medium = "social";
      } else {
        source = new URL(ref).hostname;
        medium = "referral";
      }
    } else {
      source = "direct";
      medium = "";
    }

    sessionStorage.setItem("utm_source", source);
    sessionStorage.setItem("utm_medium", medium);
    sessionStorage.setItem("utm_campaign", "");
    sessionStorage.setItem("utm_initialized", "true");
  }

  // ======================================
  // 3. URL SYNC
  // ======================================

  const storedSource = sessionStorage.getItem("utm_source");
  const storedMedium = sessionStorage.getItem("utm_medium");
  const storedCampaign = sessionStorage.getItem("utm_campaign");

  const urlParams = new URLSearchParams(window.location.search);

  if (!urlParams.get("utm_source") && storedSource) {
    urlParams.set("utm_source", storedSource);
    if (storedMedium) urlParams.set("utm_medium", storedMedium);
    if (storedCampaign) urlParams.set("utm_campaign", storedCampaign);

    window.history.replaceState(
      {},
      "",
      window.location.pathname + "?" + urlParams.toString()
    );
  }

})();
