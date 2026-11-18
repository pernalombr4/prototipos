<script setup lang="ts">
/**
 * A tarefa Integração do fluxo da categoria, que cria o envelope no módulo.
 *
 * Cópia do print do QA de 18/11/2026: "#<n> - Integração", abas Tarefa, Item e Histórico, Detalhes da Tarefa, o bloco
 * "Integração: <provedor>" com o assinante, a cobrança e "Documento Assinado · Aguardando ações.", e "Concluir Tarefa".
 * PROPOSTA:
 * - B9: o bloco leva ao envelope no módulo;
 * - M35, C48 e C10: envelope cancelado no módulo ou recusado, e falha de envio, levam a tarefa a Erro, com o motivo no
 *   topo e no Histórico. A cobrança sai: não há mais o que cobrar. Hoje a tarefa fica em andamento com a cobrança ativa,
 *   e a falha de envio aparece só no Histórico.
 */
import { pessoaPorId, provedorPorId, tarefaIntegracao } from './mocks'
import { envelopePorId } from './estado'
import { dataHora } from './formato'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ abrirEnvelope: [number], enviarDeNovo: [] }>()
const tt = computed(() => props.t.tarefa)
const loc = computed(() => props.t.locale)
const dh = (iso: string) => dataHora(iso, loc.value)

const env = computed(() => envelopePorId(tarefaIntegracao.envelope)!)
const p = computed(() => provedorPorId.get(env.value.provider)!)
const estadoDaTarefa = computed(() => (env.value.status === 'canceled' || env.value.status === 'rejected' ? 'cancelado' : env.value.status === 'error' ? 'falhaEnvio' : 'andamento'))
const emErro = computed(() => estadoDaTarefa.value !== 'andamento')

const erro = computed(() => {
  if (estadoDaTarefa.value === 'falhaEnvio') return { titulo: tt.value.falhaEnvio(p.value.nome), motivo: '' }
  const ev = [...env.value.eventos].reverse().find(e => e.tipo === 'canceled' || e.tipo === 'rejected')
  const quem = ev?.autor.tipo === 'pessoa' ? pessoaPorId.get(ev.autor.id)!.nome : p.value.nome
  return { titulo: tt.value.cancelado(quem, dh(ev?.em ?? env.value.created_at)), motivo: ev?.motivo ? props.t.envelope.faixa.motivo(ev.motivo) : '' }
})

const aba = ref('tarefa')
const abas = computed(() => [
  { value: 'tarefa', label: tt.value.abas.tarefa },
  { value: 'item', label: tt.value.abas.item },
  { value: 'historico', label: tt.value.abas.historico },
])
const historico = computed(() => [
  { icone: 'i-lucide-circle-plus', texto: tt.value.historico.criada, em: tarefaIntegracao.criadaEm, detalhe: '' },
  { icone: 'i-lucide-send', texto: tt.value.historico.enviada, em: env.value.created_at, detalhe: '' },
  ...(emErro.value ? [{ icone: 'i-lucide-octagon-alert', texto: tt.value.historico.erro, em: env.value.canceled_at ?? env.value.eventos.at(-1)!.em, detalhe: [erro.value.titulo, erro.value.motivo].filter(Boolean).join(' ') }] : []),
].reverse())
const reenviando = ref(false)
async function enviarDeNovo() {
  reenviando.value = true
  await new Promise(r => setTimeout(r, 800))
  reenviando.value = false
  emit('enviarDeNovo')
}
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="mx-auto max-w-3xl space-y-4 px-6 py-5">
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="text-lg font-semibold text-highlighted">{{ tt.titulo(tarefaIntegracao.id) }}</h1>
        <UBadge :key="estadoDaTarefa" :label="tt.status[emErro ? 'error' : 'working']" :color="emErro ? 'error' : 'warning'" variant="soft" class="animate-[entrada_.3s_ease-out_both]" />
      </div>
      <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" />

      <template v-if="aba === 'tarefa'">
        <!-- PROPOSTA: o erro e o motivo no topo -->
        <UAlert v-if="emErro" :key="estadoDaTarefa" color="error" variant="subtle" icon="i-lucide-octagon-alert" :title="tt.erroTitulo" class="animate-[entrada_.3s_ease-out_both]">
          <template #description>
            <p>{{ erro.titulo }}</p>
            <p v-if="erro.motivo">{{ erro.motivo }}</p>
          </template>
        </UAlert>

        <section class="rounded-lg border border-default bg-default">
          <h2 class="border-b border-default px-4 py-3 text-sm font-semibold text-highlighted">{{ tt.detalhes }}</h2>
          <dl class="grid grid-cols-2 gap-3 px-4 py-3 text-sm">
            <div><dt class="text-xs text-muted">{{ tt.criado }}</dt><dd class="tabular-nums text-toned">{{ dh(tarefaIntegracao.criadaEm) }}</dd></div>
            <div><dt class="text-xs text-muted">{{ tt.vencimento }}</dt><dd class="tabular-nums text-toned">{{ dh(tarefaIntegracao.vencimento) }}</dd></div>
          </dl>
        </section>

        <section class="rounded-lg border border-default bg-default">
          <h2 class="border-b border-default px-4 py-3 text-sm font-semibold text-highlighted">{{ tt.bloco(p.nome) }}</h2>
          <div class="space-y-3 px-4 py-3">
            <div v-for="pa in env.participantes" :key="pa.id" class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p class="text-xs text-muted">{{ tt.assinante }}</p>
                <p class="text-sm text-toned">{{ pa.email }}</p>
              </div>
              <UButton v-if="!emErro" :label="tt.cobranca" icon="i-lucide-mail" color="neutral" variant="outline" size="sm" />
            </div>
            <p v-if="emErro && estadoDaTarefa === 'cancelado'" class="text-xs text-muted">{{ tt.semCobranca }}</p>
            <p v-if="!emErro" class="text-sm text-muted"><span class="font-medium text-toned">{{ tt.docAssinado }}</span> · {{ tt.aguardando }}</p>

            <!-- B9: o envelope no módulo -->
            <button
              type="button"
              class="group flex w-full items-center gap-3 rounded-md border border-default px-3 py-2.5 text-left transition-colors hover:border-accented hover:bg-elevated/50"
              @click="emit('abrirEnvelope', env.id)"
            >
              <UIcon name="i-lucide-signature" class="size-4 text-muted" />
              <span class="min-w-0 flex-1">
                <span class="block text-xs text-muted">{{ tt.envelope }}</span>
                <span class="block truncate text-sm font-medium text-highlighted">{{ env.title }} · {{ t.status[env.status] }}</span>
              </span>
              <span class="flex items-center gap-1 text-xs font-medium text-primary">{{ tt.abrirEnvelope }}<UIcon name="i-lucide-arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" /></span>
            </button>
          </div>
        </section>

        <UButton v-if="estadoDaTarefa === 'falhaEnvio'" :label="tt.enviarDeNovo" icon="i-lucide-send" block size="lg" :loading="reenviando" @click="enviarDeNovo" />
        <!-- PROPOSTA: em erro, Concluir sai. O botão desligado parecia ligado e não diz o que fazer. -->
        <UButton v-else-if="!emErro" :label="tt.concluir" block size="lg" />
      </template>

      <ol v-else-if="aba === 'historico'" class="space-y-3">
        <li v-for="(h, i) in historico" :key="i" class="flex gap-3 rounded-lg border border-default bg-default px-4 py-3">
          <UIcon :name="h.icone" class="mt-0.5 size-4 shrink-0" :class="h.icone.includes('alert') ? 'text-error' : 'text-muted'" />
          <div class="min-w-0">
            <p class="text-sm font-medium text-highlighted">{{ h.texto }}</p>
            <p class="text-xs tabular-nums text-muted">{{ dh(h.em) }}</p>
            <p v-if="h.detalhe" class="mt-1 text-sm text-toned">{{ h.detalhe }}</p>
          </div>
        </li>
      </ol>

      <UEmpty v-else icon="i-lucide-construction" :title="t.geral.foraDoEscopo" :description="t.geral.foraDoEscopoDesc" variant="naked" />
    </div>
  </div>
</template>
