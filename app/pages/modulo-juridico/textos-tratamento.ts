/**
 * A copy da rodada 4 do submódulo Capturas (o que acontece depois da captura) nos três idiomas do ENSPACE. Texto
 * novo, escrito para ir ao produto, em registro formal. Fica à parte de `textos-capturas.ts`, como a rodada 3 ficou à
 * parte de `textos.ts`.
 *
 * Nomes de norma, de categoria, de campo e de fluxo ficam em português nos três idiomas: são dado do workspace ou o
 * nome da coisa no Brasil. Sem travessão em nada que aparece na tela (regra 33).
 */
import type { Idioma } from '~/composables/useIdioma'
import type { MarcoDaResposta, TipoDeAudiencia, TipoDeMovimento } from './mocks'
import type { CampoExigido, EventoId, TipoDeCampo } from './tratamento'

const plural = (n: number, um: string, varios: string) => (n === 1 ? um : varios)

/* ================================================================== *
 * Português                                                           *
 * ================================================================== */

const pt = {
  caixa: {
    vistaCitacoes: 'Citações',
    situacao: {
      respostaAte: (d: string) => `Resposta até ${d}`,
      defesaNaAudiencia: (d: string, h: string) => `Defesa na audiência, ${d}, ${h}`,
      conferirResposta: 'Conferir a resposta',
      cadastrarProcesso: 'Cadastrar o processo',
    },
    loteAjuda: 'Vale só para andamento sem audiência. O resto pede conferência, uma por uma.',
  },

  resposta: {
    titulo: 'Resposta à citação',
    marco: 'De onde conta a resposta',
    marcos: {
      citacao: 'Da citação, sem audiência',
      conciliacao: 'Da audiência de conciliação',
      juizado: 'Na audiência (Juizado Especial)',
      trabalho: 'Até a audiência (Justiça do Trabalho)',
    } as Record<MarcoDaResposta, string>,
    ajudas: {
      citacao: '15 dias úteis, contados depois do 5º dia útil seguinte à confirmação (CPC, art. 335, III, e art. 231, IX).',
      conciliacao: '15 dias úteis, contados depois da audiência, se não houver acordo (CPC, art. 335, I).',
      juizado: 'A contestação se entrega na audiência. Não há contagem (Lei 9.099/1995, art. 30).',
      trabalho: 'A defesa se entrega no PJe até a audiência. Não há contagem (CLT, art. 847).',
    } as Record<MarcoDaResposta, string>,
    sugerido: 'Sugerido pelo rito e pelo teor',
    dia: 'Data da audiência',
    hora: 'Hora',
    lida: 'Lida no teor. Confira antes de confirmar.',
    acordo: 'Se houver acordo na audiência, o prazo deixa de existir. Se a empresa pedir o cancelamento da audiência, o prazo conta do pedido (CPC, art. 335, II).',
    defesa: 'Defesa até',
    semData: 'Informe a data da audiência para calcular.',
    semProcesso: 'Esta citação é de uma ação que não está no workspace. Cadastre o processo com os dados da citação para calcular a resposta.',
  },

  audiencia: {
    titulo: 'Audiência no teor',
    tipos: { conciliacao: 'Audiência de conciliação', una: 'Audiência una', instrucao: 'Audiência de instrução' } as Record<TipoDeAudiencia, string>,
    local: 'Local',
    levar: 'Levar a audiência para a Agenda',
    levarAjuda: 'Vira item em Audiências, relacionado ao processo. A data vem do juízo: não há cálculo.',
    naAgenda: (d: string, h: string) => `Audiência na Agenda: ${d}, ${h}`,
    toast: (d: string, h: string) => `Audiência de ${d}, ${h}, na Agenda`,
    verAgenda: 'Ver na Agenda',
  },

  inicial: {
    titulo: 'Documentos da ação',
    peticao: 'Petição inicial',
    detalhe: (n: number, sistema: string, quando: string) => `${n} páginas, obtida no ${sistema} em ${quando}`,
    abrir: 'Abrir a petição inicial',
    vaiPara: 'Vai para os anexos do processo quando o processo for cadastrado.',
    noProcesso: 'Nos anexos do processo.',
  },

  andamento: {
    movimento: 'Tipo do movimento',
    movimentos: { audiencia: 'Audiência designada', sentenca: 'Sentença', juntada: 'Juntada', conclusao: 'Conclusão', remessa: 'Remessa' } as Record<TipoDeMovimento, string>,
    registrado: (ref: string) => `Andamento na linha do tempo do ${ref}`,
    registrados: (n: number) => `${n} ${plural(n, 'andamento registrado', 'andamentos registrados')} na linha do tempo dos processos`,
  },

  distribuicao: {
    jaCadastrado: (ref: string) => `A citação desta ação já cadastrou o processo ${ref}. Registre a distribuição no processo.`,
    registrar: 'Registrar no processo',
    registrada: (ref: string) => `Distribuição registrada no ${ref}`,
  },

  eventos: {
    aba: 'Eventos',
    descricao: 'O submódulo entrega estes eventos ao Spaceflow. Cada evento é um gatilho de fluxo: é por eles que começam o pedido de subsídios, a designação do escritório e a do preposto, que continuam sendo configuração do caso de uso Contencioso.',
    colunas: { evento: 'Evento', quando: 'Quando acontece', dados: 'Dados enviados', fluxos: 'Fluxos que usam' },
    nomes: {
      capturaTratada: 'Captura tratada',
      citacaoConfirmada: 'Citação confirmada',
      processoCadastrado: 'Processo cadastrado',
      andamentoRegistrado: 'Andamento registrado',
      audienciaRegistrada: 'Audiência registrada',
    } as Record<EventoId, string>,
    quando: {
      capturaTratada: 'Uma pessoa confirma o prazo ou registra a captura no processo.',
      citacaoConfirmada: 'A citação é confirmada no Domicílio.',
      processoCadastrado: 'O processo nasce de uma distribuição ou de uma citação.',
      andamentoRegistrado: 'O andamento entra na linha do tempo do processo. O fluxo pode filtrar pelo tipo do movimento.',
      audienciaRegistrada: 'A audiência lida no teor vai para a Agenda.',
    } as Record<EventoId, string>,
    filtro: (m: string) => `quando o movimento for ${m}`,
    nenhum: 'Nenhum fluxo',
    criar: 'Criar fluxo no Spaceflow',
    criarToast: 'O Spaceflow abre com este evento como gatilho.',
    ultimos: 'Últimos eventos entregues',
    semDisparos: 'Nenhum evento entregue ainda.',
    disparou: (fluxos: string) => `Disparou: ${fluxos}`,
    nenhumFluxo: 'Nenhum fluxo usa este evento.',
    naCaptura: 'Eventos para o Spaceflow',
  },

  ligacao: {
    titulo: 'Ligar o submódulo Capturas',
    desc: 'Escolha a categoria que guarda os processos. A captura se liga ao processo pelo número CNJ e calcula o prazo pelo tribunal.',
    categoria: 'Categoria dos processos',
    itens: (n: number) => `${n} ${plural(n, 'item', 'itens')}`,
    casoDeUso: 'Criar a categoria Processos pelo caso de uso Contencioso',
    casoDeUsoAjuda: 'O caso de uso cria a categoria com os campos, os formulários e as visualizações do contencioso.',
    existenteAjuda: 'O submódulo usa a categoria como ela é e cria só os campos que faltarem.',
    duplicada: 'O workspace já tem a categoria Processos. Criar outra separa os processos em 2 lugares.',
    campos: 'Campos que o submódulo usa',
    colunas: { campo: 'Campo do submódulo', daCategoria: 'Campo da categoria', tipo: 'Tipo' },
    nomes: { numeroCnj: 'Número CNJ', tribunal: 'Tribunal', orgao: 'Órgão julgador', responsavel: 'Responsável', polo: 'Polo da empresa' } as Record<CampoExigido, string>,
    tipos: { texto: 'Texto', lista: 'Lista', pessoa: 'Pessoa', moeda: 'Moeda', data: 'Data' } as Record<TipoDeCampo, string>,
    escolher: 'Escolha o campo',
    criar: (nome: string) => `Criar o campo "${nome}"`,
    opcional: 'Opcional',
    faltam: (n: number) => `Falta ligar ${n} ${plural(n, 'campo obrigatório', 'campos obrigatórios')}.`,
    travados: 'Os campos ligados ficam travados enquanto o submódulo estiver ligado: ninguém os apaga nem muda o tipo deles.',
    confirmar: 'Ligar Capturas',
    toast: (categoria: string) => `Capturas ligado. Os processos ficam em ${categoria}.`,
    toastCriados: (n: number) => `${n} ${plural(n, 'campo criado', 'campos criados')} na categoria.`,
  },

  destino: {
    descricao: 'Cada captura tratada vai para a categoria dos processos ligada ao submódulo, ou para a Agenda, quando é audiência.',
    audiencia: { captura: 'Audiência', vaiPara: 'Item novo em Audiências, na Agenda', revisao: 'Sempre: a data vem do teor' },
    andamento: 'Linha do tempo do processo, na aba Andamentos',
    categoria: {
      titulo: 'Categoria dos processos',
      desc: 'Escolhida ao ligar o submódulo. Para trocar, desligue Capturas e ligue de novo.',
      criado: 'Criado pelo submódulo',
      travado: 'Travado enquanto Capturas estiver ligado',
      casoDeUso: 'Criada pelo caso de uso Contencioso',
    },
  },

  processo: {
    andamentos: 'Andamentos',
    vazio: 'Nenhum andamento registrado neste processo.',
    naCaixa: (n: number) => `${n} ${plural(n, 'andamento espera', 'andamentos esperam')} na caixa Capturas.`,
    irCaixa: 'Abrir a caixa Capturas',
    entradaDireta: 'Entrada direta',
    proximaAudiencia: 'Próxima audiência',
  },

  memoria: {
    ateHora: (h: string, fuso: string) => `até ${h}, ${fuso}`,
    naAudiencia: 'Na audiência',
  },

  config: {
    subtitulo: 'Submódulo Capturas: fontes, termos monitorados, destino das capturas, eventos para o Spaceflow e as regras que calculam o prazo.',
  },
}

export type TextosTratamento = typeof pt

/* ================================================================== *
 * English                                                             *
 * ================================================================== */

const en: TextosTratamento = {
  caixa: {
    vistaCitacoes: 'Services of process',
    situacao: {
      respostaAte: (d: string) => `Answer by ${d}`,
      defesaNaAudiencia: (d: string, h: string) => `Defense at the hearing, ${d}, ${h}`,
      conferirResposta: 'Check the answer',
      cadastrarProcesso: 'Register the case',
    },
    loteAjuda: 'Only for case updates without a hearing. Everything else needs review, one by one.',
  },

  resposta: {
    titulo: 'Answer to the service of process',
    marco: 'When the answer period starts',
    marcos: {
      citacao: 'From the service, no hearing',
      conciliacao: 'From the conciliation hearing',
      juizado: 'At the hearing (Small Claims Court)',
      trabalho: 'Up to the hearing (Labor Court)',
    },
    ajudas: {
      citacao: '15 business days, counted after the 5th business day following the confirmation (CPC, art. 335, III, and art. 231, IX).',
      conciliacao: '15 business days, counted after the hearing, if there is no settlement (CPC, art. 335, I).',
      juizado: 'The answer is filed at the hearing. There is no count (Lei 9.099/1995, art. 30).',
      trabalho: 'The defense is filed on PJe up to the hearing. There is no count (CLT, art. 847).',
    },
    sugerido: 'Suggested by the procedure and the text',
    dia: 'Hearing date',
    hora: 'Time',
    lida: 'Read from the text. Check it before confirming.',
    acordo: 'If the parties settle at the hearing, the deadline no longer exists. If the company asks to cancel the hearing, the period counts from the request (CPC, art. 335, II).',
    defesa: 'Defense by',
    semData: 'Enter the hearing date to calculate.',
    semProcesso: 'This service of process belongs to a lawsuit that is not in the workspace. Register the case with the data from the service to calculate the answer.',
  },

  audiencia: {
    titulo: 'Hearing in the text',
    tipos: { conciliacao: 'Conciliation hearing', una: 'Single hearing', instrucao: 'Evidentiary hearing' },
    local: 'Location',
    levar: 'Add the hearing to the Calendar',
    levarAjuda: 'It becomes an item in Audiências, related to the case. The date comes from the court: there is no calculation.',
    naAgenda: (d: string, h: string) => `Hearing on the Calendar: ${d}, ${h}`,
    toast: (d: string, h: string) => `Hearing on ${d}, ${h}, added to the Calendar`,
    verAgenda: 'View on the Calendar',
  },

  inicial: {
    titulo: 'Lawsuit documents',
    peticao: 'Initial complaint',
    detalhe: (n: number, sistema: string, quando: string) => `${n} pages, obtained from ${sistema} on ${quando}`,
    abrir: 'Open the initial complaint',
    vaiPara: 'It goes to the case attachments when the case is registered.',
    noProcesso: 'In the case attachments.',
  },

  andamento: {
    movimento: 'Update type',
    movimentos: { audiencia: 'Hearing scheduled', sentenca: 'Judgment', juntada: 'Filing', conclusao: 'Sent to the judge', remessa: 'Sent to another court' },
    registrado: (ref: string) => `Case update added to the timeline of ${ref}`,
    registrados: (n: number) => `${n} ${plural(n, 'case update recorded', 'case updates recorded')} on the case timelines`,
  },

  distribuicao: {
    jaCadastrado: (ref: string) => `The service of process for this lawsuit already registered case ${ref}. Record the new lawsuit in the case.`,
    registrar: 'Record in the case',
    registrada: (ref: string) => `New lawsuit recorded in ${ref}`,
  },

  eventos: {
    aba: 'Events',
    descricao: 'The submodule sends these events to Spaceflow. Each event is a flow trigger: they start the request for supporting documents, the assignment of outside counsel, and the assignment of the company representative, which remain configuration of the Contencioso use case.',
    colunas: { evento: 'Event', quando: 'When it happens', dados: 'Data sent', fluxos: 'Flows that use it' },
    nomes: {
      capturaTratada: 'Capture handled',
      citacaoConfirmada: 'Service of process confirmed',
      processoCadastrado: 'Case registered',
      andamentoRegistrado: 'Case update recorded',
      audienciaRegistrada: 'Hearing recorded',
    },
    quando: {
      capturaTratada: 'A person confirms the deadline or records the capture in the case.',
      citacaoConfirmada: 'The service of process is confirmed on the Domicílio.',
      processoCadastrado: 'The case is created from a new lawsuit or a service of process.',
      andamentoRegistrado: 'The update enters the case timeline. The flow can filter by update type.',
      audienciaRegistrada: 'The hearing read from the text goes to the Calendar.',
    },
    filtro: (m: string) => `when the update is ${m}`,
    nenhum: 'No flow',
    criar: 'Create flow in Spaceflow',
    criarToast: 'Spaceflow opens with this event as the trigger.',
    ultimos: 'Latest events sent',
    semDisparos: 'No events sent yet.',
    disparou: (fluxos: string) => `Triggered: ${fluxos}`,
    nenhumFluxo: 'No flow uses this event.',
    naCaptura: 'Events for Spaceflow',
  },

  ligacao: {
    titulo: 'Turn on the Captures submodule',
    desc: 'Choose the category that holds the cases. The capture links to the case by the CNJ number and calculates the deadline by the court.',
    categoria: 'Case category',
    itens: (n: number) => `${n} ${plural(n, 'item', 'items')}`,
    casoDeUso: 'Create the Processos category from the Contencioso use case',
    casoDeUsoAjuda: 'The use case creates the category with the litigation fields, forms, and views.',
    existenteAjuda: 'The submodule uses the category as it is and creates only the missing fields.',
    duplicada: 'The workspace already has the Processos category. Creating another one splits the cases into 2 places.',
    campos: 'Fields the submodule uses',
    colunas: { campo: 'Submodule field', daCategoria: 'Category field', tipo: 'Type' },
    nomes: { numeroCnj: 'CNJ number', tribunal: 'Court', orgao: 'Judging body', responsavel: 'Owner', polo: 'Company side' },
    tipos: { texto: 'Text', lista: 'List', pessoa: 'Person', moeda: 'Currency', data: 'Date' },
    escolher: 'Choose the field',
    criar: (nome: string) => `Create the field "${nome}"`,
    opcional: 'Optional',
    faltam: (n: number) => `${n} required ${plural(n, 'field is', 'fields are')} not linked yet.`,
    travados: 'Linked fields are locked while the submodule is on: no one can delete them or change their type.',
    confirmar: 'Turn on Captures',
    toast: (categoria: string) => `Captures is on. Cases stay in ${categoria}.`,
    toastCriados: (n: number) => `${n} ${plural(n, 'field', 'fields')} created in the category.`,
  },

  destino: {
    descricao: 'Each handled capture goes to the case category linked to the submodule, or to the Calendar, when it is a hearing.',
    audiencia: { captura: 'Hearing', vaiPara: 'New item in Audiências, on the Calendar', revisao: 'Always: the date comes from the text' },
    andamento: 'Case timeline, in the Updates tab',
    categoria: {
      titulo: 'Case category',
      desc: 'Chosen when the submodule was turned on. To change it, turn Captures off and on again.',
      criado: 'Created by the submodule',
      travado: 'Locked while Captures is on',
      casoDeUso: 'Created by the Contencioso use case',
    },
  },

  processo: {
    andamentos: 'Updates',
    vazio: 'No updates recorded in this case.',
    naCaixa: (n: number) => `${n} ${plural(n, 'update is', 'updates are')} waiting in the Captures inbox.`,
    irCaixa: 'Open the Captures inbox',
    entradaDireta: 'Direct entry',
    proximaAudiencia: 'Next hearing',
  },

  memoria: {
    ateHora: (h: string, fuso: string) => `until ${h}, ${fuso}`,
    naAudiencia: 'At the hearing',
  },

  config: {
    subtitulo: 'Captures submodule: sources, monitored terms, capture destination, Spaceflow events, and the rules that calculate the deadline.',
  },
}

/* ================================================================== *
 * Español                                                             *
 * ================================================================== */

const es: TextosTratamento = {
  caixa: {
    vistaCitacoes: 'Citaciones',
    situacao: {
      respostaAte: (d: string) => `Respuesta hasta el ${d}`,
      defesaNaAudiencia: (d: string, h: string) => `Defensa en la audiencia, ${d}, ${h}`,
      conferirResposta: 'Revisar la respuesta',
      cadastrarProcesso: 'Registrar el proceso',
    },
    loteAjuda: 'Solo para movimientos sin audiencia. El resto requiere revisión, uno por uno.',
  },

  resposta: {
    titulo: 'Respuesta a la citación',
    marco: 'Desde cuándo cuenta la respuesta',
    marcos: {
      citacao: 'Desde la citación, sin audiencia',
      conciliacao: 'Desde la audiencia de conciliación',
      juizado: 'En la audiencia (Juzgado Especial)',
      trabalho: 'Hasta la audiencia (Justicia del Trabajo)',
    },
    ajudas: {
      citacao: '15 días hábiles, contados después del 5.º día hábil siguiente a la confirmación (CPC, art. 335, III, y art. 231, IX).',
      conciliacao: '15 días hábiles, contados después de la audiencia, si no hay acuerdo (CPC, art. 335, I).',
      juizado: 'La contestación se presenta en la audiencia. No hay conteo (Lei 9.099/1995, art. 30).',
      trabalho: 'La defensa se presenta en el PJe hasta la audiencia. No hay conteo (CLT, art. 847).',
    },
    sugerido: 'Sugerido por el procedimiento y el texto',
    dia: 'Fecha de la audiencia',
    hora: 'Hora',
    lida: 'Leída en el texto. Revísela antes de confirmar.',
    acordo: 'Si hay acuerdo en la audiencia, el plazo deja de existir. Si la empresa pide la cancelación de la audiencia, el plazo cuenta desde la solicitud (CPC, art. 335, II).',
    defesa: 'Defensa hasta',
    semData: 'Informe la fecha de la audiencia para calcular.',
    semProcesso: 'Esta citación es de una demanda que no está en el workspace. Registre el proceso con los datos de la citación para calcular la respuesta.',
  },

  audiencia: {
    titulo: 'Audiencia en el texto',
    tipos: { conciliacao: 'Audiencia de conciliación', una: 'Audiencia única', instrucao: 'Audiencia de prueba' },
    local: 'Lugar',
    levar: 'Llevar la audiencia a la Agenda',
    levarAjuda: 'Se convierte en un ítem en Audiências, relacionado con el proceso. La fecha viene del juzgado: no hay cálculo.',
    naAgenda: (d: string, h: string) => `Audiencia en la Agenda: ${d}, ${h}`,
    toast: (d: string, h: string) => `Audiencia del ${d}, ${h}, en la Agenda`,
    verAgenda: 'Ver en la Agenda',
  },

  inicial: {
    titulo: 'Documentos de la demanda',
    peticao: 'Demanda inicial',
    detalhe: (n: number, sistema: string, quando: string) => `${n} páginas, obtenida en ${sistema} el ${quando}`,
    abrir: 'Abrir la demanda inicial',
    vaiPara: 'Va a los anexos del proceso cuando se registre el proceso.',
    noProcesso: 'En los anexos del proceso.',
  },

  andamento: {
    movimento: 'Tipo de movimiento',
    movimentos: { audiencia: 'Audiencia designada', sentenca: 'Sentencia', juntada: 'Presentación de escrito', conclusao: 'A despacho', remessa: 'Remisión' },
    registrado: (ref: string) => `Movimiento en la línea de tiempo de ${ref}`,
    registrados: (n: number) => `${n} ${plural(n, 'movimiento registrado', 'movimientos registrados')} en la línea de tiempo de los procesos`,
  },

  distribuicao: {
    jaCadastrado: (ref: string) => `La citación de esta demanda ya registró el proceso ${ref}. Registre la distribución en el proceso.`,
    registrar: 'Registrar en el proceso',
    registrada: (ref: string) => `Distribución registrada en ${ref}`,
  },

  eventos: {
    aba: 'Eventos',
    descricao: 'El submódulo entrega estos eventos al Spaceflow. Cada evento es un disparador de flujo: con ellos empiezan la solicitud de antecedentes, la designación del despacho externo y la del representante, que siguen siendo configuración del caso de uso Contencioso.',
    colunas: { evento: 'Evento', quando: 'Cuándo ocurre', dados: 'Datos enviados', fluxos: 'Flujos que lo usan' },
    nomes: {
      capturaTratada: 'Captura tratada',
      citacaoConfirmada: 'Citación confirmada',
      processoCadastrado: 'Proceso registrado',
      andamentoRegistrado: 'Movimiento registrado',
      audienciaRegistrada: 'Audiencia registrada',
    },
    quando: {
      capturaTratada: 'Una persona confirma el plazo o registra la captura en el proceso.',
      citacaoConfirmada: 'La citación se confirma en el Domicílio.',
      processoCadastrado: 'El proceso nace de una distribución o de una citación.',
      andamentoRegistrado: 'El movimiento entra en la línea de tiempo del proceso. El flujo puede filtrar por tipo de movimiento.',
      audienciaRegistrada: 'La audiencia leída en el texto va a la Agenda.',
    },
    filtro: (m: string) => `cuando el movimiento sea ${m}`,
    nenhum: 'Ningún flujo',
    criar: 'Crear flujo en Spaceflow',
    criarToast: 'El Spaceflow abre con este evento como disparador.',
    ultimos: 'Últimos eventos entregados',
    semDisparos: 'Ningún evento entregado aún.',
    disparou: (fluxos: string) => `Disparó: ${fluxos}`,
    nenhumFluxo: 'Ningún flujo usa este evento.',
    naCaptura: 'Eventos para el Spaceflow',
  },

  ligacao: {
    titulo: 'Activar el submódulo Capturas',
    desc: 'Elija la categoría que guarda los procesos. La captura se vincula al proceso por el número CNJ y calcula el plazo por el tribunal.',
    categoria: 'Categoría de los procesos',
    itens: (n: number) => `${n} ${plural(n, 'ítem', 'ítems')}`,
    casoDeUso: 'Crear la categoría Processos con el caso de uso Contencioso',
    casoDeUsoAjuda: 'El caso de uso crea la categoría con los campos, los formularios y las visualizaciones del contencioso.',
    existenteAjuda: 'El submódulo usa la categoría tal como está y crea solo los campos que falten.',
    duplicada: 'El workspace ya tiene la categoría Processos. Crear otra separa los procesos en 2 lugares.',
    campos: 'Campos que usa el submódulo',
    colunas: { campo: 'Campo del submódulo', daCategoria: 'Campo de la categoría', tipo: 'Tipo' },
    nomes: { numeroCnj: 'Número CNJ', tribunal: 'Tribunal', orgao: 'Órgano judicial', responsavel: 'Responsable', polo: 'Posición de la empresa' },
    tipos: { texto: 'Texto', lista: 'Lista', pessoa: 'Persona', moeda: 'Moneda', data: 'Fecha' },
    escolher: 'Elija el campo',
    criar: (nome: string) => `Crear el campo "${nome}"`,
    opcional: 'Opcional',
    faltam: (n: number) => `Falta vincular ${n} ${plural(n, 'campo obligatorio', 'campos obligatorios')}.`,
    travados: 'Los campos vinculados quedan bloqueados mientras el submódulo esté activo: nadie puede borrarlos ni cambiar su tipo.',
    confirmar: 'Activar Capturas',
    toast: (categoria: string) => `Capturas activado. Los procesos quedan en ${categoria}.`,
    toastCriados: (n: number) => `${n} ${plural(n, 'campo creado', 'campos creados')} en la categoría.`,
  },

  destino: {
    descricao: 'Cada captura tratada va a la categoría de procesos vinculada al submódulo, o a la Agenda, cuando es una audiencia.',
    audiencia: { captura: 'Audiencia', vaiPara: 'Ítem nuevo en Audiências, en la Agenda', revisao: 'Siempre: la fecha viene del texto' },
    andamento: 'Línea de tiempo del proceso, en la pestaña Movimientos',
    categoria: {
      titulo: 'Categoría de los procesos',
      desc: 'Elegida al activar el submódulo. Para cambiarla, desactive Capturas y actívelo de nuevo.',
      criado: 'Creado por el submódulo',
      travado: 'Bloqueado mientras Capturas esté activo',
      casoDeUso: 'Creada por el caso de uso Contencioso',
    },
  },

  processo: {
    andamentos: 'Movimientos',
    vazio: 'Ningún movimiento registrado en este proceso.',
    naCaixa: (n: number) => `${n} ${plural(n, 'movimiento espera', 'movimientos esperan')} en la bandeja Capturas.`,
    irCaixa: 'Abrir la bandeja Capturas',
    entradaDireta: 'Entrada directa',
    proximaAudiencia: 'Próxima audiencia',
  },

  memoria: {
    ateHora: (h: string, fuso: string) => `hasta las ${h}, ${fuso}`,
    naAudiencia: 'En la audiencia',
  },

  config: {
    subtitulo: 'Submódulo Capturas: fuentes, términos monitoreados, destino de las capturas, eventos para el Spaceflow y las reglas que calculan el plazo.',
  },
}

export const textosTratamento: Record<Idioma, TextosTratamento> = { 'pt-BR': pt, en, es }
