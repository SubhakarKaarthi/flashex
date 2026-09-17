# FlashEx

FlashEx is an open-source Arduino project scaffolding tool for VS Code and Arduino IDE 2.x. Describe a hardware idea, then let Gemini 2.5 Flash plan the project, write an Arduino sketch, and install the requested Arduino CLI cores and libraries.

## Current release

- Extension version: `0.0.1`
- Supported environments: Windows, macOS, and Linux
- Editor compatibility: VS Code `^1.136.0` or Arduino IDE 2.x
- Required tools: Node.js 20+ for development and Arduino CLI on `PATH`
- Required service: Google Gemini API key, stored in editor secret storage

Generated sketches are starting points. Review, compile, test, and adapt every project before production or safety-critical use.

## Repository structure

- `flashex/` — extension source, tests, build configuration, and package metadata.
- `site/` — static landing page, PWA shell, legal pages, structured metadata, and deployment configuration.
- `.github/workflows/ci.yml` — extension and website validation in GitHub Actions.
- `CONTRIBUTING.md` — development and pull request guidance.

## Install FlashEx

1. Download the [latest VSIX release](https://github.com/SubhakarKaarthi/flashex/releases).
2. Place the VSIX in the Arduino IDE plugin folder: `~/.arduinoIDE/plugins/`.
3. Open the Command Palette with `Ctrl+Shift+P`.
4. Run `FlashEx: Set Up Arduino Project`.
5. Enter your Gemini API key when prompted and describe the project.

## Develop the extension

```bash
cd flashex
npm ci
npm run compile
npm run lint
npm test
```

Create a production VSIX with:

```bash
npm run package
```

## Run the website

The website is a dependency-free static PWA:

```bash
cd site
python3 -m http.server 4173
```

Open `http://localhost:4173`. The production website is available at:

- https://flashex.vercel.app/
- https://www.uvtechstore.in/

The Vercel project should use `site/` as its root directory. The site includes an installable manifest, offline shell, responsive layouts, legal pages, `robots.txt`, `sitemap.xml`, `llms.txt`, `security.txt`, and security headers.

## PWA packaging

The website can be packaged without redesign for Android or desktop:

- Android APK/AAB: Capacitor, PWABuilder, or Bubblewrap
- Windows/macOS/Linux: Tauri, Electron, or PWABuilder

The PWA uses safe-area insets, responsive aspect-ratio handling, light/dark themes, icons, a service worker, and a valid manifest for these routes.

## Project links

- [Website](https://flashex.vercel.app/)
- [Alternate site](https://www.uvtechstore.in/)
- [GitHub repository](https://github.com/SubhakarKaarthi/flashex)
- [Releases](https://github.com/SubhakarKaarthi/flashex/releases)
- [Extension documentation](https://github.com/SubhakarKaarthi/flashex/blob/main/flashex/README.md)
- [Contributing guide](CONTRIBUTING.md)
- [License](LICENSE)