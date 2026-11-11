/**
 * A copy da Home nos 3 idiomas do ENSPACE.
 *
 * Regra 33: nenhum texto de interface leva travessão.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { GrupoDoCatalogo, TipoDeWidget } from './widgets'

type Aba = 'atraso' | 'hoje' | 'proximas' | 'semPrazo'
type Prioridade = 'low' | 'normal' | 'high' | 'urgent'

export interface Textos {
  locale: string
  casca: {
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
    workspaces: string
    itens: Record<string, string>
  }
  workspace: string

  saudacao: (hora: number, nome: string) => string
  resumoDoDia: (atraso: number, hoje: number) => string
  personalizar: string

  widgets: Record<TipoDeWidget, { titulo: string, descricao: string }>
  grupos: Record<GrupoDoCatalogo, string>

  widget: {
    configurar: string
    tamanhoPadrao: string
    remover: string
    maisAcoes: (nome: string) => string
    arrasteParaMover: string
    mover: (nome: string) => string
    redimensionar: (nome: string) => string
    movido: (nome: string, posicao: number, total: number) => string
    tamanho: (nome: string, w: number, h: number) => string
    novo: string
    novoDica: string
    tentarDeNovo: string
    erroTitulo: string
    erroTexto: string
    semAcessoTitulo: string
    semAcessoTexto: (categoria: string) => string
  }

  criar: {
    botao: string
    dica: string
    placeholder: string
    item: string
    itemDescricao: string
    tarefa: string
    tarefaDescricao: string
    qualCategoria: string
    qualFormulario: (categoria: string) => string
    qualTarefa: string
    formularios: (n: number) => string
    todosOsCampos: string
    rapida: string
    rapidaDescricao: string
    agendada: string
    agendadaDescricao: string
    /** "Criar <singular>", ou "Criar item em <categoria>" sem singular. */
    criarNa: (singular: string | undefined, categoria: string) => string
    beni: string
    beniDescricao: string
    beniToast: (texto: string) => string
    beniDica: string
    vazio: (termo: string) => string
    rodape: string
  }

  categoriasW: {
    abertos: (n: number) => string
    acessar: (categoria: string) => string
    escolhaFormulario: string
    verTodas: string
  }

  tarefas: {
    abas: Record<Aba, string>
    origem: { todas: string, rapidas: string, agendadas: string }
    rotuloOrigem: string
    rapida: string
    agendada: string
    adicionar: string
    adicionarEm: (aba: string) => string
    placeholderNova: string
    concluir: (nome: string) => string
    concluida: string
    vazio: Record<Aba, string>
    venceuHa: (dias: number) => string
    hojeAs: (hora: string) => string
    emDias: (dias: number) => string
    semPrazo: string
    verTodas: string
  }

  delegadas: { para: (nome: string) => string, vazio: string }

  visualizacao: {
    colunas: { item: string, etapa: string, responsavel: string, valor: string }
    vazio: string
    abrir: string
    contagem: (n: number) => string
  }

  numero: { itens: (n: number) => string, abrir: string }
  atalhos: { escolher: string, vazio: string, tipos: Record<'visualizacao' | 'tela' | 'link', string> }
  recentes: { ha: (minutos: number) => string, vazio: string, tipos: Record<'item' | 'visualizacao' | 'tela' | 'formulario', string> }
  agenda: { vazio: string, abrir: string, fontes: Record<'tarefa' | 'item' | 'calendario', string> }
  saude: { subtitulo: string, faixas: { vencidas: string, vencem7: string, noPrazo: string, semPrazo: string }, abrirPainel: string }
  grafico: { origem: (tela: string) => string, abrir: string }
  notas: { placeholder: string, soVoce: string }
  comunicado: { por: (autor: string, dias: number) => string, editar: string, salvar: string, soAdmin: string }
  beni: { aviso: string, atualizar: string }

  personalizacao: {
    titulo: string
    descricao: string
    abaNaHome: string
    abaAdicionar: string
    buscar: string
    adicionar: string
    adicionarOutro: string
    jaNaHome: string
    subir: (nome: string) => string
    descer: (nome: string) => string
    remover: (nome: string) => string
    restaurar: string
    restaurarConfirma: string
    editando: string
    minha: string
    padrao: string
    dica: string
    nenhumWidget: string
    semResultado: string
  }

  bannerPadrao: { titulo: string, texto: string, concluir: string }

  config: {
    titulo: (widget: string) => string
    categoria: string
    visualizacao: string
    tituloDoWidget: string
    tituloAjuda: string
    salvar: string
    cancelar: string
    categoriasAjuda: string
    todas: string
  }

  novaTarefa: {
    tituloRapida: string
    tituloAgendada: string
    descricaoRapida: string
    descricaoAgendada: string
    nome: string
    nomePlaceholder: string
    nomeObrigatorio: string
    item: string
    itemPlaceholder: string
    itemObrigatorio: string
    dataLimite: string
    descricao: string
    responsavel: string
    colaboradores: string
    colaboradoresPlaceholder: string
    prioridade: string
    prioridades: Record<Prioridade, string>
    criar: string
    cancelar: string
    criada: (ref: string) => string
    abrir: string
  }

  novoItem: {
    descricao: (categoria: string, formulario?: string) => string
    tituloCampo: string
    tituloObrigatorio: string
    valor: string
    prazo: string
    urgente: string
    responsavel: string
    criar: string
    criado: (ref: string, categoria: string) => string
  }

  estados: {
    vazioTitulo: string
    vazioTexto: string
    adicionarWidget: string
  }

  toasts: {
    removido: (nome: string) => string
    adicionado: (nome: string) => string
    desfazer: string
    restaurada: string
    padraoSalvo: string
    abrirMaquete: (destino: string) => string
  }

  ehMaquete: string
}

const ptBR: Textos = {
  locale: 'pt-BR',
  casca: {
    menuLateral: 'Menu do workspace', buscar: 'Buscar...', membro: 'Membro', configuracoes: 'Configurações',
    ajuda: 'Ajuda', trilha: 'Trilha', recolherMenu: 'Recolher o menu', abrirMenu: 'Abrir o menu',
    voltar: 'Voltar', avancar: 'Avançar', recarregar: 'Recarregar', suporte: 'Suporte',
    notificacoes: 'Notificações', idioma: 'Idioma', tema: 'Tema', conta: 'Sua conta', workspaces: 'Workspaces',
    itens: {
      inicio: 'Início', spaceflows: 'Spaceflows', categorias: 'Categorias', tarefas: 'Tarefas',
      agendadas: 'Agendadas', rapidas: 'Rápidas', painel: 'Painel', agenda: 'Agenda',
      relatorios: 'menu.member.reports.label', knowledge: 'Knowledge', visaoGeral: 'Visão Geral',
      sistema: 'Sistema', estrutura: 'Estrutura', gestaoDeMembros: 'Gestão de Membros', interface: 'Interface',
      emails: 'E-mails', integracoes: 'Integrações', agentesDeIa: 'Agentes de IA', logs: 'Logs',
      releases: 'Releases', documentacao: 'Documentação',
    },
  },
  workspace: 'Operações Lumina',

  saudacao: (h, nome) => `${h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'}, ${nome}!`,
  resumoDoDia: (a, h) => {
    if (!a && !h) return 'Nenhuma tarefa sua vence hoje.'
    const partes = [a ? `${a} ${a === 1 ? 'tarefa em atraso' : 'tarefas em atraso'}` : '', h ? `${h} para hoje` : ''].filter(Boolean)
    return `Você tem ${partes.join(' e ')}.`
  },
  personalizar: 'Personalizar',

  widgets: {
    categorias: { titulo: 'Categorias', descricao: 'Acesse uma categoria ou crie um item nela.' },
    minhasTarefas: { titulo: 'Minhas tarefas', descricao: 'Suas tarefas rápidas e agendadas, por prazo.' },
    visualizacao: { titulo: 'Itens de uma visualização', descricao: 'Os itens de uma visualização salva de uma categoria.' },
    numero: { titulo: 'Número de uma visualização', descricao: 'Quantos itens uma visualização salva tem agora.' },
    atalhos: { titulo: 'Atalhos', descricao: 'Visualizações, telas e links fixados.' },
    recentes: { titulo: 'Recentes', descricao: 'Os itens e as telas que você abriu por último.' },
    agenda: { titulo: 'Agenda de hoje', descricao: 'Compromissos, prazos de tarefa e datas de item de hoje.' },
    saudeDosPrazos: { titulo: 'Saúde dos prazos', descricao: 'Tarefas abertas do workspace pela situação do prazo.' },
    graficoDePainel: { titulo: 'Gráfico de um painel', descricao: 'Um painel de uma tela do tipo Dashboard.' },
    tarefasDelegadas: { titulo: 'Tarefas que delegei', descricao: 'Tarefas rápidas que você criou para outras pessoas.' },
    notas: { titulo: 'Bloco de notas', descricao: 'Anotações suas. Só você vê.' },
    comunicado: { titulo: 'Comunicado', descricao: 'Aviso do administrador para todo o workspace.' },
    beni: { titulo: 'Resumo do BENI', descricao: 'O BENI resume o que pede sua atenção hoje.' },
  },
  grupos: { trabalho: 'Trabalho', itens: 'Itens e números', navegacao: 'Navegação', equipe: 'Equipe e notas' },

  widget: {
    configurar: 'Configurar',
    tamanhoPadrao: 'Tamanho padrão',
    remover: 'Remover da Home',
    maisAcoes: n => `Mais ações de ${n}`,
    arrasteParaMover: 'Arraste para mover',
    mover: n => `Mover ${n}. Use as setas.`,
    redimensionar: n => `Redimensionar ${n}. Use as setas.`,
    movido: (n, p, t) => `${n} na posição ${p} de ${t}.`,
    tamanho: (n, w, h) => `${n} com ${w} colunas e ${h} linhas.`,
    novo: 'Novo',
    novoDica: 'O administrador adicionou este widget à Home do workspace.',
    tentarDeNovo: 'Tentar de novo',
    erroTitulo: 'Não foi possível carregar',
    erroTexto: 'Os outros widgets continuam funcionando.',
    semAcessoTitulo: 'Sem acesso',
    semAcessoTexto: c => `Você não tem acesso à categoria ${c}. Peça ao administrador ou remova o widget.`,
  },

  criar: {
    botao: 'Criar',
    dica: 'Criar item ou tarefa (C)',
    placeholder: 'O que você quer criar?',
    item: 'Item',
    itemDescricao: 'Em uma categoria, pelo formulário dela',
    tarefa: 'Tarefa',
    tarefaDescricao: 'Rápida ou agendada',
    qualCategoria: 'Em qual categoria?',
    qualFormulario: c => `Qual formulário de ${c}?`,
    qualTarefa: 'Qual tipo de tarefa?',
    formularios: n => `${n} formulários`,
    todosOsCampos: 'Todos os campos da categoria',
    rapida: 'Tarefa rápida',
    rapidaDescricao: 'Para você ou outra pessoa, fora do fluxo',
    agendada: 'Tarefa agendada',
    agendadaDescricao: 'Ligada a um item da categoria',
    criarNa: (s, c) => s ? `Criar ${s}` : `Criar item em ${c}`,
    beni: 'Pedir ao BENI',
    beniDescricao: 'Descreva, e o BENI monta para você revisar',
    beniToast: x => x ? `O BENI monta "${x}" e mostra antes de gravar.` : 'O BENI abre para você descrever o que quer criar.',
    beniDica: 'Maquete: no produto, abre o chat do BENI AI.',
    vazio: t => `Nenhuma opção com "${t}".`,
    rodape: 'Setas e Enter escolhem. Backspace volta. Esc fecha.',
  },

  categoriasW: {
    abertos: n => n === 0 ? 'Nenhum em aberto' : n === 1 ? '1 em aberto' : `${n} em aberto`,
    acessar: c => `Acessar ${c}`,
    escolhaFormulario: 'Escolha o formulário',
    verTodas: 'Ver todas as categorias',
  },

  tarefas: {
    abas: { atraso: 'Em atraso', hoje: 'Hoje', proximas: 'Próximas', semPrazo: 'Sem prazo' },
    origem: { todas: 'Todas', rapidas: 'Rápidas', agendadas: 'Agendadas' },
    rotuloOrigem: 'Tipo de tarefa',
    rapida: 'Rápida',
    agendada: 'Agendada',
    adicionar: 'Adicionar tarefa',
    adicionarEm: a => `Adicionar tarefa em ${a}`,
    placeholderNova: 'Nome da tarefa. Enter cria.',
    concluir: n => `Concluir ${n}`,
    concluida: 'Tarefa concluída.',
    vazio: {
      atraso: 'Nenhuma tarefa em atraso.',
      hoje: 'Nenhuma tarefa vence hoje.',
      proximas: 'Nenhuma tarefa nos próximos 7 dias.',
      semPrazo: 'Todas as suas tarefas têm prazo.',
    },
    venceuHa: d => d === 0 ? 'Venceu hoje' : d === 1 ? 'Venceu ontem' : `Venceu há ${d} dias`,
    hojeAs: h => `Hoje, ${h}`,
    emDias: d => d === 1 ? 'Amanhã' : `Em ${d} dias`,
    semPrazo: 'Sem prazo',
    verTodas: 'Ver todas',
  },

  delegadas: { para: n => `Com ${n}`, vazio: 'Você não delegou nenhuma tarefa aberta.' },

  visualizacao: {
    colunas: { item: 'Item', etapa: 'Etapa', responsavel: 'Responsável', valor: 'Valor' },
    vazio: 'Nenhum item nesta visualização.',
    abrir: 'Abrir visualização',
    contagem: n => n === 1 ? '1 item' : `${n} itens`,
  },

  numero: { itens: n => n === 1 ? 'item' : 'itens', abrir: 'Abrir a visualização' },
  atalhos: {
    escolher: 'Escolher atalhos',
    vazio: 'Fixe aqui o que você abre todo dia.',
    tipos: { visualizacao: 'Visualização', tela: 'Tela', link: 'Link' },
  },
  recentes: {
    ha: m => m < 60 ? `há ${m} min` : m < 1440 ? `há ${Math.round(m / 60)} h` : m < 2880 ? 'ontem' : `há ${Math.round(m / 1440)} dias`,
    vazio: 'O que você abrir aparece aqui.',
    tipos: { item: 'Item', visualizacao: 'Visualização', tela: 'Tela', formulario: 'Formulário' },
  },
  agenda: { vazio: 'Nada na agenda hoje.', abrir: 'Abrir a Agenda', fontes: { tarefa: 'Tarefa', item: 'Item', calendario: 'Calendário' } },
  saude: {
    subtitulo: 'Abertas no workspace',
    faixas: { vencidas: 'Vencidas', vencem7: 'Vencem em 7 dias', noPrazo: 'No prazo', semPrazo: 'Sem prazo' },
    abrirPainel: 'Abrir o Painel de tarefas',
  },
  grafico: { origem: t => `Da tela ${t}`, abrir: 'Abrir a tela' },
  notas: { placeholder: 'Escreva aqui. Só você vê.', soVoce: 'Só você vê' },
  comunicado: { por: (a, d) => `${a}, ${d === 0 ? 'hoje' : d === 1 ? 'ontem' : `há ${d} dias`}`, editar: 'Editar comunicado', salvar: 'Publicar', soAdmin: 'Só o administrador edita' },
  beni: { aviso: 'Gerado pelo BENI. Confira antes de agir.', atualizar: 'Atualizar resumo' },

  personalizacao: {
    titulo: 'Personalizar a Home',
    descricao: 'Escolha o que aparece na sua Home. Ninguém mais vê a mudança.',
    abaNaHome: 'Na sua Home',
    abaAdicionar: 'Adicionar widget',
    buscar: 'Buscar widget',
    adicionar: 'Adicionar',
    adicionarOutro: 'Adicionar outro',
    jaNaHome: 'Na Home',
    subir: n => `Subir ${n}`,
    descer: n => `Descer ${n}`,
    remover: n => `Remover ${n}`,
    restaurar: 'Restaurar a Home padrão',
    restaurarConfirma: 'Sua Home volta a ser igual à do workspace. Notas e atalhos continuam salvos.',
    editando: 'Editando',
    minha: 'Minha Home',
    padrao: 'Home padrão do workspace',
    dica: 'Na Home, arraste o widget pelo título para mudar de lugar e puxe o canto para mudar o tamanho.',
    nenhumWidget: 'Nenhum widget na Home.',
    semResultado: 'Nenhum widget com esse nome.',
  },

  bannerPadrao: {
    titulo: 'Você está editando a Home padrão do workspace',
    texto: 'Vale para quem ainda não personalizou. O widget que você adicionar aparece também na Home de quem já personalizou.',
    concluir: 'Concluir edição',
  },

  config: {
    titulo: w => `Configurar ${w}`,
    categoria: 'Categoria',
    visualizacao: 'Visualização',
    tituloDoWidget: 'Título do widget',
    tituloAjuda: 'Sem título, vale o nome da visualização.',
    salvar: 'Salvar',
    cancelar: 'Cancelar',
    categoriasAjuda: 'Marque as categorias que aparecem no widget. Sem nenhuma marcada, aparecem todas as que você acessa.',
    todas: 'Mostrar todas',
  },

  novaTarefa: {
    tituloRapida: 'Nova tarefa rápida',
    tituloAgendada: 'Nova tarefa agendada',
    descricaoRapida: 'Fica em Tarefas > Rápidas.',
    descricaoAgendada: 'Fica no item e aparece em Tarefas > Agendadas.',
    nome: 'Nome',
    nomePlaceholder: 'Digite o nome da tarefa',
    nomeObrigatorio: 'Dê um nome à tarefa.',
    item: 'Item relacionado',
    itemPlaceholder: 'Buscar pelo título ou pelo número',
    itemObrigatorio: 'Escolha o item da tarefa agendada.',
    dataLimite: 'Data limite',
    descricao: 'Descrição',
    responsavel: 'Responsável',
    colaboradores: 'Colaboradores',
    colaboradoresPlaceholder: 'Ninguém',
    prioridade: 'Prioridade',
    prioridades: { low: 'Baixa', normal: 'Normal', high: 'Alta', urgent: 'Urgente' },
    criar: 'Criar',
    cancelar: 'Cancelar',
    criada: r => `Tarefa ${r} criada.`,
    abrir: 'Abrir',
  },

  novoItem: {
    descricao: (c, f) => f ? `${c} · Formulário ${f}` : `${c} · Todos os campos da categoria`,
    tituloCampo: 'Título',
    tituloObrigatorio: 'Dê um título ao item.',
    valor: 'Valor',
    prazo: 'Data de vencimento',
    urgente: 'Urgente',
    responsavel: 'Responsável',
    criar: 'Criar',
    criado: (r, c) => `Item ${r} criado em ${c}.`,
  },

  estados: {
    vazioTitulo: 'Sua Home está vazia',
    vazioTexto: 'Adicione widgets para ver aqui suas tarefas, seus itens e seus atalhos.',
    adicionarWidget: 'Adicionar widget',
  },

  toasts: {
    removido: n => `${n} saiu da Home.`,
    adicionado: n => `${n} entrou na Home.`,
    desfazer: 'Desfazer',
    restaurada: 'Home padrão restaurada.',
    padraoSalvo: 'Home padrão do workspace salva.',
    abrirMaquete: d => `No produto, abre ${d}.`,
  },

  ehMaquete: 'Maquete',
}

const en: Textos = {
  locale: 'en-US',
  casca: {
    menuLateral: 'Workspace menu', buscar: 'Search...', membro: 'Member', configuracoes: 'Settings',
    ajuda: 'Help', trilha: 'Breadcrumb', recolherMenu: 'Collapse menu', abrirMenu: 'Open menu',
    voltar: 'Back', avancar: 'Forward', recarregar: 'Reload', suporte: 'Support',
    notificacoes: 'Notifications', idioma: 'Language', tema: 'Theme', conta: 'Your account', workspaces: 'Workspaces',
    itens: {
      inicio: 'Home', spaceflows: 'Spaceflows', categorias: 'Categories', tarefas: 'Tasks',
      agendadas: 'Scheduled', rapidas: 'Quick', painel: 'Dashboard', agenda: 'Schedule',
      relatorios: 'menu.member.reports.label', knowledge: 'Knowledge', visaoGeral: 'Overview',
      sistema: 'System', estrutura: 'Structure', gestaoDeMembros: 'Member Management', interface: 'Interface',
      emails: 'E-mails', integracoes: 'Integrations', agentesDeIa: 'AI Agents', logs: 'Logs',
      releases: 'Releases', documentacao: 'Documentation',
    },
  },
  workspace: 'Lumina Operations',

  saudacao: (h, nome) => `${h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}, ${nome}!`,
  resumoDoDia: (a, h) => {
    if (!a && !h) return 'None of your tasks are due today.'
    const partes = [a ? `${a} overdue ${a === 1 ? 'task' : 'tasks'}` : '', h ? `${h} due today` : ''].filter(Boolean)
    return `You have ${partes.join(' and ')}.`
  },
  personalizar: 'Customize',

  widgets: {
    categorias: { titulo: 'Categories', descricao: 'Open a category or create an item in it.' },
    minhasTarefas: { titulo: 'My tasks', descricao: 'Your quick and scheduled tasks, by due date.' },
    visualizacao: { titulo: 'Items from a view', descricao: 'The items of a saved view of a category.' },
    numero: { titulo: 'Number from a view', descricao: 'How many items a saved view has right now.' },
    atalhos: { titulo: 'Shortcuts', descricao: 'Pinned views, screens and links.' },
    recentes: { titulo: 'Recent', descricao: 'The items and screens you opened last.' },
    agenda: { titulo: 'Today\'s schedule', descricao: 'Today\'s events, task due dates and item dates.' },
    saudeDosPrazos: { titulo: 'Due date health', descricao: 'Open workspace tasks by due date status.' },
    graficoDePainel: { titulo: 'Chart from a dashboard', descricao: 'A panel from a Dashboard screen.' },
    tarefasDelegadas: { titulo: 'Tasks I delegated', descricao: 'Quick tasks you created for other people.' },
    notas: { titulo: 'Notepad', descricao: 'Your notes. Only you can see them.' },
    comunicado: { titulo: 'Announcement', descricao: 'A notice from the admin to the whole workspace.' },
    beni: { titulo: 'BENI summary', descricao: 'BENI sums up what needs your attention today.' },
  },
  grupos: { trabalho: 'Work', itens: 'Items and numbers', navegacao: 'Navigation', equipe: 'Team and notes' },

  widget: {
    configurar: 'Configure',
    tamanhoPadrao: 'Default size',
    remover: 'Remove from Home',
    maisAcoes: n => `More actions for ${n}`,
    arrasteParaMover: 'Drag to move',
    mover: n => `Move ${n}. Use the arrow keys.`,
    redimensionar: n => `Resize ${n}. Use the arrow keys.`,
    movido: (n, p, t) => `${n} in position ${p} of ${t}.`,
    tamanho: (n, w, h) => `${n} with ${w} columns and ${h} rows.`,
    novo: 'New',
    novoDica: 'The admin added this widget to the workspace Home.',
    tentarDeNovo: 'Try again',
    erroTitulo: 'Could not load',
    erroTexto: 'The other widgets keep working.',
    semAcessoTitulo: 'No access',
    semAcessoTexto: c => `You do not have access to the ${c} category. Ask the admin or remove the widget.`,
  },

  criar: {
    botao: 'Create',
    dica: 'Create an item or a task (C)',
    placeholder: 'What do you want to create?',
    item: 'Item',
    itemDescricao: 'In a category, through its form',
    tarefa: 'Task',
    tarefaDescricao: 'Quick or scheduled',
    qualCategoria: 'In which category?',
    qualFormulario: c => `Which ${c} form?`,
    qualTarefa: 'Which kind of task?',
    formularios: n => `${n} forms`,
    todosOsCampos: 'All category fields',
    rapida: 'Quick task',
    rapidaDescricao: 'For you or someone else, outside the flow',
    agendada: 'Scheduled task',
    agendadaDescricao: 'Linked to an item in a category',
    criarNa: (s, c) => s ? `Create ${s}` : `Create item in ${c}`,
    beni: 'Ask BENI',
    beniDescricao: 'Describe it, and BENI builds it for you to review',
    beniToast: x => x ? `BENI builds "${x}" and shows it before saving.` : 'BENI opens so you can describe what to create.',
    beniDica: 'Mockup: in the product, opens the BENI AI chat.',
    vazio: t => `No option matches "${t}".`,
    rodape: 'Arrows and Enter choose. Backspace goes back. Esc closes.',
  },

  categoriasW: {
    abertos: n => n === 0 ? 'None open' : `${n} open`,
    acessar: c => `Open ${c}`,
    escolhaFormulario: 'Choose the form',
    verTodas: 'See all categories',
  },

  tarefas: {
    abas: { atraso: 'Overdue', hoje: 'Today', proximas: 'Upcoming', semPrazo: 'No due date' },
    origem: { todas: 'All', rapidas: 'Quick', agendadas: 'Scheduled' },
    rotuloOrigem: 'Task type',
    rapida: 'Quick',
    agendada: 'Scheduled',
    adicionar: 'Add task',
    adicionarEm: a => `Add task to ${a}`,
    placeholderNova: 'Task name. Enter creates it.',
    concluir: n => `Complete ${n}`,
    concluida: 'Task completed.',
    vazio: {
      atraso: 'No overdue tasks.',
      hoje: 'No tasks due today.',
      proximas: 'No tasks in the next 7 days.',
      semPrazo: 'All your tasks have a due date.',
    },
    venceuHa: d => d === 0 ? 'Due today' : d === 1 ? 'Due yesterday' : `Overdue by ${d} days`,
    hojeAs: h => `Today, ${h}`,
    emDias: d => d === 1 ? 'Tomorrow' : `In ${d} days`,
    semPrazo: 'No due date',
    verTodas: 'See all',
  },

  delegadas: { para: n => `With ${n}`, vazio: 'You have not delegated any open task.' },

  visualizacao: {
    colunas: { item: 'Item', etapa: 'Stage', responsavel: 'Assignee', valor: 'Amount' },
    vazio: 'No items in this view.',
    abrir: 'Open view',
    contagem: n => n === 1 ? '1 item' : `${n} items`,
  },

  numero: { itens: n => n === 1 ? 'item' : 'items', abrir: 'Open the view' },
  atalhos: {
    escolher: 'Choose shortcuts',
    vazio: 'Pin here what you open every day.',
    tipos: { visualizacao: 'View', tela: 'Screen', link: 'Link' },
  },
  recentes: {
    ha: m => m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : m < 2880 ? 'yesterday' : `${Math.round(m / 1440)} days ago`,
    vazio: 'What you open shows up here.',
    tipos: { item: 'Item', visualizacao: 'View', tela: 'Screen', formulario: 'Form' },
  },
  agenda: { vazio: 'Nothing on the schedule today.', abrir: 'Open Schedule', fontes: { tarefa: 'Task', item: 'Item', calendario: 'Calendar' } },
  saude: {
    subtitulo: 'Open in the workspace',
    faixas: { vencidas: 'Overdue', vencem7: 'Due in 7 days', noPrazo: 'On time', semPrazo: 'No due date' },
    abrirPainel: 'Open the Tasks dashboard',
  },
  grafico: { origem: t => `From the ${t} screen`, abrir: 'Open the screen' },
  notas: { placeholder: 'Write here. Only you can see it.', soVoce: 'Only you can see it' },
  comunicado: { por: (a, d) => `${a}, ${d === 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`}`, editar: 'Edit announcement', salvar: 'Publish', soAdmin: 'Only the admin can edit' },
  beni: { aviso: 'Generated by BENI. Check before acting.', atualizar: 'Refresh summary' },

  personalizacao: {
    titulo: 'Customize Home',
    descricao: 'Choose what shows on your Home. Nobody else sees the change.',
    abaNaHome: 'On your Home',
    abaAdicionar: 'Add widget',
    buscar: 'Search widget',
    adicionar: 'Add',
    adicionarOutro: 'Add another',
    jaNaHome: 'On Home',
    subir: n => `Move ${n} up`,
    descer: n => `Move ${n} down`,
    remover: n => `Remove ${n}`,
    restaurar: 'Restore the default Home',
    restaurarConfirma: 'Your Home goes back to the workspace Home. Notes and shortcuts stay saved.',
    editando: 'Editing',
    minha: 'My Home',
    padrao: 'Workspace default Home',
    dica: 'On the Home, drag a widget by its title to move it and pull the corner to resize it.',
    nenhumWidget: 'No widgets on the Home.',
    semResultado: 'No widget with that name.',
  },

  bannerPadrao: {
    titulo: 'You are editing the workspace default Home',
    texto: 'It applies to everyone who has not customized yet. A widget you add also shows up on the Home of those who already did.',
    concluir: 'Finish editing',
  },

  config: {
    titulo: w => `Configure ${w}`,
    categoria: 'Category',
    visualizacao: 'View',
    tituloDoWidget: 'Widget title',
    tituloAjuda: 'Without a title, the view name is used.',
    salvar: 'Save',
    cancelar: 'Cancel',
    categoriasAjuda: 'Check the categories shown in the widget. With none checked, all the ones you can access show up.',
    todas: 'Show all',
  },

  novaTarefa: {
    tituloRapida: 'New quick task',
    tituloAgendada: 'New scheduled task',
    descricaoRapida: 'Goes to Tasks > Quick.',
    descricaoAgendada: 'Stays in the item and shows in Tasks > Scheduled.',
    nome: 'Name',
    nomePlaceholder: 'Type the task name',
    nomeObrigatorio: 'Give the task a name.',
    item: 'Related item',
    itemPlaceholder: 'Search by title or number',
    itemObrigatorio: 'Choose the item for the scheduled task.',
    dataLimite: 'Due date',
    descricao: 'Description',
    responsavel: 'Assignee',
    colaboradores: 'Collaborators',
    colaboradoresPlaceholder: 'Nobody',
    prioridade: 'Priority',
    prioridades: { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' },
    criar: 'Create',
    cancelar: 'Cancel',
    criada: r => `Task ${r} created.`,
    abrir: 'Open',
  },

  novoItem: {
    descricao: (c, f) => f ? `${c} · ${f} form` : `${c} · All category fields`,
    tituloCampo: 'Title',
    tituloObrigatorio: 'Give the item a title.',
    valor: 'Amount',
    prazo: 'Due date',
    urgente: 'Urgent',
    responsavel: 'Assignee',
    criar: 'Create',
    criado: (r, c) => `Item ${r} created in ${c}.`,
  },

  estados: {
    vazioTitulo: 'Your Home is empty',
    vazioTexto: 'Add widgets to see your tasks, items and shortcuts here.',
    adicionarWidget: 'Add widget',
  },

  toasts: {
    removido: n => `${n} left the Home.`,
    adicionado: n => `${n} is now on the Home.`,
    desfazer: 'Undo',
    restaurada: 'Default Home restored.',
    padraoSalvo: 'Workspace default Home saved.',
    abrirMaquete: d => `In the product, this opens ${d}.`,
  },

  ehMaquete: 'Mockup',
}

const es: Textos = {
  locale: 'es-ES',
  casca: {
    menuLateral: 'Menú del workspace', buscar: 'Buscar...', membro: 'Miembro', configuracoes: 'Configuración',
    ajuda: 'Ayuda', trilha: 'Ruta', recolherMenu: 'Contraer el menú', abrirMenu: 'Abrir el menú',
    voltar: 'Volver', avancar: 'Avanzar', recarregar: 'Recargar', suporte: 'Soporte',
    notificacoes: 'Notificaciones', idioma: 'Idioma', tema: 'Tema', conta: 'Tu cuenta', workspaces: 'Workspaces',
    itens: {
      inicio: 'Inicio', spaceflows: 'Spaceflows', categorias: 'Categorías', tarefas: 'Tareas',
      agendadas: 'Programadas', rapidas: 'Rápidas', painel: 'Panel', agenda: 'Agenda',
      relatorios: 'menu.member.reports.label', knowledge: 'Knowledge', visaoGeral: 'Visión General',
      sistema: 'Sistema', estrutura: 'Estructura', gestaoDeMembros: 'Gestión de Miembros', interface: 'Interfaz',
      emails: 'E-mails', integracoes: 'Integraciones', agentesDeIa: 'Agentes de IA', logs: 'Logs',
      releases: 'Releases', documentacao: 'Documentación',
    },
  },
  workspace: 'Operaciones Lumina',

  saudacao: (h, nome) => `${h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches'}, ${nome}!`,
  resumoDoDia: (a, h) => {
    if (!a && !h) return 'Ninguna tarea tuya vence hoy.'
    const partes = [a ? `${a} ${a === 1 ? 'tarea atrasada' : 'tareas atrasadas'}` : '', h ? `${h} para hoy` : ''].filter(Boolean)
    return `Tienes ${partes.join(' y ')}.`
  },
  personalizar: 'Personalizar',

  widgets: {
    categorias: { titulo: 'Categorías', descricao: 'Accede a una categoría o crea un ítem en ella.' },
    minhasTarefas: { titulo: 'Mis tareas', descricao: 'Tus tareas rápidas y programadas, por plazo.' },
    visualizacao: { titulo: 'Ítems de una vista', descricao: 'Los ítems de una vista guardada de una categoría.' },
    numero: { titulo: 'Número de una vista', descricao: 'Cuántos ítems tiene ahora una vista guardada.' },
    atalhos: { titulo: 'Accesos directos', descricao: 'Vistas, pantallas y enlaces fijados.' },
    recentes: { titulo: 'Recientes', descricao: 'Los ítems y las pantallas que abriste por último.' },
    agenda: { titulo: 'Agenda de hoy', descricao: 'Compromisos, plazos de tarea y fechas de ítem de hoy.' },
    saudeDosPrazos: { titulo: 'Salud de los plazos', descricao: 'Tareas abiertas del workspace por situación del plazo.' },
    graficoDePainel: { titulo: 'Gráfico de un panel', descricao: 'Un panel de una pantalla de tipo Dashboard.' },
    tarefasDelegadas: { titulo: 'Tareas que delegué', descricao: 'Tareas rápidas que creaste para otras personas.' },
    notas: { titulo: 'Bloc de notas', descricao: 'Tus notas. Solo tú las ves.' },
    comunicado: { titulo: 'Comunicado', descricao: 'Aviso del administrador para todo el workspace.' },
    beni: { titulo: 'Resumen del BENI', descricao: 'El BENI resume lo que necesita tu atención hoy.' },
  },
  grupos: { trabalho: 'Trabajo', itens: 'Ítems y números', navegacao: 'Navegación', equipe: 'Equipo y notas' },

  widget: {
    configurar: 'Configurar',
    tamanhoPadrao: 'Tamaño predeterminado',
    remover: 'Quitar del Inicio',
    maisAcoes: n => `Más acciones de ${n}`,
    arrasteParaMover: 'Arrastra para mover',
    mover: n => `Mover ${n}. Usa las flechas.`,
    redimensionar: n => `Cambiar el tamaño de ${n}. Usa las flechas.`,
    movido: (n, p, t) => `${n} en la posición ${p} de ${t}.`,
    tamanho: (n, w, h) => `${n} con ${w} columnas y ${h} filas.`,
    novo: 'Nuevo',
    novoDica: 'El administrador agregó este widget al Inicio del workspace.',
    tentarDeNovo: 'Intentar de nuevo',
    erroTitulo: 'No se pudo cargar',
    erroTexto: 'Los otros widgets siguen funcionando.',
    semAcessoTitulo: 'Sin acceso',
    semAcessoTexto: c => `No tienes acceso a la categoría ${c}. Pídelo al administrador o quita el widget.`,
  },

  criar: {
    botao: 'Crear',
    dica: 'Crear ítem o tarea (C)',
    placeholder: '¿Qué quieres crear?',
    item: 'Ítem',
    itemDescricao: 'En una categoría, con su formulario',
    tarefa: 'Tarea',
    tarefaDescricao: 'Rápida o programada',
    qualCategoria: '¿En qué categoría?',
    qualFormulario: c => `¿Qué formulario de ${c}?`,
    qualTarefa: '¿Qué tipo de tarea?',
    formularios: n => `${n} formularios`,
    todosOsCampos: 'Todos los campos de la categoría',
    rapida: 'Tarea rápida',
    rapidaDescricao: 'Para ti u otra persona, fuera del flujo',
    agendada: 'Tarea programada',
    agendadaDescricao: 'Vinculada a un ítem de una categoría',
    criarNa: (s, c) => s ? `Crear ${s}` : `Crear ítem en ${c}`,
    beni: 'Pedir al BENI',
    beniDescricao: 'Descríbelo, y el BENI lo arma para que lo revises',
    beniToast: x => x ? `El BENI arma "${x}" y lo muestra antes de guardar.` : 'El BENI se abre para que describas qué crear.',
    beniDica: 'Maqueta: en el producto, abre el chat del BENI AI.',
    vazio: t => `Ninguna opción con "${t}".`,
    rodape: 'Flechas y Enter eligen. Retroceso vuelve. Esc cierra.',
  },

  categoriasW: {
    abertos: n => n === 0 ? 'Ninguno abierto' : n === 1 ? '1 abierto' : `${n} abiertos`,
    acessar: c => `Acceder a ${c}`,
    escolhaFormulario: 'Elige el formulario',
    verTodas: 'Ver todas las categorías',
  },

  tarefas: {
    abas: { atraso: 'Atrasadas', hoje: 'Hoy', proximas: 'Próximas', semPrazo: 'Sin plazo' },
    origem: { todas: 'Todas', rapidas: 'Rápidas', agendadas: 'Programadas' },
    rotuloOrigem: 'Tipo de tarea',
    rapida: 'Rápida',
    agendada: 'Programada',
    adicionar: 'Agregar tarea',
    adicionarEm: a => `Agregar tarea en ${a}`,
    placeholderNova: 'Nombre de la tarea. Enter la crea.',
    concluir: n => `Completar ${n}`,
    concluida: 'Tarea completada.',
    vazio: {
      atraso: 'Ninguna tarea atrasada.',
      hoje: 'Ninguna tarea vence hoy.',
      proximas: 'Ninguna tarea en los próximos 7 días.',
      semPrazo: 'Todas tus tareas tienen plazo.',
    },
    venceuHa: d => d === 0 ? 'Venció hoy' : d === 1 ? 'Venció ayer' : `Venció hace ${d} días`,
    hojeAs: h => `Hoy, ${h}`,
    emDias: d => d === 1 ? 'Mañana' : `En ${d} días`,
    semPrazo: 'Sin plazo',
    verTodas: 'Ver todas',
  },

  delegadas: { para: n => `Con ${n}`, vazio: 'No delegaste ninguna tarea abierta.' },

  visualizacao: {
    colunas: { item: 'Ítem', etapa: 'Etapa', responsavel: 'Responsable', valor: 'Valor' },
    vazio: 'Ningún ítem en esta vista.',
    abrir: 'Abrir vista',
    contagem: n => n === 1 ? '1 ítem' : `${n} ítems`,
  },

  numero: { itens: n => n === 1 ? 'ítem' : 'ítems', abrir: 'Abrir la vista' },
  atalhos: {
    escolher: 'Elegir accesos',
    vazio: 'Fija aquí lo que abres todos los días.',
    tipos: { visualizacao: 'Vista', tela: 'Pantalla', link: 'Enlace' },
  },
  recentes: {
    ha: m => m < 60 ? `hace ${m} min` : m < 1440 ? `hace ${Math.round(m / 60)} h` : m < 2880 ? 'ayer' : `hace ${Math.round(m / 1440)} días`,
    vazio: 'Lo que abras aparece aquí.',
    tipos: { item: 'Ítem', visualizacao: 'Vista', tela: 'Pantalla', formulario: 'Formulario' },
  },
  agenda: { vazio: 'Nada en la agenda hoy.', abrir: 'Abrir la Agenda', fontes: { tarefa: 'Tarea', item: 'Ítem', calendario: 'Calendario' } },
  saude: {
    subtitulo: 'Abiertas en el workspace',
    faixas: { vencidas: 'Vencidas', vencem7: 'Vencen en 7 días', noPrazo: 'En plazo', semPrazo: 'Sin plazo' },
    abrirPainel: 'Abrir el Panel de tareas',
  },
  grafico: { origem: t => `De la pantalla ${t}`, abrir: 'Abrir la pantalla' },
  notas: { placeholder: 'Escribe aquí. Solo tú lo ves.', soVoce: 'Solo tú lo ves' },
  comunicado: { por: (a, d) => `${a}, ${d === 0 ? 'hoy' : d === 1 ? 'ayer' : `hace ${d} días`}`, editar: 'Editar comunicado', salvar: 'Publicar', soAdmin: 'Solo el administrador lo edita' },
  beni: { aviso: 'Generado por el BENI. Revisa antes de actuar.', atualizar: 'Actualizar resumen' },

  personalizacao: {
    titulo: 'Personalizar el Inicio',
    descricao: 'Elige lo que aparece en tu Inicio. Nadie más ve el cambio.',
    abaNaHome: 'En tu Inicio',
    abaAdicionar: 'Agregar widget',
    buscar: 'Buscar widget',
    adicionar: 'Agregar',
    adicionarOutro: 'Agregar otro',
    jaNaHome: 'En el Inicio',
    subir: n => `Subir ${n}`,
    descer: n => `Bajar ${n}`,
    remover: n => `Quitar ${n}`,
    restaurar: 'Restaurar el Inicio predeterminado',
    restaurarConfirma: 'Tu Inicio vuelve a ser igual al del workspace. Las notas y los accesos siguen guardados.',
    editando: 'Editando',
    minha: 'Mi Inicio',
    padrao: 'Inicio predeterminado del workspace',
    dica: 'En el Inicio, arrastra el widget por el título para moverlo y tira de la esquina para cambiar el tamaño.',
    nenhumWidget: 'Ningún widget en el Inicio.',
    semResultado: 'Ningún widget con ese nombre.',
  },

  bannerPadrao: {
    titulo: 'Estás editando el Inicio predeterminado del workspace',
    texto: 'Vale para quien aún no personalizó. El widget que agregues aparece también en el Inicio de quien ya personalizó.',
    concluir: 'Terminar edición',
  },

  config: {
    titulo: w => `Configurar ${w}`,
    categoria: 'Categoría',
    visualizacao: 'Vista',
    tituloDoWidget: 'Título del widget',
    tituloAjuda: 'Sin título, vale el nombre de la vista.',
    salvar: 'Guardar',
    cancelar: 'Cancelar',
    categoriasAjuda: 'Marca las categorías que aparecen en el widget. Sin ninguna marcada, aparecen todas a las que tienes acceso.',
    todas: 'Mostrar todas',
  },

  novaTarefa: {
    tituloRapida: 'Nueva tarea rápida',
    tituloAgendada: 'Nueva tarea programada',
    descricaoRapida: 'Queda en Tareas > Rápidas.',
    descricaoAgendada: 'Queda en el ítem y aparece en Tareas > Programadas.',
    nome: 'Nombre',
    nomePlaceholder: 'Escribe el nombre de la tarea',
    nomeObrigatorio: 'Ponle un nombre a la tarea.',
    item: 'Ítem relacionado',
    itemPlaceholder: 'Buscar por título o número',
    itemObrigatorio: 'Elige el ítem de la tarea programada.',
    dataLimite: 'Fecha límite',
    descricao: 'Descripción',
    responsavel: 'Responsable',
    colaboradores: 'Colaboradores',
    colaboradoresPlaceholder: 'Nadie',
    prioridade: 'Prioridad',
    prioridades: { low: 'Baja', normal: 'Normal', high: 'Alta', urgent: 'Urgente' },
    criar: 'Crear',
    cancelar: 'Cancelar',
    criada: r => `Tarea ${r} creada.`,
    abrir: 'Abrir',
  },

  novoItem: {
    descricao: (c, f) => f ? `${c} · Formulario ${f}` : `${c} · Todos los campos de la categoría`,
    tituloCampo: 'Título',
    tituloObrigatorio: 'Ponle un título al ítem.',
    valor: 'Valor',
    prazo: 'Fecha de vencimiento',
    urgente: 'Urgente',
    responsavel: 'Responsable',
    criar: 'Crear',
    criado: (r, c) => `Ítem ${r} creado en ${c}.`,
  },

  estados: {
    vazioTitulo: 'Tu Inicio está vacío',
    vazioTexto: 'Agrega widgets para ver aquí tus tareas, tus ítems y tus accesos.',
    adicionarWidget: 'Agregar widget',
  },

  toasts: {
    removido: n => `${n} salió del Inicio.`,
    adicionado: n => `${n} entró al Inicio.`,
    desfazer: 'Deshacer',
    restaurada: 'Inicio predeterminado restaurado.',
    padraoSalvo: 'Inicio predeterminado del workspace guardado.',
    abrirMaquete: d => `En el producto, abre ${d}.`,
  },

  ehMaquete: 'Maqueta',
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': ptBR, en, es }
