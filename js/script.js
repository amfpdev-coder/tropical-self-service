/* =========================================================
    TROPICAL SELF-SERVICE 2.0
    Comportamentos da página

    As informações do restaurante ficam no js/dados.js.
    Este arquivo só lê de lá.

    O que este arquivo faz:
        0. Preenche a página com as informações do dados.js
        1. Mostra "Aberto agora" ou "Fechado" conforme o horário
        2. Muda o cabeçalho quando a página rola
        3. Abre e fecha o menu no celular
        4. Revela as seções conforme aparecem na tela
        5. Abre as fotos da galeria em tamanho grande
        6. Mostra os botões flutuantes de WhatsApp e Instagram
        7. Esconde imagens que ainda não existem
        8. Preenche o ano no rodapé
   ========================================================= */


/* ============ CONFIGURAÇÃO ============
    Os horários agora ficam no js/dados.js.
    Aqui fica só a lista dos dias na ordem que o JavaScript usa:
    getDay() devolve 0 para domingo, 1 para segunda ... 6 para sábado. */
const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

// Ordem do quadro de horários: segunda primeiro, domingo por último
const ORDEM_DA_SEMANA = [1, 2, 3, 4, 5, 6, 0];

// Se o dados.js tiver um erro de digitação, ele não carrega e DADOS
// não existe. Avisamos no console em vez de deixar o site travar.
const TEM_DADOS = typeof DADOS !== "undefined";

if (!TEM_DADOS) {
    console.error(
        "Tropical: não consegui ler o js/dados.js. " +
        "A mensagem de erro logo acima desta aponta a linha com problema " +
        "(normalmente uma vírgula ou aspas faltando)."
    );
}


/* ============ 0. PREENCHER COM OS DADOS ============
    No index.html, cada lugar que recebe uma informação tem uma etiqueta:
        data-dado="endereco.rua"     → escreve o texto
        data-preco="precos.almoco"   → escreve o preço formatado
        data-link="whatsapp"         → monta o endereço do link
        data-gerar="marmitas"        → monta um bloco inteiro */

// Recebe um caminho como "contato.telefone" e devolve o valor da ficha
function pegarDado(caminho) {
    const partes = caminho.split(".");
    let valor = DADOS;

    for (const parte of partes) {
        valor = valor[parte];
    }

    return valor;
}

// 20 → "R$ 20,00"
// formato "curto": sem centavos quando o valor é redondo → "R$ 20"
// formato "cartao": centavos em tamanho menor → "R$ 20<span>,00</span>"
function formatarPreco(valor, formato) {
    const [reais, centavos] = valor.toFixed(2).split(".");

    if (formato === "curto" && centavos === "00") {
        return `R$ ${reais}`;
    }
    if (formato === "cartao") {
        return `R$ ${reais}<span>,${centavos}</span>`;
    }
    return `R$ ${reais},${centavos}`;
}

// 11 → "11h"   ·   14.5 → "14h30"
function formatarHora(hora) {
    const horas = Math.floor(hora);
    const minutos = Math.round((hora - horas) * 60);

    if (minutos === 0) return `${horas}h`;
    return `${horas}h${String(minutos).padStart(2, "0")}`;
}

// Horário de um dia pelo número do JavaScript (0 = domingo)
function expedienteDoDia(numero) {
    return DADOS.horario.dias[DIAS[numero]];
}

// Monta o link do WhatsApp. encodeURIComponent converte a mensagem
// para o formato de link: espaço vira %20, á vira %C3%A1...
function linkWhatsapp(tipoDeMensagem) {
    const base = `https://wa.me/${DADOS.contato.whatsapp}`;
    const mensagem = DADOS.mensagens[tipoDeMensagem];

    if (!mensagem) return base;
    return `${base}?text=${encodeURIComponent(mensagem)}`;
}

// Textos: data-dado="contato.telefone"
function preencherTextos() {
    document.querySelectorAll("[data-dado]").forEach((elemento) => {
        const caminho = elemento.dataset.dado;
        elemento.textContent = pegarDado(caminho);
    });
}

// Preços: data-preco="precos.almoco" e, se quiser, data-formato="curto"
function preencherPrecos() {
    document.querySelectorAll("[data-preco]").forEach((elemento) => {
        const caminho = elemento.dataset.preco;
        const valor = pegarDado(caminho);

        if (typeof valor !== "number") {
            console.error(`Tropical: "${caminho}" precisa ser um número, sem aspas. Ex.: 20 ou 22.50`);
            return;
        }

        elemento.innerHTML = formatarPreco(valor, elemento.dataset.formato);
    });
}

// Links: data-link="whatsapp" (com data-mensagem opcional),
//        data-link="instagram", "telefone" ou "mapa"
function preencherLinks() {
    document.querySelectorAll("[data-link]").forEach((elemento) => {
        const tipo = elemento.dataset.link;

        if (tipo === "whatsapp") {
            elemento.href = linkWhatsapp(elemento.dataset.mensagem);
        } else if (tipo === "instagram") {
            elemento.href = `https://instagram.com/${DADOS.contato.instagram}`;
        } else if (tipo === "telefone") {
            // replace(/\D/g, "") tira tudo que não é número:
            // "(83) 99603-4823" vira "83996034823"
            elemento.href = `tel:+55${DADOS.contato.telefone.replace(/\D/g, "")}`;
        } else if (tipo === "mapa") {
            const e = DADOS.endereco;
            // Com coordenadas, o mapa abre no ponto exato. Sem elas, o Google
            // procura pelo endereço e pode errar o lote.
            const busca = e.coordenadas
                ? e.coordenadas.replace(/\s/g, "")
                : `${e.rua} - ${e.bairro}, ${e.cidade}, ${e.cep}`;
            elemento.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(busca)}`;
        }
    });
}

// Lista de tamanhos da seção Marmitaria
function montarMarmitas() {
    const alvo = document.querySelector('[data-gerar="marmitas"]');
    if (!alvo) return;

    alvo.innerHTML = DADOS.precos.marmitas.map((marmita) => {
        const selo = marmita.selo ? ` <em>${marmita.selo}</em>` : "";

        return `
            <div class="tamanho">
                <span class="tamanho__letra">${marmita.letra}</span>
                <div>
                    <h3>${marmita.nome}${selo}</h3>
                    <p>${marmita.descricao}</p>
                </div>
                <span class="tamanho__preco">${formatarPreco(marmita.preco, "curto")}</span>
            </div>
        `;
    }).join("");
}

// Cartões de marmita da seção Preços
function montarCartoesDeMarmita() {
    const alvo = document.querySelector('[data-gerar="cartoes-marmita"]');
    if (!alvo) return;

    alvo.innerHTML = DADOS.precos.marmitas.map((marmita) => `
        <article class="preco revelar">
            <p class="preco__rotulo">Marmita ${marmita.letra}</p>
            <p class="preco__valor">${formatarPreco(marmita.preco, "cartao")}</p>
            <p class="preco__unidade">${marmita.resumo}</p>
            <p class="preco__nota">${DADOS.precos.notaMarmitas}</p>
        </article>
    `).join("");
}

// Quadro de horários. Junta dias seguidos com o mesmo horário
// para escrever "Segunda a sábado" em vez de seis linhas iguais.
function montarHorarios() {
    const alvo = document.querySelector('[data-gerar="horarios"]');
    if (!alvo) return;

    const grupos = [];

    ORDEM_DA_SEMANA.forEach((numero) => {
        const expediente = expedienteDoDia(numero);
        const chave = expediente ? `${expediente.abre}-${expediente.fecha}` : "fechado";
        const ultimoGrupo = grupos[grupos.length - 1];

        if (ultimoGrupo && ultimoGrupo.chave === chave) {
            ultimoGrupo.dias.push(numero);
        } else {
            grupos.push({ chave, expediente, dias: [numero] });
        }
    });

    alvo.innerHTML = grupos.map((grupo) => {
        const primeiro = DIAS[grupo.dias[0]];
        const ultimo = DIAS[grupo.dias[grupo.dias.length - 1]];

        let rotulo = primeiro;
        if (grupo.dias.length === 2) rotulo = `${primeiro} e ${ultimo}`;
        if (grupo.dias.length > 2) rotulo = `${primeiro} a ${ultimo}`;
        rotulo = rotulo.charAt(0).toUpperCase() + rotulo.slice(1);

        const horario = grupo.expediente
            ? `<dd>${formatarHora(grupo.expediente.abre)} — ${formatarHora(grupo.expediente.fecha)}</dd>`
            : `<dd class="fechado">Fechado</dd>`;

        return `<div><dt>${rotulo}</dt>${horario}</div>`;
    }).join("");
}

// Horário resumido do topo, a partir do primeiro dia aberto da semana
function preencherResumoDoHorario() {
    const alvo = document.querySelector('[data-gerar="resumo-horas"]');
    if (!alvo) return;

    const primeiroAberto = ORDEM_DA_SEMANA.map(expedienteDoDia).find(Boolean);

    alvo.textContent = primeiroAberto
        ? `${formatarHora(primeiroAberto.abre)} às ${formatarHora(primeiroAberto.fecha)}`
        : "";
}

// Galeria de fotos. A primeira foto da lista ganha o destaque grande.
function montarGaleria() {
    const alvo = document.querySelector('[data-gerar="galeria"]');
    if (!alvo) return;

    alvo.innerHTML = DADOS.galeria.map((foto, posicao) => {
        const classeGrande = posicao === 0 ? " galeria__item--grande" : "";

        // Cada foto é um botão: assim abre com clique, toque ou teclado
        return `
            <button type="button" class="galeria__item${classeGrande} revelar" data-indice="${posicao}" aria-label="Ampliar foto: ${foto.legenda}">
                <img src="img/${foto.arquivo}" alt="${foto.descricao}" loading="lazy" data-opcional>
                <span class="galeria__legenda">${foto.legenda}</span>
                <span class="galeria__lupa" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5" /></svg>
                </span>
            </button>
        `;
    }).join("");
}

function preencherPagina() {
    preencherTextos();
    preencherPrecos();
    preencherLinks();
    montarMarmitas();
    montarCartoesDeMarmita();
    montarHorarios();
    preencherResumoDoHorario();
    montarGaleria();
}

// Roda antes da seção 4 para os cartões montados aqui
// também ganharem a animação de entrada
if (TEM_DADOS) preencherPagina();


/* ============ 1. ABERTO OU FECHADO ============ */
function atualizarStatus() {
    const selo = document.getElementById("selo-status");
    const texto = document.getElementById("status-texto");
    if (!selo || !texto) return;

    const agora = new Date();
    const diaHoje = agora.getDay();
    // Hora com fração: 14h30 vira 14.5, o que facilita a comparação
    const horaAgora = agora.getHours() + agora.getMinutes() / 60;
    const hoje = expedienteDoDia(diaHoje);

    const estaAberto = hoje && horaAgora >= hoje.abre && horaAgora < hoje.fecha;

    if (estaAberto) {
        selo.classList.add("aberto");
        selo.classList.remove("fechado");
        texto.textContent = `Aberto agora · até ${formatarHora(hoje.fecha)}`;
        return;
    }

    selo.classList.add("fechado");
    selo.classList.remove("aberto");

    // Se ainda vai abrir hoje, avisa a que horas
    if (hoje && horaAgora < hoje.abre) {
        texto.textContent = `Fechado · abre hoje às ${formatarHora(hoje.abre)}`;
        return;
    }

    // Senão, procura o próximo dia que tem expediente
    for (let i = 1; i <= 7; i++) {
        const proximoDia = (diaHoje + i) % 7;
        const expediente = expedienteDoDia(proximoDia);
        if (expediente) {
            const quando = i === 1 ? "amanhã" : DIAS[proximoDia];
            texto.textContent = `Fechado · abre ${quando} às ${formatarHora(expediente.abre)}`;
            return;
        }
    }

    texto.textContent = "Fechado no momento";
}


/* ============ 2. CABEÇALHO AO ROLAR ============ */
const cabecalho = document.getElementById("cabecalho");
const flutuantes = document.getElementById("flutuantes");

function aoRolar() {
    const y = window.scrollY;
    cabecalho.classList.toggle("rolou", y > 40);
    flutuantes.classList.toggle("visivel", y > 500);
}

// { passive: true } avisa o navegador que não vamos travar a rolagem.
// Sem isso, o scroll fica com aquela sensação de arrastado no celular.
window.addEventListener("scroll", aoRolar, { passive: true });


/* ============ 3. MENU NO CELULAR ============ */
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

function definirMenu(aberto) {
    nav.classList.toggle("aberto", aberto);
    // aria-expanded informa leitores de tela se o menu está aberto.
    // O CSS também usa esse atributo para virar os risquinhos em "X".
    menuBtn.setAttribute("aria-expanded", aberto);
    menuBtn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
}

menuBtn.addEventListener("click", () => {
    definirMenu(!nav.classList.contains("aberto"));
});

// Fecha o menu ao tocar em qualquer link dele
nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => definirMenu(false));
});

// Fecha ao tocar fora do menu (e fora do botão que abre)
document.addEventListener("click", (evento) => {
    if (!nav.classList.contains("aberto")) return;
    if (nav.contains(evento.target) || menuBtn.contains(evento.target)) return;
    definirMenu(false);
});

// Fecha com a tecla Esc
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && nav.classList.contains("aberto")) {
        definirMenu(false);
        menuBtn.focus();
    }
});


/* ============ 4. REVELAR AO ROLAR ============
    O IntersectionObserver avisa quando um elemento entra na tela.
   É bem mais leve que ficar medindo posições a cada rolagem. */
const observador = new IntersectionObserver(
    (entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            entrada.target.classList.add("visivel");
            // Já revelou: para de observar, não precisa mais gastar processamento
            observador.unobserve(entrada.target);
        });
    },
    {
        threshold: 0.12,          // dispara quando 12% do elemento aparece
        rootMargin: "0px 0px -60px 0px", // começa um pouco antes de chegar na borda
    }
);

document.querySelectorAll(".revelar").forEach((elemento, indice) => {
    // Pequeno atraso em cascata: os cartões aparecem em sequência, não todos juntos
    elemento.style.transitionDelay = `${(indice % 3) * 90}ms`;
    observador.observe(elemento);
});


/* ============ 5. FOTO AMPLIADA ============
    Clicar numa foto da galeria abre ela inteira, sem corte.
    Fecha no X, clicando no fundo escuro ou com Esc.
    Setas, teclas ← → e deslizar o dedo passam as fotos. */
const ampliada = document.getElementById("ampliada");

if (ampliada && TEM_DADOS) {
    const imagemAmpliada = ampliada.querySelector(".ampliada__img");
    const legendaAmpliada = ampliada.querySelector(".ampliada__legenda");
    const botaoFechar = ampliada.querySelector(".ampliada__fechar");
    let fotoAtual = 0;
    let focoAntesDeAbrir = null;

    const mostrarFoto = (indice) => {
        const total = DADOS.galeria.length;
        // Soma o total antes do % para a lista "dar a volta":
        // antes da primeira vem a última, depois da última vem a primeira
        fotoAtual = (indice + total) % total;

        const foto = DADOS.galeria[fotoAtual];
        imagemAmpliada.src = `img/${foto.arquivo}`;
        imagemAmpliada.alt = foto.descricao;
        legendaAmpliada.textContent = `${foto.legenda} · ${fotoAtual + 1} de ${total}`;
    };

    const abrirFoto = (indice) => {
        focoAntesDeAbrir = document.activeElement;
        mostrarFoto(indice);
        ampliada.hidden = false;
        document.body.classList.add("sem-rolagem");
        botaoFechar.focus();
    };

    const fecharFoto = () => {
        ampliada.hidden = true;
        document.body.classList.remove("sem-rolagem");
        // Devolve o foco para a foto que foi clicada (importante para quem usa teclado)
        if (focoAntesDeAbrir) focoAntesDeAbrir.focus();
    };

    document.querySelectorAll(".galeria__item").forEach((item) => {
        item.addEventListener("click", () => abrirFoto(Number(item.dataset.indice)));
    });

    botaoFechar.addEventListener("click", fecharFoto);
    ampliada.querySelector(".ampliada__seta--anterior").addEventListener("click", () => mostrarFoto(fotoAtual - 1));
    ampliada.querySelector(".ampliada__seta--proxima").addEventListener("click", () => mostrarFoto(fotoAtual + 1));

    // Clique no fundo escuro, fora da foto e dos botões, fecha
    ampliada.addEventListener("click", (evento) => {
        if (evento.target === ampliada) fecharFoto();
    });

    document.addEventListener("keydown", (evento) => {
        if (ampliada.hidden) return;
        if (evento.key === "Escape") fecharFoto();
        if (evento.key === "ArrowLeft") mostrarFoto(fotoAtual - 1);
        if (evento.key === "ArrowRight") mostrarFoto(fotoAtual + 1);
    });

    // Deslizar o dedo no celular: mais de 50px para o lado troca a foto
    let toqueInicioX = 0;
    ampliada.addEventListener("touchstart", (evento) => {
        toqueInicioX = evento.touches[0].clientX;
    }, { passive: true });
    ampliada.addEventListener("touchend", (evento) => {
        const distancia = evento.changedTouches[0].clientX - toqueInicioX;
        if (distancia > 50) mostrarFoto(fotoAtual - 1);
        if (distancia < -50) mostrarFoto(fotoAtual + 1);
    });
}


/* ============ 6. IMAGENS QUE AINDA NÃO EXISTEM ============
    Enquanto a logo e a capa não estiverem na pasta img/, some com o
   ícone de imagem quebrada em vez de deixar a página feia. */
document.querySelectorAll("img[data-opcional]").forEach((img) => {
    img.addEventListener("error", () => {
        img.style.display = "none";
        const moldura = img.closest(".moldura");
        if (moldura) moldura.classList.add("sem-imagem");
    });
});


/* ============ 7. ANO NO RODAPÉ ============ */
const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();


/* ============ INICIALIZAÇÃO ============ */
aoRolar();

// App instalável: registra o sw.js, que guarda uma cópia do site para
// abrir mesmo sem internet. Só funciona em https (site publicado) ou em
// localhost. Pelo IP do Wi-Fi no celular, o navegador simplesmente não registra.
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
    });
}

if (TEM_DADOS) {
    atualizarStatus();
    // Reconfere o horário a cada minuto, para o selo virar sozinho
    setInterval(atualizarStatus, 60000);
}
