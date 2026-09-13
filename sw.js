/* =========================================================
    TROPICAL SELF-SERVICE 2.0
    Service worker: o que faz o site funcionar como app

    Estratégia "rede primeiro": sempre tenta buscar a versão mais
    nova na internet, para preço e horário atualizados aparecerem
    na hora, e guarda uma cópia. Sem internet, usa a cópia guardada.

    Ao mudar a lista de arquivos abaixo, troque o número da versão
    (tropical-v1 → tropical-v2) para o navegador descartar a antiga.
   ========================================================= */

const VERSAO = "tropical-v1";

// Guardados logo na instalação, para o app abrir mesmo sem internet
const ARQUIVOS_BASICOS = [
    "./",
    "index.html",
    "css/style.css",
    "js/dados.js",
    "js/script.js",
    "img/fachada.jpg",
    "img/logo.jpg",
    "img/icones/icone-192.png",
];

self.addEventListener("install", (evento) => {
    evento.waitUntil(
        caches.open(VERSAO).then((cache) => cache.addAll(ARQUIVOS_BASICOS))
    );
    self.skipWaiting();
});

// Apaga cópias de versões antigas
self.addEventListener("activate", (evento) => {
    evento.waitUntil(
        caches.keys().then((nomes) =>
            Promise.all(nomes.filter((nome) => nome !== VERSAO).map((nome) => caches.delete(nome)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
    const pedido = evento.request;

    // Só cuida dos arquivos do próprio site. Fontes do Google,
    // WhatsApp, Instagram e Maps passam direto.
    if (pedido.method !== "GET" || new URL(pedido.url).origin !== self.location.origin) return;

    evento.respondWith(
        fetch(pedido)
            .then((resposta) => {
                const copia = resposta.clone();
                caches.open(VERSAO).then((cache) => cache.put(pedido, copia));
                return resposta;
            })
            .catch(async () => {
                const guardada = await caches.match(pedido);
                if (guardada) return guardada;
                // Sem internet e sem cópia: se era a página, mostra a página guardada
                if (pedido.mode === "navigate") return caches.match("index.html");
                return Response.error();
            })
    );
});
