# UTM Attribution Script

## What is this?

This is a client-side script that tracks where your website visitors come from.

It captures traffic sources (like search engines, social platforms, or AI tools) and keeps that information consistent during a user session.

---

## Why is this needed?

In many setups, attribution breaks easily:

- UTM parameters disappear after the first page
- Referrer data can be unreliable or missing
- Analytics tools may not preserve the original source

This script ensures:

- The **first traffic source is captured once**
- Attribution stays consistent across pages
- Marketing data remains reliable within a session

---

## How does it work (simple view)?

1. Check if UTM parameters exist in the URL  
2. If not, detect the source using `document.referrer`  
3. Store the result in `sessionStorage`  
4. Reuse and sync the values across pages  

---

## Overview

This script handles automatic UTM tracking and attribution on the client side.

It:

- Reads UTM parameters from the URL  
- Detects traffic source from `document.referrer`  
- Classifies traffic into search, AI, social, or referral sources  
- Stores attribution data in `sessionStorage`  
- Synchronizes UTM parameters back into the URL  

It is designed for first-touch attribution per session.

---

## How it works

The script runs immediately on page load and follows three phases:

---

## 1. UTM Detection (URL-based attribution)

If the URL already contains UTM parameters:

- utm_source  
- utm_medium  
- utm_campaign  

Then:

- These values are stored in `sessionStorage`  
- They override any referrer-based detection  
- Attribution is locked for the session  

Example:

```
https://site.com/?utm_source=google&utm_medium=cpc&utm_campaign=launch
```

---

### utm_source

**Definition**  
Represents the origin system or platform that generated the traffic.

**Resolution logic**

- If `utm_source` exists in URL → use directly  
- Else derive from referrer classification:  
  - search engine → mapped engine name  
  - AI tool → mapped AI platform name  
  - social platform → mapped social network name  
  - unknown referrer → hostname extraction  
  - no referrer → direct  

**Output (current implementation)**

google  
bing  
chatgpt  
linkedin  
medium.com  
direct  

**Stored as**

sessionStorage.utm_source  

---

### utm_medium

**Definition**  
Represents the traffic acquisition channel type.

**Resolution logic**

From URL (if present) OR inferred from referrer:

| Condition | Value |
|----------|------|
| search engine referrer | organic |
| AI platform referrer | ai_referral |
| social platform referrer | social |
| unknown external referrer | referral |
| no referrer | "" (empty string) |
| UTM URL provided | preserved value |

**Stored as**

sessionStorage.utm_medium  

---

### utm_campaign

**Definition**  
Represents the marketing campaign identifier.

**Resolution logic**

- Only populated if present in URL  
- Never inferred from referrer  
- Default: empty string  

**Stored as**

sessionStorage.utm_campaign  

---

## 2. Referrer-based attribution (first visit only)

If no UTM parameters exist and the session is not initialized:

The script checks `document.referrer` and classifies it into:

---

### Search Engines → organic

Mapped domains:

- google → google  
- bing → bing  
- yahoo → yahoo  
- duckduckgo → duckduckgo  
- brave → brave  
- ecosia → ecosia  
- baidu → baidu  
- yandex → yandex  

Result:

- utm_source = search engine name  
- utm_medium = organic  

---

### AI Tools → ai_referral

Mapped domains:

- chat.openai.com → chatgpt  
- chatgpt.com → chatgpt  
- perplexity.ai → perplexity  
- claude.ai → claude  
- copilot.microsoft.com → copilot  

Result:

- utm_source = ai platform name  
- utm_medium = ai_referral  

---

### Social Networks → social

Mapped domains:

- facebook.com → facebook  
- instagram.com → instagram  
- x.com / t.co → twitter  
- linkedin.com → linkedin  
- tiktok.com → tiktok  
- youtube.com → youtube  

Result:

- utm_source = platform name  
- utm_medium = social  

---

### Unknown Referrers → referral

If referrer does not match any category:

- utm_source = referrer hostname  
- utm_medium = referral  

---

### No Referrer → direct

If `document.referrer` is empty:

- utm_source = direct  
- utm_medium = ""  

---

## 3. Session Storage Logic

All attribution data is stored in `sessionStorage`:

| Key | Meaning |
|-----|--------|
| utm_source | Traffic source |
| utm_medium | Channel type |
| utm_campaign | Campaign name |
| utm_initialized | Prevents re-evaluation |

### Behavior

- Attribution is only calculated once per session  
- Subsequent pages reuse stored values  
- Prevents overwriting original source  

---

## 4. URL Synchronization

If the URL does not contain UTM parameters:

- Stored session values are appended to the URL  
- Browser history is updated using `replaceState`  

Example transformation:

Before:
```
https://site.com/page
```

After:
```
https://site.com/page?utm_source=google&utm_medium=organic&utm_campaign=
```

---

## 5. Core Function: match(ref, map)

```js
function match(ref, map) {
  for (const domain in map) {
    if (ref.includes(domain)) return map[domain];
  }
  return null;
}
```

**Purpose**

- Matches referrer hostname against known sources  
- Returns standardized source label  

---

## 6. Attribution Priority Logic

The system follows strict priority:

1. UTM in URL → highest priority (always used)  
2. Session stored values → reused if already initialized  
3. Referrer detection → first visit fallback  
4. Direct traffic → no referrer  

---

## 7. Data Model

```json
{
  "utm_source": "string",
  "utm_medium": "string",
  "utm_campaign": "string",
  "utm_initialized": "true"
}
```

---

## 8. Key Behavior Summary

- First-touch attribution per session  
- UTM overrides referrer logic  
- Referrer categorized into search / AI / social / referral  
- Direct traffic fallback supported  
- URL is normalized with UTM parameters  

---

## 9. Limitations

- Uses `sessionStorage` (not persistent across sessions)  
- Referrer-based detection depends on browser privacy settings  
- AI referrer detection depends on known domains list  
- No server-side attribution validation  

---

## 10. Summary

This script implements a client-side UTM attribution system with fallback referrer classification and session persistence, ensuring consistent marketing attribution across page navigation within a single session.
