<script setup lang="ts">
/**
 * PROPOSTA: os limites do workspace para todos os agentes. O agente pode
 * restringir mais, nunca liberar além (PESQUISA: Notion "Models Custom Agents
 * can use", Copilot Studio, Claude, ServiceNow).
 */
import type { Textos } from './textos'
import { modelos, ferramentas, nomeDoProvedor, iconeDoProvedor, provedoresEmOrdem } from './catalogo'
import { espera, usePoliticas } from './estado'

const props = defineProps<{ t: Textos }>()
const politicas = usePoliticas()
const toast = useToast()
const p = computed(() => props.t.politicas)

const criacao = computed(() => (['admins', 'completos', 'todos'] as const).map(k => ({ value: k, label: p.value.criacaoOpcoes[k] })))
const porProvedor = computed(() => provedoresEmOrdem.map(pr => ({ pr, itens: modelos.filter(m => m.provider === pr) })))

function alternarModelo(id: string, v: boolean) {
  politicas.value.modelos = v ? [...politicas.value.modelos, id] : politicas.value.modelos.filter(x => x !== id)
}

const escritas = ferramentas.filter(f => f.efeito !== 'le')
const itensFerramentas = computed(() => escritas.map(f => ({ value: f.slug, label: props.t.ferramentas.nomes[f.slug] ?? f.slug })))

const limite = computed({
  get: () => politicas.value.limite ?? undefined,
  set: (v: number | undefined) => { politicas.value.limite = v ?? null },
})

const salvando = ref(false)
async function salvar() {
  salvando.value = true
  await espera(700)
  salvando.value = false
  toast.add({ title: p.value.salvo, icon: 'i-lucide-shield-check', color: 'success' })
}
</script>

<template>
  <div class="max-w-4xl space-y-8">
    <div>
      <h1 class="text-xl font-semibold text-highlighted">{{ p.titulo }}</h1>
      <p class="mt-0.5 text-sm text-muted">{{ p.subtitulo }}</p>
    </div>

    <UFormField :label="p.criacao">
      <URadioGroup v-model="politicas.criacao" :items="criacao" value-key="value" />
    </UFormField>

    <USeparator />

    <section>
      <h2 class="text-sm font-semibold text-highlighted">{{ p.modelos }}</h2>
      <p class="mb-3 text-xs text-muted">{{ p.modelosAjuda }}</p>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="g in porProvedor" :key="g.pr" class="rounded-lg border border-default p-3">
          <p class="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <UIcon :name="iconeDoProvedor[g.pr]" class="size-3.5" />{{ nomeDoProvedor[g.pr] }}
          </p>
          <ul class="space-y-1.5">
            <li v-for="m in g.itens" :key="m.id">
              <UCheckbox :model-value="politicas.modelos.includes(m.id)" :label="m.name" @update:model-value="(v) => alternarModelo(m.id, !!v)" />
            </li>
          </ul>
        </div>
      </div>
    </section>

    <USeparator />

    <section class="space-y-4">
      <UFormField :label="p.ferramentas" :help="p.ferramentasAjuda">
        <USelectMenu v-model="politicas.bloqueadas" :items="itensFerramentas" value-key="value" multiple class="w-full" icon="i-lucide-shield-off" />
      </UFormField>
      <div class="flex items-start gap-3 rounded-lg border border-default p-3">
        <USwitch v-model="politicas.confirmacaoObrigatoria" class="mt-0.5" :aria-label="p.confirmacaoObrigatoria" />
        <div>
          <p class="text-sm font-medium text-highlighted">{{ p.confirmacaoObrigatoria }}</p>
          <p class="text-xs text-muted">{{ p.confirmacaoObrigatoriaAjuda }}</p>
        </div>
      </div>
      <UFormField :label="p.dominios" :help="p.dominiosAjuda">
        <UInputTags v-model="politicas.dominios" :placeholder="p.dominiosPlaceholder" class="w-full" />
      </UFormField>
      <UFormField :label="p.limite" :help="p.limiteAjuda">
        <UInputNumber v-model="limite" :placeholder="p.limitePlaceholder" :step="1000" :min="0" class="w-48" />
      </UFormField>
    </section>

    <div class="flex justify-end">
      <UButton :label="p.salvar" icon="i-lucide-save" :loading="salvando" @click="salvar" />
    </div>
  </div>
</template>
