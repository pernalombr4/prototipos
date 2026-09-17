// Os textos do protótipo do menu lateral, nos três idiomas do ENSPACE.
//
// O rótulo escrito aqui é o rótulo que vai para o produto. Escrever nos três desde o
// começo é o que revela o item que estoura a largura da barra em espanhol, que é
// justamente o idioma mais longo dos três para termos de navegação.
//
// Regra 33: nenhum texto daqui leva travessão. Regra 35: os três idiomas, sempre.

import type { Idioma } from '../../composables/useIdioma'

export interface TextosDaTela {
  // barra de trabalho
  buscar: string
  buscarDica: string
  criar: string
  trocarWorkspace: string
  criarItem: string
  criarTarefa: string
  criarCategoria: string
  criarSecao: string
  criarAberto: (o: string) => string
  areaTrabalho: string
  areaDados: string
  areaSecoes: string

  // destinos fixos
  inicio: string
  spaceflows: string
  tarefas: string
  agenda: string

  // seções
  favoritos: string
  categorias: string
  verTodas: (n: number) => string
  ordenarPor: string
  ordemMaisUsadas: string
  ordemAlfabetica: string
  ordemRecentes: string
  secaoPersonalizada: string
  recolherSecao: (nome: string) => string
  expandirSecao: (nome: string) => string

  // favoritar
  fixar: string
  desafixar: string
  fixada: (nome: string) => string
  desafixada: (nome: string) => string

  // camada de todas as categorias
  todasTitulo: string
  todasDescricao: (n: number) => string
  todasBusca: string
  todasNenhuma: (termo: string) => string
  todasNenhumaDica: string
  todasFechar: string
  semFormulario: string
  umFormulario: string
  varioFormularios: (n: number) => string
  foraDoMenu: string
  foraDoMenuDica: string

  // configurações
  configuracoes: string
  configuracoesDica: string
  voltar: string
  voltarDica: string
  grupos: Record<string, string>
  itens: Record<string, string>

  // ajuda
  ajuda: string
  releases: string
  documentacao: string
  falarComBeni: string

  // tela da categoria
  todosOsItens: string
  configurarCategoria: string
  novaVisualizacao: string
  conteudoIlustrativo: string

  // estados
  vazioTitulo: string
  vazioDescricao: string
  vazioAcao: string
  erroTitulo: string
  erroDescricao: string
  erroAcao: string
  semPermissaoTitulo: string
  semPermissaoDescricao: string

  // comparação
  hojeTitulo: string
  hojeLegenda: string
  hojeRodape: string
  modeloBarra: string
  modeloTrilha: string
  modeloRotulo: string
  propostaTitulo: string
  propostaLegenda: string
  linhas: (n: number) => string
  niveis: (n: number) => string
  cabeNaTela: string
  naoCabeNaTela: (px: number) => string
  compararAbrir: string
  compararFechar: string
}

const ptBR: TextosDaTela = {
  buscar: 'Buscar ou ir para',
  buscarDica: 'Busque categoria, tela, configuração ou item',
  criar: 'Criar',
  trocarWorkspace: 'Trocar de workspace',
  criarItem: 'Item em uma categoria',
  criarTarefa: 'Tarefa',
  criarCategoria: 'Categoria',
  criarSecao: 'Seção de menu',
  criarAberto: o => `Abriria o formulário de ${o}.`,
  areaTrabalho: 'Trabalho',
  areaDados: 'Dados',
  areaSecoes: 'Seções',

  inicio: 'Início',
  spaceflows: 'Spaceflows',
  tarefas: 'Tarefas',
  agenda: 'Agenda',

  favoritos: 'Favoritos',
  categorias: 'Categorias',
  verTodas: n => `Ver todas as ${n} categorias`,
  ordenarPor: 'Ordenar por',
  ordemMaisUsadas: 'Mais usadas',
  ordemAlfabetica: 'Ordem alfabética',
  ordemRecentes: 'Criadas recentemente',
  secaoPersonalizada: 'Seção criada pelo workspace',
  recolherSecao: nome => `Recolher ${nome}`,
  expandirSecao: nome => `Expandir ${nome}`,

  fixar: 'Fixar nos favoritos',
  desafixar: 'Tirar dos favoritos',
  fixada: nome => `${nome} entrou nos seus favoritos.`,
  desafixada: nome => `${nome} saiu dos seus favoritos.`,

  todasTitulo: 'Todas as categorias',
  todasDescricao: n => `${n} categorias neste workspace. Fixe as que você usa para elas ficarem no menu.`,
  todasBusca: 'Buscar categoria',
  todasNenhuma: termo => `Nenhuma categoria com "${termo}"`,
  todasNenhumaDica: 'Confira a escrita ou limpe a busca para ver a lista inteira.',
  todasFechar: 'Fechar',
  semFormulario: 'Sem formulário',
  umFormulario: '1 formulário',
  varioFormularios: n => `${n} formulários`,
  foraDoMenu: 'Fora do menu',
  foraDoMenuDica: 'Esta categoria não entra no menu automático. Fixe para alcançá-la daqui.',

  configuracoes: 'Configurações',
  configuracoesDica: 'Abrir as configurações do workspace',
  voltar: 'Voltar ao workspace',
  voltarDica: 'Sair das configurações e voltar para o trabalho',
  grupos: {
    workspace: 'Workspace',
    estrutura: 'Estrutura de dados',
    acesso: 'Pessoas e acesso',
    interface: 'Interface',
    emails: 'E-mails',
    conexoes: 'Conexões',
    ia: 'Inteligência artificial',
    auditoria: 'Auditoria',
  },
  itens: {
    'visao-geral': 'Visão geral',
    'informacoes': 'Informações básicas',
    'calendario': 'Calendário',
    'notificacoes': 'Notificações',
    'dicionarios': 'Dicionários',
    'cobranca': 'Cobrança',
    'cfg-categorias': 'Categorias',
    'cfg-listas': 'Listas',
    'cfg-spaceflows': 'Spaceflows',
    'membros': 'Membros',
    'cargos': 'Cargos e permissões',
    'grupos': 'Grupos',
    'menus': 'Menus',
    'telas': 'Telas',
    'casos-de-uso': 'Casos de uso',
    'caixas': 'Caixas de e-mail',
    'modelos': 'Modelos de e-mail',
    'enviados': 'E-mails enviados',
    'integracoes': 'Integrações',
    'credenciais': 'Credenciais',
    'agentes': 'Agentes de IA',
    'logs-auditoria': 'Logs de auditoria',
    'logs-requisicao': 'Logs de requisição',
  },

  ajuda: 'Ajuda',
  releases: 'Novidades da plataforma',
  documentacao: 'Documentação',
  falarComBeni: 'Falar com o BENI',

  todosOsItens: 'Todos',
  configurarCategoria: 'Configurar categoria',
  novaVisualizacao: 'Nova visualização',
  conteudoIlustrativo: 'Conteúdo ilustrativo. O que está sendo proposto é a navegação da esquerda.',

  vazioTitulo: 'Nenhuma categoria ainda',
  vazioDescricao: 'Categoria é onde ficam os dados do seu negócio: contratos, clientes, chamados. Crie a primeira e ela aparece aqui no menu.',
  vazioAcao: 'Criar categoria',
  erroTitulo: 'Não deu para carregar o menu',
  erroDescricao: 'Seus dados continuam lá. É só tentar de novo.',
  erroAcao: 'Tentar de novo',
  semPermissaoTitulo: 'Você não administra este workspace',
  semPermissaoDescricao: 'As configurações ficam com quem tem licença Owner ou Full. Peça a quem administra, ou continue no seu trabalho.',

  hojeTitulo: 'O menu nativo de hoje',
  hojeLegenda: 'O que existe em qualquer workspace, com zero categorias cadastradas. Capturado no develop em 16/09/2026, com os rótulos como foram capturados.',
  hojeRodape: 'Cada categoria com menu automático soma mais uma linha, e mais uma por formulário quando expandida. Cada seção do workspace soma uma mais os itens dela.',
  modeloBarra: 'Barra única',
  modeloTrilha: 'Trilha e painel',
  modeloRotulo: 'Modelo',
  propostaTitulo: 'A proposta',
  propostaLegenda: 'Dois níveis. A administração continua no mesmo endereço, mas abre no lugar do menu em vez de morar dentro dele.',
  linhas: n => `${n} linhas`,
  niveis: n => `${n} níveis`,
  cabeNaTela: 'Cabe na tela',
  naoCabeNaTela: px => `${px} px fora da tela`,
  compararAbrir: 'Comparar com o menu de hoje',
  compararFechar: 'Fechar a comparação',
}

const en: TextosDaTela = {
  buscar: 'Search or jump to',
  buscarDica: 'Search a category, screen, setting or item',
  criar: 'Create',
  trocarWorkspace: 'Switch workspace',
  criarItem: 'Item in a category',
  criarTarefa: 'Task',
  criarCategoria: 'Category',
  criarSecao: 'Menu section',
  criarAberto: o => `This would open the ${o} form.`,
  areaTrabalho: 'Work',
  areaDados: 'Data',
  areaSecoes: 'Sections',

  inicio: 'Home',
  spaceflows: 'Spaceflows',
  tarefas: 'Tasks',
  agenda: 'Schedule',

  favoritos: 'Favorites',
  categorias: 'Categories',
  verTodas: n => `See all ${n} categories`,
  ordenarPor: 'Sort by',
  ordemMaisUsadas: 'Most used',
  ordemAlfabetica: 'Alphabetical',
  ordemRecentes: 'Recently created',
  secaoPersonalizada: 'Section created by the workspace',
  recolherSecao: nome => `Collapse ${nome}`,
  expandirSecao: nome => `Expand ${nome}`,

  fixar: 'Pin to favorites',
  desafixar: 'Remove from favorites',
  fixada: nome => `${nome} is now in your favorites.`,
  desafixada: nome => `${nome} left your favorites.`,

  todasTitulo: 'All categories',
  todasDescricao: n => `${n} categories in this workspace. Pin the ones you use to keep them in the menu.`,
  todasBusca: 'Search a category',
  todasNenhuma: termo => `No category matching "${termo}"`,
  todasNenhumaDica: 'Check the spelling or clear the search to see the full list.',
  todasFechar: 'Close',
  semFormulario: 'No form',
  umFormulario: '1 form',
  varioFormularios: n => `${n} forms`,
  foraDoMenu: 'Not in the menu',
  foraDoMenuDica: 'This category is out of the automatic menu. Pin it to reach it from here.',

  configuracoes: 'Settings',
  configuracoesDica: 'Open the workspace settings',
  voltar: 'Back to workspace',
  voltarDica: 'Leave settings and go back to your work',
  grupos: {
    workspace: 'Workspace',
    estrutura: 'Data structure',
    acesso: 'People and access',
    interface: 'Interface',
    emails: 'Emails',
    conexoes: 'Connections',
    ia: 'Artificial intelligence',
    auditoria: 'Audit',
  },
  itens: {
    'visao-geral': 'Overview',
    'informacoes': 'Basic information',
    'calendario': 'Calendar',
    'notificacoes': 'Notifications',
    'dicionarios': 'Dictionaries',
    'cobranca': 'Billing',
    'cfg-categorias': 'Categories',
    'cfg-listas': 'Lists',
    'cfg-spaceflows': 'Spaceflows',
    'membros': 'Members',
    'cargos': 'Roles and permissions',
    'grupos': 'Groups',
    'menus': 'Menus',
    'telas': 'Screens',
    'casos-de-uso': 'Use cases',
    'caixas': 'Email boxes',
    'modelos': 'Email templates',
    'enviados': 'Sent emails',
    'integracoes': 'Integrations',
    'credenciais': 'Credentials',
    'agentes': 'AI agents',
    'logs-auditoria': 'Audit logs',
    'logs-requisicao': 'Request logs',
  },

  ajuda: 'Help',
  releases: 'Platform updates',
  documentacao: 'Documentation',
  falarComBeni: 'Talk to BENI',

  todosOsItens: 'All',
  configurarCategoria: 'Configure category',
  novaVisualizacao: 'New view',
  conteudoIlustrativo: 'Placeholder content. What is being proposed is the navigation on the left.',

  vazioTitulo: 'No categories yet',
  vazioDescricao: 'A category is where your business data lives: contracts, clients, tickets. Create the first one and it shows up here in the menu.',
  vazioAcao: 'Create category',
  erroTitulo: 'The menu could not load',
  erroDescricao: 'Your data is still there. Just try again.',
  erroAcao: 'Try again',
  semPermissaoTitulo: 'You do not administer this workspace',
  semPermissaoDescricao: 'Settings belong to Owner or Full licences. Ask whoever administers it, or carry on with your work.',

  hojeTitulo: 'The native menu today',
  hojeLegenda: 'What exists in any workspace, with zero categories created. Captured on develop on 16 Sep 2026, labels as captured.',
  hojeRodape: 'Each category with the automatic menu adds one more row, plus one per form when expanded. Each workspace section adds one plus its items.',
  modeloBarra: 'Single sidebar',
  modeloTrilha: 'Rail and panel',
  modeloRotulo: 'Model',
  propostaTitulo: 'The proposal',
  propostaLegenda: 'Two levels. Administration keeps the same address, but opens in place of the menu instead of living inside it.',
  linhas: n => `${n} rows`,
  niveis: n => `${n} levels`,
  cabeNaTela: 'Fits on screen',
  naoCabeNaTela: px => `${px} px off screen`,
  compararAbrir: 'Compare with the menu of today',
  compararFechar: 'Close the comparison',
}

const es: TextosDaTela = {
  buscar: 'Buscar o ir a',
  buscarDica: 'Busca una categoría, pantalla, configuración o elemento',
  criar: 'Crear',
  trocarWorkspace: 'Cambiar de workspace',
  criarItem: 'Elemento en una categoría',
  criarTarefa: 'Tarea',
  criarCategoria: 'Categoría',
  criarSecao: 'Sección de menú',
  criarAberto: o => `Abriría el formulario de ${o}.`,
  areaTrabalho: 'Trabajo',
  areaDados: 'Datos',
  areaSecoes: 'Secciones',

  inicio: 'Inicio',
  spaceflows: 'Spaceflows',
  tarefas: 'Tareas',
  agenda: 'Agenda',

  favoritos: 'Favoritos',
  categorias: 'Categorías',
  verTodas: n => `Ver las ${n} categorías`,
  ordenarPor: 'Ordenar por',
  ordemMaisUsadas: 'Más usadas',
  ordemAlfabetica: 'Orden alfabético',
  ordemRecentes: 'Creadas recientemente',
  secaoPersonalizada: 'Sección creada por el workspace',
  recolherSecao: nome => `Contraer ${nome}`,
  expandirSecao: nome => `Expandir ${nome}`,

  fixar: 'Fijar en favoritos',
  desafixar: 'Quitar de favoritos',
  fixada: nome => `${nome} entró en tus favoritos.`,
  desafixada: nome => `${nome} salió de tus favoritos.`,

  todasTitulo: 'Todas las categorías',
  todasDescricao: n => `${n} categorías en este workspace. Fija las que usas para que queden en el menú.`,
  todasBusca: 'Buscar categoría',
  todasNenhuma: termo => `Ninguna categoría con "${termo}"`,
  todasNenhumaDica: 'Revisa la escritura o borra la búsqueda para ver la lista completa.',
  todasFechar: 'Cerrar',
  semFormulario: 'Sin formulario',
  umFormulario: '1 formulario',
  varioFormularios: n => `${n} formularios`,
  foraDoMenu: 'Fuera del menú',
  foraDoMenuDica: 'Esta categoría no entra en el menú automático. Fíjala para llegar a ella desde aquí.',

  configuracoes: 'Configuración',
  configuracoesDica: 'Abrir la configuración del workspace',
  voltar: 'Volver al workspace',
  voltarDica: 'Salir de la configuración y volver al trabajo',
  grupos: {
    workspace: 'Workspace',
    estrutura: 'Estructura de datos',
    acesso: 'Personas y acceso',
    interface: 'Interfaz',
    emails: 'Correos',
    conexoes: 'Conexiones',
    ia: 'Inteligencia artificial',
    auditoria: 'Auditoría',
  },
  itens: {
    'visao-geral': 'Visión general',
    'informacoes': 'Información básica',
    'calendario': 'Calendario',
    'notificacoes': 'Notificaciones',
    'dicionarios': 'Diccionarios',
    'cobranca': 'Facturación',
    'cfg-categorias': 'Categorías',
    'cfg-listas': 'Listas',
    'cfg-spaceflows': 'Spaceflows',
    'membros': 'Miembros',
    'cargos': 'Roles y permisos',
    'grupos': 'Grupos',
    'menus': 'Menús',
    'telas': 'Pantallas',
    'casos-de-uso': 'Casos de uso',
    'caixas': 'Buzones de correo',
    'modelos': 'Plantillas de correo',
    'enviados': 'Correos enviados',
    'integracoes': 'Integraciones',
    'credenciais': 'Credenciales',
    'agentes': 'Agentes de IA',
    'logs-auditoria': 'Registros de auditoría',
    'logs-requisicao': 'Registros de solicitud',
  },

  ajuda: 'Ayuda',
  releases: 'Novedades de la plataforma',
  documentacao: 'Documentación',
  falarComBeni: 'Hablar con BENI',

  todosOsItens: 'Todos',
  configurarCategoria: 'Configurar categoría',
  novaVisualizacao: 'Nueva vista',
  conteudoIlustrativo: 'Contenido ilustrativo. Lo que se propone es la navegación de la izquierda.',

  vazioTitulo: 'Todavía no hay categorías',
  vazioDescricao: 'Una categoría es donde viven los datos de tu negocio: contratos, clientes, tickets. Crea la primera y aparece aquí en el menú.',
  vazioAcao: 'Crear categoría',
  erroTitulo: 'No se pudo cargar el menú',
  erroDescricao: 'Tus datos siguen ahí. Solo hay que intentarlo otra vez.',
  erroAcao: 'Intentar otra vez',
  semPermissaoTitulo: 'No administras este workspace',
  semPermissaoDescricao: 'La configuración es de quien tiene licencia Owner o Full. Pídeselo a quien administra, o sigue con tu trabajo.',

  hojeTitulo: 'El menú nativo de hoy',
  hojeLegenda: 'Lo que existe en cualquier workspace, con cero categorías creadas. Capturado en develop el 16/09/2026, con las etiquetas tal como se capturaron.',
  hojeRodape: 'Cada categoría con el menú automático suma una fila más, y otra por formulario cuando se expande. Cada sección del workspace suma una más sus elementos.',
  modeloBarra: 'Barra única',
  modeloTrilha: 'Riel y panel',
  modeloRotulo: 'Modelo',
  propostaTitulo: 'La propuesta',
  propostaLegenda: 'Dos niveles. La administración mantiene la misma dirección, pero se abre en lugar del menú en vez de vivir dentro de él.',
  linhas: n => `${n} filas`,
  niveis: n => `${n} niveles`,
  cabeNaTela: 'Cabe en la pantalla',
  naoCabeNaTela: px => `${px} px fuera de la pantalla`,
  compararAbrir: 'Comparar con el menú de hoy',
  compararFechar: 'Cerrar la comparación',
}

export const textos: Record<Idioma, TextosDaTela> = {
  'pt-BR': ptBR,
  'en': en,
  'es': es,
}
