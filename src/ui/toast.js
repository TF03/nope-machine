export class Toast {
    /**
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.el = el;
        this._t = null;
    }

    show(text, ms = 1200) {
        this.el.textContent = text;
        this.el.classList.add("show");
        clearTimeout(this._t);
        this._t = setTimeout(() => this.el.classList.remove("show"), ms);
    }
}
