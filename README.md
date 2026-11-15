<p align="center">
  <img src="assets/banner.png" alt="Umbra" width="384">
</p>

<p align="center">
  <strong>Minimal chess analysis overlay with on-board arrows.</strong><br>
  Local engine · no accounts · nothing leaves your machine
</p>

<p align="center">
  <img alt="Release" src="https://img.shields.io/badge/release-1.0.3-0a0a0a?style=flat-square">
  <img alt="Firefox" src="https://img.shields.io/badge/Firefox-109%2B-0a0a0a?style=flat-square">
  <img alt="Windows" src="https://img.shields.io/badge/Windows-10%2F11-0a0a0a?style=flat-square">
  <img alt="Engine" src="https://img.shields.io/badge/engine-local%20WASM-0a0a0a?style=flat-square">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-0a0a0a?style=flat-square">
</p>

> **Firefox only, Windows only.** Umbra is a Firefox extension (MV3, `strict_min_version` 109) plus a small Windows helper. There is no Chrome or Edge build.

---

## What it is

Umbra draws the engine's suggested move straight onto the chess.com board: an orange arrow for the move itself, and a black arrow plus a thin black frame for the follow-up it already plans — the frame marks the piece you will move next. The black marks stay visible while your opponent is thinking.

Two parts:

| Part | What it does |
| --- | --- |
| **Browser extension** | Injects a local chess engine into the chess.com page and computes the move. |
| **`overlay/`** — Windows helper | Draws the arrow in a separate window on top of the board. |

The browser **cannot** draw over another page by itself, which is why the arrow is rendered by the helper and not by the extension.

## Install

### 1. Extension (Firefox)

1. Open `about:debugging#/runtime/this-firefox` in your browser.
2. Click **Load Temporary Add-on…** and select any file inside the repository root (e.g., `manifest.json`).
3. Pin the extension to your toolbar so the popup is always one click away.

> Temporary add-ons stay loaded until Firefox restarts. If the Umbra icon disappears after a restart, load it again from `about:debugging`.

### 2. Helper

1. Double-click `overlay/start.vbs`. It launches silently without a console window.
2. An Umbra icon will appear in your system tray. **Left or right-click** it to open the menu:
   - **Restart**
   - **Quit**
   - Show / hide arrows
   - **Stop frame** — keep arrows out of screen capture, or show them on stream
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

## Streaming (OBS, Twitch, TikTok)

By default the arrow window is **excluded from screen capture**: OBS, Twitch, Discord, Zoom and the Windows screenshot tool do not see the arrows — only your own screen does.

To put the arrows on stream, open the tray menu and switch **Stop frame** to `visible`:

| Tray item | Meaning |
| --- | --- |
| `Стоп-кадр: скрыт` | Arrows are not captured (default). |
| `Стоп-кадр: виден` | Arrows are captured and appear in the stream. |

The switch applies instantly — no restart needed. Use **Window Capture** or **Game Capture** of the browser window in OBS; **Display Capture** works too, because the exclusion is handled by the OS.

> Only stream the overlay where engine assistance is allowed — analysis boards, training, playing against the computer, or reviewing finished games. Using it in rated games against people breaks chess.com's Fair Play rules.

## Troubleshooting

* **The popup says `overlay off — run start.vbs`**
  The helper is not running. Launch `overlay/start.vbs`, then click **Scan board** again.
* **The arrow does not show up**
  The helper window might be hidden behind others, or tray icons are collapsed. Check your system tray (Windows hides new icons under the **^** arrow — pin it via *Settings → Personalization → Taskbar → Other system tray icons*). The log line `capture mode` shows the current state.
* **Arrows are missing from the stream**
  Tray menu → **Stop frame** → `виден`. The window itself stays invisible on your screen, it only becomes visible to the capture.
* **Helper already running**
  A second instance will refuse to start and prompt you to use the tray icon. Use **Restart** from the tray menu instead of launching again.
* **Log file**
  Located at `%TEMP%\umbra-arrow.log`. Automatically truncated when it exceeds 2 MB.

## Security & Privacy

* **100% Local:** No cloud services, no accounts, no telemetry. The upstream analytics module and its remote endpoint have been completely removed in this fork.
* **Isolated Backend:** The helper binds strictly to `127.0.0.1`. No external ports are reachable.
* **Minimal Permissions:** The extension requests access only to `chess.com` (to read the board) and `127.0.0.1:8791` (to communicate with the local helper).

## Repository Layout

```
umbra/                 <- repository root (load this folder in about:debugging)
  manifest.json        <- extension configuration
  popup.html, popup.js <- extension popup UI & logic
  background.js        <- messaging & engine injection
  arrow-bridge.js      <- reads board state, sends geometry to helper
  engine.js            <- engine loop + arrow calculations
  changelog.html       <- "what's new" page
  icon.png             <- logo (also used by the system tray)
  assets/banner.png    <- README banner
  overlay/             <- Windows helper (PowerShell + C#)
    start.vbs          <- silent launcher (no console window)
    arrow-helper.ps1   <- overlay window, tray management, hotkeys
    ArrowServer.cs     <- local loopback HTTP server (port 8791)
```

## Credits & License

Based on [bogenc/ChessBot](https://github.com/bogenc/ChessBot), which carries no license file. The modifications in this repository — rebranding, tray-only controls, single-arrow overlay, black outline hint, capture-mode switch, and complete telemetry/analytics removal — are released under the MIT License. See [LICENSE](LICENSE) for details.

---

## По-русски

Umbra — минималистичный оверлей для chess.com: оранжевая стрелка с подсказкой хода, чёрная стрелка и тонкая чёрная рамка для плана на следующий ход (рамка — на фигуре, которой ходить). Чёрные пометки остаются видимыми, пока думает соперник.

Сейчас поддерживается только Firefox (Windows 10/11). Сборки для Chrome и Edge нет.

### Установка и запуск

**Расширение (Firefox):** откройте `about:debugging#/runtime/this-firefox`, нажмите **Load Temporary Add-on…** и выберите любой файл из папки репозитория (например, `manifest.json`). Временное дополнение живёт до перезапуска Firefox — после перезапуска его нужно загрузить снова.

**Оверлей:** дважды кликните `overlay/start.vbs`. В трее появится иконка Umbra.

**Управление:** ЛКМ или ПКМ по иконке в трее открывает меню («Перезапустить», «Выключить», «Скрыть/Показать стрелки», «Стоп-кадр», «Статус», «Открыть лог»).

**Хоткеи:** `Ctrl+Alt+H` — скрыть/показать стрелки, `Ctrl+Alt+Q` — выход.

### Элементы поповера

| Элемент | Действие |
| --- | --- |
| **Style** | Defensive / Neutral / Offensive — смещает предпочтения движка. |
| **Engine strength** | Глубина поиска и лимит времени. Выше — медленнее и ресурсоёмче. |
| **Auto mode** | Автоматически запускает движок для партий в заданном диапазоне Elo. |
| **Status** | Текущее состояние связи с помощником для Windows. |

### Стрим

По умолчанию стрелки **не попадают в захват экрана**: OBS, Twitch, Discord и ножницы Windows их не видят. Чтобы показать стрелки в трансляции — трей → **«Стоп-кадр: скрыт»** → переключить в **«виден»**. Работает сразу, без перезапуска.

Стримить оверлей стоит только там, где подсказки разрешены: разбор партий, тренировка, игра против компьютера. В рейтинговых партиях с людьми это нарушает правила Fair Play chess.com.

### Частые проблемы

- **Поповер пишет `overlay off`** — запустите `overlay/start.vbs` и нажмите **Scan board** заново.
- **Стрелка не появляется** — окно помощника может быть скрыто за другими, либо иконки в трее свёрнуты. Проверьте трей (Windows прячет новые иконки под **^** — закрепите через *Параметры → Персонализация → Панель задач → Другие значки в системном трее*).
- **Стрелок нет в трансляции** — трей → **«Стоп-кадр»** → «виден».
- **Логи работы** сохраняются здесь: `%TEMP%\umbra-arrow.log`.

### Безопасность и приватность

- **100% локально:** без облачных сервисов, аккаунтов и телеметрии. Модуль аналитики и его удалённый эндпоинт полностью удалены в этом форке.
- **Изолированный бэкенд:** помощник привязан строго к `127.0.0.1`. Внешние порты недоступны.
- **Минимум разрешений:** расширение запрашивает доступ только к `chess.com` (чтение доски) и `127.0.0.1:8791` (связь с локальным помощником).

### Структура репозитория

```
umbra/                 <- корень репозитория (эту папку грузим в about:debugging)
  manifest.json        <- конфигурация расширения
  popup.html, popup.js <- UI и логика поповера
  background.js        <- обмен сообщениями и внедрение движка
  arrow-bridge.js      <- читает состояние доски, шлёт геометрию помощнику
  engine.js            <- цикл движка + расчёт стрелки
  changelog.html       <- страница «что нового»
  icon.png             <- логотип (также иконка в трее)
  assets/banner.png    <- баннер для README
  overlay/             <- помощник для Windows (PowerShell + C#)
    start.vbs          <- тихий запуск (без окна консоли)
    arrow-helper.ps1   <- окно оверлея, трей, горячие клавиши
    ArrowServer.cs     <- локальный loopback HTTP-сервер (порт 8791)
```

### Благодарности и лицензия

Основано на [bogenc/ChessBot](https://github.com/bogenc/ChessBot), в котором нет файла лицензии. Изменения в этом репозитории — ребрендинг, управление только через трей, оверлей с одной стрелкой, чёрная рамка-подсказка, переключатель захвата и полное удаление телеметрии/аналитики — выпущены под лицензией MIT. Подробности в [LICENSE](LICENSE).
