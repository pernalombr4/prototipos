/**
 * O catálogo dos nós do Spaceflow na proposta: grupo, ícone, nome, descrição
 * da paleta, as seções do modal e cada campo com rótulo, instrução (o `help`
 * sob o campo), dica (o "?" com tooltip) e ajuda por opção.
 *
 * Regra desta proposta: **nenhuma configuração nova**. Todo campo aponta para
 * uma chave que o schema `WorkflowNode` já tem (ou que o develop já mostra).
 * O que muda é rótulo, ajuda, ordem, agrupamento e o que fica recolhido.
 *
 * O texto segue o meio-termo do protótipo `no-de-atraso`: rótulo de 1 a 3
 * palavras, instrução de 1 frase sob o campo, explicação longa no "?".
 * Sem travessão em texto de tela (regra 33).
 */
import type { Idioma } from '~/composables/useIdioma'

export type L = Record<Idioma, string>
export const l = (pt: string, en: string, es: string): L => ({ 'pt-BR': pt, en, es })

export type Grupo = 'gatilhos' | 'acoes' | 'ia' | 'logica' | 'documentacao' | 'integracoes'

export type TipoDeCampo =
  | 'texto' | 'numero' | 'select' | 'multi' | 'switch' | 'rico' | 'textoLongo'
  | 'emails' | 'slider' | 'chaveValor' | 'condicoes' | 'construtor' | 'rotasIa'
  | 'rotas' | 'entradas' | 'arquivos' | 'listaVariaveis' | 'variavel' | 'membro'
  | 'camposDaAcao' | 'permissoes' | 'aviso' | 'webhook' | 'codigo' | 'respostaHttp'
  | 'origemDoEvento'

/** De onde vêm as opções de um select que depende do workspace. */
export type Fonte =
  | 'categorias' | 'membros' | 'credenciais' | 'modelos' | 'agentes' | 'ferramentas'
  | 'comparacoes' | 'modelosDeEmail' | 'caixasDeEmail' | 'fusos' | 'formularios' | 'camposDaCategoria' | 'fluxos' | 'fluxosDeOrigem'

export interface Opcao {
  valor: string | number | null
  rotulo: L
  /** O "?" no fim da linha da opção (rodada 5 do `no-de-atraso`). */
  ajuda?: L
  desativado?: boolean
  selo?: L
}

/** O dado do nó, solto: cada tipo tem o seu, o schema é `$loose`. */
export type Dado = Record<string, any>

export interface Campo {
  /** Caminho no `data` do nó, com ponto: `task_due_config.value`. */
  chave: string
  tipo: TipoDeCampo
  rotulo?: L
  /** Instrução curta, sempre visível sob o campo. */
  ajuda?: L
  /** Explicação longa no "?" do rótulo. */
  dica?: L
  placeholder?: L
  obrigatorio?: boolean
  opcoes?: Opcao[]
  fonte?: Fonte
  /** Mostra o botão {x} que abre Variáveis de Entrada, e aceita soltar variável. */
  aceitaVariavel?: boolean
  visivel?: (d: Dado) => boolean
  /** Ocupa meia linha, ao lado do próximo campo de meia linha. */
  metade?: boolean
  min?: number
  max?: number
  passo?: number
  sufixo?: L
  /** Para `aviso`: a cor e o texto. */
  cor?: 'info' | 'warning' | 'neutral'
  texto?: L
  /** Para `construtor`: pede a descrição de cada campo (IA Extratora). */
  comDescricao?: boolean
}

export interface Secao {
  id: string
  titulo: L
  /** 1 frase sob o título: o que a seção decide (rodada 4). */
  descricao?: L
  /** Recolhida ao abrir: só o que é mesmo secundário (regra 28). */
  recolhida?: boolean
  /** Mostra o selo "opcional" no título. */
  opcional?: boolean
  campos: Campo[]
  visivel?: (d: Dado) => boolean
  /** Para o nó com abas (HTTP). */
  aba?: string
}

export interface Saida { id: string, rotulo: L }
export interface VariavelDeSaida { chave: string, rotulo: L, tipo?: string }

export interface DefinicaoDoNo {
  tipo: string
  grupo: Grupo
  icone: string
  nome: L
  /** 1 frase, a mesma na paleta e no cabeçalho do modal. */
  descricao: L
  secoes: Secao[]
  abas?: { id: string, rotulo: L }[]
  /** As alças de saída, com rótulo no canvas. Vazio = 1 saída sem rótulo. */
  saidas?: (d: Dado) => Saida[]
  /** O que o nó entrega aos seguintes (painel SAÍDA). */
  variaveis?: (d: Dado) => VariavelDeSaida[]
  /** Regras de pendência além dos obrigatórios (mínimo de linhas etc.). */
  pendenciasExtras?: (d: Dado) => L[]
  /** Sem entrada (Início) ou sem saída (Fim). */
  semEntrada?: boolean
  semSaida?: boolean
  emBreve?: boolean
}

/* ------------------------------------------------------------------ *
 * Peças repetidas                                                     *
 * ------------------------------------------------------------------ */

const nomeDoNo: Campo = {
  chave: 'label',
  tipo: 'texto',
  rotulo: l('Nome do nó', 'Node name', 'Nombre del nodo'),
  ajuda: l('Aparece no card e na lista de variáveis.', 'Shown on the card and in the variable list.', 'Aparece en la tarjeta y en la lista de variables.'),
  dica: l(
    'Diga o que a etapa faz, ex.: Aprovação da diretoria. É por esse nome que os nós seguintes acham as variáveis deste.',
    'Say what the step does, e.g. Board approval. Later nodes find this node\'s variables by this name.',
    'Diga qué hace la etapa, ej.: Aprobación de la dirección. Los nodos siguientes encuentran sus variables por este nombre.',
  ),
  obrigatorio: true,
}

const geral = (...extra: Campo[]): Secao => ({
  id: 'geral',
  titulo: l('Geral', 'General', 'General'),
  campos: [nomeDoNo, ...extra],
})

const operadores: Opcao[] = [
  { valor: '==', rotulo: l('é igual a', 'equals', 'es igual a') },
  { valor: '!=', rotulo: l('é diferente de', 'is not', 'es distinto de') },
  { valor: '>', rotulo: l('é maior que', 'is greater than', 'es mayor que') },
  { valor: '<', rotulo: l('é menor que', 'is less than', 'es menor que') },
  { valor: '>=', rotulo: l('é maior ou igual a', 'is at least', 'es mayor o igual a') },
  { valor: '<=', rotulo: l('é menor ou igual a', 'is at most', 'es menor o igual a') },
  { valor: 'contains', rotulo: l('contém', 'contains', 'contiene') },
  { valor: 'notNull', rotulo: l('está preenchido', 'is filled', 'está completo'), ajuda: l('Não pede valor.', 'Needs no value.', 'No pide valor.') },
  { valor: 'isNull', rotulo: l('está vazio', 'is empty', 'está vacío'), ajuda: l('Não pede valor.', 'Needs no value.', 'No pide valor.') },
]
export { operadores }

const provedor: Campo = {
  chave: 'provider',
  tipo: 'select',
  rotulo: l('Provedor', 'Provider', 'Proveedor'),
  ajuda: l('Por onde o e-mail sai.', 'How the email is sent.', 'Por dónde sale el correo.'),
  opcoes: [
    { valor: 'enspace', rotulo: l('ENSPACE', 'ENSPACE', 'ENSPACE'), ajuda: l('Servidor do próprio ENSPACE. Não pede configuração.', 'ENSPACE\'s own server. No setup needed.', 'Servidor del propio ENSPACE. No requiere configuración.') },
    { valor: 'smtp', rotulo: l('SMTP', 'SMTP', 'SMTP'), ajuda: l('Servidor de e-mail da empresa, configurado em E-mails.', 'Your company mail server, set up in Emails.', 'Servidor de correo de la empresa, configurado en Correos.') },
    { valor: 'integration', rotulo: l('Integração', 'Integration', 'Integración'), ajuda: l('Serviço externo conectado em Integrações, ex.: SendGrid.', 'External service connected in Integrations, e.g. SendGrid.', 'Servicio externo conectado en Integraciones, ej.: SendGrid.') },
  ],
}

const layoutBase: Campo = {
  chave: 'base_layout',
  tipo: 'select',
  rotulo: l('Layout', 'Layout', 'Diseño'),
  ajuda: l('Moldura em volta do texto do e-mail.', 'Frame around the email text.', 'Marco alrededor del texto del correo.'),
  opcoes: [
    { valor: 'enspace', rotulo: l('Padrão do ENSPACE', 'ENSPACE default', 'Estándar de ENSPACE'), ajuda: l('Cabeçalho e rodapé com a marca do workspace.', 'Header and footer with the workspace brand.', 'Encabezado y pie con la marca del workspace.') },
    { valor: 'empty', rotulo: l('Sem layout', 'No layout', 'Sin diseño'), ajuda: l('Só o que você escrever no corpo.', 'Only what you write in the body.', 'Solo lo que escriba en el cuerpo.') },
  ],
}

/** Assunto e corpo, com o aviso do cifrão que hoje só existe na documentação. */
const mensagem = (obrigatorio = true): Campo[] => [
  {
    chave: 'subject',
    tipo: 'texto',
    rotulo: l('Assunto', 'Subject', 'Asunto'),
    obrigatorio,
    aceitaVariavel: true,
    placeholder: l('ex.: Contrato {{referência}} aprovado', 'e.g. Contract {{reference}} approved', 'ej.: Contrato {{referencia}} aprobado'),
  },
  {
    chave: 'body',
    tipo: 'rico',
    rotulo: l('Corpo', 'Body', 'Cuerpo'),
    obrigatorio,
    aceitaVariavel: true,
    ajuda: l('Digite {{ ou arraste uma variável para inserir dado do fluxo.', 'Type {{ or drag a variable to insert flow data.', 'Escriba {{ o arrastre una variable para insertar datos del flujo.'),
    dica: l(
      'Para valor em reais, escreva "R$" com espaço antes do número. O cifrão colado em número ou em & corrompe o texto no envio.',
      'For amounts in reais, write "R$" with a space before the number. A dollar sign stuck to a number or to & breaks the text when sent.',
      'Para montos en reales, escriba "R$" con un espacio antes del número. El signo pegado a un número o a & corrompe el texto al enviar.',
    ),
  },
]

/* ------------------------------------------------------------------ *
 * O bloco de tarefa (Aprovação, Tarefa, Formulário, CRUD manual)      *
 * ------------------------------------------------------------------ */

const unidadesDePrazo: Opcao[] = [
  { valor: 'minutes', rotulo: l('minutos', 'minutes', 'minutos') },
  { valor: 'hours', rotulo: l('horas', 'hours', 'horas') },
  { valor: 'days', rotulo: l('dias', 'days', 'días') },
  { valor: 'weeks', rotulo: l('semanas', 'weeks', 'semanas') },
  { valor: 'months', rotulo: l('meses', 'months', 'meses') },
  { valor: 'years', rotulo: l('anos', 'years', 'años') },
]

const secoesDeTarefa = (opcoes: { visivel?: (d: Dado) => boolean, rotuloConteudo?: L } = {}): Secao[] => [
  {
    id: 'tarefa',
    titulo: l('Tarefa', 'Task', 'Tarea'),
    visivel: opcoes.visivel,
    campos: [
      {
        chave: 'task_name',
        tipo: 'texto',
        rotulo: l('Título da tarefa', 'Task title', 'Título de la tarea'),
        ajuda: l('O que a pessoa vê na lista de tarefas.', 'What people see in the task list.', 'Lo que la persona ve en la lista de tareas.'),
        placeholder: l('ex.: Aprovar contrato {{referência}}', 'e.g. Approve contract {{reference}}', 'ej.: Aprobar contrato {{referencia}}'),
        obrigatorio: true,
        aceitaVariavel: true,
      },
      {
        chave: 'task_content',
        tipo: 'rico',
        rotulo: opcoes.rotuloConteudo ?? l('Instruções', 'Instructions', 'Instrucciones'),
        ajuda: l('O que a pessoa precisa fazer. Aparece ao abrir a tarefa.', 'What the person needs to do. Shown when the task opens.', 'Lo que la persona debe hacer. Aparece al abrir la tarea.'),
        dica: l(
          'Aceita variáveis. Para formatar valor ou data aqui, use o sufixo __mod; a função format() não funciona neste campo e o valor sai vazio.',
          'Accepts variables. To format a value or date here, use the __mod suffix; format() does not work in this field and the value comes out empty.',
          'Acepta variables. Para formatear valor o fecha aquí, use el sufijo __mod; format() no funciona en este campo y el valor sale vacío.',
        ),
        obrigatorio: true,
        aceitaVariavel: true,
      },
      {
        chave: 'task_item',
        tipo: 'variavel',
        rotulo: l('Item vinculado', 'Linked item', 'Ítem vinculado'),
        ajuda: l('Mostra o item dentro da tarefa.', 'Shows the item inside the task.', 'Muestra el ítem dentro de la tarea.'),
        dica: l(
          'Só tem item para vincular quando o Início é por Evento em item ou quando uma Operação CRUD de leitura vem antes deste nó.',
          'An item is only available when the Start is an Item event or a read CRUD operation comes before this node.',
          'Solo hay ítem para vincular cuando el Inicio es por Evento en ítem o cuando una Operación CRUD de lectura viene antes de este nodo.',
        ),
        aceitaVariavel: true,
      },
    ],
  },
  {
    id: 'responsaveis',
    titulo: l('Responsáveis e permissões', 'Assignees and permissions', 'Responsables y permisos'),
    visivel: opcoes.visivel,
    campos: [
      {
        chave: 'assign_to',
        tipo: 'membro',
        rotulo: l('Responsável', 'Assignee', 'Responsable'),
        ajuda: l('Quem executa. Vazio: a primeira pessoa que abrir a tarefa assume.', 'Who does it. Empty: the first person to open the task takes it.', 'Quién la ejecuta. Vacío: la primera persona que abra la tarea la asume.'),
        dica: l(
          'Escolha um membro ou arraste uma variável com o e-mail de um membro. Se a variável chegar vazia, a tarefa fica sem dono: preencha o responsável alternativo.',
          'Pick a member or drag a variable with a member\'s email. If the variable arrives empty, the task has no owner: fill in the backup assignee.',
          'Elija un miembro o arrastre una variable con el correo de un miembro. Si la variable llega vacía, la tarea queda sin dueño: complete el responsable alternativo.',
        ),
        aceitaVariavel: true,
      },
      {
        chave: 'backup_assignee',
        tipo: 'membro',
        rotulo: l('Responsável alternativo', 'Backup assignee', 'Responsable alternativo'),
        ajuda: l('Assume quando o responsável não é encontrado.', 'Takes over when the assignee is not found.', 'Asume cuando no se encuentra al responsable.'),
      },
      {
        chave: 'collaborators',
        tipo: 'multi',
        fonte: 'membros',
        rotulo: l('Colaboradores', 'Collaborators', 'Colaboradores'),
        ajuda: l('Acompanham a tarefa e podem agir nela.', 'Follow the task and can act on it.', 'Siguen la tarea y pueden actuar en ella.'),
      },
      {
        chave: 'creator',
        tipo: 'membro',
        rotulo: l('Criador', 'Creator', 'Creador'),
        ajuda: l('Aparece como quem criou a tarefa.', 'Shown as who created the task.', 'Aparece como quien creó la tarea.'),
      },
      {
        chave: 'task_permissions',
        tipo: 'permissoes',
        rotulo: l('Quem pode ver', 'Who can see', 'Quién puede ver'),
        ajuda: l('Vazio: todos do workspace veem a tarefa.', 'Empty: everyone in the workspace sees the task.', 'Vacío: todos en el workspace ven la tarea.'),
      },
    ],
  },
  {
    id: 'prazo',
    titulo: l('Prazo', 'Due date', 'Plazo'),
    opcional: true,
    visivel: opcoes.visivel,
    campos: [
      {
        chave: 'task_due_config.due_type',
        tipo: 'select',
        rotulo: l('Contar a partir de', 'Count from', 'Contar desde'),
        ajuda: l('O ponto de partida do prazo.', 'Where the due date starts counting.', 'El punto de partida del plazo.'),
        opcoes: [
          { valor: 'static', rotulo: l('Criação da tarefa', 'Task creation', 'Creación de la tarea'), ajuda: l('O prazo conta a partir do momento em que a tarefa nasce.', 'The due date counts from when the task is created.', 'El plazo cuenta desde que nace la tarea.') },
          { valor: 'dynamic', rotulo: l('Uma data', 'A date', 'Una fecha'), ajuda: l('O prazo conta a partir de uma data fixa ou de uma variável de data.', 'The due date counts from a fixed date or a date variable.', 'El plazo cuenta desde una fecha fija o una variable de fecha.') },
        ],
      },
      {
        chave: 'task_due_config.origin',
        tipo: 'variavel',
        rotulo: l('Data de partida', 'Start date', 'Fecha de partida'),
        ajuda: l('Arraste a variável da data. Vazio: a criação da tarefa.', 'Drag the date variable. Empty: task creation.', 'Arrastre la variable de fecha. Vacío: la creación de la tarea.'),
        aceitaVariavel: true,
        visivel: d => d.task_due_config?.due_type === 'dynamic',
      },
      {
        chave: 'task_due_config.value',
        tipo: 'numero',
        rotulo: l('Prazo', 'Due in', 'Plazo'),
        ajuda: l('Número negativo conta para trás.', 'A negative number counts backwards.', 'Un número negativo cuenta hacia atrás.'),
        dica: l('Ex.: -15 dias a partir do vencimento cria a tarefa com prazo 15 dias antes dele.', 'E.g. -15 days from the expiry date sets the task due 15 days before it.', 'Ej.: -15 días desde el vencimiento fija la tarea 15 días antes.'),
        metade: true,
      },
      {
        chave: 'task_due_config.calculation',
        tipo: 'select',
        rotulo: l('Unidade', 'Unit', 'Unidad'),
        ajuda: l('Minutos a anos.', 'Minutes to years.', 'De minutos a años.'),
        opcoes: unidadesDePrazo,
        metade: true,
      },
      {
        chave: 'task_due_config.business',
        tipo: 'switch',
        rotulo: l('Só dias úteis', 'Business days only', 'Solo días hábiles'),
        ajuda: l('Pula fins de semana e feriados do calendário do workspace.', 'Skips weekends and holidays from the workspace calendar.', 'Omite fines de semana y feriados del calendario del workspace.'),
      },
      {
        chave: 'enable_notifications',
        tipo: 'switch',
        rotulo: l('Avisar perto do vencimento', 'Notify near the due date', 'Avisar cerca del vencimiento'),
        ajuda: l('Notifica os responsáveis quando o prazo estiver perto ou vencido.', 'Notifies assignees when the due date is near or past.', 'Notifica a los responsables cuando el plazo esté cerca o vencido.'),
      },
    ],
  },
  {
    id: 'classificacao',
    titulo: l('Classificação', 'Classification', 'Clasificación'),
    opcional: true,
    recolhida: true,
    visivel: opcoes.visivel,
    campos: [
      {
        chave: 'task_priority',
        tipo: 'select',
        rotulo: l('Prioridade', 'Priority', 'Prioridad'),
        ajuda: l('Ordena a lista de tarefas de quem recebe.', 'Sorts the assignee\'s task list.', 'Ordena la lista de tareas de quien la recibe.'),
        metade: true,
        opcoes: [
          { valor: 'low', rotulo: l('Baixa', 'Low', 'Baja') },
          { valor: 'normal', rotulo: l('Normal', 'Normal', 'Normal') },
          { valor: 'high', rotulo: l('Alta', 'High', 'Alta') },
          { valor: 'urgent', rotulo: l('Urgente', 'Urgent', 'Urgente') },
        ],
      },
      {
        chave: 'task_points',
        tipo: 'numero',
        rotulo: l('Pontos', 'Points', 'Puntos'),
        ajuda: l('Somam na pontuação de quem conclui.', 'Added to the score of who completes it.', 'Suman a la puntuación de quien la completa.'),
        min: 0,
        metade: true,
      },
    ],
  },
  {
    id: 'externa',
    titulo: l('Pessoa de fora', 'External person', 'Persona externa'),
    opcional: true,
    recolhida: true,
    visivel: opcoes.visivel,
    campos: [
      {
        chave: 'external_task',
        tipo: 'switch',
        rotulo: l('Enviar a tarefa por e-mail', 'Send the task by email', 'Enviar la tarea por correo'),
        ajuda: l('Para quem não é membro. A pessoa vê só o título, as instruções e a ação.', 'For non-members. They see only the title, instructions and action.', 'Para quien no es miembro. Ve solo el título, las instrucciones y la acción.'),
        dica: l(
          'Com esta opção, o Responsável aceita uma variável com o e-mail da pessoa de fora. O e-mail traz o botão Acessar Tarefa.',
          'With this on, Assignee accepts a variable with the outside person\'s email. The email carries an Access Task button.',
          'Con esta opción, Responsable acepta una variable con el correo de la persona externa. El correo trae el botón Acceder a la Tarea.',
        ),
      },
      { ...layoutBase, visivel: d => !!d.external_task },
      {
        chave: 'subject',
        tipo: 'texto',
        rotulo: l('Assunto do e-mail', 'Email subject', 'Asunto del correo'),
        aceitaVariavel: true,
        visivel: d => !!d.external_task,
      },
      {
        chave: 'email_content',
        tipo: 'rico',
        rotulo: l('Mensagem do e-mail', 'Email message', 'Mensaje del correo'),
        ajuda: l('Texto antes do botão Acessar Tarefa.', 'Text before the Access Task button.', 'Texto antes del botón Acceder a la Tarea.'),
        aceitaVariavel: true,
        visivel: d => !!d.external_task,
      },
    ],
  },
]

/* ------------------------------------------------------------------ *
 * O catálogo                                                          *
 * ------------------------------------------------------------------ */

const modosDeInicio: Opcao[] = [
  { valor: 'manual', rotulo: l('Manual', 'Manual', 'Manual'), ajuda: l('Alguém inicia pelo botão Iniciar, em Spaceflows, e preenche o formulário de início.', 'Someone starts it with the Start button in Spaceflows and fills in the start form.', 'Alguien lo inicia con el botón Iniciar, en Spaceflows, y completa el formulario de inicio.') },
  { valor: 'events', rotulo: l('Evento na plataforma', 'Platform event', 'Evento en la plataforma'), ajuda: l('Inicia quando um item ou uma tarefa é criado, alterado ou excluído.', 'Starts when an item or a task is created, updated or deleted.', 'Inicia cuando un ítem o una tarea se crea, modifica o elimina.') },
  { valor: 'webhook', rotulo: l('Webhook', 'Webhook', 'Webhook'), ajuda: l('Inicia quando outro sistema chama o endereço do fluxo.', 'Starts when another system calls the flow\'s address.', 'Inicia cuando otro sistema llama a la dirección del flujo.') },
  { valor: 'cron', rotulo: l('Agendamento', 'Schedule', 'Programación'), ajuda: l('Inicia sozinho, na frequência e no horário definidos.', 'Starts on its own at the set frequency and time.', 'Inicia solo, en la frecuencia y hora definidas.') },
  { valor: 'mailbox', rotulo: l('E-mail recebido', 'Email received', 'Correo recibido'), ajuda: l('Inicia quando chega um e-mail numa caixa monitorada.', 'Starts when an email arrives in a watched mailbox.', 'Inicia cuando llega un correo a una casilla monitoreada.') },
]

const frequencias: Opcao[] = [
  { valor: 'hour', rotulo: l('A cada hora', 'Every hour', 'Cada hora'), ajuda: l('Roda de 1 em 1 hora.', 'Runs once an hour.', 'Se ejecuta cada hora.') },
  { valor: 'day', rotulo: l('Todo dia', 'Every day', 'Todos los días'), ajuda: l('Roda 1 vez por dia, no horário escolhido.', 'Runs once a day at the chosen time.', 'Se ejecuta 1 vez al día a la hora elegida.') },
  { valor: 'week', rotulo: l('Toda semana', 'Every week', 'Cada semana'), ajuda: l('Roda 1 vez por semana, no dia e no horário escolhidos.', 'Runs once a week on the chosen day and time.', 'Se ejecuta 1 vez por semana el día y la hora elegidos.') },
  { valor: 'month', rotulo: l('Todo mês', 'Every month', 'Cada mes'), ajuda: l('Roda 1 vez por mês, no dia e no horário escolhidos.', 'Runs once a month on the chosen day and time.', 'Se ejecuta 1 vez al mes el día y la hora elegidos.') },
  { valor: 'year', rotulo: l('Todo ano', 'Every year', 'Cada año'), ajuda: l('Roda 1 vez por ano, no mês, dia e horário escolhidos.', 'Runs once a year on the chosen month, day and time.', 'Se ejecuta 1 vez al año el mes, día y hora elegidos.') },
]

const diasDaSemana: Opcao[] = [
  ['1', 'Segunda-feira', 'Monday', 'Lunes'], ['2', 'Terça-feira', 'Tuesday', 'Martes'], ['3', 'Quarta-feira', 'Wednesday', 'Miércoles'],
  ['4', 'Quinta-feira', 'Thursday', 'Jueves'], ['5', 'Sexta-feira', 'Friday', 'Viernes'], ['6', 'Sábado', 'Saturday', 'Sábado'], ['0', 'Domingo', 'Sunday', 'Domingo'],
].map(([v, p, e, s]) => ({ valor: v!, rotulo: l(p!, e!, s!) }))

const meses: Opcao[] = [
  ['Janeiro', 'January', 'Enero'], ['Fevereiro', 'February', 'Febrero'], ['Março', 'March', 'Marzo'], ['Abril', 'April', 'Abril'],
  ['Maio', 'May', 'Mayo'], ['Junho', 'June', 'Junio'], ['Julho', 'July', 'Julio'], ['Agosto', 'August', 'Agosto'],
  ['Setembro', 'September', 'Septiembre'], ['Outubro', 'October', 'Octubre'], ['Novembro', 'November', 'Noviembre'], ['Dezembro', 'December', 'Diciembre'],
].map(([p, e, s], i) => ({ valor: String(i + 1), rotulo: l(p!, e!, s!) }))

const diasDoMes: Opcao[] = Array.from({ length: 31 }, (_, i) => ({ valor: String(i + 1), rotulo: l(`Dia ${i + 1}`, `Day ${i + 1}`, `Día ${i + 1}`) }))
const horasDoDia: Opcao[] = Array.from({ length: 24 }, (_, i) => {
  const h = `${String(i).padStart(2, '0')}:00`
  return { valor: String(i), rotulo: l(h, h, h) }
})

const modelo = (padrao: number, max = 2): Secao => ({
  id: 'modelo',
  titulo: l('Modelo', 'Model', 'Modelo'),
  opcional: true,
  recolhida: true,
  campos: [
    {
      chave: 'model',
      tipo: 'select',
      fonte: 'modelos',
      rotulo: l('Modelo', 'Model', 'Modelo'),
      ajuda: l('Consome en-credits a cada execução.', 'Uses en-credits on every run.', 'Consume en-credits en cada ejecución.'),
      obrigatorio: true,
    },
    {
      chave: 'temperature',
      tipo: 'slider',
      rotulo: l('Criatividade', 'Creativity', 'Creatividad'),
      ajuda: l(`0 responde sempre igual; ${max} varia mais. Padrão ${String(padrao).replace('.', ',')}.`, `0 always answers the same; ${max} varies more. Default ${padrao}.`, `0 responde siempre igual; ${max} varía más. Estándar ${String(padrao).replace('.', ',')}.`),
      min: 0,
      max,
      passo: 0.1,
    },
  ],
})

/**
 * O valor que a opção "Tarefas" da lista Categoria de Referência grava em
 * `scope`, na branch do evento de tarefa (PR 2925). O nome é provisório: o
 * time troca pelo real. "Membros (em breve)" grava `members`.
 */
export const ESCOPO_TAREFAS = 'tasks'
export const ESCOPO_MEMBROS = 'members'
/** Item escolhido e categoria ainda não: estado do protótipo. No produto, `scope` fica vazio até a categoria. */
export const ESCOPO_ITEM_SEM_CATEGORIA = '__item'
/** Evento de item: `scope` é o id de uma categoria. */
export const ehItem = (d: Dado) => !!d.scope && ![ESCOPO_TAREFAS, ESCOPO_MEMBROS, ESCOPO_ITEM_SEM_CATEGORIA].includes(d.scope)

export const definicoes: Record<string, DefinicaoDoNo> = {
  /* ---------------- Gatilhos ---------------- */
  trigger: {
    tipo: 'trigger',
    grupo: 'gatilhos',
    icone: 'i-lucide-zap',
    nome: l('Início', 'Start', 'Inicio'),
    descricao: l('Define o que dispara o fluxo.', 'Sets what triggers the flow.', 'Define qué dispara el flujo.'),
    semEntrada: true,
    secoes: [
      geral({
        chave: 'type',
        tipo: 'select',
        rotulo: l('Iniciar por', 'Start by', 'Iniciar por'),
        ajuda: l('O que dispara o fluxo. Os campos abaixo mudam com a escolha.', 'What triggers the flow. The fields below change with it.', 'Qué dispara el flujo. Los campos de abajo cambian con la elección.'),
        opcoes: modosDeInicio,
        obrigatorio: true,
      }),
      {
        id: 'origem',
        titulo: l('O que dispara', 'What triggers it', 'Qué lo dispara'),
        descricao: l('Escolha se o fluxo escuta itens de uma categoria ou tarefas.', 'Choose whether the flow listens to items in a category or to tasks.', 'Elija si el flujo escucha ítems de una categoría o tareas.'),
        visivel: d => d.type === 'events',
        campos: [
          {
            chave: 'scope',
            tipo: 'origemDoEvento',
            rotulo: l('Origem do evento', 'Event source', 'Origen del evento'),
            obrigatorio: true,
            dica: l(
              'Não grava campo novo: Tarefa grava em scope o mesmo valor que a opção Tarefas da lista de categorias grava hoje.',
              'It saves no new field: Task saves in scope the same value the Tasks option of the category list saves today.',
              'No guarda un campo nuevo: Tarea guarda en scope el mismo valor que la opción Tareas de la lista de categorías guarda hoy.',
            ),
          },
          { chave: 'scope', tipo: 'select', fonte: 'categorias', rotulo: l('Categoria', 'Category', 'Categoría'), ajuda: l('Os itens desta categoria disparam o fluxo.', 'Items in this category trigger the flow.', 'Los ítems de esta categoría disparan el flujo.'), obrigatorio: true, visivel: d => ehItem(d) || d.scope === ESCOPO_ITEM_SEM_CATEGORIA },
          {
            chave: 'by_workflow',
            tipo: 'switch',
            rotulo: l('Só tarefas criadas por fluxos', 'Only tasks created by flows', 'Solo tareas creadas por flujos'),
            ajuda: l('Sem isto, qualquer tarefa dispara, inclusive a criada à mão.', 'Without this, any task triggers it, including ones created by hand.', 'Sin esto, cualquier tarea lo dispara, incluso la creada a mano.'),
            dica: l(
              'A tarefa precisa ter nascido de um nó de tarefa (Tarefa, Aprovação ou Formulário) de um dos fluxos escolhidos.',
              'The task must come from a task node (Task, Approval or Form) of one of the chosen flows.',
              'La tarea debe venir de un nodo de tarea (Tarea, Aprobación o Formulario) de uno de los flujos elegidos.',
            ),
            visivel: d => d.scope === ESCOPO_TAREFAS,
          },
          {
            chave: 'source_workflows',
            tipo: 'multi',
            fonte: 'fluxosDeOrigem',
            rotulo: l('Fluxos de origem', 'Source flows', 'Flujos de origen'),
            ajuda: l('Só as tarefas destes fluxos disparam.', 'Only tasks from these flows trigger it.', 'Solo las tareas de estos flujos lo disparan.'),
            obrigatorio: true,
            visivel: d => d.scope === ESCOPO_TAREFAS && !!d.by_workflow,
          },
          {
            // Mesma chave do Vincular ao Item da branch; com Tarefa ela filtra quais tarefas disparam.
            chave: 'link_item',
            tipo: 'switch',
            rotulo: l('Só tarefas com item vinculado', 'Only tasks with a linked item', 'Solo tareas con ítem vinculado'),
            ajuda: l('Tarefa sem item vinculado não dispara o fluxo.', 'A task with no linked item does not trigger the flow.', 'Una tarea sin ítem vinculado no dispara el flujo.'),
            dica: l(
              'Na branch, Vincular ao Item. Use quando o fluxo precisa do item da tarefa, por exemplo para ler ou alterar campos dele.',
              'In the branch, Vincular ao Item. Use it when the flow needs the task\'s item, for example to read or update its fields.',
              'En la rama, Vincular ao Item. Úselo cuando el flujo necesita el ítem de la tarea, por ejemplo para leer o modificar sus campos.',
            ),
            visivel: d => d.scope === ESCOPO_TAREFAS,
          },
        ],
      },
      {
        id: 'evento',
        titulo: l('Quando dispara', 'When it triggers', 'Cuándo se dispara'),
        descricao: l('O que precisa acontecer para o fluxo começar.', 'What has to happen for the flow to start.', 'Qué tiene que pasar para que el flujo empiece.'),
        visivel: d => d.type === 'events' && (ehItem(d) || d.scope === ESCOPO_TAREFAS),
        campos: [
          {
            chave: 'action',
            tipo: 'select',
            rotulo: l('Quando o item for', 'When the item is', 'Cuando el ítem sea'),
            ajuda: l('Roda 1 vez para cada item afetado.', 'Runs once for each affected item.', 'Se ejecuta 1 vez por cada ítem afectado.'),
            obrigatorio: true,
            visivel: d => ehItem(d),
            opcoes: [
              { valor: 'create', rotulo: l('Criado', 'Created', 'Creado'), ajuda: l('Inclui item importado. A opção de ignorar fluxos na importação não vale para o Spaceflow.', 'Includes imported items. The import\'s skip-flows option does not apply to Spaceflow.', 'Incluye ítems importados. La opción de ignorar flujos al importar no vale para Spaceflow.') },
              { valor: 'update', rotulo: l('Alterado', 'Updated', 'Modificado'), ajuda: l('Gravar no campo monitorado o mesmo valor também dispara.', 'Saving the same value in a watched field also triggers it.', 'Grabar el mismo valor en el campo monitoreado también dispara.') },
              { valor: 'delete', rotulo: l('Excluído', 'Deleted', 'Eliminado'), ajuda: l('Dispara quando o item vai para a lixeira.', 'Triggers when the item goes to the trash.', 'Dispara cuando el ítem va a la papelera.') },
            ],
          },
          {
            chave: 'action',
            tipo: 'select',
            rotulo: l('Quando a tarefa for', 'When the task is', 'Cuando la tarea sea'),
            ajuda: l('Roda 1 vez para cada tarefa afetada.', 'Runs once for each affected task.', 'Se ejecuta 1 vez por cada tarea afectada.'),
            obrigatorio: true,
            visivel: d => d.scope === ESCOPO_TAREFAS,
            opcoes: [
              { valor: 'create', rotulo: l('Criada', 'Created', 'Creada'), ajuda: l('Quando a tarefa nasce, à mão ou por um fluxo.', 'When the task is created, by hand or by a flow.', 'Cuando la tarea nace, a mano o por un flujo.') },
              { valor: 'update', rotulo: l('Alterada', 'Updated', 'Modificada'), ajuda: l('Mudança na tarefa, como status, responsável ou prazo. Confirmar com o time quais mudanças disparam.', 'A change to the task, such as status, assignee or due date. Confirm with the team which changes trigger it.', 'Un cambio en la tarea, como estado, responsable o plazo. Confirmar con el equipo qué cambios lo disparan.') },
              { valor: 'delete', rotulo: l('Excluída', 'Deleted', 'Eliminada'), ajuda: l('Quando a tarefa é excluída.', 'When the task is deleted.', 'Cuando la tarea se elimina.') },
            ],
          },
          { chave: 'cForms', tipo: 'select', fonte: 'formularios', rotulo: l('Formulário', 'Form', 'Formulario'), ajuda: l('Só o item salvo por este formulário. Vazio: qualquer um.', 'Only items saved by this form. Empty: any form.', 'Solo el ítem guardado por este formulario. Vacío: cualquiera.'), visivel: d => ehItem(d) && (d.action === 'create' || d.action === 'update') },
          { chave: 'changed_fields', tipo: 'multi', fonte: 'camposDaCategoria', rotulo: l('Campos alterados', 'Changed fields', 'Campos modificados'), ajuda: l('Só quando um destes campos mudar. Vazio: qualquer campo.', 'Only when one of these fields changes. Empty: any field.', 'Solo cuando cambie uno de estos campos. Vacío: cualquier campo.'), visivel: d => ehItem(d) && d.action === 'update' },
        ],
      },
      {
        id: 'condicoes',
        titulo: l('Condições', 'Conditions', 'Condiciones'),
        descricao: l('Filtro extra: o fluxo só inicia se o evento atender.', 'Extra filter: the flow only starts if the event matches.', 'Filtro extra: el flujo solo inicia si el evento cumple.'),
        opcional: true,
        visivel: d => d.type === 'events' && (ehItem(d) || d.scope === ESCOPO_TAREFAS),
        campos: [{
          chave: 'conditionals',
          tipo: 'condicoes',
          ajuda: l('Sem condições, inicia sempre.', 'With no conditions, it always starts.', 'Sin condiciones, inicia siempre.'),
          dica: l(
            'Na referência: data.campo é o valor depois da mudança; changes.campo só existe se o campo mudou agora; last_update.data.campo é o valor anterior.',
            'In the reference: data.field is the value after the change; changes.field only exists if the field just changed; last_update.data.field is the previous value.',
            'En la referencia: data.campo es el valor después del cambio; changes.campo solo existe si el campo cambió ahora; last_update.data.campo es el valor anterior.',
          ),
        }],
      },
      {
        id: 'formularioDeInicio',
        titulo: l('Formulário de início', 'Start form', 'Formulario de inicio'),
        visivel: d => d.type === 'manual',
        campos: [{ chave: 'form', tipo: 'construtor', ajuda: l('Campos que a pessoa preenche ao iniciar. Cada resposta vira variável.', 'Fields people fill in when starting. Each answer becomes a variable.', 'Campos que la persona completa al iniciar. Cada respuesta se vuelve variable.') }],
      },
      {
        id: 'webhook',
        titulo: l('Endereço e segurança', 'Address and security', 'Dirección y seguridad'),
        visivel: d => d.type === 'webhook',
        campos: [
          { chave: 'webhook', tipo: 'webhook' },
          { chave: 'credentials', tipo: 'select', fonte: 'credenciais', rotulo: l('Credencial', 'Credential', 'Credencial'), ajuda: l('O token que o outro sistema envia. Vale como senha do fluxo.', 'The token the other system sends. It works as the flow\'s password.', 'El token que envía el otro sistema. Funciona como contraseña del flujo.'), obrigatorio: true },
          { chave: 'headers', tipo: 'chaveValor', rotulo: l('Cabeçalhos', 'Headers', 'Encabezados'), ajuda: l('Já vem com content-type e accept.', 'Comes with content-type and accept.', 'Ya viene con content-type y accept.') },
        ],
      },
      {
        id: 'payload',
        titulo: l('Campos recebidos', 'Received fields', 'Campos recibidos'),
        visivel: d => d.type === 'webhook',
        campos: [{
          chave: 'form',
          tipo: 'construtor',
          ajuda: l('Use os mesmos nomes do JSON enviado. Só estes campos viram variáveis com nome.', 'Use the same names as the JSON sent. Only these fields become named variables.', 'Use los mismos nombres del JSON enviado. Solo estos campos se vuelven variables con nombre.'),
        }],
      },
      {
        id: 'agendamento',
        titulo: l('Agendamento', 'Schedule', 'Programación'),
        visivel: d => d.type === 'cron',
        campos: [
          { chave: 'cron_config.periodicity', tipo: 'select', rotulo: l('Frequência', 'Frequency', 'Frecuencia'), opcoes: frequencias, obrigatorio: true, ajuda: l('Execuções que se sobrepõem rodam em paralelo.', 'Overlapping runs execute in parallel.', 'Las ejecuciones superpuestas corren en paralelo.') },
          { chave: 'cron_config.month_specificity', tipo: 'select', rotulo: l('Mês', 'Month', 'Mes'), opcoes: meses, metade: true, visivel: d => d.cron_config?.periodicity === 'year' },
          { chave: 'cron_config.week_day_specificity', tipo: 'select', rotulo: l('Dia da semana', 'Weekday', 'Día de la semana'), opcoes: diasDaSemana, metade: true, visivel: d => d.cron_config?.periodicity === 'week' },
          { chave: 'cron_config.day_specificity', tipo: 'select', rotulo: l('Dia do mês', 'Day of month', 'Día del mes'), opcoes: diasDoMes, metade: true, visivel: d => ['month', 'year'].includes(d.cron_config?.periodicity) },
          { chave: 'cron_config.hour_specificity', tipo: 'select', rotulo: l('Horário', 'Time', 'Hora'), opcoes: horasDoDia, metade: true, visivel: d => d.cron_config?.periodicity && d.cron_config.periodicity !== 'hour' },
          { chave: 'cron_config.timezone', tipo: 'select', fonte: 'fusos', rotulo: l('Fuso horário', 'Time zone', 'Huso horario'), metade: true },
          {
            chave: 'cron_config.match_exact_time',
            tipo: 'switch',
            rotulo: l('Horário exato', 'Exact time', 'Hora exacta'),
            ajuda: l('Roda só no minuto marcado, sem tolerância.', 'Runs only at the set minute, with no tolerance.', 'Se ejecuta solo en el minuto marcado, sin tolerancia.'),
            dica: l(
              'A documentação descreve esta opção com itens e campo de data, que o agendamento não carrega. Confirmar com o time o que ela faz.',
              'The docs describe this option with items and a date field, which a schedule does not carry. Confirm with the team what it does.',
              'La documentación describe esta opción con ítems y campo de fecha, que la programación no tiene. Confirmar con el equipo qué hace.',
            ),
          },
        ],
      },
      {
        id: 'caixas',
        titulo: l('Caixas monitoradas', 'Watched mailboxes', 'Casillas monitoreadas'),
        visivel: d => d.type === 'mailbox',
        campos: [
          { chave: 'mailboxes', tipo: 'multi', fonte: 'caixasDeEmail', rotulo: l('Caixas de e-mail', 'Mailboxes', 'Casillas de correo'), ajuda: l('Cadastradas em E-mails › Caixas de E-mail.', 'Set up in Emails › Mailboxes.', 'Registradas en Correos › Casillas de Correo.'), obrigatorio: true },
          { chave: '_aviso_loop', tipo: 'aviso', cor: 'warning', texto: l('Se o fluxo enviar e-mail para uma destas caixas, ele dispara de novo.', 'If the flow emails one of these mailboxes, it triggers again.', 'Si el flujo envía correo a una de estas casillas, se dispara de nuevo.') },
        ],
      },
      {
        id: 'execucao',
        titulo: l('Execução', 'Run', 'Ejecución'),
        descricao: l('Como cada execução aparece depois.', 'How each run shows up later.', 'Cómo aparece cada ejecución después.'),
        opcional: true,
        campos: [{
          // Rodada 5: com Item, link_item liga a execução ao item. Com Tarefa, a mesma chave é filtro (em O que dispara).
          chave: 'link_item',
          tipo: 'switch',
          rotulo: l('Vincular a execução ao item', 'Link the run to the item', 'Vincular la ejecución al ítem'),
          ajuda: l('O item que disparou mostra esta execução, e as tarefas do fluxo mostram o item.', 'The item that triggered it shows this run, and the flow\'s tasks show the item.', 'El ítem que lo disparó muestra esta ejecución, y las tareas del flujo muestran el ítem.'),
          dica: l(
            'Sem isto, o fluxo roda do mesmo jeito, mas a execução não aparece no item e as tarefas não mostram de onde vieram.',
            'Without this, the flow runs the same way, but the run does not show on the item and tasks do not show where they came from.',
            'Sin esto, el flujo corre igual, pero la ejecución no aparece en el ítem y las tareas no muestran de dónde vinieron.',
          ),
          visivel: d => d.type === 'events' && ehItem(d),
        }, {
          chave: 'title',
          tipo: 'texto',
          rotulo: l('Título da execução', 'Run title', 'Título de la ejecución'),
          ajuda: l('Nome de cada execução na aba Execuções.', 'Name of each run in the Runs tab.', 'Nombre de cada ejecución en la pestaña Ejecuciones.'),
          placeholder: l('ex.: Contrato {{referência}}', 'e.g. Contract {{reference}}', 'ej.: Contrato {{referencia}}'),
          aceitaVariavel: true,
        }],
      },
    ],
    // Tarefa como origem: os campos da tarefa. Nomes provisórios, a branch não mostra a lista.
    variaveis: d => d.scope === ESCOPO_TAREFAS ? [
      { chave: 'task.name', rotulo: l('Título da tarefa', 'Task title', 'Título de la tarea') },
      { chave: 'task.status', rotulo: l('Status da tarefa', 'Task status', 'Estado de la tarea') },
      { chave: 'task.assignee', rotulo: l('Responsável', 'Assignee', 'Responsable') },
      { chave: 'task.due_date', rotulo: l('Prazo', 'Due date', 'Plazo'), tipo: 'date' },
      { chave: 'task.item', rotulo: l('Item vinculado', 'Linked item', 'Ítem vinculado') },
      { chave: 'task.workflow', rotulo: l('Fluxo de origem', 'Source flow', 'Flujo de origen') },
    ] : [
      { chave: 'reference', rotulo: l('Referência', 'Reference', 'Referencia') },
      { chave: 'data.contratante', rotulo: l('Contratante', 'Contracting party', 'Contratante') },
      { chave: 'data.valor_do_contrato', rotulo: l('Valor do contrato', 'Contract value', 'Valor del contrato'), tipo: 'money' },
      { chave: 'data.data_de_vencimento', rotulo: l('Data de vencimento', 'Expiry date', 'Fecha de vencimiento'), tipo: 'date' },
    ],
  },

  /* ---------------- Ações ---------------- */
  form: {
    tipo: 'form',
    grupo: 'acoes',
    icone: 'i-lucide-clipboard-list',
    nome: l('Formulário', 'Form', 'Formulario'),
    descricao: l('Cria uma tarefa com formulário. As respostas viram variáveis.', 'Creates a task with a form. Answers become variables.', 'Crea una tarea con formulario. Las respuestas se vuelven variables.'),
    secoes: [
      geral(),
      secoesDeTarefa()[0]!,
      {
        id: 'campos',
        titulo: l('Campos do formulário', 'Form fields', 'Campos del formulario'),
        campos: [{ chave: 'form', tipo: 'construtor', obrigatorio: true, ajuda: l('O que a pessoa responde. Cada campo vira uma variável.', 'What the person answers. Each field becomes a variable.', 'Lo que la persona responde. Cada campo se vuelve una variable.') }],
      },
      ...secoesDeTarefa().slice(1),
    ],
    pendenciasExtras: d => (d.form?.length ? [] : [l('Campos do formulário', 'Form fields', 'Campos del formulario')]),
    variaveis: d => (d.form ?? []).map((c: any) => ({ chave: c.name ?? c.refId, rotulo: l(c.label, c.label, c.label) })),
  },
  approval: {
    tipo: 'approval',
    grupo: 'acoes',
    icone: 'i-lucide-thumbs-up',
    nome: l('Aprovação', 'Approval', 'Aprobación'),
    descricao: l('Cria uma tarefa de aprovar ou rejeitar. Cada resposta segue por uma saída.', 'Creates an approve-or-reject task. Each answer takes its own output.', 'Crea una tarea de aprobar o rechazar. Cada respuesta sigue por una salida.'),
    secoes: [
      geral({
        chave: '_saidas',
        tipo: 'aviso',
        cor: 'info',
        texto: l(
          'Saídas: Aprovado e Rejeitado. Na rejeição, o motivo é obrigatório e fica na variável motivo_rejeicao.',
          'Outputs: Approved and Rejected. On rejection, a reason is required and goes to the motivo_rejeicao variable.',
          'Salidas: Aprobado y Rechazado. Al rechazar, el motivo es obligatorio y queda en la variable motivo_rejeicao.',
        ),
      }),
      ...secoesDeTarefa(),
    ],
    saidas: () => [
      { id: 'approved', rotulo: l('Aprovado', 'Approved', 'Aprobado') },
      { id: 'rejected', rotulo: l('Rejeitado', 'Rejected', 'Rechazado') },
    ],
    variaveis: () => [
      { chave: 'decisao', rotulo: l('Decisão', 'Decision', 'Decisión') },
      { chave: 'motivo_rejeicao', rotulo: l('Motivo da rejeição', 'Rejection reason', 'Motivo del rechazo') },
    ],
  },
  task: {
    tipo: 'task',
    grupo: 'acoes',
    icone: 'i-lucide-square-check-big',
    nome: l('Tarefa', 'Task', 'Tarea'),
    descricao: l('Cria uma tarefa com prazo e responsável. O fluxo espera a conclusão.', 'Creates a task with a due date and assignee. The flow waits for it.', 'Crea una tarea con plazo y responsable. El flujo espera que se complete.'),
    secoes: [geral(), ...secoesDeTarefa()],
    variaveis: d => (d.external_task ? [{ chave: 'external_task.link', rotulo: l('Link da tarefa externa', 'External task link', 'Enlace de la tarea externa') }] : []),
  },
  email: {
    tipo: 'email',
    grupo: 'acoes',
    icone: 'i-lucide-mail',
    nome: l('E-mail', 'Email', 'Correo'),
    descricao: l('Envia um e-mail automático.', 'Sends an automatic email.', 'Envía un correo automático.'),
    secoes: [
      geral(),
      {
        id: 'destinatarios',
        titulo: l('Destinatários', 'Recipients', 'Destinatarios'),
        campos: [
          { chave: 'to', tipo: 'emails', rotulo: l('Para', 'To', 'Para'), obrigatorio: true, aceitaVariavel: true, ajuda: l('Digite o e-mail e tecle Enter. Aceita variável.', 'Type the email and press Enter. Accepts variables.', 'Escriba el correo y presione Enter. Acepta variables.') },
          { chave: 'cc', tipo: 'emails', rotulo: l('Cópia', 'Cc', 'Copia'), metade: true },
          { chave: 'bcc', tipo: 'emails', rotulo: l('Cópia oculta', 'Bcc', 'Copia oculta'), metade: true },
          { chave: 'replyTo', tipo: 'texto', rotulo: l('Responder para', 'Reply to', 'Responder a'), ajuda: l('Para onde vai a resposta de quem recebe.', 'Where replies go.', 'A dónde va la respuesta de quien recibe.'), aceitaVariavel: true },
        ],
      },
      {
        id: 'mensagem',
        titulo: l('Mensagem', 'Message', 'Mensaje'),
        campos: [
          { chave: 'template', tipo: 'select', fonte: 'modelosDeEmail', rotulo: l('Modelo', 'Template', 'Plantilla'), ajuda: l('Opcional. Usa um modelo salvo e substitui o corpo.', 'Optional. Uses a saved template and replaces the body.', 'Opcional. Usa una plantilla guardada y reemplaza el cuerpo.') },
          ...mensagem(),
        ],
      },
      {
        id: 'anexos',
        titulo: l('Anexos', 'Attachments', 'Adjuntos'),
        opcional: true,
        recolhida: true,
        campos: [
          { chave: 'default_attachments', tipo: 'arquivos', rotulo: l('Arquivos fixos', 'Fixed files', 'Archivos fijos'), ajuda: l('Vão em todo e-mail, ex.: um manual.', 'Sent with every email, e.g. a manual.', 'Van en todo correo, ej.: un manual.') },
          { chave: 'attachments', tipo: 'listaVariaveis', rotulo: l('Arquivos do fluxo', 'Flow files', 'Archivos del flujo'), ajuda: l('Arraste a variável do arquivo, ex.: o contrato do item.', 'Drag the file variable, e.g. the item\'s contract.', 'Arrastre la variable del archivo, ej.: el contrato del ítem.'), aceitaVariavel: true },
        ],
      },
      {
        id: 'envio',
        titulo: l('Envio', 'Delivery', 'Envío'),
        opcional: true,
        recolhida: true,
        campos: [{ ...provedor, metade: true }, { ...layoutBase, metade: true }],
      },
    ],
  },
  crud: {
    tipo: 'crud',
    grupo: 'acoes',
    icone: 'i-lucide-database',
    nome: l('Operações CRUD', 'CRUD operations', 'Operaciones CRUD'),
    descricao: l('Cria, busca, altera ou exclui itens de uma categoria.', 'Creates, finds, updates or deletes items in a category.', 'Crea, busca, modifica o elimina ítems de una categoría.'),
    secoes: [
      geral(),
      {
        id: 'operacao',
        titulo: l('Operação', 'Operation', 'Operación'),
        campos: [
          { chave: 'type', tipo: 'select', fonte: 'categorias', rotulo: l('Categoria', 'Category', 'Categoría'), ajuda: l('Onde a operação acontece.', 'Where the operation happens.', 'Dónde ocurre la operación.'), obrigatorio: true },
          {
            chave: 'action',
            tipo: 'select',
            rotulo: l('Operação', 'Operation', 'Operación'),
            ajuda: l('O que fazer com o item.', 'What to do with the item.', 'Qué hacer con el ítem.'),
            obrigatorio: true,
            opcoes: [
              { valor: 'create', rotulo: l('Criar item', 'Create item', 'Crear ítem'), ajuda: l('Cria um item novo com os campos abaixo.', 'Creates a new item with the fields below.', 'Crea un ítem nuevo con los campos de abajo.') },
              { valor: 'read_one', rotulo: l('Buscar um item', 'Find one item', 'Buscar un ítem'), ajuda: l('Acha 1 item. Os campos dele viram variáveis para os próximos nós.', 'Finds 1 item. Its fields become variables for the next nodes.', 'Encuentra 1 ítem. Sus campos se vuelven variables para los nodos siguientes.') },
              { valor: 'read_many', rotulo: l('Buscar vários itens', 'Find many items', 'Buscar varios ítems'), desativado: true, selo: l('Em breve', 'Soon', 'Pronto') },
              { valor: 'update', rotulo: l('Alterar item', 'Update item', 'Modificar ítem'), ajuda: l('Grava novos valores nos campos de um item existente.', 'Writes new values to fields of an existing item.', 'Graba nuevos valores en campos de un ítem existente.') },
              { valor: 'delete', rotulo: l('Excluir item', 'Delete item', 'Eliminar ítem'), ajuda: l('Manda o item para a lixeira. Dá para restaurar em até 30 dias.', 'Sends the item to the trash. It can be restored within 30 days.', 'Envía el ítem a la papelera. Se puede restaurar hasta en 30 días.') },
            ],
          },
          {
            chave: 'params',
            tipo: 'variavel',
            rotulo: l('Item', 'Item', 'Ítem'),
            ajuda: l('Qual item. Arraste a referência, ex.: a do Início.', 'Which item. Drag the reference, e.g. the Start\'s one.', 'Qué ítem. Arrastre la referencia, ej.: la del Inicio.'),
            dica: l('A busca acha o item por referência, id, status ou tipo. Outros campos não servem para achar.', 'The lookup finds the item by reference, id, status or type. Other fields can\'t be used to find it.', 'La búsqueda encuentra el ítem por referencia, id, estado o tipo. Otros campos no sirven.'),
            obrigatorio: true,
            aceitaVariavel: true,
            visivel: d => ['update', 'delete', 'read_one'].includes(d.action),
          },
        ],
      },
      {
        id: 'campos',
        titulo: l('Campos', 'Fields', 'Campos'),
        visivel: d => d.action === 'create' || d.action === 'update',
        campos: [{
          chave: 'fields',
          tipo: 'camposDaAcao',
          obrigatorio: true,
          ajuda: l('Escolha os campos e o valor de cada um. Aceita variável.', 'Pick the fields and each value. Accepts variables.', 'Elija los campos y el valor de cada uno. Acepta variables.'),
        }],
      },
      {
        id: 'execucao',
        titulo: l('Execução', 'Run', 'Ejecución'),
        opcional: true,
        recolhida: true,
        campos: [{
          chave: 'execution_mode',
          tipo: 'select',
          rotulo: l('Modo', 'Mode', 'Modo'),
          ajuda: l('Automático roda sozinho. Manual espera alguém concluir uma tarefa.', 'Automatic runs on its own. Manual waits for someone to complete a task.', 'Automático corre solo. Manual espera que alguien complete una tarea.'),
          opcoes: [
            { valor: 'automatic', rotulo: l('Automático', 'Automatic', 'Automático'), ajuda: l('A operação roda assim que o fluxo chega aqui.', 'The operation runs as soon as the flow gets here.', 'La operación corre en cuanto el flujo llega aquí.') },
            { valor: 'manual', rotulo: l('Manual', 'Manual', 'Manual'), ajuda: l('Cria uma tarefa. A operação roda quando alguém a conclui.', 'Creates a task. The operation runs when someone completes it.', 'Crea una tarea. La operación corre cuando alguien la completa.') },
          ],
        }],
      },
      ...secoesDeTarefa({ visivel: d => d.execution_mode === 'manual' }).slice(0, 2),
    ],
    pendenciasExtras: d => ((d.action === 'create' || d.action === 'update') && !d.fields?.length ? [l('Campos', 'Fields', 'Campos')] : []),
    variaveis: d => (d.action === 'delete'
      ? [{ chave: 'message', rotulo: l('Mensagem', 'Message', 'Mensaje') }, { chave: 'deleted_at', rotulo: l('Excluído em', 'Deleted at', 'Eliminado en') }]
      : [{ chave: 'reference', rotulo: l('Referência do item', 'Item reference', 'Referencia del ítem') }, { chave: 'data', rotulo: l('Campos do item', 'Item fields', 'Campos del ítem') }]),
  },
  comparison_notification: {
    tipo: 'comparison_notification',
    grupo: 'acoes',
    icone: 'i-lucide-git-compare-arrows',
    nome: l('Notificação de Comparação', 'Comparison notification', 'Notificación de Comparación'),
    descricao: l('Envia por e-mail o relatório de uma comparação.', 'Emails the report of a comparison.', 'Envía por correo el informe de una comparación.'),
    secoes: [
      geral(),
      {
        id: 'comparacao',
        titulo: l('Comparação', 'Comparison', 'Comparación'),
        campos: [
          { chave: 'comparison', tipo: 'select', fonte: 'comparacoes', rotulo: l('Comparação', 'Comparison', 'Comparación'), ajuda: l('Os destinatários e o relatório vêm dela.', 'Recipients and the report come from it.', 'Los destinatarios y el informe vienen de ella.'), obrigatorio: true },
          { chave: '_aviso', tipo: 'aviso', cor: 'neutral', texto: l('O e-mail sai mesmo sem itens pendentes, para todos da comparação.', 'The email goes out even with no pending items, to everyone in the comparison.', 'El correo sale aunque no haya ítems pendientes, para todos en la comparación.') },
        ],
      },
      { id: 'mensagem', titulo: l('Mensagem', 'Message', 'Mensaje'), campos: mensagem() },
      { id: 'envio', titulo: l('Envio', 'Delivery', 'Envío'), opcional: true, recolhida: true, campos: [{ ...provedor, metade: true }, { ...layoutBase, metade: true }] },
    ],
  },

  start: {
    tipo: 'start',
    grupo: 'acoes',
    icone: 'i-lucide-square-arrow-out-up-right',
    nome: l('Iniciar outro fluxo', 'Start another flow', 'Iniciar otro flujo'),
    descricao: l(
      'Dispara outro Spaceflow do workspace. Não passa dados e não espera ele terminar.',
      'Triggers another Spaceflow in the workspace. It passes no data and does not wait for it to finish.',
      'Dispara otro Spaceflow del workspace. No pasa datos y no espera que termine.',
    ),
    secoes: [
      geral(),
      {
        id: 'fluxo',
        titulo: l('Fluxo a iniciar', 'Flow to start', 'Flujo a iniciar'),
        campos: [
          {
            chave: 'type',
            tipo: 'select',
            rotulo: l('Modo', 'Mode', 'Modo'),
            ajuda: l('Automático inicia na hora. Manual pede para alguém escolher.', 'Automatic starts right away. Manual asks someone to choose.', 'Automático inicia en el momento. Manual pide que alguien elija.'),
            obrigatorio: true,
            opcoes: [
              { valor: 'auto', rotulo: l('Automático', 'Automatic', 'Automático'), ajuda: l('Inicia o fluxo escolhido assim que este nó roda. Este fluxo segue para o próximo nó sem esperar.', 'Starts the chosen flow as soon as this node runs. This flow moves on without waiting.', 'Inicia el flujo elegido en cuanto este nodo corre. Este flujo sigue sin esperar.') },
              { valor: 'manual', rotulo: l('Manual', 'Manual', 'Manual'), ajuda: l('Cria uma tarefa em que a pessoa escolhe qual fluxo iniciar. Este fluxo espera a tarefa ser concluída.', 'Creates a task where someone picks which flow to start. This flow waits for the task to be completed.', 'Crea una tarea en la que la persona elige qué flujo iniciar. Este flujo espera que se complete la tarea.') },
            ],
          },
          {
            chave: 'workflow',
            tipo: 'select',
            fonte: 'fluxos',
            rotulo: l('Fluxo', 'Flow', 'Flujo'),
            ajuda: l('Só dá para escolher fluxo Ativo com Início Manual.', 'Only Active flows with a Manual Start can be chosen.', 'Solo se puede elegir un flujo Activo con Inicio Manual.'),
            dica: l(
              'Fluxo com outro tipo de início (evento, webhook, agendamento) ou inativo aparece na lista, cinza, com o motivo. Para ativar, use Detalhes do fluxo, no fluxo de destino.',
              'Flows with another kind of Start (event, webhook, schedule) or inactive ones show in the list, greyed out, with the reason. To activate, use Flow details in the target flow.',
              'Los flujos con otro tipo de inicio (evento, webhook, programación) o inactivos aparecen en la lista, en gris, con el motivo. Para activar, use Detalles del flujo en el flujo de destino.',
            ),
            obrigatorio: true,
            visivel: d => d.type !== 'manual',
          },
          {
            chave: 'workflows',
            tipo: 'multi',
            fonte: 'fluxos',
            rotulo: l('Fluxos para escolher', 'Flows to choose from', 'Flujos para elegir'),
            ajuda: l('A tarefa lista estes fluxos; a pessoa escolhe qual iniciar.', 'The task lists these flows; the person picks which one to start.', 'La tarea lista estos flujos; la persona elige cuál iniciar.'),
            obrigatorio: true,
            visivel: d => d.type === 'manual',
          },
          {
            chave: '_aviso_proprio',
            tipo: 'aviso',
            cor: 'warning',
            texto: l(
              'Este é o próprio fluxo: cada execução vai iniciar outra, sem fim.',
              'This is the flow itself: every run will start another one, endlessly.',
              'Es el propio flujo: cada ejecución iniciará otra, sin fin.',
            ),
            visivel: d => d.workflow === 'entrada-de-contrato' || (d.workflows ?? []).includes('entrada-de-contrato'),
          },
          {
            chave: '_aviso_dados',
            tipo: 'aviso',
            cor: 'info',
            texto: l(
              'O fluxo iniciado começa do zero: não recebe as variáveis deste e não devolve nada. Para enviar dados, use uma Requisição HTTP para o webhook dele.',
              'The started flow begins from scratch: it gets none of this flow\'s variables and returns nothing. To send data, use an HTTP request to its webhook.',
              'El flujo iniciado empieza de cero: no recibe las variables de este y no devuelve nada. Para enviar datos, use una Solicitud HTTP a su webhook.',
            ),
          },
        ],
      },
      ...secoesDeTarefa({ visivel: d => d.type === 'manual' }).slice(0, 3),
    ],
  },

  /* ---------------- IA ---------------- */
  ai_generate: {
    tipo: 'ai_generate',
    grupo: 'ia',
    icone: 'i-lucide-sparkles',
    nome: l('IA Geradora', 'AI Generator', 'IA Generadora'),
    descricao: l('Escreve um texto com IA a partir das suas instruções.', 'Writes text with AI from your instructions.', 'Escribe un texto con IA a partir de sus instrucciones.'),
    secoes: [
      geral(),
      {
        id: 'pedido',
        titulo: l('Pedido', 'Request', 'Pedido'),
        campos: [
          { chave: 'prompt', tipo: 'rico', rotulo: l('Prompt', 'Prompt', 'Prompt'), obrigatorio: true, aceitaVariavel: true, ajuda: l('O que a IA deve escrever. Arraste variáveis para dar contexto.', 'What the AI should write. Drag variables for context.', 'Lo que la IA debe escribir. Arrastre variables para dar contexto.') },
          { chave: 'system', tipo: 'textoLongo', rotulo: l('Regras fixas', 'Fixed rules', 'Reglas fijas'), ajuda: l('Opcional. Tom e formato que valem sempre.', 'Optional. Tone and format that always apply.', 'Opcional. Tono y formato que valen siempre.'), placeholder: l('ex.: Responda em português formal, em até 5 tópicos.', 'e.g. Answer in formal English, in up to 5 bullets.', 'ej.: Responda en español formal, en hasta 5 puntos.'), dica: l('É a instrução de sistema do modelo.', 'This is the model\'s system instruction.', 'Es la instrucción de sistema del modelo.') },
        ],
      },
      modelo(0.7),
    ],
    variaveis: () => [{ chave: 'resposta', rotulo: l('Resposta (texto)', 'Answer (text)', 'Respuesta (texto)') }],
  },
  ai_agent: {
    tipo: 'ai_agent',
    grupo: 'ia',
    icone: 'i-lucide-bot',
    nome: l('Agente de IA', 'AI Agent', 'Agente de IA'),
    descricao: l('Roda um agente que usa as ferramentas do workspace.', 'Runs an agent that uses the workspace tools.', 'Ejecuta un agente que usa las herramientas del workspace.'),
    secoes: [
      geral(),
      {
        id: 'agente',
        titulo: l('Agente', 'Agent', 'Agente'),
        campos: [
          { chave: 'agent', tipo: 'select', fonte: 'agentes', rotulo: l('Agente', 'Agent', 'Agente'), obrigatorio: true, ajuda: l('Traz modelo, regras e ferramentas de Configurações › Agentes de IA.', 'Brings model, rules and tools from Settings › AI agents.', 'Trae modelo, reglas y herramientas de Configuraciones › Agentes de IA.') },
          { chave: 'prompt', tipo: 'rico', rotulo: l('Pedido', 'Request', 'Pedido'), obrigatorio: true, aceitaVariavel: true, ajuda: l('O que o agente deve fazer nesta etapa.', 'What the agent should do in this step.', 'Lo que el agente debe hacer en esta etapa.') },
          { chave: 'tools', tipo: 'multi', fonte: 'ferramentas', rotulo: l('Ferramentas', 'Tools', 'Herramientas'), ajuda: l('Vazio: todas as do agente.', 'Empty: all of the agent\'s tools.', 'Vacío: todas las del agente.') },
        ],
      },
      {
        id: 'limites',
        titulo: l('Limites', 'Limits', 'Límites'),
        opcional: true,
        recolhida: true,
        campos: [
          { chave: 'max_steps', tipo: 'numero', rotulo: l('Máximo de passos', 'Max steps', 'Máximo de pasos'), min: 1, metade: true, ajuda: l('Cada uso de ferramenta é 1 passo. Padrão 10.', 'Each tool call is 1 step. Default 10.', 'Cada uso de herramienta es 1 paso. Estándar 10.') },
          {
            chave: 'reasoning',
            tipo: 'select',
            rotulo: l('Raciocínio', 'Reasoning', 'Razonamiento'),
            metade: true,
            ajuda: l('Só em modelos com suporte.', 'Only on models that support it.', 'Solo en modelos compatibles.'),
            opcoes: [
              { valor: null, rotulo: l('Padrão do modelo', 'Model default', 'Estándar del modelo'), ajuda: l('Usa o que o provedor define.', 'Uses the provider\'s setting.', 'Usa lo que define el proveedor.') },
              { valor: 'off', rotulo: l('Desligado', 'Off', 'Apagado'), ajuda: l('Responde mais rápido.', 'Answers faster.', 'Responde más rápido.') },
              { valor: 'low', rotulo: l('Baixo', 'Low', 'Bajo') },
              { valor: 'medium', rotulo: l('Médio', 'Medium', 'Medio') },
              { valor: 'high', rotulo: l('Alto', 'High', 'Alto'), ajuda: l('Pensa mais antes de agir. Demora mais e consome mais.', 'Thinks more before acting. Slower and uses more credits.', 'Piensa más antes de actuar. Tarda más y consume más.') },
            ],
          },
        ],
      },
    ],
    variaveis: () => [{ chave: 'text', rotulo: l('Resposta (texto)', 'Answer (text)', 'Respuesta (texto)') }],
  },
  ai_router: {
    tipo: 'ai_router',
    grupo: 'ia',
    icone: 'i-lucide-signpost',
    nome: l('IA Roteadora', 'AI Router', 'IA Enrutadora'),
    descricao: l('A IA lê o conteúdo e escolhe por qual rota o fluxo segue.', 'AI reads the content and picks the route the flow takes.', 'La IA lee el contenido y elige por qué ruta sigue el flujo.'),
    secoes: [
      geral(),
      {
        id: 'criterio',
        titulo: l('Critério', 'Criteria', 'Criterio'),
        campos: [{ chave: 'prompt', tipo: 'rico', rotulo: l('Prompt', 'Prompt', 'Prompt'), obrigatorio: true, aceitaVariavel: true, ajuda: l('Como a IA deve decidir. Arraste o conteúdo a analisar.', 'How the AI should decide. Drag the content to analyze.', 'Cómo debe decidir la IA. Arrastre el contenido a analizar.') }],
      },
      {
        id: 'rotas',
        titulo: l('Rotas', 'Routes', 'Rutas'),
        campos: [{ chave: 'routes', tipo: 'rotasIa', obrigatorio: true, ajuda: l('Mínimo 2. Cada rota vira uma saída no card.', 'At least 2. Each route becomes an output on the card.', 'Mínimo 2. Cada ruta se vuelve una salida en la tarjeta.') }],
      },
      modelo(0.2),
    ],
    saidas: d => [
      ...(d.routes ?? []).map((r: any) => ({ id: r.outletId, rotulo: l(r.key, r.key, r.key) })),
      { id: 'fallback', rotulo: l('Nenhuma', 'None', 'Ninguna') },
    ],
    pendenciasExtras: d => ((d.routes?.length ?? 0) < 2 ? [l('2 rotas', '2 routes', '2 rutas')] : []),
    variaveis: () => [
      { chave: 'resposta', rotulo: l('Rota escolhida', 'Chosen route', 'Ruta elegida') },
      { chave: 'precisao', rotulo: l('Confiança', 'Confidence', 'Confianza') },
      { chave: 'razao', rotulo: l('Justificativa', 'Reason', 'Justificación') },
    ],
  },
  ai_extract: {
    tipo: 'ai_extract',
    grupo: 'ia',
    icone: 'i-lucide-scan-text',
    nome: l('IA Extratora', 'AI Extractor', 'IA Extractora'),
    descricao: l('Lê arquivos ou texto e devolve os campos que você pedir.', 'Reads files or text and returns the fields you ask for.', 'Lee archivos o texto y devuelve los campos que pida.'),
    secoes: [
      geral(),
      {
        id: 'campos',
        titulo: l('O que extrair', 'What to extract', 'Qué extraer'),
        campos: [{ chave: 'fields', tipo: 'construtor', comDescricao: true, obrigatorio: true, ajuda: l('Um campo por informação. Diga onde ela costuma estar. Não encontrado volta vazio.', 'One field per piece of data. Say where it usually is. Not found comes back empty.', 'Un campo por dato. Diga dónde suele estar. Lo no encontrado vuelve vacío.') }],
      },
      {
        id: 'fontes',
        titulo: l('De onde ler', 'Where to read from', 'De dónde leer'),
        campos: [
          { chave: 'file_urls', tipo: 'listaVariaveis', rotulo: l('Arquivo do fluxo', 'Flow file', 'Archivo del flujo'), ajuda: l('Muda a cada execução, ex.: o PDF do item. Arraste a variável.', 'Changes every run, e.g. the item\'s PDF. Drag the variable.', 'Cambia en cada ejecución, ej.: el PDF del ítem. Arrastre la variable.'), aceitaVariavel: true },
          { chave: 'input_files', tipo: 'arquivos', rotulo: l('Arquivo fixo', 'Fixed file', 'Archivo fijo'), ajuda: l('O mesmo em toda execução, ex.: uma tabela de preços.', 'The same every run, e.g. a price list.', 'El mismo en toda ejecución, ej.: una lista de precios.') },
          { chave: 'context_data', tipo: 'textoLongo', rotulo: l('Texto', 'Text', 'Texto'), ajuda: l('Conteúdo que não é arquivo, ex.: o corpo de um e-mail.', 'Content that isn\'t a file, e.g. an email body.', 'Contenido que no es archivo, ej.: el cuerpo de un correo.'), aceitaVariavel: true },
        ],
      },
      {
        id: 'ajustes',
        titulo: l('Ajustes', 'Tuning', 'Ajustes'),
        opcional: true,
        recolhida: true,
        campos: [
          { chave: 'prompt', tipo: 'textoLongo', rotulo: l('Instrução adicional', 'Extra instruction', 'Instrucción adicional'), ajuda: l('Como interpretar o conteúdo.', 'How to read the content.', 'Cómo interpretar el contenido.'), aceitaVariavel: true },
          { chave: 'model', tipo: 'select', fonte: 'modelos', rotulo: l('Modelo', 'Model', 'Modelo'), ajuda: l('Consome en-credits a cada execução.', 'Uses en-credits on every run.', 'Consume en-credits en cada ejecución.'), obrigatorio: true },
        ],
      },
    ],
    pendenciasExtras: d => {
      const p: L[] = []
      if (!d.fields?.length) p.push(l('O que extrair', 'What to extract', 'Qué extraer'))
      if (!d.file_urls?.length && !d.input_files?.length && !d.context_data) p.push(l('De onde ler', 'Where to read from', 'De dónde leer'))
      return p
    },
    variaveis: d => (d.fields ?? []).map((c: any) => ({ chave: `data.${c.name}`, rotulo: l(c.label, c.label, c.label) })),
  },

  /* ---------------- Lógica e controle ---------------- */
  conditionals: {
    tipo: 'conditionals',
    grupo: 'logica',
    icone: 'i-lucide-split',
    nome: l('Condicional', 'Condition', 'Condicional'),
    descricao: l('Segue por Verdadeiro ou Falso conforme as condições.', 'Goes True or False depending on the conditions.', 'Sigue por Verdadero o Falso según las condiciones.'),
    secoes: [
      geral(),
      {
        id: 'condicoes',
        titulo: l('Condições', 'Conditions', 'Condiciones'),
        campos: [{ chave: 'conditionals', tipo: 'condicoes', obrigatorio: true, ajuda: l('Grupo vazio conta como atendido.', 'An empty group counts as met.', 'Un grupo vacío cuenta como cumplido.') }],
      },
    ],
    saidas: () => [
      { id: 'true', rotulo: l('Verdadeiro', 'True', 'Verdadero') },
      { id: 'false', rotulo: l('Falso', 'False', 'Falso') },
    ],
    pendenciasExtras: d => ((d.conditionals?.and?.length ?? 0) + (d.conditionals?.or?.length ?? 0) === 0 ? [l('Uma condição', 'A condition', 'Una condición')] : []),
  },
  route: {
    tipo: 'route',
    grupo: 'logica',
    icone: 'i-lucide-git-branch-plus',
    nome: l('Rotas', 'Routes', 'Rutas'),
    descricao: l('Abre um caminho para cada rota atendida.', 'Opens a path for each route that matches.', 'Abre un camino por cada ruta que se cumple.'),
    secoes: [
      geral(),
      {
        id: 'rotas',
        titulo: l('Rotas', 'Routes', 'Rutas'),
        campos: [
          {
            chave: '_aviso',
            tipo: 'aviso',
            cor: 'warning',
            texto: l(
              'Todas as rotas atendidas seguem juntas. A saída Sempre segue em toda execução, mesmo quando uma rota é atendida.',
              'All matching routes run together. The Always output runs every time, even when a route matches.',
              'Todas las rutas cumplidas siguen juntas. La salida Siempre sigue en toda ejecución, aunque se cumpla una ruta.',
            ),
          },
          { chave: 'routes', tipo: 'rotas', obrigatorio: true, ajuda: l('Cada rota vira uma saída no card.', 'Each route becomes an output on the card.', 'Cada ruta se vuelve una salida en la tarjeta.') },
        ],
      },
    ],
    saidas: d => [
      ...(d.routes ?? []).map((r: any, i: number) => ({ id: r.id ?? `r${i}`, rotulo: l(`Rota ${i + 1}`, `Route ${i + 1}`, `Ruta ${i + 1}`) })),
      { id: 'fallback', rotulo: l('Sempre', 'Always', 'Siempre') },
    ],
    pendenciasExtras: d => (!d.routes?.length ? [l('Uma rota', 'A route', 'Una ruta')] : []),
  },
  merge: {
    tipo: 'merge',
    grupo: 'logica',
    icone: 'i-lucide-merge',
    nome: l('Mesclar', 'Merge', 'Combinar'),
    descricao: l('Junta caminhos num só antes de seguir.', 'Joins paths into one before moving on.', 'Une caminos en uno antes de seguir.'),
    secoes: [
      geral(),
      {
        id: 'entradas',
        titulo: l('Entradas', 'Inputs', 'Entradas'),
        campos: [{
          chave: 'count_rows',
          tipo: 'entradas',
          obrigatorio: true,
          ajuda: l('Uma linha por caminho que chega aqui. Mínimo 2.', 'One row per path that arrives here. At least 2.', 'Una fila por camino que llega aquí. Mínimo 2.'),
          dica: l(
            'Marque como obrigatória a entrada que o nó deve esperar. A documentação não diz o que acontece quando nenhuma é obrigatória: confirmar com o time.',
            'Mark as required the input the node must wait for. The docs don\'t say what happens when none is required: confirm with the team.',
            'Marque como obligatoria la entrada que el nodo debe esperar. La documentación no dice qué pasa si ninguna es obligatoria: confirmar con el equipo.',
          ),
        }],
      },
    ],
    pendenciasExtras: d => ((d.count_rows?.length ?? 0) < 2 ? [l('2 entradas', '2 inputs', '2 entradas')] : []),
  },
  delay: {
    tipo: 'delay',
    grupo: 'logica',
    icone: 'i-lucide-clock',
    nome: l('Atraso', 'Delay', 'Retraso'),
    descricao: l('Pausa o fluxo por um tempo ou até uma data.', 'Pauses the flow for a time or until a date.', 'Pausa el flujo por un tiempo o hasta una fecha.'),
    secoes: [],
  },
  end: {
    tipo: 'end',
    grupo: 'logica',
    icone: 'i-lucide-circle-stop',
    nome: l('Fim', 'End', 'Fin'),
    descricao: l('Encerra o fluxo. Nada roda depois.', 'Ends the flow. Nothing runs after it.', 'Termina el flujo. Nada corre después.'),
    semSaida: true,
    secoes: [geral({ chave: '_aviso', tipo: 'aviso', cor: 'neutral', texto: l('Todo caminho do fluxo precisa terminar num Fim.', 'Every path in the flow must end in an End.', 'Todo camino del flujo debe terminar en un Fin.') })],
  },

  /* ---------------- Integrações ---------------- */
  http: {
    tipo: 'http',
    grupo: 'integracoes',
    icone: 'i-lucide-globe',
    nome: l('Requisição HTTP', 'HTTP request', 'Solicitud HTTP'),
    descricao: l('Chama a API de outro sistema e traz a resposta.', 'Calls another system\'s API and brings back the response.', 'Llama a la API de otro sistema y trae la respuesta.'),
    abas: [
      { id: 'requisicao', rotulo: l('Requisição', 'Request', 'Solicitud') },
      { id: 'resposta', rotulo: l('Resposta', 'Response', 'Respuesta') },
    ],
    secoes: [
      { ...geral(), aba: 'requisicao' },
      {
        id: 'endereco',
        aba: 'requisicao',
        titulo: l('Endereço', 'Endpoint', 'Dirección'),
        campos: [
          {
            chave: 'method',
            tipo: 'select',
            rotulo: l('Método', 'Method', 'Método'),
            opcoes: [
              { valor: 'GET', rotulo: l('GET', 'GET', 'GET'), ajuda: l('Busca dados.', 'Reads data.', 'Lee datos.') },
              { valor: 'POST', rotulo: l('POST', 'POST', 'POST'), ajuda: l('Cria um registro. Pede corpo.', 'Creates a record. Needs a body.', 'Crea un registro. Pide cuerpo.') },
              { valor: 'PUT', rotulo: l('PUT', 'PUT', 'PUT'), ajuda: l('Substitui um registro. Pede corpo.', 'Replaces a record. Needs a body.', 'Reemplaza un registro. Pide cuerpo.') },
              { valor: 'PATCH', rotulo: l('PATCH', 'PATCH', 'PATCH'), ajuda: l('Altera parte de um registro. Pede corpo.', 'Changes part of a record. Needs a body.', 'Modifica parte de un registro. Pide cuerpo.') },
              { valor: 'DELETE', rotulo: l('DELETE', 'DELETE', 'DELETE'), ajuda: l('Exclui um registro.', 'Deletes a record.', 'Elimina un registro.') },
              { valor: 'HEAD', rotulo: l('HEAD', 'HEAD', 'HEAD'), ajuda: l('Só os cabeçalhos, sem corpo.', 'Headers only, no body.', 'Solo encabezados, sin cuerpo.') },
              { valor: 'OPTIONS', rotulo: l('OPTIONS', 'OPTIONS', 'OPTIONS'), ajuda: l('Pergunta o que a API aceita.', 'Asks what the API accepts.', 'Pregunta qué acepta la API.') },
            ],
          },
          {
            chave: 'url',
            tipo: 'texto',
            rotulo: l('URL', 'URL', 'URL'),
            obrigatorio: true,
            aceitaVariavel: true,
            placeholder: l('https://api.exemplo.com/v1/clientes', 'https://api.example.com/v1/customers', 'https://api.ejemplo.com/v1/clientes'),
            ajuda: l('Variável sem espaço dentro das chaves: {{input.data.cnpj}}.', 'Variables with no spaces inside the braces: {{input.data.cnpj}}.', 'Variable sin espacios dentro de las llaves: {{input.data.cnpj}}.'),
          },
          {
            chave: 'authentication',
            tipo: 'select',
            fonte: 'credenciais',
            rotulo: l('Credencial', 'Credential', 'Credencial'),
            ajuda: l('Vazio para API pública. O tipo precisa ser o que a API pede.', 'Empty for a public API. The type must match what the API expects.', 'Vacío para API pública. El tipo debe ser el que pide la API.'),
            dica: l('Credencial de tipo errado só falha na execução, com erro 401.', 'A credential of the wrong type only fails when the flow runs, with a 401 error.', 'Una credencial del tipo equivocado solo falla al ejecutar, con error 401.'),
          },
        ],
      },
      {
        id: 'parametros',
        aba: 'requisicao',
        titulo: l('Parâmetros e cabeçalhos', 'Parameters and headers', 'Parámetros y encabezados'),
        opcional: true,
        campos: [
          { chave: 'queryParams', tipo: 'chaveValor', rotulo: l('Parâmetros da URL', 'Query parameters', 'Parámetros de la URL'), ajuda: l('Viram ?chave=valor no fim da URL.', 'Become ?key=value at the end of the URL.', 'Se vuelven ?clave=valor al final de la URL.') },
          { chave: 'headers', tipo: 'chaveValor', rotulo: l('Cabeçalhos', 'Headers', 'Encabezados'), ajuda: l('Já vem com content-type e accept.', 'Comes with content-type and accept.', 'Ya viene con content-type y accept.') },
        ],
      },
      {
        id: 'corpo',
        aba: 'requisicao',
        titulo: l('Corpo', 'Body', 'Cuerpo'),
        visivel: d => ['POST', 'PUT', 'PATCH'].includes(d.method),
        campos: [
          {
            chave: 'body_type',
            tipo: 'select',
            rotulo: l('Formato', 'Format', 'Formato'),
            ajuda: l('Só JSON. Sem HTML: use \\n para quebrar linha.', 'JSON only. No HTML: use \\n for line breaks.', 'Solo JSON. Sin HTML: use \\n para saltos de línea.'),
            dica: l('Os 4 formatos vêm do develop sem explicação. As ajudas de cada opção são a leitura desta proposta: confirmar com o time.', 'The 4 formats come from develop with no explanation. Each option\'s help is this proposal\'s reading: confirm with the team.', 'Los 4 formatos vienen de develop sin explicación. Las ayudas de cada opción son la lectura de esta propuesta: confirmar con el equipo.'),
            opcoes: [
              { valor: 'fields', rotulo: l('Campos (JSON Fields)', 'Fields (JSON Fields)', 'Campos (JSON Fields)'), ajuda: l('Pares de chave e valor, sem escrever JSON.', 'Key and value pairs, no JSON to write.', 'Pares de clave y valor, sin escribir JSON.') },
              { valor: 'body', rotulo: l('JSON escrito (JSON Body)', 'Written JSON (JSON Body)', 'JSON escrito (JSON Body)'), ajuda: l('Você escreve o JSON inteiro.', 'You write the whole JSON.', 'Usted escribe el JSON completo.') },
              { valor: 'builder', rotulo: l('Montador (JSON Builder)', 'Builder (JSON Builder)', 'Constructor (JSON Builder)'), ajuda: l('Monta objetos e listas aninhados pela tela.', 'Builds nested objects and lists on screen.', 'Arma objetos y listas anidados en pantalla.') },
              { valor: 'parameters', rotulo: l('Parâmetros (JSON Parameters)', 'Parameters (JSON Parameters)', 'Parámetros (JSON Parameters)'), ajuda: l('Envia os campos como parâmetros no corpo.', 'Sends the fields as parameters in the body.', 'Envía los campos como parámetros en el cuerpo.') },
            ],
          },
          { chave: 'body', tipo: 'codigo', rotulo: l('Conteúdo', 'Content', 'Contenido'), aceitaVariavel: true, ajuda: l('Variável que chega vazia vai vazia.', 'A variable that arrives empty is sent empty.', 'Una variable que llega vacía va vacía.') },
        ],
      },
      {
        id: 'avancado',
        aba: 'requisicao',
        titulo: l('Avançado', 'Advanced', 'Avanzado'),
        opcional: true,
        recolhida: true,
        campos: [{ chave: 'timeout', tipo: 'numero', rotulo: l('Tempo limite', 'Timeout', 'Tiempo límite'), sufixo: l('ms', 'ms', 'ms'), min: 1000, passo: 1000, ajuda: l('Padrão 30.000 ms (30 segundos). Passou disso, o fluxo para com erro.', 'Default 30,000 ms (30 seconds). Past that, the flow stops with an error.', 'Estándar 30.000 ms (30 segundos). Pasado eso, el flujo se detiene con error.') }],
      },
      {
        id: 'saida',
        aba: 'resposta',
        titulo: l('Campos da resposta', 'Response fields', 'Campos de la respuesta'),
        campos: [{
          chave: 'output_schema',
          tipo: 'respostaHttp',
          ajuda: l('Cada linha vira uma variável para os próximos nós.', 'Each row becomes a variable for the next nodes.', 'Cada fila se vuelve una variable para los nodos siguientes.'),
          dica: l(
            'Variável é o nome no fluxo (antes, "Chave do campo"). Caminho é onde o valor está na resposta: nome, data.nome ou certidoes[0].situacao. Em erro, o fluxo para e a mensagem real fica em JSON bruto, na execução.',
            'Variable is the name in the flow (formerly "Field key"). Path is where the value sits in the response: name, data.name or items[0].status. On error, the flow stops and the real message is in the raw JSON of the run.',
            'Variable es el nombre en el flujo (antes, "Clave del campo"). Ruta es dónde está el valor en la respuesta: nombre, data.nombre o certidoes[0].situacao. En error, el flujo se detiene y el mensaje real queda en el JSON bruto de la ejecución.',
          ),
        }],
      },
    ],
    pendenciasExtras: () => [],
    variaveis: d => (d.output_schema ?? []).map((c: any) => ({ chave: c.name, rotulo: l(c.label ?? c.name, c.label ?? c.name, c.label ?? c.name) })),
  },

  /* ---------------- Em breve (só na paleta) ---------------- */
  loop: { tipo: 'loop', grupo: 'logica', icone: 'i-lucide-repeat', nome: l('Loop', 'Loop', 'Bucle'), descricao: l('Repete ações até uma condição ser atendida.', 'Repeats actions until a condition is met.', 'Repite acciones hasta cumplir una condición.'), secoes: [], emBreve: true },
  iterator: { tipo: 'iterator', grupo: 'logica', icone: 'i-lucide-list-ordered', nome: l('Iterador', 'Iterator', 'Iterador'), descricao: l('Roda os próximos nós para cada item de uma lista.', 'Runs the next nodes for each item in a list.', 'Ejecuta los nodos siguientes para cada ítem de una lista.'), secoes: [], emBreve: true },
  aggregator: { tipo: 'aggregator', grupo: 'logica', icone: 'i-lucide-sigma', nome: l('Agregador', 'Aggregator', 'Agregador'), descricao: l('Junta dados de vários itens numa saída.', 'Combines data from many items into one output.', 'Junta datos de varios ítems en una salida.'), secoes: [], emBreve: true },
  document: { tipo: 'document', grupo: 'documentacao', icone: 'i-lucide-file-text', nome: l('Documento', 'Document', 'Documento'), descricao: l('Gera PDF, DOCX ou planilha.', 'Generates a PDF, DOCX or spreadsheet.', 'Genera PDF, DOCX u hoja de cálculo.'), secoes: [], emBreve: true },
}

export const grupos: { id: Grupo, nome: L, icone: string }[] = [
  { id: 'gatilhos', nome: l('Gatilhos', 'Triggers', 'Disparadores'), icone: 'i-lucide-zap' },
  { id: 'acoes', nome: l('Ações', 'Actions', 'Acciones'), icone: 'i-lucide-play' },
  { id: 'ia', nome: l('IA', 'AI', 'IA'), icone: 'i-lucide-sparkles' },
  { id: 'logica', nome: l('Lógica e controle', 'Logic and control', 'Lógica y control'), icone: 'i-lucide-git-fork' },
  { id: 'documentacao', nome: l('Documentos', 'Documents', 'Documentos'), icone: 'i-lucide-file-text' },
  { id: 'integracoes', nome: l('Integrações', 'Integrations', 'Integraciones'), icone: 'i-lucide-plug' },
]

/** Ordem da paleta, como no develop: Gatilhos, Ações, IA, Lógica, Documentação, Integrações. */
export const ordemDaPaleta: string[] = [
  'trigger',
  'form', 'approval', 'task', 'email', 'crud', 'comparison_notification', 'start',
  'ai_generate', 'ai_agent', 'ai_router', 'ai_extract',
  'conditionals', 'route', 'merge', 'delay', 'end', 'loop', 'iterator', 'aggregator',
  'document',
  'http',
]

/* ------------------------------------------------------------------ *
 * Ler e gravar no `data` por caminho                                  *
 * ------------------------------------------------------------------ */

export function ler(d: Dado, caminho: string): any {
  return caminho.split('.').reduce<any>((o, k) => (o == null ? undefined : o[k]), d)
}

export function gravar(d: Dado, caminho: string, valor: unknown) {
  const partes = caminho.split('.')
  let o: any = d
  partes.slice(0, -1).forEach((k) => {
    if (o[k] == null || typeof o[k] !== 'object') o[k] = {}
    o = o[k]
  })
  o[partes.at(-1)!] = valor
}

export function vazio(v: unknown): boolean {
  if (v == null || v === '') return true
  if (Array.isArray(v)) return v.length === 0
  if (typeof v === 'string') return v.replace(/<[^>]*>/g, '').trim() === ''
  return false
}

/** Os obrigatórios vazios e as regras extras, na ordem do modal. */
export function pendencias(def: DefinicaoDoNo, d: Dado): { chave: string, rotulo: L }[] {
  const lista: { chave: string, rotulo: L }[] = []
  for (const s of def.secoes) {
    if (s.visivel && !s.visivel(d)) continue
    for (const c of s.campos) {
      if (!c.obrigatorio || (c.visivel && !c.visivel(d))) continue
      if (['construtor', 'rotasIa', 'rotas', 'entradas', 'camposDaAcao', 'condicoes'].includes(c.tipo)) continue
      const v = ler(d, c.chave)
      // Item sem categoria: a origem está escolhida, falta a Categoria.
      const semValor = vazio(v) || (c.tipo !== 'origemDoEvento' && v === ESCOPO_ITEM_SEM_CATEGORIA)
      if (semValor) lista.push({ chave: c.chave, rotulo: c.rotulo ?? s.titulo })
    }
  }
  for (const p of def.pendenciasExtras?.(d) ?? []) lista.push({ chave: '', rotulo: p })
  return lista
}
