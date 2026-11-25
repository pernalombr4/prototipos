<script setup lang="ts">
/**
 * PROPOSTA: a tela de quem chega a um projeto em que não entra (link, busca, vínculo).
 *   - fechado: nomeia o projeto e oferece "Pedir acesso ao projeto";
 *   - privado: a mesma resposta de endereço inexistente, para não confirmar que o projeto existe
 *     (o GitHub responde 404 pelo mesmo motivo).
 */
import type { Textos } from './textos'
import { useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const { marca } = useMarcaDeProposta()
const toast = useToast()

const p = computed(() => prj.projetos.value.find(x => x.id === props.id))
const fechado = computed(() => !!p.value && prj.enxerga(p.value))
const pediu = computed(() => prj.pedidos.value.includes(props.id))
const enviando = ref(false)

async function pedir() {
  enviando.value = true
  await new Promise(r => setTimeout(r, 600))
  enviando.value = false
  prj.pedirAcesso(props.id)
  toast.add({ title: props.t.diretorio.pedidoEnviado(p.value!.nome), icon: 'i-lucide-send', color: 'success' })
}
</script>

<template>
  <div class="flex min-h-full items-center justify-center px-6 py-16">
    <div class="flex max-w-md flex-col items-center gap-3 text-center animate-[entrada_0.25s_ease-out_both]" :class="marca">
      <span class="flex size-12 items-center justify-center rounded-xl bg-elevated">
        <UIcon :name="fechado ? 'i-lucide-lock' : 'i-lucide-file-question'" class="size-6 text-muted" />
      </span>
      <template v-if="fechado">
        <h1 class="text-lg font-semibold text-highlighted">{{ t.semAcesso.fechadoTitulo }}</h1>
        <p class="text-sm text-muted">{{ t.semAcesso.fechadoTexto(p!.nome) }}</p>
        <UAlert v-if="pediu" :title="t.semAcesso.pedido" icon="i-lucide-clock" color="neutral" variant="subtle" class="mt-1 text-left" />
        <div class="mt-1 flex flex-wrap justify-center gap-2">
          <UButton v-if="!pediu" :label="t.semAcesso.pedir" icon="i-lucide-key-round" color="primary" :loading="enviando" @click="pedir" />
          <UButton :label="t.semAcesso.voltar" icon="i-lucide-list" color="neutral" variant="outline" @click="prj.tela.value = { tipo: 'diretorio' }" />
        </div>
      </template>
      <template v-else>
        <h1 class="text-lg font-semibold text-highlighted">{{ t.semAcesso.privadoTitulo }}</h1>
        <p class="text-sm text-muted">{{ t.semAcesso.privadoTexto }}</p>
        <UButton :label="t.semAcesso.voltarAoInicio" icon="i-lucide-house" color="neutral" variant="outline" class="mt-1" @click="prj.tela.value = { tipo: 'inicio' }" />
      </template>
    </div>
  </div>
</template>
