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
    campoPlaceholder: string
    campoBusca: string
    doNo: (no: string) => string
    dataDeSistema: string
    comHora: string
    semCampos: string
    erroCampo: string
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
  },
  proposta: {
    esperar: 'Tipo de atraso',
    modos: {
      duration: { titulo: 'Duração fixa', descricao: 'Pausa a execução por um período definido.' },
      until_date: { titulo: 'Data de referência', descricao: 'Pausa a execução até uma data calculada a partir de um campo de data.' },
    },
    erroQuantidade: 'Informe um número inteiro maior que zero.',
    continuar: 'Retomar a execução',
    quanto: 'Quantidade',
    direcoes: { before: 'antes de', after: 'depois de', on: 'na data de' },
    unidadeDoDeslocamento: (u, n) => unidadesPt[u][n === 1 ? 0 : 1],
    campo: 'Campo de data',
    campoPlaceholder: 'Selecione o campo de data',
    campoBusca: 'Buscar campo...',
    doNo: no => `Nó ${no}`,
    dataDeSistema: 'sistema',
    comHora: 'data e hora',
    semCampos: 'Nenhum campo de data está disponível neste nó. Configure o nó Início com uma categoria que tenha campo de data.',
    erroCampo: 'Selecione o campo de data.',
    horario: 'Horário de retomada',
    horarioDoCampo: 'Horário registrado no campo',
    fuso: 'Fuso horário do workspace: Brasília (UTC−3).',
    horarioEmHoras: 'Com o intervalo em horas, vale o horário registrado no campo.',
    sePassou: 'Quando a data calculada já tiver passado',
    seVazio: 'Quando o campo não estiver preenchido',
    continuarNaHora: 'Retomar imediatamente',
    encerrar: 'Encerrar o fluxo',
    recalcular: 'Recalcular quando o campo for alterado',
    recalcularDescricao: campo => `Se o campo ${campo ?? "de data"} for alterado durante o atraso, a retomada passa a usar a nova data.`,
    previa: 'Simulação',
    previaDescricao: (n, categoria) => `Calculada com os ${n} itens abertos de ${categoria}. Cada item criado segue a mesma regra.`,
    previaSemCampo: 'Selecione o campo de data para simular a retomada de cada item.',
    verComOItem: 'Item de exemplo',
    contagem: {
      agendado: n => `${n} aguardando`,
      passou: n => `${n} com data já passada`,
      vazio: n => `${n} sem data preenchida`,
    },
    resultado: {
      agendado: (campo, data, continua, hora) => `${campo}: ${data}. Retomada em ${continua}, às ${hora}.`,
      passouContinua: 'A data calculada já passou. A execução é retomada imediatamente.',
      passouEncerra: 'A data calculada já passou. O fluxo é encerrado neste nó.',
      vazioContinua: campo => `O campo ${campo} não está preenchido. A execução é retomada imediatamente.`,
      vazioEncerra: campo => `O campo ${campo} não está preenchido. O fluxo é encerrado neste nó.`,
    },
    linha: { hoje: 'Hoje', continua: 'Retomada' },
    verCalculo: 'Ver cálculo',
    calculoDescricao: 'Configuração gravada no nó e cálculo executado pelo Spaceflow, para referência de quem configura pela API.',
    resumoTempo: (n, unidade) => `Aguarda ${n} ${unidade}.`,
    resumoData: (quanto, direcao, campo, hora) => `Retoma ${quanto ? `${quanto} ` : ''}${direcao} ${campo}${hora ? `, às ${hora}` : ''}.`,
    resumoVazio: 'Atraso não configurado.',
    salvo: 'Nó de Atraso salvo',
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
  },
  proposta: {
    esperar: 'Delay type',
    modos: {
      duration: { titulo: 'Fixed duration', descricao: 'Pauses the execution for a set period.' },
      until_date: { titulo: 'Reference date', descricao: 'Pauses the execution until a date calculated from a date field.' },
    },
    erroQuantidade: 'Enter a whole number greater than zero.',
    continuar: 'Resume the execution',
    quanto: 'Amount',
    direcoes: { before: 'before', after: 'after', on: 'on' },
    unidadeDoDeslocamento: (u, n) => unidadesEn[u][n === 1 ? 0 : 1],
    campo: 'Date field',
    campoPlaceholder: 'Select the date field',
    campoBusca: 'Search field...',
    doNo: no => `${no} node`,
    dataDeSistema: 'system',
    comHora: 'date and time',
    semCampos: 'No date field is available in this node. Set up the Start node with a category that has a date field.',
    erroCampo: 'Select the date field.',
    horario: 'Resume time',
    horarioDoCampo: 'Time saved in the field',
    fuso: 'Workspace time zone: Brasília (UTC−3).',
    horarioEmHoras: 'With the interval in hours, the time saved in the field applies.',
    sePassou: 'When the calculated date has already passed',
    seVazio: 'When the field is empty',
    continuarNaHora: 'Resume immediately',
    encerrar: 'End the flow',
    recalcular: 'Recalculate when the field changes',
    recalcularDescricao: campo => `If the ${campo ?? "date"} field changes during the delay, the resume uses the new date.`,
    previa: 'Simulation',
    previaDescricao: (n, categoria) => `Calculated with the ${n} open items in ${categoria}. Each new item follows the same rule.`,
    previaSemCampo: 'Select the date field to simulate when each item resumes.',
    verComOItem: 'Sample item',
    contagem: {
      agendado: n => `${n} waiting`,
      passou: n => `${n} with a past date`,
      vazio: n => `${n} without a date`,
    },
    resultado: {
      agendado: (campo, data, continua, hora) => `${campo}: ${data}. Resumes on ${continua}, at ${hora}.`,
      passouContinua: 'The calculated date has passed. The execution resumes immediately.',
      passouEncerra: 'The calculated date has passed. The flow ends at this node.',
      vazioContinua: campo => `The ${campo} field is empty. The execution resumes immediately.`,
      vazioEncerra: campo => `The ${campo} field is empty. The flow ends at this node.`,
    },
    linha: { hoje: 'Today', continua: 'Resume' },
    verCalculo: 'View calculation',
    calculoDescricao: 'Configuration saved in the node and the calculation Spaceflow runs, for reference when configuring through the API.',
    resumoTempo: (n, unidade) => `Waits ${n} ${unidade}.`,
    resumoData: (quanto, direcao, campo, hora) => `Resumes ${quanto ? `${quanto} ` : ''}${direcao} ${campo}${hora ? `, at ${hora}` : ''}.`,
    resumoVazio: 'Delay not configured.',
    salvo: 'Delay node saved',
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
  },
  proposta: {
    esperar: 'Tipo de retraso',
    modos: {
      duration: { titulo: 'Duración fija', descricao: 'Pausa la ejecución por un período definido.' },
      until_date: { titulo: 'Fecha de referencia', descricao: 'Pausa la ejecución hasta una fecha calculada a partir de un campo de fecha.' },
    },
    erroQuantidade: 'Ingrese un número entero mayor que cero.',
    continuar: 'Reanudar la ejecución',
    quanto: 'Cantidad',
    direcoes: { before: 'antes de', after: 'después de', on: 'en la fecha de' },
    unidadeDoDeslocamento: (u, n) => unidadesEs[u][n === 1 ? 0 : 1],
    campo: 'Campo de fecha',
    campoPlaceholder: 'Seleccione el campo de fecha',
    campoBusca: 'Buscar campo...',
    doNo: no => `Nodo ${no}`,
    dataDeSistema: 'sistema',
    comHora: 'fecha y hora',
    semCampos: 'Ningún campo de fecha está disponible en este nodo. Configure el nodo Inicio con una categoría que tenga campo de fecha.',
    erroCampo: 'Seleccione el campo de fecha.',
    horario: 'Horario de reanudación',
    horarioDoCampo: 'Horario registrado en el campo',
    fuso: 'Zona horaria del workspace: Brasilia (UTC−3).',
    horarioEmHoras: 'Con el intervalo en horas, vale el horario registrado en el campo.',
    sePassou: 'Cuando la fecha calculada ya haya pasado',
    seVazio: 'Cuando el campo no esté completado',
    continuarNaHora: 'Reanudar de inmediato',
    encerrar: 'Terminar el flujo',
    recalcular: 'Recalcular cuando el campo cambie',
    recalcularDescricao: campo => `Si el campo ${campo ?? "de fecha"} cambia durante el retraso, la reanudación usa la nueva fecha.`,
    previa: 'Simulación',
    previaDescricao: (n, categoria) => `Calculada con los ${n} ítems abiertos de ${categoria}. Cada ítem creado sigue la misma regla.`,
    previaSemCampo: 'Seleccione el campo de fecha para simular la reanudación de cada ítem.',
    verComOItem: 'Ítem de ejemplo',
    contagem: {
      agendado: n => `${n} en espera`,
      passou: n => `${n} con fecha ya pasada`,
      vazio: n => `${n} sin fecha completada`,
    },
    resultado: {
      agendado: (campo, data, continua, hora) => `${campo}: ${data}. Reanudación el ${continua}, a las ${hora}.`,
      passouContinua: 'La fecha calculada ya pasó. La ejecución se reanuda de inmediato.',
      passouEncerra: 'La fecha calculada ya pasó. El flujo termina en este nodo.',
      vazioContinua: campo => `El campo ${campo} no está completado. La ejecución se reanuda de inmediato.`,
      vazioEncerra: campo => `El campo ${campo} no está completado. El flujo termina en este nodo.`,
    },
    linha: { hoje: 'Hoy', continua: 'Reanudación' },
    verCalculo: 'Ver cálculo',
    calculoDescricao: 'Configuración guardada en el nodo y cálculo que ejecuta Spaceflow, como referencia para quien configura por la API.',
    resumoTempo: (n, unidade) => `Espera ${n} ${unidade}.`,
    resumoData: (quanto, direcao, campo, hora) => `Se reanuda ${quanto ? `${quanto} ` : ''}${direcao} ${campo}${hora ? `, a las ${hora}` : ''}.`,
    resumoVazio: 'Retraso no configurado.',
    salvo: 'Nodo de Retraso guardado',
  },
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': pt, 'en': en, 'es': es }
