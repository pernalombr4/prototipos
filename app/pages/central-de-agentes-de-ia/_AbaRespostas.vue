<script setup lang="ts">
/**
 * PROPOSTA (demanda 5): os modelos de resposta que este agente usa.
 *
 * O modelo mora na biblioteca do workspace (aba "Modelos de resposta" do
 * topo) e o agente só vincula. Assim o mesmo texto aprovado serve a mais de
 * um agente e muda num lugar só.
 */
import type { Textos } from './textos'
import type { Agente } from './mocks'
import { useBlocos, useTela } from './estado'

const props = defineProps<{ t: Textos, a: Agente }>()
const blocos = useBlocos()
const tela = useTela()
const r = computed(() => props.t.respostasDoAgente)

const vinculados = computed(() => blocos.value.filter(b => props.a.blocos.includes(b.id)))
const livres = computed(() => blocos.value.filter(b => !props.a.blocos.includes(b.id)).map(b => ({
  value: b.id,
  label: `${b.codigo} · ${b.nome}`,
  disabled: b.status !== 'aprovado',
  suffix: b.status !== 'aprovado' ? props.t.biblioteca.status.rascunho : undefined,
})))

const escolha = ref<string | undefined>()
watch(escolha, (id) => {
  if (!id) return
  props.a.blocos.push(id)
  nextTick(() => { escolha.value = undefined })
})

function desvincular(id: string) { props.a.blocos = props.a.blocos.filter(x => x !== id) }
function irParaBiblioteca() {
  tela.value.editorAberto = false
  tela.value.aba = 'respostas'
}

const soVinculados = ref(true)
const camposUnicos = (b: typeof blocos.value[number]) => new Set(b.campos.map(c => c.chave)).size
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 class="text-base font-semibold text-highlighted">{{ r.titulo }}</h3>
        <p class="mt-0.5 max-w-2xl text-sm text-muted">{{ r.texto }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <USelectMenu
          v-model="escolha"
          :items="livres"
          value-key="value"
          :placeholder="r.vincular"
          icon="i-lucide-link"
          class="w-64"
          :search-input="{ placeholder: t.biblioteca.buscar }"
        />
        <UButton :label="r.novo" icon="i-lucide-plus" color="neutral" variant="outline" @click="irParaBiblioteca" />
      </div>
    </div>

    <TransitionGroup v-if="vinculados.length" tag="ul" class="grid gap-3 md:grid-cols-2" enter-active-class="transition duration-300" enter-from-class="opacity-0 scale-[0.98]" leave-active-class="transition duration-150" leave-to-class="opacity-0">
      <li v-for="b in vinculados" :key="b.id" class="flex flex-col rounded-lg border border-default p-3 transition hover:border-accented">
        <div class="flex items-start gap-2">
          <UBadge :label="b.codigo" color="primary" variant="solid" size="sm" class="font-mono" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-highlighted">{{ b.nome }}</p>
            <p class="mt-0.5 text-xs text-muted">{{ b.quandoUsar }}</p>
          </div>
          <UButton icon="i-lucide-unlink" color="neutral" variant="ghost" size="xs" :aria-label="r.desvincular" @click="desvincular(b.id)" />
        </div>
        <div class="mt-2 flex flex-wrap gap-x-3 text-xs text-dimmed">
          <span>{{ r.campos(camposUnicos(b)) }}</span>
          <span>{{ r.usos(b.usos30d) }}</span>
        </div>
      </li>
    </TransitionGroup>
    <p v-else class="rounded-lg bg-elevated/50 px-4 py-6 text-center text-sm text-muted">{{ r.vazio }}</p>

    <div class="flex items-start gap-3 rounded-lg border border-default p-3">
      <USwitch v-model="soVinculados" :aria-label="r.regra" class="mt-0.5" />
      <div>
        <p class="text-sm font-medium text-highlighted">{{ r.regra }}</p>
        <p class="text-xs text-muted">{{ r.regraAjuda }}</p>
      </div>
    </div>
  </div>
</template>
