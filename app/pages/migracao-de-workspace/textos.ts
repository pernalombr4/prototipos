// Os textos desta tela nos três idiomas do ENSPACE (regra 35).
//
// A casca copia o rótulo do develop. O resto é a copy proposta: escrita para quem
// nunca abriu o arquivo .json e não precisa abrir.

import type { Idioma } from '../../composables/useIdioma'
import type { TipoDeCampo } from './mocks'
import type { Modo, Situacao } from './comparar'
import type { TipoDeComponente } from './mocks'

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

  // a tela, como é hoje
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

  // a camada de importação
  modalTitulo: string
  modalDescricao: string
  passos: { arquivo: string, soArquivo: string, revisar: string }
  continuar: string
  voltarPasso: string
  cancelar: string
  fechar: string

  // passo 1
  soltarTitulo: string
  soltarDescricao: string
  lendoArquivo: string
  arquivoDe: (workspace: string, data: string) => string
  trocarArquivo: string
  resumoArquivo: { categorias: (n: number) => string, campos: (n: number) => string, formularios: (n: number) => string, outros: (n: number) => string }
  erroArquivoTitulo: string
  erroArquivoTexto: string
  usarExemplo: string

  // passo 2
  modoPergunta: string
  modos: Record<Modo, { titulo: string, descricao: string }>
  recomendado: string
  alertaSubstituir: string

  // passo 3
  workspaceVazioTitulo: string
  workspaceVazioTexto: string
  nadaEmComumTitulo: string
  nadaEmComumTexto: string
  nadaAFazerTitulo: string
  nadaAFazerTexto: string
  contagem: Record<'nova' | 'alterada' | 'removida' | 'inalterada', string>
  soAlteracoes: string
  grupoCategorias: string
  grupoOutros: string
  grupoCampos: (n: number) => string
  grupoFormularios: (n: number) => string
  grupoPastas: (n: number) => string
  componentes: Record<TipoDeComponente, string>
  /** Rótulo da marca, no feminino (categoria, lista, tela, pasta) e no masculino (campo, formulário...). */
  situacao: Record<Situacao, { f: string, m: string }>
  ignoradaAjuda: string
  mudancaNome: string
  mudancaTipo: string
  mudancaOpcoesNovas: (o: string) => string
  mudancaOpcoesRemovidas: (o: string) => string
  itensCadastrados: (n: number) => string
  tiposDeCampo: Partial<Record<TipoDeCampo, string>>
  tipoDeCampoOutro: string
  nenhumaDiferenca: string

  // confirmar
  copiaAntes: string
  copiaAntesAjuda: string
  perigoTexto: string
  digiteEmail: string
  importar: (modo: Modo) => string

  // importando e depois
  importandoTitulo: string
  importandoTexto: string
  etapasImportacao: string[]
  podeFechar: string
  sucessoTitulo: string
  sucessoTexto: (entra: number, muda: number, sai: number) => string
  copiaBaixada: string
  desfazer: string
  desfeitoTitulo: string
  desfeitoTexto: string
  verCategorias: string
  erroTitulo: string
  erroTexto: (etapa: string) => string
  tentarDeNovo: string
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
      credenciais: 'Credenciais', releases: 'Releases', documentacao: 'Documentação',
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
      credenciais: 'Credentials', releases: 'Releases', documentacao: 'Documentation',
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
      credenciais: 'Credenciales', releases: 'Releases', documentacao: 'Documentación',
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
  importarTexto: 'Envie o arquivo da exportação. Antes de importar, você escolhe o que fazer com o que já existe e revisa as alterações.',
  importarBotao: 'Importar Workspace',
  avisoTitulo: 'Nada é duplicado',
  avisoTexto: 'O sistema reconhece as categorias que já existem. Você escolhe se elas são alteradas ou não.',
  exportadoTitulo: 'Estrutura baixada',
  exportadoTexto: 'O arquivo está na sua pasta de downloads.',

  modalTitulo: 'Importar estrutura',
  modalDescricao: 'Traga categorias, campos e formulários de outro workspace.',
  passos: { arquivo: 'Arquivo e opção', soArquivo: 'Arquivo', revisar: 'Revisar' },
  continuar: 'Continuar',
  voltarPasso: 'Voltar',
  cancelar: 'Cancelar',
  fechar: 'Fechar',

  soltarTitulo: 'Arraste o arquivo da estrutura até aqui',
  soltarDescricao: 'Ou clique para escolher. Use o arquivo .json baixado em Exportar Workspace.',
  lendoArquivo: 'Lendo o arquivo...',
  arquivoDe: (w, d) => `Estrutura de ${w}, exportada em ${d}`,
  trocarArquivo: 'Trocar arquivo',
  resumoArquivo: {
    categorias: n => `${n} ${n === 1 ? 'categoria' : 'categorias'}`,
    campos: n => `${n} ${n === 1 ? 'campo' : 'campos'}`,
    formularios: n => `${n} ${n === 1 ? 'formulário' : 'formulários'}`,
    outros: n => `${n} ${n === 1 ? 'outro componente' : 'outros componentes'}`,
  },
  erroArquivoTitulo: 'Esse arquivo não é uma estrutura do ENSPACE',
  erroArquivoTexto: 'Use o arquivo .json baixado em Exportar Workspace, sem editar.',
  usarExemplo: 'Protótipo: usar arquivo de exemplo',

  modoPergunta: 'O que fazer com o que já existe?',
  modos: {
    adicionar: { titulo: 'Adicionar o que falta', descricao: 'Mantém o que já existe.' },
    somar: { titulo: 'Atualizar e adicionar', descricao: 'Aplica as alterações do arquivo. Não apaga nada.' },
    substituir: { titulo: 'Substituir tudo', descricao: 'Deixa o workspace igual ao arquivo.' },
  },
  recomendado: 'Mais seguro',
  alertaSubstituir: 'Apaga tudo o que não está no arquivo, inclusive os itens cadastrados.',

  workspaceVazioTitulo: 'Workspace vazio',
  workspaceVazioTexto: 'A importação adiciona:',
  nadaEmComumTitulo: 'Nenhuma categoria do arquivo existe aqui',
  nadaEmComumTexto: 'A importação adiciona tudo e não altera o que já existe:',
  nadaAFazerTitulo: 'Nada a importar',
  nadaAFazerTexto: 'O workspace já tem tudo o que está no arquivo.',
  contagem: { nova: 'Novos', alterada: 'Alterados', removida: 'Removidos', inalterada: 'Inalterados' },
  soAlteracoes: 'A lista mostra só as alterações.',
  grupoCategorias: 'Categorias',
  grupoOutros: 'Outros componentes',
  grupoCampos: n => `Campos (${n})`,
  grupoFormularios: n => `Formulários (${n})`,
  grupoPastas: n => `Pastas (${n})`,
  componentes: {
    listas: 'Listas', telas: 'Telas', grupos: 'Grupos de permissão', emails: 'Modelos de e-mail',
    relatorios: 'Relatórios', documentos: 'Modelos de documento', menus: 'Itens de menu',
  },
  situacao: {
    nova: { f: 'Nova', m: 'Novo' },
    alterada: { f: 'Alterada', m: 'Alterado' },
    removida: { f: 'Removida', m: 'Removido' },
    igual: { f: 'Inalterada', m: 'Inalterado' },
    mantida: { f: 'Inalterada', m: 'Inalterado' },
    ignorada: { f: 'Inalterada', m: 'Inalterado' },
  },
  ignoradaAjuda: 'O arquivo traz outra versão. Esta opção mantém a atual.',
  mudancaNome: 'Nome',
  mudancaTipo: 'Tipo',
  mudancaOpcoesNovas: o => `Opções novas: ${o}`,
  mudancaOpcoesRemovidas: o => `Opções removidas: ${o}`,
  itensCadastrados: n => `${n} itens cadastrados`,
  tiposDeCampo: {
    inputText: 'Texto curto', EnTextArea: 'Texto longo', EnHtml: 'Texto com formatação', email: 'E-mail',
    EnlMask: 'Texto com formato', EnlNumber: 'Número', EnCurrency: 'Valor em dinheiro', EnlCalendar: 'Data',
    EnlDropdown: 'Lista de opções', multiSelect: 'Várias opções', radioButton: 'Escolha única',
    inputSwitch: 'Sim ou não', EnRel: 'Ligação com outra categoria', EnRelMulti: 'Ligação com vários itens',
    uploadFile: 'Anexo', EnPerson: 'Pessoa', EnRepeater: 'Grupo que se repete',
  },
  tipoDeCampoOutro: 'Outro tipo',
  nenhumaDiferenca: 'Nenhuma alteração com esta opção.',

  copiaAntes: 'Baixar uma cópia do workspace antes',
  copiaAntesAjuda: 'Para voltar ao estado atual, se precisar.',
  perigoTexto: 'Para confirmar, digite seu e-mail:',
  digiteEmail: 'Digite seu e-mail para confirmar',
  importar: m => (m === 'substituir' ? 'Substituir workspace' : 'Importar'),

  importandoTitulo: 'Importando a estrutura',
  importandoTexto: 'Isso leva alguns minutos em workspaces grandes.',
  etapasImportacao: ['Conferindo o arquivo', 'Criando categorias', 'Criando campos e listas', 'Montando formulários e telas', 'Ajustando permissões e menus'],
  podeFechar: 'Pode fechar esta janela. Avisamos no sino quando terminar.',
  sucessoTitulo: 'Estrutura importada',
  sucessoTexto: (e, m, s) => [
    `${e} ${e === 1 ? 'categoria nova' : 'categorias novas'}`,
    `${m} ${m === 1 ? 'alterada' : 'alteradas'}`,
    ...(s ? [`${s} ${s === 1 ? 'removida' : 'removidas'}`] : []),
  ].join(', ') + '.',
  copiaBaixada: 'A cópia de antes da importação está na sua pasta de downloads.',
  desfazer: 'Desfazer importação',
  desfeitoTitulo: 'Importação desfeita',
  desfeitoTexto: 'O workspace voltou a ser como era antes.',
  verCategorias: 'Ver categorias',
  erroTitulo: 'A importação parou',
  erroTexto: e => `Parou em "${e}". Nada foi alterado no workspace.`,
  tentarDeNovo: 'Tentar de novo',
}

const en: Textos = {
  locale: 'en',
  casca: casca.en,
  trilhaConfiguracoes: 'Settings',
  trilhaInterface: 'Interface',
  trilhaCasosDeUso: 'Use Cases',

  titulo: 'Use Cases',
  subtitulo: 'The Use Cases screen lets you import and export workspaces, and browse every available category to understand what each one is for from its description.',
  migracaoTitulo: 'Workspace Migration',
  migracaoDescricao: 'Export or import the structure of this workspace.',
  exportarTitulo: 'Export',
  exportarSub: 'Download the current structure',
  exportarTexto: 'The system downloads a file with every category and its details. You can use this file to import into another workspace.',
  exportarBotao: 'Export Workspace',
  importarTitulo: 'Import',
  importarSub: 'Upload an existing structure',
  importarTexto: 'Upload the export file. Before importing, you choose what happens to what already exists and review the changes.',
  importarBotao: 'Import Workspace',
  avisoTitulo: 'Nothing is duplicated',
  avisoTexto: 'The system recognizes the categories that already exist. You choose whether they change.',
  exportadoTitulo: 'Structure downloaded',
  exportadoTexto: 'The file is in your downloads folder.',

  modalTitulo: 'Import structure',
  modalDescricao: 'Bring categories, fields and forms from another workspace.',
  passos: { arquivo: 'File and option', soArquivo: 'File', revisar: 'Review' },
  continuar: 'Continue',
  voltarPasso: 'Back',
  cancelar: 'Cancel',
  fechar: 'Close',

  soltarTitulo: 'Drag the structure file here',
  soltarDescricao: 'Or click to choose. Use the .json file downloaded from Export Workspace.',
  lendoArquivo: 'Reading the file...',
  arquivoDe: (w, d) => `Structure of ${w}, exported on ${d}`,
  trocarArquivo: 'Change file',
  resumoArquivo: {
    categorias: n => `${n} ${n === 1 ? 'category' : 'categories'}`,
    campos: n => `${n} ${n === 1 ? 'field' : 'fields'}`,
    formularios: n => `${n} ${n === 1 ? 'form' : 'forms'}`,
    outros: n => `${n} ${n === 1 ? 'other component' : 'other components'}`,
  },
  erroArquivoTitulo: 'This file is not an ENSPACE structure',
  erroArquivoTexto: 'Use the .json file downloaded from Export Workspace, without editing it.',
  usarExemplo: 'Prototype: use sample file',

  modoPergunta: 'What should happen to what already exists?',
  modos: {
    adicionar: { titulo: 'Add what is missing', descricao: 'Keeps what already exists.' },
    somar: { titulo: 'Update and add', descricao: 'Applies the changes in the file. Deletes nothing.' },
    substituir: { titulo: 'Replace everything', descricao: 'Makes the workspace match the file.' },
  },
  recomendado: 'Safest',
  alertaSubstituir: 'Deletes everything that is not in the file, including its records.',

  workspaceVazioTitulo: 'Empty workspace',
  workspaceVazioTexto: 'The import adds:',
  nadaEmComumTitulo: 'No category from the file exists here',
  nadaEmComumTexto: 'The import adds everything and changes nothing that already exists:',
  nadaAFazerTitulo: 'Nothing to import',
  nadaAFazerTexto: 'The workspace already has everything in the file.',
  contagem: { nova: 'New', alterada: 'Changed', removida: 'Removed', inalterada: 'Unchanged' },
  soAlteracoes: 'The list shows changes only.',
  grupoCategorias: 'Categories',
  grupoOutros: 'Other components',
  grupoCampos: n => `Fields (${n})`,
  grupoFormularios: n => `Forms (${n})`,
  grupoPastas: n => `Folders (${n})`,
  componentes: {
    listas: 'Lists', telas: 'Screens', grupos: 'Permission groups', emails: 'Email templates',
    relatorios: 'Reports', documentos: 'Document templates', menus: 'Menu items',
  },
  situacao: {
    nova: { f: 'New', m: 'New' },
    alterada: { f: 'Changed', m: 'Changed' },
    removida: { f: 'Removed', m: 'Removed' },
    igual: { f: 'Unchanged', m: 'Unchanged' },
    mantida: { f: 'Unchanged', m: 'Unchanged' },
    ignorada: { f: 'Unchanged', m: 'Unchanged' },
  },
  ignoradaAjuda: 'The file has another version. This option keeps the current one.',
  mudancaNome: 'Name',
  mudancaTipo: 'Type',
  mudancaOpcoesNovas: o => `New options: ${o}`,
  mudancaOpcoesRemovidas: o => `Options removed: ${o}`,
  itensCadastrados: n => `${n} records`,
  tiposDeCampo: {
    inputText: 'Short text', EnTextArea: 'Long text', EnHtml: 'Formatted text', email: 'Email',
    EnlMask: 'Formatted input', EnlNumber: 'Number', EnCurrency: 'Money', EnlCalendar: 'Date',
    EnlDropdown: 'Option list', multiSelect: 'Multiple options', radioButton: 'Single choice',
    inputSwitch: 'Yes or no', EnRel: 'Link to another category', EnRelMulti: 'Link to many records',
    uploadFile: 'Attachment', EnPerson: 'Person', EnRepeater: 'Repeating group',
  },
  tipoDeCampoOutro: 'Other type',
  nenhumaDiferenca: 'No changes with this option.',

  copiaAntes: 'Download a copy of the workspace first',
  copiaAntesAjuda: 'To go back to the current state, if you need to.',
  perigoTexto: 'To confirm, type your email:',
  digiteEmail: 'Type your email to confirm',
  importar: m => (m === 'substituir' ? 'Replace workspace' : 'Import'),

  importandoTitulo: 'Importing the structure',
  importandoTexto: 'This takes a few minutes in large workspaces.',
  etapasImportacao: ['Checking the file', 'Creating categories', 'Creating fields and lists', 'Building forms and screens', 'Adjusting permissions and menus'],
  podeFechar: 'You can close this window. We will let you know in the bell when it is done.',
  sucessoTitulo: 'Structure imported',
  sucessoTexto: (e, m, s) => [
    `${e} new ${e === 1 ? 'category' : 'categories'}`,
    `${m} changed`,
    ...(s ? [`${s} removed`] : []),
  ].join(', ') + '.',
  copiaBaixada: 'The copy from before the import is in your downloads folder.',
  desfazer: 'Undo import',
  desfeitoTitulo: 'Import undone',
  desfeitoTexto: 'The workspace is back to how it was before.',
  verCategorias: 'View categories',
  erroTitulo: 'The import stopped',
  erroTexto: e => `It stopped at "${e}". Nothing was changed in the workspace.`,
  tentarDeNovo: 'Try again',
}

const es: Textos = {
  locale: 'es',
  casca: casca.es,
  trilhaConfiguracoes: 'Configuraciones',
  trilhaInterface: 'Interfaz',
  trilhaCasosDeUso: 'Casos de Uso',

  titulo: 'Casos de Uso',
  subtitulo: 'La pantalla de Casos de Uso le permite importar y exportar workspaces, además de consultar todas las categorías disponibles y entender la finalidad de cada una a partir de sus descripciones.',
  migracaoTitulo: 'Migración de Workspace',
  migracaoDescricao: 'Exporte o importe la estructura de este workspace.',
  exportarTitulo: 'Exportar',
  exportarSub: 'Descargue la estructura actual',
  exportarTexto: 'El sistema descargará un archivo con todas las categorías y su información. Ese archivo puede usarse para importar en otro workspace.',
  exportarBotao: 'Exportar Workspace',
  importarTitulo: 'Importar',
  importarSub: 'Envíe una estructura existente',
  importarTexto: 'Envíe el archivo de la exportación. Antes de importar, usted elige qué hacer con lo que ya existe y revisa los cambios.',
  importarBotao: 'Importar Workspace',
  avisoTitulo: 'Nada se duplica',
  avisoTexto: 'El sistema reconoce las categorías que ya existen. Usted elige si cambian o no.',
  exportadoTitulo: 'Estructura descargada',
  exportadoTexto: 'El archivo está en su carpeta de descargas.',

  modalTitulo: 'Importar estructura',
  modalDescricao: 'Traiga categorías, campos y formularios de otro workspace.',
  passos: { arquivo: 'Archivo y opción', soArquivo: 'Archivo', revisar: 'Revisar' },
  continuar: 'Continuar',
  voltarPasso: 'Volver',
  cancelar: 'Cancelar',
  fechar: 'Cerrar',

  soltarTitulo: 'Arrastre aquí el archivo de la estructura',
  soltarDescricao: 'O haga clic para elegirlo. Use el archivo .json descargado en Exportar Workspace.',
  lendoArquivo: 'Leyendo el archivo...',
  arquivoDe: (w, d) => `Estructura de ${w}, exportada el ${d}`,
  trocarArquivo: 'Cambiar archivo',
  resumoArquivo: {
    categorias: n => `${n} ${n === 1 ? 'categoría' : 'categorías'}`,
    campos: n => `${n} ${n === 1 ? 'campo' : 'campos'}`,
    formularios: n => `${n} ${n === 1 ? 'formulario' : 'formularios'}`,
    outros: n => `${n} ${n === 1 ? 'otro componente' : 'otros componentes'}`,
  },
  erroArquivoTitulo: 'Este archivo no es una estructura de ENSPACE',
  erroArquivoTexto: 'Use el archivo .json descargado en Exportar Workspace, sin editarlo.',
  usarExemplo: 'Prototipo: usar archivo de ejemplo',

  modoPergunta: '¿Qué hacer con lo que ya existe?',
  modos: {
    adicionar: { titulo: 'Agregar lo que falta', descricao: 'Mantiene lo que ya existe.' },
    somar: { titulo: 'Actualizar y agregar', descricao: 'Aplica los cambios del archivo. No borra nada.' },
    substituir: { titulo: 'Reemplazar todo', descricao: 'Deja el workspace igual al archivo.' },
  },
  recomendado: 'Más seguro',
  alertaSubstituir: 'Borra todo lo que no está en el archivo, incluidos los registros.',

  workspaceVazioTitulo: 'Workspace vacío',
  workspaceVazioTexto: 'La importación agrega:',
  nadaEmComumTitulo: 'Ninguna categoría del archivo existe aquí',
  nadaEmComumTexto: 'La importación agrega todo y no cambia lo que ya existe:',
  nadaAFazerTitulo: 'Nada que importar',
  nadaAFazerTexto: 'El workspace ya tiene todo lo que está en el archivo.',
  contagem: { nova: 'Nuevos', alterada: 'Modificados', removida: 'Eliminados', inalterada: 'Sin cambios' },
  soAlteracoes: 'La lista muestra solo los cambios.',
  grupoCategorias: 'Categorías',
  grupoOutros: 'Otros componentes',
  grupoCampos: n => `Campos (${n})`,
  grupoFormularios: n => `Formularios (${n})`,
  grupoPastas: n => `Carpetas (${n})`,
  componentes: {
    listas: 'Listas', telas: 'Pantallas', grupos: 'Grupos de permiso', emails: 'Plantillas de correo',
    relatorios: 'Informes', documentos: 'Plantillas de documento', menus: 'Elementos de menú',
  },
  situacao: {
    nova: { f: 'Nueva', m: 'Nuevo' },
    alterada: { f: 'Modificada', m: 'Modificado' },
    removida: { f: 'Eliminada', m: 'Eliminado' },
    igual: { f: 'Sin cambios', m: 'Sin cambios' },
    mantida: { f: 'Sin cambios', m: 'Sin cambios' },
    ignorada: { f: 'Sin cambios', m: 'Sin cambios' },
  },
  ignoradaAjuda: 'El archivo trae otra versión. Esta opción mantiene la actual.',
  mudancaNome: 'Nombre',
  mudancaTipo: 'Tipo',
  mudancaOpcoesNovas: o => `Opciones nuevas: ${o}`,
  mudancaOpcoesRemovidas: o => `Opciones eliminadas: ${o}`,
  itensCadastrados: n => `${n} registros`,
  tiposDeCampo: {
    inputText: 'Texto corto', EnTextArea: 'Texto largo', EnHtml: 'Texto con formato', email: 'Correo',
    EnlMask: 'Texto con máscara', EnlNumber: 'Número', EnCurrency: 'Valor monetario', EnlCalendar: 'Fecha',
    EnlDropdown: 'Lista de opciones', multiSelect: 'Varias opciones', radioButton: 'Opción única',
    inputSwitch: 'Sí o no', EnRel: 'Vínculo con otra categoría', EnRelMulti: 'Vínculo con varios registros',
    uploadFile: 'Adjunto', EnPerson: 'Persona', EnRepeater: 'Grupo que se repite',
  },
  tipoDeCampoOutro: 'Otro tipo',
  nenhumaDiferenca: 'Ningún cambio con esta opción.',

  copiaAntes: 'Descargar una copia del workspace antes',
  copiaAntesAjuda: 'Para volver al estado actual, si hace falta.',
  perigoTexto: 'Para confirmar, escriba su correo:',
  digiteEmail: 'Escriba su correo para confirmar',
  importar: m => (m === 'substituir' ? 'Reemplazar workspace' : 'Importar'),

  importandoTitulo: 'Importando la estructura',
  importandoTexto: 'Esto tarda unos minutos en workspaces grandes.',
  etapasImportacao: ['Revisando el archivo', 'Creando categorías', 'Creando campos y listas', 'Armando formularios y pantallas', 'Ajustando permisos y menús'],
  podeFechar: 'Puede cerrar esta ventana. Le avisamos en la campana cuando termine.',
  sucessoTitulo: 'Estructura importada',
  sucessoTexto: (e, m, s) => [
    `${e} ${e === 1 ? 'categoría nueva' : 'categorías nuevas'}`,
    `${m} ${m === 1 ? 'modificada' : 'modificadas'}`,
    ...(s ? [`${s} ${s === 1 ? 'eliminada' : 'eliminadas'}`] : []),
  ].join(', ') + '.',
  copiaBaixada: 'La copia de antes de la importación está en su carpeta de descargas.',
  desfazer: 'Deshacer importación',
  desfeitoTitulo: 'Importación deshecha',
  desfeitoTexto: 'El workspace volvió a como estaba antes.',
  verCategorias: 'Ver categorías',
  erroTitulo: 'La importación se detuvo',
  erroTexto: e => `Se detuvo en "${e}". No se cambió nada en el workspace.`,
  tentarDeNovo: 'Intentar de nuevo',
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': pt, en, es }
