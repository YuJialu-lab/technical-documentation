# technical-documentation
Technical Documentation



UTM Builder Documentation
Overview

This module generates UTM-tagged URLs for marketing campaigns.

It appends standardized tracking parameters to a base URL so that analytics tools (e.g. Google Analytics 4) can attribute traffic to specific marketing sources, campaigns, and ads.

This system does not affect page behavior. It only modifies URLs for tracking purposes.

What this module does

Given a base URL and campaign metadata, it returns a fully constructed tracking URL with UTM parameters.

Input
Base URL (required)
Campaign metadata (required + optional fields)
Output
URL with appended UTM query parameters
UTM Parameters

UTM parameters follow the standard marketing tracking structure:

Required fields
Parameter	Description
utm_source	Traffic source (e.g. google, newsletter, facebook)
utm_medium	Marketing channel type (e.g. cpc, email, social)
utm_campaign	Campaign identifier (e.g. launch_2026, spring_sale)
Optional fields
Parameter	Description
utm_content	Differentiates ads or links (e.g. banner_1, button_a)
utm_term	Paid search keyword or targeting term
Example Output
Input
baseUrl: "https://example.com"
utm_source: "google"
utm_medium: "cpc"
utm_campaign: "launch_2026"
utm_content: "ad_variant_1"
utm_term: "layout_tool"
Output
https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=launch_2026&utm_content=ad_variant_1&utm_term=layout_tool
Usage
JavaScript Example
function buildUtmUrl(baseUrl, params) {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  return url.toString();
}

const url = buildUtmUrl("https://example.com", {
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "launch_2026",
  utm_content: "ad_variant_1",
  utm_term: "layout_tool"
});

console.log(url);
Rules & Constraints
Base URL must be valid and include protocol (http/https)
UTM keys must follow lowercase naming convention
Empty values are ignored and not appended
Parameters are appended using query string format (?key=value)
Existing query parameters in base URL are preserved
Behavior Notes
This module does not validate marketing strategy
It does not interpret campaign meaning
It only constructs URLs based on provided input
It is deterministic (same input always produces same output)
Example Use Cases
Google Ads tracking links
Email marketing campaigns
Social media campaign attribution
A/B testing landing pages
Affiliate link tracking
Summary

This UTM builder standardizes marketing URLs by appending structured tracking parameters to a base URL, enabling consistent attribution across campaigns and platforms.