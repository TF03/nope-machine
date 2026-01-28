export function getDom() {
    const el = (id) => document.getElementById(id);

    return {
        card: el("card"),
        apiStatus: el("apiStatus"),
        meta: el("meta"),
        stamp: el("stamp"),

        reasonText: el("reasonText"),
        statusLabel: el("statusLabel"),
        memeChance: el("memeChance"),
        modeLabel: el("modeLabel"),

        modeSelect: el("modeSelect"),
        btnNo: el("btnNo"),
        btnCopy: el("btnCopy"),
        btnShare: el("btnShare"),
        btnImage: el("btnImage"),
        btnRandomMode: el("btnRandomMode"),

        memeHint: el("memeHint"),
        bigNo: el("bigNo"),
        boing: el("boing"),

        toast: el("toast"),
        confetti: el("confetti"),
        
        watermark: el("watermark"),
    };
}
