// Os textos do protótipo nos 3 idiomas do ENSPACE (regra 35).
//
// A casca e as telas copiadas usam o rótulo do develop, inclusive o que está
// torto ("Juridico" sem acento, "Mail Box", "Emails Automáticos"): é cópia, e
// o torto vira achado no BRIEFING. O texto novo é a copy proposta.
// Nenhum texto de interface leva travessão (regra 33).

import type { Idioma } from '../../composables/useIdioma'
import type { StatusDoItem } from './mocks'
import type { Fase } from './estado'

export interface Textos {
  casca: {
    menuLateral: string
    buscar: string
    membro: string
    configuracoes: string
    ajuda: string
    trilha: string
    voltar: string
    avancar: string
    recarregar: string
    suporte: string
    notificacoes: string
    idioma: string
    tema: string
    workspaces: string
    dados: string
    novoEmail: string
    novoEmailDica: string
    itens: Record<string, string>
    novoEmailNoItem: (ref: string) => string
  }
  atalho: {
    semContato: string
    semEmail: string
    escreverNoEnspace: string
    escreverNoEnspaceComItem: (ref: string) => string
    abrirNoApp: string
    abrirNoAppDica: string
    outrasFormasDeEmail: string
    abrirNoAppComCopia: string
    email: string
  }
  inicio: {
    saudacao: (nome: string) => string
    subtitulo: string
    emAtraso: string
    proximas: string
    rapidas: string
    nenhumaEmAtraso: string
    nenhumaProxima: string
    acessarTarefas: string
    atualizar: string
    mostrando: (n: number) => string
    atrasadaHa: (dias: number) => string
    venceEm: (dias: number) => string
  }
  prioridade: Record<'low' | 'normal' | 'high' | 'urgent', string>
  status: Record<'pending' | 'working' | 'blocked' | 'completed', string>
  etapa: Record<StatusDoItem, string>
  itens: {
    vistaItens: string
    vistaQuadro: string
    visualizar: string
    pesquisar: string
    criadoEm: string
    todoPeriodo: string
    exportar: string
    colunas: string
    filtros: string
    configurar: string
    novoRegistro: string
    referencia: string
    nome: string
    etapa: string
    contato: string
    atualizadoEm: string
    nadaEncontrado: string
    nadaEncontradoDica: string
    acoes: string
    verDetalhes: string
    editar: string
    enviarParaLixeira: string
    copiarLink: string
    contatar: string
    semContato: string
    dicaDoQuadro: string
  }
  item: {
    paraQuem: string
    ajudaComEnspace: (ref: string) => string
    ajudaSemEnspace: string
    semEmailAviso: string
    cadastrarEmail: string
    semContatoTitulo: string
    semContatoDica: string
    escolherCampos: string
    identificacao: string
    origem: string
    status: string
    emailDaSolicitacao: string
    historico: string
    criadoEm: string
    atualizadoEm: string
    editarVisualizacao: string
    imprimirPdf: string
    abas: Record<'visao' | 'comentarios' | 'logs' | 'tarefas' | 'anexos' | 'automaticos' | 'mailbox' | 'notas', string>
    campos: Record<string, string>
    sairSemSalvar: string
    salvar: string
    salvo: string
    copiarEndereco: string
    recebidos: string
    enviados: string
    para: (quem: string) => string
    enviadoPor: (nome: string) => string
    responder: string
    nenhumEmail: string
    semTarefas: string
    foraDoEscopo: string
    foraDoEscopoDica: string
    contato: string
    emailPara: (rotulo: string) => string
    novoEmail: string
    enviadoPelaCaixa: (nome: string, caixa: string) => string
    nenhumEmailDica: string
    nenhumEmailDaTarefa: string
    dataTarefa: string
    doItem: (ref: string) => string
  }
  form: {
    formularios: string
    selecioneUm: string
    compartilharTitulo: string
    publico: string
    privado: string
    qualquerPessoa: string
    linkDoFormulario: string
    copiarLink: string
    copiado: string
    abrirNovaAba: string
    enviarLinkPor: string
    assuntoDoLink: (nome: string) => string
    mensagemDoLink: (nome: string, url: string) => string
    linkCopiado: string
    linkDeFormulario: string
    copiarLinkPublico: string
    nenhumPublico: string
    nenhumPublicoDica: string
    irParaFormularios: string
    soPublicos: string
    privadoDica: string
    porFavorDigite: string
    salvar: string
  }
  tarefas: {
    titulo: string
    lista: string
    pesquisar: string
    arquivadas: string
    lixeira: string
    nova: string
    filtrosRapidos: string
    nome: string
    prazo: string
    status: string
    responsavel: string
    contato: string
    prioridade: string
    item: string
    semResponsavel: string
    semResponsavelDica: string
    abrir: string
    selecionadas: (n: number) => string
    ajudaDoLote: string
    foraDoLote: (n: number) => string
    dicaDoQuadro: string
    respostaCriaItem: (categoria: string) => string
    assuntoDoAviso: (tarefa: string, prazo: string | null) => string
    mensagemDoAviso: (nome: string, tarefa: string, prazo: string | null) => string
    assuntoDoLote: (n: number) => string
    emailPara: (nome: string) => string
    emailParaResponsaveis: (n: number) => string
    abrirMailBox: string
    detalhes: string
    semItemTitulo: string
    semItemDescricao: string
  }
  agenda: {
    hoje: string
    anterior: string
    proximo: string
    visualizacao: string
    mes: string
    data: string
    diaUtil: string
    diaNaoUtil: string
    mais: (n: number) => string
    evento: string
    participantes: string
    quem: Record<'outlook' | 'item' | 'tarefa', string>
    fonte: Record<'outlook' | 'item' | 'tarefa', string>
    intervalo: (de: string, ate: string) => string
    enviarLembrete: string
    emailParaTodos: (n: number) => string
    assuntoDoLembrete: (evento: string, quando: string) => string
    mensagemDoLembrete: (nome: string, evento: string, quando: string) => string
    emailPara: (nome: string) => string
    ajudaDoLembrete: string
  }
  emails: {
    titulo: string
    descricaoFase1: string
    descricaoFase2: string
    descricaoDoSistema: string
    pesquisar: string
    limparBusca: string
    periodoRotulo: string
    periodo: Record<'todos' | 'hoje' | 'semana' | 'mes', string>
    limparFiltros: string
    colunas: string
    expandirFiltros: string
    recolherFiltros: string
    rapidos: Record<'recebidos' | 'enviados' | 'sistema' | 'naoLidos' | 'comAnexo' | 'semItem', string>
    col: Record<'tipo' | 'de' | 'para' | 'assunto' | 'item' | 'tarefa' | 'enviadoPor' | 'status' | 'data' | 'acoes', string>
    tipo: Record<'recebido' | 'enviado', string>
    ordenar: (coluna: string) => string
    filtro: {
      filtrar: string
      totalmente: string
      operadores: Record<'eq' | 'ne' | 'contains' | 'ncontains' | 'containss' | 'ncontainss', string>
      preposicao: Record<'eq' | 'ne' | 'contains' | 'ncontains' | 'containss' | 'ncontainss', string>
      digiteValor: string
      aplicar: string
      remover: string
      adicionar: string
      pendentes: string
      buscarOpcoes: string
      todos: string
      limpar: string
      selecionados: (n: number) => string
      nenhumResultado: string
    }
    pagina: { mostrando: (inicio: number, fim: number, total: number) => string, porPagina: (n: number) => string, rotulo: string }
    acoes: Record<'verDetalhes' | 'responder' | 'encaminhar' | 'marcarNaoLido' | 'verItem' | 'vincular', string>
    semItem: string
    naoLido: string
    comAnexo: string
    vazioDescricao: string
    vazioFiltrado: string
    sistema: string
    vazio: Record<'novoTitulo' | 'novoDescricao' | 'novoMembroDescricao' | 'primeiroTitulo' | 'primeiroDescricao' | 'integrar' | 'criarModelo' | 'criarCaixa' | 'escrever', string>
    vinculadoTitulo: string
    vinculadoDescricao: (ref: string) => string
    vincularDepois: string
    sugestoesPeloRemetente: string
    vincular: string
  }
  compositor: {
    titulo: string
    de: string
    para: string
    paraPlaceholder: string
    usarEndereco: (e: string) => string
    adicionarEmCopia: string
    cc: string
    cco: string
    emailPlaceholder: string
    template: string
    templatePlaceholder: string
    assunto: string
    assuntoPlaceholder: string
    vincularTitulo: string
    itemVinculado: string
    opcional: string
    vincularDica: string
    buscarItem: string
    vincularAjuda: string
    trocar: string
    desvincular: string
    cancelar: string
    vinculadoPeloItem: string
    vinculadoPelaTarefa: string
    vinculadoFixo: (ref: string) => string
    recentes: string
    resultados: (mostrando: number, total: number) => string
    sobra: (n: number) => string
    soPermitidos: string
    nenhumItem: (q: string) => string
    nenhumItemDica: string
    suaConta: string
    responderParaItem: string
    respostasNoSeuOutlook: string
    semContaTitulo: string
    semContaDescricao: string
    integrarContas: string
    inserirAssinatura: string
    cargoDaAssinatura: string
    mensagem: string
    mensagemPlaceholder: string
    link: { botao: string, colar: string, aplicar: string, abrir: string, remover: string }
    minimizar: string
    expandir: string
    reduzir: string
    rascunhoSalvo: string
    rascunho: string
    abrirRascunho: string
    sugestoes: string
    sugestaoMotivo: (nome: string) => string
    anexarArquivo: string
    removerAnexo: (a: string) => string
    descartar: string
    enviar: string
    erroPara: string
    erroEmailInvalido: (e: string) => string
    erroCorpo: string
    erroDe: string
    falhaTitulo: string
    falhaDescricao: string
    semAssunto: string
    enviadoTitulo: string
    enviadoComItem: (ref: string) => string
    enviadoSemItem: (de: string) => string
    verNoItem: string
    verEmEmails: string
    descartado: string
    desfazer: string
    grupoOutlook: string
    grupoCaixas: string
    caixaDoWorkspace: string
    respostasNaCaixa: (caixa: string) => string
    semItemNaoRegistra: string
    vincularTarefa: string
    vincularTarefaAjuda: string
    semTarefa: string
    respostaComoNova: string
    respostaNaConversa: string
    enviadoSemItemRegistrado: (de: string) => string
  }
  central: {
    abas: Record<'mensagens' | 'modelos' | 'caixas' | 'configuracoes', string>
    dicas: Record<'modelos' | 'caixas' | 'configuracoes', string>
    novoModelo: string
    novaCaixa: string
    pesquisarModelos: string
    pesquisarCaixas: string
    vazio: Record<'modelosTitulo' | 'modelosDescricao' | 'caixasTitulo' | 'caixasDescricao', string>
    col: Record<'nome' | 'assunto' | 'remetentePorDominio' | 'email' | 'provedor' | 'criadoEm' | 'status' | 'destino' | 'copia' | 'tarefa' | 'acoes', string>
    sim: string
    nao: string
    editar: string
    excluir: string
    usar: string
    status: Record<'enviado' | 'processando' | 'falhou', string>
    verEmail: string
    reenviar: string
    reenviado: string
    maquete: string
    config: {
      contaTitulo: string
      contaDescricao: string
      contaConectada: (email: string) => string
      contaSem: string
      outlookTitulo: string
      integrar: string
      gerenciar: string
      dominioTitulo: string
      dominioDescricao: string
      abrirIntegracoes: string
      contatoTitulo: string
      contatoPelosCampos: string
      contatoNaCategoria: string
      irParaCategorias: string
      remetentesTitulo: string
      remetentesDescricao: string
      disponivelNoDe: string
      soAdmin: string
      regrasTitulo: string
      regrasDescricao: string
      salvar: string
      salvo: string
    }
  }
  sistema: {
    titulo: string
    abas: Record<'basicas' | 'calendario' | 'notificacoes' | 'dicionarios' | 'cobranca', string>
    nome: string
    referencia: string
    salvar: string
    adicionais: string
    opcoesAdicionais: string[]
    modulos: string
    correcaoMonetaria: string
    comparacoes: string
    juridico: string
    modulosSalvos: string
    zonaDePerigo: string
    excluirWorkspace: string
    excluirWorkspaceDica: string
  }
  categoria: {
    categorias: string
    voltar: string
    acessar: string
    editar: string
    deletar: string
    duplicar: string
    exportarModelo: string
    copiar: string
    soPublicoCopia: string
    tornarPublico: string
    tornarPrivado: string
    visibilidadeMudou: (nome: string, visibilidade: string) => string
    nome: string
    tipo: string
    respostas: string
    visibilidade: string
    tipos: Record<'criacao' | 'editar' | 'geral' | 'visualizar', string>
    formulariosDica: string
    cartoes: Record<'campos' | 'formularios' | 'fluxos' | 'pastas' | 'relatorios' | 'condicionais' | 'templates' | 'notificacoes' | 'responsabilidade' | 'execucoes' | 'status' | 'correcao' | 'atalhos', string>
    descricoes: Record<'campos' | 'formularios' | 'fluxos' | 'pastas' | 'relatorios' | 'condicionais' | 'templates' | 'notificacoes' | 'responsabilidade' | 'execucoes' | 'status' | 'correcao' | 'atalhos', string>
    quemEhContato: string
    quemEhContatoDica: string
    rotulo: string
    removerContato: string
    campoNome: string
    campoEmail: string
    nenhum: string
    tipoEmail: string
    tipoPessoa: string
    subNome: string
    subEmail: string
    subTelefone: string
    emailDoRequisitante: string
    campoPadrao: string
    novoContato: string
    adicionarContato: string
    assuntoDoEmail: string
    inserir: string
    previa: string
    semNome: string
    salvo: string
    avaliarComDevs: string
    assuntoDica: string
  }
  simulador: {
    selo: string
    titulo: Record<'email' | 'formulario' | 'outlook', string>
    noProduto: Record<'email' | 'formulario' | 'outlook', string>
    voltar: string
    enviar: string
    descartar: string
    escrevaAqui: string
    novaMensagem: string
    comCopiaAviso: string
    semCopiaAviso: string
    emailEnviado: string
    copiaNaMailBox: (ref: string) => string
    semCopia: string
    verNaMailBox: string
    formPublico: string
    enviarResposta: string
    respostaEnviada: string
    obrigado: string
    itemCriado: (categoria: string, ref: string) => string
    itemCriadoDescricao: string
    abrirItem: string
    integracoes: string
    correioOutlook: string
    correioOutlookDescricao: string
    sincronizar: string
    contaMicrosoft: string
    pedidoDePermissao: string
    cancelar: string
    aceitar: string
    integrado: string
    integradoDescricao: string
  }
  andaime: {
    prototipo: string
    irPara: string
    quemUsa: string
    quemConfigura: string
    listaDeItens: string
    umItem: (ref: string) => string
    mailBox: (ref: string) => string
    configDosEmails: string
    perfil: string
    perfis: Record<'admin' | 'membro', string>
    perfilDica: string
    dados: string
    dadosOpcoes: Record<'novo' | 'primeiroUso' | 'emUso', string>
    dadosDica: string
    atalhosDaCategoria: string
    formularios: string
    cenario: string
    cenarios: { normal: string, semOutlook: string, falha: string }
    mostrarOQueMuda: string
    porTras: string
    fase: string
    fases: Record<Fase, string>
    fasesDica: Record<Fase, string>
  }
}

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`

/* ================================================================== *
 * Português
 * ================================================================== */

const ptBR: Textos = {
  casca: {
    menuLateral: 'Menu lateral',
    buscar: 'Buscar...',
    membro: 'Membro',
    configuracoes: 'Configurações',
    ajuda: 'Ajuda',
    trilha: 'Trilha',
    voltar: 'Voltar',
    avancar: 'Avançar',
    recarregar: 'Recarregar',
    suporte: 'Suporte',
    notificacoes: 'Notificações',
    idioma: 'Idioma',
    tema: 'Tema',
    workspaces: 'Workspaces',
    dados: 'Dados',
    novoEmail: 'Novo e-mail',
    novoEmailDica: 'Escrever um e-mail sem sair desta tela',
    itens: {
      inicio: 'Início',
      spaceflows: 'Spaceflows',
      categorias: 'Categorias',
      tarefas: 'Tarefas',
      agendadas: 'Agendadas',
      rapidas: 'Rápidas',
      agenda: 'Agenda',
      emails: 'E-mails',
      knowledge: 'Knowledge',
      requisicoes: 'Requisições',
      visaoGeral: 'Visão Geral',
      sistema: 'Sistema',
      estrutura: 'Estrutura',
      estruturaCategorias: 'Categorias',
      listas: 'Listas',
      spaceflow: 'Spaceflow',
      gestaoDeMembros: 'Gestão de Membros',
      interface: 'Interface',
      emailsConfig: 'E-mails',
      emailsEnviados: 'E-mails Enviados',
      modelosDeEmail: 'Modelos de E-mail',
      caixasDeEmail: 'Caixas de E-mail',
      integracoes: 'Integrações',
      agentesDeIa: 'Agentes de IA',
      logs: 'Logs',
      credenciais: 'Credenciais',
      releases: 'Releases',
      documentacao: 'Documentação',
    },
    novoEmailNoItem: ref => `Escrever um e-mail vinculado a ${ref}`,
  },
  atalho: {
    semContato: 'Sem contato',
    semEmail: 'Sem e-mail cadastrado',
    escreverNoEnspace: 'Escrever pelo ENSPACE',
    escreverNoEnspaceComItem: ref => `O e-mail fica na Mail Box de ${ref}`,
    abrirNoApp: 'Abrir no meu app de e-mail',
    abrirNoAppDica: 'Outlook, Gmail ou o app padrão do computador',
    outrasFormasDeEmail: 'Outras formas de enviar e-mail',
    abrirNoAppComCopia: 'O endereço do item vai em cópia: a resposta volta para a Mail Box quando a pessoa responde a todos.',
    email: 'E-mail',
  },
  inicio: {
    saudacao: nome => `Bom dia, ${nome}!`,
    subtitulo: 'Pronto para um dia produtivo? Vamos trabalhar juntos!',
    emAtraso: 'Tarefas em atraso',
    proximas: 'Tarefas próximas',
    rapidas: 'Tarefas rápidas',
    nenhumaEmAtraso: 'Nenhuma tarefa em atraso',
    nenhumaProxima: 'Nenhuma tarefa próxima',
    acessarTarefas: 'Acessar tarefas',
    atualizar: 'Atualizar',
    mostrando: n => `Mostrando 1-${n} de ${n} itens`,
    atrasadaHa: d => `Atrasada: há ${plural(d, 'dia', 'dias')}`,
    venceEm: d => d === 0 ? 'Vence hoje' : `Vence em ${plural(d, 'dia', 'dias')}`,
  },
  prioridade: { low: 'Baixa', normal: 'Normal', high: 'Alta', urgent: 'Urgente' },
  status: { pending: 'Pendente', working: 'Em andamento', blocked: 'Bloqueada', completed: 'Concluída' },
  etapa: { em_minuta: 'Em minuta', em_assinatura: 'Em assinatura', vigente: 'Vigente', em_renovacao: 'Em renovação', encerrado: 'Encerrado' },
  itens: {
    vistaItens: 'Itens',
    vistaQuadro: 'Por etapa',
    visualizar: 'Visualizar',
    pesquisar: 'Pesquisar registros',
    criadoEm: 'Criado em',
    todoPeriodo: 'Todo o período',
    exportar: 'Exportar',
    colunas: 'Colunas',
    filtros: 'Filtros',
    configurar: 'Configurar',
    novoRegistro: 'Novo registro',
    referencia: 'Referência',
    nome: 'Nome',
    etapa: 'Etapa',
    contato: 'Contato',
    atualizadoEm: 'Atualizado em',
    nadaEncontrado: 'Nenhum item encontrado',
    nadaEncontradoDica: 'Confira a busca ou limpe os filtros.',
    acoes: 'Ações',
    verDetalhes: 'Ver Detalhes',
    editar: 'Editar',
    enviarParaLixeira: 'Enviar para Lixeira',
    copiarLink: 'Copiar Link',
    contatar: 'Contatar',
    semContato: 'Sem contato',
    dicaDoQuadro: 'Clique com o botão direito num cartão para enviar e-mail ao contato.',
  },
  item: {
    paraQuem: 'Para quem',
    ajudaComEnspace: ref => `O e-mail sai pelo ENSPACE e fica na Mail Box de ${ref}. A seta abre o seu app de e-mail.`,
    ajudaSemEnspace: 'Abre o seu app de e-mail com o destinatário preenchido e o endereço do item em cópia.',
    semEmailAviso: 'Este contato não tem e-mail cadastrado.',
    cadastrarEmail: 'Cadastrar e-mail',
    semContatoTitulo: 'Nenhum contato neste item',
    semContatoDica: 'Os campos de contato deste item estão vazios.',
    escolherCampos: 'Escolher os campos de contato',
    identificacao: 'Identificação',
    origem: 'Origem',
    status: 'Status',
    emailDaSolicitacao: 'E-mail da solicitação',
    historico: 'Histórico',
    criadoEm: 'Criado em',
    atualizadoEm: 'Atualizado em',
    editarVisualizacao: 'Editar visualização',
    imprimirPdf: 'Imprimir PDF',
    abas: { visao: 'Visão Geral', comentarios: 'Comentários', logs: 'Logs de Auditoria', tarefas: 'Tarefas', anexos: 'Anexos', automaticos: 'Emails Automáticos', mailbox: 'Mail Box', notas: 'Notas' },
    campos: {
      titulo: 'Nome',
      contraparte: 'Contraparte',
      contato_nome: 'Contato',
      contato_email: 'E-mail do contato',
      contato_telefone: 'Telefone do contato',
      financeiro_email: 'E-mail do financeiro',
      valor: 'Valor',
      solicitante_nome: 'Nome de quem pediu',
      solicitante_email: 'E-mail de quem pediu',
      solicitante_telefone: 'Telefone de quem pediu',
      area: 'Área',
      cnpj: 'CNPJ',
      contato_whatsapp: 'WhatsApp comercial',
      pessoa_empresa: 'Pessoa/Empresa',
    },
    sairSemSalvar: 'Sair sem salvar',
    salvar: 'Salvar',
    salvo: 'Item salvo',
    copiarEndereco: 'Copiar o endereço da caixa',
    recebidos: 'Recebidos',
    enviados: 'Enviados',
    para: quem => `Para: ${quem}`,
    enviadoPor: nome => `Enviado por ${nome} pelo ENSPACE`,
    responder: 'Responder',
    nenhumEmail: 'Nenhum e-mail encontrado.',
    semTarefas: 'Nenhuma tarefa neste item',
    foraDoEscopo: 'Pasta fora deste protótipo',
    foraDoEscopoDica: 'Esta pasta existe no develop e não muda com a proposta.',
    contato: 'Contato do item',
    emailPara: rotulo => `Enviar e-mail para ${rotulo}`,
    novoEmail: 'Novo e-mail',
    enviadoPelaCaixa: (nome, caixa) => `Enviado por ${nome} pela caixa ${caixa}`,
    nenhumEmailDica: 'Os e-mails enviados para o endereço do item e os enviados por aqui aparecem nesta lista.',
    nenhumEmailDaTarefa: 'Os e-mails vinculados a esta tarefa aparecem nesta lista. Os demais e-mails do item estão em "Do item".',
    dataTarefa: 'Desta tarefa',
    doItem: ref => `Do item ${ref}`,
  },
  form: {
    formularios: 'Formulários',
    selecioneUm: 'Selecione um formulário',
    compartilharTitulo: 'Compartilhar este formulário',
    publico: 'Público',
    privado: 'Privado',
    qualquerPessoa: 'Qualquer pessoa com o link responde, sem login',
    linkDoFormulario: 'Link do formulário',
    copiarLink: 'Copiar link',
    copiado: 'Copiado',
    abrirNovaAba: 'Abrir numa nova aba',
    enviarLinkPor: 'Enviar o link por',
    assuntoDoLink: nome => `Formulário: ${nome}`,
    mensagemDoLink: (nome, url) => `Para preencher o formulário "${nome}", use este link: ${url}`,
    linkCopiado: 'Link copiado',
    linkDeFormulario: 'Link de formulário público',
    copiarLinkPublico: 'Copiar link de formulário público',
    nenhumPublico: 'Nenhum formulário público',
    nenhumPublicoDica: 'Um formulário aparece aqui quando é Público e do tipo Criação ou Geral.',
    irParaFormularios: 'Ver formulários',
    soPublicos: 'Só aparecem formulários públicos.',
    privadoDica: 'Formulário privado: só membros do workspace respondem. Por isso não tem link para enviar.',
    porFavorDigite: 'Por favor digite',
    salvar: 'Salvar',
  },
  tarefas: {
    titulo: 'Tarefas Rápidas',
    lista: 'Lista',
    pesquisar: 'Pesquisar tarefas...',
    arquivadas: 'Arquivadas',
    lixeira: 'Lixeira',
    nova: 'Nova tarefa',
    filtrosRapidos: 'Filtros Rápidos',
    nome: 'Nome',
    prazo: 'Prazo',
    status: 'Status',
    responsavel: 'Responsável',
    contato: 'Contato',
    prioridade: 'Prioridade',
    item: 'Item',
    semResponsavel: 'Sem responsável',
    semResponsavelDica: 'Atribua um responsável para enviar o e-mail.',
    abrir: 'Abrir tarefa',
    selecionadas: n => plural(n, 'tarefa selecionada', 'tarefas selecionadas'),
    ajudaDoLote: 'Abre 1 e-mail com todos os responsáveis em Para.',
    foraDoLote: n => n === 1 ? '1 tarefa sem responsável fica de fora.' : `${n} tarefas sem responsável ficam de fora.`,
    dicaDoQuadro: 'Clique no cartão para abrir a tarefa. Com o botão direito, envie e-mail ao responsável.',
    respostaCriaItem: categoria => `A resposta pelo link cria um item novo em ${categoria}. Esta tarefa continua aberta até você concluí-la.`,
    assuntoDoAviso: (tarefa, prazo) => prazo ? `Tarefa: ${tarefa} (prazo ${prazo})` : `Tarefa: ${tarefa}`,
    mensagemDoAviso: (nome, tarefa, prazo) => `${nome ? `Olá, ${nome}.` : 'Olá.'} Lembrete da tarefa "${tarefa}"${prazo ? `, prazo ${prazo}` : ''}.`,
    assuntoDoLote: n => `${n} tarefas pendentes`,
    emailPara: nome => `Enviar e-mail para ${nome}`,
    emailParaResponsaveis: n => n === 1 ? 'E-mail para o responsável' : `E-mail para os ${n} responsáveis`,
    abrirMailBox: 'Abrir a Mail Box',
    detalhes: 'Detalhes',
    semItemTitulo: 'Tarefa sem item',
    semItemDescricao: 'A Mail Box é do item. Esta tarefa não tem item vinculado, por isso não tem e-mails.',
  },
  agenda: {
    hoje: 'Hoje',
    anterior: 'Mês anterior',
    proximo: 'Próximo mês',
    visualizacao: 'Visualização',
    mes: 'Mês',
    data: 'Data',
    diaUtil: 'Dia Útil',
    diaNaoUtil: 'Dia Não Útil',
    mais: n => `+ ${plural(n, 'evento', 'eventos')}`,
    evento: 'Evento',
    participantes: 'Participantes',
    quem: { outlook: 'Participantes', item: 'Contatos do item', tarefa: 'Responsável' },
    fonte: { outlook: 'Reunião do Outlook', item: 'Data de um item', tarefa: 'Prazo de uma tarefa' },
    intervalo: (de, ate) => `${de} às ${ate}`,
    enviarLembrete: 'Enviar lembrete',
    emailParaTodos: n => `E-mail para todos (${n})`,
    assuntoDoLembrete: (evento, quando) => `Lembrete: ${evento} (${quando})`,
    mensagemDoLembrete: (nome, evento, quando) => `${nome ? `Olá, ${nome}.` : 'Olá.'} Lembrete: ${evento}, ${quando}.`,
    emailPara: nome => `Enviar e-mail para ${nome}`,
    ajudaDoLembrete: 'O e-mail abre com data, hora e assunto preenchidos. É possível alterar o texto antes do envio.',
  },
  emails: {
    titulo: 'E-mails',
    descricaoFase1: 'Os e-mails recebidos e enviados pela Mail Box dos itens.',
    descricaoFase2: 'Os e-mails recebidos e enviados pelo ENSPACE, com ou sem item.',
    descricaoDoSistema: 'Também os e-mails que tarefas e fluxos enviaram.',
    pesquisar: 'Pesquisar...',
    limparBusca: 'Limpar a busca',
    periodoRotulo: 'Período',
    periodo: { todos: 'Todo o período', hoje: 'Hoje', semana: 'Últimos 7 dias', mes: 'Últimos 30 dias' },
    limparFiltros: 'Limpar filtros',
    colunas: 'Colunas',
    expandirFiltros: 'Expandir filtros',
    recolherFiltros: 'Recolher filtros',
    rapidos: { recebidos: 'Recebidos', enviados: 'Enviados', sistema: 'Do sistema', naoLidos: 'Não lidos', comAnexo: 'Com anexo', semItem: 'Sem item' },
    col: { tipo: 'Tipo', de: 'De', para: 'Para', assunto: 'Assunto', item: 'Item', tarefa: 'Tarefa', enviadoPor: 'Enviado por', status: 'Status', data: 'Data', acoes: 'Ações' },
    tipo: { recebido: 'Recebido', enviado: 'Enviado' },
    ordenar: coluna => `Ordenar por ${coluna}`,
    filtro: {
      filtrar: 'Filtrar',
      totalmente: 'É totalmente',
      operadores: { eq: 'Igual', ne: 'Diferente', contains: 'Contém', ncontains: 'Não contém', containss: 'Contém (case sensitive)', ncontainss: 'Não contém (case sensitive)' },
      preposicao: { eq: 'a', ne: 'De', contains: 'parcialmente', ncontains: '', containss: 'parcialmente', ncontainss: '' },
      digiteValor: 'Digite o valor...',
      aplicar: 'Clique para aplicar o filtro',
      remover: 'Remover filtro',
      adicionar: 'Adicionar Filtro',
      pendentes: 'Aplique os filtros pendentes antes de adicionar um novo.',
      buscarOpcoes: 'Buscar...',
      todos: 'Todos',
      limpar: 'Limpar',
      selecionados: n => plural(n, 'selecionado', 'selecionados'),
      nenhumResultado: 'Nenhum resultado encontrado',
    },
    pagina: { mostrando: (a, b, n) => `Mostrando ${a} a ${b} de ${n} resultados`, porPagina: n => `${n} por página`, rotulo: 'Itens por página' },
    acoes: { verDetalhes: 'Ver Detalhes', responder: 'Responder', encaminhar: 'Encaminhar', marcarNaoLido: 'Marcar como não lido', verItem: 'Ver Item', vincular: 'Vincular a um item' },
    semItem: 'Sem item',
    naoLido: 'Não lido',
    comAnexo: 'Com anexo',
    vazioDescricao: 'Nenhum e-mail encontrado.',
    vazioFiltrado: 'Nenhum e-mail com estes filtros.',
    sistema: 'Sistema',
    vazio: { novoTitulo: 'Nenhum e-mail ainda', novoDescricao: 'Os e-mails que as pessoas trocam pelos itens aparecem aqui. Para começar, integre a sua conta do Outlook e crie os modelos e as caixas do workspace.', novoMembroDescricao: 'Os e-mails que você troca pelos itens aparecem aqui. Para enviar pelo ENSPACE, integre a sua conta do Outlook.', primeiroTitulo: 'Nenhum e-mail ainda', primeiroDescricao: 'Escreva o primeiro e-mail. Ele aparece aqui e na Mail Box do item vinculado.', integrar: 'Integrar conta do Outlook', criarModelo: 'Criar modelo', criarCaixa: 'Criar caixa de e-mail', escrever: 'Novo e-mail' },
    vinculadoTitulo: 'E-mail vinculado',
    vinculadoDescricao: ref => `Aparece na aba Mail Box de ${ref}.`,
    vincularDepois: 'Este e-mail não tem item. Ao vincular, ele passa a aparecer na aba Mail Box do item.',
    sugestoesPeloRemetente: 'Sugestões pelo destinatário',
    vincular: 'Vincular',
  },
  compositor: {
    titulo: 'Nova Mensagem',
    de: 'De',
    para: 'Para',
    paraPlaceholder: 'Digite um nome ou e-mail',
    usarEndereco: e => `Usar "${e}"`,
    adicionarEmCopia: 'Adicionar em Cópia',
    cc: 'Cc',
    cco: 'Cco',
    emailPlaceholder: 'nome@empresa.com',
    template: 'Template',
    templatePlaceholder: 'Escolha um template de e-mail',
    assunto: 'Assunto',
    assuntoPlaceholder: 'Digite o assunto do e-mail',
    vincularTitulo: 'Vincular a item',
    itemVinculado: 'Item vinculado',
    opcional: '(opcional)',
    vincularDica: 'O e-mail entra no histórico do item. O vínculo guarda o item, não o nome: renomear o item não quebra nada.',
    buscarItem: 'Buscar por nome, referência ou ID',
    vincularAjuda: 'Selecione um item para vincular este e-mail. O vínculo fica salvo no ENSPACE.',
    trocar: 'Trocar',
    desvincular: 'Remover vínculo',
    cancelar: 'Cancelar',
    vinculadoPeloItem: 'Vinculado porque você começou no item. É possível trocar ou remover o vínculo.',
    vinculadoPelaTarefa: 'Vinculado ao item da tarefa. É possível trocar ou remover o vínculo.',
    vinculadoFixo: ref => `O e-mail fica na Mail Box de ${ref}, e a resposta volta para lá.`,
    recentes: 'Atualizados por último',
    resultados: (m, n) => `${m} de ${plural(n, 'item', 'itens')}`,
    sobra: n => `Mais ${plural(n, 'item', 'itens')}. Continue digitando para achar.`,
    soPermitidos: 'Só aparecem itens que você pode ver.',
    nenhumItem: q => `Nenhum item com "${q}"`,
    nenhumItemDica: 'Procure pela referência (CTR-00231), pelo ID ou pelo nome do contato.',
    suaConta: 'Sua conta do Outlook',
    responderParaItem: 'Responder para: o endereço do item. A resposta volta para a aba Mail Box.',
    respostasNoSeuOutlook: 'Sem item vinculado, a resposta chega só no seu Outlook.',
    semContaTitulo: 'Nenhuma conta integrada disponível.',
    semContaDescricao: 'O e-mail do ENSPACE sai da sua conta do Outlook. Integre o Correio do Outlook em Perfil › Integrações. Até lá, o botão E-mail abre o seu app de e-mail.',
    integrarContas: 'Integrar contas',
    inserirAssinatura: 'Inserir assinatura',
    cargoDaAssinatura: 'Jurídico · Aurora Serviços',
    mensagem: 'Mensagem',
    mensagemPlaceholder: 'Escreva ou digite "/" para acessar os comandos...',
    link: { botao: 'Link', colar: 'Cole um endereço...', aplicar: 'Aplicar link', abrir: 'Abrir numa nova aba', remover: 'Remover link' },
    minimizar: 'Minimizar',
    expandir: 'Expandir',
    reduzir: 'Reduzir',
    rascunhoSalvo: 'Rascunho salvo',
    rascunho: 'Rascunho',
    abrirRascunho: 'Abrir rascunho',
    sugestoes: 'Sugestões',
    sugestaoMotivo: nome => `${nome} é contato deste item`,
    anexarArquivo: 'Anexar arquivo',
    removerAnexo: a => `Remover ${a}`,
    descartar: 'Descartar',
    enviar: 'Enviar',
    erroPara: 'Informe pelo menos 1 destinatário.',
    erroEmailInvalido: e => `"${e}" não é um e-mail válido.`,
    erroCorpo: 'Escreva a mensagem antes de enviar.',
    erroDe: 'Integre o Correio do Outlook para enviar.',
    falhaTitulo: 'E-mail não enviado',
    falhaDescricao: 'O servidor de e-mail não respondeu. O rascunho continua aberto para tentar de novo.',
    semAssunto: '(sem assunto)',
    enviadoTitulo: 'E-mail enviado',
    enviadoComItem: ref => `Vinculado a ${ref}. As respostas voltam para o item.`,
    enviadoSemItem: de => `Enviado de ${de}. Sem item vinculado, o e-mail fica só no seu Outlook e não aparece no ENSPACE.`,
    verNoItem: 'Ver no item',
    verEmEmails: 'Ver em E-mails',
    descartado: 'Rascunho descartado',
    desfazer: 'Desfazer',
    grupoOutlook: 'Sua conta',
    grupoCaixas: 'Caixas do workspace',
    caixaDoWorkspace: 'Caixa do workspace',
    respostasNaCaixa: caixa => `Sem item vinculado, a resposta chega na caixa ${caixa}, na Central de Atendimento.`,
    semItemNaoRegistra: 'Sem item vinculado, o e-mail fica só no seu Outlook e não aparece no ENSPACE.',
    vincularTarefa: 'Vincular a tarefa',
    vincularTarefaAjuda: 'O e-mail aparece também na Mail Box da tarefa.',
    semTarefa: 'Nenhuma tarefa',
    respostaComoNova: 'A resposta sai como uma mensagem nova, com o texto original citado. Ela não entra na mesma conversa.',
    respostaNaConversa: 'A resposta segue na mesma conversa do e-mail original.',
    enviadoSemItemRegistrado: de => `Enviado de ${de}, sem item vinculado. O e-mail fica em E-mails.`,
  },
  central: {
    abas: { mensagens: 'Mensagens', modelos: 'Modelos', caixas: 'Caixas de E-mail', configuracoes: 'Configurações' },
    dicas: { modelos: 'Os modelos que aparecem no campo Template do e-mail.', caixas: 'Os endereços do workspace que recebem e-mails e podem iniciar um fluxo.', configuracoes: 'A conta de envio de cada pessoa e as regras do e-mail no workspace.' },
    novoModelo: 'Novo modelo',
    novaCaixa: 'Nova caixa',
    pesquisarModelos: 'Pesquisar modelos...',
    pesquisarCaixas: 'Pesquisar caixas...',
    vazio: { modelosTitulo: 'Nenhum modelo', modelosDescricao: 'O modelo preenche o assunto e a mensagem de um e-mail. Crie o primeiro para a equipe usar.', caixasTitulo: 'Nenhuma caixa de e-mail', caixasDescricao: 'A caixa recebe os e-mails enviados ao workspace e pode iniciar um fluxo.' },
    col: { nome: 'Nome', assunto: 'Assunto', remetentePorDominio: 'Usar remetente por domínio', email: 'E-mail', provedor: 'Provedor', criadoEm: 'Criado em', status: 'Status', destino: 'E-mail', copia: 'E-mail em cópia', tarefa: 'Tarefa', acoes: 'Ações' },
    sim: 'Sim',
    nao: 'Não',
    editar: 'Editar',
    excluir: 'Excluir',
    usar: 'Usar em um e-mail',
    status: { enviado: 'Enviado', processando: 'Em processamento', falhou: 'Falhou' },
    verEmail: 'Ver e-mail',
    reenviar: 'Reenviar e-mail',
    reenviado: 'E-mail colocado na fila de envio',
    maquete: 'Esta ação não tem efeito no protótipo.',
    config: {
      contaTitulo: 'Sua conta de envio',
      contaDescricao: 'O e-mail escrito no ENSPACE sai da conta do Outlook que você integrou ao seu perfil.',
      contaConectada: (email: string) => `Conta conectada: ${email}`,
      outlookTitulo: 'Correio do Outlook',
      contaSem: 'Nenhuma conta integrada. Sem ela, o botão E-mail abre o aplicativo de e-mail do computador.',
      integrar: 'Integrar contas',
      gerenciar: 'Gerenciar integração',
      dominioTitulo: 'Remetente com o domínio da empresa',
      dominioDescricao: 'Os e-mails enviados pelo sistema podem sair com o domínio da empresa, pela integração SendGrid.',
      abrirIntegracoes: 'Abrir Integrações',
      contatoTitulo: 'Contato do item',
      contatoPelosCampos: 'O contato de cada item vem dos campos de e-mail que a categoria já tem e do e-mail de quem abriu a requisição.',
      contatoNaCategoria: 'Defina na própria categoria os campos de nome e de e-mail do contato.',
      irParaCategorias: 'Escolher o contato de cada categoria',
      remetentesTitulo: 'Caixas como remetente',
      remetentesDescricao: 'Escolha as caixas do workspace que aparecem no campo De de quem escreve um e-mail.',
      disponivelNoDe: 'Disponível no campo De',
      soAdmin: 'Visível só para quem administra o workspace.',
      regrasTitulo: 'Regras do workspace',
      regrasDescricao: 'Valem para todas as pessoas do workspace. Visível somente para quem administra.',
      salvar: 'Salvar',
      salvo: 'Configuração salva',
    },
  },
  sistema: {
    titulo: 'Configurações Gerais',
    abas: { basicas: 'Informações Básicas', calendario: 'Calendário', notificacoes: 'Notificações', dicionarios: 'Dicionários', cobranca: 'Cobrança' },
    nome: 'Nome',
    referencia: 'Referência',
    salvar: 'Salvar',
    adicionais: 'Configurações Adicionais',
    opcoesAdicionais: ['Mostrar categorias', 'Ignorar permissões para membros full', 'Ocultar botão de criar na tela de tipos de itens', 'Mostrar URL de integração', 'Habilitar carimbo personalizado em documentos'],
    modulos: 'Módulos',
    correcaoMonetaria: 'Correção Monetária',
    comparacoes: 'Comparações',
    juridico: 'Juridico',
    modulosSalvos: 'Módulos salvos',
    zonaDePerigo: 'Zona de Perigo',
    excluirWorkspace: 'Excluir Workspace',
    excluirWorkspaceDica: 'Excluir permanentemente este workspace e todos os seus dados. Esta ação não pode ser desfeita.',
  },
  categoria: {
    categorias: 'Categorias',
    voltar: 'Voltar',
    acessar: 'Acessar',
    editar: 'Editar',
    deletar: 'Deletar',
    duplicar: 'Duplicar',
    exportarModelo: 'Exportar modelo de formulário',
    copiar: 'Copiar',
    soPublicoCopia: 'Só formulário público tem link',
    tornarPublico: 'Tornar público',
    tornarPrivado: 'Tornar privado',
    visibilidadeMudou: (nome, v) => `${nome}: ${v}`,
    nome: 'Nome',
    tipo: 'Tipo',
    respostas: 'Respostas',
    visibilidade: 'Visibilidade',
    tipos: { criacao: 'Criação', editar: 'Editar', geral: 'Geral', visualizar: 'Visualizar' },
    formulariosDica: 'Formulário público ganha o link para copiar nas telas de uso: tela inicial, lista de itens, tarefas e Requisições.',
    cartoes: {
      campos: 'Campos',
      formularios: 'Formulários',
      fluxos: 'Fluxos',
      pastas: 'Pastas de Visualização',
      relatorios: 'Relatórios',
      condicionais: 'Condicionais',
      templates: 'Templates de Documentos',
      notificacoes: 'Notificações',
      responsabilidade: 'Regras de Responsabilidade',
      execucoes: 'Execuções Programadas',
      status: 'Status',
      correcao: 'Correção Monetária',
      atalhos: 'Contato da categoria',
    },
    descricoes: {
      campos: 'Propriedades e formato de dados da categoria.',
      formularios: 'Agrupamento de campos para criar e interagir com itens da categoria.',
      fluxos: 'Fluxos de trabalho e automações vinculados ao ciclo de vida dos itens.',
      pastas: 'Paineis para visualização e interação dos dados ao acessar um item.',
      relatorios: 'Relatórios e análises de dados da categoria.',
      condicionais: 'Regras e condições reutilizáveis para validação e automação de dados.',
      templates: 'Modelos de documentos para gerar arquivos automaticamente.',
      notificacoes: 'Configurações de notificações e alertas para os itens da categoria.',
      responsabilidade: 'Regras de responsabilidade e atribuição de tarefas para os itens da categoria.',
      execucoes: 'Agendamento de tarefas e execuções automáticas para os itens da categoria.',
      status: 'Configurações de status e etapas para os itens da categoria.',
      correcao: 'Configurações de Correção Monetária para esta categoria.',
      atalhos: 'Quem é o contato do item e o assunto do e-mail.',
    },
    quemEhContato: 'Quem é o contato',
    quemEhContatoDica: 'Cada contato aparece no Contato do item, na lateral do item. Escolha de quais campos vêm o nome e o e-mail.',
    rotulo: 'Nome do contato na tela',
    removerContato: 'Remover contato',
    campoNome: 'Nome',
    campoEmail: 'E-mail',
    nenhum: 'Nenhum',
    tipoEmail: 'Campo E-mail',
    tipoPessoa: 'Pessoa/Empresa',
    subNome: 'Nome de contato',
    subEmail: 'E-mail de contato',
    subTelefone: 'Telefone de contato',
    emailDoRequisitante: 'E-mail do Requisitante',
    campoPadrao: 'Campo padrão de toda categoria',
    novoContato: 'Novo contato',
    adicionarContato: 'Adicionar contato',
    assuntoDoEmail: 'Assunto do e-mail',
    inserir: 'Inserir:',
    previa: 'Prévia: o que o botão E-mail abre',
    semNome: 'Sem nome',
    salvo: 'Contato da categoria salvo',
    avaliarComDevs: 'A avaliar com os devs',
    assuntoDica: 'O e-mail abre com este assunto. Quem envia pode mudar antes de mandar.',
  },
  simulador: {
    selo: 'Simulação · fora do ENSPACE',
    titulo: { email: 'Seu app de e-mail', formulario: 'Página pública do formulário', outlook: 'Integrar o Correio do Outlook' },
    noProduto: {
      email: 'No produto, abre o app de e-mail padrão do computador, já preenchido.',
      formulario: 'É o que a pessoa de fora vê: o formulário sem login. Responder cria um item no ENSPACE.',
      outlook: 'No produto: Perfil › Integrações e o login da conta Microsoft corporativa.',
    },
    voltar: 'Voltar ao ENSPACE',
    enviar: 'Enviar',
    descartar: 'Descartar',
    escrevaAqui: 'Escreva o e-mail',
    novaMensagem: 'Nova mensagem',
    comCopiaAviso: 'O endereço do item está em Cc: a cópia chega na Mail Box do item.',
    semCopiaAviso: 'Sem o endereço do item em Cc, este e-mail não chega ao ENSPACE.',
    emailEnviado: 'E-mail enviado pelo seu app',
    copiaNaMailBox: ref => `A cópia chegou na Mail Box de ${ref}.`,
    semCopia: 'Este e-mail não fica no ENSPACE.',
    verNaMailBox: 'Ver na Mail Box',
    formPublico: 'Formulário público · não precisa de login',
    enviarResposta: 'Enviar resposta',
    respostaEnviada: 'Resposta enviada',
    obrigado: 'Obrigado. Você pode fechar esta página.',
    itemCriado: (categoria, ref) => `Item novo em ${categoria}: ${ref}`,
    itemCriadoDescricao: 'Criado pela resposta do formulário público.',
    abrirItem: 'Abrir item',
    integracoes: 'Configurações do Usuário › Integrações',
    correioOutlook: 'Correio do Outlook',
    correioOutlookDescricao: 'Integre seu e-mail com o Outlook.',
    sincronizar: 'Sincronizar',
    contaMicrosoft: 'Conta Microsoft',
    pedidoDePermissao: 'O ENSPACE pede permissão para enviar e-mail pela sua conta.',
    cancelar: 'Cancelar',
    aceitar: 'Aceitar',
    integrado: 'Integrado',
    integradoDescricao: 'O e-mail do ENSPACE sai da sua conta do Outlook.',
  },
  andaime: {
    prototipo: 'Protótipo',
    irPara: 'Ir para',
    quemUsa: 'Quem usa',
    quemConfigura: 'Quem configura',
    listaDeItens: 'Lista de itens (Contratos)',
    umItem: ref => `Item ${ref}`,
    mailBox: ref => `Mail Box de ${ref}`,
    configDosEmails: 'E-mails › Configurações',
    perfil: 'Perfil',
    perfis: { admin: 'Admin', membro: 'Membro' },
    perfilDica: 'O membro vê Mensagens e a própria conta de envio. Quem administra vê também modelos, caixas e envios do sistema.',
    dados: 'Dados',
    dadosOpcoes: { novo: 'Workspace novo', primeiroUso: 'Primeiro uso', emUso: 'Em uso' },
    dadosDica: 'Workspace novo: nada configurado e nada enviado. Primeiro uso: modelos, caixas e conta do Outlook prontos, nenhum e-mail ainda.',
    atalhosDaCategoria: 'Contato da categoria Contratos',
    formularios: 'Formulários de Solicitações',
    cenario: 'Cenário',
    cenarios: { normal: 'Normal', semOutlook: 'Sem Outlook integrado', falha: 'Envio falha' },
    mostrarOQueMuda: 'Mostrar o que muda',
    porTras: 'Por trás',
    fase: 'Fase',
    fases: { 1: '1 · MVP', 2: '2 · Remetente', 3: '3 · Tarefa' },
    fasesDica: { 1: 'Só tela, sobre o que o ENSPACE já tem', 2: 'Escolher o De, responder na conversa, encaminhar e registrar sem item', 3: 'Vincular o e-mail a uma tarefa' },
  },
}

/* ================================================================== *
 * English
 * ================================================================== */

const en: Textos = {
  casca: {
    menuLateral: 'Side menu',
    buscar: 'Search...',
    membro: 'Member',
    configuracoes: 'Settings',
    ajuda: 'Help',
    trilha: 'Breadcrumb',
    voltar: 'Back',
    avancar: 'Forward',
    recarregar: 'Reload',
    suporte: 'Support',
    notificacoes: 'Notifications',
    idioma: 'Language',
    tema: 'Theme',
    workspaces: 'Workspaces',
    dados: 'Data',
    novoEmail: 'New email',
    novoEmailDica: 'Write an email without leaving this screen',
    itens: {
      inicio: 'Home',
      spaceflows: 'Spaceflows',
      categorias: 'Categories',
      tarefas: 'Tasks',
      agendadas: 'Scheduled',
      rapidas: 'Quick',
      agenda: 'Schedule',
      emails: 'Emails',
      knowledge: 'Knowledge',
      requisicoes: 'Requests',
      visaoGeral: 'Overview',
      sistema: 'System',
      estrutura: 'Structure',
      estruturaCategorias: 'Categories',
      listas: 'Lists',
      spaceflow: 'Spaceflow',
      gestaoDeMembros: 'Member Management',
      interface: 'Interface',
      emailsConfig: 'Emails',
      emailsEnviados: 'Sent Emails',
      modelosDeEmail: 'Email Templates',
      caixasDeEmail: 'Mailboxes',
      integracoes: 'Integrations',
      agentesDeIa: 'AI Agents',
      logs: 'Logs',
      credenciais: 'Credentials',
      releases: 'Releases',
      documentacao: 'Documentation',
    },
    novoEmailNoItem: ref => `Write an email linked to ${ref}`,
  },
  atalho: {
    semContato: 'No contact',
    semEmail: 'No email on file',
    escreverNoEnspace: 'Write in ENSPACE',
    escreverNoEnspaceComItem: ref => `The email stays in the Mail Box of ${ref}`,
    abrirNoApp: 'Open in my email app',
    abrirNoAppDica: 'Outlook, Gmail or the computer default app',
    outrasFormasDeEmail: 'Other ways to send email',
    abrirNoAppComCopia: 'The item address goes in Cc: the reply returns to the Mail Box when the person replies to all.',
    email: 'Email',
  },
  inicio: {
    saudacao: nome => `Good morning, ${nome}!`,
    subtitulo: 'Ready for a productive day? Let\'s work together!',
    emAtraso: 'Overdue tasks',
    proximas: 'Upcoming tasks',
    rapidas: 'Quick tasks',
    nenhumaEmAtraso: 'No overdue tasks',
    nenhumaProxima: 'No upcoming tasks',
    acessarTarefas: 'Go to tasks',
    atualizar: 'Refresh',
    mostrando: n => `Showing 1-${n} of ${n} items`,
    atrasadaHa: d => `Overdue: ${d} ${d === 1 ? 'day' : 'days'} ago`,
    venceEm: d => d === 0 ? 'Due today' : `Due in ${d} ${d === 1 ? 'day' : 'days'}`,
  },
  prioridade: { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' },
  status: { pending: 'Pending', working: 'In progress', blocked: 'Blocked', completed: 'Completed' },
  etapa: { em_minuta: 'Drafting', em_assinatura: 'In signature', vigente: 'Active', em_renovacao: 'Renewing', encerrado: 'Closed' },
  itens: {
    vistaItens: 'Items',
    vistaQuadro: 'By stage',
    visualizar: 'View',
    pesquisar: 'Search records',
    criadoEm: 'Created at',
    todoPeriodo: 'All time',
    exportar: 'Export',
    colunas: 'Columns',
    filtros: 'Filters',
    configurar: 'Settings',
    novoRegistro: 'New record',
    referencia: 'Reference',
    nome: 'Name',
    etapa: 'Stage',
    contato: 'Contact',
    atualizadoEm: 'Updated at',
    nadaEncontrado: 'No items found',
    nadaEncontradoDica: 'Check the search or clear the filters.',
    acoes: 'Actions',
    verDetalhes: 'View Details',
    editar: 'Edit',
    enviarParaLixeira: 'Move to Trash',
    copiarLink: 'Copy Link',
    contatar: 'Contact',
    semContato: 'No contact',
    dicaDoQuadro: 'Right-click a card to email the contact.',
  },
  item: {
    paraQuem: 'To whom',
    ajudaComEnspace: ref => `The email goes out through ENSPACE and stays in the Mail Box of ${ref}. The arrow opens your email app.`,
    ajudaSemEnspace: 'Opens your email app with the recipient filled in and the item address in Cc.',
    semEmailAviso: 'This contact has no email address.',
    cadastrarEmail: 'Add email',
    semContatoTitulo: 'No contact on this item',
    semContatoDica: 'The contact fields of this item are empty.',
    escolherCampos: 'Choose the contact fields',
    identificacao: 'Identification',
    origem: 'Origin',
    status: 'Status',
    emailDaSolicitacao: 'Request email',
    historico: 'History',
    criadoEm: 'Created at',
    atualizadoEm: 'Updated at',
    editarVisualizacao: 'Edit view',
    imprimirPdf: 'Print PDF',
    abas: { visao: 'Overview', comentarios: 'Comments', logs: 'Audit Logs', tarefas: 'Tasks', anexos: 'Attachments', automaticos: 'Automatic Emails', mailbox: 'Mail Box', notas: 'Notes' },
    campos: {
      titulo: 'Name',
      contraparte: 'Counterparty',
      contato_nome: 'Contact',
      contato_email: 'Contact email',
      contato_telefone: 'Contact phone',
      financeiro_email: 'Finance email',
      valor: 'Amount',
      solicitante_nome: 'Requester name',
      solicitante_email: 'Requester email',
      solicitante_telefone: 'Requester phone',
      area: 'Department',
      cnpj: 'Tax ID',
      contato_whatsapp: 'Sales WhatsApp',
      pessoa_empresa: 'Person/Company',
    },
    sairSemSalvar: 'Leave without saving',
    salvar: 'Save',
    salvo: 'Item saved',
    copiarEndereco: 'Copy the mailbox address',
    recebidos: 'Received',
    enviados: 'Sent',
    para: quem => `To: ${quem}`,
    enviadoPor: nome => `Sent by ${nome} through ENSPACE`,
    responder: 'Reply',
    nenhumEmail: 'No emails found.',
    semTarefas: 'No tasks on this item',
    foraDoEscopo: 'Folder outside this prototype',
    foraDoEscopoDica: 'This folder exists in develop and does not change with the proposal.',
    contato: 'Item contact',
    emailPara: rotulo => `Send email to ${rotulo}`,
    novoEmail: 'New email',
    enviadoPelaCaixa: (nome, caixa) => `Sent by ${nome} from the ${caixa} mailbox`,
    nenhumEmailDica: 'Emails sent to the item address and emails sent from here appear in this list.',
    nenhumEmailDaTarefa: 'Emails linked to this task appear in this list. The other item emails are under "Item".',
    dataTarefa: 'This task',
    doItem: ref => `Item ${ref}`,
  },
  form: {
    formularios: 'Forms',
    selecioneUm: 'Select a form',
    compartilharTitulo: 'Share this form',
    publico: 'Public',
    privado: 'Private',
    qualquerPessoa: 'Anyone with the link can answer, no sign-in',
    linkDoFormulario: 'Form link',
    copiarLink: 'Copy link',
    copiado: 'Copied',
    abrirNovaAba: 'Open in a new tab',
    enviarLinkPor: 'Send the link by',
    assuntoDoLink: nome => `Form: ${nome}`,
    mensagemDoLink: (nome, url) => `To fill in the form "${nome}", use this link: ${url}`,
    linkCopiado: 'Link copied',
    linkDeFormulario: 'Public form link',
    copiarLinkPublico: 'Copy a public form link',
    nenhumPublico: 'No public forms',
    nenhumPublicoDica: 'A form shows up here when it is Public and of type Creation or General.',
    irParaFormularios: 'See forms',
    soPublicos: 'Only public forms are listed.',
    privadoDica: 'Private form: only workspace members can answer. That is why it has no link to send.',
    porFavorDigite: 'Please type',
    salvar: 'Save',
  },
  tarefas: {
    titulo: 'Quick Tasks',
    lista: 'List',
    pesquisar: 'Search tasks...',
    arquivadas: 'Archived',
    lixeira: 'Trash',
    nova: 'New task',
    filtrosRapidos: 'Quick Filters',
    nome: 'Name',
    prazo: 'Due date',
    status: 'Status',
    responsavel: 'Assignee',
    contato: 'Contact',
    prioridade: 'Priority',
    item: 'Item',
    semResponsavel: 'No assignee',
    semResponsavelDica: 'Assign someone to send the email.',
    abrir: 'Open task',
    selecionadas: n => `${n} ${n === 1 ? 'task' : 'tasks'} selected`,
    ajudaDoLote: 'Opens 1 email with all assignees in To.',
    foraDoLote: n => `${n} ${n === 1 ? 'task' : 'tasks'} without assignee left out.`,
    dicaDoQuadro: 'Click a card to open the task. Right-click to email the assignee.',
    respostaCriaItem: categoria => `An answer through the link creates a new item in ${categoria}. This task stays open until you complete it.`,
    assuntoDoAviso: (tarefa, prazo) => prazo ? `Task: ${tarefa} (due ${prazo})` : `Task: ${tarefa}`,
    mensagemDoAviso: (nome, tarefa, prazo) => `${nome ? `Hi, ${nome}.` : 'Hi.'} Reminder about the task "${tarefa}"${prazo ? `, due ${prazo}` : ''}.`,
    assuntoDoLote: n => `${n} pending tasks`,
    emailPara: nome => `Send email to ${nome}`,
    emailParaResponsaveis: n => n === 1 ? 'Email the assignee' : `Email the ${n} assignees`,
    abrirMailBox: 'Open the Mail Box',
    detalhes: 'Details',
    semItemTitulo: 'Task without an item',
    semItemDescricao: 'The Mail Box belongs to the item. This task has no linked item, so it has no emails.',
  },
  agenda: {
    hoje: 'Today',
    anterior: 'Previous month',
    proximo: 'Next month',
    visualizacao: 'View',
    mes: 'Month',
    data: 'Date',
    diaUtil: 'Business Day',
    diaNaoUtil: 'Non-Working Day',
    mais: n => `+ ${n} ${n === 1 ? 'event' : 'events'}`,
    evento: 'Event',
    participantes: 'Participants',
    quem: { outlook: 'Participants', item: 'Item contacts', tarefa: 'Assignee' },
    fonte: { outlook: 'Outlook meeting', item: 'Item date', tarefa: 'Task due date' },
    intervalo: (de, ate) => `${de} to ${ate}`,
    enviarLembrete: 'Send reminder',
    emailParaTodos: n => `Email everyone (${n})`,
    assuntoDoLembrete: (evento, quando) => `Reminder: ${evento} (${quando})`,
    mensagemDoLembrete: (nome, evento, quando) => `${nome ? `Hi, ${nome}.` : 'Hi.'} Reminder: ${evento}, ${quando}.`,
    emailPara: nome => `Send email to ${nome}`,
    ajudaDoLembrete: 'The email opens with the date, time and subject filled in. You can edit the text before sending.',
  },
  emails: {
    titulo: 'Emails',
    descricaoFase1: 'Emails received and sent through the item Mail Box.',
    descricaoFase2: 'Emails received and sent through ENSPACE, with or without an item.',
    descricaoDoSistema: 'Also the emails that tasks and flows sent.',
    pesquisar: 'Search...',
    limparBusca: 'Clear search',
    periodoRotulo: 'Period',
    periodo: { todos: 'All time', hoje: 'Today', semana: 'Last 7 days', mes: 'Last 30 days' },
    limparFiltros: 'Clear filters',
    colunas: 'Columns',
    expandirFiltros: 'Expand filters',
    recolherFiltros: 'Collapse filters',
    rapidos: { recebidos: 'Received', enviados: 'Sent', sistema: 'From the system', naoLidos: 'Unread', comAnexo: 'With attachment', semItem: 'Without item' },
    col: { tipo: 'Type', de: 'From', para: 'To', assunto: 'Subject', item: 'Item', tarefa: 'Task', enviadoPor: 'Sent by', status: 'Status', data: 'Date', acoes: 'Actions' },
    tipo: { recebido: 'Received', enviado: 'Sent' },
    ordenar: coluna => `Sort by ${coluna}`,
    filtro: {
      filtrar: 'Filter',
      totalmente: 'Is exactly',
      operadores: { eq: 'Equal', ne: 'Different', contains: 'Contains', ncontains: 'Does not contain', containss: 'Contains (case sensitive)', ncontainss: 'Does not contain (case sensitive)' },
      preposicao: { eq: 'to', ne: 'Than', contains: 'partially', ncontains: '', containss: 'partially', ncontainss: '' },
      digiteValor: 'Type the value...',
      aplicar: 'Click to apply the filter',
      remover: 'Remove filter',
      adicionar: 'Add Filter',
      pendentes: 'Apply the pending filters before adding a new one.',
      buscarOpcoes: 'Search...',
      todos: 'All',
      limpar: 'Clear',
      selecionados: n => `${n} selected`,
      nenhumResultado: 'No results found',
    },
    pagina: { mostrando: (a, b, n) => `Showing ${a} to ${b} of ${n} results`, porPagina: n => `${n} per page`, rotulo: 'Items per page' },
    acoes: { verDetalhes: 'View Details', responder: 'Reply', encaminhar: 'Forward', marcarNaoLido: 'Mark as unread', verItem: 'View Item', vincular: 'Link to an item' },
    semItem: 'Without item',
    naoLido: 'Unread',
    comAnexo: 'With attachment',
    vazioDescricao: 'No emails found.',
    vazioFiltrado: 'No emails match these filters.',
    sistema: 'System',
    vazio: { novoTitulo: 'No emails yet', novoDescricao: 'Emails people exchange through items appear here. To start, connect your Outlook account and create the workspace templates and boxes.', novoMembroDescricao: 'Emails you exchange through items appear here. To send through ENSPACE, connect your Outlook account.', primeiroTitulo: 'No emails yet', primeiroDescricao: 'Write the first email. It appears here and in the Mail Box of the linked item.', integrar: 'Connect Outlook account', criarModelo: 'Create template', criarCaixa: 'Create email box', escrever: 'New email' },
    vinculadoTitulo: 'Email linked',
    vinculadoDescricao: ref => `It appears in the Mail Box tab of ${ref}.`,
    vincularDepois: 'This email has no item. Once linked, it appears in the Mail Box tab of the item.',
    sugestoesPeloRemetente: 'Suggestions from the recipient',
    vincular: 'Link',
  },
  compositor: {
    titulo: 'New Message',
    de: 'From',
    para: 'To',
    paraPlaceholder: 'Type a name or email',
    usarEndereco: e => `Use "${e}"`,
    adicionarEmCopia: 'Add Cc',
    cc: 'Cc',
    cco: 'Bcc',
    emailPlaceholder: 'name@company.com',
    template: 'Template',
    templatePlaceholder: 'Choose an email template',
    assunto: 'Subject',
    assuntoPlaceholder: 'Type the email subject',
    vincularTitulo: 'Link to item',
    itemVinculado: 'Linked item',
    opcional: '(optional)',
    vincularDica: 'The email goes into the item history. The link keeps the item, not its name: renaming the item breaks nothing.',
    buscarItem: 'Search by name, reference or ID',
    vincularAjuda: 'Select an item to link this email. The link is saved in ENSPACE.',
    trocar: 'Change',
    desvincular: 'Remove link',
    cancelar: 'Cancel',
    vinculadoPeloItem: 'Linked because you started on the item. You can change or remove the link.',
    vinculadoPelaTarefa: 'Linked to the task item. You can change or remove the link.',
    vinculadoFixo: ref => `The email is kept in the ${ref} Mail Box, and the reply goes back there.`,
    recentes: 'Recently updated',
    resultados: (m, n) => `${m} of ${n} ${n === 1 ? 'item' : 'items'}`,
    sobra: n => `${n} more ${n === 1 ? 'item' : 'items'}. Keep typing to narrow down.`,
    soPermitidos: 'Only items you can see are listed.',
    nenhumItem: q => `No items with "${q}"`,
    nenhumItemDica: 'Search by reference (CTR-00231), ID or contact name.',
    suaConta: 'Your Outlook account',
    responderParaItem: 'Reply-to: the item address. Replies come back to the Mail Box tab.',
    respostasNoSeuOutlook: 'Without a linked item, replies reach only your Outlook.',
    semContaTitulo: 'No integrated accounts available.',
    semContaDescricao: 'ENSPACE email goes out from your Outlook account. Connect Outlook Mail in Profile › Integrations. Until then, the Email button opens your email app.',
    integrarContas: 'Connect accounts',
    inserirAssinatura: 'Insert signature',
    cargoDaAssinatura: 'Legal · Aurora Serviços',
    mensagem: 'Message',
    mensagemPlaceholder: 'Write or type "/" for commands...',
    link: { botao: 'Link', colar: 'Paste a link...', aplicar: 'Apply link', abrir: 'Open in a new tab', remover: 'Remove link' },
    minimizar: 'Minimize',
    expandir: 'Expand',
    reduzir: 'Shrink',
    rascunhoSalvo: 'Draft saved',
    rascunho: 'Draft',
    abrirRascunho: 'Open draft',
    sugestoes: 'Suggestions',
    sugestaoMotivo: nome => `${nome} is a contact on this item`,
    anexarArquivo: 'Attach file',
    removerAnexo: a => `Remove ${a}`,
    descartar: 'Discard',
    enviar: 'Send',
    erroPara: 'Add at least 1 recipient.',
    erroEmailInvalido: e => `"${e}" is not a valid email.`,
    erroCorpo: 'Write the message before sending.',
    erroDe: 'Connect Outlook Mail to send.',
    falhaTitulo: 'Email not sent',
    falhaDescricao: 'The email server did not respond. The draft stays open so you can try again.',
    semAssunto: '(no subject)',
    enviadoTitulo: 'Email sent',
    enviadoComItem: ref => `Linked to ${ref}. Replies come back to the item.`,
    enviadoSemItem: de => `Sent from ${de}. Without a linked item, the email stays only in your Outlook and does not appear in ENSPACE.`,
    verNoItem: 'See on item',
    verEmEmails: 'See in Emails',
    descartado: 'Draft discarded',
    desfazer: 'Undo',
    grupoOutlook: 'Your account',
    grupoCaixas: 'Workspace mailboxes',
    caixaDoWorkspace: 'Workspace mailbox',
    respostasNaCaixa: caixa => `Without a linked item, replies reach the ${caixa} mailbox, in the Service Center.`,
    semItemNaoRegistra: 'Without a linked item, the email stays only in your Outlook and does not appear in ENSPACE.',
    vincularTarefa: 'Link to task',
    vincularTarefaAjuda: 'The email also appears in the task Mail Box.',
    semTarefa: 'No task',
    respostaComoNova: 'The reply goes out as a new message, quoting the original. It does not join the same thread.',
    respostaNaConversa: 'The reply continues in the same thread as the original email.',
    enviadoSemItemRegistrado: de => `Sent from ${de}, without a linked item. The email stays in Emails.`,
  },
  central: {
    abas: { mensagens: 'Messages', modelos: 'Templates', caixas: 'Email Boxes', configuracoes: 'Settings' },
    dicas: { modelos: 'The templates offered in the email Template field.', caixas: 'The workspace addresses that receive email and can start a flow.', configuracoes: 'Each person\'s sending account and the workspace email rules.' },
    novoModelo: 'New template',
    novaCaixa: 'New box',
    pesquisarModelos: 'Search templates...',
    pesquisarCaixas: 'Search boxes...',
    vazio: { modelosTitulo: 'No templates', modelosDescricao: 'A template fills in the subject and message of an email. Create the first one for your team.', caixasTitulo: 'No email boxes', caixasDescricao: 'A box receives the emails sent to the workspace and can start a flow.' },
    col: { nome: 'Name', assunto: 'Subject', remetentePorDominio: 'Use sender by domain', email: 'Email', provedor: 'Provider', criadoEm: 'Created at', status: 'Status', destino: 'Email', copia: 'CC email', tarefa: 'Task', acoes: 'Actions' },
    sim: 'Yes',
    nao: 'No',
    editar: 'Edit',
    excluir: 'Delete',
    usar: 'Use in an email',
    status: { enviado: 'Sent', processando: 'Processing', falhou: 'Failed' },
    verEmail: 'View email',
    reenviar: 'Resend email',
    reenviado: 'Email added to the sending queue',
    maquete: 'This action has no effect in the prototype.',
    config: {
      contaTitulo: 'Your sending account',
      contaDescricao: 'Email written in ENSPACE is sent from the Outlook account you connected to your profile.',
      contaConectada: (email: string) => `Connected account: ${email}`,
      outlookTitulo: 'Outlook Mail',
      contaSem: 'No connected account. Without it, the Email button opens the computer email app.',
      integrar: 'Connect accounts',
      gerenciar: 'Manage integration',
      dominioTitulo: 'Sender with the company domain',
      dominioDescricao: 'Emails sent by the system can use the company domain, through the SendGrid integration.',
      abrirIntegracoes: 'Open Integrations',
      contatoTitulo: 'Item contact',
      contatoPelosCampos: 'The contact of each item comes from the email fields the category already has and from the requester email.',
      contatoNaCategoria: 'Set the contact name and email fields in each category.',
      irParaCategorias: 'Choose the contact of each category',
      remetentesTitulo: 'Boxes as sender',
      remetentesDescricao: 'Choose the workspace boxes offered in the From field to whoever writes an email.',
      disponivelNoDe: 'Available in From',
      soAdmin: 'Visible only to workspace administrators.',
      regrasTitulo: 'Workspace rules',
      regrasDescricao: 'They apply to everyone in the workspace. Visible only to administrators.',
      salvar: 'Save',
      salvo: 'Settings saved',
    },
  },
  sistema: {
    titulo: 'General Settings',
    abas: { basicas: 'Basic Information', calendario: 'Calendar', notificacoes: 'Notifications', dicionarios: 'Dictionaries', cobranca: 'Billing' },
    nome: 'Name',
    referencia: 'Reference',
    salvar: 'Save',
    adicionais: 'Additional Settings',
    opcoesAdicionais: ['Show categories', 'Ignore permissions for full members', 'Hide create button on item types screen', 'Show integration URL', 'Enable custom stamp on documents'],
    modulos: 'Modules',
    correcaoMonetaria: 'Monetary Correction',
    comparacoes: 'Comparisons',
    juridico: 'Legal',
    modulosSalvos: 'Modules saved',
    zonaDePerigo: 'Danger Zone',
    excluirWorkspace: 'Delete Workspace',
    excluirWorkspaceDica: 'Permanently delete this workspace and all its data. This cannot be undone.',
  },
  categoria: {
    categorias: 'Categories',
    voltar: 'Back',
    acessar: 'Open',
    editar: 'Edit',
    deletar: 'Delete',
    duplicar: 'Duplicate',
    exportarModelo: 'Export form template',
    copiar: 'Copy',
    soPublicoCopia: 'Only public forms have a link',
    tornarPublico: 'Make public',
    tornarPrivado: 'Make private',
    visibilidadeMudou: (nome, v) => `${nome}: ${v}`,
    nome: 'Name',
    tipo: 'Type',
    respostas: 'Answers',
    visibilidade: 'Visibility',
    tipos: { criacao: 'Creation', editar: 'Edit', geral: 'General', visualizar: 'View' },
    formulariosDica: 'A public form gets a copy link on the screens where it is used: home, item list, tasks and Requests.',
    cartoes: {
      campos: 'Fields',
      formularios: 'Forms',
      fluxos: 'Flows',
      pastas: 'View Folders',
      relatorios: 'Reports',
      condicionais: 'Conditionals',
      templates: 'Document Templates',
      notificacoes: 'Notifications',
      responsabilidade: 'Responsibility Rules',
      execucoes: 'Scheduled Runs',
      status: 'Status',
      correcao: 'Monetary Correction',
      atalhos: 'Category contact',
    },
    descricoes: {
      campos: 'Category data properties and format.',
      formularios: 'Field groups to create and work with category items.',
      fluxos: 'Workflows and automations tied to the item life cycle.',
      pastas: 'Panels to view and work with data when opening an item.',
      relatorios: 'Category data reports and analysis.',
      condicionais: 'Reusable rules and conditions for data validation and automation.',
      templates: 'Document templates to generate files automatically.',
      notificacoes: 'Notification and alert settings for category items.',
      responsabilidade: 'Responsibility and task assignment rules for category items.',
      execucoes: 'Task scheduling and automatic runs for category items.',
      status: 'Status and stage settings for category items.',
      correcao: 'Monetary Correction settings for this category.',
      atalhos: 'Who the item contact is and the email subject.',
    },
    quemEhContato: 'Who the contact is',
    quemEhContatoDica: 'Each contact appears in Item contact, on the item side panel. Choose which fields hold the name and the email.',
    rotulo: 'Contact name on screen',
    removerContato: 'Remove contact',
    campoNome: 'Name',
    campoEmail: 'Email',
    nenhum: 'None',
    tipoEmail: 'Email field',
    tipoPessoa: 'Person/Company',
    subNome: 'Contact name',
    subEmail: 'Contact email',
    subTelefone: 'Contact phone',
    emailDoRequisitante: 'Requester Email',
    campoPadrao: 'Default field of every category',
    novoContato: 'New contact',
    adicionarContato: 'Add contact',
    assuntoDoEmail: 'Email subject',
    inserir: 'Insert:',
    previa: 'Preview: what the Email button opens',
    semNome: 'No name',
    salvo: 'Category contact saved',
    avaliarComDevs: 'To review with the developers',
    assuntoDica: 'The email opens with this subject. The sender can change it before sending.',
  },
  simulador: {
    selo: 'Simulation · outside ENSPACE',
    titulo: { email: 'Your email app', formulario: 'Public form page', outlook: 'Connect Outlook Mail' },
    noProduto: {
      email: 'In the product, the default email app of the computer opens, already filled in.',
      formulario: 'This is what an outside person sees: the form without login. Answering creates an item in ENSPACE.',
      outlook: 'In the product: Profile › Integrations and the corporate Microsoft login.',
    },
    voltar: 'Back to ENSPACE',
    enviar: 'Send',
    descartar: 'Discard',
    escrevaAqui: 'Write the email',
    novaMensagem: 'New message',
    comCopiaAviso: 'The item address is in Cc: the copy reaches the item Mail Box.',
    semCopiaAviso: 'Without the item address in Cc, this email does not reach ENSPACE.',
    emailEnviado: 'Email sent from your app',
    copiaNaMailBox: ref => `The copy reached the ${ref} Mail Box.`,
    semCopia: 'This email does not stay in ENSPACE.',
    verNaMailBox: 'See in Mail Box',
    formPublico: 'Public form · no login needed',
    enviarResposta: 'Send answer',
    respostaEnviada: 'Answer sent',
    obrigado: 'Thank you. You can close this page.',
    itemCriado: (categoria, ref) => `New item in ${categoria}: ${ref}`,
    itemCriadoDescricao: 'Created by the public form answer.',
    abrirItem: 'Open item',
    integracoes: 'User Settings › Integrations',
    correioOutlook: 'Outlook Mail',
    correioOutlookDescricao: 'Connect your email with Outlook.',
    sincronizar: 'Sync',
    contaMicrosoft: 'Microsoft account',
    pedidoDePermissao: 'ENSPACE asks for permission to send email from your account.',
    cancelar: 'Cancel',
    aceitar: 'Accept',
    integrado: 'Connected',
    integradoDescricao: 'ENSPACE email goes out from your Outlook account.',
  },
  andaime: {
    prototipo: 'Prototype',
    irPara: 'Go to',
    quemUsa: 'Who uses it',
    quemConfigura: 'Who sets it up',
    listaDeItens: 'Item list (Contracts)',
    umItem: ref => `Item ${ref}`,
    mailBox: ref => `${ref} Mail Box`,
    configDosEmails: 'Emails › Settings',
    perfil: 'Profile',
    perfis: { admin: 'Admin', membro: 'Member' },
    perfilDica: 'The member sees Messages and their own sending account. Administrators also see templates, boxes and system emails.',
    dados: 'Data',
    dadosOpcoes: { novo: 'New workspace', primeiroUso: 'First use', emUso: 'In use' },
    dadosDica: 'New workspace: nothing set up and nothing sent. First use: templates, boxes and Outlook account ready, no emails yet.',
    atalhosDaCategoria: 'Contact of the Contracts category',
    formularios: 'Requests forms',
    cenario: 'Scenario',
    cenarios: { normal: 'Normal', semOutlook: 'No Outlook connected', falha: 'Sending fails' },
    mostrarOQueMuda: 'Show what changes',
    porTras: 'Behind it',
    fase: 'Phase',
    fases: { 1: '1 · MVP', 2: '2 · Sender', 3: '3 · Task' },
    fasesDica: { 1: 'Screen only, on what ENSPACE already has', 2: 'Choose From, reply in the thread, forward and record without item', 3: 'Link the email to a task' },
  },
}

/* ================================================================== *
 * Español
 * ================================================================== */

const es: Textos = {
  casca: {
    menuLateral: 'Menú lateral',
    buscar: 'Buscar...',
    membro: 'Miembro',
    configuracoes: 'Configuración',
    ajuda: 'Ayuda',
    trilha: 'Ruta',
    voltar: 'Volver',
    avancar: 'Avanzar',
    recarregar: 'Recargar',
    suporte: 'Soporte',
    notificacoes: 'Notificaciones',
    idioma: 'Idioma',
    tema: 'Tema',
    workspaces: 'Workspaces',
    dados: 'Datos',
    novoEmail: 'Nuevo correo',
    novoEmailDica: 'Escribir un correo sin salir de esta pantalla',
    itens: {
      inicio: 'Inicio',
      spaceflows: 'Spaceflows',
      categorias: 'Categorías',
      tarefas: 'Tareas',
      agendadas: 'Programadas',
      rapidas: 'Rápidas',
      agenda: 'Agenda',
      emails: 'Correos',
      knowledge: 'Knowledge',
      requisicoes: 'Solicitudes',
      visaoGeral: 'Visión General',
      sistema: 'Sistema',
      estrutura: 'Estructura',
      estruturaCategorias: 'Categorías',
      listas: 'Listas',
      spaceflow: 'Spaceflow',
      gestaoDeMembros: 'Gestión de Miembros',
      interface: 'Interfaz',
      emailsConfig: 'Correos',
      emailsEnviados: 'Correos Enviados',
      modelosDeEmail: 'Plantillas de Correo',
      caixasDeEmail: 'Buzones de Correo',
      integracoes: 'Integraciones',
      agentesDeIa: 'Agentes de IA',
      logs: 'Registros',
      credenciais: 'Credenciales',
      releases: 'Releases',
      documentacao: 'Documentación',
    },
    novoEmailNoItem: ref => `Escribir un correo vinculado a ${ref}`,
  },
  atalho: {
    semContato: 'Sin contacto',
    semEmail: 'Sin correo registrado',
    escreverNoEnspace: 'Escribir en ENSPACE',
    escreverNoEnspaceComItem: ref => `El correo queda en el Mail Box de ${ref}`,
    abrirNoApp: 'Abrir en mi app de correo',
    abrirNoAppDica: 'Outlook, Gmail o la app predeterminada del equipo',
    outrasFormasDeEmail: 'Otras formas de enviar correo',
    abrirNoAppComCopia: 'La dirección del ítem va en copia: la respuesta vuelve al Mail Box cuando la persona responde a todos.',
    email: 'Correo',
  },
  inicio: {
    saudacao: nome => `¡Buenos días, ${nome}!`,
    subtitulo: '¿Listo para un día productivo? ¡Trabajemos juntos!',
    emAtraso: 'Tareas atrasadas',
    proximas: 'Próximas tareas',
    rapidas: 'Tareas rápidas',
    nenhumaEmAtraso: 'Ninguna tarea atrasada',
    nenhumaProxima: 'Ninguna tarea próxima',
    acessarTarefas: 'Ir a tareas',
    atualizar: 'Actualizar',
    mostrando: n => `Mostrando 1-${n} de ${n} ítems`,
    atrasadaHa: d => `Atrasada: hace ${d} ${d === 1 ? 'día' : 'días'}`,
    venceEm: d => d === 0 ? 'Vence hoy' : `Vence en ${d} ${d === 1 ? 'día' : 'días'}`,
  },
  prioridade: { low: 'Baja', normal: 'Normal', high: 'Alta', urgent: 'Urgente' },
  status: { pending: 'Pendiente', working: 'En curso', blocked: 'Bloqueada', completed: 'Completada' },
  etapa: { em_minuta: 'En borrador', em_assinatura: 'En firma', vigente: 'Vigente', em_renovacao: 'En renovación', encerrado: 'Cerrado' },
  itens: {
    vistaItens: 'Ítems',
    vistaQuadro: 'Por etapa',
    visualizar: 'Visualizar',
    pesquisar: 'Buscar registros',
    criadoEm: 'Creado el',
    todoPeriodo: 'Todo el período',
    exportar: 'Exportar',
    colunas: 'Columnas',
    filtros: 'Filtros',
    configurar: 'Configurar',
    novoRegistro: 'Nuevo registro',
    referencia: 'Referencia',
    nome: 'Nombre',
    etapa: 'Etapa',
    contato: 'Contacto',
    atualizadoEm: 'Actualizado el',
    nadaEncontrado: 'Ningún ítem encontrado',
    nadaEncontradoDica: 'Revisa la búsqueda o limpia los filtros.',
    acoes: 'Acciones',
    verDetalhes: 'Ver Detalles',
    editar: 'Editar',
    enviarParaLixeira: 'Enviar a la Papelera',
    copiarLink: 'Copiar Enlace',
    contatar: 'Contactar',
    semContato: 'Sin contacto',
    dicaDoQuadro: 'Haga clic derecho en una tarjeta para enviar un correo al contacto.',
  },
  item: {
    paraQuem: 'Para quién',
    ajudaComEnspace: ref => `El correo sale por ENSPACE y queda en el Mail Box de ${ref}. La flecha abre su app de correo.`,
    ajudaSemEnspace: 'Abre su app de correo con el destinatario completo y la dirección del ítem en copia.',
    semEmailAviso: 'Este contacto no tiene correo registrado.',
    cadastrarEmail: 'Registrar correo',
    semContatoTitulo: 'Ningún contacto en este ítem',
    semContatoDica: 'Los campos de contacto de este ítem están vacíos.',
    escolherCampos: 'Elegir los campos de contacto',
    identificacao: 'Identificación',
    origem: 'Origen',
    status: 'Estado',
    emailDaSolicitacao: 'Correo de la solicitud',
    historico: 'Historial',
    criadoEm: 'Creado el',
    atualizadoEm: 'Actualizado el',
    editarVisualizacao: 'Editar vista',
    imprimirPdf: 'Imprimir PDF',
    abas: { visao: 'Visión General', comentarios: 'Comentarios', logs: 'Registros de Auditoría', tarefas: 'Tareas', anexos: 'Adjuntos', automaticos: 'Correos Automáticos', mailbox: 'Mail Box', notas: 'Notas' },
    campos: {
      titulo: 'Nombre',
      contraparte: 'Contraparte',
      contato_nome: 'Contacto',
      contato_email: 'Correo del contacto',
      contato_telefone: 'Teléfono del contacto',
      financeiro_email: 'Correo de finanzas',
      valor: 'Valor',
      solicitante_nome: 'Nombre de quien pidió',
      solicitante_email: 'Correo de quien pidió',
      solicitante_telefone: 'Teléfono de quien pidió',
      area: 'Área',
      cnpj: 'CNPJ',
      contato_whatsapp: 'WhatsApp comercial',
      pessoa_empresa: 'Persona/Empresa',
    },
    sairSemSalvar: 'Salir sin guardar',
    salvar: 'Guardar',
    salvo: 'Ítem guardado',
    copiarEndereco: 'Copiar la dirección del buzón',
    recebidos: 'Recibidos',
    enviados: 'Enviados',
    para: quem => `Para: ${quem}`,
    enviadoPor: nome => `Enviado por ${nome} desde ENSPACE`,
    responder: 'Responder',
    nenhumEmail: 'Ningún correo encontrado.',
    semTarefas: 'Ninguna tarea en este ítem',
    foraDoEscopo: 'Carpeta fuera de este prototipo',
    foraDoEscopoDica: 'Esta carpeta existe en develop y no cambia con la propuesta.',
    contato: 'Contacto del ítem',
    emailPara: rotulo => `Enviar correo a ${rotulo}`,
    novoEmail: 'Nuevo correo',
    enviadoPelaCaixa: (nome, caixa) => `Enviado por ${nome} desde el buzón ${caixa}`,
    nenhumEmailDica: 'Los correos enviados a la dirección del ítem y los enviados desde aquí aparecen en esta lista.',
    nenhumEmailDaTarefa: 'Los correos vinculados a esta tarea aparecen en esta lista. Los demás correos del ítem están en "Del ítem".',
    dataTarefa: 'De esta tarea',
    doItem: ref => `Del ítem ${ref}`,
  },
  form: {
    formularios: 'Formularios',
    selecioneUm: 'Selecciona un formulario',
    compartilharTitulo: 'Compartir este formulario',
    publico: 'Público',
    privado: 'Privado',
    qualquerPessoa: 'Cualquiera con el enlace responde, sin iniciar sesión',
    linkDoFormulario: 'Enlace del formulario',
    copiarLink: 'Copiar enlace',
    copiado: 'Copiado',
    abrirNovaAba: 'Abrir en una pestaña nueva',
    enviarLinkPor: 'Enviar el enlace por',
    assuntoDoLink: nome => `Formulario: ${nome}`,
    mensagemDoLink: (nome, url) => `Para completar el formulario "${nome}", usa este enlace: ${url}`,
    linkCopiado: 'Enlace copiado',
    linkDeFormulario: 'Enlace de formulario público',
    copiarLinkPublico: 'Copiar enlace de formulario público',
    nenhumPublico: 'Ningún formulario público',
    nenhumPublicoDica: 'Un formulario aparece aquí cuando es Público y del tipo Creación o General.',
    irParaFormularios: 'Ver formularios',
    soPublicos: 'Solo aparecen formularios públicos.',
    privadoDica: 'Formulario privado: solo responden miembros del workspace. Por eso no tiene enlace para enviar.',
    porFavorDigite: 'Por favor escribe',
    salvar: 'Guardar',
  },
  tarefas: {
    titulo: 'Tareas Rápidas',
    lista: 'Lista',
    pesquisar: 'Buscar tareas...',
    arquivadas: 'Archivadas',
    lixeira: 'Papelera',
    nova: 'Nueva tarea',
    filtrosRapidos: 'Filtros Rápidos',
    nome: 'Nombre',
    prazo: 'Plazo',
    status: 'Estado',
    responsavel: 'Responsable',
    contato: 'Contacto',
    prioridade: 'Prioridad',
    item: 'Ítem',
    semResponsavel: 'Sin responsable',
    semResponsavelDica: 'Asigne un responsable para enviar el correo.',
    abrir: 'Abrir tarea',
    selecionadas: n => `${n} ${n === 1 ? 'tarea seleccionada' : 'tareas seleccionadas'}`,
    ajudaDoLote: 'Abre 1 correo con todos los responsables en Para.',
    foraDoLote: n => `${n} ${n === 1 ? 'tarea sin responsable queda fuera' : 'tareas sin responsable quedan fuera'}.`,
    dicaDoQuadro: 'Haga clic en la tarjeta para abrir la tarea. Con el botón derecho, envíe un correo al responsable.',
    respostaCriaItem: categoria => `La respuesta por el enlace crea un ítem nuevo en ${categoria}. Esta tarea sigue abierta hasta que la completes.`,
    assuntoDoAviso: (tarefa, prazo) => prazo ? `Tarea: ${tarefa} (plazo ${prazo})` : `Tarea: ${tarefa}`,
    mensagemDoAviso: (nome, tarefa, prazo) => `${nome ? `Hola, ${nome}.` : 'Hola.'} Recordatorio de la tarea "${tarefa}"${prazo ? `, plazo ${prazo}` : ''}.`,
    assuntoDoLote: n => `${n} tareas pendientes`,
    emailPara: nome => `Enviar correo a ${nome}`,
    emailParaResponsaveis: n => n === 1 ? 'Correo al responsable' : `Correo a los ${n} responsables`,
    abrirMailBox: 'Abrir el Mail Box',
    detalhes: 'Detalles',
    semItemTitulo: 'Tarea sin ítem',
    semItemDescricao: 'El Mail Box es del ítem. Esta tarea no tiene ítem vinculado, por eso no tiene correos.',
  },
  agenda: {
    hoje: 'Hoy',
    anterior: 'Mes anterior',
    proximo: 'Mes siguiente',
    visualizacao: 'Vista',
    mes: 'Mes',
    data: 'Fecha',
    diaUtil: 'Día Hábil',
    diaNaoUtil: 'Día No Hábil',
    mais: n => `+ ${n} ${n === 1 ? 'evento' : 'eventos'}`,
    evento: 'Evento',
    participantes: 'Participantes',
    quem: { outlook: 'Participantes', item: 'Contactos del ítem', tarefa: 'Responsable' },
    fonte: { outlook: 'Reunión de Outlook', item: 'Fecha de un ítem', tarefa: 'Plazo de una tarea' },
    intervalo: (de, ate) => `${de} a ${ate}`,
    enviarLembrete: 'Enviar recordatorio',
    emailParaTodos: n => `Correo para todos (${n})`,
    assuntoDoLembrete: (evento, quando) => `Recordatorio: ${evento} (${quando})`,
    mensagemDoLembrete: (nome, evento, quando) => `${nome ? `Hola, ${nome}.` : 'Hola.'} Recordatorio: ${evento}, ${quando}.`,
    emailPara: nome => `Enviar correo a ${nome}`,
    ajudaDoLembrete: 'El correo se abre con la fecha, la hora y el asunto completos. Es posible editar el texto antes del envío.',
  },
  emails: {
    titulo: 'Correos',
    descricaoFase1: 'Los correos recibidos y enviados por el Mail Box de los ítems.',
    descricaoFase2: 'Los correos recibidos y enviados por ENSPACE, con o sin ítem.',
    descricaoDoSistema: 'También los correos que tareas y flujos enviaron.',
    pesquisar: 'Buscar...',
    limparBusca: 'Limpiar la búsqueda',
    periodoRotulo: 'Período',
    periodo: { todos: 'Todo el período', hoje: 'Hoy', semana: 'Últimos 7 días', mes: 'Últimos 30 días' },
    limparFiltros: 'Limpiar filtros',
    colunas: 'Columnas',
    expandirFiltros: 'Expandir filtros',
    recolherFiltros: 'Contraer filtros',
    rapidos: { recebidos: 'Recibidos', enviados: 'Enviados', sistema: 'Del sistema', naoLidos: 'No leídos', comAnexo: 'Con adjunto', semItem: 'Sin ítem' },
    col: { tipo: 'Tipo', de: 'De', para: 'Para', assunto: 'Asunto', item: 'Ítem', tarefa: 'Tarea', enviadoPor: 'Enviado por', status: 'Estado', data: 'Fecha', acoes: 'Acciones' },
    tipo: { recebido: 'Recibido', enviado: 'Enviado' },
    ordenar: coluna => `Ordenar por ${coluna}`,
    filtro: {
      filtrar: 'Filtrar',
      totalmente: 'Es totalmente',
      operadores: { eq: 'Igual', ne: 'Diferente', contains: 'Contiene', ncontains: 'No contiene', containss: 'Contiene (distingue mayúsculas y minúsculas)', ncontainss: 'No contiene (distingue mayúsculas y minúsculas)' },
      preposicao: { eq: 'a', ne: 'De', contains: 'parcialmente', ncontains: '', containss: 'parcialmente', ncontainss: '' },
      digiteValor: 'Escriba el valor...',
      aplicar: 'Haga clic para aplicar el filtro',
      remover: 'Quitar filtro',
      adicionar: 'Agregar Filtro',
      pendentes: 'Aplique los filtros pendientes antes de agregar uno nuevo.',
      buscarOpcoes: 'Buscar...',
      todos: 'Todos',
      limpar: 'Limpiar',
      selecionados: n => `${n} ${n === 1 ? 'seleccionado' : 'seleccionados'}`,
      nenhumResultado: 'No se encontraron resultados',
    },
    pagina: { mostrando: (a, b, n) => `Mostrando ${a} a ${b} de ${n} resultados`, porPagina: n => `${n} por página`, rotulo: 'Ítems por página' },
    acoes: { verDetalhes: 'Ver Detalles', responder: 'Responder', encaminhar: 'Reenviar', marcarNaoLido: 'Marcar como no leído', verItem: 'Ver Ítem', vincular: 'Vincular a un ítem' },
    semItem: 'Sin ítem',
    naoLido: 'No leído',
    comAnexo: 'Con adjunto',
    vazioDescricao: 'No se encontraron correos.',
    vazioFiltrado: 'Ningún correo con estos filtros.',
    sistema: 'Sistema',
    vazio: { novoTitulo: 'Ningún correo todavía', novoDescricao: 'Los correos que las personas intercambian por los ítems aparecen aquí. Para empezar, integre su cuenta de Outlook y cree las plantillas y los buzones del workspace.', novoMembroDescricao: 'Los correos que usted intercambia por los ítems aparecen aquí. Para enviar por ENSPACE, integre su cuenta de Outlook.', primeiroTitulo: 'Ningún correo todavía', primeiroDescricao: 'Escriba el primer correo. Aparece aquí y en el Mail Box del ítem vinculado.', integrar: 'Integrar cuenta de Outlook', criarModelo: 'Crear plantilla', criarCaixa: 'Crear buzón de correo', escrever: 'Nuevo correo' },
    vinculadoTitulo: 'Correo vinculado',
    vinculadoDescricao: ref => `Aparece en la pestaña Mail Box de ${ref}.`,
    vincularDepois: 'Este correo no tiene ítem. Al vincularlo, pasa a aparecer en la pestaña Mail Box del ítem.',
    sugestoesPeloRemetente: 'Sugerencias por el destinatario',
    vincular: 'Vincular',
  },
  compositor: {
    titulo: 'Nuevo Mensaje',
    de: 'De',
    para: 'Para',
    paraPlaceholder: 'Escribe un nombre o correo',
    usarEndereco: e => `Usar "${e}"`,
    adicionarEmCopia: 'Agregar en Copia',
    cc: 'Cc',
    cco: 'Cco',
    emailPlaceholder: 'nombre@empresa.com',
    template: 'Plantilla',
    templatePlaceholder: 'Elige una plantilla de correo',
    assunto: 'Asunto',
    assuntoPlaceholder: 'Escribe el asunto del correo',
    vincularTitulo: 'Vincular a ítem',
    itemVinculado: 'Ítem vinculado',
    opcional: '(opcional)',
    vincularDica: 'El correo entra en el historial del ítem. El vínculo guarda el ítem, no el nombre: renombrar el ítem no rompe nada.',
    buscarItem: 'Buscar por nombre, referencia o ID',
    vincularAjuda: 'Selecciona un ítem para vincular este correo. El vínculo queda guardado en ENSPACE.',
    trocar: 'Cambiar',
    desvincular: 'Quitar vínculo',
    cancelar: 'Cancelar',
    vinculadoPeloItem: 'Vinculado porque usted empezó en el ítem. Es posible cambiar o quitar el vínculo.',
    vinculadoPelaTarefa: 'Vinculado al ítem de la tarea. Es posible cambiar o quitar el vínculo.',
    vinculadoFixo: ref => `El correo queda en la Mail Box de ${ref}, y la respuesta vuelve allí.`,
    recentes: 'Actualizados recientemente',
    resultados: (m, n) => `${m} de ${n} ${n === 1 ? 'ítem' : 'ítems'}`,
    sobra: n => `${n} ${n === 1 ? 'ítem más' : 'ítems más'}. Sigue escribiendo para encontrarlo.`,
    soPermitidos: 'Solo aparecen ítems que puedes ver.',
    nenhumItem: q => `Ningún ítem con "${q}"`,
    nenhumItemDica: 'Busca por referencia (CTR-00231), ID o nombre del contacto.',
    suaConta: 'Tu cuenta de Outlook',
    responderParaItem: 'Responder a: la dirección del ítem. La respuesta vuelve a la pestaña Mail Box.',
    respostasNoSeuOutlook: 'Sin ítem vinculado, la respuesta llega solo a su Outlook.',
    semContaTitulo: 'No hay cuentas integradas disponibles.',
    semContaDescricao: 'El correo de ENSPACE sale de tu cuenta de Outlook. Integra el Correo de Outlook en Perfil › Integraciones. Mientras tanto, el botón Correo abre tu app de correo.',
    integrarContas: 'Integrar cuentas',
    inserirAssinatura: 'Insertar firma',
    cargoDaAssinatura: 'Jurídico · Aurora Serviços',
    mensagem: 'Mensaje',
    mensagemPlaceholder: 'Escribe o teclea "/" para ver los comandos...',
    link: { botao: 'Enlace', colar: 'Pega una dirección...', aplicar: 'Aplicar enlace', abrir: 'Abrir en una pestaña nueva', remover: 'Quitar enlace' },
    minimizar: 'Minimizar',
    expandir: 'Expandir',
    reduzir: 'Reducir',
    rascunhoSalvo: 'Borrador guardado',
    rascunho: 'Borrador',
    abrirRascunho: 'Abrir borrador',
    sugestoes: 'Sugerencias',
    sugestaoMotivo: nome => `${nome} es contacto de este ítem`,
    anexarArquivo: 'Adjuntar archivo',
    removerAnexo: a => `Quitar ${a}`,
    descartar: 'Descartar',
    enviar: 'Enviar',
    erroPara: 'Indica al menos 1 destinatario.',
    erroEmailInvalido: e => `"${e}" no es un correo válido.`,
    erroCorpo: 'Escribe el mensaje antes de enviar.',
    erroDe: 'Integra el Correo de Outlook para enviar.',
    falhaTitulo: 'Correo no enviado',
    falhaDescricao: 'El servidor de correo no respondió. El borrador sigue abierto para intentar de nuevo.',
    semAssunto: '(sin asunto)',
    enviadoTitulo: 'Correo enviado',
    enviadoComItem: ref => `Vinculado a ${ref}. Las respuestas vuelven al ítem.`,
    enviadoSemItem: de => `Enviado desde ${de}. Sin ítem vinculado, el correo queda solo en su Outlook y no aparece en ENSPACE.`,
    verNoItem: 'Ver en el ítem',
    verEmEmails: 'Ver en Correos',
    descartado: 'Borrador descartado',
    desfazer: 'Deshacer',
    grupoOutlook: 'Su cuenta',
    grupoCaixas: 'Buzones del workspace',
    caixaDoWorkspace: 'Buzón del workspace',
    respostasNaCaixa: caixa => `Sin ítem vinculado, la respuesta llega al buzón ${caixa}, en la Central de Atención.`,
    semItemNaoRegistra: 'Sin ítem vinculado, el correo queda solo en su Outlook y no aparece en ENSPACE.',
    vincularTarefa: 'Vincular a una tarea',
    vincularTarefaAjuda: 'El correo aparece también en el Mail Box de la tarea.',
    semTarefa: 'Ninguna tarea',
    respostaComoNova: 'La respuesta sale como un mensaje nuevo, con el texto original citado. No entra en la misma conversación.',
    respostaNaConversa: 'La respuesta sigue en la misma conversación del correo original.',
    enviadoSemItemRegistrado: de => `Enviado desde ${de}, sin ítem vinculado. El correo queda en Correos.`,
  },
  central: {
    abas: { mensagens: 'Mensajes', modelos: 'Plantillas', caixas: 'Buzones de correo', configuracoes: 'Configuración' },
    dicas: { modelos: 'Las plantillas que aparecen en el campo Plantilla del correo.', caixas: 'Las direcciones del workspace que reciben correos y pueden iniciar un flujo.', configuracoes: 'La cuenta de envío de cada persona y las reglas del correo en el workspace.' },
    novoModelo: 'Nueva plantilla',
    novaCaixa: 'Nuevo buzón',
    pesquisarModelos: 'Buscar plantillas...',
    pesquisarCaixas: 'Buscar buzones...',
    vazio: { modelosTitulo: 'Ninguna plantilla', modelosDescricao: 'La plantilla completa el asunto y el mensaje de un correo. Cree la primera para el equipo.', caixasTitulo: 'Ningún buzón de correo', caixasDescricao: 'El buzón recibe los correos enviados al workspace y puede iniciar un flujo.' },
    col: { nome: 'Nombre', assunto: 'Asunto', remetentePorDominio: 'Usar remitente por dominio', email: 'Correo', provedor: 'Proveedor', criadoEm: 'Creado el', status: 'Estado', destino: 'Correo', copia: 'Correo en copia', tarefa: 'Tarea', acoes: 'Acciones' },
    sim: 'Sí',
    nao: 'No',
    editar: 'Editar',
    excluir: 'Eliminar',
    usar: 'Usar en un correo',
    status: { enviado: 'Enviado', processando: 'En proceso', falhou: 'Falló' },
    verEmail: 'Ver correo',
    reenviar: 'Reenviar correo',
    reenviado: 'Correo puesto en la cola de envío',
    maquete: 'Esta acción no tiene efecto en el prototipo.',
    config: {
      contaTitulo: 'Su cuenta de envío',
      contaDescricao: 'El correo escrito en ENSPACE sale de la cuenta de Outlook que usted integró a su perfil.',
      contaConectada: (email: string) => `Cuenta conectada: ${email}`,
      outlookTitulo: 'Correo de Outlook',
      contaSem: 'Ninguna cuenta integrada. Sin ella, el botón Correo abre la aplicación de correo del equipo.',
      integrar: 'Integrar cuentas',
      gerenciar: 'Administrar integración',
      dominioTitulo: 'Remitente con el dominio de la empresa',
      dominioDescricao: 'Los correos enviados por el sistema pueden salir con el dominio de la empresa, por la integración SendGrid.',
      abrirIntegracoes: 'Abrir Integraciones',
      contatoTitulo: 'Contacto del ítem',
      contatoPelosCampos: 'El contacto de cada ítem viene de los campos de correo que la categoría ya tiene y del correo de quien abrió la solicitud.',
      contatoNaCategoria: 'Defina en cada categoría los campos de nombre y de correo del contacto.',
      irParaCategorias: 'Elegir el contacto de cada categoría',
      remetentesTitulo: 'Buzones como remitente',
      remetentesDescricao: 'Elija los buzones del workspace que aparecen en el campo De de quien escribe un correo.',
      disponivelNoDe: 'Disponible en el campo De',
      soAdmin: 'Visible solo para quien administra el workspace.',
      regrasTitulo: 'Reglas del workspace',
      regrasDescricao: 'Valen para todas las personas del workspace. Visible solo para quien administra.',
      salvar: 'Guardar',
      salvo: 'Configuración guardada',
    },
  },
  sistema: {
    titulo: 'Configuración General',
    abas: { basicas: 'Información Básica', calendario: 'Calendario', notificacoes: 'Notificaciones', dicionarios: 'Diccionarios', cobranca: 'Facturación' },
    nome: 'Nombre',
    referencia: 'Referencia',
    salvar: 'Guardar',
    adicionais: 'Configuración Adicional',
    opcoesAdicionais: ['Mostrar categorías', 'Ignorar permisos para miembros full', 'Ocultar botón de crear en la pantalla de tipos de ítems', 'Mostrar URL de integración', 'Habilitar sello personalizado en documentos'],
    modulos: 'Módulos',
    correcaoMonetaria: 'Corrección Monetaria',
    comparacoes: 'Comparaciones',
    juridico: 'Jurídico',
    modulosSalvos: 'Módulos guardados',
    zonaDePerigo: 'Zona de Peligro',
    excluirWorkspace: 'Eliminar Workspace',
    excluirWorkspaceDica: 'Eliminar para siempre este workspace y todos sus datos. Esta acción no se puede deshacer.',
  },
  categoria: {
    categorias: 'Categorías',
    voltar: 'Volver',
    acessar: 'Abrir',
    editar: 'Editar',
    deletar: 'Eliminar',
    duplicar: 'Duplicar',
    exportarModelo: 'Exportar plantilla de formulario',
    copiar: 'Copiar',
    soPublicoCopia: 'Solo el formulario público tiene enlace',
    tornarPublico: 'Hacer público',
    tornarPrivado: 'Hacer privado',
    visibilidadeMudou: (nome, v) => `${nome}: ${v}`,
    nome: 'Nombre',
    tipo: 'Tipo',
    respostas: 'Respuestas',
    visibilidade: 'Visibilidad',
    tipos: { criacao: 'Creación', editar: 'Editar', geral: 'General', visualizar: 'Visualizar' },
    formulariosDica: 'Un formulario público gana el enlace para copiar en las pantallas de uso: inicio, lista de ítems, tareas y Solicitudes.',
    cartoes: {
      campos: 'Campos',
      formularios: 'Formularios',
      fluxos: 'Flujos',
      pastas: 'Carpetas de Visualización',
      relatorios: 'Informes',
      condicionais: 'Condicionales',
      templates: 'Plantillas de Documentos',
      notificacoes: 'Notificaciones',
      responsabilidade: 'Reglas de Responsabilidad',
      execucoes: 'Ejecuciones Programadas',
      status: 'Estado',
      correcao: 'Corrección Monetaria',
      atalhos: 'Contacto de la categoría',
    },
    descricoes: {
      campos: 'Propiedades y formato de datos de la categoría.',
      formularios: 'Agrupación de campos para crear y trabajar con ítems de la categoría.',
      fluxos: 'Flujos de trabajo y automatizaciones del ciclo de vida de los ítems.',
      pastas: 'Paneles para ver y trabajar con los datos al abrir un ítem.',
      relatorios: 'Informes y análisis de datos de la categoría.',
      condicionais: 'Reglas y condiciones reutilizables para validación y automatización.',
      templates: 'Plantillas de documentos para generar archivos automáticamente.',
      notificacoes: 'Configuración de notificaciones y alertas de los ítems de la categoría.',
      responsabilidade: 'Reglas de responsabilidad y asignación de tareas de los ítems.',
      execucoes: 'Programación de tareas y ejecuciones automáticas de los ítems.',
      status: 'Configuración de estados y etapas de los ítems de la categoría.',
      correcao: 'Configuración de Corrección Monetaria de esta categoría.',
      atalhos: 'Quién es el contacto del ítem y el asunto del correo.',
    },
    quemEhContato: 'Quién es el contacto',
    quemEhContatoDica: 'Cada contacto aparece en Contacto del ítem, en el panel lateral del ítem. Elija de qué campos vienen el nombre y el correo.',
    rotulo: 'Nombre del contacto en pantalla',
    removerContato: 'Quitar contacto',
    campoNome: 'Nombre',
    campoEmail: 'Correo',
    nenhum: 'Ninguno',
    tipoEmail: 'Campo Correo',
    tipoPessoa: 'Persona/Empresa',
    subNome: 'Nombre de contacto',
    subEmail: 'Correo de contacto',
    subTelefone: 'Teléfono de contacto',
    emailDoRequisitante: 'Correo del Solicitante',
    campoPadrao: 'Campo estándar de toda categoría',
    novoContato: 'Nuevo contacto',
    adicionarContato: 'Agregar contacto',
    assuntoDoEmail: 'Asunto del correo',
    inserir: 'Insertar:',
    previa: 'Vista previa: lo que abre el botón Correo',
    semNome: 'Sin nombre',
    salvo: 'Contacto de la categoría guardado',
    avaliarComDevs: 'Para evaluar con los desarrolladores',
    assuntoDica: 'El correo abre con este asunto. Quien envía puede cambiarlo antes de mandar.',
  },
  simulador: {
    selo: 'Simulación · fuera de ENSPACE',
    titulo: { email: 'Su app de correo', formulario: 'Página pública del formulario', outlook: 'Integrar el Correo de Outlook' },
    noProduto: {
      email: 'En el producto, abre la app de correo predeterminada del equipo, ya completa.',
      formulario: 'Es lo que ve la persona de afuera: el formulario sin inicio de sesión. Responder crea un ítem en ENSPACE.',
      outlook: 'En el producto: Perfil › Integraciones y el inicio de sesión de la cuenta Microsoft corporativa.',
    },
    voltar: 'Volver a ENSPACE',
    enviar: 'Enviar',
    descartar: 'Descartar',
    escrevaAqui: 'Escribe el correo',
    novaMensagem: 'Mensaje nuevo',
    comCopiaAviso: 'La dirección del ítem está en Cc: la copia llega al Mail Box del ítem.',
    semCopiaAviso: 'Sin la dirección del ítem en Cc, este correo no llega a ENSPACE.',
    emailEnviado: 'Correo enviado desde tu app',
    copiaNaMailBox: ref => `La copia llegó al Mail Box de ${ref}.`,
    semCopia: 'Este correo no queda en ENSPACE.',
    verNaMailBox: 'Ver en el Mail Box',
    formPublico: 'Formulario público · no necesita login',
    enviarResposta: 'Enviar respuesta',
    respostaEnviada: 'Respuesta enviada',
    obrigado: 'Gracias. Puedes cerrar esta página.',
    itemCriado: (categoria, ref) => `Ítem nuevo en ${categoria}: ${ref}`,
    itemCriadoDescricao: 'Creado por la respuesta del formulario público.',
    abrirItem: 'Abrir ítem',
    integracoes: 'Configuración del Usuario › Integraciones',
    correioOutlook: 'Correo de Outlook',
    correioOutlookDescricao: 'Integra tu correo con Outlook.',
    sincronizar: 'Sincronizar',
    contaMicrosoft: 'Cuenta Microsoft',
    pedidoDePermissao: 'ENSPACE pide permiso para enviar correo desde tu cuenta.',
    cancelar: 'Cancelar',
    aceitar: 'Aceptar',
    integrado: 'Integrado',
    integradoDescricao: 'El correo de ENSPACE sale de tu cuenta de Outlook.',
  },
  andaime: {
    prototipo: 'Prototipo',
    irPara: 'Ir a',
    quemUsa: 'Quien usa',
    quemConfigura: 'Quien configura',
    listaDeItens: 'Lista de ítems (Contratos)',
    umItem: ref => `Ítem ${ref}`,
    mailBox: ref => `Mail Box de ${ref}`,
    configDosEmails: 'Correos › Configuración',
    perfil: 'Perfil',
    perfis: { admin: 'Admin', membro: 'Miembro' },
    perfilDica: 'El miembro ve Mensajes y su propia cuenta de envío. Quien administra ve también plantillas, buzones y envíos del sistema.',
    dados: 'Datos',
    dadosOpcoes: { novo: 'Workspace nuevo', primeiroUso: 'Primer uso', emUso: 'En uso' },
    dadosDica: 'Workspace nuevo: nada configurado y nada enviado. Primer uso: plantillas, buzones y cuenta de Outlook listos, ningún correo todavía.',
    atalhosDaCategoria: 'Contacto de la categoría Contratos',
    formularios: 'Formularios de Solicitudes',
    cenario: 'Escenario',
    cenarios: { normal: 'Normal', semOutlook: 'Sin Outlook integrado', falha: 'El envío falla' },
    mostrarOQueMuda: 'Mostrar lo que cambia',
    porTras: 'Detrás',
    fase: 'Fase',
    fases: { 1: '1 · MVP', 2: '2 · Remitente', 3: '3 · Tarea' },
    fasesDica: { 1: 'Solo pantalla, sobre lo que ENSPACE ya tiene', 2: 'Elegir el De, responder en la conversación, reenviar y registrar sin ítem', 3: 'Vincular el correo a una tarea' },
  },
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': ptBR, en, es }
