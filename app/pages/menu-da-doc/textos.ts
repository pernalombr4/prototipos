/**
 * A copy desta tela nos 3 idiomas.
 *
 * Os rótulos da casca (Docs, Dev, Blog, Releases, Entrar, Nesta página, Copiar
 * texto, os status) são os do `en-docs`, os mesmos que o protótipo
 * `seletor-de-produto-na-doc` copiou de `i18n/lang/{pt,en,es}.yaml`. O botão de
 * busca diz "Search…" nos 3 idiomas porque é assim no site hoje.
 *
 * Os títulos das páginas NÃO estão aqui: vêm do `paginas.ts`, extraído da
 * própria documentação.
 *
 * Regra 33: nenhum texto de interface leva travessão.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { ChaveDeTarefa, Menu } from './mocks'

export interface Textos {
  casca: {
    docs: string
    dev: string
    blog: string
    releases: string
    entrar: string
    abrirMenu: string
    irParaInicio: string
    alternarTema: string
    idioma: string
    nestaPagina: string
    copiarTexto: string
    copiado: string
    perguntarBeni: string
    abrirNoChatGpt: string
    busca: string
    menuDaDoc: string
    status: Record<'published' | 'updated' | 'draft' | 'deprecated', string>
  }

  /** O nome curto de cada menu, no alternador e no cabeçalho do lado a lado. */
  menus: Record<Menu, string>
  /** Uma linha sobre cada menu, no alternador. */
  resumos: Record<Menu, string>

  proposta: {
    trilha: string
    tambemAparece: string
    nestaSecao: string
    abrir: (nome: string) => string
    fechar: (nome: string) => string
    semTraducao: string
    paginaNova: string
    paginaNovaTexto: string
  }

  /** O mapa do menu da proposta C. */
  mapa: {
    titulo: string
    ajuda: string
    blocos: Record<'membro' | 'configuracoes' | 'ajuda' | 'perfil', string>
    chamadaTitulo: string
    chamadaTexto: string
    chamadaAcao: string
  }

  andaime: {
    menu: string
    ladoALado: string
    comparar: string
    tarefa: string
    semTarefa: string
    estado: string
    estados: Record<'cheio' | 'carregando' | 'erro', string>
    endereco: string
    porTras: string
  }

  tarefas: Record<ChaveDeTarefa, string>

  teste: {
    ache: string
    cliques: (n: number) => string
    caminhoMaisCurto: (n: number) => string
    peloMapa: (n: number) => string
    achou: (n: number) => string
    procurando: string
    recomecar: string
    proxima: string
    fechar: string
  }

  estados: {
    carregando: string
    erroTitulo: string
    erroTexto: string
    erroAcao: string
  }
}

export const textos: Record<Idioma, Textos> = {
  'pt-BR': {
    casca: {
      docs: 'Docs',
      dev: 'Dev',
      blog: 'Blog',
      releases: 'Releases',
      entrar: 'Entrar',
      abrirMenu: 'Abrir o menu',
      irParaInicio: 'Ir para o início da documentação',
      alternarTema: 'Alternar o tema',
      idioma: 'Idioma',
      nestaPagina: 'Nesta página',
      copiarTexto: 'Copiar texto',
      copiado: 'Copiado!',
      perguntarBeni: 'Perguntar ao BENI (em breve)',
      abrirNoChatGpt: 'Abrir no ChatGPT',
      busca: 'Search…',
      menuDaDoc: 'Menu da documentação',
      status: { published: 'publicado', updated: 'atualizado', draft: 'rascunho', deprecated: 'descontinuado' },
    },
    menus: { hoje: 'Hoje', a: 'A · Para leigo', b: 'B · Espelho do ENSPACE', c: 'C · Combinada', d: 'D · Até 4 níveis' },
    resumos: {
      hoje: 'O menu do site, como está.',
      a: 'Primeiro nível pelo uso, com as palavras da tela.',
      b: 'O menu do ENSPACE, com os mesmos títulos fixos.',
      c: 'A ordem da A, com o mapa do menu do ENSPACE.',
      d: 'A C com no máximo 4 níveis. Tipos de campo e nós ficam em Referência.',
    },
    proposta: {
      trilha: 'Trilha de navegação',
      tambemAparece: 'Este assunto também aparece em',
      nestaSecao: 'Nesta seção',
      abrir: nome => `Abrir ${nome}`,
      fechar: nome => `Fechar ${nome}`,
      semTraducao: 'Esta página ainda não tem tradução. O texto aparece em português.',
      paginaNova: 'Página nova',
      paginaNovaTexto: 'Hoje este grupo não tem página própria. A proposta cria o índice abaixo.',
    },
    mapa: {
      titulo: 'O menu lateral do ENSPACE',
      ajuda: 'Clique no item que você vê na tela do ENSPACE para abrir a página dele.',
      blocos: { membro: 'Membro', configuracoes: 'Configurações', ajuda: 'Ajuda', perfil: 'Menu do perfil' },
      chamadaTitulo: 'Está numa tela do ENSPACE?',
      chamadaTexto: 'Abra o mapa do menu e clique no item que você vê na tela.',
      chamadaAcao: 'Abrir o mapa do menu',
    },
    andaime: {
      menu: 'Menu',
      ladoALado: 'Lado a lado',
      comparar: 'Comparar',
      tarefa: 'Tarefa',
      semTarefa: 'Sem tarefa',
      estado: 'Estado',
      estados: { cheio: 'Cheio', carregando: 'Carregando', erro: 'Erro' },
      endereco: 'Endereço',
      porTras: 'Por trás',
    },
    tarefas: {
      booleano: 'Configurar um campo de sim ou não',
      tarefasRapidas: 'Ver as suas tarefas rápidas',
      ausencia: 'Registrar as férias de um colega',
      clicksign: 'Conectar a Clicksign ao ENSPACE',
      credencial: 'Guardar uma chave de API de outro sistema',
      senha: 'Trocar a sua senha',
      expressao: 'Escrever uma regra do tipo "se isto, então aquilo"',
      aprovacao: 'Pedir aprovação dentro de uma automação',
    },
    teste: {
      ache: 'Ache',
      cliques: n => (n === 1 ? '1 clique' : `${n} cliques`),
      caminhoMaisCurto: n => `Pela barra: ${n === 1 ? '1 clique' : `${n} cliques`}`,
      peloMapa: n => `Pelo mapa: ${n === 1 ? '1 clique' : `${n} cliques`}`,
      achou: n => `Achou em ${n === 1 ? '1 clique' : `${n} cliques`}`,
      procurando: 'Procurando',
      recomecar: 'Recomeçar',
      proxima: 'Próxima tarefa',
      fechar: 'Encerrar a tarefa',
    },
    estados: {
      carregando: 'Carregando o menu',
      erroTitulo: 'O menu não carregou',
      erroTexto: 'A página continua aqui. Tente carregar o menu de novo.',
      erroAcao: 'Tentar de novo',
    },
  },

  'en': {
    casca: {
      docs: 'Docs',
      dev: 'Dev',
      blog: 'Blog',
      releases: 'Releases',
      entrar: 'Login',
      abrirMenu: 'Open the menu',
      irParaInicio: 'Go to the start of the documentation',
      alternarTema: 'Toggle the theme',
      idioma: 'Language',
      nestaPagina: 'On this page',
      copiarTexto: 'Copy page text',
      copiado: 'Copied!',
      perguntarBeni: 'Ask BENI (coming soon)',
      abrirNoChatGpt: 'Open in ChatGPT',
      busca: 'Search…',
      menuDaDoc: 'Documentation menu',
      status: { published: 'published', updated: 'updated', draft: 'draft', deprecated: 'deprecated' },
    },
    menus: { hoje: 'Today', a: 'A · For beginners', b: 'B · ENSPACE mirror', c: 'C · Combined', d: 'D · Up to 4 levels' },
    resumos: {
      hoje: 'The site menu, as it is.',
      a: 'First level by use, with the words on screen.',
      b: 'The ENSPACE menu, with the same fixed headings.',
      c: 'The order of A, with the ENSPACE menu map.',
      d: 'C with at most 4 levels. Field types and nodes live in Reference.',
    },
    proposta: {
      trilha: 'Breadcrumb',
      tambemAparece: 'This topic also appears in',
      nestaSecao: 'In this section',
      abrir: nome => `Open ${nome}`,
      fechar: nome => `Close ${nome}`,
      semTraducao: 'This page is not translated yet. The text is shown in Portuguese.',
      paginaNova: 'New page',
      paginaNovaTexto: 'Today this group has no page of its own. The proposal creates the index below.',
    },
    mapa: {
      titulo: 'The ENSPACE side menu',
      ajuda: 'Click the item you see on the ENSPACE screen to open its page.',
      blocos: { membro: 'Member', configuracoes: 'Settings', ajuda: 'Help', perfil: 'Profile menu' },
      chamadaTitulo: 'Are you on an ENSPACE screen?',
      chamadaTexto: 'Open the menu map and click the item you see on screen.',
      chamadaAcao: 'Open the menu map',
    },
    andaime: {
      menu: 'Menu',
      ladoALado: 'Side by side',
      comparar: 'Compare',
      tarefa: 'Task',
      semTarefa: 'No task',
      estado: 'State',
      estados: { cheio: 'Full', carregando: 'Loading', erro: 'Error' },
      endereco: 'Address',
      porTras: 'Behind it',
    },
    tarefas: {
      booleano: 'Set up a yes or no field',
      tarefasRapidas: 'See your quick tasks',
      ausencia: 'Record a coworker\'s vacation',
      clicksign: 'Connect Clicksign to ENSPACE',
      credencial: 'Store an API key from another system',
      senha: 'Change your password',
      expressao: 'Write an "if this, then that" rule',
      aprovacao: 'Ask for approval inside an automation',
    },
    teste: {
      ache: 'Find',
      cliques: n => (n === 1 ? '1 click' : `${n} clicks`),
      caminhoMaisCurto: n => `Via the menu: ${n === 1 ? '1 click' : `${n} clicks`}`,
      peloMapa: n => `Via the map: ${n === 1 ? '1 click' : `${n} clicks`}`,
      achou: n => `Found in ${n === 1 ? '1 click' : `${n} clicks`}`,
      procurando: 'Searching',
      recomecar: 'Start over',
      proxima: 'Next task',
      fechar: 'End the task',
    },
    estados: {
      carregando: 'Loading the menu',
      erroTitulo: 'The menu did not load',
      erroTexto: 'The page is still here. Try loading the menu again.',
      erroAcao: 'Try again',
    },
  },

  'es': {
    casca: {
      docs: 'Docs',
      dev: 'Dev',
      blog: 'Blog',
      releases: 'Releases',
      entrar: 'Acceso',
      abrirMenu: 'Abrir el menú',
      irParaInicio: 'Ir al inicio de la documentación',
      alternarTema: 'Cambiar el tema',
      idioma: 'Idioma',
      nestaPagina: 'En esta página',
      copiarTexto: 'Copiar texto',
      copiado: '¡Copiado!',
      perguntarBeni: 'Preguntar a BENI (muy pronto)',
      abrirNoChatGpt: 'Abrir en ChatGPT',
      busca: 'Search…',
      menuDaDoc: 'Menú de la documentación',
      status: { published: 'publicado', updated: 'actualizado', draft: 'borrador', deprecated: 'descontinuado' },
    },
    menus: { hoje: 'Hoy', a: 'A · Para principiantes', b: 'B · Espejo de ENSPACE', c: 'C · Combinada', d: 'D · Hasta 4 niveles' },
    resumos: {
      hoje: 'El menú del sitio, tal como está.',
      a: 'Primer nivel por uso, con las palabras de la pantalla.',
      b: 'El menú de ENSPACE, con los mismos títulos fijos.',
      c: 'El orden de A, con el mapa del menú de ENSPACE.',
      d: 'La C con 4 niveles como máximo. Tipos de campo y nodos quedan en Referencia.',
    },
    proposta: {
      trilha: 'Ruta de navegación',
      tambemAparece: 'Este tema también aparece en',
      nestaSecao: 'En esta sección',
      abrir: nome => `Abrir ${nome}`,
      fechar: nome => `Cerrar ${nome}`,
      semTraducao: 'Esta página todavía no tiene traducción. El texto aparece en portugués.',
      paginaNova: 'Página nueva',
      paginaNovaTexto: 'Hoy este grupo no tiene página propia. La propuesta crea el índice de abajo.',
    },
    mapa: {
      titulo: 'El menú lateral de ENSPACE',
      ajuda: 'Haz clic en el elemento que ves en la pantalla de ENSPACE para abrir su página.',
      blocos: { membro: 'Miembro', configuracoes: 'Configuración', ajuda: 'Ayuda', perfil: 'Menú del perfil' },
      chamadaTitulo: '¿Estás en una pantalla de ENSPACE?',
      chamadaTexto: 'Abre el mapa del menú y haz clic en el elemento que ves en la pantalla.',
      chamadaAcao: 'Abrir el mapa del menú',
    },
    andaime: {
      menu: 'Menú',
      ladoALado: 'Lado a lado',
      comparar: 'Comparar',
      tarefa: 'Tarea',
      semTarefa: 'Sin tarea',
      estado: 'Estado',
      estados: { cheio: 'Lleno', carregando: 'Cargando', erro: 'Error' },
      endereco: 'Dirección',
      porTras: 'Detrás',
    },
    tarefas: {
      booleano: 'Configurar un campo de sí o no',
      tarefasRapidas: 'Ver tus tareas rápidas',
      ausencia: 'Registrar las vacaciones de un compañero',
      clicksign: 'Conectar Clicksign con ENSPACE',
      credencial: 'Guardar una clave de API de otro sistema',
      senha: 'Cambiar tu contraseña',
      expressao: 'Escribir una regla del tipo "si esto, entonces aquello"',
      aprovacao: 'Pedir aprobación dentro de una automatización',
    },
    teste: {
      ache: 'Encuentra',
      cliques: n => (n === 1 ? '1 clic' : `${n} clics`),
      caminhoMaisCurto: n => `Por el menú: ${n === 1 ? '1 clic' : `${n} clics`}`,
      peloMapa: n => `Por el mapa: ${n === 1 ? '1 clic' : `${n} clics`}`,
      achou: n => `Encontrado en ${n === 1 ? '1 clic' : `${n} clics`}`,
      procurando: 'Buscando',
      recomecar: 'Empezar de nuevo',
      proxima: 'Siguiente tarea',
      fechar: 'Terminar la tarea',
    },
    estados: {
      carregando: 'Cargando el menú',
      erroTitulo: 'El menú no cargó',
      erroTexto: 'La página sigue aquí. Intenta cargar el menú de nuevo.',
      erroAcao: 'Intentar de nuevo',
    },
  },
}
