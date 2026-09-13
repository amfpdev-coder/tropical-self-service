# Tropical Self-Service

Site do Restaurante Tropical Self-Service, feito para ser o link da bio
do Instagram. Funciona no celular e no computador e pode ser instalado na
tela inicial do celular como um app.

---

## O que o site faz

- Mostra se o restaurante está **aberto ou fechado agora**, calculado a partir
  do horário de funcionamento
- Apresenta o bufê, a marmitaria, os preços, o endereço e o horário
- **Pedido pelo WhatsApp** com a mensagem já digitada, além de botões para
  ligar, abrir o Instagram e traçar a rota no Google Maps
- **Galeria de fotos** com legendas e visualização ampliada: setas, teclado
  e deslizar o dedo no celular
- **Barra de ações fixa** no celular e botões flutuantes no computador
- Layout **responsivo** (celular, tablet e computador), com animações de
  entrada ao rolar a página
- **App instalável (PWA):** ícone na tela inicial, abertura em tela cheia e
  funcionamento sem internet
- Todas as informações que mudam ficam em **um único arquivo**, `js/dados.js`

---

## Tecnologias

- HTML, CSS e JavaScript puros, sem frameworks e sem etapa de compilação
- Python, apenas para o servidor de testes local
- Fontes Cormorant Garamond e Outfit, via Google Fonts

---

## Estrutura

```text
├── index.html              Estrutura da página e textos de apresentação
├── css/
│   └── style.css           Aparência: cores, fontes, layout e animações
├── js/
│   ├── dados.js            Informações do restaurante (é aqui que se edita)
│   └── script.js           Preenche a página com os dados e controla as interações
├── img/                    Logo e fotos
│   └── icones/             Ícones do app e da aba do navegador
├── manifest.webmanifest    Configuração do app instalável (nome, cores, ícones)
├── sw.js                   Service worker: funcionamento sem internet
├── serve.py                Servidor local para testar no computador e no celular
├── .vscode/settings.json   Padrão de formatação do projeto (4 espaços)
└── .gitignore              Arquivos que o Git não deve enviar
```

---

## Como baixar

**Com Git:**

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
```

**Sem Git:** na página do repositório no GitHub, clique em
**Code → Download ZIP** e extraia a pasta.

> Troque `SEU-USUARIO/SEU-REPOSITORIO` pelo endereço real do repositório.

---

## Como rodar

**Requisito:** [Python 3](https://www.python.org/downloads/). No Windows,
marque a opção *Add Python to PATH* durante a instalação.

No terminal, dentro da pasta do projeto:

```bash
python serve.py
```

Aparecem dois endereços:

| Onde abrir | Endereço |
| --- | --- |
| No computador | `http://localhost:8000` |
| No celular | `http://192.168.x.x:8000`, o número exato aparece no terminal |

O celular precisa estar no **mesmo Wi-Fi** do computador. Para parar o
servidor, aperte `Ctrl + C`.

**Alternativa:** a extensão *Live Server* do VS Code também funciona.

> O servidor desativa o cache do navegador de propósito: qualquer mudança
> nos arquivos aparece ao recarregar a página.

---

## Como atualizar as informações

Preços, horários, contatos, endereço, tamanhos de marmita, fotos da galeria e
mensagens do WhatsApp ficam em **`js/dados.js`**. Mudou lá, muda em todos os
lugares do site.

1. Abra o `js/dados.js`
2. Altere o valor desejado
3. Salve e recarregue a página com `Ctrl + F5`

**Regras do arquivo:**

- Texto fica entre aspas: `"assim"`
- Preço e hora ficam sem aspas e com ponto: `20` ou `22.50`
- Toda linha termina com vírgula

**Se alguma informação sumir da página:** aperte `F12` e abra a aba
**Console**. A mensagem em vermelho aponta a linha com erro, quase sempre
uma vírgula ou aspas faltando.

**Fotos da galeria:** coloque o arquivo na pasta `img/` e adicione uma linha
em `galeria`, no `dados.js`. A primeira foto da lista aparece em destaque.
Use nomes em minúsculas, sem acento e sem espaço.

**O que fica fora do `dados.js`** e é editado direto no `index.html`:

- Textos de apresentação: títulos, descrição do bufê e faixa corrida
- Título e prévia de compartilhamento (tags `og:` no `<head>`). O WhatsApp
  e o Google leem o HTML sem executar o JavaScript, por isso esses textos
  precisam estar escritos ali.

**Cores:** ficam no topo do `css/style.css`, em `:root`.

---

## App instalável (PWA)

O site pode ser instalado como app a partir do navegador. A instalação só
fica disponível em endereços com **https** (site publicado) ou em
`localhost`.

| Aparelho | Como instalar |
| --- | --- |
| Android (Chrome) | Menu ⋮ → **Instalar app** |
| iPhone (Safari) | Botão de compartilhar → **Adicionar à Tela de Início** |
| Computador (Chrome ou Edge) | Ícone de instalar na barra de endereço |

O `sw.js` usa a estratégia **rede primeiro**: com internet, o app sempre
carrega a versão mais recente, e sem internet usa a última cópia guardada.
Assim, uma informação atualizada no `dados.js` chega a quem já instalou.

> Ao mudar a lista `ARQUIVOS_BASICOS` dentro do `sw.js`, aumente também o
> número em `VERSAO` (por exemplo, de `tropical-v1` para `tropical-v2`).

---

## Como publicar

O código fica no **GitHub** e o site é publicado na **Netlify**, conectada
ao repositório. Assim, toda mudança enviada ao GitHub vai para o ar
automaticamente, com `https` e disponível 24 horas por dia.

**Primeira publicação:**

1. Envie o projeto para um repositório no GitHub
2. Na [Netlify](https://app.netlify.com), clique em
   **Add new site → Import an existing project → GitHub**
3. Escolha o repositório do projeto
4. Deixe o **Build command** vazio e coloque `.` em **Publish directory**:
   o site não precisa de compilação
5. Clique em **Deploy**
6. Em **Site configuration → Change site name**, escolha o endereço, por
   exemplo `tropical-self-service.netlify.app`

**Para atualizar o site**, envie as mudanças para o GitHub:

```bash
git add .
git commit -m "Descreva o que mudou"
git push
```

A Netlify percebe o envio e publica a nova versão sozinha, em menos de um
minuto.

**Alternativa:** o site também funciona no **GitHub Pages**. No repositório,
abra **Settings → Pages**, escolha a branch **main** e a pasta **/ (root)**.

**Depois da primeira publicação**, preencha no `<head>` do `index.html`:

- `og:url` com o endereço do site
- `og:image` com o endereço **completo** da imagem de prévia, começando com
  `https://` (tamanho recomendado: 1200 × 630)

É isso que faz a foto e o nome aparecerem quando o link é compartilhado no
WhatsApp.
