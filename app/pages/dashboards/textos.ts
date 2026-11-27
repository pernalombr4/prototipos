/**
 * A copy do protótipo de dashboards nos 3 idiomas do ENSPACE.
 *
 * Regra 33: nenhum texto de interface leva travessão. Número, data e plural saem
 * daqui, nunca concatenados no template.
 *
 * Nome das coisas (achado U9 da pesquisa de UX): a página é o "dashboard"; cada bloco
 * dele é um "painel", como o SDK já chama ("Adicionar painel", "Ocultar painel").
 * Rodada 2: o painel de número chama "Cartão", como o "Card" do Power BI em português.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Funcao, Granularidade, Operador, Ordem, PresetDePeriodo, Visualizacao } from './agregacao'
import type { Proposta } from './beni'

type Plural = (n: number) => string
type Motivo = (campo: string, categoria: string) => string

export interface Textos {
  locale: string
  casca: {
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
    novo: string
    itens: Record<string, string>
  }
  workspace: string
  trilhaRelatorios: string
  trilhaDashboards: string

  pagina: {
    trocarDashboard: string
    novoDashboard: string
    novoPainel: string
    pedirAoBeni: string
    maisAcoes: string
    editarDashboard: string
    atualizarDados: string
    duplicarDashboard: string
    excluirDashboard: string
    atualizado: (hora: string, minutos: number) => string
    atualizadoSemRecarga: (hora: string) => string
    visivelPara: (grupos: string[]) => string
    paineis: Plural
    dadosAtualizados: string
    duplicado: string
    excluido: string
    arrasteDica: string
    fecharDica: string
  }

  filtro: {
    adicionar: string
    ajudaDoDashboard: string
    buscarCampo: string
    buscarOpcao: string
    semCampo: string
    semOpcao: string
    operadores: Record<Operador, string>
    ou: string
    condicao: string
    maisAcoes: string
    excluir: string
    limparSelecao: string
    numero: string
    limpar: string
  }

  filtroDoPainel: {
    botao: Plural
    salvos: string
    nenhum: string
    editar: string
    daBarra: string
    daVisao: string
    daVisaoAjuda: string
  }

  visoes: {
    rotulo: string
    semVisao: string
    minhas: string
    doWorkspace: string
    salvarNova: string
    salvar: string
    salvarAlteracoes: string
    alterada: string
    excluir: (nome: string) => string
    excluida: (nome: string) => string
    salva: (nome: string) => string
    atualizada: (nome: string) => string
    salvarTitulo: string
    salvarDescricao: string
    nome: string
    nomePlaceholder: string
    nomeErro: string
    nomeRepetido: string
    paraQuem: string
    soParaMim: string
    soParaMimAjuda: string
    paraTodos: string
    paraTodosAjuda: string
    paraTodosBloqueado: string
    oQueEntra: string
    filtrosDoPainel: (painel: string, filtros: string) => string
    confirmarTitulo: string
    confirmarDescricao: (nome: string) => string
    confirmarAviso: string
    confirmar: string
    voltar: string
    cancelar: string
    salvarBotao: string
  }

  painel: {
    menu: { editar: string, verItens: string, duplicar: string, baixarCsv: string, excluir: string }
    todoPeriodo: string
    periodoPor: (periodo: string, campo: string) => string
    multiplo: string
    multiploCurto: string
    outros: Plural
    itens: Plural
    semDadosTitulo: string
    semDadosDescricao: string
    erroTitulo: string
    erroDescricao: string
    colunaDoTotal: string
    total: string
    daEtapaAnterior: (p: string) => string
    primeiraEtapa: string
    csvBaixado: string
    excluido: string
    duplicado: string
    desfazer: string
    restaurado: string
    arrastar: string
    ajuda: string
    acoes: string
  }

  frase: (f: Funcao, categoria: string, medida?: string, agrupar?: string, quebra?: string) => string
  funcoes: Record<Funcao, string>
  ajudaFuncao: Record<Funcao, string>

  construtor: {
    tituloNovo: string
    tituloEditar: string
    descricao: string
    previa: string
    previaSemEixo: (eixo: string) => string
    passos: { fonte: string, visualizacao: string, campos: string, filtros: string, periodo: string, ordem: string, titulo: string }
    categoria: string
    buscarCategoria: string
    buscarCampo: string
    visualizacao: string
    visualizacoes: Record<Visualizacao, string>
    ajudaVisualizacao: Record<Visualizacao, string>
    tipoSemCampo: (eixo: string) => string
    eixos: Record<Visualizacao, string>
    ajudaDoEixo: Record<Visualizacao, string>
    eixoErro: string
    escolhaCampo: string
    granularidade: string
    granularidades: Record<Granularidade, string>
    valor: string
    valorAjudaCartao: string
    campoDoValor: string
    medidaPlaceholder: string
    medidaErro: string
    medidaVazia: string
    virtual: string
    legenda: string
    legendaNenhuma: string
    legendaAjuda: string
    colunas: string
    colunasAjuda: string
    multiploAviso: string
    relacaoAviso: (categoria: string) => string
    filtrosAjuda: string
    periodo: string
    periodoDashboard: string
    periodoDashboardAjuda: (periodo: string) => string
    periodoTodo: string
    periodoTodoAjuda: string
    campoDeData: string
    campoDeDataAjuda: string
    ordem: string
    ordens: Record<Ordem, string>
    limite: string
    limites: Plural
    semLimite: string
    limiteAjuda: string
    mostrarValores: string
    titulo: string
    tituloAjuda: string
    descricaoDoPainel: string
    descricaoAjuda: string
    descricaoPlaceholder: string
    faltaAlgo: string
    cancelar: string
    salvar: string
    adicionar: string
    salvo: string
    adicionado: string
    sistema: string
  }

  detalhe: {
    itens: Plural
    abrirNaListagem: (categoria: string) => string
    abrirAviso: string
    referencia: string
    criadoEm: string
    periodo: (p: string) => string
    vazio: string
    fechar: string
  }

  formDashboard: {
    tituloEditar: string
    tituloNovo: string
    nome: string
    nomeErro: string
    descricao: string
    quemVe: string
    todosMembros: string
    quemVeAjuda: string
    recarga: string
    recargas: Plural
    semRecarga: string
    salvar: string
    criar: string
    cancelar: string
    salvo: string
    criado: string
  }

  estados: {
    vazioTitulo: string
    vazioDescricao: string
    vazioDescricaoComBeni: string
    vazioLeitor: string
    semAcessoTitulo: string
    semAcessoDescricao: string
  }

  inicial: {
    titulo: string
    descricaoA: string
    descricaoB: string
    comBeni: string
    doZero: string
    criar: string
    leTitulo: string
    leTexto: string
    perguntaTitulo: string
    perguntaTexto: string
    passos: string[]
    semCategoriasTitulo: string
    semCategoriasDescricao: string
    criarCategoria: string
    criarCategoriaAviso: string
    leitorTitulo: string
    leitorDescricao: string
  }

  beni: {
    titulo: string
    passo: (i: number, n: number) => string
    cancelar: string
    voltar: string
    ola: string
    limite: string
    categorias: string
    categoriasErro: string
    resumoDaCategoria: (campos: number, itens: number) => string
    pedido: string
    pedidoAjuda: string
    pedidoPlaceholder: string
    ler: string
    lendo: string
    leitura: (campos: number, itens: number, selecoes: number, numeros: number, datas: number) => string
    confirmar: string
    palpite: string
    perguntaMedida: (campo: string) => string
    perguntaData: (categoria: string) => string
    perguntaEtapas: (campo: string, opcoes: string) => string
    usos: { soma: string, media: string, ignorar: string }
    etapasSim: string
    etapasNao: string
    verPropostas: string
    propostas: Plural
    nomeDoDashboard: string
    depois: string
    criar: Plural
    e: string
    motivos: Record<Proposta['motivo']['tipo'], Motivo>
    criado: string
    criadoDescricao: string
  }

  pedir: {
    titulo: string
    descricao: string
    pedido: string
    pedidoErro: string
    placeholder: string
    pensando: string
    sugestoes: string
    sugerir: string
    adicionar: Plural
    adicionados: Plural
  }

  rotulos: { vazio: string, outros: string, sim: string, nao: string }
  periodos: Record<PresetDePeriodo, string>
  periodoPersonalizado: (de: string, ate: string) => string
}

const listaPt = (l: string[]) => l.length <= 1 ? l.join('') : `${l.slice(0, -1).join(', ')} e ${l[l.length - 1]}`
const listaEn = (l: string[]) => l.length <= 1 ? l.join('') : `${l.slice(0, -1).join(', ')} and ${l[l.length - 1]}`
const listaEs = (l: string[]) => l.length <= 1 ? l.join('') : `${l.slice(0, -1).join(', ')} y ${l[l.length - 1]}`

/* ================================== pt-BR ================================== */

const pt: Textos = {
  locale: 'pt-BR',
  casca: {
    menuLateral: 'Menu do workspace', buscar: 'Buscar...', membro: 'Membro', configuracoes: 'Configurações',
    ajuda: 'Ajuda', trilha: 'Trilha', recolherMenu: 'Recolher o menu', abrirMenu: 'Abrir o menu',
    voltar: 'Voltar', avancar: 'Avançar', recarregar: 'Recarregar', suporte: 'Suporte',
    notificacoes: 'Notificações', idioma: 'Idioma', tema: 'Tema', conta: 'Sua conta', novo: 'Novo',
    itens: {
      inicio: 'Início', spaceflows: 'Spaceflows', categorias: 'Categorias', tarefas: 'Tarefas',
      agendadas: 'Agendadas', rapidas: 'Rápidas',
      agenda: 'Agenda', relatorios: 'Relatórios', relatoriosExportados: 'Relatórios exportados',
      painelDeTarefas: 'Painel de tarefas', dashboards: 'Dashboards', knowledge: 'Knowledge',
      visaoGeral: 'Visão Geral', sistema: 'Sistema', estrutura: 'Estrutura', gestaoDeMembros: 'Gestão de Membros',
      interface: 'Interface', emails: 'E-mails', integracoes: 'Integrações', agentesDeIa: 'Agentes de IA',
      logs: 'Logs', releases: 'Releases', documentacao: 'Documentação',
    },
  },
  workspace: 'teste ux 2',
  trilhaRelatorios: 'Relatórios',
  trilhaDashboards: 'Dashboards',

  pagina: {
    trocarDashboard: 'Trocar de dashboard',
    novoDashboard: 'Novo dashboard',
    novoPainel: 'Novo painel',
    pedirAoBeni: 'Pedir ao BENI',
    maisAcoes: 'Mais ações do dashboard',
    editarDashboard: 'Editar dashboard',
    atualizarDados: 'Atualizar dados',
    duplicarDashboard: 'Duplicar dashboard',
    excluirDashboard: 'Excluir dashboard',
    atualizado: (h, m) => `Atualizado às ${h}. Recarrega a cada ${m} min.`,
    atualizadoSemRecarga: h => `Atualizado às ${h}.`,
    visivelPara: g => g.length ? `Visível para ${listaPt(g)}` : 'Visível para todos os membros',
    paineis: n => n === 1 ? '1 painel' : `${n} painéis`,
    dadosAtualizados: 'Dados atualizados',
    duplicado: 'Dashboard duplicado',
    excluido: 'Dashboard excluído',
    arrasteDica: 'Para mover um painel, arraste pela alça no topo. Para mudar o tamanho, arraste o canto inferior direito.',
    fecharDica: 'Fechar a dica',
  },

  filtro: {
    adicionar: 'Filtro',
    ajudaDoDashboard: 'Cada campo pertence a 1 categoria. O filtro vale nos painéis dessa categoria.',
    buscarCampo: 'Buscar campo',
    buscarOpcao: 'Buscar opção',
    semCampo: 'Nenhum campo encontrado.',
    semOpcao: 'Nenhuma opção encontrada.',
    operadores: { em: 'é', foraDe: 'não é', maior: 'maior que', menor: 'menor que', preenchido: 'está preenchido', vazio: 'está vazio' },
    ou: ' ou ',
    condicao: 'Condição do filtro',
    maisAcoes: 'Mais ações do filtro',
    excluir: 'Excluir filtro',
    limparSelecao: 'Limpar seleção',
    numero: 'Valor',
    limpar: 'Limpar filtros',
  },

  filtroDoPainel: {
    botao: n => n === 0 ? 'Filtros do painel' : n === 1 ? 'Filtros do painel: 1 ativo' : `Filtros do painel: ${n} ativos`,
    salvos: 'Filtros salvos no painel',
    nenhum: 'Nenhum. O painel conta todos os itens da categoria.',
    editar: 'Editar painel',
    daBarra: 'Filtros do dashboard que valem aqui',
    daVisao: 'Filtros só nesta visão',
    daVisaoAjuda: 'Somam aos outros filtros, sem editar o painel. Para guardar, salve a visão.',
  },

  visoes: {
    rotulo: 'Visões',
    semVisao: 'Sem visão salva',
    minhas: 'Minhas visões',
    doWorkspace: 'Visões do workspace',
    salvarNova: 'Salvar como nova visão',
    salvar: 'Salvar visão',
    salvarAlteracoes: 'Salvar alterações',
    alterada: '(alterada)',
    excluir: n => `Excluir a visão "${n}"`,
    excluida: n => `Visão "${n}" excluída`,
    salva: n => `Visão "${n}" salva`,
    atualizada: n => `Visão "${n}" atualizada`,
    salvarTitulo: 'Salvar visão',
    salvarDescricao: 'Guarde o período e os filtros com um nome, para voltar ao mesmo recorte depois.',
    nome: 'Nome da visão',
    nomePlaceholder: 'Ex.: Unidade São Paulo, este trimestre',
    nomeErro: 'Dê um nome à visão.',
    nomeRepetido: 'Já existe uma visão com esse nome.',
    paraQuem: 'Para quem',
    soParaMim: 'Só para mim',
    soParaMimAjuda: 'Aparece só na sua lista de visões.',
    paraTodos: 'Todo o workspace',
    paraTodosAjuda: 'Aparece para todos que veem este dashboard.',
    paraTodosBloqueado: 'Só owner e full salvam visão para o workspace.',
    oQueEntra: 'O que a visão guarda',
    filtrosDoPainel: (p, f) => `No painel ${p}: ${f}`,
    confirmarTitulo: 'Salvar para todo o workspace?',
    confirmarDescricao: n => `A visão "${n}" aparece para todos que veem este dashboard.`,
    confirmarAviso: 'Quem vê o dashboard passa a ver esta visão na lista. Só owner e full podem mudar ou excluir.',
    confirmar: 'Salvar para todos',
    voltar: 'Voltar',
    cancelar: 'Cancelar',
    salvarBotao: 'Salvar visão',
  },

  painel: {
    menu: { editar: 'Editar painel', verItens: 'Ver os itens', duplicar: 'Duplicar painel', baixarCsv: 'Baixar CSV', excluir: 'Excluir painel' },
    todoPeriodo: 'Todo o período',
    periodoPor: (p, c) => `${p}, por ${c}`,
    multiplo: 'Um item pode ter mais de uma opção marcada e conta em cada uma. A soma dos grupos passa do total de itens.',
    multiploCurto: 'Conta em cada opção',
    outros: n => n === 1 ? 'Outros junta 1 grupo' : `Outros junta ${n} grupos`,
    itens: n => n === 1 ? '1 item' : `${n.toLocaleString('pt-BR')} itens`,
    semDadosTitulo: 'Nenhum item no período',
    semDadosDescricao: 'Mude o período do topo ou os filtros do painel.',
    erroTitulo: 'Este painel não carregou',
    erroDescricao: 'Os outros painéis continuam valendo.',
    colunaDoTotal: 'Do total',
    total: 'Total',
    daEtapaAnterior: p => `${p} seguiram da etapa anterior`,
    primeiraEtapa: 'Primeira etapa',
    csvBaixado: 'CSV baixado',
    excluido: 'Painel excluído',
    duplicado: 'Painel duplicado',
    desfazer: 'Desfazer',
    restaurado: 'Painel restaurado',
    arrastar: 'Arrastar o painel',
    ajuda: 'Sobre este painel',
    acoes: 'Ações do painel',
  },

  frase: (f, cat, medida, agrupar, quebra) => {
    const inicio = f === 'contagem' || !medida ? `Quantidade de ${cat}` : `${pt.funcoes[f]} de ${medida} em ${cat}`
    return `${inicio}${agrupar ? ` por ${agrupar}` : ''}${quebra ? ` e ${quebra}` : ''}`
  },
  funcoes: { contagem: 'Contagem de itens', soma: 'Soma', media: 'Média', mediana: 'Mediana', minimo: 'Mínimo', maximo: 'Máximo', distintos: 'Valores distintos' },
  ajudaFuncao: {
    contagem: 'Quantos itens caem em cada grupo.',
    soma: 'Soma o campo de todos os itens do grupo.',
    media: 'Soma o campo e divide pelos itens que têm valor.',
    mediana: 'O valor do meio: metade dos itens fica acima, metade abaixo.',
    minimo: 'O menor valor do campo no grupo.',
    maximo: 'O maior valor do campo no grupo.',
    distintos: 'Quantos valores diferentes o campo tem no grupo.',
  },

  construtor: {
    tituloNovo: 'Novo painel',
    tituloEditar: 'Editar painel',
    descricao: 'Escolha a categoria, o tipo de visualização e os campos. A prévia mostra o resultado com os itens de agora.',
    previa: 'Prévia',
    previaSemEixo: e => `Escolha o campo de ${e.toLowerCase()} para ver a prévia.`,
    passos: {
      fonte: 'Fonte de dados',
      visualizacao: 'Visualização',
      campos: 'Campos',
      filtros: 'Filtros do painel',
      periodo: 'Período',
      ordem: 'Ordem e limite',
      titulo: 'Título e descrição',
    },
    categoria: 'Categoria',
    buscarCategoria: 'Buscar categoria',
    buscarCampo: 'Buscar campo',
    visualizacao: 'Tipo de visualização',
    visualizacoes: { numero: 'Cartão', barras: 'Colunas', barrasHorizontais: 'Barras', linha: 'Linha', area: 'Área', rosca: 'Rosca', funil: 'Funil', tabela: 'Tabela' },
    ajudaVisualizacao: {
      numero: 'Um número em destaque, como os cartões do painel de tarefas. Clicar no cartão abre os itens.',
      barras: 'Compara grupos em colunas. Com legenda, as colunas ficam empilhadas.',
      barrasHorizontais: 'Ranking em barras deitadas. Serve para nomes longos e muitos grupos.',
      linha: 'Evolução no tempo, pelo campo de data.',
      area: 'Evolução no tempo, com as partes empilhadas.',
      rosca: 'Parte do todo, para até 8 grupos.',
      funil: 'Etapas na ordem das opções. Cada etapa conta os itens que chegaram até ela.',
      tabela: 'Os números exatos de cada grupo, em linhas e colunas.',
    },
    tipoSemCampo: e => `Esta categoria não tem campo que sirva de ${e.toLowerCase()}.`,
    eixos: { numero: 'Valor', barras: 'Eixo', barrasHorizontais: 'Eixo', linha: 'Eixo de tempo', area: 'Eixo de tempo', rosca: 'Fatias', funil: 'Etapas', tabela: 'Linhas' },
    ajudaDoEixo: {
      numero: '',
      barras: 'Cada opção do campo vira uma coluna.',
      barrasHorizontais: 'Cada opção do campo vira uma barra.',
      linha: 'O campo de data que forma a linha do tempo.',
      area: 'O campo de data que forma a linha do tempo.',
      rosca: 'Cada opção do campo vira uma fatia. Servem campos com até 8 opções.',
      funil: 'Cada opção vira uma etapa, na ordem cadastrada no campo. Servem campos de seleção simples.',
      tabela: 'Cada opção do campo vira uma linha.',
    },
    eixoErro: 'Escolha o campo.',
    escolhaCampo: 'Escolha um campo',
    granularidade: 'Agrupar as datas por',
    granularidades: { dia: 'Dia', semana: 'Semana', mes: 'Mês', trimestre: 'Trimestre', ano: 'Ano' },
    valor: 'Valor',
    valorAjudaCartao: 'O número que o cartão mostra.',
    campoDoValor: 'Campo do valor',
    medidaPlaceholder: 'Escolha um campo de número',
    medidaErro: 'Escolha o campo que o cálculo usa.',
    medidaVazia: 'Esta categoria não tem campo de número, de moeda nem campo virtual.',
    virtual: 'Campo virtual',
    legenda: 'Legenda (opcional)',
    legendaNenhuma: 'Sem legenda',
    legendaAjuda: 'Separa cada coluna, barra ou linha em partes, uma cor para cada opção de outro campo.',
    colunas: 'Colunas (opcional)',
    colunasAjuda: 'Cada opção de outro campo vira uma coluna da tabela.',
    multiploAviso: 'Múltipla seleção: o item conta em cada opção marcada.',
    relacaoAviso: c => `Relação: agrupa pelo item de ${c} ligado a cada item.`,
    filtrosAjuda: 'Salvos no painel: valem para todos que veem o dashboard. Sem filtro, o painel conta todos os itens da categoria.',
    periodo: 'Período do painel',
    periodoDashboard: 'Seguir o período do dashboard',
    periodoDashboardAjuda: p => `Muda junto com o período do topo. Agora: ${p}.`,
    periodoTodo: 'Todo o período',
    periodoTodoAjuda: 'Ignora o período do topo. Serve para o que existe agora, como os contratos em negociação.',
    campoDeData: 'Data que o período lê',
    campoDeDataAjuda: 'O item entra no período por esta data.',
    ordem: 'Ordem',
    ordens: { natural: 'Ordem das opções', valorDesc: 'Maior valor primeiro', valorAsc: 'Menor valor primeiro', rotulo: 'Ordem alfabética' },
    limite: 'Mostrar no máximo',
    limites: n => `${n} grupos`,
    semLimite: 'Todos os grupos',
    limiteAjuda: 'O resto entra em Outros.',
    mostrarValores: 'Mostrar o valor em cada coluna',
    titulo: 'Título (opcional)',
    tituloAjuda: 'Vazio, o título é a frase da configuração.',
    descricaoDoPainel: 'Descrição (opcional)',
    descricaoAjuda: 'Aparece no ícone de ajuda do painel. Sem descrição, o painel não mostra o ícone.',
    descricaoPlaceholder: 'Ex.: Soma o valor dos contratos com data de assinatura no período.',
    faltaAlgo: 'Preencha os campos obrigatórios.',
    cancelar: 'Cancelar',
    salvar: 'Salvar painel',
    adicionar: 'Adicionar ao dashboard',
    salvo: 'Painel salvo',
    adicionado: 'Painel adicionado',
    sistema: 'Campos do sistema',
  },

  detalhe: {
    itens: n => n === 1 ? '1 item' : `${n.toLocaleString('pt-BR')} itens`,
    abrirNaListagem: c => `Abrir na listagem de ${c}`,
    abrirAviso: 'Abre a listagem da categoria com este recorte aplicado.',
    referencia: 'Referência',
    criadoEm: 'Criado em',
    periodo: p => `Período: ${p}`,
    vazio: 'Nenhum item neste recorte.',
    fechar: 'Fechar',
  },

  formDashboard: {
    tituloEditar: 'Editar dashboard',
    tituloNovo: 'Novo dashboard',
    nome: 'Nome',
    nomeErro: 'Dê um nome ao dashboard.',
    descricao: 'Descrição (opcional)',
    quemVe: 'Quem vê',
    todosMembros: 'Todos os membros',
    quemVeAjuda: 'Cada painel mostra só os itens que a pessoa pode ver.',
    recarga: 'Recarregar os dados',
    recargas: n => `A cada ${n} min`,
    semRecarga: 'Não recarregar',
    salvar: 'Salvar',
    criar: 'Criar dashboard',
    cancelar: 'Cancelar',
    salvo: 'Dashboard salvo',
    criado: 'Dashboard criado',
  },

  estados: {
    vazioTitulo: 'Este dashboard ainda não tem painéis',
    vazioDescricao: 'Um painel conta, soma ou compara os itens de uma categoria. Comece pelo dado que você quer acompanhar.',
    vazioDescricaoComBeni: 'Um painel conta, soma ou compara os itens de uma categoria. Monte o primeiro ou descreva ao BENI o que você quer ver.',
    vazioLeitor: 'Quem administra o dashboard ainda não adicionou painéis.',
    semAcessoTitulo: 'Você não tem acesso a este dashboard',
    semAcessoDescricao: 'Peça acesso a quem administra o workspace.',
  },

  inicial: {
    titulo: 'Monte o primeiro dashboard',
    descricaoA: 'Um dashboard junta números e gráficos dos itens das suas categorias. O BENI lê as categorias e propõe os primeiros painéis; você confirma o que cada campo significa antes de criar.',
    descricaoB: 'Um dashboard junta painéis com números e gráficos dos itens das suas categorias. Cada painel conta, soma ou compara um campo.',
    comBeni: 'Construir com o BENI',
    doZero: 'Começar do zero',
    criar: 'Criar dashboard',
    leTitulo: 'O que o BENI lê',
    leTexto: 'Os campos de cada categoria, o tipo de cada um e quantos itens existem.',
    perguntaTitulo: 'O que o BENI pergunta',
    perguntaTexto: 'O que o nome do campo não diz: se um número se soma ou se tira a média, e qual data vale.',
    passos: [
      'Dê um nome ao dashboard e escolha quem vê.',
      'Adicione painéis: a categoria, o tipo de visualização e os campos.',
      'Arraste e redimensione os painéis até o dashboard ficar do seu jeito.',
    ],
    semCategoriasTitulo: 'Ainda não há categorias',
    semCategoriasDescricao: 'Os painéis são montados com os campos das categorias. Crie uma categoria e cadastre itens para montar o primeiro dashboard.',
    criarCategoria: 'Criar categoria',
    criarCategoriaAviso: 'No produto, abre Estrutura > Categorias.',
    leitorTitulo: 'Nenhum dashboard compartilhado com você',
    leitorDescricao: 'Quando alguém compartilhar um dashboard com o seu grupo, ele aparece aqui.',
  },

  beni: {
    titulo: 'Construir com o BENI',
    passo: (i, n) => `Passo ${i} de ${n}`,
    cancelar: 'Cancelar',
    voltar: 'Voltar',
    ola: 'Eu leio as categorias que você escolher e proponho os primeiros painéis.',
    limite: 'Eu sei o tipo de cada campo, mas não o que ele significa. Antes de propor, pergunto o que o nome não diz.',
    categorias: 'Categorias do dashboard',
    categoriasErro: 'Escolha pelo menos 1 categoria.',
    resumoDaCategoria: (c, i) => `${c} campos · ${i.toLocaleString('pt-BR')} itens`,
    pedido: 'O que você quer acompanhar? (opcional)',
    pedidoAjuda: 'Nome de campo citado aqui entra nos primeiros painéis.',
    pedidoPlaceholder: 'Ex.: valor assinado por mês e contratos por unidade',
    ler: 'Ler as categorias',
    lendo: 'Lendo os campos e os itens...',
    leitura: (c, i, s, n, d) => `${c} campos (${s} de seleção, ${n} de número, ${d} de data) e ${i.toLocaleString('pt-BR')} itens`,
    confirmar: 'Confirme o que eu não consigo saber pelo nome do campo. Já deixei um palpite em cada um.',
    palpite: 'Palpite do BENI',
    perguntaMedida: c => `Como usar "${c}" nos painéis?`,
    perguntaData: c => `Qual data marca o fato principal de ${c}?`,
    perguntaEtapas: (c, o) => `As opções de "${c}" (${o}...) são etapas em ordem?`,
    usos: {
      soma: 'Somar: é dinheiro ou quantidade',
      media: 'Tirar a média: é nota, prazo ou taxa',
      ignorar: 'Não usar no dashboard',
    },
    etapasSim: 'Sim: dá para montar um funil',
    etapasNao: 'Não: são categorias sem ordem',
    verPropostas: 'Ver os painéis sugeridos',
    propostas: n => n === 1 ? 'Proponho 1 painel. Tire o que não fizer sentido.' : `Proponho ${n} painéis. Tire o que não fizer sentido.`,
    nomeDoDashboard: 'Nome do dashboard',
    depois: 'Depois de criar, cada painel se edita, se arrasta e se exclui como qualquer outro.',
    criar: n => n === 1 ? 'Criar dashboard com 1 painel' : `Criar dashboard com ${n} painéis`,
    e: ' e ',
    motivos: {
      contagem: (_c, cat) => `Quantos itens de ${cat} existem no período.`,
      soma: c => `Você disse que "${c}" se soma.`,
      media: c => `Você disse que "${c}" é nota, prazo ou taxa.`,
      tempo: c => `"${c}" é data: a linha mostra a evolução mês a mês.`,
      distribuicao: c => `"${c}" é seleção: cada coluna é uma opção.`,
      etapas: c => `Você disse que "${c}" segue etapas em ordem.`,
      relacao: c => `"${c}" liga a outra categoria: o ranking mostra os que mais aparecem.`,
      multiplo: c => `"${c}" aceita mais de uma opção: o item conta em cada uma.`,
    },
    criado: 'Dashboard criado com o BENI',
    criadoDescricao: 'Confira os painéis: o BENI pode ter entendido errado o sentido de algum campo.',
  },

  pedir: {
    titulo: 'Pedir ao BENI',
    descricao: 'Descreva o que você quer ver. O BENI sugere até 3 painéis, e você escolhe quais entram.',
    pedido: 'O que você quer ver?',
    pedidoErro: 'Descreva o painel que você quer.',
    placeholder: 'Ex.: soma do valor por unidade',
    pensando: 'O BENI está montando as sugestões...',
    sugestoes: 'Sugestões do BENI',
    sugerir: 'Sugerir painéis',
    adicionar: n => n === 1 ? 'Adicionar 1 painel' : `Adicionar ${n} painéis`,
    adicionados: n => n === 1 ? '1 painel adicionado' : `${n} painéis adicionados`,
  },

  rotulos: { vazio: 'Sem valor', outros: 'Outros', sim: 'Sim', nao: 'Não' },
  periodos: { '7d': 'Últimos 7 dias', '30d': 'Últimos 30 dias', '90d': 'Últimos 90 dias', 'month': 'Este mês', 'quarter': 'Este trimestre', 'year': 'Este ano' },
  periodoPersonalizado: (de, ate) => `${de} a ${ate}`,
}

/* =================================== en ==================================== */

const en: Textos = {
  locale: 'en',
  casca: {
    menuLateral: 'Workspace menu', buscar: 'Search...', membro: 'Member', configuracoes: 'Settings',
    ajuda: 'Help', trilha: 'Breadcrumb', recolherMenu: 'Collapse the menu', abrirMenu: 'Open the menu',
    voltar: 'Back', avancar: 'Forward', recarregar: 'Reload', suporte: 'Support',
    notificacoes: 'Notifications', idioma: 'Language', tema: 'Theme', conta: 'Your account', novo: 'New',
    itens: {
      inicio: 'Home', spaceflows: 'Spaceflows', categorias: 'Categories', tarefas: 'Tasks',
      agendadas: 'Scheduled', rapidas: 'Quick',
      agenda: 'Schedule', relatorios: 'Reports', relatoriosExportados: 'Exported reports',
      painelDeTarefas: 'Task dashboard', dashboards: 'Dashboards', knowledge: 'Knowledge',
      visaoGeral: 'Overview', sistema: 'System', estrutura: 'Structure', gestaoDeMembros: 'Member management',
      interface: 'Interface', emails: 'Emails', integracoes: 'Integrations', agentesDeIa: 'AI agents',
      logs: 'Logs', releases: 'Releases', documentacao: 'Documentation',
    },
  },
  workspace: 'teste ux 2',
  trilhaRelatorios: 'Reports',
  trilhaDashboards: 'Dashboards',

  pagina: {
    trocarDashboard: 'Switch dashboard',
    novoDashboard: 'New dashboard',
    novoPainel: 'New panel',
    pedirAoBeni: 'Ask BENI',
    maisAcoes: 'More dashboard actions',
    editarDashboard: 'Edit dashboard',
    atualizarDados: 'Refresh data',
    duplicarDashboard: 'Duplicate dashboard',
    excluirDashboard: 'Delete dashboard',
    atualizado: (h, m) => `Updated at ${h}. Refreshes every ${m} min.`,
    atualizadoSemRecarga: h => `Updated at ${h}.`,
    visivelPara: g => g.length ? `Visible to ${listaEn(g)}` : 'Visible to all members',
    paineis: n => n === 1 ? '1 panel' : `${n} panels`,
    dadosAtualizados: 'Data refreshed',
    duplicado: 'Dashboard duplicated',
    excluido: 'Dashboard deleted',
    arrasteDica: 'To move a panel, drag it by the handle at the top. To resize it, drag the bottom right corner.',
    fecharDica: 'Close the tip',
  },

  filtro: {
    adicionar: 'Filter',
    ajudaDoDashboard: 'Each field belongs to 1 category. The filter applies to the panels of that category.',
    buscarCampo: 'Search field',
    buscarOpcao: 'Search option',
    semCampo: 'No field found.',
    semOpcao: 'No option found.',
    operadores: { em: 'is', foraDe: 'is not', maior: 'greater than', menor: 'less than', preenchido: 'is filled', vazio: 'is empty' },
    ou: ' or ',
    condicao: 'Filter condition',
    maisAcoes: 'More filter actions',
    excluir: 'Delete filter',
    limparSelecao: 'Clear selection',
    numero: 'Value',
    limpar: 'Clear filters',
  },

  filtroDoPainel: {
    botao: n => n === 0 ? 'Panel filters' : n === 1 ? 'Panel filters: 1 active' : `Panel filters: ${n} active`,
    salvos: 'Filters saved in the panel',
    nenhum: 'None. The panel counts all items of the category.',
    editar: 'Edit panel',
    daBarra: 'Dashboard filters that apply here',
    daVisao: 'Filters for this view only',
    daVisaoAjuda: 'They add to the other filters without editing the panel. To keep them, save the view.',
  },

  visoes: {
    rotulo: 'Views',
    semVisao: 'No saved view',
    minhas: 'My views',
    doWorkspace: 'Workspace views',
    salvarNova: 'Save as a new view',
    salvar: 'Save view',
    salvarAlteracoes: 'Save changes',
    alterada: '(changed)',
    excluir: n => `Delete the view "${n}"`,
    excluida: n => `View "${n}" deleted`,
    salva: n => `View "${n}" saved`,
    atualizada: n => `View "${n}" updated`,
    salvarTitulo: 'Save view',
    salvarDescricao: 'Keep the period and the filters under a name, to return to the same slice later.',
    nome: 'View name',
    nomePlaceholder: 'E.g.: São Paulo unit, this quarter',
    nomeErro: 'Give the view a name.',
    nomeRepetido: 'A view with this name already exists.',
    paraQuem: 'For whom',
    soParaMim: 'Only for me',
    soParaMimAjuda: 'Appears only in your list of views.',
    paraTodos: 'The whole workspace',
    paraTodosAjuda: 'Appears for everyone who sees this dashboard.',
    paraTodosBloqueado: 'Only owner and full users save views for the workspace.',
    oQueEntra: 'What the view keeps',
    filtrosDoPainel: (p, f) => `In the ${p} panel: ${f}`,
    confirmarTitulo: 'Save for the whole workspace?',
    confirmarDescricao: n => `The view "${n}" appears for everyone who sees this dashboard.`,
    confirmarAviso: 'Everyone who sees the dashboard sees this view in the list. Only owner and full users can change or delete it.',
    confirmar: 'Save for everyone',
    voltar: 'Back',
    cancelar: 'Cancel',
    salvarBotao: 'Save view',
  },

  painel: {
    menu: { editar: 'Edit panel', verItens: 'View the items', duplicar: 'Duplicate panel', baixarCsv: 'Download CSV', excluir: 'Delete panel' },
    todoPeriodo: 'All time',
    periodoPor: (p, c) => `${p}, by ${c}`,
    multiplo: 'An item can have more than one option checked and counts in each one. The sum of the groups exceeds the total of items.',
    multiploCurto: 'Counts in each option',
    outros: n => n === 1 ? 'Others groups 1 group' : `Others groups ${n} groups`,
    itens: n => n === 1 ? '1 item' : `${n.toLocaleString('en')} items`,
    semDadosTitulo: 'No items in the period',
    semDadosDescricao: 'Change the period at the top or the panel filters.',
    erroTitulo: 'This panel did not load',
    erroDescricao: 'The other panels are still valid.',
    colunaDoTotal: 'Of total',
    total: 'Total',
    daEtapaAnterior: p => `${p} moved on from the previous stage`,
    primeiraEtapa: 'First stage',
    csvBaixado: 'CSV downloaded',
    excluido: 'Panel deleted',
    duplicado: 'Panel duplicated',
    desfazer: 'Undo',
    restaurado: 'Panel restored',
    arrastar: 'Drag the panel',
    ajuda: 'About this panel',
    acoes: 'Panel actions',
  },

  frase: (f, cat, medida, agrupar, quebra) => {
    const inicio = f === 'contagem' || !medida ? `Number of ${cat}` : `${en.funcoes[f]} of ${medida} in ${cat}`
    return `${inicio}${agrupar ? ` by ${agrupar}` : ''}${quebra ? ` and ${quebra}` : ''}`
  },
  funcoes: { contagem: 'Count of items', soma: 'Sum', media: 'Average', mediana: 'Median', minimo: 'Minimum', maximo: 'Maximum', distintos: 'Distinct values' },
  ajudaFuncao: {
    contagem: 'How many items fall into each group.',
    soma: 'Adds up the field of all items in the group.',
    media: 'Adds up the field and divides by the items that have a value.',
    mediana: 'The middle value: half of the items are above, half below.',
    minimo: 'The lowest value of the field in the group.',
    maximo: 'The highest value of the field in the group.',
    distintos: 'How many different values the field has in the group.',
  },

  construtor: {
    tituloNovo: 'New panel',
    tituloEditar: 'Edit panel',
    descricao: 'Choose the category, the visualization type and the fields. The preview shows the result with the current items.',
    previa: 'Preview',
    previaSemEixo: e => `Choose the ${e.toLowerCase()} field to see the preview.`,
    passos: {
      fonte: 'Data source',
      visualizacao: 'Visualization',
      campos: 'Fields',
      filtros: 'Panel filters',
      periodo: 'Period',
      ordem: 'Order and limit',
      titulo: 'Title and description',
    },
    categoria: 'Category',
    buscarCategoria: 'Search category',
    buscarCampo: 'Search field',
    visualizacao: 'Visualization type',
    visualizacoes: { numero: 'Card', barras: 'Columns', barrasHorizontais: 'Bars', linha: 'Line', area: 'Area', rosca: 'Donut', funil: 'Funnel', tabela: 'Table' },
    ajudaVisualizacao: {
      numero: 'A highlighted number, like the cards of the task dashboard. Clicking the card opens the items.',
      barras: 'Compares groups in columns. With a legend, the columns are stacked.',
      barrasHorizontais: 'Ranking in horizontal bars. Fits long names and many groups.',
      linha: 'Evolution over time, by the date field.',
      area: 'Evolution over time, with the parts stacked.',
      rosca: 'Part of the whole, for up to 8 groups.',
      funil: 'Stages in the order of the options. Each stage counts the items that reached it.',
      tabela: 'The exact numbers of each group, in rows and columns.',
    },
    tipoSemCampo: e => `This category has no field that works as ${e.toLowerCase()}.`,
    eixos: { numero: 'Value', barras: 'Axis', barrasHorizontais: 'Axis', linha: 'Time axis', area: 'Time axis', rosca: 'Slices', funil: 'Stages', tabela: 'Rows' },
    ajudaDoEixo: {
      numero: '',
      barras: 'Each option of the field becomes a column.',
      barrasHorizontais: 'Each option of the field becomes a bar.',
      linha: 'The date field that forms the timeline.',
      area: 'The date field that forms the timeline.',
      rosca: 'Each option of the field becomes a slice. Fields with up to 8 options fit.',
      funil: 'Each option becomes a stage, in the order registered in the field. Single select fields fit.',
      tabela: 'Each option of the field becomes a row.',
    },
    eixoErro: 'Choose the field.',
    escolhaCampo: 'Choose a field',
    granularidade: 'Group dates by',
    granularidades: { dia: 'Day', semana: 'Week', mes: 'Month', trimestre: 'Quarter', ano: 'Year' },
    valor: 'Value',
    valorAjudaCartao: 'The number the card shows.',
    campoDoValor: 'Value field',
    medidaPlaceholder: 'Choose a number field',
    medidaErro: 'Choose the field the calculation uses.',
    medidaVazia: 'This category has no number, currency or virtual field.',
    virtual: 'Virtual field',
    legenda: 'Legend (optional)',
    legendaNenhuma: 'No legend',
    legendaAjuda: 'Splits each column, bar or line into parts, one color for each option of another field.',
    colunas: 'Columns (optional)',
    colunasAjuda: 'Each option of another field becomes a table column.',
    multiploAviso: 'Multi-select: the item counts in each checked option.',
    relacaoAviso: c => `Relationship: groups by the ${c} item linked to each item.`,
    filtrosAjuda: 'Saved in the panel: they apply to everyone who sees the dashboard. Without a filter, the panel counts all items of the category.',
    periodo: 'Panel period',
    periodoDashboard: 'Follow the dashboard period',
    periodoDashboardAjuda: p => `Changes with the period at the top. Now: ${p}.`,
    periodoTodo: 'All time',
    periodoTodoAjuda: 'Ignores the period at the top. Fits what exists now, such as contracts under negotiation.',
    campoDeData: 'Date the period reads',
    campoDeDataAjuda: 'The item enters the period by this date.',
    ordem: 'Order',
    ordens: { natural: 'Order of the options', valorDesc: 'Highest value first', valorAsc: 'Lowest value first', rotulo: 'Alphabetical order' },
    limite: 'Show at most',
    limites: n => `${n} groups`,
    semLimite: 'All groups',
    limiteAjuda: 'The rest goes into Others.',
    mostrarValores: 'Show the value on each column',
    titulo: 'Title (optional)',
    tituloAjuda: 'When empty, the title is the configuration sentence.',
    descricaoDoPainel: 'Description (optional)',
    descricaoAjuda: 'Appears in the help icon of the panel. Without a description, the panel does not show the icon.',
    descricaoPlaceholder: 'E.g.: Adds up the value of contracts with a signing date in the period.',
    faltaAlgo: 'Fill in the required fields.',
    cancelar: 'Cancel',
    salvar: 'Save panel',
    adicionar: 'Add to dashboard',
    salvo: 'Panel saved',
    adicionado: 'Panel added',
    sistema: 'System fields',
  },

  detalhe: {
    itens: n => n === 1 ? '1 item' : `${n.toLocaleString('en')} items`,
    abrirNaListagem: c => `Open in the ${c} list`,
    abrirAviso: 'Opens the category list with this slice applied.',
    referencia: 'Reference',
    criadoEm: 'Created at',
    periodo: p => `Period: ${p}`,
    vazio: 'No items in this slice.',
    fechar: 'Close',
  },

  formDashboard: {
    tituloEditar: 'Edit dashboard',
    tituloNovo: 'New dashboard',
    nome: 'Name',
    nomeErro: 'Give the dashboard a name.',
    descricao: 'Description (optional)',
    quemVe: 'Who can see',
    todosMembros: 'All members',
    quemVeAjuda: 'Each panel shows only the items the person can see.',
    recarga: 'Refresh the data',
    recargas: n => `Every ${n} min`,
    semRecarga: 'Do not refresh',
    salvar: 'Save',
    criar: 'Create dashboard',
    cancelar: 'Cancel',
    salvo: 'Dashboard saved',
    criado: 'Dashboard created',
  },

  estados: {
    vazioTitulo: 'This dashboard has no panels yet',
    vazioDescricao: 'A panel counts, adds up or compares the items of a category. Start with the data you want to follow.',
    vazioDescricaoComBeni: 'A panel counts, adds up or compares the items of a category. Build the first one or describe to BENI what you want to see.',
    vazioLeitor: 'The dashboard administrator has not added panels yet.',
    semAcessoTitulo: 'You do not have access to this dashboard',
    semAcessoDescricao: 'Ask the workspace administrator for access.',
  },

  inicial: {
    titulo: 'Build the first dashboard',
    descricaoA: 'A dashboard brings together numbers and charts from the items of your categories. BENI reads the categories and proposes the first panels; you confirm what each field means before creating it.',
    descricaoB: 'A dashboard brings together panels with numbers and charts from the items of your categories. Each panel counts, adds up or compares a field.',
    comBeni: 'Build with BENI',
    doZero: 'Start from scratch',
    criar: 'Create dashboard',
    leTitulo: 'What BENI reads',
    leTexto: 'The fields of each category, the type of each one and how many items exist.',
    perguntaTitulo: 'What BENI asks',
    perguntaTexto: 'What the field name does not say: whether a number is added up or averaged, and which date counts.',
    passos: [
      'Name the dashboard and choose who can see it.',
      'Add panels: the category, the visualization type and the fields.',
      'Drag and resize the panels until the dashboard fits your needs.',
    ],
    semCategoriasTitulo: 'There are no categories yet',
    semCategoriasDescricao: 'Panels are built with the fields of the categories. Create a category and register items to build the first dashboard.',
    criarCategoria: 'Create category',
    criarCategoriaAviso: 'In the product, this opens Structure > Categories.',
    leitorTitulo: 'No dashboard shared with you',
    leitorDescricao: 'When someone shares a dashboard with your group, it appears here.',
  },

  beni: {
    titulo: 'Build with BENI',
    passo: (i, n) => `Step ${i} of ${n}`,
    cancelar: 'Cancel',
    voltar: 'Back',
    ola: 'I read the categories you choose and propose the first panels.',
    limite: 'I know the type of each field, but not what it means. Before proposing, I ask what the name does not say.',
    categorias: 'Dashboard categories',
    categoriasErro: 'Choose at least 1 category.',
    resumoDaCategoria: (c, i) => `${c} fields · ${i.toLocaleString('en')} items`,
    pedido: 'What do you want to follow? (optional)',
    pedidoAjuda: 'Field names mentioned here go into the first panels.',
    pedidoPlaceholder: 'E.g.: signed value per month and contracts per unit',
    ler: 'Read the categories',
    lendo: 'Reading the fields and the items...',
    leitura: (c, i, s, n, d) => `${c} fields (${s} select, ${n} number, ${d} date) and ${i.toLocaleString('en')} items`,
    confirmar: 'Confirm what I cannot tell from the field name. I left a guess in each one.',
    palpite: 'BENI guess',
    perguntaMedida: c => `How should "${c}" be used in the panels?`,
    perguntaData: c => `Which date marks the main event of ${c}?`,
    perguntaEtapas: (c, o) => `Are the options of "${c}" (${o}...) stages in order?`,
    usos: {
      soma: 'Add up: it is money or quantity',
      media: 'Average: it is a score, a time or a rate',
      ignorar: 'Do not use in the dashboard',
    },
    etapasSim: 'Yes: a funnel can be built',
    etapasNao: 'No: they are categories without order',
    verPropostas: 'See the suggested panels',
    propostas: n => n === 1 ? 'I propose 1 panel. Remove what does not make sense.' : `I propose ${n} panels. Remove what does not make sense.`,
    nomeDoDashboard: 'Dashboard name',
    depois: 'After creating, each panel can be edited, dragged and deleted like any other.',
    criar: n => n === 1 ? 'Create dashboard with 1 panel' : `Create dashboard with ${n} panels`,
    e: ' and ',
    motivos: {
      contagem: (_c, cat) => `How many ${cat} items exist in the period.`,
      soma: c => `You said "${c}" is added up.`,
      media: c => `You said "${c}" is a score, a time or a rate.`,
      tempo: c => `"${c}" is a date: the line shows the evolution month by month.`,
      distribuicao: c => `"${c}" is a select field: each column is one option.`,
      etapas: c => `You said "${c}" follows stages in order.`,
      relacao: c => `"${c}" links to another category: the ranking shows the most frequent ones.`,
      multiplo: c => `"${c}" accepts more than one option: the item counts in each one.`,
    },
    criado: 'Dashboard created with BENI',
    criadoDescricao: 'Check the panels: BENI may have misunderstood the meaning of a field.',
  },

  pedir: {
    titulo: 'Ask BENI',
    descricao: 'Describe what you want to see. BENI suggests up to 3 panels, and you choose which ones go in.',
    pedido: 'What do you want to see?',
    pedidoErro: 'Describe the panel you want.',
    placeholder: 'E.g.: sum of the value per unit',
    pensando: 'BENI is building the suggestions...',
    sugestoes: 'BENI suggestions',
    sugerir: 'Suggest panels',
    adicionar: n => n === 1 ? 'Add 1 panel' : `Add ${n} panels`,
    adicionados: n => n === 1 ? '1 panel added' : `${n} panels added`,
  },

  rotulos: { vazio: 'No value', outros: 'Others', sim: 'Yes', nao: 'No' },
  periodos: { '7d': 'Last 7 days', '30d': 'Last 30 days', '90d': 'Last 90 days', 'month': 'This month', 'quarter': 'This quarter', 'year': 'This year' },
  periodoPersonalizado: (de, ate) => `${de} to ${ate}`,
}

/* =================================== es ==================================== */

const es: Textos = {
  locale: 'es',
  casca: {
    menuLateral: 'Menú del workspace', buscar: 'Buscar...', membro: 'Miembro', configuracoes: 'Configuraciones',
    ajuda: 'Ayuda', trilha: 'Ruta', recolherMenu: 'Contraer el menú', abrirMenu: 'Abrir el menú',
    voltar: 'Volver', avancar: 'Avanzar', recarregar: 'Recargar', suporte: 'Soporte',
    notificacoes: 'Notificaciones', idioma: 'Idioma', tema: 'Tema', conta: 'Su cuenta', novo: 'Nuevo',
    itens: {
      inicio: 'Inicio', spaceflows: 'Spaceflows', categorias: 'Categorías', tarefas: 'Tareas',
      agendadas: 'Programadas', rapidas: 'Rápidas',
      agenda: 'Agenda', relatorios: 'Informes', relatoriosExportados: 'Informes exportados',
      painelDeTarefas: 'Panel de tareas', dashboards: 'Dashboards', knowledge: 'Knowledge',
      visaoGeral: 'Visión General', sistema: 'Sistema', estrutura: 'Estructura', gestaoDeMembros: 'Gestión de Miembros',
      interface: 'Interfaz', emails: 'Correos', integracoes: 'Integraciones', agentesDeIa: 'Agentes de IA',
      logs: 'Registros', releases: 'Releases', documentacao: 'Documentación',
    },
  },
  workspace: 'teste ux 2',
  trilhaRelatorios: 'Informes',
  trilhaDashboards: 'Dashboards',

  pagina: {
    trocarDashboard: 'Cambiar de dashboard',
    novoDashboard: 'Nuevo dashboard',
    novoPainel: 'Nuevo panel',
    pedirAoBeni: 'Pedir a BENI',
    maisAcoes: 'Más acciones del dashboard',
    editarDashboard: 'Editar dashboard',
    atualizarDados: 'Actualizar datos',
    duplicarDashboard: 'Duplicar dashboard',
    excluirDashboard: 'Eliminar dashboard',
    atualizado: (h, m) => `Actualizado a las ${h}. Se recarga cada ${m} min.`,
    atualizadoSemRecarga: h => `Actualizado a las ${h}.`,
    visivelPara: g => g.length ? `Visible para ${listaEs(g)}` : 'Visible para todos los miembros',
    paineis: n => n === 1 ? '1 panel' : `${n} paneles`,
    dadosAtualizados: 'Datos actualizados',
    duplicado: 'Dashboard duplicado',
    excluido: 'Dashboard eliminado',
    arrasteDica: 'Para mover un panel, arrástrelo por el asa de arriba. Para cambiar el tamaño, arrastre la esquina inferior derecha.',
    fecharDica: 'Cerrar el consejo',
  },

  filtro: {
    adicionar: 'Filtro',
    ajudaDoDashboard: 'Cada campo pertenece a 1 categoría. El filtro vale en los paneles de esa categoría.',
    buscarCampo: 'Buscar campo',
    buscarOpcao: 'Buscar opción',
    semCampo: 'Ningún campo encontrado.',
    semOpcao: 'Ninguna opción encontrada.',
    operadores: { em: 'es', foraDe: 'no es', maior: 'mayor que', menor: 'menor que', preenchido: 'está lleno', vazio: 'está vacío' },
    ou: ' o ',
    condicao: 'Condición del filtro',
    maisAcoes: 'Más acciones del filtro',
    excluir: 'Eliminar filtro',
    limparSelecao: 'Limpiar selección',
    numero: 'Valor',
    limpar: 'Limpiar filtros',
  },

  filtroDoPainel: {
    botao: n => n === 0 ? 'Filtros del panel' : n === 1 ? 'Filtros del panel: 1 activo' : `Filtros del panel: ${n} activos`,
    salvos: 'Filtros guardados en el panel',
    nenhum: 'Ninguno. El panel cuenta todos los ítems de la categoría.',
    editar: 'Editar panel',
    daBarra: 'Filtros del dashboard que valen aquí',
    daVisao: 'Filtros solo en esta vista',
    daVisaoAjuda: 'Se suman a los demás filtros, sin editar el panel. Para conservarlos, guarde la vista.',
  },

  visoes: {
    rotulo: 'Vistas',
    semVisao: 'Sin vista guardada',
    minhas: 'Mis vistas',
    doWorkspace: 'Vistas del workspace',
    salvarNova: 'Guardar como nueva vista',
    salvar: 'Guardar vista',
    salvarAlteracoes: 'Guardar cambios',
    alterada: '(modificada)',
    excluir: n => `Eliminar la vista "${n}"`,
    excluida: n => `Vista "${n}" eliminada`,
    salva: n => `Vista "${n}" guardada`,
    atualizada: n => `Vista "${n}" actualizada`,
    salvarTitulo: 'Guardar vista',
    salvarDescricao: 'Guarde el período y los filtros con un nombre, para volver al mismo recorte después.',
    nome: 'Nombre de la vista',
    nomePlaceholder: 'Ej.: Unidad São Paulo, este trimestre',
    nomeErro: 'Dé un nombre a la vista.',
    nomeRepetido: 'Ya existe una vista con ese nombre.',
    paraQuem: 'Para quién',
    soParaMim: 'Solo para mí',
    soParaMimAjuda: 'Aparece solo en su lista de vistas.',
    paraTodos: 'Todo el workspace',
    paraTodosAjuda: 'Aparece para todos los que ven este dashboard.',
    paraTodosBloqueado: 'Solo owner y full guardan vistas para el workspace.',
    oQueEntra: 'Lo que guarda la vista',
    filtrosDoPainel: (p, f) => `En el panel ${p}: ${f}`,
    confirmarTitulo: '¿Guardar para todo el workspace?',
    confirmarDescricao: n => `La vista "${n}" aparece para todos los que ven este dashboard.`,
    confirmarAviso: 'Quien ve el dashboard pasa a ver esta vista en la lista. Solo owner y full pueden cambiarla o eliminarla.',
    confirmar: 'Guardar para todos',
    voltar: 'Volver',
    cancelar: 'Cancelar',
    salvarBotao: 'Guardar vista',
  },

  painel: {
    menu: { editar: 'Editar panel', verItens: 'Ver los ítems', duplicar: 'Duplicar panel', baixarCsv: 'Descargar CSV', excluir: 'Eliminar panel' },
    todoPeriodo: 'Todo el período',
    periodoPor: (p, c) => `${p}, por ${c}`,
    multiplo: 'Un ítem puede tener más de una opción marcada y cuenta en cada una. La suma de los grupos supera el total de ítems.',
    multiploCurto: 'Cuenta en cada opción',
    outros: n => n === 1 ? 'Otros reúne 1 grupo' : `Otros reúne ${n} grupos`,
    itens: n => n === 1 ? '1 ítem' : `${n.toLocaleString('es')} ítems`,
    semDadosTitulo: 'Ningún ítem en el período',
    semDadosDescricao: 'Cambie el período de arriba o los filtros del panel.',
    erroTitulo: 'Este panel no cargó',
    erroDescricao: 'Los demás paneles siguen siendo válidos.',
    colunaDoTotal: 'Del total',
    total: 'Total',
    daEtapaAnterior: p => `${p} avanzaron desde la etapa anterior`,
    primeiraEtapa: 'Primera etapa',
    csvBaixado: 'CSV descargado',
    excluido: 'Panel eliminado',
    duplicado: 'Panel duplicado',
    desfazer: 'Deshacer',
    restaurado: 'Panel restaurado',
    arrastar: 'Arrastrar el panel',
    ajuda: 'Sobre este panel',
    acoes: 'Acciones del panel',
  },

  frase: (f, cat, medida, agrupar, quebra) => {
    const inicio = f === 'contagem' || !medida ? `Cantidad de ${cat}` : `${es.funcoes[f]} de ${medida} en ${cat}`
    return `${inicio}${agrupar ? ` por ${agrupar}` : ''}${quebra ? ` y ${quebra}` : ''}`
  },
  funcoes: { contagem: 'Conteo de ítems', soma: 'Suma', media: 'Promedio', mediana: 'Mediana', minimo: 'Mínimo', maximo: 'Máximo', distintos: 'Valores distintos' },
  ajudaFuncao: {
    contagem: 'Cuántos ítems caen en cada grupo.',
    soma: 'Suma el campo de todos los ítems del grupo.',
    media: 'Suma el campo y divide por los ítems que tienen valor.',
    mediana: 'El valor del medio: la mitad de los ítems queda arriba, la mitad abajo.',
    minimo: 'El menor valor del campo en el grupo.',
    maximo: 'El mayor valor del campo en el grupo.',
    distintos: 'Cuántos valores diferentes tiene el campo en el grupo.',
  },

  construtor: {
    tituloNovo: 'Nuevo panel',
    tituloEditar: 'Editar panel',
    descricao: 'Elija la categoría, el tipo de visualización y los campos. La vista previa muestra el resultado con los ítems actuales.',
    previa: 'Vista previa',
    previaSemEixo: e => `Elija el campo de ${e.toLowerCase()} para ver la vista previa.`,
    passos: {
      fonte: 'Fuente de datos',
      visualizacao: 'Visualización',
      campos: 'Campos',
      filtros: 'Filtros del panel',
      periodo: 'Período',
      ordem: 'Orden y límite',
      titulo: 'Título y descripción',
    },
    categoria: 'Categoría',
    buscarCategoria: 'Buscar categoría',
    buscarCampo: 'Buscar campo',
    visualizacao: 'Tipo de visualización',
    visualizacoes: { numero: 'Tarjeta', barras: 'Columnas', barrasHorizontais: 'Barras', linha: 'Línea', area: 'Área', rosca: 'Dona', funil: 'Embudo', tabela: 'Tabla' },
    ajudaVisualizacao: {
      numero: 'Un número destacado, como las tarjetas del panel de tareas. Hacer clic en la tarjeta abre los ítems.',
      barras: 'Compara grupos en columnas. Con leyenda, las columnas quedan apiladas.',
      barrasHorizontais: 'Ranking en barras horizontales. Sirve para nombres largos y muchos grupos.',
      linha: 'Evolución en el tiempo, por el campo de fecha.',
      area: 'Evolución en el tiempo, con las partes apiladas.',
      rosca: 'Parte del todo, para hasta 8 grupos.',
      funil: 'Etapas en el orden de las opciones. Cada etapa cuenta los ítems que llegaron a ella.',
      tabela: 'Los números exactos de cada grupo, en filas y columnas.',
    },
    tipoSemCampo: e => `Esta categoría no tiene campo que sirva de ${e.toLowerCase()}.`,
    eixos: { numero: 'Valor', barras: 'Eje', barrasHorizontais: 'Eje', linha: 'Eje de tiempo', area: 'Eje de tiempo', rosca: 'Porciones', funil: 'Etapas', tabela: 'Filas' },
    ajudaDoEixo: {
      numero: '',
      barras: 'Cada opción del campo se vuelve una columna.',
      barrasHorizontais: 'Cada opción del campo se vuelve una barra.',
      linha: 'El campo de fecha que forma la línea de tiempo.',
      area: 'El campo de fecha que forma la línea de tiempo.',
      rosca: 'Cada opción del campo se vuelve una porción. Sirven campos con hasta 8 opciones.',
      funil: 'Cada opción se vuelve una etapa, en el orden registrado en el campo. Sirven campos de selección simple.',
      tabela: 'Cada opción del campo se vuelve una fila.',
    },
    eixoErro: 'Elija el campo.',
    escolhaCampo: 'Elija un campo',
    granularidade: 'Agrupar las fechas por',
    granularidades: { dia: 'Día', semana: 'Semana', mes: 'Mes', trimestre: 'Trimestre', ano: 'Año' },
    valor: 'Valor',
    valorAjudaCartao: 'El número que muestra la tarjeta.',
    campoDoValor: 'Campo del valor',
    medidaPlaceholder: 'Elija un campo de número',
    medidaErro: 'Elija el campo que usa el cálculo.',
    medidaVazia: 'Esta categoría no tiene campo de número, de moneda ni campo virtual.',
    virtual: 'Campo virtual',
    legenda: 'Leyenda (opcional)',
    legendaNenhuma: 'Sin leyenda',
    legendaAjuda: 'Separa cada columna, barra o línea en partes, un color para cada opción de otro campo.',
    colunas: 'Columnas (opcional)',
    colunasAjuda: 'Cada opción de otro campo se vuelve una columna de la tabla.',
    multiploAviso: 'Selección múltiple: el ítem cuenta en cada opción marcada.',
    relacaoAviso: c => `Relación: agrupa por el ítem de ${c} vinculado a cada ítem.`,
    filtrosAjuda: 'Guardados en el panel: valen para todos los que ven el dashboard. Sin filtro, el panel cuenta todos los ítems de la categoría.',
    periodo: 'Período del panel',
    periodoDashboard: 'Seguir el período del dashboard',
    periodoDashboardAjuda: p => `Cambia junto con el período de arriba. Ahora: ${p}.`,
    periodoTodo: 'Todo el período',
    periodoTodoAjuda: 'Ignora el período de arriba. Sirve para lo que existe ahora, como los contratos en negociación.',
    campoDeData: 'Fecha que lee el período',
    campoDeDataAjuda: 'El ítem entra en el período por esta fecha.',
    ordem: 'Orden',
    ordens: { natural: 'Orden de las opciones', valorDesc: 'Mayor valor primero', valorAsc: 'Menor valor primero', rotulo: 'Orden alfabético' },
    limite: 'Mostrar como máximo',
    limites: n => `${n} grupos`,
    semLimite: 'Todos los grupos',
    limiteAjuda: 'El resto entra en Otros.',
    mostrarValores: 'Mostrar el valor en cada columna',
    titulo: 'Título (opcional)',
    tituloAjuda: 'Vacío, el título es la frase de la configuración.',
    descricaoDoPainel: 'Descripción (opcional)',
    descricaoAjuda: 'Aparece en el ícono de ayuda del panel. Sin descripción, el panel no muestra el ícono.',
    descricaoPlaceholder: 'Ej.: Suma el valor de los contratos con fecha de firma en el período.',
    faltaAlgo: 'Complete los campos obligatorios.',
    cancelar: 'Cancelar',
    salvar: 'Guardar panel',
    adicionar: 'Agregar al dashboard',
    salvo: 'Panel guardado',
    adicionado: 'Panel agregado',
    sistema: 'Campos del sistema',
  },

  detalhe: {
    itens: n => n === 1 ? '1 ítem' : `${n.toLocaleString('es')} ítems`,
    abrirNaListagem: c => `Abrir en el listado de ${c}`,
    abrirAviso: 'Abre el listado de la categoría con este recorte aplicado.',
    referencia: 'Referencia',
    criadoEm: 'Creado el',
    periodo: p => `Período: ${p}`,
    vazio: 'Ningún ítem en este recorte.',
    fechar: 'Cerrar',
  },

  formDashboard: {
    tituloEditar: 'Editar dashboard',
    tituloNovo: 'Nuevo dashboard',
    nome: 'Nombre',
    nomeErro: 'Dé un nombre al dashboard.',
    descricao: 'Descripción (opcional)',
    quemVe: 'Quién ve',
    todosMembros: 'Todos los miembros',
    quemVeAjuda: 'Cada panel muestra solo los ítems que la persona puede ver.',
    recarga: 'Recargar los datos',
    recargas: n => `Cada ${n} min`,
    semRecarga: 'No recargar',
    salvar: 'Guardar',
    criar: 'Crear dashboard',
    cancelar: 'Cancelar',
    salvo: 'Dashboard guardado',
    criado: 'Dashboard creado',
  },

  estados: {
    vazioTitulo: 'Este dashboard todavía no tiene paneles',
    vazioDescricao: 'Un panel cuenta, suma o compara los ítems de una categoría. Empiece por el dato que quiere seguir.',
    vazioDescricaoComBeni: 'Un panel cuenta, suma o compara los ítems de una categoría. Arme el primero o describa a BENI lo que quiere ver.',
    vazioLeitor: 'Quien administra el dashboard todavía no agregó paneles.',
    semAcessoTitulo: 'Usted no tiene acceso a este dashboard',
    semAcessoDescricao: 'Pida acceso a quien administra el workspace.',
  },

  inicial: {
    titulo: 'Arme el primer dashboard',
    descricaoA: 'Un dashboard reúne números y gráficos de los ítems de sus categorías. BENI lee las categorías y propone los primeros paneles; usted confirma lo que significa cada campo antes de crear.',
    descricaoB: 'Un dashboard reúne paneles con números y gráficos de los ítems de sus categorías. Cada panel cuenta, suma o compara un campo.',
    comBeni: 'Construir con BENI',
    doZero: 'Empezar de cero',
    criar: 'Crear dashboard',
    leTitulo: 'Lo que lee BENI',
    leTexto: 'Los campos de cada categoría, el tipo de cada uno y cuántos ítems existen.',
    perguntaTitulo: 'Lo que pregunta BENI',
    perguntaTexto: 'Lo que el nombre del campo no dice: si un número se suma o se promedia, y qué fecha vale.',
    passos: [
      'Dé un nombre al dashboard y elija quién lo ve.',
      'Agregue paneles: la categoría, el tipo de visualización y los campos.',
      'Arrastre y redimensione los paneles hasta que el dashboard quede a su manera.',
    ],
    semCategoriasTitulo: 'Todavía no hay categorías',
    semCategoriasDescricao: 'Los paneles se arman con los campos de las categorías. Cree una categoría y registre ítems para armar el primer dashboard.',
    criarCategoria: 'Crear categoría',
    criarCategoriaAviso: 'En el producto, abre Estructura > Categorías.',
    leitorTitulo: 'Ningún dashboard compartido con usted',
    leitorDescricao: 'Cuando alguien comparte un dashboard con su grupo, aparece aquí.',
  },

  beni: {
    titulo: 'Construir con BENI',
    passo: (i, n) => `Paso ${i} de ${n}`,
    cancelar: 'Cancelar',
    voltar: 'Volver',
    ola: 'Leo las categorías que usted elija y propongo los primeros paneles.',
    limite: 'Conozco el tipo de cada campo, pero no lo que significa. Antes de proponer, pregunto lo que el nombre no dice.',
    categorias: 'Categorías del dashboard',
    categoriasErro: 'Elija al menos 1 categoría.',
    resumoDaCategoria: (c, i) => `${c} campos · ${i.toLocaleString('es')} ítems`,
    pedido: '¿Qué quiere seguir? (opcional)',
    pedidoAjuda: 'Los nombres de campo citados aquí entran en los primeros paneles.',
    pedidoPlaceholder: 'Ej.: valor firmado por mes y contratos por unidad',
    ler: 'Leer las categorías',
    lendo: 'Leyendo los campos y los ítems...',
    leitura: (c, i, s, n, d) => `${c} campos (${s} de selección, ${n} de número, ${d} de fecha) y ${i.toLocaleString('es')} ítems`,
    confirmar: 'Confirme lo que no logro saber por el nombre del campo. Dejé una suposición en cada uno.',
    palpite: 'Suposición de BENI',
    perguntaMedida: c => `¿Cómo usar "${c}" en los paneles?`,
    perguntaData: c => `¿Qué fecha marca el hecho principal de ${c}?`,
    perguntaEtapas: (c, o) => `¿Las opciones de "${c}" (${o}...) son etapas en orden?`,
    usos: {
      soma: 'Sumar: es dinero o cantidad',
      media: 'Promediar: es nota, plazo o tasa',
      ignorar: 'No usar en el dashboard',
    },
    etapasSim: 'Sí: se puede armar un embudo',
    etapasNao: 'No: son categorías sin orden',
    verPropostas: 'Ver los paneles sugeridos',
    propostas: n => n === 1 ? 'Propongo 1 panel. Quite lo que no tenga sentido.' : `Propongo ${n} paneles. Quite lo que no tenga sentido.`,
    nomeDoDashboard: 'Nombre del dashboard',
    depois: 'Después de crear, cada panel se edita, se arrastra y se elimina como cualquier otro.',
    criar: n => n === 1 ? 'Crear dashboard con 1 panel' : `Crear dashboard con ${n} paneles`,
    e: ' y ',
    motivos: {
      contagem: (_c, cat) => `Cuántos ítems de ${cat} existen en el período.`,
      soma: c => `Usted dijo que "${c}" se suma.`,
      media: c => `Usted dijo que "${c}" es nota, plazo o tasa.`,
      tempo: c => `"${c}" es fecha: la línea muestra la evolución mes a mes.`,
      distribuicao: c => `"${c}" es selección: cada columna es una opción.`,
      etapas: c => `Usted dijo que "${c}" sigue etapas en orden.`,
      relacao: c => `"${c}" vincula a otra categoría: el ranking muestra los que más aparecen.`,
      multiplo: c => `"${c}" acepta más de una opción: el ítem cuenta en cada una.`,
    },
    criado: 'Dashboard creado con BENI',
    criadoDescricao: 'Revise los paneles: BENI puede haber entendido mal el sentido de algún campo.',
  },

  pedir: {
    titulo: 'Pedir a BENI',
    descricao: 'Describa lo que quiere ver. BENI sugiere hasta 3 paneles, y usted elige cuáles entran.',
    pedido: '¿Qué quiere ver?',
    pedidoErro: 'Describa el panel que quiere.',
    placeholder: 'Ej.: suma del valor por unidad',
    pensando: 'BENI está armando las sugerencias...',
    sugestoes: 'Sugerencias de BENI',
    sugerir: 'Sugerir paneles',
    adicionar: n => n === 1 ? 'Agregar 1 panel' : `Agregar ${n} paneles`,
    adicionados: n => n === 1 ? '1 panel agregado' : `${n} paneles agregados`,
  },

  rotulos: { vazio: 'Sin valor', outros: 'Otros', sim: 'Sí', nao: 'No' },
  periodos: { '7d': 'Últimos 7 días', '30d': 'Últimos 30 días', '90d': 'Últimos 90 días', 'month': 'Este mes', 'quarter': 'Este trimestre', 'year': 'Este año' },
  periodoPersonalizado: (de, ate) => `${de} al ${ate}`,
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': pt, en, es }
