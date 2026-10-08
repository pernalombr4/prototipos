<script setup lang="ts">
/**
 * A visão rápida do item, copiada do develop (print develop-02).
 *
 * ⚠️ NADA AQUI É PROPOSTA, com 2 exceções:
 *   1. o campo "Minuta do contrato" (`_CampoDocumento.vue`), que é a demanda;
 *   2. o aviso "Alterações não salvas" do rodapé, que no develop aparece desde
 *      a abertura, sem nada alterado. Aqui ele só aparece quando um campo do
 *      formulário muda. O documento NÃO passa pelo Salvar do item: ele salva
 *      sozinho, no editor. Mostrar "não salvo" ao lado de um documento salvo
 *      é a confusão do achado 10 do BRIEFING.
 *
 * Copiado: gaveta à direita sobre a lista escurecida; trilho de ícones à
 * esquerda; abas Visão Geral, Comentários, Logs de Auditoria, Tarefas; clipe
 * de anexos; navegador "1/9" com setas; campos em coluna; rodapé com
 * Sair sem salvar e Salvar. Referência: `<BASE_URL>/workspaces/
 * <WORKSPACE_EXPLORACAO>/types/leve/`, 08/10/2026.
 */
import type { Textos } from './textos'
import { type Editor, type StatusDoContrato, campoDoDocumento, pessoas } from './mocks'
import { useDocumentos } from './estado'
import CampoDocumento from './_CampoDocumento.vue'

const props = defineProps<{ t: Textos, idioma: string }>()
const emit = defineEmits<{
  abrir: [itemId: number, editor: Editor | null]
  ler: [itemId: number]
  versoes: [itemId: number]
  voltarAoWord: [itemId: number]
}>()

const toast = useToast()
const { itens, itemAbertoId, itemAberto, estadoDaTela } = useDocumentos()

const aberto = computed({
  get: () => itemAbertoId.value !== null,
  set: (v) => { if (!v) itemAbertoId.value = null },
})

const indice = computed(() => itens.value.findIndex(i => i.id === itemAbertoId.value))
function navegar(passo: number) {
  const alvo = itens.value[indice.value + passo]
  if (alvo) itemAbertoId.value = alvo.id
}

/* rascunho dos campos comuns: só eles passam pelo Salvar do item */
const rascunho = ref({ status: 'rascunho' as StatusDoContrato, contratante: '', objeto: '', valor: 0, vigencia_meses: 0, responsavel: 1 })
function carregar() {
  const d = itemAberto.value?.data
  if (d) rascunho.value = { status: d.status, contratante: d.contratante, objeto: d.objeto, valor: d.valor, vigencia_meses: d.vigencia_meses, responsavel: d.responsavel }
}
watch(itemAbertoId, carregar, { immediate: true })

const mudou = computed(() => {
  const d = itemAberto.value?.data
  if (!d) return false
  const r = rascunho.value
  return r.status !== d.status || r.contratante !== d.contratante || r.objeto !== d.objeto || r.valor !== d.valor || r.vigencia_meses !== d.vigencia_meses || r.responsavel !== d.responsavel
})

const salvando = ref(false)
async function salvar() {
  if (!itemAberto.value) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  const id = itemAberto.value.id
  itens.value = itens.value.map(i => (i.id === id ? { ...i, updated_at: new Date(), data: { ...i.data, ...rascunho.value } } : i))
  salvando.value = false
  toast.add({ title: props.t.item.salvo, icon: 'i-lucide-check', color: 'success' })
}

const opcoesDeStatus = computed(() => (Object.keys(props.t.statusDoContrato) as StatusDoContrato[]).map(s => ({ label: props.t.statusDoContrato[s], value: s })))
const opcoesDeResponsavel = computed(() => pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais } })))

const trilho = [
  { icone: 'i-lucide-file-text', ativo: true },
  { icone: 'i-lucide-hash' },
  { icone: 'i-lucide-activity' },
  { icone: 'i-lucide-calendar-check' },
]
</script>

<template>
  <USlideover
    v-model:open="aberto"
    side="right"
    :ui="{ content: 'max-w-[39rem]' }"
    :title="itemAberto?.reference ?? ''"
  >
    <template #content>
      <div v-if="itemAberto" class="flex h-full min-h-0">
        <!-- trilho de ícones (cópia) -->
        <nav class="flex w-11 shrink-0 flex-col items-center gap-3 border-r border-default py-3" aria-hidden="true">
          <span
            v-for="(r, i) in trilho"
            :key="i"
            class="flex size-7 items-center justify-center rounded-full"
            :class="r.ativo ? 'bg-primary/10 text-primary ring-1 ring-primary/30' : 'text-muted'"
          >
            <UIcon :name="r.icone" class="size-4" />
          </span>
        </nav>

        <div class="flex min-w-0 flex-1 flex-col">
          <!-- abas e navegador (cópia) -->
          <div class="flex shrink-0 items-center gap-1 border-b border-default px-2 py-1.5">
            <UButton icon="i-lucide-layers" :label="t.item.visaoGeral" color="primary" variant="ghost" size="xs" class="font-medium" />
            <UButton icon="i-lucide-message-circle" :label="t.item.comentarios" color="neutral" variant="ghost" size="xs" />
            <UButton icon="i-lucide-shield-check" :label="t.item.logs" color="neutral" variant="ghost" size="xs" class="hidden sm:inline-flex" />
            <UButton icon="i-lucide-clipboard-check" :label="t.item.tarefas" trailing-icon="i-lucide-chevron-down" color="neutral" variant="ghost" size="xs" class="hidden md:inline-flex" />
            <span class="ml-auto flex items-center gap-0.5">
              <UButton icon="i-lucide-paperclip" color="neutral" variant="ghost" size="xs" :aria-label="t.item.anexos" />
              <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="xs" :disabled="indice <= 0" :aria-label="t.casca.voltar" @click="navegar(-1)" />
              <span class="text-xs tabular-nums text-muted">{{ indice + 1 }}/{{ itens.length }}</span>
              <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" :disabled="indice >= itens.length - 1" :aria-label="t.casca.avancar" @click="navegar(1)" />
            </span>
          </div>

          <!-- campos -->
          <div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
            <p class="flex items-center gap-2">
              <UBadge :label="itemAberto.reference" color="info" variant="subtle" class="font-mono" />
              <span class="truncate text-sm text-muted">{{ itemAberto.data.contratante }}</span>
            </p>

            <UFormField :label="t.lista.status">
              <USelect v-model="rascunho.status" :items="opcoesDeStatus" class="w-full" :disabled="estadoDaTela === 'somenteLeitura'" />
            </UFormField>
            <UFormField :label="t.lista.contratante">
              <UInput v-model="rascunho.contratante" class="w-full" :disabled="estadoDaTela === 'somenteLeitura'" />
            </UFormField>
            <UFormField :label="t.item.objeto">
              <UInput v-model="rascunho.objeto" class="w-full" :disabled="estadoDaTela === 'somenteLeitura'" />
            </UFormField>
            <div class="grid grid-cols-2 gap-3">
              <UFormField :label="t.lista.valor">
                <UInputNumber
                  v-model="rascunho.valor"
                  :format-options="{ style: 'currency', currency: 'BRL' }"
                  :locale="idioma"
                  class="w-full"
                  :disabled="estadoDaTela === 'somenteLeitura'"
                />
              </UFormField>
              <UFormField :label="t.item.vigencia">
                <UInputNumber v-model="rascunho.vigencia_meses" :min="1" class="w-full" :disabled="estadoDaTela === 'somenteLeitura'" />
              </UFormField>
            </div>
            <UFormField :label="t.item.responsavel">
              <USelectMenu v-model="rascunho.responsavel" :items="opcoesDeResponsavel" value-key="value" class="w-full" :disabled="estadoDaTela === 'somenteLeitura'" />
            </UFormField>

            <!-- PROPOSTA: o campo Editor de Documentos -->
            <CampoDocumento
              :item="itemAberto"
              :t="t"
              :idioma="idioma"
              :rotulo="campoDoDocumento.rotulo"
              @abrir="(e: Editor | null) => emit('abrir', itemAberto!.id, e)"
              @ler="emit('ler', itemAberto!.id)"
              @versoes="emit('versoes', itemAberto!.id)"
              @voltar-ao-word="emit('voltarAoWord', itemAberto!.id)"
            />
          </div>

          <!-- rodapé (cópia; o aviso só com mudança é proposta) -->
          <div class="flex shrink-0 items-center gap-2 border-t border-default px-4 py-2.5">
            <Transition
              enter-active-class="transition duration-150"
              enter-from-class="opacity-0"
              leave-active-class="transition duration-100"
              leave-to-class="opacity-0"
            >
              <span v-if="mudou" class="flex items-center gap-1.5 text-xs text-muted">
                <span class="size-1.5 rounded-full bg-warning" />
                {{ t.item.alteracoesNaoSalvas }}
              </span>
            </Transition>
            <span class="ml-auto flex items-center gap-2">
              <UButton icon="i-lucide-undo-2" :label="t.item.sairSemSalvar" color="neutral" variant="ghost" size="sm" @click="aberto = false" />
              <UButton icon="i-lucide-save" :label="t.item.salvar" size="sm" :loading="salvando" :disabled="!mudou" @click="salvar" />
            </span>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
