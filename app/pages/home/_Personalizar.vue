<script setup lang="ts">
/**
 * Personalizar a Home: o painel lateral com o que está na Home e o catálogo.
 *
 * - "Na sua Home": a lista na ordem da grade, com Subir, Descer e Remover.
 *   É a alternativa ao arraste pedida pela WCAG 2.5.7 (o "Show / Move /
 *   Hide" do Notion), e o caminho de quem usa só teclado ou leitor de tela;
 * - "Adicionar widget": o catálogo em 4 grupos, com busca. Widget que repete
 *   (uma visualização por widget) mostra "Adicionar outro";
 * - administrador: o seletor "Editando" troca entre a Minha Home e a Home
 *   padrão do workspace (o modelo do HubSpot e do Notion);
 * - "Restaurar a Home padrão" no pé, com confirmação.
 *
 * Sem sombra por cima e sem travar a Home (`:overlay="false"`, `:modal="false"`):
 * a pessoa vê o widget entrar, subir e sair enquanto mexe na lista.
 *
 * Componentes: `USlideover`, `UTabs` (`:content="false"`), `UInput`,
 * `USelect`, `UButton`, `UBadge` (MCP nuxt-ui).
 */
import type { SelectItem, TabsItem } from '@nuxt/ui'
import type { GrupoDoCatalogo, TipoDeWidget, Widget } from './widgets'
import { CATALOGO, definicao } from './widgets'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Os widgets na ordem da grade. */
  naHome: { widget: Widget, titulo: string }[]
  admin: boolean
}>()
const aberto = defineModel<boolean>('open', { default: false })
const escopo = defineModel<'minha' | 'padrao'>('escopo', { default: 'minha' })
const emit = defineEmits<{
  adicionar: [tipo: TipoDeWidget]
  subir: [id: string]
  descer: [id: string]
  remover: [id: string]
  restaurar: []
}>()

const aba = ref<'naHome' | 'adicionar'>('naHome')
const busca = ref('')
const confirmando = ref(false)

watch(aberto, (a) => {
  if (a) { busca.value = ''; confirmando.value = false }
})

const abas = computed<TabsItem[]>(() => [
  { label: props.t.personalizacao.abaNaHome, value: 'naHome', badge: { label: String(props.naHome.length), color: 'neutral', variant: 'subtle' } },
  { label: props.t.personalizacao.abaAdicionar, value: 'adicionar', icon: 'i-lucide-plus' },
])

const opcoesDeEscopo = computed<SelectItem[]>(() => [
  { label: props.t.personalizacao.minha, value: 'minha', icon: 'i-lucide-user' },
  { label: props.t.personalizacao.padrao, value: 'padrao', icon: 'i-lucide-users' },
])

const tiposNaHome = computed(() => new Set(props.naHome.map(x => x.widget.tipo)))

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

function adicionar(tipo: TipoDeWidget) {
  emit('adicionar', tipo)
}
</script>

<template>
  <USlideover
    v-model:open="aberto"
    :title="t.personalizacao.titulo"
    :description="escopo === 'padrao' ? t.bannerPadrao.texto : t.personalizacao.descricao"
    :overlay="false"
    :modal="false"
    :ui="{ content: 'max-w-md', body: 'p-0 sm:p-0' }"
  >
    <template #body>
      <div class="flex h-full flex-col">
        <div class="space-y-3 border-b border-default px-4 pb-3 pt-4 sm:px-6">
          <UFormField v-if="admin" :label="t.personalizacao.editando" orientation="horizontal" :ui="{ container: 'flex-1' }">
            <USelect v-model="escopo" :items="opcoesDeEscopo" class="w-full" />
          </UFormField>
          <UTabs v-model="aba" :items="abas" :content="false" variant="link" class="w-full" />
        </div>

        <!-- Na sua Home -->
        <div v-if="aba === 'naHome'" class="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-6">
          <p class="mb-3 flex gap-2 text-xs text-muted">
            <UIcon name="i-lucide-mouse-pointer-2" class="mt-0.5 size-3.5 shrink-0" />{{ t.personalizacao.dica }}
          </p>
          <TransitionGroup tag="ol" name="lista" class="relative space-y-1">
            <li
              v-for="(x, i) in naHome"
              :key="x.widget.id"
              class="flex items-center gap-3 rounded-md border border-default bg-default px-3 py-2"
            >
              <span class="w-5 shrink-0 text-right text-xs tabular-nums text-dimmed">{{ i + 1 }}</span>
              <UIcon :name="definicao(x.widget.tipo).icone" class="size-4 shrink-0 text-primary" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-highlighted">{{ x.titulo }}</span>
                <span v-if="x.titulo !== t.widgets[x.widget.tipo].titulo" class="block truncate text-xs text-muted">{{ t.widgets[x.widget.tipo].titulo }}</span>
              </span>
              <span class="flex shrink-0 items-center">
                <UTooltip :text="t.personalizacao.subir(x.titulo)">
                  <UButton icon="i-lucide-arrow-up" color="neutral" variant="ghost" size="xs" :disabled="i === 0" :aria-label="t.personalizacao.subir(x.titulo)" @click="emit('subir', x.widget.id)" />
                </UTooltip>
                <UTooltip :text="t.personalizacao.descer(x.titulo)">
                  <UButton icon="i-lucide-arrow-down" color="neutral" variant="ghost" size="xs" :disabled="i === naHome.length - 1" :aria-label="t.personalizacao.descer(x.titulo)" @click="emit('descer', x.widget.id)" />
                </UTooltip>
                <UTooltip :text="t.personalizacao.remover(x.titulo)">
                  <UButton icon="i-lucide-eye-off" color="neutral" variant="ghost" size="xs" :aria-label="t.personalizacao.remover(x.titulo)" @click="emit('remover', x.widget.id)" />
                </UTooltip>
              </span>
            </li>
          </TransitionGroup>
          <div v-if="!naHome.length" class="flex flex-col items-center gap-3 py-10 text-center">
            <p class="text-sm text-muted">
              {{ t.personalizacao.nenhumWidget }}
            </p>
            <UButton :label="t.estados.adicionarWidget" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="aba = 'adicionar'" />
          </div>
        </div>

        <!-- Adicionar widget -->
        <div v-else class="flex min-h-0 flex-1 flex-col">
          <div class="px-4 pt-3 sm:px-6">
            <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.personalizacao.buscar" class="w-full" autofocus />
          </div>
          <div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-3 sm:px-6">
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
                    @click="adicionar(d.tipo)"
                  />
                </li>
              </ul>
            </section>
            <p v-if="!grupos.length" class="py-10 text-center text-sm text-muted">
              {{ t.personalizacao.semResultado }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template v-if="escopo === 'minha'" #footer>
      <div v-if="!confirmando" class="flex w-full justify-start">
        <UButton :label="t.personalizacao.restaurar" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" size="sm" @click="confirmando = true" />
      </div>
      <div v-else class="w-full space-y-2">
        <p class="text-sm text-toned">
          {{ t.personalizacao.restaurarConfirma }}
        </p>
        <div class="flex justify-end gap-2">
          <UButton :label="t.config.cancelar" color="neutral" variant="outline" size="sm" @click="confirmando = false" />
          <UButton :label="t.personalizacao.restaurar" icon="i-lucide-rotate-ccw" size="sm" @click="emit('restaurar'); confirmando = false" />
        </div>
      </div>
    </template>
  </USlideover>
</template>

<style scoped>
/* Subir e Descer deslizam a linha para o lugar novo. TransitionGroup só se anima com classe; o Nuxt UI não tem lista ordenável. */
.lista-move { transition: transform 200ms var(--ease-out, ease-out); }
@media (prefers-reduced-motion: reduce) { .lista-move { transition: none; } }
</style>
