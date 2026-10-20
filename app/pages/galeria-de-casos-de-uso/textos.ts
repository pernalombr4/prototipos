// Os textos desta tela nos três idiomas do ENSPACE (regra 35).
//
// A casca e a parte de cima (Migração de Workspace e Atenção) copiam o rótulo do
// develop, conferido no bundle da tela em 2026-10-20. A galeria é a copy proposta.

import type { Idioma } from '../../composables/useIdioma'
import type { Complexidade, Localidade } from './mocks'

interface Casca {
  menuLateral: string
  buscar: string
  membro: string
  configuracoes: string
  ajuda: string
  trilha: string
  recolherMenu: string
  abrirMenu: string
  voltar: string
  avancar: string
  recarregar: string
  suporte: string
  notificacoes: string
  idioma: string
  tema: string
  conta: string
  itens: Record<string, string>
}

export interface Textos {
  locale: string
  casca: Casca
  trilhaConfiguracoes: string
  trilhaInterface: string
  trilhaCasosDeUso: string

  // a parte de cima, como é hoje
  titulo: string
  subtitulo: string
  migracaoTitulo: string
  migracaoDescricao: string
  exportarTitulo: string
  exportarSub: string
  exportarTexto: string
  exportarBotao: string
  importarTitulo: string
  importarSub: string
  importarTexto: string
  importarBotao: string
  avisoTitulo: string
  avisoTexto: string
  exportadoTitulo: string
  exportadoTexto: string

  // a galeria
  galeriaTitulo: string
  galeriaDescricao: string
  destaques: string
  todos: string
  localidade: string
  localidades: Record<Localidade['id'], string>
  complexidade: string
  complexidades: Record<Complexidade, string>
  buscarCasos: string
  limparBusca: string
  filtros: string
  areasRotulo: string
  buscarAreas: string
  selecionarTudo: string
  limparSelecao: string
  nDeM: (n: number, m: number) => string
  emDestaque: string
  verMaisN: (n: number) => string
  verMenos: string
  resultados: (n: number) => string
  nenhumCaso: string
  nenhumCasoAjuda: string
  limparFiltros: string
  erroTitulo: string
  erroAjuda: string
  tentarDeNovo: string
  abrirCaso: (nome: string) => string

  // o detalhe
  voltarParaGaleria: string
  usarCaso: string
  descricaoDoCaso: string
  oQueVemJunto: string
  incluiMenus: string
  incluiCategorias: string
  incluiStatus: string
  nMenusTelas: (m: number, t: number) => string
  nCategoriasCampos: (c: number, f: number) => string
  nStatus: (n: number) => string
  nCampos: (n: number) => string
  nTelas: (n: number) => string
  anterior: string
  proxima: string
  imagemDe: (i: number, n: number) => string
  ampliar: string
  fechar: string
  verificado: string
  peloEnspace: string
  peloEnspaceDica: string
  criadoEmRotulo: string
  usadoRotulo: string
  vezes: (n: string) => string
  semPermissao: string

  // usar
  usarTitulo: (nome: string) => string
  usarDescricao: string
  entraNoWorkspace: string
  avisoDuplicar: string
  avisoCobranca: string
  cancelar: string
  usadoTitulo: (nome: string) => string
  usadoTexto: string

  // criar (rodada 3)
  doWorkspace: string
  criarCaso: string
  faixaCriarTitulo: string
  faixaCriarTexto: string
  criarCasoDescricao: string
  nomeDoCaso: string
  nomeObrigatorio: string
  areaDoCaso: string
  descricaoCampo: string
  imagensDoCaso: string
  imagensDica: string
  imagensArraste: string
  imagensFormatos: string
  oQueEntraCampo: string
  oQueEntraDica: string
  categoriasDoWorkspace: string
  menusDoWorkspace: string
  escolhaUmItem: string
  ondeFica: string
  ondeFicaDica: string
  ondeOpcoes: Record<'workspace' | 'galeria', { label: string, description: string }>
  avisoPublicoTitulo: string
  avisoPublicoTexto: string
  confirmoPublico: string
  confirmoObrigatorio: string
  salvarNoWorkspace: string
  publicarNaGaleria: string
  casoSalvo: (nome: string) => string
  casoSalvoTexto: string
  casoPublicado: (nome: string) => string
  casoPublicadoTexto: string
  nadaNoWorkspaceTitulo: string
  nadaNoWorkspaceAjuda: string
  porWorkspace: (nome: string) => string
  porWorkspaceDica: string
  visibilidade: string
  soNoWorkspace: string
  publicadoNaGaleria: string
  semPermissaoCriar: string
}

const casca: Record<Idioma, Casca> = {
  'pt-BR': {
    menuLateral: 'Menu do workspace', buscar: 'Buscar...', membro: 'Membro', configuracoes: 'Configurações',
    ajuda: 'Ajuda', trilha: 'Trilha', recolherMenu: 'Recolher o menu', abrirMenu: 'Abrir o menu',
    voltar: 'Voltar', avancar: 'Avançar', recarregar: 'Recarregar', suporte: 'Suporte',
    notificacoes: 'Notificações', idioma: 'Idioma', tema: 'Tema', conta: 'Sua conta',
    itens: {
      inicio: 'Início', spaceflows: 'Spaceflows', categorias: 'Categorias', tarefas: 'Tarefas',
      agenda: 'Agenda', knowledge: 'Knowledge', visaoGeral: 'Visão Geral', sistema: 'Sistema',
      estrutura: 'Estrutura', gestaoDeMembros: 'Gestão de Membros', interface: 'Interface',
      menus: 'Menus', telas: 'Telas', casosDeUso: 'Casos de Uso',
      emails: 'E-mails', integracoes: 'Integrações', agentesDeIa: 'Agentes de IA', logs: 'Logs',
      releases: 'Releases', documentacao: 'Documentação',
    },
  },
  'en': {
    menuLateral: 'Workspace menu', buscar: 'Search...', membro: 'Member', configuracoes: 'Settings',
    ajuda: 'Help', trilha: 'Breadcrumb', recolherMenu: 'Collapse the menu', abrirMenu: 'Open the menu',
    voltar: 'Back', avancar: 'Forward', recarregar: 'Reload', suporte: 'Support',
    notificacoes: 'Notifications', idioma: 'Language', tema: 'Theme', conta: 'Your account',
    itens: {
      inicio: 'Home', spaceflows: 'Spaceflows', categorias: 'Categories', tarefas: 'Tasks',
      agenda: 'Schedule', knowledge: 'Knowledge', visaoGeral: 'Overview', sistema: 'System',
      estrutura: 'Structure', gestaoDeMembros: 'Member management', interface: 'Interface',
      menus: 'Menus', telas: 'Screens', casosDeUso: 'Use Cases',
      emails: 'Emails', integracoes: 'Integrations', agentesDeIa: 'AI agents', logs: 'Logs',
      releases: 'Releases', documentacao: 'Documentation',
    },
  },
  'es': {
    menuLateral: 'Menú del workspace', buscar: 'Buscar...', membro: 'Miembro', configuracoes: 'Configuraciones',
    ajuda: 'Ayuda', trilha: 'Ruta', recolherMenu: 'Contraer el menú', abrirMenu: 'Abrir el menú',
    voltar: 'Volver', avancar: 'Avanzar', recarregar: 'Recargar', suporte: 'Soporte',
    notificacoes: 'Notificaciones', idioma: 'Idioma', tema: 'Tema', conta: 'Su cuenta',
    itens: {
      inicio: 'Inicio', spaceflows: 'Spaceflows', categorias: 'Categorías', tarefas: 'Tareas',
      agenda: 'Agenda', knowledge: 'Knowledge', visaoGeral: 'Visión General', sistema: 'Sistema',
      estrutura: 'Estructura', gestaoDeMembros: 'Gestión de Miembros', interface: 'Interfaz',
      menus: 'Menús', telas: 'Pantallas', casosDeUso: 'Casos de Uso',
      emails: 'Correos', integracoes: 'Integraciones', agentesDeIa: 'Agentes de IA', logs: 'Registros',
      releases: 'Releases', documentacao: 'Documentación',
    },
  },
}

const pt: Textos = {
  locale: 'pt-BR',
  casca: casca['pt-BR'],
  trilhaConfiguracoes: 'Configurações',
  trilhaInterface: 'Interface',
  trilhaCasosDeUso: 'Casos de Uso',

  titulo: 'Casos de Uso',
  subtitulo: 'A tela de Casos de Uso permite você importar e exportar workspaces, além de consultar todas as categorias disponíveis e entender a finalidade de cada uma a partir de suas descrições.',
  migracaoTitulo: 'Migração de Workspace',
  migracaoDescricao: 'Exporte ou importe a estrutura deste workspace.',
  exportarTitulo: 'Exportar',
  exportarSub: 'Baixe a estrutura atual',
  exportarTexto: 'O sistema fará o download de um arquivo com todas as categorias e suas respectivas informações. Esse arquivo pode ser utilizado para a importação em outro workspace.',
  exportarBotao: 'Exportar Workspace',
  importarTitulo: 'Importar',
  importarSub: 'Envie uma estrutura existente',
  importarTexto: 'A importação deve ser realizada utilizando o arquivo gerado na exportação. O sistema importará todas as categorias e seus respectivos componentes.',
  importarBotao: 'Importar Workspace',
  avisoTitulo: 'Atenção',
  avisoTexto: 'O sistema não identifica categorias pré-existentes no workspace. Se o arquivo contiver categorias já cadastradas, elas serão duplicadas.',
  exportadoTitulo: 'Estrutura exportada',
  exportadoTexto: 'O arquivo foi baixado para o seu computador.',

  galeriaTitulo: 'Galeria de casos de uso',
  galeriaDescricao: 'Estruturas prontas do ENSPACE para começar um processo sem montar tudo do zero.',
  destaques: 'Destaques',
  todos: 'Todos do ENSPACE',
  localidade: 'Localidade',
  localidades: { 'pt-br': 'Brasil (pt-br)', 'en-us': 'Estados Unidos (en-us)', 'global': 'Global' },
  complexidade: 'Complexidade',
  complexidades: { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' },
  buscarCasos: 'Buscar casos de uso',
  limparBusca: 'Limpar a busca',
  filtros: 'Filtros',
  areasRotulo: 'Áreas',
  buscarAreas: 'Buscar área',
  selecionarTudo: 'Selecionar tudo',
  limparSelecao: 'Limpar',
  nDeM: (n, m) => `${n} de ${m}`,
  emDestaque: 'Em destaque',
  verMaisN: n => `Ver mais ${n}`,
  verMenos: 'Ver menos',
  resultados: n => (n === 1 ? '1 caso de uso' : `${n} casos de uso`),
  nenhumCaso: 'Nenhum caso de uso encontrado',
  nenhumCasoAjuda: 'Tente outra palavra ou remova um filtro.',
  limparFiltros: 'Limpar filtros',
  erroTitulo: 'Não foi possível carregar os casos de uso',
  erroAjuda: 'Verifique a sua conexão e tente novamente.',
  tentarDeNovo: 'Tentar novamente',
  abrirCaso: nome => `Ver o caso de uso ${nome}`,

  voltarParaGaleria: 'Galeria de casos de uso',
  usarCaso: 'Usar caso de uso',
  descricaoDoCaso: 'Descrição',
  oQueVemJunto: 'O que vem junto',
  incluiMenus: 'Menus e telas',
  incluiCategorias: 'Categorias e campos',
  incluiStatus: 'Status',
  nMenusTelas: (m, t) => `${m} ${m === 1 ? 'menu' : 'menus'}, ${t} ${t === 1 ? 'tela' : 'telas'}`,
  nCategoriasCampos: (c, f) => `${c} ${c === 1 ? 'categoria' : 'categorias'}, ${f} ${f === 1 ? 'campo' : 'campos'}`,
  nStatus: n => (n === 1 ? '1 status' : `${n} status`),
  nCampos: n => (n === 1 ? '1 campo' : `${n} campos`),
  nTelas: n => (n === 1 ? '1 tela' : `${n} telas`),
  anterior: 'Imagem anterior',
  proxima: 'Próxima imagem',
  imagemDe: (i, n) => `Imagem ${i} de ${n}`,
  ampliar: 'Ampliar a imagem',
  fechar: 'Fechar',
  verificado: 'Verificado',
  peloEnspace: 'Pelo ENSPACE',
  peloEnspaceDica: 'Caso de uso mantido pela equipe do ENSPACE.',
  criadoEmRotulo: 'Criado em',
  usadoRotulo: 'Usado',
  vezes: n => `${n} vezes`,
  semPermissao: 'Para usar um caso de uso, você precisa da permissão Criar Casos de Uso. Solicite a quem administra o workspace.',

  usarTitulo: nome => `Usar o caso de uso ${nome}?`,
  usarDescricao: 'O que está abaixo é criado neste workspace, somado ao que já existe.',
  entraNoWorkspace: 'O que entra no workspace',
  avisoDuplicar: 'Se uma categoria com o mesmo nome já existir, o sistema cria outra, em duplicidade.',
  avisoCobranca: 'Se o workspace ultrapassar o limite de produtos do plano, pode haver cobrança adicional.',
  cancelar: 'Cancelar',
  usadoTitulo: nome => `Caso de uso ${nome} enviado`,
  usadoTexto: 'Os registros estão sendo carregados na tabela de Backup/Migração.',
  doWorkspace: 'Deste workspace',
  criarCaso: 'Criar caso de uso',
  faixaCriarTitulo: 'Transforme este workspace em um caso de uso',
  faixaCriarTexto: 'Escolha as categorias e os menus que entram. Você decide se o caso fica só aqui ou na galeria do ENSPACE.',
  criarCasoDescricao: 'Monte um caso de uso com a estrutura que este workspace tem agora. Só a estrutura entra: nenhum item, arquivo ou dado de pessoa.',
  nomeDoCaso: 'Nome',
  nomeObrigatorio: 'Informe o nome do caso de uso.',
  areaDoCaso: 'Área',
  descricaoCampo: 'Descrição',
  imagensDoCaso: 'Imagens da galeria',
  imagensDica: 'A primeira imagem é a miniatura do cartão.',
  imagensArraste: 'Arraste as imagens ou clique para escolher',
  imagensFormatos: 'PNG ou JPG',
  oQueEntraCampo: 'O que entra',
  oQueEntraDica: 'Cada categoria leva os campos e os status dela. Cada menu leva as telas.',
  categoriasDoWorkspace: 'Categorias',
  menusDoWorkspace: 'Menus',
  escolhaUmItem: 'Escolha ao menos 1 categoria ou 1 menu.',
  ondeFica: 'Onde o caso de uso fica',
  ondeFicaDica: 'Só neste workspace: apenas quem acessa este workspace vê e usa. Galeria do ENSPACE: todas as empresas que usam o ENSPACE veem e usam.',
  ondeOpcoes: {
    workspace: { label: 'Só neste workspace', description: 'Aparece em Deste workspace.' },
    galeria: { label: 'Galeria do ENSPACE', description: 'Aparece para todas as empresas que usam o ENSPACE.' },
  },
  avisoPublicoTitulo: 'Este caso de uso fica público',
  avisoPublicoTexto: 'Todas as empresas que usam o ENSPACE passam a ver e usar os nomes das categorias, dos campos, dos menus, das telas e dos status escolhidos. Confira se nenhum nome identifica um cliente, uma pessoa ou um projeto interno.',
  confirmoPublico: 'Entendo que este caso de uso fica visível para todas as empresas que usam o ENSPACE.',
  confirmoObrigatorio: 'Marque a confirmação para publicar.',
  salvarNoWorkspace: 'Salvar no workspace',
  publicarNaGaleria: 'Publicar na galeria',
  casoSalvo: nome => `Caso de uso ${nome} salvo`,
  casoSalvoTexto: 'Ele está em Deste workspace.',
  casoPublicado: nome => `Caso de uso ${nome} publicado`,
  casoPublicadoTexto: 'Ele está na galeria do ENSPACE e em Deste workspace.',
  nadaNoWorkspaceTitulo: 'Nenhum caso de uso criado neste workspace',
  nadaNoWorkspaceAjuda: 'Crie um caso de uso com as categorias e os menus que este workspace já tem.',
  porWorkspace: nome => `Por ${nome}`,
  porWorkspaceDica: 'Caso de uso criado neste workspace.',
  visibilidade: 'Visibilidade',
  soNoWorkspace: 'Só neste workspace',
  publicadoNaGaleria: 'Publicado na galeria',
  semPermissaoCriar: 'Para criar um caso de uso, você precisa da permissão Criar Casos de Uso.',
}

const en: Textos = {
  locale: 'en',
  casca: casca.en,
  trilhaConfiguracoes: 'Settings',
  trilhaInterface: 'Interface',
  trilhaCasosDeUso: 'Use Cases',

  titulo: 'Use Cases',
  subtitulo: 'The Use Cases screen allows you to import and export workspaces, as well as consult all available categories and understand the purpose of each one from their descriptions.',
  migracaoTitulo: 'Workspace Migration',
  migracaoDescricao: 'Export or import the structure of this workspace.',
  exportarTitulo: 'Export',
  exportarSub: 'Download the current structure',
  exportarTexto: 'The system will download a file with all categories and their respective information. This file can be used for import into another workspace.',
  exportarBotao: 'Export Workspace',
  importarTitulo: 'Import',
  importarSub: 'Send an existing structure',
  importarTexto: 'The import must be done using the file generated in the export. The system will import all categories and their respective components.',
  importarBotao: 'Import Workspace',
  avisoTitulo: 'Attention',
  avisoTexto: 'The system does not identify pre-existing categories in the workspace. If the file contains already registered categories, they will be duplicated.',
  exportadoTitulo: 'Structure exported',
  exportadoTexto: 'The file was downloaded to your computer.',

  galeriaTitulo: 'Use case gallery',
  galeriaDescricao: 'Ready-made ENSPACE structures to start a process without building everything from scratch.',
  destaques: 'Featured',
  todos: 'All from ENSPACE',
  localidade: 'Locale',
  localidades: { 'pt-br': 'Brazil (pt-br)', 'en-us': 'United States (en-us)', 'global': 'Global' },
  complexidade: 'Complexity',
  complexidades: { iniciante: 'Beginner', intermediario: 'Intermediate', avancado: 'Advanced' },
  buscarCasos: 'Search use cases',
  limparBusca: 'Clear the search',
  filtros: 'Filters',
  areasRotulo: 'Areas',
  buscarAreas: 'Search area',
  selecionarTudo: 'Select all',
  limparSelecao: 'Clear',
  nDeM: (n, m) => `${n} of ${m}`,
  emDestaque: 'Featured',
  verMaisN: n => `See ${n} more`,
  verMenos: 'See less',
  resultados: n => (n === 1 ? '1 use case' : `${n} use cases`),
  nenhumCaso: 'No use case found',
  nenhumCasoAjuda: 'Try another word or remove a filter.',
  limparFiltros: 'Clear filters',
  erroTitulo: 'The use cases could not be loaded',
  erroAjuda: 'Check your connection and try again.',
  tentarDeNovo: 'Try again',
  abrirCaso: nome => `See the use case ${nome}`,

  voltarParaGaleria: 'Use case gallery',
  usarCaso: 'Use this use case',
  descricaoDoCaso: 'Description',
  oQueVemJunto: 'What comes with it',
  incluiMenus: 'Menus and screens',
  incluiCategorias: 'Categories and fields',
  incluiStatus: 'Statuses',
  nMenusTelas: (m, t) => `${m} ${m === 1 ? 'menu' : 'menus'}, ${t} ${t === 1 ? 'screen' : 'screens'}`,
  nCategoriasCampos: (c, f) => `${c} ${c === 1 ? 'category' : 'categories'}, ${f} ${f === 1 ? 'field' : 'fields'}`,
  nStatus: n => (n === 1 ? '1 status' : `${n} statuses`),
  nCampos: n => (n === 1 ? '1 field' : `${n} fields`),
  nTelas: n => (n === 1 ? '1 screen' : `${n} screens`),
  anterior: 'Previous image',
  proxima: 'Next image',
  imagemDe: (i, n) => `Image ${i} of ${n}`,
  ampliar: 'Enlarge the image',
  fechar: 'Close',
  verificado: 'Verified',
  peloEnspace: 'By ENSPACE',
  peloEnspaceDica: 'Use case maintained by the ENSPACE team.',
  criadoEmRotulo: 'Created on',
  usadoRotulo: 'Used',
  vezes: n => `${n} times`,
  semPermissao: 'To use a use case, you need the Create Use Cases permission. Ask the workspace administrator.',

  usarTitulo: nome => `Use the use case ${nome}?`,
  usarDescricao: 'The items below are created in this workspace, added to what already exists.',
  entraNoWorkspace: 'What goes into the workspace',
  avisoDuplicar: 'If a category with the same name already exists, the system creates another one, as a duplicate.',
  avisoCobranca: 'If the workspace exceeds the product limit of the plan, additional charges may apply.',
  cancelar: 'Cancel',
  usadoTitulo: nome => `Use case ${nome} sent`,
  usadoTexto: 'Records are being loaded into the Backup/Migration table.',
  doWorkspace: 'From this workspace',
  criarCaso: 'Create use case',
  faixaCriarTitulo: 'Turn this workspace into a use case',
  faixaCriarTexto: 'Choose the categories and menus that go in. You decide whether the use case stays here or goes to the ENSPACE gallery.',
  criarCasoDescricao: 'Build a use case from the structure this workspace has now. Only the structure goes in: no items, files or personal data.',
  nomeDoCaso: 'Name',
  nomeObrigatorio: 'Enter the use case name.',
  areaDoCaso: 'Area',
  descricaoCampo: 'Description',
  imagensDoCaso: 'Gallery images',
  imagensDica: 'The first image is the card thumbnail.',
  imagensArraste: 'Drag the images or click to choose',
  imagensFormatos: 'PNG or JPG',
  oQueEntraCampo: 'What goes in',
  oQueEntraDica: 'Each category takes its fields and statuses. Each menu takes its screens.',
  categoriasDoWorkspace: 'Categories',
  menusDoWorkspace: 'Menus',
  escolhaUmItem: 'Choose at least 1 category or 1 menu.',
  ondeFica: 'Where the use case lives',
  ondeFicaDica: 'Only this workspace: only people with access to this workspace see and use it. ENSPACE gallery: every company that uses ENSPACE sees and uses it.',
  ondeOpcoes: {
    workspace: { label: 'Only this workspace', description: 'Shows in From this workspace.' },
    galeria: { label: 'ENSPACE gallery', description: 'Shows to every company that uses ENSPACE.' },
  },
  avisoPublicoTitulo: 'This use case becomes public',
  avisoPublicoTexto: 'Every company that uses ENSPACE can see and use the names of the chosen categories, fields, menus, screens and statuses. Check that no name identifies a client, a person or an internal project.',
  confirmoPublico: 'I understand this use case is visible to every company that uses ENSPACE.',
  confirmoObrigatorio: 'Check the confirmation to publish.',
  salvarNoWorkspace: 'Save to workspace',
  publicarNaGaleria: 'Publish to gallery',
  casoSalvo: nome => `Use case ${nome} saved`,
  casoSalvoTexto: 'It is in From this workspace.',
  casoPublicado: nome => `Use case ${nome} published`,
  casoPublicadoTexto: 'It is in the ENSPACE gallery and in From this workspace.',
  nadaNoWorkspaceTitulo: 'No use case created in this workspace',
  nadaNoWorkspaceAjuda: 'Create a use case with the categories and menus this workspace already has.',
  porWorkspace: nome => `By ${nome}`,
  porWorkspaceDica: 'Use case created in this workspace.',
  visibilidade: 'Visibility',
  soNoWorkspace: 'Only this workspace',
  publicadoNaGaleria: 'Published to gallery',
  semPermissaoCriar: 'To create a use case, you need the Create Use Cases permission.',
}

const es: Textos = {
  locale: 'es',
  casca: casca.es,
  trilhaConfiguracoes: 'Configuraciones',
  trilhaInterface: 'Interfaz',
  trilhaCasosDeUso: 'Casos de Uso',

  titulo: 'Casos de Uso',
  subtitulo: 'La pantalla de Casos de Uso le permite importar y exportar espacios de trabajo, además de consultar todas las categorías disponibles y comprender el propósito de cada una a partir de sus descripciones.',
  migracaoTitulo: 'Migración de Espacio de Trabajo',
  migracaoDescricao: 'Exporte o importe la estructura de este espacio de trabajo.',
  exportarTitulo: 'Exportar',
  exportarSub: 'Descargue la estructura actual',
  exportarTexto: 'El sistema descargará un archivo con todas las categorías y sus respectivas informaciones. Este archivo puede ser utilizado para la importación en otro espacio de trabajo.',
  exportarBotao: 'Exportar Espacio de Trabajo',
  importarTitulo: 'Importar',
  importarSub: 'Enviar una estructura existente',
  importarTexto: 'La importación debe realizarse utilizando el archivo generado en la exportación. El sistema importará todas las categorías y sus respectivos componentes.',
  importarBotao: 'Importar Espacio de Trabajo',
  avisoTitulo: 'Atención',
  avisoTexto: 'El sistema no identifica categorías preexistentes en el espacio de trabajo. Si el archivo contiene categorías ya registradas, se duplicarán.',
  exportadoTitulo: 'Estructura exportada',
  exportadoTexto: 'El archivo se descargó en su computadora.',

  galeriaTitulo: 'Galería de casos de uso',
  galeriaDescricao: 'Estructuras listas de ENSPACE para empezar un proceso sin armarlo todo desde cero.',
  destaques: 'Destacados',
  todos: 'Todos de ENSPACE',
  localidade: 'Localidad',
  localidades: { 'pt-br': 'Brasil (pt-br)', 'en-us': 'Estados Unidos (en-us)', 'global': 'Global' },
  complexidade: 'Complejidad',
  complexidades: { iniciante: 'Principiante', intermediario: 'Intermedio', avancado: 'Avanzado' },
  buscarCasos: 'Buscar casos de uso',
  limparBusca: 'Borrar la búsqueda',
  filtros: 'Filtros',
  areasRotulo: 'Áreas',
  buscarAreas: 'Buscar área',
  selecionarTudo: 'Seleccionar todo',
  limparSelecao: 'Borrar',
  nDeM: (n, m) => `${n} de ${m}`,
  emDestaque: 'Destacados',
  verMaisN: n => `Ver ${n} más`,
  verMenos: 'Ver menos',
  resultados: n => (n === 1 ? '1 caso de uso' : `${n} casos de uso`),
  nenhumCaso: 'No se encontró ningún caso de uso',
  nenhumCasoAjuda: 'Pruebe otra palabra o quite un filtro.',
  limparFiltros: 'Borrar filtros',
  erroTitulo: 'No fue posible cargar los casos de uso',
  erroAjuda: 'Verifique su conexión e intente nuevamente.',
  tentarDeNovo: 'Intentar nuevamente',
  abrirCaso: nome => `Ver el caso de uso ${nome}`,

  voltarParaGaleria: 'Galería de casos de uso',
  usarCaso: 'Usar caso de uso',
  descricaoDoCaso: 'Descripción',
  oQueVemJunto: 'Qué incluye',
  incluiMenus: 'Menús y pantallas',
  incluiCategorias: 'Categorías y campos',
  incluiStatus: 'Estados',
  nMenusTelas: (m, t) => `${m} ${m === 1 ? 'menú' : 'menús'}, ${t} ${t === 1 ? 'pantalla' : 'pantallas'}`,
  nCategoriasCampos: (c, f) => `${c} ${c === 1 ? 'categoría' : 'categorías'}, ${f} ${f === 1 ? 'campo' : 'campos'}`,
  nStatus: n => (n === 1 ? '1 estado' : `${n} estados`),
  nCampos: n => (n === 1 ? '1 campo' : `${n} campos`),
  nTelas: n => (n === 1 ? '1 pantalla' : `${n} pantallas`),
  anterior: 'Imagen anterior',
  proxima: 'Imagen siguiente',
  imagemDe: (i, n) => `Imagen ${i} de ${n}`,
  ampliar: 'Ampliar la imagen',
  fechar: 'Cerrar',
  verificado: 'Verificado',
  peloEnspace: 'Por ENSPACE',
  peloEnspaceDica: 'Caso de uso mantenido por el equipo de ENSPACE.',
  criadoEmRotulo: 'Creado el',
  usadoRotulo: 'Usado',
  vezes: n => `${n} veces`,
  semPermissao: 'Para usar un caso de uso, necesita el permiso Crear Casos de Uso. Solicítelo a quien administra el espacio de trabajo.',

  usarTitulo: nome => `¿Usar el caso de uso ${nome}?`,
  usarDescricao: 'Lo que aparece abajo se crea en este espacio de trabajo, sumado a lo que ya existe.',
  entraNoWorkspace: 'Lo que entra en el espacio de trabajo',
  avisoDuplicar: 'Si ya existe una categoría con el mismo nombre, el sistema crea otra, duplicada.',
  avisoCobranca: 'Si el espacio de trabajo supera el límite de productos del plan, puede haber cargos adicionales.',
  cancelar: 'Cancelar',
  usadoTitulo: nome => `Caso de uso ${nome} enviado`,
  usadoTexto: 'Los registros se están cargando en la tabla de Respaldo/Migración.',
  doWorkspace: 'De este espacio de trabajo',
  criarCaso: 'Crear caso de uso',
  faixaCriarTitulo: 'Convierta este espacio de trabajo en un caso de uso',
  faixaCriarTexto: 'Elija las categorías y los menús que entran. Usted decide si el caso queda solo aquí o en la galería de ENSPACE.',
  criarCasoDescricao: 'Arme un caso de uso con la estructura que este espacio de trabajo tiene ahora. Solo entra la estructura: ningún ítem, archivo ni dato de personas.',
  nomeDoCaso: 'Nombre',
  nomeObrigatorio: 'Ingrese el nombre del caso de uso.',
  areaDoCaso: 'Área',
  descricaoCampo: 'Descripción',
  imagensDoCaso: 'Imágenes de la galería',
  imagensDica: 'La primera imagen es la miniatura de la tarjeta.',
  imagensArraste: 'Arrastre las imágenes o haga clic para elegir',
  imagensFormatos: 'PNG o JPG',
  oQueEntraCampo: 'Qué entra',
  oQueEntraDica: 'Cada categoría lleva sus campos y estados. Cada menú lleva sus pantallas.',
  categoriasDoWorkspace: 'Categorías',
  menusDoWorkspace: 'Menús',
  escolhaUmItem: 'Elija al menos 1 categoría o 1 menú.',
  ondeFica: 'Dónde queda el caso de uso',
  ondeFicaDica: 'Solo en este espacio de trabajo: solo quien accede a este espacio de trabajo lo ve y lo usa. Galería de ENSPACE: todas las empresas que usan ENSPACE lo ven y lo usan.',
  ondeOpcoes: {
    workspace: { label: 'Solo en este espacio de trabajo', description: 'Aparece en De este espacio de trabajo.' },
    galeria: { label: 'Galería de ENSPACE', description: 'Aparece para todas las empresas que usan ENSPACE.' },
  },
  avisoPublicoTitulo: 'Este caso de uso queda público',
  avisoPublicoTexto: 'Todas las empresas que usan ENSPACE pasan a ver y usar los nombres de las categorías, los campos, los menús, las pantallas y los estados elegidos. Verifique que ningún nombre identifique a un cliente, una persona o un proyecto interno.',
  confirmoPublico: 'Entiendo que este caso de uso queda visible para todas las empresas que usan ENSPACE.',
  confirmoObrigatorio: 'Marque la confirmación para publicar.',
  salvarNoWorkspace: 'Guardar en el espacio de trabajo',
  publicarNaGaleria: 'Publicar en la galería',
  casoSalvo: nome => `Caso de uso ${nome} guardado`,
  casoSalvoTexto: 'Está en De este espacio de trabajo.',
  casoPublicado: nome => `Caso de uso ${nome} publicado`,
  casoPublicadoTexto: 'Está en la galería de ENSPACE y en De este espacio de trabajo.',
  nadaNoWorkspaceTitulo: 'Ningún caso de uso creado en este espacio de trabajo',
  nadaNoWorkspaceAjuda: 'Cree un caso de uso con las categorías y los menús que este espacio de trabajo ya tiene.',
  porWorkspace: nome => `Por ${nome}`,
  porWorkspaceDica: 'Caso de uso creado en este espacio de trabajo.',
  visibilidade: 'Visibilidad',
  soNoWorkspace: 'Solo en este espacio de trabajo',
  publicadoNaGaleria: 'Publicado en la galería',
  semPermissaoCriar: 'Para crear un caso de uso, necesita el permiso Crear Casos de Uso.',
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': pt, en, es }
