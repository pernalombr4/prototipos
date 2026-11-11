<script setup lang="ts">
/**
 * Relatório nativo das Tarefas Rápidas (RF021).
 *
 * O caminho é o do develop (BRIEFING do `meus-relatorios`, 14/10/2026): ícone
 * "Extrair Relatório" na barra, menu com "Relatório Padrão", modal "Formato de
 * extração" com Excel, CSV e DBF, e o aviso de processamento. Nada disso muda.
 *
 * A proposta é o conteúdo do arquivo: as colunas Vencimento (o antigo "Data
 * limite"), Prazo final e Prazo final vencido. Como o arquivo não se abre no
 * navegador, a prévia dele é ANDAIME: uma tabela com as primeiras linhas,
 * do jeito que a planilha sai.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Textos } from './textos'
import type { TextosR5 } from './textos-r5'
import type { TarefaRapida } from './mocks'
import { concluidaEm, membros } from './mocks'
import { criadoEm, formatar, prazoFinalVencido } from './datas'

const props = defineProps<{ t: Textos, r: TextosR5, idioma: Idioma, tarefas: TarefaRapida[] }>()

const toast = useToast()
const formatoAberto = ref(false)
const previaAberta = ref(false)
const formato = ref('')
const gerando = ref('')

const menu = computed(() => [[{ label: props.r.relatorioPadrao, icon: 'i-lucide-file-spreadsheet', onSelect: () => { formatoAberto.value = true } }]])

function escolher(f: string) {
  gerando.value = f
  setTimeout(() => {
    gerando.value = ''
    formato.value = f
    formatoAberto.value = false
    toast.add({ title: props.r.processando, color: 'success', icon: 'i-lucide-check' })
    previaAberta.value = true
  }, 500)
}

const fmt = (d: string | null) => formatar(d, props.idioma)
const colunas = computed(() => {
  const c = props.r.colunasRelatorio
  return [
    { chave: 'id', rotulo: c.id },
    { chave: 'nome', rotulo: c.nome },
    { chave: 'status', rotulo: c.status },
    { chave: 'responsavel', rotulo: c.responsavel },
    { chave: 'prioridade', rotulo: c.prioridade },
    { chave: 'criado', rotulo: c.criado },
    { chave: 'prazo', rotulo: c.prazo, muda: true },
    { chave: 'prazoFinal', rotulo: c.prazoFinal, nova: true },
    { chave: 'vencido', rotulo: c.vencido, nova: true },
    { chave: 'concluida', rotulo: c.concluida },
  ]
})
const linhas = computed(() => props.tarefas.map(tr => ({
  id: tr.id,
  nome: tr.name,
  status: props.t.situacoes[tr.status],
  responsavel: membros.find(m => m.id === tr.assigned_to)?.nome ?? '',
  prioridade: props.t.prioridades[tr.priority],
  criado: fmt(criadoEm(tr)),
  prazo: fmt(tr.due_date),
  prazoFinal: fmt(tr.final_due_date),
  // Sem prazo final, a célula fica vazia: "Não" diria que há um prazo final cumprido.
  vencido: tr.final_due_date ? (prazoFinalVencido(tr) ? props.r.sim : props.r.nao) : '',
  concluida: fmt(concluidaEm[tr.id] ?? null),
}) as Record<string, string | number>))
</script>

<template>
  <UDropdownMenu :items="menu" :content="{ align: 'end' }">
    <UTooltip :text="r.extrairRelatorio">
      <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" :aria-label="r.extrairRelatorio" />
    </UTooltip>
  </UDropdownMenu>

  <UModal v-model:open="formatoAberto" :title="r.formatoTitulo" :description="r.formatoDescricao">
    <template #body>
      <div class="grid grid-cols-3 gap-3">
        <UButton
          v-for="f in ['Excel', 'CSV', 'DBF']"
          :key="f"
          :label="f"
          :icon="f === 'Excel' ? 'i-lucide-file-spreadsheet' : 'i-lucide-file-text'"
          color="neutral"
          variant="outline"
          size="lg"
          block
          :loading="gerando === f"
          :disabled="!!gerando && gerando !== f"
          @click="escolher(f)"
        />
      </div>
    </template>
  </UModal>

  <!-- ANDAIME: a prévia do arquivo baixado. Não é tela do produto. -->
  <UModal
    v-model:open="previaAberta"
    :title="`Prévia do arquivo (${formato})`"
    description="Andaime do protótipo: as linhas como a planilha sai. As colunas marcadas são a proposta."
    :ui="{ content: 'max-w-6xl' }"
  >
    <template #body>
      <div class="overflow-x-auto rounded-lg border border-default">
        <table class="w-full text-left text-xs">
          <thead class="bg-elevated">
            <tr>
              <th
                v-for="c in colunas"
                :key="c.chave"
                scope="col"
                class="whitespace-nowrap border-b border-default px-3 py-2 font-semibold text-highlighted"
                :class="c.nova ? 'bg-primary/10' : c.muda ? 'bg-warning/10' : ''"
              >
                {{ c.rotulo }}
                <UBadge v-if="c.nova" label="nova" size="xs" color="primary" variant="subtle" class="ml-1" />
                <UBadge v-else-if="c.muda" label="era Data limite" size="xs" color="warning" variant="subtle" class="ml-1" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(l, i) in linhas" :key="l.id" class="[animation:entrada_.3s_ease-out_both]" :style="{ animationDelay: `${i * 25}ms` }">
              <td
                v-for="c in colunas"
                :key="c.chave"
                class="whitespace-nowrap border-b border-default px-3 py-1.5"
                :class="[c.nova ? 'bg-primary/5' : '', c.chave === 'vencido' && l.vencido === r.sim ? 'font-semibold text-error' : 'text-toned']"
              >
                {{ l[c.chave] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </UModal>
</template>
