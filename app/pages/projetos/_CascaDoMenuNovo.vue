<script setup lang="ts">
/**
 * A CASCA: o menu novo do protótipo menu-lateral, rodada 35 (2026-11-24), copiado e congelado
 * aqui em 2026-11-25. NADA AQUI É PROPOSTA DESTE PROTÓTIPO.
 *
 * Origem: app/pages/menu-lateral (index.vue, _ModeloTrilha.vue), publicado em
 * https://pernalombr4.github.io/prototipos/menu-lateral
 *   - topo do menu de hoje: o workspace com a referência e a seta, e "Buscar..." com Ctrl K;
 *   - trilha de 4.5rem com o quadrado do workspace, as áreas com rótulo, "Mais", ajuda e "+";
 *   - barra do topo copiada do develop: recolher, voltar, avançar, recarregar, início, a trilha
 *     do caminho com Ctrl B e a estrela, idioma, tema, Suporte, sino com 99+ e avatar.
 *
 * O que este protótipo propõe entra pelos slots: o ícone Projetos na trilha (`#projetos`), o
 * conteúdo do painel (`#painel`) e o item "Projeto" no "+" (`itensDeCriar`). A redução da trilha
 * para o convidado (`trilhaDoConvidado`) também é proposta, e o contorno tracejado mostra isso.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { workspace } from './mocks'
import { useMarcaDeProposta } from './estado'

const props = defineProps<{
  t: Textos
  area: string
  breadcrumb: string[]
  itensDeCriar: DropdownMenuItem[][]
  podeConfigurar: boolean
  /** Proposta: o convidado vê só Início, Projetos e Ajuda. */
  trilhaDoConvidado: boolean
  iniciais: string
}>()
const emit = defineEmits<{ area: [id: string], inicio: [] }>()

const { marca } = useMarcaDeProposta()
const toast = useToast()
const modoDeCor = useColorMode()
const idioma = useIdioma()
const sigla = computed(() => ({ 'pt-BR': 'BR', en: 'EN', es: 'ES' })[idioma.value])

const recolhido = ref(false)
const largura = 304

/** As áreas da trilha de hoje. Projetos entra pelo slot, logo abaixo de Início. */
const areasDepois = computed(() => props.trilhaDoConvidado
  ? []
  : [
      { id: 'dados', icone: 'i-lucide-database', rotulo: props.t.casca.dados },
      { id: 'analise', icone: 'i-lucide-chart-pie', rotulo: props.t.casca.analise },
      { id: 'comercial', icone: 'i-lucide-trending-up', rotulo: props.t.casca.comercial },
      ...(props.podeConfigurar ? [{ id: 'config', icone: 'i-lucide-settings', rotulo: props.t.casca.configuracoes }] : []),
    ])

function classeDaArea(id: string) {
  return [
    'relative flex w-full shrink-0 flex-col items-center gap-0.5 rounded-lg px-1 py-2 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
    props.area === id ? 'bg-primary/15 text-highlighted' : 'text-default hover:bg-elevated',
  ]
}

function irPara(id: string) {
  if (id === 'analise' || id === 'comercial' || id === 'config') {
    toast.add({ title: props.t.casca.maquete, icon: 'i-lucide-info', color: 'neutral' })
    return
  }
  emit('area', id)
}

function alternarTema() {
  modoDeCor.preference = modoDeCor.value === 'dark' ? 'light' : 'dark'
}

function aviso() {
  toast.add({ title: props.t.casca.maquete, icon: 'i-lucide-info', color: 'neutral' })
}

defineExpose({ classeDaArea })
</script>

<template>
  <div class="flex h-dvh flex-col bg-elevated/30">
    <div class="flex min-h-0 flex-1 pb-20">
      <div class="flex min-h-0 w-full overflow-hidden bg-default">
        <aside
          class="relative hidden shrink-0 overflow-hidden border-r border-default bg-elevated/40 transition-[width] duration-200 ease-out md:block"
          :class="recolhido ? 'w-[4.5rem]' : ''"
          :style="recolhido ? undefined : { width: `${largura}px` }"
          :aria-label="t.casca.menuLateral"
        >
          <div class="flex h-full min-h-0 flex-col">
            <!-- topo do menu de hoje -->
            <div class="shrink-0 space-y-0.5 border-b border-default p-2">
              <UTooltip :text="workspace.nome" :disabled="!recolhido" :content="{ side: 'right' }">
                <button
                  type="button"
                  class="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-elevated"
                  :class="recolhido ? 'justify-center' : ''"
                  :aria-label="t.casca.trocarWorkspace"
                  @click="aviso"
                >
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {{ workspace.nome.slice(0, 2).toUpperCase() }}
                  </span>
                  <span v-if="!recolhido" class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-semibold text-highlighted">{{ workspace.nome }}</span>
                    <span class="block truncate text-xs text-muted">{{ workspace.referencia }}</span>
                  </span>
                  <UIcon v-if="!recolhido" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
                </button>
              </UTooltip>
              <UTooltip :text="t.casca.buscar" :kbds="['ctrl', 'K']" :disabled="!recolhido" :content="{ side: 'right' }">
                <button
                  type="button"
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated"
                  :class="recolhido ? 'justify-center' : ''"
                  :aria-label="t.casca.buscar"
                  @click="aviso"
                >
                  <UIcon name="i-lucide-search" class="size-4 shrink-0 text-highlighted" />
                  <template v-if="!recolhido">
                    <span class="flex-1 text-sm font-medium text-highlighted">{{ t.casca.buscar }}</span>
                    <UKbd value="ctrl" size="sm" />
                    <UKbd value="K" size="sm" />
                  </template>
                </button>
              </UTooltip>
            </div>

            <div class="flex min-h-0 flex-1">
              <!-- A TRILHA -->
              <nav class="flex w-[4.5rem] shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-default bg-accented/40 py-2" :aria-label="t.casca.menuLateral">
                <UTooltip :text="workspace.nome" :content="{ side: 'right' }">
                  <button
                    type="button"
                    class="mb-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-inverted transition-transform hover:scale-105"
                    :aria-label="t.casca.trocarWorkspace"
                    @click="aviso"
                  >
                    {{ workspace.inicial }}
                  </button>
                </UTooltip>

                <button type="button" :class="classeDaArea('inicio')" :aria-current="area === 'inicio' ? 'page' : undefined" @click="irPara('inicio')">
                  <UIcon name="i-lucide-house" class="size-5" :class="area === 'inicio' ? 'text-primary' : ''" />
                  <span class="w-full truncate text-center text-[10px] font-medium leading-tight">{{ t.casca.inicio }}</span>
                </button>

                <!-- PROPOSTA: o ícone Projetos entra aqui, abaixo de Início -->
                <slot name="projetos" :classe="classeDaArea('projetos')" />

                <button
                  v-for="a in areasDepois"
                  :key="a.id"
                  type="button"
                  :class="classeDaArea(a.id)"
                  :aria-current="area === a.id ? 'page' : undefined"
                  @click="irPara(a.id)"
                >
                  <UIcon :name="a.icone" class="size-5" :class="area === a.id ? 'text-primary' : ''" />
                  <span class="w-full truncate text-center text-[10px] font-medium leading-tight">{{ a.rotulo }}</span>
                </button>

                <button
                  v-if="!trilhaDoConvidado"
                  type="button"
                  class="flex w-full shrink-0 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-default transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  :aria-label="t.casca.mais"
                  @click="aviso"
                >
                  <UIcon name="i-lucide-ellipsis" class="size-5" />
                  <span class="w-full truncate text-center text-[10px] font-medium leading-tight">{{ t.casca.mais }}</span>
                </button>

                <!-- proposta: a trilha do convidado perde Dados, seções, Configurações e Mais -->
                <span v-if="trilhaDoConvidado" class="mx-2 mt-1 block h-px self-stretch" :class="marca" aria-hidden="true" />

                <div class="min-h-2 flex-1" />

                <UTooltip :text="t.casca.ajuda" :content="{ side: 'right' }">
                  <UButton icon="i-lucide-circle-help" color="neutral" variant="ghost" :aria-label="t.casca.ajuda" @click="aviso" />
                </UTooltip>

                <UDropdownMenu v-if="!trilhaDoConvidado" :items="itensDeCriar" :content="{ side: 'right', align: 'end' }" :ui="{ content: 'w-80' }">
                  <UTooltip :text="t.casca.criar" :content="{ side: 'right' }">
                    <button
                      type="button"
                      class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-inverted transition-transform hover:scale-105"
                      :aria-label="t.casca.criar"
                    >
                      <UIcon name="i-lucide-plus" class="size-5" />
                    </button>
                  </UTooltip>
                </UDropdownMenu>
              </nav>

              <!-- O PAINEL ENCAIXADO: o conteúdo de cada área -->
              <div v-if="!recolhido" class="relative flex min-w-0 flex-1 flex-col">
                <slot name="painel" :recolher="() => (recolhido = true)" />
              </div>
            </div>
          </div>
        </aside>

        <div class="flex min-w-0 flex-1 flex-col">
          <!-- A BARRA DO TOPO, copiada do develop em 2026-11-24. Nada aqui é proposta. -->
          <header class="flex h-12 shrink-0 items-center gap-1 border-b border-default bg-default px-2">
            <UTooltip :text="t.casca.menu">
              <UButton icon="i-lucide-panel-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.menu" @click="recolhido = !recolhido" />
            </UTooltip>
            <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.voltar" />
            <UButton icon="i-lucide-arrow-right" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.avancar" />
            <UButton icon="i-lucide-rotate-cw" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.recarregar" />
            <UButton icon="i-lucide-house" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.inicio" @click="emit('inicio')" />

            <div class="mx-2 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-elevated/70 px-3 py-1.5">
              <nav class="flex min-w-0 items-center gap-1.5 text-xs" :aria-label="t.casca.trilha">
                <template v-for="(parte, i) in breadcrumb" :key="i">
                  <UIcon v-if="i" name="i-lucide-chevron-right" class="size-3 shrink-0 text-dimmed" />
                  <span class="truncate" :class="i === breadcrumb.length - 1 ? 'text-highlighted' : 'text-toned'">{{ parte }}</span>
                </template>
              </nav>
              <span class="ml-auto hidden shrink-0 items-center gap-1 sm:flex">
                <UKbd value="ctrl" size="sm" />
                <UKbd value="B" size="sm" />
                <UIcon name="i-lucide-star" class="ml-1 size-3.5 text-muted" :aria-label="t.casca.favoritar" />
              </span>
            </div>

            <div class="flex shrink-0 items-center gap-1.5">
              <span class="flex size-6 items-center justify-center rounded-full bg-success/15 text-[9px] font-bold text-success" :aria-label="t.casca.idioma">{{ sigla }}</span>
              <UButton :icon="modoDeCor.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.tema" @click="alternarTema" />
              <UButton icon="i-lucide-headset" :label="t.casca.suporte" color="neutral" variant="outline" size="xs" class="hidden sm:inline-flex" @click="aviso" />
              <UChip text="99+" color="error" size="3xl">
                <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.notificacoes" />
              </UChip>
              <UChip color="success" size="sm" inset>
                <UAvatar size="sm" :text="iniciais" :alt="t.casca.conta" />
              </UChip>
            </div>
          </header>

          <main class="min-h-0 flex-1 overflow-y-auto">
            <slot />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>
