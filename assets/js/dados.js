/* =====================================================================
   Nodo Informática — dados do catálogo
   Ficam separados da lógica da interface: trocar preço, produto ou
   contato não exige mexer em app.js. No projeto full-stack (Unidade 12)
   este arquivo é substituído por uma chamada à API (GET /api/produtos).
   ===================================================================== */
'use strict';

window.NODO = window.NODO || {};

window.NODO.CONTATO = Object.freeze({
  whatsapp: '5551990000000',
  email: 'contato@nodoinformatica.com.br'
});

window.NODO.LINHAS = Object.freeze([
  { id: 'comp', nome: 'Computadores e notebooks', nota: 'Para balcão, escritório e home office' },
  { id: 'rede', nome: 'Redes e conectividade', nota: 'Linha empresarial com VLAN e gerenciamento' },
  { id: 'prot', nome: 'Armazenamento e proteção', nota: 'Dados guardados e energia limpa' }
]);

window.NODO.PRODUTOS = Object.freeze([
  { id: 'c1', linha: 'comp', icone: 'laptop', sku: 'NB-PRO14', nome: 'Notebook Pro 14", i5, 16 GB, SSD 512 GB', desc: 'Tela Full HD, teclado com numérico reduzido e bateria para o dia todo.', preco: 4290 },
  { id: 'c2', linha: 'comp', icone: 'desktop', sku: 'DT-OFFICE', nome: 'Desktop Office, i5, 8 GB, SSD 256 GB', desc: 'Torre compacta para caixa e atendimento, com Windows 11 Pro.', preco: 2890 },
  { id: 'c3', linha: 'comp', icone: 'minipc', sku: 'MP-R5', nome: 'Mini PC Compacto, Ryzen 5, 16 GB', desc: 'Cabe atrás do monitor e gasta pouca energia. Ideal para recepção.', preco: 2390 },
  { id: 'c4', linha: 'comp', icone: 'monitor', sku: 'MN-24IPS', nome: 'Monitor 24" Full HD IPS', desc: 'Ângulo de visão aberto, entradas HDMI e DisplayPort, base ajustável.', preco: 849 },

  { id: 'r1', linha: 'rede', icone: 'switch', sku: 'SW-GER24', nome: 'Switch gerenciável Gigabit, 24 portas', desc: 'VLANs, controle de banda e portas sobrando para a empresa crescer.', preco: 1690 },
  { id: 'r2', linha: 'rede', icone: 'ap', sku: 'AP-W6T', nome: 'Access Point Wi-Fi 6 de teto', desc: 'Rede separada para visitantes e alimentação pelo cabo de rede (PoE).', preco: 780 },
  { id: 'r3', linha: 'rede', icone: 'router', sku: 'RT-DWAN', nome: 'Roteador dual WAN com VLAN', desc: 'Dois links de internet com troca automática se um cair.', preco: 620 },
  { id: 'r4', linha: 'rede', icone: 'cable', sku: 'CB-CAT6-305', nome: 'Cabo CAT6, caixa com 305 m', desc: 'Par trançado para pontos de rede Gigabit, com capa antichama.', preco: 690 },

  { id: 'p1', linha: 'prot', icone: 'nas', sku: 'NAS-2B', nome: 'NAS de 2 baias', desc: 'Compartilha arquivos e faz backup automático. Discos vendidos à parte.', preco: 2190 },
  { id: 'p2', linha: 'prot', icone: 'ups', sku: 'UPS-1500S', nome: 'Nobreak senoidal 1500 VA', desc: 'Energia limpa para servidor e switch, com proteção contra queima.', preco: 2450 },
  { id: 'p3', linha: 'prot', icone: 'ssd', sku: 'SSD-NV1T', nome: 'SSD NVMe 1 TB', desc: 'Troca o disco antigo e deixa o computador bem mais rápido.', preco: 520 },
  { id: 'p4', linha: 'prot', icone: 'hdd', sku: 'HD-EXT2T', nome: 'HD externo 2 TB, USB 3.0', desc: 'Segunda mídia local para a cópia de segurança diária.', preco: 489 }
].map(Object.freeze));
