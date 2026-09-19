#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path
import xml.etree.ElementTree as ET

SITE_ROOT = Path(__file__).resolve().parent.parent
EXPECTED_DOMAIN = "https://uvtechstore.in"
BLOCKED_DOMAINS = ["https://flashex.vercel.app", "https://www.flashex.vercel.app"]


def fail(message: str) -> None:
    raise AssertionError(message)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def ensure_no_blocked_domain(target: Path) -> None:
    text = read_text(target)
    for blocked in BLOCKED_DOMAINS:
        if blocked in text:
            fail(f"{target.relative_to(SITE_ROOT)} still references blocked domain {blocked}")


def ensure_canonical(file_path: Path, expected_path: str) -> None:
    text = read_text(file_path)
    canonical = "rel=\"canonical\""
    if canonical not in text:
        fail(f"Missing canonical tag in {file_path.relative_to(SITE_ROOT)}")
    if f"href=\"{EXPECTED_DOMAIN}{expected_path}\"" not in text:
        fail(f"Canonical URL mismatch in {file_path.relative_to(SITE_ROOT)}: expected {EXPECTED_DOMAIN}{expected_path}")


def validate_html_pages() -> None:
    ensure_canonical(SITE_ROOT / "index.html", "/")
    ensure_canonical(SITE_ROOT / "privacy-policy.html", "/privacy-policy")
    ensure_canonical(SITE_ROOT / "terms.html", "/terms")
    ensure_canonical(SITE_ROOT / "licenses.html", "/licenses")

    for page in ["index.html", "privacy-policy.html", "terms.html", "licenses.html"]:
        ensure_no_blocked_domain(SITE_ROOT / page)

    og_url = 'content="https://uvtechstore.in/"'
    if og_url not in read_text(SITE_ROOT / "index.html"):
        fail("Main page OG URL is not canonical to the production domain")


def validate_robots() -> None:
    robots = SITE_ROOT / "robots.txt"
    text = read_text(robots)
    expected_lines = [
        "Sitemap: https://uvtechstore.in/sitemap.xml",
        "Host: uvtechstore.in",
    ]
    for expected in expected_lines:
        if expected not in text:
            fail(f"robots.txt is missing required directive: {expected}")
    ensure_no_blocked_domain(robots)


def validate_sitemap() -> None:
    sitemap_path = SITE_ROOT / "sitemap.xml"
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = [node.text for node in root.findall("sm:url/sm:loc", namespace)]
    if not locs:
        fail("sitemap.xml does not contain any URLs")
    for loc in locs:
        if not loc.startswith(EXPECTED_DOMAIN):
            fail(f"Sitemap contains non-canonical URL: {loc}")
    ensure_no_blocked_domain(sitemap_path)


def validate_vercel() -> None:
    vercel = SITE_ROOT / "vercel.json"
    text = read_text(vercel)
    if '"destination": "https://uvtechstore.in/:path*"' not in text:
        fail("vercel.json does not redirect traffic to the production domain")
    if '"value": "flashex.vercel.app"' not in text and '"value": "www.uvtechstore.in"' not in text:
        fail("vercel.json is missing the required redirect host conditions")


def validate_verification_files() -> None:
    verification_files = [
        SITE_ROOT / ".well-known" / "google-site-verification.txt",
        SITE_ROOT / ".well-known" / "bing-site-verification.txt",
        SITE_ROOT / ".well-known" / "naver-site-verification.txt",
        SITE_ROOT / ".well-known" / "baidu_verify_code.html",
        SITE_ROOT / ".well-known" / "yandex_1234567890.html",
    ]
    for path in verification_files:
        if not path.exists():
            fail(f"Missing verification artifact: {path.relative_to(SITE_ROOT)}")


def main() -> None:
    required_files = [
        SITE_ROOT / "index.html",
        SITE_ROOT / "privacy-policy.html",
        SITE_ROOT / "terms.html",
        SITE_ROOT / "licenses.html",
        SITE_ROOT / "robots.txt",
        SITE_ROOT / "sitemap.xml",
        SITE_ROOT / "vercel.json",
    ]
    for path in required_files:
        if not path.exists():
            fail(f"Missing required file: {path.relative_to(SITE_ROOT)}")
    validate_html_pages()
    validate_robots()
    validate_sitemap()
    validate_vercel()
    validate_verification_files()
    print("SEO validation passed for canonical domain: https://uvtechstore.in")


if __name__ == "__main__":
    try:
        main()
    except AssertionError as exc:
        print(f"SEO validation failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
