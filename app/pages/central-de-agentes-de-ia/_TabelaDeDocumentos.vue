<script setup lang="ts">
/**
 * PROPOSTA: a lista de documentos de conhecimento, a mesma no workspace e no
 * agente. Cada linha diz como o agente lê o documento: "Fixado" (sempre
 * inteiro) ou "Automática" (inteiro enquanto couber, por trechos acima disso).
 *
 * `compacta` esconde data, autor e ações: é o resumo do conhecimento do
 * workspace dentro do cadastro do agente, onde ele só se lê.
 */
import type { Textos } from './textos'
import { pessoaPorId, EU, type ArquivoDeReferencia } from './mocks'
import { formatarData, iconeDoDocumento } from './estado'

const props = defineProps<{ t: Textos, docs: ArquivoDeReferencia[], compacta?: boolean }>()
const emit = defineEmits<{ remover: [id: string] }>()
const toast = useToast()
const idioma = useIdioma()
const k = computed(() => props.t.conhecimento)

function fixar(d: ArquivoDeReferencia) {
  d.fixado = !d.fixado
  toast.add({ title: d.fixado ? k.value.fixou(d.nome) : k.value.desafixou(d.nome), icon: d.fixado ? 'i-lucide-pin' : 'i-lucide-pin-off', color: 'neutral' })
}
function substituir(d: ArquivoDeReferencia) {
  d.versao += 1
  d.enviadoEm = '2026-11-16'
  d.enviadoPor = EU
  toast.add({ title: k.value.substituido(d.nome, d.versao), icon: 'i-lucide-refresh-cw', color: 'success' })
}
const acoes = (d: ArquivoDeReferencia) => [[
  { label: k.value.substituir, icon: 'i-lucide-refresh-cw', onSelect: () => substituir(d) },
  { label: k.value.baixar, icon: 'i-lucide-download' },
], [
  { label: k.value.remover, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => emit('remover', d.id) },
]]

const detalhe = (d: ArquivoDeReferencia) => `${d.tipo === 'texto' ? k.value.tipoTexto : k.value.paginas(d.paginas)} · ${k.value.versao(d.versao)}`
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-default">
    <table class="w-full text-sm">
      <thead class="bg-elevated/50 text-left text-xs text-muted">
        <tr>
          <th class="px-3 py-2 font-medium">{{ k.colunas.nome }}</th>
          <th class="px-3 py-2 font-medium">{{ k.colunas.tamanho }}</th>
          <th class="px-3 py-2 font-medium">{{ k.colunas.leitura }}</th>
          <template v-if="!compacta">
            <th class="px-3 py-2 font-medium">{{ k.colunas.enviado }}</th>
            <th class="px-3 py-2 font-medium">{{ k.colunas.por }}</th>
            <th class="w-12 px-3 py-2"><span class="sr-only">{{ k.colunas.acoes }}</span></th>
          </template>
        </tr>
      </thead>
      <TransitionGroup tag="tbody" class="divide-y divide-default" enter-active-class="transition duration-300" enter-from-class="opacity-0 bg-primary/10" leave-active-class="transition duration-200" leave-to-class="opacity-0">
        <tr v-for="d in docs" :key="d.id">
          <td class="px-3 py-2.5">
            <div class="flex items-center gap-2">
              <UIcon :name="iconeDoDocumento(d.tipo).icone" class="size-5 shrink-0" :class="iconeDoDocumento(d.tipo).cor" />
              <div class="min-w-0">
                <p class="truncate font-medium text-highlighted">{{ d.nome }}</p>
                <p class="text-xs text-muted">{{ detalhe(d) }}</p>
              </div>
            </div>
          </td>
          <td class="whitespace-nowrap px-3 py-2.5 tabular-nums text-muted">{{ k.tokens(d.tokens) }}</td>
          <td class="whitespace-nowrap px-3 py-2.5">
            <UBadge v-if="compacta" :label="d.fixado ? k.leituraFixado : k.leituraAuto" :icon="d.fixado ? 'i-lucide-pin' : undefined" :color="d.fixado ? 'primary' : 'neutral'" variant="soft" size="sm" />
            <UButton
              v-else
              :label="d.fixado ? k.fixado : k.fixar"
              :icon="d.fixado ? 'i-lucide-pin' : 'i-lucide-pin-off'"
              :color="d.fixado ? 'primary' : 'neutral'"
              :variant="d.fixado ? 'soft' : 'outline'"
              size="xs"
              :aria-pressed="d.fixado"
              :aria-label="`${d.fixado ? k.desafixar : k.fixar}: ${d.nome}`"
              @click="fixar(d)"
            />
          </td>
          <template v-if="!compacta">
            <td class="whitespace-nowrap px-3 py-2.5 text-muted">{{ formatarData(d.enviadoEm, idioma) }}</td>
            <td class="px-3 py-2.5">
              <span class="flex items-center gap-1.5">
                <UAvatar :text="pessoaPorId(d.enviadoPor).iniciais" size="2xs" />
                <span class="truncate text-muted">{{ pessoaPorId(d.enviadoPor).nome }}</span>
              </span>
            </td>
            <td class="px-3 py-2.5 text-right">
              <UDropdownMenu :items="acoes(d)" :content="{ align: 'end' }">
                <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" :aria-label="k.colunas.acoes" />
              </UDropdownMenu>
            </td>
          </template>
        </tr>
      </TransitionGroup>
    </table>
  </div>
</template>
