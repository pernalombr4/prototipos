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
    /** A pergunta que vem antes da frase: na própria data ou antes/depois dela. */
    momento: string
    momentos: Record<Direcao, string>
    dataExata: string
    quanto: string
    direcoes: Record<Direcao, string>
    unidadeDoDeslocamento: (u: UnidadeDoDeslocamento, n: number) => string
    campo: string
    erroCampo: string
    naoEhData: (variavel: string) => string
    naoReconhecida: string
    soltarAqui: string
    arrasteADataAqui: string
    editarVariavel: string
    limparVariavel: string
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
      momento: string
      dataExata: string
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
      duration: { titulo: 'Intervalo de tempo', descricao: 'Espera um tempo fixo. Ex.: 3 dias.' },
      until_date: { titulo: 'Data específica', descricao: 'Espera até uma data calculada a partir de uma variável de data. Ex.: 30 dias antes do vencimento.' },
    },
    erroQuantidade: 'Informe um número inteiro maior que zero.',
    continuar: 'Deslocamento',
    momento: 'Momento',
    momentos: { on: 'Na data', before: 'Antes da data', after: 'Depois da data' },
    dataExata: 'Data',
    quanto: 'Quantidade',
    direcoes: { before: 'antes de', after: 'depois de', on: 'na data de' },
    unidadeDoDeslocamento: (u, n) => unidadesPt[u][n === 1 ? 0 : 1],
    campo: 'Data',
    erroCampo: 'Arraste uma variável de data.',
    naoEhData: variavel => `${variavel} não é uma data.`,
    naoReconhecida: 'Variável não encontrada neste nó.',
    soltarAqui: 'Solte aqui',
    arrasteADataAqui: 'Arraste a variável de data',
    editarVariavel: 'Editar variável',
    limparVariavel: 'Remover variável',
    semVariaveis: 'Nenhuma variável disponível neste nó.',
    abrirVariaveis: 'Abrir Variáveis de Entrada',
    horario: 'Horário',
    horarioDoCampo: 'Hora da variável',
    fuso: 'Fuso: Brasília (UTC−3).',
    horarioEmHoras: 'Com deslocamento em horas, vale a hora da variável.',
    sePassou: 'Data no passado',
    seVazio: 'Data vazia',
    continuarNaHora: 'Continuar',
    encerrar: 'Encerrar com erro',
    resumoTempo: (n, unidade) => `Por ${n} ${unidade}.`,
    resumoData: (quanto, direcao, campo, hora) => `Até ${quanto ? `${quanto} ${direcao} ` : ''}${campo}${hora ? `, às ${hora}` : ''}.`,
    resumoVazio: 'Não configurado.',
    salvo: 'Nó de Atraso salvo',
    ajudaDaOpcao: 'Sobre esta opção',
    ajudas: {
      tipo: {
        duration: 'Espera um tempo fixo e segue para o próximo nó. Ex.: 3 dias.',
        until_date: 'Espera até uma data calculada a partir de uma variável de data. Ex.: 30 dias antes do vencimento.',
      },
      unidade: {
        second: 'Tempo de espera em segundos.',
        minute: 'Tempo de espera em minutos.',
        hour: 'Tempo de espera em horas.',
        day: 'Tempo de espera em dias corridos, com fins de semana e feriados.',
      },
      deslocamento: {
        day: 'Dias corridos, com fins de semana e feriados.',
        week: 'Semanas de 7 dias corridos.',
        month: 'Meses do calendário. 31/03 menos 1 mês é 28/02.',
        hour: 'Horas contadas a partir da hora da variável. O Horário não se aplica.',
      },
      direcao: {
        on: 'Continua no dia da data. Ex.: no dia do vencimento.',
        before: 'Continua um tempo antes da data. Ex.: 30 dias antes do vencimento.',
        after: 'Continua um tempo depois da data. Ex.: 5 dias depois da assinatura.',
      },
      passou: {
        continue: 'Não espera: segue para o próximo nó na hora.',
        end: 'Para neste nó e registra a execução com erro. Os nós seguintes não rodam.',
      },
      vazio: {
        continue: 'Sem data, segue para o próximo nó na hora.',
        end: 'Sem data, para neste nó e registra a execução com erro. Os nós seguintes não rodam.',
      },
    },
    instrucoes: {
      nome: 'Identifica o nó no fluxo.',
      tipo: 'Espera por um tempo fixo ou até uma data.',
      quantidade: 'Tempo de espera.',
      unidade: 'Unidade do tempo de espera.',
      momento: 'Quando o fluxo continua em relação à data.',
      dataExata: 'Arraste uma variável de data de Variáveis de Entrada.',
      retomar: 'Tempo antes ou depois da data. Arraste a variável de data para o fim.',
      horario: 'Hora em que o fluxo continua. Fuso: Brasília (UTC−3).',
      sePassou: 'Quando a data calculada é anterior à chegada do item.',
      seVazio: 'Quando o item não tem a data preenchida.',
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
      duration: { titulo: 'Time interval', descricao: 'Waits a fixed time. E.g.: 3 days.' },
      until_date: { titulo: 'Specific date', descricao: 'Waits until a date calculated from a date variable. E.g.: 30 days before the due date.' },
    },
    erroQuantidade: 'Enter a whole number greater than zero.',
    continuar: 'Offset',
    momento: 'Timing',
    momentos: { on: 'On date', before: 'Before date', after: 'After date' },
    dataExata: 'Date',
    quanto: 'Amount',
    direcoes: { before: 'before', after: 'after', on: 'on' },
    unidadeDoDeslocamento: (u, n) => unidadesEn[u][n === 1 ? 0 : 1],
    campo: 'Date',
    erroCampo: 'Drag a date variable.',
    naoEhData: variavel => `${variavel} is not a date.`,
    naoReconhecida: 'Variable not found in this node.',
    soltarAqui: 'Drop here',
    arrasteADataAqui: 'Drag the date variable',
    editarVariavel: 'Edit variable',
    limparVariavel: 'Remove variable',
    semVariaveis: 'No variables available in this node.',
    abrirVariaveis: 'Open Input Variables',
    horario: 'Time',
    horarioDoCampo: 'Variable time',
    fuso: 'Time zone: Brasília (UTC−3).',
    horarioEmHoras: 'With an offset in hours, the variable time applies.',
    sePassou: 'Past date',
    seVazio: 'Empty date',
    continuarNaHora: 'Continue',
    encerrar: 'End with error',
    resumoTempo: (n, unidade) => `For ${n} ${unidade}.`,
    resumoData: (quanto, direcao, campo, hora) => `Until ${quanto ? `${quanto} ${direcao} ` : ''}${campo}${hora ? `, at ${hora}` : ''}.`,
    resumoVazio: 'Not configured.',
    salvo: 'Delay node saved',
    ajudaDaOpcao: 'About this option',
    ajudas: {
      tipo: {
        duration: 'Waits a fixed time and moves to the next node. E.g.: 3 days.',
        until_date: 'Waits until a date calculated from a date variable. E.g.: 30 days before the due date.',
      },
      unidade: {
        second: 'Wait time in seconds.',
        minute: 'Wait time in minutes.',
        hour: 'Wait time in hours.',
        day: 'Wait time in calendar days, including weekends and holidays.',
      },
      deslocamento: {
        day: 'Calendar days, including weekends and holidays.',
        week: 'Weeks of 7 calendar days.',
        month: 'Calendar months. 03/31 minus 1 month is 02/28.',
        hour: 'Hours counted from the variable time. The Time setting does not apply.',
      },
      direcao: {
        on: 'Continues on the date itself. E.g.: on the due date.',
        before: 'Continues some time before the date. E.g.: 30 days before the due date.',
        after: 'Continues some time after the date. E.g.: 5 days after signing.',
      },
      passou: {
        continue: 'Does not wait: moves to the next node right away.',
        end: 'Stops at this node and logs the execution with an error. The next nodes do not run.',
      },
      vazio: {
        continue: 'With no date, moves to the next node right away.',
        end: 'With no date, stops at this node and logs the execution with an error. The next nodes do not run.',
      },
    },
    instrucoes: {
      nome: 'Identifies the node in the flow.',
      tipo: 'Waits a fixed time or until a date.',
      quantidade: 'Wait time.',
      unidade: 'Unit of the wait time.',
      momento: 'When the flow continues relative to the date.',
      dataExata: 'Drag a date variable from Input Variables.',
      retomar: 'Time before or after the date. Drag the date variable to the end.',
      horario: 'Time the flow continues. Time zone: Brasília (UTC−3).',
      sePassou: 'When the calculated date is before the item arrives.',
      seVazio: 'When the item has no date filled in.',
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
      duration: { titulo: 'Intervalo de tiempo', descricao: 'Espera un tiempo fijo. Ej.: 3 días.' },
      until_date: { titulo: 'Fecha específica', descricao: 'Espera hasta una fecha calculada a partir de una variable de fecha. Ej.: 30 días antes del vencimiento.' },
    },
    erroQuantidade: 'Ingrese un número entero mayor que cero.',
    continuar: 'Desplazamiento',
    momento: 'Momento',
    momentos: { on: 'En la fecha', before: 'Antes de la fecha', after: 'Después de la fecha' },
    dataExata: 'Fecha',
    quanto: 'Cantidad',
    direcoes: { before: 'antes de', after: 'después de', on: 'en la fecha de' },
    unidadeDoDeslocamento: (u, n) => unidadesEs[u][n === 1 ? 0 : 1],
    campo: 'Fecha',
    erroCampo: 'Arrastre una variable de fecha.',
    naoEhData: variavel => `${variavel} no es una fecha.`,
    naoReconhecida: 'Variable no encontrada en este nodo.',
    soltarAqui: 'Suelte aquí',
    arrasteADataAqui: 'Arrastre la variable de fecha',
    editarVariavel: 'Editar variable',
    limparVariavel: 'Quitar variable',
    semVariaveis: 'Ninguna variable disponible en este nodo.',
    abrirVariaveis: 'Abrir Variables de Entrada',
    horario: 'Horario',
    horarioDoCampo: 'Hora de la variable',
    fuso: 'Zona horaria: Brasilia (UTC−3).',
    horarioEmHoras: 'Con desplazamiento en horas, vale la hora de la variable.',
    sePassou: 'Fecha pasada',
    seVazio: 'Fecha vacía',
    continuarNaHora: 'Continuar',
    encerrar: 'Terminar con error',
    resumoTempo: (n, unidade) => `Por ${n} ${unidade}.`,
    resumoData: (quanto, direcao, campo, hora) => `Hasta ${quanto ? `${quanto} ${direcao} ` : ''}${campo}${hora ? `, a las ${hora}` : ''}.`,
    resumoVazio: 'No configurado.',
    salvo: 'Nodo de Retraso guardado',
    ajudaDaOpcao: 'Sobre esta opción',
    ajudas: {
      tipo: {
        duration: 'Espera un tiempo fijo y avanza al siguiente nodo. Ej.: 3 días.',
        until_date: 'Espera hasta una fecha calculada a partir de una variable de fecha. Ej.: 30 días antes del vencimiento.',
      },
      unidade: {
        second: 'Tiempo de espera en segundos.',
        minute: 'Tiempo de espera en minutos.',
        hour: 'Tiempo de espera en horas.',
        day: 'Tiempo de espera en días corridos, con fines de semana y feriados.',
      },
      deslocamento: {
        day: 'Días corridos, con fines de semana y feriados.',
        week: 'Semanas de 7 días corridos.',
        month: 'Meses del calendario. 31/03 menos 1 mes es 28/02.',
        hour: 'Horas contadas desde la hora de la variable. El Horario no se aplica.',
      },
      direcao: {
        on: 'Continúa el mismo día de la fecha. Ej.: el día del vencimiento.',
        before: 'Continúa un tiempo antes de la fecha. Ej.: 30 días antes del vencimiento.',
        after: 'Continúa un tiempo después de la fecha. Ej.: 5 días después de la firma.',
      },
      passou: {
        continue: 'No espera: avanza al siguiente nodo en el momento.',
        end: 'Se detiene en este nodo y registra la ejecución con error. Los nodos siguientes no se ejecutan.',
      },
      vazio: {
        continue: 'Sin fecha, avanza al siguiente nodo en el momento.',
        end: 'Sin fecha, se detiene en este nodo y registra la ejecución con error. Los nodos siguientes no se ejecutan.',
      },
    },
    instrucoes: {
      nome: 'Identifica el nodo en el flujo.',
      tipo: 'Espera un tiempo fijo o hasta una fecha.',
      quantidade: 'Tiempo de espera.',
      unidade: 'Unidad del tiempo de espera.',
      momento: 'Cuándo continúa el flujo respecto a la fecha.',
      dataExata: 'Arrastre una variable de fecha desde Variables de Entrada.',
      retomar: 'Tiempo antes o después de la fecha. Arrastre la variable de fecha al final.',
      horario: 'Hora en que continúa el flujo. Zona horaria: Brasilia (UTC−3).',
      sePassou: 'Cuando la fecha calculada es anterior a la llegada del ítem.',
      seVazio: 'Cuando el ítem no tiene la fecha completada.',
    },
  },
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': pt, 'en': en, 'es': es }
