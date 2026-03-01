<div align="center">
  <h1>Iris</h1>
  <p>A lightweight, always-on-top color picker for Windows. Built with Tauri and Rust.</p>
  <br>
  <!-- <img src="assets/banner.png" alt="Iris Banner" width="100%" /> -->
</div>

## Quick Overview

Iris lets you capture, inspect, and organize colors directly from your screen with global hotkeys and an intuitive UI. This tool is designed to be fast, stay out of your way until you need it, and give you immediate access to all color formats and harmonic palettes.

## Showcase

<div align="center">
  <a href="https://www.youtube.com/watch?v=2DtK9Mj-xf4">
    <img src="https://img.youtube.com/vi/2DtK9Mj-xf4/maxresdefault.jpg" alt="Watch the showcase video" width="80%" />
  </a>
</div>

## Features

- **Eyedropper** -- Pick any color from your screen using the native color picker.
- **Color Formats** -- View and copy HEX, RGB, and HSL values with a single click.
- **Color History** -- All picked colors are saved for quick access.
- **Harmonics** -- Generate complementary, analogous, and triadic palettes from any color.
- **UI Scale** -- View a full lightness scale (100-950) for any selected color.
- **Accessibility** -- WCAG contrast ratios against white and black, plus color blindness simulation (protanopia, deuteranopia, tritanopia).
- **Global Shortcuts** -- Two configurable shortcuts:
  - *Global Picker* -- Opens Iris and starts the color picker.
  - *Quick Pick* -- Opens the picker, copies the HEX, and closes the window automatically.
- **System Tray** -- Minimizes to the system tray. Right-click to show or quit.
- **Always on Top** -- Toggle pin to keep Iris above other windows.
- **Dark / Light Theme** -- Switch between dark and light mode in settings.
- **Auto-Start** -- Optionally launch Iris on system startup.

## Installation

Download the latest `.msi` installer from the [Releases](../../releases) page and run it. Iris will be available in your Start Menu.

## Development

Requires [Node.js](https://nodejs.org/) and [Rust](https://www.rust-lang.org/tools/install).

```
npm install
npm run dev
```

## Build

```
npm run build
```

Outputs are in `src-tauri/target/release/bundle/`:
- `msi/Iris_x.x.x_x64_en-US.msi` -- Windows installer
- `nsis/Iris_x.x.x_x64-setup.exe` -- Standalone installer

## Tech Stack

- **Frontend** -- HTML, CSS, JavaScript
- **Backend** -- Rust (Tauri 2.0)
- **Color Capture** -- Native screen capture via `screenshots` and `device_query` crates
- **UI Picker** -- Chrome EyeDropper API with Rust fallback

## License

MIT
