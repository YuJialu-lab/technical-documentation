# UTM Attribution Script

## Overview

This script handles automatic UTM tracking and attribution on the client side.

It:

Reads UTM parameters from the URL
Detects traffic source from document.referrer
Classifies traffic into search, AI, social, or referral sources
Stores attribution data in sessionStorage
Synchronizes UTM parameters back into the URL

It is designed for first-touch attribution per session.

## How it works

The script runs immediately on page load and follows three phases:

## 1. UTM Detection (URL-based attribution)

If the URL already contains UTM parameters:

utm_source
utm_medium
utm_campaign

Then:

These values are stored in sessionStorage
They override any referrer-based detection
Attribution is locked for the session

Example
https://site.com/?utm_source=google&utm_medium=cpc&utm_campaign=launch

## 2. Referrer-based attribution (first visit only)

If no UTM parameters exist and the session is not initialized:

The script checks document.referrer and classifies it into:

Search Engines → organic

Mapped domains:

google → google
bing → bing
yahoo → yahoo
duckduckgo → duckduckgo
brave → brave
ecosia → ecosia
baidu → baidu
yandex → yandex
etc.

Result:

utm_source = search engine name
utm_medium = organic

AI Tools → ai_referral

Mapped domains:

chat.openai.com → chatgpt
chatgpt.com → chatgpt
perplexity.ai → perplexity
claude.ai → claude
copilot.microsoft.com → copilot

Result:

utm_source = ai platform name
utm_medium = ai_referral

Social Networks → social

Mapped domains:

facebook.com → facebook
instagram.com → instagram
x.com / t.co → twitter
linkedin.com → linkedin
tiktok.com → tiktok
youtube.com → youtube

Result:

utm_source = platform name
utm_medium = social

Unknown Referrers → referral

If referrer does not match any category:

utm_source = referrer hostname
utm_medium = referral

No Referrer → direct

If document.referrer is empty:

utm_source = direct
utm_medium = ""

## 3. Session Storage Logic

All attribution data is stored in sessionStorage:

Key Meaning
utm_source Traffic source
utm_medium Channel type
utm_campaign Campaign name
utm_initialized Prevents re-evaluation

Behavior
Attribution is only calculated once per session
Subsequent pages reuse stored values
Prevents overwriting original source

## 4. URL Synchronization

If the URL does not contain UTM parameters:

Stored session values are appended to the URL
Browser history is updated using replaceState

Example transformation

Before
https://site.com/page

After
https://site.com/page?utm_source=google&utm_medium=organic&utm_campaign=

## 5. Core Function: match(ref, map)

```js
function match(ref, map) {
  for (const domain in map) {
    if (ref.includes(domain)) return map[domain];
  }
  return null;
}
```

Purpose
Matches referrer hostname against known sources
Returns standardized source label

## 6. Attribution Priority Logic

The system follows strict priority:

UTM in URL → highest priority (always used)
Session stored values → reused if already initialized
Referrer detection → first visit fallback
Direct traffic → no referrer

## 7. Data Model

Final stored structure:

{
  utm_source: string,
  utm_medium: string,
  utm_campaign: string,
  utm_initialized: "true"
}

## 8. Key Behavior Summary

First-touch attribution per session
UTM overrides referrer logic
Referrer categorized into search, AI, social, referral
Direct traffic fallback supported
URL is normalized with UTM parameters for consistency

## 9. Limitations

Uses sessionStorage (not persistent across sessions)
Referrer-based detection depends on browser privacy settings
AI referrer detection depends on known domains list
No server-side attribution validation

## 10. Summary

This script implements a client-side UTM attribution system with fallback referrer classification and session persistence, ensuring consistent marketing attribution across page navigation within a single session.
