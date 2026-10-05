// Os textos do protótipo nos 3 idiomas do ENSPACE (regra 35).
//
// A casca e as telas copiadas usam o rótulo do develop, inclusive o que está
// torto ("Juridico" sem acento, "Mail Box", "Emails Automáticos"): é cópia, e
// o torto vira achado no BRIEFING. O texto novo é a copy proposta.
// Nenhum texto de interface leva travessão (regra 33).

import type { Idioma } from '../../composables/useIdioma'
import type { StatusDoItem } from './mocks'
import type { Canal, Lugar } from './estado'

type PorCanal = Record<Canal, string>

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
  }
  atalho: {
    canal: PorCanal
    abrindo: PorCanal
    semContato: string
    semEmail: string
    semTelefone: string
    escreverNoEnspace: string
    escreverNoEnspaceComItem: (ref: string) => string
    escreverNoEnspaceSemItem: string
    abrirNoApp: string
    abrirNoAppDica: string
    outrasFormasDeEmail: string
    telefoneInvalido: string
    abrirNoAppComCopia: string
  }
  inicio: {
    saudacao: (nome: string) => string
    subtitulo: string
    atalhos: string
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
    contatoRapido: string
    paraQuem: string
    ajudaComEnspace: string
    ajudaSemEnspace: string
    semTelefoneAviso: string
    semEmailAviso: string
    cadastrarTelefone: string
    telefoneInvalidoAviso: string
    corrigirTelefone: string
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
    copiarEndereco: string
    escreverEmail: string
    recebidos: string
    enviados: string
    para: (quem: string) => string
    enviadoPor: (nome: string) => string
    responder: string
    nenhumEmail: string
    semTarefas: string
    foraDoEscopo: string
    foraDoEscopoDica: string
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
    abrirNovaAbaMaquete: string
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
    avisar: (nome: string) => string
    avisarSemResponsavel: string
    avisarResponsaveisPor: string
    selecionadas: (n: number) => string
    ajudaDoLote: string
    foraDoLote: (n: number) => string
    loteTitulo: (canal: string) => string
    loteDescricao: string
    abrirConversa: string
    aberta: string
    dicaDoQuadro: string
    membroSemTelefone: string
    loteProgresso: (i: number, n: number) => string
    proxima: string
    fechar: string
    loteConcluido: string
    foraSemTelefone: (nomes: string) => string
    assuntoDoAviso: (tarefa: string, prazo: string | null) => string
    mensagemDoAviso: (nome: string, tarefa: string, prazo: string | null) => string
    assuntoDoLote: (n: number) => string
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
    fonte: Record<'outlook' | 'item' | 'tarefa', string>
    intervalo: (de: string, ate: string) => string
    enviarLembrete: string
    emailParaTodos: (n: number) => string
    ajudaComTelefone: string
    ajudaSemTelefone: string
    assuntoDoLembrete: (evento: string, quando: string) => string
    mensagemDoLembrete: (nome: string, evento: string, quando: string) => string
  }
  emails: {
    titulo: string
    recebidos: string
    enviados: string
    pesquisar: string
    vinculo: Record<'todos' | 'com' | 'sem', string>
    de: string
    para: string
    assunto: string
    item: string
    caixa: string
    enviadoPor: string
    data: string
    semItem: string
    naoLido: string
    vazioTitulo: string
    vazioDescricao: string
    vinculadoTitulo: string
    vinculadoDescricao: (ref: string) => string
    vincularDepois: string
    encaminhar: string
    vincular: string
    sugestoesPeloRemetente: string
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
    opcional: string
    vincularDica: string
    buscarItem: string
    vincularAjuda: string
    trocar: string
    desvincular: string
    cancelar: string
    vinculadoPeloItem: string
    vinculadoPelaTarefa: string
    semMailBox: (categoria: string) => string
    recentes: string
    resultados: (mostrando: number, total: number) => string
    sobra: (n: number) => string
    soPermitidos: string
    nenhumItem: (q: string) => string
    nenhumItemDica: string
    caixaDoItem: (ref: string) => string
    respostasVoltamParaOItem: string
    respostasVaoParaCaixa: string
    semCaixaTitulo: string
    semCaixaDescricao: string
    vincularUmItem: string
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
    atalhos: string
    atalhosDescricao: string
    emailDoEnspace: string
    emailDoEnspaceDescricao: string
    canais: string
    canaisAjuda: string
    ondeAparecem: string
    lugares: Record<Lugar, string>
    textoInicial: string
    textoInicialAjuda: string
    copiaParaOItem: string
    copiaParaOItemAjuda: string
    irParaCategorias: string
    caixaSemItem: string
    caixaSemItemAjuda: string
    nenhumaCaixa: string
    nenhumaCaixaDica: string
    preRequisito: (n: number, total: number) => string
    semMailBox: string
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
    moduloDesligado: string
    moduloDesligadoTitulo: string
    moduloDesligadoDica: string
    quemEhContato: string
    quemEhContatoDica: string
    rotulo: string
    removerContato: string
    campoNome: string
    campoEmail: string
    campoTelefone: string
    nenhum: string
    tipoEmail: string
    tipoMascara: string
    emailDoRequisitante: string
    campoPadrao: string
    novoContato: string
    adicionarContato: string
    semCampoDeTelefone: string
    textoInicial: string
    textoInicialDica: string
    textoInicialDesligado: string
    assuntoDoEmail: string
    mensagemDoApp: string
    inserir: string
    previa: string
    semNome: string
    salvo: string
  }
  andaime: {
    prototipo: string
    irPara: string
    quemUsa: string
    quemConfigura: string
    listaDeItens: string
    umItem: (ref: string) => string
    mailBox: (ref: string) => string
    modulos: string
    atalhosDaCategoria: string
    formularios: string
    cenario: string
    cenarios: { normal: string, semCaixa: string, falha: string }
    mostrarOQueMuda: string
    porTras: string
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
  },
  atalho: {
    canal: { email: 'E-mail', whatsapp: 'WhatsApp', sms: 'SMS' },
    abrindo: { email: 'Abre o seu app de e-mail', whatsapp: 'Abre o WhatsApp', sms: 'Abre o app de mensagens' },
    semContato: 'Sem contato',
    semEmail: 'Sem e-mail cadastrado',
    semTelefone: 'Sem telefone cadastrado',
    escreverNoEnspace: 'Escrever pelo ENSPACE',
    escreverNoEnspaceComItem: ref => `Sai da caixa de ${ref} e fica no histórico do item`,
    escreverNoEnspaceSemItem: 'Sai de uma caixa do workspace',
    abrirNoApp: 'Abrir no meu app de e-mail',
    abrirNoAppDica: 'Outlook, Gmail ou o app padrão do computador',
    outrasFormasDeEmail: 'Outras formas de enviar e-mail',
    telefoneInvalido: 'Telefone inválido',
    abrirNoAppComCopia: 'A caixa do item vai em cópia: a resposta volta quando a pessoa responde a todos.',
  },
  inicio: {
    saudacao: nome => `Bom dia, ${nome}!`,
    subtitulo: 'Pronto para um dia produtivo? Vamos trabalhar juntos!',
    atalhos: 'Atalhos',
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
    dicaDoQuadro: 'Clique com o botão direito num cartão para contatar.',
  },
  item: {
    contatoRapido: 'Contato rápido',
    paraQuem: 'Para quem',
    ajudaComEnspace: 'WhatsApp e SMS abrem o app do seu computador ou celular. O e-mail sai pelo ENSPACE ou pelo seu app.',
    ajudaSemEnspace: 'Abre o seu app com o destinatário preenchido. O ENSPACE não envia a mensagem.',
    semTelefoneAviso: 'Sem telefone: WhatsApp e SMS indisponíveis.',
    semEmailAviso: 'Sem e-mail: o atalho de e-mail fica indisponível.',
    cadastrarTelefone: 'Cadastrar telefone',
    telefoneInvalidoAviso: 'Telefone inválido: WhatsApp e SMS indisponíveis.',
    corrigirTelefone: 'Corrigir telefone',
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
    },
    sairSemSalvar: 'Sair sem salvar',
    salvar: 'Salvar',
    copiarEndereco: 'Copiar o endereço da caixa',
    escreverEmail: 'Escrever e-mail',
    recebidos: 'Recebidos',
    enviados: 'Enviados',
    para: quem => `Para: ${quem}`,
    enviadoPor: nome => `Enviado por ${nome} pelo ENSPACE`,
    responder: 'Responder',
    nenhumEmail: 'Nenhum e-mail encontrado.',
    semTarefas: 'Nenhuma tarefa neste item',
    foraDoEscopo: 'Pasta fora deste protótipo',
    foraDoEscopoDica: 'Esta pasta existe no develop e não muda com a proposta.',
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
    abrirNovaAbaMaquete: 'No produto, abre o formulário numa nova aba',
    enviarLinkPor: 'Enviar o link por',
    assuntoDoLink: nome => `Formulário: ${nome}`,
    mensagemDoLink: (nome, url) => `Para preencher o formulário "${nome}", use este link: ${url}`,
    linkCopiado: 'Link copiado',
    linkDeFormulario: 'Link de formulário público',
    copiarLinkPublico: 'Copiar link de formulário público',
    nenhumPublico: 'Nenhum formulário público',
    nenhumPublicoDica: 'Um formulário aparece aqui quando a visibilidade dele é Público.',
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
    semResponsavelDica: 'Atribua um responsável para avisar alguém.',
    abrir: 'Abrir tarefa',
    avisar: nome => `Avisar ${nome}`,
    avisarSemResponsavel: 'Avisar responsável',
    avisarResponsaveisPor: 'Avisar responsáveis por',
    selecionadas: n => plural(n, 'tarefa selecionada', 'tarefas selecionadas'),
    ajudaDoLote: 'O e-mail abre 1 rascunho para todos. WhatsApp e SMS abrem 1 conversa por responsável.',
    foraDoLote: n => n === 1 ? '1 tarefa sem responsável fica de fora.' : `${n} tarefas sem responsável ficam de fora.`,
    loteTitulo: canal => `Avisar por ${canal}`,
    loteDescricao: 'Uma conversa por pessoa. Abra uma de cada vez.',
    abrirConversa: 'Abrir conversa',
    aberta: 'Aberta',
    dicaDoQuadro: 'Clique no cartão para abrir a tarefa. Com o botão direito, avise o responsável.',
    membroSemTelefone: 'WhatsApp e SMS pedem o telefone do membro. A tela de perfil ainda não tem esse campo.',
    loteProgresso: (i, n) => `Conversa ${i} de ${n}`,
    proxima: 'Próxima',
    fechar: 'Fechar',
    loteConcluido: 'Todas as conversas abertas.',
    foraSemTelefone: nomes => `Ficam de fora, sem telefone: ${nomes}.`,
    assuntoDoAviso: (tarefa, prazo) => prazo ? `Tarefa: ${tarefa} (prazo ${prazo})` : `Tarefa: ${tarefa}`,
    mensagemDoAviso: (nome, tarefa, prazo) => `Olá, ${nome}. Lembrete da tarefa "${tarefa}"${prazo ? `, prazo ${prazo}` : ''}.`,
    assuntoDoLote: n => `${n} tarefas pendentes`,
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
    fonte: { outlook: 'Reunião do Outlook', item: 'Data de um item', tarefa: 'Prazo de uma tarefa' },
    intervalo: (de, ate) => `${de} às ${ate}`,
    enviarLembrete: 'Enviar lembrete',
    emailParaTodos: n => `E-mail para todos (${n})`,
    ajudaComTelefone: 'Data, hora e assunto vão preenchidos. WhatsApp e SMS abrem 1 conversa por participante.',
    ajudaSemTelefone: 'Data, hora e assunto vão preenchidos. Os participantes deste evento não têm telefone no ENSPACE: só o e-mail funciona.',
    assuntoDoLembrete: (evento, quando) => `Lembrete: ${evento} (${quando})`,
    mensagemDoLembrete: (nome, evento, quando) => `Olá, ${nome}. Lembrete: ${evento}, ${quando}.`,
  },
  emails: {
    titulo: 'E-mails',
    recebidos: 'Recebidos',
    enviados: 'Enviados',
    pesquisar: 'Pesquisar e-mails',
    vinculo: { todos: 'Todos', com: 'Com item', sem: 'Sem item' },
    de: 'De',
    para: 'Para',
    assunto: 'Assunto',
    item: 'Item',
    caixa: 'Caixa',
    enviadoPor: 'Enviado por',
    data: 'Data',
    semItem: 'Sem item',
    naoLido: 'Não lido',
    vazioTitulo: 'Nenhum e-mail aqui',
    vazioDescricao: 'Mude o filtro ou escreva um e-mail novo.',
    vinculadoTitulo: 'E-mail vinculado',
    vinculadoDescricao: ref => `Aparece na aba Mail Box de ${ref}.`,
    vincularDepois: 'O e-mail passa a aparecer na aba Mail Box do item.',
    encaminhar: 'Encaminhar',
    vincular: 'Vincular',
    sugestoesPeloRemetente: 'Sugestões pelo remetente',
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
    opcional: '(opcional)',
    vincularDica: 'O e-mail entra no histórico do item. O vínculo guarda o item, não o nome: renomear o item não quebra nada.',
    buscarItem: 'Buscar por nome, referência ou ID',
    vincularAjuda: 'Selecione um item para vincular este e-mail. O vínculo fica salvo no ENSPACE.',
    trocar: 'Trocar',
    desvincular: 'Remover vínculo',
    cancelar: 'Cancelar',
    vinculadoPeloItem: 'Vinculado porque você começou no item. Dá para trocar ou remover.',
    vinculadoPelaTarefa: 'Vinculado ao item da tarefa. Dá para trocar ou remover.',
    semMailBox: categoria => `${categoria} não tem a pasta Mail Box: o e-mail não aparece na tela do item.`,
    recentes: 'Atualizados por último',
    resultados: (m, n) => `${m} de ${plural(n, 'item', 'itens')}`,
    sobra: n => `Mais ${plural(n, 'item', 'itens')}. Continue digitando para achar.`,
    soPermitidos: 'Só aparecem itens que você pode ver.',
    nenhumItem: q => `Nenhum item com "${q}"`,
    nenhumItemDica: 'Procure pela referência (CTR-00231), pelo ID ou pelo nome do contato.',
    caixaDoItem: ref => `Caixa do item ${ref}`,
    respostasVoltamParaOItem: 'As respostas voltam para a aba Mail Box do item.',
    respostasVaoParaCaixa: 'As respostas chegam nesta caixa do workspace.',
    semCaixaTitulo: 'Sem caixa para enviar',
    semCaixaDescricao: 'Sem item vinculado, o e-mail sai de uma caixa do workspace, e este workspace não tem nenhuma. Vincule um item ou peça a um administrador para criar uma caixa.',
    vincularUmItem: 'Vincular um item',
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
    erroDe: 'Escolha de onde o e-mail sai.',
    falhaTitulo: 'E-mail não enviado',
    falhaDescricao: 'O servidor de e-mail não respondeu. O rascunho continua aberto para tentar de novo.',
    semAssunto: '(sem assunto)',
    enviadoTitulo: 'E-mail enviado',
    enviadoComItem: ref => `Vinculado a ${ref}. As respostas voltam para o item.`,
    enviadoSemItem: de => `Saiu de ${de}, sem item vinculado.`,
    verNoItem: 'Ver no item',
    verEmEmails: 'Ver em E-mails',
    descartado: 'Rascunho descartado',
    desfazer: 'Desfazer',
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
    atalhos: 'Atalhos de comunicação',
    atalhosDescricao: 'Botões de e-mail, WhatsApp e SMS nas telas, e o link dos formulários públicos.',
    emailDoEnspace: 'E-mail do ENSPACE em todas as telas',
    emailDoEnspaceDescricao: 'Escrever e-mail de qualquer tela, com vínculo a item, e a área E-mails no menu.',
    canais: 'Canais',
    canaisAjuda: 'Canal desligado some de todas as telas.',
    ondeAparecem: 'Onde aparecem',
    lugares: { inicio: 'Tela inicial', item: 'Tela do item', itens: 'Lista e quadro de itens', tarefas: 'Tarefas', agenda: 'Agenda', formularios: 'Link de formulário público' },
    textoInicial: 'Preencher assunto e mensagem',
    textoInicialAjuda: 'O texto vem da configuração de cada categoria. Quem envia pode mudar antes de mandar.',
    copiaParaOItem: 'Pôr a caixa do item em cópia',
    copiaParaOItemAjuda: 'No e-mail aberto no app da pessoa. A resposta volta para a aba Mail Box do item.',
    irParaCategorias: 'Escolher o contato de cada categoria',
    caixaSemItem: 'Caixa para e-mail sem item',
    caixaSemItemAjuda: 'Com item vinculado, o e-mail sai da caixa do item.',
    nenhumaCaixa: 'Nenhuma caixa de e-mail criada',
    nenhumaCaixaDica: 'Crie uma em Configurações › E-mails › Caixas de E-mail. Sem caixa, só sai e-mail vinculado a item.',
    preRequisito: (n, total) => `Pasta Mail Box: ${n} de ${total} categorias têm`,
    semMailBox: 'Sem a pasta Mail Box, o e-mail vinculado não aparece na tela do item.',
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
      atalhos: 'Atalhos de comunicação',
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
      atalhos: 'Quem é o contato do item e o texto que os atalhos abrem.',
    },
    moduloDesligado: 'Módulo desligado',
    moduloDesligadoTitulo: 'O módulo Atalhos de comunicação está desligado',
    moduloDesligadoDica: 'A configuração fica guardada e passa a valer quando alguém ligar o módulo em Sistema › Módulos.',
    quemEhContato: 'Quem é o contato',
    quemEhContatoDica: 'Cada contato aparece no Contato rápido do item. Escolha de quais campos vêm o nome, o e-mail e o telefone.',
    rotulo: 'Nome do contato na tela',
    removerContato: 'Remover contato',
    campoNome: 'Nome',
    campoEmail: 'E-mail',
    campoTelefone: 'Telefone',
    nenhum: 'Nenhum',
    tipoEmail: 'Campo E-mail',
    tipoMascara: 'Texto com Máscara',
    emailDoRequisitante: 'E-mail do Requisitante',
    campoPadrao: 'Campo padrão de toda categoria',
    novoContato: 'Novo contato',
    adicionarContato: 'Adicionar contato',
    semCampoDeTelefone: 'Esta categoria não tem campo de telefone. Para WhatsApp e SMS, crie um campo Texto com Máscara.',
    textoInicial: 'Texto inicial',
    textoInicialDica: 'O app abre com este texto. Quem envia pode mudar antes de mandar.',
    textoInicialDesligado: 'O preenchimento está desligado em Sistema › Módulos: o app abre só com o destinatário.',
    assuntoDoEmail: 'Assunto do e-mail',
    mensagemDoApp: 'Mensagem de WhatsApp e SMS',
    inserir: 'Inserir:',
    previa: 'Prévia: o que cada atalho abre',
    semNome: 'Sem nome',
    salvo: 'Atalhos salvos',
  },
  andaime: {
    prototipo: 'Protótipo',
    irPara: 'Ir para',
    quemUsa: 'Quem usa',
    quemConfigura: 'Quem configura',
    listaDeItens: 'Lista de itens (Contratos)',
    umItem: ref => `Item ${ref}`,
    mailBox: ref => `Mail Box de ${ref}`,
    modulos: 'Sistema › Módulos',
    atalhosDaCategoria: 'Atalhos da categoria Contratos',
    formularios: 'Formulários de Solicitações',
    cenario: 'Cenário',
    cenarios: { normal: 'Normal', semCaixa: 'Sem caixa de e-mail', falha: 'Envio falha' },
    mostrarOQueMuda: 'Mostrar o que muda',
    porTras: 'Por trás',
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
  },
  atalho: {
    canal: { email: 'Email', whatsapp: 'WhatsApp', sms: 'SMS' },
    abrindo: { email: 'Opens your email app', whatsapp: 'Opens WhatsApp', sms: 'Opens your messaging app' },
    semContato: 'No contact',
    semEmail: 'No email on file',
    semTelefone: 'No phone on file',
    escreverNoEnspace: 'Write in ENSPACE',
    escreverNoEnspaceComItem: ref => `Sent from the ${ref} mailbox and kept in the item history`,
    escreverNoEnspaceSemItem: 'Sent from a workspace mailbox',
    abrirNoApp: 'Open in my email app',
    abrirNoAppDica: 'Outlook, Gmail or the computer default app',
    outrasFormasDeEmail: 'Other ways to send email',
    telefoneInvalido: 'Invalid phone',
    abrirNoAppComCopia: 'The item mailbox goes in Cc: the reply comes back when the person replies to all.',
  },
  inicio: {
    saudacao: nome => `Good morning, ${nome}!`,
    subtitulo: 'Ready for a productive day? Let\'s work together!',
    atalhos: 'Shortcuts',
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
    dicaDoQuadro: 'Right-click a card to contact.',
  },
  item: {
    contatoRapido: 'Quick contact',
    paraQuem: 'To whom',
    ajudaComEnspace: 'WhatsApp and SMS open the app on your computer or phone. Email goes out through ENSPACE or your app.',
    ajudaSemEnspace: 'Opens your app with the recipient filled in. ENSPACE does not send the message.',
    semTelefoneAviso: 'No phone: WhatsApp and SMS unavailable.',
    semEmailAviso: 'No email: the email shortcut is unavailable.',
    cadastrarTelefone: 'Add phone',
    telefoneInvalidoAviso: 'Invalid phone: WhatsApp and SMS unavailable.',
    corrigirTelefone: 'Fix phone',
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
    },
    sairSemSalvar: 'Leave without saving',
    salvar: 'Save',
    copiarEndereco: 'Copy the mailbox address',
    escreverEmail: 'Write email',
    recebidos: 'Received',
    enviados: 'Sent',
    para: quem => `To: ${quem}`,
    enviadoPor: nome => `Sent by ${nome} through ENSPACE`,
    responder: 'Reply',
    nenhumEmail: 'No emails found.',
    semTarefas: 'No tasks on this item',
    foraDoEscopo: 'Folder outside this prototype',
    foraDoEscopoDica: 'This folder exists in develop and does not change with the proposal.',
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
    abrirNovaAbaMaquete: 'In the product, this opens the form in a new tab',
    enviarLinkPor: 'Send the link by',
    assuntoDoLink: nome => `Form: ${nome}`,
    mensagemDoLink: (nome, url) => `To fill in the form "${nome}", use this link: ${url}`,
    linkCopiado: 'Link copied',
    linkDeFormulario: 'Public form link',
    copiarLinkPublico: 'Copy a public form link',
    nenhumPublico: 'No public forms',
    nenhumPublicoDica: 'A form shows up here when its visibility is Public.',
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
    semResponsavelDica: 'Assign someone to notify them.',
    abrir: 'Open task',
    avisar: nome => `Notify ${nome}`,
    avisarSemResponsavel: 'Notify assignee',
    avisarResponsaveisPor: 'Notify assignees by',
    selecionadas: n => `${n} ${n === 1 ? 'task' : 'tasks'} selected`,
    ajudaDoLote: 'Email opens 1 draft to everyone. WhatsApp and SMS open 1 chat per assignee.',
    foraDoLote: n => `${n} ${n === 1 ? 'task' : 'tasks'} without assignee left out.`,
    loteTitulo: canal => `Notify by ${canal}`,
    loteDescricao: 'One chat per person. Open one at a time.',
    abrirConversa: 'Open chat',
    aberta: 'Opened',
    dicaDoQuadro: 'Click a card to open the task. Right-click to notify the assignee.',
    membroSemTelefone: 'WhatsApp and SMS need the member phone. The profile screen does not have this field yet.',
    loteProgresso: (i, n) => `Chat ${i} of ${n}`,
    proxima: 'Next',
    fechar: 'Close',
    loteConcluido: 'All chats opened.',
    foraSemTelefone: nomes => `Left out, no phone: ${nomes}.`,
    assuntoDoAviso: (tarefa, prazo) => prazo ? `Task: ${tarefa} (due ${prazo})` : `Task: ${tarefa}`,
    mensagemDoAviso: (nome, tarefa, prazo) => `Hi, ${nome}. Reminder about the task "${tarefa}"${prazo ? `, due ${prazo}` : ''}.`,
    assuntoDoLote: n => `${n} pending tasks`,
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
    fonte: { outlook: 'Outlook meeting', item: 'Item date', tarefa: 'Task due date' },
    intervalo: (de, ate) => `${de} to ${ate}`,
    enviarLembrete: 'Send reminder',
    emailParaTodos: n => `Email everyone (${n})`,
    ajudaComTelefone: 'Date, time and subject are prefilled. WhatsApp and SMS open 1 chat per participant.',
    ajudaSemTelefone: 'Date, time and subject are prefilled. These participants have no phone in ENSPACE: only email works.',
    assuntoDoLembrete: (evento, quando) => `Reminder: ${evento} (${quando})`,
    mensagemDoLembrete: (nome, evento, quando) => `Hi, ${nome}. Reminder: ${evento}, ${quando}.`,
  },
  emails: {
    titulo: 'Emails',
    recebidos: 'Received',
    enviados: 'Sent',
    pesquisar: 'Search emails',
    vinculo: { todos: 'All', com: 'With item', sem: 'No item' },
    de: 'From',
    para: 'To',
    assunto: 'Subject',
    item: 'Item',
    caixa: 'Mailbox',
    enviadoPor: 'Sent by',
    data: 'Date',
    semItem: 'No item',
    naoLido: 'Unread',
    vazioTitulo: 'No emails here',
    vazioDescricao: 'Change the filter or write a new email.',
    vinculadoTitulo: 'Email linked',
    vinculadoDescricao: ref => `It shows in the Mail Box tab of ${ref}.`,
    vincularDepois: 'The email shows in the Mail Box tab of the item.',
    encaminhar: 'Forward',
    vincular: 'Link',
    sugestoesPeloRemetente: 'Suggestions from the sender',
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
    opcional: '(optional)',
    vincularDica: 'The email goes into the item history. The link keeps the item, not its name: renaming the item breaks nothing.',
    buscarItem: 'Search by name, reference or ID',
    vincularAjuda: 'Select an item to link this email. The link is saved in ENSPACE.',
    trocar: 'Change',
    desvincular: 'Remove link',
    cancelar: 'Cancel',
    vinculadoPeloItem: 'Linked because you started from the item. You can change or remove it.',
    vinculadoPelaTarefa: 'Linked to the task item. You can change or remove it.',
    semMailBox: categoria => `${categoria} has no Mail Box folder: the email does not show on the item screen.`,
    recentes: 'Recently updated',
    resultados: (m, n) => `${m} of ${n} ${n === 1 ? 'item' : 'items'}`,
    sobra: n => `${n} more ${n === 1 ? 'item' : 'items'}. Keep typing to narrow down.`,
    soPermitidos: 'Only items you can see are listed.',
    nenhumItem: q => `No items with "${q}"`,
    nenhumItemDica: 'Search by reference (CTR-00231), ID or contact name.',
    caixaDoItem: ref => `Item ${ref} mailbox`,
    respostasVoltamParaOItem: 'Replies come back to the Mail Box tab of the item.',
    respostasVaoParaCaixa: 'Replies arrive in this workspace mailbox.',
    semCaixaTitulo: 'No mailbox to send from',
    semCaixaDescricao: 'Without a linked item, the email goes out from a workspace mailbox, and this workspace has none. Link an item or ask an admin to create a mailbox.',
    vincularUmItem: 'Link an item',
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
    erroDe: 'Choose where the email goes out from.',
    falhaTitulo: 'Email not sent',
    falhaDescricao: 'The email server did not respond. The draft stays open so you can try again.',
    semAssunto: '(no subject)',
    enviadoTitulo: 'Email sent',
    enviadoComItem: ref => `Linked to ${ref}. Replies come back to the item.`,
    enviadoSemItem: de => `Sent from ${de}, no item linked.`,
    verNoItem: 'See on item',
    verEmEmails: 'See in Emails',
    descartado: 'Draft discarded',
    desfazer: 'Undo',
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
    atalhos: 'Communication shortcuts',
    atalhosDescricao: 'Email, WhatsApp and SMS buttons on screens, and the public form link.',
    emailDoEnspace: 'ENSPACE email on every screen',
    emailDoEnspaceDescricao: 'Write email from any screen, linked to an item, and the Emails area in the menu.',
    canais: 'Channels',
    canaisAjuda: 'A channel turned off disappears from every screen.',
    ondeAparecem: 'Where they show',
    lugares: { inicio: 'Home', item: 'Item screen', itens: 'Item list and board', tarefas: 'Tasks', agenda: 'Schedule', formularios: 'Public form link' },
    textoInicial: 'Prefill subject and message',
    textoInicialAjuda: 'The text comes from each category settings. The sender can change it before sending.',
    copiaParaOItem: 'Cc the item mailbox',
    copiaParaOItemAjuda: 'On the email opened in the person app. Replies come back to the Mail Box tab of the item.',
    irParaCategorias: 'Choose the contact of each category',
    caixaSemItem: 'Mailbox for email without item',
    caixaSemItemAjuda: 'With a linked item, the email goes out from the item mailbox.',
    nenhumaCaixa: 'No mailbox created',
    nenhumaCaixaDica: 'Create one in Settings › Emails › Mailboxes. Without one, only emails linked to an item go out.',
    preRequisito: (n, total) => `Mail Box folder: ${n} of ${total} categories have it`,
    semMailBox: 'Without the Mail Box folder, the linked email does not show on the item screen.',
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
      atalhos: 'Communication shortcuts',
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
      atalhos: 'Who the item contact is and the text the shortcuts open.',
    },
    moduloDesligado: 'Module off',
    moduloDesligadoTitulo: 'The Communication shortcuts module is off',
    moduloDesligadoDica: 'These settings are kept and apply once someone turns the module on in System › Modules.',
    quemEhContato: 'Who the contact is',
    quemEhContatoDica: 'Each contact shows in the item Quick contact. Choose which fields hold the name, email and phone.',
    rotulo: 'Contact name on screen',
    removerContato: 'Remove contact',
    campoNome: 'Name',
    campoEmail: 'Email',
    campoTelefone: 'Phone',
    nenhum: 'None',
    tipoEmail: 'Email field',
    tipoMascara: 'Masked text',
    emailDoRequisitante: 'Requester Email',
    campoPadrao: 'Default field of every category',
    novoContato: 'New contact',
    adicionarContato: 'Add contact',
    semCampoDeTelefone: 'This category has no phone field. For WhatsApp and SMS, create a Masked Text field.',
    textoInicial: 'Starting text',
    textoInicialDica: 'The app opens with this text. The sender can change it before sending.',
    textoInicialDesligado: 'Prefill is off in System › Modules: the app opens with the recipient only.',
    assuntoDoEmail: 'Email subject',
    mensagemDoApp: 'WhatsApp and SMS message',
    inserir: 'Insert:',
    previa: 'Preview: what each shortcut opens',
    semNome: 'No name',
    salvo: 'Shortcuts saved',
  },
  andaime: {
    prototipo: 'Prototype',
    irPara: 'Go to',
    quemUsa: 'Who uses it',
    quemConfigura: 'Who sets it up',
    listaDeItens: 'Item list (Contracts)',
    umItem: ref => `Item ${ref}`,
    mailBox: ref => `${ref} Mail Box`,
    modulos: 'System › Modules',
    atalhosDaCategoria: 'Contracts category shortcuts',
    formularios: 'Requests forms',
    cenario: 'Scenario',
    cenarios: { normal: 'Normal', semCaixa: 'No mailbox', falha: 'Sending fails' },
    mostrarOQueMuda: 'Show what changes',
    porTras: 'Behind it',
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
  },
  atalho: {
    canal: { email: 'Correo', whatsapp: 'WhatsApp', sms: 'SMS' },
    abrindo: { email: 'Abre tu app de correo', whatsapp: 'Abre WhatsApp', sms: 'Abre la app de mensajes' },
    semContato: 'Sin contacto',
    semEmail: 'Sin correo registrado',
    semTelefone: 'Sin teléfono registrado',
    escreverNoEnspace: 'Escribir en ENSPACE',
    escreverNoEnspaceComItem: ref => `Sale del buzón de ${ref} y queda en el historial del ítem`,
    escreverNoEnspaceSemItem: 'Sale de un buzón del workspace',
    abrirNoApp: 'Abrir en mi app de correo',
    abrirNoAppDica: 'Outlook, Gmail o la app predeterminada del equipo',
    outrasFormasDeEmail: 'Otras formas de enviar correo',
    telefoneInvalido: 'Teléfono inválido',
    abrirNoAppComCopia: 'El buzón del ítem va en copia: la respuesta vuelve cuando la persona responde a todos.',
  },
  inicio: {
    saudacao: nome => `¡Buenos días, ${nome}!`,
    subtitulo: '¿Listo para un día productivo? ¡Trabajemos juntos!',
    atalhos: 'Atajos',
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
    dicaDoQuadro: 'Haz clic derecho en una tarjeta para contactar.',
  },
  item: {
    contatoRapido: 'Contacto rápido',
    paraQuem: 'Para quién',
    ajudaComEnspace: 'WhatsApp y SMS abren la app de tu computadora o celular. El correo sale por ENSPACE o por tu app.',
    ajudaSemEnspace: 'Abre tu app con el destinatario completo. ENSPACE no envía el mensaje.',
    semTelefoneAviso: 'Sin teléfono: WhatsApp y SMS no disponibles.',
    semEmailAviso: 'Sin correo: el atajo de correo no está disponible.',
    cadastrarTelefone: 'Registrar teléfono',
    telefoneInvalidoAviso: 'Teléfono inválido: WhatsApp y SMS no disponibles.',
    corrigirTelefone: 'Corregir teléfono',
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
    },
    sairSemSalvar: 'Salir sin guardar',
    salvar: 'Guardar',
    copiarEndereco: 'Copiar la dirección del buzón',
    escreverEmail: 'Escribir correo',
    recebidos: 'Recibidos',
    enviados: 'Enviados',
    para: quem => `Para: ${quem}`,
    enviadoPor: nome => `Enviado por ${nome} desde ENSPACE`,
    responder: 'Responder',
    nenhumEmail: 'Ningún correo encontrado.',
    semTarefas: 'Ninguna tarea en este ítem',
    foraDoEscopo: 'Carpeta fuera de este prototipo',
    foraDoEscopoDica: 'Esta carpeta existe en develop y no cambia con la propuesta.',
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
    abrirNovaAbaMaquete: 'En el producto, abre el formulario en una pestaña nueva',
    enviarLinkPor: 'Enviar el enlace por',
    assuntoDoLink: nome => `Formulario: ${nome}`,
    mensagemDoLink: (nome, url) => `Para completar el formulario "${nome}", usa este enlace: ${url}`,
    linkCopiado: 'Enlace copiado',
    linkDeFormulario: 'Enlace de formulario público',
    copiarLinkPublico: 'Copiar enlace de formulario público',
    nenhumPublico: 'Ningún formulario público',
    nenhumPublicoDica: 'Un formulario aparece aquí cuando su visibilidad es Pública.',
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
    semResponsavelDica: 'Asigna un responsable para avisar a alguien.',
    abrir: 'Abrir tarea',
    avisar: nome => `Avisar a ${nome}`,
    avisarSemResponsavel: 'Avisar al responsable',
    avisarResponsaveisPor: 'Avisar a los responsables por',
    selecionadas: n => `${n} ${n === 1 ? 'tarea seleccionada' : 'tareas seleccionadas'}`,
    ajudaDoLote: 'El correo abre 1 borrador para todos. WhatsApp y SMS abren 1 conversación por responsable.',
    foraDoLote: n => `${n} ${n === 1 ? 'tarea sin responsable queda fuera' : 'tareas sin responsable quedan fuera'}.`,
    loteTitulo: canal => `Avisar por ${canal}`,
    loteDescricao: 'Una conversación por persona. Abre una por vez.',
    abrirConversa: 'Abrir conversación',
    aberta: 'Abierta',
    dicaDoQuadro: 'Haz clic en la tarjeta para abrir la tarea. Con el botón derecho, avisa al responsable.',
    membroSemTelefone: 'WhatsApp y SMS necesitan el teléfono del miembro. La pantalla de perfil aún no tiene ese campo.',
    loteProgresso: (i, n) => `Conversación ${i} de ${n}`,
    proxima: 'Siguiente',
    fechar: 'Cerrar',
    loteConcluido: 'Todas las conversaciones abiertas.',
    foraSemTelefone: nomes => `Quedan fuera, sin teléfono: ${nomes}.`,
    assuntoDoAviso: (tarefa, prazo) => prazo ? `Tarea: ${tarefa} (plazo ${prazo})` : `Tarea: ${tarefa}`,
    mensagemDoAviso: (nome, tarefa, prazo) => `Hola, ${nome}. Recordatorio de la tarea "${tarefa}"${prazo ? `, plazo ${prazo}` : ''}.`,
    assuntoDoLote: n => `${n} tareas pendientes`,
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
    fonte: { outlook: 'Reunión de Outlook', item: 'Fecha de un ítem', tarefa: 'Plazo de una tarea' },
    intervalo: (de, ate) => `${de} a ${ate}`,
    enviarLembrete: 'Enviar recordatorio',
    emailParaTodos: n => `Correo para todos (${n})`,
    ajudaComTelefone: 'Fecha, hora y asunto van completos. WhatsApp y SMS abren 1 conversación por participante.',
    ajudaSemTelefone: 'Fecha, hora y asunto van completos. Estos participantes no tienen teléfono en ENSPACE: solo funciona el correo.',
    assuntoDoLembrete: (evento, quando) => `Recordatorio: ${evento} (${quando})`,
    mensagemDoLembrete: (nome, evento, quando) => `Hola, ${nome}. Recordatorio: ${evento}, ${quando}.`,
  },
  emails: {
    titulo: 'Correos',
    recebidos: 'Recibidos',
    enviados: 'Enviados',
    pesquisar: 'Buscar correos',
    vinculo: { todos: 'Todos', com: 'Con ítem', sem: 'Sin ítem' },
    de: 'De',
    para: 'Para',
    assunto: 'Asunto',
    item: 'Ítem',
    caixa: 'Buzón',
    enviadoPor: 'Enviado por',
    data: 'Fecha',
    semItem: 'Sin ítem',
    naoLido: 'No leído',
    vazioTitulo: 'Ningún correo aquí',
    vazioDescricao: 'Cambia el filtro o escribe un correo nuevo.',
    vinculadoTitulo: 'Correo vinculado',
    vinculadoDescricao: ref => `Aparece en la pestaña Mail Box de ${ref}.`,
    vincularDepois: 'El correo pasa a aparecer en la pestaña Mail Box del ítem.',
    encaminhar: 'Reenviar',
    vincular: 'Vincular',
    sugestoesPeloRemetente: 'Sugerencias por el remitente',
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
    opcional: '(opcional)',
    vincularDica: 'El correo entra en el historial del ítem. El vínculo guarda el ítem, no el nombre: renombrar el ítem no rompe nada.',
    buscarItem: 'Buscar por nombre, referencia o ID',
    vincularAjuda: 'Selecciona un ítem para vincular este correo. El vínculo queda guardado en ENSPACE.',
    trocar: 'Cambiar',
    desvincular: 'Quitar vínculo',
    cancelar: 'Cancelar',
    vinculadoPeloItem: 'Vinculado porque empezaste en el ítem. Puedes cambiarlo o quitarlo.',
    vinculadoPelaTarefa: 'Vinculado al ítem de la tarea. Puedes cambiarlo o quitarlo.',
    semMailBox: categoria => `${categoria} no tiene la carpeta Mail Box: el correo no aparece en la pantalla del ítem.`,
    recentes: 'Actualizados recientemente',
    resultados: (m, n) => `${m} de ${n} ${n === 1 ? 'ítem' : 'ítems'}`,
    sobra: n => `${n} ${n === 1 ? 'ítem más' : 'ítems más'}. Sigue escribiendo para encontrarlo.`,
    soPermitidos: 'Solo aparecen ítems que puedes ver.',
    nenhumItem: q => `Ningún ítem con "${q}"`,
    nenhumItemDica: 'Busca por referencia (CTR-00231), ID o nombre del contacto.',
    caixaDoItem: ref => `Buzón del ítem ${ref}`,
    respostasVoltamParaOItem: 'Las respuestas vuelven a la pestaña Mail Box del ítem.',
    respostasVaoParaCaixa: 'Las respuestas llegan a este buzón del workspace.',
    semCaixaTitulo: 'Sin buzón para enviar',
    semCaixaDescricao: 'Sin ítem vinculado, el correo sale de un buzón del workspace, y este workspace no tiene ninguno. Vincula un ítem o pide a un administrador que cree un buzón.',
    vincularUmItem: 'Vincular un ítem',
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
    erroDe: 'Elige desde dónde sale el correo.',
    falhaTitulo: 'Correo no enviado',
    falhaDescricao: 'El servidor de correo no respondió. El borrador sigue abierto para intentar de nuevo.',
    semAssunto: '(sin asunto)',
    enviadoTitulo: 'Correo enviado',
    enviadoComItem: ref => `Vinculado a ${ref}. Las respuestas vuelven al ítem.`,
    enviadoSemItem: de => `Salió de ${de}, sin ítem vinculado.`,
    verNoItem: 'Ver en el ítem',
    verEmEmails: 'Ver en Correos',
    descartado: 'Borrador descartado',
    desfazer: 'Deshacer',
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
    atalhos: 'Atajos de comunicación',
    atalhosDescricao: 'Botones de correo, WhatsApp y SMS en las pantallas, y el enlace de los formularios públicos.',
    emailDoEnspace: 'Correo de ENSPACE en todas las pantallas',
    emailDoEnspaceDescricao: 'Escribir correo desde cualquier pantalla, con vínculo a ítem, y el área Correos en el menú.',
    canais: 'Canales',
    canaisAjuda: 'Un canal apagado desaparece de todas las pantallas.',
    ondeAparecem: 'Dónde aparecen',
    lugares: { inicio: 'Inicio', item: 'Pantalla del ítem', itens: 'Lista y tablero de ítems', tarefas: 'Tareas', agenda: 'Agenda', formularios: 'Enlace de formulario público' },
    textoInicial: 'Completar asunto y mensaje',
    textoInicialAjuda: 'El texto viene de la configuración de cada categoría. Quien envía puede cambiarlo antes.',
    copiaParaOItem: 'Poner el buzón del ítem en copia',
    copiaParaOItemAjuda: 'En el correo abierto en la app de la persona. La respuesta vuelve a la pestaña Mail Box del ítem.',
    irParaCategorias: 'Elegir el contacto de cada categoría',
    caixaSemItem: 'Buzón para correo sin ítem',
    caixaSemItemAjuda: 'Con ítem vinculado, el correo sale del buzón del ítem.',
    nenhumaCaixa: 'Ningún buzón creado',
    nenhumaCaixaDica: 'Crea uno en Configuración › Correos › Buzones de Correo. Sin buzón, solo sale correo vinculado a un ítem.',
    preRequisito: (n, total) => `Carpeta Mail Box: ${n} de ${total} categorías la tienen`,
    semMailBox: 'Sin la carpeta Mail Box, el correo vinculado no aparece en la pantalla del ítem.',
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
      atalhos: 'Atajos de comunicación',
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
      atalhos: 'Quién es el contacto del ítem y el texto que abren los atajos.',
    },
    moduloDesligado: 'Módulo apagado',
    moduloDesligadoTitulo: 'El módulo Atajos de comunicación está apagado',
    moduloDesligadoDica: 'La configuración queda guardada y vale cuando alguien encienda el módulo en Sistema › Módulos.',
    quemEhContato: 'Quién es el contacto',
    quemEhContatoDica: 'Cada contacto aparece en el Contacto rápido del ítem. Elige de qué campos vienen el nombre, el correo y el teléfono.',
    rotulo: 'Nombre del contacto en pantalla',
    removerContato: 'Quitar contacto',
    campoNome: 'Nombre',
    campoEmail: 'Correo',
    campoTelefone: 'Teléfono',
    nenhum: 'Ninguno',
    tipoEmail: 'Campo Correo',
    tipoMascara: 'Texto con Máscara',
    emailDoRequisitante: 'Correo del Solicitante',
    campoPadrao: 'Campo estándar de toda categoría',
    novoContato: 'Nuevo contacto',
    adicionarContato: 'Agregar contacto',
    semCampoDeTelefone: 'Esta categoría no tiene campo de teléfono. Para WhatsApp y SMS, crea un campo Texto con Máscara.',
    textoInicial: 'Texto inicial',
    textoInicialDica: 'La app abre con este texto. Quien envía puede cambiarlo antes.',
    textoInicialDesligado: 'El completado está apagado en Sistema › Módulos: la app abre solo con el destinatario.',
    assuntoDoEmail: 'Asunto del correo',
    mensagemDoApp: 'Mensaje de WhatsApp y SMS',
    inserir: 'Insertar:',
    previa: 'Vista previa: lo que abre cada atajo',
    semNome: 'Sin nombre',
    salvo: 'Atajos guardados',
  },
  andaime: {
    prototipo: 'Prototipo',
    irPara: 'Ir a',
    quemUsa: 'Quien usa',
    quemConfigura: 'Quien configura',
    listaDeItens: 'Lista de ítems (Contratos)',
    umItem: ref => `Ítem ${ref}`,
    mailBox: ref => `Mail Box de ${ref}`,
    modulos: 'Sistema › Módulos',
    atalhosDaCategoria: 'Atajos de la categoría Contratos',
    formularios: 'Formularios de Solicitudes',
    cenario: 'Escenario',
    cenarios: { normal: 'Normal', semCaixa: 'Sin buzón de correo', falha: 'El envío falla' },
    mostrarOQueMuda: 'Mostrar lo que cambia',
    porTras: 'Detrás',
  },
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': ptBR, en, es }
