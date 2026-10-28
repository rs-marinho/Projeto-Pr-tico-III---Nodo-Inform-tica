/* =====================================================================
   Nodo Informática — ícones de produto (SVG em linha)
   Desenhos estáticos e confiáveis, escritos aqui; nunca dados digitados
   pelo usuário. Herdam a cor do texto (currentColor), então seguem o
   tema claro/escuro sem arquivos extras nem requisições de rede.
   ===================================================================== */
'use strict';

window.NODO = window.NODO || {};

(() => {
  const portasDoSwitch = () => {
    let desenho = '<rect x="4" y="16" width="56" height="18" rx="2"/>';
    for (let i = 0; i < 8; i++) {
      desenho += `<rect x="${9 + i * 6.4}" y="21" width="4.4" height="6" rx="0.6"/>`;
    }
    return `${desenho}<path d="M8 38v4M56 38v4"/>`;
  };

  const DESENHOS = {
    laptop: '<rect x="14" y="8" width="36" height="24" rx="2"/><path d="M6 38h52l-4 5H10z"/>',
    desktop: '<rect x="6" y="10" width="18" height="30" rx="2"/><path d="M11 16h8"/><circle cx="15" cy="34" r="1.6"/><rect x="30" y="10" width="28" height="20" rx="2"/><path d="M44 30v6M38 36h12"/>',
    minipc: '<rect x="10" y="18" width="44" height="16" rx="4"/><circle cx="19" cy="26" r="1.8"/><path d="M28 26h18M14 38h36"/>',
    monitor: '<rect x="8" y="6" width="48" height="30" rx="2"/><path d="M32 36v6M24 42h16"/>',
    switch: portasDoSwitch(),
    ap: '<ellipse cx="32" cy="32" rx="20" ry="7"/><path d="M22 24q10-9 20 0M26 18q6-5 12 0"/><circle cx="32" cy="32" r="1.6"/>',
    router: '<rect x="8" y="26" width="48" height="12" rx="2"/><path d="M16 26V10M48 26V10"/><circle cx="16" cy="32" r="1.4"/><circle cx="22" cy="32" r="1.4"/><path d="M36 32h14"/>',
    cable: '<circle cx="30" cy="24" r="16"/><circle cx="30" cy="24" r="8"/><path d="M46 24h12M46 28h10"/>',
    nas: '<rect x="14" y="6" width="36" height="36" rx="2"/><rect x="19" y="12" width="26" height="10" rx="1"/><rect x="19" y="26" width="26" height="10" rx="1"/><circle cx="41" cy="17" r="1.2"/><circle cx="41" cy="31" r="1.2"/>',
    ups: '<rect x="12" y="8" width="40" height="32" rx="3"/><path d="M34 14l-9 13h8l-3 11 10-14h-8z"/>',
    ssd: '<rect x="8" y="12" width="48" height="24" rx="3"/><rect x="18" y="19" width="12" height="10" rx="1"/><path d="M38 20h10M38 24h10M38 28h6"/>',
    hdd: '<rect x="12" y="6" width="40" height="36" rx="4"/><circle cx="32" cy="24" r="10"/><circle cx="32" cy="24" r="2"/><path d="M32 24l7-5"/>'
  };

  window.NODO.icone = (nome) =>
    '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    (DESENHOS[nome] || '') + '</svg>';
})();
