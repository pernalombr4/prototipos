<script setup lang="ts">
/**
 * Painel da tarefa rápida (RF002, RF003, RF004, RF013, RF014).
 *
 * Só a seção "Datas" é proposta: o prazo de hoje ganha ao lado o prazo final.
 * Abas Comentários e Logs, cabeçalho e rodapé seguem o painel do develop e
 * são maquete aqui.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Textos } from './textos'
import type { TarefaRapida } from './mocks'
import { membros } from './mocks'
import { atrasada, formatar, ordemValida, prazoFinalVencido } from './datas'
import CampoDeData from './_CampoDeData.vue'

const props = defineProps<{
  t: Textos
  idioma: Idioma
  tarefa: TarefaRapida | null
  podeEditar: boolean
  falharAoSalvar: boolean
}>()

const aberto = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ gravar: [id: number, campo: 'due_date' | 'final_due_date', valor: string | null] }>()

const toast = useToast()
const aba = ref('tarefa')
const erroPrazo = ref('')
const erroPrazoFinal = ref('')
const salvando = ref<'due_date' | 'final_due_date' | null>(null)
/** Remonta os campos quando a gravação falha, para voltar ao valor salvo. */
const versao = ref(0)

watch(() => props.tarefa?.id, () => {
  erroPrazo.value = ''
  erroPrazoFinal.value = ''
  aba.value = 'tarefa'
})

const fmt = (d: string | null) => formatar(d, props.idioma)
const responsavel = computed(() => membros.find(m => m.id === props.tarefa?.assigned_to)?.nome)

const abas = computed(() => [
  { label: props.t.abas.tarefa, value: 'tarefa', icon: 'i-lucide-clipboard-list' },
  { label: props.t.abas.comentarios, value: 'comentarios', icon: 'i-lucide-message-square' },
  { label: props.t.abas.logs, value: 'logs', icon: 'i-lucide-history' },
])

function mudarPrazo(v: string | null) {
  const t = props.tarefa
  if (!t) return
  if (!ordemValida(v, t.final_due_date)) {
    erroPrazo.value = props.t.erroPrazoDepois(fmt(t.final_due_date))
    return
  }
  erroPrazo.value = ''
  if (v !== t.due_date) salvar('due_date', v)
}

function mudarPrazoFinal(v: string | null) {
  const t = props.tarefa
  if (!t) return
  if (!ordemValida(t.due_date, v)) {
    erroPrazoFinal.value = props.t.erroPrazoFinalAntes(fmt(t.due_date))
    return
  }
  erroPrazoFinal.value = ''
  if (v !== t.final_due_date) salvar('final_due_date', v)
}

/** O campo nativo emite a cada segmento digitado: grava só o último valor de cada campo. */
const pendente: Record<string, string | null | undefined> = {}

function salvar(campo: 'due_date' | 'final_due_date', valor: string | null) {
  const t = props.tarefa
  if (!t) return
  if (salvando.value === campo && pendente[campo] === valor) return
  pendente[campo] = valor
  salvando.value = campo
  setTimeout(() => {
    if (pendente[campo] !== valor) return // chegou um valor mais novo
    salvando.value = null
    pendente[campo] = undefined
    if (props.falharAoSalvar) {
      versao.value++
      toast.add({
        title: props.t.salvarErro,
        description: props.t.salvarErroDescricao,
        color: 'error',
        icon: 'i-lucide-circle-alert',
        actions: [{ label: props.t.tentarDeNovo, color: 'neutral', variant: 'outline', onClick: () => salvar(campo, valor) }],
      })
      return
    }
    emit('gravar', t.id, campo, valor)
    const titulo = campo === 'final_due_date'
      ? (valor ? props.t.prazoFinalAlterado(fmt(valor)) : props.t.prazoFinalApagado)
      : (valor ? props.t.prazoAlterado(fmt(valor)) : props.t.prazoApagado)
    toast.add({ title: titulo, color: 'success', icon: 'i-lucide-check' })
  }, 600)
}
</script>

<template>
  <USlideover
    v-model:open="aberto"
    :title="tarefa?.name"
    :description="t.painelDescricao"
    :close="{ 'aria-label': t.fecharPainel }"
    :ui="{ content: 'sm:max-w-xl', description: 'sr-only' }"
  >
    <template #body>
      <div v-if="tarefa" class="space-y-5">
        <div class="flex flex-wrap items-center gap-2">
          <UBadge :label="t.situacoes[tarefa.status]" color="neutral" variant="subtle" />
          <UBadge :label="t.prioridades[tarefa.priority]" color="neutral" variant="outline" />
          <UBadge v-if="prazoFinalVencido(tarefa)" :label="t.prazoFinalVencido" color="error" variant="solid" icon="i-lucide-flag" />
          <UBadge v-else-if="atrasada(tarefa)" :label="t.atrasada" color="error" variant="subtle" icon="i-lucide-alarm-clock" />
          <span class="ml-auto flex items-center gap-2 text-sm text-toned">
            <UAvatar :alt="responsavel ?? t.semResponsavel" size="2xs" />
            {{ responsavel ?? t.semResponsavel }}
          </span>
        </div>

        <UTabs v-model="aba" :items="abas" variant="link" :content="false" class="w-full" />

        <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0">
          <section v-if="aba === 'tarefa'" key="tarefa" class="space-y-3">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.datas }}</h3>
            <UAlert
              v-if="!podeEditar"
              icon="i-lucide-lock"
              color="neutral"
              variant="subtle"
              :description="t.somenteLeitura"
            />
            <!-- Empilhados, na ordem do tempo: com a instrução, lado a lado os campos desalinham. -->
            <div :key="`${tarefa.id}-${versao}`" class="space-y-4">
              <CampoDeData
                id="painel-prazo"
                :rotulo="t.colunas.prazo"
                :instrucao="t.prazoInstrucao"
                :ajuda="t.prazoAjuda"
                :max="tarefa.final_due_date"
                :salvo="tarefa.due_date"
                :formatado="fmt(tarefa.due_date)"
                :vazio="t.semPrazo"
                :erro="erroPrazo"
                :somente-leitura="!podeEditar"
                :salvando="salvando === 'due_date'"
                icone="i-lucide-calendar"
                @mudar="mudarPrazo"
              />
              <CampoDeData
                id="painel-prazo-final"
                :rotulo="t.colunas.prazoFinal"
                :instrucao="t.prazoFinalInstrucao"
                :ajuda="t.prazoFinalAjuda"
                :min="tarefa.due_date"
                :salvo="tarefa.final_due_date"
                :formatado="fmt(tarefa.final_due_date)"
                :vazio="t.semPrazoFinal"
                :erro="erroPrazoFinal"
                :somente-leitura="!podeEditar"
                :salvando="salvando === 'final_due_date'"
                :rotulo-apagar="t.apagarPrazoFinal"
                icone="i-lucide-flag"
                @mudar="mudarPrazoFinal"
              />
            </div>
          </section>
          <p v-else :key="aba" class="rounded-lg border border-dashed border-default p-6 text-center text-sm text-muted">
            {{ t.maqueteAba }}
          </p>
        </Transition>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.guardarProgresso" color="neutral" variant="outline" />
        <UButton :label="t.concluirTarefa" icon="i-lucide-check" />
      </div>
    </template>
  </USlideover>
</template>
