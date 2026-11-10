<script setup lang="ts">
/**
 * Criação da tarefa rápida com o campo "Prazo final" junto do prazo (RF001, RF013).
 *
 * Nome, responsável e prioridade estão aqui só para a tarefa nascer completa;
 * o que muda é o par de datas.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Textos } from './textos'
import type { Prioridade, TarefaRapida } from './mocks'
import { membros, novaReferencia } from './mocks'
import { formatar, ordemValida } from './datas'
import CampoDeData from './_CampoDeData.vue'

const props = defineProps<{ t: Textos, idioma: Idioma }>()
const aberto = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ criar: [tarefa: TarefaRapida] }>()

const nome = ref('')
const responsavel = ref<number | undefined>(undefined)
const prioridade = ref<Prioridade>('normal')
const prazo = ref<string | null>(null)
const prazoFinal = ref<string | null>(null)
const tentou = ref(false)
const criando = ref(false)
const versao = ref(0)

watch(aberto, (v) => {
  if (!v) return
  nome.value = ''
  responsavel.value = undefined
  prioridade.value = 'normal'
  prazo.value = null
  prazoFinal.value = null
  tentou.value = false
  versao.value++
})

const erroNome = computed(() => tentou.value && !nome.value.trim() ? props.t.criacao.nomeObrigatorio : undefined)
/** RN004 na criação: o aviso aparece no prazo final, que é o campo novo. */
const erroOrdem = computed(() => ordemValida(prazo.value, prazoFinal.value) ? undefined : props.t.erroPrazoFinalAntes(formatar(prazo.value, props.idioma)))

const opcoesDeMembro = computed(() => membros.map(m => ({ label: m.nome, value: m.id })))
const opcoesDePrioridade = computed(() => (['low', 'normal', 'high', 'urgent'] as const).map(p => ({ label: props.t.prioridades[p], value: p })))

function criar() {
  tentou.value = true
  if (erroNome.value || erroOrdem.value) return
  criando.value = true
  setTimeout(() => {
    criando.value = false
    emit('criar', {
      id: Date.now(),
      reference: novaReferencia(),
      name: nome.value.trim(),
      status: 'pending',
      priority: prioridade.value,
      due_date: prazo.value,
      final_due_date: prazoFinal.value,
      assigned_to: responsavel.value ?? null,
    })
    aberto.value = false
  }, 600)
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.criacao.titulo" :description="t.criacao.descricao">
    <template #body>
      <form :key="versao" class="space-y-4" @submit.prevent="criar">
        <UFormField :label="t.criacao.nome" :error="erroNome" required name="nome">
          <UInput v-model="nome" :placeholder="t.criacao.nomePlaceholder" class="w-full" autofocus />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t.criacao.responsavel" name="responsavel">
            <USelect v-model="responsavel" :items="opcoesDeMembro" :placeholder="t.criacao.escolherResponsavel" class="w-full" />
          </UFormField>
          <UFormField :label="t.criacao.prioridade" name="prioridade">
            <USelect v-model="prioridade" :items="opcoesDePrioridade" class="w-full" />
          </UFormField>
        </div>
        <div class="space-y-4">
          <CampoDeData
            id="nova-prazo"
            :rotulo="t.colunas.prazo"
            :instrucao="t.prazoInstrucao"
            :ajuda="t.prazoAjuda"
            :max="prazoFinal"
            :salvo="null"
            :vazio="t.semPrazo"
            icone="i-lucide-calendar"
            @mudar="v => prazo = v"
          />
          <CampoDeData
            id="nova-prazo-final"
            :rotulo="t.colunas.prazoFinal"
            :instrucao="t.prazoFinalInstrucao"
            :ajuda="t.prazoFinalAjuda"
            :min="prazo"
            :salvo="null"
            :vazio="t.semPrazoFinal"
            :erro="erroOrdem"
            icone="i-lucide-flag"
            @mudar="v => prazoFinal = v"
          />
        </div>
        <button type="submit" class="hidden" />
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.criacao.cancelar" color="neutral" variant="outline" @click="aberto = false" />
        <UButton :label="t.criacao.criar" icon="i-lucide-plus" :loading="criando" @click="criar" />
      </div>
    </template>
  </UModal>
</template>
