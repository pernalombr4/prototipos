<script setup lang="ts">
/**
 * O catálogo de widgets (rodada 4). Abre só pelo "Adicionar widget" da barra
 * de edição: mover, redimensionar e tirar acontecem na própria Home.
 *
 * Rodada 1 tinha um painel de 2 abas ("Na sua Home" e "Adicionar widget").
 * A 1ª aba repetia, em lista, a Home que estava atrás dela. A redatora pediu a
 * forma mais limpa; o QuickBooks faz assim: "Customize" põe a Home em edição,
 * e o painel "Add widgets" só lista o que entra.
 *
 * Sem sombra e sem travar a Home (`:overlay="false"`, `:modal="false"`): a
 * pessoa vê o widget entrar no topo.
 *
 * Componentes: `USlideover`, `UInput`, `UButton`, `UBadge` (MCP nuxt-ui).
 */
import type { GrupoDoCatalogo, TipoDeWidget } from './widgets'
import { CATALOGO } from './widgets'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Tipos que já estão na Home que se edita. */
  naHome: TipoDeWidget[]
  admin: boolean
  escopo: 'minha' | 'padrao'
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ adicionar: [tipo: TipoDeWidget] }>()

const busca = ref('')
watch(aberto, (a) => { if (a) busca.value = '' })

const tiposNaHome = computed(() => new Set(props.naHome))

const grupos = computed(() => {
  const termo = busca.value.trim().toLocaleLowerCase(props.t.locale)
  const ordem: GrupoDoCatalogo[] = ['trabalho', 'itens', 'navegacao', 'equipe']
  return ordem.map(g => ({
    grupo: g,
    widgets: CATALOGO.filter(d => d.grupo === g && (props.admin || !d.soAdmin)).filter((d) => {
      if (!termo) return true
      const txt = props.t.widgets[d.tipo]
      return `${txt.titulo} ${txt.descricao}`.toLocaleLowerCase(props.t.locale).includes(termo)
    }),
  })).filter(g => g.widgets.length)
})
</script>

<template>
  <USlideover
    v-model:open="aberto"
    :title="t.personalizacao.catalogoTitulo"
    :description="escopo === 'padrao' ? t.personalizacao.catalogoPadrao : t.personalizacao.catalogoMinha"
    :overlay="false"
    :modal="false"
    :ui="{ content: 'max-w-md', body: 'p-0 sm:p-0' }"
  >
    <template #body>
      <div class="flex h-full flex-col">
        <div class="px-4 pt-4 sm:px-6">
          <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.personalizacao.buscar" class="w-full" autofocus />
        </div>
        <div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-6">
          <section v-for="g in grupos" :key="g.grupo">
            <h3 class="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              {{ t.grupos[g.grupo] }}
            </h3>
            <ul class="space-y-2">
              <li
                v-for="d in g.widgets"
                :key="d.tipo"
                class="flex items-start gap-3 rounded-lg border border-default p-3 transition-colors hover:border-accented hover:bg-elevated/40"
              >
                <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
                  <UIcon :name="d.icone" class="size-4 text-primary" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="flex items-center gap-1.5 text-sm font-medium text-highlighted">
                    {{ t.widgets[d.tipo].titulo }}
                    <UBadge v-if="d.soAdmin" :label="t.comunicado.soAdmin" color="neutral" variant="subtle" size="sm" />
                  </span>
                  <span class="block text-xs text-muted">{{ t.widgets[d.tipo].descricao }}</span>
                </span>
                <UBadge
                  v-if="tiposNaHome.has(d.tipo) && !d.repete"
                  :label="t.personalizacao.jaNaHome"
                  icon="i-lucide-check"
                  color="success"
                  variant="subtle"
                  size="sm"
                  class="mt-1 shrink-0"
                />
                <UButton
                  v-else
                  :label="tiposNaHome.has(d.tipo) ? t.personalizacao.adicionarOutro : t.personalizacao.adicionar"
                  icon="i-lucide-plus"
                  color="neutral"
                  variant="outline"
                  size="xs"
                  class="shrink-0"
                  @click="emit('adicionar', d.tipo)"
                />
              </li>
            </ul>
          </section>
          <p v-if="!grupos.length" class="py-10 text-center text-sm text-muted">
            {{ t.personalizacao.semResultado }}
          </p>
        </div>
      </div>
    </template>
  </USlideover>
</template>
