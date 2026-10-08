/**
 * A copy desta tela, nos três idiomas do ENSPACE.
 *
 * A casca usa os rótulos do develop (08/10/2026). O campo, o editor, as
 * versões e o Word são a PROPOSTA.
 *
 * Nenhum texto daqui leva travessão. Regra 33.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Editor, OrigemDaVersao, StatusDoContrato } from './mocks'

export type EstadoDaTela = 'normal' | 'carregando' | 'erro' | 'somenteLeitura'

export interface Textos {
  casca: {
    menuLateral: string
    buscar: string
    membro: string
    configuracoes: string
    ajuda: string
    recolherMenu: string
    abrirMenu: string
    voltar: string
    avancar: string
    recarregar: string
    trilha: string
    trilhaCategorias: string
    idioma: string
    tema: string
    suporte: string
    notificacoes: string
    conta: string
    lab: string
    itens: Record<string, string>
  }

  lista: {
    abaItens: string
    abaVisualizar: string
    pesquisar: string
    criadoEm: string
    todoPeriodo: string
    novoRegistro: string
    referencia: string
    status: string
    contratante: string
    valor: string
    acoes: string
    verDetalhes: string
    editar: string
    lixeira: string
    copiarLink: string
    mostrando: (de: number, ate: number, total: number) => string
    nadaEncontrado: string
    semDocumento: string
  }

  statusDoContrato: Record<StatusDoContrato, string>

  item: {
    visaoGeral: string
    comentarios: string
    logs: string
    tarefas: string
    anexos: string
    alteracoesNaoSalvas: string
    tudoSalvo: string
    sairSemSalvar: string
    salvar: string
    salvo: string
    fechar: string
    objeto: string
    vigencia: string
    meses: (n: number) => string
    responsavel: string
  }

  campo: {
    vazioTitulo: string
    vazioDescricao: string
    soltarAqui: string
    usarModelo: string
    emBranco: string
    enviarArquivo: string
    formatosAceitos: string
    modelosDaCategoria: string
    preencheCom: (campos: string) => string
    semModelos: string
    previaDoModelo: string
    criarDocumento: string
    voltarAosModelos: string
    gerando: string
    gerandoDetalhe: string
    criandoEmBranco: string
    enviando: (nome: string) => string
    criado: string
    criadoDescricao: (origem: string) => string
    arquivoRecusado: string
    arquivoRecusadoDetalhe: string

    versaoN: (n: number) => string
    editadoPor: (quem: string, quando: string) => string
    abrir: string
    abrirNo: Record<Editor, string>
    descricaoDoEditor: Record<Editor, string>
    padrao: string
    definirComoPadrao: string
    ler: string
    versoes: string
    maisAcoes: string
    baixarDocx: string
    baixarPdf: string
    substituir: string
    renomear: string
    remover: string
    pdfSoLeitura: string

    abertoPorVoceNoWord: (desde: string) => string
    abertoPorVoceNoWordDetalhe: string
    voltarAoWord: string
    liberar: string
    abertoPorOutraNoWord: (quem: string, desde: string) => string
    abertoPorOutraNoWordDetalhe: string
    editandoAgoraNoEnspace: (quem: string) => string
    editarJunto: string
    avisarQuandoLiberar: string
    avisoAgendado: (quem: string) => string

    carregando: string
    erroTitulo: string
    erroDescricao: string
    tentarDeNovo: string
    semPermissaoTitulo: string
    semPermissaoDescricao: string

    removerTitulo: string
    removerDescricao: (nome: string, versoes: number) => string
    cancelar: string
    removerConfirmar: string
    removido: string
    liberado: string
  }

  escolha: {
    titulo: string
    descricao: string
    lembrar: string
    lembrarAjuda: string
    continuar: string
    recomendadoPara: Record<'onlyoffice' | 'word', string>
    nomes: Record<'onlyoffice' | 'word', string>
    detalhes: Record<'onlyoffice' | 'word', string>
    ondeAbrirWord: string
    wordDesktopAjuda: string
    wordWebAjuda: string
  }

  editor: {
    voltarAoItem: string
    salvando: string
    salvoAgora: string
    salvoHa: (quando: string) => string
    offline: string
    editandoJunto: string
    versoes: string
    abrirNoWord: string
    baixar: string
    concluir: string
    concluindo: string
    versaoSalva: (n: number) => string
    areaDoOnlyoffice: string
    barra: string[]
    escHint: string
  }

  versoes: {
    titulo: string
    descricao: string
    atual: string
    origem: Record<OrigemDaVersao, string>
    restauradaDe: (n: number) => string
    ver: string
    restaurar: string
    baixar: string
    restauradaToast: (de: number, nova: number) => string
    restaurarTitulo: (n: number) => string
    restaurarDescricao: (n: number, nova: number) => string
    restaurarConfirmar: string
    hoje: string
    ontem: string
  }

  word: {
    titulo: Record<'word-desktop' | 'word-web', string>
    descricao: Record<'word-desktop' | 'word-web', string>
    passoReservar: string
    passoReservarDetalhe: string
    passoAbrir: string
    passoAbrirDetalhe: Record<'word-desktop' | 'word-web', string>
    passoSalvar: string
    passoSalvarDetalhe: Record<'word-desktop' | 'word-web', string>
    reservado: string
    abrindo: string
    abertoToast: string
    abrirJanela: string
    fechar: string
    naoAbriu: string
    naoAbriuDetalhe: string
    baixarArquivo: string
    baixadoToast: string
    dicaSuplemento: string
    notaPrototipo: string
    abrirDeNovo: string
    instalarSuplemento: string
    ocupadoTitulo: (quem: string) => string
    ocupadoDescricao: string
    recebidoToast: (n: number) => string
  }

  janela: {
    aviso: string
    tituloDoApp: string
    salvoNaBarra: (hora: string) => string
    naoSalvoNaBarra: string
    salvarAtalho: string
    painel: string
    abas: string[]
    vinculado: string
    item: string
    campo: string
    versaoAberta: (n: number) => string
    alteracoesPendentes: string
    semAlteracoes: string
    salvarNoEnspace: string
    salvandoNoEnspace: string
    salvoNoEnspace: (n: number, hora: string) => string
    fecharELiberar: string
    abrirItem: string
    dicaDigitar: string
    semPainel: string
    copiaBaixada: string
  }

  config: {
    titulo: string
    descricao: string
    abas: string[]
    nome: string
    rotulo: string
    referencia: string
    tipo: string
    tipoValor: string
    secaoEditores: string
    secaoEditoresAjuda: string
    onlyoffice: string
    onlyofficeAjuda: string
    word: string
    wordAjuda: string
    wordWeb: string
    wordWebAjuda: string
    editorPadrao: string
    editorPadraoAjuda: string
    cadaPessoaEscolhe: string
    secaoCriar: string
    secaoCriarAjuda: string
    modelos: string
    modelosAjuda: (n: number) => string
    branco: string
    enviarDocx: string
    enviarPdf: string
    secaoEditar: string
    secaoEditarAjuda: string
    editar: string
    comentar: string
    acompanhar: string
    revisao: string
    painelRevisao: string
    chat: string
    preVisualizacao: string
    salvar: string
    salvo: string
  }

  andaime: {
    titulo: string
    estado: string
    estados: Record<EstadoDaTela, string>
    suplemento: string
    configuracao: string
    wordDeVerdade: string
    reiniciar: string
    dica: string
    oQueMuda: string
  }

  tempo: {
    agora: string
    minutos: (n: number) => string
    horas: (n: number) => string
    dias: (n: number) => string
    as: (hora: string) => string
  }
}

const pt: Textos = {
  casca: {
    menuLateral: 'Menu lateral',
    buscar: 'Buscar...',
    membro: 'Membro',
    configuracoes: 'Configurações',
    ajuda: 'Ajuda',
    recolherMenu: 'Recolher menu',
    abrirMenu: 'Abrir menu',
    voltar: 'Voltar',
    avancar: 'Avançar',
    recarregar: 'Recarregar',
    trilha: 'Trilha',
    trilhaCategorias: 'Categorias',
    idioma: 'Idioma',
    tema: 'Tema',
    suporte: 'Suporte',
    notificacoes: 'Notificações',
    conta: 'Conta',
    lab: 'Lab',
    itens: {
      inicio: 'Início',
      spaceflows: 'Spaceflows',
      categorias: 'Categorias',
      contratos: 'Contratos',
      todos: 'Todos',
      formNovo: 'Novo contrato',
      formAditivo: 'Aditivo',
      tarefas: 'Tarefas',
      agenda: 'Agenda',
      knowledge: 'Knowledge',
      visaoGeral: 'Visão Geral',
      sistema: 'Sistema',
      estrutura: 'Estrutura',
      gestaoDeMembros: 'Gestão de Membros',
      interface: 'Interface',
      emails: 'E-mails',
      integracoes: 'Integrações',
      agentesDeIa: 'Agentes de IA',
      logs: 'Logs',
      credenciais: 'Credenciais',
      releases: 'Releases',
      documentacao: 'Documentação',
    },
  },

  lista: {
    abaItens: 'Itens',
    abaVisualizar: 'Visualizar',
    pesquisar: 'Pesquisar registros',
    criadoEm: 'Criado em',
    todoPeriodo: 'Todo o período',
    novoRegistro: 'Novo registro',
    referencia: 'Referência',
    status: 'Status',
    contratante: 'Contratante',
    valor: 'Valor',
    acoes: 'Ações',
    verDetalhes: 'Ver Detalhes',
    editar: 'Editar',
    lixeira: 'Enviar para Lixeira',
    copiarLink: 'Copiar Link',
    mostrando: (de, ate, total) => `Mostrando ${de} a ${ate} de ${total} resultados`,
    nadaEncontrado: 'Nenhum resultado encontrado',
    semDocumento: 'Sem documento',
  },

  statusDoContrato: {
    'rascunho': 'Rascunho',
    'em-revisao': 'Em revisão',
    'aguardando-assinatura': 'Aguardando assinatura',
    'assinado': 'Assinado',
  },

  item: {
    visaoGeral: 'Visão Geral',
    comentarios: 'Comentários',
    logs: 'Logs de Auditoria',
    tarefas: 'Tarefas',
    anexos: 'Anexos',
    alteracoesNaoSalvas: 'Alterações não salvas',
    tudoSalvo: 'Tudo salvo',
    sairSemSalvar: 'Sair sem salvar',
    salvar: 'Salvar',
    salvo: 'Item atualizado com sucesso.',
    fechar: 'Fechar',
    objeto: 'Objeto',
    vigencia: 'Vigência',
    meses: n => `${n} ${n === 1 ? 'mês' : 'meses'}`,
    responsavel: 'Responsável',
  },

  campo: {
    vazioTitulo: 'Nenhum documento ainda',
    vazioDescricao: 'Comece por um modelo da categoria, por um documento em branco ou envie o seu.',
    soltarAqui: 'Solte o arquivo para enviar',
    usarModelo: 'Usar modelo',
    emBranco: 'Em branco',
    enviarArquivo: 'Enviar arquivo',
    formatosAceitos: '.docx ou .pdf, até 50 MB. Você também pode arrastar o arquivo para cá.',
    modelosDaCategoria: 'Modelos da categoria',
    preencheCom: campos => `Preenche ${campos}`,
    semModelos: 'Esta categoria ainda não tem modelos.',
    previaDoModelo: 'Prévia com os dados deste item',
    criarDocumento: 'Criar documento',
    voltarAosModelos: 'Modelos',
    gerando: 'Gerando o documento',
    gerandoDetalhe: 'Preenchendo o modelo com os dados deste item.',
    criandoEmBranco: 'Criando o documento em branco',
    enviando: nome => `Enviando ${nome}`,
    criado: 'Documento criado',
    criadoDescricao: origem => `Versão 1, ${origem}.`,
    arquivoRecusado: 'Este arquivo não pode ser usado',
    arquivoRecusadoDetalhe: 'Envie um arquivo .docx ou .pdf.',

    versaoN: n => `Versão ${n}`,
    editadoPor: (quem, quando) => `${quem}, ${quando}`,
    abrir: 'Abrir',
    abrirNo: {
      'onlyoffice': 'Abrir no ENSPACE',
      'word-desktop': 'Abrir no Word',
      'word-web': 'Abrir no Word para a web',
    },
    descricaoDoEditor: {
      'onlyoffice': 'ONLYOFFICE, aqui no navegador',
      'word-desktop': 'Word instalado no computador',
      'word-web': 'Word no navegador, com Microsoft 365',
    },
    padrao: 'Padrão',
    definirComoPadrao: 'Usar sempre este',
    ler: 'Ler',
    versoes: 'Versões',
    maisAcoes: 'Mais ações',
    baixarDocx: 'Baixar .docx',
    baixarPdf: 'Baixar como PDF',
    substituir: 'Substituir por outro arquivo',
    renomear: 'Renomear',
    remover: 'Remover documento',
    pdfSoLeitura: 'PDF não se edita. Para mudar, substitua o arquivo.',

    abertoPorVoceNoWord: desde => `Você está com este documento aberto no Word desde ${desde}.`,
    abertoPorVoceNoWordDetalhe: 'Cada Salvar do Word vira uma versão aqui. Feche o documento no Word para liberar. Enquanto isso, as outras pessoas só leem.',
    voltarAoWord: 'Voltar ao Word',
    liberar: 'Liberar sem salvar',
    abertoPorOutraNoWord: (quem, desde) => `${quem} está editando no Word desde ${desde}.`,
    abertoPorOutraNoWordDetalhe: 'Você pode ler a versão atual. A edição volta quando o documento for liberado.',
    editandoAgoraNoEnspace: quem => `${quem} está editando agora`,
    editarJunto: 'Editar junto',
    avisarQuandoLiberar: 'Avisar quando liberar',
    avisoAgendado: quem => `Você recebe um aviso quando ${quem} liberar o documento.`,

    carregando: 'Carregando o documento',
    erroTitulo: 'Não foi possível carregar o documento',
    erroDescricao: 'O arquivo continua guardado. Tente de novo em alguns segundos.',
    tentarDeNovo: 'Tentar de novo',
    semPermissaoTitulo: 'Somente leitura',
    semPermissaoDescricao: 'Seu perfil pode ler este documento, mas não editar.',

    removerTitulo: 'Remover o documento?',
    removerDescricao: (nome, versoes) => `${nome} e as ${versoes} versões saem deste item. O campo fica vazio.`,
    cancelar: 'Cancelar',
    removerConfirmar: 'Remover',
    removido: 'Documento removido',
    liberado: 'Documento liberado. As mudanças feitas no Word não foram trazidas.',
  },

  escolha: {
    titulo: 'Onde você quer abrir?',
    descricao: 'Os dois editores trabalham no mesmo arquivo. O que você salvar volta para este item.',
    lembrar: 'Lembrar minha escolha',
    lembrarAjuda: 'Você troca quando quiser, pela seta ao lado do botão Abrir.',
    continuar: 'Abrir',
    recomendadoPara: {
      onlyoffice: 'Bom para revisões rápidas e para editar junto',
      word: 'Bom para documentos longos e formatação fina',
    },
    nomes: {
      onlyoffice: 'No ENSPACE',
      word: 'No Microsoft Word',
    },
    detalhes: {
      onlyoffice: 'Abre aqui, no navegador, com o ONLYOFFICE. Salva sozinho e mostra quem está editando.',
      word: 'Abre no Word do seu computador, direto do item. O Salvar do Word grava aqui, e o documento fica reservado para você.',
    },
    ondeAbrirWord: 'Qual Word?',
    wordDesktopAjuda: 'Windows ou Mac',
    wordWebAjuda: 'Precisa de conta Microsoft 365',
  },

  editor: {
    voltarAoItem: 'Voltar ao item',
    salvando: 'Salvando',
    salvoAgora: 'Salvo agora',
    salvoHa: quando => `Salvo ${quando}`,
    offline: 'Sem conexão. Suas mudanças ficam guardadas aqui.',
    editandoJunto: 'Editando agora',
    versoes: 'Versões',
    abrirNoWord: 'Abrir no Word',
    baixar: 'Baixar',
    concluir: 'Concluir',
    concluindo: 'Salvando',
    versaoSalva: n => `Versão ${n} salva`,
    areaDoOnlyoffice: 'Área do ONLYOFFICE (maquete): clique no texto e digite para ver o salvamento.',
    barra: ['Arquivo', 'Página Inicial', 'Inserir', 'Layout', 'Referências', 'Colaboração'],
    escHint: 'Esc fecha só o que está por cima. O editor fecha pelo Concluir.',
  },

  versoes: {
    titulo: 'Versões',
    descricao: 'Cada vez que alguém conclui uma edição, nasce uma versão.',
    atual: 'Atual',
    origem: {
      modelo: 'Gerada do modelo',
      branco: 'Criada em branco',
      envio: 'Arquivo enviado',
      onlyoffice: 'Editada no ENSPACE',
      word: 'Editada no Word',
      restauracao: 'Restaurada',
    },
    restauradaDe: n => `Restaurada da versão ${n}`,
    ver: 'Ver',
    restaurar: 'Restaurar',
    baixar: 'Baixar',
    restauradaToast: (de, nova) => `Versão ${de} restaurada como versão ${nova}`,
    restaurarTitulo: n => `Restaurar a versão ${n}?`,
    restaurarDescricao: (n, nova) => `O conteúdo da versão ${n} vira a versão ${nova}. Nenhuma versão é apagada.`,
    restaurarConfirmar: 'Restaurar',
    hoje: 'Hoje',
    ontem: 'Ontem',
  },

  word: {
    titulo: {
      'word-desktop': 'Abrir no Word',
      'word-web': 'Abrir no Word para a web',
    },
    descricao: {
      'word-desktop': 'O documento abre no Word do seu computador, direto deste item. O Salvar do Word grava aqui.',
      'word-web': 'O documento abre no Word para a web, numa nova aba. Ao concluir, ele volta para este item.',
    },
    passoReservar: 'Reservar para você',
    passoReservarDetalhe: 'Enquanto você edita no Word, as outras pessoas só leem. Assim ninguém sobrescreve ninguém.',
    passoAbrir: 'Abrir no Word',
    passoAbrirDetalhe: {
      'word-desktop': 'O Word do computador abre o arquivo que está neste item. Nada é baixado.',
      'word-web': 'Uma cópia vai para o seu OneDrive enquanto você edita.',
    },
    passoSalvar: 'Salvar no Word',
    passoSalvarDetalhe: {
      'word-desktop': 'Cada Salvar (Ctrl+S) vira uma versão neste item. Fechou o documento, ele fica livre.',
      'word-web': 'Ao concluir, a cópia volta para este item como nova versão e sai do OneDrive.',
    },
    reservado: 'Reservado para você',
    abrindo: 'Abrindo no Word',
    abertoToast: 'Documento aberto no Word',
    abrirJanela: 'Ver o painel do ENSPACE (maquete)',
    fechar: 'Fechar',
    naoAbriu: 'O Word não abriu?',
    naoAbriuDetalhe: 'Baixe o arquivo ligado ao item. No Word, o painel do ENSPACE reconhece o item e envia o documento de volta.',
    baixarArquivo: 'Baixar o arquivo ligado ao item',
    baixadoToast: 'Arquivo baixado. No Word, use Salvar no ENSPACE, no painel.',
    dicaSuplemento: 'Com o suplemento do ENSPACE no Word, o painel mostra a qual item o documento pertence.',
    notaPrototipo: 'Protótipo: o Word do seu computador abriu o arquivo direto do endereço do protótipo, sem baixar. Como aqui não há servidor, ele abre em leitura e não salva de volta. No ENSPACE, o endpoint WebDAV faz o Ctrl+S gravar no item.',
    abrirDeNovo: 'Abrir no Word de novo',
    instalarSuplemento: 'Como instalar',
    ocupadoTitulo: quem => `${quem} está editando no ENSPACE agora`,
    ocupadoDescricao: 'Para abrir no Word, o documento precisa estar livre. Edite junto no ENSPACE ou espere a pessoa concluir.',
    recebidoToast: n => `Versão ${n} recebida do Word`,
  },

  janela: {
    aviso: 'Maquete do Word com o painel do ENSPACE. A janela do Word não é proposta; o painel e o salvamento no item são.',
    tituloDoApp: 'Word',
    salvoNaBarra: hora => `Salvo no ENSPACE às ${hora}`,
    naoSalvoNaBarra: 'Mudanças não salvas',
    salvarAtalho: 'Salvar (Ctrl+S)',
    painel: 'ENSPACE',
    abas: ['Documento', 'Assistentes (IA)', 'Templates'],
    vinculado: 'Ligado a um item',
    item: 'Item',
    campo: 'Campo',
    versaoAberta: n => `Você abriu a versão ${n}`,
    alteracoesPendentes: 'Mudanças ainda não salvas no item',
    semAlteracoes: 'Tudo salvo no item',
    salvarNoEnspace: 'Salvar no ENSPACE',
    salvandoNoEnspace: 'Salvando',
    salvoNoEnspace: (n, hora) => `Versão ${n} salva às ${hora}`,
    fecharELiberar: 'Concluir e liberar',
    abrirItem: 'Ver o item no ENSPACE',
    dicaDigitar: 'Digite no documento para criar uma mudança.',
    semPainel: 'Sem o suplemento, o Salvar do Word grava no item do mesmo jeito. Só falta o painel.',
    copiaBaixada: 'Cópia baixada: o Salvar do Word grava no computador. Use Salvar no ENSPACE.',
  },

  config: {
    titulo: 'Campo: Minuta do contrato',
    descricao: 'Configurações › Categorias › Contratos › Campos',
    abas: ['Definição', 'Visual', 'Regras e Condições', 'Eventos de Campo', 'Ajuda'],
    nome: 'Nome do campo',
    rotulo: 'Rótulo Visível (Label)',
    referencia: 'Referência técnica',
    tipo: 'Tipo de Campo',
    tipoValor: 'Editor de Documentos',
    secaoEditores: 'Onde o documento abre',
    secaoEditoresAjuda: 'Quem usa o campo escolhe entre os editores ligados aqui.',
    onlyoffice: 'ENSPACE (ONLYOFFICE)',
    onlyofficeAjuda: 'No navegador, sem instalar nada. Permite editar junto.',
    word: 'Microsoft Word',
    wordAjuda: 'O Word instalado no computador (Windows ou Mac) abre o arquivo do item. Uma pessoa edita por vez.',
    wordWeb: 'Word para a web (fase 2)',
    wordWebAjuda: 'Precisa de Microsoft 365 da empresa. Uma cópia fica no OneDrive de quem edita até concluir.',
    editorPadrao: 'Editor padrão',
    editorPadraoAjuda: 'O que o botão Abrir usa para quem ainda não escolheu.',
    cadaPessoaEscolhe: 'Perguntar na primeira vez',
    secaoCriar: 'Como o documento nasce',
    secaoCriarAjuda: 'As opções que aparecem no campo vazio.',
    modelos: 'Modelos da categoria',
    modelosAjuda: n => `${n} modelos em Templates de Documento`,
    branco: 'Documento em branco',
    enviarDocx: 'Enviar arquivo .docx',
    enviarPdf: 'Enviar arquivo .pdf',
    secaoEditar: 'O que se faz no editor',
    secaoEditarAjuda: 'Vale para o ONLYOFFICE. No Word, quem decide é o próprio Word.',
    editar: 'Editar',
    comentar: 'Comentar',
    acompanhar: 'Acompanhar mudanças',
    revisao: 'Revisão',
    painelRevisao: 'Mostrar painel de revisão',
    chat: 'Chat',
    preVisualizacao: 'Pré-visualização do campo',
    salvar: 'Salvar',
    salvo: 'Campo salvo',
  },

  andaime: {
    titulo: 'Protótipo',
    estado: 'Estado',
    estados: {
      normal: 'Normal',
      carregando: 'Carregando',
      erro: 'Erro',
      somenteLeitura: 'Só leitura',
    },
    suplemento: 'Suplemento no Word',
    configuracao: 'Configuração do campo',
    wordDeVerdade: 'Abrir o Word de verdade',
    reiniciar: 'Recomeçar',
    dica: 'Cada contrato da lista mostra um estado do campo.',
    oQueMuda: 'Mostrar o que muda',
  },

  tempo: {
    agora: 'agora',
    minutos: n => `há ${n} min`,
    horas: n => `há ${n} h`,
    dias: n => `há ${n} ${n === 1 ? 'dia' : 'dias'}`,
    as: hora => `às ${hora}`,
  },
}

const en: Textos = {
  casca: {
    menuLateral: 'Sidebar',
    buscar: 'Search...',
    membro: 'Member',
    configuracoes: 'Settings',
    ajuda: 'Help',
    recolherMenu: 'Collapse menu',
    abrirMenu: 'Open menu',
    voltar: 'Back',
    avancar: 'Forward',
    recarregar: 'Reload',
    trilha: 'Breadcrumb',
    trilhaCategorias: 'Categories',
    idioma: 'Language',
    tema: 'Theme',
    suporte: 'Support',
    notificacoes: 'Notifications',
    conta: 'Account',
    lab: 'Lab',
    itens: {
      inicio: 'Home',
      spaceflows: 'Spaceflows',
      categorias: 'Categories',
      contratos: 'Contracts',
      todos: 'All',
      formNovo: 'New contract',
      formAditivo: 'Amendment',
      tarefas: 'Tasks',
      agenda: 'Schedule',
      knowledge: 'Knowledge',
      visaoGeral: 'Overview',
      sistema: 'System',
      estrutura: 'Structure',
      gestaoDeMembros: 'Member Management',
      interface: 'Interface',
      emails: 'E-mails',
      integracoes: 'Integrations',
      agentesDeIa: 'AI Agents',
      logs: 'Logs',
      credenciais: 'Credentials',
      releases: 'Releases',
      documentacao: 'Documentation',
    },
  },

  lista: {
    abaItens: 'Items',
    abaVisualizar: 'View',
    pesquisar: 'Search records',
    criadoEm: 'Created at',
    todoPeriodo: 'All time',
    novoRegistro: 'New record',
    referencia: 'Reference',
    status: 'Status',
    contratante: 'Client',
    valor: 'Value',
    acoes: 'Actions',
    verDetalhes: 'View Details',
    editar: 'Edit',
    lixeira: 'Move to Trash',
    copiarLink: 'Copy Link',
    mostrando: (de, ate, total) => `Showing ${de} to ${ate} of ${total} results`,
    nadaEncontrado: 'No results found',
    semDocumento: 'No document',
  },

  statusDoContrato: {
    'rascunho': 'Draft',
    'em-revisao': 'In review',
    'aguardando-assinatura': 'Awaiting signature',
    'assinado': 'Signed',
  },

  item: {
    visaoGeral: 'Overview',
    comentarios: 'Comments',
    logs: 'Audit Logs',
    tarefas: 'Tasks',
    anexos: 'Attachments',
    alteracoesNaoSalvas: 'Unsaved changes',
    tudoSalvo: 'All saved',
    sairSemSalvar: 'Leave without saving',
    salvar: 'Save',
    salvo: 'Item updated successfully.',
    fechar: 'Close',
    objeto: 'Scope',
    vigencia: 'Term',
    meses: n => `${n} ${n === 1 ? 'month' : 'months'}`,
    responsavel: 'Owner',
  },

  campo: {
    vazioTitulo: 'No document yet',
    vazioDescricao: 'Start from a category template, a blank document, or upload your own.',
    soltarAqui: 'Drop the file to upload',
    usarModelo: 'Use template',
    emBranco: 'Blank',
    enviarArquivo: 'Upload file',
    formatosAceitos: '.docx or .pdf, up to 50 MB. You can also drag the file here.',
    modelosDaCategoria: 'Category templates',
    preencheCom: campos => `Fills in ${campos}`,
    semModelos: 'This category has no templates yet.',
    previaDoModelo: 'Preview with this item\'s data',
    criarDocumento: 'Create document',
    voltarAosModelos: 'Templates',
    gerando: 'Generating the document',
    gerandoDetalhe: 'Filling the template with this item\'s data.',
    criandoEmBranco: 'Creating a blank document',
    enviando: nome => `Uploading ${nome}`,
    criado: 'Document created',
    criadoDescricao: origem => `Version 1, ${origem}.`,
    arquivoRecusado: 'This file can\'t be used',
    arquivoRecusadoDetalhe: 'Upload a .docx or .pdf file.',

    versaoN: n => `Version ${n}`,
    editadoPor: (quem, quando) => `${quem}, ${quando}`,
    abrir: 'Open',
    abrirNo: {
      'onlyoffice': 'Open in ENSPACE',
      'word-desktop': 'Open in Word',
      'word-web': 'Open in Word for the web',
    },
    descricaoDoEditor: {
      'onlyoffice': 'ONLYOFFICE, right here in the browser',
      'word-desktop': 'Word installed on your computer',
      'word-web': 'Word in the browser, with Microsoft 365',
    },
    padrao: 'Default',
    definirComoPadrao: 'Always use this',
    ler: 'Read',
    versoes: 'Versions',
    maisAcoes: 'More actions',
    baixarDocx: 'Download .docx',
    baixarPdf: 'Download as PDF',
    substituir: 'Replace with another file',
    renomear: 'Rename',
    remover: 'Remove document',
    pdfSoLeitura: 'PDFs can\'t be edited. To change it, replace the file.',

    abertoPorVoceNoWord: desde => `You have this document open in Word since ${desde}.`,
    abertoPorVoceNoWordDetalhe: 'Every Save in Word becomes a version here. Close the document in Word to release it. Meanwhile, other people can only read.',
    voltarAoWord: 'Back to Word',
    liberar: 'Release without saving',
    abertoPorOutraNoWord: (quem, desde) => `${quem} is editing in Word since ${desde}.`,
    abertoPorOutraNoWordDetalhe: 'You can read the current version. Editing comes back when the document is released.',
    editandoAgoraNoEnspace: quem => `${quem} is editing now`,
    editarJunto: 'Edit together',
    avisarQuandoLiberar: 'Notify me when released',
    avisoAgendado: quem => `You'll be notified when ${quem} releases the document.`,

    carregando: 'Loading the document',
    erroTitulo: 'Couldn\'t load the document',
    erroDescricao: 'The file is still stored. Try again in a few seconds.',
    tentarDeNovo: 'Try again',
    semPermissaoTitulo: 'Read only',
    semPermissaoDescricao: 'Your profile can read this document, but not edit it.',

    removerTitulo: 'Remove the document?',
    removerDescricao: (nome, versoes) => `${nome} and its ${versoes} versions leave this item. The field becomes empty.`,
    cancelar: 'Cancel',
    removerConfirmar: 'Remove',
    removido: 'Document removed',
    liberado: 'Document released. Changes made in Word were not brought back.',
  },

  escolha: {
    titulo: 'Where do you want to open it?',
    descricao: 'Both editors work on the same file. Whatever you save comes back to this item.',
    lembrar: 'Remember my choice',
    lembrarAjuda: 'Change it anytime with the arrow next to the Open button.',
    continuar: 'Open',
    recomendadoPara: {
      onlyoffice: 'Good for quick reviews and editing together',
      word: 'Good for long documents and fine formatting',
    },
    nomes: {
      onlyoffice: 'In ENSPACE',
      word: 'In Microsoft Word',
    },
    detalhes: {
      onlyoffice: 'Opens right here, in the browser, with ONLYOFFICE. Saves on its own and shows who is editing.',
      word: 'Opens in Word on your computer, straight from the item. Saving in Word saves here, and the document is reserved for you.',
    },
    ondeAbrirWord: 'Which Word?',
    wordDesktopAjuda: 'Windows or Mac',
    wordWebAjuda: 'Needs a Microsoft 365 account',
  },

  editor: {
    voltarAoItem: 'Back to item',
    salvando: 'Saving',
    salvoAgora: 'Saved just now',
    salvoHa: quando => `Saved ${quando}`,
    offline: 'No connection. Your changes are kept here.',
    editandoJunto: 'Editing now',
    versoes: 'Versions',
    abrirNoWord: 'Open in Word',
    baixar: 'Download',
    concluir: 'Done',
    concluindo: 'Saving',
    versaoSalva: n => `Version ${n} saved`,
    areaDoOnlyoffice: 'ONLYOFFICE area (mockup): click the text and type to see saving.',
    barra: ['File', 'Home', 'Insert', 'Layout', 'References', 'Collaboration'],
    escHint: 'Esc only closes what is on top. The editor closes with Done.',
  },

  versoes: {
    titulo: 'Versions',
    descricao: 'Every time someone finishes editing, a new version is created.',
    atual: 'Current',
    origem: {
      modelo: 'Generated from template',
      branco: 'Created blank',
      envio: 'File uploaded',
      onlyoffice: 'Edited in ENSPACE',
      word: 'Edited in Word',
      restauracao: 'Restored',
    },
    restauradaDe: n => `Restored from version ${n}`,
    ver: 'View',
    restaurar: 'Restore',
    baixar: 'Download',
    restauradaToast: (de, nova) => `Version ${de} restored as version ${nova}`,
    restaurarTitulo: n => `Restore version ${n}?`,
    restaurarDescricao: (n, nova) => `The content of version ${n} becomes version ${nova}. No version is deleted.`,
    restaurarConfirmar: 'Restore',
    hoje: 'Today',
    ontem: 'Yesterday',
  },

  word: {
    titulo: {
      'word-desktop': 'Open in Word',
      'word-web': 'Open in Word for the web',
    },
    descricao: {
      'word-desktop': 'The document opens in Word on your computer, straight from this item. Saving in Word saves here.',
      'word-web': 'The document opens in Word for the web, in a new tab. When you finish, it comes back to this item.',
    },
    passoReservar: 'Reserve it for you',
    passoReservarDetalhe: 'While you edit in Word, other people can only read. That way nobody overwrites anybody.',
    passoAbrir: 'Open in Word',
    passoAbrirDetalhe: {
      'word-desktop': 'Word on your computer opens the file stored in this item. Nothing is downloaded.',
      'word-web': 'A copy goes to your OneDrive while you edit.',
    },
    passoSalvar: 'Save in Word',
    passoSalvarDetalhe: {
      'word-desktop': 'Every Save (Ctrl+S) becomes a version in this item. Close the document and it is free again.',
      'word-web': 'When you finish, the copy comes back to this item as a new version and leaves OneDrive.',
    },
    reservado: 'Reserved for you',
    abrindo: 'Opening in Word',
    abertoToast: 'Document opened in Word',
    abrirJanela: 'See the ENSPACE pane (mockup)',
    fechar: 'Close',
    naoAbriu: 'Word didn\'t open?',
    naoAbriuDetalhe: 'Download the file linked to the item. In Word, the ENSPACE pane recognizes the item and sends the document back.',
    baixarArquivo: 'Download the file linked to the item',
    baixadoToast: 'File downloaded. In Word, use Save to ENSPACE in the pane.',
    dicaSuplemento: 'With the ENSPACE add-in for Word, the pane shows which item the document belongs to.',
    notaPrototipo: 'Prototype: Word on your computer opened the file straight from the prototype\'s address, without downloading. Since there is no server here, it opens read only and doesn\'t save back. In ENSPACE, the WebDAV endpoint makes Ctrl+S save to the item.',
    abrirDeNovo: 'Open in Word again',
    instalarSuplemento: 'How to install',
    ocupadoTitulo: quem => `${quem} is editing in ENSPACE right now`,
    ocupadoDescricao: 'To open in Word, the document must be free. Edit together in ENSPACE or wait until they finish.',
    recebidoToast: n => `Version ${n} received from Word`,
  },

  janela: {
    aviso: 'Mockup of Word with the ENSPACE pane. The Word window is not the proposal; the pane and saving to the item are.',
    tituloDoApp: 'Word',
    salvoNaBarra: hora => `Saved to ENSPACE at ${hora}`,
    naoSalvoNaBarra: 'Unsaved changes',
    salvarAtalho: 'Save (Ctrl+S)',
    painel: 'ENSPACE',
    abas: ['Document', 'Assistants (AI)', 'Templates'],
    vinculado: 'Linked to an item',
    item: 'Item',
    campo: 'Field',
    versaoAberta: n => `You opened version ${n}`,
    alteracoesPendentes: 'Changes not saved to the item yet',
    semAlteracoes: 'Everything saved to the item',
    salvarNoEnspace: 'Save to ENSPACE',
    salvandoNoEnspace: 'Saving',
    salvoNoEnspace: (n, hora) => `Version ${n} saved at ${hora}`,
    fecharELiberar: 'Finish and release',
    abrirItem: 'See the item in ENSPACE',
    dicaDigitar: 'Type in the document to create a change.',
    semPainel: 'Without the add-in, saving in Word still saves to the item. Only the pane is missing.',
    copiaBaixada: 'Downloaded copy: saving in Word saves to the computer. Use Save to ENSPACE.',
  },

  config: {
    titulo: 'Field: Contract draft',
    descricao: 'Settings › Categories › Contracts › Fields',
    abas: ['Definition', 'Visual', 'Rules and Conditions', 'Field Events', 'Help'],
    nome: 'Field name',
    rotulo: 'Visible Label',
    referencia: 'Technical reference',
    tipo: 'Field Type',
    tipoValor: 'Document Editor',
    secaoEditores: 'Where the document opens',
    secaoEditoresAjuda: 'People using the field choose among the editors turned on here.',
    onlyoffice: 'ENSPACE (ONLYOFFICE)',
    onlyofficeAjuda: 'In the browser, nothing to install. Allows editing together.',
    word: 'Microsoft Word',
    wordAjuda: 'Word installed on the computer (Windows or Mac) opens the item\'s file. One person edits at a time.',
    wordWeb: 'Word for the web (phase 2)',
    wordWebAjuda: 'Needs the company\'s Microsoft 365. A copy stays in the editor\'s OneDrive until they finish.',
    editorPadrao: 'Default editor',
    editorPadraoAjuda: 'What the Open button uses for people who haven\'t chosen yet.',
    cadaPessoaEscolhe: 'Ask the first time',
    secaoCriar: 'How the document starts',
    secaoCriarAjuda: 'The options shown in the empty field.',
    modelos: 'Category templates',
    modelosAjuda: n => `${n} templates in Document Templates`,
    branco: 'Blank document',
    enviarDocx: 'Upload .docx file',
    enviarPdf: 'Upload .pdf file',
    secaoEditar: 'What can be done in the editor',
    secaoEditarAjuda: 'Applies to ONLYOFFICE. In Word, Word itself decides.',
    editar: 'Edit',
    comentar: 'Comment',
    acompanhar: 'Track changes',
    revisao: 'Review',
    painelRevisao: 'Show review pane',
    chat: 'Chat',
    preVisualizacao: 'Field preview',
    salvar: 'Save',
    salvo: 'Field saved',
  },

  andaime: {
    titulo: 'Prototype',
    estado: 'State',
    estados: {
      normal: 'Normal',
      carregando: 'Loading',
      erro: 'Error',
      somenteLeitura: 'Read only',
    },
    suplemento: 'Add-in in Word',
    configuracao: 'Field settings',
    wordDeVerdade: 'Open the real Word',
    reiniciar: 'Start over',
    dica: 'Each contract in the list shows a field state.',
    oQueMuda: 'Show what changes',
  },

  tempo: {
    agora: 'just now',
    minutos: n => `${n} min ago`,
    horas: n => `${n} h ago`,
    dias: n => `${n} ${n === 1 ? 'day' : 'days'} ago`,
    as: hora => `at ${hora}`,
  },
}

const es: Textos = {
  casca: {
    menuLateral: 'Menú lateral',
    buscar: 'Buscar...',
    membro: 'Miembro',
    configuracoes: 'Configuración',
    ajuda: 'Ayuda',
    recolherMenu: 'Contraer menú',
    abrirMenu: 'Abrir menú',
    voltar: 'Volver',
    avancar: 'Avanzar',
    recarregar: 'Recargar',
    trilha: 'Ruta',
    trilhaCategorias: 'Categorías',
    idioma: 'Idioma',
    tema: 'Tema',
    suporte: 'Soporte',
    notificacoes: 'Notificaciones',
    conta: 'Cuenta',
    lab: 'Lab',
    itens: {
      inicio: 'Inicio',
      spaceflows: 'Spaceflows',
      categorias: 'Categorías',
      contratos: 'Contratos',
      todos: 'Todos',
      formNovo: 'Nuevo contrato',
      formAditivo: 'Adenda',
      tarefas: 'Tareas',
      agenda: 'Agenda',
      knowledge: 'Knowledge',
      visaoGeral: 'Visión General',
      sistema: 'Sistema',
      estrutura: 'Estructura',
      gestaoDeMembros: 'Gestión de Miembros',
      interface: 'Interfaz',
      emails: 'Correos',
      integracoes: 'Integraciones',
      agentesDeIa: 'Agentes de IA',
      logs: 'Logs',
      credenciais: 'Credenciales',
      releases: 'Releases',
      documentacao: 'Documentación',
    },
  },

  lista: {
    abaItens: 'Ítems',
    abaVisualizar: 'Visualizar',
    pesquisar: 'Buscar registros',
    criadoEm: 'Creado el',
    todoPeriodo: 'Todo el período',
    novoRegistro: 'Nuevo registro',
    referencia: 'Referencia',
    status: 'Estado',
    contratante: 'Contratante',
    valor: 'Valor',
    acoes: 'Acciones',
    verDetalhes: 'Ver Detalles',
    editar: 'Editar',
    lixeira: 'Enviar a la Papelera',
    copiarLink: 'Copiar Enlace',
    mostrando: (de, ate, total) => `Mostrando ${de} a ${ate} de ${total} resultados`,
    nadaEncontrado: 'No se encontraron resultados',
    semDocumento: 'Sin documento',
  },

  statusDoContrato: {
    'rascunho': 'Borrador',
    'em-revisao': 'En revisión',
    'aguardando-assinatura': 'Esperando firma',
    'assinado': 'Firmado',
  },

  item: {
    visaoGeral: 'Visión General',
    comentarios: 'Comentarios',
    logs: 'Logs de Auditoría',
    tarefas: 'Tareas',
    anexos: 'Adjuntos',
    alteracoesNaoSalvas: 'Cambios sin guardar',
    tudoSalvo: 'Todo guardado',
    sairSemSalvar: 'Salir sin guardar',
    salvar: 'Guardar',
    salvo: 'Ítem actualizado con éxito.',
    fechar: 'Cerrar',
    objeto: 'Objeto',
    vigencia: 'Vigencia',
    meses: n => `${n} ${n === 1 ? 'mes' : 'meses'}`,
    responsavel: 'Responsable',
  },

  campo: {
    vazioTitulo: 'Todavía no hay documento',
    vazioDescricao: 'Empieza con una plantilla de la categoría, un documento en blanco o sube el tuyo.',
    soltarAqui: 'Suelta el archivo para subirlo',
    usarModelo: 'Usar plantilla',
    emBranco: 'En blanco',
    enviarArquivo: 'Subir archivo',
    formatosAceitos: '.docx o .pdf, hasta 50 MB. También puedes arrastrar el archivo aquí.',
    modelosDaCategoria: 'Plantillas de la categoría',
    preencheCom: campos => `Completa ${campos}`,
    semModelos: 'Esta categoría todavía no tiene plantillas.',
    previaDoModelo: 'Vista previa con los datos de este ítem',
    criarDocumento: 'Crear documento',
    voltarAosModelos: 'Plantillas',
    gerando: 'Generando el documento',
    gerandoDetalhe: 'Completando la plantilla con los datos de este ítem.',
    criandoEmBranco: 'Creando el documento en blanco',
    enviando: nome => `Subiendo ${nome}`,
    criado: 'Documento creado',
    criadoDescricao: origem => `Versión 1, ${origem}.`,
    arquivoRecusado: 'Este archivo no se puede usar',
    arquivoRecusadoDetalhe: 'Sube un archivo .docx o .pdf.',

    versaoN: n => `Versión ${n}`,
    editadoPor: (quem, quando) => `${quem}, ${quando}`,
    abrir: 'Abrir',
    abrirNo: {
      'onlyoffice': 'Abrir en ENSPACE',
      'word-desktop': 'Abrir en Word',
      'word-web': 'Abrir en Word para la web',
    },
    descricaoDoEditor: {
      'onlyoffice': 'ONLYOFFICE, aquí en el navegador',
      'word-desktop': 'Word instalado en la computadora',
      'word-web': 'Word en el navegador, con Microsoft 365',
    },
    padrao: 'Predeterminado',
    definirComoPadrao: 'Usar siempre este',
    ler: 'Leer',
    versoes: 'Versiones',
    maisAcoes: 'Más acciones',
    baixarDocx: 'Descargar .docx',
    baixarPdf: 'Descargar como PDF',
    substituir: 'Reemplazar por otro archivo',
    renomear: 'Renombrar',
    remover: 'Quitar documento',
    pdfSoLeitura: 'Un PDF no se edita. Para cambiarlo, reemplaza el archivo.',

    abertoPorVoceNoWord: desde => `Tienes este documento abierto en Word desde las ${desde}.`,
    abertoPorVoceNoWordDetalhe: 'Cada Guardar en Word se convierte en una versión aquí. Cierra el documento en Word para liberarlo. Mientras tanto, las demás personas solo leen.',
    voltarAoWord: 'Volver a Word',
    liberar: 'Liberar sin guardar',
    abertoPorOutraNoWord: (quem, desde) => `${quem} está editando en Word desde las ${desde}.`,
    abertoPorOutraNoWordDetalhe: 'Puedes leer la versión actual. La edición vuelve cuando se libere el documento.',
    editandoAgoraNoEnspace: quem => `${quem} está editando ahora`,
    editarJunto: 'Editar juntos',
    avisarQuandoLiberar: 'Avisarme cuando se libere',
    avisoAgendado: quem => `Recibirás un aviso cuando ${quem} libere el documento.`,

    carregando: 'Cargando el documento',
    erroTitulo: 'No se pudo cargar el documento',
    erroDescricao: 'El archivo sigue guardado. Inténtalo de nuevo en unos segundos.',
    tentarDeNovo: 'Intentar de nuevo',
    semPermissaoTitulo: 'Solo lectura',
    semPermissaoDescricao: 'Tu perfil puede leer este documento, pero no editarlo.',

    removerTitulo: '¿Quitar el documento?',
    removerDescricao: (nome, versoes) => `${nome} y sus ${versoes} versiones salen de este ítem. El campo queda vacío.`,
    cancelar: 'Cancelar',
    removerConfirmar: 'Quitar',
    removido: 'Documento quitado',
    liberado: 'Documento liberado. Los cambios hechos en Word no se trajeron.',
  },

  escolha: {
    titulo: '¿Dónde quieres abrirlo?',
    descricao: 'Los dos editores trabajan en el mismo archivo. Lo que guardes vuelve a este ítem.',
    lembrar: 'Recordar mi elección',
    lembrarAjuda: 'Cámbiala cuando quieras con la flecha junto al botón Abrir.',
    continuar: 'Abrir',
    recomendadoPara: {
      onlyoffice: 'Bueno para revisiones rápidas y para editar juntos',
      word: 'Bueno para documentos largos y formato fino',
    },
    nomes: {
      onlyoffice: 'En ENSPACE',
      word: 'En Microsoft Word',
    },
    detalhes: {
      onlyoffice: 'Abre aquí, en el navegador, con ONLYOFFICE. Guarda solo y muestra quién está editando.',
      word: 'Abre en el Word de tu computadora, directo desde el ítem. Guardar en Word guarda aquí, y el documento queda reservado para ti.',
    },
    ondeAbrirWord: '¿Qué Word?',
    wordDesktopAjuda: 'Windows o Mac',
    wordWebAjuda: 'Requiere cuenta de Microsoft 365',
  },

  editor: {
    voltarAoItem: 'Volver al ítem',
    salvando: 'Guardando',
    salvoAgora: 'Guardado ahora',
    salvoHa: quando => `Guardado ${quando}`,
    offline: 'Sin conexión. Tus cambios quedan guardados aquí.',
    editandoJunto: 'Editando ahora',
    versoes: 'Versiones',
    abrirNoWord: 'Abrir en Word',
    baixar: 'Descargar',
    concluir: 'Listo',
    concluindo: 'Guardando',
    versaoSalva: n => `Versión ${n} guardada`,
    areaDoOnlyoffice: 'Área de ONLYOFFICE (maqueta): haz clic en el texto y escribe para ver el guardado.',
    barra: ['Archivo', 'Inicio', 'Insertar', 'Diseño', 'Referencias', 'Colaboración'],
    escHint: 'Esc cierra solo lo que está encima. El editor se cierra con Listo.',
  },

  versoes: {
    titulo: 'Versiones',
    descricao: 'Cada vez que alguien termina una edición, nace una versión.',
    atual: 'Actual',
    origem: {
      modelo: 'Generada de la plantilla',
      branco: 'Creada en blanco',
      envio: 'Archivo subido',
      onlyoffice: 'Editada en ENSPACE',
      word: 'Editada en Word',
      restauracao: 'Restaurada',
    },
    restauradaDe: n => `Restaurada de la versión ${n}`,
    ver: 'Ver',
    restaurar: 'Restaurar',
    baixar: 'Descargar',
    restauradaToast: (de, nova) => `Versión ${de} restaurada como versión ${nova}`,
    restaurarTitulo: n => `¿Restaurar la versión ${n}?`,
    restaurarDescricao: (n, nova) => `El contenido de la versión ${n} se convierte en la versión ${nova}. No se borra ninguna versión.`,
    restaurarConfirmar: 'Restaurar',
    hoje: 'Hoy',
    ontem: 'Ayer',
  },

  word: {
    titulo: {
      'word-desktop': 'Abrir en Word',
      'word-web': 'Abrir en Word para la web',
    },
    descricao: {
      'word-desktop': 'El documento abre en el Word de tu computadora, directo desde este ítem. Guardar en Word guarda aquí.',
      'word-web': 'El documento abre en Word para la web, en una nueva pestaña. Al terminar, vuelve a este ítem.',
    },
    passoReservar: 'Reservarlo para ti',
    passoReservarDetalhe: 'Mientras editas en Word, las demás personas solo leen. Así nadie sobrescribe a nadie.',
    passoAbrir: 'Abrir en Word',
    passoAbrirDetalhe: {
      'word-desktop': 'El Word de la computadora abre el archivo guardado en este ítem. No se descarga nada.',
      'word-web': 'Una copia va a tu OneDrive mientras editas.',
    },
    passoSalvar: 'Guardar en Word',
    passoSalvarDetalhe: {
      'word-desktop': 'Cada Guardar (Ctrl+S) se convierte en una versión en este ítem. Al cerrar el documento, queda libre.',
      'word-web': 'Al terminar, la copia vuelve a este ítem como nueva versión y sale de OneDrive.',
    },
    reservado: 'Reservado para ti',
    abrindo: 'Abriendo en Word',
    abertoToast: 'Documento abierto en Word',
    abrirJanela: 'Ver el panel de ENSPACE (maqueta)',
    fechar: 'Cerrar',
    naoAbriu: '¿Word no se abrió?',
    naoAbriuDetalhe: 'Descarga el archivo vinculado al ítem. En Word, el panel de ENSPACE reconoce el ítem y envía el documento de vuelta.',
    baixarArquivo: 'Descargar el archivo vinculado al ítem',
    baixadoToast: 'Archivo descargado. En Word, usa Guardar en ENSPACE, en el panel.',
    dicaSuplemento: 'Con el complemento de ENSPACE en Word, el panel muestra a qué ítem pertenece el documento.',
    notaPrototipo: 'Prototipo: el Word de tu computadora abrió el archivo directo desde la dirección del prototipo, sin descargarlo. Como aquí no hay servidor, abre en solo lectura y no guarda de vuelta. En ENSPACE, el endpoint WebDAV hace que Ctrl+S guarde en el ítem.',
    abrirDeNovo: 'Abrir en Word de nuevo',
    instalarSuplemento: 'Cómo instalar',
    ocupadoTitulo: quem => `${quem} está editando en ENSPACE ahora`,
    ocupadoDescricao: 'Para abrir en Word, el documento debe estar libre. Edita juntos en ENSPACE o espera a que termine.',
    recebidoToast: n => `Versión ${n} recibida de Word`,
  },

  janela: {
    aviso: 'Maqueta de Word con el panel de ENSPACE. La ventana de Word no es propuesta; el panel y el guardado en el ítem sí.',
    tituloDoApp: 'Word',
    salvoNaBarra: hora => `Guardado en ENSPACE a las ${hora}`,
    naoSalvoNaBarra: 'Cambios sin guardar',
    salvarAtalho: 'Guardar (Ctrl+S)',
    painel: 'ENSPACE',
    abas: ['Documento', 'Asistentes (IA)', 'Plantillas'],
    vinculado: 'Vinculado a un ítem',
    item: 'Ítem',
    campo: 'Campo',
    versaoAberta: n => `Abriste la versión ${n}`,
    alteracoesPendentes: 'Cambios todavía no guardados en el ítem',
    semAlteracoes: 'Todo guardado en el ítem',
    salvarNoEnspace: 'Guardar en ENSPACE',
    salvandoNoEnspace: 'Guardando',
    salvoNoEnspace: (n, hora) => `Versión ${n} guardada a las ${hora}`,
    fecharELiberar: 'Terminar y liberar',
    abrirItem: 'Ver el ítem en ENSPACE',
    dicaDigitar: 'Escribe en el documento para crear un cambio.',
    semPainel: 'Sin el complemento, Guardar en Word guarda en el ítem igual. Solo falta el panel.',
    copiaBaixada: 'Copia descargada: Guardar en Word guarda en la computadora. Usa Guardar en ENSPACE.',
  },

  config: {
    titulo: 'Campo: Borrador del contrato',
    descricao: 'Configuración › Categorías › Contratos › Campos',
    abas: ['Definición', 'Visual', 'Reglas y Condiciones', 'Eventos de Campo', 'Ayuda'],
    nome: 'Nombre del campo',
    rotulo: 'Etiqueta Visible (Label)',
    referencia: 'Referencia técnica',
    tipo: 'Tipo de Campo',
    tipoValor: 'Editor de Documentos',
    secaoEditores: 'Dónde abre el documento',
    secaoEditoresAjuda: 'Quien usa el campo elige entre los editores activados aquí.',
    onlyoffice: 'ENSPACE (ONLYOFFICE)',
    onlyofficeAjuda: 'En el navegador, sin instalar nada. Permite editar juntos.',
    word: 'Microsoft Word',
    wordAjuda: 'El Word instalado en la computadora (Windows o Mac) abre el archivo del ítem. Edita una persona a la vez.',
    wordWeb: 'Word para la web (fase 2)',
    wordWebAjuda: 'Requiere Microsoft 365 de la empresa. Una copia queda en el OneDrive de quien edita hasta terminar.',
    editorPadrao: 'Editor predeterminado',
    editorPadraoAjuda: 'El que usa el botón Abrir para quien todavía no eligió.',
    cadaPessoaEscolhe: 'Preguntar la primera vez',
    secaoCriar: 'Cómo nace el documento',
    secaoCriarAjuda: 'Las opciones que aparecen en el campo vacío.',
    modelos: 'Plantillas de la categoría',
    modelosAjuda: n => `${n} plantillas en Plantillas de Documento`,
    branco: 'Documento en blanco',
    enviarDocx: 'Subir archivo .docx',
    enviarPdf: 'Subir archivo .pdf',
    secaoEditar: 'Qué se hace en el editor',
    secaoEditarAjuda: 'Vale para ONLYOFFICE. En Word, decide el propio Word.',
    editar: 'Editar',
    comentar: 'Comentar',
    acompanhar: 'Control de cambios',
    revisao: 'Revisión',
    painelRevisao: 'Mostrar panel de revisión',
    chat: 'Chat',
    preVisualizacao: 'Vista previa del campo',
    salvar: 'Guardar',
    salvo: 'Campo guardado',
  },

  andaime: {
    titulo: 'Prototipo',
    estado: 'Estado',
    estados: {
      normal: 'Normal',
      carregando: 'Cargando',
      erro: 'Error',
      somenteLeitura: 'Solo lectura',
    },
    suplemento: 'Complemento en Word',
    configuracao: 'Configuración del campo',
    wordDeVerdade: 'Abrir el Word de verdad',
    reiniciar: 'Empezar de nuevo',
    dica: 'Cada contrato de la lista muestra un estado del campo.',
    oQueMuda: 'Mostrar lo que cambia',
  },

  tempo: {
    agora: 'ahora',
    minutos: n => `hace ${n} min`,
    horas: n => `hace ${n} h`,
    dias: n => `hace ${n} ${n === 1 ? 'día' : 'días'}`,
    as: hora => `a las ${hora}`,
  },
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': pt, en, es }
