<script setup lang="ts">
/**
 * PROPOSTA: a aba Ferramentas, que hoje é o "Filtro de ferramentas" da aba
 * Essencial (51 slugs em inglês, e vazio = todas).
 *
 * - nome em português, a descrição e o slug embaixo, para o dev;
 * - agrupadas como o catálogo do servidor já agrupa;
 * - o efeito de cada uma (lê, grava, envia, cobra, sai do ENSPACE, muda acessos);
 * - o modo de cada ferramenta ligada: Pede confirmação ou Executa direto
 *   (demanda 1). O padrão: tudo que não só lê pede confirmação;
 * - agente novo nasce com nenhuma ligada (o mercado inteiro: PESQUISA).
 */
import type { Textos } from './textos'
import type { Agente } from './mocks'
import { ferramentas, grupos, iconeDoEfeito, corDoEfeito, pedeConfirmacaoPorPadrao, type Efeito, type Ferramenta } from './catalogo'
import { usePoliticas } from './estado'

const props = defineProps<{ t: Textos, a: Agente }>()
const politicas = usePoliticas()
const f = computed(() => props.t.ferramentas)

const busca = ref('')
const efeito = ref<Efeito | 'todos'>('todos')
const efeitos = computed(() => [
  { value: 'todos', label: f.value.todas },
  ...(['le', 'grava', 'envia', 'cobra', 'sai', 'acesso'] as Efeito[]).map(k => ({ value: k, label: f.value.efeitos[k], icon: iconeDoEfeito[k] })),
])

const bloqueada = (x: Ferramenta) => politicas.value.bloqueadas.includes(x.slug)
const obrigatoria = (x: Ferramenta) => politicas.value.confirmacaoObrigatoria && ['envia', 'cobra', 'acesso'].includes(x.efeito)

const normal = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const visiveis = computed(() => {
  const q = normal(busca.value)
  return ferramentas.filter(x => (efeito.value === 'todos' || x.efeito === efeito.value)
    && (!q || normal(`${f.value.nomes[x.slug]} ${x.slug} ${f.value.descricoes[x.slug]}`).includes(q)))
})
const porGrupo = computed(() => grupos.map(g => ({ g, itens: visiveis.value.filter(x => x.grupo === g) })).filter(x => x.itens.length))

const ligada = (x: Ferramenta) => x.slug in props.a.ferramentas
function alternar(x: Ferramenta, v: boolean) {
  if (v) props.a.ferramentas[x.slug] = pedeConfirmacaoPorPadrao(x) || obrigatoria(x) ? 'confirmar' : 'executar'
  else delete props.a.ferramentas[x.slug]
}

const modos = computed(() => [
  { value: 'confirmar', label: f.value.modo.confirmar, icon: 'i-lucide-hand' },
  { value: 'executar', label: f.value.modo.executar, icon: 'i-lucide-zap' },
])

function atalho(qual: 'nenhuma' | 'soLeitura' | 'recomendadas') {
  const novo: Record<string, 'confirmar' | 'executar'> = {}
  const escolha = qual === 'nenhuma'
    ? []
    : qual === 'soLeitura'
      ? ferramentas.filter(x => x.efeito === 'le')
      : ferramentas.filter(x => ['itens', 'tarefas', 'utilitarios'].includes(x.grupo) && ['le', 'grava'].includes(x.efeito) && x.slug !== 'exportItems')
  escolha.filter(x => !bloqueada(x)).forEach((x) => { novo[x.slug] = pedeConfirmacaoPorPadrao(x) ? 'confirmar' : 'executar' })
  props.a.ferramentas = novo
}

const total = computed(() => Object.keys(props.a.ferramentas).length)
const diretas = computed(() => Object.entries(props.a.ferramentas).filter(([s, m]) => m === 'executar' && ferramentas.find(x => x.slug === s)!.efeito !== 'le').length)
const contagem = (g: string) => ferramentas.filter(x => x.grupo === g && ligada(x)).length
</script>

<template>
  <div class="space-y-5">
    <div>
      <h3 class="text-base font-semibold text-highlighted">{{ f.titulo }}</h3>
      <p class="mt-0.5 max-w-3xl text-sm text-muted">{{ f.texto }}</p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <UInput v-model="busca" icon="i-lucide-search" :placeholder="f.buscar" class="w-full sm:w-64" size="sm" />
      <USelect v-model="efeito" :items="efeitos" value-key="value" size="sm" class="w-48" :aria-label="f.filtroEfeito" />
      <USeparator orientation="vertical" class="mx-1 hidden h-5 sm:block" />
      <UButton v-for="k in (['nenhuma', 'soLeitura', 'recomendadas'] as const)" :key="k" :label="f.atalhos[k]" color="neutral" variant="outline" size="xs" @click="atalho(k)" />
      <span class="ml-auto text-sm tabular-nums text-muted" aria-live="polite">{{ f.ligadas(total, ferramentas.length) }}</span>
    </div>

    <UAlert v-if="diretas" color="warning" variant="subtle" icon="i-lucide-triangle-alert" :title="f.avisoExecutaDireto(diretas)" />
    <UAlert v-if="total === ferramentas.length" color="warning" variant="subtle" icon="i-lucide-triangle-alert" :title="f.avisoTodas" />

    <section v-for="{ g, itens } in porGrupo" :key="g" class="overflow-hidden rounded-lg border border-default">
      <header class="flex items-center gap-2 bg-elevated/50 px-4 py-2">
        <h4 class="text-sm font-semibold text-highlighted">{{ f.grupos[g] }}</h4>
        <UBadge :label="`${contagem(g)}/${ferramentas.filter(x => x.grupo === g).length}`" color="neutral" variant="soft" size="sm" />
      </header>
      <ul class="divide-y divide-default">
        <li
          v-for="x in itens"
          :key="x.slug"
          class="grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-2 px-4 py-3 transition-colors sm:grid-cols-[auto_1fr_13rem]"
          :class="[ligada(x) ? 'bg-primary/[0.03]' : '', bloqueada(x) ? 'opacity-60' : '']"
        >
          <USwitch
            :model-value="ligada(x)"
            :disabled="bloqueada(x)"
            class="mt-0.5"
            :aria-label="f.nomes[x.slug]"
            @update:model-value="(v: boolean) => alternar(x, v)"
          />
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="text-sm font-medium text-highlighted">{{ f.nomes[x.slug] }}</span>
              <UBadge :label="f.efeitos[x.efeito]" :icon="iconeDoEfeito[x.efeito]" :color="corDoEfeito[x.efeito]" variant="soft" size="sm" />
              <UBadge v-if="bloqueada(x)" :label="f.bloqueadaPolitica" icon="i-lucide-shield-off" color="neutral" variant="outline" size="sm" />
            </div>
            <p class="mt-0.5 text-xs text-muted">{{ f.descricoes[x.slug] }}</p>
            <p class="mt-0.5 flex flex-wrap gap-x-2 text-[11px] text-dimmed">
              <code>{{ x.slug }}</code>
              <span v-if="x.soMembroCompleto">· {{ f.soMembroCompleto }}</span>
            </p>
          </div>
          <div class="col-start-2 sm:col-start-3">
              <template v-if="ligada(x)">
                <p v-if="x.efeito === 'le'" class="flex items-center gap-1.5 pt-1 text-xs text-muted">
                  <UIcon name="i-lucide-zap" class="size-3.5" />{{ f.modoLeitura }}
                </p>
                <UTooltip v-else :text="obrigatoria(x) ? t.politicas.confirmacaoObrigatoriaAjuda : ''" :disabled="!obrigatoria(x)">
                  <USelect
                    v-model="a.ferramentas[x.slug]"
                    :items="modos"
                    value-key="value"
                    size="sm"
                    class="w-full"
                    :disabled="obrigatoria(x)"
                    :color="a.ferramentas[x.slug] === 'executar' ? 'warning' : 'primary'"
                    :highlight="a.ferramentas[x.slug] === 'executar'"
                    :aria-label="`${f.nomes[x.slug]}: modo`"
                  />
                </UTooltip>
              </template>
          </div>
        </li>
      </ul>
    </section>

    <UFormField v-if="'sendEmail' in a.ferramentas" :label="f.dominios" :help="f.dominiosAjuda" class="max-w-xl">
      <UInputTags :model-value="[]" :placeholder="t.politicas.dominiosPlaceholder" class="w-full" />
    </UFormField>
  </div>
</template>
