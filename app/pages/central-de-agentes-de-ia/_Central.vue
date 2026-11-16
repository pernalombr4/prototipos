<script setup lang="ts">
/**
 * A lista de agentes. Continua em cards, como no produto (regra 15), com o que
 * a pessoa precisa para decidir sem abrir o agente: status, publicação, modelo,
 * ferramentas que pedem confirmação, arquivos, dono e uso.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import AvatarDoAgente from './_AvatarDoAgente.vue'
import { agentesDoSistema, EU, modelosDeAgente, pessoaPorId, type Agente } from './mocks'
import { iconeDoProvedor, modeloPorId } from './catalogo'
import { useAgentes, useTela } from './estado'

const props = defineProps<{ t: Textos }>()
const agentes = useAgentes()
const tela = useTela()
const toast = useToast()

type Filtro = 'todos' | 'sistema' | 'workspace' | 'meus'
const filtro = ref<Filtro>('todos')
const busca = ref('')
const ordem = ref<'recentes' | 'uso' | 'nome'>('recentes')
const atualizando = ref(false)

const doWorkspace = computed(() => tela.value.vazia ? [] : agentes.value)

const contagem = computed(() => ({
  todos: doWorkspace.value.length + agentesDoSistema.length,
  sistema: agentesDoSistema.length,
  workspace: doWorkspace.value.length,
  meus: doWorkspace.value.filter(a => a.dono === EU || a.editores.includes(EU)).length,
}))

const normal = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const visiveis = computed(() => {
  const q = normal(busca.value.trim())
  let lista = doWorkspace.value
  if (filtro.value === 'sistema') lista = []
  if (filtro.value === 'meus') lista = lista.filter(a => a.dono === EU || a.editores.includes(EU))
  if (q) lista = lista.filter(a => normal(`${a.name} ${a.description} ${a.slug} ${pessoaPorId(a.dono).nome}`).includes(q))
  const ordenada = [...lista].sort((a, b) => {
    if (ordem.value === 'uso') return b.uso.conversas - a.uso.conversas
    if (ordem.value === 'nome') return a.name.localeCompare(b.name)
    return b.atualizadoEm.localeCompare(a.atualizadoEm)
  })
  return ordenada
})

const sistemaVisiveis = computed(() => {
  if (filtro.value === 'workspace' || filtro.value === 'meus') return []
  const q = normal(busca.value.trim())
  return agentesDoSistema.filter(a => !q || normal(`${a.name} ${a.description}`).includes(q))
})

const filtros = computed(() => (['todos', 'workspace', 'meus', 'sistema'] as Filtro[]).map(f => ({ f, rotulo: `${props.t.central.filtros[f]} (${contagem.value[f]})` })))
const ordens = computed(() => (['recentes', 'uso', 'nome'] as const).map(o => ({ value: o, label: props.t.central.ordens[o] })))

async function atualizar() {
  atualizando.value = true
  await new Promise(r => setTimeout(r, 700))
  atualizando.value = false
}

function abrir(a: Agente, aba: 'essencial' | 'testar' = 'essencial') {
  tela.value.editando = a.slug
  tela.value.abaDoEditor = aba
  tela.value.editorAberto = true
}

function abrirNoChat(slug: string) {
  tela.value.chatAgente = slug
  tela.value.cenario = 'novo'
  tela.value.chatAberto = true
}

function duplicar(nome: string, base?: Agente) {
  const fonte = base ?? agentes.value[0]!
  const novo: Agente = JSON.parse(JSON.stringify(fonte))
  novo.slug = `${fonte.slug}-copia-${Date.now() % 1000}`
  novo.name = props.t.central.copia(nome)
  novo.status = 'inactive'
  novo.dono = EU
  novo.editores = [EU]
  novo.rascunhoPendente = true
  novo.versoes = [{ numero: 1, publicadaEm: null, por: EU, resumo: '' }]
  novo.uso = { conversas: 0, pessoas: 0, creditos: 0, positivas: 0, negativas: 0, confirmacoes: 0, canceladas: 0 }
  novo.atualizadoEm = '2026-11-16'
  agentes.value.unshift(novo)
  toast.add({ title: props.t.central.duplicado(nome), icon: 'i-lucide-copy', color: 'success' })
}

function alternarStatus(a: Agente) {
  a.status = a.status === 'active' ? 'inactive' : 'active'
  toast.add({ title: a.status === 'active' ? props.t.central.ativado : props.t.central.desativado, icon: 'i-lucide-power', color: 'neutral' })
}

const excluindo = ref<Agente | null>(null)
function excluir() {
  if (!excluindo.value) return
  agentes.value = agentes.value.filter(a => a.slug !== excluindo.value!.slug)
  excluindo.value = null
  toast.add({ title: props.t.central.excluido, icon: 'i-lucide-trash-2', color: 'neutral' })
}

function menu(a: Agente): DropdownMenuItem[][] {
  const m = props.t.central.menu
  return [
    [
      { label: m.editar, icon: 'i-lucide-pencil', onSelect: () => abrir(a) },
      { label: m.testar, icon: 'i-lucide-flask-conical', onSelect: () => abrir(a, 'testar') },
      { label: m.abrirNoChat, icon: 'i-lucide-message-square', onSelect: () => abrirNoChat(a.slug) },
      { label: m.duplicar, icon: 'i-lucide-copy', onSelect: () => duplicar(a.name, a) },
    ],
    [
      { label: a.status === 'active' ? m.desativar : m.ativar, icon: 'i-lucide-power', onSelect: () => alternarStatus(a) },
      { label: m.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => { excluindo.value = a } },
    ],
  ]
}

function menuDoSistema(slug: string, nome: string): DropdownMenuItem[] {
  const m = props.t.central.menu
  return [
    { label: m.abrirNoChat, icon: 'i-lucide-message-square', onSelect: () => abrirNoChat(slug) },
    { label: m.duplicar, icon: 'i-lucide-copy', onSelect: () => duplicar(nome) },
  ]
}

const ligadas = (a: Agente) => Object.keys(a.ferramentas).length
const confirmam = (a: Agente) => Object.values(a.ferramentas).filter(v => v === 'confirmar').length

function usarModelo(id: string) {
  tela.value.editando = null
  tela.value.abaDoEditor = 'essencial'
  tela.value.criarAberto = true
  void id
}
</script>

<template>
  <section>
    <!-- Cabeçalho: título à esquerda, ações no topo à direita, como hoje -->
    <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-highlighted">{{ t.central.titulo }}</h1>
        <p class="mt-1 text-sm text-muted">{{ t.central.subtitulo }}</p>
      </div>
      <div class="flex items-center gap-2">
        <UButton :label="t.central.atualizar" icon="i-lucide-refresh-cw" color="primary" variant="outline" :loading="atualizando" @click="atualizar" />
        <UButton :label="t.central.criar" icon="i-lucide-plus" @click="tela.criarAberto = true" />
      </div>
    </div>

    <div class="mb-5 flex flex-wrap items-center gap-3">
      <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.central.buscar" class="w-full sm:w-96" :aria-label="t.central.buscar">
        <template v-if="busca" #trailing>
          <UButton icon="i-lucide-x" color="neutral" variant="link" size="xs" :aria-label="t.central.limparBusca" @click="busca = ''" />
        </template>
      </UInput>
      <div class="ml-auto flex flex-wrap items-center gap-2">
        <div class="flex flex-wrap gap-1 rounded-lg bg-elevated p-1">
          <UButton
            v-for="x in filtros"
            :key="x.f"
            :label="x.rotulo"
            size="sm"
            :color="filtro === x.f ? 'primary' : 'neutral'"
            :variant="filtro === x.f ? 'solid' : 'ghost'"
            @click="filtro = x.f"
          />
        </div>
        <USelect v-model="ordem" :items="ordens" icon="i-lucide-arrow-down-wide-narrow" class="w-48" :aria-label="t.central.ordenar" />
      </div>
    </div>

    <!-- Estado vazio: o workspace ainda não tem agente próprio -->
    <UEmpty
      v-if="tela.vazia && filtro !== 'sistema'"
      icon="i-lucide-bot"
      :title="t.central.vazio.titulo"
      :description="t.central.vazio.texto"
      variant="outline"
      class="mb-6"
      :actions="[{ label: t.criar.descrever, icon: 'i-lucide-sparkles', onClick: () => { tela.criarAberto = true } }, { label: t.criar.doZero, icon: 'i-lucide-file-plus', color: 'neutral', variant: 'subtle', onClick: () => { tela.editando = null; tela.editorAberto = true } }]"
    >
      <template #footer>
        <div class="mt-4 grid w-full max-w-3xl grid-cols-1 gap-2 text-left sm:grid-cols-3">
          <button
            v-for="mod in modelosDeAgente.slice(0, 3)"
            :key="mod.id"
            type="button"
            class="rounded-lg border border-default p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-elevated/60 focus-visible:outline-2 focus-visible:outline-primary"
            @click="usarModelo(mod.id)"
          >
            <UIcon :name="mod.icone" class="mb-2 size-5 text-primary" />
            <span class="block text-sm font-medium text-highlighted">{{ t.criar.modelos[mod.id]!.nome }}</span>
            <span class="mt-0.5 block text-xs text-muted">{{ t.criar.modelos[mod.id]!.descricao }}</span>
          </button>
        </div>
      </template>
    </UEmpty>

    <p v-else-if="!visiveis.length && !sistemaVisiveis.length" class="py-16 text-center text-sm text-muted">
      {{ t.central.nenhumResultado }}
      <UButton :label="t.central.limparBusca" variant="link" @click="busca = ''; filtro = 'todos'" />
    </p>

    <TransitionGroup
      tag="div"
      class="grid grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] gap-4"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-150 ease-in absolute"
      leave-to-class="opacity-0"
      move-class="transition duration-300"
    >
      <!-- Agentes do workspace: o card inteiro abre o agente (regra 25) -->
      <article
        v-for="(a, i) in visiveis"
        :key="a.slug"
        class="group relative flex flex-col rounded-lg border border-default bg-default p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        :style="{ transitionDelay: `${Math.min(i, 8) * 30}ms` }"
      >
        <div class="flex items-start gap-3">
          <AvatarDoAgente :cor="a.cor" tamanho="lg" />
          <div class="min-w-0 flex-1">
            <h2 class="line-clamp-2 text-sm font-semibold text-highlighted">
              <a href="#" class="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-primary" @click.prevent="abrir(a)">{{ a.name }}</a>
            </h2>
            <p class="truncate font-mono text-xs text-dimmed">{{ a.slug }}</p>
          </div>
          <UDropdownMenu :items="menu(a)" :content="{ align: 'end' }">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" class="relative z-10" :aria-label="t.central.menu.editar" />
          </UDropdownMenu>
        </div>

        <p class="mt-3 line-clamp-2 min-h-10 text-sm text-muted">{{ a.description }}</p>

        <div class="mt-3 flex flex-wrap gap-1.5">
          <UBadge v-if="a.status === 'inactive'" :label="t.central.status.inactive" color="neutral" variant="soft" size="sm" icon="i-lucide-circle-pause" />
          <UBadge v-else :label="t.central.status.active" color="success" variant="soft" size="sm" icon="i-lucide-circle-check" />
          <UBadge v-if="a.rascunhoPendente" :label="t.central.rascunho" color="warning" variant="soft" size="sm" icon="i-lucide-pencil-line" />
          <UBadge v-if="a.type !== 'chat'" :label="t.central.tipos[a.type]" color="neutral" variant="outline" size="sm" />
        </div>

        <ul class="mt-3 space-y-1.5 text-xs text-toned">
          <li class="flex items-center gap-1.5">
            <UIcon :name="iconeDoProvedor[modeloPorId(a.model)!.provider]" class="size-3.5 shrink-0 text-muted" />
            <span class="truncate">{{ modeloPorId(a.model)!.name }}</span>
            <span class="text-dimmed">·</span>
            <span class="shrink-0 text-muted">{{ t.central.modelosPermitidos(a.modelosPermitidos.length) }}</span>
          </li>
          <li class="flex items-center gap-1.5">
            <UIcon name="i-lucide-wrench" class="size-3.5 shrink-0 text-muted" />
            <span v-if="ligadas(a)">{{ t.central.ferramentas(ligadas(a)) }}</span>
            <span v-else class="text-muted">{{ t.central.semFerramentas }}</span>
            <template v-if="confirmam(a)">
              <span class="text-dimmed">·</span>
              <span class="inline-flex items-center gap-1 text-warning"><UIcon name="i-lucide-shield-check" class="size-3.5" />{{ t.central.pedemConfirmacao(confirmam(a)) }}</span>
            </template>
          </li>
          <li v-if="a.arquivos.length" class="flex items-center gap-1.5">
            <UIcon name="i-lucide-paperclip" class="size-3.5 shrink-0 text-muted" />
            {{ t.central.arquivos(a.arquivos.length) }}
          </li>
        </ul>

        <div class="mt-auto flex items-center gap-2 border-t border-default pt-3 text-xs text-muted" :class="a.arquivos.length ? 'mt-3' : 'mt-[1.875rem]'">
          <UAvatar :text="pessoaPorId(a.dono).iniciais" size="2xs" />
          <span class="min-w-0 flex-1 truncate">{{ pessoaPorId(a.dono).nome }}</span>
          <span class="shrink-0">{{ a.uso.conversas ? t.central.conversas(a.uso.conversas) : t.central.semUso }}</span>
        </div>
      </article>

      <!-- Agentes do sistema: não se editam; o menu duplica ou abre no chat -->
      <article
        v-for="s in sistemaVisiveis"
        :key="s.slug"
        class="relative flex flex-col rounded-lg border border-dashed border-default bg-elevated/30 p-4"
      >
        <div class="flex items-start gap-3">
          <AvatarDoAgente :cor="s.cor" tamanho="lg" />
          <div class="min-w-0 flex-1">
            <h2 class="text-sm font-semibold text-highlighted">{{ s.name }}</h2>
            <p class="truncate font-mono text-xs text-dimmed">{{ s.slug }}</p>
          </div>
          <UDropdownMenu :items="menuDoSistema(s.slug, s.name)" :content="{ align: 'end' }">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" :aria-label="t.central.menu.duplicar" />
          </UDropdownMenu>
        </div>
        <p class="mt-3 line-clamp-2 text-sm text-muted">{{ s.description }}</p>
        <div class="mt-3 flex items-center gap-1.5">
          <UBadge :label="t.central.sistema" color="neutral" variant="outline" size="sm" icon="i-lucide-lock" />
        </div>
        <p class="mt-auto pt-3 text-xs text-dimmed">{{ t.central.sistemaSoLeitura }}</p>
      </article>
    </TransitionGroup>

    <UModal
      :open="!!excluindo"
      :title="excluindo ? t.central.excluirTitulo(excluindo.name) : ''"
      :description="t.central.excluirTexto"
      @update:open="v => { if (!v) excluindo = null }"
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.central.cancelar" color="neutral" variant="subtle" @click="excluindo = null" />
          <UButton :label="t.central.excluir" color="error" icon="i-lucide-trash-2" @click="excluir" />
        </div>
      </template>
    </UModal>
  </section>
</template>
