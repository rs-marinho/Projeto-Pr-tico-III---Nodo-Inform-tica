# Nodo Informática — Projeto Prático III

Site institucional e catálogo de uma loja de informática e infraestrutura de rede, feito com **HTML5, CSS3, JavaScript (ES2015+) e Bootstrap 5.3**, de acordo com a *Apostila de Desenvolvimento Web I* (Faculdade Senac AM – FATESE).

> Produtos, preços e contatos são fictícios.

## Como executar

Não precisa de build nem de dependências.

1. Abra a pasta no VS Code.
2. Clique com o botão direito em `index.html` e escolha **Open with Live Server** (extensão da Unidade 1.4).

Abrir o `index.html` com dois cliques também funciona. O único recurso que muda é o botão **Copiar**: sem servidor (`file://`), o navegador bloqueia a área de transferência, então o texto fica selecionado para você usar `Ctrl+C`.

## Estrutura

```
├── index.html            # Estrutura e conteúdo (HTML5 semântico)
├── assets/
│   ├── css/style.css     # Apresentação: tokens, tema escuro e personalização do Bootstrap
│   ├── js/dados.js       # Dados: linhas, produtos e contatos
│   ├── js/icones.js      # Ícones SVG dos produtos
│   ├── js/app.js         # Comportamento: navegação, catálogo, pedido e formulário
│   └── img/favicon.svg
└── README.md
```

Cada camada tem uma responsabilidade (Unidade 1.2): o HTML guarda a marcação, inclusive a dos itens criados dinamicamente (`<template>`); o CSS cuida da aparência; o JavaScript só troca atributos e classes. Para mudar um produto ou um preço, basta editar `dados.js`.

## Bootstrap

Entra só o **CSS** do Bootstrap 5.3.3, via CDN com verificação de integridade (SRI). Ele fornece o grid (`row`, `col-*`, `row-cols-*`), os formulários (`form-control`, `form-select`, `is-invalid`, `invalid-feedback`), os botões, os cards, o badge, o toast e os utilitários (`visually-hidden`, `visually-hidden-focusable`).

O componente visual é adaptado à marca pelas variáveis do próprio framework (`--bs-body-bg`, `--bs-btn-bg`, `--bs-card-bg`…), e não por regras sobrescritas uma a uma. Assim o tema escuro também vale para os componentes do Bootstrap.

O `bootstrap.bundle.js` **não** é carregado, por desempenho: o único componente que dependeria dele seria o toast, que aqui é exibido com poucas linhas próprias. As perguntas frequentes usam `<details>` nativo, que funciona sem JavaScript e sem ARIA extra (Unidade 5.3: *"No ARIA is better than bad ARIA"*).

## O que foi melhorado

### Acessibilidade (Unidade 5)
- `lang="pt-BR"` e `charset="UTF-8"` válidos (antes ausente e inválido).
- Link **Pular para o conteúdo**; títulos em hierarquia correta (`h1` → `h2` → `h3` → `h4`), inclusive nas faixas da página, que antes não tinham título.
- Navegação com `<nav>` e links reais com `aria-current="page"`. Antes havia `role="tablist"` sobre `<nav>`, o que apagava o landmark.
- Ao trocar de seção, o foco vai para o título dela e o `<title>` da aba muda, como numa troca de página.
- **O foco não se perde mais**: ao usar os filtros ou os botões + e − do pedido, ele volta ao mesmo controle. Antes, o HTML era recriado e o foco caía no início da página.
- Região `aria-live` anuncia produto adicionado, quantidades, cópia e erros. O aviso visual (toast) equivale a ela.
- Os botões "Adicionar ao pedido" dizem qual produto é (`Adicionar ao pedido: Switch…`), e o nome acessível começa pelo texto visível (WCAG 2.5.3).
- Formulário: `required`, `autocomplete`, `inputmode`, erros ligados ao campo por `aria-describedby`, `aria-invalid` sincronizado com `is-invalid` e foco no primeiro campo com erro.
- Foco sempre visível, alvos de toque de 40–44 px, contraste AA nos dois temas e animações só para quem não pediu `prefers-reduced-motion`.

### Usabilidade (Unidade 5.4 e 5.5)
- A busca ignora acentos: "protecao" encontra "proteção". Também mostra quantos produtos encontrou e o que fazer quando não acha nenhum.
- O pedido fica salvo no navegador (`localStorage`) e sincronizado entre abas.
- **Solicitar pedido** leva ao contato com a lista já na mensagem e o cursor no campo Nome.
- A mensagem pronta tem botões para enviar pelo WhatsApp ou por e-mail, com o texto preenchido. Os canais de contato ganharam links de ligar e de escrever.
- Campo opcional de telefone com validação de DDD e estilos de impressão para o pedido.

### Desempenho (Unidade 6.4 e 6.7)
- O catálogo é montado **uma vez** com `DocumentFragment`; filtrar só liga e desliga `hidden`, sem recriar HTML a cada tecla.
- Busca com *debounce* de 200 ms.
- Scripts com `defer`, `preconnect` para as CDNs, só os pesos de fonte usados e `font-display: swap`.
- Delegação de eventos: um único ouvinte de clique para a página toda.
- `Intl.NumberFormat` criado uma vez e produtos indexados em `Map`.

### Segurança (Unidade 11.4)
- Os dados entram no DOM por `textContent`, nunca por `innerHTML`. A única exceção são os ícones SVG estáticos de `icones.js`.
- `rel="noopener"` nos links que abrem nova aba e SRI no Bootstrap.

### Progressive enhancement (Unidade 1.2)
Sem JavaScript, todas as seções aparecem em sequência e os links do menu rolam até elas. A busca e os filtros só aparecem quando podem funcionar.

## Testes realizados
- Interação automatizada no Microsoft Edge (headless), com 33 verificações: navegação e foco, filtros, busca, pedido (total, foco, persistência), validação do formulário, link de pular conteúdo, ausência de rolagem horizontal em 375 px e console sem erros.
- Inspeção visual no desktop (tema claro) e no celular (tema escuro).

Sugestão para complementar: rodar o Lighthouse e o axe DevTools, navegar só com o teclado e testar com o NVDA (Unidade 5.6).
