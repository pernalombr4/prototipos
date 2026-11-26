/**
 * Rodada 11: os textos do atalho de criar no pé dos seletores (`_AtalhoDeCriar.vue`), em pt-BR, en e es.
 * Cada entidade tem o rótulo sem texto na busca, o rótulo com o nome digitado (e o projeto, quando há
 * mais de um destino), a dica que pede o nome e o aviso depois de criar.
 */

const pt = {
  tarefa: {
    rotulo: 'Criar tarefa',
    com: (t: string) => `Criar a tarefa "${t}"`,
    dica: 'Digite o título da nova tarefa na busca.',
    criada: (t: string) => `Tarefa "${t}" criada.`,
  },
  marco: {
    rotulo: 'Criar marco',
    com: (t: string, projeto?: string) => projeto ? `Criar o marco "${t}" em ${projeto}` : `Criar o marco "${t}"`,
    dica: 'Digite o nome do novo marco na busca.',
    criado: (t: string) => `Marco "${t}" criado. A data-alvo e o responsável se ajustam na aba Marcos do projeto.`,
  },
  projeto: {
    rotulo: 'Criar projeto',
    com: (t: string) => `Criar o projeto "${t}"`,
    dica: 'Digite o nome do novo projeto na busca.',
    criado: (t: string) => `Projeto "${t}" criado, com você como administrador. O resto se ajusta nas configurações do projeto.`,
  },
  etiqueta: {
    rotulo: 'Criar etiqueta',
    com: (t: string) => `Criar a etiqueta "${t}"`,
    dica: 'Digite o nome da nova etiqueta na busca.',
    criada: (t: string) => `Etiqueta "${t}" criada.`,
  },
  categoria: {
    rotulo: 'Criar categoria',
    com: (t: string) => `Criar a categoria "${t}"`,
    dica: 'Digite o nome da nova categoria na busca.',
    criada: (t: string) => `Categoria "${t}" criada, sem campos. Os campos se ajustam na configuração da categoria.`,
  },
}

export type TextosDeAtalhos = typeof pt

const en: TextosDeAtalhos = {
  tarefa: {
    rotulo: 'Create task',
    com: t => `Create the task "${t}"`,
    dica: 'Type the title of the new task in the search.',
    criada: t => `Task "${t}" created.`,
  },
  marco: {
    rotulo: 'Create milestone',
    com: (t, projeto) => projeto ? `Create the milestone "${t}" in ${projeto}` : `Create the milestone "${t}"`,
    dica: 'Type the name of the new milestone in the search.',
    criado: t => `Milestone "${t}" created. Adjust the target date and owner in the project Milestones tab.`,
  },
  projeto: {
    rotulo: 'Create project',
    com: t => `Create the project "${t}"`,
    dica: 'Type the name of the new project in the search.',
    criado: t => `Project "${t}" created, with you as administrator. Adjust the rest in the project settings.`,
  },
  etiqueta: {
    rotulo: 'Create label',
    com: t => `Create the label "${t}"`,
    dica: 'Type the name of the new label in the search.',
    criada: t => `Label "${t}" created.`,
  },
  categoria: {
    rotulo: 'Create category',
    com: t => `Create the category "${t}"`,
    dica: 'Type the name of the new category in the search.',
    criada: t => `Category "${t}" created, with no fields. Adjust the fields in the category settings.`,
  },
}

const es: TextosDeAtalhos = {
  tarefa: {
    rotulo: 'Crear tarea',
    com: t => `Crear la tarea "${t}"`,
    dica: 'Escriba el título de la nueva tarea en la búsqueda.',
    criada: t => `Tarea "${t}" creada.`,
  },
  marco: {
    rotulo: 'Crear hito',
    com: (t, projeto) => projeto ? `Crear el hito "${t}" en ${projeto}` : `Crear el hito "${t}"`,
    dica: 'Escriba el nombre del nuevo hito en la búsqueda.',
    criado: t => `Hito "${t}" creado. La fecha objetivo y el responsable se ajustan en la pestaña Hitos del proyecto.`,
  },
  projeto: {
    rotulo: 'Crear proyecto',
    com: t => `Crear el proyecto "${t}"`,
    dica: 'Escriba el nombre del nuevo proyecto en la búsqueda.',
    criado: t => `Proyecto "${t}" creado, con usted como administrador. El resto se ajusta en la configuración del proyecto.`,
  },
  etiqueta: {
    rotulo: 'Crear etiqueta',
    com: t => `Crear la etiqueta "${t}"`,
    dica: 'Escriba el nombre de la nueva etiqueta en la búsqueda.',
    criada: t => `Etiqueta "${t}" creada.`,
  },
  categoria: {
    rotulo: 'Crear categoría',
    com: t => `Crear la categoría "${t}"`,
    dica: 'Escriba el nombre de la nueva categoría en la búsqueda.',
    criada: t => `Categoría "${t}" creada, sin campos. Los campos se ajustan en la configuración de la categoría.`,
  },
}

export const textosDeAtalhos = { 'pt-BR': pt, en, es }
