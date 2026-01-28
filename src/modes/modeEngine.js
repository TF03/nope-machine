import { chance, randInt } from "../utils.js";

export class ModeEngine {
    constructor() {
        /** @type {Record<string, string[]>} */
        this.localPools = {
            office: [
                "We need to align expectations… so: no.",
                "I’ll put it in the backlog. Not taking it now. (aka no)",
                "This needs stakeholder approval. So no.",
                "High risk, questionable value. Pass.",
                "Let’s revisit after quarterly planning. Nope."
            ],
            gamer: [
                "I’m on cooldown. No.",
                "Mana is zero. HP is also zero. Not today.",
                "I’m in a safe zone. If I leave, it’s pain. No.",
                "This looks like a bug, not a feature. Skipping.",
                "First: farming. Then: yes. Now: no."
            ],
            cookerman: [
                "Dough is proofing. Any “yes” will ruin it. No.",
                "Oven is busy. Heart too. No.",
                "I’d agree, but my sauce is reducing. (so no)",
                "Let it rest. Then we’ll talk. For now: no.",
                "Salt is in. Enthusiasm is not. 😌"
            ],
            viral: [
                "I would, but this smells like a 7-hour side quest.",
                "My calendar looked at me and said: “don’t you dare.”",
                "With pleasure… in another universe. Here: no."
            ],
            chaos: [
                "NO. Because GRAVITY. 🤝",
                "Can’t. Reason: ✨cosmic veto✨",
                "Denied. Article: ‘just don’t wanna’."
            ],
        };
    }

    memeProbability(mode) {
        switch (mode) {
            case "chaos": return 0.85;
            case "cookerman": return 0.62;
            case "gamer": return 0.62;
            case "office": return 0.58;
            case "viral":
            default: return 0.55;
        }
    }

    /**
     * @param {string} base
     * @param {string} mode
     */
    stylize(base, mode) {
        const clean = String(base || "").trim();

        const overrideChance =
            mode === "chaos" ? 0.55 :
                (mode === "office" || mode === "gamer" || mode === "cookerman") ? 0.33 :
                    0.18;

        if (chance(overrideChance)) {
            const pool = this.localPools[mode] || this.localPools.viral;
            return pool[randInt(0, pool.length - 1)];
        }

        if (mode === "office") {
            const prefix = ["Update:", "As per priorities:", "Given the deadlines:", "Status:"][randInt(0, 3)];
            const suffix = chance(0.45) ? " (we can hop on a call and I’ll say no again)" : (chance(0.25) ? " (next sprint maybe)" : "");
            return `${prefix} ${clean}${suffix}`;
        }

        if (mode === "gamer") {
            const prefix = ["Quest failed:", "System:", "Logs say:", "NPC reply:"][randInt(0, 3)];
            const suffix = chance(0.45) ? " 🎮" : (chance(0.25) ? " (need better loot, sorry)" : "");
            return `${prefix} ${clean}${suffix}`;
        }

        if (mode === "cookerman") {
            const prefix = ["Chef’s decision:", "Kitchen verdict:", "Recipe for refusal:", "The pan said:"][randInt(0, 3)];
            const suffix = chance(0.45) ? " 👨‍🍳" : (chance(0.25) ? " (let it rest…)" : "");
            return `${prefix} ${clean}${suffix}`;
        }

        if (mode === "chaos") {
            const prefix = ["URGENT:", "LEGENDARY:", "BREAKING:", "OFFICIAL:"][randInt(0, 3)];
            const suffix = [" 💥", " 🌀", " ✨", " 🤝 (but not guaranteed)"][randInt(0, 3)];
            const core = chance(0.35) ? clean.toUpperCase() : clean;
            return `${prefix} ${core}${suffix}`;
        }

        // viral
        const suffix = chance(0.25) ? " 😌" : (chance(0.12) ? " (final answer)" : "");
        return clean + suffix;
    }

    memePanelText(mode) {
        const map = {
            viral: { big: "NO", hint: "When your friend says “c’mon, just this once…”" },
            office: { big: "NO (SYNC)", hint: "When someone says “quick 5-minute call”" },
            gamer: { big: "NOPE", hint: "When they invite you to a raid but you’re out of mana" },
            cookerman: { big: "NO, CHEF", hint: "When the dough is proofing — don’t touch it" },
            chaos: { big: "NOOO", hint: "When the universe decides: ‘today is not a yes day’" },
        };
        return map[mode] || map.viral;
    }
}
