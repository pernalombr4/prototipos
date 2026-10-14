/**
 * A copy do protótipo "Nó de Atraso" nos três idiomas do ENSPACE.
 *
 * - `casca`, `editor`, `nos` e `hoje`: cópia do develop em 14/10/2026, com a
 *   caixa alta como está lá ("Nome do Nó", "Quantidade de Tempo", "MODIFICADO").
 *   Não é proposta;
 * - `proposta`: o texto novo, escrito para ir ao produto.
 *
 * Sem travessão em nada que aparece na tela (regra 33).
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Direcao, Unidade, UnidadeDoDeslocamento } from './mocks'

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
  trilha: { configuracoes: string, dados: string, spaceflows: string }
  editor: {
    abas: { editor: string, execucoes: string, versoes: string, comentarios: string, logs: string }
    adicionarNo: string
    salvar: string
    detalhes: string
    zoomMais: string
    zoomMenos: string
    ajustar: string
    organizar: string
  }
  nos: {
    start: { titulo: string, quandoUmItemFor: string, criado: string, naCategoria: string }
    atraso: { titulo: string, descricao: string }
    email: { titulo: string, descricao: string }
    end: { titulo: string, descricao: string }
    modificado: string
    ok: string
    erros: (n: number) => string
    semAlvo: string
  }
  categoria: string

  /** O modal como é hoje. */
  hoje: {
    titulo: string
    nomeDoNo: string
    quantidade: string
    unidade: string
    unidades: Record<Unidade, string>
    ajudaNome: string
    ajudaQuantidade: string
    ajudaUnidade: string
    fechar: string
    cancelar: string
    salvarEFechar: string
    modificado: string
    entrada: string
    saida: string
    /** O painel que a faixa ENTRADA abre, copiado do develop. */
    variaveisDeEntrada: string
    arrasteAsVariaveis: string
    filtrar: string
    recolher: string
    gatilho: string
  }

  proposta: {
    esperar: string
    modos: { duration: { titulo: string, descricao: string }, until_date: { titulo: string, descricao: string } }
    erroQuantidade: string
    continuar: string
    quanto: string
    direcoes: Record<Direcao, string>
    unidadeDoDeslocamento: (u: UnidadeDoDeslocamento, n: number) => string
    campo: string
    erroCampo: string
    naoEhData: (variavel: string) => string
    naoReconhecida: string
    lidaComo: (campo: string, no: string) => string
    soltarAqui: string
    semVariaveis: string
    abrirVariaveis: string
    horario: string
    horarioDoCampo: string
    fuso: string
    horarioEmHoras: string
    sePassou: string
    seVazio: string
    continuarNaHora: string
    encerrar: string
    recalcular: string
    recalcularDescricao: (campo: string | null) => string
    previa: string
    previaDescricao: (n: number, categoria: string) => string
    previaSemCampo: string
    verComOItem: string
    contagem: { agendado: (n: number) => string, passou: (n: number) => string, vazio: (n: number) => string }
    resultado: {
      agendado: (campo: string, data: string, continua: string, hora: string) => string
      passouContinua: string
      passouEncerra: string
      vazioContinua: (campo: string) => string
      vazioEncerra: (campo: string) => string
    }
    linha: { hoje: string, continua: string }
    verCalculo: string
    calculoDescricao: string
    resumoTempo: (n: number, unidade: string) => string
    resumoData: (quanto: string, direcao: string, campo: string, hora: string | null) => string
    resumoVazio: string
    salvo: string
    /** O "?" de cada opção dos dropdowns: o que acontece ao escolher. */
    ajudas: {
      tipo: Record<'duration' | 'until_date', string>
      unidade: Record<Unidade, string>
      deslocamento: Record<UnidadeDoDeslocamento, string>
      direcao: Record<Direcao, string>
      passou: Record<'continue' | 'end', string>
      vazio: Record<'continue' | 'end', string>
    }
    ajudaDaOpcao: string
    /** A instrução curta embaixo de cada campo. */
    instrucoes: {
      nome: string
      tipo: string
      quantidade: string
      unidade: string
      campo: string
      retomar: string
      horario: string
      sePassou: string
      seVazio: string
    }
  }
}

const unidadesPt: Record<UnidadeDoDeslocamento, [string, string]> = {
  hour: ['hora', 'horas'], day: ['dia', 'dias'], week: ['semana', 'semanas'], month: ['mês', 'meses'],
}
const unidadesEn: Record<UnidadeDoDeslocamento, [string, string]> = {
  hour: ['hour', 'hours'], day: ['day', 'days'], week: ['week', 'weeks'], month: ['month', 'months'],
}
const unidadesEs: Record<UnidadeDoDeslocamento, [string, string]> = {
  hour: ['hora', 'horas'], day: ['día', 'días'], week: ['semana', 'semanas'], month: ['mes', 'meses'],
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
      estrutura: 'Estrutura', listas: 'Listas', spaceflow: 'Spaceflow',
      gestaoDeMembros: 'Gestão de Membros', interface: 'Interface',
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
      estrutura: 'Structure', listas: 'Lists', spaceflow: 'Spaceflow',
      gestaoDeMembros: 'Member management', interface: 'Interface',
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
      estrutura: 'Estructura', listas: 'Listas', spaceflow: 'Spaceflow',
      gestaoDeMembros: 'Gestión de Miembros', interface: 'Interfaz',
      emails: 'Correos', integracoes: 'Integraciones', agentesDeIa: 'Agentes de IA', logs: 'Registros',
      releases: 'Releases', documentacao: 'Documentación',
    },
  },
}

const pt: Textos = {
  locale: 'pt-BR',
  casca: casca['pt-BR'],
  trilha: { configuracoes: 'Configurações', dados: 'Dados', spaceflows: 'Spaceflows' },
  editor: {
    abas: { editor: 'Editor', execucoes: 'Execuções', versoes: 'Versões', comentarios: 'Comentários', logs: 'Logs' },
    adicionarNo: 'Adicionar Nó',
    salvar: 'Salvar',
    detalhes: 'Detalhes do fluxo',
    zoomMais: 'Aproximar',
    zoomMenos: 'Afastar',
    ajustar: 'Ajustar à tela',
    organizar: 'Organizar',
  },
  nos: {
    start: { titulo: 'Start', quandoUmItemFor: 'Quando um item for', criado: 'criado', naCategoria: 'na categoria' },
    atraso: { titulo: 'Atraso', descricao: 'Atrasa o fluxo por um período de tempo especificado.' },
    email: { titulo: 'E-mail', descricao: 'Avisar o responsável pelo contrato' },
    end: { titulo: 'End', descricao: 'Marca o encerramento do fluxo. Após essa etapa, nenhuma ação é executada.' },
    modificado: 'MODIFICADO',
    ok: 'OK',
    erros: n => `${n} ERRO(S)`,
    semAlvo: 'Nenhum alvo conectado',
  },
  categoria: 'Contratos',
  hoje: {
    titulo: 'Atraso',
    nomeDoNo: 'Nome do Nó',
    quantidade: 'Quantidade de Tempo',
    unidade: 'Unidade',
    unidades: { second: 'Segundos', minute: 'Minutos', hour: 'Horas', day: 'Dias' },
    ajudaNome: 'Nome que identifica o nó no fluxo.',
    ajudaQuantidade: 'Defina a quantidade de tempo para atrasar a execução do fluxo de trabalho.',
    ajudaUnidade: 'Unidade de medida do tempo de atraso.',
    fechar: 'Fechar',
    cancelar: 'Cancelar',
    salvarEFechar: 'Salvar e fechar',
    modificado: 'Modificado',
    entrada: 'ENTRADA',
    saida: 'SAÍDA',
    variaveisDeEntrada: 'Variáveis de Entrada',
    arrasteAsVariaveis: 'Arraste as variáveis para os campos que você deseja configurar.',
    filtrar: 'Filtrar por nome ou chave...',
    recolher: 'Recolher',
    gatilho: '(trigger)',
  },
  proposta: {
    esperar: 'Tipo de atraso',
    modos: {
      duration: { titulo: 'Duração fixa', descricao: 'Pausa a execução por um período definido.' },
      until_date: { titulo: 'Data de referência', descricao: 'Pausa a execução até uma data calculada a partir de um campo de data.' },
    },
    erroQuantidade: 'Informe um número inteiro maior que zero.',
    continuar: 'Avançar para o próximo nó',
    quanto: 'Quantidade',
    direcoes: { before: 'antes de', after: 'depois de', on: 'na data de' },
    unidadeDoDeslocamento: (u, n) => unidadesPt[u][n === 1 ? 0 : 1],
    campo: 'Campo de data',
    erroCampo: 'Arraste uma variável de data para este campo.',
    naoEhData: variavel => `${variavel} não é uma data. Arraste uma variável de data.`,
    naoReconhecida: 'Variável não encontrada entre as que chegam a este nó. Confira o nome ou arraste de Variáveis de Entrada.',
    lidaComo: (campo, no) => `Usando ${campo}, do nó ${no}.`,
    soltarAqui: 'Solte aqui para usar esta data',
    semVariaveis: 'Nenhuma variável chega até este nó. Ligue um nó antes do Atraso.',
    abrirVariaveis: 'Abrir Variáveis de Entrada',
    horario: 'Horário',
    horarioDoCampo: 'Horário registrado no campo',
    fuso: 'Fuso horário do workspace: Brasília (UTC−3).',
    horarioEmHoras: 'Com o intervalo em horas, vale o horário registrado no campo.',
    sePassou: 'Quando a data calculada já tiver passado',
    seVazio: 'Quando o campo não estiver preenchido',
    continuarNaHora: 'Avançar para o próximo nó',
    encerrar: 'Encerrar o fluxo',
    recalcular: 'Recalcular quando o campo for alterado',
    recalcularDescricao: campo => `Se o campo ${campo ?? "de data"} for alterado durante o atraso, a espera passa a usar a nova data.`,
    previa: 'Simulação',
    previaDescricao: (n, categoria) => `Calculada com os ${n} itens abertos de ${categoria}. Cada item criado segue a mesma regra.`,
    previaSemCampo: 'Arraste a variável de data para simular quando cada item avança.',
    verComOItem: 'Item de exemplo',
    contagem: {
      agendado: n => `${n} aguardando`,
      passou: n => `${n} com data já passada`,
      vazio: n => `${n} sem data preenchida`,
    },
    resultado: {
      agendado: (campo, data, continua, hora) => `${campo}: ${data}. Avança para o próximo nó em ${continua}, às ${hora}.`,
      passouContinua: 'A data calculada já passou. O fluxo avança para o próximo nó na hora.',
      passouEncerra: 'A data calculada já passou. O fluxo é encerrado neste nó.',
      vazioContinua: campo => `O campo ${campo} não está preenchido. O fluxo avança para o próximo nó na hora.`,
      vazioEncerra: campo => `O campo ${campo} não está preenchido. O fluxo é encerrado neste nó.`,
    },
    linha: { hoje: 'Hoje', continua: 'Avança' },
    verCalculo: 'Ver cálculo',
    calculoDescricao: 'Configuração gravada no nó e cálculo executado pelo Spaceflow, para referência de quem configura pela API.',
    resumoTempo: (n, unidade) => `Aguarda ${n} ${unidade}.`,
    resumoData: (quanto, direcao, campo, hora) => `Avança ${quanto ? `${quanto} ` : ''}${direcao} ${campo}${hora ? `, às ${hora}` : ''}.`,
    resumoVazio: 'Atraso não configurado.',
    salvo: 'Nó de Atraso salvo',
    ajudaDaOpcao: 'O que esta opção faz',
    ajudas: {
      tipo: {
        duration: 'O fluxo espera o tempo informado e depois segue para o próximo nó. Ex.: 3 dias.',
        until_date: 'O fluxo espera até uma data calculada a partir de um campo do item. Ex.: 30 dias antes do vencimento.',
      },
      unidade: {
        second: 'A quantidade é contada em segundos.',
        minute: 'A quantidade é contada em minutos.',
        hour: 'A quantidade é contada em horas.',
        day: 'A quantidade é contada em dias corridos, com fins de semana e feriados.',
      },
      deslocamento: {
        day: 'Dias corridos, com fins de semana e feriados.',
        week: 'Cada semana vale 7 dias corridos.',
        month: 'Meses do calendário. 1 mês antes de 31/03 é 28/02.',
        hour: 'Horas contadas a partir da hora gravada no campo. O Horário deixa de valer.',
      },
      direcao: {
        before: 'O fluxo segue antes da data do campo. Ex.: 30 dias antes do vencimento.',
        after: 'O fluxo segue depois da data do campo. Ex.: 5 dias depois da assinatura.',
        on: 'O fluxo segue no próprio dia da data do campo.',
      },
      passou: {
        continue: 'O fluxo não espera: segue na hora para o nó ligado depois do Atraso.',
        end: 'O fluxo para neste nó. Os nós seguintes não rodam para este item.',
      },
      vazio: {
        continue: 'Sem data para calcular, o fluxo segue na hora para o nó ligado depois do Atraso.',
        end: 'Sem data para calcular, o fluxo para neste nó. Os nós seguintes não rodam para este item.',
      },
    },
    instrucoes: {
      nome: 'Nome que aparece no card do nó, no fluxo.',
      tipo: 'Define se o fluxo espera um tempo fixo ou até uma data.',
      quantidade: 'Por quanto tempo o fluxo fica parado neste nó.',
      unidade: 'Medida da quantidade de tempo.',
      campo: 'Arraste aqui a variável com a data de base, a partir de Variáveis de Entrada.',
      retomar: 'Quanto tempo antes ou depois dessa data o fluxo segue para o próximo nó.',
      horario: 'Hora do dia em que o fluxo segue para o próximo nó, no fuso do workspace: Brasília (UTC−3).',
      sePassou: 'O que fazer se a data calculada já tiver passado quando o item chegar a este nó.',
      seVazio: 'O que fazer se o item não tiver essa data preenchida.',
    },
  },
}

const en: Textos = {
  locale: 'en',
  casca: casca.en,
  trilha: { configuracoes: 'Settings', dados: 'Data', spaceflows: 'Spaceflows' },
  editor: {
    abas: { editor: 'Editor', execucoes: 'Executions', versoes: 'Versions', comentarios: 'Comments', logs: 'Logs' },
    adicionarNo: 'Add Node',
    salvar: 'Save',
    detalhes: 'Flow details',
    zoomMais: 'Zoom in',
    zoomMenos: 'Zoom out',
    ajustar: 'Fit to screen',
    organizar: 'Arrange',
  },
  nos: {
    start: { titulo: 'Start', quandoUmItemFor: 'When an item is', criado: 'created', naCategoria: 'in the category' },
    atraso: { titulo: 'Delay', descricao: 'Delays the flow for a specified period of time.' },
    email: { titulo: 'Email', descricao: 'Notify the contract owner' },
    end: { titulo: 'End', descricao: 'Marks the end of the flow. After this step, no action runs.' },
    modificado: 'MODIFIED',
    ok: 'OK',
    erros: n => `${n} ERROR(S)`,
    semAlvo: 'No target connected',
  },
  categoria: 'Contracts',
  hoje: {
    titulo: 'Delay',
    nomeDoNo: 'Node Name',
    quantidade: 'Amount of Time',
    unidade: 'Unit',
    unidades: { second: 'Seconds', minute: 'Minutes', hour: 'Hours', day: 'Days' },
    ajudaNome: 'Name that identifies the node in the flow.',
    ajudaQuantidade: 'Set the amount of time to delay the workflow execution.',
    ajudaUnidade: 'Unit of the delay time.',
    fechar: 'Close',
    cancelar: 'Cancel',
    salvarEFechar: 'Save and close',
    modificado: 'Modified',
    entrada: 'INPUT',
    saida: 'OUTPUT',
    variaveisDeEntrada: 'Input Variables',
    arrasteAsVariaveis: 'Drag the variables to the fields you want to set up.',
    filtrar: 'Filter by name or key...',
    recolher: 'Collapse',
    gatilho: '(trigger)',
  },
  proposta: {
    esperar: 'Delay type',
    modos: {
      duration: { titulo: 'Fixed duration', descricao: 'Pauses the execution for a set period.' },
      until_date: { titulo: 'Reference date', descricao: 'Pauses the execution until a date calculated from a date field.' },
    },
    erroQuantidade: 'Enter a whole number greater than zero.',
    continuar: 'Move to the next node',
    quanto: 'Amount',
    direcoes: { before: 'before', after: 'after', on: 'on' },
    unidadeDoDeslocamento: (u, n) => unidadesEn[u][n === 1 ? 0 : 1],
    campo: 'Date field',
    erroCampo: 'Drag a date variable to this field.',
    naoEhData: variavel => `${variavel} is not a date. Drag a date variable.`,
    naoReconhecida: 'Variable not found among the ones that reach this node. Check the name or drag it from Input Variables.',
    lidaComo: (campo, no) => `Using ${campo}, from the ${no} node.`,
    soltarAqui: 'Drop here to use this date',
    semVariaveis: 'No variable reaches this node. Connect a node before the Delay.',
    abrirVariaveis: 'Open Input Variables',
    horario: 'Time',
    horarioDoCampo: 'Time saved in the field',
    fuso: 'Workspace time zone: Brasília (UTC−3).',
    horarioEmHoras: 'With the interval in hours, the time saved in the field applies.',
    sePassou: 'When the calculated date has already passed',
    seVazio: 'When the field is empty',
    continuarNaHora: 'Move to the next node',
    encerrar: 'End the flow',
    recalcular: 'Recalculate when the field changes',
    recalcularDescricao: campo => `If the ${campo ?? "date"} field changes during the delay, the wait uses the new date.`,
    previa: 'Simulation',
    previaDescricao: (n, categoria) => `Calculated with the ${n} open items in ${categoria}. Each new item follows the same rule.`,
    previaSemCampo: 'Drag the date variable to simulate when each item moves on.',
    verComOItem: 'Sample item',
    contagem: {
      agendado: n => `${n} waiting`,
      passou: n => `${n} with a past date`,
      vazio: n => `${n} without a date`,
    },
    resultado: {
      agendado: (campo, data, continua, hora) => `${campo}: ${data}. Moves to the next node on ${continua}, at ${hora}.`,
      passouContinua: 'The calculated date has passed. The flow moves to the next node right away.',
      passouEncerra: 'The calculated date has passed. The flow ends at this node.',
      vazioContinua: campo => `The ${campo} field is empty. The flow moves to the next node right away.`,
      vazioEncerra: campo => `The ${campo} field is empty. The flow ends at this node.`,
    },
    linha: { hoje: 'Today', continua: 'Moves on' },
    verCalculo: 'View calculation',
    calculoDescricao: 'Configuration saved in the node and the calculation Spaceflow runs, for reference when configuring through the API.',
    resumoTempo: (n, unidade) => `Waits ${n} ${unidade}.`,
    resumoData: (quanto, direcao, campo, hora) => `Moves on ${quanto ? `${quanto} ` : ''}${direcao} ${campo}${hora ? `, at ${hora}` : ''}.`,
    resumoVazio: 'Delay not configured.',
    salvo: 'Delay node saved',
    ajudaDaOpcao: 'What this option does',
    ajudas: {
      tipo: {
        duration: 'The flow waits the given time and then moves to the next node. E.g.: 3 days.',
        until_date: 'The flow waits until a date calculated from an item field. E.g.: 30 days before the due date.',
      },
      unidade: {
        second: 'The amount is counted in seconds.',
        minute: 'The amount is counted in minutes.',
        hour: 'The amount is counted in hours.',
        day: 'The amount is counted in calendar days, including weekends and holidays.',
      },
      deslocamento: {
        day: 'Calendar days, including weekends and holidays.',
        week: 'Each week counts as 7 calendar days.',
        month: 'Calendar months. 1 month before 03/31 is 02/28.',
        hour: 'Hours counted from the time saved in the field. The Time setting no longer applies.',
      },
      direcao: {
        before: 'The flow moves on before the field date. E.g.: 30 days before the due date.',
        after: 'The flow moves on after the field date. E.g.: 5 days after signing.',
        on: 'The flow moves on on the field date itself.',
      },
      passou: {
        continue: 'The flow does not wait: it moves right away to the node connected after the Delay.',
        end: 'The flow stops at this node. The next nodes do not run for this item.',
      },
      vazio: {
        continue: 'With no date to calculate, the flow moves right away to the node connected after the Delay.',
        end: 'With no date to calculate, the flow stops at this node. The next nodes do not run for this item.',
      },
    },
    instrucoes: {
      nome: 'Name shown on the node card, in the flow.',
      tipo: 'Defines whether the flow waits a fixed time or until a date.',
      quantidade: 'How long the flow stays paused at this node.',
      unidade: 'Unit of the amount of time.',
      campo: 'Drag here the variable with the base date, from Input Variables.',
      retomar: 'How long before or after that date the flow moves to the next node.',
      horario: 'Time of day when the flow moves to the next node, in the workspace time zone: Brasília (UTC−3).',
      sePassou: 'What to do if the calculated date has already passed when the item reaches this node.',
      seVazio: 'What to do if the item does not have this date filled in.',
    },
  },
}

const es: Textos = {
  locale: 'es',
  casca: casca.es,
  trilha: { configuracoes: 'Configuraciones', dados: 'Datos', spaceflows: 'Spaceflows' },
  editor: {
    abas: { editor: 'Editor', execucoes: 'Ejecuciones', versoes: 'Versiones', comentarios: 'Comentarios', logs: 'Registros' },
    adicionarNo: 'Agregar Nodo',
    salvar: 'Guardar',
    detalhes: 'Detalles del flujo',
    zoomMais: 'Acercar',
    zoomMenos: 'Alejar',
    ajustar: 'Ajustar a la pantalla',
    organizar: 'Organizar',
  },
  nos: {
    start: { titulo: 'Start', quandoUmItemFor: 'Cuando un ítem sea', criado: 'creado', naCategoria: 'en la categoría' },
    atraso: { titulo: 'Retraso', descricao: 'Retrasa el flujo por un período de tiempo especificado.' },
    email: { titulo: 'Correo', descricao: 'Avisar al responsable del contrato' },
    end: { titulo: 'End', descricao: 'Marca el fin del flujo. Después de esta etapa, no se ejecuta ninguna acción.' },
    modificado: 'MODIFICADO',
    ok: 'OK',
    erros: n => `${n} ERROR(ES)`,
    semAlvo: 'Ningún destino conectado',
  },
  categoria: 'Contratos',
  hoje: {
    titulo: 'Retraso',
    nomeDoNo: 'Nombre del Nodo',
    quantidade: 'Cantidad de Tiempo',
    unidade: 'Unidad',
    unidades: { second: 'Segundos', minute: 'Minutos', hour: 'Horas', day: 'Días' },
    ajudaNome: 'Nombre que identifica el nodo en el flujo.',
    ajudaQuantidade: 'Defina la cantidad de tiempo para retrasar la ejecución del flujo de trabajo.',
    ajudaUnidade: 'Unidad de medida del tiempo de retraso.',
    fechar: 'Cerrar',
    cancelar: 'Cancelar',
    salvarEFechar: 'Guardar y cerrar',
    modificado: 'Modificado',
    entrada: 'ENTRADA',
    saida: 'SALIDA',
    variaveisDeEntrada: 'Variables de Entrada',
    arrasteAsVariaveis: 'Arrastre las variables a los campos que desea configurar.',
    filtrar: 'Filtrar por nombre o clave...',
    recolher: 'Contraer',
    gatilho: '(trigger)',
  },
  proposta: {
    esperar: 'Tipo de retraso',
    modos: {
      duration: { titulo: 'Duración fija', descricao: 'Pausa la ejecución por un período definido.' },
      until_date: { titulo: 'Fecha de referencia', descricao: 'Pausa la ejecución hasta una fecha calculada a partir de un campo de fecha.' },
    },
    erroQuantidade: 'Ingrese un número entero mayor que cero.',
    continuar: 'Avanzar al siguiente nodo',
    quanto: 'Cantidad',
    direcoes: { before: 'antes de', after: 'después de', on: 'en la fecha de' },
    unidadeDoDeslocamento: (u, n) => unidadesEs[u][n === 1 ? 0 : 1],
    campo: 'Campo de fecha',
    erroCampo: 'Arrastre una variable de fecha a este campo.',
    naoEhData: variavel => `${variavel} no es una fecha. Arrastre una variable de fecha.`,
    naoReconhecida: 'Variable no encontrada entre las que llegan a este nodo. Revise el nombre o arrástrela desde Variables de Entrada.',
    lidaComo: (campo, no) => `Usando ${campo}, del nodo ${no}.`,
    soltarAqui: 'Suelte aquí para usar esta fecha',
    semVariaveis: 'Ninguna variable llega a este nodo. Conecte un nodo antes del Retraso.',
    abrirVariaveis: 'Abrir Variables de Entrada',
    horario: 'Horario',
    horarioDoCampo: 'Horario registrado en el campo',
    fuso: 'Zona horaria del workspace: Brasilia (UTC−3).',
    horarioEmHoras: 'Con el intervalo en horas, vale el horario registrado en el campo.',
    sePassou: 'Cuando la fecha calculada ya haya pasado',
    seVazio: 'Cuando el campo no esté completado',
    continuarNaHora: 'Avanzar al siguiente nodo',
    encerrar: 'Terminar el flujo',
    recalcular: 'Recalcular cuando el campo cambie',
    recalcularDescricao: campo => `Si el campo ${campo ?? "de fecha"} cambia durante el retraso, la espera usa la nueva fecha.`,
    previa: 'Simulación',
    previaDescricao: (n, categoria) => `Calculada con los ${n} ítems abiertos de ${categoria}. Cada ítem creado sigue la misma regla.`,
    previaSemCampo: 'Arrastre la variable de fecha para simular cuándo avanza cada ítem.',
    verComOItem: 'Ítem de ejemplo',
    contagem: {
      agendado: n => `${n} en espera`,
      passou: n => `${n} con fecha ya pasada`,
      vazio: n => `${n} sin fecha completada`,
    },
    resultado: {
      agendado: (campo, data, continua, hora) => `${campo}: ${data}. Avanza al siguiente nodo el ${continua}, a las ${hora}.`,
      passouContinua: 'La fecha calculada ya pasó. El flujo avanza al siguiente nodo en el momento.',
      passouEncerra: 'La fecha calculada ya pasó. El flujo termina en este nodo.',
      vazioContinua: campo => `El campo ${campo} no está completado. El flujo avanza al siguiente nodo en el momento.`,
      vazioEncerra: campo => `El campo ${campo} no está completado. El flujo termina en este nodo.`,
    },
    linha: { hoje: 'Hoy', continua: 'Avanza' },
    verCalculo: 'Ver cálculo',
    calculoDescricao: 'Configuración guardada en el nodo y cálculo que ejecuta Spaceflow, como referencia para quien configura por la API.',
    resumoTempo: (n, unidade) => `Espera ${n} ${unidade}.`,
    resumoData: (quanto, direcao, campo, hora) => `Avanza ${quanto ? `${quanto} ` : ''}${direcao} ${campo}${hora ? `, a las ${hora}` : ''}.`,
    resumoVazio: 'Retraso no configurado.',
    salvo: 'Nodo de Retraso guardado',
    ajudaDaOpcao: 'Qué hace esta opción',
    ajudas: {
      tipo: {
        duration: 'El flujo espera el tiempo indicado y luego avanza al siguiente nodo. Ej.: 3 días.',
        until_date: 'El flujo espera hasta una fecha calculada a partir de un campo del ítem. Ej.: 30 días antes del vencimiento.',
      },
      unidade: {
        second: 'La cantidad se cuenta en segundos.',
        minute: 'La cantidad se cuenta en minutos.',
        hour: 'La cantidad se cuenta en horas.',
        day: 'La cantidad se cuenta en días corridos, con fines de semana y feriados.',
      },
      deslocamento: {
        day: 'Días corridos, con fines de semana y feriados.',
        week: 'Cada semana vale 7 días corridos.',
        month: 'Meses del calendario. 1 mes antes del 31/03 es el 28/02.',
        hour: 'Horas contadas desde la hora guardada en el campo. El Horario deja de valer.',
      },
      direcao: {
        before: 'El flujo avanza antes de la fecha del campo. Ej.: 30 días antes del vencimiento.',
        after: 'El flujo avanza después de la fecha del campo. Ej.: 5 días después de la firma.',
        on: 'El flujo avanza el mismo día de la fecha del campo.',
      },
      passou: {
        continue: 'El flujo no espera: avanza en el momento al nodo conectado después del Retraso.',
        end: 'El flujo se detiene en este nodo. Los nodos siguientes no se ejecutan para este ítem.',
      },
      vazio: {
        continue: 'Sin fecha para calcular, el flujo avanza en el momento al nodo conectado después del Retraso.',
        end: 'Sin fecha para calcular, el flujo se detiene en este nodo. Los nodos siguientes no se ejecutan para este ítem.',
      },
    },
    instrucoes: {
      nome: 'Nombre que aparece en la tarjeta del nodo, en el flujo.',
      tipo: 'Define si el flujo espera un tiempo fijo o hasta una fecha.',
      quantidade: 'Cuánto tiempo el flujo queda detenido en este nodo.',
      unidade: 'Medida de la cantidad de tiempo.',
      campo: 'Arrastre aquí la variable con la fecha base, desde Variables de Entrada.',
      retomar: 'Cuánto tiempo antes o después de esa fecha el flujo avanza al siguiente nodo.',
      horario: 'Hora del día en que el flujo avanza al siguiente nodo, en la zona horaria del workspace: Brasilia (UTC−3).',
      sePassou: 'Qué hacer si la fecha calculada ya pasó cuando el ítem llega a este nodo.',
      seVazio: 'Qué hacer si el ítem no tiene esta fecha completada.',
    },
  },
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': pt, 'en': en, 'es': es }
