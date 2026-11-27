// Os textos desta tela nos 3 idiomas do ENSPACE (regra 35).
//
// A casca e os rótulos das permissões copiam o develop (08/10/2026). O resto é a
// copy proposta. Nenhum texto de interface leva travessão (regra 33).

import type { Idioma } from '../../composables/useIdioma'
import type { Acao } from './mocks'

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
  trilha: { configuracoes: string, gestao: string }

  // cabeçalho, como é hoje
  cargo: string
  permissoesAtivas: string
  mudancasPendentes: string
  alertaTitulo: string
  alertaTexto: (n: number) => string
  salvar: string
  descartar: string
  abas: { categorias: string, funcionalidades: string, dados: string, configuracoes: string, invalidas: string }

  // seções
  padrao: string
  padraoDesc: string
  categorias: string
  categoriasDesc: string
  configuracoesDesc: string
  invalidasDesc: string
  invalidasVazio: string
  grupos: Record<string, string>
  linhas: Record<string, string>
  outras: Record<string, string>
  maisAcoes: (n: number, marcadas: number) => string
  acoes: Record<Acao, string>
  colunaArea: string
  colunaOutras: string
  colunaCategoria: string
  colunaCampos: string
  colunaFormularios: string
  marcarGrupo: (grupo: string) => string
  marcarLinha: (linha: string) => string

  // a tabela de categorias
  padraoLinha: string
  padraoLinhaDesc: string
  /** Rodada 6 */
  padraoAcoes: string
  colunaRestricoes: string
  semRestricao: string
  restricaoDica: string
  formulariosDe: (n: number, total: number) => string
  formulariosEmParte: string
  camposDeTotal: (n: number, total: number) => string
  camposDaCategoria: (categoria: string) => string
  seguePadrao: string
  regraPropria: string
  liberadoEm: (n: number) => string
  tiradoEm: (n: number) => string
  liberadoCurto: (n: number) => string
  tiradoCurto: (n: number) => string
  dicas: Record<Acao, string>
  descLinhas: Record<string, string>
  parcialDica: (acao: string, n: number, total: number) => string
  parcialOrigemDica: (acao: string, nomes: string) => string
  semFormulario: string
  semFormularioDesc: string
  semFormularios: string
  origensTodas: string
  origensDe: (n: number, total: number) => string
  origensEmParte: string
  acaoEmOrigens: (acao: string, n: number, total: number) => string
  todosOsFormularios: string
  todosOsFormulariosDesc: string
  todosComTracoDica: string
  formNovoAviso: string
  voltarAcao: (acao: string, onde: string) => string
  exigidoPor: (acao: string) => string
  pessoasNoCargo: (n: number) => string
  expandir: (categoria: string) => string
  subCampos: string
  subCamposTodos: (n: number) => string
  subCamposEscolhidos: (n: number, total: number) => string
  escolherCampos: string
  subOutras: string
  subOutrasDesc: string
  outrasDeTotal: (n: number, total: number) => string
  outraExige: (acao: string) => string
  subAlcance: string
  subAlcanceDesc: string
  alcanceTodos: string
  alcanceSeus: string
  soOsSeus: (acao: string) => string
  soResponsavel: (acao: string) => string
  soAmbos: (acao: string) => string
  colunaItens: string
  itensTodos: string
  itensCriador: string
  itensResponsavel: string
  itensAmbos: string
  itensDoPadrao: string
  subResponsavel: string
  subResponsavelDesc: (campos: string) => string
  editorTitulo: (onde: string) => string
  editorDesc: string
  campoPessoa: string
  campoPessoaPlaceholder: string
  qualquerCampoPessoa: string
  semCampoPessoa: string
  seguindoPadraoItens: string
  voltarPadraoItens: string
  acaoDesligada: (acao: string) => string
  abaItens: string
  pessoasTitulo: (n: number) => string
  pessoasDesc: string
  buscarPessoa: string
  nenhumaPessoa: string
  verPessoas: string
  abrirGestao: string
  licencas: Record<string, string>
  situacoes: Record<string, string>
  padraoColunaDica: string
  abaQuemAcessa: string
  quemAcessaDesc: string
  colunaCargo: string
  colunaPessoas: string
  esteCargo: string
  esconderIguais: string
  semDiferentes: string
  tem: string
  naoTem: string
  voltarAoPadrao: string
  camposTodos: string
  camposDe: (n: number, total: number) => string
  camposNenhum: string
  formsSeguem: string
  formsProprios: (n: number) => string
  meta: (campos: number, forms: number) => string
  ajustar: string
  ajustarAria: (categoria: string) => string
  buscar: string
  filtros: { todas: string, proprias: string, comAcesso: string, semAcesso: string, comItens: string, alteradas: string }
  mostrando: (n: number, total: number) => string
  marcarColuna: (acao: string, n: number) => string
  desmarcarColuna: (acao: string, n: number) => string
  toastColuna: (acao: string, n: number, ligou: boolean) => string
  alterada: string
  desfazer: string
  vazioBuscaTitulo: string
  vazioBuscaDesc: string
  limparBusca: string
  vazioFiltroTitulo: string
  vazioFiltroDesc: string
  verTodas: string
  vazioWsTitulo: string
  vazioWsDesc: string
  semPermissaoTitulo: string
  semPermissaoDesc: string

  // camada da categoria
  detalheDesc: string
  abaCampos: string
  abaFormularios: string
  modoTodos: string
  modoTodosDesc: string
  modoEscolher: string
  modoEscolherDesc: string
  todosResumo: (n: number) => string
  buscarCampo: string
  colunaCampo: string
  acaoBloqueada: (acao: string) => string
  doSistema: string
  criadoEm: string
  atualizadoEm: string
  colunaFormulario: string
  colunaSegue: string
  formsDesc: string
  semAcesso: string
  concluir: string
  vazioCampo: string
  /** Nome do tipo de campo, como a árvore do develop mostra. */
  tipos: Record<string, string>

  // confirmação
  confirmarTitulo: (n: number) => string
  confirmarImpacto: (pessoas: number) => string
  cancelar: string
  confirmar: string
  padraoNome: string
  partes: {
    liberou: (acoes: string) => string
    tirou: (acoes: string) => string
    ganhouRegra: string
    voltouAoPadrao: string
    segueOPadrao: (n: number) => string
    outrasDoPadrao: string
    camposEscolhidos: (n: number) => string
    todosOsCampos: string
    origensEmParte: (n: number) => string
    origensTodas: string
    alcance: string
  }
  toastSalvo: string
  toastSalvoDesc: string
  toastErro: string
  toastErroDesc: string
  toastDescartado: string
}

const itensPt = {
  inicio: 'Início', spaceflows: 'Spaceflows', categorias: 'Categorias', tarefas: 'Tarefas', agenda: 'Agenda',
  knowledge: 'Knowledge', visaoGeral: 'Visão Geral', sistema: 'Sistema', estrutura: 'Estrutura',
  gestaoDeMembros: 'Gestão de Membros', interface: 'Interface', emails: 'E-mails', integracoes: 'Integrações',
  agentesDeIa: 'Agentes de IA', logs: 'Logs', credenciais: 'Credenciais', releases: 'Releases',
  documentacao: 'Documentação',
}

const pt: Textos = {
  locale: 'pt-BR',
  casca: {
    menuLateral: 'Menu lateral', buscar: 'Buscar...', membro: 'Membro', configuracoes: 'Configurações',
    ajuda: 'Ajuda', trilha: 'Trilha', recolherMenu: 'Recolher menu', abrirMenu: 'Abrir menu', voltar: 'Voltar',
    avancar: 'Avançar', recarregar: 'Recarregar', suporte: 'Suporte', notificacoes: 'Notificações',
    idioma: 'Idioma', tema: 'Tema', conta: 'Conta', itens: itensPt,
  },
  trilha: { configuracoes: 'Configurações', gestao: 'Gestão de membros' },

  cargo: 'Cargo:',
  permissoesAtivas: 'Permissões Ativas',
  mudancasPendentes: 'Mudanças Pendentes',
  alertaTitulo: 'Alterações pendentes',
  alertaTexto: n => n === 1 ? '1 alteração não salva.' : `${n} alterações não salvas.`,
  salvar: 'Salvar Alterações',
  descartar: 'Descartar',
  abas: { categorias: 'Categorias', funcionalidades: 'Funcionalidades', dados: 'Dados', configuracoes: 'Configurações', invalidas: 'Inválidas' },

  padrao: 'Fora das categorias',
  padraoDesc: 'O que o cargo faz nas áreas do workspace que não são categorias.',
  categorias: 'Categorias',
  categoriasDesc: 'O que o cargo faz nos itens de cada categoria. Clique na categoria para ver os formulários, os campos e quais itens.',
  configuracoesDesc: 'Atribua permissões de configuração a este cargo',
  invalidasDesc: 'Permissões obsoletas ou que você não tem permissão para acessar',
  invalidasVazio: 'Nenhuma permissão obsoleta encontrada',
  grupos: {
    geral: 'Geral', automacaoIa: 'Automação e IA',
    padrao: 'Fora das categorias', sistemas: 'Sistemas', dados: 'Dados', acesso: 'Acesso', interface: 'Interface',
    emails: 'Emails', integracoes: 'Integrações', logs: 'Logs', credenciais: 'Credenciais',
  },
  linhas: {
    painelDeTarefas: 'Painel de tarefas', assinaturas: 'Assinaturas', relatorios: 'Relatórios', inicio: 'Início',
    faturamento: 'Faturamento', migracoes: 'Migrações',
    agenda: 'Agenda', ia: 'IA', spaceflows: 'Spaceflows', tarefasRapidas: 'Tarefas rápidas',
    tarefasProgramadas: 'Tarefas programadas', calendario: 'Calendário', configuracao: 'Configuração',
    dicionario: 'Dicionário', espacoDeTrabalho: 'Espaço de Trabalho', modulos: 'Módulos', listas: 'Listas',
    spaceflowsConfig: 'Spaceflows', tipos: 'Categorias', cargos: 'Cargos', grupos: 'Grupos', membros: 'Membros',
    casosDeUso: 'Casos de Uso', menu: 'Menu', telas: 'Telas', caixas: 'Caixas', enviados: 'Enviados',
    modelos: 'Modelos', integracoes: 'Integrações', logs: 'Logs', credenciais: 'Credenciais',
  },
  outras: { cancelarAssinatura: 'Cancelar', verExecucoes: 'Ver execuções', cancelarExecucao: 'Cancelar execução', gerenciarAgentes: 'Gerenciar agentes', usarIaEmCampos: 'Usar IA em campos e anexos', personalizarParaTodos: 'Personalizar para todos', comprarCreditos: 'Comprar créditos', importarMembros: 'Importar membros', gerenciarAusencias: 'Gerenciar ausências', mesclarDuplicados: 'Mesclar duplicados', executarMigracao: 'Executar migração', verHistorico: 'Ver histórico', excluirDeVez: 'Excluir definitivamente', usarChat: 'Usar Chat da IA', iniciarSpaceflow: 'Iniciar Spaceflow', reenviar: 'Reenviar', exportar: 'Exportar', importar: 'Importar', arquivar: 'Arquivar', comentar: 'Comentar', duplicar: 'Duplicar' },
  maisAcoes: (n, m) => `+${n} ${n === 1 ? 'ação' : 'ações'}${m ? ` (${m} ${m === 1 ? 'marcada' : 'marcadas'})` : ''}`,
  acoes: { criar: 'Criar', ver: 'Ver', atualizar: 'Atualizar', excluir: 'Excluir' },
  colunaArea: 'Área',
  colunaOutras: 'Outras ações',
  colunaCategoria: 'Categoria',
  colunaCampos: 'Campos',
  colunaFormularios: 'Formulários',
  marcarGrupo: g => `Marcar tudo em ${g}`,
  marcarLinha: l => `Marcar todas as ações de ${l}`,

  padraoLinha: 'Padrão para novas categorias',
  padraoLinhaDesc: 'O que este cargo recebe em cada categoria criada a partir de agora. As categorias que já existem não mudam.',
  padraoAcoes: 'Ações na categoria',
  colunaRestricoes: 'Restrições',
  semRestricao: 'Sem restrição',
  restricaoDica: 'Clique para ver os detalhes da categoria.',
  formulariosDe: (n, t) => `${n} de ${t} formulários`,
  formulariosEmParte: 'Formulários em parte',
  camposDeTotal: (n, t) => `${n} de ${t} campos`,
  camposDaCategoria: c => `Campos de ${c}`,
  seguePadrao: 'Segue o padrão',
  regraPropria: 'Regra própria',
  liberadoEm: n => n === 1 ? 'Liberado em 1 categoria' : `Liberado em ${n} categorias`,
  tiradoEm: n => n === 1 ? 'Tirado em 1 categoria' : `Tirado em ${n} categorias`,
  liberadoCurto: n => `Liberado em ${n}`,
  tiradoCurto: n => `Tirado em ${n}`,
  dicas: {
    criar: 'Criar: abrir item novo.',
    ver: 'Ver: abrir e ler os itens.',
    atualizar: 'Atualizar: editar itens que já existem. Exige Ver.',
    excluir: 'Excluir: apagar itens. Exige Ver.',
  },
  descLinhas: {
    painelDeTarefas: 'O painel com as tarefas do membro.',
    assinaturas: 'Documentos enviados para assinatura digital.',
    relatorios: 'Relatórios dos itens do workspace.',
    inicio: 'Os widgets da tela inicial, para todos os membros.',
    faturamento: 'Créditos e consumo do workspace.',
    migracoes: 'Pedidos de migração de dados, geral ou por tabela.',
    agenda: 'Eventos da Agenda do workspace.',
    ia: 'O chat da IA, os agentes de IA e a IA nos campos.',
    spaceflows: 'Iniciar e acompanhar fluxos de trabalho.',
    tarefasRapidas: 'Tarefas avulsas, fora de um fluxo.',
    tarefasProgramadas: 'Tarefas que os fluxos das categorias criam.',
    calendario: 'Calendário e dias úteis do workspace.',
    configuracao: 'Configurações gerais do sistema.',
    dicionario: 'Entradas dos dicionários de tradução.',
    espacoDeTrabalho: 'Nome, logo e dados do workspace.',
    modulos: 'Módulos ligados no workspace.',
    listas: 'Listas de opções usadas nos campos.',
    spaceflowsConfig: 'Montar e editar fluxos.',
    tipos: 'Estrutura das categorias: campos e formulários.',
    cargos: 'Cargos e as permissões de cada um.',
    grupos: 'Grupos de membros.',
    membros: 'Convidar, editar e remover membros.',
    casosDeUso: 'Casos de uso da Interface.',
    menu: 'Itens do menu lateral.',
    telas: 'Telas da Interface.',
    caixas: 'Caixas de e-mail conectadas.',
    enviados: 'E-mails que o workspace enviou.',
    modelos: 'Modelos de e-mail.',
    integracoes: 'Conexões com outros sistemas.',
    logs: 'Registro do que aconteceu no workspace.',
    credenciais: 'Chaves e senhas das integrações.',
  },
  parcialDica: (a, n, t) => `${a} em ${n} de ${t} campos. Clique para escolher os campos.`,
  parcialOrigemDica: (a, nomes) => `${a} só em: ${nomes}. Clique para liberar em todos os formulários.`,
  semFormulario: 'Itens sem formulário',
  semFormularioDesc: 'Criados pelo formulário padrão, pela API, por importação, pelo Spaceflow ou por agente de IA.',
  semFormularios: 'Sem formulários',
  origensTodas: 'Todos',
  origensDe: (n, t) => `${n} de ${t}`,
  origensEmParte: 'Em parte',
  acaoEmOrigens: (a, n, t) => `${a} em ${n} de ${t}`,
  todosOsFormularios: 'Todos os formulários',
  todosOsFormulariosDesc: 'Inclui os itens sem formulário e os formulários criados depois.',
  todosComTracoDica: 'Liberado só em parte. Clique para liberar em todos.',
  formNovoAviso: 'Formulário criado depois entra na ação marcada na categoria inteira. Na ação com traço, ele entra desmarcado.',
  voltarAcao: (a, o) => `Voltar ${a} ao padrão em ${o}`,
  exigidoPor: a => `Exigido por ${a}. Desmarque ${a} para tirar Ver.`,
  pessoasNoCargo: n => n === 1 ? '1 pessoa com este cargo' : `${n} pessoas com este cargo`,
  expandir: c => `Mostrar formulários, campos e quais itens de ${c}`,
  subCampos: 'Campos',
  subCamposTodos: n => `Todos os ${n} campos`,
  subCamposEscolhidos: (n, t) => `${n} de ${t} campos escolhidos`,
  escolherCampos: 'Escolher campos',
  subOutras: 'Outras ações',
  subOutrasDesc: 'O que o cargo faz com os itens além das 4 ações.',
  outrasDeTotal: (n, t) => `${n} de ${t} outras ações`,
  outraExige: a => `Libere ${a} na categoria para usar esta ação.`,
  subAlcance: 'Só se for o criador',
  subAlcanceDesc: 'Marque para a ação valer só nos itens que a pessoa criou.',
  alcanceTodos: 'Todos',
  alcanceSeus: 'Os seus',
  soOsSeus: a => `${a} só nos itens que a pessoa criou.`,
  soResponsavel: a => `${a} só nos itens em que a pessoa é responsável.`,
  soAmbos: a => `${a} só nos itens que a pessoa criou ou em que é responsável.`,
  colunaItens: 'Quais itens',
  itensTodos: 'Todos',
  itensCriador: 'Criador',
  itensResponsavel: 'Responsável',
  itensAmbos: 'Criador ou responsável',
  itensDoPadrao: 'do padrão',
  subResponsavel: 'Só se for o responsável',
  subResponsavelDesc: c => `Conta como responsável: ${c}.`,
  editorTitulo: o => `Quais itens: ${o}`,
  editorDesc: 'Sem nada marcado, a ação vale em todos os itens. Com as 2 regras, vale se a pessoa for a criadora ou a responsável.',
  campoPessoa: 'Campos Pessoa que contam como responsável',
  campoPessoaPlaceholder: 'Escolha os campos',
  qualquerCampoPessoa: 'No padrão, conta qualquer campo Pessoa da categoria.',
  semCampoPessoa: 'Esta categoria não tem campo Pessoa. Só a regra de criador vale aqui.',
  seguindoPadraoItens: 'Segue o padrão. Mudar aqui cria a regra desta categoria.',
  voltarPadraoItens: 'Voltar ao padrão',
  acaoDesligada: a => `Libere ${a} para usar a regra.`,
  abaItens: 'Quais itens',
  pessoasTitulo: n => n === 1 ? '1 pessoa com este cargo' : `${n} pessoas com este cargo`,
  pessoasDesc: 'Quem sente na hora qualquer mudança salva nesta tela.',
  buscarPessoa: 'Buscar por nome ou e-mail',
  nenhumaPessoa: 'Ninguém com esse nome ou e-mail.',
  verPessoas: 'Ver as pessoas com este cargo',
  abrirGestao: 'Abrir Gestão de Membros',
  licencas: { owner: 'Proprietário', full: 'Full', standard: 'Standard', viewer: 'Visualizador' },
  situacoes: { active: 'Ativo', inactive: 'Inativo', pending: 'Convite pendente', blocked: 'Bloqueado' },
  padraoColunaDica: 'Vale para toda categoria sem regra própria.',
  abaQuemAcessa: 'Quem acessa',
  quemAcessaDesc: 'O que cada cargo do workspace faz nesta categoria. Para mudar outro cargo, abra a tela dele.',
  colunaCargo: 'Cargo',
  colunaPessoas: 'Pessoas',
  esteCargo: 'Este cargo',
  esconderIguais: 'Esconder cargos iguais a este',
  semDiferentes: 'Todos os cargos fazem o mesmo que este.',
  tem: 'Tem',
  naoTem: 'Não tem',
  voltarAoPadrao: 'Voltar ao padrão',
  camposTodos: 'Todos',
  camposDe: (n, t) => `${n} de ${t}`,
  camposNenhum: 'Nenhum',
  formsSeguem: 'Seguem a categoria',
  formsProprios: n => n === 1 ? '1 com regra própria' : `${n} com regra própria`,
  meta: (c, f) => `${c} campos · ${f === 1 ? '1 formulário' : `${f} formulários`}`,
  ajustar: 'Ajustar',
  ajustarAria: c => `Ajustar campos e formulários de ${c}`,
  buscar: 'Buscar categoria',
  filtros: { todas: 'Todas', proprias: 'Regra própria', comAcesso: 'Com acesso', semAcesso: 'Sem acesso', comItens: 'Só alguns itens', alteradas: 'Alteradas' },
  mostrando: (n, t) => n === t ? `${t} categorias` : `Mostrando ${n} de ${t} categorias`,
  marcarColuna: (a, n) => `Marcar ${a} nas ${n} categorias da lista`,
  desmarcarColuna: (a, n) => `Desmarcar ${a} nas ${n} categorias da lista`,
  toastColuna: (a, n, l) => `${a} ${l ? 'marcado' : 'desmarcado'} em ${n} ${n === 1 ? 'categoria' : 'categorias'}`,
  alterada: 'Alterada, não salva',
  desfazer: 'Desfazer',
  vazioBuscaTitulo: 'Nenhuma categoria com esse nome',
  vazioBuscaDesc: 'Confira a grafia ou limpe a busca.',
  limparBusca: 'Limpar busca',
  vazioFiltroTitulo: 'Nenhuma categoria neste filtro',
  vazioFiltroDesc: 'Troque o filtro para ver as outras.',
  verTodas: 'Ver todas',
  vazioWsTitulo: 'Este workspace ainda não tem categorias',
  vazioWsDesc: 'Quando alguém criar uma, ela recebe o padrão para novas categorias.',
  semPermissaoTitulo: 'Você vê este cargo, mas não edita.',
  semPermissaoDesc: 'Para mudar permissões, peça a permissão Atualizar Cargos a quem administra o workspace.',

  detalheDesc: 'O que este cargo faz em cada campo desta categoria.',
  abaCampos: 'Campos',
  abaFormularios: 'Formulários',
  modoTodos: 'Todos os campos',
  modoTodosDesc: 'Inclusive os criados depois.',
  modoEscolher: 'Escolher campo a campo',
  modoEscolherDesc: 'Para esconder ou travar campos sensíveis.',
  todosResumo: n => `O cargo usa os ${n} campos em cada ação liberada na categoria.`,
  buscarCampo: 'Buscar campo',
  colunaCampo: 'Campo',
  acaoBloqueada: a => `Libere ${a} na categoria para escolher campos nesta coluna.`,
  doSistema: 'Do sistema',
  criadoEm: 'Criado em',
  atualizadoEm: 'Atualizado em',
  colunaFormulario: 'Formulário',
  colunaSegue: 'Segue a categoria',
  formsDesc: 'Marque a categoria para liberar todos os formulários. Marque só alguns para restringir o cargo a eles.',
  semAcesso: 'Este cargo não acessa esta categoria. Libere uma ação na tabela para escolher os campos.',
  concluir: 'Concluir',
  vazioCampo: 'Nenhum campo com esse nome.',
  tipos: {
    EnlDropdown: 'Lista de Seleção Única',
    inputText: 'Texto Curto',
    EnTextArea: 'Texto Longo',
    EnPerson: 'Pessoa/Empresa',
    EnlCalendar: 'Data (Calendário)',
    EnlNumber: 'Número',
    EnRel: 'Relacionamento',
    EnRelMulti: 'Relacionamento múltiplo',
    EnlMask: 'Texto com Máscara',
    email: 'E-mail',
    EnAddress: 'Endereço',
    uploadFile: 'Arquivo',
    uploadImage: 'Imagem',
    EnPDF: 'Tratamento de PDF',
    EnOnlyoffice: 'Editor de Documentos',
    radioButton: 'Botões de Seleção Única',
    EnlChips: 'Tags',
    inputSwitch: 'Alternativa Binária',
    EnHtml: 'Editor de texto HTML',
    EnRepeater: 'Repetidor',
    multiSelect: 'Lista de Seleção Múltipla',
    EnlTimeRange: 'Duração',
    EnTreeSelect: 'Seleção em árvore',
    EnlCheckbox: 'Caixas de Seleção',
  },

  confirmarTitulo: n => n === 1 ? 'Salvar 1 alteração?' : `Salvar ${n} alterações?`,
  confirmarImpacto: p => `Vale na hora para as ${p} pessoas com este cargo.`,
  cancelar: 'Cancelar',
  confirmar: 'Salvar',
  padraoNome: 'Padrão para novas categorias',
  partes: {
    liberou: a => `liberou ${a}`,
    tirou: a => `tirou ${a}`,
    ganhouRegra: 'passou a ter regra própria',
    voltouAoPadrao: 'voltou a seguir o padrão',
    segueOPadrao: () => 'vale só para as categorias criadas a partir de agora',
    outrasDoPadrao: 'mudou as outras ações',
    camposEscolhidos: n => `${n} campos escolhidos`,
    todosOsCampos: 'todos os campos',
    origensEmParte: n => n === 1 ? 'só em 1 formulário' : `só em ${n} formulários`,
    origensTodas: 'em todos os formulários',
    alcance: 'mudou a regra de criador',
  },
  toastSalvo: 'Permissões salvas',
  toastSalvoDesc: 'O cargo já vale com as mudanças.',
  toastErro: 'Não salvamos as mudanças',
  toastErroDesc: 'Suas marcações continuam aqui. Tente de novo.',
  toastDescartado: 'Mudanças descartadas',
}

const en: Textos = {
  locale: 'en',
  casca: {
    menuLateral: 'Sidebar', buscar: 'Search...', membro: 'Member', configuracoes: 'Settings', ajuda: 'Help',
    trilha: 'Breadcrumb', recolherMenu: 'Collapse menu', abrirMenu: 'Open menu', voltar: 'Back', avancar: 'Forward',
    recarregar: 'Reload', suporte: 'Support', notificacoes: 'Notifications', idioma: 'Language', tema: 'Theme',
    conta: 'Account',
    itens: {
      inicio: 'Home', spaceflows: 'Spaceflows', categorias: 'Categories', tarefas: 'Tasks', agenda: 'Calendar',
      knowledge: 'Knowledge', visaoGeral: 'Overview', sistema: 'System', estrutura: 'Structure',
      gestaoDeMembros: 'Member Management', interface: 'Interface', emails: 'E-mails', integracoes: 'Integrations',
      agentesDeIa: 'AI Agents', logs: 'Logs', credenciais: 'Credentials', releases: 'Releases',
      documentacao: 'Documentation',
    },
  },
  trilha: { configuracoes: 'Settings', gestao: 'Member management' },

  cargo: 'Role:',
  permissoesAtivas: 'Active Permissions',
  mudancasPendentes: 'Pending Changes',
  alertaTitulo: 'Pending changes',
  alertaTexto: n => n === 1 ? '1 unsaved change.' : `${n} unsaved changes.`,
  salvar: 'Save Changes',
  descartar: 'Discard',
  abas: { categorias: 'Categories', funcionalidades: 'Features', dados: 'Data', configuracoes: 'Settings', invalidas: 'Invalid' },

  padrao: 'Outside categories',
  padraoDesc: 'What the role does in workspace areas that are not categories.',
  categorias: 'Categories',
  categoriasDesc: 'What the role does with the items of each category. Click a category to see its forms, fields and which items.',
  configuracoesDesc: 'Assign settings permissions to this role',
  invalidasDesc: 'Obsolete permissions or permissions you are not allowed to access',
  invalidasVazio: 'No obsolete permissions found',
  grupos: {
    geral: 'General', automacaoIa: 'Automation and AI',
    padrao: 'Outside categories', sistemas: 'Systems', dados: 'Data', acesso: 'Access', interface: 'Interface',
    emails: 'Emails', integracoes: 'Integrations', logs: 'Logs', credenciais: 'Credentials',
  },
  linhas: {
    painelDeTarefas: 'Task dashboard', assinaturas: 'Signatures', relatorios: 'Reports', inicio: 'Home',
    faturamento: 'Billing', migracoes: 'Migrations',
    agenda: 'Calendar', ia: 'AI', spaceflows: 'Spaceflows', tarefasRapidas: 'Quick tasks',
    tarefasProgramadas: 'Scheduled tasks', calendario: 'Calendar', configuracao: 'Settings',
    dicionario: 'Dictionary', espacoDeTrabalho: 'Workspace', modulos: 'Modules', listas: 'Lists',
    spaceflowsConfig: 'Spaceflows', tipos: 'Categories', cargos: 'Roles', grupos: 'Groups', membros: 'Members',
    casosDeUso: 'Use Cases', menu: 'Menu', telas: 'Screens', caixas: 'Inboxes', enviados: 'Sent',
    modelos: 'Templates', integracoes: 'Integrations', logs: 'Logs', credenciais: 'Credentials',
  },
  outras: { cancelarAssinatura: 'Cancel', verExecucoes: 'View executions', cancelarExecucao: 'Cancel execution', gerenciarAgentes: 'Manage agents', usarIaEmCampos: 'Use AI in fields and attachments', personalizarParaTodos: 'Customize for everyone', comprarCreditos: 'Buy credits', importarMembros: 'Import members', gerenciarAusencias: 'Manage absences', mesclarDuplicados: 'Merge duplicates', executarMigracao: 'Run migration', verHistorico: 'View history', excluirDeVez: 'Delete permanently', usarChat: 'Use AI Chat', iniciarSpaceflow: 'Start Spaceflow', reenviar: 'Resend', exportar: 'Export', importar: 'Import', arquivar: 'Archive', comentar: 'Comment', duplicar: 'Duplicate' },
  maisAcoes: (n, m) => `+${n} ${n === 1 ? 'action' : 'actions'}${m ? ` (${m} checked)` : ''}`,
  acoes: { criar: 'Create', ver: 'View', atualizar: 'Update', excluir: 'Delete' },
  colunaArea: 'Area',
  colunaOutras: 'Other actions',
  colunaCategoria: 'Category',
  colunaCampos: 'Fields',
  colunaFormularios: 'Forms',
  marcarGrupo: g => `Check everything in ${g}`,
  marcarLinha: l => `Check every action of ${l}`,

  padraoLinha: 'Default for new categories',
  padraoLinhaDesc: 'What this role gets in each category created from now on. Existing categories do not change.',
  padraoAcoes: 'Actions in the category',
  colunaRestricoes: 'Restrictions',
  semRestricao: 'No restriction',
  restricaoDica: 'Click to see the category details.',
  formulariosDe: (n, t) => `${n} of ${t} forms`,
  formulariosEmParte: 'Forms in part',
  camposDeTotal: (n, t) => `${n} of ${t} fields`,
  camposDaCategoria: c => `Fields of ${c}`,
  seguePadrao: 'Follows default',
  regraPropria: 'Own rule',
  liberadoEm: n => n === 1 ? 'Allowed in 1 category' : `Allowed in ${n} categories`,
  tiradoEm: n => n === 1 ? 'Removed in 1 category' : `Removed in ${n} categories`,
  liberadoCurto: n => `Allowed in ${n}`,
  tiradoCurto: n => `Removed in ${n}`,
  dicas: {
    criar: 'Create: open new items.',
    ver: 'View: open and read items.',
    atualizar: 'Update: edit existing items. Requires View.',
    excluir: 'Delete: remove items. Requires View.',
  },
  descLinhas: {
    painelDeTarefas: 'The member task dashboard.',
    assinaturas: 'Documents sent for digital signature.',
    relatorios: 'Reports on workspace items.',
    inicio: 'Home screen widgets, for every member.',
    faturamento: 'Workspace credits and usage.',
    migracoes: 'Data migration requests, general or per table.',
    agenda: 'Workspace calendar events.',
    ia: 'AI chat, AI agents and AI in fields.',
    spaceflows: 'Start and follow workflows.',
    tarefasRapidas: 'Standalone tasks, outside a flow.',
    tarefasProgramadas: 'Tasks created by category flows.',
    calendario: 'Workspace calendar and business days.',
    configuracao: 'General system settings.',
    dicionario: 'Translation dictionary entries.',
    espacoDeTrabalho: 'Workspace name, logo and details.',
    modulos: 'Modules turned on in the workspace.',
    listas: 'Option lists used by fields.',
    spaceflowsConfig: 'Build and edit flows.',
    tipos: 'Category structure: fields and forms.',
    cargos: 'Roles and their permissions.',
    grupos: 'Member groups.',
    membros: 'Invite, edit and remove members.',
    casosDeUso: 'Interface use cases.',
    menu: 'Sidebar menu items.',
    telas: 'Interface screens.',
    caixas: 'Connected email inboxes.',
    enviados: 'Emails the workspace sent.',
    modelos: 'Email templates.',
    integracoes: 'Connections to other systems.',
    logs: 'Record of what happened in the workspace.',
    credenciais: 'Integration keys and passwords.',
  },
  parcialDica: (a, n, t) => `${a} on ${n} of ${t} fields. Click to choose the fields.`,
  parcialOrigemDica: (a, nomes) => `${a} only on: ${nomes}. Click to allow on all forms.`,
  semFormulario: 'Items without a form',
  semFormularioDesc: 'Created by the default form, by the API, by import, by Spaceflow or by an AI agent.',
  semFormularios: 'No forms',
  origensTodas: 'All',
  origensDe: (n, t) => `${n} of ${t}`,
  origensEmParte: 'Partial',
  acaoEmOrigens: (a, n, t) => `${a} on ${n} of ${t}`,
  todosOsFormularios: 'All forms',
  todosOsFormulariosDesc: 'Includes items without a form and forms created later.',
  todosComTracoDica: 'Allowed only in part. Click to allow on all.',
  formNovoAviso: 'A form created later joins the actions checked for the whole category. In a partial action, it starts unchecked.',
  voltarAcao: (a, o) => `Set ${a} back to default in ${o}`,
  exigidoPor: a => `Required by ${a}. Uncheck ${a} to remove View.`,
  pessoasNoCargo: n => n === 1 ? '1 person with this role' : `${n} people with this role`,
  expandir: c => `Show forms, fields and which items of ${c}`,
  subCampos: 'Fields',
  subCamposTodos: n => `All ${n} fields`,
  subCamposEscolhidos: (n, t) => `${n} of ${t} fields chosen`,
  escolherCampos: 'Choose fields',
  subOutras: 'Other actions',
  subOutrasDesc: 'What the role does with items beyond the 4 actions.',
  outrasDeTotal: (n, t) => `${n} of ${t} other actions`,
  outraExige: a => `Allow ${a} in the category to use this action.`,
  subAlcance: 'Only if creator',
  subAlcanceDesc: 'Check to apply the action only to items the person created.',
  alcanceTodos: 'All',
  alcanceSeus: 'Own',
  soOsSeus: a => `${a} only on items the person created.`,
  soResponsavel: a => `${a} only on items the person is responsible for.`,
  soAmbos: a => `${a} only on items the person created or is responsible for.`,
  colunaItens: 'Which items',
  itensTodos: 'All',
  itensCriador: 'Creator',
  itensResponsavel: 'Responsible',
  itensAmbos: 'Creator or responsible',
  itensDoPadrao: 'from default',
  subResponsavel: 'Only if responsible',
  subResponsavelDesc: c => `Counts as responsible: ${c}.`,
  editorTitulo: o => `Which items: ${o}`,
  editorDesc: 'With nothing checked, the action applies to all items. With both rules, it applies if the person is the creator or the responsible.',
  campoPessoa: 'Person fields that count as responsible',
  campoPessoaPlaceholder: 'Choose the fields',
  qualquerCampoPessoa: 'In the default, any Person field of the category counts.',
  semCampoPessoa: 'This category has no Person field. Only the creator rule applies here.',
  seguindoPadraoItens: 'Follows the default. Changing it here creates this category rule.',
  voltarPadraoItens: 'Back to default',
  acaoDesligada: a => `Allow ${a} to use the rule.`,
  abaItens: 'Which items',
  pessoasTitulo: n => n === 1 ? '1 person with this role' : `${n} people with this role`,
  pessoasDesc: 'Who feels any change saved on this screen right away.',
  buscarPessoa: 'Search by name or email',
  nenhumaPessoa: 'Nobody with that name or email.',
  verPessoas: 'See the people with this role',
  abrirGestao: 'Open Member Management',
  licencas: { owner: 'Owner', full: 'Full', standard: 'Standard', viewer: 'Viewer' },
  situacoes: { active: 'Active', inactive: 'Inactive', pending: 'Pending invite', blocked: 'Blocked' },
  padraoColunaDica: 'Applies to every category without its own rule.',
  abaQuemAcessa: 'Who has access',
  quemAcessaDesc: 'What each workspace role does in this category. To change another role, open its screen.',
  colunaCargo: 'Role',
  colunaPessoas: 'People',
  esteCargo: 'This role',
  esconderIguais: 'Hide roles equal to this one',
  semDiferentes: 'Every role does the same as this one.',
  tem: 'Has',
  naoTem: 'Does not have',
  voltarAoPadrao: 'Back to default',
  camposTodos: 'All',
  camposDe: (n, t) => `${n} of ${t}`,
  camposNenhum: 'None',
  formsSeguem: 'Follow the category',
  formsProprios: n => n === 1 ? '1 with own rule' : `${n} with own rule`,
  meta: (c, f) => `${c} fields · ${f === 1 ? '1 form' : `${f} forms`}`,
  ajustar: 'Adjust',
  ajustarAria: c => `Adjust fields and forms of ${c}`,
  buscar: 'Search category',
  filtros: { todas: 'All', proprias: 'Own rule', comAcesso: 'With access', semAcesso: 'No access', comItens: 'Some items only', alteradas: 'Changed' },
  mostrando: (n, t) => n === t ? `${t} categories` : `Showing ${n} of ${t} categories`,
  marcarColuna: (a, n) => `Check ${a} in the ${n} listed categories`,
  desmarcarColuna: (a, n) => `Uncheck ${a} in the ${n} listed categories`,
  toastColuna: (a, n, l) => `${a} ${l ? 'checked' : 'unchecked'} in ${n} ${n === 1 ? 'category' : 'categories'}`,
  alterada: 'Changed, not saved',
  desfazer: 'Undo',
  vazioBuscaTitulo: 'No category with that name',
  vazioBuscaDesc: 'Check the spelling or clear the search.',
  limparBusca: 'Clear search',
  vazioFiltroTitulo: 'No category in this filter',
  vazioFiltroDesc: 'Switch the filter to see the others.',
  verTodas: 'See all',
  vazioWsTitulo: 'This workspace has no categories yet',
  vazioWsDesc: 'When someone creates one, it gets the default for new categories.',
  semPermissaoTitulo: 'You can see this role, but not edit it.',
  semPermissaoDesc: 'To change permissions, ask a workspace admin for the Update Roles permission.',

  detalheDesc: 'What this role does with each field of this category.',
  abaCampos: 'Fields',
  abaFormularios: 'Forms',
  modoTodos: 'All fields',
  modoTodosDesc: 'Including the ones created later.',
  modoEscolher: 'Choose field by field',
  modoEscolherDesc: 'To hide or lock sensitive fields.',
  todosResumo: n => `The role uses all ${n} fields in each action allowed on the category.`,
  buscarCampo: 'Search field',
  colunaCampo: 'Field',
  acaoBloqueada: a => `Allow ${a} on the category to choose fields in this column.`,
  doSistema: 'System',
  criadoEm: 'Created at',
  atualizadoEm: 'Updated at',
  colunaFormulario: 'Form',
  colunaSegue: 'Follows the category',
  formsDesc: 'Check the category to allow all forms. Check only some to limit the role to them.',
  semAcesso: 'This role has no access to this category. Allow an action in the table to choose the fields.',
  concluir: 'Done',
  vazioCampo: 'No field with that name.',
  tipos: {
    EnlDropdown: 'Single Select List',
    inputText: 'Short Text',
    EnTextArea: 'Long Text',
    EnPerson: 'Person/Company',
    EnlCalendar: 'Date (Calendar)',
    EnlNumber: 'Number',
    EnRel: 'Relationship',
    EnRelMulti: 'Multiple relationship',
    EnlMask: 'Masked Text',
    email: 'E-mail',
    EnAddress: 'Address',
    uploadFile: 'File',
    uploadImage: 'Image',
    EnPDF: 'PDF Handling',
    EnOnlyoffice: 'Document Editor',
    radioButton: 'Single Choice Buttons',
    EnlChips: 'Tags',
    inputSwitch: 'Binary Choice',
    EnHtml: 'HTML Text Editor',
    EnRepeater: 'Repeater',
    multiSelect: 'Multi Select List',
    EnlTimeRange: 'Duration',
    EnTreeSelect: 'Tree Select',
    EnlCheckbox: 'Checkboxes',
  },

  confirmarTitulo: n => n === 1 ? 'Save 1 change?' : `Save ${n} changes?`,
  confirmarImpacto: p => `Takes effect right away for the ${p} people with this role.`,
  cancelar: 'Cancel',
  confirmar: 'Save',
  padraoNome: 'Default for new categories',
  partes: {
    liberou: a => `allowed ${a}`,
    tirou: a => `removed ${a}`,
    ganhouRegra: 'now has its own rule',
    voltouAoPadrao: 'follows the default again',
    segueOPadrao: () => 'applies only to categories created from now on',
    outrasDoPadrao: 'changed the other actions',
    camposEscolhidos: n => `${n} fields chosen`,
    todosOsCampos: 'all fields',
    origensEmParte: n => n === 1 ? 'only on 1 form' : `only on ${n} forms`,
    origensTodas: 'on all forms',
    alcance: 'changed the creator rule',
  },
  toastSalvo: 'Permissions saved',
  toastSalvoDesc: 'The role already works with the changes.',
  toastErro: 'Changes not saved',
  toastErroDesc: 'Your selections are still here. Try again.',
  toastDescartado: 'Changes discarded',
}

const es: Textos = {
  locale: 'es',
  casca: {
    menuLateral: 'Menú lateral', buscar: 'Buscar...', membro: 'Miembro', configuracoes: 'Configuración',
    ajuda: 'Ayuda', trilha: 'Ruta', recolherMenu: 'Contraer menú', abrirMenu: 'Abrir menú', voltar: 'Volver',
    avancar: 'Avanzar', recarregar: 'Recargar', suporte: 'Soporte', notificacoes: 'Notificaciones',
    idioma: 'Idioma', tema: 'Tema', conta: 'Cuenta',
    itens: {
      inicio: 'Inicio', spaceflows: 'Spaceflows', categorias: 'Categorías', tarefas: 'Tareas', agenda: 'Agenda',
      knowledge: 'Knowledge', visaoGeral: 'Visión General', sistema: 'Sistema', estrutura: 'Estructura',
      gestaoDeMembros: 'Gestión de Miembros', interface: 'Interfaz', emails: 'E-mails', integracoes: 'Integraciones',
      agentesDeIa: 'Agentes de IA', logs: 'Logs', credenciais: 'Credenciales', releases: 'Releases',
      documentacao: 'Documentación',
    },
  },
  trilha: { configuracoes: 'Configuración', gestao: 'Gestión de miembros' },

  cargo: 'Cargo:',
  permissoesAtivas: 'Permisos Activos',
  mudancasPendentes: 'Cambios Pendientes',
  alertaTitulo: 'Cambios pendientes',
  alertaTexto: n => n === 1 ? '1 cambio sin guardar.' : `${n} cambios sin guardar.`,
  salvar: 'Guardar Cambios',
  descartar: 'Descartar',
  abas: { categorias: 'Categorías', funcionalidades: 'Funcionalidades', dados: 'Datos', configuracoes: 'Configuración', invalidas: 'Inválidos' },

  padrao: 'Fuera de las categorías',
  padraoDesc: 'Lo que el cargo hace en las áreas del workspace que no son categorías.',
  categorias: 'Categorías',
  categoriasDesc: 'Lo que el cargo hace con los ítems de cada categoría. Haga clic en la categoría para ver los formularios, los campos y qué ítems.',
  configuracoesDesc: 'Asigne permisos de configuración a este cargo',
  invalidasDesc: 'Permisos obsoletos o a los que usted no tiene acceso',
  invalidasVazio: 'Ningún permiso obsoleto encontrado',
  grupos: {
    geral: 'General', automacaoIa: 'Automatización e IA',
    padrao: 'Fuera de las categorías', sistemas: 'Sistemas', dados: 'Datos', acesso: 'Acceso', interface: 'Interfaz',
    emails: 'Emails', integracoes: 'Integraciones', logs: 'Logs', credenciais: 'Credenciales',
  },
  linhas: {
    painelDeTarefas: 'Panel de tareas', assinaturas: 'Firmas', relatorios: 'Informes', inicio: 'Inicio',
    faturamento: 'Facturación', migracoes: 'Migraciones',
    agenda: 'Agenda', ia: 'IA', spaceflows: 'Spaceflows', tarefasRapidas: 'Tareas rápidas',
    tarefasProgramadas: 'Tareas programadas', calendario: 'Calendario', configuracao: 'Configuración',
    dicionario: 'Diccionario', espacoDeTrabalho: 'Espacio de Trabajo', modulos: 'Módulos', listas: 'Listas',
    spaceflowsConfig: 'Spaceflows', tipos: 'Categorías', cargos: 'Cargos', grupos: 'Grupos', membros: 'Miembros',
    casosDeUso: 'Casos de Uso', menu: 'Menú', telas: 'Pantallas', caixas: 'Bandejas', enviados: 'Enviados',
    modelos: 'Plantillas', integracoes: 'Integraciones', logs: 'Logs', credenciais: 'Credenciales',
  },
  outras: { cancelarAssinatura: 'Cancelar', verExecucoes: 'Ver ejecuciones', cancelarExecucao: 'Cancelar ejecución', gerenciarAgentes: 'Gestionar agentes', usarIaEmCampos: 'Usar IA en campos y adjuntos', personalizarParaTodos: 'Personalizar para todos', comprarCreditos: 'Comprar créditos', importarMembros: 'Importar miembros', gerenciarAusencias: 'Gestionar ausencias', mesclarDuplicados: 'Combinar duplicados', executarMigracao: 'Ejecutar migración', verHistorico: 'Ver historial', excluirDeVez: 'Eliminar definitivamente', usarChat: 'Usar Chat de IA', iniciarSpaceflow: 'Iniciar Spaceflow', reenviar: 'Reenviar', exportar: 'Exportar', importar: 'Importar', arquivar: 'Archivar', comentar: 'Comentar', duplicar: 'Duplicar' },
  maisAcoes: (n, m) => `+${n} ${n === 1 ? 'acción' : 'acciones'}${m ? ` (${m} ${m === 1 ? 'marcada' : 'marcadas'})` : ''}`,
  acoes: { criar: 'Crear', ver: 'Ver', atualizar: 'Actualizar', excluir: 'Eliminar' },
  colunaArea: 'Área',
  colunaOutras: 'Otras acciones',
  colunaCategoria: 'Categoría',
  colunaCampos: 'Campos',
  colunaFormularios: 'Formularios',
  marcarGrupo: g => `Marcar todo en ${g}`,
  marcarLinha: l => `Marcar todas las acciones de ${l}`,

  padraoLinha: 'Predeterminado para nuevas categorías',
  padraoLinhaDesc: 'Lo que este cargo recibe en cada categoría creada a partir de ahora. Las categorías existentes no cambian.',
  padraoAcoes: 'Acciones en la categoría',
  colunaRestricoes: 'Restricciones',
  semRestricao: 'Sin restricción',
  restricaoDica: 'Haga clic para ver los detalles de la categoría.',
  formulariosDe: (n, t) => `${n} de ${t} formularios`,
  formulariosEmParte: 'Formularios en parte',
  camposDeTotal: (n, t) => `${n} de ${t} campos`,
  camposDaCategoria: c => `Campos de ${c}`,
  seguePadrao: 'Sigue el predeterminado',
  regraPropria: 'Regla propia',
  liberadoEm: n => n === 1 ? 'Permitido en 1 categoría' : `Permitido en ${n} categorías`,
  tiradoEm: n => n === 1 ? 'Quitado en 1 categoría' : `Quitado en ${n} categorías`,
  liberadoCurto: n => `Permitido en ${n}`,
  tiradoCurto: n => `Quitado en ${n}`,
  dicas: {
    criar: 'Crear: abrir ítems nuevos.',
    ver: 'Ver: abrir y leer los ítems.',
    atualizar: 'Actualizar: editar ítems existentes. Exige Ver.',
    excluir: 'Eliminar: borrar ítems. Exige Ver.',
  },
  descLinhas: {
    painelDeTarefas: 'El panel con las tareas del miembro.',
    assinaturas: 'Documentos enviados para firma digital.',
    relatorios: 'Informes de los ítems del workspace.',
    inicio: 'Los widgets de la pantalla de inicio, para todos los miembros.',
    faturamento: 'Créditos y consumo del workspace.',
    migracoes: 'Solicitudes de migración de datos, general o por tabla.',
    agenda: 'Eventos de la Agenda del workspace.',
    ia: 'El chat de IA, los agentes de IA y la IA en los campos.',
    spaceflows: 'Iniciar y seguir flujos de trabajo.',
    tarefasRapidas: 'Tareas sueltas, fuera de un flujo.',
    tarefasProgramadas: 'Tareas que crean los flujos de las categorías.',
    calendario: 'Calendario y días hábiles del workspace.',
    configuracao: 'Configuración general del sistema.',
    dicionario: 'Entradas de los diccionarios de traducción.',
    espacoDeTrabalho: 'Nombre, logo y datos del workspace.',
    modulos: 'Módulos activos en el workspace.',
    listas: 'Listas de opciones usadas en los campos.',
    spaceflowsConfig: 'Armar y editar flujos.',
    tipos: 'Estructura de las categorías: campos y formularios.',
    cargos: 'Cargos y los permisos de cada uno.',
    grupos: 'Grupos de miembros.',
    membros: 'Invitar, editar y quitar miembros.',
    casosDeUso: 'Casos de uso de la Interfaz.',
    menu: 'Ítems del menú lateral.',
    telas: 'Pantallas de la Interfaz.',
    caixas: 'Bandejas de correo conectadas.',
    enviados: 'Correos que envió el workspace.',
    modelos: 'Plantillas de correo.',
    integracoes: 'Conexiones con otros sistemas.',
    logs: 'Registro de lo que pasó en el workspace.',
    credenciais: 'Claves y contraseñas de las integraciones.',
  },
  parcialDica: (a, n, t) => `${a} en ${n} de ${t} campos. Haga clic para elegir los campos.`,
  parcialOrigemDica: (a, nomes) => `${a} solo en: ${nomes}. Haga clic para permitir en todos los formularios.`,
  semFormulario: 'Ítems sin formulario',
  semFormularioDesc: 'Creados por el formulario predeterminado, por la API, por importación, por Spaceflow o por un agente de IA.',
  semFormularios: 'Sin formularios',
  origensTodas: 'Todos',
  origensDe: (n, t) => `${n} de ${t}`,
  origensEmParte: 'En parte',
  acaoEmOrigens: (a, n, t) => `${a} en ${n} de ${t}`,
  todosOsFormularios: 'Todos los formularios',
  todosOsFormulariosDesc: 'Incluye los ítems sin formulario y los formularios creados después.',
  todosComTracoDica: 'Permitido solo en parte. Haga clic para permitir en todos.',
  formNovoAviso: 'Un formulario creado después entra en las acciones marcadas en toda la categoría. En una acción parcial, entra desmarcado.',
  voltarAcao: (a, o) => `Volver ${a} al predeterminado en ${o}`,
  exigidoPor: a => `Exigido por ${a}. Desmarque ${a} para quitar Ver.`,
  pessoasNoCargo: n => n === 1 ? '1 persona con este cargo' : `${n} personas con este cargo`,
  expandir: c => `Mostrar formularios, campos y qué ítems de ${c}`,
  subCampos: 'Campos',
  subCamposTodos: n => `Todos los ${n} campos`,
  subCamposEscolhidos: (n, t) => `${n} de ${t} campos elegidos`,
  escolherCampos: 'Elegir campos',
  subOutras: 'Otras acciones',
  subOutrasDesc: 'Lo que el cargo hace con los ítems además de las 4 acciones.',
  outrasDeTotal: (n, t) => `${n} de ${t} otras acciones`,
  outraExige: a => `Permita ${a} en la categoría para usar esta acción.`,
  subAlcance: 'Solo si es el creador',
  subAlcanceDesc: 'Marque para que la acción valga solo en los ítems que la persona creó.',
  alcanceTodos: 'Todos',
  alcanceSeus: 'Los suyos',
  soOsSeus: a => `${a} solo en los ítems que la persona creó.`,
  soResponsavel: a => `${a} solo en los ítems de los que la persona es responsable.`,
  soAmbos: a => `${a} solo en los ítems que la persona creó o de los que es responsable.`,
  colunaItens: 'Qué ítems',
  itensTodos: 'Todos',
  itensCriador: 'Creador',
  itensResponsavel: 'Responsable',
  itensAmbos: 'Creador o responsable',
  itensDoPadrao: 'del predeterminado',
  subResponsavel: 'Solo si es el responsable',
  subResponsavelDesc: c => `Cuenta como responsable: ${c}.`,
  editorTitulo: o => `Qué ítems: ${o}`,
  editorDesc: 'Sin nada marcado, la acción vale en todos los ítems. Con las 2 reglas, vale si la persona es la creadora o la responsable.',
  campoPessoa: 'Campos Persona que cuentan como responsable',
  campoPessoaPlaceholder: 'Elija los campos',
  qualquerCampoPessoa: 'En el predeterminado, cuenta cualquier campo Persona de la categoría.',
  semCampoPessoa: 'Esta categoría no tiene campo Persona. Aquí solo vale la regla de creador.',
  seguindoPadraoItens: 'Sigue el predeterminado. Cambiar aquí crea la regla de esta categoría.',
  voltarPadraoItens: 'Volver al predeterminado',
  acaoDesligada: a => `Permita ${a} para usar la regla.`,
  abaItens: 'Qué ítems',
  pessoasTitulo: n => n === 1 ? '1 persona con este cargo' : `${n} personas con este cargo`,
  pessoasDesc: 'Quién siente de inmediato cualquier cambio guardado en esta pantalla.',
  buscarPessoa: 'Buscar por nombre o correo',
  nenhumaPessoa: 'Nadie con ese nombre o correo.',
  verPessoas: 'Ver las personas con este cargo',
  abrirGestao: 'Abrir Gestión de Miembros',
  licencas: { owner: 'Propietario', full: 'Full', standard: 'Standard', viewer: 'Visualizador' },
  situacoes: { active: 'Activo', inactive: 'Inactivo', pending: 'Invitación pendiente', blocked: 'Bloqueado' },
  padraoColunaDica: 'Vale para toda categoría sin regla propia.',
  abaQuemAcessa: 'Quién accede',
  quemAcessaDesc: 'Lo que cada cargo del workspace hace en esta categoría. Para cambiar otro cargo, abra su pantalla.',
  colunaCargo: 'Cargo',
  colunaPessoas: 'Personas',
  esteCargo: 'Este cargo',
  esconderIguais: 'Ocultar cargos iguales a este',
  semDiferentes: 'Todos los cargos hacen lo mismo que este.',
  tem: 'Tiene',
  naoTem: 'No tiene',
  voltarAoPadrao: 'Volver al predeterminado',
  camposTodos: 'Todos',
  camposDe: (n, t) => `${n} de ${t}`,
  camposNenhum: 'Ninguno',
  formsSeguem: 'Siguen la categoría',
  formsProprios: n => n === 1 ? '1 con regla propia' : `${n} con regla propia`,
  meta: (c, f) => `${c} campos · ${f === 1 ? '1 formulario' : `${f} formularios`}`,
  ajustar: 'Ajustar',
  ajustarAria: c => `Ajustar campos y formularios de ${c}`,
  buscar: 'Buscar categoría',
  filtros: { todas: 'Todas', proprias: 'Regla propia', comAcesso: 'Con acceso', semAcesso: 'Sin acceso', comItens: 'Solo algunos ítems', alteradas: 'Modificadas' },
  mostrando: (n, t) => n === t ? `${t} categorías` : `Mostrando ${n} de ${t} categorías`,
  marcarColuna: (a, n) => `Marcar ${a} en las ${n} categorías de la lista`,
  desmarcarColuna: (a, n) => `Desmarcar ${a} en las ${n} categorías de la lista`,
  toastColuna: (a, n, l) => `${a} ${l ? 'marcado' : 'desmarcado'} en ${n} ${n === 1 ? 'categoría' : 'categorías'}`,
  alterada: 'Modificada, sin guardar',
  desfazer: 'Deshacer',
  vazioBuscaTitulo: 'Ninguna categoría con ese nombre',
  vazioBuscaDesc: 'Revise la ortografía o limpie la búsqueda.',
  limparBusca: 'Limpiar búsqueda',
  vazioFiltroTitulo: 'Ninguna categoría en este filtro',
  vazioFiltroDesc: 'Cambie el filtro para ver las demás.',
  verTodas: 'Ver todas',
  vazioWsTitulo: 'Este workspace aún no tiene categorías',
  vazioWsDesc: 'Cuando alguien cree una, recibirá el predeterminado para nuevas categorías.',
  semPermissaoTitulo: 'Usted ve este cargo, pero no lo edita.',
  semPermissaoDesc: 'Para cambiar permisos, pida el permiso Actualizar Cargos a quien administra el workspace.',

  detalheDesc: 'Lo que este cargo hace con cada campo de esta categoría.',
  abaCampos: 'Campos',
  abaFormularios: 'Formularios',
  modoTodos: 'Todos los campos',
  modoTodosDesc: 'Incluso los creados después.',
  modoEscolher: 'Elegir campo por campo',
  modoEscolherDesc: 'Para ocultar o bloquear campos sensibles.',
  todosResumo: n => `El cargo usa los ${n} campos en cada acción permitida en la categoría.`,
  buscarCampo: 'Buscar campo',
  colunaCampo: 'Campo',
  acaoBloqueada: a => `Permita ${a} en la categoría para elegir campos en esta columna.`,
  doSistema: 'Del sistema',
  criadoEm: 'Creado el',
  atualizadoEm: 'Actualizado el',
  colunaFormulario: 'Formulario',
  colunaSegue: 'Sigue la categoría',
  formsDesc: 'Marque la categoría para permitir todos los formularios. Marque solo algunos para limitar el cargo a ellos.',
  semAcesso: 'Este cargo no accede a esta categoría. Permita una acción en la tabla para elegir los campos.',
  concluir: 'Listo',
  vazioCampo: 'Ningún campo con ese nombre.',
  tipos: {
    EnlDropdown: 'Lista de Selección Única',
    inputText: 'Texto Corto',
    EnTextArea: 'Texto Largo',
    EnPerson: 'Persona/Empresa',
    EnlCalendar: 'Fecha (Calendario)',
    EnlNumber: 'Número',
    EnRel: 'Relación',
    EnRelMulti: 'Relación múltiple',
    EnlMask: 'Texto con Máscara',
    email: 'E-mail',
    EnAddress: 'Dirección',
    uploadFile: 'Archivo',
    uploadImage: 'Imagen',
    EnPDF: 'Tratamiento de PDF',
    EnOnlyoffice: 'Editor de Documentos',
    radioButton: 'Botones de Selección Única',
    EnlChips: 'Etiquetas',
    inputSwitch: 'Alternativa Binaria',
    EnHtml: 'Editor de texto HTML',
    EnRepeater: 'Repetidor',
    multiSelect: 'Lista de Selección Múltiple',
    EnlTimeRange: 'Duración',
    EnTreeSelect: 'Selección en árbol',
    EnlCheckbox: 'Casillas de Selección',
  },

  confirmarTitulo: n => n === 1 ? '¿Guardar 1 cambio?' : `¿Guardar ${n} cambios?`,
  confirmarImpacto: p => `Vale de inmediato para las ${p} personas con este cargo.`,
  cancelar: 'Cancelar',
  confirmar: 'Guardar',
  padraoNome: 'Predeterminado para nuevas categorías',
  partes: {
    liberou: a => `permitió ${a}`,
    tirou: a => `quitó ${a}`,
    ganhouRegra: 'ahora tiene regla propia',
    voltouAoPadrao: 'volvió a seguir el predeterminado',
    segueOPadrao: () => 'vale solo para las categorías creadas a partir de ahora',
    outrasDoPadrao: 'cambió las otras acciones',
    camposEscolhidos: n => `${n} campos elegidos`,
    todosOsCampos: 'todos los campos',
    origensEmParte: n => n === 1 ? 'solo en 1 formulario' : `solo en ${n} formularios`,
    origensTodas: 'en todos los formularios',
    alcance: 'cambió la regla de creador',
  },
  toastSalvo: 'Permisos guardados',
  toastSalvoDesc: 'El cargo ya funciona con los cambios.',
  toastErro: 'No guardamos los cambios',
  toastErroDesc: 'Sus selecciones siguen aquí. Intente de nuevo.',
  toastDescartado: 'Cambios descartados',
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': pt, en, es }
