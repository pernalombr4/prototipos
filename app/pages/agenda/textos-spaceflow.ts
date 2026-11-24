/**
 * Textos da tela do Spaceflow na proposta da Agenda: o nó Tarefa com a seção nova "Agenda" (pedido da redatora em
 * 24/11/2026: "deve ser possível definir na geração da tarefa se ela aparece na agenda ou não").
 *
 * A casca (menu, trilha, abas do editor, rodapé do modal) usa os textos do protótipo `no-de-atraso`, que copiou o
 * develop. Aqui ficam só o fluxo de exemplo, as seções do nó Tarefa e a seção nova.
 */
const ptBR = {
  fluxo: { id: 531, nome: 'Cadastro de fornecedor', categoria: 'Fornecedores' },
  no: {
    tipo: 'Tarefa',
    nome: 'Checar documentos',
    descricao: 'Cria uma tarefa e atribui a um membro.',
    abrir: (nome: string) => `Configurar o nó ${nome}`,
  },
  secoes: {
    definicao: 'Definição da Tarefa',
    tempo: 'Tempo de conclusão',
    agenda: 'Agenda',
    classificacao: 'Classificação',
    permissoes: 'Permissões e Responsabilidade',
    externa: 'Habilitar Tarefa Externa',
  },
  nomeDaTarefa: 'Nome da Tarefa',
  nomeDaTarefaExemplo: 'Checar documentos do fornecedor novo',
  conteudoDaTarefa: 'Conteúdo da Tarefa',
  conteudoExemplo: '<p>Confira o CNPJ, o contrato social e o comprovante de endereço do fornecedor.</p>',
  conteudoPlaceholder: 'Escreva ou digite "/" para acessar os comandos...',
  semMudanca: 'Campos de hoje, sem mudança nesta proposta.',
  novo: 'Novo',
  mostrar: 'Mostrar a tarefa na Agenda',
  ligado: 'A tarefa aparece na Agenda do responsável e dos colaboradores, no dia do prazo. Sem prazo, ela fica no painel Sem data.',
  desligado: 'A tarefa fica somente em Tarefas. A Agenda não mostra o prazo dela nem a oferece no painel Sem data.',
  ajuda: 'Vale para as tarefas que este nó criar a partir de agora. As tarefas já criadas não mudam.',
  pessoaDecide: 'Com a opção ligada, cada pessoa ainda escolhe, na Configuração da Agenda, se vê as tarefas.',
  salvoNaAgenda: 'Nó salvo. As próximas tarefas deste nó aparecem na Agenda.',
  salvoForaDaAgenda: 'Nó salvo. As próximas tarefas deste nó ficam fora da Agenda.',
  descartar: 'Tem certeza? As alterações serão perdidas.',
  confirmar: 'Confirmar',
}

export type TextosDoSpaceflow = typeof ptBR

const en: TextosDoSpaceflow = {
  fluxo: { id: 531, nome: 'Supplier registration', categoria: 'Suppliers' },
  no: {
    tipo: 'Task',
    nome: 'Check documents',
    descricao: 'Creates a task and assigns it to a member.',
    abrir: nome => `Configure the ${nome} node`,
  },
  secoes: {
    definicao: 'Task Definition',
    tempo: 'Completion time',
    agenda: 'Calendar',
    classificacao: 'Classification',
    permissoes: 'Permissions and Responsibility',
    externa: 'Enable External Task',
  },
  nomeDaTarefa: 'Task Name',
  nomeDaTarefaExemplo: 'Check the new supplier documents',
  conteudoDaTarefa: 'Task Content',
  conteudoExemplo: '<p>Check the supplier tax ID, articles of incorporation and proof of address.</p>',
  conteudoPlaceholder: 'Write or type "/" to open the commands...',
  semMudanca: 'Current fields, unchanged in this proposal.',
  novo: 'New',
  mostrar: 'Show the task in the Calendar',
  ligado: 'The task appears in the Calendar of the assignee and the collaborators, on the due date. Without a due date, it stays in the No date panel.',
  desligado: 'The task stays only in Tasks. The Calendar does not show its due date or offer it in the No date panel.',
  ajuda: 'Applies to the tasks this node creates from now on. Tasks already created do not change.',
  pessoaDecide: 'With the option on, each person still chooses, in the Calendar settings, whether to see tasks.',
  salvoNaAgenda: 'Node saved. The next tasks from this node appear in the Calendar.',
  salvoForaDaAgenda: 'Node saved. The next tasks from this node stay out of the Calendar.',
  descartar: 'Are you sure? Your changes will be lost.',
  confirmar: 'Confirm',
}

const es: TextosDoSpaceflow = {
  fluxo: { id: 531, nome: 'Registro de proveedor', categoria: 'Proveedores' },
  no: {
    tipo: 'Tarea',
    nome: 'Revisar documentos',
    descricao: 'Crea una tarea y la asigna a un miembro.',
    abrir: nome => `Configurar el nodo ${nome}`,
  },
  secoes: {
    definicao: 'Definición de la Tarea',
    tempo: 'Tiempo de conclusión',
    agenda: 'Agenda',
    classificacao: 'Clasificación',
    permissoes: 'Permisos y Responsabilidad',
    externa: 'Habilitar Tarea Externa',
  },
  nomeDaTarefa: 'Nombre de la Tarea',
  nomeDaTarefaExemplo: 'Revisar los documentos del proveedor nuevo',
  conteudoDaTarefa: 'Contenido de la Tarea',
  conteudoExemplo: '<p>Revise el CNPJ, el contrato social y el comprobante de domicilio del proveedor.</p>',
  conteudoPlaceholder: 'Escriba o digite "/" para acceder a los comandos...',
  semMudanca: 'Campos actuales, sin cambios en esta propuesta.',
  novo: 'Nuevo',
  mostrar: 'Mostrar la tarea en la Agenda',
  ligado: 'La tarea aparece en la Agenda del responsable y de los colaboradores, el día del plazo. Sin plazo, queda en el panel Sin fecha.',
  desligado: 'La tarea queda solo en Tareas. La Agenda no muestra su plazo ni la ofrece en el panel Sin fecha.',
  ajuda: 'Vale para las tareas que este nodo cree a partir de ahora. Las tareas ya creadas no cambian.',
  pessoaDecide: 'Con la opción activada, cada persona aún elige, en la Configuración de la Agenda, si ve las tareas.',
  salvoNaAgenda: 'Nodo guardado. Las próximas tareas de este nodo aparecen en la Agenda.',
  salvoForaDaAgenda: 'Nodo guardado. Las próximas tareas de este nodo quedan fuera de la Agenda.',
  descartar: '¿Está seguro? Los cambios se perderán.',
  confirmar: 'Confirmar',
}

export const textosDoSpaceflow = { 'pt-BR': ptBR, en, es }
