<script setup lang="ts">
/**
 * O painel lateral da tarefa. A Agenda abre o mesmo painel da tela de Tarefas.
 *
 * ⚠️ A CASCA NÃO É PROPOSTA. Copiada olhando o develop em 29/10/2026 (Tarefas › Agendadas, workspace de exploração):
 * à esquerda, o trilho de ícones com dica (painel, ID, Tarefa, Referência do item, Nome do Fluxo, Etapa do Fluxo,
 * Status); no alto, as abas Tarefa, Item, Histórico e Comentários; na aba Tarefa, "Detalhes da Tarefa" (Criado em,
 * Vencimento em, Compartilhado com) e "Concluir Etapa" na largura toda; na aba Item, "Detalhes do Item" com "Acessar
 * Item", o ícone de ocultar, Referência, Criado em, Categoria e Formulário. O painel que a Agenda abre hoje é outro
 * (abas Tarefa, Item, Histórico, visto em 28/10): a proposta usa 1 painel só, achado no BRIEFING.
 *
 * O que é proposta (rodada 2):
 *  - aba Agenda, depois de Comentários: o mesmo componente da Agenda do item (`_AgendaDoAlvo.vue`, correção da
 *    redatora em 24/11/2026). A reunião agendada aqui se liga à tarefa, não ao item (correção de 29/10/2026): o item
 *    a vê pela tarefa. O colaborador reserva o próprio horário e agenda reunião; quem conclui é o responsável;
 *  - a ação da aba Tarefa segue a permissão: só o responsável conclui; a tarefa de aprovação tem Aprovar e Reprovar;
 *    a de formulário pede o campo antes do "Concluir Etapa". No develop, o botão desligado "Você não é o responsável
 *    pela tarefa" aparece até para o responsável (achado no BRIEFING); aqui, quem não pode não vê o botão, e uma linha
 *    diz por quê.
 */
import type { Lugar } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import { diaNumerico, hora } from './datas'
import { diaDe, item, minutoDe, tarefa, temSla } from './estado'
import { categoriaPorSlug, pessoaPorId } from './mocks'
import AgendaDoAlvo from './_AgendaDoAlvo.vue'
import CumprirTarefa from './_CumprirTarefa.vue'

type Aba = 'tarefa' | 'item' | 'historico' | 'comentarios' | 'agenda'
const props = defineProps<{ t: Textos, locale: string, tarefaId: number | null, conectando?: boolean }>()
const aba = defineModel<Aba>('aba', { default: 'tarefa' })
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ mover: [chave: string, lugar: Lugar], acessar: [id: number], irParaDia: [dia: string], abrirEvento: [chave: string], conectar: [] }>()

const tf = computed(() => tarefa(props.tarefaId ?? 0) ?? null)
const it = computed(() => item(tf.value?.item))
const cat = computed(() => it.value ? categoriaPorSlug(it.value.categoria) : null)
const sla = computed(() => !!tf.value && temSla(tf.value))
const responsavel = computed(() => pessoaPorId(tf.value?.assigned_to))
const feita = computed(() => tf.value?.status === 'completed')

const abas = computed(() => (['tarefa', 'item', 'historico', 'comentarios', 'agenda'] as const).map(v => ({
  label: props.t.tarefa.abas[v],
  value: v,
  icon: v === 'agenda' ? 'i-lucide-calendar-days' : undefined,
})))

/** O trilho de ícones do develop: cada ícone mostra o valor na dica. */
const trilho = computed(() => {
  const x = tf.value
  if (!x) return []
  const r = props.t.tarefa.trilho
  return [
    { icone: 'i-lucide-hash', dica: `${r.id}: ${x.reference}` },
    { icone: 'i-lucide-square-check-big', dica: `${r.nome}: ${x.name}` },
    { icone: 'i-lucide-tag', dica: `${r.referencia}: ${it.value?.reference ?? '--'}` },
    { icone: 'i-lucide-workflow', dica: `${r.fluxo}: ${cat.value && x.origem === 'fluxo' ? props.t.tarefa.fluxoDe(cat.value.name) : '--'}` },
    { icone: 'i-lucide-layers', dica: `${r.etapa}: ${x.origem === 'fluxo' ? x.name : '--'}` },
    { icone: 'i-lucide-circle-dot', dica: `${r.status}: ${props.t.tarefa.status[x.status] ?? x.status}` },
  ]
})

const dataHora = (d: Date | null) => d ? `${diaNumerico(diaDe(d), props.locale)}, ${hora(minutoDe(d))}:00` : '--'

/* ---------- histórico (recorte) ---------- */
const historico = computed(() => {
  if (!tf.value) return []
  const x = tf.value
  return [
    feita.value && x.completed_at ? { icone: 'i-lucide-circle-check', texto: props.t.tarefa.concluidaPor(pessoaPorId(x.completed_by)?.nome ?? '--', dataHora(x.completed_at)) } : null,
    { icone: 'i-lucide-user-round', texto: props.t.tarefa.atribuida(responsavel.value?.nome ?? '--') },
    { icone: 'i-lucide-plus', texto: props.t.tarefa.criada(pessoaPorId(x.creator)?.nome ?? '--', dataHora(x.created_at)) },
  ].filter(Boolean) as { icone: string, texto: string }[]
})
const rotulo = 'text-sm font-semibold text-highlighted'
</script>

<template>
  <USlideover v-model:open="aberto" :title="tf ? `${tf.reference} - ${tf.name}` : ''" :ui="{ content: 'max-w-lg' }">
    <template #content>
      <div v-if="tf" class="flex h-full min-h-0">
        <!-- Trilho de ícones (cópia) -->
        <nav class="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-default py-3" :aria-label="t.tarefa.trilho.painel">
          <UIcon name="i-lucide-panel-right" class="mb-2 size-5 text-primary" />
          <UTooltip v-for="r in trilho" :key="r.icone" :text="r.dica" :content="{ side: 'right' }">
            <span class="flex size-8 items-center justify-center rounded-md text-toned transition-colors hover:bg-elevated hover:text-highlighted" role="img" :aria-label="r.dica">
              <UIcon :name="r.icone" class="size-4" />
            </span>
          </UTooltip>
        </nav>

        <div class="flex min-w-0 flex-1 flex-col">
          <header class="flex items-start gap-2 px-4 pt-4">
            <h2 class="min-w-0 flex-1 text-base font-semibold text-highlighted">{{ tf.reference }} - {{ tf.name }}</h2>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t.criacao.cancelar" @click="aberto = false" />
          </header>
          <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" class="w-full px-2" />

          <div class="min-h-0 flex-1 overflow-y-auto p-4">
            <!-- Tarefa (cópia do develop, com a ação pela permissão) -->
            <div v-if="aba === 'tarefa'" class="flex flex-col gap-4">
              <p class="flex items-center justify-between" :class="rotulo">
                {{ t.tarefa.detalhesDaTarefa }}
                <UButton icon="i-lucide-refresh-cw" color="neutral" variant="ghost" size="xs" :aria-label="t.tarefa.atualizar" />
              </p>
              <dl class="flex flex-col gap-2.5 text-sm">
                <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.criadoEm }}:</dt><dd class="text-highlighted">{{ dataHora(tf.created_at) }}</dd></div>
                <div class="flex items-center gap-2">
                  <dt class="text-muted">{{ t.tarefa.vencimentoEm }}:</dt>
                  <dd class="flex items-center gap-1.5 text-highlighted">{{ dataHora(tf.due_date) }}<UIcon v-if="sla" name="i-lucide-lock" class="size-3.5 text-muted" /></dd>
                </div>
                <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.compartilhadoCom }}:</dt><dd class="text-highlighted">{{ tf.collaborators?.length ? tf.collaborators.map(c => pessoaPorId(c)?.nome).join(', ') : t.tarefa.ninguem }}</dd></div>
                <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.responsavel }}:</dt><dd class="break-all text-highlighted">{{ responsavel?.email }}</dd></div>
              </dl>

              <CumprirTarefa :t="t" :tarefa-id="tf.id" class="border-t border-default pt-4" />
            </div>

            <!-- Item (cópia do develop) -->
            <div v-else-if="aba === 'item'" class="flex flex-col gap-4">
              <p :class="rotulo">{{ t.tarefa.detalhesDoItem }}</p>
              <template v-if="it">
                <span class="flex items-center gap-2">
                  <UButton :label="t.tarefa.acessarItem" icon="i-lucide-arrow-up-right" size="sm" @click="emit('acessar', it.id)" />
                  <UButton icon="i-lucide-eye-off" color="neutral" variant="ghost" size="sm" :aria-label="t.tarefa.ocultar" />
                </span>
                <dl class="flex flex-col gap-2.5 text-sm">
                  <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.referencia }}:</dt><dd class="break-all text-highlighted">{{ it.reference }}</dd></div>
                  <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.criadoEm }}:</dt><dd class="font-mono text-xs leading-5 text-highlighted">{{ t.tarefa.criadoPor(diaNumerico(String(it.data.created_at), locale), pessoaPorId(it.criador)?.nome ?? '--') }}</dd></div>
                  <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.categoria }}:</dt><dd class="text-highlighted">{{ cat?.name }}</dd></div>
                  <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.formulario }}:</dt><dd class="text-highlighted">{{ cat?.name }}</dd></div>
                </dl>
              </template>
              <p v-else class="py-6 text-center text-sm text-muted">{{ t.tarefa.semItem }}</p>
            </div>

            <!-- Histórico (recorte) -->
            <ol v-else-if="aba === 'historico'" class="flex flex-col gap-3">
              <li v-for="(h, i) in historico" :key="i" class="flex items-start gap-2 text-sm text-toned">
                <UIcon :name="h.icone" class="mt-0.5 size-4 shrink-0 text-muted" />{{ h.texto }}
              </li>
            </ol>

            <UEmpty v-else-if="aba === 'comentarios'" icon="i-lucide-message-circle" :title="t.tarefa.semComentarios" :description="t.telaItem.foraDaProposta" variant="naked" size="sm" class="mt-8" />

            <!-- Agenda (proposta): o mesmo componente da Agenda do item -->
            <AgendaDoAlvo
              v-else
              :t="t"
              :locale="locale"
              :alvo="{ tipo: 'tarefa', id: tf.id }"
              :conectando="conectando"
              @abrir-evento="emit('abrirEvento', $event)"
              @ir-para-dia="emit('irParaDia', $event)"
              @conectar="emit('conectar')"
              @mover="(c, l) => emit('mover', c, l)"
            />
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
