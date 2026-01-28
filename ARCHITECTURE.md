# Architecture (Frontend)

This document explains how the project is organized and what rules we follow to keep it fast, simple, and safe.

---

## Goals

* **Simple**: easy to understand in minutes
* **Fast**: quick load, low CPU usage
* **Safe**: no side effects outside the tab (no “Google Meet problems”)
* **Accessible**: respects `prefers-reduced-motion`
* **Maintainable**: adding features should not create mess

---

## Non-goals

* No heavy frameworks “just because”
* No complex state management
* No background work without user action

---

## Folder structure

```
src/
 ├─ api/
 │   └─ naasClient.js   # API / future backend communication
 ├─ modes/
 │   └─ modeEngine.js   # message generation logic
 ├─ ui/
 │   ├─ confetti.js     # confetti effect (canvas-based)
 │   ├─ dom.js          # DOM queries and bindings
 │   ├─ poster.js       # save result as image
 │   └─ toast.js        # small UI notifications
 ├─ app.js              # app state and orchestration
 ├─ config.js           # feature flags and constants
 ├─ main.js             # entry point
 └─ utils.js            # small helper functions
```

Rule of thumb: **one file = one job**.

---

## Data flow (high level)

1. `main.js` boots the app
2. `app.js` wires everything together
3. User clicks a button
4. `modeEngine.js` returns a message
5. `ui/dom.js` updates the page
6. Optional:

    * `ui/toast.js` shows feedback
    * `ui/poster.js` exports an image
    * `ui/confetti.js` plays a lightweight effect

---

## Clear boundaries

### `modes/` is pure logic

* Should be **easy to test**
* Should not touch the DOM
* Should not use timers

### `ui/` handles the browser

* DOM updates
* Canvas drawing
* Clipboard/share/export

### `utils.js`

* Small helpers only (random, chance, formatting)
* No DOM here

### `config.js`

* Feature flags and constants
* No logic that changes state

---

## Effects policy (confetti)

Effects are optional and must be safe.

Confetti rules:

* Must be **disabled** when `prefers-reduced-motion: reduce`
* Must be **disabled on mobile** (or very limited)
* Must run only **after a user action**
* Must stop cleanly (no infinite loops)
* Must not allocate huge arrays every frame
* Must not keep working when the tab is hidden

Recommended checks:

* `matchMedia('(prefers-reduced-motion: reduce)')`
* `matchMedia('(max-width: 860px)')` (or similar)
* `document.visibilityState`

---

## Performance rules

* Keep the main thread free
* Avoid heavy work on resize
* Never add multiple resize listeners for the same thing
* Use `requestAnimationFrame` for animations
* Respect device pixel ratio (DPR) for canvas

---

## Error handling

* Fail gracefully
* Prefer a friendly toast over a hard crash
* If export/share is not supported, show a message and still allow copy

---

## Adding a new feature (simple checklist)

Before adding code, decide:

1. Is it **logic**? → put in `modes/`
2. Is it **UI / browser**? → put in `ui/`
3. Is it a **small helper**? → `utils.js`
4. Is it a **flag/constant**? → `config.js`

Then:

* Keep it small
* Avoid new dependencies
* Do not break reduced-motion rules
* Do not run things in the background

---

## Future: modes (when UI appears)

When we add mode selection:

* `modes/` can grow (multiple files)
* UI should stay simple (one control, no clutter)
* README should be updated only when the feature is real
