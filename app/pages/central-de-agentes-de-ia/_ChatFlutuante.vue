<script setup lang="ts">
/**
 * O chat flutuante do BENI, no canto da tela, com a forma de hoje: agente no
 * topo, Histórico, Nova conversa, Expandir e Fechar; embaixo, anexar, o
 * seletor de modelo e Enviar.
 *
 * PROPOSTA nele:
 * - o seletor de modelo mostra só os permitidos e diz qual é o padrão; com 1
 *   modelo, fica fixo (demanda 2). Ao trocar de agente, volta ao padrão dele;
 * - "Lê 2 arquivos de referência", discreto, abre a lista (demanda 3);
 * - o cartão de confirmação antes de gravar, enviar ou cobrar (demanda 1);
 * - a minuta com os campos destacados e editáveis (demanda 5).
 *
 * MAQUETE: a resposta a uma mensagem nova é um texto de exemplo.
 */
import type { Textos } from './textos'
import Conversa from './_Conversa.vue'
import SeletorDeModelo from './_SeletorDeModelo.vue'
import AvatarDoAgente from './_AvatarDoAgente.vue'
import { agentesDoSistema } from './mocks'
import { MODELO_PADRAO_DO_SERVIDOR } from './catalogo'
import { idDaMensagem, respostaDeExemplo, roteiroDeConfirmacao, roteiroDeLote, roteiroDeMinuta, type Mensagem } from './conversa'
import { conhecimentoDoAgente, espera, iconeDoDocumento, useAgentes, useArquivos, usePoliticas, useTela } from './estado'

const props = defineProps<{ t: Textos }>()
const tela = useTela()
const agentes = useAgentes()
const arquivos = useArquivos()
const politicas = usePoliticas()

const expandido = ref(false)
const mensagens = ref<Mensagem[]>([])
const texto = ref('')
const anexo = ref<string | null>(null)
const pensando = ref(false)
const modelo = ref<string | null>(null)
const corpo = ref<HTMLElement>()

/* O agente do chat: os do workspace ativos e os do sistema. */
const doSistema = computed(() => agentesDoSistema.map(s => ({
  slug: s.slug, name: s.name, cor: s.cor, model: MODELO_PADRAO_DO_SERVIDOR,
  modelosPermitidos: politicas.value.modelos, arquivos: [] as string[], sugestoes: [] as string[], description: s.description,
})))
const disponiveis = computed(() => [
  ...agentes.value.filter(a => a.status === 'active'),
  ...doSistema.value,
])
const agente = computed(() => disponiveis.value.find(a => a.slug === tela.value.chatAgente) ?? disponiveis.value[0]!)

const itensDeAgente = computed(() => [
  disponiveis.value.filter(a => !agentesDoSistema.some(s => s.slug === a.slug)).map(a => ({ label: a.name, value: a.slug, cor: a.cor })),
  doSistema.value.map(a => ({ label: a.name, value: a.slug, cor: a.cor })),
])

/* Os permitidos do agente que as Políticas liberam. */
const permitidos = computed(() => agente.value.modelosPermitidos.filter(id => politicas.value.modelos.includes(id) || id === agente.value.model))
const modeloEmUso = computed(() => modelo.value ?? agente.value.model)

const saber = computed(() => conhecimentoDoAgente(agente.value, arquivos.value))
const refs = computed(() => saber.value.todos)

function montar() {
  const m = modeloEmUso.value
  const c = tela.value.cenario
  if (c === 'confirmacao') mensagens.value = roteiroDeConfirmacao(tela.value.cartao, m)
  else if (c === 'lote') mensagens.value = roteiroDeLote(tela.value.cartao, m)
  else if (c === 'minuta') mensagens.value = roteiroDeMinuta(m)
  else mensagens.value = []
  rolarParaOFim()
}

/* Trocar de agente volta o seletor ao padrão dele e abre conversa nova. */
watch(() => tela.value.chatAgente, () => { modelo.value = null })
watch(() => [tela.value.chatAberto, tela.value.cenario, tela.value.cartao, tela.value.chatAgente], () => {
  if (tela.value.chatAberto) montar()
}, { immediate: true })

function novaConversa() {
  tela.value.cenario = 'novo'
  mensagens.value = []
}

async function rolarParaOFim() {
  await nextTick()
  corpo.value?.scrollTo({ top: corpo.value.scrollHeight, behavior: 'smooth' })
}

async function enviar(t?: string) {
  const msg = (t ?? texto.value).trim()
  if (!msg && !anexo.value) return
  const partes: Mensagem['partes'] = []
  if (anexo.value) partes.push({ tipo: 'anexo', nome: anexo.value })
  if (msg) partes.push({ tipo: 'texto', texto: msg })
  mensagens.value.push({ id: idDaMensagem(), papel: 'user', partes })
  const comArquivo = !!anexo.value
  texto.value = ''
  anexo.value = null
  pensando.value = true
  rolarParaOFim()
  await espera(1200)
  pensando.value = false
  mensagens.value.push(respostaDeExemplo(msg || '...', modeloEmUso.value, comArquivo))
  rolarParaOFim()
}

const entradaDeArquivo = ref<HTMLInputElement>()
function anexar(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) anexo.value = f.name
  ;(e.target as HTMLInputElement).value = ''
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-3 scale-[0.98]"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="opacity-0 translate-y-3"
  >
    <section
      v-if="tela.chatAberto"
      class="fixed bottom-16 right-4 z-30 flex origin-bottom-right flex-col overflow-hidden rounded-xl bg-default shadow-2xl ring ring-default transition-[width,height] duration-300"
      :class="expandido ? 'h-[min(52rem,calc(100vh-6rem))] w-[min(56rem,calc(100vw-2rem))]' : 'h-[min(42rem,calc(100vh-6rem))] w-[min(27rem,calc(100vw-2rem))]'"
      :aria-label="t.chat.abrir"
    >
      <!-- Topo, como hoje -->
      <header class="flex items-center gap-1 border-b border-default px-2 py-1.5">
        <USelectMenu
          :model-value="tela.chatAgente"
          :items="itensDeAgente"
          value-key="value"
          variant="ghost"
          size="sm"
          class="min-w-0 flex-1"
          :search-input="false"
          :aria-label="t.chat.selecionarAgente"
          @update:model-value="(v: string) => { tela.chatAgente = v; tela.cenario = 'novo' }"
        >
          <template #default>
            <span class="flex min-w-0 items-center gap-2">
              <AvatarDoAgente :cor="agente.cor" tamanho="xs" />
              <span class="truncate font-medium text-highlighted">{{ agente.name }}</span>
            </span>
          </template>
          <template #item-leading="{ item }">
            <AvatarDoAgente :cor="(item as any).cor" tamanho="xs" />
          </template>
        </USelectMenu>
        <UTooltip :text="t.chat.historico"><UButton icon="i-lucide-history" color="neutral" variant="ghost" size="sm" :aria-label="t.chat.historico" /></UTooltip>
        <UTooltip :text="t.chat.novaConversa"><UButton icon="i-lucide-square-pen" color="neutral" variant="ghost" size="sm" :aria-label="t.chat.novaConversa" @click="novaConversa" /></UTooltip>
        <UTooltip :text="t.chat.expandir"><UButton :icon="expandido ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'" color="neutral" variant="ghost" size="sm" :aria-label="t.chat.expandir" @click="expandido = !expandido" /></UTooltip>
        <UTooltip :text="t.chat.fechar"><UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t.chat.fechar" @click="tela.chatAberto = false" /></UTooltip>
      </header>

      <!-- Conhecimento: discreto, abre a lista (demanda 3) -->
      <div v-if="refs.length" class="flex justify-center border-b border-default bg-elevated/40 py-1">
        <UPopover :content="{ side: 'bottom' }">
          <UButton :label="t.chat.referencia(refs.length)" icon="i-lucide-book-marked" color="neutral" variant="link" size="xs" />
          <template #content>
            <div class="w-72 p-3">
              <p class="text-sm font-medium text-highlighted">{{ t.chat.referenciaTitulo }}</p>
              <p class="mb-2 text-xs text-muted">{{ saber.modo === 'inteiro' ? t.chat.referenciaInteiro : t.chat.referenciaTrechos }}</p>
              <template v-for="g in [{ titulo: t.conhecimento.workspaceTitulo, docs: saber.doWorkspace }, { titulo: t.conhecimento.agenteTitulo, docs: saber.doAgente }]" :key="g.titulo">
                <p v-if="g.docs.length" class="mt-2 mb-1 text-[11px] font-semibold uppercase tracking-wide text-dimmed">{{ g.titulo }}</p>
                <ul class="space-y-1.5">
                  <li v-for="a in g.docs" :key="a.id" class="flex items-center gap-2 text-xs">
                    <UIcon :name="iconeDoDocumento(a.tipo).icone" class="size-4 shrink-0" :class="iconeDoDocumento(a.tipo).cor" />
                    <span class="min-w-0 flex-1 truncate">{{ a.nome }}</span>
                    <UIcon v-if="a.fixado" name="i-lucide-pin" class="size-3.5 shrink-0 text-primary" :aria-label="t.conhecimento.fixado" />
                  </li>
                </ul>
              </template>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- Conversa -->
      <div ref="corpo" class="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <div v-if="!mensagens.length" class="flex h-full flex-col items-center justify-center gap-3 text-center">
          <AvatarDoAgente :cor="agente.cor" tamanho="lg" />
          <div>
            <p class="font-semibold text-highlighted">{{ t.chat.boasVindas }}</p>
            <p class="text-sm text-muted">{{ agente.description || t.chat.boasVindasTexto }}</p>
          </div>
          <div v-if="agente.sugestoes.length" class="flex flex-wrap justify-center gap-2">
            <UButton
              v-for="s in agente.sugestoes"
              :key="s"
              :label="s"
              color="neutral"
              variant="outline"
              size="xs"
              class="rounded-full"
              @click="enviar(s)"
            />
          </div>
        </div>
        <Conversa v-else :t="t" :mensagens="mensagens" :cor="agente.cor" :pensando="pensando" compact />
      </div>

      <!-- Entrada -->
      <div class="border-t border-default p-2">
        <div v-if="anexo" class="mb-1.5 flex">
          <UBadge :label="anexo" icon="i-lucide-paperclip" color="neutral" variant="subtle" class="max-w-full">
            <template #trailing>
              <UButton icon="i-lucide-x" color="neutral" variant="link" size="xs" class="-my-1 p-0" :aria-label="t.conhecimento.remover" @click="anexo = null" />
            </template>
          </UBadge>
        </div>
        <UChatPrompt
          v-model="texto"
          :placeholder="t.chat.placeholder"
          variant="subtle"
          :rows="1"
          autoresize
          :maxrows="6"
          :ui="{ base: 'text-sm' }"
          @submit="enviar()"
        >
          <template #footer>
            <div class="flex min-w-0 flex-1 items-center gap-1">
              <input ref="entradaDeArquivo" type="file" accept=".pdf,.docx,.png,.jpg" class="hidden" @change="anexar">
              <UTooltip :text="t.chat.anexar">
                <UButton icon="i-lucide-paperclip" color="neutral" variant="ghost" size="xs" :aria-label="t.chat.anexar" @click="entradaDeArquivo?.click()" />
              </UTooltip>
              <SeletorDeModelo v-model="modelo" :t="t" :permitidos="permitidos" :padrao="agente.model" />
            </div>
            <UChatPromptSubmit :status="pensando ? 'submitted' : 'ready'" size="xs" :aria-label="t.chat.enviar" />
          </template>
        </UChatPrompt>
        <p class="mt-1.5 text-center text-[10px] text-dimmed">{{ t.chat.rodape }}</p>
      </div>
    </section>
  </Transition>
</template>
