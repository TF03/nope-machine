export class PosterRenderer {
    renderPng({reason, mode}) {
        const w = 1080, h = 1080;
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const g = c.getContext("2d");

        const grd = g.createLinearGradient(0, 0, w, h);
        grd.addColorStop(0, "#0b1020");
        grd.addColorStop(0.5, "#1a0b2e");
        grd.addColorStop(1, "#071023");
        g.fillStyle = grd;
        g.fillRect(0, 0, w, h);

        const glow = (x, y, r, col) => {
            const rg = g.createRadialGradient(x, y, 0, x, y, r);
            rg.addColorStop(0, col);
            rg.addColorStop(1, "rgba(0,0,0,0)");
            g.fillStyle = rg;
            g.fillRect(0, 0, w, h);
        };

        glow(240, 220, 520, "rgba(124,58,237,.45)");
        glow(840, 320, 480, "rgba(34,197,94,.22)");
        glow(620, 960, 560, "rgba(251,113,133,.18)");

        const pad = 90;
        const rx = 44;
        const x = pad, y = pad, cw = w - pad * 2, ch = h - pad * 2;

        const roundRect = (x, y, w, h, r) => {
            g.beginPath();
            g.moveTo(x + r, y);
            g.arcTo(x + w, y, x + w, y + h, r);
            g.arcTo(x + w, y + h, x, y + h, r);
            g.arcTo(x, y + h, x, y, r);
            g.arcTo(x, y, x + w, y, r);
            g.closePath();
        };

        g.save();
        g.shadowColor = "rgba(0,0,0,.45)";
        g.shadowBlur = 60;
        g.shadowOffsetY = 28;
        g.fillStyle = "rgba(15,22,48,.70)";
        roundRect(x, y, cw, ch, rx);
        g.fill();
        g.restore();

        g.strokeStyle = "rgba(255,255,255,.14)";
        g.lineWidth = 3;
        roundRect(x, y, cw, ch, rx);
        g.stroke();

        g.fillStyle = "rgba(238,242,255,.95)";
        g.font = "900 56px system-ui, -apple-system, Segoe UI, Roboto";
        g.fillText("NOPE MACHINE", x + 60, y + 110);

        g.fillStyle = "rgba(238,242,255,.60)";
        g.font = "800 28px system-ui, -apple-system, Segoe UI, Roboto";
        g.fillText("MODE: " + String(mode).toUpperCase(), x + 60, y + 160);

        // stamp
        g.save();
        g.translate(x + cw - 220, y + 120);
        g.rotate(0.22);
        g.strokeStyle = "rgba(251,113,133,.85)";
        g.lineWidth = 7;
        g.fillStyle = "rgba(251,113,133,.12)";
        roundRect(-160, -70, 320, 140, 28);
        g.fill();
        g.stroke();
        g.fillStyle = "rgba(251,113,133,.92)";
        g.font = "1000 52px system-ui, -apple-system, Segoe UI, Roboto";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText("NOPE", 0, 0);
        g.restore();

        // wrapped text
        g.fillStyle = "rgba(238,242,255,.92)";
        g.font = "800 44px system-ui, -apple-system, Segoe UI, Roboto";
        const text = String(reason || "");
        const maxWidth = cw - 120;
        const lines = [];
        let line = "";

        for (const word of text.split(" ")) {
            const test = line ? (line + " " + word) : word;
            if (g.measureText(test).width > maxWidth) {
                lines.push(line);
                line = word;
            } else {
                line = test;
            }
        }
        if (line) lines.push(line);

        let ty = y + 260;
        const lh = 58;
        for (const ln of lines.slice(0, 10)) {
            g.fillText(ln, x + 60, ty);
            ty += lh;
        }

        g.fillStyle = "rgba(238,242,255,.60)";
        g.font = "700 28px system-ui, -apple-system, Segoe UI, Roboto";
        g.fillText("Generated with Nope Machine · Powered by No-as-a-Service\n", x + 60, y + ch - 70);

        return c.toDataURL("image/png");
    }
}
