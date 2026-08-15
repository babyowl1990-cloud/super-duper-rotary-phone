(() => {
  if (window.__cyberdeckInjected) return;
  window.__cyberdeckInjected = true;

  const HOSTNAME = location.hostname || "local-file";
  const NOTES_KEY = `cyberdeck:notes:${HOSTNAME}`;
  const DOCK_POS_KEY = "cyberdeck:dockPos";
  const A11Y_KEY = "cyberdeck:a11y";
  const PANEL_POS_KEY = "cyberdeck:panelPos";

  const ICONS = {
    draw: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    notes: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`,
    calc: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><rect x="7.5" y="4.5" width="9" height="4" rx="1"/><circle cx="8.5" cy="13" r="1"/><circle cx="12" cy="13" r="1"/><circle cx="15.5" cy="13" r="1"/><circle cx="8.5" cy="17" r="1"/><circle cx="12" cy="17" r="1"/><circle cx="15.5" cy="17" r="1"/></svg>`,
    a11y: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.5" r="2"/><path d="M12 8.5v5"/><path d="M7 10.5h10"/><path d="M9 20l3-6.5 3 6.5"/></svg>`,
    settings: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>`,
    utils: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    qr: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M18 18h3v3h-3z"/></svg>`,
    pass: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    eyedrop: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 7l6 6"/><path d="M17.5 2.5a2.5 2.5 0 0 1 3.5 3.5L12 15l-4 1 1-4z"/><path d="M3 21l4-1"/></svg>`,
    convert: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h11l-3-3M17 17H6l3 3"/></svg>`,
    timer: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M9 2h6"/></svg>`,
    clip: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h4"/></svg>`,
    shot: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M20 8V6a2 2 0 0 0-2-2h-2M20 16v2a2 2 0 0 1-2 2h-2"/><circle cx="12" cy="12" r="3.5"/></svg>`,
    text: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h13"/></svg>`,
    emoji: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 10.5h.01M15.5 10.5h.01"/><path d="M8 15c1 1.2 2.4 2 4 2s3-.8 4-2"/></svg>`,
  };

  const store = {
    get(key, fallback) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (res) => resolve(res[key] ?? fallback));
      });
    },
    set(key, value) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
      });
    },
  };

  /* =========================================================
     0. ACCESSIBILITY ENGINE — applies to the real page (light DOM),
        runs independently of whether the HUD dock is open, and
        persists across every site the user visits.
     ========================================================= */
  const A11Y_DEFAULTS = {
    fontScale: 1,
    highContrast: false,
    dyslexiaFont: false,
    reduceMotion: false,
    bigCursor: false,
    highlightLinks: false,
  };

  let a11yState = { ...A11Y_DEFAULTS };

  function bigCursorDataUri(color) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
      <path d='M4 2 L4 32 L12 25 L18 36 L23 33 L17 22 L28 22 Z' fill='${color}' stroke='#000' stroke-width='1.5'/>
    </svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 4 2, auto`;
  }

  function applyA11yStyles() {
    let styleEl = document.getElementById("cyberdeck-a11y-style");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "cyberdeck-a11y-style";
      document.documentElement.appendChild(styleEl);
    }
    const rules = [];

    if (a11yState.fontScale !== 1) {
      rules.push(`html { font-size: ${100 * a11yState.fontScale}% !important; }`);
    }
    if (a11yState.highContrast) {
      rules.push(`html { filter: invert(1) hue-rotate(180deg) !important; background: #fff; }`);
      rules.push(`img, video, canvas, svg, picture, iframe { filter: invert(1) hue-rotate(180deg) !important; }`);
    }
    if (a11yState.dyslexiaFont) {
      rules.push(`
        body, body * :not(.cd-root):not(.cd-root *) {
          font-family: Verdana, 'Comic Sans MS', 'Trebuchet MS', sans-serif !important;
          letter-spacing: 0.03em !important;
          line-height: 1.6 !important;
          word-spacing: 0.06em !important;
        }
      `);
    }
    if (a11yState.reduceMotion) {
      rules.push(`
        *:not(.cd-root):not(.cd-root *), *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
          scroll-behavior: auto !important;
        }
      `);
    }
    if (a11yState.bigCursor) {
      const cur = bigCursorDataUri("#00fff2");
      rules.push(`html, body, * :not(.cd-root):not(.cd-root *) { cursor: ${cur} !important; }`);
    }
    if (a11yState.highlightLinks) {
      rules.push(`
        a:not(.cd-root *), button:not(.cd-root *), [role="button"]:not(.cd-root *) {
          outline: 2px solid #ff2bd6 !important;
          outline-offset: 2px !important;
        }
      `);
    }

    styleEl.textContent = rules.join("\n");
  }

  async function initA11y() {
    a11yState = { ...A11Y_DEFAULTS, ...(await store.get(A11Y_KEY, {})) };
    applyA11yStyles();
  }

  async function setA11y(key, value) {
    a11yState[key] = value;
    applyA11yStyles();
    await store.set(A11Y_KEY, a11yState);
  }

  function readSelectionAloud() {
    const text = window.getSelection()?.toString()?.trim();
    if (!text) return false;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
    return true;
  }

  initA11y();

  /* =========================================================
     1. HUD SHELL — shadow DOM root, isolated from page styles
     ========================================================= */
  let shadowRoot = null;
  let hudVisible = false;
  let els = {};

  function buildHud() {
    const host = document.createElement("div");
    host.id = "cyberdeck-host";
    host.style.all = "initial";
    document.documentElement.appendChild(host);
    shadowRoot = host.attachShadow({ mode: "open" });

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("content.css");
    shadowRoot.appendChild(link);

    const root = document.createElement("div");
    root.className = "cd-root";
    root.innerHTML = `
      <div class="cd-dock" id="cd-dock" style="top:90px;right:18px;">
        <div class="cd-dock-handle" id="cd-dock-handle">
          <span class="cd-dock-title" data-text="CYBERDECK">CYBERDECK</span>
        </div>
        <button class="cd-dock-btn" data-tool="draw" title="Draw">${ICONS.draw}</button>
        <button class="cd-dock-btn" data-tool="notes" title="Sticky note">${ICONS.notes}</button>
        <button class="cd-dock-btn" data-tool="calc" title="Calculator">${ICONS.calc}</button>
        <button class="cd-dock-btn" data-tool="a11y" title="Accessibility">${ICONS.a11y}</button>
        <button class="cd-dock-btn" data-tool="settings" title="Settings">${ICONS.settings}</button>
        <button class="cd-dock-btn" data-tool="utils" title="Utilities">${ICONS.utils}</button>
      </div>

      <canvas id="cd-draw-canvas"></canvas>
      <div id="cd-notes-layer"></div>

      <div class="cd-panel cd-hidden" id="cd-panel-draw" style="width:230px;">
        <div class="cd-panel-head" data-drag="draw"><span class="cd-panel-title">Draw // Ink</span><button class="cd-close" data-close="draw">&times;</button></div>
        <div class="cd-panel-body">
          <div class="cd-row" id="cd-draw-tools">
            <button class="cd-btn cd-drawtool cd-active" data-drawtool="pen" title="Pen">Pen</button>
            <button class="cd-btn cd-drawtool" data-drawtool="eraser" title="Eraser">Erase</button>
            <button class="cd-btn cd-drawtool" data-drawtool="line" title="Line">Line</button>
            <button class="cd-btn cd-drawtool" data-drawtool="rect" title="Rectangle">Rect</button>
            <button class="cd-btn cd-drawtool" data-drawtool="arrow" title="Arrow">Arrow</button>
            <button class="cd-btn cd-drawtool" data-drawtool="text" title="Text stamp">Text</button>
          </div>
          <div class="cd-row" id="cd-draw-colors">
            <span class="cd-label">Color</span>
            <button class="cd-swatch cd-btn" data-color="#00fff2" style="background:#00fff2;width:20px;height:20px;padding:0;"></button>
            <button class="cd-swatch cd-btn" data-color="#ff2bd6" style="background:#ff2bd6;width:20px;height:20px;padding:0;"></button>
            <button class="cd-swatch cd-btn" data-color="#ffb000" style="background:#ffb000;width:20px;height:20px;padding:0;"></button>
            <button class="cd-swatch cd-btn" data-color="#ffffff" style="background:#ffffff;width:20px;height:20px;padding:0;"></button>
            <input type="color" id="cd-draw-custom" value="#00fff2" style="width:22px;height:22px;background:none;border:none;padding:0;cursor:pointer;">
          </div>
          <div class="cd-row">
            <span class="cd-label">Size</span>
            <input type="range" class="cd-slider" id="cd-draw-size" min="1" max="24" value="4">
          </div>
          <div class="cd-row">
            <button class="cd-btn" id="cd-draw-undo" style="flex:1;">Undo</button>
            <button class="cd-btn cd-magenta" id="cd-draw-clear" style="flex:1;">Clear</button>
          </div>
          <div class="cd-row">
            <button class="cd-btn" id="cd-draw-save" style="flex:1;">Save PNG</button>
          </div>
        </div>
      </div>

      <div class="cd-panel cd-hidden" id="cd-panel-calc" style="width:220px;">
        <div class="cd-panel-head" data-drag="calc"><span class="cd-panel-title">Calc // Unit</span><button class="cd-close" data-close="calc">&times;</button></div>
        <div class="cd-panel-body">
          <div class="cd-calc-sub" id="cd-calc-sub">&nbsp;</div>
          <div class="cd-calc-display" id="cd-calc-display">0</div>
          <div class="cd-calc-grid" id="cd-calc-grid"></div>
        </div>
      </div>

      <div class="cd-panel cd-hidden" id="cd-panel-a11y" style="width:250px;">
        <div class="cd-panel-head" data-drag="a11y"><span class="cd-panel-title">Access // Mods</span><button class="cd-close" data-close="a11y">&times;</button></div>
        <div class="cd-panel-body">
          <div class="cd-row">
            <span class="cd-label">Text size</span>
            <input type="range" class="cd-slider" id="cd-a11y-font" min="0.8" max="2" step="0.1" value="1">
          </div>
          <div class="cd-a11y-toggle"><span class="cd-label">High contrast</span><div class="cd-switch" data-a11y="highContrast"></div></div>
          <div class="cd-a11y-toggle"><span class="cd-label">Dyslexia font</span><div class="cd-switch" data-a11y="dyslexiaFont"></div></div>
          <div class="cd-a11y-toggle"><span class="cd-label">Reduce motion</span><div class="cd-switch" data-a11y="reduceMotion"></div></div>
          <div class="cd-a11y-toggle"><span class="cd-label">Big cursor</span><div class="cd-switch" data-a11y="bigCursor"></div></div>
          <div class="cd-a11y-toggle"><span class="cd-label">Highlight links</span><div class="cd-switch" data-a11y="highlightLinks"></div></div>
          <div class="cd-row" style="margin-top:6px;">
            <button class="cd-btn" id="cd-a11y-read" style="flex:1;">&#128266; Read selection</button>
          </div>
        </div>
      </div>

      <div class="cd-panel cd-hidden" id="cd-panel-settings" style="width:230px;">
        <div class="cd-panel-head" data-drag="settings"><span class="cd-panel-title">System // Config</span><button class="cd-close" data-close="settings">&times;</button></div>
        <div class="cd-panel-body">
          <div class="cd-row"><button class="cd-btn" id="cd-settings-export" style="flex:1;">Export settings</button></div>
          <div class="cd-row">
            <button class="cd-btn" id="cd-settings-import" style="flex:1;">Import settings</button>
            <input type="file" id="cd-settings-file" accept="application/json" style="display:none;">
          </div>
          <div class="cd-row"><button class="cd-btn cd-magenta" id="cd-settings-reset" style="flex:1;">Reset all</button></div>
          <div class="cd-row" id="cd-settings-status" style="font-size:10px;color:var(--cd-dim);min-height:12px;">&nbsp;</div>
        </div>
      </div>

      <div class="cd-panel cd-hidden" id="cd-panel-utils" style="width:300px;">
        <div class="cd-panel-head" data-drag="utils"><span class="cd-panel-title">Utilities</span><button class="cd-close" data-close="utils">&times;</button></div>
        <div class="cd-panel-body" style="display:flex;gap:0;padding:0;">
          <div class="cd-util-tabs" id="cd-util-tabs">
            <button data-util="qr" class="cd-util-tab cd-active" title="QR code">${ICONS.qr}</button>
            <button data-util="pass" class="cd-util-tab" title="Password generator">${ICONS.pass}</button>
            <button data-util="eyedrop" class="cd-util-tab" title="Color picker">${ICONS.eyedrop}</button>
            <button data-util="convert" class="cd-util-tab" title="Unit / currency converter">${ICONS.convert}</button>
            <button data-util="timer" class="cd-util-tab" title="Focus timer">${ICONS.timer}</button>
            <button data-util="clip" class="cd-util-tab" title="Clipboard history">${ICONS.clip}</button>
            <button data-util="shot" class="cd-util-tab" title="Screenshot">${ICONS.shot}</button>
            <button data-util="text" class="cd-util-tab" title="Text tools">${ICONS.text}</button>
            <button data-util="emoji" class="cd-util-tab" title="Emoji / Unicode">${ICONS.emoji}</button>
          </div>
          <div class="cd-util-content" id="cd-util-content"></div>
        </div>
      </div>
    `;
    shadowRoot.appendChild(root);

    els.root = root;
    els.dock = root.querySelector("#cd-dock");
    els.canvas = root.querySelector("#cd-draw-canvas");
    els.notesLayer = root.querySelector("#cd-notes-layer");
    els.panels = {
      draw: root.querySelector("#cd-panel-draw"),
      calc: root.querySelector("#cd-panel-calc"),
      a11y: root.querySelector("#cd-panel-a11y"),
      settings: root.querySelector("#cd-panel-settings"),
      utils: root.querySelector("#cd-panel-utils"),
    };

    wireDock();
    wireDraw();
    wireCalc();
    wireA11yPanel();
    wireSettingsPanel();
    wireUtils();
    wireNotesAdd();
    makePanelsDraggable();
    restoreDockPosition();
    restorePanelPositions();
    loadNotes();
  }

  function destroyHud() {
    const host = document.getElementById("cyberdeck-host");
    if (host) host.remove();
    shadowRoot = null;
    els = {};
  }

  function toggleHud() {
    hudVisible = !hudVisible;
    if (hudVisible) buildHud();
    else destroyHud();
  }

  /* =========================================================
     2. DOCK — draggable, opens/closes tool panels
     ========================================================= */
  function wireDock() {
    els.dock.querySelectorAll(".cd-dock-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tool = btn.dataset.tool;
        if (tool === "notes") {
          addNote();
          return;
        }
        const panel = els.panels[tool];
        const willOpen = panel.classList.contains("cd-hidden");
        panel.classList.toggle("cd-hidden");
        btn.classList.toggle("cd-on", willOpen);
        if (tool === "draw") setDrawMode(willOpen);
      });
    });
    makeDraggable(els.dock, els.dock.querySelector("#cd-dock-handle"), async (x, y) => {
      await store.set(DOCK_POS_KEY, { x, y });
    });
  }

  async function restoreDockPosition() {
    const pos = await store.get(DOCK_POS_KEY, null);
    if (pos) {
      els.dock.style.left = pos.x + "px";
      els.dock.style.top = pos.y + "px";
      els.dock.style.right = "auto";
    } else {
      els.dock.style.right = "18px";
      els.dock.style.top = "90px";
    }
  }

  async function restorePanelPositions() {
    const positions = await store.get(PANEL_POS_KEY, {});
    Object.entries(els.panels).forEach(([name, panel]) => {
      const pos = positions[name];
      if (pos) {
        panel.style.left = pos.x + "px";
        panel.style.top = pos.y + "px";
      } else {
        const dockRect = els.dock.getBoundingClientRect();
        panel.style.left = Math.max(8, dockRect.left - 240) + "px";
        panel.style.top = "90px";
      }
    });
  }

  function makePanelsDraggable() {
    Object.entries(els.panels).forEach(([name, panel]) => {
      const handle = panel.querySelector(".cd-panel-head");
      makeDraggable(panel, handle, async (x, y) => {
        const positions = await store.get(PANEL_POS_KEY, {});
        positions[name] = { x, y };
        await store.set(PANEL_POS_KEY, positions);
      }, { ignoreSelector: "[data-close]" });

      panel.querySelector("[data-close]").addEventListener("click", () => {
        panel.classList.add("cd-hidden");
        const btn = els.dock.querySelector(`.cd-dock-btn[data-tool="${name}"]`);
        if (btn) btn.classList.remove("cd-on");
        if (name === "draw") setDrawMode(false);
      });
    });
  }

  function makeDraggable(el, handle, onDrop, opts = {}) {
    let dragging = false, startX = 0, startY = 0, origX = 0, origY = 0;
    handle.addEventListener("mousedown", (e) => {
      if (opts.ignoreSelector && e.target.closest(opts.ignoreSelector)) return;
      dragging = true;
      const rect = el.getBoundingClientRect();
      startX = e.clientX; startY = e.clientY;
      origX = rect.left; origY = rect.top;
      el.style.right = "auto";
      e.preventDefault();
    });
    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const nx = Math.min(Math.max(0, origX + (e.clientX - startX)), window.innerWidth - 40);
      const ny = Math.min(Math.max(0, origY + (e.clientY - startY)), window.innerHeight - 30);
      el.style.left = nx + "px";
      el.style.top = ny + "px";
    });
    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      const rect = el.getBoundingClientRect();
      onDrop(rect.left, rect.top);
    });
  }

  /* =========================================================
     3. DRAW TOOL — full-viewport canvas overlay
     ========================================================= */
  let drawCtx = null;
  let drawing = false;
  let drawColor = "#00fff2";
  let drawSize = 4;
  let drawTool = "pen"; // pen | eraser | line | rect | arrow | text
  let undoStack = [];

  function setupCanvas() {
    const canvas = els.canvas;
    const resize = () => {
      const prev = canvas.width ? canvas.toDataURL() : null;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawCtx = canvas.getContext("2d");
      drawCtx.lineCap = "round";
      drawCtx.lineJoin = "round";
      if (prev) {
        const img = new Image();
        img.onload = () => drawCtx.drawImage(img, 0, 0);
        img.src = prev;
      }
    };
    resize();
    window.addEventListener("resize", resize);
  }

  function setDrawMode(on) {
    els.canvas.style.pointerEvents = on ? "auto" : "none";
  }

  function wireDraw() {
    setupCanvas();
    const panel = els.panels.draw;

    panel.querySelectorAll("[data-drawtool]").forEach((btn) => {
      btn.addEventListener("click", () => {
        drawTool = btn.dataset.drawtool;
        panel.querySelectorAll(".cd-drawtool").forEach((b) => b.classList.toggle("cd-active", b === btn));
        els.canvas.style.cursor = drawTool === "text" ? "text" : "crosshair";
      });
    });
    panel.querySelectorAll("[data-color]").forEach((sw) => {
      sw.addEventListener("click", () => { drawColor = sw.dataset.color; });
    });
    panel.querySelector("#cd-draw-custom").addEventListener("input", (e) => {
      drawColor = e.target.value;
    });
    panel.querySelector("#cd-draw-size").addEventListener("input", (e) => {
      drawSize = Number(e.target.value);
    });
    panel.querySelector("#cd-draw-clear").addEventListener("click", () => {
      pushUndo();
      drawCtx.clearRect(0, 0, els.canvas.width, els.canvas.height);
    });
    panel.querySelector("#cd-draw-undo").addEventListener("click", () => {
      if (!undoStack.length) return;
      const img = undoStack.pop();
      drawCtx.putImageData(img, 0, 0);
    });
    panel.querySelector("#cd-draw-save").addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = els.canvas.toDataURL("image/png");
      a.download = "cyberdeck-drawing.png";
      a.click();
    });

    const canvas = els.canvas;
    let lastX = 0, lastY = 0;
    let startX = 0, startY = 0;
    let shapeBaseline = null;

    function pushUndo() {
      if (!canvas.width || !canvas.height) return;
      try {
        undoStack.push(drawCtx.getImageData(0, 0, canvas.width, canvas.height));
        if (undoStack.length > 25) undoStack.shift();
      } catch (err) {
        console.warn("Cyberdeck: could not snapshot canvas for undo", err);
      }
    }

    function snapshot() {
      if (!canvas.width || !canvas.height) return null;
      try {
        return drawCtx.getImageData(0, 0, canvas.width, canvas.height);
      } catch (err) {
        console.warn("Cyberdeck: could not snapshot canvas", err);
        return null;
      }
    }

    function strokeStyleFor(erasing) {
      drawCtx.strokeStyle = drawColor;
      drawCtx.lineWidth = erasing ? drawSize * 3 : drawSize;
      drawCtx.shadowColor = erasing ? "transparent" : drawColor;
      drawCtx.shadowBlur = erasing ? 0 : 6;
      drawCtx.lineCap = "round";
      drawCtx.lineJoin = "round";
    }

    function drawArrowHead(x0, y0, x1, y1) {
      const angle = Math.atan2(y1 - y0, x1 - x0);
      const headLen = 8 + drawSize * 2.2;
      const spread = Math.PI / 7;
      drawCtx.beginPath();
      drawCtx.moveTo(x1, y1);
      drawCtx.lineTo(x1 - headLen * Math.cos(angle - spread), y1 - headLen * Math.sin(angle - spread));
      drawCtx.moveTo(x1, y1);
      drawCtx.lineTo(x1 - headLen * Math.cos(angle + spread), y1 - headLen * Math.sin(angle + spread));
      drawCtx.stroke();
    }

    function drawShapePreview(x0, y0, x1, y1) {
      drawCtx.globalCompositeOperation = "source-over";
      strokeStyleFor(false);
      if (drawTool === "rect") {
        drawCtx.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
      } else if (drawTool === "line" || drawTool === "arrow") {
        drawCtx.beginPath();
        drawCtx.moveTo(x0, y0);
        drawCtx.lineTo(x1, y1);
        drawCtx.stroke();
        if (drawTool === "arrow") drawArrowHead(x0, y0, x1, y1);
      }
    }

    function openTextInput(x, y) {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "cd-draw-text-input";
      input.style.left = x + "px";
      input.style.top = y - 12 + "px";
      input.style.color = drawColor;
      input.style.fontSize = Math.max(12, drawSize * 4) + "px";
      els.root.appendChild(input);
      input.focus();
      let committed = false;
      const commit = () => {
        if (committed) return; // removing a focused input fires 'blur' too — avoid double-drawing
        committed = true;
        const val = input.value;
        input.remove();
        if (val && val.trim()) {
          pushUndo();
          drawCtx.font = `${Math.max(12, drawSize * 4)}px 'Share Tech Mono', monospace`;
          drawCtx.textBaseline = "middle";
          drawCtx.fillStyle = drawColor;
          drawCtx.shadowColor = drawColor;
          drawCtx.shadowBlur = 6;
          drawCtx.fillText(val, x, y);
        }
      };
      input.addEventListener("keydown", (e) => {
        e.stopPropagation();
        if (e.key === "Enter") { e.preventDefault(); commit(); }
        else if (e.key === "Escape") { committed = true; input.remove(); }
      });
      input.addEventListener("blur", commit);
    }

    canvas.addEventListener("pointerdown", (e) => {
      if (drawTool === "text") { openTextInput(e.clientX, e.clientY); return; }
      drawing = true;
      pushUndo();
      lastX = startX = e.clientX;
      lastY = startY = e.clientY;
      if (["rect", "line", "arrow"].includes(drawTool)) {
        shapeBaseline = snapshot();
      }
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!drawing) return;
      if (["rect", "line", "arrow"].includes(drawTool)) {
        if (shapeBaseline) drawCtx.putImageData(shapeBaseline, 0, 0);
        drawShapePreview(startX, startY, e.clientX, e.clientY);
        return;
      }
      const erasing = drawTool === "eraser";
      drawCtx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
      strokeStyleFor(erasing);
      drawCtx.beginPath();
      drawCtx.moveTo(lastX, lastY);
      drawCtx.lineTo(e.clientX, e.clientY);
      drawCtx.stroke();
      lastX = e.clientX;
      lastY = e.clientY;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
      canvas.addEventListener(ev, (e) => {
        if (drawing && ["rect", "line", "arrow"].includes(drawTool) && shapeBaseline) {
          drawCtx.putImageData(shapeBaseline, 0, 0);
          drawShapePreview(startX, startY, e.clientX ?? lastX, e.clientY ?? lastY);
          shapeBaseline = null;
        }
        drawing = false;
      })
    );
  }

  /* =========================================================
     4. STICKY NOTES — persisted per hostname
     ========================================================= */
  const NOTE_COLORS = ["#00fff2", "#ff2bd6", "#ffb000", "#7dff6b"];

  async function loadNotes() {
    const notes = await store.get(NOTES_KEY, []);
    notes.forEach((n) => renderNote(n));
  }

  async function saveNotes() {
    if (!els.notesLayer) return;
    const notes = [...els.notesLayer.querySelectorAll(".cd-note")].map((el) => ({
      id: el.dataset.id,
      x: parseInt(el.style.left) || 0,
      y: parseInt(el.style.top) || 0,
      w: el.offsetWidth,
      h: el.offsetHeight,
      color: el.dataset.color,
      text: el.querySelector(".cd-note-body").innerHTML,
    }));
    await store.set(NOTES_KEY, notes);
  }

  function wireNotesAdd() {
    // notes are added directly from the dock button (see wireDock -> addNote)
  }

  function addNote(preset) {
    const n = preset || {
      id: "n" + Date.now(),
      x: 120 + Math.round(Math.random() * 60),
      y: 140 + Math.round(Math.random() * 60),
      w: 220,
      h: 170,
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      text: "",
    };
    renderNote(n);
    saveNotes();
  }

  function renderNote(n) {
    const note = document.createElement("div");
    note.className = "cd-note";
    note.dataset.id = n.id;
    note.dataset.color = n.color;
    note.style.setProperty("--cd-note-color", n.color);
    note.style.left = n.x + "px";
    note.style.top = n.y + "px";
    note.style.width = (n.w || 220) + "px";
    note.style.height = (n.h || 170) + "px";
    note.innerHTML = `
      <div class="cd-note-head">
        <div class="cd-note-dots">
          ${NOTE_COLORS.map((c) => `<span class="cd-note-dot" data-c="${c}" style="background:${c}"></span>`).join("")}
        </div>
        <div class="cd-note-actions"><button class="cd-note-x" title="Delete">&times;</button></div>
      </div>
      <div class="cd-note-body" contenteditable="true" data-placeholder="Type a note...">${n.text || ""}</div>
    `;
    els.notesLayer.appendChild(note);

    makeDraggable(note, note.querySelector(".cd-note-head"), () => saveNotes(), {
      ignoreSelector: ".cd-note-x, .cd-note-dot",
    });

    note.querySelector(".cd-note-x").addEventListener("click", () => {
      note.remove();
      saveNotes();
    });
    note.querySelectorAll(".cd-note-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        const c = dot.dataset.c;
        note.dataset.color = c;
        note.style.setProperty("--cd-note-color", c);
        saveNotes();
      });
    });
    const body = note.querySelector(".cd-note-body");
    let saveTimer;
    body.addEventListener("input", () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(saveNotes, 400);
    });
    const resizeObs = new ResizeObserver(() => {
      clearTimeout(note._resizeTimer);
      note._resizeTimer = setTimeout(saveNotes, 300);
    });
    resizeObs.observe(note);
  }

  /* =========================================================
     5. CALCULATOR
     ========================================================= */
  function wireCalc() {
    const grid = els.panels.calc.querySelector("#cd-calc-grid");
    const display = els.panels.calc.querySelector("#cd-calc-display");
    const sub = els.panels.calc.querySelector("#cd-calc-sub");

    const keys = [
      "C", "⌫", "%", "÷",
      "7", "8", "9", "×",
      "4", "5", "6", "−",
      "1", "2", "3", "+",
      "±", "0", ".", "=",
    ];
    grid.innerHTML = keys
      .map((k) => `<button class="cd-btn${"÷×−+=".includes(k) ? " cd-magenta" : ""}" data-key="${k}">${k}</button>`)
      .join("");

    let acc = null;
    let pendingOp = null;
    let current = "0";
    let justEvaluated = false;

    function render() {
      display.textContent = current;
      sub.textContent = acc !== null && pendingOp ? `${trim(acc)} ${pendingOp}` : "\u00A0";
    }
    function trim(n) {
      return Number(n.toFixed(10)).toString();
    }
    function apply(a, b, op) {
      switch (op) {
        case "+": return a + b;
        case "−": return a - b;
        case "×": return a * b;
        case "÷": return b === 0 ? NaN : a / b;
        default: return b;
      }
    }

    grid.addEventListener("click", (e) => {
      const key = e.target.dataset.key;
      if (!key) return;

      if (/[0-9]/.test(key)) {
        if (current === "0" || justEvaluated) current = "";
        justEvaluated = false;
        current += key;
      } else if (key === ".") {
        if (justEvaluated) { current = "0"; justEvaluated = false; }
        if (!current.includes(".")) current += ".";
      } else if (key === "±") {
        current = trim(parseFloat(current) * -1);
      } else if (key === "%") {
        current = trim(parseFloat(current) / 100);
      } else if (key === "C") {
        acc = null; pendingOp = null; current = "0"; justEvaluated = false;
      } else if (key === "⌫") {
        current = current.length > 1 ? current.slice(0, -1) : "0";
      } else if (["+", "−", "×", "÷"].includes(key)) {
        if (acc === null) {
          acc = parseFloat(current);
        } else if (!justEvaluated) {
          acc = apply(acc, parseFloat(current), pendingOp);
        }
        pendingOp = key;
        current = trim(acc);
        justEvaluated = true;
      } else if (key === "=") {
        if (pendingOp !== null) {
          const result = apply(acc, parseFloat(current), pendingOp);
          current = Number.isNaN(result) ? "Error" : trim(result);
          acc = null;
          pendingOp = null;
        }
        justEvaluated = true;
      }
      render();
    });

    render();
  }

  /* =========================================================
     6. ACCESSIBILITY PANEL (wires UI to the engine in section 0)
     ========================================================= */
  function wireA11yPanel() {
    const panel = els.panels.a11y;
    const fontSlider = panel.querySelector("#cd-a11y-font");
    fontSlider.value = a11yState.fontScale;
    fontSlider.addEventListener("input", (e) => setA11y("fontScale", Number(e.target.value)));

    panel.querySelectorAll("[data-a11y]").forEach((sw) => {
      const key = sw.dataset.a11y;
      sw.classList.toggle("cd-on", !!a11yState[key]);
      sw.addEventListener("click", () => {
        const next = !a11yState[key];
        sw.classList.toggle("cd-on", next);
        setA11y(key, next);
      });
    });

    panel.querySelector("#cd-a11y-read").addEventListener("click", (e) => {
      const ok = readSelectionAloud();
      e.target.textContent = ok ? "\u{1F50A} Speaking\u2026" : "\u{1F50A} Select text first";
      setTimeout(() => { e.target.textContent = "\u{1F50A} Read selection"; }, 1600);
    });
  }

  /* =========================================================
     7. SETTINGS PANEL — export/import/reset everything Cyberdeck
        stores (dock position, notes for every site, a11y prefs)
     ========================================================= */
  function wireSettingsPanel() {
    const panel = els.panels.settings;
    const status = panel.querySelector("#cd-settings-status");
    const setStatus = (text) => { status.textContent = text; };

    async function getAllCyberdeckData() {
      const all = await new Promise((resolve) => chrome.storage.local.get(null, resolve));
      const data = {};
      Object.keys(all).forEach((k) => {
        if (k.startsWith("cyberdeck:")) data[k] = all[k];
      });
      return data;
    }

    panel.querySelector("#cd-settings-export").addEventListener("click", async () => {
      const data = await getAllCyberdeckData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cyberdeck-settings-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus(`Exported (${Object.keys(data).length} keys).`);
    });

    const fileInput = panel.querySelector("#cd-settings-file");
    panel.querySelector("#cd-settings-import").addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      e.target.value = "";
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        const toSet = {};
        Object.entries(parsed).forEach(([k, v]) => {
          if (k.startsWith("cyberdeck:")) toSet[k] = v;
        });
        if (!Object.keys(toSet).length) {
          setStatus("No valid Cyberdeck data found in that file.");
          return;
        }
        await new Promise((resolve) => chrome.storage.local.set(toSet, resolve));
        setStatus(`Imported ${Object.keys(toSet).length} keys — reloading\u2026`);
        setTimeout(() => location.reload(), 700);
      } catch (err) {
        setStatus("Import failed — not a valid settings file.");
      }
    });

    panel.querySelector("#cd-settings-reset").addEventListener("click", async () => {
      const data = await getAllCyberdeckData();
      const keys = Object.keys(data);
      if (!keys.length) { setStatus("Nothing to reset."); return; }
      await new Promise((resolve) => chrome.storage.local.remove(keys, resolve));
      setStatus("Reset — reloading\u2026");
      setTimeout(() => location.reload(), 700);
    });
  }

  /* =========================================================
     8. UTILITIES — QR, password gen, eyedropper, unit/currency
        converter, focus timer, clipboard history, screenshot
     ========================================================= */
  const CLIP_KEY = "cyberdeck:clipboard";
  let clipHistory = [];
  let clipListenerAttached = false;
  const timerState = { remaining: 0, total: 0, running: false, intervalId: null };

  function wireUtils() {
    const panel = els.panels.utils;
    const tabs = panel.querySelectorAll(".cd-util-tab");
    const content = panel.querySelector("#cd-util-content");

    const renderers = {
      qr: renderQR,
      pass: renderPass,
      eyedrop: renderEyedrop,
      convert: renderConvert,
      timer: renderTimer,
      clip: renderClip,
      shot: renderShot,
      text: renderText,
      emoji: renderEmoji,
    };

    function activate(name) {
      tabs.forEach((t) => t.classList.toggle("cd-active", t.dataset.util === name));
      content.innerHTML = "";
      renderers[name](content);
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.dataset.util));
    });

    activate("qr");
    setupClipboardCapture();
  }

  // ---- QR code ----
  function renderQR(el) {
    el.innerHTML = `
      <div class="cd-row"><textarea id="cd-qr-text" class="cd-util-textarea" rows="3" placeholder="Text or URL (max ~106 chars)"></textarea></div>
      <div class="cd-row"><button class="cd-btn" id="cd-qr-gen" style="flex:1;">Generate</button><button class="cd-btn" id="cd-qr-dl">Save PNG</button></div>
      <div class="cd-row" id="cd-qr-msg" style="font-size:10px;color:var(--cd-dim);min-height:12px;">&nbsp;</div>
      <div class="cd-qr-canvas-wrap"><canvas id="cd-qr-canvas"></canvas></div>
    `;
    const textEl = el.querySelector("#cd-qr-text");
    const canvas = el.querySelector("#cd-qr-canvas");
    const msg = el.querySelector("#cd-qr-msg");
    textEl.value = location.href;

    function draw() {
      const text = textEl.value.trim();
      if (!text) { msg.textContent = "Enter some text first."; return; }
      const result = QR.generate(text);
      if (!result) {
        msg.textContent = `Too long — this offline generator supports up to ~106 characters (${text.length} given).`;
        canvas.width = canvas.height = 0;
        return;
      }
      msg.textContent = `v${result.version} QR, ${text.length} chars.`;
      const module = 6, quiet = 4;
      const size = (result.size + quiet * 2) * module;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#000000";
      for (let r = 0; r < result.size; r++) {
        for (let c = 0; c < result.size; c++) {
          if (result.matrix[r][c]) ctx.fillRect((c + quiet) * module, (r + quiet) * module, module, module);
        }
      }
    }
    el.querySelector("#cd-qr-gen").addEventListener("click", draw);
    el.querySelector("#cd-qr-dl").addEventListener("click", () => {
      if (!canvas.width) { draw(); }
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "cyberdeck-qr.png";
      a.click();
    });
    draw();
  }

  // ---- Password generator ----
  function renderPass(el) {
    el.innerHTML = `
      <div class="cd-row"><span class="cd-label">Length</span><input type="range" class="cd-slider" id="cd-pass-len" min="8" max="64" value="20"><span id="cd-pass-lenval" style="font-size:11px;width:24px;text-align:right;">20</span></div>
      <div class="cd-a11y-toggle"><span class="cd-label">Uppercase</span><div class="cd-switch cd-on" data-opt="upper"></div></div>
      <div class="cd-a11y-toggle"><span class="cd-label">Lowercase</span><div class="cd-switch cd-on" data-opt="lower"></div></div>
      <div class="cd-a11y-toggle"><span class="cd-label">Numbers</span><div class="cd-switch cd-on" data-opt="num"></div></div>
      <div class="cd-a11y-toggle"><span class="cd-label">Symbols</span><div class="cd-switch cd-on" data-opt="sym"></div></div>
      <div class="cd-row" style="margin-top:6px;"><button class="cd-btn" id="cd-pass-gen" style="flex:1;">Generate</button></div>
      <div class="cd-row"><input id="cd-pass-out" class="cd-util-input" readonly style="flex:1;"><button class="cd-btn" id="cd-pass-copy">Copy</button></div>
      <div class="cd-row" id="cd-pass-strength" style="font-size:10px;color:var(--cd-dim);">&nbsp;</div>
    `;
    const opts = { upper: true, lower: true, num: true, sym: true };
    const sets = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      num: "0123456789",
      sym: "!@#$%^&*()-_=+[]{};:,.<>?",
    };
    el.querySelectorAll("[data-opt]").forEach((sw) => {
      sw.addEventListener("click", () => {
        const key = sw.dataset.opt;
        const otherOn = Object.keys(opts).some((k) => k !== key && opts[k]);
        if (opts[key] && !otherOn) return; // keep at least one category on
        opts[key] = !opts[key];
        sw.classList.toggle("cd-on", opts[key]);
      });
    });
    const lenSlider = el.querySelector("#cd-pass-len");
    const lenVal = el.querySelector("#cd-pass-lenval");
    lenSlider.addEventListener("input", () => { lenVal.textContent = lenSlider.value; });

    function secureIndex(max) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      return arr[0] % max;
    }
    function generate() {
      const active = Object.keys(opts).filter((k) => opts[k]);
      const pool = active.map((k) => sets[k]).join("");
      const len = Number(lenSlider.value);
      const rnd = new Uint32Array(len);
      crypto.getRandomValues(rnd);
      let chars = active.map((k) => sets[k][secureIndex(sets[k].length)]);
      for (let i = chars.length; i < len; i++) chars.push(pool[rnd[i] % pool.length]);
      // Fisher–Yates shuffle using crypto randomness
      for (let i = chars.length - 1; i > 0; i--) {
        const j = secureIndex(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      const pass = chars.slice(0, len).join("");
      el.querySelector("#cd-pass-out").value = pass;
      const entropy = Math.log2(pool.length) * len;
      const label = entropy < 40 ? "Weak" : entropy < 65 ? "Okay" : entropy < 90 ? "Strong" : "Very strong";
      el.querySelector("#cd-pass-strength").textContent = `~${Math.round(entropy)} bits of entropy — ${label}`;
    }
    el.querySelector("#cd-pass-gen").addEventListener("click", generate);
    el.querySelector("#cd-pass-copy").addEventListener("click", () => {
      const val = el.querySelector("#cd-pass-out").value;
      if (val) navigator.clipboard.writeText(val).catch(() => {});
    });
    generate();
  }

  // ---- Color eyedropper ----
  function renderEyedrop(el) {
    el.innerHTML = `
      <div class="cd-row"><button class="cd-btn" id="cd-eye-pick" style="flex:1;">${"EyeDropper" in window ? "Pick color from page" : "Not supported in this browser"}</button></div>
      <div class="cd-row" id="cd-eye-preview" style="display:none;">
        <div id="cd-eye-swatch" style="width:28px;height:28px;border-radius:6px;border:1px solid rgba(255,255,255,0.3);"></div>
        <input id="cd-eye-hex" class="cd-util-input" readonly style="flex:1;">
        <button class="cd-btn" id="cd-eye-copy">Copy</button>
      </div>
      <div class="cd-row" id="cd-eye-recent" style="flex-wrap:wrap;gap:4px;"></div>
    `;
    const btn = el.querySelector("#cd-eye-pick");
    if (!("EyeDropper" in window)) { btn.disabled = true; return; }
    const recent = [];
    btn.addEventListener("click", async () => {
      try {
        const result = await new EyeDropper().open();
        const hex = result.sRGBHex;
        el.querySelector("#cd-eye-preview").style.display = "flex";
        el.querySelector("#cd-eye-swatch").style.background = hex;
        el.querySelector("#cd-eye-hex").value = hex;
        recent.unshift(hex);
        if (recent.length > 10) recent.pop();
        const box = el.querySelector("#cd-eye-recent");
        box.innerHTML = recent
          .map((c) => `<div class="cd-eye-chip" data-c="${c}" style="background:${c}" title="${c}"></div>`)
          .join("");
        box.querySelectorAll(".cd-eye-chip").forEach((chip) => {
          chip.addEventListener("click", () => {
            el.querySelector("#cd-eye-swatch").style.background = chip.dataset.c;
            el.querySelector("#cd-eye-hex").value = chip.dataset.c;
          });
        });
      } catch (e) { /* user cancelled */ }
    });
    el.querySelector("#cd-eye-copy").addEventListener("click", () => {
      const val = el.querySelector("#cd-eye-hex").value;
      if (val) navigator.clipboard.writeText(val).catch(() => {});
    });
  }

  // ---- Unit / currency converter ----
  const UNIT_GROUPS = {
    length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 },
    weight: { g: 1, kg: 1000, mg: 0.001, oz: 28.3495, lb: 453.592 },
    volume: { l: 1, ml: 0.001, gal: 3.78541, qt: 0.946353, cup: 0.24 },
    temperature: null, // special-cased
  };
  function renderConvert(el) {
    el.innerHTML = `
      <div class="cd-row">
        <span class="cd-label">Category</span>
        <select id="cd-conv-cat" class="cd-util-select">
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="volume">Volume</option>
          <option value="temperature">Temperature</option>
          <option value="currency">Currency</option>
        </select>
      </div>
      <div class="cd-row">
        <input id="cd-conv-in" class="cd-util-input" type="number" value="1" style="flex:1;">
        <select id="cd-conv-from" class="cd-util-select"></select>
      </div>
      <div class="cd-row">
        <span style="color:var(--cd-dim);">=</span>
        <input id="cd-conv-out" class="cd-util-input" readonly style="flex:1;">
        <select id="cd-conv-to" class="cd-util-select"></select>
      </div>
      <div class="cd-row" id="cd-conv-msg" style="font-size:10px;color:var(--cd-dim);min-height:12px;">&nbsp;</div>
    `;
    const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR"];
    const cat = el.querySelector("#cd-conv-cat");
    const from = el.querySelector("#cd-conv-from");
    const to = el.querySelector("#cd-conv-to");
    const input = el.querySelector("#cd-conv-in");
    const output = el.querySelector("#cd-conv-out");
    const msg = el.querySelector("#cd-conv-msg");

    function populateUnits() {
      const c = cat.value;
      let keys;
      if (c === "temperature") keys = ["C", "F", "K"];
      else if (c === "currency") keys = CURRENCIES;
      else keys = Object.keys(UNIT_GROUPS[c]);
      from.innerHTML = keys.map((k) => `<option value="${k}">${k}</option>`).join("");
      to.innerHTML = keys.map((k) => `<option value="${k}">${k}</option>`).join("");
      to.selectedIndex = keys.length > 1 ? 1 : 0;
    }

    function convertTemp(v, f, t) {
      let c = f === "C" ? v : f === "F" ? (v - 32) * 5 / 9 : v - 273.15;
      return t === "C" ? c : t === "F" ? c * 9 / 5 + 32 : c + 273.15;
    }

    let debounceTimer;
    async function doConvert() {
      const c = cat.value;
      const v = parseFloat(input.value);
      if (Number.isNaN(v)) { output.value = ""; return; }
      if (c === "temperature") {
        output.value = trimNum(convertTemp(v, from.value, to.value));
        msg.textContent = "\u00A0";
        return;
      }
      if (c === "currency") {
        msg.textContent = "Fetching rate\u2026";
        try {
          const res = await fetch(`https://api.frankfurter.app/latest?amount=${v}&from=${from.value}&to=${to.value}`);
          const data = await res.json();
          output.value = trimNum(data.rates[to.value]);
          msg.textContent = "Live rate via frankfurter.app";
        } catch (e) {
          msg.textContent = "Couldn't fetch a live rate (offline?).";
        }
        return;
      }
      const group = UNIT_GROUPS[c];
      const base = v * group[from.value];
      output.value = trimNum(base / group[to.value]);
      msg.textContent = "\u00A0";
    }
    function trimNum(n) { return Number(n.toFixed(6)).toString(); }

    cat.addEventListener("change", () => { populateUnits(); doConvert(); });
    [from, to].forEach((s) => s.addEventListener("change", doConvert));
    input.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(doConvert, cat.value === "currency" ? 500 : 0);
    });

    populateUnits();
    doConvert();
  }

  // ---- Focus timer ----
  function renderTimer(el) {
    el.innerHTML = `
      <div class="cd-timer-display" id="cd-timer-display">25:00</div>
      <div class="cd-row">
        <button class="cd-btn" data-min="25">25m</button>
        <button class="cd-btn" data-min="15">15m</button>
        <button class="cd-btn" data-min="5">5m</button>
        <input id="cd-timer-custom" class="cd-util-input" type="number" placeholder="min" style="width:52px;">
      </div>
      <div class="cd-row">
        <button class="cd-btn" id="cd-timer-start" style="flex:1;">Start</button>
        <button class="cd-btn" id="cd-timer-pause" style="flex:1;">Pause</button>
        <button class="cd-btn cd-magenta" id="cd-timer-reset">Reset</button>
      </div>
    `;
    const display = el.querySelector("#cd-timer-display");
    function render() {
      const m = Math.floor(timerState.remaining / 60).toString().padStart(2, "0");
      const s = Math.floor(timerState.remaining % 60).toString().padStart(2, "0");
      display.textContent = `${m}:${s}`;
    }
    function setMinutes(min) {
      clearInterval(timerState.intervalId);
      timerState.running = false;
      timerState.total = min * 60;
      timerState.remaining = min * 60;
      render();
    }
    if (!timerState.total) setMinutes(25);
    else render();

    el.querySelectorAll("[data-min]").forEach((b) => b.addEventListener("click", () => setMinutes(Number(b.dataset.min))));
    el.querySelector("#cd-timer-custom").addEventListener("change", (e) => {
      const v = Number(e.target.value);
      if (v > 0) setMinutes(v);
    });
    el.querySelector("#cd-timer-start").addEventListener("click", () => {
      if (timerState.running) return;
      if (timerState.remaining <= 0) return;
      timerState.running = true;
      timerState.intervalId = setInterval(() => {
        timerState.remaining--;
        render();
        if (timerState.remaining <= 0) {
          clearInterval(timerState.intervalId);
          timerState.running = false;
          beep();
        }
      }, 1000);
    });
    el.querySelector("#cd-timer-pause").addEventListener("click", () => {
      clearInterval(timerState.intervalId);
      timerState.running = false;
    });
    el.querySelector("#cd-timer-reset").addEventListener("click", () => setMinutes(timerState.total / 60 || 25));
  }
  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      osc.onended = () => ctx.close();
    } catch (e) { /* audio unavailable */ }
  }

  // ---- Clipboard history ----
  function setupClipboardCapture() {
    if (clipListenerAttached) return;
    clipListenerAttached = true;
    store.get(CLIP_KEY, []).then((saved) => { clipHistory = saved; });
    document.addEventListener("copy", () => {
      const text = window.getSelection()?.toString();
      if (!text || !text.trim()) return;
      clipHistory = clipHistory.filter((c) => c.text !== text);
      clipHistory.unshift({ text, host: HOSTNAME, t: Date.now() });
      if (clipHistory.length > 20) clipHistory.length = 20;
      store.set(CLIP_KEY, clipHistory);
    });
  }
  function renderClip(el) {
    function draw() {
      if (!clipHistory.length) {
        el.innerHTML = `<div class="cd-row" style="color:var(--cd-dim);font-size:11px;">Copy some text on any page — it'll show up here.</div>`;
        return;
      }
      el.innerHTML =
        `<div class="cd-row"><button class="cd-btn cd-magenta" id="cd-clip-clear" style="flex:1;">Clear history</button></div>` +
        `<div class="cd-clip-list">` +
        clipHistory
          .map(
            (c, i) => `<div class="cd-clip-item" data-i="${i}"><span class="cd-clip-text">${escapeHtml(c.text.slice(0, 80))}</span><button class="cd-clip-copy" data-i="${i}">Copy</button></div>`
          )
          .join("") +
        `</div>`;
      el.querySelectorAll(".cd-clip-copy").forEach((btn) => {
        btn.addEventListener("click", () => {
          const item = clipHistory[Number(btn.dataset.i)];
          if (item) navigator.clipboard.writeText(item.text).catch(() => {});
        });
      });
      const clearBtn = el.querySelector("#cd-clip-clear");
      if (clearBtn) clearBtn.addEventListener("click", async () => {
        clipHistory = [];
        await store.set(CLIP_KEY, clipHistory);
        draw();
      });
    }
    draw();
  }
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---- Screenshot + annotate (reuses the Draw tool's canvas) ----
  function renderShot(el) {
    el.innerHTML = `
      <div class="cd-row" style="color:var(--cd-dim);font-size:11px;">Captures the visible tab, then drops it into the Draw tool so you can mark it up.</div>
      <div class="cd-row"><button class="cd-btn" id="cd-shot-go" style="flex:1;">Capture visible tab</button></div>
      <div class="cd-row" id="cd-shot-msg" style="font-size:10px;color:var(--cd-dim);min-height:12px;">&nbsp;</div>
    `;
    el.querySelector("#cd-shot-go").addEventListener("click", async () => {
      const msg = el.querySelector("#cd-shot-msg");
      msg.textContent = "Capturing\u2026";
      els.root.style.visibility = "hidden";
      await new Promise((r) => setTimeout(r, 90));
      let resp;
      try {
        resp = await chrome.runtime.sendMessage({ type: "CYBERDECK_CAPTURE_TAB" });
      } catch (e) {
        resp = { error: String(e) };
      }
      els.root.style.visibility = "visible";
      if (!resp || resp.error) {
        msg.textContent = "Capture failed: " + (resp?.error || "unknown error");
        return;
      }
      const img = new Image();
      img.onload = () => {
        drawCtx.clearRect(0, 0, els.canvas.width, els.canvas.height);
        drawCtx.drawImage(img, 0, 0, els.canvas.width, els.canvas.height);
        setDrawMode(true);
        els.panels.utils.classList.add("cd-hidden");
        els.dock.querySelector('.cd-dock-btn[data-tool="utils"]').classList.remove("cd-on");
        els.panels.draw.classList.remove("cd-hidden");
        els.dock.querySelector('.cd-dock-btn[data-tool="draw"]').classList.add("cd-on");
      };
      img.src = resp.dataUrl;
    });
  }

  // ---- Text tools: word/char count, Base64, JSON format ----
  function renderText(el) {
    el.innerHTML = `
      <div class="cd-util-sub-title">Selection stats</div>
      <div class="cd-row"><button class="cd-btn" id="cd-text-count" style="flex:1;">Analyze page selection</button></div>
      <div class="cd-row" id="cd-text-stats" style="font-size:11px;color:var(--cd-text);flex-wrap:wrap;">&nbsp;</div>

      <div class="cd-util-sub-title">Base64</div>
      <div class="cd-row"><textarea id="cd-text-b64-in" class="cd-util-textarea" rows="2" placeholder="Text or Base64..."></textarea></div>
      <div class="cd-row"><button class="cd-btn" id="cd-text-b64-enc" style="flex:1;">Encode</button><button class="cd-btn" id="cd-text-b64-dec" style="flex:1;">Decode</button><button class="cd-btn" id="cd-text-b64-copy">Copy</button></div>

      <div class="cd-util-sub-title">JSON</div>
      <div class="cd-row"><textarea id="cd-text-json-in" class="cd-util-textarea" rows="3" placeholder='{"key":"value"}'></textarea></div>
      <div class="cd-row"><button class="cd-btn" id="cd-text-json-fmt" style="flex:1;">Format</button><button class="cd-btn" id="cd-text-json-min" style="flex:1;">Minify</button><button class="cd-btn" id="cd-text-json-copy">Copy</button></div>
      <div class="cd-row" id="cd-text-json-msg" style="font-size:10px;color:var(--cd-dim);min-height:12px;">&nbsp;</div>
    `;

    el.querySelector("#cd-text-count").addEventListener("click", () => {
      const text = window.getSelection()?.toString() || "";
      const stats = el.querySelector("#cd-text-stats");
      if (!text.trim()) { stats.textContent = "Nothing selected on the page."; return; }
      const words = (text.trim().match(/\S+/g) || []).length;
      const chars = text.length;
      const charsNoSpace = text.replace(/\s/g, "").length;
      const readingMin = Math.max(1, Math.round(words / 200));
      stats.innerHTML = `Words: <b>${words}</b> &nbsp; Chars: <b>${chars}</b> &nbsp; Chars (no spaces): <b>${charsNoSpace}</b> &nbsp; Reading time: <b>~${readingMin} min</b>`;
    });

    const b64in = el.querySelector("#cd-text-b64-in");
    el.querySelector("#cd-text-b64-enc").addEventListener("click", () => {
      try { b64in.value = btoa(unescape(encodeURIComponent(b64in.value))); }
      catch (e) { b64in.value = "Encode error"; }
    });
    el.querySelector("#cd-text-b64-dec").addEventListener("click", () => {
      try { b64in.value = decodeURIComponent(escape(atob(b64in.value))); }
      catch (e) { b64in.value = "Invalid Base64"; }
    });
    el.querySelector("#cd-text-b64-copy").addEventListener("click", () => {
      if (b64in.value) navigator.clipboard.writeText(b64in.value).catch(() => {});
    });

    const jsonIn = el.querySelector("#cd-text-json-in");
    const jsonMsg = el.querySelector("#cd-text-json-msg");
    el.querySelector("#cd-text-json-fmt").addEventListener("click", () => {
      try { jsonIn.value = JSON.stringify(JSON.parse(jsonIn.value), null, 2); jsonMsg.textContent = "Formatted."; }
      catch (e) { jsonMsg.textContent = "Invalid JSON: " + e.message; }
    });
    el.querySelector("#cd-text-json-min").addEventListener("click", () => {
      try { jsonIn.value = JSON.stringify(JSON.parse(jsonIn.value)); jsonMsg.textContent = "Minified."; }
      catch (e) { jsonMsg.textContent = "Invalid JSON: " + e.message; }
    });
    el.querySelector("#cd-text-json-copy").addEventListener("click", () => {
      if (jsonIn.value) navigator.clipboard.writeText(jsonIn.value).catch(() => {});
    });
  }

  // ---- Emoji / Unicode picker ----
  const EMOJI_SETS = {
    Faces: ["😀", "😂", "😉", "😎", "🥲", "😭", "😡", "🤔", "🥳", "😴", "🤯", "🫠", "🙃", "😇", "🤖"],
    Gestures: ["👍", "👎", "👏", "🙌", "🤝", "✌️", "🤘", "👌", "🫡", "🙏", "💪", "🤙"],
    Hearts: ["❤️", "💔", "💜", "🩷", "🖤", "💙", "💚", "💛", "🧡", "✨", "💫", "⭐"],
    Tech: ["🤖", "💻", "🖥️", "📡", "🔋", "🔌", "🛰️", "🧠", "⚡", "🔧", "🛠️", "🔒", "🔓", "📶", "💾"],
    Symbols: ["✔️", "❌", "⚠️", "❓", "❗", "➡️", "⬅️", "🔥", "💯", "♻️", "🔺", "🔻", "🚀", "🌐", "🕹️"],
    Animals: ["🐱", "🐶", "🦊", "🐺", "🦉", "🐍", "🐉", "🦄", "🐙", "🦋"],
  };
  function renderEmoji(el) {
    el.innerHTML = `
      <div class="cd-row"><input id="cd-emoji-search" class="cd-util-input" placeholder="Filter by category name..." style="flex:1;"></div>
      <div id="cd-emoji-grid" class="cd-emoji-grid"></div>
      <div class="cd-row" id="cd-emoji-msg" style="font-size:10px;color:var(--cd-dim);min-height:12px;">Click to insert or copy.</div>
    `;
    const grid = el.querySelector("#cd-emoji-grid");
    const msg = el.querySelector("#cd-emoji-msg");
    const search = el.querySelector("#cd-emoji-search");

    function draw(filter) {
      grid.innerHTML = "";
      Object.entries(EMOJI_SETS).forEach(([cat, list]) => {
        if (filter && !cat.toLowerCase().includes(filter.toLowerCase())) return;
        const header = document.createElement("div");
        header.className = "cd-emoji-cat";
        header.textContent = cat;
        grid.appendChild(header);
        const row = document.createElement("div");
        row.className = "cd-emoji-row";
        list.forEach((em) => {
          const btn = document.createElement("button");
          btn.className = "cd-emoji-btn";
          btn.textContent = em;
          btn.addEventListener("click", () => insertEmoji(em));
          row.appendChild(btn);
        });
        grid.appendChild(row);
      });
    }
    function insertEmoji(em) {
      const active = document.activeElement;
      let inserted = false;
      if (active && (active.tagName === "TEXTAREA" || (active.tagName === "INPUT" && /^(text|search|url|tel)$/.test(active.type)))) {
        const start = active.selectionStart ?? active.value.length;
        const end = active.selectionEnd ?? active.value.length;
        active.value = active.value.slice(0, start) + em + active.value.slice(end);
        active.selectionStart = active.selectionEnd = start + em.length;
        active.dispatchEvent(new Event("input", { bubbles: true }));
        inserted = true;
      } else if (active && active.isContentEditable) {
        document.execCommand("insertText", false, em);
        inserted = true;
      }
      if (inserted) {
        msg.textContent = `Inserted ${em}`;
      } else {
        navigator.clipboard.writeText(em).catch(() => {});
        msg.textContent = `Copied ${em} to clipboard.`;
      }
    }
    search.addEventListener("input", () => draw(search.value.trim()));
    draw("");
  }

  /* =========================================================
     9. MESSAGE BRIDGE — toolbar icon toggles the HUD
     ========================================================= */
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "CYBERDECK_TOGGLE_DOCK") toggleHud();
  });
})();
