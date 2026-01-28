export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function chance(p) {
    return Math.random() < p;
}

export function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
}
