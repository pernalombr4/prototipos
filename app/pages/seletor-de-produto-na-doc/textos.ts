/**
 * A copy desta tela nos três idiomas da documentação do ENSPACE.
 *
 * Os rótulos da casca (Docs, Dev, Blog, Releases, Entrar, Nesta página,
 * Copiar texto, os status da página) são os do próprio `en-docs`, copiados de
 * `i18n/lang/{pt,en,es}.yaml` em 22/09/2026. Não são proposta: mudá-los aqui
 * seria inventar diferença onde não há.
 *
 * Regra 33: nenhum texto de interface leva travessão.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { ChaveDeProduto } from './mocks'

export interface Textos {
  /* ---------------------------------------------------------------- *
   * CASCA (cópia do docs.enspace.io, nada aqui é proposta)            *
   * ---------------------------------------------------------------- */
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
    informacao: string
    copiarTexto: string
    copiado: string
    perguntarBeni: string
    abrirNoChatGpt: string
    status: Record<'published' | 'updated' | 'draft' | 'deprecated', string>
  }

  /* ---------------------------------------------------------------- *
   * SELETOR DE PRODUTO (a proposta)                                   *
   * ---------------------------------------------------------------- */
  seletor: {
    /**
     * Rótulo acessível do botão. Existe porque no celular a pílula fica só
     * com o ícone, e porque "trocar de produto" não está escrito na tela.
     */
    aria: (produto: string) => string
    selo: Record<'beta' | 'novo', string>
    /** Lido pelo leitor de tela no item bloqueado, onde só há o relógio. */
    emBreve: string
    /** Idem, no item que sai do site, onde só há a seta. */
    abreFora: string
  }

  /** Documentação que vive fora deste site. Nome de marca, não se traduz. */
  externos: Record<'sdk', { nome: string }>

  /**
   * O nome de cada produto. Sem descrição de propósito: o menu tem uma linha
   * por produto, como nas dez referências do PESQUISA.md. Quem precisa saber
   * o que o produto é lê a descrição da página de abertura dele.
   */
  produtos: Record<ChaveDeProduto, { nome: string }>

  /** Título de cada página e de cada seção do menu, pela chave. */
  titulos: Record<string, string>
  /** Descrição da página, pela chave `produto:pagina`. */
  descricoes: Record<string, string>

  busca: {
    /** Rótulo do botão de busca: a busca é do produto escolhido. */
    em: (produto: string) => string
  }

  /**
   * O aviso que aparece quando a troca de produto não acha a página.
   *
   * O nome do produto entra sempre no começo da frase, nunca depois de
   * preposição: nome próprio em inglês no meio de frase em português obriga a
   * escolher entre "de Word Plugin" e "do Word Plugin", e a escolha muda com
   * o produto. Frase que começa pelo nome funciona com os três, nos três
   * idiomas, e não precisa ser reescrita quando entrar o quarto.
   */
  semEquivalente: {
    titulo: (produto: string) => string
    texto: (pagina: string) => string
    voltar: (produto: string) => string
    fechar: string
  }

  estados: {
    carregando: string
    vazioTitulo: (produto: string) => string
    vazioTexto: string
    vazioAcao: string
    erroTitulo: string
    erroTexto: string
    erroAcao: string
    bloqueadoTitulo: string
    bloqueadoTexto: string
    bloqueadoAcao: string
  }

  /** Andaime de protótipo. Não é produto. */
  andaime: {
    estado: string
    estados: Record<'cheio' | 'vazio' | 'carregando' | 'erro' | 'bloqueado' | 'hoje', string>
    porTras: string
    endereco: string
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
      informacao: 'Informação',
      copiarTexto: 'Copiar texto',
      copiado: 'Copiado!',
      perguntarBeni: 'Perguntar ao BENI (em breve)',
      abrirNoChatGpt: 'Abrir no ChatGPT',
      status: {
        published: 'publicado',
        updated: 'atualizado',
        draft: 'rascunho',
        deprecated: 'descontinuado',
      },
    },
    seletor: {
      aria: p => `Produto da documentação: ${p}. Trocar de produto.`,
      selo: { beta: 'Beta', novo: 'Novo' },
      emBreve: 'Em breve',
      abreFora: 'Abre em outro site',
    },
    externos: {
      sdk: { nome: 'SDK' },
    },
    produtos: {
      'enspace': { nome: 'ENSPACE' },
      'plugin-word': { nome: 'Word Plugin' },
      'beni-app': { nome: 'Beni App' },
    },
    titulos: {
      'inicio': 'Primeiros passos',
      'conceitos': 'Conceitos',
      'acesso': 'Cadastro e acesso',
      'acesso-cadastro': 'Criar a conta',
      'acesso-autenticacao': 'Entrar na plataforma',
      'acesso-recuperacao': 'Recuperar o acesso',
      'painel': 'Painel do usuário',
      'painel-perfil': 'Perfil',
      'painel-cobranca': 'Cobrança',
      'painel-integracoes': 'Integrações',
      'workspace': 'Workspace',
      'workspace-navegacao': 'Navegação',
      'workspace-membros': 'Membros',
      'workspace-materiais': 'Materiais de apoio',
      'selo-do-documento': 'Selo do documento',
      'modulos': 'Módulos',
      'ferramentas-de-ia': 'Ferramentas de IA',
      'limitacoes': 'Limitações conhecidas',
      'instalacao': 'Instalação',
      'escrever': 'Escrever o documento',
      'escrever-inserir-dados': 'Inserir dados do item',
      'escrever-modelos': 'Modelos de documento',
      'revisao': 'Revisão e comentários',
      'conversar': 'Conversar com o BENI',
      'conversar-primeira-conversa': 'A primeira conversa',
      'conversar-acoes': 'Ações e comandos',
      'privacidade': 'Privacidade e dados',
    },
    descricoes: {
      'enspace:inicio': 'Conheça o ENSPACE e aprenda a organizar dados, automatizar processos e gerir equipes.',
      'enspace:selo-do-documento': 'Gere a prova de que um arquivo saiu do ENSPACE com aquele conteúdo, naquela data.',
      'plugin-word:inicio': 'Instale o plugin e traga os dados do ENSPACE para dentro do Word.',
      'plugin-word:selo-do-documento': 'Sele o documento e anexe ao item sem sair do Word.',
      'beni-app:inicio': 'Instale o aplicativo e converse com o BENI sobre o seu workspace.',
    },
    busca: {
      em: p => `Buscar em ${p}`,
    },
    semEquivalente: {
      titulo: p => `${p} ainda não tem essa página`,
      texto: pagina => `Você veio de "${pagina}". Como não há equivalente aqui, esta é a primeira página da documentação.`,
      voltar: p => `Voltar para ${p}`,
      fechar: 'Fechar o aviso',
    },
    estados: {
      carregando: 'Carregando a documentação',
      vazioTitulo: p => `${p}: a documentação está a caminho`,
      vazioTexto: 'As primeiras páginas entram junto com a próxima versão. Enquanto isso, a documentação da plataforma cobre o que os produtos têm em comum.',
      vazioAcao: 'Ver a documentação do ENSPACE',
      erroTitulo: 'Não foi possível carregar esta página',
      erroTexto: 'A documentação continua no ar. Tente de novo em alguns instantes.',
      erroAcao: 'Tentar de novo',
      bloqueadoTitulo: 'Esta página é restrita',
      bloqueadoTexto: 'Entre com a sua conta ENSPACE para ler o conteúdo restrito deste produto.',
      bloqueadoAcao: 'Entrar',
    },
    andaime: {
      estado: 'Protótipo · estado',
      estados: {
        cheio: 'Documentação cheia',
        vazio: 'Produto sem conteúdo',
        carregando: 'Carregando',
        erro: 'Erro',
        bloqueado: 'Sem permissão',
        hoje: 'Como é hoje',
      },
      porTras: 'Por trás',
      endereco: 'Endereço proposto',
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
      informacao: 'Information',
      copiarTexto: 'Copy page text',
      copiado: 'Copied!',
      perguntarBeni: 'Ask BENI (coming soon)',
      abrirNoChatGpt: 'Open in ChatGPT',
      status: {
        published: 'published',
        updated: 'updated',
        draft: 'draft',
        deprecated: 'deprecated',
      },
    },
    seletor: {
      aria: p => `Documentation product: ${p}. Switch product.`,
      selo: { beta: 'Beta', novo: 'New' },
      emBreve: 'Coming soon',
      abreFora: 'Opens on another site',
    },
    externos: {
      sdk: { nome: 'SDK' },
    },
    produtos: {
      'enspace': { nome: 'ENSPACE' },
      'plugin-word': { nome: 'Word Plugin' },
      'beni-app': { nome: 'Beni App' },
    },
    titulos: {
      'inicio': 'Getting Started',
      'conceitos': 'Concepts',
      'acesso': 'Registration and Access',
      'acesso-cadastro': 'Create your account',
      'acesso-autenticacao': 'Sign in to the platform',
      'acesso-recuperacao': 'Recover your access',
      'painel': 'User Panel',
      'painel-perfil': 'Profile',
      'painel-cobranca': 'Billing',
      'painel-integracoes': 'Integrations',
      'workspace': 'Workspace',
      'workspace-navegacao': 'Navigation',
      'workspace-membros': 'Members',
      'workspace-materiais': 'Support materials',
      'selo-do-documento': 'Document Seal',
      'modulos': 'Modules',
      'ferramentas-de-ia': 'AI Tools',
      'limitacoes': 'Known Limitations',
      'instalacao': 'Installation',
      'escrever': 'Write the document',
      'escrever-inserir-dados': 'Insert item data',
      'escrever-modelos': 'Document templates',
      'revisao': 'Review and comments',
      'conversar': 'Talk to BENI',
      'conversar-primeira-conversa': 'The first conversation',
      'conversar-acoes': 'Actions and commands',
      'privacidade': 'Privacy and data',
    },
    descricoes: {
      'enspace:inicio': 'Discover ENSPACE and learn how to organize data, automate processes and manage teams.',
      'enspace:selo-do-documento': 'Produce the proof that a file left ENSPACE with that content, on that date.',
      'plugin-word:inicio': 'Install the plugin and bring ENSPACE data into Word.',
      'plugin-word:selo-do-documento': 'Seal the document and attach it to the item without leaving Word.',
      'beni-app:inicio': 'Install the app and talk to BENI about your workspace.',
    },
    busca: {
      em: p => `Search in ${p}`,
    },
    semEquivalente: {
      titulo: p => `${p} does not have this page yet`,
      texto: pagina => `You came from "${pagina}". With no equivalent here, this is the first page of the documentation.`,
      voltar: p => `Back to ${p}`,
      fechar: 'Dismiss the notice',
    },
    estados: {
      carregando: 'Loading the documentation',
      vazioTitulo: p => `${p}: the documentation is on its way`,
      vazioTexto: 'The first pages ship with the next release. In the meantime, the platform documentation covers what the products have in common.',
      vazioAcao: 'See the ENSPACE documentation',
      erroTitulo: 'This page could not be loaded',
      erroTexto: 'The documentation is still up. Try again in a moment.',
      erroAcao: 'Try again',
      bloqueadoTitulo: 'This page is restricted',
      bloqueadoTexto: 'Sign in with your ENSPACE account to read the restricted content of this product.',
      bloqueadoAcao: 'Login',
    },
    andaime: {
      estado: 'Prototype · state',
      estados: {
        cheio: 'Full documentation',
        vazio: 'Product with no content',
        carregando: 'Loading',
        erro: 'Error',
        bloqueado: 'No permission',
        hoje: 'How it is today',
      },
      porTras: 'Behind it',
      endereco: 'Proposed address',
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
      informacao: 'Información',
      copiarTexto: 'Copiar texto',
      copiado: '¡Copiado!',
      perguntarBeni: 'Preguntar a BENI (muy pronto)',
      abrirNoChatGpt: 'Abrir en ChatGPT',
      status: {
        published: 'publicado',
        updated: 'actualizado',
        draft: 'borrador',
        deprecated: 'descontinuado',
      },
    },
    seletor: {
      aria: p => `Producto de la documentación: ${p}. Cambiar de producto.`,
      selo: { beta: 'Beta', novo: 'Nuevo' },
      emBreve: 'Muy pronto',
      abreFora: 'Se abre en otro sitio',
    },
    externos: {
      sdk: { nome: 'SDK' },
    },
    produtos: {
      'enspace': { nome: 'ENSPACE' },
      'plugin-word': { nome: 'Word Plugin' },
      'beni-app': { nome: 'Beni App' },
    },
    titulos: {
      'inicio': 'Primeros pasos',
      'conceitos': 'Conceptos',
      'acesso': 'Registro y acceso',
      'acesso-cadastro': 'Crear la cuenta',
      'acesso-autenticacao': 'Entrar en la plataforma',
      'acesso-recuperacao': 'Recuperar el acceso',
      'painel': 'Panel del usuario',
      'painel-perfil': 'Perfil',
      'painel-cobranca': 'Facturación',
      'painel-integracoes': 'Integraciones',
      'workspace': 'Workspace',
      'workspace-navegacao': 'Navegación',
      'workspace-membros': 'Miembros',
      'workspace-materiais': 'Materiales de apoyo',
      'selo-do-documento': 'Sello del documento',
      'modulos': 'Módulos',
      'ferramentas-de-ia': 'Herramientas de IA',
      'limitacoes': 'Limitaciones conocidas',
      'instalacao': 'Instalación',
      'escrever': 'Escribir el documento',
      'escrever-inserir-dados': 'Insertar datos del ítem',
      'escrever-modelos': 'Plantillas de documento',
      'revisao': 'Revisión y comentarios',
      'conversar': 'Conversar con BENI',
      'conversar-primeira-conversa': 'La primera conversación',
      'conversar-acoes': 'Acciones y comandos',
      'privacidade': 'Privacidad y datos',
    },
    descricoes: {
      'enspace:inicio': 'Conoce ENSPACE y aprende a organizar datos, automatizar procesos y gestionar equipos.',
      'enspace:selo-do-documento': 'Genera la prueba de que un archivo salió de ENSPACE con ese contenido, en esa fecha.',
      'plugin-word:inicio': 'Instala el plugin y trae los datos de ENSPACE dentro de Word.',
      'plugin-word:selo-do-documento': 'Sella el documento y adjúntalo al ítem sin salir de Word.',
      'beni-app:inicio': 'Instala la aplicación y conversa con BENI sobre tu workspace.',
    },
    busca: {
      em: p => `Buscar en ${p}`,
    },
    semEquivalente: {
      titulo: p => `${p} todavía no tiene esta página`,
      texto: pagina => `Venías de "${pagina}". Como no hay equivalente aquí, esta es la primera página de la documentación.`,
      voltar: p => `Volver a ${p}`,
      fechar: 'Cerrar el aviso',
    },
    estados: {
      carregando: 'Cargando la documentación',
      vazioTitulo: p => `${p}: la documentación está en camino`,
      vazioTexto: 'Las primeras páginas llegan con la próxima versión. Mientras tanto, la documentación de la plataforma cubre lo que los productos tienen en común.',
      vazioAcao: 'Ver la documentación de ENSPACE',
      erroTitulo: 'No se pudo cargar esta página',
      erroTexto: 'La documentación sigue en línea. Inténtalo de nuevo en unos instantes.',
      erroAcao: 'Intentar de nuevo',
      bloqueadoTitulo: 'Esta página está restringida',
      bloqueadoTexto: 'Entra con tu cuenta ENSPACE para leer el contenido restringido de este producto.',
      bloqueadoAcao: 'Acceso',
    },
    andaime: {
      estado: 'Prototipo · estado',
      estados: {
        cheio: 'Documentación llena',
        vazio: 'Producto sin contenido',
        carregando: 'Cargando',
        erro: 'Error',
        bloqueado: 'Sin permiso',
        hoje: 'Cómo es hoy',
      },
      porTras: 'Por detrás',
      endereco: 'Dirección propuesta',
    },
  },
}
