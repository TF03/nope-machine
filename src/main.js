import {API_URL} from "./config.js";
import {NaasClient} from "./api/naasClient.js";
import {ModeEngine} from "./modes/modeEngine.js";
import {getDom} from "./ui/dom.js";
import {Toast} from "./ui/toast.js";
import {Confetti} from "./ui/confetti.js";
import {PosterRenderer} from "./ui/poster.js";
import {App} from "./app.js";

const dom = getDom();

const app = new App({
    dom,
    toast: new Toast(dom.toast),
    confetti: new Confetti(dom.confetti),
    poster: new PosterRenderer(),
    api: new NaasClient({apiUrl: API_URL}),
    modes: new ModeEngine(),
});

app.init();
