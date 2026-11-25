<script setup lang="ts">
/**
 * PROPOSTA (rodada 6): a conversa do "Pedir ao BENI". A redatora perguntou
 * "prototipe o 'pedir ao beni' do botão criar. como seria a interação?".
 *
 * O que o produto já tem (en-space@develop be2a5d850): o BENI AI abre como
 * janela flutuante sobre qualquer tela (`src/components/ai/AiChatFloat.vue`,
 * sobre o `EnAiChatsSharedFloat` do SDK) e como página
 * (`/workspaces/:ws/ai/chat`), que aceita o texto vindo de fora em `?prompt=`.
 * A conversa aqui é essa janela, aberta já com o pedido:
 *
 * 1. o texto digitado no Criar entra como a 1ª mensagem (o botão do widget
 *    BENI abre a conversa vazia, com o cursor no campo);
 * 2. o BENI responde com um rascunho em cartão: tarefa rápida, item na
 *    categoria que ele reconheceu (com o formulário, quando há mais de 1) ou
 *    a sugestão de uma categoria nova;
 * 3. a pessoa confere e escolhe: Criar, Revisar no formulário (abre o mesmo
 *    modal do Criar, preenchido) ou Descartar. Nada nasce sem o clique;
 * 4. criado, o cartão vira a confirmação com o número e o Abrir, e o item ou
 *    a tarefa entra nos widgets da Home na hora.
 * Pergunta, ou pedido que ele não entende, recebe a ajuda com exemplos.
 *
 * MAQUETE: quem entende o texto é o `beni.ts` (palavra-chave), não a IA.
 *
 * Componentes: `UChatMessages`, `UChatPrompt`, `UChatPromptSubmit`,
 * `UChatShimmer`, `USelect`, `UButton`, `UBadge`, `UTooltip` (MCP nuxt-ui).
 * A janela fixa no canto é o desenho do BENI AI de develop; o Nuxt UI não tem
 * janela flutuante não modal (DECISOES.md, rodada 6).
 */
import type { Categoria, TarefaDaHome } from './mocks'
import { categoria, pessoa } from './mocks'
import { dinheiro, prazoDaTarefa } from './formatar'
import type { Rascunho } from './beni'
import { entender } from './beni'
import type { DadosDaTarefa } from './_ModalNovaTarefa.vue'
import type { DadosDoItem } from './_ModalNovoItem.vue'
import AvatarDoBeni from './_AvatarDoBeni.vue'
import type { AgenteDeIA } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  nome: string
  /** As categorias que a pessoa acessa. */
  categorias: Categoria[]
  resumo: { icone: string, texto: string }[]
  /** O pedido que abriu a conversa; `n` muda a cada pedido novo. */
  pedido?: { texto: string, n: number }
  /**
   * Rodada 7: o agente escolhido no widget Agentes de IA. Sem ele, ou com o
   * BENI, é a conversa do BENI, que monta rascunho de item e de tarefa.
   */
  agente?: AgenteDeIA | null
  criarTarefa: (d: DadosDaTarefa) => string
  criarItem: (categoria: string, formulario: string | undefined, d: DadosDoItem) => string
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{
  revisarTarefa: [d: DadosDaTarefa]
  revisarItem: [categoria: string, formulario: string | undefined, d: DadosDoItem]
  abrir: [destino: string]
  telaCheia: []
}>()

interface Mensagem { id: string, role: 'user' | 'assistant', parts: { type: 'text', text: string }[] }
interface Cartao { r: Rascunho, estado: 'aberto' | 'criado' | 'revisando' | 'descartado', referencia?: string, formulario?: string }

const mensagens = ref<Mensagem[]>([])
const cartoes = ref<Record<string, Cartao>>({})
const status = ref<'ready' | 'submitted'>('ready')
const texto = ref('')
let seq = 0
let timer: ReturnType<typeof setTimeout> | undefined

function novaConversa() {
  clearTimeout(timer)
  mensagens.value = []
  cartoes.value = {}
  status.value = 'ready'
  texto.value = ''
}

function respostaDe(r: Rascunho) {
  const t = props.t.beniChat
  if (r.tipo === 'tarefa') return t.respostaTarefa
  if (r.tipo === 'item') return t.respostaItem(categoria(r.categoria)?.name ?? '')
  if (r.tipo === 'categoria') return t.respostaCategoria
  if (r.resumo && props.resumo.length) return [t.respostaResumo, ...props.resumo.map(l => `• ${l.texto}`)].join('\n')
  return t.respostaAjuda
}

/** Outro agente que não o BENI: a resposta é do agente, e o protótipo não a imita. */
const outroAgente = computed(() => props.agente && props.agente.slug !== 'beni' ? props.agente : null)
watch(() => props.agente?.slug, () => novaConversa())

function enviar(valor = texto.value) {
  const v = valor.trim()
  if (!v || status.value !== 'ready') return
  texto.value = ''
  mensagens.value = [...mensagens.value, { id: `u${++seq}`, role: 'user', parts: [{ type: 'text', text: v }] }]
  status.value = 'submitted'
  const r = entender(v, props.categorias)
  timer = setTimeout(() => {
    const id = `a${++seq}`
    if (outroAgente.value) {
      mensagens.value = [...mensagens.value, { id, role: 'assistant', parts: [{ type: 'text', text: props.t.iaW.respostaDoAgente(outroAgente.value.nome) }] }]
      status.value = 'ready'
      return
    }
    mensagens.value = [...mensagens.value, { id, role: 'assistant', parts: [{ type: 'text', text: respostaDe(r) }] }]
    if (r.tipo !== 'ajuda' || !r.resumo) {
      cartoes.value = { ...cartoes.value, [id]: { r, estado: 'aberto', formulario: r.tipo === 'item' ? r.formulario : undefined } }
    }
    status.value = 'ready'
  }, 1100)
}

watch(() => props.pedido?.n, () => {
  if (!props.pedido) return
  if (props.pedido.texto.trim()) enviar(props.pedido.texto)
}, { immediate: true })

function criar(id: string) {
  const c = cartoes.value[id]
  if (!c) return
  if (c.r.tipo === 'tarefa') c.referencia = props.criarTarefa(c.r.dados)
  else if (c.r.tipo === 'item') c.referencia = props.criarItem(c.r.categoria, c.formulario, c.r.dados)
  c.estado = 'criado'
}

function revisar(id: string) {
  const c = cartoes.value[id]
  if (!c) return
  if (c.r.tipo === 'tarefa') emit('revisarTarefa', c.r.dados)
  else if (c.r.tipo === 'item') emit('revisarItem', c.r.categoria, c.formulario, c.r.dados)
  c.estado = 'revisando'
}

const toast = useToast()
function montar(id: string) {
  const c = cartoes.value[id]
  if (!c) return
  toast.add({ title: props.t.beniChat.montarToast, icon: 'i-lucide-layout-grid', color: 'neutral' })
}

/** Dia e hora por extenso, para a pessoa conferir o que o BENI entendeu. */
const quando = (d: Date) => new Intl.DateTimeFormat(props.t.locale, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(d)

/** As linhas do cartão: rótulo e valor, só o que o BENI preencheu. */
function linhas(c: Cartao): { rotulo: string, valor: string, destaque?: boolean }[] {
  const f = props.t.beniChat.campos
  const r = c.r
  if (r.tipo === 'tarefa') {
    return [
      { rotulo: f.nome, valor: r.dados.name || f.semNome },
      { rotulo: f.prazo, valor: r.dados.due_date ? `${quando(r.dados.due_date)} (${prazoDaTarefa({ ...r.dados } as TarefaDaHome, props.t)})` : f.semPrazo },
      { rotulo: f.responsavel, valor: pessoa(r.dados.assigned_to)?.nome ?? '' },
      { rotulo: f.prioridade, valor: props.t.novaTarefa.prioridades[r.dados.priority ?? 'normal'], destaque: r.dados.priority === 'urgent' || r.dados.priority === 'high' },
    ]
  }
  if (r.tipo === 'item') {
    return [
      { rotulo: f.titulo, valor: r.dados.titulo || f.semNome },
      ...(r.dados.valor ? [{ rotulo: f.valor, valor: dinheiro(r.dados.valor, props.t) }] : []),
      ...(r.dados.prazo ? [{ rotulo: props.t.novoItem.prazo, valor: new Intl.DateTimeFormat(props.t.locale, { day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo' }).format(r.dados.prazo) }] : []),
      { rotulo: f.responsavel, valor: pessoa(r.dados.responsavel)?.nome ?? '' },
      ...(r.dados.urgente ? [{ rotulo: f.urgente, valor: f.sim, destaque: true }] : []),
    ]
  }
  if (r.tipo === 'categoria') {
    return [
      { rotulo: f.nomeDaCategoria, valor: r.nome || f.semNome },
      { rotulo: f.camposSugeridos, valor: props.t.beniChat.camposSugeridos.join(', ') },
    ]
  }
  return []
}

function tituloDoCartao(r: Rascunho) {
  const t = props.t.beniChat.rascunho
  if (r.tipo === 'tarefa') return { texto: t.tarefa, icone: 'i-lucide-zap' }
  if (r.tipo === 'item') {
    const c = categoria(r.categoria)
    return { texto: t.item(c?.name ?? ''), icone: c?.icon ?? 'i-lucide-file-plus' }
  }
  return { texto: t.categoria, icone: 'i-lucide-layout-grid' }
}

const formulariosDe = (slug: string) => (categoria(slug)?.formularios ?? []).map(f => ({ label: f.nome, value: f.id }))
const vazia = computed(() => !mensagens.value.length && status.value === 'ready')

defineShortcuts({ escape: () => { if (aberto.value) aberto.value = false } })
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
    enter-from-class="translate-y-3 opacity-0"
    leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
    leave-to-class="translate-y-3 opacity-0"
  >
    <section
      v-if="aberto"
      class="fixed bottom-20 right-4 z-50 flex h-[min(38rem,calc(100dvh-7rem))] w-[min(27rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl bg-default shadow-xl ring ring-default"
      role="dialog"
      :aria-label="outroAgente?.nome ?? t.beniChat.titulo"
    >
      <header class="flex items-center gap-2 border-b border-default px-3 py-2">
        <AvatarDoBeni :estado="status === 'submitted' ? 'working' : 'idle'" :cor="agente?.cor" />
        <span class="truncate text-sm font-semibold text-highlighted">{{ outroAgente?.nome ?? t.beniChat.titulo }}</span>
        <UBadge :label="t.ehMaquete" color="warning" variant="subtle" size="sm" />
        <span class="ml-auto flex items-center">
          <UTooltip :text="t.beniChat.novaConversa">
            <UButton icon="i-lucide-square-pen" color="neutral" variant="ghost" size="xs" :aria-label="t.beniChat.novaConversa" :disabled="vazia" @click="novaConversa" />
          </UTooltip>
          <UTooltip :text="t.beniChat.telaCheia">
            <UButton icon="i-lucide-maximize-2" color="neutral" variant="ghost" size="xs" :aria-label="t.beniChat.telaCheia" @click="emit('telaCheia')" />
          </UTooltip>
          <UTooltip :text="t.beniChat.fechar" :kbds="['esc']">
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.beniChat.fechar" @click="aberto = false" />
          </UTooltip>
        </span>
      </header>

      <div class="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <!-- Conversa vazia: a apresentação e os exemplos -->
        <div v-if="vazia" class="flex h-full flex-col justify-end gap-3 animate-[entrada_0.3s_ease-out_both] motion-reduce:animate-none">
          <div class="flex items-start gap-3">
            <AvatarDoBeni tamanho="md" :cor="agente?.cor" />
            <div>
              <p class="text-sm font-medium text-highlighted">
                {{ outroAgente ? t.iaW.ola(nome) : t.beniChat.ola(nome) }}
              </p>
              <p class="mt-1 text-sm text-toned">
                {{ outroAgente?.descricao ?? t.beniChat.apresentacao }}
              </p>
            </div>
          </div>
          <ul v-if="!outroAgente" class="space-y-1.5">
            <li v-for="(s, i) in t.beniChat.sugestoes" :key="s" class="animate-[entrada_0.3s_ease-out_both] motion-reduce:animate-none" :style="{ animationDelay: `${80 + i * 50}ms` }">
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-lg border border-default px-3 py-2 text-left text-sm text-toned transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-highlighted focus-visible:outline-2 focus-visible:outline-primary"
                @click="enviar(s)"
              >
                <UIcon name="i-lucide-sparkles" class="size-3.5 shrink-0 text-primary" />{{ s }}
              </button>
            </li>
          </ul>
        </div>

        <UChatMessages
          v-else
          :messages="mensagens"
          :status="status"
          :should-auto-scroll="true"
          :auto-scroll="false"
          :user="{ side: 'right', variant: 'soft' }"
          :assistant="{ side: 'left', variant: 'naked', avatar: { icon: 'i-lucide-sparkles' } }"
          compact
        >
          <template #indicator>
            <UChatShimmer :text="t.beniChat.pensando" class="px-1 text-sm" />
          </template>

          <template #content="{ message }">
            <p class="whitespace-pre-line">{{ (message as unknown as Mensagem).parts[0]?.text }}</p>

            <!-- Ajuda: os exemplos viram botões -->
            <div v-if="cartoes[message.id]?.r.tipo === 'ajuda'" class="mt-2 flex flex-col gap-1.5">
              <UButton
                v-for="s in t.beniChat.sugestoes.slice(0, 3)"
                :key="s"
                :label="s"
                icon="i-lucide-sparkles"
                color="neutral"
                variant="outline"
                size="xs"
                class="justify-start"
                :ui="{ label: 'truncate' }"
                @click="enviar(s)"
              />
            </div>

            <!-- O rascunho -->
            <div
              v-else-if="cartoes[message.id]"
              class="mt-2 overflow-hidden rounded-lg border bg-default transition-colors duration-200"
              :class="cartoes[message.id]!.estado === 'criado' ? 'border-success/40' : cartoes[message.id]!.estado === 'descartado' ? 'border-default opacity-60' : 'border-accented'"
            >
              <div class="flex items-center gap-2 border-b border-default bg-elevated/50 px-3 py-2">
                <UIcon :name="tituloDoCartao(cartoes[message.id]!.r).icone" class="size-4 shrink-0 text-primary" />
                <span class="min-w-0 flex-1 truncate text-xs font-semibold text-highlighted">{{ tituloDoCartao(cartoes[message.id]!.r).texto }}</span>
              </div>
              <dl class="space-y-1.5 px-3 py-2.5 text-sm">
                <div v-for="l in linhas(cartoes[message.id]!)" :key="l.rotulo" class="grid grid-cols-[6.5rem_1fr] gap-2">
                  <dt class="text-xs leading-5 text-muted">
                    {{ l.rotulo }}
                  </dt>
                  <dd class="min-w-0 break-words" :class="l.destaque ? 'font-medium text-error-700 dark:text-error-300' : 'text-highlighted'">
                    {{ l.valor }}
                  </dd>
                </div>
                <div v-if="cartoes[message.id]!.r.tipo === 'item' && formulariosDe((cartoes[message.id]!.r as Extract<Rascunho, { tipo: 'item' }>).categoria).length > 1" class="grid grid-cols-[6.5rem_1fr] items-center gap-2">
                  <dt class="text-xs text-muted">
                    {{ t.beniChat.campos.formulario }}
                  </dt>
                  <dd>
                    <USelect
                      v-model="cartoes[message.id]!.formulario"
                      :items="formulariosDe((cartoes[message.id]!.r as Extract<Rascunho, { tipo: 'item' }>).categoria)"
                      size="xs"
                      class="w-full"
                      :disabled="cartoes[message.id]!.estado !== 'aberto'"
                      :aria-label="t.beniChat.campos.formulario"
                    />
                  </dd>
                </div>
              </dl>

              <div v-if="cartoes[message.id]!.estado === 'aberto'" class="flex flex-wrap items-center gap-1.5 border-t border-default px-3 py-2">
                <template v-if="cartoes[message.id]!.r.tipo === 'categoria'">
                  <UButton :label="t.beniChat.acoes.montar" icon="i-lucide-layout-grid" size="xs" @click="montar(message.id)" />
                </template>
                <template v-else>
                  <UButton :label="t.beniChat.acoes.criar" icon="i-lucide-check" size="xs" @click="criar(message.id)" />
                  <UButton :label="t.beniChat.acoes.revisar" icon="i-lucide-square-pen" color="neutral" variant="outline" size="xs" @click="revisar(message.id)" />
                </template>
                <UButton :label="t.beniChat.acoes.descartar" color="neutral" variant="ghost" size="xs" class="ml-auto" @click="cartoes[message.id]!.estado = 'descartado'" />
              </div>
              <div v-else class="flex items-center gap-2 border-t border-default px-3 py-2 text-xs animate-[entrada_0.25s_ease-out_both] motion-reduce:animate-none">
                <template v-if="cartoes[message.id]!.estado === 'criado'">
                  <UIcon name="i-lucide-circle-check" class="size-4 text-success" />
                  <span class="flex-1 text-highlighted">{{ cartoes[message.id]!.r.tipo === 'tarefa' ? t.beniChat.criadaTarefa(cartoes[message.id]!.referencia ?? '') : t.beniChat.criadoItem(cartoes[message.id]!.referencia ?? '') }}</span>
                  <UButton :label="t.novaTarefa.abrir" icon="i-lucide-arrow-up-right" color="neutral" variant="outline" size="xs" @click="emit('abrir', linhas(cartoes[message.id]!)[0]?.valor ?? '')" />
                </template>
                <template v-else>
                  <UIcon :name="cartoes[message.id]!.estado === 'revisando' ? 'i-lucide-square-pen' : 'i-lucide-trash-2'" class="size-4 text-muted" />
                  <span class="text-muted">{{ cartoes[message.id]!.estado === 'revisando' ? t.beniChat.revisando : t.beniChat.descartado }}</span>
                </template>
              </div>
            </div>
          </template>
        </UChatMessages>
      </div>

      <footer class="border-t border-default p-2">
        <UChatPrompt
          v-model="texto"
          :placeholder="outroAgente ? t.iaW.agentes.conversar(outroAgente.nome) : t.beniChat.placeholder"
          variant="subtle"
          :rows="1"
          :maxrows="4"
          :status="status"
          @submit="enviar()"
        >
          <UChatPromptSubmit :status="status" size="xs" :aria-label="t.beniChat.enviar" />
        </UChatPrompt>
        <p class="mt-1.5 flex items-center gap-1 px-1 text-[11px] text-dimmed">
          <UIcon name="i-lucide-info" class="size-3" />{{ outroAgente ? t.iaW.avisoDoAgente : t.beniChat.aviso }}
        </p>
      </footer>
    </section>
  </Transition>
</template>
