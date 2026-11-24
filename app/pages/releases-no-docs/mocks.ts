/**
 * O dado desta tela: as entradas do changelog, as mudanças que exigem ação e os posts do blog.
 *
 * ⚠️ Nota sobre a regra 23 (mock tipado pelo `enspace-sdk-schemas`).
 * O conteúdo das abas Blog e Releases NÃO vem da API do ENSPACE: o docs.enspace.io é um Nuxt
 * Content, e cada release é um arquivo markdown em `content/<idioma>/2.blog/docs/` do `en-docs`.
 * O SDK não tem (nem deveria ter) schema de "post" ou "release", então os tipos abaixo são locais.
 * A ESTRUTURA vem do `contentSchema` do `en-docs/content.config.ts` (lido em 2026-11-24):
 * `title`, `description`, `date`, `category`, `badge`, `release.{codename, project, version,
 * deployDate, color}`. Todo campo que o schema NÃO tem está marcado com `PROPOSTA:`; são os campos
 * novos que o frontmatter precisaria ganhar.
 *
 * Os valores são inventados, sem nome de cliente. Nenhum texto de interface leva travessão
 * (regra 33).
 *
 * A data de referência do protótipo é 15/12/2026 (ver `HOJE`): assim o post "Novidades de
 * dezembro" do pedido já saiu, e as fases das mudanças caem em estados diferentes.
 */
import type { Idioma } from '~/composables/useIdioma'

/** Texto nos 3 idiomas. O conteúdo do docs é publicado em pt, en e es. */
export type Trad = Record<Idioma, string>
const L = (pt: string, en: string, es: string): Trad => ({ 'pt-BR': pt, en, es })

/** O "hoje" do protótipo. Tudo o que é relativo (fase atual, prazo, "faltam N dias") sai daqui. */
export const HOJE = '2026-12-15'

/* ------------------------------------------------------------------ *
 * MÓDULOS (PROPOSTA: o frontmatter não tem módulo hoje)               *
 * ------------------------------------------------------------------ */

export type ChaveDeModulo =
  | 'spaceflow' | 'itens' | 'tarefas' | 'formularios' | 'integracoes'
  | 'assinaturas' | 'acessos' | 'ia' | 'api'

/** Ícones do Lucide, os mesmos do menu do produto quando ele tem o módulo. */
export const modulos: { id: ChaveDeModulo, icone: string, nome: Trad }[] = [
  { id: 'spaceflow', icone: 'i-lucide-workflow', nome: L('Spaceflow', 'Spaceflow', 'Spaceflow') },
  { id: 'itens', icone: 'i-lucide-table-2', nome: L('Itens', 'Items', 'Ítems') },
  { id: 'tarefas', icone: 'i-lucide-list-checks', nome: L('Tarefas', 'Tasks', 'Tareas') },
  { id: 'formularios', icone: 'i-lucide-text-cursor-input', nome: L('Formulários e campos', 'Forms and fields', 'Formularios y campos') },
  { id: 'integracoes', icone: 'i-lucide-plug', nome: L('Integrações', 'Integrations', 'Integraciones') },
  { id: 'assinaturas', icone: 'i-lucide-signature', nome: L('Assinaturas', 'Signatures', 'Firmas') },
  { id: 'acessos', icone: 'i-lucide-shield-check', nome: L('Acessos e permissões', 'Access and permissions', 'Accesos y permisos') },
  { id: 'ia', icone: 'i-lucide-sparkles', nome: L('IA', 'AI', 'IA') },
  { id: 'api', icone: 'i-lucide-square-code', nome: L('API', 'API', 'API') },
]

/* ------------------------------------------------------------------ *
 * ENTRADAS DO CHANGELOG                                               *
 * ------------------------------------------------------------------ */

export type Tipo = 'novidade' | 'melhoria' | 'correcao'
/** PROPOSTA. Em breve: anunciado, ainda não ligou. Liberando: ligando aos poucos, com data para todos. Disponível: para todos. */
export type Estado = 'em-breve' | 'liberando' | 'disponivel'
/** PROPOSTA. Fase de acesso, quando o item ainda não é definitivo. */
export type Acesso = 'beta' | 'acesso-antecipado'

export interface Passo { titulo: Trad }

export interface Entrada {
  /** PROPOSTA: a âncora do link permanente. Nasce do título em pt e nunca muda depois de publicada. */
  id: string
  /** Data em que o item ficou disponível (ou a data prevista, quando "Em breve"). Vem de `date`. */
  data: string
  /** PROPOSTA: hoje o tipo é a seção do post (1. Novidades, 2. Melhorias, 3. Correções). */
  tipo: Tipo
  /** PROPOSTA */
  modulo: ChaveDeModulo
  /** `title` do schema, mas por item, não por versão. */
  titulo: Trad
  /** `description` do schema: 1 ou 2 frases. */
  resumo: Trad
  /** `release.version`: deixa de ser o título e vira dado técnico. */
  versao: string
  /** PROPOSTA */
  estado: Estado
  /** PROPOSTA: com `alguns`, a entrada mostra "Liberado para alguns workspaces". */
  publico: 'todos' | 'alguns'
  /** PROPOSTA: com "Liberando", a data em que liga para todos. */
  todosAte?: string
  /** PROPOSTA */
  acesso?: Acesso
  /** PROPOSTA: liga a entrada à mudança em "Próximas mudanças", que traz o prazo e o que fazer. */
  mudanca?: string
  /** PROPOSTA: tier de lançamento. 1 e 2 entram em destaque no post do mês; 3 e correção ficam só aqui. */
  tier?: 1 | 2 | 3
  /** O passo a passo do Tango que o post de hoje já tem. Só para Tier 1 e 2. */
  passos?: Passo[]
  /** O item tem navegação guiada do Tango. */
  navegacaoGuiada?: boolean
}

export const entradas: Entrada[] = [
  /* --- Em breve (janeiro de 2027) ------------------------------------------------------- */
  {
    id: 'tarefas-quadro-com-raias-por-responsavel',
    data: '2027-01-12',
    tipo: 'novidade',
    modulo: 'tarefas',
    titulo: L('Tarefas: quadro com raias por responsável', 'Tasks: board with swimlanes by assignee', 'Tareas: tablero con carriles por responsable'),
    resumo: L(
      'O quadro de tarefas ganha uma raia por pessoa. Você arrasta a tarefa de uma raia para outra para trocar o responsável.',
      'The task board gets one lane per person. Drag a task to another lane to change its assignee.',
      'El tablero de tareas tiene un carril por persona. Arrastra la tarea a otro carril para cambiar el responsable.',
    ),
    versao: '3.5.0',
    estado: 'em-breve',
    publico: 'todos',
    tier: 2,
  },
  {
    id: 'api-paginacao-por-cursor-na-listagem-de-itens',
    data: '2027-01-12',
    tipo: 'melhoria',
    modulo: 'api',
    titulo: L('API: paginação por cursor na listagem de itens', 'API: cursor pagination in the item list', 'API: paginación por cursor en la lista de ítems'),
    resumo: L(
      'A listagem de itens passa a devolver um cursor para a próxima página. A paginação por número de página sai em julho de 2027.',
      'The item list returns a cursor for the next page. Page number pagination is removed in July 2027.',
      'La lista de ítems devuelve un cursor para la página siguiente. La paginación por número de página sale en julio de 2027.',
    ),
    versao: '3.5.0',
    estado: 'em-breve',
    publico: 'todos',
    mudanca: 'paginacao-por-cursor',
    tier: 3,
  },

  /* --- Dezembro de 2026 ------------------------------------------------------------------ */
  {
    id: 'itens-exportacao-em-excel-respeita-a-ordem-das-colunas',
    data: '2026-12-14',
    tipo: 'correcao',
    modulo: 'itens',
    titulo: L('Itens: a exportação em Excel respeita a ordem das colunas', 'Items: Excel export keeps the column order', 'Ítems: la exportación a Excel respeta el orden de las columnas'),
    resumo: L(
      'A planilha exportada sai com as colunas na mesma ordem da tabela.',
      'The exported spreadsheet has the columns in the same order as the table.',
      'La hoja exportada sale con las columnas en el mismo orden de la tabla.',
    ),
    versao: '3.4.3',
    estado: 'disponivel',
    publico: 'todos',
  },
  {
    id: 'tarefas-rapidas-lembrete-antes-do-prazo',
    data: '2026-12-11',
    tipo: 'melhoria',
    modulo: 'tarefas',
    titulo: L('Tarefas Rápidas: lembrete antes do prazo', 'Quick Tasks: reminder before the due date', 'Tareas Rápidas: recordatorio antes del plazo'),
    resumo: L(
      'Você escolhe quando receber o lembrete: 1 hora, 1 dia ou 1 semana antes do prazo.',
      'Choose when to get the reminder: 1 hour, 1 day or 1 week before the due date.',
      'Elige cuándo recibir el recordatorio: 1 hora, 1 día o 1 semana antes del plazo.',
    ),
    versao: '3.4.2',
    estado: 'liberando',
    publico: 'todos',
    todosAte: '2026-12-18',
    tier: 3,
  },
  {
    id: 'ia-resumo-do-item-no-painel-lateral',
    data: '2026-12-10',
    tipo: 'novidade',
    modulo: 'ia',
    titulo: L('IA: resumo do item no painel lateral', 'AI: item summary in the side panel', 'IA: resumen del ítem en el panel lateral'),
    resumo: L(
      'O BENI resume o item, os comentários e as tarefas abertas em 5 linhas, sem sair da tabela.',
      'BENI summarizes the item, its comments and open tasks in 5 lines, without leaving the table.',
      'BENI resume el ítem, los comentarios y las tareas abiertas en 5 líneas, sin salir de la tabla.',
    ),
    versao: '3.4.2',
    estado: 'disponivel',
    publico: 'alguns',
    acesso: 'acesso-antecipado',
    tier: 2,
    passos: [
      { titulo: L('Na tabela de itens, clique na linha do item', 'In the item table, click the item row', 'En la tabla de ítems, haz clic en la fila del ítem') },
      { titulo: L('No painel lateral, clique em Resumir com o BENI', 'In the side panel, click Summarize with BENI', 'En el panel lateral, haz clic en Resumir con BENI') },
      { titulo: L('Leia o resumo e clique em Copiar, se quiser levar para outro lugar', 'Read the summary and click Copy to use it elsewhere', 'Lee el resumen y haz clic en Copiar para llevarlo a otro lugar') },
    ],
  },
  {
    id: 'spaceflow-no-de-espera-por-data',
    data: '2026-12-08',
    tipo: 'novidade',
    modulo: 'spaceflow',
    titulo: L('Spaceflow: nó de espera por data', 'Spaceflow: wait until date node', 'Spaceflow: nodo de espera por fecha'),
    resumo: L(
      'O fluxo para e só continua na data de um campo do item, como o vencimento de um contrato.',
      'The flow pauses and continues only on the date in an item field, such as a contract due date.',
      'El flujo se detiene y continúa solo en la fecha de un campo del ítem, como el vencimiento de un contrato.',
    ),
    versao: '3.4.0',
    estado: 'disponivel',
    publico: 'todos',
    tier: 1,
    navegacaoGuiada: true,
    passos: [
      { titulo: L('No editor do fluxo, arraste o nó Esperar até a data para depois do nó de Início', 'In the flow editor, drag the Wait until date node after the Start node', 'En el editor del flujo, arrastra el nodo Esperar hasta la fecha después del nodo de Inicio') },
      { titulo: L('Em Data, escolha o campo do item que guarda a data', 'In Date, choose the item field that holds the date', 'En Fecha, elige el campo del ítem que guarda la fecha') },
      { titulo: L('Em Antecedência, informe quantos dias antes o fluxo continua', 'In Lead time, enter how many days before the flow continues', 'En Anticipación, indica cuántos días antes continúa el flujo') },
      { titulo: L('Clique em Salvar todas as alterações e salve a nova versão do fluxo', 'Click Save all changes and save the new flow version', 'Haz clic en Guardar todos los cambios y guarda la nueva versión del flujo') },
    ],
  },
  {
    id: 'assinaturas-envio-em-lote',
    data: '2026-12-08',
    tipo: 'novidade',
    modulo: 'assinaturas',
    titulo: L('Assinaturas: envio em lote para vários documentos', 'Signatures: batch sending for several documents', 'Firmas: envío en lote de varios documentos'),
    resumo: L(
      'Você seleciona vários itens na tabela e envia todos os documentos para assinatura de uma vez.',
      'Select several items in the table and send all documents for signature at once.',
      'Selecciona varios ítems en la tabla y envía todos los documentos a firma de una vez.',
    ),
    versao: '3.4.0',
    estado: 'disponivel',
    publico: 'todos',
    tier: 1,
    passos: [
      { titulo: L('Na tabela de itens, marque os itens que têm documento para assinar', 'In the item table, select the items with a document to sign', 'En la tabla de ítems, marca los ítems que tienen documento para firmar') },
      { titulo: L('Na barra de ações, clique em Enviar para assinatura', 'In the action bar, click Send for signature', 'En la barra de acciones, haz clic en Enviar a firma') },
      { titulo: L('Confira os signatários de cada documento e clique em Enviar', 'Check the signers of each document and click Send', 'Revisa los firmantes de cada documento y haz clic en Enviar') },
    ],
  },
  {
    id: 'formularios-condicional-com-mais-de-uma-regra',
    data: '2026-12-08',
    tipo: 'melhoria',
    modulo: 'formularios',
    titulo: L('Formulários: condicional com mais de uma regra', 'Forms: conditions with more than one rule', 'Formularios: condicional con más de una regla'),
    resumo: L(
      'O campo aparece só quando todas as regras valem, ou quando qualquer uma vale. Você escolhe.',
      'The field shows only when all rules match, or when any rule matches. You choose.',
      'El campo aparece solo cuando se cumplen todas las reglas, o cualquiera de ellas. Tú eliges.',
    ),
    versao: '3.4.0',
    estado: 'disponivel',
    publico: 'todos',
    tier: 2,
    passos: [
      { titulo: L('No formulário, abra as configurações do campo e clique em Condicional', 'In the form, open the field settings and click Condition', 'En el formulario, abre la configuración del campo y haz clic en Condicional') },
      { titulo: L('Clique em Adicionar regra e monte a segunda condição', 'Click Add rule and set up the second condition', 'Haz clic en Agregar regla y arma la segunda condición') },
      { titulo: L('Em Mostrar quando, escolha Todas as regras ou Qualquer regra', 'In Show when, choose All rules or Any rule', 'En Mostrar cuando, elige Todas las reglas o Cualquier regla') },
    ],
  },
  {
    id: 'integracoes-webhooks-com-nova-assinatura-de-seguranca',
    data: '2026-12-08',
    tipo: 'melhoria',
    modulo: 'integracoes',
    titulo: L('Integrações: webhooks com nova assinatura de segurança', 'Integrations: webhooks with a new security signature', 'Integraciones: webhooks con nueva firma de seguridad'),
    resumo: L(
      'Cada envio leva uma assinatura que o seu servidor confere. A assinatura antiga sai em fevereiro.',
      'Each delivery carries a signature your server checks. The old signature is removed in February.',
      'Cada envío lleva una firma que tu servidor verifica. La firma antigua sale en febrero.',
    ),
    versao: '3.4.0',
    estado: 'disponivel',
    publico: 'todos',
    mudanca: 'assinatura-dos-webhooks',
    tier: 2,
    passos: [
      { titulo: L('Em Configurações, clique em Integrações e, em seguida, em Webhooks', 'In Settings, click Integrations and then Webhooks', 'En Configuración, haz clic en Integraciones y luego en Webhooks') },
      { titulo: L('Abra o webhook e ligue Usar nova assinatura', 'Open the webhook and turn on Use new signature', 'Abre el webhook y activa Usar nueva firma') },
      { titulo: L('Clique em Testar e confira a entrega no seu servidor', 'Click Test and check the delivery on your server', 'Haz clic en Probar y revisa la entrega en tu servidor') },
    ],
  },
  {
    id: 'spaceflow-execucao-nao-duplica-com-gatilho-repetido',
    data: '2026-12-03',
    tipo: 'correcao',
    modulo: 'spaceflow',
    titulo: L('Spaceflow: a execução não duplica quando o gatilho dispara 2 vezes seguidas', 'Spaceflow: runs no longer duplicate when the trigger fires twice in a row', 'Spaceflow: la ejecución no se duplica cuando el disparador se activa 2 veces seguidas'),
    resumo: L(
      'Um item salvo 2 vezes em menos de 1 segundo inicia 1 execução só.',
      'An item saved twice in less than 1 second starts only 1 run.',
      'Un ítem guardado 2 veces en menos de 1 segundo inicia 1 sola ejecución.',
    ),
    versao: '3.3.7',
    estado: 'disponivel',
    publico: 'todos',
  },
  {
    id: 'campos-valor-monetario-mantem-casas-decimais-ao-colar',
    data: '2026-12-01',
    tipo: 'correcao',
    modulo: 'formularios',
    titulo: L('Campos: o Valor Monetário mantém as casas decimais ao colar', 'Fields: Currency keeps decimal places when pasting', 'Campos: el Valor Monetario mantiene los decimales al pegar'),
    resumo: L(
      'Colar "1.250,50" grava 1.250,50, e não 125.050.',
      'Pasting "1,250.50" saves 1,250.50, not 125,050.',
      'Pegar "1.250,50" guarda 1.250,50, y no 125.050.',
    ),
    versao: '3.3.6',
    estado: 'disponivel',
    publico: 'todos',
  },

  /* --- Novembro de 2026 ------------------------------------------------------------------ */
  {
    id: 'itens-busca-dentro-de-anexos-pdf',
    data: '2026-11-26',
    tipo: 'melhoria',
    modulo: 'itens',
    titulo: L('Itens: a busca encontra texto dentro de anexos em PDF', 'Items: search finds text inside PDF attachments', 'Ítems: la búsqueda encuentra texto dentro de adjuntos PDF'),
    resumo: L(
      'A busca da tabela também lê o texto dos PDFs anexados ao item.',
      'Table search also reads the text of PDFs attached to the item.',
      'La búsqueda de la tabla también lee el texto de los PDF adjuntos al ítem.',
    ),
    versao: '3.3.5',
    estado: 'disponivel',
    publico: 'todos',
    acesso: 'beta',
    tier: 3,
  },
  {
    id: 'tarefas-filtro-por-responsavel-mostra-membros-inativos',
    data: '2026-11-19',
    tipo: 'correcao',
    modulo: 'tarefas',
    titulo: L('Tarefas: o filtro por responsável volta a mostrar membros inativos', 'Tasks: the assignee filter shows inactive members again', 'Tareas: el filtro por responsable vuelve a mostrar miembros inactivos'),
    resumo: L(
      'Você encontra as tarefas de quem saiu do workspace para redistribuir.',
      'Find tasks of people who left the workspace to reassign them.',
      'Encuentra las tareas de quien salió del workspace para redistribuirlas.',
    ),
    versao: '3.3.4',
    estado: 'disponivel',
    publico: 'todos',
  },
  {
    id: 'itens-pastas-com-ordem-pessoal',
    data: '2026-11-10',
    tipo: 'novidade',
    modulo: 'itens',
    titulo: L('Itens: pastas com ordem pessoal', 'Items: folders with personal order', 'Ítems: carpetas con orden personal'),
    resumo: L(
      'Cada pessoa arrasta as pastas na ordem que preferir, sem mudar a ordem dos colegas.',
      'Each person drags folders into their preferred order without changing it for others.',
      'Cada persona arrastra las carpetas en el orden que prefiera, sin cambiar el de sus colegas.',
    ),
    versao: '3.3.0',
    estado: 'disponivel',
    publico: 'todos',
    tier: 1,
    navegacaoGuiada: true,
    passos: [
      { titulo: L('Na tela de itens, abra o menu de pastas', 'On the items screen, open the folder menu', 'En la pantalla de ítems, abre el menú de carpetas') },
      { titulo: L('Arraste a pasta para a posição que preferir', 'Drag the folder to the position you prefer', 'Arrastra la carpeta a la posición que prefieras') },
      { titulo: L('Para voltar à ordem do workspace, clique em Restaurar ordem', 'To go back to the workspace order, click Restore order', 'Para volver al orden del workspace, haz clic en Restaurar orden') },
    ],
  },
  {
    id: 'acessos-categoria-segue-o-formulario',
    data: '2026-11-10',
    tipo: 'melhoria',
    modulo: 'acessos',
    titulo: L('Acessos: o acesso à categoria passa a seguir o formulário', 'Access: category access now follows the form', 'Accesos: el acceso a la categoría pasa a seguir el formulario'),
    resumo: L(
      'O cargo vê só os itens dos formulários marcados para ele. Revise os cargos personalizados antes de 12 de janeiro.',
      'A role sees only items from the forms checked for it. Review custom roles before January 12.',
      'El cargo ve solo los ítems de los formularios marcados para él. Revisa los cargos personalizados antes del 12 de enero.',
    ),
    versao: '3.3.0',
    estado: 'liberando',
    publico: 'todos',
    todosAte: '2027-01-12',
    mudanca: 'acesso-pelo-formulario',
    tier: 2,
    passos: [
      { titulo: L('Em Configurações, clique em Acessos e abra o cargo', 'In Settings, click Access and open the role', 'En Configuración, haz clic en Accesos y abre el cargo') },
      { titulo: L('Na categoria, marque os formulários que o cargo pode ver', 'In the category, check the forms the role can see', 'En la categoría, marca los formularios que el cargo puede ver') },
      { titulo: L('Clique em Salvar e confira com uma pessoa do cargo', 'Click Save and check with someone in that role', 'Haz clic en Guardar y revisa con una persona del cargo') },
    ],
  },
  {
    id: 'integracoes-token-da-api-nao-expira-antes-da-data',
    data: '2026-11-12',
    tipo: 'correcao',
    modulo: 'integracoes',
    titulo: L('Integrações: o token da API não expira antes da data mostrada', 'Integrations: the API token no longer expires before the date shown', 'Integraciones: el token de la API no expira antes de la fecha mostrada'),
    resumo: L(
      'O token vale até o fim do dia da validade, no fuso do workspace.',
      'The token is valid until the end of its expiry day, in the workspace time zone.',
      'El token vale hasta el final del día de vencimiento, en la zona horaria del workspace.',
    ),
    versao: '3.3.1',
    estado: 'disponivel',
    publico: 'todos',
  },
]

/* ------------------------------------------------------------------ *
 * PRÓXIMAS MUDANÇAS (PROPOSTA: não existe no docs hoje)               *
 * ------------------------------------------------------------------ */

/**
 * As 3 fases da trilha de mudança que exige ação (pesquisa de mercado de 2026-11-24, peça 3):
 * opt-in (quem quiser liga antes), padrão ligado com opt-out (quem ainda não terminou desliga) e
 * obrigatória (o comportamento antigo sai). "anunciada" é o tempo antes do opt-in.
 */
export type ChaveDeFase = 'opt-in' | 'opt-out' | 'obrigatoria'

export interface Mudanca {
  id: string
  modulo: ChaveDeModulo
  titulo: Trad
  /** Por que muda, em 1 frase. */
  motivo: Trad
  /** Quem é afetado. O time de projetos manda a lista de workspaces antes do aviso público. */
  quem: Trad
  /** O que o cliente precisa fazer, em passos. */
  oQueFazer: Trad[]
  /** Início de cada fase. A obrigatória é o "agir até". */
  fases: Record<ChaveDeFase, string>
  /** A entrada do changelog que anunciou a mudança (link permanente). */
  entrada?: string
  /** A mudança de data aparece aqui, com a data antiga. */
  dataAnterior?: string
}

export const mudancas: Mudanca[] = [
  {
    id: 'acesso-pelo-formulario',
    modulo: 'acessos',
    titulo: L('O acesso à categoria passa a seguir o formulário', 'Category access now follows the form', 'El acceso a la categoría pasa a seguir el formulario'),
    motivo: L(
      'Hoje quem vê a categoria vê os itens de todos os formulários dela. Com a mudança, o cargo vê só os formulários marcados.',
      'Today anyone who sees a category sees items from all its forms. After the change, a role sees only the checked forms.',
      'Hoy quien ve la categoría ve los ítems de todos sus formularios. Con el cambio, el cargo ve solo los formularios marcados.',
    ),
    quem: L('Workspaces com cargos personalizados', 'Workspaces with custom roles', 'Workspaces con cargos personalizados'),
    oQueFazer: [
      L('Em Configurações > Acessos, abra cada cargo personalizado.', 'In Settings > Access, open each custom role.', 'En Configuración > Accesos, abre cada cargo personalizado.'),
      L('Em cada categoria, marque os formulários que o cargo pode ver.', 'In each category, check the forms the role can see.', 'En cada categoría, marca los formularios que el cargo puede ver.'),
      L('Peça a 1 pessoa de cada cargo para conferir a tabela de itens.', 'Ask 1 person in each role to check the item table.', 'Pide a 1 persona de cada cargo que revise la tabla de ítems.'),
    ],
    fases: { 'opt-in': '2026-11-10', 'opt-out': '2026-12-08', obrigatoria: '2027-01-12' },
    entrada: 'acessos-categoria-segue-o-formulario',
  },
  {
    id: 'assinatura-dos-webhooks',
    modulo: 'integracoes',
    titulo: L('A nova assinatura dos webhooks passa a ser obrigatória', 'The new webhook signature becomes mandatory', 'La nueva firma de los webhooks pasa a ser obligatoria'),
    motivo: L(
      'A assinatura nova protege o seu servidor de envios falsos. A antiga deixa de ser enviada.',
      'The new signature protects your server from forged deliveries. The old one is no longer sent.',
      'La firma nueva protege tu servidor de envíos falsos. La antigua deja de enviarse.',
    ),
    quem: L('Workspaces com webhooks de saída ativos', 'Workspaces with active outgoing webhooks', 'Workspaces con webhooks de salida activos'),
    oQueFazer: [
      L('No seu servidor, confira o cabeçalho X-Enspace-Signature-256 em cada envio.', 'On your server, check the X-Enspace-Signature-256 header on each delivery.', 'En tu servidor, verifica el encabezado X-Enspace-Signature-256 en cada envío.'),
      L('Em Configurações > Integrações > Webhooks, ligue Usar nova assinatura.', 'In Settings > Integrations > Webhooks, turn on Use new signature.', 'En Configuración > Integraciones > Webhooks, activa Usar nueva firma.'),
      L('Clique em Testar e confira a entrega.', 'Click Test and check the delivery.', 'Haz clic en Probar y revisa la entrega.'),
    ],
    fases: { 'opt-in': '2026-12-08', 'opt-out': '2027-01-12', obrigatoria: '2027-02-09' },
    entrada: 'integracoes-webhooks-com-nova-assinatura-de-seguranca',
  },
  {
    id: 'paginacao-por-cursor',
    modulo: 'api',
    titulo: L('A listagem de itens da API passa a paginar por cursor', 'The API item list moves to cursor pagination', 'La lista de ítems de la API pasa a paginar por cursor'),
    motivo: L(
      'A paginação por número de página repete ou pula itens quando a lista muda durante a leitura.',
      'Page number pagination repeats or skips items when the list changes while reading.',
      'La paginación por número de página repite u omite ítems cuando la lista cambia durante la lectura.',
    ),
    quem: L('Integrações que leem a listagem de itens pela API', 'Integrations that read the item list through the API', 'Integraciones que leen la lista de ítems por la API'),
    oQueFazer: [
      L('Troque o parâmetro page pelo cursor que vem na resposta.', 'Replace the page parameter with the cursor returned in the response.', 'Cambia el parámetro page por el cursor que viene en la respuesta.'),
      L('Teste a integração no ambiente de homologação antes de abril.', 'Test the integration in the staging environment before April.', 'Prueba la integración en el ambiente de homologación antes de abril.'),
    ],
    fases: { 'opt-in': '2027-01-12', 'opt-out': '2027-04-13', obrigatoria: '2027-07-13' },
    entrada: 'api-paginacao-por-cursor-na-listagem-de-itens',
    dataAnterior: '2027-06-08',
  },
  {
    id: 'data-no-formato-iso',
    modulo: 'formularios',
    titulo: L('O campo Data aceita só o formato do idioma do workspace', 'The Date field accepts only the workspace language format', 'El campo Fecha acepta solo el formato del idioma del workspace'),
    motivo: L(
      'Datas digitadas em outro formato eram gravadas com dia e mês trocados.',
      'Dates typed in another format were saved with day and month swapped.',
      'Las fechas escritas en otro formato se guardaban con el día y el mes cambiados.',
    ),
    quem: L('Formulários com campo Data preenchido por importação', 'Forms with a Date field filled by import', 'Formularios con campo Fecha completado por importación'),
    oQueFazer: [
      L('Ajuste a planilha de importação para o formato do idioma do workspace.', 'Adjust the import spreadsheet to the workspace language format.', 'Ajusta la hoja de importación al formato del idioma del workspace.'),
    ],
    fases: { 'opt-in': '2026-09-08', 'opt-out': '2026-10-06', obrigatoria: '2026-11-03' },
  },
]

/* ------------------------------------------------------------------ *
 * POSTS DO BLOG                                                       *
 * ------------------------------------------------------------------ */

export interface Post {
  id: string
  /** `category` do schema. PROPOSTA: "mensal" no lugar de "release". */
  categoria: 'mensal' | 'release' | 'artigo'
  titulo: Trad
  descricao: Trad
  /** `date` do schema. */
  data: string
  /** PROPOSTA: o mês que o post cobre. As entradas Tier 1 e 2 desse mês entram em destaque. */
  mes?: string
  /** `release.color` do schema, reaproveitado no banner. */
  cor: 'purple' | 'cyan' | 'teal' | 'fuchsia' | 'orange' | 'red'
  /** `release.version`: só nos posts de hoje, por versão. */
  versao?: string
  /** O post abre neste protótipo. Os outros ficam como card, sem link. */
  abre?: boolean
  minutos?: number
}

/** Os posts da proposta: o post mensal no lugar do post por versão. */
export const postsDaProposta: Post[] = [
  {
    id: 'novidades-de-dezembro-2026',
    categoria: 'mensal',
    titulo: L('Novidades de dezembro', 'What\'s new in December', 'Novedades de diciembre'),
    descricao: L(
      'Espera por data no Spaceflow, envio de assinaturas em lote e o resumo do item com o BENI. E 1 mudança que pede ação até 9 de fevereiro.',
      'Wait until date in Spaceflow, batch signature sending and item summaries with BENI. Plus 1 change that needs action by February 9.',
      'Espera por fecha en Spaceflow, envío de firmas en lote y el resumen del ítem con BENI. Y 1 cambio que requiere acción hasta el 9 de febrero.',
    ),
    data: '2026-12-08',
    mes: '2026-12',
    cor: 'orange',
    abre: true,
    minutos: 6,
  },
  {
    id: 'novidades-de-novembro-2026',
    categoria: 'mensal',
    titulo: L('Novidades de novembro', 'What\'s new in November', 'Novedades de noviembre'),
    descricao: L(
      'Pastas com ordem pessoal e o acesso à categoria pelo formulário.',
      'Folders with personal order and category access by form.',
      'Carpetas con orden personal y el acceso a la categoría por formulario.',
    ),
    data: '2026-11-10',
    mes: '2026-11',
    cor: 'cyan',
    abre: true,
    minutos: 4,
  },
  {
    id: 'organizar-categorias-por-area',
    categoria: 'artigo',
    titulo: L('Como organizar as categorias por área', 'How to organize categories by area', 'Cómo organizar las categorías por área'),
    descricao: L(
      'Um jeito de montar categorias que cresce com a empresa, sem refazer o workspace.',
      'A way to set up categories that grows with the company, without rebuilding the workspace.',
      'Una forma de armar categorías que crece con la empresa, sin rehacer el workspace.',
    ),
    data: '2026-10-20',
    cor: 'purple',
  },
]

/**
 * Os posts de hoje, para o modo "Hoje" do andaime: 1 post por versão minor, título
 * "<versão> está no ar", repetido nas abas Blog e Releases. Os números de itens são inventados.
 */
export const postsDeHoje: Post[] = [
  {
    id: 'release-3-4-0',
    categoria: 'release',
    titulo: L('3.4.0 está no ar', '3.4.0 is live', '3.4.0 ya está disponible'),
    descricao: L(
      'Esta release apresenta 29 itens: 3 novas funcionalidades, 8 melhorias e 18 correções de bugs. Entre os destaques estão o nó de espera por data no Spaceflow e o envio de assinaturas em lote.',
      'This release brings 29 items: 3 new features, 8 improvements and 18 bug fixes. Highlights include the wait until date node in Spaceflow and batch signature sending.',
      'Esta release presenta 29 ítems: 3 nuevas funcionalidades, 8 mejoras y 18 correcciones. Entre los destacados están el nodo de espera por fecha en Spaceflow y el envío de firmas en lote.',
    ),
    data: '2026-12-08',
    cor: 'orange',
    versao: '3.4.0',
  },
  {
    id: 'release-3-3-0',
    categoria: 'release',
    titulo: L('3.3.0 está no ar', '3.3.0 is live', '3.3.0 ya está disponible'),
    descricao: L(
      'Esta release apresenta 31 itens: 2 novas funcionalidades, 11 melhorias e 18 correções de bugs. Entre os destaques estão as pastas com ordem pessoal e o acesso à categoria pelo formulário.',
      'This release brings 31 items: 2 new features, 11 improvements and 18 bug fixes. Highlights include folders with personal order and category access by form.',
      'Esta release presenta 31 ítems: 2 nuevas funcionalidades, 11 mejoras y 18 correcciones. Entre los destacados están las carpetas con orden personal y el acceso a la categoría por formulario.',
    ),
    data: '2026-11-10',
    cor: 'cyan',
    versao: '3.3.0',
  },
  {
    id: 'release-3-2-0',
    categoria: 'release',
    titulo: L('3.2.0 está no ar', '3.2.0 is live', '3.2.0 ya está disponible'),
    descricao: L(
      'Esta release apresenta 34 itens: 3 novas funcionalidades, 9 melhorias e 22 correções de bugs. Entre os destaques estão o início de fluxos por eventos de tarefas e a gestão de webhooks.',
      'This release brings 34 items: 3 new features, 9 improvements and 22 bug fixes. Highlights include starting flows from task events and webhook management.',
      'Esta release presenta 34 ítems: 3 nuevas funcionalidades, 9 mejoras y 22 correcciones. Entre los destacados están el inicio de flujos por eventos de tareas y la gestión de webhooks.',
    ),
    data: '2026-10-27',
    cor: 'orange',
    versao: '3.2.0',
  },
  {
    id: 'organizar-categorias-por-area',
    categoria: 'artigo',
    titulo: L('Como organizar as categorias por área', 'How to organize categories by area', 'Cómo organizar las categorías por área'),
    descricao: L(
      'Um jeito de montar categorias que cresce com a empresa, sem refazer o workspace.',
      'A way to set up categories that grows with the company, without rebuilding the workspace.',
      'Una forma de armar categorías que crece con la empresa, sin rehacer el workspace.',
    ),
    data: '2026-10-20',
    cor: 'purple',
  },
]

/* ------------------------------------------------------------------ *
 * CÁLCULOS SOBRE O MOCK                                               *
 * ------------------------------------------------------------------ */

const dia = (iso: string) => Date.parse(`${iso}T12:00:00Z`)

/** Dias de HOJE até a data (negativo quando já passou). */
export function diasAte(iso: string) {
  return Math.round((dia(iso) - dia(HOJE)) / 86_400_000)
}

/** A fase em que a mudança está em HOJE. */
export function faseAtual(m: Mudanca): 'anunciada' | ChaveDeFase {
  if (diasAte(m.fases.obrigatoria) <= 0) return 'obrigatoria'
  if (diasAte(m.fases['opt-out']) <= 0) return 'opt-out'
  if (diasAte(m.fases['opt-in']) <= 0) return 'opt-in'
  return 'anunciada'
}

/** A mudança ainda pede ação (a fase obrigatória não começou). */
export const mudancaAberta = (m: Mudanca) => faseAtual(m) !== 'obrigatoria'

export const mudancaDe = (id?: string) => mudancas.find(m => m.id === id)
export const moduloDe = (id: ChaveDeModulo) => modulos.find(m => m.id === id)!

/** Endereço do link permanente de uma entrada. */
/**
 * PROPOSTA, rodada 3: cada versão tem página própria. O link da versão é a página
 * (`/releases/3-4-0`); o link do item é a página da versão com a âncora do item (`#<id do item>`).
 */
export function linkPermanente(idioma: Idioma, versao: string, item?: string) {
  const prefixo = idioma === 'pt-BR' ? 'pt' : idioma
  return `https://docs.enspace.io/${prefixo}/releases/${versao.replaceAll('.', '-')}${item ? `#${item}` : ''}`
}
