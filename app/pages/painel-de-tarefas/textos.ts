/**
 * A copy do painel de tarefas nos 3 idiomas do ENSPACE.
 *
 * Regra 33: nenhum texto de interface leva travessão. Aqui também não.
 * Número, data e plural saem daqui, nunca concatenados no template.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { ChaveDoPeriodo, Faixa, Origem, Situacao, StatusVirtual } from './metricas'
import type { GrupoDoPainel, IdDoPainel } from './paineis'

type Plural = (n: number) => string

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
  trilhaTarefas: string
  trilhaPainel: string

  titulo: string
  subtitulo: string
  atualizadoAs: (hora: string) => string
  atualizar: string

  /** Nome e descrição de cada painel: no cabeçalho, no catálogo e no leitor de tela. */
  paineis: Record<IdDoPainel, { titulo: string, descricao: string }>

  grade: {
    personalizar: string
    concluir: string
    adicionar: string
    desfazer: string
    restaurarPadrao: string
    dica: string
    soParaVoce: string
    maisAcoes: (nome: string) => string
    telaCheia: string
    fecharTelaCheia: string
    tamanhoPadrao: string
    ocultar: string
    mover: (nome: string) => string
    redimensionar: (nome: string) => string
    movido: (nome: string, posicao: number, total: number) => string
    tamanho: (nome: string, w: number, h: number) => string
    ocultado: (nome: string) => string
    restaurado: string
    semHistorico: string
    catalogo: {
      titulo: string
      descricao: string
      buscar: string
      adicionado: string
      adicionar: string
      adicionarPainel: (nome: string) => string
      ocultarPainel: (nome: string) => string
      nenhum: string
      grupos: Record<GrupoDoPainel, string>
      emTela: (n: number, total: number) => string
    }
    vazioTitulo: string
    vazioTexto: string
  }

  filtros: {
    periodo: string
    periodos: Record<ChaveDoPeriodo, string>
    intervalo: (de: string, ate: string) => string
    origem: string
    origens: Record<'todas' | Origem, string>
    responsavel: string
    responsavelVazio: string
    responsavelSelecionados: Plural
    pessoas: string
    grupos: string
    outros: string
    categoria: string
    categoriaVazio: string
    categoriaSelecionadas: Plural
    limpar: string
    buscar: string
  }
  rotulos: { todos: string, externo: string, sem: string }
  origemCurta: Record<Origem, string>

  agora: string
  noPeriodo: string
  comoCalculamos: string
  vsAnterior: string
  comparacao: string
  pontos: (n: string) => string
  carregandoMais: string
  fimDaLista: Plural

  kpi: {
    abertasDetalhe: (a: string, b: string, c: string) => string
    vencidasDetalhe: (pct: string) => string
    aVencerDetalhe: (em24h: string) => string
    concluidasDetalhe: (criadas: string) => string
    noPrazoDetalhe: (a: string, b: string) => string
    tempoDetalhe: (mediana: string) => string
  }
  regras: Record<IdDoPainel, string>

  sla: {
    abertasAgora: string
    concluidasNoPeriodo: string
    prazoIgualACriacao: Plural
    semDataDeConclusao: Plural
    semTarefas: string
  }
  situacao: Record<Situacao | 'removida', string>
  status: Record<StatusVirtual, string>
  statusOrigem: Record<StatusVirtual, string>

  prazos: {
    grupos: { vencidas: string, aVencer: string, depois: string }
    faixas: Record<Faixa, string>
  }

  proximas: {
    vazio: string
    venceEm: (quanto: string) => string
  }

  serie: {
    criadas: string
    concluidas: string
    agrupar: string
    semana: string
    mes: string
    ano: string
    semanaDe: (data: string) => string
    saldo: (n: string) => string
    parcial: string
    notaParcial: string
    rotuloAcessivel: (criadas: string, concluidas: string) => string
  }

  statusBloco: {
    abertasAgora: string
    noPeriodo: string
  }

  resp: {
    modo: string
    designada: string
    executada: string
    responsavel: string
    abertas: string
    vencidas: string
    concluidas: string
    noPrazo: string
    tempo: string
    tipo: Record<'pessoa' | 'grupo' | 'todos' | 'externo' | 'sem', string>
    avisoSoma: string
    avisoGrupo: string
    vazio: string
  }

  tempos: {
    tarefa: string
    avulsa: string
    n: string
    media: string
    mediana: string
    p90: string
    espera: string
    execucao: string
    agoraNaEtapa: string
    emAndamento: string
    concluidosNoPeriodo: string
    passagens: string
    soFluxo: string
    semDados: string
    esperaExecucaoAjuda: string
    vies: string
    etapaSoCategoria: string
    gargalo: string
    composicao: string
    tipoDeFluxo: { categoria: string, spaceflow: string }
    contagemComIdade: (n: string, idade: string) => string
  }

  gaveta: {
    contagem: Plural
    tarefa: string
    status: string
    prazo: string
    responsavel: string
    onde: string
    criada: string
    concluida: string
    buscar: string
    colunas: string
    exportar: string
    abrirAgendadas: string
    abrirRapidas: string
    maquete: string
    maqueteExportar: string
    vazio: string
    semPrazo: string
    venceuHa: (quanto: string) => string
    venceEm: (quanto: string) => string
    mostrando: (de: string, ate: string, total: string) => string
    porPagina: (n: number) => string
  }

  estados: {
    vazioTitulo: string
    vazioTexto: string
    semResultadoTitulo: string
    semResultadoTexto: string
    erroTitulo: string
    erroTexto: string
    tentarDeNovo: string
    semPermissaoTitulo: string
    semPermissaoTexto: string
  }

  unidades: { d: string, h: string, min: string, menosDeUmMin: string }
  recortes: {
    abertas: string
    vencidas: string
    aVencer: string
    concluidas: string
    atrasadas: string
    tempo: string
  }
}

const casca = {
  'pt-BR': {
    menuLateral: 'Menu do workspace', buscar: 'Buscar', membro: 'Membro', configuracoes: 'Configurações',
    ajuda: 'Ajuda', trilha: 'Trilha', recolherMenu: 'Recolher o menu', abrirMenu: 'Abrir o menu',
    voltar: 'Voltar', avancar: 'Avançar', recarregar: 'Recarregar', suporte: 'Suporte',
    notificacoes: 'Notificações', idioma: 'Idioma', tema: 'Tema', conta: 'Sua conta', novo: 'Novo',
    itens: {
      inicio: 'Início', spaceflows: 'Spaceflows', categorias: 'Categorias',
      tarefas: 'Tarefas', painel: 'Painel', agendadas: 'Agendadas', rapidas: 'Rápidas',
      agenda: 'Agenda', knowledge: 'Knowledge', visaoGeral: 'Visão Geral',
      sistema: 'Sistema', estrutura: 'Estrutura', gestaoDeMembros: 'Gestão de Membros',
      interface: 'Interface', emails: 'E-mails', integracoes: 'Integrações',
      agentesDeIa: 'Agentes de IA', logs: 'Logs', credenciais: 'Credenciais',
      releases: 'Releases', documentacao: 'Documentação',
    },
  },
  en: {
    menuLateral: 'Workspace menu', buscar: 'Search', membro: 'Member', configuracoes: 'Settings',
    ajuda: 'Help', trilha: 'Breadcrumb', recolherMenu: 'Collapse the menu', abrirMenu: 'Open the menu',
    voltar: 'Back', avancar: 'Forward', recarregar: 'Reload', suporte: 'Support',
    notificacoes: 'Notifications', idioma: 'Language', tema: 'Theme', conta: 'Your account', novo: 'New',
    itens: {
      inicio: 'Home', spaceflows: 'Spaceflows', categorias: 'Categories',
      tarefas: 'Tasks', painel: 'Dashboard', agendadas: 'Scheduled', rapidas: 'Quick',
      agenda: 'Schedule', knowledge: 'Knowledge', visaoGeral: 'Overview',
      sistema: 'System', estrutura: 'Structure', gestaoDeMembros: 'Member management',
      interface: 'Interface', emails: 'Emails', integracoes: 'Integrations',
      agentesDeIa: 'AI agents', logs: 'Logs', credenciais: 'Credentials',
      releases: 'Releases', documentacao: 'Documentation',
    },
  },
  es: {
    menuLateral: 'Menú del workspace', buscar: 'Buscar', membro: 'Miembro', configuracoes: 'Configuraciones',
    ajuda: 'Ayuda', trilha: 'Ruta', recolherMenu: 'Contraer el menú', abrirMenu: 'Abrir el menú',
    voltar: 'Volver', avancar: 'Avanzar', recarregar: 'Recargar', suporte: 'Soporte',
    notificacoes: 'Notificaciones', idioma: 'Idioma', tema: 'Tema', conta: 'Su cuenta', novo: 'Nuevo',
    itens: {
      inicio: 'Inicio', spaceflows: 'Spaceflows', categorias: 'Categorías',
      tarefas: 'Tareas', painel: 'Panel', agendadas: 'Programadas', rapidas: 'Rápidas',
      agenda: 'Agenda', knowledge: 'Knowledge', visaoGeral: 'Visión General',
      sistema: 'Sistema', estrutura: 'Estructura', gestaoDeMembros: 'Gestión de Miembros',
      interface: 'Interfaz', emails: 'Correos', integracoes: 'Integraciones',
      agentesDeIa: 'Agentes de IA', logs: 'Registros', credenciais: 'Credenciales',
      releases: 'Releases', documentacao: 'Documentación',
    },
  },
}

export const textos: Record<Idioma, Textos> = {
  'pt-BR': {
    locale: 'pt-BR',
    casca: casca['pt-BR'],
    workspace: 'Operações',
    trilhaTarefas: 'Tarefas',
    trilhaPainel: 'Painel',

    titulo: 'Painel de tarefas',
    subtitulo: 'As tarefas criadas manualmente e as criadas por fluxo, num lugar só.',
    atualizadoAs: h => `Atualizado às ${h}`,
    atualizar: 'Atualizar',

    paineis: {
      abertas: { titulo: 'Abertas', descricao: 'Tarefas abertas agora, por status.' },
      vencidas: { titulo: 'Vencidas', descricao: 'Abertas com o prazo já vencido.' },
      aVencer: { titulo: 'A vencer', descricao: 'Abertas que vencem nos próximos 7 dias.' },
      concluidas: { titulo: 'Concluídas', descricao: 'Concluídas no período, comparadas ao período anterior.' },
      noPrazo: { titulo: 'Concluídas no prazo', descricao: 'Parte das concluídas com prazo que terminou até o prazo.' },
      tempo: { titulo: 'Tempo médio de conclusão', descricao: 'Da criação à conclusão, com a mediana.' },
      sla: { titulo: 'SLA', descricao: 'Situação do prazo das abertas agora e das concluídas no período.' },
      prazos: { titulo: 'Tempo até o prazo', descricao: 'Abertas, pelo tempo que falta para vencer.' },
      proximas: { titulo: 'Próximas a vencer', descricao: 'Abertas com prazo à frente, da mais próxima à mais distante.' },
      serie: { titulo: 'Criadas e concluídas', descricao: 'Quantas entraram e quantas saíram em cada período.' },
      status: { titulo: 'Status e situação do prazo', descricao: 'Cada status dividido pela situação do prazo.' },
      responsaveis: { titulo: 'Tarefas por responsável', descricao: 'Pessoas, grupos e as tarefas para todo mundo.' },
      tempoTarefa: { titulo: 'Tempo por tarefa', descricao: 'Da criação à conclusão, por tarefa do fluxo.' },
      tempoEtapa: { titulo: 'Tempo por etapa', descricao: 'Quanto o item fica em cada etapa do fluxo da categoria.' },
      tempoFluxo: { titulo: 'Tempo por fluxo', descricao: 'Do início ao fim de cada fluxo, da categoria e do Spaceflow.' },
    },

    grade: {
      personalizar: 'Personalizar',
      concluir: 'Concluir',
      adicionar: 'Adicionar painel',
      desfazer: 'Desfazer',
      restaurarPadrao: 'Restaurar padrão',
      dica: 'Arraste um painel para mudar de lugar. Puxe o canto inferior direito para mudar o tamanho.',
      soParaVoce: 'O arranjo vale só para você. Os números são os mesmos para todo o workspace.',
      maisAcoes: n => `Mais ações: ${n}`,
      telaCheia: 'Tela cheia',
      fecharTelaCheia: 'Sair da tela cheia',
      tamanhoPadrao: 'Tamanho padrão',
      ocultar: 'Ocultar painel',
      mover: n => `Mover ${n}. Use as setas.`,
      redimensionar: n => `Mudar o tamanho de ${n}. Use as setas.`,
      movido: (n, p, total) => `${n} na posição ${p} de ${total}.`,
      tamanho: (n, w, h) => `${n}: ${w} colunas por ${h} linhas.`,
      ocultado: n => `${n} saiu do painel. Ele volta por "Adicionar painel".`,
      restaurado: 'Painéis de volta ao arranjo padrão.',
      semHistorico: 'Nada para desfazer.',
      catalogo: {
        titulo: 'Adicionar painel',
        descricao: 'Os painéis ocultos voltam daqui. Clique num painel adicionado para tirá-lo da tela.',
        buscar: 'Buscar painel',
        adicionado: 'Adicionado',
        adicionar: 'Adicionar',
        adicionarPainel: n => `Adicionar ${n}`,
        ocultarPainel: n => `Ocultar ${n}`,
        nenhum: 'Nenhum painel com esse nome.',
        grupos: { numeros: 'Números', prazo: 'Prazo e SLA', volume: 'Volume e status', pessoas: 'Responsáveis', tempos: 'Tempos' },
        emTela: (n, total) => `${n} de ${total} na tela`,
      },
      vazioTitulo: 'Todos os painéis estão ocultos',
      vazioTexto: 'Adicione um painel para ver os números de novo.',
    },

    filtros: {
      periodo: 'Período',
      periodos: {
        '7d': 'Últimos 7 dias', '30d': 'Últimos 30 dias', '90d': 'Últimos 90 dias',
        'mes': 'Este mês', 'ano': 'Este ano', '12m': 'Últimos 12 meses', 'tudo': 'Todo o período',
      },
      intervalo: (de, ate) => `${de} a ${ate}`,
      origem: 'Origem',
      origens: { todas: 'Todas as origens', manual: 'Criadas manualmente', fluxo: 'Criadas por fluxo' },
      responsavel: 'Responsável',
      responsavelVazio: 'Todos os responsáveis',
      responsavelSelecionados: n => n === 1 ? '1 responsável' : `${n} responsáveis`,
      pessoas: 'Pessoas',
      grupos: 'Grupos',
      outros: 'Outros',
      categoria: 'Categoria',
      categoriaVazio: 'Todas as categorias',
      categoriaSelecionadas: n => n === 1 ? '1 categoria' : `${n} categorias`,
      limpar: 'Limpar filtros',
      buscar: 'Buscar',
    },
    rotulos: { todos: 'Todo mundo', externo: 'E-mail externo', sem: 'Sem responsável' },
    origemCurta: { manual: 'Manual', fluxo: 'Fluxo' },

    agora: 'Agora',
    noPeriodo: 'No período',
    comoCalculamos: 'Como calculamos',
    vsAnterior: 'vs. anterior',
    comparacao: 'Comparado ao período anterior, do mesmo tamanho. Em "Todo o período" não há comparação.',
    pontos: n => `${n} p.p.`,
    carregandoMais: 'Carregando mais',
    fimDaLista: n => n === 1 ? '1 no total' : `${n} no total`,

    kpi: {
      abertasDetalhe: (a, b, c) => `${a} não iniciadas, ${b} em andamento, ${c} bloqueadas`,
      vencidasDetalhe: pct => `${pct} das abertas`,
      aVencerDetalhe: n => `Próximos 7 dias, ${n} em até 24 h`,
      concluidasDetalhe: criadas => `${criadas} criadas no mesmo período`,
      noPrazoDetalhe: (a, b) => `${a} de ${b} que tinham prazo`,
      tempoDetalhe: m => `Mediana ${m}`,
    },
    regras: {
      abertas: 'Tarefas com status Pendente, Em andamento ou Bloqueada (tela de Rápidas) e Aguardando ou Trabalhando (tela de Agendadas), agora. Não entram as arquivadas, as da lixeira e as de item excluído.',
      vencidas: 'Abertas cujo prazo já passou. Prazo: "Data limite" nas rápidas e "Data Limite" do SLA nas agendadas.',
      aVencer: 'Abertas com prazo nos próximos 7 dias corridos, contando a partir de agora. O detalhe mostra quantas vencem em até 24 horas.',
      concluidas: 'Tarefas concluídas dentro do período, pela data de conclusão. Tarefa criada já concluída não tem essa data e fica de fora.',
      noPrazo: 'Das concluídas no período que tinham prazo, quantas terminaram até o prazo. Tarefa sem prazo não entra na conta.',
      tempo: 'Da criação à conclusão, em dias corridos, nas tarefas concluídas no período. A média sente a tarefa que ficou esquecida semanas; a mediana mostra o caso típico.',
      sla: 'Aberta: vencida se o prazo passou, a vencer se vence nos próximos 7 dias, no prazo se vence depois disso. Concluída: atrasada se terminou depois do prazo. Na tela de Agendadas, o Status de SLA "Atrasado" junta as vencidas e as concluídas com atraso. Tarefa do Spaceflow com prazo igual à hora de criação conta como sem prazo: é o nó sem prazo configurado.',
      prazos: 'Só tarefas abertas. Tempo entre agora e o prazo. As 2 faixas do meio formam o "a vencer".',
      proximas: 'Abertas com prazo à frente, da que vence primeiro à que vence por último. A lista carrega mais conforme você rola.',
      serie: 'Criadas pela data de criação e concluídas pela data de conclusão, em semanas de segunda a domingo, no horário de Brasília. Saldo: criadas menos concluídas. Positivo quer dizer que a fila cresceu.',
      status: 'O status de cada tela traduzido para um vocabulário só. A barra divide cada status pela situação do prazo. Abertas: situação agora. Concluídas: as do período.',
      responsaveis: 'Designada para: para quem a tarefa foi feita (responsável da rápida, tipo de responsável da tarefa de etapa). Quem assumiu: quem pegou ou concluiu a tarefa.',
      tempoTarefa: 'Da criação à conclusão, agrupado pelo nome da tarefa de etapa ou do nó do Spaceflow. As criadas manualmente ficam numa linha só: o nome livre de cada uma não agrupa nada. Nas agendadas com "Habilitar Atribuição", o tempo se divide em espera (até alguém assumir) e execução.',
      tempoEtapa: 'Do registro "start" ao "complete" da mesma etapa no histórico do item no fluxo da categoria (stages_log do flow item).',
      tempoFluxo: 'Fluxo da categoria: do primeiro "start" ao último "complete" do histórico do item, nos itens que concluíram o fluxo no período. Spaceflow: do início ao fim da execução concluída no período.',
    },

    sla: {
      abertasAgora: 'Abertas agora',
      concluidasNoPeriodo: 'Concluídas no período',
      prazoIgualACriacao: n => n === 1 ? '1 tarefa do Spaceflow tem prazo igual à hora de criação e conta como sem prazo.' : `${n} tarefas do Spaceflow têm prazo igual à hora de criação e contam como sem prazo.`,
      semDataDeConclusao: n => n === 1 ? '1 tarefa concluída não tem data de conclusão e fica fora.' : `${n} tarefas concluídas não têm data de conclusão e ficam fora.`,
      semTarefas: 'Nenhuma tarefa aqui.',
    },
    situacao: {
      no_prazo: 'No prazo', a_vencer: 'A vencer', vencida: 'Vencida', sem_prazo: 'Sem prazo',
      concluida_no_prazo: 'No prazo', atrasada: 'Atrasada', concluida_sem_prazo: 'Sem prazo', removida: 'Removida',
    },
    status: {
      nao_iniciada: 'Não iniciada', em_andamento: 'Em andamento', bloqueada: 'Bloqueada', concluida: 'Concluída', removida: 'Removida',
    },
    statusOrigem: {
      nao_iniciada: 'Pendente em Rápidas, Aguardando em Agendadas',
      em_andamento: 'Em andamento em Rápidas, Trabalhando em Agendadas',
      bloqueada: 'Só existe em Rápidas',
      concluida: 'Concluída em Rápidas, Completa em Agendadas',
      removida: 'Tarefas de Agendadas cujo item foi excluído',
    },

    prazos: {
      grupos: { vencidas: 'Vencidas', aVencer: 'A vencer', depois: 'Depois de 7 dias' },
      faixas: {
        vencida_7d_mais: 'Há mais de 7 dias',
        vencida_ate_7d: 'Há até 7 dias',
        ate_24h: 'Em até 24 h',
        de_1_a_7d: 'Em 1 a 7 dias',
        de_8_a_30d: 'Em 8 a 30 dias',
        mais_30d: 'Em mais de 30 dias',
        sem_prazo: 'Sem prazo',
      },
    },

    proximas: {
      vazio: 'Nenhuma tarefa aberta com prazo à frente.',
      venceEm: q => `em ${q}`,
    },

    serie: {
      criadas: 'Criadas',
      concluidas: 'Concluídas',
      agrupar: 'Agrupar por',
      semana: 'Semana',
      mes: 'Mês',
      ano: 'Ano',
      semanaDe: d => `Semana de ${d}`,
      saldo: n => `Saldo ${n}`,
      parcial: 'Parcial: conta só os dias dentro do período.',
      notaParcial: 'A primeira e a última barra podem cobrir só parte da semana, do mês ou do ano: a barra menor não é queda.',
      rotuloAcessivel: (c, k) => `Gráfico de barras: ${c} tarefas criadas e ${k} concluídas no período.`,
    },

    statusBloco: {
      abertasAgora: 'Abertas, agora',
      noPeriodo: 'No período',
    },

    resp: {
      modo: 'Contar por',
      designada: 'Designada para',
      executada: 'Quem assumiu',
      responsavel: 'Responsável',
      abertas: 'Abertas',
      vencidas: 'Vencidas',
      concluidas: 'Concluídas',
      noPrazo: 'No prazo',
      tempo: 'Tempo mediano',
      tipo: { pessoa: 'Pessoa', grupo: 'Grupo', todos: 'Todo mundo', externo: 'E-mail externo', sem: 'Sem responsável' },
      avisoSoma: 'Tarefa designada a 2 pessoas conta para as 2. A soma das linhas pode passar do total.',
      avisoGrupo: 'Tarefa de grupo conta na linha do grupo. Quem do grupo assumiu aparece em "Quem assumiu".',
      vazio: 'Nenhuma tarefa com esses filtros.',
    },

    tempos: {
      tarefa: 'Tarefa',
      avulsa: 'Tarefas criadas manualmente',
      n: 'Concluídas',
      media: 'Média',
      mediana: 'Mediana',
      p90: '90% em até',
      espera: 'Espera',
      execucao: 'Execução',
      agoraNaEtapa: 'Na etapa agora',
      emAndamento: 'Em andamento agora',
      concluidosNoPeriodo: 'Concluíram no período',
      passagens: 'Passagens',
      soFluxo: 'Tarefa criada manualmente não tem etapa nem fluxo. Troque a origem para Todas ou Criadas por fluxo.',
      semDados: 'Nada concluído no período.',
      esperaExecucaoAjuda: 'Espera: da criação até alguém assumir. Execução: de assumir até concluir. Só nas agendadas com "Habilitar Atribuição".',
      vies: 'A média conta só o que terminou. O que ainda está em andamento aparece ao lado, com a idade.',
      etapaSoCategoria: 'O Spaceflow não tem etapas. O tempo dele está em Tempo por fluxo, dividido pelas tarefas que ele cria.',
      gargalo: 'Etapa mais lenta do fluxo',
      composicao: 'Onde o tempo vai (mediana)',
      tipoDeFluxo: { categoria: 'Categoria', spaceflow: 'Spaceflow' },
      contagemComIdade: (n, idade) => `${n}, há ${idade}`,
    },

    gaveta: {
      contagem: n => n === 1 ? '1 tarefa' : `${n} tarefas`,
      tarefa: 'Tarefa',
      status: 'Status',
      prazo: 'Prazo',
      responsavel: 'Responsável',
      onde: 'Fluxo e etapa',
      criada: 'Criada em',
      concluida: 'Concluída em',
      buscar: 'Buscar tarefa',
      colunas: 'Colunas',
      exportar: 'Exportar',
      abrirAgendadas: 'Abrir em Agendadas',
      abrirRapidas: 'Abrir em Rápidas',
      maquete: 'No produto, cada linha abre a tarefa.',
      maqueteExportar: 'No produto, exporta esta lista em CSV.',
      vazio: 'Nenhuma tarefa neste recorte.',
      semPrazo: 'Sem prazo',
      venceuHa: q => `venceu há ${q}`,
      venceEm: q => `vence em ${q}`,
      mostrando: (de, ate, total) => `Mostrando ${de} a ${ate} de ${total}`,
      porPagina: n => `${n} por página`,
    },

    estados: {
      vazioTitulo: 'Ainda não há tarefas neste workspace',
      vazioTexto: 'Os números aparecem assim que o workspace tiver a primeira tarefa, criada manualmente ou por fluxo.',
      semResultadoTitulo: 'Nenhuma tarefa com esses filtros',
      semResultadoTexto: 'Amplie o período ou tire um filtro para ver os números.',
      erroTitulo: 'Não conseguimos carregar o painel',
      erroTexto: 'As tarefas continuam lá. Tente de novo em alguns segundos.',
      tentarDeNovo: 'Tentar de novo',
      semPermissaoTitulo: 'Seu perfil não vê o painel de tarefas',
      semPermissaoTexto: 'O painel mostra as tarefas do workspace inteiro. Peça acesso de leitura a Tarefas e a Tarefas Programadas a quem administra o workspace.',
    },

    unidades: { d: 'd', h: 'h', min: 'min', menosDeUmMin: 'menos de 1 min' },
    recortes: {
      abertas: 'Abertas agora',
      vencidas: 'Vencidas',
      aVencer: 'A vencer nos próximos 7 dias',
      concluidas: 'Concluídas no período',
      atrasadas: 'Concluídas com atraso',
      tempo: 'Concluídas no período, das mais lentas às mais rápidas',
    },
  },

  en: {
    locale: 'en-US',
    casca: casca.en,
    workspace: 'Operations',
    trilhaTarefas: 'Tasks',
    trilhaPainel: 'Dashboard',

    titulo: 'Task dashboard',
    subtitulo: 'Tasks created manually and tasks created by flows, in one place.',
    atualizadoAs: h => `Updated at ${h}`,
    atualizar: 'Refresh',

    paineis: {
      abertas: { titulo: 'Open', descricao: 'Tasks open right now, by status.' },
      vencidas: { titulo: 'Overdue', descricao: 'Open tasks past their due date.' },
      aVencer: { titulo: 'Due soon', descricao: 'Open tasks due in the next 7 days.' },
      concluidas: { titulo: 'Done', descricao: 'Done in the period, compared with the previous period.' },
      noPrazo: { titulo: 'Done on time', descricao: 'Share of done tasks with a due date that finished by it.' },
      tempo: { titulo: 'Average time to complete', descricao: 'From creation to completion, with the median.' },
      sla: { titulo: 'SLA', descricao: 'Due date situation of open tasks now and of tasks done in the period.' },
      prazos: { titulo: 'Time to due date', descricao: 'Open tasks, by how long until they are due.' },
      proximas: { titulo: 'Due next', descricao: 'Open tasks with an upcoming due date, nearest first.' },
      serie: { titulo: 'Created and done', descricao: 'How many came in and how many went out in each period.' },
      status: { titulo: 'Status and due date situation', descricao: 'Each status split by due date situation.' },
      responsaveis: { titulo: 'Tasks by assignee', descricao: 'People, groups and tasks for everybody.' },
      tempoTarefa: { titulo: 'Time by task', descricao: 'From creation to completion, by flow task.' },
      tempoEtapa: { titulo: 'Time by stage', descricao: 'How long the item stays in each stage of the category flow.' },
      tempoFluxo: { titulo: 'Time by flow', descricao: 'From start to finish of each flow, category and Spaceflow.' },
    },

    grade: {
      personalizar: 'Customize',
      concluir: 'Done',
      adicionar: 'Add panel',
      desfazer: 'Undo',
      restaurarPadrao: 'Restore default',
      dica: 'Drag a panel to move it. Pull the bottom right corner to resize it.',
      soParaVoce: 'The layout is yours alone. The numbers are the same for the whole workspace.',
      maisAcoes: n => `More actions: ${n}`,
      telaCheia: 'Full screen',
      fecharTelaCheia: 'Exit full screen',
      tamanhoPadrao: 'Default size',
      ocultar: 'Hide panel',
      mover: n => `Move ${n}. Use the arrow keys.`,
      redimensionar: n => `Resize ${n}. Use the arrow keys.`,
      movido: (n, p, total) => `${n} in position ${p} of ${total}.`,
      tamanho: (n, w, h) => `${n}: ${w} columns by ${h} rows.`,
      ocultado: n => `${n} left the dashboard. Bring it back with "Add panel".`,
      restaurado: 'Panels back to the default layout.',
      semHistorico: 'Nothing to undo.',
      catalogo: {
        titulo: 'Add panel',
        descricao: 'Hidden panels come back from here. Click an added panel to take it off the screen.',
        buscar: 'Search panels',
        adicionado: 'Added',
        adicionar: 'Add',
        adicionarPainel: n => `Add ${n}`,
        ocultarPainel: n => `Hide ${n}`,
        nenhum: 'No panel with that name.',
        grupos: { numeros: 'Numbers', prazo: 'Due dates and SLA', volume: 'Volume and status', pessoas: 'Assignees', tempos: 'Durations' },
        emTela: (n, total) => `${n} of ${total} on screen`,
      },
      vazioTitulo: 'All panels are hidden',
      vazioTexto: 'Add a panel to see the numbers again.',
    },

    filtros: {
      periodo: 'Period',
      periodos: {
        '7d': 'Last 7 days', '30d': 'Last 30 days', '90d': 'Last 90 days',
        'mes': 'This month', 'ano': 'This year', '12m': 'Last 12 months', 'tudo': 'All time',
      },
      intervalo: (de, ate) => `${de} to ${ate}`,
      origem: 'Source',
      origens: { todas: 'All sources', manual: 'Created manually', fluxo: 'Created by a flow' },
      responsavel: 'Assignee',
      responsavelVazio: 'All assignees',
      responsavelSelecionados: n => n === 1 ? '1 assignee' : `${n} assignees`,
      pessoas: 'People',
      grupos: 'Groups',
      outros: 'Other',
      categoria: 'Category',
      categoriaVazio: 'All categories',
      categoriaSelecionadas: n => n === 1 ? '1 category' : `${n} categories`,
      limpar: 'Clear filters',
      buscar: 'Search',
    },
    rotulos: { todos: 'Everybody', externo: 'External email', sem: 'Unassigned' },
    origemCurta: { manual: 'Manual', fluxo: 'Flow' },

    agora: 'Now',
    noPeriodo: 'In the period',
    comoCalculamos: 'How we count',
    vsAnterior: 'vs. previous',
    comparacao: 'Compared with the previous period of the same length. "All time" has no comparison.',
    pontos: n => `${n} pts`,
    carregandoMais: 'Loading more',
    fimDaLista: n => n === 1 ? '1 in total' : `${n} in total`,

    kpi: {
      abertasDetalhe: (a, b, c) => `${a} not started, ${b} in progress, ${c} blocked`,
      vencidasDetalhe: pct => `${pct} of open tasks`,
      aVencerDetalhe: n => `Next 7 days, ${n} within 24 h`,
      concluidasDetalhe: c => `${c} created in the same period`,
      noPrazoDetalhe: (a, b) => `${a} of ${b} that had a due date`,
      tempoDetalhe: m => `Median ${m}`,
    },
    regras: {
      abertas: 'Tasks that are Pending, In progress or Blocked (Quick screen) and Waiting or Working (Scheduled screen), right now. Archived tasks, tasks in the trash and tasks of deleted items are left out.',
      vencidas: 'Open tasks whose due date has passed. Due date: "Due date" on quick tasks and the SLA "Due date" on scheduled tasks.',
      aVencer: 'Open tasks due in the next 7 calendar days, counting from now. The detail shows how many are due within 24 hours.',
      concluidas: 'Tasks completed within the period, by completion date. A task created as already done has no such date and is left out.',
      noPrazo: 'Of the tasks completed in the period that had a due date, how many finished by it. Tasks with no due date are left out.',
      tempo: 'From creation to completion, in calendar days, for tasks completed in the period. The average feels the task forgotten for weeks; the median shows the typical case.',
      sla: 'Open: overdue if the due date has passed, due soon if it is due in the next 7 days, on time if it is due after that. Done: late if it finished after the due date. On the Scheduled screen, the SLA status "Late" groups overdue tasks and tasks done late. A Spaceflow task whose due date equals its creation time counts as having no due date: the node has no due date set.',
      prazos: 'Open tasks only. Time between now and the due date. The 2 middle bands make up "due soon".',
      proximas: 'Open tasks with an upcoming due date, from the first to the last one due. The list loads more as you scroll.',
      serie: 'Created by creation date and done by completion date, in Monday to Sunday weeks, Brasília time. Balance: created minus done. Positive means the queue grew.',
      status: 'Each screen status translated into one vocabulary. The bar splits each status by due date situation. Open: now. Done: in the period.',
      responsaveis: 'Assigned to: who the task was made for (quick task assignee, stage task responsibility type). Picked up by: who took or completed the task.',
      tempoTarefa: 'From creation to completion, grouped by stage task or Spaceflow node name. Tasks created manually share one row: each free name groups nothing. For scheduled tasks with "Enable assignment", time splits into waiting (until someone picks it up) and execution.',
      tempoEtapa: 'From the "start" to the "complete" record of the same stage in the item history of the category flow (flow item stages_log).',
      tempoFluxo: 'Category flow: from the first "start" to the last "complete" of the item history, for items that finished the flow in the period. Spaceflow: from start to end of each execution finished in the period.',
    },

    sla: {
      abertasAgora: 'Open now',
      concluidasNoPeriodo: 'Done in the period',
      prazoIgualACriacao: n => n === 1 ? '1 Spaceflow task has its due date equal to its creation time and counts as no due date.' : `${n} Spaceflow tasks have their due date equal to their creation time and count as no due date.`,
      semDataDeConclusao: n => n === 1 ? '1 done task has no completion date and is left out.' : `${n} done tasks have no completion date and are left out.`,
      semTarefas: 'No tasks here.',
    },
    situacao: {
      no_prazo: 'On time', a_vencer: 'Due soon', vencida: 'Overdue', sem_prazo: 'No due date',
      concluida_no_prazo: 'On time', atrasada: 'Late', concluida_sem_prazo: 'No due date', removida: 'Removed',
    },
    status: {
      nao_iniciada: 'Not started', em_andamento: 'In progress', bloqueada: 'Blocked', concluida: 'Done', removida: 'Removed',
    },
    statusOrigem: {
      nao_iniciada: 'Pending in Quick, Waiting in Scheduled',
      em_andamento: 'In progress in Quick, Working in Scheduled',
      bloqueada: 'Only in Quick',
      concluida: 'Completed in Quick, Complete in Scheduled',
      removida: 'Scheduled tasks whose item was deleted',
    },

    prazos: {
      grupos: { vencidas: 'Overdue', aVencer: 'Due soon', depois: 'After 7 days' },
      faixas: {
        vencida_7d_mais: 'More than 7 days ago',
        vencida_ate_7d: 'Up to 7 days ago',
        ate_24h: 'Within 24 h',
        de_1_a_7d: 'In 1 to 7 days',
        de_8_a_30d: 'In 8 to 30 days',
        mais_30d: 'In more than 30 days',
        sem_prazo: 'No due date',
      },
    },

    proximas: {
      vazio: 'No open task with an upcoming due date.',
      venceEm: q => `in ${q}`,
    },

    serie: {
      criadas: 'Created',
      concluidas: 'Done',
      agrupar: 'Group by',
      semana: 'Week',
      mes: 'Month',
      ano: 'Year',
      semanaDe: d => `Week of ${d}`,
      saldo: n => `Balance ${n}`,
      parcial: 'Partial: counts only the days inside the period.',
      notaParcial: 'The first and last bars may cover only part of the week, month or year: a shorter bar is not a drop.',
      rotuloAcessivel: (c, k) => `Bar chart: ${c} tasks created and ${k} done in the period.`,
    },

    statusBloco: {
      abertasAgora: 'Open, now',
      noPeriodo: 'In the period',
    },

    resp: {
      modo: 'Count by',
      designada: 'Assigned to',
      executada: 'Picked up by',
      responsavel: 'Assignee',
      abertas: 'Open',
      vencidas: 'Overdue',
      concluidas: 'Done',
      noPrazo: 'On time',
      tempo: 'Median time',
      tipo: { pessoa: 'Person', grupo: 'Group', todos: 'Everybody', externo: 'External email', sem: 'Unassigned' },
      avisoSoma: 'A task assigned to 2 people counts for both. Rows may add up to more than the total.',
      avisoGrupo: 'A group task counts on the group row. Who in the group picked it up shows under "Picked up by".',
      vazio: 'No tasks with these filters.',
    },

    tempos: {
      tarefa: 'Task',
      avulsa: 'Tasks created manually',
      n: 'Done',
      media: 'Average',
      mediana: 'Median',
      p90: '90% within',
      espera: 'Waiting',
      execucao: 'Execution',
      agoraNaEtapa: 'In the stage now',
      emAndamento: 'In progress now',
      concluidosNoPeriodo: 'Finished in the period',
      passagens: 'Passes',
      soFluxo: 'A task created manually has no stage or flow. Switch the source to All or Created by a flow.',
      semDados: 'Nothing finished in the period.',
      esperaExecucaoAjuda: 'Waiting: from creation until someone picks it up. Execution: from pickup to completion. Only on scheduled tasks with "Enable assignment".',
      vies: 'The average counts only what finished. What is still in progress shows alongside, with its age.',
      etapaSoCategoria: 'Spaceflow has no stages. Its time is under Time by flow, split by the tasks it creates.',
      gargalo: 'Slowest stage of the flow',
      composicao: 'Where the time goes (median)',
      tipoDeFluxo: { categoria: 'Category', spaceflow: 'Spaceflow' },
      contagemComIdade: (n, idade) => `${n}, for ${idade}`,
    },

    gaveta: {
      contagem: n => n === 1 ? '1 task' : `${n} tasks`,
      tarefa: 'Task',
      status: 'Status',
      prazo: 'Due date',
      responsavel: 'Assignee',
      onde: 'Flow and stage',
      criada: 'Created',
      concluida: 'Completed',
      buscar: 'Search tasks',
      colunas: 'Columns',
      exportar: 'Export',
      abrirAgendadas: 'Open in Scheduled',
      abrirRapidas: 'Open in Quick',
      maquete: 'In the product, each row opens the task.',
      maqueteExportar: 'In the product, this exports the list as CSV.',
      vazio: 'No tasks in this slice.',
      semPrazo: 'No due date',
      venceuHa: q => `overdue by ${q}`,
      venceEm: q => `due in ${q}`,
      mostrando: (de, ate, total) => `Showing ${de} to ${ate} of ${total}`,
      porPagina: n => `${n} per page`,
    },

    estados: {
      vazioTitulo: 'No tasks in this workspace yet',
      vazioTexto: 'The numbers show up as soon as the workspace has its first task, created manually or by a flow.',
      semResultadoTitulo: 'No tasks with these filters',
      semResultadoTexto: 'Widen the period or remove a filter to see the numbers.',
      erroTitulo: 'We could not load the dashboard',
      erroTexto: 'Your tasks are still there. Try again in a few seconds.',
      tentarDeNovo: 'Try again',
      semPermissaoTitulo: 'Your profile cannot see the task dashboard',
      semPermissaoTexto: 'The dashboard shows the tasks of the whole workspace. Ask a workspace admin for read access to Tasks and Scheduled Tasks.',
    },

    unidades: { d: 'd', h: 'h', min: 'min', menosDeUmMin: 'under 1 min' },
    recortes: {
      abertas: 'Open now',
      vencidas: 'Overdue',
      aVencer: 'Due in the next 7 days',
      concluidas: 'Done in the period',
      atrasadas: 'Done late',
      tempo: 'Done in the period, slowest first',
    },
  },

  es: {
    locale: 'es',
    casca: casca.es,
    workspace: 'Operaciones',
    trilhaTarefas: 'Tareas',
    trilhaPainel: 'Panel',

    titulo: 'Panel de tareas',
    subtitulo: 'Las tareas creadas manualmente y las creadas por flujo, en un solo lugar.',
    atualizadoAs: h => `Actualizado a las ${h}`,
    atualizar: 'Actualizar',

    paineis: {
      abertas: { titulo: 'Abiertas', descricao: 'Tareas abiertas ahora, por estado.' },
      vencidas: { titulo: 'Vencidas', descricao: 'Abiertas con el plazo ya vencido.' },
      aVencer: { titulo: 'Por vencer', descricao: 'Abiertas que vencen en los próximos 7 días.' },
      concluidas: { titulo: 'Concluidas', descricao: 'Concluidas en el período, comparadas con el período anterior.' },
      noPrazo: { titulo: 'Concluidas en plazo', descricao: 'Parte de las concluidas con plazo que terminó dentro del plazo.' },
      tempo: { titulo: 'Tiempo medio de conclusión', descricao: 'De la creación a la conclusión, con la mediana.' },
      sla: { titulo: 'SLA', descricao: 'Situación del plazo de las abiertas ahora y de las concluidas en el período.' },
      prazos: { titulo: 'Tiempo hasta el plazo', descricao: 'Abiertas, por el tiempo que falta para vencer.' },
      proximas: { titulo: 'Próximas a vencer', descricao: 'Abiertas con plazo por delante, de la más cercana a la más lejana.' },
      serie: { titulo: 'Creadas y concluidas', descricao: 'Cuántas entraron y cuántas salieron en cada período.' },
      status: { titulo: 'Estado y situación del plazo', descricao: 'Cada estado dividido por la situación del plazo.' },
      responsaveis: { titulo: 'Tareas por responsable', descricao: 'Personas, grupos y las tareas para todo el mundo.' },
      tempoTarefa: { titulo: 'Tiempo por tarea', descricao: 'De la creación a la conclusión, por tarea del flujo.' },
      tempoEtapa: { titulo: 'Tiempo por etapa', descricao: 'Cuánto se queda el ítem en cada etapa del flujo de la categoría.' },
      tempoFluxo: { titulo: 'Tiempo por flujo', descricao: 'Del inicio al fin de cada flujo, de la categoría y de Spaceflow.' },
    },

    grade: {
      personalizar: 'Personalizar',
      concluir: 'Listo',
      adicionar: 'Agregar panel',
      desfazer: 'Deshacer',
      restaurarPadrao: 'Restaurar estándar',
      dica: 'Arrastre un panel para cambiarlo de lugar. Tire de la esquina inferior derecha para cambiar el tamaño.',
      soParaVoce: 'La disposición vale solo para usted. Los números son los mismos para todo el workspace.',
      maisAcoes: n => `Más acciones: ${n}`,
      telaCheia: 'Pantalla completa',
      fecharTelaCheia: 'Salir de pantalla completa',
      tamanhoPadrao: 'Tamaño estándar',
      ocultar: 'Ocultar panel',
      mover: n => `Mover ${n}. Use las flechas.`,
      redimensionar: n => `Cambiar el tamaño de ${n}. Use las flechas.`,
      movido: (n, p, total) => `${n} en la posición ${p} de ${total}.`,
      tamanho: (n, w, h) => `${n}: ${w} columnas por ${h} filas.`,
      ocultado: n => `${n} salió del panel. Vuelve por "Agregar panel".`,
      restaurado: 'Paneles de vuelta a la disposición estándar.',
      semHistorico: 'Nada para deshacer.',
      catalogo: {
        titulo: 'Agregar panel',
        descricao: 'Los paneles ocultos vuelven desde aquí. Haga clic en un panel agregado para quitarlo de la pantalla.',
        buscar: 'Buscar panel',
        adicionado: 'Agregado',
        adicionar: 'Agregar',
        adicionarPainel: n => `Agregar ${n}`,
        ocultarPainel: n => `Ocultar ${n}`,
        nenhum: 'Ningún panel con ese nombre.',
        grupos: { numeros: 'Números', prazo: 'Plazo y SLA', volume: 'Volumen y estado', pessoas: 'Responsables', tempos: 'Tiempos' },
        emTela: (n, total) => `${n} de ${total} en pantalla`,
      },
      vazioTitulo: 'Todos los paneles están ocultos',
      vazioTexto: 'Agregue un panel para ver los números de nuevo.',
    },

    filtros: {
      periodo: 'Período',
      periodos: {
        '7d': 'Últimos 7 días', '30d': 'Últimos 30 días', '90d': 'Últimos 90 días',
        'mes': 'Este mes', 'ano': 'Este año', '12m': 'Últimos 12 meses', 'tudo': 'Todo el período',
      },
      intervalo: (de, ate) => `${de} a ${ate}`,
      origem: 'Origen',
      origens: { todas: 'Todos los orígenes', manual: 'Creadas manualmente', fluxo: 'Creadas por flujo' },
      responsavel: 'Responsable',
      responsavelVazio: 'Todos los responsables',
      responsavelSelecionados: n => n === 1 ? '1 responsable' : `${n} responsables`,
      pessoas: 'Personas',
      grupos: 'Grupos',
      outros: 'Otros',
      categoria: 'Categoría',
      categoriaVazio: 'Todas las categorías',
      categoriaSelecionadas: n => n === 1 ? '1 categoría' : `${n} categorías`,
      limpar: 'Limpiar filtros',
      buscar: 'Buscar',
    },
    rotulos: { todos: 'Todo el mundo', externo: 'Correo externo', sem: 'Sin responsable' },
    origemCurta: { manual: 'Manual', fluxo: 'Flujo' },

    agora: 'Ahora',
    noPeriodo: 'En el período',
    comoCalculamos: 'Cómo calculamos',
    vsAnterior: 'vs. anterior',
    comparacao: 'Comparado con el período anterior, del mismo tamaño. En "Todo el período" no hay comparación.',
    pontos: n => `${n} p.p.`,
    carregandoMais: 'Cargando más',
    fimDaLista: n => n === 1 ? '1 en total' : `${n} en total`,

    kpi: {
      abertasDetalhe: (a, b, c) => `${a} sin iniciar, ${b} en curso, ${c} bloqueadas`,
      vencidasDetalhe: pct => `${pct} de las abiertas`,
      aVencerDetalhe: n => `Próximos 7 días, ${n} en hasta 24 h`,
      concluidasDetalhe: c => `${c} creadas en el mismo período`,
      noPrazoDetalhe: (a, b) => `${a} de ${b} que tenían plazo`,
      tempoDetalhe: m => `Mediana ${m}`,
    },
    regras: {
      abertas: 'Tareas en Pendiente, En curso o Bloqueada (pantalla de Rápidas) y Esperando o Trabajando (pantalla de Programadas), ahora. No entran las archivadas, las de la papelera ni las de ítem eliminado.',
      vencidas: 'Abiertas cuyo plazo ya pasó. Plazo: "Fecha límite" en las rápidas y "Fecha límite" del SLA en las programadas.',
      aVencer: 'Abiertas con plazo en los próximos 7 días corridos, contando desde ahora. El detalle muestra cuántas vencen en hasta 24 horas.',
      concluidas: 'Tareas concluidas dentro del período, por fecha de conclusión. La tarea creada ya concluida no tiene esa fecha y queda fuera.',
      noPrazo: 'De las concluidas en el período que tenían plazo, cuántas terminaron dentro del plazo. Las tareas sin plazo no entran en la cuenta.',
      tempo: 'De la creación a la conclusión, en días corridos, en las tareas concluidas en el período. La media siente la tarea olvidada por semanas; la mediana muestra el caso típico.',
      sla: 'Abierta: vencida si el plazo pasó, por vencer si vence en los próximos 7 días, en plazo si vence después. Concluida: atrasada si terminó después del plazo. En la pantalla de Programadas, el Estado de SLA "Atrasado" junta las vencidas y las concluidas con atraso. La tarea de Spaceflow con plazo igual a la hora de creación cuenta como sin plazo: es el nodo sin plazo configurado.',
      prazos: 'Solo tareas abiertas. Tiempo entre ahora y el plazo. Las 2 franjas del medio forman el "por vencer".',
      proximas: 'Abiertas con plazo por delante, de la que vence primero a la que vence última. La lista carga más a medida que usted se desplaza.',
      serie: 'Creadas por fecha de creación y concluidas por fecha de conclusión, en semanas de lunes a domingo, hora de Brasilia. Saldo: creadas menos concluidas. Positivo quiere decir que la fila creció.',
      status: 'El estado de cada pantalla traducido a un solo vocabulario. La barra divide cada estado por la situación del plazo. Abiertas: ahora. Concluidas: las del período.',
      responsaveis: 'Asignada a: para quién se hizo la tarea (responsable de la rápida, tipo de responsable de la tarea de etapa). Quién la tomó: quien la tomó o la concluyó.',
      tempoTarefa: 'De la creación a la conclusión, agrupado por el nombre de la tarea de etapa o del nodo de Spaceflow. Las creadas manualmente quedan en una sola fila: el nombre libre de cada una no agrupa nada. En las programadas con "Habilitar asignación", el tiempo se divide en espera (hasta que alguien la toma) y ejecución.',
      tempoEtapa: 'Del registro "start" al "complete" de la misma etapa en el historial del ítem en el flujo de la categoría (stages_log del flow item).',
      tempoFluxo: 'Flujo de la categoría: del primer "start" al último "complete" del historial del ítem, en los ítems que concluyeron el flujo en el período. Spaceflow: del inicio al fin de la ejecución concluida en el período.',
    },

    sla: {
      abertasAgora: 'Abiertas ahora',
      concluidasNoPeriodo: 'Concluidas en el período',
      prazoIgualACriacao: n => n === 1 ? '1 tarea de Spaceflow tiene el plazo igual a la hora de creación y cuenta como sin plazo.' : `${n} tareas de Spaceflow tienen el plazo igual a la hora de creación y cuentan como sin plazo.`,
      semDataDeConclusao: n => n === 1 ? '1 tarea concluida no tiene fecha de conclusión y queda fuera.' : `${n} tareas concluidas no tienen fecha de conclusión y quedan fuera.`,
      semTarefas: 'Ninguna tarea aquí.',
    },
    situacao: {
      no_prazo: 'En plazo', a_vencer: 'Por vencer', vencida: 'Vencida', sem_prazo: 'Sin plazo',
      concluida_no_prazo: 'En plazo', atrasada: 'Atrasada', concluida_sem_prazo: 'Sin plazo', removida: 'Eliminada',
    },
    status: {
      nao_iniciada: 'Sin iniciar', em_andamento: 'En curso', bloqueada: 'Bloqueada', concluida: 'Concluida', removida: 'Eliminada',
    },
    statusOrigem: {
      nao_iniciada: 'Pendiente en Rápidas, Esperando en Programadas',
      em_andamento: 'En curso en Rápidas, Trabajando en Programadas',
      bloqueada: 'Solo existe en Rápidas',
      concluida: 'Concluida en Rápidas, Completa en Programadas',
      removida: 'Tareas de Programadas cuyo ítem fue eliminado',
    },

    prazos: {
      grupos: { vencidas: 'Vencidas', aVencer: 'Por vencer', depois: 'Después de 7 días' },
      faixas: {
        vencida_7d_mais: 'Hace más de 7 días',
        vencida_ate_7d: 'Hace hasta 7 días',
        ate_24h: 'En hasta 24 h',
        de_1_a_7d: 'En 1 a 7 días',
        de_8_a_30d: 'En 8 a 30 días',
        mais_30d: 'En más de 30 días',
        sem_prazo: 'Sin plazo',
      },
    },

    proximas: {
      vazio: 'Ninguna tarea abierta con plazo por delante.',
      venceEm: q => `en ${q}`,
    },

    serie: {
      criadas: 'Creadas',
      concluidas: 'Concluidas',
      agrupar: 'Agrupar por',
      semana: 'Semana',
      mes: 'Mes',
      ano: 'Año',
      semanaDe: d => `Semana del ${d}`,
      saldo: n => `Saldo ${n}`,
      parcial: 'Parcial: cuenta solo los días dentro del período.',
      notaParcial: 'La primera y la última barra pueden cubrir solo parte de la semana, del mes o del año: la barra menor no es una caída.',
      rotuloAcessivel: (c, k) => `Gráfico de barras: ${c} tareas creadas y ${k} concluidas en el período.`,
    },

    statusBloco: {
      abertasAgora: 'Abiertas, ahora',
      noPeriodo: 'En el período',
    },

    resp: {
      modo: 'Contar por',
      designada: 'Asignada a',
      executada: 'Quién la tomó',
      responsavel: 'Responsable',
      abertas: 'Abiertas',
      vencidas: 'Vencidas',
      concluidas: 'Concluidas',
      noPrazo: 'En plazo',
      tempo: 'Tiempo mediano',
      tipo: { pessoa: 'Persona', grupo: 'Grupo', todos: 'Todo el mundo', externo: 'Correo externo', sem: 'Sin responsable' },
      avisoSoma: 'La tarea asignada a 2 personas cuenta para las 2. La suma de las filas puede pasar del total.',
      avisoGrupo: 'La tarea de grupo cuenta en la fila del grupo. Quién del grupo la tomó aparece en "Quién la tomó".',
      vazio: 'Ninguna tarea con estos filtros.',
    },

    tempos: {
      tarefa: 'Tarea',
      avulsa: 'Tareas creadas manualmente',
      n: 'Concluidas',
      media: 'Media',
      mediana: 'Mediana',
      p90: '90% en hasta',
      espera: 'Espera',
      execucao: 'Ejecución',
      agoraNaEtapa: 'En la etapa ahora',
      emAndamento: 'En curso ahora',
      concluidosNoPeriodo: 'Concluyeron en el período',
      passagens: 'Pasos',
      soFluxo: 'La tarea creada manualmente no tiene etapa ni flujo. Cambie el origen a Todos o Creadas por flujo.',
      semDados: 'Nada concluido en el período.',
      esperaExecucaoAjuda: 'Espera: de la creación hasta que alguien la toma. Ejecución: de tomarla a concluirla. Solo en las programadas con "Habilitar asignación".',
      vies: 'La media cuenta solo lo que terminó. Lo que sigue en curso aparece al lado, con su antigüedad.',
      etapaSoCategoria: 'Spaceflow no tiene etapas. Su tiempo está en Tiempo por flujo, dividido por las tareas que crea.',
      gargalo: 'Etapa más lenta del flujo',
      composicao: 'Adónde va el tiempo (mediana)',
      tipoDeFluxo: { categoria: 'Categoría', spaceflow: 'Spaceflow' },
      contagemComIdade: (n, idade) => `${n}, hace ${idade}`,
    },

    gaveta: {
      contagem: n => n === 1 ? '1 tarea' : `${n} tareas`,
      tarefa: 'Tarea',
      status: 'Estado',
      prazo: 'Plazo',
      responsavel: 'Responsable',
      onde: 'Flujo y etapa',
      criada: 'Creada el',
      concluida: 'Concluida el',
      buscar: 'Buscar tarea',
      colunas: 'Columnas',
      exportar: 'Exportar',
      abrirAgendadas: 'Abrir en Programadas',
      abrirRapidas: 'Abrir en Rápidas',
      maquete: 'En el producto, cada fila abre la tarea.',
      maqueteExportar: 'En el producto, exporta esta lista en CSV.',
      vazio: 'Ninguna tarea en este recorte.',
      semPrazo: 'Sin plazo',
      venceuHa: q => `venció hace ${q}`,
      venceEm: q => `vence en ${q}`,
      mostrando: (de, ate, total) => `Mostrando ${de} a ${ate} de ${total}`,
      porPagina: n => `${n} por página`,
    },

    estados: {
      vazioTitulo: 'Aún no hay tareas en este workspace',
      vazioTexto: 'Los números aparecen en cuanto el workspace tenga su primera tarea, creada manualmente o por flujo.',
      semResultadoTitulo: 'Ninguna tarea con estos filtros',
      semResultadoTexto: 'Amplíe el período o quite un filtro para ver los números.',
      erroTitulo: 'No pudimos cargar el panel',
      erroTexto: 'Sus tareas siguen ahí. Intente de nuevo en unos segundos.',
      tentarDeNovo: 'Intentar de nuevo',
      semPermissaoTitulo: 'Su perfil no ve el panel de tareas',
      semPermissaoTexto: 'El panel muestra las tareas de todo el workspace. Pida acceso de lectura a Tareas y a Tareas Programadas a quien administra el workspace.',
    },

    unidades: { d: 'd', h: 'h', min: 'min', menosDeUmMin: 'menos de 1 min' },
    recortes: {
      abertas: 'Abiertas ahora',
      vencidas: 'Vencidas',
      aVencer: 'Por vencer en los próximos 7 días',
      concluidas: 'Concluidas en el período',
      atrasadas: 'Concluidas con atraso',
      tempo: 'Concluidas en el período, de las más lentas a las más rápidas',
    },
  },
}
