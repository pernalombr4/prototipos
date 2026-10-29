<script setup lang="ts">
/**
 * Agendar reunião de dentro do item ou da tarefa, sem ir à grade: dia, início e fim, participantes e Teams, com o
 * contato do item já como participante e o vínculo já feito. A linha de conflito lê a agenda da própria pessoa
 * (reuniões em que ela participa e os blocos dela), o que o Outlook ao lado não diz ao lado do contrato.
 *
 * Na Agenda, "Escolher o horário na grade" volta ao caminho da rodada 1 (o próximo horário clicado cria a reunião
 * ligada).
 *
 * "Convidar o Mail Box do item" (ligado por padrão) põe o endereço do item entre os convidados: é o que segura o
 * vínculo quando o organizador muda a reunião pelo Outlook, e o mesmo caminho de quem cria a reunião direto lá.
 */
import type { Textos } from './textos'
import { HOJE, hora, paraMinutos, somarDias } from './datas'
import { type Criado, caixaDoItem, conflitos, criar, item } from './estado'

const props = defineProps<{ t: Textos, itemId: number | null, titulo: string, naAgenda?: boolean }>()
const emit = defineEmits<{ criado: [c: Criado], cancelar: [], naGrade: [] }>()

const it = computed(() => item(props.itemId))
const contato = computed(() => {
  const v = it.value?.data.contato
  return typeof v === 'string' && v.includes('@') ? v : null
})

const forma = reactive({
  titulo: props.titulo,
  dia: somarDias(HOJE, 1),
  inicio: '10:00',
  fim: '11:00',
  participantes: contato.value ? [contato.value] : [] as string[],
  teams: true,
  caixa: true,
})

const intervalo = computed(() => ({ ini: paraMinutos(forma.inicio), fim: paraMinutos(forma.fim) }))
const invalido = computed(() => !forma.titulo.trim() || intervalo.value.fim <= intervalo.value.ini)
const ocupado = computed(() => conflitos(forma.dia, intervalo.value.ini, intervalo.value.fim))

function mudarInicio(v: string) {
  const duracao = intervalo.value.fim - intervalo.value.ini
  forma.inicio = v
  forma.fim = hora(Math.min(paraMinutos(v) + duracao, 1439))
}

const enviando = ref(false)
function enviar() {
  if (invalido.value) return
  enviando.value = true
  setTimeout(() => {
    enviando.value = false
    emit('criado', criar({
      tipo: 'reuniao',
      titulo: forma.titulo.trim(),
      lugar: { dia: forma.dia, inicio: intervalo.value.ini, fim: intervalo.value.fim },
      participantes: forma.caixa && it.value ? [...forma.participantes, caixaDoItem(it.value)] : forma.participantes,
      teams: forma.teams,
      itemId: props.itemId,
      categoria: it.value?.categoria ?? 'contratos',
    }))
  }, 500)
}
</script>

<template>
  <form class="flex animate-[entrada_.25s_ease-out_both] flex-col gap-3 rounded-lg border border-default p-3" :aria-label="t.reuniaoForm.titulo" @submit.prevent="enviar">
    <p class="text-sm font-semibold text-highlighted">{{ t.reuniaoForm.titulo }}</p>
    <UInput v-model="forma.titulo" :placeholder="t.reuniaoForm.nome" :aria-label="t.reuniaoForm.nome" autofocus size="sm" class="w-full" />

    <div class="grid grid-cols-[1fr_6rem_6rem] gap-2">
      <UFormField :label="t.reuniaoForm.dia" size="xs">
        <UInput v-model="forma.dia" type="date" size="sm" class="w-full" />
      </UFormField>
      <UFormField :label="t.detalhe.inicio" size="xs">
        <UInput :model-value="forma.inicio" type="time" step="900" size="sm" class="w-full" @update:model-value="v => mudarInicio(String(v))" />
      </UFormField>
      <UFormField :label="t.detalhe.fim" size="xs">
        <UInput v-model="forma.fim" type="time" step="900" size="sm" class="w-full" />
      </UFormField>
    </div>

    <p class="flex items-start gap-1.5 text-xs" :class="ocupado.length ? 'text-warning' : 'text-muted'">
      <UIcon :name="ocupado.length ? 'i-lucide-calendar-x' : 'i-lucide-calendar-check'" class="mt-0.5 size-3.5 shrink-0" />
      {{ ocupado.length ? t.agendaTarefa.conflito(ocupado.join(', ')) : t.agendaTarefa.livre }}
    </p>

    <UInputTags v-model="forma.participantes" :placeholder="t.criacao.participantes" :aria-label="t.criacao.participantes" icon="i-lucide-users" size="sm" add-on-blur add-on-paste delimiter="," class="w-full" />
    <p v-if="contato" class="-mt-1.5 text-xs text-muted">{{ t.reuniaoForm.contato }}</p>
    <USwitch v-model="forma.teams" :label="t.criacao.teams" size="sm" />
    <USwitch v-if="it" v-model="forma.caixa" :label="t.reuniaoForm.caixa" :description="t.reuniaoForm.caixaTexto" size="sm" />

    <p v-if="it" class="flex items-center gap-1.5 text-xs text-toned"><UIcon name="i-lucide-link-2" class="size-3.5 text-info" />{{ t.reuniaoForm.ligadaA(it.reference) }}</p>
    <p class="text-xs text-muted">{{ t.criacao.noOutlook }}</p>

    <div class="flex flex-wrap items-center justify-end gap-2 border-t border-default pt-3">
      <UButton v-if="naAgenda" :label="t.reuniaoForm.escolherNaGrade" icon="i-lucide-mouse-pointer-click" color="neutral" variant="link" size="sm" class="mr-auto px-0" @click="emit('naGrade')" />
      <UButton :label="t.reuniaoForm.cancelar" color="neutral" variant="ghost" size="sm" @click="emit('cancelar')" />
      <UButton type="submit" :label="t.reuniaoForm.criar" icon="i-lucide-calendar-plus" size="sm" :disabled="invalido" :loading="enviando" />
    </div>
  </form>
</template>
