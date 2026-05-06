<div align="center">
  <h1>Iris</h1>
  <p>A fast Windows color picker with live preview, color naming, history, library folders, and accessibility checks.</p>
</div>

## Showcase

<div align="center">
  <img src="images/base_1.png" alt="Iris color picker main view" width="45%" />
  <img src="images/lib_1.png" alt="Iris color library view" width="45%" />
</div>

## Features

- **Color Library** -- Save colors, organize folders, drag colors between folders, and import/export backups.
- **Live Picker** -- Pixel-accurate preview with eyedropper loupe and Win32 `GetPixel` support.
- **Color Details** -- HEX, RGB, HSL, xkcd color names, descriptive labels, and match confidence.
- **Palettes** -- History, harmonic palettes, and UI tint/tone scales.
- **Accessibility** -- WCAG contrast checks and color blindness simulation.
- **Desktop Workflow** -- Global shortcuts, system tray, always-on-top mode, dark/light themes, and optional auto-start.

## Install

Download the latest `.msi` from [Releases](../../releases).

## Development

Requires Node.js and Rust.

```sh
npm install
npm run dev
```

Build release installers:

```sh
npm run build
```

Outputs:
- `src-tauri/target/release/bundle/msi/Iris_x.x.x_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Iris_x.x.x_x64-setup.exe`

## Tech

Tauri 2, Rust, HTML, CSS, JavaScript.

## License

MIT
