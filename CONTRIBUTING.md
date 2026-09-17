# Contributing to FlashEx

Thanks for helping improve FlashEx. The repository contains an Arduino/VS Code extension and a static PWA website.

## Development setup

Requirements:

- Node.js 20 or newer
- Arduino CLI on `PATH` for end-to-end hardware workflows
- VS Code or Arduino IDE 2.x
- A Google Gemini API key for the extension command

Install and validate the extension:

```bash
cd flashex
npm ci
npm run compile
npm run lint
npm test
```

Preview the website:

```bash
cd site
python3 -m http.server 4173
```

Open `http://localhost:4173` in a browser. The website is intentionally dependency-free and deploys from the `site/` directory.

## Pull requests

- Keep changes focused and explain user-visible behavior.
- Update the website copy, structured metadata, sitemap, and documentation when product behavior changes.
- Run the extension checks and `git diff --check` before opening a pull request.
- Never commit API keys, generated browser runtimes, `node_modules`, build output, or VSIX artifacts.
- Review generated Arduino code before using it with real hardware.

## Releases

The extension version is declared in `flashex/package.json`. Update the changelog, build the VSIX, create a GitHub Release, and update the website download links together.
