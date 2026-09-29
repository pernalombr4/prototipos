<script setup lang="ts">
/**
 * A coluna do meio: cabeçalho da página e o corpo.
 *
 * ⚠️ CASCA: seção acima do título com o ícone em quadro, título, descrição,
 * selo de status e o botão de copiar com o menu ao lado, como no
 * `app/pages/[section]/[...slug].vue` do en-docs.
 *
 * ✅ PROPOSTA (só em A e B), 3 peças:
 *   1. a trilha de navegação acima do cabeçalho;
 *   2. "Este assunto também aparece em", que liga as portas do mesmo assunto
 *      em telas diferentes, com o caminho de cada uma no menu escolhido;
 *   3. "Nesta seção" na página índice: a lista das páginas da pasta, 1 linha
 *      cada.
 *
 * ⚠️ MAQUETE: o corpo mostra só os títulos de seção (H2) reais do arquivo. O
 * texto de cada seção não está em discussão e aparece como linhas neutras.
 */
import type { Lingua, Menu, No, PaginaDaDoc } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  l: Lingua
  menu: Menu
  pagina: PaginaDaDoc
  titulo: string
  trilha: { nome: string, pagina?: string }[]
  outras: { id: string, caminho: string }[]
  filhos: { no: No, nome: string, descricao: string }[]
  /** Na D, as seções que vieram de páginas fundidas nesta (Fluxos). */
  secoesExtras?: string[]
}>()

const secoes = computed(() => [...props.pagina.secoes[props.l], ...(props.secoesExtras ?? [])])

const emit = defineEmits<{ abrir: [paginaId: string] }>()

const proposta = computed(() => props.menu !== 'hoje')
const semTraducao = computed(() => props.l !== 'pt' && !props.pagina.traduzida[props.l])

const copiado = ref(false)
let relogio: ReturnType<typeof setTimeout> | null = null
function copiar() {
  copiado.value = true
  if (relogio) clearTimeout(relogio)
  relogio = setTimeout(() => { copiado.value = false }, 1800)
}
onBeforeUnmount(() => { if (relogio) clearTimeout(relogio) })

const corDoStatus = computed(() => ({
  published: 'info',
  updated: 'success',
  draft: 'neutral',
  deprecated: 'error',
}[props.pagina.status] as 'info' | 'success' | 'neutral' | 'error'))

const menuDaPagina = computed(() => [[
  { label: props.t.casca.perguntarBeni, icon: 'i-lucide-bot', disabled: true },
  { label: props.t.casca.abrirNoChatGpt, icon: 'i-lucide-external-link' },
]])

/** Larguras fixas para as linhas neutras: variam, mas não mudam entre renderizações. */
function larguras(i: number) {
  return [92 - ((i * 7) % 20), 86 - ((i * 11) % 25), 58 + ((i * 13) % 30)]
}
</script>

<template>
  <article class="pt-8 lg:pt-14">
    <!-- ✅ PROPOSTA: trilha de navegação -->
    <nav v-if="proposta && trilha.length > 1" :aria-label="t.proposta.trilha" class="mb-5">
      <ol class="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted">
        <li v-for="(passo, i) in trilha" :key="i" class="flex items-center gap-1">
          <UIcon v-if="i > 0" name="i-lucide-chevron-right" class="size-3.5 shrink-0 text-dimmed" />
          <button
            v-if="passo.pagina && i < trilha.length - 1"
            type="button"
            class="cursor-pointer rounded px-0.5 transition-colors hover:text-highlighted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            @click="emit('abrir', passo.pagina)"
          >
            {{ passo.nome }}
          </button>
          <span v-else :class="i === trilha.length - 1 ? 'font-medium text-highlighted' : ''" :aria-current="i === trilha.length - 1 ? 'page' : undefined">
            {{ passo.nome }}
          </span>
        </li>
      </ol>
    </nav>

    <!-- Cabeçalho da página (casca) -->
    <header>
      <div v-if="pagina.headline[l]" class="mb-2.5 flex items-center gap-1.5 text-base font-semibold text-primary">
        <div class="flex size-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
          <UIcon :name="pagina.icone" class="text-primary" />
        </div>
        <span>{{ pagina.headline[l] }}</span>
      </div>

      <h1 class="text-3xl font-bold text-highlighted sm:text-4xl">
        {{ titulo }}
      </h1>

      <p v-if="pagina.descricao[l]" class="mt-4 text-lg text-muted">
        {{ pagina.descricao[l] }}
      </p>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <UBadge
          v-if="!pagina.nova"
          class="font-semibold"
          :label="t.casca.status[pagina.status]"
          :color="corDoStatus"
          variant="subtle"
          size="md"
        />
        <UBadge v-else class="font-semibold" :label="t.proposta.paginaNova" color="primary" variant="subtle" size="md" icon="i-lucide-sparkles" />
        <USeparator orientation="vertical" class="h-4" />
        <UFieldGroup>
          <UButton
            class="cursor-pointer font-semibold"
            :label="copiado ? t.casca.copiado : t.casca.copiarTexto"
            :icon="copiado ? 'i-lucide-check' : 'i-lucide-copy'"
            :color="copiado ? 'success' : 'neutral'"
            variant="outline"
            size="xs"
            @click="copiar"
          />
          <UDropdownMenu :items="menuDaPagina" :ui="{ itemLeadingIcon: 'size-3.5', item: 'text-xs py-1 px-2 gap-1.5' }">
            <UButton class="cursor-pointer" :color="copiado ? 'success' : 'neutral'" variant="outline" size="xs" icon="i-lucide-chevron-down" :aria-label="t.casca.abrirNoChatGpt" />
          </UDropdownMenu>
        </UFieldGroup>
      </div>

      <p v-if="semTraducao" class="mt-3 flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-languages" class="size-3.5 shrink-0" />
        {{ t.proposta.semTraducao }}
      </p>
    </header>

    <!-- ✅ PROPOSTA: as outras portas do mesmo assunto -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-y-1 opacity-0"
    >
      <aside
        v-if="proposta && outras.length"
        :key="pagina.id"
        class="mt-6 rounded-lg border border-default bg-elevated/50 px-4 py-3"
      >
        <p class="flex items-center gap-1.5 text-sm font-semibold text-highlighted">
          <UIcon name="i-lucide-signpost" class="size-4 text-primary" />
          {{ t.proposta.tambemAparece }}
        </p>
        <ul class="mt-2 flex flex-col gap-1">
          <li v-for="o in outras" :key="o.id">
            <button
              type="button"
              class="group flex cursor-pointer items-start gap-1.5 rounded text-left text-sm text-toned transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              @click="emit('abrir', o.id)"
            >
              <UIcon name="i-lucide-arrow-right" class="mt-0.5 size-3.5 shrink-0 text-dimmed transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              <span>{{ o.caminho }}</span>
            </button>
          </li>
        </ul>
      </aside>
    </Transition>

    <USeparator class="my-8" />

    <!-- Espaço para o que só uma proposta mostra (o mapa da C, por exemplo). -->
    <slot name="extra" />

    <!-- Página nova: o índice que a proposta cria -->
    <p v-if="pagina.nova" class="mb-6 max-w-prose text-base text-toned">
      {{ t.proposta.paginaNovaTexto }}
    </p>

    <!-- ✅ PROPOSTA: índice curto, 1 linha por página da pasta -->
    <section v-if="proposta && filhos.length" class="mb-10">
      <h2 class="mb-4 text-xl font-bold text-highlighted">
        {{ t.proposta.nestaSecao }}
      </h2>
      <ul class="grid gap-3 sm:grid-cols-2">
        <li
          v-for="(f, i) in filhos"
          :key="f.no.id"
          :style="{ animation: 'entrada 280ms ease-out both', animationDelay: `${Math.min(i, 10) * 35}ms` }"
        >
          <button
            type="button"
            class="
              group flex h-full w-full cursor-pointer flex-col gap-1 rounded-lg border border-default bg-default px-4 py-3 text-left
              transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
            "
            @click="f.no.pagina && emit('abrir', f.no.pagina)"
          >
            <span class="flex items-center gap-1.5 text-sm font-semibold text-highlighted group-hover:text-primary">
              {{ f.nome }}
              <UIcon name="i-lucide-arrow-right" class="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
            </span>
            <span v-if="f.descricao" class="line-clamp-2 text-sm text-muted">{{ f.descricao }}</span>
          </button>
        </li>
      </ul>
    </section>

    <!-- Corpo: os H2 reais do arquivo; o texto é maquete -->
    <div class="flex flex-col">
      <section v-for="(secao, i) in secoes" :key="`${pagina.id}-${i}`" class="mb-8">
        <h2 :id="`secao-${i}`" class="mb-4 scroll-mt-28 text-2xl font-bold text-highlighted">
          {{ secao }}
        </h2>
        <div class="flex flex-col gap-2.5" aria-hidden="true">
          <div v-for="(w, j) in larguras(i)" :key="j" class="h-3 rounded-full bg-accented/70" :style="{ width: `${w}%` }" />
        </div>
      </section>
    </div>
  </article>
</template>
