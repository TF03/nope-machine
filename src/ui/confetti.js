export class Confetti {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.particles = [];
        this.raf = null;

        /** @type {HTMLElement|null} */
        this.target = null;

        this._resize = this._resize.bind(this);
        window.addEventListener("resize", this._resize);
        this._resize();
    }

    _resize() {
        const dpr = devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    burst(intensity = "low") {
        const count = intensity === "high" ? 170 : 90;

        let cx = window.innerWidth / 2;
        let cy = window.innerHeight / 2;

        const palette = ["rgba(124,58,237,", "rgba(34,197,94,", "rgba(251,113,133,", "rgba(238,242,255,"];

        if (this.target) {
            const rect = this.target.getBoundingClientRect();
            cx = rect.left + rect.width / 2;
            cy = rect.top + rect.height / 2;
        }

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: cx, y: cy,
                vx: (Math.random() - 0.5) * (intensity === "high" ? 14 : 10),
                vy: -Math.random() * (intensity === "high" ? 12 : 9) - 2,
                g: 0.35 + Math.random() * 0.15,
                r: 2 + Math.random() * 4,
                a: 1,
                rot: Math.random() * Math.PI,
                vr: (Math.random() - 0.5) * 0.3,
                col: palette[(Math.random() * palette.length) | 0],
            });
        }
        this._animate();
    }

    _animate() {
        if (this.raf) return;

        if (document.hidden) {
            this.particles = [];
            cancelAnimationFrame(this.raf);
            this.raf = null;
            return;
        }

        const step = () => {
            if (document.hidden) {
                this.particles = [];
                this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                this.raf = null;
                return;
            }

            const ctx = this.ctx;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            this.particles = this.particles.filter(p => p.a > 0.03 && p.y < window.innerHeight + 40);

            for (const p of this.particles) {
                p.vy += p.g;
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.vr;
                p.a *= 0.985;

                ctx.fillStyle = p.col + (p.a.toFixed(3)) + ")";

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
                ctx.restore();
            }

            if (this.particles.length) {
                this.raf = requestAnimationFrame(step);
            } else {
                cancelAnimationFrame(this.raf);
                this.raf = null;
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            }
        };

        this.raf = requestAnimationFrame(step);
    }
}
