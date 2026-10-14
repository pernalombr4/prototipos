// Os textos desta tela nos três idiomas do ENSPACE.
//
// Não é enfeite de protótipo: é a referência que o dev vai usar. Escrever a
// copy nos três desde o começo é o que revela o botão que estoura em espanhol
// e a frase que só funciona em português.
//
// Regra 35 da Parte 6.

import type { Idioma } from '../../composables/useIdioma'

export interface TextosDaTela {
  // cabeçalho
  saudacao: (nome: string) => string
  titulo: string
  explicacaoAntes: string
  explicacaoDestaque: string
  explicacaoDepois: string
  suporte: string
  criarWorkspace: string
  criarTooltip: string

  // erro
  erroTitulo: string
  erroDescricao: string
  tentarDeNovo: string

  // convite
  conviteTitulo: (quem: string, workspace: string) => string
  conviteDescricao: string
  conviteCurto: (quem: string) => string
  convitePendente: string
  aceiteParaEntrar: string
  aceitarConvite: string
  aceitar: string
  recusar: string

  // continuar
  continueDeOndeParou: string
  seuWorkspace: string
  entrarEm: (nome: string) => string

  // lista
  todos: (n: number) => string
  favoritos: (n: number) => string
  recentes: (n: number) => string
  buscarWorkspace: string
  verEmCards: string
  verEmLista: string
  adicionarAosFavoritos: string
  removerDosFavoritos: string
  entrar: string
  pessoas: (n: number) => string
  colunaWorkspace: string
  colunaDescricao: string
  colunaPapel: string
  colunaUltimoAcesso: string

  // busca (rodada 17)
  buscarEntre: (n: number) => string
  limparBusca: string
  dicaBusca: string

  // workspace padrão (rodada 17)
  abreAoEntrar: string
  proximaVezDireto: (nome: string) => string
  abrirSempreEste: string
  abrirSempreAoEntrar: string
  voltarAEscolher: string
  metaPadrao: string
  padraoDefinido: (nome: string) => string
  padraoDefinidoDescricao: string
  padraoRemovido: string

  // menu do card, ocultar e sair (rodada 17)
  maisAcoes: (nome: string) => string
  ocultarDaLista: string
  mostrarNaLista: string
  oculto: string
  ocultos: (n: number) => string
  ocultadoToast: (nome: string) => string
  ocultadoDescricao: string
  desfazer: string
  sairDoWorkspace: string
  proprietarioNaoSai: string
  sairTitulo: (nome: string) => string
  sairDescricao: string
  saiuDe: (nome: string) => string
  cancelar: string

  // etiquetas pessoais (rodada 17)
  etiquetas: string
  etiquetasDe: (nome: string) => string
  etiquetasDescricao: string
  novaEtiqueta: string
  criarEtiqueta: string
  pronto: string
  agruparPorEtiqueta: string
  agrupar: string
  agruparPor: string
  ordenar: string
  ordenarPor: string
  agruparOpcoes: Record<'nenhum' | 'etiqueta' | 'licenca', string>
  ordenarOpcoes: Record<'acessoRecente' | 'acessoAntigo' | 'criacaoRecente' | 'criacaoAntiga' | 'nome', string>
  ordenarCurto: Record<'acessoRecente' | 'acessoAntigo' | 'criacaoRecente' | 'criacaoAntiga' | 'nome', string>
  convitesPendentes: string
  ocultosBotao: (n: number) => string
  editorTitulo: string
  editorDescricao: string
  secaoNaLista: string
  secaoOcultos: string
  mostrarTodos: string
  gerenciarOcultos: string
  recolherGrupo: (nome: string) => string
  semEtiqueta: string
  nenhumaEtiqueta: string

  // tempo relativo
  nuncaEntrou: string
  haMinutos: (n: number) => string
  haHoras: (n: number) => string
  haDias: (n: number) => string
  haMeses: (n: number) => string

  // vazios
  buscaVaziaTitulo: (termo: string) => string
  buscaVaziaDescricao: string
  semWorkspaceTitulo: string
  semWorkspaceDescricao: string
  criarUmWorkspace: string

  // papéis
  papeis: Record<'Proprietário' | 'Full' | 'Membro' | 'Leitor', string>

  // avisos de maquete
  entrandoEm: (nome: string) => string
  entrandoDescricao: string
  criadoTitulo: (nome: string) => string
  criadoDescricao: string
  conviteAceito: (nome: string) => string
  conviteRecusado: (nome: string) => string

  criar: {
    passoDe: (a: number, b: number) => string
    comoSeChama: string
    nomeAjuda: string
    nomePlaceholder: string
    tamanhoNome: string
    nomeCurto: string
    enderecoDoWorkspace: string
    detalhesOpcionais: string
    opcional: string
    escolherIdentidade: string
    cor: string
    iniciais: string
    icone: string
    imagem: string
    iniciaisExplicacao: string
    iniciaisRodape: string
    arrasteLogo: string
    ouClique: string
    trocar: string
    remover: string
    buscarIcones: (n: string) => string
    limparBusca: string
    maisUsados: string
    resultados: (n: string, total: string) => string
    nadaPara: (termo: string) => string
    tenteOutra: string
    descricao: string
    descricaoAjuda: (n: number) => string
    descricaoPlaceholder: string
    endereco: string
    enderecoAjuda: string
    querModelo: string
    modeloAjuda: string
    modelosDe: string
    doZero: string
    doZeroAjuda: string
    semModelo: string
    semModeloAjuda: string
    comoVaiAparecer: string
    jaVemCom: string
    nomeDoWorkspace: string
    semDescricao: string
    aindaNaoEntrou: string
    voltar: string
    cancelar: string
    continuar: string
    criarWorkspace: string
    criarCom: (modelo: string) => string
    proprietario: string
    entrar: string
  }
}

export const textos: Record<Idioma, TextosDaTela> = {
  'pt-BR': {
    saudacao: n => `Olá, ${n}`,
    titulo: 'Escolha um workspace para entrar',
    explicacaoAntes: 'Workspace é o espaço da sua empresa no ENSPACE. É ',
    explicacaoDestaque: 'dentro',
    explicacaoDepois: ' de um deles que o seu trabalho acontece.',
    suporte: 'Suporte',
    criarWorkspace: 'Criar workspace',
    criarTooltip: 'Cria um workspace vazio, só com você dentro.',

    erroTitulo: 'Não foi possível carregar seus workspaces',
    erroDescricao: 'A conexão falhou. Seus workspaces continuam lá. É só tentar de novo.',
    tentarDeNovo: 'Tentar de novo',

    conviteTitulo: (q, w) => `${q} convidou você para ${w}`,
    conviteDescricao: 'Aceite para entrar neste workspace.',
    conviteCurto: q => `${q} convidou você`,
    convitePendente: 'Convite pendente',
    aceiteParaEntrar: 'Aceite para entrar',
    aceitarConvite: 'Aceitar convite',
    aceitar: 'Aceitar',
    recusar: 'Recusar',

    continueDeOndeParou: 'Continue de onde você parou',
    seuWorkspace: 'Seu workspace',
    entrarEm: n => `Entrar em ${n}`,

    todos: n => `Todos (${n})`,
    favoritos: n => `Favoritos (${n})`,
    recentes: n => `Recentes (${n})`,
    buscarWorkspace: 'Buscar workspace',
    verEmCards: 'Ver em cards',
    verEmLista: 'Ver em lista',
    adicionarAosFavoritos: 'Adicionar aos favoritos',
    removerDosFavoritos: 'Remover dos favoritos',
    entrar: 'Entrar',
    pessoas: n => `${n} pessoas`,
    colunaWorkspace: 'Workspace',
    colunaDescricao: 'Descrição',
    colunaPapel: 'Licença',
    colunaUltimoAcesso: 'Último acesso',

    buscarEntre: n => `Buscar entre seus ${n} workspaces`,
    limparBusca: 'Limpar busca',
    dicaBusca: 'Enter entra no primeiro resultado. Esc limpa a busca.',

    abreAoEntrar: 'Abre direto quando você entra',
    proximaVezDireto: n => `Na próxima vez que você entrar no ENSPACE, vai direto para ${n}.`,
    abrirSempreEste: 'Abrir sempre este ao entrar',
    abrirSempreAoEntrar: 'Abrir sempre ao entrar',
    voltarAEscolher: 'Voltar a escolher ao entrar',
    metaPadrao: 'Abre ao entrar',
    padraoDefinido: n => `${n} abre direto quando você entrar`,
    padraoDefinidoDescricao: 'Para trocar, use o menu de qualquer workspace.',
    padraoRemovido: 'Você volta a escolher o workspace ao entrar.',

    maisAcoes: n => `Mais ações de ${n}`,
    ocultarDaLista: 'Ocultar da lista',
    mostrarNaLista: 'Mostrar na lista',
    oculto: 'Oculto',
    ocultos: n => n === 1 ? '1 workspace oculto' : `${n} workspaces ocultos`,
    ocultadoToast: n => `${n} saiu da sua lista`,
    ocultadoDescricao: 'Você continua com acesso. Para ver de novo, use Ocultos, ao lado de Ordenar.',
    desfazer: 'Desfazer',
    sairDoWorkspace: 'Sair do workspace',
    proprietarioNaoSai: 'Quem é proprietário não sai por aqui.',
    sairTitulo: n => `Sair de ${n}?`,
    sairDescricao: 'Você perde o acesso a tudo o que está lá dentro. Para voltar, alguém do workspace precisa convidar você de novo.',
    saiuDe: n => `Você saiu de ${n}`,
    cancelar: 'Cancelar',

    etiquetas: 'Etiquetas',
    etiquetasDe: n => `Etiquetas de ${n}`,
    etiquetasDescricao: 'Só você vê. Use para agrupar seus workspaces do seu jeito.',
    novaEtiqueta: 'Nova etiqueta',
    criarEtiqueta: 'Criar',
    pronto: 'Pronto',
    agruparPorEtiqueta: 'Agrupar por etiqueta',
    semEtiqueta: 'Sem etiqueta',
    agrupar: 'Agrupar',
    agruparPor: 'Agrupar por',
    ordenar: 'Ordenar',
    ordenarPor: 'Ordenar por',
    agruparOpcoes: { nenhum: 'Nenhum', etiqueta: 'Etiqueta', licenca: 'Licença' },
    ordenarOpcoes: {
      acessoRecente: 'Acessados por último',
      acessoAntigo: 'Acessados há mais tempo',
      criacaoRecente: 'Criados por último',
      criacaoAntiga: 'Criados primeiro',
      nome: 'Nome, de A a Z',
    },
    ordenarCurto: {
      acessoRecente: 'Último acesso',
      acessoAntigo: 'Acesso mais antigo',
      criacaoRecente: 'Mais novos',
      criacaoAntiga: 'Mais antigos',
      nome: 'Nome',
    },
    convitesPendentes: 'Convites pendentes',
    ocultosBotao: n => `Ocultos (${n})`,
    editorTitulo: 'O que aparece na sua lista',
    editorDescricao: 'Desmarque para ocultar. Você continua com acesso, e a busca ainda encontra.',
    secaoNaLista: 'Na lista',
    secaoOcultos: 'Ocultos',
    mostrarTodos: 'Mostrar todos',
    gerenciarOcultos: 'Escolher o que aparece',
    recolherGrupo: n => `Recolher ou abrir ${n}`,
    nenhumaEtiqueta: 'Você ainda não criou etiquetas. Crie a primeira abaixo.',

    nuncaEntrou: 'Nunca acessado',
    haMinutos: n => `Acessado há ${n} min`,
    haHoras: n => `Acessado há ${n} ${n === 1 ? 'hora' : 'horas'}`,
    haDias: n => `Acessado há ${n} ${n === 1 ? 'dia' : 'dias'}`,
    haMeses: n => `Acessado há ${n} ${n === 1 ? 'mês' : 'meses'}`,

    buscaVaziaTitulo: t => `Nenhum workspace com "${t}"`,
    buscaVaziaDescricao: 'Confira o nome. Se ainda não achar, peça acesso a quem administra o ENSPACE na sua empresa.',
    semWorkspaceTitulo: 'Você ainda não faz parte de nenhum workspace',
    semWorkspaceDescricao: 'Quem administra o ENSPACE na sua empresa precisa convidar você. Se recebeu um convite por e-mail, abra o link que veio nele.',
    criarUmWorkspace: 'Criar um workspace',

    papeis: { 'Proprietário': 'Proprietário', 'Full': 'Full', 'Membro': 'Membro', 'Leitor': 'Leitor' },

    entrandoEm: n => `Entrando em ${n}`,
    entrandoDescricao: 'No produto, a pessoa já estaria dentro do workspace.',
    criadoTitulo: n => `Workspace "${n}" criado`,
    criadoDescricao: 'No produto, a pessoa entraria agora no workspace recém-criado.',
    conviteAceito: n => `Convite de ${n} aceito`,
    conviteRecusado: n => `Convite de ${n} recusado`,
    criar: {
      passoDe: (a, b) => `${a} de ${b}`,
      comoSeChama: 'Como esse workspace se chama?',
      nomeAjuda: 'É o nome que a sua equipe vai procurar na lista. Dá para mudar depois.',
      nomePlaceholder: 'Jurídico Aurora, Vértice Log, RH…',
      tamanhoNome: 'De 3 a 50 caracteres.',
      nomeCurto: 'Pelo menos 3 caracteres.',
      enderecoDoWorkspace: 'Endereço do workspace',
      detalhesOpcionais: 'Descrição e endereço',
      opcional: '(opcional)',
      escolherIdentidade: 'Escolher o logo ou o ícone do workspace',
      cor: 'Cor',
      iniciais: 'Iniciais',
      icone: 'Ícone',
      imagem: 'Imagem',
      iniciaisExplicacao: 'As iniciais do nome, na cor escolhida.',
      iniciaisRodape: 'É o que a maioria dos workspaces usa. Não precisa escolher nada.',
      arrasteLogo: 'Arraste o logo aqui',
      ouClique: 'ou clique para escolher · PNG, JPG ou SVG',
      trocar: 'Trocar',
      remover: 'Remover',
      buscarIcones: n => `Buscar em ${n} ícones: balança, caminhão…`,
      limparBusca: 'Limpar busca',
      maisUsados: 'Mais usados',
      resultados: (n, total) => `${n} de ${total}`,
      nadaPara: t => `Nada para "${t}"`,
      tenteOutra: 'Tente outra palavra, ou envie o logo da empresa na aba Imagem.',
      descricao: 'Descrição',
      descricaoAjuda: n => `Uma frase dizendo para que serve. ${n}/140`,
      descricaoPlaceholder: 'Ex.: Chamados, RH e jurídico do Grupo Aurora',
      endereco: 'Endereço',
      enderecoAjuda: 'Vem do nome. Mude só se precisar de um endereço específico.',
      querModelo: 'Quer começar de um modelo?',
      modeloAjuda: 'Um modelo já traz categorias, formulários e fluxos prontos. Dá para mudar tudo depois.',
      modelosDe: 'Modelos de',
      doZero: 'Começar do zero',
      doZeroAjuda: 'Um workspace vazio, montado por você. É o caminho mais comum.',
      semModelo: 'Nenhum modelo para essa localidade',
      semModeloAjuda: 'Escolha outra acima, ou comece do zero: você não perde nada.',
      comoVaiAparecer: 'Como vai aparecer na sua lista',
      jaVemCom: 'Já vem com',
      nomeDoWorkspace: 'Nome do workspace',
      semDescricao: 'Sem descrição',
      aindaNaoEntrou: 'Você ainda não entrou aqui',
      voltar: 'Voltar',
      cancelar: 'Cancelar',
      continuar: 'Continuar',
      criarWorkspace: 'Criar workspace',
      criarCom: m => `Criar com ${m}`,
      proprietario: 'Proprietário',
      entrar: 'Entrar',
    },
  },

  'en': {
    saudacao: n => `Hi, ${n}`,
    titulo: 'Choose a workspace to enter',
    explicacaoAntes: 'A workspace is your company’s space inside ENSPACE. Your work happens ',
    explicacaoDestaque: 'inside',
    explicacaoDepois: ' one of them.',
    suporte: 'Support',
    criarWorkspace: 'Create workspace',
    criarTooltip: 'Creates an empty workspace, with only you in it.',

    erroTitulo: 'We couldn’t load your workspaces',
    erroDescricao: 'The connection failed. Your workspaces are still there. Just try again.',
    tentarDeNovo: 'Try again',

    conviteTitulo: (q, w) => `${q} invited you to ${w}`,
    conviteDescricao: 'Accept to enter this workspace.',
    conviteCurto: q => `${q} invited you`,
    convitePendente: 'Pending invite',
    aceiteParaEntrar: 'Accept to enter',
    aceitarConvite: 'Accept invite',
    aceitar: 'Accept',
    recusar: 'Decline',

    continueDeOndeParou: 'Pick up where you left off',
    seuWorkspace: 'Your workspace',
    entrarEm: n => `Enter ${n}`,

    todos: n => `All (${n})`,
    favoritos: n => `Favorites (${n})`,
    recentes: n => `Recent (${n})`,
    buscarWorkspace: 'Search workspace',
    verEmCards: 'View as cards',
    verEmLista: 'View as list',
    adicionarAosFavoritos: 'Add to favorites',
    removerDosFavoritos: 'Remove from favorites',
    entrar: 'Enter',
    pessoas: n => `${n} people`,
    colunaWorkspace: 'Workspace',
    colunaDescricao: 'Description',
    colunaPapel: 'License',
    colunaUltimoAcesso: 'Last visit',

    buscarEntre: n => `Search your ${n} workspaces`,
    limparBusca: 'Clear search',
    dicaBusca: 'Enter opens the first result. Esc clears the search.',

    abreAoEntrar: 'Opens when you sign in',
    proximaVezDireto: n => `Next time you sign in to ENSPACE, you go straight to ${n}.`,
    abrirSempreEste: 'Always open this one when I sign in',
    abrirSempreAoEntrar: 'Always open when I sign in',
    voltarAEscolher: 'Choose each time I sign in',
    metaPadrao: 'Opens at sign-in',
    padraoDefinido: n => `${n} opens when you sign in`,
    padraoDefinidoDescricao: 'To change it, use the menu on any workspace.',
    padraoRemovido: 'You choose a workspace each time you sign in.',

    maisAcoes: n => `More actions for ${n}`,
    ocultarDaLista: 'Hide from list',
    mostrarNaLista: 'Show in list',
    oculto: 'Hidden',
    ocultos: n => n === 1 ? '1 hidden workspace' : `${n} hidden workspaces`,
    ocultadoToast: n => `${n} is hidden from your list`,
    ocultadoDescricao: 'You still have access. To see it again, use Hidden, next to Sort.',
    desfazer: 'Undo',
    sairDoWorkspace: 'Leave workspace',
    proprietarioNaoSai: 'Owners can\u2019t leave from here.',
    sairTitulo: n => `Leave ${n}?`,
    sairDescricao: 'You lose access to everything inside it. To come back, someone in the workspace has to invite you again.',
    saiuDe: n => `You left ${n}`,
    cancelar: 'Cancel',

    etiquetas: 'Tags',
    etiquetasDe: n => `Tags for ${n}`,
    etiquetasDescricao: 'Only you see them. Use them to group your workspaces your way.',
    novaEtiqueta: 'New tag',
    criarEtiqueta: 'Create',
    pronto: 'Done',
    agruparPorEtiqueta: 'Group by tag',
    agrupar: 'Group',
    agruparPor: 'Group by',
    ordenar: 'Sort',
    ordenarPor: 'Sort by',
    agruparOpcoes: { nenhum: 'None', etiqueta: 'Tag', licenca: 'License' },
    ordenarOpcoes: {
      acessoRecente: 'Most recently accessed',
      acessoAntigo: 'Least recently accessed',
      criacaoRecente: 'Newest first',
      criacaoAntiga: 'Oldest first',
      nome: 'Name, A to Z',
    },
    ordenarCurto: {
      acessoRecente: 'Last access',
      acessoAntigo: 'Oldest access',
      criacaoRecente: 'Newest',
      criacaoAntiga: 'Oldest',
      nome: 'Name',
    },
    convitesPendentes: 'Pending invites',
    ocultosBotao: n => `Hidden (${n})`,
    editorTitulo: 'What shows in your list',
    editorDescricao: 'Uncheck to hide. You keep access, and search still finds it.',
    secaoNaLista: 'In your list',
    secaoOcultos: 'Hidden',
    mostrarTodos: 'Show all',
    gerenciarOcultos: 'Choose what shows',
    recolherGrupo: n => `Collapse or expand ${n}`,
    semEtiqueta: 'No tag',
    nenhumaEtiqueta: 'You haven\u2019t created any tags yet. Create the first one below.',

    nuncaEntrou: 'Not accessed yet',
    haMinutos: n => `Accessed ${n} min ago`,
    haHoras: n => `Accessed ${n} ${n === 1 ? 'hour' : 'hours'} ago`,
    haDias: n => `Accessed ${n} ${n === 1 ? 'day' : 'days'} ago`,
    haMeses: n => `Accessed ${n} ${n === 1 ? 'month' : 'months'} ago`,

    buscaVaziaTitulo: t => `No workspace matching "${t}"`,
    buscaVaziaDescricao: 'Check the name. If you still can’t find it, ask whoever manages ENSPACE at your company for access.',
    semWorkspaceTitulo: 'You’re not part of any workspace yet',
    semWorkspaceDescricao: 'Whoever manages ENSPACE at your company needs to invite you. If you got an invite by email, open the link in it.',
    criarUmWorkspace: 'Create a workspace',

    papeis: { 'Proprietário': 'Owner', 'Full': 'Full', 'Membro': 'Member', 'Leitor': 'Viewer' },

    entrandoEm: n => `Entering ${n}`,
    entrandoDescricao: 'In the product, you would already be inside the workspace.',
    criadoTitulo: n => `Workspace "${n}" created`,
    criadoDescricao: 'In the product, you would now enter the newly created workspace.',
    conviteAceito: n => `Invite to ${n} accepted`,
    conviteRecusado: n => `Invite to ${n} declined`,
    criar: {
      passoDe: (a, b) => `${a} of ${b}`,
      comoSeChama: 'What is this workspace called?',
      nomeAjuda: 'This is the name your team will look for in the list. You can change it later.',
      nomePlaceholder: 'Aurora Legal, Vertice Log, HR\u2026',
      tamanhoNome: 'From 3 to 50 characters.',
      nomeCurto: 'At least 3 characters.',
      enderecoDoWorkspace: 'Workspace address',
      detalhesOpcionais: 'Description and address',
      opcional: '(optional)',
      escolherIdentidade: 'Choose the workspace logo or icon',
      cor: 'Color',
      iniciais: 'Initials',
      icone: 'Icon',
      imagem: 'Image',
      iniciaisExplicacao: 'The initials of the name, in the chosen color.',
      iniciaisRodape: 'This is what most workspaces use. You don\u2019t have to choose anything.',
      arrasteLogo: 'Drag the logo here',
      ouClique: 'or click to choose \u00b7 PNG, JPG or SVG',
      trocar: 'Replace',
      remover: 'Remove',
      buscarIcones: n => `Search ${n} icons: scale, truck\u2026`,
      limparBusca: 'Clear search',
      maisUsados: 'Most used',
      resultados: (n, total) => `${n} of ${total}`,
      nadaPara: t => `Nothing for "${t}"`,
      tenteOutra: 'Try another word, or upload your company logo in the Image tab.',
      descricao: 'Description',
      descricaoAjuda: n => `One sentence saying what it is for. ${n}/140`,
      descricaoPlaceholder: 'E.g.: Tickets, HR and legal for Grupo Aurora',
      endereco: 'Address',
      enderecoAjuda: 'Comes from the name. Change it only if you need a specific address.',
      querModelo: 'Want to start from a template?',
      modeloAjuda: 'A template comes with categories, forms and flows ready. You can change everything later.',
      modelosDe: 'Templates from',
      doZero: 'Start from scratch',
      doZeroAjuda: 'An empty workspace, built by you. This is the most common path.',
      semModelo: 'No template for this locale',
      semModeloAjuda: 'Pick another one above, or start from scratch: you lose nothing.',
      comoVaiAparecer: 'How it will look in your list',
      jaVemCom: 'Comes with',
      nomeDoWorkspace: 'Workspace name',
      semDescricao: 'No description',
      aindaNaoEntrou: 'You haven\u2019t been here yet',
      voltar: 'Back',
      cancelar: 'Cancel',
      continuar: 'Continue',
      criarWorkspace: 'Create workspace',
      criarCom: m => `Create with ${m}`,
      proprietario: 'Owner',
      entrar: 'Enter',
    },
  },

  'es': {
    saudacao: n => `Hola, ${n}`,
    titulo: 'Elige un workspace para entrar',
    explicacaoAntes: 'Un workspace es el espacio de tu empresa dentro de ENSPACE. Tu trabajo ocurre ',
    explicacaoDestaque: 'dentro',
    explicacaoDepois: ' de uno de ellos.',
    suporte: 'Soporte',
    criarWorkspace: 'Crear workspace',
    criarTooltip: 'Crea un workspace vacío, solo contigo dentro.',

    erroTitulo: 'No se pudieron cargar tus workspaces',
    erroDescricao: 'La conexión falló. Tus workspaces siguen ahí. Solo hay que intentar de nuevo.',
    tentarDeNovo: 'Intentar de nuevo',

    conviteTitulo: (q, w) => `${q} te invitó a ${w}`,
    conviteDescricao: 'Acepta para entrar en este workspace.',
    conviteCurto: q => `${q} te invitó`,
    convitePendente: 'Invitación pendiente',
    aceiteParaEntrar: 'Acepta para entrar',
    aceitarConvite: 'Aceptar invitación',
    aceitar: 'Aceptar',
    recusar: 'Rechazar',

    continueDeOndeParou: 'Continúa donde lo dejaste',
    seuWorkspace: 'Tu workspace',
    entrarEm: n => `Entrar en ${n}`,

    todos: n => `Todos (${n})`,
    favoritos: n => `Favoritos (${n})`,
    recentes: n => `Recientes (${n})`,
    buscarWorkspace: 'Buscar workspace',
    verEmCards: 'Ver en tarjetas',
    verEmLista: 'Ver en lista',
    adicionarAosFavoritos: 'Añadir a favoritos',
    removerDosFavoritos: 'Quitar de favoritos',
    entrar: 'Entrar',
    pessoas: n => `${n} personas`,
    colunaWorkspace: 'Workspace',
    colunaDescricao: 'Descripción',
    colunaPapel: 'Licencia',
    colunaUltimoAcesso: 'Último acceso',

    buscarEntre: n => `Buscar entre tus ${n} workspaces`,
    limparBusca: 'Limpiar búsqueda',
    dicaBusca: 'Enter entra en el primer resultado. Esc borra la búsqueda.',

    abreAoEntrar: 'Se abre al iniciar sesión',
    proximaVezDireto: n => `La próxima vez que entres en ENSPACE, irás directo a ${n}.`,
    abrirSempreEste: 'Abrir siempre este al entrar',
    abrirSempreAoEntrar: 'Abrir siempre al entrar',
    voltarAEscolher: 'Volver a elegir al entrar',
    metaPadrao: 'Se abre al entrar',
    padraoDefinido: n => `${n} se abre al iniciar sesión`,
    padraoDefinidoDescricao: 'Para cambiarlo, usa el menú de cualquier workspace.',
    padraoRemovido: 'Vuelves a elegir el workspace al entrar.',

    maisAcoes: n => `Más acciones de ${n}`,
    ocultarDaLista: 'Ocultar de la lista',
    mostrarNaLista: 'Mostrar en la lista',
    oculto: 'Oculto',
    ocultos: n => n === 1 ? '1 workspace oculto' : `${n} workspaces ocultos`,
    ocultadoToast: n => `${n} salió de tu lista`,
    ocultadoDescricao: 'Sigues con acceso. Para verlo de nuevo, usa Ocultos, junto a Ordenar.',
    desfazer: 'Deshacer',
    sairDoWorkspace: 'Salir del workspace',
    proprietarioNaoSai: 'Quien es propietario no sale desde aquí.',
    sairTitulo: n => `\u00bfSalir de ${n}?`,
    sairDescricao: 'Pierdes el acceso a todo lo que hay dentro. Para volver, alguien del workspace tiene que invitarte de nuevo.',
    saiuDe: n => `Saliste de ${n}`,
    cancelar: 'Cancelar',

    etiquetas: 'Etiquetas',
    etiquetasDe: n => `Etiquetas de ${n}`,
    etiquetasDescricao: 'Solo tú las ves. Úsalas para agrupar tus workspaces a tu manera.',
    novaEtiqueta: 'Nueva etiqueta',
    criarEtiqueta: 'Crear',
    pronto: 'Listo',
    agruparPorEtiqueta: 'Agrupar por etiqueta',
    semEtiqueta: 'Sin etiqueta',
    agrupar: 'Agrupar',
    agruparPor: 'Agrupar por',
    ordenar: 'Ordenar',
    ordenarPor: 'Ordenar por',
    agruparOpcoes: { nenhum: 'Ninguno', etiqueta: 'Etiqueta', licenca: 'Licencia' },
    ordenarOpcoes: {
      acessoRecente: 'Accedidos más recientemente',
      acessoAntigo: 'Accedidos hace más tiempo',
      criacaoRecente: 'Creados más recientemente',
      criacaoAntiga: 'Creados primero',
      nome: 'Nombre, de la A a la Z',
    },
    ordenarCurto: {
      acessoRecente: 'Último acceso',
      acessoAntigo: 'Acceso más antiguo',
      criacaoRecente: 'Más nuevos',
      criacaoAntiga: 'Más antiguos',
      nome: 'Nombre',
    },
    convitesPendentes: 'Invitaciones pendientes',
    ocultosBotao: n => `Ocultos (${n})`,
    editorTitulo: 'Qué aparece en tu lista',
    editorDescricao: 'Desmarca para ocultar. Sigues con acceso, y la búsqueda aún lo encuentra.',
    secaoNaLista: 'En la lista',
    secaoOcultos: 'Ocultos',
    mostrarTodos: 'Mostrar todos',
    gerenciarOcultos: 'Elegir qué aparece',
    recolherGrupo: n => `Contraer o abrir ${n}`,
    nenhumaEtiqueta: 'Todavía no creaste etiquetas. Crea la primera abajo.',

    nuncaEntrou: 'Sin accesos todavía',
    haMinutos: n => `Accedido hace ${n} min`,
    haHoras: n => `Accedido hace ${n} ${n === 1 ? 'hora' : 'horas'}`,
    haDias: n => `Accedido hace ${n} ${n === 1 ? 'día' : 'días'}`,
    haMeses: n => `Accedido hace ${n} ${n === 1 ? 'mes' : 'meses'}`,

    buscaVaziaTitulo: t => `Ningún workspace con "${t}"`,
    buscaVaziaDescricao: 'Revisa el nombre. Si aún no lo encuentras, pide acceso a quien administra ENSPACE en tu empresa.',
    semWorkspaceTitulo: 'Todavía no formas parte de ningún workspace',
    semWorkspaceDescricao: 'Quien administra ENSPACE en tu empresa tiene que invitarte. Si recibiste una invitación por correo, abre el enlace que venía en ella.',
    criarUmWorkspace: 'Crear un workspace',

    papeis: { 'Proprietário': 'Propietario', 'Full': 'Full', 'Membro': 'Miembro', 'Leitor': 'Lector' },

    entrandoEm: n => `Entrando en ${n}`,
    entrandoDescricao: 'En el producto, ya estarías dentro del workspace.',
    criadoTitulo: n => `Workspace "${n}" creado`,
    criadoDescricao: 'En el producto, ahora entrarías en el workspace recién creado.',
    conviteAceito: n => `Invitación de ${n} aceptada`,
    conviteRecusado: n => `Invitación de ${n} rechazada`,
    criar: {
      passoDe: (a, b) => `${a} de ${b}`,
      comoSeChama: '\u00bfCómo se llama este workspace?',
      nomeAjuda: 'Es el nombre que tu equipo va a buscar en la lista. Se puede cambiar después.',
      nomePlaceholder: 'Jurídico Aurora, Vértice Log, RR. HH.\u2026',
      tamanhoNome: 'De 3 a 50 caracteres.',
      nomeCurto: 'Al menos 3 caracteres.',
      enderecoDoWorkspace: 'Dirección del workspace',
      detalhesOpcionais: 'Descripción y dirección',
      opcional: '(opcional)',
      escolherIdentidade: 'Elegir el logo o el icono del workspace',
      cor: 'Color',
      iniciais: 'Iniciales',
      icone: 'Icono',
      imagem: 'Imagen',
      iniciaisExplicacao: 'Las iniciales del nombre, en el color elegido.',
      iniciaisRodape: 'Es lo que usan la mayoría de los workspaces. No hace falta elegir nada.',
      arrasteLogo: 'Arrastra el logo aquí',
      ouClique: 'o haz clic para elegir \u00b7 PNG, JPG o SVG',
      trocar: 'Cambiar',
      remover: 'Quitar',
      buscarIcones: n => `Buscar en ${n} iconos: balanza, camión\u2026`,
      limparBusca: 'Limpiar búsqueda',
      maisUsados: 'Más usados',
      resultados: (n, total) => `${n} de ${total}`,
      nadaPara: t => `Nada para "${t}"`,
      tenteOutra: 'Prueba otra palabra, o sube el logo de la empresa en la pestaña Imagen.',
      descricao: 'Descripción',
      descricaoAjuda: n => `Una frase que diga para qué sirve. ${n}/140`,
      descricaoPlaceholder: 'Ej.: Tickets, RR. HH. y jurídico del Grupo Aurora',
      endereco: 'Dirección',
      enderecoAjuda: 'Viene del nombre. Cámbiala solo si necesitas una dirección específica.',
      querModelo: '\u00bfQuieres empezar con una plantilla?',
      modeloAjuda: 'Una plantilla ya trae categorías, formularios y flujos listos. Se puede cambiar todo después.',
      modelosDe: 'Plantillas de',
      doZero: 'Empezar desde cero',
      doZeroAjuda: 'Un workspace vacío, armado por ti. Es el camino más común.',
      semModelo: 'Ninguna plantilla para esta localidad',
      semModeloAjuda: 'Elige otra arriba, o empieza desde cero: no pierdes nada.',
      comoVaiAparecer: 'Cómo se verá en tu lista',
      jaVemCom: 'Ya incluye',
      nomeDoWorkspace: 'Nombre del workspace',
      semDescricao: 'Sin descripción',
      aindaNaoEntrou: 'Todavía no has entrado aquí',
      voltar: 'Volver',
      cancelar: 'Cancelar',
      continuar: 'Continuar',
      criarWorkspace: 'Crear workspace',
      criarCom: m => `Crear con ${m}`,
      proprietario: 'Propietario',
      entrar: 'Entrar',
    },
  },
}
