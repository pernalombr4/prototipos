<script setup lang="ts">
/**
 * PROPOSTA: uma ligação que o ENSPACE não consegue garantir, com o ajuste que cabe a ela.
 * Usada na lista "Ligações a conferir" do mapa e no painel do fluxo.
 */
import type { Fase, Pendencia } from './consultas'
import { textoDoEvento } from './consultas'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, p: Pendencia, fase: Fase }>()
const emit = defineEmits<{ confirmar: [], descartar: [], ligar: [], externa: [] }>()

const icone = { possivel: 'i-lucide-circle-help', foraDaConfiguracao: 'i-lucide-eye', porVariavel: 'i-lucide-variable', externa: 'i-lucide-webhook' } as const

const texto = computed(() => {
  const l = props.t.ligacoes
  const p = props.p
  if (p.tipo === 'possivel') {
    const detalhe = l.possivel.detalhe(p.ligacao.condicao ?? '')
    return { titulo: l.possivel.titulo(p.fluxo.name, textoDoEvento(p.ligacao.evento!, props.t)), detalhe: props.fase === 2 ? `${detalhe}. ${l.possivel.semExecucao}` : detalhe }
  }
  if (p.tipo === 'foraDaConfiguracao') return { titulo: l.fora.titulo(p.fluxo.name, textoDoEvento(p.ligacao.evento!, props.t)), detalhe: l.fora.detalhe(p.ligacao.observadas) }
  if (p.tipo === 'porVariavel') return { titulo: l.porVariavel.titulo(p.fluxo.name), detalhe: l.porVariavel.detalhe(p.fluxo.gravaPorVariavel!.no, p.fluxo.gravaPorVariavel!.campo) }
  return { titulo: l.externa.titulo(p.fluxo.name), detalhe: l.externa.detalhe }
})
</script>

<template>
  <div class="flex flex-col gap-2 rounded-md border border-warning/40 bg-default p-3">
    <div class="flex items-start gap-2">
      <UIcon :name="icone[p.tipo]" class="mt-0.5 size-4 shrink-0 text-warning" />
      <div class="min-w-0">
        <p class="text-sm text-highlighted">{{ texto.titulo }}</p>
        <p class="mt-0.5 text-xs text-muted">{{ texto.detalhe }}</p>
      </div>
    </div>
    <div class="flex flex-wrap gap-1.5 pl-6">
      <template v-if="p.tipo === 'possivel' || p.tipo === 'foraDaConfiguracao'">
        <UButton :label="t.ligacoes.confirmar" icon="i-lucide-check" size="xs" color="neutral" variant="outline" @click="emit('confirmar')" />
        <UButton v-if="p.tipo === 'possivel'" :label="t.ligacoes.descartar" icon="i-lucide-x" size="xs" color="neutral" variant="ghost" @click="emit('descartar')" />
      </template>
      <template v-else-if="p.tipo === 'porVariavel'">
        <UButton :label="t.ligacoes.ligarFluxo" icon="i-lucide-link" size="xs" color="neutral" variant="outline" @click="emit('ligar')" />
        <UButton :label="t.ligacoes.naoLiga" icon="i-lucide-x" size="xs" color="neutral" variant="ghost" @click="emit('descartar')" />
      </template>
      <template v-else>
        <UButton :label="t.ligacoes.indicarOrigem" icon="i-lucide-link" size="xs" color="neutral" variant="outline" @click="emit('ligar')" />
        <UButton :label="t.ligacoes.veioDeFora" icon="i-lucide-globe" size="xs" color="neutral" variant="ghost" @click="emit('externa')" />
      </template>
    </div>
  </div>
</template>
