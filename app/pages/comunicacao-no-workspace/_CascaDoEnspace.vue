<script setup lang="ts">
/**
 * A casca do ENSPACE, copiada do develop, montada no `EnLayout` do SDK.
 *
 * ⚠️ NADA AQUI É PROPOSTA, com 2 exceções marcadas no código e pelo contorno
 * tracejado do andaime ("Mostrar o que muda"):
 *   1. a entrada "E-mails" na seção Membro do menu;
 *   2. o botão "Novo e-mail" na barra do topo.
 * O resto (ordem, ícones, rótulos, seções que abrem, trilha, atalhos de
 * teclado) reproduz `https://develop.enspace.io/workspaces/<ws>` em 05/10/2026.
 * O que estiver diferente do develop é defeito de cópia, não sugestão.
 *
 * "Requisições" é uma entrada de menu configurada (Interface › Menus aponta
 * para a tela nativa `/request`). Workspace de cliente costuma ter; o de
 * exploração não tinha. Ela entra para a jornada do formulário existir.
 */
import type { Textos } from './textos'
import { categorias, EU, workspace } from './mocks'
import { type Tela, useComunicacao, useMarcaDeProposta } from './estado'

const props = defineProps<{
  t: Textos
  /** A trilha da tela atual, do workspace até a página. */
  trilha: string[]
}>()

const { tela, categoriaAtual, ir, abrirCompositor, rascunho, compositorAberto, config } = useComunicacao()
const marca = useMarcaDeProposta()

interface Entrada {
  chave: string
  icone: string
  tela?: Tela
  filhos?: { chave: string, rotulo?: string, icone: string, tela?: Tela, categoria?: string }[]
  externo?: boolean
  /** Peça proposta: ganha o contorno do andaime. */
  proposta?: boolean
  /** Só aparece com o módulo ligado. */
  quando?: () => boolean
}

const membro = computed<Entrada[]>(() => [
  { chave: 'inicio', icone: 'i-lucide-house', tela: 'inicio' },
  { chave: 'spaceflows', icone: 'i-lucide-workflow' },
  {
    chave: 'categorias',
    icone: 'i-lucide-layout-grid',
    filhos: categorias.map(c => ({ chave: c.slug, rotulo: c.name, icone: 'i-lucide-file', tela: 'itens' as Tela, categoria: c.slug })),
  },
  {
    chave: 'tarefas',
    icone: 'i-lucide-file-text',
    filhos: [
      { chave: 'agendadas', icone: 'i-lucide-calendar-clock' },
      { chave: 'rapidas', icone: 'i-lucide-clipboard-check', tela: 'tarefas' },
    ],
  },
  { chave: 'agenda', icone: 'i-lucide-calendar-days', tela: 'agenda' },
  // PROPOSTA: a caixa de e-mail do workspace sai de dentro do item.
  { chave: 'emails', icone: 'i-lucide-mail', tela: 'emails', proposta: true, quando: () => config.value.emailDoEnspace },
  { chave: 'knowledge', icone: 'i-lucide-table-2', filhos: [] },
  // Menu configurado em Interface › Menus (tela nativa /request).
  { chave: 'requisicoes', icone: 'i-lucide-clipboard-pen-line', tela: 'requisicoes' },
])

const configuracoes: Entrada[] = [
  { chave: 'visaoGeral', icone: 'i-lucide-circle-gauge' },
  { chave: 'sistema', icone: 'i-lucide-settings', tela: 'sistema' },
  {
    chave: 'estrutura',
    icone: 'i-lucide-database',
    filhos: [
      { chave: 'estruturaCategorias', icone: 'i-lucide-layout-grid', tela: 'categoria' },
      { chave: 'listas', icone: 'i-lucide-list-checks' },
      { chave: 'spaceflow', icone: 'i-lucide-git-fork' },
    ],
  },
  { chave: 'gestaoDeMembros', icone: 'i-lucide-contact' },
  { chave: 'interface', icone: 'i-lucide-compass', filhos: [] },
  {
    chave: 'emailsConfig',
    icone: 'i-lucide-mails',
    filhos: [
      { chave: 'emailsEnviados', icone: 'i-lucide-send' },
      { chave: 'modelosDeEmail', icone: 'i-lucide-file-text' },
      { chave: 'caixasDeEmail', icone: 'i-lucide-inbox' },
    ],
  },
  { chave: 'integracoes', icone: 'i-lucide-blocks' },
  { chave: 'agentesDeIa', icone: 'i-lucide-cpu' },
  { chave: 'logs', icone: 'i-lucide-activity' },
  { chave: 'credenciais', icone: 'i-lucide-key-round' },
]

const ajuda: Entrada[] = [
  { chave: 'releases', icone: 'i-lucide-package' },
  { chave: 'documentacao', icone: 'i-lucide-book-open', externo: true },
]

/** As seções que o develop deixa abertas quando a tela de dentro está ativa. */
const abertos = ref<string[]>(['categorias', 'tarefas'])

watch(tela, (t) => {
  const secao = t === 'itens' || t === 'item' ? 'categorias' : t === 'tarefas' ? 'tarefas' : t === 'categoria' ? 'estrutura' : null
  if (secao && !abertos.value.includes(secao)) abertos.value = [...abertos.value, secao]
}, { immediate: true })

function alternar(chave: string) {
  abertos.value = abertos.value.includes(chave)
    ? abertos.value.filter(x => x !== chave)
    : [...abertos.value, chave]
}

function ativo(e: { tela?: Tela, categoria?: string }) {
  if (!e.tela) return false
  if (e.categoria) return (tela.value === 'itens' || tela.value === 'item') && categoriaAtual.value === e.categoria
  return tela.value === e.tela
}

function clicar(e: Entrada | NonNullable<Entrada['filhos']>[number]) {
  if ('filhos' in e && e.filhos) {
    alternar(e.chave)
    return
  }
  if (e.chave === 'estruturaCategorias') ir('categoria', { vista: 'lista' })
  else if (e.tela) ir(e.tela, 'categoria' in e && e.categoria ? { categoria: e.categoria as never } : undefined)
}

const grupos = computed(() => [
  { titulo: props.t.casca.membro, itens: membro.value.filter(e => !e.quando || e.quando()) },
  { titulo: props.t.casca.configuracoes, itens: configuracoes },
  { titulo: props.t.casca.ajuda, itens: ajuda },
])

const temRascunho = computed(() => !compositorAberto.value && !!(rascunho.value.para.length || rascunho.value.assunto || rascunho.value.corpo.replace(/<[^>]+>/g, '').trim()))
</script>

<template>
  <!--
    `[&>.peer]:[--sidebar-width:12.5rem]`: o EnLayout não repassa `ui` para o
    USidebar, que fixa 16rem. O develop usa ~200 px. Registrado no DECISOES.
  -->
  <EnLayout
    variant="default"
    collapsible="icon"
    class="[&>.peer]:[--sidebar-width:12.5rem]"
  >
    <!-- Workspace -->
    <template #sidebar-header="{ state }">
      <button
        type="button"
        class="-mx-2 flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated"
      >
        <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <UIcon name="i-lucide-cloud" class="size-4" />
        </span>
        <span v-if="state === 'expanded'" class="min-w-0 flex-1">
          <span class="block truncate text-sm font-semibold text-highlighted">{{ workspace.name }}</span>
          <span class="block truncate text-xs text-muted">{{ workspace.reference }}</span>
        </span>
        <UIcon v-if="state === 'expanded'" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
      </button>
    </template>

    <template #sidebar-default="{ state }">
      <div class="-mx-2 -mt-2 flex flex-col">
        <!-- Busca -->
        <button
          type="button"
          class="flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated"
        >
          <UIcon name="i-lucide-search" class="size-4 shrink-0 text-highlighted" />
          <template v-if="state === 'expanded'">
            <span class="flex-1 text-sm font-medium text-highlighted">{{ t.casca.buscar }}</span>
            <UKbd value="ctrl" size="sm" />
            <UKbd value="K" size="sm" />
          </template>
        </button>

        <nav :aria-label="t.casca.menuLateral">
          <template v-for="(grupo, g) in grupos" :key="g">
            <p v-if="state === 'expanded'" class="px-2 pb-1 pt-5 text-xs text-muted">
              {{ grupo.titulo }}
            </p>
            <USeparator v-else class="my-3" />

            <template v-for="e in grupo.itens" :key="e.chave">
              <UTooltip :text="t.casca.itens[e.chave]" :disabled="state === 'expanded'" :content="{ side: 'right' }">
                <button
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated"
                  :class="[
                    ativo(e) ? 'font-medium text-primary' : 'text-toned',
                    e.proposta ? marca : '',
                  ]"
                  :aria-current="ativo(e) ? 'page' : undefined"
                  :aria-expanded="e.filhos ? abertos.includes(e.chave) : undefined"
                  @click="clicar(e)"
                >
                  <UIcon :name="e.icone" class="size-4 shrink-0" :class="ativo(e) ? 'text-primary' : 'text-muted'" />
                  <template v-if="state === 'expanded'">
                    <span class="flex-1 truncate text-sm">{{ t.casca.itens[e.chave] }}</span>
                    <UIcon v-if="e.externo" name="i-lucide-arrow-up-right" class="size-3 shrink-0 text-dimmed" />
                    <UIcon
                      v-else-if="e.filhos"
                      :name="abertos.includes(e.chave) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                      class="size-4 shrink-0 text-muted"
                    />
                  </template>
                </button>
              </UTooltip>

              <!-- Filhos da seção aberta -->
              <div
                v-if="state === 'expanded' && e.filhos?.length && abertos.includes(e.chave)"
                class="flex flex-col"
              >
                <button
                  v-for="f in e.filhos"
                  :key="f.chave"
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded-md py-1.5 pl-7 pr-2 text-left transition-colors"
                  :class="ativo(f) ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated'"
                  :aria-current="ativo(f) ? 'page' : undefined"
                  @click="clicar(f)"
                >
                  <UIcon :name="f.icone" class="size-4 shrink-0" />
                  <span class="flex-1 truncate text-sm">{{ f.rotulo ?? t.casca.itens[f.chave] }}</span>
                  <UIcon v-if="f.categoria" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
                </button>
              </div>
            </template>
          </template>
        </nav>
      </div>
    </template>

    <!-- Barra do topo. O botão de recolher é o padrão do EnLayout (navbar-leading). -->
    <template #navbar-title>
      <div class="flex w-[min(50rem,calc(100vw-30rem))] min-w-0 items-center gap-1 font-normal">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.voltar" />
        <UButton icon="i-lucide-arrow-right" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.avancar" />
        <UButton icon="i-lucide-rotate-cw" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.recarregar" />
        <UButton icon="i-lucide-house" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.itens.inicio" @click="ir('inicio')" />

        <div class="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-elevated/70 px-3 py-1.5">
          <UIcon name="i-lucide-cloud" class="size-3.5 shrink-0 text-muted" />
          <nav class="flex min-w-0 items-center gap-1.5 text-xs" :aria-label="t.casca.trilha">
            <template v-for="(parte, i) in trilha" :key="i">
              <UIcon v-if="i" name="i-lucide-chevron-right" class="size-3 shrink-0 text-dimmed" />
              <span class="truncate" :class="i === trilha.length - 1 ? 'text-highlighted' : 'text-toned'">{{ parte }}</span>
            </template>
          </nav>
          <span class="ml-auto flex shrink-0 items-center gap-1">
            <UKbd value="ctrl" size="sm" />
            <UKbd value="B" size="sm" />
            <UIcon name="i-lucide-star" class="ml-1 size-3.5 text-muted" />
          </span>
        </div>
      </div>
    </template>

    <template #navbar-trailing>
      <span class="flex size-6 items-center justify-center rounded-full bg-success/15 text-[9px] font-bold text-success" :aria-label="t.casca.idioma">BR</span>
      <UButton icon="i-lucide-sun" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.tema" />

      <!-- PROPOSTA: escrever um e-mail de qualquer tela, sem entrar num item. -->
      <UTooltip v-if="config.emailDoEnspace" :text="t.casca.novoEmailDica">
        <UChip :show="temRascunho" color="warning" size="md" inset>
          <UButton
            icon="i-lucide-mail-plus"
            :label="t.casca.novoEmail"
            color="neutral"
            variant="outline"
            size="xs"
            :class="marca"
            @click="abrirCompositor()"
          />
        </UChip>
      </UTooltip>

      <UButton icon="i-lucide-headset" :label="t.casca.suporte" color="neutral" variant="outline" size="xs" />
      <UChip text="99+" color="error" size="3xl">
        <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.notificacoes" />
      </UChip>
      <UChip color="success" size="sm" inset>
        <UAvatar size="sm" :text="EU.nome.split(' ').map(p => p[0]).join('')" :alt="EU.nome" />
      </UChip>
    </template>

    <!-- A tela -->
    <div class="pb-28">
      <slot />
    </div>
  </EnLayout>
</template>
