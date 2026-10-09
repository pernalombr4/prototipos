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
  inbox: string
  chatIa: string
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
  ordemPersonalizada: string
  viraPersonalizada: string
  ordemAutomatica: string
  secaoPersonalizada: string
  recolherSecao: (nome: string) => string
  expandirSecao: (nome: string) => string

  // favoritar
  fixar: string
  desafixar: string
  fixada: (nome: string) => string
  desafixada: (nome: string) => string

  // menu de contexto, recolher e ocultar (rodada 14)
  ctxAbrir: string
  ctxNovaAba: string
  ctxCopiarLink: string
  ctxRenomear: string
  ctxMoverPara: string
  ctxPrimeiroNivel: string
  ctxSubir: string
  ctxDescer: string
  ctxOcultar: string
  ctxParaTrilha: string
  ctxParaPainel: (painel: string) => string
  ctxRecolher: string
  ctxExpandir: string
  ctxNovaTela: string
  ctxConfigurarCategoria: string
  ctxSoQuemConfigura: string
  linkCopiado: string
  novaAbaMaquete: string
  ocultado: (nome: string) => string
  ocultadoDica: string
  itensOcultos: (n: number) => string
  mostrarNoMenu: string
  renomearTitulo: string
  renomearCampo: string
  renomearAplicar: string
  recolherMenu: string
  expandirMenu: string
  menuLateral: string
  navegacao: string
  levadoParaTrilha: (nome: string) => string
  levadoParaPainel: (nome: string, painel: string) => string

  // trilha no padrão ClickUp (rodada 15)
  inicioPersonalizar: string
  personalizarTitulo: string
  personalizarDica: string
  abaNavegacao: string
  abaInicio: string
  abaSecoes: string
  abaTemas: string
  navInicioDica: string
  aparencia: string
  soIcones: string
  iconesERotulos: string
  inicioTravado: string
  secoesOcultasTitulo: string
  todasSecoesMostradas: string
  criarSecaoRotulo: string
  criarSecaoTitulo: string
  criarSecaoPlaceholder: string
  criarSecaoBotao: string
  renomearSecaoTitulo: string
  salvarSecao: string
  escolherIcone: string
  temaClaro: string
  temaEscuro: string
  temaAuto: string
  corDeDestaque: string
  corDica: string
  cores: Record<string, string>
  mais: string
  personalizarNavegacao: string
  fixarNaTrilha: string
  desafixarDaTrilha: string
  fixarNoInicio: string
  ocultarDoInicio: string
  adicionarASecao: string
  adicionarA: (nome: string) => string
  buscarTelas: string
  grupoTelas: string
  grupoMenus: string
  grupoCategorias: string
  novaTelaAqui: string
  ordenarSecao: string
  ordemAdicionadas: string
  reordenarSecoes: string
  excluirSecao: string
  ocultarSecao: string
  removerDaSecao: string
  secaoExcluida: (nome: string) => string
  secaoCriada: (nome: string) => string
  fixadaNaTrilha: (nome: string) => string
  trocouNaTrilha: (nome: string, saiu: string) => string
  maisAcoes: (nome: string) => string
  adicionarEm: (nome: string) => string
  nadaParaAdicionar: string
  criarAlgo: string

  // criar menu e categoria pelo "+" (rodada 16)
  criarMenuRotulo: string
  criarCategoriaRotulo: string
  criarMenuTitulo: string
  criarMenuPlaceholder: string
  ondeFica: string
  noInicio: string
  naTrilhaRotulo: string
  telasDoMenu: string
  telasVazio: string
  vincularTela: string
  criarTelaNova: string
  nomeDaTela: string
  tipoDaTela: string
  adicionarTela: string
  removerTela: (nome: string) => string
  criarMenuBotao: string
  menuCriado: (nome: string) => string
  telaNovaSelo: string
  criarCategoriaTitulo: string
  criarCategoriaPlaceholder: string
  categoriaCriada: (nome: string) => string
  buscarTelasExistentes: string

  // filtro do menu e criar com IA (rodada 17)
  filtroSemResultadoEm: (termo: string) => string
  buscarNoWorkspace: (termo: string) => string
  filtroSemTipo: string
  filtrarPorTipo: string
  tipoCategorias: string
  tipoTelas: string
  tipoPendencias: string
  fecharFiltro: string
  descrevaParaCriar: string
  grupoCriar: string
  grupoAtalhosCriar: string
  criarComIa: string
  criarComIaToast: (texto: string) => string
  criarComIaDica: string

  // casos de uso, importar e exportar (rodada 18)
  casosDeUso: string
  importarRotulo: string
  centralTitulo: string
  destaques: string
  doWorkspace: string
  doEnspace: string
  tiposDeCaso: string
  complexidadeRotulo: string
  tipoCaso: Record<string, string>
  complexidades: Record<string, string>
  buscarCasos: string
  areasRotulo: string
  buscarAreas: string
  selecionarTudo: string
  bannerCriar: string
  criarCaso: string
  emDestaque: string
  verMaisN: (n: number) => string
  nenhumCaso: string
  limparFiltros: string
  voltarCentral: string
  usarCaso: string
  adicionarAoWorkspace: string
  adicionarAoWorkspaceDica: string
  exportarArquivo: string
  maisDoCaso: string
  descricaoDoCaso: string
  oQueVemJunto: string
  incluiMenus: string
  incluiCategorias: string
  incluiStatus: string
  nMenusTelas: (m: number, t: number) => string
  nCategoriasCampos: (c: number, f: number) => string
  nStatus: (n: number) => string
  peloEnspace: string
  peloEnspaceDica: string
  verificado: string
  doSeuWorkspace: string
  doSeuWorkspaceDica: string
  criadoEmRotulo: string
  usadoRotulo: string
  vezes: (n: number) => string
  adicionadoAoWorkspace: (n: string) => string
  ampliar: string
  imagemDe: (i: number, total: number) => string
  anterior: string
  proxima: string
  usarTitulo: (n: string) => string
  oQueEntra: string
  comOQueExiste: string
  modoSomarTitulo: string
  modoSomarDica: string
  modoSubstituirTitulo: string
  modoSubstituirDica: string
  oQueSai: string
  nadaSai: string
  ondeEntram: string
  aplicarCaso: string
  casoAplicado: (n: string) => string
  importarTitulo: string
  arrasteArquivo: string
  arquivoDica: string
  usarExemplo: string
  arquivoInvalido: string
  deOnde: (ws: string, data: string) => string
  trocarArquivo: string
  importarBotao: string
  exportarMenu: string
  exportarDica: string
  criarCasoTitulo: string
  nomeDoCaso: string
  areaDoCaso: string
  descricaoCampo: string
  menusDoCaso: string
  semMenusDoWorkspace: string
  casoCriado: (n: string) => string
  casoExportado: (n: string) => string
  nadaNoWorkspace: string

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

  // a porta do editor, na busca (rodada 11)
  editarMenu: string
  editarMenuDica: string

  // salvar com alcance, e a bolinha (rodada 12)
  naoSalvoTitulo: string
  naoSalvoDica: string
  salvarTodos: string
  salvarLocal: string
  salvoParaTodos: string
  salvoSoParaMim: string
  menuSoMeu: string
  voltarAoDoWorkspace: string
  pontoAlterado: string

  // ajuda: virou ícone com menu na base, na rodada 9
  ajuda: string
  suporte: string
  releases: string
  documentacao: string

  // inbox, rodada 9
  inboxDescricao: string
  inboxNaoLidas: (n: number) => string
  inboxMarcarTodas: string
  inboxTudoLido: string
  inboxNaoLida: string
  haMinutos: (n: number) => string
  haHoras: (n: number) => string
  haDias: (n: number) => string

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

  // rodada 3: busca, telas novas e editor
  buscarEmTudo: string
  filtroDoMenu: string
  filtroSemResultado: string
  documentos: string
  painelTarefas: string
  painelDados: string
  meusRelatorios: string
  emBreve: string
  editorAbrir: string
  editorTitulo: string
  editorDescricao: string
  moverAcima: string
  moverAbaixo: string
  moverPara: string
  foraDeSecao: string
  tipoDeTela: string
  exigeCategoria: string
  categoriasLigadas: (n: number) => string
  novaSecao: string
  novaTela: string
  seloNativo: string
  seloWorkspace: string

  // rodada 4: formularios de criacao
  formSecaoTitulo: string
  formSecaoDescricao: string
  formItemTitulo: string
  formItemDescricao: string
  campoNome: string
  campoNomeDica: string
  campoIcone: string
  campoOnde: string
  campoOndeDica: string
  ondeTrilha: string
  ondeTrilhaDica: string
  ondePainel: string
  ondePainelDica: string
  campoPainel: string
  campoOrdem: string
  campoSecao: string
  campoEscopo: string
  escopoTodos: string
  escopoDica: string
  escopoHerdado: (secao: string) => string
  escopoRestringir: string
  escopoResumo: (n: number) => string
  campoCaminho: string
  campoCaminhoDica: string
  campoCategorias: string
  adicionarSecao: string
  adicionarItem: string
  salvar: string
  cancelar: string
  criada: (nome: string) => string
  faltaNome: string
  faltaCaminho: string
  preverNaTrilha: string
  preverNoPainel: string

  // rodada 5: arrastar e salvar
  menuAlterado: string
  descartar: string
  arrastarDica: string
  arrastarTeclado: string
  menuSalvo: string
  semAlteracao: string

  // rodada 8: modulos e os dois modos do menu
  modoRotulo: string
  modoNativo: string
  modoCompleto: string
  seloModulo: string
  modulosTitulo: string
  modulosDescricao: string
  modulosAtivos: (n: number) => string
  modulosTraz: string
  modulosNadaAtivo: string
  modulosOndeFica: string
  moduloComparacoes: string
  moduloComparacoesDesc: string
  moduloCorrecao: string
  moduloCorrecaoDesc: string
  personalizadosRotulo: string
  personalizadosDica: string
  motivos: Record<string, string>
  tipos: Record<string, string>

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
  areaTrabalho: 'Início',
  areaDados: 'Dados',
  areaSecoes: 'Seções',

  inicio: 'Início',
  inbox: 'Inbox',
  chatIa: 'Chat de IA',
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
  ordemPersonalizada: 'Personalizada',
  viraPersonalizada: 'A ordenação virou Personalizada para o arraste valer.',
  ordemAutomatica: 'Ordenada automaticamente. Arraste para virar personalizada.',
  secaoPersonalizada: 'Seção criada pelo workspace',
  recolherSecao: nome => `Recolher ${nome}`,
  expandirSecao: nome => `Expandir ${nome}`,

  fixar: 'Fixar nos favoritos',
  desafixar: 'Tirar dos favoritos',
  fixada: nome => `${nome} entrou nos seus favoritos.`,
  desafixada: nome => `${nome} saiu dos seus favoritos.`,

  ctxAbrir: 'Abrir',
  ctxNovaAba: 'Abrir em nova aba',
  ctxCopiarLink: 'Copiar link',
  ctxRenomear: 'Renomear',
  ctxMoverPara: 'Mover para',
  ctxPrimeiroNivel: 'Primeiro nível do menu',
  ctxSubir: 'Mover para cima',
  ctxDescer: 'Mover para baixo',
  ctxOcultar: 'Ocultar do menu',
  ctxParaTrilha: 'Levar para a trilha',
  ctxParaPainel: painel => `Levar para ${painel}`,
  ctxRecolher: 'Recolher seção',
  ctxExpandir: 'Expandir seção',
  ctxNovaTela: 'Nova tela nesta seção',
  ctxConfigurarCategoria: 'Configurar categoria',
  ctxSoQuemConfigura: 'Só quem configura o workspace',
  linkCopiado: 'Link copiado.',
  novaAbaMaquete: 'Abriria numa aba nova. Aqui é maquete.',
  ocultado: nome => `${nome} saiu do menu.`,
  ocultadoDica: 'Continua na busca. Para trazer de volta, use Itens ocultos no pé do menu.',
  itensOcultos: n => n === 1 ? '1 item oculto' : `${n} itens ocultos`,
  mostrarNoMenu: 'Mostrar no menu',
  renomearTitulo: 'Renomear',
  renomearCampo: 'Nome no menu',
  renomearAplicar: 'Renomear',
  recolherMenu: 'Recolher menu',
  expandirMenu: 'Expandir menu',
  menuLateral: 'Menu lateral',
  navegacao: 'Navegação do workspace',
  levadoParaTrilha: nome => `${nome} agora tem ícone na trilha.`,
  levadoParaPainel: (nome, painel) => `${nome} agora fica dentro de ${painel}.`,

  inicioPersonalizar: 'Personalizar a barra lateral',
  personalizarTitulo: 'Personalizar',
  personalizarDica: 'Escolha o que aparece no menu e em que ordem.',
  abaNavegacao: 'Navegação',
  abaInicio: 'Início',
  abaSecoes: 'Seções',
  abaTemas: 'Temas',
  navInicioDica: 'O Início fica sempre na trilha. Clicar nele abre a página inicial e este menu.',
  aparencia: 'Aparência',
  soIcones: 'Somente ícones',
  iconesERotulos: 'Ícones e rótulos',
  inicioTravado: 'Sempre aparece',
  secoesOcultasTitulo: 'Seções ocultas',
  todasSecoesMostradas: 'Todas as seções estão à mostra.',
  criarSecaoRotulo: 'Criar seção',
  criarSecaoTitulo: 'Criar seção',
  criarSecaoPlaceholder: 'Ex.: Comercial, Jurídico, Financeiro',
  criarSecaoBotao: 'Criar',
  renomearSecaoTitulo: 'Renomear seção',
  salvarSecao: 'Salvar',
  escolherIcone: 'Escolher ícone',
  temaClaro: 'Claro',
  temaEscuro: 'Escuro',
  temaAuto: 'Automático',
  corDeDestaque: 'Cor de destaque',
  corDica: 'Vale só para você. A marca do workspace não muda.',
  cores: { fuchsia: 'Magenta', purple: 'Roxo', cyan: 'Azul', teal: 'Verde-azulado' },
  mais: 'Mais',
  personalizarNavegacao: 'Personalizar navegação',
  fixarNaTrilha: 'Fixar na trilha',
  desafixarDaTrilha: 'Tirar da trilha',
  fixarNoInicio: 'Fixar no Início',
  ocultarDoInicio: 'Tirar do Início',
  adicionarASecao: 'Adicionar à seção',
  adicionarA: nome => `Adicionar a ${nome}`,
  buscarTelas: 'Pesquisar telas, menus e categorias...',
  grupoTelas: 'Telas',
  grupoMenus: 'Menus com telas dentro',
  grupoCategorias: 'Categorias',
  novaTelaAqui: 'Criar uma tela nova',
  ordenarSecao: 'Ordenar seção',
  ordemAdicionadas: 'Adicionadas por último',
  reordenarSecoes: 'Reordenar seções',
  excluirSecao: 'Excluir seção',
  ocultarSecao: 'Ocultar seção',
  removerDaSecao: 'Remover da seção',
  secaoExcluida: nome => `${nome} foi excluída.`,
  secaoCriada: nome => `${nome} entrou no topo do Início.`,
  fixadaNaTrilha: nome => `${nome} está na trilha.`,
  trocouNaTrilha: (nome, saiu) => `${nome} entrou na trilha no lugar de ${saiu}, que foi para Mais.`,
  maisAcoes: nome => `Mais ações de ${nome}`,
  adicionarEm: nome => `Adicionar em ${nome}`,
  nadaParaAdicionar: 'Tudo o que existe já está nesta seção.',
  criarAlgo: 'Criar',

  criarMenuRotulo: 'Criar menu',
  criarCategoriaRotulo: 'Criar categoria',
  criarMenuTitulo: 'Criar menu',
  criarMenuPlaceholder: 'Ex.: Atendimento, Compras, Contratos',
  ondeFica: 'Onde ele fica',
  noInicio: 'No Início',
  naTrilhaRotulo: 'Na trilha',
  telasDoMenu: 'Telas deste menu',
  telasVazio: 'Vincule uma tela que já existe ou crie uma nova. Dá para fazer depois também.',
  vincularTela: 'Vincular tela existente',
  criarTelaNova: 'Criar tela nova',
  nomeDaTela: 'Nome da tela',
  tipoDaTela: 'Tipo de tela',
  adicionarTela: 'Adicionar',
  removerTela: nome => `Tirar ${nome}`,
  criarMenuBotao: 'Criar menu',
  menuCriado: nome => `${nome} foi criado. Salve para valer para o workspace.`,
  telaNovaSelo: 'Nova',
  criarCategoriaTitulo: 'Criar categoria',
  criarCategoriaPlaceholder: 'Ex.: Fornecedores, Pedidos, Imóveis',
  categoriaCriada: nome => `${nome} entrou em Categorias.`,
  buscarTelasExistentes: 'Pesquisar telas...',

  filtroSemResultadoEm: termo => `Nada no menu com "${termo}".`,
  buscarNoWorkspace: termo => `Buscar "${termo}" no workspace`,
  filtroSemTipo: 'Nada no menu com esses tipos.',
  filtrarPorTipo: 'Filtrar por tipo',
  tipoCategorias: 'Categorias',
  tipoTelas: 'Telas',
  tipoPendencias: 'Com pendências',
  fecharFiltro: 'Fechar filtro',
  descrevaParaCriar: 'Descreva o que quer criar',
  grupoCriar: 'Criar',
  grupoAtalhosCriar: 'Menu',
  criarComIa: 'Criar com IA',
  criarComIaToast: texto => `O BENI montaria "${texto}" e mostraria antes de gravar. Aqui é maquete.`,
  criarComIaDica: 'O BENI monta e mostra antes de gravar',

  casosDeUso: 'Casos de uso',
  importarRotulo: 'Importar',
  centralTitulo: 'Central de casos de uso',
  destaques: 'Destaques',
  doWorkspace: 'Do seu workspace',
  doEnspace: 'Do ENSPACE',
  tiposDeCaso: 'Tipos',
  complexidadeRotulo: 'Complexidade',
  tipoCaso: { workspace: 'Workspace completo', menu: 'Menu', categoria: 'Categoria', tela: 'Tela' },
  complexidades: { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' },
  buscarCasos: 'Pesquisar casos de uso...',
  areasRotulo: 'Áreas',
  buscarAreas: 'Pesquisar...',
  selecionarTudo: 'Selecionar tudo',
  bannerCriar: 'Transforme o seu menu num caso de uso e use em outros workspaces.',
  criarCaso: 'Criar caso de uso',
  emDestaque: 'Em destaque',
  verMaisN: n => `Ver mais ${n}`,
  nenhumCaso: 'Nenhum caso de uso com esses filtros.',
  limparFiltros: 'Limpar filtros',
  voltarCentral: 'Voltar',
  usarCaso: 'Usar caso de uso',
  adicionarAoWorkspace: 'Adicionar ao workspace',
  adicionarAoWorkspaceDica: 'Guarda uma cópia para você ajustar antes de usar. O menu não muda.',
  exportarArquivo: 'Exportar arquivo',
  maisDoCaso: 'Mais ações do caso de uso',
  descricaoDoCaso: 'Descrição',
  oQueVemJunto: 'O que vem junto',
  incluiMenus: 'Menus e telas',
  incluiCategorias: 'Categorias e campos',
  incluiStatus: 'Status',
  nMenusTelas: (m, t) => `${m === 1 ? '1 menu' : `${m} menus`}, ${t === 1 ? '1 tela' : `${t} telas`}`,
  nCategoriasCampos: (c, f) => `${c === 1 ? '1 categoria' : `${c} categorias`}, ${f === 1 ? '1 campo' : `${f} campos`}`,
  nStatus: n => n === 1 ? '1 status' : `${n} status`,
  peloEnspace: 'Pelo ENSPACE',
  peloEnspaceDica: 'Feito e mantido pela equipe do ENSPACE.',
  verificado: 'Verificado',
  doSeuWorkspace: 'Do seu workspace',
  doSeuWorkspaceDica: 'Criado ou guardado por alguém deste workspace.',
  criadoEmRotulo: 'Criado em',
  usadoRotulo: 'Usado',
  vezes: n => n === 1 ? '1 vez' : `${n.toLocaleString('pt-BR')} vezes`,
  adicionadoAoWorkspace: n => `${n} foi guardado em Do seu workspace. O menu não mudou.`,
  ampliar: 'Ampliar imagem',
  imagemDe: (i, total) => `Imagem ${i} de ${total}`,
  anterior: 'Anterior',
  proxima: 'Próxima',
  usarTitulo: n => `Usar ${n}`,
  oQueEntra: 'O que entra',
  comOQueExiste: 'E com o que já existe?',
  modoSomarTitulo: 'Somar ao menu',
  modoSomarDica: 'Os menus do caso entram ao lado dos que você já tem.',
  modoSubstituirTitulo: 'Substituir o menu',
  modoSubstituirDica: 'Os menus que o workspace criou saem. Os nativos ficam.',
  oQueSai: 'O que sai',
  nadaSai: 'Nada sai: o workspace ainda não criou menus.',
  ondeEntram: 'Onde os menus entram',
  aplicarCaso: 'Usar',
  casoAplicado: n => `${n} entrou no menu. Salve para valer para o workspace.`,
  importarTitulo: 'Importar caso de uso',
  arrasteArquivo: 'Arraste o arquivo aqui ou clique para escolher',
  arquivoDica: 'O arquivo .json que o Exportar gera em outro workspace do ENSPACE.',
  usarExemplo: 'Usar um arquivo de exemplo',
  arquivoInvalido: 'Este arquivo não é um caso de uso do ENSPACE.',
  deOnde: (ws, data) => `De ${ws}, exportado em ${data}`,
  trocarArquivo: 'Trocar arquivo',
  importarBotao: 'Importar',
  exportarMenu: 'Exportar o meu menu',
  exportarDica: 'Para levar os menus deste workspace a outro.',
  criarCasoTitulo: 'Criar caso de uso',
  nomeDoCaso: 'Nome',
  areaDoCaso: 'Área',
  descricaoCampo: 'Descrição',
  menusDoCaso: 'Menus que entram',
  semMenusDoWorkspace: 'O workspace ainda não criou menus. Crie um pelo "+" do Início e volte aqui.',
  casoCriado: n => `${n} está em Do seu workspace.`,
  casoExportado: n => `${n} foi baixado.`,
  nadaNoWorkspace: 'Nenhum caso de uso no workspace ainda. Crie um a partir do seu menu ou guarde um do ENSPACE.',

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
    'modulos': 'Módulos',
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
    'apps': 'Apps',
    'webhooks': 'Webhooks',
    'agentes': 'Agentes de IA',
    'logs-auditoria': 'Logs de auditoria',
    'logs-requisicao': 'Logs de requisição',
  },

  editarMenu: 'Editar menu',
  editarMenuDica: 'Arraste aqui mesmo para reordenar. No editor você agrupa, cria e escolhe o tipo de cada tela.',

  naoSalvoTitulo: 'Alterações não salvas',
  naoSalvoDica: 'Arraste o quanto quiser. Nada muda para ninguém até você salvar.',
  salvarTodos: 'Salvar para todos',
  salvarLocal: 'Salvar só para mim',
  salvoParaTodos: 'Menu salvo para todo o workspace.',
  salvoSoParaMim: 'Menu salvo só para você.',
  menuSoMeu: 'Este menu é só seu.',
  voltarAoDoWorkspace: 'Voltar ao do workspace',
  pontoAlterado: 'Mexido, ainda não salvo',

  ajuda: 'Ajuda',
  suporte: 'Suporte',
  releases: 'Novidades da plataforma',
  documentacao: 'Documentação',

  inboxDescricao: 'O que mudou nos itens que você segue, nas suas tarefas e nas suas requisições.',
  inboxNaoLidas: n => (n === 1 ? '1 não lida' : `${n} não lidas`),
  inboxMarcarTodas: 'Marcar todas como lidas',
  inboxTudoLido: 'Nada por ler',
  inboxNaoLida: 'Não lida',
  haMinutos: n => (n === 1 ? 'há 1 minuto' : `há ${n} minutos`),
  haHoras: n => (n === 1 ? 'há 1 hora' : `há ${n} horas`),
  haDias: n => (n === 1 ? 'há 1 dia' : `há ${n} dias`),

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

  buscarEmTudo: 'Buscar em tudo',
  filtroDoMenu: 'Filtrar o menu',
  filtroSemResultado: 'Nada no menu com esse nome',
  documentos: 'Documentos',
  painelTarefas: 'Dashboard de tarefas',
  painelDados: 'Dashboard de dados',
  meusRelatorios: 'Meus relatórios',
  emBreve: 'Em breve',
  editorAbrir: 'Montar o menu',
  editorTitulo: 'Montar o menu',
  editorDescricao: 'Reordene, agrupe em seções e escolha o tipo de cada tela. Encaixe que quebra a lógica do ENSPACE é recusado na hora, com o motivo.',
  moverAcima: 'Mover para cima',
  moverAbaixo: 'Mover para baixo',
  moverPara: 'Mover para',
  foraDeSecao: 'Fora de seção',
  tipoDeTela: 'Tipo de tela',
  exigeCategoria: 'Este tipo pede ao menos uma categoria',
  categoriasLigadas: n => `${n} categorias ligadas`,
  novaSecao: 'Nova seção',
  novaTela: 'Nova tela',
  seloNativo: 'Nativo',
  seloWorkspace: 'Do workspace',

  formSecaoTitulo: 'Nova seção de menu',
  formSecaoDescricao: 'Seção é o agrupamento do menu lateral. Ela recebe telas dentro, aparece com o nome e o ícone que você der, e só quem estiver no escopo enxerga.',
  formItemTitulo: 'Novo item de menu',
  formItemDescricao: 'Item é uma tela dentro de uma seção. Escolha o tipo, e o ENSPACE pede o que aquele tipo precisa.',
  campoNome: 'Nome',
  campoNomeDica: 'É o que aparece no menu. Use a palavra que a equipe usa.',
  campoIcone: 'Ícone',
  campoOnde: 'Onde a seção aparece',
  campoOndeDica: 'No modelo de trilha existem dois lugares. A escolha muda o caminho de quem usa, não o conteúdo.',
  ondeTrilha: 'Na trilha, com ícone próprio',
  ondeTrilhaDica: 'Vira um ícone na barra estreita e abre um painel só dela. Bom para área que a equipe usa o dia inteiro.',
  ondePainel: 'Dentro de um painel',
  ondePainelDica: 'Vira uma seção recolhível dentro de uma área que já existe. Bom para assunto que acompanha outro.',
  campoPainel: 'Em qual painel',
  campoOrdem: 'Ordem',
  campoSecao: 'Dentro de qual seção',
  campoEscopo: 'Quem enxerga',
  escopoTodos: 'Todo o workspace',
  escopoDica: 'Sem nenhum grupo marcado, todos enxergam. Marcando, só quem está nos grupos.',
  escopoHerdado: secao => `Herda o escopo de ${secao}`,
  escopoRestringir: 'Restringir ainda mais neste item',
  escopoResumo: n => n === 1 ? '1 grupo' : `${n} grupos`,
  campoCaminho: 'Caminho',
  campoCaminhoDica: 'A URL para onde esta tela leva.',
  campoCategorias: 'Categorias',
  adicionarSecao: 'Nova seção',
  adicionarItem: 'Adicionar item',
  salvar: 'Salvar',
  cancelar: 'Cancelar',
  criada: nome => `${nome} entrou no menu.`,
  faltaNome: 'Dê um nome à seção.',
  faltaCaminho: 'Este tipo precisa de um caminho.',
  preverNaTrilha: 'Como fica na trilha',
  menuAlterado: 'Menu alterado',
  descartar: 'Descartar',
  arrastarDica: 'Arraste para reordenar',
  arrastarTeclado: 'Com o foco no item, Alt e as setas movem sem o mouse.',
  menuSalvo: 'Menu salvo.',
  modoRotulo: 'Menu',
  modoNativo: 'Só nativo',
  modoCompleto: 'Com módulos e do workspace',
  seloModulo: 'Módulo',
  modulosTitulo: 'Módulos',
  modulosDescricao: 'Módulos são funcionalidades que o workspace liga quando precisa. Ligar um módulo acrescenta as telas dele ao menu lateral; desligar tira, e a configuração fica guardada.',
  modulosAtivos: n => n === 1 ? '1 módulo ativo' : `${n} módulos ativos`,
  modulosTraz: 'O que ele acrescenta ao menu',
  modulosNadaAtivo: 'Nenhum módulo ativo. O menu está com as telas nativas apenas.',
  modulosOndeFica: 'Antes esta tela ficava dentro de Informações Básicas. Agora é um item próprio, porque ligar um módulo muda o menu de todo mundo.',
  moduloComparacoes: 'Comparações',
  moduloComparacoesDesc: 'Duas partes comparam dados sobre os mesmos itens, com aprovação e rastreabilidade.',
  moduloCorrecao: 'Correção monetária',
  moduloCorrecaoDesc: 'Atualiza valores por índices econômicos oficiais, como IPCA e INPC.',
  personalizadosRotulo: 'Seções do workspace',
  personalizadosDica: 'As seções que alguém criou em Interface, Menus.',
  semAlteracao: 'Nada mudou ainda. Arraste um item para reordenar.',
  preverNoPainel: 'Como fica no painel',

  motivos: {
    destinoEhFolha: 'Tela nativa não recebe item dentro. Solte dentro de uma seção.',
    categoriaSoEmCategorias: 'Categoria só entra na seção Categorias.',
    telaNaoEmCategorias: 'A seção Categorias só aceita categoria.',
    secaoDentroDeSecao: 'O menu tem dois níveis. Seção não entra dentro de seção.',
    areaFixa: 'Trabalho, Dados e Configurações ficam onde estão. Só as seções mudam de lugar na trilha.',
    soSecaoNaTrilha: 'Na trilha só entram seções. Solte o item dentro de uma delas.',
  },
  tipos: {
    'arquivos': 'Arquivos',
    'consultas': 'Consultas',
    'consultas-grupo': 'Consultas (Grupo de Membros)',
    'embutido': 'Conteúdo Embutido',
    'customizado': 'Customizado',
    'meus-itens': 'Meus Itens',
    'minhas-requisicoes': 'Minhas Requisições',
    'paineis': 'Painéis',
    'requisicoes': 'Requisições',
    'tarefas': 'Tarefas',
    'tarefas-geral': 'Tarefas Geral',
    'personalizada': 'Telas Personalizadas',
    'triagem': 'Triagem',
  },

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
  areaTrabalho: 'Home',
  areaDados: 'Data',
  areaSecoes: 'Sections',

  inicio: 'Home',
  inbox: 'Inbox',
  chatIa: 'AI chat',
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
  ordemPersonalizada: 'Custom',
  viraPersonalizada: 'Sorting switched to Custom so the drag can stick.',
  ordemAutomatica: 'Sorted automatically. Drag to switch to custom.',
  secaoPersonalizada: 'Section created by the workspace',
  recolherSecao: nome => `Collapse ${nome}`,
  expandirSecao: nome => `Expand ${nome}`,

  fixar: 'Pin to favorites',
  desafixar: 'Remove from favorites',
  fixada: nome => `${nome} is now in your favorites.`,
  desafixada: nome => `${nome} left your favorites.`,

  ctxAbrir: 'Open',
  ctxNovaAba: 'Open in new tab',
  ctxCopiarLink: 'Copy link',
  ctxRenomear: 'Rename',
  ctxMoverPara: 'Move to',
  ctxPrimeiroNivel: 'Top level of the menu',
  ctxSubir: 'Move up',
  ctxDescer: 'Move down',
  ctxOcultar: 'Hide from menu',
  ctxParaTrilha: 'Move to the rail',
  ctxParaPainel: painel => `Move into ${painel}`,
  ctxRecolher: 'Collapse section',
  ctxExpandir: 'Expand section',
  ctxNovaTela: 'New screen in this section',
  ctxConfigurarCategoria: 'Category settings',
  ctxSoQuemConfigura: 'Only workspace admins',
  linkCopiado: 'Link copied.',
  novaAbaMaquete: 'This would open a new tab. It is a mockup here.',
  ocultado: nome => `${nome} left the menu.`,
  ocultadoDica: 'Search still finds it. To bring it back, use Hidden items at the bottom of the menu.',
  itensOcultos: n => n === 1 ? '1 hidden item' : `${n} hidden items`,
  mostrarNoMenu: 'Show in menu',
  renomearTitulo: 'Rename',
  renomearCampo: 'Name in the menu',
  renomearAplicar: 'Rename',
  recolherMenu: 'Collapse menu',
  expandirMenu: 'Expand menu',
  menuLateral: 'Sidebar',
  navegacao: 'Workspace navigation',
  levadoParaTrilha: nome => `${nome} now has an icon on the rail.`,
  levadoParaPainel: (nome, painel) => `${nome} now lives inside ${painel}.`,

  inicioPersonalizar: 'Customize sidebar',
  personalizarTitulo: 'Customize',
  personalizarDica: 'Choose what shows in the menu and in which order.',
  abaNavegacao: 'Navigation',
  abaInicio: 'Home',
  abaSecoes: 'Sections',
  abaTemas: 'Themes',
  navInicioDica: 'Home always stays on the rail. Clicking it opens the home page and this menu.',
  aparencia: 'Appearance',
  soIcones: 'Icons only',
  iconesERotulos: 'Icons and labels',
  inicioTravado: 'Always shown',
  secoesOcultasTitulo: 'Hidden sections',
  todasSecoesMostradas: 'All sections are shown.',
  criarSecaoRotulo: 'Create section',
  criarSecaoTitulo: 'Create section',
  criarSecaoPlaceholder: 'E.g. Sales, Legal, Finance',
  criarSecaoBotao: 'Create',
  renomearSecaoTitulo: 'Rename section',
  salvarSecao: 'Save',
  escolherIcone: 'Choose icon',
  temaClaro: 'Light',
  temaEscuro: 'Dark',
  temaAuto: 'Automatic',
  corDeDestaque: 'Accent color',
  corDica: 'Only for you. The workspace brand does not change.',
  cores: { fuchsia: 'Magenta', purple: 'Purple', cyan: 'Blue', teal: 'Teal' },
  mais: 'More',
  personalizarNavegacao: 'Customize navigation',
  fixarNaTrilha: 'Pin to rail',
  desafixarDaTrilha: 'Remove from rail',
  fixarNoInicio: 'Pin to Home',
  ocultarDoInicio: 'Remove from Home',
  adicionarASecao: 'Add to section',
  adicionarA: nome => `Add to ${nome}`,
  buscarTelas: 'Search screens, menus and categories...',
  grupoTelas: 'Screens',
  grupoMenus: 'Menus with screens inside',
  grupoCategorias: 'Categories',
  novaTelaAqui: 'Create a new screen',
  ordenarSecao: 'Sort section',
  ordemAdicionadas: 'Last added',
  reordenarSecoes: 'Reorder sections',
  excluirSecao: 'Delete section',
  ocultarSecao: 'Hide section',
  removerDaSecao: 'Remove from section',
  secaoExcluida: nome => `${nome} was deleted.`,
  secaoCriada: nome => `${nome} is now at the top of Home.`,
  fixadaNaTrilha: nome => `${nome} is on the rail.`,
  trocouNaTrilha: (nome, saiu) => `${nome} took the place of ${saiu} on the rail. ${saiu} moved to More.`,
  maisAcoes: nome => `More actions for ${nome}`,
  adicionarEm: nome => `Add to ${nome}`,
  nadaParaAdicionar: 'Everything is already in this section.',
  criarAlgo: 'Create',

  criarMenuRotulo: 'Create menu',
  criarCategoriaRotulo: 'Create category',
  criarMenuTitulo: 'Create menu',
  criarMenuPlaceholder: 'E.g. Support, Purchasing, Contracts',
  ondeFica: 'Where it lives',
  noInicio: 'In Home',
  naTrilhaRotulo: 'On the rail',
  telasDoMenu: 'Screens in this menu',
  telasVazio: 'Link a screen that already exists or create a new one. You can also do it later.',
  vincularTela: 'Link existing screen',
  criarTelaNova: 'Create new screen',
  nomeDaTela: 'Screen name',
  tipoDaTela: 'Screen type',
  adicionarTela: 'Add',
  removerTela: nome => `Remove ${nome}`,
  criarMenuBotao: 'Create menu',
  menuCriado: nome => `${nome} was created. Save to apply it to the workspace.`,
  telaNovaSelo: 'New',
  criarCategoriaTitulo: 'Create category',
  criarCategoriaPlaceholder: 'E.g. Suppliers, Orders, Properties',
  categoriaCriada: nome => `${nome} is now in Categories.`,
  buscarTelasExistentes: 'Search screens...',

  filtroSemResultadoEm: termo => `Nothing in the menu matches "${termo}".`,
  buscarNoWorkspace: termo => `Search "${termo}" in the workspace`,
  filtroSemTipo: 'Nothing in the menu with these types.',
  filtrarPorTipo: 'Filter by type',
  tipoCategorias: 'Categories',
  tipoTelas: 'Screens',
  tipoPendencias: 'With pending items',
  fecharFiltro: 'Close filter',
  descrevaParaCriar: 'Describe what you want to create',
  grupoCriar: 'Create',
  grupoAtalhosCriar: 'Menu',
  criarComIa: 'Create with AI',
  criarComIaToast: texto => `BENI would build "${texto}" and show it before saving. This is a mockup.`,
  criarComIaDica: 'BENI builds it and shows it before saving',

  casosDeUso: 'Use cases',
  importarRotulo: 'Import',
  centralTitulo: 'Use case center',
  destaques: 'Featured',
  doWorkspace: 'From your workspace',
  doEnspace: 'From ENSPACE',
  tiposDeCaso: 'Types',
  complexidadeRotulo: 'Complexity',
  tipoCaso: { workspace: 'Full workspace', menu: 'Menu', categoria: 'Category', tela: 'Screen' },
  complexidades: { iniciante: 'Beginner', intermediario: 'Intermediate', avancado: 'Advanced' },
  buscarCasos: 'Search use cases...',
  areasRotulo: 'Areas',
  buscarAreas: 'Search...',
  selecionarTudo: 'Select all',
  bannerCriar: 'Turn your menu into a use case and use it in other workspaces.',
  criarCaso: 'Create use case',
  emDestaque: 'Featured',
  verMaisN: n => `See ${n} more`,
  nenhumCaso: 'No use case matches these filters.',
  limparFiltros: 'Clear filters',
  voltarCentral: 'Back',
  usarCaso: 'Use this use case',
  adicionarAoWorkspace: 'Add to workspace',
  adicionarAoWorkspaceDica: 'Saves a copy for you to adjust before using it. The menu does not change.',
  exportarArquivo: 'Export file',
  maisDoCaso: 'More use case actions',
  descricaoDoCaso: 'Description',
  oQueVemJunto: 'What comes with it',
  incluiMenus: 'Menus and screens',
  incluiCategorias: 'Categories and fields',
  incluiStatus: 'Statuses',
  nMenusTelas: (m, t) => `${m === 1 ? '1 menu' : `${m} menus`}, ${t === 1 ? '1 screen' : `${t} screens`}`,
  nCategoriasCampos: (c, f) => `${c === 1 ? '1 category' : `${c} categories`}, ${f === 1 ? '1 field' : `${f} fields`}`,
  nStatus: n => n === 1 ? '1 status' : `${n} statuses`,
  peloEnspace: 'By ENSPACE',
  peloEnspaceDica: 'Built and maintained by the ENSPACE team.',
  verificado: 'Verified',
  doSeuWorkspace: 'From your workspace',
  doSeuWorkspaceDica: 'Created or saved by someone in this workspace.',
  criadoEmRotulo: 'Created on',
  usadoRotulo: 'Used',
  vezes: n => n === 1 ? '1 time' : `${n.toLocaleString('en')} times`,
  adicionadoAoWorkspace: n => `${n} was saved to From your workspace. The menu did not change.`,
  ampliar: 'Enlarge image',
  imagemDe: (i, total) => `Image ${i} of ${total}`,
  anterior: 'Previous',
  proxima: 'Next',
  usarTitulo: n => `Use ${n}`,
  oQueEntra: 'What comes in',
  comOQueExiste: 'And what about what you already have?',
  modoSomarTitulo: 'Add to the menu',
  modoSomarDica: 'The menus in the use case go next to the ones you have.',
  modoSubstituirTitulo: 'Replace the menu',
  modoSubstituirDica: 'Menus the workspace created go away. Native ones stay.',
  oQueSai: 'What goes away',
  nadaSai: 'Nothing goes away: the workspace has not created menus yet.',
  ondeEntram: 'Where the menus go',
  aplicarCaso: 'Use',
  casoAplicado: n => `${n} is now in the menu. Save to apply it to the workspace.`,
  importarTitulo: 'Import use case',
  arrasteArquivo: 'Drag the file here or click to choose',
  arquivoDica: 'The .json file that Export creates in another ENSPACE workspace.',
  usarExemplo: 'Use a sample file',
  arquivoInvalido: 'This file is not an ENSPACE use case.',
  deOnde: (ws, data) => `From ${ws}, exported on ${data}`,
  trocarArquivo: 'Change file',
  importarBotao: 'Import',
  exportarMenu: 'Export my menu',
  exportarDica: 'To take this workspace menus to another one.',
  criarCasoTitulo: 'Create use case',
  nomeDoCaso: 'Name',
  areaDoCaso: 'Area',
  descricaoCampo: 'Description',
  menusDoCaso: 'Menus included',
  semMenusDoWorkspace: 'The workspace has not created menus yet. Create one from the Home "+" and come back.',
  casoCriado: n => `${n} is in From your workspace.`,
  casoExportado: n => `${n} was downloaded.`,
  nadaNoWorkspace: 'No use cases in the workspace yet. Create one from your menu or save one from ENSPACE.',

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
    'modulos': 'Modules',
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
    'apps': 'Apps',
    'webhooks': 'Webhooks',
    'agentes': 'AI agents',
    'logs-auditoria': 'Audit logs',
    'logs-requisicao': 'Request logs',
  },

  editarMenu: 'Edit menu',
  editarMenuDica: 'Drag right here to reorder. In the editor you group, create and pick each screen type.',

  naoSalvoTitulo: 'Unsaved changes',
  naoSalvoDica: 'Drag as much as you want. Nothing changes for anyone until you save.',
  salvarTodos: 'Save for everyone',
  salvarLocal: 'Save just for me',
  salvoParaTodos: 'Menu saved for the whole workspace.',
  salvoSoParaMim: 'Menu saved just for you.',
  menuSoMeu: 'This menu is yours only.',
  voltarAoDoWorkspace: 'Back to the workspace menu',
  pontoAlterado: 'Moved, not saved yet',

  ajuda: 'Help',
  suporte: 'Support',
  releases: 'Platform updates',
  documentacao: 'Documentation',

  inboxDescricao: 'What changed in the items you follow, in your tasks and in your requests.',
  inboxNaoLidas: n => (n === 1 ? '1 unread' : `${n} unread`),
  inboxMarcarTodas: 'Mark all as read',
  inboxTudoLido: 'Nothing to read',
  inboxNaoLida: 'Unread',
  haMinutos: n => (n === 1 ? '1 minute ago' : `${n} minutes ago`),
  haHoras: n => (n === 1 ? '1 hour ago' : `${n} hours ago`),
  haDias: n => (n === 1 ? '1 day ago' : `${n} days ago`),

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

  buscarEmTudo: 'Search everything',
  filtroDoMenu: 'Filter the menu',
  filtroSemResultado: 'Nothing in the menu by that name',
  documentos: 'Documents',
  painelTarefas: 'Task dashboard',
  painelDados: 'Data dashboard',
  meusRelatorios: 'My reports',
  emBreve: 'Coming soon',
  editorAbrir: 'Build the menu',
  editorTitulo: 'Build the menu',
  editorDescricao: 'Reorder, group into sections and choose the type of each screen. A placement that breaks the logic of ENSPACE is refused on the spot, with the reason.',
  moverAcima: 'Move up',
  moverAbaixo: 'Move down',
  moverPara: 'Move to',
  foraDeSecao: 'Outside a section',
  tipoDeTela: 'Screen type',
  exigeCategoria: 'This type needs at least one category',
  categoriasLigadas: n => `${n} categories linked`,
  novaSecao: 'New section',
  novaTela: 'New screen',
  seloNativo: 'Native',
  seloWorkspace: 'Workspace',

  formSecaoTitulo: 'New menu section',
  formSecaoDescricao: 'A section is the grouping in the sidebar. It holds screens, shows up with the name and icon you give it, and only people in its scope see it.',
  formItemTitulo: 'New menu item',
  formItemDescricao: 'An item is a screen inside a section. Pick the type and ENSPACE asks for what that type needs.',
  campoNome: 'Name',
  campoNomeDica: 'This is what shows in the menu. Use the word the team uses.',
  campoIcone: 'Icon',
  campoOnde: 'Where the section shows',
  campoOndeDica: 'In the rail model there are two places. The choice changes the path people take, not the content.',
  ondeTrilha: 'On the rail, with its own icon',
  ondeTrilhaDica: 'Becomes an icon on the narrow bar and opens a panel of its own. Good for an area the team uses all day.',
  ondePainel: 'Inside a panel',
  ondePainelDica: 'Becomes a collapsible section inside an area that already exists. Good for a subject that follows another.',
  campoPainel: 'In which panel',
  campoOrdem: 'Order',
  campoSecao: 'Inside which section',
  campoEscopo: 'Who sees it',
  escopoTodos: 'The whole workspace',
  escopoDica: 'With no group ticked, everyone sees it. Tick groups and only they do.',
  escopoHerdado: secao => `Inherits the scope of ${secao}`,
  escopoRestringir: 'Restrict further on this item',
  escopoResumo: n => n === 1 ? '1 group' : `${n} groups`,
  campoCaminho: 'Path',
  campoCaminhoDica: 'The URL this screen leads to.',
  campoCategorias: 'Categories',
  adicionarSecao: 'New section',
  adicionarItem: 'Add item',
  salvar: 'Save',
  cancelar: 'Cancel',
  criada: nome => `${nome} is now in the menu.`,
  faltaNome: 'Give the section a name.',
  faltaCaminho: 'This type needs a path.',
  preverNaTrilha: 'How it looks on the rail',
  menuAlterado: 'Menu changed',
  descartar: 'Discard',
  arrastarDica: 'Drag to reorder',
  arrastarTeclado: 'With the item focused, Alt and the arrows move it without the mouse.',
  menuSalvo: 'Menu saved.',
  modoRotulo: 'Menu',
  modoNativo: 'Native only',
  modoCompleto: 'With modules and workspace',
  seloModulo: 'Module',
  modulosTitulo: 'Modules',
  modulosDescricao: 'Modules are features the workspace turns on when it needs them. Turning one on adds its screens to the sidebar; turning it off removes them, and the setup is kept.',
  modulosAtivos: n => n === 1 ? '1 module on' : `${n} modules on`,
  modulosTraz: 'What it adds to the menu',
  modulosNadaAtivo: 'No module is on. The menu has the native screens only.',
  modulosOndeFica: 'This screen used to live inside Basic information. It is its own item now, because turning a module on changes the menu for everyone.',
  moduloComparacoes: 'Comparisons',
  moduloComparacoesDesc: 'Two parties compare data on the same items, with approval and traceability.',
  moduloCorrecao: 'Monetary adjustment',
  moduloCorrecaoDesc: 'Updates values by official economic indexes, such as IPCA and INPC.',
  personalizadosRotulo: 'Workspace sections',
  personalizadosDica: 'The sections someone created in Interface, Menus.',
  semAlteracao: 'Nothing has changed yet. Drag an item to reorder.',
  preverNoPainel: 'How it looks in the panel',

  motivos: {
    destinoEhFolha: 'A native screen takes no items inside. Drop it into a section.',
    categoriaSoEmCategorias: 'A category only goes in the Categories section.',
    telaNaoEmCategorias: 'The Categories section only takes categories.',
    secaoDentroDeSecao: 'The menu has two levels. A section does not go inside a section.',
    areaFixa: 'Work, Data and Settings stay where they are. Only sections move on the rail.',
    soSecaoNaTrilha: 'Only sections go on the rail. Drop the item inside one of them.',
  },
  tipos: {
    'arquivos': 'Files',
    'consultas': 'Queries',
    'consultas-grupo': 'Queries (Member Group)',
    'embutido': 'Embedded Content',
    'customizado': 'Custom',
    'meus-itens': 'My Items',
    'minhas-requisicoes': 'My Requests',
    'paineis': 'Dashboards',
    'requisicoes': 'Requests',
    'tarefas': 'Tasks',
    'tarefas-geral': 'All Tasks',
    'personalizada': 'Custom Screens',
    'triagem': 'Triage',
  },

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
  areaTrabalho: 'Inicio',
  areaDados: 'Datos',
  areaSecoes: 'Secciones',

  inicio: 'Inicio',
  inbox: 'Inbox',
  chatIa: 'Chat de IA',
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
  ordemPersonalizada: 'Personalizada',
  viraPersonalizada: 'El orden pasó a Personalizado para que el arrastre valga.',
  ordemAutomatica: 'Ordenada automáticamente. Arrastra para volverla personalizada.',
  secaoPersonalizada: 'Sección creada por el workspace',
  recolherSecao: nome => `Contraer ${nome}`,
  expandirSecao: nome => `Expandir ${nome}`,

  fixar: 'Fijar en favoritos',
  desafixar: 'Quitar de favoritos',
  fixada: nome => `${nome} entró en tus favoritos.`,
  desafixada: nome => `${nome} salió de tus favoritos.`,

  ctxAbrir: 'Abrir',
  ctxNovaAba: 'Abrir en una pestaña nueva',
  ctxCopiarLink: 'Copiar enlace',
  ctxRenomear: 'Renombrar',
  ctxMoverPara: 'Mover a',
  ctxPrimeiroNivel: 'Primer nivel del menú',
  ctxSubir: 'Mover hacia arriba',
  ctxDescer: 'Mover hacia abajo',
  ctxOcultar: 'Ocultar del menú',
  ctxParaTrilha: 'Llevar al riel',
  ctxParaPainel: painel => `Llevar a ${painel}`,
  ctxRecolher: 'Contraer sección',
  ctxExpandir: 'Expandir sección',
  ctxNovaTela: 'Nueva pantalla en esta sección',
  ctxConfigurarCategoria: 'Configurar categoría',
  ctxSoQuemConfigura: 'Solo quien configura el workspace',
  linkCopiado: 'Enlace copiado.',
  novaAbaMaquete: 'Se abriría en una pestaña nueva. Aquí es una maqueta.',
  ocultado: nome => `${nome} salió del menú.`,
  ocultadoDica: 'La búsqueda lo sigue encontrando. Para traerlo de vuelta, usa Elementos ocultos al pie del menú.',
  itensOcultos: n => n === 1 ? '1 elemento oculto' : `${n} elementos ocultos`,
  mostrarNoMenu: 'Mostrar en el menú',
  renomearTitulo: 'Renombrar',
  renomearCampo: 'Nombre en el menú',
  renomearAplicar: 'Renombrar',
  recolherMenu: 'Contraer menú',
  expandirMenu: 'Expandir menú',
  menuLateral: 'Menú lateral',
  navegacao: 'Navegación del workspace',
  levadoParaTrilha: nome => `${nome} ahora tiene un ícono en el riel.`,
  levadoParaPainel: (nome, painel) => `${nome} ahora está dentro de ${painel}.`,

  inicioPersonalizar: 'Personalizar la barra lateral',
  personalizarTitulo: 'Personalizar',
  personalizarDica: 'Elige qué aparece en el menú y en qué orden.',
  abaNavegacao: 'Navegación',
  abaInicio: 'Inicio',
  abaSecoes: 'Secciones',
  abaTemas: 'Temas',
  navInicioDica: 'Inicio siempre queda en el riel. Al hacer clic se abren la página inicial y este menú.',
  aparencia: 'Apariencia',
  soIcones: 'Solo íconos',
  iconesERotulos: 'Íconos y etiquetas',
  inicioTravado: 'Siempre visible',
  secoesOcultasTitulo: 'Secciones ocultas',
  todasSecoesMostradas: 'Todas las secciones están visibles.',
  criarSecaoRotulo: 'Crear sección',
  criarSecaoTitulo: 'Crear sección',
  criarSecaoPlaceholder: 'Ej.: Comercial, Jurídico, Finanzas',
  criarSecaoBotao: 'Crear',
  renomearSecaoTitulo: 'Renombrar sección',
  salvarSecao: 'Guardar',
  escolherIcone: 'Elegir ícono',
  temaClaro: 'Claro',
  temaEscuro: 'Oscuro',
  temaAuto: 'Automático',
  corDeDestaque: 'Color de acento',
  corDica: 'Solo para ti. La marca del workspace no cambia.',
  cores: { fuchsia: 'Magenta', purple: 'Morado', cyan: 'Azul', teal: 'Verde azulado' },
  mais: 'Más',
  personalizarNavegacao: 'Personalizar navegación',
  fixarNaTrilha: 'Fijar en el riel',
  desafixarDaTrilha: 'Quitar del riel',
  fixarNoInicio: 'Fijar en Inicio',
  ocultarDoInicio: 'Quitar de Inicio',
  adicionarASecao: 'Agregar a la sección',
  adicionarA: nome => `Agregar a ${nome}`,
  buscarTelas: 'Buscar pantallas, menús y categorías...',
  grupoTelas: 'Pantallas',
  grupoMenus: 'Menús con pantallas',
  grupoCategorias: 'Categorías',
  novaTelaAqui: 'Crear una pantalla nueva',
  ordenarSecao: 'Ordenar sección',
  ordemAdicionadas: 'Agregadas al final',
  reordenarSecoes: 'Reordenar secciones',
  excluirSecao: 'Eliminar sección',
  ocultarSecao: 'Ocultar sección',
  removerDaSecao: 'Quitar de la sección',
  secaoExcluida: nome => `${nome} fue eliminada.`,
  secaoCriada: nome => `${nome} quedó arriba de todo en Inicio.`,
  fixadaNaTrilha: nome => `${nome} está en el riel.`,
  trocouNaTrilha: (nome, saiu) => `${nome} ocupó el lugar de ${saiu} en el riel. ${saiu} pasó a Más.`,
  maisAcoes: nome => `Más acciones de ${nome}`,
  adicionarEm: nome => `Agregar a ${nome}`,
  nadaParaAdicionar: 'Todo ya está en esta sección.',
  criarAlgo: 'Crear',

  criarMenuRotulo: 'Crear menú',
  criarCategoriaRotulo: 'Crear categoría',
  criarMenuTitulo: 'Crear menú',
  criarMenuPlaceholder: 'Ej.: Atención, Compras, Contratos',
  ondeFica: 'Dónde queda',
  noInicio: 'En Inicio',
  naTrilhaRotulo: 'En el riel',
  telasDoMenu: 'Pantallas de este menú',
  telasVazio: 'Vincula una pantalla que ya existe o crea una nueva. También se puede hacer después.',
  vincularTela: 'Vincular pantalla existente',
  criarTelaNova: 'Crear pantalla nueva',
  nomeDaTela: 'Nombre de la pantalla',
  tipoDaTela: 'Tipo de pantalla',
  adicionarTela: 'Agregar',
  removerTela: nome => `Quitar ${nome}`,
  criarMenuBotao: 'Crear menú',
  menuCriado: nome => `${nome} fue creado. Guarda para aplicarlo al workspace.`,
  telaNovaSelo: 'Nueva',
  criarCategoriaTitulo: 'Crear categoría',
  criarCategoriaPlaceholder: 'Ej.: Proveedores, Pedidos, Inmuebles',
  categoriaCriada: nome => `${nome} quedó en Categorías.`,
  buscarTelasExistentes: 'Buscar pantallas...',

  filtroSemResultadoEm: termo => `Nada en el menú con "${termo}".`,
  buscarNoWorkspace: termo => `Buscar "${termo}" en el workspace`,
  filtroSemTipo: 'Nada en el menú con esos tipos.',
  filtrarPorTipo: 'Filtrar por tipo',
  tipoCategorias: 'Categorías',
  tipoTelas: 'Pantallas',
  tipoPendencias: 'Con pendientes',
  fecharFiltro: 'Cerrar filtro',
  descrevaParaCriar: 'Describe lo que quieres crear',
  grupoCriar: 'Crear',
  grupoAtalhosCriar: 'Menú',
  criarComIa: 'Crear con IA',
  criarComIaToast: texto => `BENI armaría "${texto}" y lo mostraría antes de guardar. Aquí es una maqueta.`,
  criarComIaDica: 'BENI lo arma y lo muestra antes de guardar',

  casosDeUso: 'Casos de uso',
  importarRotulo: 'Importar',
  centralTitulo: 'Central de casos de uso',
  destaques: 'Destacados',
  doWorkspace: 'De tu workspace',
  doEnspace: 'De ENSPACE',
  tiposDeCaso: 'Tipos',
  complexidadeRotulo: 'Complejidad',
  tipoCaso: { workspace: 'Workspace completo', menu: 'Menú', categoria: 'Categoría', tela: 'Pantalla' },
  complexidades: { iniciante: 'Principiante', intermediario: 'Intermedio', avancado: 'Avanzado' },
  buscarCasos: 'Buscar casos de uso...',
  areasRotulo: 'Áreas',
  buscarAreas: 'Buscar...',
  selecionarTudo: 'Seleccionar todo',
  bannerCriar: 'Convierte tu menú en un caso de uso y úsalo en otros workspaces.',
  criarCaso: 'Crear caso de uso',
  emDestaque: 'Destacados',
  verMaisN: n => `Ver ${n} más`,
  nenhumCaso: 'Ningún caso de uso con esos filtros.',
  limparFiltros: 'Limpiar filtros',
  voltarCentral: 'Volver',
  usarCaso: 'Usar caso de uso',
  adicionarAoWorkspace: 'Agregar al workspace',
  adicionarAoWorkspaceDica: 'Guarda una copia para ajustarla antes de usarla. El menú no cambia.',
  exportarArquivo: 'Exportar archivo',
  maisDoCaso: 'Más acciones del caso de uso',
  descricaoDoCaso: 'Descripción',
  oQueVemJunto: 'Qué incluye',
  incluiMenus: 'Menús y pantallas',
  incluiCategorias: 'Categorías y campos',
  incluiStatus: 'Estados',
  nMenusTelas: (m, t) => `${m === 1 ? '1 menú' : `${m} menús`}, ${t === 1 ? '1 pantalla' : `${t} pantallas`}`,
  nCategoriasCampos: (c, f) => `${c === 1 ? '1 categoría' : `${c} categorías`}, ${f === 1 ? '1 campo' : `${f} campos`}`,
  nStatus: n => n === 1 ? '1 estado' : `${n} estados`,
  peloEnspace: 'Por ENSPACE',
  peloEnspaceDica: 'Hecho y mantenido por el equipo de ENSPACE.',
  verificado: 'Verificado',
  doSeuWorkspace: 'De tu workspace',
  doSeuWorkspaceDica: 'Creado o guardado por alguien de este workspace.',
  criadoEmRotulo: 'Creado el',
  usadoRotulo: 'Usado',
  vezes: n => n === 1 ? '1 vez' : `${n.toLocaleString('es')} veces`,
  adicionadoAoWorkspace: n => `${n} se guardó en De tu workspace. El menú no cambió.`,
  ampliar: 'Ampliar imagen',
  imagemDe: (i, total) => `Imagen ${i} de ${total}`,
  anterior: 'Anterior',
  proxima: 'Siguiente',
  usarTitulo: n => `Usar ${n}`,
  oQueEntra: 'Qué entra',
  comOQueExiste: '¿Y con lo que ya existe?',
  modoSomarTitulo: 'Sumar al menú',
  modoSomarDica: 'Los menús del caso entran junto a los que ya tienes.',
  modoSubstituirTitulo: 'Reemplazar el menú',
  modoSubstituirDica: 'Salen los menús que creó el workspace. Los nativos se quedan.',
  oQueSai: 'Qué sale',
  nadaSai: 'No sale nada: el workspace todavía no creó menús.',
  ondeEntram: 'Dónde entran los menús',
  aplicarCaso: 'Usar',
  casoAplicado: n => `${n} entró en el menú. Guarda para aplicarlo al workspace.`,
  importarTitulo: 'Importar caso de uso',
  arrasteArquivo: 'Arrastra el archivo aquí o haz clic para elegir',
  arquivoDica: 'El archivo .json que Exportar genera en otro workspace de ENSPACE.',
  usarExemplo: 'Usar un archivo de ejemplo',
  arquivoInvalido: 'Este archivo no es un caso de uso de ENSPACE.',
  deOnde: (ws, data) => `De ${ws}, exportado el ${data}`,
  trocarArquivo: 'Cambiar archivo',
  importarBotao: 'Importar',
  exportarMenu: 'Exportar mi menú',
  exportarDica: 'Para llevar los menús de este workspace a otro.',
  criarCasoTitulo: 'Crear caso de uso',
  nomeDoCaso: 'Nombre',
  areaDoCaso: 'Área',
  descricaoCampo: 'Descripción',
  menusDoCaso: 'Menús incluidos',
  semMenusDoWorkspace: 'El workspace todavía no creó menús. Crea uno desde el "+" de Inicio y vuelve aquí.',
  casoCriado: n => `${n} está en De tu workspace.`,
  casoExportado: n => `${n} se descargó.`,
  nadaNoWorkspace: 'Todavía no hay casos de uso en el workspace. Crea uno a partir de tu menú o guarda uno de ENSPACE.',

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
    'modulos': 'Módulos',
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
    'apps': 'Apps',
    'webhooks': 'Webhooks',
    'agentes': 'Agentes de IA',
    'logs-auditoria': 'Registros de auditoría',
    'logs-requisicao': 'Registros de solicitud',
  },

  editarMenu: 'Editar menú',
  editarMenuDica: 'Arrastra aquí mismo para reordenar. En el editor agrupas, creas y eliges el tipo de cada pantalla.',

  naoSalvoTitulo: 'Cambios sin guardar',
  naoSalvoDica: 'Arrastra lo que quieras. Nada cambia para nadie hasta que guardes.',
  salvarTodos: 'Guardar para todos',
  salvarLocal: 'Guardar solo para mí',
  salvoParaTodos: 'Menú guardado para todo el workspace.',
  salvoSoParaMim: 'Menú guardado solo para ti.',
  menuSoMeu: 'Este menú es solo tuyo.',
  voltarAoDoWorkspace: 'Volver al del workspace',
  pontoAlterado: 'Movido, sin guardar',

  ajuda: 'Ayuda',
  suporte: 'Soporte',
  releases: 'Novedades de la plataforma',
  documentacao: 'Documentación',

  inboxDescricao: 'Lo que cambió en los ítems que sigues, en tus tareas y en tus solicitudes.',
  inboxNaoLidas: n => (n === 1 ? '1 sin leer' : `${n} sin leer`),
  inboxMarcarTodas: 'Marcar todas como leídas',
  inboxTudoLido: 'Nada por leer',
  inboxNaoLida: 'Sin leer',
  haMinutos: n => (n === 1 ? 'hace 1 minuto' : `hace ${n} minutos`),
  haHoras: n => (n === 1 ? 'hace 1 hora' : `hace ${n} horas`),
  haDias: n => (n === 1 ? 'hace 1 día' : `hace ${n} días`),

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

  buscarEmTudo: 'Buscar en todo',
  filtroDoMenu: 'Filtrar el menú',
  filtroSemResultado: 'Nada en el menú con ese nombre',
  documentos: 'Documentos',
  painelTarefas: 'Panel de tareas',
  painelDados: 'Panel de datos',
  meusRelatorios: 'Mis informes',
  emBreve: 'Próximamente',
  editorAbrir: 'Armar el menú',
  editorTitulo: 'Armar el menú',
  editorDescricao: 'Reordena, agrupa en secciones y elige el tipo de cada pantalla. Un encaje que rompe la lógica de ENSPACE se rechaza al momento, con el motivo.',
  moverAcima: 'Mover arriba',
  moverAbaixo: 'Mover abajo',
  moverPara: 'Mover a',
  foraDeSecao: 'Fuera de sección',
  tipoDeTela: 'Tipo de pantalla',
  exigeCategoria: 'Este tipo pide al menos una categoría',
  categoriasLigadas: n => `${n} categorías vinculadas`,
  novaSecao: 'Nueva sección',
  novaTela: 'Nueva pantalla',
  seloNativo: 'Nativo',
  seloWorkspace: 'Del workspace',

  formSecaoTitulo: 'Nueva sección de menú',
  formSecaoDescricao: 'Una sección es la agrupación del menú lateral. Recibe pantallas dentro, aparece con el nombre y el icono que le des, y solo la ve quien esté en el alcance.',
  formItemTitulo: 'Nuevo elemento de menú',
  formItemDescricao: 'Un elemento es una pantalla dentro de una sección. Elige el tipo y ENSPACE pide lo que ese tipo necesita.',
  campoNome: 'Nombre',
  campoNomeDica: 'Es lo que aparece en el menú. Usa la palabra que usa el equipo.',
  campoIcone: 'Icono',
  campoOnde: 'Dónde aparece la sección',
  campoOndeDica: 'En el modelo de riel hay dos lugares. La elección cambia el camino de quien usa, no el contenido.',
  ondeTrilha: 'En el riel, con icono propio',
  ondeTrilhaDica: 'Se vuelve un icono en la barra estrecha y abre un panel propio. Bueno para un área que el equipo usa todo el día.',
  ondePainel: 'Dentro de un panel',
  ondePainelDica: 'Se vuelve una sección plegable dentro de un área que ya existe. Bueno para un asunto que acompaña a otro.',
  campoPainel: 'En qué panel',
  campoOrdem: 'Orden',
  campoSecao: 'Dentro de qué sección',
  campoEscopo: 'Quién la ve',
  escopoTodos: 'Todo el workspace',
  escopoDica: 'Sin ningún grupo marcado, todos la ven. Al marcar, solo quien está en los grupos.',
  escopoHerdado: secao => `Hereda el alcance de ${secao}`,
  escopoRestringir: 'Restringir aún más en este elemento',
  escopoResumo: n => n === 1 ? '1 grupo' : `${n} grupos`,
  campoCaminho: 'Ruta',
  campoCaminhoDica: 'La URL a la que lleva esta pantalla.',
  campoCategorias: 'Categorías',
  adicionarSecao: 'Nueva sección',
  adicionarItem: 'Añadir elemento',
  salvar: 'Guardar',
  cancelar: 'Cancelar',
  criada: nome => `${nome} entró en el menú.`,
  faltaNome: 'Dale un nombre a la sección.',
  faltaCaminho: 'Este tipo necesita una ruta.',
  preverNaTrilha: 'Cómo queda en el riel',
  menuAlterado: 'Menú modificado',
  descartar: 'Descartar',
  arrastarDica: 'Arrastra para reordenar',
  arrastarTeclado: 'Con el foco en el elemento, Alt y las flechas lo mueven sin ratón.',
  menuSalvo: 'Menú guardado.',
  modoRotulo: 'Menú',
  modoNativo: 'Solo nativo',
  modoCompleto: 'Con módulos y del workspace',
  seloModulo: 'Módulo',
  modulosTitulo: 'Módulos',
  modulosDescricao: 'Los módulos son funciones que el workspace activa cuando las necesita. Activar uno añade sus pantallas al menú lateral; desactivarlo las quita, y la configuración queda guardada.',
  modulosAtivos: n => n === 1 ? '1 módulo activo' : `${n} módulos activos`,
  modulosTraz: 'Lo que añade al menú',
  modulosNadaAtivo: 'Ningún módulo activo. El menú tiene solo las pantallas nativas.',
  modulosOndeFica: 'Antes esta pantalla estaba dentro de Información básica. Ahora es un elemento propio, porque activar un módulo cambia el menú de todos.',
  moduloComparacoes: 'Comparaciones',
  moduloComparacoesDesc: 'Dos partes comparan datos sobre los mismos elementos, con aprobación y trazabilidad.',
  moduloCorrecao: 'Corrección monetaria',
  moduloCorrecaoDesc: 'Actualiza valores por índices económicos oficiales, como IPCA e INPC.',
  personalizadosRotulo: 'Secciones del workspace',
  personalizadosDica: 'Las secciones que alguien creó en Interfaz, Menús.',
  semAlteracao: 'Todavía no cambió nada. Arrastra un elemento para reordenar.',
  preverNoPainel: 'Cómo queda en el panel',

  motivos: {
    destinoEhFolha: 'Una pantalla nativa no recibe elementos dentro. Suéltalo en una sección.',
    categoriaSoEmCategorias: 'Una categoría solo entra en la sección Categorías.',
    telaNaoEmCategorias: 'La sección Categorías solo acepta categorías.',
    secaoDentroDeSecao: 'El menú tiene dos niveles. Una sección no entra dentro de otra.',
    areaFixa: 'Trabajo, Datos y Configuración se quedan donde están. Solo las secciones cambian de lugar en el riel.',
    soSecaoNaTrilha: 'En el riel solo entran secciones. Suelta el elemento dentro de una de ellas.',
  },
  tipos: {
    'arquivos': 'Archivos',
    'consultas': 'Consultas',
    'consultas-grupo': 'Consultas (Grupo de Miembros)',
    'embutido': 'Contenido Embebido',
    'customizado': 'Personalizado',
    'meus-itens': 'Mis Elementos',
    'minhas-requisicoes': 'Mis Solicitudes',
    'paineis': 'Paneles',
    'requisicoes': 'Solicitudes',
    'tarefas': 'Tareas',
    'tarefas-geral': 'Tareas General',
    'personalizada': 'Pantallas Personalizadas',
    'triagem': 'Triaje',
  },

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
