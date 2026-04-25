# UTM Attribution Script

## Overview

This script handles automatic client-side UTM tracking and attribution.

It:
- Reads UTM parameters from the URL
- Detects traffic source from `document.referrer`
- Classifies traffic into search, AI, social, or referral sources
- Stores attribution data in `sessionStorage`
- Syncs UTM parameters back into the URL

Designed for first-touch attribution per session.

---

## How it works

The script runs on page load and follows three phases:

---

## 1. UTM Detection (URL-based attribution)

If the URL contains:
- utm_source
- utm_medium
- utm_campaign

Then:
- Values are stored in sessionStorage
- They override referrer detection
- Attribution is locked for the session

Example:
https://site.com/?utm_source=google&utm_medium=cpc&utm_campaign=launch

---

## 2. Referrer-based attribution (first visit only)

If no UTM exists and session is not initialized, the script checks document.referrer.

### Search engines → organic
google, bing, yahoo, duckduckgo, brave, ecosia, baidu, yandex

Result:
utm_source = engine  
utm_medium = organic  

---

### AI tools → ai_referral
chat.openai.com → chatgpt  
chatgpt.com → chatgpt  
perplexity.ai → perplexity  
claude.ai → claude  
copilot.microsoft.com → copilot  

Result:
utm_source = platform  
utm_medium = ai_referral  

---

### Social networks → social
facebook.com → facebook  
instagram.com → instagram  
x.com / t.co → twitter  
linkedin.com → linkedin  
tiktok.com → tiktok  
youtube.com → youtube  

Result:
utm_source = platform  
utm_medium = social  

---

### Unknown referrers → referral

utm_source = referrer hostname  
utm_medium = referral  

---

### No referrer → direct

utm_source = direct  
utm_medium = ""  

---

## 3. Session Storage Logic

Stored in sessionStorage:

| Key | Meaning |
|-----|--------|
| utm_source | Traffic source |
| utm_medium | Channel type |
| utm_campaign | Campaign name |
| utm_initialized | Prevents re-evaluation |

Behavior:
- Runs once per session
- Values persist across navigation
- Original source is preserved

---

## 4. URL Synchronization

If UTM parameters are missing:

Stored values are added to URL using replaceState.

Before:
https://site.com/page

After:
https://site.com/page?utm_source=google&utm_medium=organic&utm_campaign=

---

## 5. Core Function: match(ref, map)

function match(ref, map) {
  for (const domain in map) {
    if (ref.includes(domain)) return map[domain];
  }
  return null;
}

Purpose:
- Matches referrer domain
- Returns standardized source label

---

## 6. Attribution Priority

1. UTM in URL (highest priority)
2. sessionStorage (if initialized)
3. Referrer detection
4. Direct traffic

---

## 7. Data Model

{
  "utm_source": "google",
  "utm_medium": "organic",
  "utm_campaign": "",
  "utm_initialized": "true"
}

---

## 8. Summary

- First-touch attribution per session
- UTM overrides referrer logic
- Traffic categorized into search, AI, social, referral
- Direct traffic supported
- URL normalization included

---

## 9. Limitations

- sessionStorage only (not persistent across sessions)
- Referrer depends on browser privacy settings
- AI detection depends on known domains list
- No server-side validation
