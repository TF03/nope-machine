export class NaasClient {
    /**
     * @param {{ apiUrl: string }} deps
     */
    constructor({ apiUrl }) {
        this.apiUrl = apiUrl;
    }

    /**
     * @returns {Promise<{ ok: boolean, reason: string }>}
     */
    async getReason() {
        try {
            const res = await fetch(this.apiUrl, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const reason = String(data?.reason ?? data?.message ?? "").trim();
            return { ok: true, reason: reason || "Nope." };
        } catch {
            const fallback = [
                "I would, but my inner lawyer is already screaming.",
                "No. Because yes is too bold for this reality.",
                "My motivation went out for a smoke and never came back.",
                "Can’t. I have a very important meeting with my couch.",
            ];
            const reason = fallback[Math.floor(Math.random() * fallback.length)];
            return { ok: false, reason };
        }
    }

    /**
     * @returns {Promise<boolean>}
     */
    async ping() {
        try {
            const res = await fetch(this.apiUrl, { method: "GET", cache: "no-store" });
            return res.ok;
        } catch {
            return false;
        }
    }
}
