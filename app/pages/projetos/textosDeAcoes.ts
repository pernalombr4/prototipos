/**
 * Rodada 12: os textos da coluna Ações, que toda tabela e lista do protótipo ganhou (como em toda tabela do
 * ENSPACE), em pt-BR, en e es. As ações próprias de cada coisa (concluir o marco, excluir a meta) usam os
 * textos que já existiam; aqui ficam o rótulo da coluna e as ações que se repetem.
 */

const pt = {
  coluna: 'Ações',
  de: (nome: string) => `Ações de ${nome}`,
  abrir: 'Abrir',
  visualizar: 'Visualizar',
  abrirNaCategoria: 'Abrir na categoria',
  copiarLink: 'Copiar link',
  linkCopiado: 'Link copiado.',
}

export type TextosDeAcoes = typeof pt

const en: TextosDeAcoes = {
  coluna: 'Actions',
  de: nome => `Actions for ${nome}`,
  abrir: 'Open',
  visualizar: 'View',
  abrirNaCategoria: 'Open in the category',
  copiarLink: 'Copy link',
  linkCopiado: 'Link copied.',
}

const es: TextosDeAcoes = {
  coluna: 'Acciones',
  de: nome => `Acciones de ${nome}`,
  abrir: 'Abrir',
  visualizar: 'Ver',
  abrirNaCategoria: 'Abrir en la categoría',
  copiarLink: 'Copiar enlace',
  linkCopiado: 'Enlace copiado.',
}

export const textosDeAcoes = { 'pt-BR': pt, en, es }
