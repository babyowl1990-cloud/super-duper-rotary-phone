# Cyberdeck // Toolkit

A neon HUD that floats over any webpage: freehand draw/annotate, sticky notes, a calculator, and an accessibility panel (font scale, high contrast, dyslexia-friendly font, reduce motion, big cursor, link highlighting, read-selection-aloud).

## Install (Chrome / Edge / Brave — unpacked)

1. Unzip this folder somewhere permanent (don't delete it after installing — Chrome loads the extension directly from these files).
2. Go to `chrome://extensions`.
3. Turn on **Developer mode** (top right toggle).
4. Click **Load unpacked** and select the `cyberdeck-toolkit` folder.
5. Pin the extension (puzzle-piece icon → pin) so it's visible in the toolbar.

## Use

- Click the toolbar icon, or press **Alt+Shift+C**, to drop the HUD dock onto the current page (repeat to hide it).
- Drag the dock by its "CYBERDECK" label to reposition it — position is remembered.
- **Pencil icon** → draw panel: choose Pen, Eraser, Line, Rect, Arrow, or Text, pick a color/size, then draw over the page. Undo, Clear, and Save PNG all work across every tool.
- **Note icon** → drops a new sticky note. Drag by its header, resize from the corner, recolor via the dots, delete with ×. Notes are saved per-website.
- **Calculator icon** → calculator.
- **Person-in-circle icon** → accessibility panel (font scale, high contrast, dyslexia font, reduce motion, big cursor, link highlighting, read-selection-aloud). These apply automatically on every site you visit, whether or not the dock is open.
- **Gear/spokes icon** → settings panel:
  - **Export settings** downloads everything Cyberdeck has stored (notes on every site, accessibility prefs, dock/panel positions) as a JSON file.
  - **Import settings** loads that file back in — handy for moving to a new machine or browser profile.
  - **Reset all** wipes all Cyberdeck data and starts fresh.
- **Grid icon** → Utilities panel, with tabs down the left side:
  - **QR** — turns any text/URL into a scannable QR code (offline, up to ~106 characters), with a PNG download.
  - **Password** — generates a cryptographically random password with adjustable length and character sets, plus a rough entropy estimate.
  - **Eyedropper** — pick any color off the page (native browser color-picker), copies hex to clipboard.
  - **Convert** — length/weight/volume/temperature conversion (offline) and currency conversion (live rates via frankfurter.app).
  - **Timer** — a focus/pomodoro countdown with presets, plays a short tone when it hits zero.
  - **Clipboard** — keeps a running history of text you copy on any page, click to copy it back.
  - **Screenshot** — captures the visible tab and drops it straight into the Draw tool so you can mark it up, then Save PNG.
  - **Text tools** — word/char counter for the page's current selection, a Base64 encoder/decoder, and a JSON formatter/minifier.
  - **Emoji** — a categorized emoji picker that inserts directly into whatever text field is focused on the page (or copies to clipboard if nothing's focused).

## Notes on permissions

- `storage` — saves dock position, sticky notes (per site), and accessibility preferences locally in your browser. Nothing leaves your machine.
- `activeTab` / `scripting` / host permissions — needed to inject the floating HUD into the page you're viewing.

## Changelog

- **1.3.3** — Fixed the Text stamp tool: pressing Enter called `commit()`, which removed the still-focused input — and removing a focused element fires its own `blur` event, which was *also* wired to call `commit()`, so every text stamp got drawn twice at the same spot (and doubled the undo stack for it, so one Undo didn't fully remove it). Added a guard so commit only runs once. Also fixed the text baseline so stamped text lands where you'd expect relative to the click point, and stopped the input's own keystrokes from leaking through to the canvas.
- **1.3.2** — Fixed the real cause of the draw panel feeling unresponsive: `.cd-panel` had no explicit `z-index`, so once the draw canvas's pointer-events turned on, the canvas (which does have an explicit z-index) painted *above* every panel per CSS stacking rules — swallowing clicks meant for the Draw panel's own buttons. Panels now always stack above the canvas.
- **1.3.1** — Hardened the shape-tool (Rect/Line/Arrow) canvas snapshot the same way `pushUndo` already was: guarded against zero-size canvas and wrapped in try/catch so a snapshot failure can't crash the draw tool.
- **1.3.0** — Draw tool now has Pen/Eraser/Line/Rect/Arrow/Text modes (shape preview while dragging, click-to-place text). Added Text tools (selection word/char count, Base64, JSON format/minify) and an Emoji/Unicode picker to the Utilities panel.
- **1.2.1** — Fixed a bug where the "Big cursor" accessibility toggle rendered as a solid black square instead of the neon arrow (a color-encoding mistake). Fixed a crash where `wireUtils()` was called before it was defined, which could silently break dock-position/notes restoration on open. Hardened the draw tool's undo against a zero-size-canvas edge case.
- **1.2.0** — Added the Utilities panel (QR, password generator, eyedropper, unit/currency converter, focus timer, clipboard history, screenshot+annotate) and a Save PNG button on the Draw tool.
