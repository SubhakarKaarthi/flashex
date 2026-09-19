#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import sys
from urllib import request, parse

SITE_URL = os.getenv("SITE_URL", "https://www.uvtechstore.in")
SITEMAP_URL = os.getenv("SITEMAP_URL", f"{SITE_URL}/sitemap.xml")


def http_post_json(url: str, data: dict, headers: dict | None = None) -> tuple[int, str]:
    payload = json.dumps(data).encode("utf-8")
    req = request.Request(url, data=payload, headers=headers or {}, method="POST")
    try:
        with request.urlopen(req, timeout=20) as response:
            body = response.read().decode("utf-8", errors="replace")
            return response.status, body
    except Exception as exc:  # pragma: no cover - graceful failure for CI
        return 0, str(exc)


def submit_endpoint(label: str, url: str, token: str | None = None, token_header: str = "Authorization") -> None:
    if not url:
        print(f"{label}: skipped - no endpoint configured")
        return
    headers = {"Content-Type": "application/json"}
    if token:
        headers[token_header] = token if token_header.startswith("Bearer") else token
    status, body = http_post_json(url, {"sitemap": SITEMAP_URL}, headers)
    if status in (200, 201, 202, 204):
        print(f"{label}: ok ({status})")
    elif status == 0:
        print(f"{label}: failed ({body})")
    else:
        print(f"{label}: returned {status} - {body[:180]}")


if __name__ == "__main__":
    google_ping = "https://www.google.com/ping?sitemap=" + parse.quote(SITEMAP_URL, safe="")
    bing_ping = "https://www.bing.com/ping?sitemap=" + parse.quote(SITEMAP_URL, safe="")
    submit_endpoint("Google Search Console ping", os.getenv("GSC_PING_URL", google_ping))
    submit_endpoint("Bing Webmaster Tools ping", os.getenv("BING_PING_URL", bing_ping))
    submit_endpoint("Yandex Webmaster submit", os.getenv("YANDEX_SUBMIT_URL"), os.getenv("YANDEX_TOKEN"), "Authorization")
    submit_endpoint("Naver Search Advisor submit", os.getenv("NAVER_SUBMIT_URL"), os.getenv("NAVER_TOKEN"), "Authorization")
    submit_endpoint("Baidu webmaster submit", os.getenv("BAIDU_SUBMIT_URL"), os.getenv("BAIDU_TOKEN"), "Authorization")
    print(f"Sitemap submitted for {SITEMAP_URL}")
