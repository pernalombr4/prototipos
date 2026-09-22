/**
 * O dado desta tela: os produtos, as árvores de menu e as páginas.
 *
 * ⚠️ Nota sobre a regra 23 (mock tipado pelo `enspace-sdk-schemas`).
 * O conteúdo da documentação NÃO vem da API do ENSPACE: o docs.enspace.io é um
 * Nuxt Content, e cada página é um arquivo markdown em `content/<idioma>/...`
 * do repositório `en-docs`. Não existe (nem deveria existir) schema Zod para
 * "página de documentação" no SDK, então os tipos abaixo são locais e estão
 * marcados um a um com a origem de cada campo. O que foi copiado do produto é
 * a ESTRUTURA: a árvore de seções do `content/en/1.docs`, os status de página
 * (`published`, `draft`, `updated`, `deprecated`) e os rótulos do i18n.
 *
 * Os valores são inventados. Nenhum texto de interface leva travessão (regra 33).
 */
import type { Idioma } from '~/composables/useIdioma'

/* ------------------------------------------------------------------ *
 * PRODUTOS                                                            *
 * ------------------------------------------------------------------ */

export type ChaveDeProduto = 'enspace' | 'plugin-word' | 'beni-app'

export interface Produto {
  id: ChaveDeProduto
  /**
   * Pedaço do endereço quando o produto entra na URL.
   * Hoje a doc é `/{idioma}/docs/...`; a proposta é `/{idioma}/docs/{prefixo}/...`,
   * com o ENSPACE sem prefixo para os links de hoje continuarem valendo.
   * Decisão registrada no DECISOES.md.
   */
  prefixo: string
  /** Selo ao lado do nome, quando o produto ainda não está maduro. */
  selo?: 'beta' | 'novo'
}

/** A ordem é a ordem do menu: a plataforma primeiro, os satélites depois. */
export const produtos: Produto[] = [
  { id: 'enspace', prefixo: '' },
  { id: 'plugin-word', prefixo: 'word' },
  { id: 'beni-app', prefixo: 'beni', selo: 'beta' },
]

/* ------------------------------------------------------------------ *
 * DESTINO QUE SAI DAQUI                                               *
 *                                                                     *
 * A doc do SDK é um site próprio, com casca e navegação próprias. Ela  *
 * entra no mesmo menu porque a pergunta de quem abre o menu é sempre a *
 * mesma ("de qual produto é a documentação?"), mas não troca o         *
 * conteúdo desta página: leva embora. Por isso mora numa lista         *
 * separada, com separador no menu e seta de link externo.              *
 * ------------------------------------------------------------------ */

export interface DestinoExterno {
  id: 'sdk'
  /**
   * Endereço final. **Ainda não definido**, e é pergunta para a Mikaela:
   * o site já roda local em `/vue/start`, mas não se sabe onde ele publica.
   * Enquanto `emBreve` for verdadeiro o item nem tenta navegar.
   */
  url?: string
  /** Bloqueia o item e troca a seta de link pelo relógio de "em breve". */
  emBreve: boolean
}

export const destinosExternos: DestinoExterno[] = [
  { id: 'sdk', emBreve: true },
]

/* ------------------------------------------------------------------ *
 * NAVEGAÇÃO                                                           *
 *                                                                     *
 * Espelha o `UContentNavigation` do en-docs: título, caminho, filhos e *
 * ícone. A árvore do ENSPACE é a de hoje, item por item. As outras     *
 * duas são propostas de conteúdo, porque o conteúdo ainda não existe.  *
 * ------------------------------------------------------------------ */

export interface ItemDeNavegacao {
  /** Chave da página. Casa com `paginas` e com o dicionário de títulos. */
  chave: string
  icone?: string
  filhos?: ItemDeNavegacao[]
  /** Começa aberto no menu lateral, como a seção ativa do produto. */
  aberto?: boolean
}

export const navegacao: Record<ChaveDeProduto, ItemDeNavegacao[]> = {
  'enspace': [
    { chave: 'inicio', icone: 'i-lucide-play' },
    { chave: 'conceitos', icone: 'i-lucide-lightbulb' },
    {
      chave: 'acesso',
      icone: 'i-lucide-log-in',
      filhos: [
        { chave: 'acesso-cadastro' },
        { chave: 'acesso-autenticacao' },
        { chave: 'acesso-recuperacao' },
      ],
    },
    {
      chave: 'painel',
      icone: 'i-lucide-user',
      filhos: [
        { chave: 'painel-perfil' },
        { chave: 'painel-cobranca' },
        { chave: 'painel-integracoes' },
      ],
    },
    {
      chave: 'workspace',
      icone: 'i-lucide-network',
      aberto: true,
      filhos: [
        { chave: 'workspace-navegacao' },
        { chave: 'workspace-membros' },
        { chave: 'selo-do-documento' },
        { chave: 'workspace-materiais' },
      ],
    },
    { chave: 'modulos', icone: 'i-lucide-package' },
    { chave: 'ferramentas-de-ia', icone: 'i-lucide-sparkles' },
    { chave: 'limitacoes', icone: 'i-lucide-triangle-alert' },
  ],
  'plugin-word': [
    { chave: 'inicio', icone: 'i-lucide-play' },
    { chave: 'instalacao', icone: 'i-lucide-download' },
    {
      chave: 'escrever',
      icone: 'i-lucide-pen-line',
      aberto: true,
      filhos: [
        { chave: 'escrever-inserir-dados' },
        { chave: 'escrever-modelos' },
        { chave: 'selo-do-documento' },
      ],
    },
    { chave: 'revisao', icone: 'i-lucide-check-check' },
    { chave: 'limitacoes', icone: 'i-lucide-triangle-alert' },
  ],
  'beni-app': [
    { chave: 'inicio', icone: 'i-lucide-play' },
    { chave: 'instalacao', icone: 'i-lucide-download' },
    {
      chave: 'conversar',
      icone: 'i-lucide-message-circle',
      aberto: true,
      filhos: [
        { chave: 'conversar-primeira-conversa' },
        { chave: 'conversar-acoes' },
      ],
    },
    { chave: 'privacidade', icone: 'i-lucide-shield' },
    { chave: 'limitacoes', icone: 'i-lucide-triangle-alert' },
  ],
}

/* ------------------------------------------------------------------ *
 * PÁGINAS                                                             *
 *                                                                     *
 * Campos copiados do frontmatter real do en-docs: `title`,            *
 * `description`, `headline`, `icon`, `status`. O `corpo` e o `sumario` *
 * são a renderização, que lá vem do markdown.                         *
 * ------------------------------------------------------------------ */

export type StatusDaPagina = 'published' | 'updated' | 'draft' | 'deprecated'

export interface Bloco {
  tipo: 'paragrafo' | 'titulo' | 'aviso' | 'lista' | 'passos'
  /** Âncora do título, para o "Nesta página" acompanhar a rolagem. */
  id?: string
  texto?: Record<Idioma, string>
  itens?: Record<Idioma, string[]>
}

export interface Pagina {
  chave: string
  icone: string
  status: StatusDaPagina
  /** A seção acima do título, como no `UPageHeader` do en-docs. */
  secao: string
  corpo: Bloco[]
}

/**
 * As páginas escritas por inteiro.
 *
 * `selo-do-documento` existe no ENSPACE e no Plugin do Word, e não existe no
 * Beni App. É de propósito: é o caso que prova o que a troca de produto faz
 * quando a página equivalente não existe do outro lado.
 */
export const paginas: Record<ChaveDeProduto, Record<string, Pagina>> = {
  'enspace': {
    'inicio': {
      chave: 'inicio',
      icone: 'i-lucide-play',
      status: 'published',
      secao: 'inicio',
      corpo: [
        {
          tipo: 'titulo',
          id: 'o-que-e',
          texto: {
            'pt-BR': 'O que é o ENSPACE',
            'en': 'What ENSPACE is',
            'es': 'Qué es ENSPACE',
          },
        },
        {
          tipo: 'paragrafo',
          texto: {
            'pt-BR': 'O ENSPACE é uma plataforma de gestão operacional. Você organiza dados, automatiza processos e trabalha em equipe no mesmo lugar, pelo navegador, sem instalar nada.',
            'en': 'ENSPACE is an operational management platform. You organize data, automate processes and work as a team in one place, in the browser, with nothing to install.',
            'es': 'ENSPACE es una plataforma de gestión operativa. Organizas datos, automatizas procesos y trabajas en equipo en el mismo lugar, desde el navegador, sin instalar nada.',
          },
        },
        {
          tipo: 'paragrafo',
          texto: {
            'pt-BR': 'Cada área monta o próprio workspace: as categorias que usa, os campos que preenche e as telas que abre todo dia.',
            'en': 'Each area builds its own workspace: the categories it uses, the fields it fills in and the screens it opens every day.',
            'es': 'Cada área arma su propio workspace: las categorías que usa, los campos que completa y las pantallas que abre cada día.',
          },
        },
        {
          tipo: 'titulo',
          id: 'por-onde-comecar',
          texto: {
            'pt-BR': 'Por onde começar',
            'en': 'Where to start',
            'es': 'Por dónde empezar',
          },
        },
        {
          tipo: 'passos',
          itens: {
            'pt-BR': [
              'Crie sua conta e entre pela primeira vez.',
              'Entenda a estrutura: workspace, categoria, item e campo.',
              'Configure o workspace da sua equipe.',
              'Conheça os módulos que resolvem o resto.',
            ],
            'en': [
              'Create your account and sign in for the first time.',
              'Understand the structure: workspace, category, item and field.',
              'Set up your team workspace.',
              'Get to know the modules that handle the rest.',
            ],
            'es': [
              'Crea tu cuenta y entra por primera vez.',
              'Entiende la estructura: workspace, categoría, ítem y campo.',
              'Configura el workspace de tu equipo.',
              'Conoce los módulos que resuelven lo demás.',
            ],
          },
        },
        {
          tipo: 'aviso',
          texto: {
            'pt-BR': 'Para usar o ENSPACE é preciso assinar um plano. Cada plano define limites de usuários, registros e automações.',
            'en': 'Using ENSPACE requires a plan. Each plan sets limits for users, records and automations.',
            'es': 'Para usar ENSPACE hay que contratar un plan. Cada plan define límites de usuarios, registros y automatizaciones.',
          },
        },
      ],
    },
    'selo-do-documento': {
      chave: 'selo-do-documento',
      icone: 'i-lucide-stamp',
      status: 'updated',
      secao: 'workspace',
      corpo: [
        {
          tipo: 'titulo',
          id: 'o-que-o-selo-garante',
          texto: {
            'pt-BR': 'O que o selo garante',
            'en': 'What the seal guarantees',
            'es': 'Qué garantiza el sello',
          },
        },
        {
          tipo: 'paragrafo',
          texto: {
            'pt-BR': 'O selo é o registro de que aquele arquivo saiu do ENSPACE com um conteúdo específico, numa data específica. Quem recebe o documento confere o código do selo e vê se o arquivo continua o mesmo.',
            'en': 'The seal records that a file left ENSPACE with specific content, on a specific date. Whoever receives the document checks the seal code and sees whether the file is still the same.',
            'es': 'El sello es el registro de que ese archivo salió de ENSPACE con un contenido específico, en una fecha específica. Quien recibe el documento verifica el código del sello y ve si el archivo sigue igual.',
          },
        },
        {
          tipo: 'titulo',
          id: 'selar-um-documento',
          texto: {
            'pt-BR': 'Selar um documento',
            'en': 'Seal a document',
            'es': 'Sellar un documento',
          },
        },
        {
          tipo: 'passos',
          itens: {
            'pt-BR': [
              'Abra o item que guarda o arquivo.',
              'No campo de arquivo, escolha "Selar documento".',
              'Confira o resumo e confirme.',
              'O selo aparece no rodapé do arquivo gerado, com o código de verificação.',
            ],
            'en': [
              'Open the item that holds the file.',
              'In the file field, choose "Seal document".',
              'Check the summary and confirm.',
              'The seal appears in the footer of the generated file, with the verification code.',
            ],
            'es': [
              'Abre el ítem que guarda el archivo.',
              'En el campo de archivo, elige "Sellar documento".',
              'Revisa el resumen y confirma.',
              'El sello aparece en el pie del archivo generado, con el código de verificación.',
            ],
          },
        },
        {
          tipo: 'aviso',
          texto: {
            'pt-BR': 'Documento selado não se edita. Para mudar o conteúdo, gere uma nova versão e sele de novo.',
            'en': 'A sealed document cannot be edited. To change the content, generate a new version and seal it again.',
            'es': 'Un documento sellado no se edita. Para cambiar el contenido, genera una nueva versión y séllala otra vez.',
          },
        },
        {
          tipo: 'titulo',
          id: 'onde-conferir',
          texto: {
            'pt-BR': 'Onde conferir um selo',
            'en': 'Where to check a seal',
            'es': 'Dónde verificar un sello',
          },
        },
        {
          tipo: 'paragrafo',
          texto: {
            'pt-BR': 'Qualquer pessoa com o código confere o selo na tela pública de verificação, sem precisar de conta no ENSPACE.',
            'en': 'Anyone with the code checks the seal on the public verification page, with no ENSPACE account required.',
            'es': 'Cualquier persona con el código verifica el sello en la pantalla pública de verificación, sin necesidad de cuenta en ENSPACE.',
          },
        },
      ],
    },
  },
  'plugin-word': {
    'inicio': {
      chave: 'inicio',
      icone: 'i-lucide-play',
      status: 'published',
      secao: 'inicio',
      corpo: [
        {
          tipo: 'titulo',
          id: 'o-que-o-plugin-faz',
          texto: {
            'pt-BR': 'O que o plugin faz',
            'en': 'What the plugin does',
            'es': 'Qué hace el plugin',
          },
        },
        {
          tipo: 'paragrafo',
          texto: {
            'pt-BR': 'O plugin traz os dados do ENSPACE para dentro do Word. Você escreve o documento onde sempre escreveu e puxa da plataforma o que precisa preencher.',
            'en': 'The plugin brings ENSPACE data into Word. You write the document where you always wrote it and pull from the platform whatever needs filling in.',
            'es': 'El plugin trae los datos de ENSPACE dentro de Word. Escribes el documento donde siempre lo escribiste y traes de la plataforma lo que necesitas completar.',
          },
        },
        {
          tipo: 'lista',
          itens: {
            'pt-BR': [
              'Insere campos de um item sem copiar e colar.',
              'Guarda modelos de documento no workspace.',
              'Sela o documento pronto, sem sair do Word.',
            ],
            'en': [
              'Inserts fields from an item with no copy and paste.',
              'Keeps document templates in the workspace.',
              'Seals the finished document without leaving Word.',
            ],
            'es': [
              'Inserta campos de un ítem sin copiar y pegar.',
              'Guarda plantillas de documento en el workspace.',
              'Sella el documento terminado sin salir de Word.',
            ],
          },
        },
        {
          tipo: 'aviso',
          texto: {
            'pt-BR': 'O plugin funciona no Word para Windows, para Mac e na versão web, a partir do Microsoft 365.',
            'en': 'The plugin works in Word for Windows, for Mac and on the web, from Microsoft 365 onwards.',
            'es': 'El plugin funciona en Word para Windows, para Mac y en la versión web, desde Microsoft 365.',
          },
        },
      ],
    },
    'selo-do-documento': {
      chave: 'selo-do-documento',
      icone: 'i-lucide-stamp',
      status: 'published',
      secao: 'escrever',
      corpo: [
        {
          tipo: 'titulo',
          id: 'selar-sem-sair-do-word',
          texto: {
            'pt-BR': 'Selar sem sair do Word',
            'en': 'Seal without leaving Word',
            'es': 'Sellar sin salir de Word',
          },
        },
        {
          tipo: 'paragrafo',
          texto: {
            'pt-BR': 'O selo é o mesmo da plataforma. A diferença é o caminho: em vez de subir o arquivo para o item, você sela direto do painel do plugin e o arquivo selado volta anexado ao item.',
            'en': 'The seal is the same one from the platform. The difference is the path: instead of uploading the file to the item, you seal it straight from the plugin panel and the sealed file comes back attached to the item.',
            'es': 'El sello es el mismo de la plataforma. La diferencia es el camino: en vez de subir el archivo al ítem, sellas directo desde el panel del plugin y el archivo sellado vuelve adjunto al ítem.',
          },
        },
        {
          tipo: 'titulo',
          id: 'o-caminho',
          texto: {
            'pt-BR': 'O caminho, passo a passo',
            'en': 'The path, step by step',
            'es': 'El camino, paso a paso',
          },
        },
        {
          tipo: 'passos',
          itens: {
            'pt-BR': [
              'Com o documento aberto, abra o painel do ENSPACE.',
              'Escolha o item ao qual o documento pertence.',
              'Clique em "Selar e anexar".',
              'O Word salva, o ENSPACE sela e o arquivo volta anexado ao item.',
            ],
            'en': [
              'With the document open, open the ENSPACE panel.',
              'Choose the item the document belongs to.',
              'Click "Seal and attach".',
              'Word saves, ENSPACE seals and the file comes back attached to the item.',
            ],
            'es': [
              'Con el documento abierto, abre el panel de ENSPACE.',
              'Elige el ítem al que pertenece el documento.',
              'Haz clic en "Sellar y adjuntar".',
              'Word guarda, ENSPACE sella y el archivo vuelve adjunto al ítem.',
            ],
          },
        },
        {
          tipo: 'aviso',
          texto: {
            'pt-BR': 'Depois de selado, o documento abre no Word em modo de leitura. Para mudar o conteúdo, gere uma nova versão.',
            'en': 'Once sealed, the document opens in Word in read mode. To change the content, generate a new version.',
            'es': 'Una vez sellado, el documento abre en Word en modo de lectura. Para cambiar el contenido, genera una nueva versión.',
          },
        },
      ],
    },
  },
  'beni-app': {
    inicio: {
      chave: 'inicio',
      icone: 'i-lucide-play',
      status: 'draft',
      secao: 'inicio',
      corpo: [
        {
          tipo: 'titulo',
          id: 'quem-e-o-beni',
          texto: {
            'pt-BR': 'Quem é o BENI',
            'en': 'Who BENI is',
            'es': 'Quién es BENI',
          },
        },
        {
          tipo: 'paragrafo',
          texto: {
            'pt-BR': 'O BENI é o assistente do ENSPACE. No aplicativo, ele responde sobre o que existe no seu workspace e executa o que você pediria na tela: criar um item, mudar um status, lembrar de um prazo.',
            'en': 'BENI is the ENSPACE assistant. In the app, it answers about what exists in your workspace and does what you would ask on screen: create an item, change a status, remember a deadline.',
            'es': 'BENI es el asistente de ENSPACE. En la aplicación responde sobre lo que existe en tu workspace y ejecuta lo que pedirías en la pantalla: crear un ítem, cambiar un estado, recordar un plazo.',
          },
        },
        {
          tipo: 'titulo',
          id: 'primeira-conversa',
          texto: {
            'pt-BR': 'A primeira conversa',
            'en': 'The first conversation',
            'es': 'La primera conversación',
          },
        },
        {
          tipo: 'paragrafo',
          texto: {
            'pt-BR': 'Entre com a mesma conta do ENSPACE e escolha o workspace. O BENI só enxerga o que a sua permissão já deixava ver.',
            'en': 'Sign in with the same ENSPACE account and choose the workspace. BENI only sees what your permission already allowed you to see.',
            'es': 'Entra con la misma cuenta de ENSPACE y elige el workspace. BENI solo ve lo que tu permiso ya te dejaba ver.',
          },
        },
        {
          tipo: 'aviso',
          texto: {
            'pt-BR': 'O aplicativo está em beta. A documentação acompanha o que já está liberado e muda a cada versão.',
            'en': 'The app is in beta. This documentation follows what is already released and changes with every version.',
            'es': 'La aplicación está en beta. La documentación acompaña lo que ya está liberado y cambia en cada versión.',
          },
        },
      ],
    },
  },
}
