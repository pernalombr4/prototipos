/**
 * O estado do protótipo, em memória: recarregar a página volta tudo ao começo.
 *
 * Uma denúncia enviada pela página pública entra na lista do comitê, com o
 * criador "anonymous". A resposta do comitê aparece para o denunciante quando
 * ele entra com protocolo e senha. É o ciclo que a proposta precisa provar.
 */
import {
  ANONYMOUS, type Denuncia, type Formulario, HOJE, type Mensagem, type RegistroDeAuditoria,
  auditoria as auditoriaInicial, denuncias as denunciasIniciais, emailsAutomaticos as emailsIniciais,
  formularios as formulariosIniciais, horaCheia, mensagens as mensagensIniciais, novaSenha, novoProtocolo, somarDias,
} from './mocks'

export type Tela = 'formularios' | 'spaceflow' | 'itens' | 'publico' | 'acompanhar'
export type Cenario = 'normal' | 'vazio' | 'pico' | 'falha'
export type AbaDoItem = 'visao' | 'canal' | 'comentarios' | 'auditoria' | 'tarefas' | 'anexos' | 'emails'

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

  /** Denúncias: o item aberto no painel e a aba. */
  const itemAberto = useState<number | null>('fa-item-aberto', () => null)
  const abaDoItem = useState<AbaDoItem>('fa-aba-item', () => 'visao')

  /** Spaceflow: o nó aberto. */
  const noAberto = useState<string | null>('fa-no-aberto', () => null)

  /** Página pública: o passo e o comprovante do último envio. */
  const passoPublico = useState<'formulario' | 'recebida'>('fa-passo-publico', () => 'formulario')
  const ultimoEnvio = useState<{ protocolo: string, senha: string, retornoAte: Date } | null>('fa-ultimo-envio', () => null)

  /** Acompanhamento: quem entrou (id do item) e as tentativas erradas. */
  const sessaoDoDenunciante = useState<number | null>('fa-sessao', () => null)
  const tentativas = useState<number>('fa-tentativas', () => 0)

  const formularioDoCanal = computed(() => formularios.value[0]!)

  const listaDoComite = computed(() => cenario.value === 'vazio' ? [] : denuncias.value)

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
   * O envio da página pública. O que a proposta grava:
   *  - criador = anonymous, sem `request_email`, sem IP;
   *  - hora cheia;
   *  - do e-mail, só o fato de existir aviso (o endereço iria para o cofre).
   */
  function registrarDenuncia(dados: Omit<Denuncia['data'], 'protocolo' | 'situacao' | 'retorno_ate' | 'responsavel'>) {
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
      reference: `DEN${crypto.randomUUID().replace(/-/g, '').slice(0, 29).toUpperCase()}`,
      user: ANONYMOUS.id,
      form: f.id,
      ignore_triggers: false,
      stage_status: null,
      status: 'active',
      isDraft: false,
      data: { ...dados, protocolo, situacao: 'nova', retorno_ate: retornoAte.toISOString().slice(0, 10), responsavel: null },
      senhaDoPrototipo: senha,
      mensagensNovas: 0,
    }
    denuncias.value = [nova, ...denuncias.value]
    mensagens.value = [...mensagens.value, { id: id * 100, itemId: id, autor: 'sistema', texto: f.mensagemDeConfirmacao, quando: recebida }]
    auditoria.value = [{ id: `a${id}`, itemId: id, quem: ANONYMOUS.id, acao: 'criou', quando: recebida }, ...auditoria.value]
    if (dados.aviso_por_email) {
      emails.value = [{ id: Date.now(), itemId: id, criadoEm: recebida, status: 'enviado', assunto: 'Recebemos sua denúncia' }, ...emails.value]
    }
    ultimoEnvio.value = { protocolo, senha, retornoAte }
    return nova
  }

  function responder(itemId: number, autor: 'comite' | 'denunciante', texto: string, membro?: number, anexos?: string[]) {
    const d = denuncias.value.find(x => x.id === itemId)
    if (!d) return
    // A mensagem do denunciante não leva hora exata: só o dia e a hora cheia.
    const quando = autor === 'denunciante' ? horaCheia(agora()) : agora()
    mensagens.value = [...mensagens.value, { id: Date.now(), itemId, autor, membro, texto, quando, anexos }]
    if (autor === 'denunciante') d.mensagensNovas += 1
    if (autor === 'comite') {
      if (d.data.situacao === 'nova') d.data.situacao = 'em_analise'
      if (d.data.aviso_por_email) {
        emails.value = [{ id: Date.now() + 1, itemId, criadoEm: agora(), status: 'enviado', assunto: 'Há uma atualização na sua denúncia' }, ...emails.value]
      }
    }
  }

  function entrarComoDenunciante(protocolo: string, senha: string) {
    const d = denuncias.value.find(x => x.data.protocolo === protocolo.trim().toUpperCase() && x.senhaDoPrototipo === senha.trim().toUpperCase())
    if (!d) {
      tentativas.value += 1
      return false
    }
    tentativas.value = 0
    sessaoDoDenunciante.value = d.id
    return true
  }

  return {
    tela, cenario, destacar, formularios, denuncias, mensagens, auditoria, emails,
    vistaDaCategoria, formularioAberto, abaDoFormulario, itemAberto, abaDoItem, noAberto,
    passoPublico, ultimoEnvio, sessaoDoDenunciante, tentativas,
    formularioDoCanal, listaDoComite,
    ir, registrarDenuncia, responder, entrarComoDenunciante,
  }
}

/** O contorno tracejado do andaime ("Mostrar o que muda"). */
export function useMarcaDeProposta() {
  const destacar = useState<boolean>('fa-destacar', () => false)
  return computed(() => destacar.value
    ? 'outline-2 outline-dashed outline-offset-2 outline-warning rounded-md'
    : '')
}
