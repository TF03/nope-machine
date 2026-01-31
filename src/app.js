import {MODE_LABELS} from "./config.js";
import {chance} from "./utils.js";
import {copyText} from "./utils/copyText.js";

export class App {
    /**
     * @param {{
     *  dom: ReturnType<import("./ui/dom.js").getDom>,
     *  toast: import("./ui/toast.js").Toast,
     *  confetti: import("./ui/confetti.js").Confetti,
     *  poster: import("./ui/poster.js").PosterRenderer,
     *  api: import("./api/naasClient.js").NaasClient,
     *  modes: import("./modes/modeEngine.js").ModeEngine
     * }} deps
     */
    constructor({dom, toast, confetti, poster, api, modes}) {
        this.dom = dom;
        this.toast = toast;
        this.confetti = confetti;
        this.poster = poster;
        this.api = api;
        this.modes = modes;

        this.lastReason = "";
        this.lastMode = "viral";

        this._rmMql = window.matchMedia("(prefers-reduced-motion: reduce)");
        this.reducedMotion = this._rmMql.matches;

        this.isGenerating = false;

        this._mobileMql = window.matchMedia("(max-width: 860px)");
        this.isMobile = this._mobileMql.matches;

        this._stampT = null;
        this._wmT = null;

        this._mobileMql.addEventListener?.("change", (e) => {
            this.isMobile = e.matches;
        });
    }

    async init() {
        this._wireUi();
        // this._updateModeUi(this.dom.modeSelect.value);

        let ok = false;
        try {
            ok = await this.api.ping();
        } catch {
        }
        this._setApiStatus(ok);

        this.confetti.target = this.dom.card;
        this._rmMql.addEventListener?.("change", (e) => {
            this.reducedMotion = e.matches;
        });
    }

    _wireUi() {
        // this.dom.modeSelect.addEventListener("change", () => {
        //     this._updateModeUi(this.dom.modeSelect.value);
        // });

        // this.dom.btnRandomMode.addEventListener("click", () => {
        //     this.dom.modeSelect.value = MODES[randInt(0, MODES.length - 1)];
        //     // this._updateModeUi(this.dom.modeSelect.value);
        //     this.toast.show("Mode: " + MODE_LABELS[this.dom.modeSelect.value]);
        // });

        this.dom.btnNo.addEventListener("click", () => this._onGenerate());
        this.dom.btnCopy.addEventListener("click", () => this._onCopy());
        // this.dom.btnShare.addEventListener("click", () => this._onShare());
        this.dom.btnImage.addEventListener("click", () => this._onSaveImage());
    }

    _setApiStatus(ok) {
        this.dom.apiStatus.textContent = ok ? "● online" : "● maybe offline";
        this.dom.apiStatus.style.color = ok ? "rgba(34,197,94,.9)" : "rgba(251,113,133,.9)";
    }

    _setStatus(s) {
        if (this.dom.statusLabel) this.dom.statusLabel.textContent = s;
    }

    _enableActions(enabled) {
        this.dom.btnCopy.disabled = !enabled;
        // this.dom.btnShare.disabled = !enabled;
        this.dom.btnImage.disabled = !enabled;
    }

    _shake() {
        this.dom.card.classList.remove("shake");
        void this.dom.card.offsetWidth;
        this.dom.card.classList.add("shake");
    }

    _stampPop() {
        this.dom.stamp.classList.remove("show");
        void this.dom.stamp.offsetWidth;
        this.dom.stamp.classList.add("show");

        clearTimeout(this._stampT);
        this._stampT = setTimeout(() => this.dom.stamp.classList.remove("show"), 650);
    }

    _updateModeUi(mode) {
        this.lastMode = mode;

        this.dom.modeLabel.textContent = MODE_LABELS[mode] ?? String(mode).toUpperCase();
        this.dom.memeChance.textContent = Math.round(this.modes.memeProbability(mode) * 100) + "%";

        const meme = this.modes.memePanelText(mode);
        this.dom.bigNo.textContent = meme.big;
        this.dom.memeHint.textContent = meme.hint;
        this.dom.boing.textContent = mode === "chaos" ? "*MEGA BOING*" : "*boing*";

        this.dom.bigNo.animate(
            [
                {transform: "scale(1) rotate(0deg)"},
                {transform: "scale(1.08) rotate(-2deg)"},
                {transform: "scale(0.98) rotate(1deg)"},
                {transform: "scale(1) rotate(0deg)"},
            ],
            {duration: mode === "chaos" ? 520 : 420, easing: "cubic-bezier(.2,.9,.2,1)"}
        );
    }

    async _onGenerate() {
        if (this.isGenerating) return;
        this.isGenerating = true;
        this._enableActions(false);

        const mode = "viral";
        this._setStatus("loading…");
        if (this.dom.meta) this.dom.meta.textContent = "crafting the perfect excuse…";
        this.dom.btnNo.disabled = true;

        try {
            const {ok, reason} = await this.api.getReason();

            this._setApiStatus(ok);

            const finalText = this.modes.stylize(reason, mode);
            this.lastReason = finalText;
            this.lastMode = mode;

            this.dom.reasonText.classList.remove("muted");
            this.dom.reasonText.textContent = finalText;

            if (this.dom.meta) this.dom.meta.textContent = "done. now send it to a friend 😼";

            this._enableActions(true);

            this._track(ok ? "SuccessGenerateReason" : "FailedGenerateReason", {mode});
            this._setStatus(ok ? "ok" : "fallback");

            this._shake();
            this._stampPop();

            const p = this.modes.memeProbability(mode);
            if (!this.reducedMotion && !this.isMobile && chance(p)) {
                this.confetti.burst("low");
                this._track("ConfettiBurst", {mode});
            }

            if (this.dom.watermark) {
                this.dom.watermark.style.transform = "scale(1.4)";
                clearTimeout(this._wmT);
                this._wmT = setTimeout(() => {
                    if (this.dom.watermark) this.dom.watermark.style.transform = "scale(1)";
                }, 450);
            }
        } finally {
            this.dom.btnNo.disabled = false;
            this.isGenerating = false;
            this._enableActions(Boolean(this.lastReason));
        }
    }

    async _onCopy() {
        if (!this.lastReason) return;
        const payload = `🚫 NOPE: ${this.lastReason}`;

        try {
            const {method} = await copyText(payload);

            if (method === "clipboard") {
                this.toast.show("Copied 📋");
            } else {
                this.toast.show("Select text and press Ctrl/Cmd+C ✨");
            }

            this._track("CopyResult", {method});
        } catch {
            this.toast.show("Couldn’t copy 😅");
            this._track("CopyFailed");
        }
    }

    async _onShare() {
        if (!this.lastReason) return;

        const text = `🚫 NOPE (${MODE_LABELS[this.lastMode] ?? this.lastMode.toUpperCase()}): ${this.lastReason}`;
        const url = location.href;

        if (navigator.share) {
            try {
                await navigator.share({title: "NOPE — причина отказа", text, url});
                this.toast.show("Sent 📤");
                this._track("SharedResult");
                return;
            } catch {
                this._track("ShareFailed");
            }
        }

        try {
            const {method} = await copyText(text + "\n\n" + url);
            this.toast.show(method === "clipboard" ? "Message copied ✨" : "Select text and press Ctrl/Cmd+C ✨");
            this._track("ShareFallbackCopy", {method});
        } catch {
            this.toast.show("Couldn’t share 😅");
            this._track("ShareFallbackCopyFailed");
        }
    }

    _onSaveImage() {
        if (!this.lastReason) return;
        const png = this.poster.renderPng({reason: this.lastReason, mode: this.lastMode});

        const a = document.createElement("a");
        a.download = "nope.png";
        a.href = png;
        a.click();
        this.toast.show("Image saved 🖼️");
        this._track("SavedImage");
    }

    _track(name, props) {
        try {
            window.plausible?.(name, props ? {props: {...props}} : undefined);
        } catch {
        }
    }
}
