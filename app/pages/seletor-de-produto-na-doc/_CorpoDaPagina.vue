<script setup lang="ts">
/**
 * A coluna do meio: cabeçalho da página e o conteúdo.
 *
 * ⚠️ CASCA. É a reprodução do `app/pages/docs/[...slug].vue` do en-docs:
 * seção acima do título com o ícone em quadro, título, descrição, selo de
 * status, botão de copiar com o menu ao lado, e o corpo do markdown. O que
 * muda de verdade nesta tela é O QUE aparece aqui, não COMO aparece.
 */
import type { Bloco, Pagina } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  pagina: Pagina
  /** Chave `produto:pagina`, para achar a descrição no dicionário. */
  chaveDaDescricao: string
}>()

const idioma = useIdioma()

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

function texto(bloco: Bloco) {
  return bloco.texto?.[idioma.value] ?? ''
}

function itens(bloco: Bloco) {
  return bloco.itens?.[idioma.value] ?? []
}

const menuDaPagina = computed(() => [[
  { label: props.t.casca.perguntarBeni, icon: 'i-lucide-bot', disabled: true },
  { label: props.t.casca.abrirNoChatGpt, icon: 'i-lucide-external-link' },
]])
</script>

<template>
  <article class="pt-8 lg:pt-14">
    <!-- Cabeçalho da página -->
    <header>
      <div class="mb-2.5 flex items-center gap-1.5 text-base font-semibold text-primary">
        <div class="flex size-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
          <UIcon :name="pagina.icone" class="text-primary" />
        </div>
        <span>{{ t.titulos[pagina.secao] }}</span>
      </div>

      <h1 class="text-3xl font-bold text-highlighted sm:text-4xl">
        {{ t.titulos[pagina.chave] }}
      </h1>

      <p class="mt-4 text-lg text-muted">
        {{ t.descricoes[chaveDaDescricao] }}
      </p>

      <div class="mt-4 flex items-center gap-2">
        <UBadge
          class="font-semibold"
          :label="t.casca.status[pagina.status]"
          :color="corDoStatus"
          variant="subtle"
          size="md"
        />
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
          <UDropdownMenu
            :items="menuDaPagina"
            :ui="{ itemLeadingIcon: 'size-3.5', item: 'text-xs py-1 px-2 gap-1.5' }"
          >
            <UButton
              class="cursor-pointer"
              :color="copiado ? 'success' : 'neutral'"
              variant="outline"
              size="xs"
              icon="i-lucide-chevron-down"
            />
          </UDropdownMenu>
        </UFieldGroup>
      </div>
    </header>

    <USeparator class="my-8" />

    <!-- Corpo -->
    <div class="flex flex-col gap-4">
      <template v-for="(bloco, i) in pagina.corpo" :key="`${pagina.chave}-${i}`">
        <h2
          v-if="bloco.tipo === 'titulo'"
          :id="bloco.id"
          class="scroll-mt-28 pt-4 text-2xl font-bold text-highlighted"
        >
          {{ texto(bloco) }}
        </h2>

        <p v-else-if="bloco.tipo === 'paragrafo'" class="text-base leading-7 text-toned">
          {{ texto(bloco) }}
        </p>

        <ul v-else-if="bloco.tipo === 'lista'" class="flex list-disc flex-col gap-2 pl-5 text-toned marker:text-dimmed">
          <li v-for="(linha, j) in itens(bloco)" :key="j" class="leading-7">
            {{ linha }}
          </li>
        </ul>

        <ol v-else-if="bloco.tipo === 'passos'" class="flex list-decimal flex-col gap-2 pl-5 text-toned marker:font-semibold marker:text-primary">
          <li v-for="(linha, j) in itens(bloco)" :key="j" class="leading-7">
            {{ linha }}
          </li>
        </ol>

        <!-- O quadro de aviso do site: título "Information" e a borda em info. -->
        <div
          v-else-if="bloco.tipo === 'aviso'"
          class="my-2 rounded-lg border border-info/30 bg-info/10 px-4 py-3"
        >
          <p class="flex items-center gap-2 text-sm font-semibold text-info">
            <UIcon name="i-lucide-info" class="size-4" />
            {{ t.casca.informacao }}
          </p>
          <p class="mt-1 text-sm leading-6 text-toned">
            {{ texto(bloco) }}
          </p>
        </div>
      </template>
    </div>
  </article>
</template>
