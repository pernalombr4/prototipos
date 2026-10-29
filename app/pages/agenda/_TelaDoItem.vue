<script setup lang="ts">
/**
 * A tela do item (`/types/<categoria>/<referência>?folder=...`), aberta pelo "Acessar Item" do painel, como no
 * develop.
 *
 * ⚠️ A CASCA NÃO É PROPOSTA. Copiada olhando o develop em 29/10/2026 (workspace de exploração, item da categoria
 * "leve"): à esquerda, o painel com ícone, referência, categoria, selo e os grupos Identificação, Origem e
 * Histórico em caixas, com o botão de recolher; no alto, as pastas como abas sublinhadas (Visão Geral, Comentários,
 * Logs de Auditoria, Tarefas, Anexos, Emails Automáticos, Mail Box, Notas, Campos) e o ícone de nova pasta na ponta;
 * Salvar no canto de baixo. A pasta aberta vai para a URL (`?folder=`).
 *
 * A proposta é 1 pasta: Agenda, depois de Tarefas, com o mesmo conteúdo da aba Agenda do painel
 * (`_AgendaDoItem.vue`). As outras pastas não mudam e mostram só o aviso, menos a Visão Geral (os campos do item).
 */
import type { Textos } from './textos'
import { diaNumerico, hora } from './datas'
import { item } from './estado'
import { categoriaPorSlug, pessoaPorId } from './mocks'
import CascaDaAgenda from './_CascaDaAgenda.vue'
import AgendaDoItem from './_AgendaDoItem.vue'

const props = defineProps<{ t: Textos, locale: string, itemId: number, conectando?: boolean }>()
const pasta = defineModel<string>('pasta', { default: 'agenda' })
const emit = defineEmits<{ voltar: [], abrirEvento: [chave: string], abrirTarefa: [id: number], irParaDia: [dia: string], conectar: [] }>()

const it = computed(() => item(props.itemId)!)
const cat = computed(() => categoriaPorSlug(it.value.categoria))
const recolhido = ref(false)
const pastas = [
  { chave: 'visaoGeral', icone: 'i-lucide-layers' },
  { chave: 'comentarios', icone: 'i-lucide-message-circle' },
  { chave: 'logs', icone: 'i-lucide-shield-check' },
  { chave: 'tarefas', icone: 'i-lucide-clipboard-check' },
  { chave: 'agenda', icone: 'i-lucide-calendar-days', nova: true },
  { chave: 'anexos', icone: 'i-lucide-paperclip' },
  { chave: 'emailsAutomaticos', icone: 'i-lucide-mail' },
  { chave: 'mailBox', icone: 'i-lucide-mail' },
  { chave: 'notas', icone: 'i-lucide-file-text' },
  { chave: 'campos', icone: 'i-lucide-table-properties' },
]
const iconeDa = (chave: string) => pastas.find(p => p.chave === chave)!.icone

const valor = (chave: string, tipo: string) => {
  const v = it.value.data[chave]
  if (v === undefined || v === '') return ''
  if (tipo === 'data') return diaNumerico(String(v), props.locale)
  if (tipo === 'hora') return hora(Number(v))
  return String(v)
}
const grupos = computed(() => [
  { titulo: props.t.telaItem.identificacao, linhas: [{ icone: 'i-lucide-hash', rotulo: props.t.telaItem.id, valor: String(it.value.id) }] },
  { titulo: props.t.telaItem.origem, linhas: [
    { icone: 'i-lucide-activity', rotulo: props.t.telaItem.status, valor: props.t.telaItem.ativo },
    { icone: 'i-lucide-mail', rotulo: props.t.telaItem.emailSolicitante, valor: pessoaPorId(it.value.responsavel)?.email ?? '--' },
  ] },
  { titulo: props.t.telaItem.historico, linhas: [
    { icone: 'i-lucide-calendar', rotulo: props.t.telaItem.criadoEm, valor: `${diaNumerico(String(it.value.data.created_at), props.locale)}, 09:12:40` },
    { icone: 'i-lucide-calendar-clock', rotulo: props.t.telaItem.atualizadoEm, valor: `${diaNumerico('2026-10-27', props.locale)}, 17:03:11` },
  ] },
])
</script>

<template>
  <CascaDaAgenda :t="t" :ativo="it.categoria" :trilha="[t.casca.itens.categorias, cat.name, it.reference]" @voltar="emit('voltar')" @agenda="emit('voltar')">
    <div class="relative flex h-full min-h-0 pb-(--altura-do-andaime)">
      <!-- Painel de informações (cópia) -->
      <aside class="relative hidden shrink-0 flex-col border-r border-default transition-[width] duration-200 ease-out md:flex" :class="recolhido ? 'w-14' : 'w-58'">
        <div v-if="!recolhido" class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
          <div class="flex items-start gap-2.5">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ring-accented">
              <UIcon name="i-lucide-file" class="size-5 text-highlighted" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="break-all text-sm font-semibold leading-snug text-highlighted">{{ it.reference }}</p>
              <p class="font-mono text-xs text-toned">{{ cat.name.toLowerCase() }}</p>
            </div>
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.telaItem.maisAcoes" />
          </div>
          <UBadge :label="cat.name.toLowerCase()" icon="i-lucide-briefcase" color="neutral" variant="outline" size="sm" class="self-start rounded-full" />
          <section v-for="g in grupos" :key="g.titulo" class="flex flex-col gap-1.5">
            <p class="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-toned"><span class="size-1 rounded-full bg-accented" />{{ g.titulo }}</p>
            <div class="flex flex-col gap-2 rounded-md border border-default p-2.5">
              <p v-for="l in g.linhas" :key="l.rotulo" class="flex items-start gap-2">
                <UIcon :name="l.icone" class="mt-0.5 size-3.5 shrink-0 text-muted" />
                <span class="min-w-0">
                  <span class="block text-[10px] uppercase text-muted">{{ l.rotulo }}</span>
                  <span class="block break-all text-sm font-semibold text-highlighted">{{ l.valor }}</span>
                </span>
              </p>
            </div>
          </section>
        </div>
        <div v-else class="flex flex-col items-center gap-3 py-3">
          <UIcon name="i-lucide-file" class="size-5 text-highlighted" />
          <UIcon name="i-lucide-hash" class="mt-2 size-4 text-toned" />
          <UIcon name="i-lucide-activity" class="size-4 text-toned" />
          <UIcon name="i-lucide-calendar" class="size-4 text-toned" />
        </div>
        <UButton :icon="recolhido ? 'i-lucide-chevrons-right' : 'i-lucide-chevrons-left'" color="neutral" variant="outline" size="xs" class="absolute bottom-3 right-2 rounded-full" :aria-label="t.telaItem.recolher" @click="recolhido = !recolhido" />
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <!-- Pastas como abas (cópia do visual de hoje; Agenda é a pasta proposta) -->
        <div class="flex items-center border-b border-default pl-2 pr-3">
          <div class="flex min-w-0 flex-1 items-center overflow-x-auto overflow-y-hidden [scrollbar-width:none]" role="tablist" :aria-label="t.telaItem.pastasDoItem">
            <button
              v-for="p in pastas"
              :key="p.chave"
              type="button"
              role="tab"
              :aria-selected="pasta === p.chave"
              class="relative flex h-10 shrink-0 items-center gap-1.5 px-3 text-sm transition-colors"
              :class="pasta === p.chave ? 'font-medium text-primary' : 'text-toned hover:text-highlighted'"
              @click="pasta = p.chave"
            >
              <UIcon :name="p.icone" class="size-4" />{{ t.telaItem.pastas[p.chave] }}
              <UIcon v-if="pasta === p.chave" name="i-lucide-chevron-down" class="size-3.5" />
              <span v-if="pasta === p.chave" class="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
            </button>
          </div>
          <UButton icon="i-lucide-folder-plus" color="neutral" variant="ghost" size="xs" class="shrink-0" :aria-label="t.telaItem.novaPasta" />
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto p-5" role="tabpanel">
          <div v-if="pasta === 'agenda'" class="mx-auto max-w-2xl animate-[entrada_.3s_ease-out_both]">
            <AgendaDoItem
              :t="t"
              :locale="locale"
              :item-id="itemId"
              :conectando="conectando"
              @abrir-evento="emit('abrirEvento', $event)"
              @abrir-tarefa="emit('abrirTarefa', $event)"
              @ir-para-dia="emit('irParaDia', $event)"
              @conectar="emit('conectar')"
            />
          </div>
          <div v-else-if="pasta === 'visaoGeral'" class="flex flex-col gap-5">
            <UFormField v-for="c in cat.campos.filter(x => x.chave !== 'created_at')" :key="c.chave" :label="c.rotulo" :required="c.obrigatorio">
              <UInput :model-value="valor(c.chave, c.tipo)" size="md" class="w-full" readonly />
            </UFormField>
          </div>
          <UEmpty v-else :icon="iconeDa(pasta)" :title="t.telaItem.pastas[pasta]" :description="t.telaItem.foraDaProposta" variant="naked" class="mt-16" />
        </div>

        <UButton :label="t.telaItem.salvar" icon="i-lucide-save" size="sm" class="absolute bottom-[calc(var(--altura-do-andaime)+0.75rem)] right-4" />
      </div>
    </div>
  </CascaDaAgenda>
</template>
