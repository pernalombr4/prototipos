/**
 * A copy da Home nos 3 idiomas do ENSPACE.
 *
 * Regra 33: nenhum texto de interface leva travessão.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { GrupoDoCatalogo, SecaoDeTarefas, TipoDeWidget } from './widgets'

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
    buscar: string
    adicionar: string
    adicionarOutro: string
    jaNaHome: string
    subir: (nome: string) => string
    descer: (nome: string) => string
    remover: (nome: string) => string
    restaurar: string
    editando: string
    minha: string
    padrao: string
    semResultado: string
    catalogoTitulo: string
    catalogoMinha: string
    catalogoPadrao: string
    cancelar: string
    cancelarDica: string
    restaurarDica: string
    concluir: string
    salva: string
  }

  bannerPadrao: { titulo: string, texto: string }

  config: {
    titulo: (widget: string) => string
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

  secoes: Record<SecaoDeTarefas, string>
  descricaoDosGrupos: Record<GrupoDoCatalogo, string>
  /** Rodada 8: a descrição do grupo quando o catálogo mostra só o MVP. */
  descricaoDosGruposMvp: Partial<Record<GrupoDoCatalogo, string>>
  escopoDeTarefas: { rotulo: string, minhas: string, workspace: string }
  catalogo: {
    voltar: string
    opcoes: (n: number) => string
    escopoDica: string
    categoriasDica: string
    adicionarCategorias: string
    salvarCategorias: string
    semCategorias: string
    marcadas: (n: number, total: number) => string
    resultados: string
  }
  ordem: { subir: (nome: string) => string, descer: (nome: string) => string, mostrar: (nome: string) => string, todas: string, nenhuma: string }
  laminas: {
    subtitulos: Partial<Record<TipoDeWidget, string>>
    dasAbertas: (pct: number) => string
    nadaPorAqui: string
    semDados: string
    faixas: { haMaisDe7: string, haAte7: string, em24h: string, em1a7: string }
    venceuHa: (duracao: string) => string
    em: (duracao: string) => string
    duracao: (dias: number, horas: number) => string
    semResponsavel: string
    status: Record<'pending' | 'working' | 'blocked', string>
    abertas: string
    carga: { vencidas: string, emDia: string }
    atividade: { diasAtivos: string, sequencia: string, dias: (n: number) => string, celula: (data: string, n: number) => string, menos: string, mais: string }
    entrada: { criadas: string, concluidas: string, saldo: string, semana: (data: string) => string }
    abrirPainel: string
  }
  vazios: {
    categoriasTitulo: string
    categoriasAdmin: string
    categoriasMembro: string
    criarCategoria: string
    comunicado: string
    escreverComunicado: string
    beni: string
    grafico: (tela: string) => string
  }

  beniChat: {
    titulo: string
    novaConversa: string
    telaCheia: string
    fechar: string
    placeholder: string
    aviso: string
    enviar: string
    ola: (nome: string) => string
    apresentacao: string
    sugestoes: string[]
    pensando: string
    respostaTarefa: string
    respostaItem: (categoria: string) => string
    respostaCategoria: string
    respostaAjuda: string
    respostaResumo: string
    rascunho: { tarefa: string, item: (categoria: string) => string, categoria: string }
    campos: { nome: string, titulo: string, prazo: string, responsavel: string, prioridade: string, valor: string, urgente: string, sim: string, formulario: string, camposSugeridos: string, nomeDaCategoria: string, semPrazo: string, semNome: string }
    camposSugeridos: string[]
    acoes: { criar: string, revisar: string, descartar: string, montar: string }
    criadaTarefa: (ref: string) => string
    criadoItem: (ref: string) => string
    revisando: string
    descartado: string
    montarToast: string
  }
  beniW: { conversar: string, boasVindas: string }
  iaW: {
    agentes: { conversar: (nome: string) => string, sistema: string, revisor: string, gerenciar: string }
    avisoDoAgente: string
    /** Rodada 8, MVP: o destino do clique no agente ou no Pedir ao BENI. */
    conversaEmTelaCheia: (agente: string) => string
    ola: (nome: string) => string
    respostaDoAgente: (agente: string) => string
  }
  spaceflowW: {
    periodo: string
    status: Record<'working' | 'completed' | 'error' | 'canceled', string>
    sucesso: (pct: number) => string
    repetir: string
    repetido: string
    abrirExecucao: string
    vazioFalhas: string
    vazioAndamento: string
    vazioExecucoes: string
    aguarda: (passo: string) => string
    falhouEm: (passo: string) => string
    ha: (tempo: string) => string
    parado: string
    tipos: Record<'approval' | 'signature' | 'task' | 'form' | 'delay' | 'http' | 'email' | 'ai_agent' | 'crud', string>
    soQuemAcessa: string
    abrirSpaceflow: string
  }
  agendaW: {
    mais: (n: number) => string
    nadaNoDia: string
    hoje: string
    mesAnterior: string
    proximoMes: string
  }
  itensW: {
    vazio: string
    vazioMeus: string
    criadoPor: (nome: string) => string
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
    kpiAbertas: { titulo: 'Abertas agora', descricao: 'Quantas tarefas estão abertas, com a curva das últimas 4 semanas.' },
    kpiConcluidas: { titulo: 'Concluídas', descricao: 'Tarefas concluídas nas últimas 4 semanas.' },
    kpiCriadas: { titulo: 'Criadas', descricao: 'Tarefas criadas nas últimas 4 semanas.' },
    kpiVencidas: { titulo: 'Vencidas', descricao: 'Tarefas abertas com o prazo já passado.' },
    kpiVencem7: { titulo: 'Vencem em 7 dias', descricao: 'Tarefas abertas que vencem até o fim do 7º dia.' },
    vencidas: { titulo: 'Vencidas', descricao: 'A lista das tarefas vencidas, das mais antigas às mais recentes.' },
    vencemEmBreve: { titulo: 'Vencem em breve', descricao: 'A lista das tarefas que vencem nos próximos 7 dias.' },
    minhasTarefas: { titulo: 'Minhas tarefas', descricao: 'Suas tarefas rápidas e agendadas, por prazo, com Concluir.' },
    tarefasDelegadas: { titulo: 'Tarefas que delegei', descricao: 'Tarefas rápidas que você criou para outras pessoas.' },
    status: { titulo: 'Abertas por status', descricao: 'Como a fila atual está distribuída.' },
    prioridade: { titulo: 'Prioridade', descricao: 'Tarefas rápidas abertas por prioridade.' },
    carga: { titulo: 'Carga por responsável', descricao: 'Quem concentra a fila e as vencidas.' },
    atividade: { titulo: 'Atividade', descricao: 'Concluídas por dia nas últimas 4 semanas.' },
    saudeDosPrazos: { titulo: 'Saúde dos prazos', descricao: 'Tarefas abertas pela situação do prazo.' },
    entradaESaida: { titulo: 'Entrada e saída', descricao: 'Tarefas criadas e concluídas por semana.' },
    categorias: { titulo: 'Categorias', descricao: 'Acesse uma categoria ou crie um item nela.' },
    atalhos: { titulo: 'Atalhos', descricao: 'Visualizações, telas e links fixados.' },
    recentes: { titulo: 'Recentes', descricao: 'Os itens e as telas que você abriu por último.' },
    agenda: { titulo: 'Compromissos do dia', descricao: 'Compromissos, prazos de tarefa e datas de item de hoje.' },
    graficoDePainel: { titulo: 'Gráfico de um painel', descricao: 'Um painel de uma tela do tipo Dashboard.' },
    comunicado: { titulo: 'Comunicado', descricao: 'Aviso do administrador para todo o workspace.' },
    notas: { titulo: 'Bloco de notas', descricao: 'Anotações suas. Só você vê.' },
    beni: { titulo: 'BENI', descricao: 'O resumo do dia feito pelo BENI, com o atalho para a conversa com ele.' },
    agentesIa: { titulo: 'Agentes de IA', descricao: 'Os agentes do workspace. Um clique abre a conversa com o agente.' },
    execucoesFluxos: { titulo: 'Execuções dos fluxos', descricao: 'Quantas execuções estão em andamento, concluídas, com erro e canceladas nos últimos 7 dias.' },
    falhasFluxos: { titulo: 'Falhas nos fluxos', descricao: 'O fluxo que parou com erro, o passo, a mensagem e Repetir.' },
    fluxosAndamento: { titulo: 'Fluxos em andamento', descricao: 'Os fluxos que estão rodando, o mais antigo primeiro, com o passo em que esperam.' },
    agendaSemana: { titulo: 'Agenda da semana', descricao: 'Os 7 dias a partir de hoje, em colunas.' },
    agendaMes: { titulo: 'Agenda do mês', descricao: 'O calendário do mês. Clique num dia para ver o que há nele.' },
    meusItens: { titulo: 'Meus itens', descricao: 'Os itens que você criou.' },
    ultimosItens: { titulo: 'Itens criados recentemente', descricao: 'Os últimos itens criados nas categorias que você acessa.' },
    itensPorCategoria: { titulo: 'Itens por categoria', descricao: 'Quantos itens há em cada categoria que você acessa.' },
  },
  grupos: { tarefas: 'Tarefas', agenda: 'Agenda', itens: 'Itens e categorias', atalhos: 'Telas e atalhos', ia: 'IA', spaceflow: 'Spaceflow', equipe: 'Equipe e notas' },

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
    semAcessoTexto: c => `Você não tem acesso a ${c}. Peça ao administrador ou remova o widget.`,
  },

  criar: {
    botao: 'Criar',
    dica: 'Criar item ou tarefa (C)',
    placeholder: 'O que você quer criar?',
    item: 'Item',
    itemDescricao: 'Em uma categoria, pelo formulário dela',
    tarefa: 'Tarefa',
    tarefaDescricao: 'Tarefa rápida, com prazo e responsável',
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
    titulo: 'Personalizando a Home',
    descricao: 'Arraste o widget pelo título para mudar de lugar e puxe o canto para mudar o tamanho.',
    buscar: 'Buscar widget',
    adicionar: 'Adicionar',
    adicionarOutro: 'Adicionar outro',
    jaNaHome: 'Na Home',
    subir: n => `Subir ${n}`,
    descer: n => `Descer ${n}`,
    remover: n => `Remover ${n}`,
    restaurar: 'Restaurar padrão',
    editando: 'Editando',
    minha: 'Minha Home',
    padrao: 'Home padrão do workspace',
    semResultado: 'Nenhum widget com esse nome.',
    catalogoTitulo: 'Adicionar widget',
    catalogoMinha: 'O widget entra no topo da sua Home. Ninguém mais vê a mudança.',
    catalogoPadrao: 'O widget entra na Home padrão e também na Home de quem já personalizou.',
    cancelar: 'Cancelar',
    cancelarDica: 'Cancelar e descartar as mudanças',
    restaurarDica: 'Restaurar a Home padrão do workspace',
    concluir: 'Concluir',
    salva: 'Home salva.',
  },

  bannerPadrao: {
    titulo: 'Você está editando a Home padrão do workspace',
    texto: 'Vale para quem ainda não personalizou. O widget que você adicionar aparece também na Home de quem já personalizou.',
  },

  config: {
    titulo: w => `Configurar ${w}`,
    salvar: 'Salvar',
    cancelar: 'Cancelar',
    categoriasAjuda: 'Marque as categorias que aparecem no widget e use as setas para definir a ordem. Sem nenhuma marcada, aparecem todas as que você acessa, na ordem do workspace.',
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

  secoes: { numeros: 'Números', listas: 'Listas', graficos: 'Gráficos' },
  descricaoDosGruposMvp: {
    agenda: 'Os compromissos do dia, com os prazos de tarefa e as datas de item.',
    itens: 'As categorias do workspace, com o botão de criar item.',
    atalhos: 'Atalhos e telas abertas por último.',
    ia: 'Os agentes do workspace.',
  },
  descricaoDosGrupos: {
    tarefas: 'Números, listas e gráficos das tarefas rápidas e agendadas.',
    agenda: 'O dia, a semana e o mês, com compromissos, prazos de tarefa e datas de item.',
    itens: 'As categorias e os itens: os que você criou, os mais novos e a contagem por categoria.',
    atalhos: 'Atalhos, telas abertas por último e o gráfico de um painel.',
    ia: 'O BENI e os agentes do workspace.',
    spaceflow: 'As execuções dos fluxos: os números, as falhas e o que está em andamento.',
    equipe: 'O comunicado do administrador e o bloco de notas.',
  },
  escopoDeTarefas: { rotulo: 'De quem são as tarefas', minhas: 'Minhas tarefas', workspace: 'Workspace' },
  catalogo: {
    voltar: 'Voltar',
    opcoes: n => n === 1 ? '1 opção' : `${n} opções`,
    escopoDica: 'Os números, as listas de prazo e os gráficos seguem a escolha Minhas tarefas ou Workspace do topo da Home.',
    categoriasDica: 'Marque as categorias que aparecem no widget e use as setas para definir a ordem.',
    adicionarCategorias: 'Adicionar à Home',
    salvarCategorias: 'Salvar na Home',
    semCategorias: 'O workspace ainda não tem categorias.',
    marcadas: (n, t) => n === 0 ? `Nenhuma marcada: aparecem as ${t}, na ordem do workspace.` : `${n} de ${t} marcadas`,
    resultados: 'Resultados',
  },
  ordem: { subir: n => `Subir ${n}`, descer: n => `Descer ${n}`, mostrar: n => `Mostrar ${n}`, todas: 'Marcar todas', nenhuma: 'Desmarcar todas' },
  laminas: {
    subtitulos: {
      kpiConcluidas: 'Últimas 4 semanas',
      kpiCriadas: 'Últimas 4 semanas',
      vencidas: 'Rápidas e agendadas',
      vencemEmBreve: 'Rápidas e agendadas',
      status: 'Como a fila atual está distribuída',
      prioridade: 'Tarefas rápidas abertas',
      carga: 'Quem concentra a fila e as vencidas',
      atividade: 'Concluídas por dia, últimas 4 semanas',
      saudeDosPrazos: 'Abertas agora pela situação do prazo',
      entradaESaida: 'Criadas e concluídas por semana',
    },
    dasAbertas: p => `${p}% das abertas`,
    nadaPorAqui: 'Nada por aqui',
    semDados: 'Sem tarefas para mostrar.',
    faixas: { haMaisDe7: 'Há mais de 7 dias', haAte7: 'Há até 7 dias', em24h: 'Em até 24 h', em1a7: 'Em 1 a 7 dias' },
    venceuHa: d => `venceu há ${d}`,
    em: d => `em ${d}`,
    duracao: (d, h) => d ? (h ? `${d} d ${h} h` : `${d} d`) : `${h} h`,
    semResponsavel: 'Sem responsável',
    status: { pending: 'Pendente', working: 'Em andamento', blocked: 'Bloqueada' },
    abertas: 'abertas',
    carga: { vencidas: 'Vencidas', emDia: 'Em dia' },
    atividade: {
      diasAtivos: 'Dias ativos',
      sequencia: 'Sequência atual',
      dias: n => n === 1 ? '1 dia' : `${n} dias`,
      celula: (d, n) => `${d}: ${n} ${n === 1 ? 'concluída' : 'concluídas'}`,
      menos: 'Menos',
      mais: 'Mais',
    },
    entrada: { criadas: 'Criadas', concluidas: 'Concluídas', saldo: 'Saldo do período', semana: d => `Semana de ${d}` },
    abrirPainel: 'Abrir o Painel de tarefas',
  },
  vazios: {
    categoriasTitulo: 'Nenhuma categoria ainda',
    categoriasAdmin: 'Crie a primeira categoria para o time começar a registrar itens.',
    categoriasMembro: 'O administrador ainda não criou categorias neste workspace.',
    criarCategoria: 'Criar categoria',
    comunicado: 'Nenhum comunicado publicado.',
    escreverComunicado: 'Escrever comunicado',
    beni: 'O BENI resume o dia quando houver tarefas e itens. Enquanto isso, ele ajuda a montar o workspace.',
    grafico: t => `A tela ${t} ainda não tem dados.`,
  },

  beniChat: {
    titulo: 'BENI AI',
    novaConversa: 'Nova conversa',
    telaCheia: 'Abrir em tela cheia',
    fechar: 'Fechar a conversa',
    placeholder: 'Descreva o item ou a tarefa que você quer criar',
    aviso: 'O BENI pode errar. Confira o rascunho antes de criar.',
    enviar: 'Enviar',
    ola: n => `Olá, ${n}. Eu sou o BENI.`,
    apresentacao: 'Descreva o que você precisa criar, com prazo e responsável se houver. Eu preparo o rascunho, e você confere antes de criar.',
    sugestoes: [
      'Criar uma tarefa para amanhã às 10h: ligar para a Atria sobre a renovação',
      'Abrir um chamado urgente: impressora do 3º andar sem papel',
      'Novo reembolso de R$ 84,90: táxi até o aeroporto',
      'Montar uma categoria de Eventos',
    ],
    pensando: 'Preparando o rascunho',
    respostaTarefa: 'Preparei esta tarefa rápida. Confira os campos antes de criar.',
    respostaItem: c => `Preparei o rascunho em ${c}. Confira os campos antes de criar.`,
    respostaCategoria: 'Montei uma sugestão de categoria. Os campos podem mudar depois, nas configurações da categoria.',
    respostaAjuda: 'Eu crio itens e tarefas a partir do que você escrever. Diga o que é, para quando e para quem. Por exemplo:',
    respostaResumo: 'Este é o resumo de hoje:',
    rascunho: { tarefa: 'Tarefa rápida', item: c => `Item em ${c}`, categoria: 'Nova categoria' },
    campos: { nome: 'Nome', titulo: 'Título', prazo: 'Data limite', responsavel: 'Responsável', prioridade: 'Prioridade', valor: 'Valor', urgente: 'Urgente', sim: 'Sim', formulario: 'Formulário', camposSugeridos: 'Campos sugeridos', nomeDaCategoria: 'Nome', semPrazo: 'Sem prazo', semNome: 'Sem nome' },
    camposSugeridos: ['Título', 'Responsável', 'Status', 'Data', 'Anexos'],
    acoes: { criar: 'Criar', revisar: 'Revisar no formulário', descartar: 'Descartar', montar: 'Montar categoria' },
    criadaTarefa: r => `Tarefa ${r} criada.`,
    criadoItem: r => `Item ${r} criado.`,
    revisando: 'Rascunho aberto no formulário.',
    descartado: 'Rascunho descartado.',
    montarToast: 'Maquete: no produto, a categoria abre nas configurações com estes campos.',
  },
  beniW: {
    conversar: 'Conversar com o BENI',
    boasVindas: 'O BENI cria itens e tarefas a partir do que você escrever e responde dúvidas sobre o workspace.',
  },
  iaW: {
    agentes: { conversar: n => `Conversar com ${n}`, sistema: 'Do sistema', revisor: 'Revisor', gerenciar: 'Gerenciar agentes' },
    avisoDoAgente: 'O agente pode errar. Confira a resposta antes de usar.',
    conversaEmTelaCheia: a => `a conversa com ${a === 'BENI' ? 'o BENI' : a} em tela cheia`,
    ola: n => `Olá, ${n}.`,
    respostaDoAgente: a => `No produto, quem responde é o agente ${a}, com o modelo e as ferramentas configurados nele.`,
  },
  spaceflowW: {
    periodo: 'Últimos 7 dias',
    status: { working: 'Em andamento', completed: 'Concluídas', error: 'Com erro', canceled: 'Canceladas' },
    sucesso: p => `${p}% das execuções terminadas foram concluídas`,
    repetir: 'Repetir',
    repetido: 'O passo voltou para a fila do fluxo.',
    abrirExecucao: 'Abrir a execução',
    vazioFalhas: 'Nenhum fluxo parou com erro nos últimos 7 dias.',
    vazioAndamento: 'Nenhum fluxo em andamento.',
    vazioExecucoes: 'Nenhum fluxo rodou nos últimos 7 dias.',
    aguarda: p => `Aguarda: ${p}`,
    falhouEm: p => `Falhou em: ${p}`,
    ha: t => `Começou ${t}`,
    parado: 'Parado há mais de 2 dias',
    tipos: { approval: 'Aprovação', signature: 'Assinatura', task: 'Tarefa', form: 'Formulário', delay: 'Espera', http: 'Requisição HTTP', email: 'E-mail', ai_agent: 'Agente de IA', crud: 'Item' },
    soQuemAcessa: 'Pede acesso aos fluxos',
    abrirSpaceflow: 'Abrir o Spaceflow',
  },
  agendaW: {
    mais: n => `Mais ${n}`,
    nadaNoDia: 'Nada neste dia.',
    hoje: 'Hoje',
    mesAnterior: 'Mês anterior',
    proximoMes: 'Próximo mês',
  },
  itensW: {
    vazio: 'Nenhum item criado ainda.',
    vazioMeus: 'Você ainda não criou nenhum item.',
    criadoPor: n => `Criado por ${n}`,
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
    kpiAbertas: { titulo: 'Open now', descricao: 'How many tasks are open, with the curve of the last 4 weeks.' },
    kpiConcluidas: { titulo: 'Completed', descricao: 'Tasks completed in the last 4 weeks.' },
    kpiCriadas: { titulo: 'Created', descricao: 'Tasks created in the last 4 weeks.' },
    kpiVencidas: { titulo: 'Overdue', descricao: 'Open tasks past their due date.' },
    kpiVencem7: { titulo: 'Due in 7 days', descricao: 'Open tasks due by the end of the 7th day.' },
    vencidas: { titulo: 'Overdue', descricao: 'The list of overdue tasks, oldest first.' },
    vencemEmBreve: { titulo: 'Due soon', descricao: 'The list of tasks due in the next 7 days.' },
    minhasTarefas: { titulo: 'My tasks', descricao: 'Your quick and scheduled tasks, by due date, with Complete.' },
    tarefasDelegadas: { titulo: 'Tasks I delegated', descricao: 'Quick tasks you created for other people.' },
    status: { titulo: 'Open by status', descricao: 'How the current queue is split.' },
    prioridade: { titulo: 'Priority', descricao: 'Open quick tasks by priority.' },
    carga: { titulo: 'Workload by assignee', descricao: 'Who holds the queue and the overdue tasks.' },
    atividade: { titulo: 'Activity', descricao: 'Completed per day in the last 4 weeks.' },
    saudeDosPrazos: { titulo: 'Due date health', descricao: 'Open tasks by due date status.' },
    entradaESaida: { titulo: 'In and out', descricao: 'Tasks created and completed per week.' },
    categorias: { titulo: 'Categories', descricao: 'Open a category or create an item in it.' },
    atalhos: { titulo: 'Shortcuts', descricao: 'Pinned views, screens and links.' },
    recentes: { titulo: 'Recent', descricao: 'The items and screens you opened last.' },
    agenda: { titulo: 'Today\'s appointments', descricao: 'Today\'s events, task due dates and item dates.' },
    graficoDePainel: { titulo: 'Chart from a dashboard', descricao: 'A panel from a Dashboard screen.' },
    comunicado: { titulo: 'Announcement', descricao: 'A notice from the admin to the whole workspace.' },
    notas: { titulo: 'Notepad', descricao: 'Your notes. Only you can see them.' },
    beni: { titulo: 'BENI', descricao: 'The day summary written by BENI, with a shortcut to the chat with him.' },
    agentesIa: { titulo: 'AI agents', descricao: 'The workspace agents. One click opens the chat with the agent.' },
    execucoesFluxos: { titulo: 'Flow runs', descricao: 'How many runs are running, completed, failed and canceled in the last 7 days.' },
    falhasFluxos: { titulo: 'Flow failures', descricao: 'The flow that stopped with an error, the step, the message and Retry.' },
    fluxosAndamento: { titulo: 'Running flows', descricao: 'The flows that are running, oldest first, with the step they are waiting on.' },
    agendaSemana: { titulo: 'This week', descricao: 'The 7 days starting today, in columns.' },
    agendaMes: { titulo: 'This month', descricao: 'The month calendar. Click a day to see what is on it.' },
    meusItens: { titulo: 'My items', descricao: 'The items you created.' },
    ultimosItens: { titulo: 'Recently created items', descricao: 'The latest items created in the categories you can access.' },
    itensPorCategoria: { titulo: 'Items by category', descricao: 'How many items each category you can access has.' },
  },
  grupos: { tarefas: 'Tasks', agenda: 'Schedule', itens: 'Items and categories', atalhos: 'Screens and shortcuts', ia: 'AI', spaceflow: 'Spaceflow', equipe: 'Team and notes' },

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
    semAcessoTexto: c => `You do not have access to ${c}. Ask the admin or remove the widget.`,
  },

  criar: {
    botao: 'Create',
    dica: 'Create an item or a task (C)',
    placeholder: 'What do you want to create?',
    item: 'Item',
    itemDescricao: 'In a category, through its form',
    tarefa: 'Task',
    tarefaDescricao: 'Quick task, with due date and assignee',
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
    titulo: 'Customizing the Home',
    descricao: 'Drag a widget by its title to move it and pull the corner to resize it.',
    buscar: 'Search widget',
    adicionar: 'Add',
    adicionarOutro: 'Add another',
    jaNaHome: 'On Home',
    subir: n => `Move ${n} up`,
    descer: n => `Move ${n} down`,
    remover: n => `Remove ${n}`,
    restaurar: 'Restore default',
    editando: 'Editing',
    minha: 'My Home',
    padrao: 'Workspace default Home',
    semResultado: 'No widget with that name.',
    catalogoTitulo: 'Add widget',
    catalogoMinha: 'The widget goes to the top of your Home. Nobody else sees the change.',
    catalogoPadrao: 'The widget goes to the default Home and also to the Home of people who already customized it.',
    cancelar: 'Cancel',
    cancelarDica: 'Cancel and discard changes',
    restaurarDica: 'Restore the workspace default Home',
    concluir: 'Done',
    salva: 'Home saved.',
  },

  bannerPadrao: {
    titulo: 'You are editing the workspace default Home',
    texto: 'It applies to everyone who has not customized yet. A widget you add also shows up on the Home of those who already did.',
  },

  config: {
    titulo: w => `Configure ${w}`,
    salvar: 'Save',
    cancelar: 'Cancel',
    categoriasAjuda: 'Check the categories shown in the widget and use the arrows to set their order. With none checked, all the ones you can access show up, in workspace order.',
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

  secoes: { numeros: 'Numbers', listas: 'Lists', graficos: 'Charts' },
  descricaoDosGruposMvp: {
    agenda: "Today's appointments, with task due dates and item dates.",
    itens: 'The workspace categories, with the create item button.',
    atalhos: 'Shortcuts and recently opened screens.',
    ia: 'The workspace agents.',
  },
  descricaoDosGrupos: {
    tarefas: 'Numbers, lists and charts of quick and scheduled tasks.',
    agenda: 'The day, the week and the month, with events, task due dates and item dates.',
    itens: 'Categories and items: the ones you created, the newest and the count by category.',
    atalhos: 'Shortcuts, screens opened last and a chart from a dashboard.',
    ia: 'BENI and the workspace agents.',
    spaceflow: 'Flow runs: the numbers, the failures and what is running.',
    equipe: 'The administrator announcement and the notepad.',
  },
  escopoDeTarefas: { rotulo: 'Whose tasks', minhas: 'My tasks', workspace: 'Workspace' },
  catalogo: {
    voltar: 'Back',
    opcoes: n => n === 1 ? '1 option' : `${n} options`,
    escopoDica: 'Numbers, due lists and charts follow the My tasks or Workspace choice at the top of the Home.',
    categoriasDica: 'Check the categories shown in the widget and use the arrows to set their order.',
    adicionarCategorias: 'Add to Home',
    salvarCategorias: 'Save on Home',
    semCategorias: 'The workspace has no categories yet.',
    marcadas: (n, t) => n === 0 ? `None checked: all ${t} show up, in workspace order.` : `${n} of ${t} checked`,
    resultados: 'Results',
  },
  ordem: { subir: n => `Move ${n} up`, descer: n => `Move ${n} down`, mostrar: n => `Show ${n}`, todas: 'Select all', nenhuma: 'Clear all' },
  laminas: {
    subtitulos: {
      kpiConcluidas: 'Last 4 weeks',
      kpiCriadas: 'Last 4 weeks',
      vencidas: 'Quick and scheduled',
      vencemEmBreve: 'Quick and scheduled',
      status: 'How the current queue is split',
      prioridade: 'Open quick tasks',
      carga: 'Who holds the queue and the overdue tasks',
      atividade: 'Completed per day, last 4 weeks',
      saudeDosPrazos: 'Open now by due date status',
      entradaESaida: 'Created and completed per week',
    },
    dasAbertas: p => `${p}% of open`,
    nadaPorAqui: 'Nothing here',
    semDados: 'No tasks to show.',
    faixas: { haMaisDe7: 'Over 7 days ago', haAte7: 'Up to 7 days ago', em24h: 'Within 24 h', em1a7: 'In 1 to 7 days' },
    venceuHa: d => `overdue by ${d}`,
    em: d => `in ${d}`,
    duracao: (d, h) => d ? (h ? `${d} d ${h} h` : `${d} d`) : `${h} h`,
    semResponsavel: 'Unassigned',
    status: { pending: 'Pending', working: 'In progress', blocked: 'Blocked' },
    abertas: 'open',
    carga: { vencidas: 'Overdue', emDia: 'On track' },
    atividade: {
      diasAtivos: 'Active days',
      sequencia: 'Current streak',
      dias: n => n === 1 ? '1 day' : `${n} days`,
      celula: (d, n) => `${d}: ${n} completed`,
      menos: 'Less',
      mais: 'More',
    },
    entrada: { criadas: 'Created', concluidas: 'Completed', saldo: 'Period balance', semana: d => `Week of ${d}` },
    abrirPainel: 'Open the Tasks dashboard',
  },
  vazios: {
    categoriasTitulo: 'No categories yet',
    categoriasAdmin: 'Create the first category so the team can start recording items.',
    categoriasMembro: 'The admin has not created categories in this workspace yet.',
    criarCategoria: 'Create category',
    comunicado: 'No announcement published.',
    escreverComunicado: 'Write announcement',
    beni: 'BENI sums up the day once there are tasks and items. Meanwhile, BENI helps you set up the workspace.',
    grafico: t => `The ${t} screen has no data yet.`,
  },

  beniChat: {
    titulo: 'BENI AI',
    novaConversa: 'New conversation',
    telaCheia: 'Open in full screen',
    fechar: 'Close the conversation',
    placeholder: 'Describe the item or task you want to create',
    aviso: 'BENI can make mistakes. Check the draft before creating.',
    enviar: 'Send',
    ola: n => `Hello, ${n}. I am BENI.`,
    apresentacao: 'Describe what you need to create, with a due date and an assignee if there are any. I prepare the draft, and you check it before creating.',
    sugestoes: [
      'Create a task for tomorrow at 10:00: call Atria about the renewal',
      'Open an urgent ticket: 3rd floor printer out of paper',
      'New reimbursement of R$ 84,90: taxi to the airport',
      'Set up an Events category',
    ],
    pensando: 'Preparing the draft',
    respostaTarefa: 'I prepared this quick task. Check the fields before creating.',
    respostaItem: c => `I prepared the draft in ${c}. Check the fields before creating.`,
    respostaCategoria: 'I put together a category suggestion. The fields can change later, in the category settings.',
    respostaAjuda: 'I create items and tasks from what you write. Say what it is, when it is due and who it is for. For example:',
    respostaResumo: 'This is the summary for today:',
    rascunho: { tarefa: 'Quick task', item: c => `Item in ${c}`, categoria: 'New category' },
    campos: { nome: 'Name', titulo: 'Title', prazo: 'Due date', responsavel: 'Assignee', prioridade: 'Priority', valor: 'Amount', urgente: 'Urgent', sim: 'Yes', formulario: 'Form', camposSugeridos: 'Suggested fields', nomeDaCategoria: 'Name', semPrazo: 'No due date', semNome: 'No name' },
    camposSugeridos: ['Title', 'Assignee', 'Status', 'Date', 'Attachments'],
    acoes: { criar: 'Create', revisar: 'Review in the form', descartar: 'Discard', montar: 'Set up category' },
    criadaTarefa: r => `Task ${r} created.`,
    criadoItem: r => `Item ${r} created.`,
    revisando: 'Draft opened in the form.',
    descartado: 'Draft discarded.',
    montarToast: 'Mockup: in the product, the category opens in the settings with these fields.',
  },
  beniW: {
    conversar: 'Chat with BENI',
    boasVindas: 'BENI creates items and tasks from what you write and answers questions about the workspace.',
  },
  iaW: {
    agentes: { conversar: n => `Chat with ${n}`, sistema: 'System', revisor: 'Reviewer', gerenciar: 'Manage agents' },
    avisoDoAgente: 'The agent can make mistakes. Check the answer before using it.',
    conversaEmTelaCheia: a => `the chat with ${a} in full screen`,
    ola: n => `Hello, ${n}.`,
    respostaDoAgente: a => `In the product, the ${a} agent answers, with the model and tools set up in it.`,
  },
  spaceflowW: {
    periodo: 'Last 7 days',
    status: { working: 'Running', completed: 'Completed', error: 'Failed', canceled: 'Canceled' },
    sucesso: p => `${p}% of finished runs completed`,
    repetir: 'Retry',
    repetido: 'The step is back in the flow queue.',
    abrirExecucao: 'Open the run',
    vazioFalhas: 'No flow stopped with an error in the last 7 days.',
    vazioAndamento: 'No flows running.',
    vazioExecucoes: 'No flows ran in the last 7 days.',
    aguarda: p => `Waiting: ${p}`,
    falhouEm: p => `Failed at: ${p}`,
    ha: t => `Started ${t}`,
    parado: 'Stuck for more than 2 days',
    tipos: { approval: 'Approval', signature: 'Signature', task: 'Task', form: 'Form', delay: 'Wait', http: 'HTTP request', email: 'Email', ai_agent: 'AI agent', crud: 'Item' },
    soQuemAcessa: 'Requires flow access',
    abrirSpaceflow: 'Open Spaceflow',
  },
  agendaW: {
    mais: n => `${n} more`,
    nadaNoDia: 'Nothing on this day.',
    hoje: 'Today',
    mesAnterior: 'Previous month',
    proximoMes: 'Next month',
  },
  itensW: {
    vazio: 'No items created yet.',
    vazioMeus: 'You have not created any items yet.',
    criadoPor: n => `Created by ${n}`,
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
    kpiAbertas: { titulo: 'Abiertas ahora', descricao: 'Cuántas tareas están abiertas, con la curva de las últimas 4 semanas.' },
    kpiConcluidas: { titulo: 'Completadas', descricao: 'Tareas completadas en las últimas 4 semanas.' },
    kpiCriadas: { titulo: 'Creadas', descricao: 'Tareas creadas en las últimas 4 semanas.' },
    kpiVencidas: { titulo: 'Vencidas', descricao: 'Tareas abiertas con el plazo ya vencido.' },
    kpiVencem7: { titulo: 'Vencen en 7 días', descricao: 'Tareas abiertas que vencen hasta el final del 7.º día.' },
    vencidas: { titulo: 'Vencidas', descricao: 'La lista de tareas vencidas, de las más antiguas a las más recientes.' },
    vencemEmBreve: { titulo: 'Vencen pronto', descricao: 'La lista de tareas que vencen en los próximos 7 días.' },
    minhasTarefas: { titulo: 'Mis tareas', descricao: 'Tus tareas rápidas y programadas, por plazo, con Completar.' },
    tarefasDelegadas: { titulo: 'Tareas que delegué', descricao: 'Tareas rápidas que creaste para otras personas.' },
    status: { titulo: 'Abiertas por estado', descricao: 'Cómo está distribuida la cola actual.' },
    prioridade: { titulo: 'Prioridad', descricao: 'Tareas rápidas abiertas por prioridad.' },
    carga: { titulo: 'Carga por responsable', descricao: 'Quién concentra la cola y las vencidas.' },
    atividade: { titulo: 'Actividad', descricao: 'Completadas por día en las últimas 4 semanas.' },
    saudeDosPrazos: { titulo: 'Salud de los plazos', descricao: 'Tareas abiertas por situación del plazo.' },
    entradaESaida: { titulo: 'Entrada y salida', descricao: 'Tareas creadas y completadas por semana.' },
    categorias: { titulo: 'Categorías', descricao: 'Accede a una categoría o crea un ítem en ella.' },
    atalhos: { titulo: 'Accesos directos', descricao: 'Vistas, pantallas y enlaces fijados.' },
    recentes: { titulo: 'Recientes', descricao: 'Los ítems y las pantallas que abriste por último.' },
    agenda: { titulo: 'Compromisos del día', descricao: 'Compromisos, plazos de tarea y fechas de ítem de hoy.' },
    graficoDePainel: { titulo: 'Gráfico de un panel', descricao: 'Un panel de una pantalla de tipo Dashboard.' },
    comunicado: { titulo: 'Comunicado', descricao: 'Aviso del administrador para todo el workspace.' },
    notas: { titulo: 'Bloc de notas', descricao: 'Tus notas. Solo tú las ves.' },
    beni: { titulo: 'BENI', descricao: 'El resumen del día hecho por el BENI, con el atajo a la conversación con él.' },
    agentesIa: { titulo: 'Agentes de IA', descricao: 'Los agentes del workspace. Un clic abre la conversación con el agente.' },
    execucoesFluxos: { titulo: 'Ejecuciones de los flujos', descricao: 'Cuántas ejecuciones están en curso, concluidas, con error y canceladas en los últimos 7 días.' },
    falhasFluxos: { titulo: 'Fallas en los flujos', descricao: 'El flujo que se detuvo con error, el paso, el mensaje y Reintentar.' },
    fluxosAndamento: { titulo: 'Flujos en curso', descricao: 'Los flujos que se están ejecutando, el más antiguo primero, con el paso en que esperan.' },
    agendaSemana: { titulo: 'Agenda de la semana', descricao: 'Los 7 días a partir de hoy, en columnas.' },
    agendaMes: { titulo: 'Agenda del mes', descricao: 'El calendario del mes. Haz clic en un día para ver lo que hay.' },
    meusItens: { titulo: 'Mis ítems', descricao: 'Los ítems que creaste.' },
    ultimosItens: { titulo: 'Ítems creados recientemente', descricao: 'Los últimos ítems creados en las categorías a las que accedes.' },
    itensPorCategoria: { titulo: 'Ítems por categoría', descricao: 'Cuántos ítems hay en cada categoría a la que accedes.' },
  },
  grupos: { tarefas: 'Tareas', agenda: 'Agenda', itens: 'Ítems y categorías', atalhos: 'Pantallas y accesos', ia: 'IA', spaceflow: 'Spaceflow', equipe: 'Equipo y notas' },

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
    semAcessoTexto: c => `No tienes acceso a ${c}. Pídelo al administrador o quita el widget.`,
  },

  criar: {
    botao: 'Crear',
    dica: 'Crear ítem o tarea (C)',
    placeholder: '¿Qué quieres crear?',
    item: 'Ítem',
    itemDescricao: 'En una categoría, con su formulario',
    tarefa: 'Tarea',
    tarefaDescricao: 'Tarea rápida, con plazo y responsable',
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
    titulo: 'Personalizando el Inicio',
    descricao: 'Arrastra el widget por el título para moverlo y tira de la esquina para cambiar el tamaño.',
    buscar: 'Buscar widget',
    adicionar: 'Agregar',
    adicionarOutro: 'Agregar otro',
    jaNaHome: 'En el Inicio',
    subir: n => `Subir ${n}`,
    descer: n => `Bajar ${n}`,
    remover: n => `Quitar ${n}`,
    restaurar: 'Restaurar predeterminado',
    editando: 'Editando',
    minha: 'Mi Inicio',
    padrao: 'Inicio predeterminado del workspace',
    semResultado: 'Ningún widget con ese nombre.',
    catalogoTitulo: 'Agregar widget',
    catalogoMinha: 'El widget entra arriba en tu Inicio. Nadie más ve el cambio.',
    catalogoPadrao: 'El widget entra en el Inicio predeterminado y también en el de quien ya lo personalizó.',
    cancelar: 'Cancelar',
    cancelarDica: 'Cancelar y descartar los cambios',
    restaurarDica: 'Restaurar la Home predeterminada del workspace',
    concluir: 'Listo',
    salva: 'Inicio guardado.',
  },

  bannerPadrao: {
    titulo: 'Estás editando el Inicio predeterminado del workspace',
    texto: 'Vale para quien aún no personalizó. El widget que agregues aparece también en el Inicio de quien ya personalizó.',
  },

  config: {
    titulo: w => `Configurar ${w}`,
    salvar: 'Guardar',
    cancelar: 'Cancelar',
    categoriasAjuda: 'Marca las categorías que aparecen en el widget y usa las flechas para definir el orden. Sin ninguna marcada, aparecen todas a las que tienes acceso, en el orden del workspace.',
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

  secoes: { numeros: 'Números', listas: 'Listas', graficos: 'Gráficos' },
  descricaoDosGruposMvp: {
    agenda: 'Los compromisos del día, con los plazos de tarea y las fechas de ítem.',
    itens: 'Las categorías del workspace, con el botón de crear ítem.',
    atalhos: 'Atajos y pantallas abiertas por último.',
    ia: 'Los agentes del workspace.',
  },
  descricaoDosGrupos: {
    tarefas: 'Números, listas y gráficos de las tareas rápidas y programadas.',
    agenda: 'El día, la semana y el mes, con compromisos, plazos de tarea y fechas de ítem.',
    itens: 'Las categorías y los ítems: los que creaste, los más nuevos y el conteo por categoría.',
    atalhos: 'Accesos directos, pantallas abiertas por último y el gráfico de un panel.',
    ia: 'El BENI y los agentes del workspace.',
    spaceflow: 'Las ejecuciones de los flujos: los números, las fallas y lo que está en curso.',
    equipe: 'El comunicado del administrador y el bloc de notas.',
  },
  escopoDeTarefas: { rotulo: 'De quién son las tareas', minhas: 'Mis tareas', workspace: 'Workspace' },
  catalogo: {
    voltar: 'Volver',
    opcoes: n => n === 1 ? '1 opción' : `${n} opciones`,
    escopoDica: 'Los números, las listas de plazo y los gráficos siguen la opción Mis tareas o Workspace de la parte superior del Inicio.',
    categoriasDica: 'Marca las categorías que aparecen en el widget y usa las flechas para definir el orden.',
    adicionarCategorias: 'Agregar al Inicio',
    salvarCategorias: 'Guardar en el Inicio',
    semCategorias: 'El workspace aún no tiene categorías.',
    marcadas: (n, t) => n === 0 ? `Ninguna marcada: aparecen las ${t}, en el orden del workspace.` : `${n} de ${t} marcadas`,
    resultados: 'Resultados',
  },
  ordem: { subir: n => `Subir ${n}`, descer: n => `Bajar ${n}`, mostrar: n => `Mostrar ${n}`, todas: 'Marcar todas', nenhuma: 'Desmarcar todas' },
  laminas: {
    subtitulos: {
      kpiConcluidas: 'Últimas 4 semanas',
      kpiCriadas: 'Últimas 4 semanas',
      vencidas: 'Rápidas y programadas',
      vencemEmBreve: 'Rápidas y programadas',
      status: 'Cómo está distribuida la cola actual',
      prioridade: 'Tareas rápidas abiertas',
      carga: 'Quién concentra la cola y las vencidas',
      atividade: 'Completadas por día, últimas 4 semanas',
      saudeDosPrazos: 'Abiertas ahora por situación del plazo',
      entradaESaida: 'Creadas y completadas por semana',
    },
    dasAbertas: p => `${p}% de las abiertas`,
    nadaPorAqui: 'Nada por aquí',
    semDados: 'No hay tareas para mostrar.',
    faixas: { haMaisDe7: 'Hace más de 7 días', haAte7: 'Hace hasta 7 días', em24h: 'En hasta 24 h', em1a7: 'En 1 a 7 días' },
    venceuHa: d => `venció hace ${d}`,
    em: d => `en ${d}`,
    duracao: (d, h) => d ? (h ? `${d} d ${h} h` : `${d} d`) : `${h} h`,
    semResponsavel: 'Sin responsable',
    status: { pending: 'Pendiente', working: 'En curso', blocked: 'Bloqueada' },
    abertas: 'abiertas',
    carga: { vencidas: 'Vencidas', emDia: 'Al día' },
    atividade: {
      diasAtivos: 'Días activos',
      sequencia: 'Racha actual',
      dias: n => n === 1 ? '1 día' : `${n} días`,
      celula: (d, n) => `${d}: ${n} ${n === 1 ? 'completada' : 'completadas'}`,
      menos: 'Menos',
      mais: 'Más',
    },
    entrada: { criadas: 'Creadas', concluidas: 'Completadas', saldo: 'Saldo del período', semana: d => `Semana del ${d}` },
    abrirPainel: 'Abrir el Panel de tareas',
  },
  vazios: {
    categoriasTitulo: 'Aún no hay categorías',
    categoriasAdmin: 'Crea la primera categoría para que el equipo empiece a registrar ítems.',
    categoriasMembro: 'El administrador aún no creó categorías en este workspace.',
    criarCategoria: 'Crear categoría',
    comunicado: 'No hay comunicados publicados.',
    escreverComunicado: 'Escribir comunicado',
    beni: 'El BENI resume el día cuando haya tareas e ítems. Mientras tanto, ayuda a montar el workspace.',
    grafico: t => `La pantalla ${t} aún no tiene datos.`,
  },

  beniChat: {
    titulo: 'BENI AI',
    novaConversa: 'Nueva conversación',
    telaCheia: 'Abrir en pantalla completa',
    fechar: 'Cerrar la conversación',
    placeholder: 'Describe el ítem o la tarea que quieres crear',
    aviso: 'El BENI puede equivocarse. Revisa el borrador antes de crear.',
    enviar: 'Enviar',
    ola: n => `Hola, ${n}. Soy el BENI.`,
    apresentacao: 'Describe lo que necesitas crear, con plazo y responsable si los hay. Preparo el borrador, y lo revisas antes de crear.',
    sugestoes: [
      'Crear una tarea para mañana a las 10h: llamar a Atria sobre la renovación',
      'Abrir un ticket urgente: impresora del 3er piso sin papel',
      'Nuevo reembolso de R$ 84,90: taxi al aeropuerto',
      'Montar una categoría de Eventos',
    ],
    pensando: 'Preparando el borrador',
    respostaTarefa: 'Preparé esta tarea rápida. Revisa los campos antes de crear.',
    respostaItem: c => `Preparé el borrador en ${c}. Revisa los campos antes de crear.`,
    respostaCategoria: 'Armé una sugerencia de categoría. Los campos pueden cambiar después, en la configuración de la categoría.',
    respostaAjuda: 'Creo ítems y tareas a partir de lo que escribas. Di qué es, para cuándo y para quién. Por ejemplo:',
    respostaResumo: 'Este es el resumen de hoy:',
    rascunho: { tarefa: 'Tarea rápida', item: c => `Ítem en ${c}`, categoria: 'Nueva categoría' },
    campos: { nome: 'Nombre', titulo: 'Título', prazo: 'Fecha límite', responsavel: 'Responsable', prioridade: 'Prioridad', valor: 'Valor', urgente: 'Urgente', sim: 'Sí', formulario: 'Formulario', camposSugeridos: 'Campos sugeridos', nomeDaCategoria: 'Nombre', semPrazo: 'Sin plazo', semNome: 'Sin nombre' },
    camposSugeridos: ['Título', 'Responsable', 'Estado', 'Fecha', 'Adjuntos'],
    acoes: { criar: 'Crear', revisar: 'Revisar en el formulario', descartar: 'Descartar', montar: 'Montar categoría' },
    criadaTarefa: r => `Tarea ${r} creada.`,
    criadoItem: r => `Ítem ${r} creado.`,
    revisando: 'Borrador abierto en el formulario.',
    descartado: 'Borrador descartado.',
    montarToast: 'Maqueta: en el producto, la categoría se abre en la configuración con estos campos.',
  },
  beniW: {
    conversar: 'Conversar con el BENI',
    boasVindas: 'El BENI crea ítems y tareas a partir de lo que escribas y responde dudas sobre el workspace.',
  },
  iaW: {
    agentes: { conversar: n => `Conversar con ${n}`, sistema: 'Del sistema', revisor: 'Revisor', gerenciar: 'Administrar agentes' },
    avisoDoAgente: 'El agente puede equivocarse. Revisa la respuesta antes de usarla.',
    conversaEmTelaCheia: a => `la conversación con ${a === 'BENI' ? 'el BENI' : a} en pantalla completa`,
    ola: n => `Hola, ${n}.`,
    respostaDoAgente: a => `En el producto, responde el agente ${a}, con el modelo y las herramientas configurados en él.`,
  },
  spaceflowW: {
    periodo: 'Últimos 7 días',
    status: { working: 'En curso', completed: 'Concluidas', error: 'Con error', canceled: 'Canceladas' },
    sucesso: p => `${p}% de las ejecuciones terminadas se concluyeron`,
    repetir: 'Reintentar',
    repetido: 'El paso volvió a la cola del flujo.',
    abrirExecucao: 'Abrir la ejecución',
    vazioFalhas: 'Ningún flujo se detuvo con error en los últimos 7 días.',
    vazioAndamento: 'Ningún flujo en curso.',
    vazioExecucoes: 'Ningún flujo se ejecutó en los últimos 7 días.',
    aguarda: p => `Espera: ${p}`,
    falhouEm: p => `Falló en: ${p}`,
    ha: t => `Comenzó ${t}`,
    parado: 'Detenido hace más de 2 días',
    tipos: { approval: 'Aprobación', signature: 'Firma', task: 'Tarea', form: 'Formulario', delay: 'Espera', http: 'Solicitud HTTP', email: 'Correo', ai_agent: 'Agente de IA', crud: 'Ítem' },
    soQuemAcessa: 'Requiere acceso a los flujos',
    abrirSpaceflow: 'Abrir el Spaceflow',
  },
  agendaW: {
    mais: n => `${n} más`,
    nadaNoDia: 'Nada en este día.',
    hoje: 'Hoy',
    mesAnterior: 'Mes anterior',
    proximoMes: 'Mes siguiente',
  },
  itensW: {
    vazio: 'Aún no hay ítems creados.',
    vazioMeus: 'Aún no has creado ningún ítem.',
    criadoPor: n => `Creado por ${n}`,
  },
  ehMaquete: 'Maqueta',
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': ptBR, en, es }
