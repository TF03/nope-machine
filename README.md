# Nope Machine / No‑as‑a‑Service

A simple **“no” generator**.

Press a button — get a stylish, ready‑to‑send reason to say “no”. Copy it, share it, or save it as an image.

---

## Why this exists

Saying *no* is not always easy.

Sometimes you want to refuse:

* politely
* with a bit of humor
* without sounding rude or awkward

Nope Machine helps you do exactly that — fast and effortlessly.

---

## What it does (current state)

1. You open the page
2. Click **“Give me a reason”**
3. Get a short, witty “no”
4. You can:

    * copy the text
    * share it
    * save it as an image

That’s it. One action, one result.

---

## Tone

* light humor
* calm and human
* short sentences
* no sarcasm, no toxicity

The goal is not to reject people —
but to **say no in a nice way**.

---

## UX principles

* very simple interface
* one main button
* instant feedback
* works well on mobile
* respects `prefers-reduced-motion`

Animations are optional and never required.

---

## Features

* random “no” reasons
* copy to clipboard
* share
* save as image
* optional confetti animation

---

## Frontend architecture (simple rules)

### Keep it simple

* plain JavaScript
* very few dependencies
* fast load
* no background work without a reason

---

### Clear responsibility

The project is split by responsibility, but kept very flat and readable.

Current structure:

```
src/
 ├─ api/
 │   └─ naasClient.js   # API / future backend communication
 ├─ modes/
 │   └─ modeEngine.js   # logic for generating "no" messages
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

Each file has a clear role.
UI, logic, and effects are separated, but not over-engineered.

---

### Effects are optional

Visual effects must:

* be lightweight
* stop when not needed
* never slow down the page

Confetti is:

* disabled on mobile
* disabled when reduced motion is enabled
* triggered only sometimes

---

## Performance mindset

* no heavy libraries
* careful resize handling
* canvas isolated from main logic
* nothing runs just for fun

---

## Project status

* small
* simple
* evolving step by step

Clean code and good UX matter more than new features.

---

## License

MIT — see `LICENSE` file.

---

✨ Nope Machine — a small tool for saying “no” nicely.
