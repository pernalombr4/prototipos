/**
 * Rodada 13: os textos de pôr e tirar o projeto do menu, em pt-BR, en e es. Seguem o padrão que o ENSPACE já usa
 * na barra de informações do item e na barra de pastas: a mudança pessoal salva na hora, "Só para você", e o
 * "Para todos" fica com quem administra, com confirmação.
 */

const pt = {
  adicionar: 'Adicionar ao menu',
  ocultar: 'Ocultar do menu',
  adicionarParaTodos: 'Adicionar ao menu de todos',
  salvarParaMim: 'Salvar para mim',
  salvarParaTodos: 'Salvar para todos',
  soParaVoce: 'Só para você.',
  desfazer: 'Desfazer',
  adicionado: (nome: string) => `${nome} entrou no seu menu.`,
  ocultado: (nome: string) => `${nome} saiu do seu menu. Ele continua em Todos os projetos.`,
  confirmarAdicionarTitulo: 'Adicionar ao menu de todos?',
  confirmarAdicionarTexto: (nome: string) => `${nome} passa a aparecer no menu dos participantes que não personalizaram o próprio menu.`,
  confirmarOcultarTitulo: 'Ocultar do menu de todos?',
  confirmarOcultarTexto: (nome: string) => `${nome} sai do menu dos participantes que não personalizaram o próprio menu. O projeto continua em Todos os projetos.`,
  cancelar: 'Cancelar',
  atualizadoParaTodos: 'Menu de todos atualizado',
  colunaNoMenu: 'Visibilidade no menu',
  visivel: 'Visível',
  oculto: 'Oculto',
  padraoParaTodos: 'No menu de todos',
}

export type TextosDoMenu = typeof pt

const en: TextosDoMenu = {
  adicionar: 'Add to menu',
  ocultar: 'Hide from menu',
  adicionarParaTodos: 'Add to everyone\'s menu',
  salvarParaMim: 'Save for me',
  salvarParaTodos: 'Save for everyone',
  soParaVoce: 'Just for you.',
  desfazer: 'Undo',
  adicionado: nome => `${nome} was added to your menu.`,
  ocultado: nome => `${nome} was removed from your menu. It remains in All projects.`,
  confirmarAdicionarTitulo: 'Add to everyone\'s menu?',
  confirmarAdicionarTexto: nome => `${nome} will show in the menu of participants who have not customized their own menu.`,
  confirmarOcultarTitulo: 'Hide from everyone\'s menu?',
  confirmarOcultarTexto: nome => `${nome} will leave the menu of participants who have not customized their own menu. The project remains in All projects.`,
  cancelar: 'Cancel',
  atualizadoParaTodos: 'Everyone\'s menu updated',
  colunaNoMenu: 'Menu visibility',
  visivel: 'Visible',
  oculto: 'Hidden',
  padraoParaTodos: 'In everyone\'s menu',
}

const es: TextosDoMenu = {
  adicionar: 'Agregar al menú',
  ocultar: 'Ocultar del menú',
  adicionarParaTodos: 'Agregar al menú de todos',
  salvarParaMim: 'Guardar para mí',
  salvarParaTodos: 'Guardar para todos',
  soParaVoce: 'Solo para usted.',
  desfazer: 'Deshacer',
  adicionado: nome => `${nome} se agregó a su menú.`,
  ocultado: nome => `${nome} salió de su menú. Sigue en Todos los proyectos.`,
  confirmarAdicionarTitulo: '¿Agregar al menú de todos?',
  confirmarAdicionarTexto: nome => `${nome} pasa a aparecer en el menú de los participantes que no personalizaron su propio menú.`,
  confirmarOcultarTitulo: '¿Ocultar del menú de todos?',
  confirmarOcultarTexto: nome => `${nome} sale del menú de los participantes que no personalizaron su propio menú. El proyecto sigue en Todos los proyectos.`,
  cancelar: 'Cancelar',
  atualizadoParaTodos: 'Menú de todos actualizado',
  colunaNoMenu: 'Visibilidad en el menú',
  visivel: 'Visible',
  oculto: 'Oculto',
  padraoParaTodos: 'En el menú de todos',
}

export const textosDoMenu = { 'pt-BR': pt, en, es }
