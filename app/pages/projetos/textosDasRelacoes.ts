/**
 * Rodada 14: os textos das relações revistas (brechas B1 a B18 do MODELO-DE-DADOS.md), em pt-BR, en e es.
 * Texto de interface sem travessão (regra 33) e em registro formal.
 */
const pt = {
  marco: {
    metas: 'Metas',
    metasDica: 'O marco conta no andamento das metas escolhidas. Aparecem só as metas medidas pelos marcos.',
    metasPlaceholder: 'Escolha metas',
    semMetas: 'Nenhuma meta medida pelos marcos.',
    discussoes: 'Discussões sobre o marco',
    semDiscussoes: 'Nenhuma discussão sobre este marco.',
    subtarefasNaoContam: 'O marco conta só as tarefas-mãe. As subtarefas seguem o marco da tarefa-mãe.',
  },
  meta: {
    regraDosProjetos: 'Ligar o projeto põe na meta os marcos que ele tem hoje. Com "Incluir marcos novos" ligado, os marcos criados depois também entram.',
    regraDosMarcos: 'O andamento da meta é a média destes marcos. Qualquer marco sai da meta pelo X, inclusive o que entrou pelo projeto.',
    incluirNovos: 'Incluir marcos novos',
    marcosNaMeta: (n: number) => n === 0 ? 'Nenhum marco deste projeto na meta' : n === 1 ? '1 marco deste projeto na meta' : `${n} marcos deste projeto na meta`,
    comNovos: 'os marcos novos entram',
    semNovos: 'os marcos novos não entram',
    desligar: 'Desligar o projeto e tirar os marcos dele',
    pelosMarcos: 'O projeto está na meta pelos marcos escolhidos. Para tirar, tire os marcos.',
    tirarMarco: 'Tirar da meta',
    arquivado: 'Arquivado',
    arquivadoDica: 'Projeto arquivado. Os marcos abertos dele não contam na meta; os concluídos continuam contando.',
    naoConta: 'Não conta',
    situacaoDoProjeto: 'Situação do projeto, da última atualização de status. Só leitura.',
    projetosAcompanhados: 'Projetos acompanhados',
    marcosAcompanhados: 'Marcos acompanhados',
    acompanhadosDica: 'Na meta medida por valor, os projetos e os marcos ficam para acompanhar e não entram na conta. O andamento vem do valor informado.',
  },
  projeto: {
    ligarMeta: 'Ligar a uma meta',
    ligarMetaTitulo: 'Ligar o projeto a uma meta',
    ligarMetaTexto: (nome: string) => `Os marcos de ${nome} entram na meta escolhida.`,
    meta: 'Meta',
    incluirNovosDica: 'Os marcos criados depois neste projeto também entram na meta.',
    ligar: 'Ligar',
    cancelar: 'Cancelar',
    ligado: (projeto: string, meta: string) => `${projeto} ligado à meta ${meta}`,
  },
  item: {
    tarefas: 'Tarefas do item',
    semTarefas: 'Nenhuma tarefa ligada a este item.',
    criarTarefa: 'Criar tarefa',
  },
  tarefa: {
    criadaNaDiscussao: 'Criada na discussão',
    projetoProprio: 'A tarefa guarda o projeto. Trocar o item não muda o projeto.',
    semProjeto: 'Sem projeto. O projeto foi excluído e a tarefa ficou no item.',
    marcoDaMae: 'Segue o marco da tarefa-mãe.',
    semMarcoNaMae: 'A tarefa-mãe não está em marco.',
    itensDoWorkspace: 'Do workspace',
  },
  discussao: {
    sobre: 'Sobre',
    sobreDica: 'Opcional. O marco ou o item de que a discussão trata.',
    semSobre: 'Nenhum marco ou item',
    sobreMarco: (nome: string) => `Marco ${nome}`,
    sobreItem: (ref: string) => `Item ${ref}`,
    grupoMarcos: 'Marcos',
    grupoItens: 'Itens',
    tarefasCriadas: (n: number) => n === 1 ? '1 tarefa criada a partir desta mensagem' : `${n} tarefas criadas a partir desta mensagem`,
  },
  pessoas: {
    semAcesso: 'Sem acesso ao projeto',
    incluida: (nome: string) => `${nome} passou a participar do projeto.`,
  },
  mover: {
    campos: 'Os campos na aba Itens do projeto e os grupos do status desta categoria chegam em branco no destino.',
    tarefasFicam: (n: number) => n === 1
      ? '1 tarefa ligada a item desta categoria continua no projeto dela, com o marco que tem.'
      : `${n} tarefas ligadas a itens desta categoria continuam no projeto delas, com o marco que têm.`,
    paineisSaem: (n: number) => n === 1
      ? '1 painel de dashboard de outro projeto lê esta categoria e sai do dashboard.'
      : `${n} painéis de dashboard de outros projetos leem esta categoria e saem dos dashboards.`,
  },
  excluir: {
    tambem: 'Ao excluir o projeto:',
    marcos: (n: number) => n === 1 ? '1 marco é excluído' : `${n} marcos são excluídos`,
    discussoes: (n: number) => n === 1 ? '1 discussão é excluída' : `${n} discussões são excluídas`,
    dashboards: (n: number) => n === 1 ? '1 dashboard é excluído' : `${n} dashboards são excluídos`,
    tarefasSemItem: (n: number) => n === 1 ? '1 tarefa sem item é excluída' : `${n} tarefas sem item são excluídas`,
    tarefasComItem: (n: number) => n === 1 ? '1 tarefa com item fica no item, sem projeto' : `${n} tarefas com item ficam no item, sem projeto`,
    metas: (n: number) => n === 1 ? '1 meta deixa de contar o projeto e os marcos dele' : `${n} metas deixam de contar o projeto e os marcos dele`,
    categorias: (n: number) => n === 1 ? '1 categoria volta para o workspace, com os itens' : `${n} categorias voltam para o workspace, com os itens`,
  },
  mapa: {
    semGrupo: 'Sem grupo',
    semGrupoDica: 'Itens cujo valor de status ainda não tem grupo no projeto.',
    aviso: (n: number) => n === 1 ? '1 categoria tem campos ou grupos do status a escolher. Os itens dela aparecem sem Responsável, Prazo ou grupo até a escolha.' : `${n} categorias têm campos ou grupos do status a escolher. Os itens delas aparecem sem Responsável, Prazo ou grupo até a escolha.`,
    escolher: 'Escolher os campos',
  },
}

export type TextosDasRelacoes = typeof pt

const en: TextosDasRelacoes = {
  marco: {
    metas: 'Goals',
    metasDica: 'The milestone counts toward the progress of the chosen goals. Only goals measured by milestones are listed.',
    metasPlaceholder: 'Choose goals',
    semMetas: 'No goal is measured by milestones.',
    discussoes: 'Discussions about the milestone',
    semDiscussoes: 'No discussion about this milestone.',
    subtarefasNaoContam: 'The milestone counts parent tasks only. Subtasks follow the milestone of the parent task.',
  },
  meta: {
    regraDosProjetos: 'Linking the project adds its current milestones to the goal. With "Include new milestones" on, milestones created later are added as well.',
    regraDosMarcos: 'The goal progress is the average of these milestones. Any milestone leaves the goal through the X, including one that came with the project.',
    incluirNovos: 'Include new milestones',
    marcosNaMeta: n => n === 0 ? 'No milestone of this project in the goal' : n === 1 ? '1 milestone of this project in the goal' : `${n} milestones of this project in the goal`,
    comNovos: 'new milestones are added',
    semNovos: 'new milestones are not added',
    desligar: 'Unlink the project and remove its milestones',
    pelosMarcos: 'The project is in the goal through the chosen milestones. To remove it, remove the milestones.',
    tirarMarco: 'Remove from goal',
    arquivado: 'Archived',
    arquivadoDica: 'Archived project. Its open milestones do not count toward the goal; completed ones still count.',
    naoConta: 'Does not count',
    situacaoDoProjeto: 'Project health, from the latest status update. Read only.',
    projetosAcompanhados: 'Tracked projects',
    marcosAcompanhados: 'Tracked milestones',
    acompanhadosDica: 'In a goal measured by a value, projects and milestones are tracked and do not count. Progress comes from the reported value.',
  },
  projeto: {
    ligarMeta: 'Link to a goal',
    ligarMetaTitulo: 'Link the project to a goal',
    ligarMetaTexto: nome => `The milestones of ${nome} are added to the chosen goal.`,
    meta: 'Goal',
    incluirNovosDica: 'Milestones created later in this project are added to the goal as well.',
    ligar: 'Link',
    cancelar: 'Cancel',
    ligado: (projeto, meta) => `${projeto} linked to the goal ${meta}`,
  },
  item: {
    tarefas: 'Item tasks',
    semTarefas: 'No task is linked to this item.',
    criarTarefa: 'Create task',
  },
  tarefa: {
    criadaNaDiscussao: 'Created in the discussion',
    projetoProprio: 'The task keeps its project. Changing the item does not change the project.',
    semProjeto: 'No project. The project was deleted and the task remained in the item.',
    marcoDaMae: 'Follows the milestone of the parent task.',
    semMarcoNaMae: 'The parent task is not in a milestone.',
    itensDoWorkspace: 'From the workspace',
  },
  discussao: {
    sobre: 'About',
    sobreDica: 'Optional. The milestone or item the discussion is about.',
    semSobre: 'No milestone or item',
    sobreMarco: nome => `Milestone ${nome}`,
    sobreItem: ref => `Item ${ref}`,
    grupoMarcos: 'Milestones',
    grupoItens: 'Items',
    tarefasCriadas: n => n === 1 ? '1 task created from this message' : `${n} tasks created from this message`,
  },
  pessoas: {
    semAcesso: 'No access to the project',
    incluida: nome => `${nome} now participates in the project.`,
  },
  mover: {
    campos: 'The fields in the project Items tab and the status groups of this category arrive blank at the destination.',
    tarefasFicam: n => n === 1
      ? '1 task linked to an item of this category remains in its project, with its milestone.'
      : `${n} tasks linked to items of this category remain in their projects, with their milestones.`,
    paineisSaem: n => n === 1
      ? '1 dashboard panel of another project reads this category and leaves the dashboard.'
      : `${n} dashboard panels of other projects read this category and leave the dashboards.`,
  },
  excluir: {
    tambem: 'When the project is deleted:',
    marcos: n => n === 1 ? '1 milestone is deleted' : `${n} milestones are deleted`,
    discussoes: n => n === 1 ? '1 discussion is deleted' : `${n} discussions are deleted`,
    dashboards: n => n === 1 ? '1 dashboard is deleted' : `${n} dashboards are deleted`,
    tarefasSemItem: n => n === 1 ? '1 task without item is deleted' : `${n} tasks without item are deleted`,
    tarefasComItem: n => n === 1 ? '1 task with item remains in the item, without project' : `${n} tasks with item remain in the item, without project`,
    metas: n => n === 1 ? '1 goal stops counting the project and its milestones' : `${n} goals stop counting the project and its milestones`,
    categorias: n => n === 1 ? '1 category returns to the workspace, with its items' : `${n} categories return to the workspace, with their items`,
  },
  mapa: {
    semGrupo: 'No group',
    semGrupoDica: 'Items whose status value has no group in the project yet.',
    aviso: (n: number) => n === 1 ? '1 category has fields or status groups to choose. Its items show no Owner, Due date or group until then.' : `${n} categories have fields or status groups to choose. Their items show no Owner, Due date or group until then.`,
    escolher: 'Choose the fields',
  },
}

const es: TextosDasRelacoes = {
  marco: {
    metas: 'Metas',
    metasDica: 'El hito cuenta en el avance de las metas elegidas. Aparecen solo las metas medidas por hitos.',
    metasPlaceholder: 'Elija metas',
    semMetas: 'Ninguna meta se mide por hitos.',
    discussoes: 'Discusiones sobre el hito',
    semDiscussoes: 'Ninguna discusión sobre este hito.',
    subtarefasNaoContam: 'El hito cuenta solo las tareas principales. Las subtareas siguen el hito de la tarea principal.',
  },
  meta: {
    regraDosProjetos: 'Vincular el proyecto agrega a la meta los hitos que tiene hoy. Con "Incluir hitos nuevos" activado, los hitos creados después también se agregan.',
    regraDosMarcos: 'El avance de la meta es el promedio de estos hitos. Cualquier hito sale de la meta con la X, incluso el que entró con el proyecto.',
    incluirNovos: 'Incluir hitos nuevos',
    marcosNaMeta: n => n === 0 ? 'Ningún hito de este proyecto en la meta' : n === 1 ? '1 hito de este proyecto en la meta' : `${n} hitos de este proyecto en la meta`,
    comNovos: 'los hitos nuevos se agregan',
    semNovos: 'los hitos nuevos no se agregan',
    desligar: 'Desvincular el proyecto y quitar sus hitos',
    pelosMarcos: 'El proyecto está en la meta por los hitos elegidos. Para quitarlo, quite los hitos.',
    tirarMarco: 'Quitar de la meta',
    arquivado: 'Archivado',
    arquivadoDica: 'Proyecto archivado. Sus hitos abiertos no cuentan en la meta; los concluidos siguen contando.',
    naoConta: 'No cuenta',
    situacaoDoProjeto: 'Situación del proyecto, de la última actualización de estado. Solo lectura.',
    projetosAcompanhados: 'Proyectos en seguimiento',
    marcosAcompanhados: 'Hitos en seguimiento',
    acompanhadosDica: 'En la meta medida por valor, los proyectos y los hitos quedan en seguimiento y no entran en la cuenta. El avance viene del valor informado.',
  },
  projeto: {
    ligarMeta: 'Vincular a una meta',
    ligarMetaTitulo: 'Vincular el proyecto a una meta',
    ligarMetaTexto: nome => `Los hitos de ${nome} se agregan a la meta elegida.`,
    meta: 'Meta',
    incluirNovosDica: 'Los hitos creados después en este proyecto también se agregan a la meta.',
    ligar: 'Vincular',
    cancelar: 'Cancelar',
    ligado: (projeto, meta) => `${projeto} vinculado a la meta ${meta}`,
  },
  item: {
    tarefas: 'Tareas del ítem',
    semTarefas: 'Ninguna tarea vinculada a este ítem.',
    criarTarefa: 'Crear tarea',
  },
  tarefa: {
    criadaNaDiscussao: 'Creada en la discusión',
    projetoProprio: 'La tarea guarda el proyecto. Cambiar el ítem no cambia el proyecto.',
    semProjeto: 'Sin proyecto. El proyecto se eliminó y la tarea quedó en el ítem.',
    marcoDaMae: 'Sigue el hito de la tarea principal.',
    semMarcoNaMae: 'La tarea principal no está en un hito.',
    itensDoWorkspace: 'Del workspace',
  },
  discussao: {
    sobre: 'Sobre',
    sobreDica: 'Opcional. El hito o el ítem del que trata la discusión.',
    semSobre: 'Ningún hito o ítem',
    sobreMarco: nome => `Hito ${nome}`,
    sobreItem: ref => `Ítem ${ref}`,
    grupoMarcos: 'Hitos',
    grupoItens: 'Ítems',
    tarefasCriadas: n => n === 1 ? '1 tarea creada a partir de este mensaje' : `${n} tareas creadas a partir de este mensaje`,
  },
  pessoas: {
    semAcesso: 'Sin acceso al proyecto',
    incluida: nome => `${nome} pasó a participar en el proyecto.`,
  },
  mover: {
    campos: 'Los campos en la pestaña Ítems del proyecto y los grupos del estado de esta categoría llegan en blanco al destino.',
    tarefasFicam: n => n === 1
      ? '1 tarea vinculada a un ítem de esta categoría sigue en su proyecto, con su hito.'
      : `${n} tareas vinculadas a ítems de esta categoría siguen en sus proyectos, con sus hitos.`,
    paineisSaem: n => n === 1
      ? '1 panel de dashboard de otro proyecto lee esta categoría y sale del dashboard.'
      : `${n} paneles de dashboard de otros proyectos leen esta categoría y salen de los dashboards.`,
  },
  excluir: {
    tambem: 'Al eliminar el proyecto:',
    marcos: n => n === 1 ? '1 hito se elimina' : `${n} hitos se eliminan`,
    discussoes: n => n === 1 ? '1 discusión se elimina' : `${n} discusiones se eliminan`,
    dashboards: n => n === 1 ? '1 dashboard se elimina' : `${n} dashboards se eliminan`,
    tarefasSemItem: n => n === 1 ? '1 tarea sin ítem se elimina' : `${n} tareas sin ítem se eliminan`,
    tarefasComItem: n => n === 1 ? '1 tarea con ítem queda en el ítem, sin proyecto' : `${n} tareas con ítem quedan en el ítem, sin proyecto`,
    metas: n => n === 1 ? '1 meta deja de contar el proyecto y sus hitos' : `${n} metas dejan de contar el proyecto y sus hitos`,
    categorias: n => n === 1 ? '1 categoría vuelve al workspace, con sus ítems' : `${n} categorías vuelven al workspace, con sus ítems`,
  },
  mapa: {
    semGrupo: 'Sin grupo',
    semGrupoDica: 'Ítems cuyo valor de estado aún no tiene grupo en el proyecto.',
    aviso: (n: number) => n === 1 ? '1 categoría tiene campos o grupos del estado por elegir. Sus ítems aparecen sin Responsable, Plazo ni grupo hasta la elección.' : `${n} categorías tienen campos o grupos del estado por elegir. Sus ítems aparecen sin Responsable, Plazo ni grupo hasta la elección.`,
    escolher: 'Elegir los campos',
  },
}

export const textosDasRelacoes = { 'pt-BR': pt, en, es }
