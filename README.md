<p align="center">
  <img src="assets/banner.png" alt="Umbra" width="384">
</p>

<p align="center">
  <strong>Minimal chess analysis overlay with on-board arrows.</strong><br>
  Local engine, no accounts, nothing leaves your machine.
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-5.5.0-0a0a0a?style=flat-square">
  <img alt="Platform" src="https://img.shields.io/badge/Windows-10%2F11-0a0a0a?style=flat-square">
  <img alt="Browser" src="https://img.shields.io/badge/Firefox-Supported-orange?style=flat-square">
  <img alt="Engine" src="https://img.shields.io/badge/engine-local%20WASM-0a0a0a?style=flat-square">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-0a0a0a?style=flat-square">
</p>

> **Note:** Currently, Umbra officially supports **Firefox**. Patches and updates adding full Chrome/Edge support are coming soon!

---

## What it is

Umbra draws the engine's suggested move straight onto the chess.com board — one arrow for the move, plus a thin outline on the destination square that stays visible while your opponent is thinking.

Two parts:

| Part | What it does |
| --- | --- |
| **`umbra/`** — browser extension | Injects a local chess engine into the chess.com page and computes the move. |
| **`/overlay`** — Windows helper | Draws the arrow in a separate, capture-excluded window on top of the board. |

The browser **cannot** draw over another page by itself, which is why the arrow is rendered by the helper and not by the extension.

## Install

### 1. Extension (Firefox)

1. Open `about:debugging#/runtime/this-firefox` in your browser.
2. Click **Load Temporary Add-on...** and select any file inside the repository root (e.g., `manifest.json`).
3. Pin the extension to your toolbar so the popup is always one click away.

> *Chrome and Edge support is currently in development and will be available in upcoming updates.*

### 2. Helper

1. Double-click `overlay/start.vbs`. It launches silently without a console window.
2. An Umbra icon will appear in your system tray. **Left or right-click** it to open the menu:
   - **Restart**
   - **Quit**
   - Show / hide arrows
   - Status
   - Open log
3. **Hotkeys:** `Ctrl+Alt+H` to toggle arrows, `Ctrl+Alt+Q` to quit.

The helper listens exclusively on `127.0.0.1:8791` (loopback only) — nothing is exposed to the local network or internet.

## Usage

1. Open a chess.com board (a live game or the analysis board).
2. Open the extension popup and click **Scan board**.
3. The arrow will appear on the board, with the outlined square marking where the move lands.

### Popup Controls

| Control | Effect |
| --- | --- |
| **Style** | Defensive / Neutral / Offensive — biases which moves the engine prefers. |
| **Engine strength** | Search depth and time budget. Higher values are slower and more resource-intensive. |
| **Auto mode** | Automatically starts the engine for games within a specified Elo range. |
| **Status** | Live connection state of the Windows helper. |

## Troubleshooting

* **The popup says `overlay off — run start.vbs`**  
  The helper is not running. Launch `overlay/start.vbs`, then click **Scan board** again.
* **The arrow does not show up**  
  The helper window might be hidden behind others or tray icons are collapsed. Check your system tray (Windows hides new icons under the **^** arrow — pin it via *Settings → Personalization → Taskbar → Other system tray icons*). If running with `CHESSBOT_ARROW_NO_EXCLUDE=1`, capture exclusion is skipped.
* **Helper already running**  
  A second instance will refuse to start and prompt you to use the tray icon. Use **Restart** from the tray menu instead of launching again.
* **Log file**  
  Located at `%TEMP%\umbra-arrow.log`. Automatically truncated when it exceeds 2 MB.

## Security & Privacy

* **100% Local:** No cloud services, no accounts, no telemetry. The upstream analytics module and its remote endpoint have been completely removed in this fork.
* **Isolated Backend:** The helper binds strictly to `127.0.0.1`. No external ports are reachable.
* **Minimal Permissions:** The extension requests access only to `chess.com` (to read the board) and `127.0.0.1:8791` (to communicate with the local helper).

## Repository Layout

text
umbra/                 <- repository root (load this folder in about:debugging)
  manifest.json        <- extension configuration
  popup.html, popup.js <- extension popup UI & logic
  background.js        <- messaging & engine injection
  arrow-bridge.js      <- reads board state, sends geometry to helper
  engine.js            <- engine loop + arrow calculations
  icon.png             <- logo (also used by the system tray)
  assets/banner.png    <- README banner
  overlay/             <- Windows helper (PowerShell + C#)
    start.vbs          <- silent launcher (no console window)
    arrow-helper.ps1   <- overlay window, tray management, hotkeys
    ArrowServer.cs     <- local loopback HTTP server (port 8791)
Credits & License
Based on bogenc/ChessBot, which carries no license file. The modifications in this repository — rebranding, tray-only controls, single-arrow overlay, black outline hint, and complete telemetry/analytics removal — are released under the MIT License. See LICENSE for details.

По-русски
Umbra — минималистичный оверлей для chess.com: стрелка с подсказкой хода и тонкая рамка на целевой клетке (рамка остается видимой, пока думает соперник).

Внимание: На данный момент поддерживается только Firefox. Патчи и обновления с поддержкой Chrome/Edge выйдут совсем скоро!

Установка и запуск
Расширение (Firefox): Перейдите в about:debugging#/runtime/this-firefox, нажмите Load Temporary Add-on... и выберите любой файл из папки репозитория (например, manifest.json).

Оверлей: Дважды кликните по файлу overlay/start.vbs. В трее появится иконка Umbra.

Управление: ЛКМ или ПКМ по иконке в трее открывает меню («Перезапустить», «Выключить», «Скрыть/Показать стрелки», «Статус», «Открыть лог»).

Хоткеи: Ctrl+Alt+H — скрыть/показать стрелки, Ctrl+Alt+Q — выход.

Частые проблемы
Поповер пишет overlay off — запустить overlay/start.vbs и нажать Scan board заново.

Иконки нет в трее — Windows прячет её под стрелочку ^ на панели задач (настройте отображение в параметрах панели задач).

Логи работы сохраняются здесь: %TEMP%\umbra-arrow.log.