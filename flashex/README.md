# FlashEx extension

FlashEx turns a natural-language hardware description into an Arduino project scaffold. Run **FlashEx: Set Up Arduino Project** from the Command Palette, enter a project description, and FlashEx uses Gemini 2.5 Flash to return a structured project plan, write the `.ino` sketch, and install requested VS Code extensions, Arduino libraries, and board cores.

## Requirements

- VS Code `^1.136.0` or Arduino IDE 2.x
- Arduino CLI available on `PATH`
- Google Gemini API key
- Node.js 20+ for development

The API key is requested only when needed and stored through VS Code secret storage. Generated code must be reviewed and tested before production or safety-critical use.

## Development

```bash
npm ci
npm run compile
npm run lint
npm test
```

Build a release package with `npm run package`. See the repository [README](../README.md) and [contributing guide](../CONTRIBUTING.md) for the complete project workflow.
