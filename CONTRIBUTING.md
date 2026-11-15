# Contributing to Umbra

Thanks for wanting to help. This is a small project, so the rules are short.

## What this project is

Umbra is a **local** chess analysis overlay: a browser extension that runs a chess engine against the chess.com board, plus a small Windows helper that draws the arrow on top of the board.

Two hard rules:

1. **Nothing leaves the machine.** No telemetry, no analytics, no remote endpoints. If a change needs a network call, it needs a very good reason and a discussion first.
2. **No anti-cheat evasion.** Anything that helps hide engine use from chess.com's Fair Play systems will be rejected.

## Getting set up

- Windows 10/11 for the helper (`overlay/`). Firefox 109+ for the extension — there is no Chrome or Edge build.
- No build step. The extension is loaded unpacked straight from the repository.

```sh
git clone <your-fork-url>
cd umbra
```

Load the repository root in `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…**. Launch the helper with `overlay/start.vbs`.

## Before you open a pull request

- `node --check` passes on every `.js` file you touched.
- `manifest.json` is still valid JSON.
- `overlay/arrow-helper.ps1` parses (`Parser::ParseFile`) and keeps its UTF-8 BOM.
- `overlay/start.vbs` stays pure ASCII without a BOM.
- `overlay/ArrowServer.cs` compiles with `csc /target:library`.
- The helper still starts, the tray menu still opens on left and right click, and the port 8791 is still released on exit.

## Style

- Plain ES2019 in the extension, no bundler, no dependencies.
- PowerShell: `Verb-Noun` function names, `$script:` for module-level state, no external modules.
- No new runtime dependencies without a discussion.

## Reporting a bug

Include: browser and version, Windows version, whether the helper was running, and the last lines of `%TEMP%\umbra-arrow.log`. If the arrow is in the wrong place, say what the board coordinates were and what the arrow pointed at — geometry bugs are usually a DPI or board-orientation issue.

## License

By contributing you agree that your contribution is released under the MIT license (see [LICENSE](LICENSE)).
