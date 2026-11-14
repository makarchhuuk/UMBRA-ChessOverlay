# Changelog

All notable changes to Umbra. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## 5.5.0

Rebrand and visual redesign.

### Added
- `overlay/` — Windows helper moved into the repository, tray-only control (left or right click opens the menu).
- `README.md`, `CONTRIBUTING.md`, `LICENSE`, `.gitignore`.
- README banner and new logo.

### Changed
- Renamed to **Umbra** — `Chess overlay`, version 5.5.0.
- New logo: black rounded tile with a knight.
- Popup redesigned: black, hairline separators, no gradients or glows.
- Tray menu reordered — **Restart** and **Quit** are the first two items.
- Log file moved to `%TEMP%\umbra-arrow.log`, truncated when it grows past 2 MB.

### Removed
- Floating control panel in the top-right corner of the screen.
- `analytics.js` and its remote endpoint — nothing is uploaded anywhere now.
- Upstream `chessbot-overlay` package that was not part of this fork.

### Fixed
- Helper crashed on `AddHook` because `$source` (the icon bitmap) shadowed the `HwndSource` variable.
- Grey flash on popup buttons during first paint (native button theming showing through).

## 5.4.x and earlier

Inherited from [bogenc/ChessBot](https://github.com/bogenc/ChessBot): the engine injection, the arrow bridge, the popup controls, and the Lichess variant that was later removed from this fork.