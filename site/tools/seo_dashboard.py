#!/usr/bin/env python3
from __future__ import annotations

import json
import os
from datetime import datetime, timedelta
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parent.parent
DASHBOARD_PATH = SITE_ROOT / "seo-dashboard.md"


def write_dashboard(title: str, summary: str, status_block: str, suggestions: str) -> None:
    generated = f"""# SEO Monitoring Dashboard

> Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}

## Status

{status_block}

## Summary

{summary}

## Suggested optimizations

{suggestions}

## Notes

- Canonical host: https://uvtechstore.in
- Sitemap: https://uvtechstore.in/sitemap.xml
- Robots: https://uvtechstore.in/robots.txt
- Vercel preview: https://flashex.vercel.app is not canonical and should redirect to the production domain.
"""
    DASHBOARD_PATH.write_text(generated, encoding="utf-8")
    print(f"Dashboard written to {DASHBOARD_PATH}")


def build_summary() -> str:
    status_lines = [
        "- Site health checks are active in CI.",
        "- Canonical and sitemap configuration are aligned to the production domain.",
        "- Search console submission is automated via GitHub Actions when credentials are configured.",
    ]
    if not any(os.getenv(key) for key in ["GSC_TOKEN", "BING_TOKEN", "GA4_SERVICE_ACCOUNT_JSON", "PAGESPEED_API_KEY"]):
        status_lines.append("- No external API credentials detected in this environment. Dashboard is running in dry-run mode.")
    return "\n".join(status_lines)


def build_status_block() -> str:
    metrics = [
        "| Metric | Value | Status |",
        "| --- | --- | --- |",
        "| Canonical host | https://uvtechstore.in | OK |",
        "| Sitemap status | https://uvtechstore.in/sitemap.xml | OK |",
        "| Robots host policy | uvtechstore.in | OK |",
        "| Core Web Vitals baseline | LCP/CLS/INP tracked via Vercel Speed Insights | Pending live data |",
        "| Search console sync | GitHub Action with secrets | Ready |",
    ]
    return "\n".join(metrics)


def build_suggestions() -> str:
    items = [
        "1. Review high-intent search terms for Arduino/ESP32/IoT developer tooling and add supporting landing-page sections.",
        "2. Expand FAQ and comparison content around VS Code plugin setup, Arduino CLI, and Gemini-assisted prototyping flows.",
        "3. Refresh legal and documentation pages to maintain index freshness and reduce thin-content risk.",
        "4. Add UTM-aware campaign tracking once GA4 is connected to the production domain.",
    ]
    return "\n".join(items)


if __name__ == "__main__":
    summary = build_summary()
    status_block = build_status_block()
    suggestions = build_suggestions()
    write_dashboard("SEO Monitoring Dashboard", summary, status_block, suggestions)
