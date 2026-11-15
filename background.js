console.info("[UMBRA] background ready (overlay build 1.0.3)");

// ---------------------------------------------------------------------------
// UMBRA screen overlay bridge
//
//  * content script  -> background -> 127.0.0.1:8791   (arrow geometry)
//  * helper panel    -> /command     -> background     (manual scan, auto scan)
//
// The helper (ArrowServer.cs) keeps the control-panel settings and answers
// /command with "scan;<depth>;<elo>" or "none".
// ---------------------------------------------------------------------------

const ARROW_ENDPOINT = "http://127.0.0.1:8791";
const ARROW_TIMEOUT_MS = 1500;
const COMMAND_POLL_MS = 700;
const CHESS_URL = /^https:\/\/([^/]*\.)?chess\.com\//;
const GAME_URL = /^https:\/\/([^/]*\.)?chess\.com\//;

async function arrowRequest(path, body, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs || ARROW_TIMEOUT_MS);

  const options = {
    method: body === undefined ? "GET" : "POST",
    cache: "no-store",
    signal: controller.signal
  };

  if (body !== undefined) {
    options.headers = { "Content-Type": "text/plain;charset=UTF-8" };
    options.body = body;
  }

  try {
    const response = await fetch(ARROW_ENDPOINT + path, options);
    if (!response.ok) return { ok: false };
    const text = await response.text();
    return { ok: true, text };
  } catch (error) {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}

browser.runtime.onMessage.addListener((message) => {
  if (!message || message.type !== "umbra-arrow") return undefined;

  if (message.action === "ping") {
    return arrowRequest("/ping");
  }

  if (message.action === "state") {
    return arrowRequest("/state", String(message.body ?? "0"));
  }

  if (message.action === "game") {
    return arrowRequest("/game", String(message.body ?? ""));
  }

  if (message.action === "runCommand") {
    return runCommand(String(message.body ?? "")).then(() => ({ ok: true }));
  }

  return undefined;
});

// ---------------------------------------------------------------------------
// Scanning
// ---------------------------------------------------------------------------

async function findGameTab() {
  const tabs = await browser.tabs.query({ url: ["https://*.chess.com/*"] });
  if (!tabs.length) return null;
  return tabs.find((tab) => tab.active) || tabs[tabs.length - 1];
}

async function stopPreviousEngine(tabId, url) {
  try {
    await browser.scripting.executeScript({
      target: { tabId },
      func: () => {
        const stop = document.getElementById("umbra-stop-engine");
        if (stop) stop.click();
      }
    });
  } catch (error) {
    // tab may be gone or not ready - not fatal
  }
}

async function startScan(depth, elo) {
  const tab = await findGameTab();
  if (!tab) {
    await arrowRequest("/status", "0;0");
    return;
  }

  const stored = await browser.storage.local.get("stance");
  const stance = stored.stance !== undefined ? stored.stance : 1;

  await stopPreviousEngine(tab.id, tab.url);

  try {
    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: (args) => { window.args = args; },
      args: [{ depth, stance, elo }]
    });

    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["arrow-bridge.js", "engine.js"]
    });

    await arrowRequest("/status", depth + ";" + elo);
    console.info("[UMBRA] scan started on chess.com: depth " + depth + ", elo " + elo);
  } catch (error) {
    console.warn("[UMBRA] scan failed:", String(error));
    await arrowRequest("/status", "0;0");
  }
}

async function runCommand(text) {
  const parts = text.split(";");
  const name = parts[0];

  if (name === "scan") {
    const depth = Number(parts[1]) || 15;
    const elo = Number(parts[2]) || 0;
    await startScan(depth, elo);
  }
}

let polling = false;

async function pollCommand() {
  if (polling) return;
  polling = true;
  try {
    const result = await arrowRequest("/command", undefined, 1200);
    if (result.ok && result.text) {
      const command = result.text.trim();
      if (command && command !== "none") await runCommand(command);
    }
  } catch (error) {
    // helper offline
  } finally {
    polling = false;
  }
}

setInterval(pollCommand, COMMAND_POLL_MS);

// ---------------------------------------------------------------------------
// Auto mode settings (stored by the popup) are mirrored to the helper, so a
// helper restart or a browser restart does not lose them.
// ---------------------------------------------------------------------------

async function pushSettings() {
  try {
    const saved = await browser.storage.local.get(["auto", "minElo", "maxElo"]);
    const auto = saved && saved.auto ? 1 : 0;
    const min = Number(saved && saved.minElo) || 1400;
    const max = Number(saved && saved.maxElo) || 2200;
    await arrowRequest("/settings", auto + ";" + min + ";" + max);
  } catch (error) {
    // storage unavailable - ignore
  }
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area && area !== "local") return;
  if (!("auto" in changes) && !("minElo" in changes) && !("maxElo" in changes)) return;
  pushSettings();
});

pushSettings();

// ---------------------------------------------------------------------------
// Auto mode: keep the bridge alive on chess.com so it can report new games
// ---------------------------------------------------------------------------

async function injectBridge(tabId) {
  try {
    await browser.scripting.executeScript({
      target: { tabId },
      files: ["arrow-bridge.js"]
    });
  } catch (error) {
    // ignore
  }
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab || !tab.url || !GAME_URL.test(tab.url)) return;
  injectBridge(tabId);
});

browser.tabs.query({ url: ["https://*.chess.com/*"] }).then((tabs) => {
  for (const tab of tabs) injectBridge(tab.id);
}).catch(() => {});
