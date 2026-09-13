/* =========================================================
    TROPICAL SELF-SERVICE 2.0
    Informações do restaurante

    Este é o arquivo para editar quando alguma informação mudar.
    Mudou aqui, muda em todos os lugares do site.

    Regras para não quebrar:
        - Texto fica entre aspas: "assim"
        - Preço e hora ficam SEM aspas, com ponto: 20 ou 22.50
        - Toda linha termina com vírgula
        - Depois de salvar, recarregue com Ctrl + F5

    Se algo sumir da página: F12, aba Console. A mensagem
    em vermelho aponta a linha com erro.

    Fica fora deste arquivo (edite direto no index.html):
        - Textos de apresentação: títulos, descrição do bufê, faixa corrida
        - Título e prévia do WhatsApp, no <head>. A prévia cita o
        preço do almoço: se ele mudar, atualize lá também.
   ========================================================= */

const DADOS = {
    contato: {
        whatsapp: "5583996034823",
        telefone: "(83) 99603-4823",
        instagram: "tropicalselfservice2.0",
    },

    endereco: {
        rua: "Rua Hermelinda Henriques de Araújo, 253B",
        bairro: "Bancários",
        cidade: "João Pessoa - PB",
        cep: "58051-020",

        // Localização exata para o botão "Abrir no Google Maps".
        // Sem isso, o Google procura pelo endereço e arredonda o 253B
        // para o 253 antigo.
        // Como pegar: no Google Maps pelo computador, clique com o botão
        // DIREITO no ponto exato do restaurante. No topo do menu aparecem
        // dois números, tipo -7.14512, -34.84637. Clique neles para copiar
        // e cole aqui entre as aspas.
        coordenadas: "-7.147019726594252, -34.844478639228555",
    },

    precos: {
        // Almoço no local. 20 aparece como R$ 20,00 · 22.50 como R$ 22,50
        almoco: 20,

        // Frase embaixo de cada cartão de marmita, na seção Preços
        notaMarmitas: "Retirada no local diariamente ou delivery apenas Segundas, Terças, Quintas e Sábados com o motoboy.",

        // Cada bloco entre { } é um tamanho de marmita.
        // Para criar outro: copie um bloco inteiro e cole embaixo.
        // Para remover: apague o bloco inteiro.
        marmitas: [
            {
                letra: "P",
                nome: "Pequena",
                preco: 15,
                descricao: "Uma porção de proteína",   // seção Marmitaria
                resumo: "uma porção de proteína",      // cartão da seção Preços
                selo: "",                              // "" = sem selo
            },
            {
                letra: "M",
                nome: "Média",
                preco: 20,
                descricao: "Duas porções de proteína",
                resumo: "duas porções de proteína",
                selo: "",
            },
            {
                letra: "G",
                nome: "Grande",
                preco: 28,
                descricao: "Três porções e serve duas pessoas",
                resumo: "serve duas pessoas",
                selo: "melhor custo",
            },
        ],
    },

    entrega: {
        diasMotoboy: "Segundas, Terças, Quintas e Sábados",
        taxa: 5,
    },

    pagamento: "Aceitamos dinheiro, Pix, débito e crédito",

    horario: {
        // Texto curto do topo da página
        resumoDias: "Seg à Sáb",

        // Horário de cada dia. Use null nos dias em que não abre.
        // Meia hora vira .5 → 14.5 aparece como 14h30
        // Mudando aqui, atualizam juntos: o selo "Aberto agora",
        // o quadro de horários e o horário do topo.
        dias: {
            segunda: { abre: 11, fecha: 15 },
            terça:   { abre: 11, fecha: 15 },
            quarta:  { abre: 11, fecha: 15 },
            quinta:  { abre: 11, fecha: 15 },
            sexta:   { abre: 11, fecha: 15 },
            sábado:  { abre: 11, fecha: 15 },
            domingo: null,
        },
    },

    // Fotos da seção "Fotos". Os arquivos ficam na pasta img/.
    // A PRIMEIRA foto da lista aparece grande. Para mudar a ordem,
    // troque as linhas de lugar. Para tirar uma foto, apague a linha.
    //   legenda:   texto curto que aparece em cima da foto
    //   descricao: lida por quem usa leitor de tela e pelo Google
    galeria: [
        { arquivo: "salao.jpg",            legenda: "Nosso salão",        descricao: "Salão do restaurante com clientes almoçando nas mesas amarelas" },
        { arquivo: "prato-montado.jpg",       legenda: "Prato montado",      descricao: "Prato montado com a comida do bufê" },
        { arquivo: "placa-tropical.jpg",      legenda: "Nossas informações",           descricao: "Placa com seta indicando o restaurante e o delivery pelo WhatsApp" },
        { arquivo: "bufe-saladas.jpg",        legenda: "Saladas frescas",    descricao: "Bufê de saladas com legumes e verduras frescas" },
        { arquivo: "bufe-pratos-quentes.jpg", legenda: "Pratos quentes",     descricao: "Pratos quentes do bufê: arroz, feijão, carnes e bolinhos fritos" },
    ],

    // Texto que já vem digitado quando a pessoa clica num botão do WhatsApp.
    // Escreva normalmente, com acento e espaço: a conversão é automática.
    // \n quebra a linha dentro da mensagem.
    mensagens: {
        // Botões de pedir marmita: "Pedir no WhatsApp" e "Encomendar marmita"
        pedido: "Olá! Vim pelo site e quero uma marmita.\nTamanho (P, M ou G):\nRetirada ou entrega:",

        // Botões de conversa: "Entre em contato", botão verde fixo e rodapé
        contato: "Olá! Vim pelo site do Tropical.",
    },
};
