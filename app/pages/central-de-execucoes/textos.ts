/**
 * A copy do protótipo "Central de execuções do Spaceflow" nos três idiomas do ENSPACE.
 *
 * - `casca`, `trilha`, `fluxos` (menos `uso`), `detalhe.abas` (menos `cadeia`), os rótulos dos campos
 *   do detalhe e `itemTela.abas` (menos `fluxos`): cópia do develop em 24/10/2026. Não é proposta;
 * - o resto é texto novo, escrito para ir ao produto, em registro formal.
 *
 * Nomes de fluxo, categoria e item são dado do workspace e ficam em português nos três idiomas.
 * Sem travessão em nada que aparece na tela (regra 33).
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Acao, Categoria, CausaId, MotivoDaParada, StatusDaExecucao } from './mocks'

export type GrupoDeStatus = 'rodando' | 'esperando' | 'concluida' | 'erro' | 'parada'
export type TipoDeDisparo = 'pessoa' | 'fluxo' | 'agendamento' | 'webhook' | 'email'
export type EstadoDoProblema = 'revisar' | 'resolvido' | 'ignorado' | 'adiado'
type Causa = CausaId | 'cadeia'

const plural = (n: number, um: string, varios: string) => (n === 1 ? um : varios)

function duracao(ms: number, u: { ms: string, s: string, min: string, h: string, d: string }) {
  if (ms < 1000) return `${Math.max(1, Math.round(ms))} ${u.ms}`
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s} ${u.s}`
  const min = Math.round(s / 60)
  if (min < 60) return `${min} ${u.min}`
  const h = Math.floor(min / 60)
  if (h < 24) return min % 60 ? `${h} ${u.h} ${min % 60} ${u.min}` : `${h} ${u.h}`
  const d = Math.floor(h / 24)
  return h % 24 ? `${d} ${u.d} ${h % 24} ${u.h}` : `${d} ${u.d}`
}

/* ================================================================== *
 * Português                                                           *
 * ================================================================== */

const pt = {
  locale: 'pt-BR',
  casca: {
    menuLateral: 'Menu do workspace', buscar: 'Buscar...', membro: 'Membro', configuracoes: 'Configurações',
    ajuda: 'Ajuda', trilha: 'Trilha', recolherMenu: 'Recolher o menu', abrirMenu: 'Abrir o menu',
    voltar: 'Voltar', avancar: 'Avançar', recarregar: 'Recarregar', suporte: 'Suporte',
    notificacoes: 'Notificações', idioma: 'Idioma', tema: 'Tema', conta: 'Sua conta',
    itens: {
      inicio: 'Início', spaceflows: 'Spaceflows', categorias: 'Categorias', tarefas: 'Tarefas',
      agenda: 'Agenda', knowledge: 'Knowledge', visaoGeral: 'Visão Geral', sistema: 'Sistema',
      estrutura: 'Estrutura', gestaoDeMembros: 'Gestão de Membros', interface: 'Interface',
      emails: 'E-mails', integracoes: 'Integrações', agentesDeIa: 'Agentes de IA', logs: 'Logs',
      releases: 'Releases', documentacao: 'Documentação',
    } as Record<string, string>,
  },
  trilha: { spaceflows: 'Spaceflows', categorias: 'Categorias', executions: 'executions' },

  abas: { fluxos: 'Fluxos', visao: 'Visão geral', execucoes: 'Execuções', mapa: 'Mapa da operação' },

  fluxos: {
    buscar: 'Buscar workflows...',
    encontrados: (n: number) => `${n} ${plural(n, 'workflow encontrado', 'workflows encontrados')}`,
    semDescricao: 'Nenhuma descrição informada',
    abrir: 'Abrir',
    executar: 'Executar',
    uso: (n: number) => `${n} ${plural(n, 'execução', 'execuções')} em 7 dias`,
    erros: (n: number) => `${n} com erro`,
    foraDoEscopo: 'A tela do fluxo fica como está no develop.',
    abrirEditor: 'Abrir Editor', executarWorkflow: 'Executar Workflow', ativo: 'Ativo', abaExecucoes: 'Execuções', abaLogs: 'Logs',
    semFluxos: 'Nenhum fluxo nesta operação que você possa ver.',
  },

  periodo: {
    rotulo: 'Período',
    opcoes: { h24: 'Últimas 24 horas', d7: 'Últimos 7 dias' },
    comparado: { h24: 'Comparado às 24 horas anteriores', d7: 'Comparado aos 7 dias anteriores' },
    atualizado: (hora: string) => `Atualizado às ${hora}`,
    atualizar: 'Atualizar',
  },

  kpi: {
    rodando: 'Rodando agora',
    esperando: 'Esperando',
    erro: 'Com erro',
    concluidas: 'Concluídas',
    paradas: 'Paradas pela plataforma',
    agora: 'Neste momento',
    esperandoPartes: (pessoa: number, fila: number) => `${pessoa} por pessoa, ${fila} na fila`,
    delta: (n: number) => (n === 0 ? 'Igual ao período anterior' : n > 0 ? `${n} a mais que no período anterior` : `${-n} a menos que no período anterior`),
    total: (n: number) => `${n} ${plural(n, 'execução', 'execuções')} no período`,
    abrirLista: 'Abrir a lista com este filtro',
  },

  atencao: {
    titulo: 'Precisa de atenção',
    descricao: 'Fluxos com falha ou parados pela plataforma no período. Uma linha por fluxo.',
    colunas: { fluxo: 'Fluxo', problema: 'Problema', ultimoItem: 'Último item', dono: 'Dono', estado: 'Situação' },
    estados: { revisar: 'Precisa de revisão', resolvido: 'Resolvido', ignorado: 'Ignorado', adiado: 'Adiado' } as Record<EstadoDoProblema, string>,
    ocorrencias: (n: number, desde: string) => `${n} ${plural(n, 'vez', 'vezes')} desde ${desde}`,
    verFalhas: 'Ver falhas',
    reprocessar: 'Reprocessar falhas',
    verCadeia: 'Ver cadeia',
    mostrarTratados: (n: number) => `Mostrar ${n} ${plural(n, 'tratado', 'tratados')}`,
    esconderTratados: 'Esconder os tratados',
    vazio: 'Nenhum fluxo com problema neste período',
    vazioDesc: 'Quando um fluxo falhar ou for parado pela plataforma, ele aparece aqui.',
    reabre: 'Volta para "Precisa de revisão" se falhar de novo.',
    modal: {
      titulo: (n: number) => `Reprocessar ${n} ${plural(n, 'execução', 'execuções')}`,
      descricao: (fluxo: string) => `As execuções com erro do fluxo ${fluxo} rodam de novo a partir do nó que falhou.`,
      aviso: 'Se o nó gravou algo antes de falhar, a gravação pode se repetir. Confira antes os itens afetados.',
      itens: 'Itens afetados',
      confirmar: 'Reprocessar',
      cancelar: 'Cancelar',
      feito: (n: number) => `${n} ${plural(n, 'execução reprocessada', 'execuções reprocessadas')}`,
      feitoDesc: 'Elas aparecem na lista como Em andamento.',
    },
  },

  causas: {
    credencial: { titulo: 'A credencial do assinador expirou', detalhe: 'O serviço respondeu 401 (não autorizado).', acao: 'Atualize a credencial em Integrações e reprocesse as falhas.' },
    tempo: { titulo: 'O portal do fornecedor não respondeu', detalhe: 'Sem resposta em 30 segundos.', acao: 'Reprocesse. Se a falha continuar, fale com o fornecedor.' },
    ia: { titulo: 'A IA não encontrou o valor no documento', detalhe: 'O campo Valor total ficou vazio.', acao: 'Confira o documento enviado e reprocesse.' },
    email: { titulo: 'O e-mail do cliente é inválido', detalhe: 'O servidor recusou o endereço.', acao: 'Corrija o e-mail no item e reprocesse.' },
    permissao: { titulo: 'O sistema de acessos recusou o pedido', detalhe: 'O serviço respondeu 403 (sem permissão).', acao: 'Peça ao TI a permissão da conta do fluxo e reprocesse.' },
    cadeia: { titulo: 'Repetição sem fim interrompida', detalhe: 'A cadeia passou de 10 disparos encadeados.', acao: 'Abra a cadeia para ver qual fluxo repetiu e ajuste a condição dele.' },
  } as Record<Causa, { titulo: string, detalhe: string, acao: string }>,

  operacoes: {
    titulo: 'Saúde das operações',
    descricao: 'Cada operação junta os fluxos que trabalham juntos.',
    fluxos: (n: number) => `${n} ${plural(n, 'fluxo', 'fluxos')}`,
    execucoes: (n: number) => `${n} ${plural(n, 'execução', 'execuções')}`,
    problemas: (n: number) => `${n} ${plural(n, 'fluxo precisa', 'fluxos precisam')} de atenção`,
    semProblemas: 'Nenhum fluxo precisa de atenção',
    dono: (nome: string) => `Dono: ${nome}`,
    selo: { ok: 'Saudável', atencao: 'Atenção', falha: 'Com falhas' },
    verMapa: 'Ver no mapa',
  },

  graficos: {
    porDia: 'Execuções por dia',
    porHora: 'Execuções por hora',
    maisFalhas: 'Fluxos com mais falhas',
    nenhumaFalha: 'Nenhuma falha no período.',
    concluidas: 'Concluídas',
    erro: 'Com erro',
    outras: 'Outras',
    valor: (rotulo: string, n: number) => `${rotulo}: ${n}`,
  },

  grupos: { rodando: 'Rodando', esperando: 'Esperando', concluida: 'Concluída', erro: 'Com erro', parada: 'Parada pela plataforma' } as Record<GrupoDeStatus, string>,
  status: {
    completed: 'Completo', working: 'Em andamento', error: 'Erro', deleted: 'Excluída',
    queued: 'Na fila', skipped: 'Ignorada', held: 'Retida', stopped: 'Interrompida',
  } as Record<StatusDaExecucao, string>,
  esperando: {
    tarefa: (quem?: string) => (quem ? `Esperando tarefa de ${quem}` : 'Esperando tarefa'),
    atraso: 'Esperando o Atraso',
  },
  motivos: {
    cadeia: 'A cadeia passou de 10 disparos encadeados',
    limitePorMinuto: 'Limite de execuções por período',
  } as Record<MotivoDaParada, string>,

  evento: (c: Categoria, acao: Acao) => {
    const f = c.genero === 'f'
    const verbo = acao === 'create' ? (f ? 'criada' : 'criado') : acao === 'update' ? (f ? 'editada' : 'editado') : (f ? 'excluída' : 'excluído')
    return `${c.singular} ${verbo}`
  },
  noItem: (c: Categoria, ref: string) => `${c.genero === 'f' ? 'Na' : 'No'} ${c.singular.toLowerCase()} ${ref}`,
  nesteItem: 'Neste item',

  disparo: {
    tipos: { pessoa: 'Pessoa', fluxo: 'Outro fluxo', agendamento: 'Agendamento', webhook: 'Webhook', email: 'E-mail recebido' } as Record<TipoDeDisparo, string>,
    qualquer: 'Qualquer origem',
    porPessoa: (evento: string, pessoa: string) => `${evento} por ${pessoa}`,
    porFluxo: (fluxo: string) => `Fluxo ${fluxo}`,
    soEvento: (evento: string) => evento,
    manual: (pessoa: string) => `Execução manual de ${pessoa}`,
    agendamento: (r: string) => `Agendamento (${r})`,
    webhook: 'Webhook',
    email: 'E-mail recebido',
  },

  execucoes: {
    buscar: 'Buscar por item, fluxo ou título da execução',
    buscarHoje: 'Buscar execuções...',
    itensEncontrados: 'Itens encontrados',
    colunas: { execucao: 'Execução', fluxo: 'Fluxo', item: 'Item', status: 'Status', disparo: 'Disparada por', iniciada: 'Iniciada em', duracao: 'Duração', cadeia: 'Cadeia' },
    filtros: {
      status: 'Status', todas: 'Todas', fluxo: 'Fluxo', fluxoBuscar: 'Buscar fluxo...', todosOsFluxos: 'Todos os fluxos',
      fluxosEscolhidos: (n: number) => `${n} ${plural(n, 'fluxo', 'fluxos')}`,
      operacao: 'Operação', todasAsOperacoes: 'Todas as operações', disparo: 'Disparada por',
      soOrigem: 'Só a origem de cada cadeia', limpar: 'Limpar filtros',
    },
    visoes: {
      rotulo: 'Visão salva',
      todas: 'Todas as execuções',
      falhasContratos: 'Falhas da Gestão de contratos',
      esperandoPessoa: 'Esperando pessoa',
    },
    vazio: 'Nenhuma execução encontrada',
    vazioFiltro: 'Nenhuma execução com estes filtros',
    verDetalhes: 'Ver Detalhes',
    abrirExecucao: 'Abrir Execução',
    abrirItem: 'Abrir item',
    reprocessar: 'Reprocessar',
    mostrando: (a: number, b: number, n: number) => `Mostrando ${a} a ${b} de ${n} resultados`,
    acoes: 'Ações',
    cadeiaOrigem: (n: number) => (n > 1 ? `Origem de ${n} execuções` : 'Sem outras execuções'),
    cadeiaPasso: (k: number) => `${k}º passo`,
    cadeiaComErro: (n: number) => `${n} com erro na cadeia`,
    semItem: 'Sem item',
  },

  busca: {
    passou: (fluxos: number, execs: number) => `Passou por ${fluxos} ${plural(fluxos, 'fluxo', 'fluxos')} em ${execs} ${plural(execs, 'execução', 'execuções')}`,
    partes: (partes: string[]) => partes.join(', '),
    comCadeia: 'Incluir os itens criados pela cadeia',
    soDireto: 'Sem a cadeia, aparecem só as execuções que rodaram direto neste item.',
    verJornada: 'Ver jornada no mapa',
    abrirItem: 'Abrir item',
    limpar: 'Tirar o filtro do item',
    contagem: (n: number, g: GrupoDeStatus) => `${n} ${({ rodando: 'rodando', esperando: 'esperando', concluida: plural(n, 'concluída', 'concluídas'), erro: 'com erro', parada: plural(n, 'parada pela plataforma', 'paradas pela plataforma') })[g]}`,
  },

  detalhe: {
    abas: { fluxo: 'Fluxo de Execução', cadeia: 'Cadeia', detalhes: 'Detalhes', comentarios: 'Comentários', logs: 'Logs' },
    nos: (a: number, b: number) => `${a}/${b} nós executados`,
    caminho: 'Caminho executado',
    naoExecutado: 'Não executado',
    parteDaCadeia: (passo: number, total: number, ref: string) => `Passo ${passo} de ${total} na cadeia do ${ref}`,
    origemDaCadeia: (total: number) => `Origem de uma cadeia de ${total} ${plural(total, 'execução', 'execuções')}`,
    causadaPor: 'Causada por',
    irParaOrigem: 'Ir para a origem',
    irParaAnterior: 'Ir para a anterior',
    verCadeia: 'Ver cadeia',
    falhouNo: (no: string) => `Falhou no nó ${no}`,
    oQueFazer: 'O que fazer',
    reprocessarNo: 'Reprocessar a partir deste nó',
    reprocessado: 'Execução reprocessada',
    reprocessadoDesc: 'Ela roda de novo a partir do nó que falhou.',
    campos: {
      referencia: 'Referência', versao: 'Versão', criado: 'Criado em', atualizado: 'Atualizado em', status: 'Status',
      titulo: 'Título', fluxo: 'Fluxo', item: 'Item', disparo: 'Disparada por', entrada: 'Entrada', saida: 'Saída',
      gravou: 'O que gravou', nada: 'Nada',
    },
    verDadosTecnicos: 'Ver dados técnicos',
    esconderDadosTecnicos: 'Esconder dados técnicos',
    foraDoEscopo: 'Fora do escopo deste protótipo',
    foraDoEscopoDesc: 'Comentários e Logs ficam como estão no develop.',
    voltarParaLista: 'Voltar para a lista',
    cadeia: {
      titulo: (execs: number, fluxos: number) => `${execs} ${plural(execs, 'execução', 'execuções')} em ${fluxos} ${plural(fluxos, 'fluxo', 'fluxos')}`,
      comecou: (evento: string, quando: string) => `Começou com ${evento.charAt(0).toLowerCase()}${evento.slice(1)} em ${quando}`,
      duracao: (d: string) => `Do primeiro ao último passo: ${d}`,
      estaExecucao: 'Esta execução',
      emAndamento: 'Em andamento',
      incompleta: 'A cadeia ainda tem execuções em andamento. Ela pode crescer.',
      interrompida: (fluxo: string, ref: string) => `A plataforma parou a cadeia: o fluxo ${fluxo} editou o ${ref} e disparou a si mesmo 10 vezes seguidas.`,
      verNoMapa: 'Ver no mapa',
      gravou: (o: string) => `Gravou ${o}`,
      semCadeia: {
        titulo: 'A cadeia depende de um dado que o Spaceflow ainda não grava',
        descricao: 'Para ligar esta execução à execução que a causou, o Spaceflow precisa gravar qual execução criou ou editou o item que disparou este fluxo.',
        hoje: 'Hoje dá para ver só o evento que disparou esta execução.',
      },
    },
  },

  itemTela: {
    abas: { visaoGeral: 'Visão Geral', comentarios: 'Comentários', logs: 'Logs de Auditoria', tarefas: 'Tarefas', fluxos: 'Fluxos', anexos: 'Anexos', emails: 'Emails Automáticos', mailbox: 'Mail Box', notas: 'Notas', campos: 'Campos' },
    painel: { identificacao: 'Identificação', id: 'ID', origem: 'Origem', status: 'Status', ativo: 'Ativo', solicitante: 'Criado por', historico: 'Histórico', criado: 'Criado em', atualizado: 'Atualizado em' },
    foraDoEscopo: 'As outras abas ficam como estão no develop.',
    rodape: { naoSalvas: 'Alterações não salvas', sair: 'Sair sem salvar', salvar: 'Salvar' },
    agora: {
      rotulo: 'Agora',
      erro: (fluxo: string, hora: string) => `Parado no fluxo ${fluxo}, que falhou às ${hora}.`,
      esperando: (fluxo: string, quem: string) => `Esperando a tarefa de ${quem} no fluxo ${fluxo}.`,
      rodando: (fluxo: string) => `Rodando no fluxo ${fluxo}.`,
      parada: (fluxo: string, hora: string) => `A plataforma parou a cadeia às ${hora}: o fluxo ${fluxo} repetiu sem fim.`,
      tudoCerto: (hora: string) => `Nenhum fluxo rodando. O último terminou às ${hora}.`,
      nenhum: 'Nenhum fluxo rodou neste item.',
    },
    numeros: { fluxos: 'Fluxos percorridos', execucoes: 'Execuções', erro: 'Com erro', esperando: 'Esperando', tempo: 'Do primeiro ao último passo' },
    escopo: { esteItem: 'Só este item', comCadeia: 'Com a cadeia' },
    escopoAjuda: 'Com a cadeia, entram os fluxos que rodaram nos itens que os fluxos deste item criaram (o andamento, a minuta, as parcelas).',
    cadeiaIniciada: (quando: string) => `Cadeia iniciada em ${quando}`,
    execucoesNaCadeia: (n: number) => `${n} ${plural(n, 'execução', 'execuções')}`,
    abrir: 'Abrir',
    vazio: 'Nenhum fluxo rodou neste item',
    vazioDesc: 'Quando um fluxo rodar neste item ou num item que ele criou, a execução aparece aqui.',
  },

  mapa: {
    operacao: 'Operação',
    buscarItem: 'Ver a jornada de um item',
    buscarItemPlaceholder: 'Buscar item...',
    limparItem: 'Tirar o item',
    legenda: { configurada: 'Ligação configurada', observada: 'Execuções no período', ciclo: 'Ciclo', evento: 'Evento de item' },
    zoom: { ajustar: 'Ajustar à tela', mais: 'Aproximar', menos: 'Afastar' },
    saude: { ok: 'Saudável', falha: 'Com falhas', parada: 'Parada pela plataforma', esperando: 'Esperando pessoa', semExecucao: 'Sem execuções' },
    execs: (n: number) => `${n} ${plural(n, 'execução', 'execuções')}`,
    erros: (n: number) => `${n} com erro`,
    gatilhos: { cron: (r: string) => `Agendamento (${r})`, webhook: 'Chamada externa (webhook)', mailbox: 'E-mail recebido', manual: 'Execução manual' },
    painel: {
      comecaQuando: 'Começa quando',
      grava: 'Grava',
      gravaNada: 'Não grava itens.',
      quemEscuta: 'Fluxos que este evento dispara',
      quemGrava: 'Fluxos que gravam este evento',
      ninguem: 'Nenhum.',
      noPeriodo: 'No período',
      ultimaFalha: 'Última falha',
      verExecucoes: 'Ver execuções',
      abrirEditor: 'Abrir no editor',
      fechar: 'Fechar',
      dono: 'Dono',
    },
    ciclo: {
      titulo: 'Ciclo encontrado',
      descricao: (fluxo: string, evento: string) => `O fluxo ${fluxo} grava "${evento}", e esse evento dispara ele mesmo. A proteção de repetição corta a cadeia no 10º disparo encadeado.`,
      verProtecoes: 'Ver proteções do fluxo',
    },
    jornada: {
      titulo: (ref: string) => `Jornada do ${ref}`,
      passos: (n: number) => `${n} ${plural(n, 'passo', 'passos')}`,
      semCadeia: 'Sem a cadeia, o mapa mostra só os fluxos que rodaram direto neste item.',
      foraDaOperacao: 'Este item não passou por fluxos desta operação.',
    },
    dica: 'Clique em um fluxo ou evento para ver as ligações. Escolha um item para ver por onde ele passou.',
    abrirExecucao: 'Abrir execução',
    foraDoEscopo: 'O editor fica como está no develop.',
    protecoesFora: 'As proteções estão no protótipo protecoes-do-spaceflow.',
  },

  estados: {
    erroTitulo: 'Não foi possível carregar as execuções',
    erroDesc: 'Tente de novo em alguns segundos. Os fluxos continuam rodando.',
    tentar: 'Tentar de novo',
    parcial: (v: number, t: number) => `Você vê ${v} de ${t} fluxos. Os outros dependem de permissão em cada fluxo.`,
    vazioTitulo: 'Nenhuma execução ainda',
    vazioDesc: 'Quando um fluxo rodar, os números e a lista aparecem aqui.',
  },

  duracao: (ms: number) => duracao(ms, { ms: 'ms', s: 's', min: 'min', h: 'h', d: 'd' }),
  passo: (k: number) => `${k}º`,
}

export type Textos = typeof pt

/* ================================================================== *
 * English                                                             *
 * ================================================================== */

const en: Textos = {
  locale: 'en',
  casca: {
    menuLateral: 'Workspace menu', buscar: 'Search...', membro: 'Member', configuracoes: 'Settings',
    ajuda: 'Help', trilha: 'Breadcrumb', recolherMenu: 'Collapse the menu', abrirMenu: 'Open the menu',
    voltar: 'Back', avancar: 'Forward', recarregar: 'Reload', suporte: 'Support',
    notificacoes: 'Notifications', idioma: 'Language', tema: 'Theme', conta: 'Your account',
    itens: {
      inicio: 'Home', spaceflows: 'Spaceflows', categorias: 'Categories', tarefas: 'Tasks',
      agenda: 'Schedule', knowledge: 'Knowledge', visaoGeral: 'Overview', sistema: 'System',
      estrutura: 'Structure', gestaoDeMembros: 'Member management', interface: 'Interface',
      emails: 'Emails', integracoes: 'Integrations', agentesDeIa: 'AI agents', logs: 'Logs',
      releases: 'Releases', documentacao: 'Documentation',
    } as Record<string, string>,
  },
  trilha: { spaceflows: 'Spaceflows', categorias: 'Categories', executions: 'executions' },

  abas: { fluxos: 'Flows', visao: 'Overview', execucoes: 'Executions', mapa: 'Operation map' },

  fluxos: {
    buscar: 'Search workflows...',
    encontrados: (n: number) => `${n} ${plural(n, 'workflow found', 'workflows found')}`,
    semDescricao: 'No description provided',
    abrir: 'Open',
    executar: 'Run',
    uso: (n: number) => `${n} ${plural(n, 'execution', 'executions')} in 7 days`,
    erros: (n: number) => `${n} with errors`,
    foraDoEscopo: 'The flow screen stays as it is in develop.',
    abrirEditor: 'Open Editor', executarWorkflow: 'Run Workflow', ativo: 'Active', abaExecucoes: 'Executions', abaLogs: 'Logs',
    semFluxos: 'No flow in this operation that you can see.',
  },

  periodo: {
    rotulo: 'Period',
    opcoes: { h24: 'Last 24 hours', d7: 'Last 7 days' },
    comparado: { h24: 'Compared with the previous 24 hours', d7: 'Compared with the previous 7 days' },
    atualizado: (hora: string) => `Updated at ${hora}`,
    atualizar: 'Refresh',
  },

  kpi: {
    rodando: 'Running now',
    esperando: 'Waiting',
    erro: 'With errors',
    concluidas: 'Completed',
    paradas: 'Stopped by the platform',
    agora: 'At this moment',
    esperandoPartes: (pessoa: number, fila: number) => `${pessoa} for a person, ${fila} in queue`,
    delta: (n: number) => (n === 0 ? 'Same as the previous period' : n > 0 ? `${n} more than the previous period` : `${-n} fewer than the previous period`),
    total: (n: number) => `${n} ${plural(n, 'execution', 'executions')} in the period`,
    abrirLista: 'Open the list with this filter',
  },

  atencao: {
    titulo: 'Needs attention',
    descricao: 'Flows that failed or were stopped by the platform in the period. One row per flow.',
    colunas: { fluxo: 'Flow', problema: 'Problem', ultimoItem: 'Last item', dono: 'Owner', estado: 'State' },
    estados: { revisar: 'Needs review', resolvido: 'Resolved', ignorado: 'Ignored', adiado: 'Snoozed' },
    ocorrencias: (n: number, desde: string) => `${n} ${plural(n, 'time', 'times')} since ${desde}`,
    verFalhas: 'View failures',
    reprocessar: 'Rerun failures',
    verCadeia: 'View chain',
    mostrarTratados: (n: number) => `Show ${n} handled`,
    esconderTratados: 'Hide handled',
    vazio: 'No flow with problems in this period',
    vazioDesc: 'When a flow fails or is stopped by the platform, it shows up here.',
    reabre: 'Goes back to "Needs review" if it fails again.',
    modal: {
      titulo: (n: number) => `Rerun ${n} ${plural(n, 'execution', 'executions')}`,
      descricao: (fluxo: string) => `The failed executions of the flow ${fluxo} run again from the node that failed.`,
      aviso: 'If the node saved something before failing, the save may repeat. Check the affected items first.',
      itens: 'Affected items',
      confirmar: 'Rerun',
      cancelar: 'Cancel',
      feito: (n: number) => `${n} ${plural(n, 'execution rerun', 'executions rerun')}`,
      feitoDesc: 'They show up in the list as In progress.',
    },
  },

  causas: {
    credencial: { titulo: 'The signing service credential expired', detalhe: 'The service answered 401 (unauthorized).', acao: 'Update the credential in Integrations and rerun the failures.' },
    tempo: { titulo: 'The supplier portal did not answer', detalhe: 'No answer within 30 seconds.', acao: 'Rerun. If it keeps failing, contact the supplier.' },
    ia: { titulo: 'The AI did not find the amount in the document', detalhe: 'The Total amount field was left empty.', acao: 'Check the uploaded document and rerun.' },
    email: { titulo: 'The customer email is invalid', detalhe: 'The server rejected the address.', acao: 'Fix the email in the item and rerun.' },
    permissao: { titulo: 'The access system refused the request', detalhe: 'The service answered 403 (forbidden).', acao: 'Ask IT for the flow account permission and rerun.' },
    cadeia: { titulo: 'Endless repetition stopped', detalhe: 'The chain went over 10 chained triggers.', acao: 'Open the chain to see which flow repeated and adjust its condition.' },
  },

  operacoes: {
    titulo: 'Operation health',
    descricao: 'Each operation groups the flows that work together.',
    fluxos: (n: number) => `${n} ${plural(n, 'flow', 'flows')}`,
    execucoes: (n: number) => `${n} ${plural(n, 'execution', 'executions')}`,
    problemas: (n: number) => `${n} ${plural(n, 'flow needs', 'flows need')} attention`,
    semProblemas: 'No flow needs attention',
    dono: (nome: string) => `Owner: ${nome}`,
    selo: { ok: 'Healthy', atencao: 'Attention', falha: 'Failing' },
    verMapa: 'View on the map',
  },

  graficos: {
    porDia: 'Executions per day',
    porHora: 'Executions per hour',
    maisFalhas: 'Flows with the most failures',
    nenhumaFalha: 'No failures in the period.',
    concluidas: 'Completed',
    erro: 'With errors',
    outras: 'Other',
    valor: (rotulo: string, n: number) => `${rotulo}: ${n}`,
  },

  grupos: { rodando: 'Running', esperando: 'Waiting', concluida: 'Completed', erro: 'With errors', parada: 'Stopped by the platform' },
  status: {
    completed: 'Completed', working: 'In progress', error: 'Error', deleted: 'Deleted',
    queued: 'Queued', skipped: 'Skipped', held: 'Held', stopped: 'Stopped',
  },
  esperando: {
    tarefa: (quem?: string) => (quem ? `Waiting for a task by ${quem}` : 'Waiting for a task'),
    atraso: 'Waiting for the Delay',
  },
  motivos: {
    cadeia: 'The chain went over 10 chained triggers',
    limitePorMinuto: 'Execution limit per period',
  },

  evento: (c: Categoria, acao: Acao) => `${c.nome}: item ${acao === 'create' ? 'created' : acao === 'update' ? 'edited' : 'deleted'}`,
  noItem: (c: Categoria, ref: string) => `On ${c.nome} item ${ref}`,
  nesteItem: 'On this item',

  disparo: {
    tipos: { pessoa: 'Person', fluxo: 'Another flow', agendamento: 'Schedule', webhook: 'Webhook', email: 'Email received' },
    qualquer: 'Any source',
    porPessoa: (evento: string, pessoa: string) => `${evento} by ${pessoa}`,
    porFluxo: (fluxo: string) => `Flow ${fluxo}`,
    soEvento: (evento: string) => evento,
    manual: (pessoa: string) => `Manual run by ${pessoa}`,
    agendamento: (r: string) => `Schedule (${r})`,
    webhook: 'Webhook',
    email: 'Email received',
  },

  execucoes: {
    buscar: 'Search by item, flow or execution title',
    buscarHoje: 'Search executions...',
    itensEncontrados: 'Items found',
    colunas: { execucao: 'Execution', fluxo: 'Flow', item: 'Item', status: 'Status', disparo: 'Triggered by', iniciada: 'Started at', duracao: 'Duration', cadeia: 'Chain' },
    filtros: {
      status: 'Status', todas: 'All', fluxo: 'Flow', fluxoBuscar: 'Search flow...', todosOsFluxos: 'All flows',
      fluxosEscolhidos: (n: number) => `${n} ${plural(n, 'flow', 'flows')}`,
      operacao: 'Operation', todasAsOperacoes: 'All operations', disparo: 'Triggered by',
      soOrigem: 'Only the origin of each chain', limpar: 'Clear filters',
    },
    visoes: {
      rotulo: 'Saved view',
      todas: 'All executions',
      falhasContratos: 'Contract management failures',
      esperandoPessoa: 'Waiting for a person',
    },
    vazio: 'No execution found',
    vazioFiltro: 'No execution with these filters',
    verDetalhes: 'View Details',
    abrirExecucao: 'Open Execution',
    abrirItem: 'Open item',
    reprocessar: 'Rerun',
    mostrando: (a: number, b: number, n: number) => `Showing ${a} to ${b} of ${n} results`,
    acoes: 'Actions',
    cadeiaOrigem: (n: number) => (n > 1 ? `Origin of ${n} executions` : 'No other executions'),
    cadeiaPasso: (k: number) => `Step ${k}`,
    cadeiaComErro: (n: number) => `${n} with errors in the chain`,
    semItem: 'No item',
  },

  busca: {
    passou: (fluxos: number, execs: number) => `Went through ${fluxos} ${plural(fluxos, 'flow', 'flows')} in ${execs} ${plural(execs, 'execution', 'executions')}`,
    partes: (partes: string[]) => partes.join(', '),
    comCadeia: 'Include the items created by the chain',
    soDireto: 'Without the chain, only the executions that ran directly on this item show up.',
    verJornada: 'View journey on the map',
    abrirItem: 'Open item',
    limpar: 'Remove the item filter',
    contagem: (n: number, g: GrupoDeStatus) => `${n} ${({ rodando: 'running', esperando: 'waiting', concluida: 'completed', erro: 'with errors', parada: 'stopped by the platform' })[g]}`,
  },

  detalhe: {
    abas: { fluxo: 'Execution Flow', cadeia: 'Chain', detalhes: 'Details', comentarios: 'Comments', logs: 'Logs' },
    nos: (a: number, b: number) => `${a}/${b} nodes executed`,
    caminho: 'Executed path',
    naoExecutado: 'Not executed',
    parteDaCadeia: (passo: number, total: number, ref: string) => `Step ${passo} of ${total} in the chain of ${ref}`,
    origemDaCadeia: (total: number) => `Origin of a chain of ${total} ${plural(total, 'execution', 'executions')}`,
    causadaPor: 'Caused by',
    irParaOrigem: 'Go to the origin',
    irParaAnterior: 'Go to the previous one',
    verCadeia: 'View chain',
    falhouNo: (no: string) => `Failed at node ${no}`,
    oQueFazer: 'What to do',
    reprocessarNo: 'Rerun from this node',
    reprocessado: 'Execution rerun',
    reprocessadoDesc: 'It runs again from the node that failed.',
    campos: {
      referencia: 'Reference', versao: 'Version', criado: 'Created at', atualizado: 'Updated at', status: 'Status',
      titulo: 'Title', fluxo: 'Flow', item: 'Item', disparo: 'Triggered by', entrada: 'Input', saida: 'Output',
      gravou: 'What it saved', nada: 'Nothing',
    },
    verDadosTecnicos: 'View technical data',
    esconderDadosTecnicos: 'Hide technical data',
    foraDoEscopo: 'Out of the scope of this prototype',
    foraDoEscopoDesc: 'Comments and Logs stay as they are in develop.',
    voltarParaLista: 'Back to the list',
    cadeia: {
      titulo: (execs: number, fluxos: number) => `${execs} ${plural(execs, 'execution', 'executions')} in ${fluxos} ${plural(fluxos, 'flow', 'flows')}`,
      comecou: (evento: string, quando: string) => `Started with ${evento} on ${quando}`,
      duracao: (d: string) => `From the first to the last step: ${d}`,
      estaExecucao: 'This execution',
      emAndamento: 'In progress',
      incompleta: 'The chain still has executions in progress. It may grow.',
      interrompida: (fluxo: string, ref: string) => `The platform stopped the chain: the flow ${fluxo} edited ${ref} and triggered itself 10 times in a row.`,
      verNoMapa: 'View on the map',
      gravou: (o: string) => `Saved ${o}`,
      semCadeia: {
        titulo: 'The chain depends on data that Spaceflow does not save yet',
        descricao: 'To link this execution to the execution that caused it, Spaceflow needs to save which execution created or edited the item that triggered this flow.',
        hoje: 'Today you can only see the event that triggered this execution.',
      },
    },
  },

  itemTela: {
    abas: { visaoGeral: 'Overview', comentarios: 'Comments', logs: 'Audit Logs', tarefas: 'Tasks', fluxos: 'Flows', anexos: 'Attachments', emails: 'Automatic Emails', mailbox: 'Mail Box', notas: 'Notes', campos: 'Fields' },
    painel: { identificacao: 'Identification', id: 'ID', origem: 'Origin', status: 'Status', ativo: 'Active', solicitante: 'Created by', historico: 'History', criado: 'Created at', atualizado: 'Updated at' },
    foraDoEscopo: 'The other tabs stay as they are in develop.',
    rodape: { naoSalvas: 'Unsaved changes', sair: 'Leave without saving', salvar: 'Save' },
    agora: {
      rotulo: 'Now',
      erro: (fluxo: string, hora: string) => `Stuck in the flow ${fluxo}, which failed at ${hora}.`,
      esperando: (fluxo: string, quem: string) => `Waiting for a task by ${quem} in the flow ${fluxo}.`,
      rodando: (fluxo: string) => `Running in the flow ${fluxo}.`,
      parada: (fluxo: string, hora: string) => `The platform stopped the chain at ${hora}: the flow ${fluxo} repeated endlessly.`,
      tudoCerto: (hora: string) => `No flow running. The last one finished at ${hora}.`,
      nenhum: 'No flow ran on this item.',
    },
    numeros: { fluxos: 'Flows gone through', execucoes: 'Executions', erro: 'With errors', esperando: 'Waiting', tempo: 'From the first to the last step' },
    escopo: { esteItem: 'Only this item', comCadeia: 'With the chain' },
    escopoAjuda: 'With the chain, the flows that ran on the items created by this item\'s flows are included (the progress record, the draft, the installments).',
    cadeiaIniciada: (quando: string) => `Chain started on ${quando}`,
    execucoesNaCadeia: (n: number) => `${n} ${plural(n, 'execution', 'executions')}`,
    abrir: 'Open',
    vazio: 'No flow ran on this item',
    vazioDesc: 'When a flow runs on this item or on an item it created, the execution shows up here.',
  },

  mapa: {
    operacao: 'Operation',
    buscarItem: 'View the journey of an item',
    buscarItemPlaceholder: 'Search item...',
    limparItem: 'Remove the item',
    legenda: { configurada: 'Configured link', observada: 'Executions in the period', ciclo: 'Cycle', evento: 'Item event' },
    zoom: { ajustar: 'Fit to screen', mais: 'Zoom in', menos: 'Zoom out' },
    saude: { ok: 'Healthy', falha: 'Failing', parada: 'Stopped by the platform', esperando: 'Waiting for a person', semExecucao: 'No executions' },
    execs: (n: number) => `${n} ${plural(n, 'execution', 'executions')}`,
    erros: (n: number) => `${n} with errors`,
    gatilhos: { cron: (r: string) => `Schedule (${r})`, webhook: 'External call (webhook)', mailbox: 'Email received', manual: 'Manual run' },
    painel: {
      comecaQuando: 'Starts when',
      grava: 'Saves',
      gravaNada: 'Does not save items.',
      quemEscuta: 'Flows this event triggers',
      quemGrava: 'Flows that save this event',
      ninguem: 'None.',
      noPeriodo: 'In the period',
      ultimaFalha: 'Last failure',
      verExecucoes: 'View executions',
      abrirEditor: 'Open in the editor',
      fechar: 'Close',
      dono: 'Owner',
    },
    ciclo: {
      titulo: 'Cycle found',
      descricao: (fluxo: string, evento: string) => `The flow ${fluxo} saves "${evento}", and this event triggers the flow itself. The repetition protection cuts the chain at the 10th chained trigger.`,
      verProtecoes: 'View flow protections',
    },
    jornada: {
      titulo: (ref: string) => `Journey of ${ref}`,
      passos: (n: number) => `${n} ${plural(n, 'step', 'steps')}`,
      semCadeia: 'Without the chain, the map shows only the flows that ran directly on this item.',
      foraDaOperacao: 'This item did not go through flows of this operation.',
    },
    dica: 'Click a flow or event to see its links. Choose an item to see where it went.',
    abrirExecucao: 'Open execution',
    foraDoEscopo: 'The editor stays as it is in develop.',
    protecoesFora: 'The protections are in the protecoes-do-spaceflow prototype.',
  },

  estados: {
    erroTitulo: 'The executions could not be loaded',
    erroDesc: 'Try again in a few seconds. The flows keep running.',
    tentar: 'Try again',
    parcial: (v: number, t: number) => `You see ${v} of ${t} flows. The others depend on the permission of each flow.`,
    vazioTitulo: 'No executions yet',
    vazioDesc: 'When a flow runs, the numbers and the list show up here.',
  },

  duracao: (ms: number) => duracao(ms, { ms: 'ms', s: 's', min: 'min', h: 'h', d: 'd' }),
  passo: (k: number) => `${k}`,
}

/* ================================================================== *
 * Español                                                             *
 * ================================================================== */

const es: Textos = {
  locale: 'es',
  casca: {
    menuLateral: 'Menú del workspace', buscar: 'Buscar...', membro: 'Miembro', configuracoes: 'Configuraciones',
    ajuda: 'Ayuda', trilha: 'Ruta', recolherMenu: 'Contraer el menú', abrirMenu: 'Abrir el menú',
    voltar: 'Volver', avancar: 'Avanzar', recarregar: 'Recargar', suporte: 'Soporte',
    notificacoes: 'Notificaciones', idioma: 'Idioma', tema: 'Tema', conta: 'Su cuenta',
    itens: {
      inicio: 'Inicio', spaceflows: 'Spaceflows', categorias: 'Categorías', tarefas: 'Tareas',
      agenda: 'Agenda', knowledge: 'Knowledge', visaoGeral: 'Visión General', sistema: 'Sistema',
      estrutura: 'Estructura', gestaoDeMembros: 'Gestión de Miembros', interface: 'Interfaz',
      emails: 'Correos', integracoes: 'Integraciones', agentesDeIa: 'Agentes de IA', logs: 'Registros',
      releases: 'Releases', documentacao: 'Documentación',
    } as Record<string, string>,
  },
  trilha: { spaceflows: 'Spaceflows', categorias: 'Categorías', executions: 'executions' },

  abas: { fluxos: 'Flujos', visao: 'Visión general', execucoes: 'Ejecuciones', mapa: 'Mapa de la operación' },

  fluxos: {
    buscar: 'Buscar workflows...',
    encontrados: (n: number) => `${n} ${plural(n, 'workflow encontrado', 'workflows encontrados')}`,
    semDescricao: 'Ninguna descripción informada',
    abrir: 'Abrir',
    executar: 'Ejecutar',
    uso: (n: number) => `${n} ${plural(n, 'ejecución', 'ejecuciones')} en 7 días`,
    erros: (n: number) => `${n} con error`,
    foraDoEscopo: 'La pantalla del flujo queda como está en develop.',
    abrirEditor: 'Abrir Editor', executarWorkflow: 'Ejecutar Workflow', ativo: 'Activo', abaExecucoes: 'Ejecuciones', abaLogs: 'Registros',
    semFluxos: 'Ningún flujo en esta operación que usted pueda ver.',
  },

  periodo: {
    rotulo: 'Período',
    opcoes: { h24: 'Últimas 24 horas', d7: 'Últimos 7 días' },
    comparado: { h24: 'Comparado con las 24 horas anteriores', d7: 'Comparado con los 7 días anteriores' },
    atualizado: (hora: string) => `Actualizado a las ${hora}`,
    atualizar: 'Actualizar',
  },

  kpi: {
    rodando: 'En ejecución ahora',
    esperando: 'Esperando',
    erro: 'Con error',
    concluidas: 'Completadas',
    paradas: 'Detenidas por la plataforma',
    agora: 'En este momento',
    esperandoPartes: (pessoa: number, fila: number) => `${pessoa} por una persona, ${fila} en la cola`,
    delta: (n: number) => (n === 0 ? 'Igual al período anterior' : n > 0 ? `${n} más que en el período anterior` : `${-n} menos que en el período anterior`),
    total: (n: number) => `${n} ${plural(n, 'ejecución', 'ejecuciones')} en el período`,
    abrirLista: 'Abrir la lista con este filtro',
  },

  atencao: {
    titulo: 'Requiere atención',
    descricao: 'Flujos con fallas o detenidos por la plataforma en el período. Una fila por flujo.',
    colunas: { fluxo: 'Flujo', problema: 'Problema', ultimoItem: 'Último ítem', dono: 'Responsable', estado: 'Situación' },
    estados: { revisar: 'Requiere revisión', resolvido: 'Resuelto', ignorado: 'Ignorado', adiado: 'Pospuesto' },
    ocorrencias: (n: number, desde: string) => `${n} ${plural(n, 'vez', 'veces')} desde ${desde}`,
    verFalhas: 'Ver fallas',
    reprocessar: 'Reprocesar fallas',
    verCadeia: 'Ver cadena',
    mostrarTratados: (n: number) => `Mostrar ${n} ${plural(n, 'tratado', 'tratados')}`,
    esconderTratados: 'Ocultar los tratados',
    vazio: 'Ningún flujo con problemas en este período',
    vazioDesc: 'Cuando un flujo falle o sea detenido por la plataforma, aparecerá aquí.',
    reabre: 'Vuelve a "Requiere revisión" si falla de nuevo.',
    modal: {
      titulo: (n: number) => `Reprocesar ${n} ${plural(n, 'ejecución', 'ejecuciones')}`,
      descricao: (fluxo: string) => `Las ejecuciones con error del flujo ${fluxo} se ejecutan de nuevo desde el nodo que falló.`,
      aviso: 'Si el nodo guardó algo antes de fallar, el guardado puede repetirse. Revise antes los ítems afectados.',
      itens: 'Ítems afectados',
      confirmar: 'Reprocesar',
      cancelar: 'Cancelar',
      feito: (n: number) => `${n} ${plural(n, 'ejecución reprocesada', 'ejecuciones reprocesadas')}`,
      feitoDesc: 'Aparecen en la lista como En curso.',
    },
  },

  causas: {
    credencial: { titulo: 'La credencial del firmador venció', detalhe: 'El servicio respondió 401 (no autorizado).', acao: 'Actualice la credencial en Integraciones y reprocese las fallas.' },
    tempo: { titulo: 'El portal del proveedor no respondió', detalhe: 'Sin respuesta en 30 segundos.', acao: 'Reprocese. Si la falla continúa, contacte al proveedor.' },
    ia: { titulo: 'La IA no encontró el valor en el documento', detalhe: 'El campo Valor total quedó vacío.', acao: 'Revise el documento enviado y reprocese.' },
    email: { titulo: 'El correo del cliente no es válido', detalhe: 'El servidor rechazó la dirección.', acao: 'Corrija el correo en el ítem y reprocese.' },
    permissao: { titulo: 'El sistema de accesos rechazó la solicitud', detalhe: 'El servicio respondió 403 (sin permiso).', acao: 'Pida a TI el permiso de la cuenta del flujo y reprocese.' },
    cadeia: { titulo: 'Repetición sin fin detenida', detalhe: 'La cadena superó los 10 disparos encadenados.', acao: 'Abra la cadena para ver qué flujo se repitió y ajuste su condición.' },
  },

  operacoes: {
    titulo: 'Salud de las operaciones',
    descricao: 'Cada operación agrupa los flujos que trabajan juntos.',
    fluxos: (n: number) => `${n} ${plural(n, 'flujo', 'flujos')}`,
    execucoes: (n: number) => `${n} ${plural(n, 'ejecución', 'ejecuciones')}`,
    problemas: (n: number) => `${n} ${plural(n, 'flujo requiere', 'flujos requieren')} atención`,
    semProblemas: 'Ningún flujo requiere atención',
    dono: (nome: string) => `Responsable: ${nome}`,
    selo: { ok: 'Saludable', atencao: 'Atención', falha: 'Con fallas' },
    verMapa: 'Ver en el mapa',
  },

  graficos: {
    porDia: 'Ejecuciones por día',
    porHora: 'Ejecuciones por hora',
    maisFalhas: 'Flujos con más fallas',
    nenhumaFalha: 'Ninguna falla en el período.',
    concluidas: 'Completadas',
    erro: 'Con error',
    outras: 'Otras',
    valor: (rotulo: string, n: number) => `${rotulo}: ${n}`,
  },

  grupos: { rodando: 'En ejecución', esperando: 'Esperando', concluida: 'Completada', erro: 'Con error', parada: 'Detenida por la plataforma' },
  status: {
    completed: 'Completo', working: 'En curso', error: 'Error', deleted: 'Eliminada',
    queued: 'En cola', skipped: 'Ignorada', held: 'Retenida', stopped: 'Interrumpida',
  },
  esperando: {
    tarefa: (quem?: string) => (quem ? `Esperando la tarea de ${quem}` : 'Esperando la tarea'),
    atraso: 'Esperando el Retraso',
  },
  motivos: {
    cadeia: 'La cadena superó los 10 disparos encadenados',
    limitePorMinuto: 'Límite de ejecuciones por período',
  },

  evento: (c: Categoria, acao: Acao) => `${c.nome}: ítem ${acao === 'create' ? 'creado' : acao === 'update' ? 'editado' : 'eliminado'}`,
  noItem: (c: Categoria, ref: string) => `En el ítem ${ref} de ${c.nome}`,
  nesteItem: 'En este ítem',

  disparo: {
    tipos: { pessoa: 'Persona', fluxo: 'Otro flujo', agendamento: 'Programación', webhook: 'Webhook', email: 'Correo recibido' },
    qualquer: 'Cualquier origen',
    porPessoa: (evento: string, pessoa: string) => `${evento} por ${pessoa}`,
    porFluxo: (fluxo: string) => `Flujo ${fluxo}`,
    soEvento: (evento: string) => evento,
    manual: (pessoa: string) => `Ejecución manual de ${pessoa}`,
    agendamento: (r: string) => `Programación (${r})`,
    webhook: 'Webhook',
    email: 'Correo recibido',
  },

  execucoes: {
    buscar: 'Buscar por ítem, flujo o título de la ejecución',
    buscarHoje: 'Buscar ejecuciones...',
    itensEncontrados: 'Ítems encontrados',
    colunas: { execucao: 'Ejecución', fluxo: 'Flujo', item: 'Ítem', status: 'Estado', disparo: 'Disparada por', iniciada: 'Iniciada el', duracao: 'Duración', cadeia: 'Cadena' },
    filtros: {
      status: 'Estado', todas: 'Todas', fluxo: 'Flujo', fluxoBuscar: 'Buscar flujo...', todosOsFluxos: 'Todos los flujos',
      fluxosEscolhidos: (n: number) => `${n} ${plural(n, 'flujo', 'flujos')}`,
      operacao: 'Operación', todasAsOperacoes: 'Todas las operaciones', disparo: 'Disparada por',
      soOrigem: 'Solo el origen de cada cadena', limpar: 'Limpiar filtros',
    },
    visoes: {
      rotulo: 'Vista guardada',
      todas: 'Todas las ejecuciones',
      falhasContratos: 'Fallas de Gestión de contratos',
      esperandoPessoa: 'Esperando a una persona',
    },
    vazio: 'Ninguna ejecución encontrada',
    vazioFiltro: 'Ninguna ejecución con estos filtros',
    verDetalhes: 'Ver Detalles',
    abrirExecucao: 'Abrir Ejecución',
    abrirItem: 'Abrir ítem',
    reprocessar: 'Reprocesar',
    mostrando: (a: number, b: number, n: number) => `Mostrando ${a} a ${b} de ${n} resultados`,
    acoes: 'Acciones',
    cadeiaOrigem: (n: number) => (n > 1 ? `Origen de ${n} ejecuciones` : 'Sin otras ejecuciones'),
    cadeiaPasso: (k: number) => `Paso ${k}`,
    cadeiaComErro: (n: number) => `${n} con error en la cadena`,
    semItem: 'Sin ítem',
  },

  busca: {
    passou: (fluxos: number, execs: number) => `Pasó por ${fluxos} ${plural(fluxos, 'flujo', 'flujos')} en ${execs} ${plural(execs, 'ejecución', 'ejecuciones')}`,
    partes: (partes: string[]) => partes.join(', '),
    comCadeia: 'Incluir los ítems creados por la cadena',
    soDireto: 'Sin la cadena, aparecen solo las ejecuciones que corrieron directamente en este ítem.',
    verJornada: 'Ver recorrido en el mapa',
    abrirItem: 'Abrir ítem',
    limpar: 'Quitar el filtro del ítem',
    contagem: (n: number, g: GrupoDeStatus) => `${n} ${({ rodando: 'en ejecución', esperando: 'esperando', concluida: plural(n, 'completada', 'completadas'), erro: 'con error', parada: plural(n, 'detenida por la plataforma', 'detenidas por la plataforma') })[g]}`,
  },

  detalhe: {
    abas: { fluxo: 'Flujo de Ejecución', cadeia: 'Cadena', detalhes: 'Detalles', comentarios: 'Comentarios', logs: 'Registros' },
    nos: (a: number, b: number) => `${a}/${b} nodos ejecutados`,
    caminho: 'Camino ejecutado',
    naoExecutado: 'No ejecutado',
    parteDaCadeia: (passo: number, total: number, ref: string) => `Paso ${passo} de ${total} en la cadena de ${ref}`,
    origemDaCadeia: (total: number) => `Origen de una cadena de ${total} ${plural(total, 'ejecución', 'ejecuciones')}`,
    causadaPor: 'Causada por',
    irParaOrigem: 'Ir al origen',
    irParaAnterior: 'Ir a la anterior',
    verCadeia: 'Ver cadena',
    falhouNo: (no: string) => `Falló en el nodo ${no}`,
    oQueFazer: 'Qué hacer',
    reprocessarNo: 'Reprocesar desde este nodo',
    reprocessado: 'Ejecución reprocesada',
    reprocessadoDesc: 'Se ejecuta de nuevo desde el nodo que falló.',
    campos: {
      referencia: 'Referencia', versao: 'Versión', criado: 'Creado el', atualizado: 'Actualizado el', status: 'Estado',
      titulo: 'Título', fluxo: 'Flujo', item: 'Ítem', disparo: 'Disparada por', entrada: 'Entrada', saida: 'Salida',
      gravou: 'Qué guardó', nada: 'Nada',
    },
    verDadosTecnicos: 'Ver datos técnicos',
    esconderDadosTecnicos: 'Ocultar datos técnicos',
    foraDoEscopo: 'Fuera del alcance de este prototipo',
    foraDoEscopoDesc: 'Comentarios y Registros quedan como están en develop.',
    voltarParaLista: 'Volver a la lista',
    cadeia: {
      titulo: (execs: number, fluxos: number) => `${execs} ${plural(execs, 'ejecución', 'ejecuciones')} en ${fluxos} ${plural(fluxos, 'flujo', 'flujos')}`,
      comecou: (evento: string, quando: string) => `Empezó con ${evento} el ${quando}`,
      duracao: (d: string) => `Del primer al último paso: ${d}`,
      estaExecucao: 'Esta ejecución',
      emAndamento: 'En curso',
      incompleta: 'La cadena todavía tiene ejecuciones en curso. Puede crecer.',
      interrompida: (fluxo: string, ref: string) => `La plataforma detuvo la cadena: el flujo ${fluxo} editó ${ref} y se disparó a sí mismo 10 veces seguidas.`,
      verNoMapa: 'Ver en el mapa',
      gravou: (o: string) => `Guardó ${o}`,
      semCadeia: {
        titulo: 'La cadena depende de un dato que Spaceflow todavía no guarda',
        descricao: 'Para vincular esta ejecución con la ejecución que la causó, Spaceflow necesita guardar qué ejecución creó o editó el ítem que disparó este flujo.',
        hoje: 'Hoy solo se puede ver el evento que disparó esta ejecución.',
      },
    },
  },

  itemTela: {
    abas: { visaoGeral: 'Visión General', comentarios: 'Comentarios', logs: 'Registros de Auditoría', tarefas: 'Tareas', fluxos: 'Flujos', anexos: 'Adjuntos', emails: 'Correos Automáticos', mailbox: 'Mail Box', notas: 'Notas', campos: 'Campos' },
    painel: { identificacao: 'Identificación', id: 'ID', origem: 'Origen', status: 'Estado', ativo: 'Activo', solicitante: 'Creado por', historico: 'Historial', criado: 'Creado el', atualizado: 'Actualizado el' },
    foraDoEscopo: 'Las otras pestañas quedan como están en develop.',
    rodape: { naoSalvas: 'Cambios no guardados', sair: 'Salir sin guardar', salvar: 'Guardar' },
    agora: {
      rotulo: 'Ahora',
      erro: (fluxo: string, hora: string) => `Detenido en el flujo ${fluxo}, que falló a las ${hora}.`,
      esperando: (fluxo: string, quem: string) => `Esperando la tarea de ${quem} en el flujo ${fluxo}.`,
      rodando: (fluxo: string) => `En ejecución en el flujo ${fluxo}.`,
      parada: (fluxo: string, hora: string) => `La plataforma detuvo la cadena a las ${hora}: el flujo ${fluxo} se repitió sin fin.`,
      tudoCerto: (hora: string) => `Ningún flujo en ejecución. El último terminó a las ${hora}.`,
      nenhum: 'Ningún flujo corrió en este ítem.',
    },
    numeros: { fluxos: 'Flujos recorridos', execucoes: 'Ejecuciones', erro: 'Con error', esperando: 'Esperando', tempo: 'Del primer al último paso' },
    escopo: { esteItem: 'Solo este ítem', comCadeia: 'Con la cadena' },
    escopoAjuda: 'Con la cadena, entran los flujos que corrieron en los ítems que crearon los flujos de este ítem (el avance, la minuta, las cuotas).',
    cadeiaIniciada: (quando: string) => `Cadena iniciada el ${quando}`,
    execucoesNaCadeia: (n: number) => `${n} ${plural(n, 'ejecución', 'ejecuciones')}`,
    abrir: 'Abrir',
    vazio: 'Ningún flujo corrió en este ítem',
    vazioDesc: 'Cuando un flujo corra en este ítem o en un ítem que creó, la ejecución aparecerá aquí.',
  },

  mapa: {
    operacao: 'Operación',
    buscarItem: 'Ver el recorrido de un ítem',
    buscarItemPlaceholder: 'Buscar ítem...',
    limparItem: 'Quitar el ítem',
    legenda: { configurada: 'Vínculo configurado', observada: 'Ejecuciones en el período', ciclo: 'Ciclo', evento: 'Evento de ítem' },
    zoom: { ajustar: 'Ajustar a la pantalla', mais: 'Acercar', menos: 'Alejar' },
    saude: { ok: 'Saludable', falha: 'Con fallas', parada: 'Detenida por la plataforma', esperando: 'Esperando a una persona', semExecucao: 'Sin ejecuciones' },
    execs: (n: number) => `${n} ${plural(n, 'ejecución', 'ejecuciones')}`,
    erros: (n: number) => `${n} con error`,
    gatilhos: { cron: (r: string) => `Programación (${r})`, webhook: 'Llamada externa (webhook)', mailbox: 'Correo recibido', manual: 'Ejecución manual' },
    painel: {
      comecaQuando: 'Empieza cuando',
      grava: 'Guarda',
      gravaNada: 'No guarda ítems.',
      quemEscuta: 'Flujos que este evento dispara',
      quemGrava: 'Flujos que guardan este evento',
      ninguem: 'Ninguno.',
      noPeriodo: 'En el período',
      ultimaFalha: 'Última falla',
      verExecucoes: 'Ver ejecuciones',
      abrirEditor: 'Abrir en el editor',
      fechar: 'Cerrar',
      dono: 'Responsable',
    },
    ciclo: {
      titulo: 'Ciclo encontrado',
      descricao: (fluxo: string, evento: string) => `El flujo ${fluxo} guarda "${evento}", y ese evento dispara el mismo flujo. La protección de repetición corta la cadena en el 10.º disparo encadenado.`,
      verProtecoes: 'Ver protecciones del flujo',
    },
    jornada: {
      titulo: (ref: string) => `Recorrido de ${ref}`,
      passos: (n: number) => `${n} ${plural(n, 'paso', 'pasos')}`,
      semCadeia: 'Sin la cadena, el mapa muestra solo los flujos que corrieron directamente en este ítem.',
      foraDaOperacao: 'Este ítem no pasó por flujos de esta operación.',
    },
    dica: 'Haga clic en un flujo o evento para ver sus vínculos. Elija un ítem para ver por dónde pasó.',
    abrirExecucao: 'Abrir ejecución',
    foraDoEscopo: 'El editor queda como está en develop.',
    protecoesFora: 'Las protecciones están en el prototipo protecoes-do-spaceflow.',
  },

  estados: {
    erroTitulo: 'No fue posible cargar las ejecuciones',
    erroDesc: 'Intente de nuevo en unos segundos. Los flujos siguen corriendo.',
    tentar: 'Intentar de nuevo',
    parcial: (v: number, t: number) => `Usted ve ${v} de ${t} flujos. Los otros dependen del permiso de cada flujo.`,
    vazioTitulo: 'Ninguna ejecución todavía',
    vazioDesc: 'Cuando un flujo corra, los números y la lista aparecerán aquí.',
  },

  duracao: (ms: number) => duracao(ms, { ms: 'ms', s: 's', min: 'min', h: 'h', d: 'd' }),
  passo: (k: number) => `${k}.º`,
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': pt, en, es }
