// Umbra arrow bridge
// ---------------------------------------------------------------------------
// engine.js draws the "best move" arrow inside the page, so OBS records it.
// This script:
//   1. detects the arrow engine.js adds to the board SVG;
//   2. hides it in the page;
//   3. sends its on-screen geometry to the desktop helper
//      (Umbra Screen Overlay) through the extension background page.
//
// The helper redraws the arrow in a transparent window that screen capture
// does not see.
//
// If the helper is not running, nothing is hidden and the page behaves exactly
// as before.
// ---------------------------------------------------------------------------
(() => {
    "use strict";

    if (globalThis.__umbraArrowBridge) return;
    globalThis.__umbraArrowBridge = true;

    const HIDDEN_ATTR = "data-umbra-external-hidden";
    const HEARTBEAT_MS = 3500;
    const PING_MS = 5000;
    const FALLBACK_RGB = [255, 170, 0];
    const FALLBACK_ALPHA = 0.64;

    // engine.js pops up "The game has ended. The engine has been stopped."
    // when the game-over modal appears. The overlay already stops the engine,
    // so that popup is noise - swallow just this message, keep every other alert.
    const nativeAlert = window.alert;
    const filteredAlert = function umbraFilteredAlert(message) {
        if (typeof message === "string" && /game has ended/i.test(message)) {
            console.info("[Umbra] game-over popup suppressed");
            return;
        }
        return nativeAlert.call(window, message);
    };

    try {
        window.alert = filteredAlert;
    } catch (_) {
        try {
            Object.defineProperty(window, "alert", { value: filteredAlert, configurable: true, writable: true });
        } catch (__) { }
    }

    if (window.alert !== filteredAlert) {
        console.info("[Umbra] cannot override window.alert in this context");
    }

    const runtime = (typeof browser !== "undefined" && browser.runtime && browser.runtime.sendMessage)
        ? browser.runtime
        : (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage ? chrome.runtime : null);

    const storage = (typeof browser !== "undefined" && browser.storage && browser.storage.local)
        ? browser.storage.local
        : (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local ? chrome.storage.local : null);

    let helperOnline = false;
    let current = null;      // { points: [[x,y],...], color: [r,g,b], alpha } - main arrow
    let second = null;       // same shape, the black follow-up arrow
    let third = null;        // same shape, the black frame around the next piece
    let currentPoly = null;
    let secondPoly = null;
    let thirdPoly = null;
    let lastStateSent = null;
    let sendHandle = null;
    let stateInFlight = false;
    let pendingState = false;

    // --- transport -------------------------------------------------------------------------------

    const ENDPOINT = "http://127.0.0.1:8791";
    const REQUEST_TIMEOUT_MS = 1200;
    let transportLogged = false;

    // Content scripts are not bound by the page CSP, and the extension has
    // host permission for 127.0.0.1, so the direct request is the most
    // reliable path. The background relay stays as a fallback.
    function direct(path, body) {
        const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS) : null;

        const options = {
            method: body === undefined ? "GET" : "POST",
            mode: "cors",
            cache: "no-store"
        };
        if (body !== undefined) {
            options.headers = { "Content-Type": "text/plain;charset=UTF-8" };
            options.body = body;
        }
        if (controller) options.signal = controller.signal;

        let request;
        try {
            request = fetch(ENDPOINT + path, options);
        } catch (_) {
            request = Promise.reject(new Error("fetch unavailable"));
        }

        return request
            .then((response) => ({ ok: response.ok, via: "direct" }))
            .catch((error) => ({ ok: false, via: "direct", error: String(error && error.message || error) }))
            .then((result) => {
                if (timer) clearTimeout(timer);
                return result;
            });
    }

    function relay(payload) {
        if (!runtime) return Promise.resolve({ ok: false });
        try {
            if (typeof browser !== "undefined" && browser.runtime === runtime) {
                return Promise.resolve(runtime.sendMessage(payload))
                    .then((response) => response || { ok: false })
                    .catch(() => ({ ok: false }));
            }
            return new Promise((resolve) => {
                let settled = false;
                const done = (response) => {
                    if (settled) return;
                    settled = true;
                    resolve(response || { ok: false });
                };
                try {
                    runtime.sendMessage(payload, done);
                } catch (_) {
                    done(null);
                }
            });
        } catch (_) {
            return Promise.resolve({ ok: false });
        }
    }

    function call(payload) {
        const action = payload.action;
        const path = action === "ping" ? "/ping" : (action === "game" ? "/game" : "/state");
        const body = action === "ping" ? undefined : String(payload.body ?? (action === "game" ? "" : "0"));

        return direct(path, body).then((result) => {
            if (result.ok) return result;
            return relay(payload).then((response) => {
                if (response && response.ok) return { ok: true, via: "background" };
                warnUnreachable(result, response);
                return { ok: false, via: result.via };
            });
        });
    }

    let lastWarn = 0;

    function warnUnreachable(directResult, relayResult) {
        if (Date.now() - lastWarn < 15000) return;
        lastWarn = Date.now();
        const relayInfo = runtime
            ? (relayResult ? "background said " + JSON.stringify(relayResult) : "background failed")
            : "no background runtime";
        console.warn(
            "[Umbra] overlay helper not reachable (direct: " + (directResult.error || "failed") +
            "; " + relayInfo + "). Is start.vbs running?"
        );
    }

    function serialize(state, secondState, thirdState) {
        const first = serializeOne(state);
        const second = serializeOne(secondState);
        const third = serializeOne(thirdState);
        // The follow-up arrow and frame can stay on the board on their own
        // while the opponent is thinking, so "0|..." is a valid body.
        if (first === "0" && second === "0" && third === "0") return "0";
        return first + "|" + second + "|" + third;
    }

    function serializeOne(state) {
        if (!state || !state.points || state.points.length < 3) return "0";
        const c = state.color || FALLBACK_RGB;
        const a = Number.isFinite(state.alpha) ? state.alpha : FALLBACK_ALPHA;
        // "1" = filled shape, "2" = thin outline (frame around a square).
        const parts = [state.outline ? "2" : "1", c[0] + "," + c[1] + "," + c[2], a.toFixed(3)];
        for (const p of state.points) parts.push(p[0] + "," + p[1]);
        return parts.join(";");
    }

    function sendState(force) {
        if (!helperOnline) return;
        const body = document.hidden ? "0" : serialize(current, second, third);
        if (!force && body === lastStateSent) return;
        if (stateInFlight) {
            pendingState = true;
            return;
        }
        stateInFlight = true;
        call({ type: "umbra-arrow", action: "state", body }).then((response) => {
            stateInFlight = false;
            const ok = !!(response && response.ok);
            if (ok) {
                lastStateSent = body;
            } else {
                lastStateSent = null;
                if (helperOnline) {
                    helperOnline = false;
                    restoreInPage();
                }
            }
            if (pendingState) {
                pendingState = false;
                sendState(false);
            }
        });
    }

    function scheduleSend() {
        if (sendHandle) return;
        sendHandle = setTimeout(() => {
            sendHandle = null;
            sendState(false);
        }, 40);
    }

    // --- geometry --------------------------------------------------------------------------------

    function viewportOrigin() {
        const x = typeof window.mozInnerScreenX === "number" ? window.mozInnerScreenX : window.screenX;
        const y = typeof window.mozInnerScreenY === "number" ? window.mozInnerScreenY : window.screenY;
        return { x, y };
    }

    function toScreenPoints(poly) {
        const svg = poly.ownerSVGElement;
        if (!svg) return null;

        const raw = (poly.getAttribute("points") || "").trim();
        if (!raw) return null;
        const nums = raw.split(/[\s,]+/).map(Number).filter(Number.isFinite);
        if (nums.length < 6) return null;

        const origin = viewportOrigin();
        const scale = window.devicePixelRatio || 1;

        // getScreenCTM maps the polygon's own user space (including its
        // rotate() transform and the viewBox) to viewport CSS pixels, so
        // flipped boards and rotated arrows are handled for free.
        let m = null;
        try {
            m = poly.getScreenCTM();
        } catch (_) {
            m = null;
        }

        let fallback = null;
        if (!m) {
            const vb = svg.viewBox && svg.viewBox.baseVal;
            const box = vb && vb.width > 0 && vb.height > 0
                ? { x: vb.x, y: vb.y, w: vb.width, h: vb.height }
                : { x: 0, y: 0, w: 100, h: 100 };
            const rect = svg.getBoundingClientRect();
            if (!rect.width || !rect.height) return null;
            fallback = {
                a: rect.width / box.w, b: 0,
                c: 0, d: rect.height / box.h,
                e: rect.left - box.x * rect.width / box.w,
                f: rect.top - box.y * rect.height / box.h
            };
        }

        const matrix = m || fallback;
        const points = [];

        for (let i = 0; i + 1 < nums.length; i += 2) {
            const x = nums[i];
            const y = nums[i + 1];
            const px = matrix.a * x + matrix.c * y + matrix.e;
            const py = matrix.b * x + matrix.d * y + matrix.f;
            points.push([
                Math.round((origin.x + px) * scale),
                Math.round((origin.y + py) * scale)
            ]);
        }

        return points;
    }

    function readStyle(poly) {
        let fill = poly.style.fill || "";
        if (!fill) {
            try { fill = getComputedStyle(poly).fill || ""; } catch (_) {}
        }
        let color = FALLBACK_RGB.slice();
        let alpha = 1;
        let outline = false;

        // The follow-up marker is a frame: no fill, the stroke carries the color.
        if (!fill || fill === "none" || /^transparent$/i.test(fill) || /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i.test(fill)) {
            let stroke = poly.style.stroke || "";
            if (!stroke) {
                try { stroke = getComputedStyle(poly).stroke || ""; } catch (_) {}
            }
            if (stroke && stroke !== "none") {
                fill = stroke;
                outline = true;
            }
        }

        const match = fill.match(/rgba?\(([^)]+)\)/i);
        if (match) {
            const c = match[1].split(/[,\s\/]+/).filter(Boolean).map(Number);
            if (c.length >= 3 && c.slice(0, 3).every(Number.isFinite)) {
                color = c.slice(0, 3).map((v) => Math.max(0, Math.min(255, Math.round(v))));
            }
            if (c.length >= 4 && Number.isFinite(c[3])) alpha = c[3];
        }

        let opacity = parseFloat(poly.style.opacity || "");
        if (!Number.isFinite(opacity)) {
            try { opacity = parseFloat(getComputedStyle(poly).opacity || "1"); } catch (_) { opacity = 1; }
        }
        if (!Number.isFinite(opacity)) opacity = 1;

        alpha = Math.max(0, Math.min(1, alpha * opacity));
        return { color, alpha, outline };
    }

    function capture(poly) {
        // The arrow may be hidden right now (display:none) because the helper
        // owns it. getScreenCTM() needs the element to be rendered, so restore
        // it for the measurement only - no paint happens in between.
        const wasHidden = poly.style.display === "none";
        if (wasHidden) poly.style.display = "";
        try {
            const points = toScreenPoints(poly);
            if (!points) return null;
            const style = readStyle(poly);
            return { points, color: style.color, alpha: style.alpha };
        } finally {
            if (wasHidden) poly.style.display = "none";
        }
    }

    // --- page-side arrow -------------------------------------------------------------------------

    function hideInPage(poly) {
        poly.style.display = "none";
        poly.setAttribute(HIDDEN_ATTR, "1");
    }

    function restoreInPage(root) {
        const scope = root || document;
        scope.querySelectorAll(".bestmove[" + HIDDEN_ATTR + "]").forEach((poly) => {
            poly.style.display = "";
            poly.removeAttribute(HIDDEN_ATTR);
        });
    }

    function hideUnhiddenArrows() {
        if (!helperOnline) return;
        document.querySelectorAll(".bestmove").forEach((poly) => {
            if (poly.getAttribute(HIDDEN_ATTR) !== "1") hideInPage(poly);
        });
    }

    function takeArrow(poly) {
        const isFrame = poly.classList.contains("bestmove-3");
        const isFollowUp = poly.classList.contains("bestmove-2");
        if (isFrame) {
            thirdPoly = poly;
            third = capture(poly);
            if (helperOnline && third) hideInPage(poly);
        } else if (isFollowUp) {
            secondPoly = poly;
            second = capture(poly);
            if (helperOnline && second) hideInPage(poly);
        } else {
            currentPoly = poly;
            current = capture(poly);
            secondPoly = null;
            second = null;
            thirdPoly = null;
            third = null;
            if (helperOnline && current) hideInPage(poly);
        }
        lastStateSent = null;
        scheduleSend();
    }

    function dropArrow() {
        currentPoly = null;
        current = null;
        secondPoly = null;
        second = null;
        thirdPoly = null;
        third = null;
        lastStateSent = null;
        scheduleSend();
    }

    function findArrows(node) {
        const found = [];
        if (node.nodeType !== 1) return found;
        if (node.matches && node.matches(".bestmove")) found.push(node);
        if (node.querySelectorAll) node.querySelectorAll(".bestmove").forEach((el) => found.push(el));
        return found;
    }

    // --- watchers --------------------------------------------------------------------------------

    const observer = new MutationObserver((records) => {
        let changed = false;
        for (const record of records) {
            for (const node of record.addedNodes) {
                for (const el of findArrows(node)) {
                    if (el.tagName && el.tagName.toLowerCase() === "polygon") {
                        takeArrow(el);
                        changed = true;
                    }
                }
            }
            for (const node of record.removedNodes) {
                if (node.nodeType === 1 && node.classList && node.classList.contains("bestmove")) {
                    if (node.classList.contains("bestmove-3")) {
                        thirdPoly = null;
                        third = null;
                        lastStateSent = null;
                    } else if (node.classList.contains("bestmove-2")) {
                        secondPoly = null;
                        second = null;
                        lastStateSent = null;
                    } else {
                        dropArrow();
                    }
                    changed = true;
                }
            }
        }
        if (changed) scheduleSend();
    });

    const observeRoot = document.body || document.documentElement;
    if (observeRoot) observer.observe(observeRoot, { childList: true, subtree: true });

    document.addEventListener("visibilitychange", () => {
        lastStateSent = null;
        sendState(true);
    });

    function refreshGeometry() {
        if (secondPoly && secondPoly.isConnected) {
            const data = capture(secondPoly);
            if (data) {
                second = data;
                lastStateSent = null;
            }
        }

        if (thirdPoly && thirdPoly.isConnected) {
            const data = capture(thirdPoly);
            if (data) {
                third = data;
                lastStateSent = null;
            }
        }

        if (!currentPoly || !currentPoly.isConnected) return;
        const data = capture(currentPoly);
        if (!data) {
            // The page cleared the arrow in place (points=""), e.g. on the
            // opponent's turn or at game over. Without this the overlay keeps
            // showing the previous arrow.
            if (current) {
                current = null;
                lastStateSent = null;
                scheduleSend();
            }
            return;
        }
        current = data;
        if (secondPoly && secondPoly.isConnected) {
            const secondData = capture(secondPoly);
            second = secondData || null;
        }
        if (thirdPoly && thirdPoly.isConnected) {
            const thirdData = capture(thirdPoly);
            third = thirdData || null;
        }
        lastStateSent = null;
        hideUnhiddenArrows();
        scheduleSend();
    }

    window.addEventListener("resize", refreshGeometry);
    window.addEventListener("scroll", refreshGeometry, true);
    document.addEventListener("scroll", refreshGeometry, true);

    // An adapter may update the polygon in place (same node) after every move,
    // so ask for an immediate re-measure instead of waiting for the heartbeat.
    window.addEventListener("umbra-arrow-refresh", refreshGeometry);
    window.addEventListener("umbra-arrow-refresh", () => { lastStateSent = null; });

    window.addEventListener("pagehide", () => {
        lastStateSent = null;
        call({ type: "umbra-arrow", action: "state", body: "0" });
    });

    // --- new game detection (drives the panel's auto mode) ---------------------------------------

    let lastGameKey = "";
    let gameReported = false;

    function hasBoard() {
        return !!document.querySelector("chess-board, .board, cg-board");
    }

    // A bare board is not enough: the "play" setup screens also have one.
    // The move list / clocks only exist once a game is actually on the board.
    function gameReady() {
        if (!hasBoard()) return false;
        return !!document.querySelector(
            "wc-simple-move-list, vertical-move-list, .move-list, " +
            "clock-component, .clock-component, .clock-white, .clock-black, " +
            "cg-board piece, .tview2-column move, .round__app__board"
        );
    }

    function checkGame() {
        const key = location.pathname;
        if (key !== lastGameKey) {
            lastGameKey = key;
            gameReported = false;
        }
        if (gameReported || !gameReady()) return;
        gameReported = true;
        reportGame();
    }

    // The auto-mode settings live in the extension popup, so they travel with
    // the event: "start;<auto>;<minElo>;<maxElo>".
    function reportGame() {
        const send = (auto, min, max) => call({
            type: "umbra-arrow",
            action: "game",
            body: "start;" + (auto ? 1 : 0) + ";" + min + ";" + max
        });

        if (!storage) { send(false, 1400, 2200); return; }

        Promise.resolve(storage.get(["auto", "minElo", "maxElo"]))
            .then((saved) => {
                const min = Number(saved && saved.minElo) || 1400;
                const max = Number(saved && saved.maxElo) || 2200;
                send(!!(saved && saved.auto), min, max);
            })
            .catch(() => send(false, 1400, 2200));
    }

    setInterval(checkGame, 900);
    checkGame();

    // --- command polling -------------------------------------------------------------------------
    // The helper queues "scan;<depth>;<elo>" when auto mode fires, but the MV3
    // background page can be suspended between events. Polling from the page
    // keeps auto mode working: fetch the command, then wake the background.

    let commandInFlight = false;

    function pollCommand() {
        if (commandInFlight || !runtime) return;
        commandInFlight = true;

        const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), 1500) : null;
        const options = { method: "GET", mode: "cors", cache: "no-store" };
        if (controller) options.signal = controller.signal;

        fetch(ENDPOINT + "/command", options)
            .then((response) => (response.ok ? response.text() : ""))
            .catch(() => "")
            .then((text) => {
                if (timer) clearTimeout(timer);
                commandInFlight = false;
                const command = (text || "").trim();
                if (!command || command === "none") return;
                try {
                    runtime.sendMessage({ type: "umbra-arrow", action: "runCommand", body: command });
                } catch (_) { }
            });
    }

    setInterval(pollCommand, 900);

    // --- helper handshake ------------------------------------------------------------------------

    function ping() {
        call({ type: "umbra-arrow", action: "ping" }).then((response) => {
            const ok = !!(response && response.ok);
            setStatus(ok);
            if (ok && !transportLogged) {
                transportLogged = true;
                console.info("[Umbra] overlay helper reachable via " + (response.via || "unknown"));
            }
            if (ok === helperOnline) {
                if (ok) sendState(true);
                return;
            }
            helperOnline = ok;
            if (helperOnline) {
                // Arrows created before the helper came online would stay
                // visible in the page (and in OBS). Hide everything the helper
                // now owns.
                document.querySelectorAll(".bestmove").forEach(hideInPage);
                hideUnhiddenArrows();
                if (!current) {
                    const first = document.querySelector("polygon.bestmove:not(.bestmove-2):not(.bestmove-3)");
                    if (first) takeArrow(first);
                }
                if (!second) {
                    const follow = document.querySelector("polygon.bestmove.bestmove-2");
                    if (follow) takeArrow(follow);
                }
                if (!third) {
                    const frame = document.querySelector("polygon.bestmove.bestmove-3");
                    if (frame) takeArrow(frame);
                }
            } else {
                restoreInPage();
            }
            lastStateSent = null;
            sendState(true);
        });
    }

    // --- visible status (only while the helper is unreachable) -----------------------------------

    const STATUS_ID = "umbra-overlay-status";
    let offlineSince = 0;

    function setStatus(online) {
        let node = document.getElementById(STATUS_ID);

        if (online) {
            offlineSince = 0;
            if (node) node.remove();
            return;
        }

        if (!offlineSince) offlineSince = Date.now();
        if (Date.now() - offlineSince < 6000) return;

        if (!node) {
            node = document.createElement("div");
            node.id = STATUS_ID;
            node.textContent = "UMBRA: overlay helper is not running - start start.vbs";
            node.style.cssText = [
                "position:fixed", "left:16px", "bottom:16px", "z-index:2147483647",
                "padding:7px 11px", "background:#0f0f0f", "color:#e8e4dc",
                "font:10px/1.5 system-ui,Segoe UI,sans-serif", "letter-spacing:.08em",
                "border:1px solid #2a2927", "pointer-events:none", "opacity:.95"
            ].join(";");
            (document.body || document.documentElement).appendChild(node);
        }
    }

    console.info("[UMBRA] screen-overlay bridge ready (overlay build 1.0.3)");
    ping();
    setInterval(ping, PING_MS);
    setInterval(() => setStatus(helperOnline), 2000);
    // Heartbeat also re-measures: the browser window may have been moved or
    // the page scrolled, and the arrow has to follow the board.
    setInterval(() => {
        if (helperOnline) refreshGeometry();
        sendState(true);
    }, HEARTBEAT_MS);
})();

