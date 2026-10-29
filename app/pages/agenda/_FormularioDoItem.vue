<script setup lang="ts">
/**
 * O formulário completo da categoria, aberto pelo "Mais campos" da criação rápida, ou pelo "Continuar no
 * formulário" quando a categoria pede obrigatórios que o popover não tem.
 *
 * A casca é a do modal de criação do develop (título "Novo registro", X no canto, Cancelar e Criar no rodapé), na
 * cópia de `padrao-dos-campos/_ModalNovoItem.vue`. O que é proposta: o que veio da Agenda chega preenchido (o título
 * digitado no popover, a data no campo que a fonte lê e as horas, quando a fonte tem) e cada campo preenchido pela
 * Agenda diz isso embaixo. O item nasce com a data no campo certo e aparece na grade (o aviso do monday, PESQUISA.md).
 */
import type { Textos } from './textos'
import { hora, paraMinutos } from './datas'
import { type Rascunho, criar, fonte } from './estado'
import { categoriaPorSlug } from './mocks'

const props = defineProps<{ t: Textos, rascunho: Rascunho | null }>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ criado: [chave: string] }>()

const cat = computed(() => props.rascunho ? categoriaPorSlug(props.rascunho.categoria) : null)
const campos = computed(() => cat.value?.campos.filter(c => c.chave !== 'created_at') ?? [])
const daAgenda = ref<string[]>([])
const valores = ref<Record<string, string>>({})
const tentou = ref(false)
const salvando = ref(false)

watch(() => props.rascunho, (r) => {
  if (!r) return
  const f = fonte(r.categoria)!
  const v: Record<string, string> = { titulo: r.titulo, [f.campo]: r.lugar.dia }
  const marcados = [f.campo]
  if (f.horaInicio && r.lugar.inicio !== undefined) { v[f.horaInicio] = hora(r.lugar.inicio); marcados.push(f.horaInicio) }
  if (f.horaFim && r.lugar.fim !== undefined) { v[f.horaFim] = hora(r.lugar.fim); marcados.push(f.horaFim) }
  valores.value = v
  daAgenda.value = marcados
  tentou.value = false
}, { immediate: true })

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
function erro(chave: string) {
  if (!tentou.value) return undefined
  const c = campos.value.find(x => x.chave === chave)!
  const v = valores.value[chave]?.trim() ?? ''
  if (c.obrigatorio && !v) return props.t.formulario.obrigatorio
  if (c.tipo === 'email' && v && !emailOk(v)) return props.t.formulario.emailInvalido
  return undefined
}
const valido = () => campos.value.every(c => !erro(c.chave))

function enviar() {
  tentou.value = true
  if (!valido() || !props.rascunho) return
  salvando.value = true
  setTimeout(() => {
    const extra: Record<string, string | number> = {}
    for (const c of campos.value) {
      const v = valores.value[c.chave]
      if (v) extra[c.chave] = c.tipo === 'hora' ? paraMinutos(v) : v
    }
    const r = props.rascunho!
    const ini = extra[fonte(r.categoria)!.horaInicio ?? '']
    const fim = extra[fonte(r.categoria)!.horaFim ?? '']
    const { chave } = criar({
      tipo: 'item',
      titulo: String(extra.titulo),
      lugar: { dia: String(extra[fonte(r.categoria)!.campo]), inicio: typeof ini === 'number' ? ini : undefined, fim: typeof fim === 'number' ? fim : undefined },
      participantes: [],
      teams: false,
      itemId: null,
      categoria: r.categoria,
      campos: extra,
    })
    salvando.value = false
    aberto.value = false
    emit('criado', chave)
  }, 600)
}
const tipoDoInput = { data: 'date', hora: 'time', email: 'email', texto: 'text' } as const
</script>

<template>
  <UModal v-model:open="aberto" :title="t.formulario.titulo" :description="cat ? t.formulario.descricao(cat.name) : undefined" :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <form id="formulario-do-item" class="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2" novalidate @submit.prevent="enviar">
        <UFormField
          v-for="(c, i) in campos"
          :key="c.chave"
          :label="c.rotulo"
          :required="c.obrigatorio"
          :error="erro(c.chave)"
          :help="daAgenda.includes(c.chave) ? t.formulario.daAgenda : undefined"
          :class="c.tipo === 'texto' && c.chave === 'titulo' ? 'md:col-span-2' : ''"
          class="animate-[entrada_.3s_ease-out_both]"
          :style="{ animationDelay: `${i * 25}ms` }"
          :ui="{ help: 'flex items-center gap-1 text-info' }"
        >
          <UInput
            v-model="valores[c.chave]"
            :type="tipoDoInput[c.tipo]"
            :step="c.tipo === 'hora' ? 900 : undefined"
            :icon="daAgenda.includes(c.chave) ? 'i-lucide-calendar-check' : undefined"
            size="md"
            class="w-full"
          />
        </UFormField>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.formulario.cancelar" color="neutral" variant="ghost" size="sm" @click="aberto = false" />
        <UButton type="submit" form="formulario-do-item" :label="t.formulario.criar" size="sm" :loading="salvando" />
      </div>
    </template>
  </UModal>
</template>
