/* =====================================================================
   Nodo Informática — comportamento da interface
   Depende de dados.js (NODO.LINHAS, NODO.PRODUTOS, NODO.CONTATO) e de
   icones.js (NODO.icone), carregados antes com o atributo defer.

   Princípios aplicados (Apostila de Desenvolvimento Web I):
   - Separação de responsabilidades: o JS alterna atributos e classes;
     a aparência fica no CSS e a marcação nos <template> do HTML.
   - Segurança: dados entram no DOM por textContent, nunca innerHTML.
   - Acessibilidade: foco preservado após cada ação, anúncios em região
     aria-live e estado visual sempre sincronizado com o semântico.
   - Desempenho: o catálogo é montado uma única vez; filtrar apenas
     liga/desliga o atributo hidden, e a busca usa debounce.
   ===================================================================== */
(() => {
  'use strict';

  const { LINHAS, PRODUTOS, CONTATO, icone } = window.NODO;

  /* ---------- Utilitários ---------- */
  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor));

  const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const brl = (valor) => formatoMoeda.format(valor);
  // Remove acentos: buscar "protecao" encontra "proteção".
  const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const rotuloItens = (n) => (n === 1 ? '1 item' : `${n} itens`);
  const rolagem = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
  const clonar = (seletorTemplate) => $(seletorTemplate).content.firstElementChild.cloneNode(true);
  const produtos = new Map(PRODUTOS.map((p) => [p.id, p]));

  function debounce(funcao, espera) {
    let temporizador;
    return (...args) => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => funcao(...args), espera);
    };
  }

  /* ---------- Anúncios (leitor de tela + aviso visual) ---------- */
  const regiaoAnuncio = $('#anuncio');
  const toast = $('#toast');
  const toastTexto = $('#toast-texto');
  let temporizadorToast;

  function anunciar(mensagem, { visual = true } = {}) {
    // Esvaziar antes garante que mensagens repetidas também sejam lidas.
    regiaoAnuncio.textContent = '';
    setTimeout(() => { regiaoAnuncio.textContent = mensagem; }, 100);

    if (!visual) return;
    toastTexto.textContent = mensagem;
    toast.classList.add('show');
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* ---------- Painel de portas decorativo do hero ---------- */
  function montarPortas() {
    const acesas = { 0: 'on', 1: 'on', 2: 'ok', 4: 'on', 5: 'ok', 7: 'on', 8: 'on', 11: 'ok', 13: 'ok', 14: 'on', 16: 'on', 19: 'ok', 20: 'on', 22: 'on' };
    $$('.portas__linha').forEach((linha, l) => {
      const fragmento = document.createDocumentFragment();
      for (let i = 0; i < 12; i++) {
        const porta = document.createElement('span');
        porta.className = 'porta';
        const estado = acesas[l * 12 + i];
        if (estado) porta.classList.add(`porta--${estado}`);
        fragmento.append(porta);
      }
      linha.append(fragmento);
    });
  }

  /* ---------- Navegação entre seções (rotas por #hash) ----------
     Os links são âncoras reais: sem JavaScript, todas as seções ficam
     visíveis e o link rola até elas (progressive enhancement). */
  const paineis = $$('[data-painel]');
  const linksSecao = $$('[data-secao]');
  const tituloBase = document.title;
  let painelAtual = null;
  let focoPendente = null;

  function exibirPainel(painel) {
    painelAtual = painel;
    paineis.forEach((p) => { p.hidden = p !== painel; });
    linksSecao.forEach((link) => {
      if (link.hash === `#${painel.id}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = painel === paineis[0] ? tituloBase : `${painel.dataset.titulo} | ${tituloBase}`;
  }

  function rotear({ mover = true } = {}) {
    const id = decodeURIComponent(location.hash.slice(1));
    const alvo = id ? document.getElementById(id) : null;
    const painel = alvo ? alvo.closest('[data-painel]') : null;

    // Alvo fora das seções (ex.: "Pular para o conteúdo"): mantém a seção atual.
    if (alvo && !painel) {
      if (!painelAtual) exibirPainel(paineis[0]);
      if (mover) alvo.focus();
      return;
    }

    const destino = painel || paineis[0];
    exibirPainel(destino);
    const subAlvo = alvo && alvo !== destino ? alvo : null;

    if (subAlvo) subAlvo.scrollIntoView({ behavior: mover ? rolagem() : 'auto', block: 'start' });
    else if (mover) window.scrollTo({ top: 0, behavior: 'instant' });
    else {
      // Primeira carga em #secao: desfaz a rolagem nativa até a âncora, mantendo o topo visível.
      window.addEventListener('load', () => window.scrollTo({ top: 0, behavior: 'instant' }), { once: true });
    }
    if (!mover) return;

    // Como em uma troca de página, o foco vai para o título da nova seção.
    const foco = focoPendente || $('[data-foco]', subAlvo || destino) || destino;
    focoPendente = null;
    foco.focus({ preventScroll: Boolean(subAlvo) || foco.matches('[data-foco]') });
  }

  function irPara(hash) {
    if (location.hash === hash) rotear();
    else location.hash = hash; // dispara hashchange → rotear()
  }

  /* ---------- Catálogo ---------- */
  const estado = { linha: 'todas', busca: '' };

  function criarCartao(produto) {
    const item = clonar('#tpl-produto');
    item.dataset.id = produto.id;
    item.dataset.busca = normalizar(`${produto.nome} ${produto.desc} ${produto.sku}`);

    $('.produto__icone', item).innerHTML = icone(produto.icone); // SVG estático de icones.js
    $('.sku', item).textContent = produto.sku;
    $('.produto__nome', item).textContent = produto.nome;
    $('.produto__desc', item).textContent = produto.desc;
    $('.preco__valor', item).textContent = brl(produto.preco);
    $('.preco__parcela', item).textContent = `ou 10x de ${brl(produto.preco / 10)}`;

    // O nome acessível começa pelo texto visível (WCAG 2.5.3) e diz qual produto é.
    $('.produto__nome-oculto', item).textContent = `: ${produto.nome}`;
    $('[data-adicionar]', item).dataset.adicionar = produto.id;
    return item;
  }

  function montarCatalogo() {
    const fragmento = document.createDocumentFragment();
    LINHAS.forEach((linha) => {
      const bloco = clonar('#tpl-linha');
      const tituloId = `linha-${linha.id}`;
      bloco.dataset.linha = linha.id;
      bloco.setAttribute('aria-labelledby', tituloId);

      const titulo = $('.linha__titulo', bloco);
      titulo.id = tituloId;
      titulo.textContent = linha.nome;
      $('.linha__nota', bloco).textContent = linha.nota;

      const grade = $('.linha__grade', bloco);
      PRODUTOS.filter((p) => p.linha === linha.id).forEach((p) => grade.append(criarCartao(p)));
      fragmento.append(bloco);
    });
    $('#catalogo').append(fragmento); // uma única inserção no DOM = um único reflow
  }

  function montarFiltros() {
    const filtros = $('#filtros');
    [{ id: 'todas', nome: 'Todas as linhas' }, ...LINHAS].forEach((linha) => {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'filtro';
      botao.dataset.linha = linha.id;
      botao.textContent = linha.nome;
      botao.setAttribute('aria-pressed', String(linha.id === estado.linha));
      filtros.append(botao);
    });
  }

  function filtrar() {
    const termo = normalizar(estado.busca.trim());
    let total = 0;

    $$('#catalogo .linha').forEach((bloco) => {
      const linhaAtiva = estado.linha === 'todas' || bloco.dataset.linha === estado.linha;
      let visiveis = 0;
      $$('[data-id]', bloco).forEach((item) => {
        const mostra = linhaAtiva && (!termo || item.dataset.busca.includes(termo));
        item.hidden = !mostra;
        if (mostra) visiveis++;
      });
      bloco.hidden = visiveis === 0;
      total += visiveis;
    });

    $('#catalogo-vazio').hidden = total > 0;
    $('#contagem').textContent = total === 1 ? '1 produto encontrado' : `${total} produtos encontrados`;
  }

  function selecionarLinha(idLinha) {
    estado.linha = idLinha;
    // Atualiza só o atributo: os botões não são recriados e o foco permanece onde estava.
    $$('#filtros .filtro').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.linha === idLinha)));
    filtrar();
  }

  /* ---------- Pedido (persistido no navegador) ---------- */
  const CHAVE_PEDIDO = 'nodo:pedido:v1';
  const QTD_MAXIMA = 99;
  let pedido = lerPedido();

  function lerPedido() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE_PEDIDO)) || {};
      return Object.fromEntries(
        Object.entries(salvo).filter(([id, qtd]) => produtos.has(id) && Number.isInteger(qtd) && qtd > 0)
      );
    } catch (erro) {
      return {};
    }
  }

  function gravarPedido() {
    try {
      localStorage.setItem(CHAVE_PEDIDO, JSON.stringify(pedido));
    } catch (erro) {
      // Armazenamento indisponível (modo privado, bloqueio): o pedido vale só nesta visita.
    }
  }

  function resumoPedido() {
    return Object.entries(pedido).reduce((soma, [id, qtd]) => {
      soma.itens += qtd;
      soma.total += produtos.get(id).preco * qtd;
      return soma;
    }, { itens: 0, total: 0 });
  }

  function criarItemPedido(id, qtd) {
    const produto = produtos.get(id);
    const item = clonar('#tpl-item-pedido');
    $('.item-pedido__nome strong', item).textContent = produto.nome;
    $('.item-pedido__nome .sku', item).textContent = produto.sku;
    $('.qtd', item).setAttribute('aria-label', `Quantidade de ${produto.nome}`);
    $('.qtd__valor', item).textContent = qtd;
    $('.item-pedido__subtotal', item).textContent = brl(produto.preco * qtd);

    const menos = $('[data-diminuir]', item);
    menos.dataset.diminuir = id;
    menos.setAttribute('aria-label', `Remover uma unidade de ${produto.nome}`);

    const mais = $('[data-aumentar]', item);
    mais.dataset.aumentar = id;
    mais.setAttribute('aria-label', `Adicionar uma unidade de ${produto.nome}`);
    mais.disabled = qtd >= QTD_MAXIMA;
    return item;
  }

  function renderizarPedido() {
    const entradas = Object.entries(pedido);
    const { itens, total } = resumoPedido();
    const vazio = entradas.length === 0;

    $('#contador-pedido').textContent = itens;
    $('#link-pedido').setAttribute('aria-label', `Meu pedido: ${rotuloItens(itens)}`);
    $('#pedido-dica').textContent = vazio ? 'Adicione produtos para montar a solicitação.' : `${rotuloItens(itens)} no pedido.`;

    const fragmento = document.createDocumentFragment();
    entradas.forEach(([id, qtd]) => fragmento.append(criarItemPedido(id, qtd)));
    const lista = $('#pedido-lista');
    lista.replaceChildren(fragmento);
    lista.hidden = vazio;

    $('#pedido-total').hidden = vazio;
    $('#pedido-total-valor').textContent = brl(total);
    $('#btn-solicitar').disabled = vazio;
    $('#btn-limpar').disabled = vazio;
    gravarPedido();
  }

  function alterarQuantidade(id, delta) {
    const nova = Math.min((pedido[id] || 0) + delta, QTD_MAXIMA);
    if (nova > 0) pedido[id] = nova;
    else delete pedido[id];
    renderizarPedido();
  }

  function adicionarAoPedido(id) {
    alterarQuantidade(id, +1);
    anunciar(`${produtos.get(id).nome} adicionado. Pedido com ${rotuloItens(resumoPedido().itens)}.`);
  }

  function ajustarQuantidade(id, delta) {
    const { nome } = produtos.get(id);
    alterarQuantidade(id, delta);

    // A lista foi recriada: devolve o foco ao mesmo botão (ou ao título, se o item saiu).
    const qtd = pedido[id] || 0;
    const botao = $(delta > 0 ? `[data-aumentar="${id}"]` : `[data-diminuir="${id}"]`);
    (botao && !botao.disabled ? botao : $('#pedido-titulo')).focus();

    anunciar(qtd ? `${nome}: ${qtd} ${qtd === 1 ? 'unidade' : 'unidades'}.` : `${nome} removido do pedido.`, { visual: false });
  }

  function limparPedido() {
    pedido = {};
    renderizarPedido();
    $('#pedido-titulo').focus();
    anunciar('Pedido esvaziado.');
  }

  function textoPedido() {
    const linhas = ['Pedido pelo site da Nodo Informática:', ''];
    Object.entries(pedido).forEach(([id, qtd]) => {
      const p = produtos.get(id);
      linhas.push(`${qtd}x ${p.nome} (${p.sku}) - ${brl(p.preco * qtd)}`);
    });
    linhas.push('', `Total: ${brl(resumoPedido().total)}`);
    return linhas.join('\n');
  }

  function solicitarPedido() {
    $('#f-assunto').value = 'Pedido de compra';
    const mensagem = $('#f-mensagem');
    mensagem.value = textoPedido();
    if (mensagem.classList.contains('is-invalid')) validarCampo(mensagem);

    focoPendente = $('#f-nome');
    irPara('#contato');
    anunciar('A lista do pedido foi colocada na mensagem. Agora informe seu nome e e-mail.', { visual: false });
  }

  /* ---------- Copiar para a área de transferência ---------- */
  async function copiar(origem) {
    const texto = origem.textContent.trim();
    try {
      await navigator.clipboard.writeText(texto);
      anunciar('Copiado para a área de transferência.');
    } catch (erro) {
      // Sem permissão (ex.: página aberta via file://): seleciona o texto para Ctrl+C.
      const selecao = window.getSelection();
      const intervalo = document.createRange();
      intervalo.selectNodeContents(origem);
      selecao.removeAllRanges();
      selecao.addRange(intervalo);
      anunciar('Texto selecionado. Use Ctrl+C para copiar.');
    }
  }

  /* ---------- Formulário de contato ---------- */
  const formulario = $('#form-contato');
  const PADRAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const regras = {
    nome: (v) => v.length >= 2 || 'Informe seu nome.',
    email: (v) => PADRAO_EMAIL.test(v) || 'Informe um e-mail válido, como nome@empresa.com.br.',
    telefone: (v) => {
      if (!v) return true; // opcional
      const digitos = v.replace(/\D/g, '').length;
      return (digitos >= 10 && digitos <= 13) || 'Informe o telefone com DDD, como (51) 99000-0000.';
    },
    mensagem: (v) => v.length >= 10 || 'Escreva a mensagem com pelo menos 10 caracteres.'
  };

  function validarCampo(campo) {
    const regra = regras[campo.name];
    if (!regra) return true;
    const resultado = regra(campo.value.trim());
    const valido = resultado === true;

    // Estado visual (classe do Bootstrap) e semântico (aria-invalid) mudam juntos.
    campo.classList.toggle('is-invalid', !valido);
    if (valido) campo.removeAttribute('aria-invalid');
    else campo.setAttribute('aria-invalid', 'true');
    $(`#erro-${campo.name}`).textContent = valido ? '' : resultado;
    return valido;
  }

  function montarResultado() {
    const dados = Object.fromEntries(new FormData(formulario));
    const valor = (chave) => String(dados[chave] || '').trim();

    const linhas = [`Nome: ${valor('nome')}`, `E-mail: ${valor('email')}`];
    if (valor('telefone')) linhas.push(`Telefone: ${valor('telefone')}`);
    linhas.push(`Assunto: ${valor('assunto')}`, '', valor('mensagem'));
    const texto = linhas.join('\n');

    $('#resultado-texto').textContent = texto;
    $('#resultado-whatsapp').href = `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(texto)}`;
    $('#resultado-email').href =
      `mailto:${CONTATO.email}?subject=${encodeURIComponent(`${valor('assunto')} - site Nodo`)}&body=${encodeURIComponent(texto)}`;

    const resultado = $('#resultado');
    resultado.hidden = false;
    resultado.scrollIntoView({ behavior: rolagem(), block: 'nearest' });
    $('#resultado-titulo').focus({ preventScroll: true });
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const invalidos = $$('[name]', formulario).filter((campo) => !validarCampo(campo));

    if (invalidos.length) {
      $('#resultado').hidden = true;
      invalidos[0].focus(); // o leitor de tela lê o rótulo e o erro (aria-describedby)
      anunciar(invalidos.length === 1 ? 'Há 1 campo para corrigir.' : `Há ${invalidos.length} campos para corrigir.`, { visual: false });
      return;
    }
    montarResultado();
  });

  // Correção em tempo real: só revalida enquanto digita um campo que já está com erro.
  formulario.addEventListener('input', (evento) => {
    if (evento.target.classList.contains('is-invalid')) validarCampo(evento.target);
  });
  // Ao sair de um campo preenchido, valida (não acusa erro em campo ainda não tocado).
  formulario.addEventListener('focusout', (evento) => {
    if (regras[evento.target.name] && evento.target.value.trim()) validarCampo(evento.target);
  });

  /* ---------- Eventos globais (delegação: um ouvinte para a página toda) ---------- */
  document.addEventListener('click', (evento) => {
    const link = evento.target.closest('a[href^="#"]');
    if (link && link.hash.length > 1) {
      evento.preventDefault();
      irPara(link.hash);
      return;
    }

    const botao = evento.target.closest('button');
    if (!botao) return;
    const { dataset } = botao;

    if (dataset.linha) selecionarLinha(dataset.linha);
    else if (dataset.adicionar) adicionarAoPedido(dataset.adicionar);
    else if (dataset.aumentar) ajustarQuantidade(dataset.aumentar, +1);
    else if (dataset.diminuir) ajustarQuantidade(dataset.diminuir, -1);
    else if (dataset.copiar) copiar($(dataset.copiar));
    else if (botao.id === 'btn-limpar') limparPedido();
    else if (botao.id === 'btn-solicitar') solicitarPedido();
  });

  const campoBusca = $('#busca');
  const aplicarBusca = () => {
    estado.busca = campoBusca.value;
    filtrar();
  };
  campoBusca.addEventListener('input', debounce(aplicarBusca, 200));
  $('#form-busca').addEventListener('submit', (evento) => {
    evento.preventDefault();
    aplicarBusca();
  });

  window.addEventListener('hashchange', () => rotear());

  // Outra aba alterou o pedido: mantém as duas sincronizadas.
  window.addEventListener('storage', (evento) => {
    if (evento.key !== CHAVE_PEDIDO) return;
    pedido = lerPedido();
    renderizarPedido();
  });

  /* ---------- Inicialização ---------- */
  montarPortas();
  montarFiltros();
  montarCatalogo();
  filtrar();
  renderizarPedido();
  $('#ferramentas').hidden = false;
  rotear({ mover: false });
})();
