/**
 * O estado do protótipo, em memória: recarregar a página volta tudo ao começo.
 *
 * Uma resposta enviada pelo link público entra na lista da categoria com o
 * criador "anonymous". A resposta da equipe aparece para quem respondeu quando
 * a pessoa entra com protocolo e senha. É o ciclo que a proposta precisa provar.
 *
 * As 3 configurações da proposta são independentes (ver `Formulario` em mocks):
 * acesso sem login, respostas anônimas e acompanhamento.
 */
import {
  ANONYMOUS, type Denuncia, type Formulario, HOJE, ID_DO_CANAL, type Mensagem, type RegistroDeAuditoria,
  auditoria as auditoriaInicial, denuncias as denunciasIniciais, emailsAutomaticos as emailsIniciais,
  formularioEmBranco, formularios as formulariosIniciais, horaCheia, mensagens as mensagensIniciais,
  novaSenha, novoProtocolo, somarDias, MODELO_DO_CANAL, camposComRisco, pontosForaDoFormulario,
} from './mocks'

export type Tela = 'formularios' | 'construtor' | 'spaceflow' | 'itens' | 'publico' | 'acompanhar' | 'fora'
export type Jornada = 'configurador' | 'respondente'
/** ANDAIME: o que acontece fora do ENSPACE (o cartaz e a caixa de e-mail pessoal). */
export type CenaDeFora = 'cartaz' | 'email'
export type Cenario = 'normal' | 'vazio' | 'pico' | 'falha'
export type AbaDoItem = 'visao' | 'conversa' | 'comentarios' | 'auditoria' | 'tarefas' | 'anexos' | 'emails'

/** O instante de um registro novo: o dia do protótipo com a hora do relógio. */
export function agora() {
  const d = new Date()
  return new Date(HOJE.getFullYear(), HOJE.getMonth(), HOJE.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())
}

export function useFormularioAnonimo() {
  const tela = useState<Tela>('fa-tela', () => 'publico')
  const cenario = useState<Cenario>('fa-cenario', () => 'normal')
  const destacar = useState<boolean>('fa-destacar', () => false)

  const formularios = useState<Formulario[]>('fa-formularios', () => structuredClone(formulariosIniciais))
  const denuncias = useState<Denuncia[]>('fa-denuncias', () => structuredClone(denunciasIniciais))
  const mensagens = useState<Mensagem[]>('fa-mensagens', () => structuredClone(mensagensIniciais))
  const auditoria = useState<RegistroDeAuditoria[]>('fa-auditoria', () => structuredClone(auditoriaInicial))
  const emails = useState('fa-emails', () => structuredClone(emailsIniciais))

  /** Configurações › Categorias: painel, lista de formulários e o formulário aberto. */
  const vistaDaCategoria = useState<'painel' | 'formularios'>('fa-vista-categoria', () => 'formularios')
  const formularioAberto = useState<number | null>('fa-formulario-aberto', () => null)
  const abaDoFormulario = useState<string>('fa-aba-formulario', () => 'definicao')
  /** "Criar +" abre o mesmo painel da edição, com o formulário em branco. */
  const emCriacao = useState<boolean>('fa-em-criacao', () => false)

  /** Lista da categoria: o item aberto no painel e a aba. */
  const itemAberto = useState<number | null>('fa-item-aberto', () => null)
  const abaDoItem = useState<AbaDoItem>('fa-aba-item', () => 'visao')

  /** Spaceflow: o nó aberto. */
  const noAberto = useState<string | null>('fa-no-aberto', () => null)

  /** Página pública: o passo e o comprovante do último envio. */
  const passoPublico = useState<'formulario' | 'enviada'>('fa-passo-publico', () => 'formulario')
  const ultimoEnvio = useState<{ protocolo: string, senha: string, retornoAte: Date, acompanhamento: boolean } | null>('fa-ultimo-envio', () => null)

  /** Acompanhamento: quem entrou (id do item) e as tentativas erradas. */
  const sessao = useState<number | null>('fa-sessao', () => null)
  const tentativas = useState<number>('fa-tentativas', () => 0)

  /* ---------- o formulário da jornada e a conferência ---------- */

  const formularioDoCanal = computed(() => formularios.value.find(f => f.id === ID_DO_CANAL)!)

  /** O formulário existe na lista. A jornada do configurador começa sem ele. */
  const canalCriado = useState<boolean>('fa-canal-criado', () => true)
  /** Os campos do formulário, na ordem do construtor. */
  const blocos = useState<string[]>('fa-blocos', () => [...MODELO_DO_CANAL])
  const revisaoAberta = useState<boolean>('fa-revisao', () => false)
  const ativadoAberto = useState<boolean>('fa-ativado', () => false)
  /** Pontos de fora do formulário que o configurador já corrigiu na conferência. */
  const resolvidos = useState<string[]>('fa-resolvidos', () => [])
  /** Envio de teste do configurador: vira item marcado "Teste". */
  const modoTeste = useState<boolean>('fa-modo-teste', () => false)
  /** Pausa do link sem login (faixa da lista). */
  const linkPausado = useState<boolean>('fa-link-pausado', () => false)

  /** O formulário em conferência: o que pediu "Conferir anonimato". */
  const emRevisao = useState<number>('fa-em-revisao', () => ID_DO_CANAL)
  const formularioEmRevisao = computed(() => formularios.value.find(f => f.id === emRevisao.value) ?? formularioDoCanal.value)

  /** Os blocos montados no protótipo são os do formulário da jornada; os outros chegam sem campo de risco. */
  const problemasDoFormulario = computed(() => emRevisao.value === ID_DO_CANAL ? camposComRisco.filter(c => blocos.value.includes(c.refId)) : [])
  const pontosAbertos = computed(() => pontosForaDoFormulario.filter(p => !resolvidos.value.includes(p.id)))
  const bloqueiaAtivar = computed(() => problemasDoFormulario.value.some(c => c.risco === 'email' || c.risco === 'membro_logado')
    || pontosAbertos.value.some(p => p.severidade === 'bloqueia'))

  /** Quando o formulário foi criado na jornada: as respostas de exemplo ficam de fora. */
  const inicioDoCanal = useState<Date | null>('fa-inicio-canal', () => null)

  /** "Criar +": painel de edição com o formulário em branco. */
  function criarFormulario() {
    emCriacao.value = true
    abaDoFormulario.value = 'definicao'
    formularioAberto.value = ID_DO_CANAL
  }

  /** O primeiro Salvar do formulário novo: entra na lista e o painel continua aberto. */
  function concluirCriacao(f: Formulario) {
    f.criadoEm = agora()
    formularios.value = [f, ...formularios.value.filter(x => x.id !== f.id)]
    inicioDoCanal.value = horaCheia(agora())
    canalCriado.value = true
    emCriacao.value = false
  }

  function abrirConferencia(id: number) {
    emRevisao.value = id
    revisaoAberta.value = true
  }

  function ativarAnonimato() {
    formularioEmRevisao.value.anonimatoAtivo = true
    revisaoAberta.value = false
    ativadoAberto.value = true
  }

  /** Volta o protótipo ao começo da jornada do configurador: categoria sem o formulário. */
  function comecarDoZero() {
    formularios.value = [formularioEmBranco(), ...formularios.value.filter(x => x.id !== ID_DO_CANAL)]
    canalCriado.value = false
    resolvidos.value = []
    blocos.value = []
    formularioAberto.value = null
    emCriacao.value = false
  }

  /* ---------- retorno a quem respondeu ---------- */

  /** A mensagem do nó "Responder a quem enviou": vale quando o retorno é pelo Spaceflow. */
  const mensagemDoNo = useState<string>('fa-mensagem-no', () => 'Recebemos sua resposta e ela já está com a equipe responsável. Protocolo {{protocolo}}. Respondemos até {{responder_ate}}.')

  /** O texto que chega a quem respondeu logo depois do envio, venha do formulário ou do fluxo. */
  function textoDeRecebimento(protocolo: string, responderAte: Date) {
    const f = formularioDoCanal.value
    if (f.retorno === 'automatico') return f.mensagemDeConfirmacao
    return mensagemDoNo.value
      .replaceAll('{{protocolo}}', protocolo)
      .replaceAll('{{responder_ate}}', responderAte.toLocaleDateString('pt-BR'))
      .replaceAll('{{data.tipo}}', '')
  }

  /* ---------- guia ---------- */

  const cena = useState<CenaDeFora>('fa-cena', () => 'cartaz')
  const jornada = useState<Jornada | null>('fa-jornada', () => null)
  const passo = useState<number>('fa-passo', () => 0)

  /** A resposta da pessoa: a última enviada pelo link ou a de exemplo. */
  const respostaDaPessoa = computed(() => {
    const ultima = ultimoEnvio.value ? denuncias.value.find(d => d.data.protocolo === ultimoEnvio.value!.protocolo) : null
    return ultima ?? denuncias.value.find(d => d.id === 81202) ?? denuncias.value[0]!
  })

  function concluir(itemId: number, texto: string, membro: number) {
    const d = denuncias.value.find(x => x.id === itemId)
    if (!d) return
    responder(itemId, 'equipe', texto, membro)
    d.data.situacao = 'concluida'
  }

  const listaDaCategoria = computed(() => cenario.value === 'vazio' ? [] : inicioDoCanal.value ? denuncias.value.filter(d => +d.created_at >= +inicioDoCanal.value!) : denuncias.value)

  function ir(t: Tela, opcoes?: { item?: number | null, aba?: AbaDoItem, formulario?: number | null, abaDoFormulario?: string, no?: string | null }) {
    tela.value = t
    if (opcoes?.item !== undefined) itemAberto.value = opcoes.item
    if (opcoes?.aba) abaDoItem.value = opcoes.aba
    if (opcoes?.formulario !== undefined) {
      vistaDaCategoria.value = 'formularios'
      formularioAberto.value = opcoes.formulario
    }
    if (opcoes?.abaDoFormulario) abaDoFormulario.value = opcoes.abaDoFormulario
    if (opcoes?.no !== undefined) noAberto.value = opcoes.no
  }

  /**
   * O envio pelo link público. Com respostas anônimas, o que a proposta grava:
   *  - criador = anonymous, sem `request_email`, sem IP;
   *  - hora cheia;
   *  - do e-mail de aviso, só o fato de existir (o endereço iria para o cofre).
   * Protocolo e senha só existem com acompanhamento.
   */
  function registrarResposta(dados: Omit<Denuncia['data'], 'protocolo' | 'situacao' | 'retorno_ate' | 'responsavel'>) {
    const f = formularioDoCanal.value
    const recebida = horaCheia(agora())
    const protocolo = novoProtocolo()
    const senha = novaSenha()
    const id = Math.max(...denuncias.value.map(d => d.id), 81000) + 1
    const retornoAte = somarDias(recebida, f.prazoDeRetornoDias)
    const nova: Denuncia = {
      id,
      created_at: recebida,
      updated_at: recebida,
      deleted_at: null,
      reference: `OUV${crypto.randomUUID().replace(/-/g, '').slice(0, 29).toUpperCase()}`,
      user: ANONYMOUS.id,
      form: f.id,
      ignore_triggers: false,
      stage_status: null,
      status: 'active',
      isDraft: false,
      data: { ...dados, protocolo, situacao: 'nova', retorno_ate: retornoAte.toISOString().slice(0, 10), responsavel: null },
      senhaDoPrototipo: senha,
      mensagensNovas: 0,
      teste: modoTeste.value,
    }
    denuncias.value = [nova, ...denuncias.value]
    if (f.acompanhamento) {
      mensagens.value = [...mensagens.value, { id: id * 100, itemId: id, autor: 'sistema', texto: textoDeRecebimento(protocolo, retornoAte), quando: recebida }]
    }
    auditoria.value = [{ id: `a${id}`, itemId: id, quem: ANONYMOUS.id, acao: 'criou', quando: recebida }, ...auditoria.value]
    if (dados.aviso_por_email) {
      emails.value = [{ id: Date.now(), itemId: id, criadoEm: recebida, status: 'enviado', assunto: 'Recebemos sua resposta' }, ...emails.value]
    }
    ultimoEnvio.value = { protocolo, senha, retornoAte, acompanhamento: f.acompanhamento }
    return nova
  }

  function responder(itemId: number, autor: 'equipe' | 'pessoa', texto: string, membro?: number, anexos?: string[]) {
    const d = denuncias.value.find(x => x.id === itemId)
    if (!d) return
    // A mensagem de quem respondeu não leva hora exata: só o dia e a hora cheia.
    const quando = autor === 'pessoa' ? horaCheia(agora()) : agora()
    mensagens.value = [...mensagens.value, { id: Date.now(), itemId, autor, membro, texto, quando, anexos }]
    if (autor === 'pessoa') d.mensagensNovas += 1
    if (autor === 'equipe') {
      if (d.data.situacao === 'nova') d.data.situacao = 'em_analise'
      if (d.data.aviso_por_email) {
        emails.value = [{ id: Date.now() + 1, itemId, criadoEm: agora(), status: 'enviado', assunto: 'Há uma atualização na sua resposta' }, ...emails.value]
      }
    }
  }

  function entrarComProtocolo(protocolo: string, senha: string) {
    const d = denuncias.value.find(x => x.data.protocolo === protocolo.trim().toUpperCase() && x.senhaDoPrototipo === senha.trim().toUpperCase())
    if (!d) {
      tentativas.value += 1
      return false
    }
    tentativas.value = 0
    sessao.value = d.id
    return true
  }

  return {
    tela, cenario, destacar, formularios, denuncias, mensagens, auditoria, emails,
    vistaDaCategoria, formularioAberto, abaDoFormulario, emCriacao, itemAberto, abaDoItem, noAberto,
    passoPublico, ultimoEnvio, sessao, tentativas,
    formularioDoCanal, listaDaCategoria, inicioDoCanal,
    canalCriado, blocos, revisaoAberta, ativadoAberto, resolvidos, modoTeste, linkPausado, emRevisao, formularioEmRevisao,
    problemasDoFormulario, pontosAbertos, bloqueiaAtivar, criarFormulario, concluirCriacao, abrirConferencia, ativarAnonimato, comecarDoZero,
    cena, jornada, passo, respostaDaPessoa, concluir, mensagemDoNo, textoDeRecebimento,
    ir, registrarResposta, responder, entrarComProtocolo,
  }
}

/** O contorno tracejado do andaime ("Mostrar o que muda"). */
export function useMarcaDeProposta() {
  const destacar = useState<boolean>('fa-destacar', () => false)
  return computed(() => destacar.value
    ? 'outline-2 outline-dashed outline-offset-2 outline-warning rounded-md'
    : '')
}
