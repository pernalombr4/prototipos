<script setup lang="ts">
/**
 * PROPOSTA (rodada 3): salvar o projeto como modelo.
 *
 * No produto, o modelo é um caso de uso (Interface > Casos de uso), feito pelo mesmo exportador e
 * pelo mesmo importador. O modelo guarda a estrutura: categorias com campos, formulários e
 * visualizações, e, se marcados, os fluxos, os avisos de prazo e o painel. Itens e participantes
 * nunca entram. Peça nova no importador: exportar só as categorias do projeto (DECISOES.md).
 */
import type { Textos } from './textos'
import { useProjetos } from './estado'

const props = defineProps<{ t: Textos }>()
const prj = useProjetos()
const toast = useToast()

const aberto = computed({
  get: () => prj.janelas.modelo.value !== null,
  set: (v) => { if (!v) prj.janelas.modelo.value = null },
})
const p = computed(() => prj.projetos.value.find(x => x.id === prj.janelas.modelo.value) ?? null)
const nCategorias = computed(() => p.value ? prj.categoriasDe(p.value.id).length : 0)
const nFluxos = computed(() => p.value ? prj.fluxosDoProjeto(p.value.id).length : 0)
const nAvisos = computed(() => p.value ? prj.avisosDoProjeto(p.value.id).length : 0)

const nome = ref('')
const descricao = ref('')
const fluxos = ref(true)
const avisos = ref(true)
const painel = ref(true)
const tentou = ref(false)
const salvando = ref(false)

watch(aberto, (v) => {
  if (!v || !p.value) return
  nome.value = p.value.nome
  descricao.value = p.value.descricao
  fluxos.value = nFluxos.value > 0
  avisos.value = nAvisos.value > 0
  painel.value = true
  tentou.value = false
})
const erroNome = computed(() => tentou.value && !nome.value.trim() ? props.t.modelo.nomeObrigatorio : undefined)

async function salvar() {
  tentou.value = true
  if (erroNome.value || !p.value) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  const m = prj.salvarComoModelo(p.value.id, nome.value.trim(), descricao.value.trim(), { fluxos: fluxos.value, avisos: avisos.value, painel: painel.value })
  salvando.value = false
  aberto.value = false
  toast.add({ title: props.t.modelo.salvo(m.nome), icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.modelo.janelaTitulo" :description="t.modelo.janelaDescricao">
    <template #body>
      <form v-if="p" class="space-y-4" @submit.prevent="salvar">
        <UFormField :label="t.modelo.nome" :error="erroNome" required>
          <UInput v-model="nome" class="w-full" maxlength="60" autofocus />
        </UFormField>
        <UFormField :label="t.modelo.descricao">
          <UTextarea v-model="descricao" :rows="2" autoresize class="w-full" />
        </UFormField>
        <UFormField :label="t.modelo.inclui">
          <div class="mt-1 space-y-2">
            <UCheckbox :model-value="true" disabled :label="t.modelo.incluiCategorias(nCategorias)" />
            <UCheckbox v-model="fluxos" :disabled="!nFluxos" :label="t.modelo.incluiFluxos(nFluxos)" />
            <UCheckbox v-model="avisos" :disabled="!nAvisos" :label="t.modelo.incluiAvisos(nAvisos)" />
            <UCheckbox v-model="painel" :label="t.modelo.incluiPainel" />
            <UCheckbox :model-value="true" disabled :label="t.modelo.incluiAcesso" />
          </div>
        </UFormField>
        <p class="flex items-start gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-shield-check" class="mt-px size-3.5 shrink-0" />{{ t.modelo.naoTraz }}
        </p>
        <button type="submit" class="hidden" />
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.modelo.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton :label="t.modelo.salvar" icon="i-lucide-copy-plus" color="primary" :loading="salvando" @click="salvar" />
      </div>
    </template>
  </UModal>
</template>
