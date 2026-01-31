export async function copyText(text) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return {ok: true, method: "clipboard"};
    }

    const ta = document.createElement("textarea");
    ta.value = text;

    ta.setAttribute("readonly", "");
    ta.setAttribute("aria-hidden", "true");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.left = "-1000px";
    ta.style.opacity = "0";

    document.body.appendChild(ta);
    ta.focus();
    ta.select();

    // Cleanup soon to avoid DOM clutter
    setTimeout(() => {
        try {
            ta.remove();
        } catch {
        }
    }, 1500);

    return {ok: true, method: "manual"};
}
