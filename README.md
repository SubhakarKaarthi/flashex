# FlashEx

FlashEx is an Arduino IDE 2.x extension that turns a natural-language hardware idea into a runnable project scaffold. It uses Gemini 2.5 Flash to plan the build, writes a project workspace and `.ino` sketch, and installs the Arduino CLI dependencies needed to compile the hardware setup.

## Repository structure

- `flashex/` — VS Code extension source, build config, package metadata, and generated VSIX output.
- `site/` — static marketing and documentation site for deployment on Vercel.
- `README.md` — project overview and setup instructions.

## What the extension does

- Accepts a plain-English prompt such as: `ESP32 web server with DHT22`
- Calls Gemini 2.5 Flash to generate structured project requirements
- Creates a workspace folder and Arduino sketch file
- Installs required Arduino cores and libraries
- Keeps the project workflow aligned with Arduino IDE 2.x usage

## Requirements

- Node.js 20+
- Arduino CLI available on `PATH`
- VS Code or Arduino IDE 2.x
- A Google Gemini API key

## Extension development

From the extension directory:

```bash
cd flashex
npm install
npm run compile
npm test
```

To produce the VSIX package:

```bash
cd flashex
npm run package
```

The generated artifact is located in `flashex/flashex-0.0.1.vsix`.

## Install the extension

1. Download the VSIX from the GitHub Releases page:
   https://github.com/SubhakarKaarthi/autoex/releases
2. Place the file in your Arduino IDE plugin folder:
   `~/.arduinoIDE/plugins/`
3. Open the command palette with `Ctrl+Shift+P`
4. Run `FlashEx: Set Up Arduino Project`

## Static website

The landing page is a static HTML/CSS/JS site and does not require a build step.

Run locally:

```bash
cd site
python3 -m http.server 4173
```

Open `http://localhost:4173` to view it.

For Vercel, set the project root directory to `site` and use the default static-site settings.

## Deployment notes

- The extension package excludes the static site folder via `flashex/.vscodeignore`.
- The website uses safe GitHub links to the repository and release page instead of a direct asset URL that may not exist until a release is published.
- The repo root README is the canonical project documentation for both the extension and the website.

## Links

- GitHub repository: https://github.com/SubhakarKaarthi/autoex
- Releases: https://github.com/SubhakarKaarthi/autoex/releases
- Extension README: https://github.com/SubhakarKaarthi/autoex/blob/main/flashex/README.md