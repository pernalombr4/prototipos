<script setup lang="ts">
/**
 * Criação rápida que abre no horário clicado ou arrastado (padrão do Google, do Odoo e do ClickUp, visto em tela):
 * reunião no Outlook, tarefa rápida ou item de categoria. A reunião já nasce ligada a um item quando a pessoa chega
 * pelo "Agendar reunião" do painel do item, ou quando um e-mail digitado tem o domínio do contato de um item.
 */
import type { Lugar } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import { diaLongo, hora } from './datas'
import { type Criacao, type TipoDeCriacao, criar, estado, fontesAtivas } from './estado'
import { categoriaPorSlug } from './mocks'

const props = defineProps<{ t: Textos, locale: string, lugar: Lugar }>()
const emit = defineEmits<{ criado: [chave: string, tipo: TipoDeCriacao], cancelar: [] }>()

const podeReuniao = computed(() => estado.outlook === 'conectado')
const forma = reactive<Criacao>({
  tipo: estado.agendandoPara || (podeReuniao.value && props.lugar.inicio !== undefined) ? 'reuniao' : 'rapida',
  titulo: '',
  lugar: props.lugar,
  participantes: [],
  teams: true,
  itemId: estado.agendandoPara,
  categoria: fontesAtivas.value[0]?.slug ?? 'contratos',
})
watch(() => props.lugar, l => (forma.lugar = l))

const tipos = computed(() => (['reuniao', 'rapida', 'item'] as const).map(v => ({
  label: props.t.criacao.tipos[v],
  value: v,
  icon: { reuniao: 'i-lucide-video', rapida: 'i-lucide-clipboard-check', item: 'i-lucide-file-plus' }[v],
  disabled: (v === 'reuniao' && !podeReuniao.value) || (v === 'item' && !fontesAtivas.value.length),
})))

const quando = computed(() => {
  const l = forma.lugar
  const dia = diaLongo(l.dia, props.locale)
  return l.inicio === undefined ? `${dia} · ${props.t.grade.diaInteiro}` : `${dia} · ${props.t.grade.intervalo(hora(l.inicio), hora(l.fim ?? l.inicio + 60))}`
})

const opcoesDeItem = computed(() => estado.itens.map(i => ({ label: `${i.reference} · ${i.titulo}`, value: i.id, icon: categoriaPorSlug(i.categoria).icon ?? undefined })))
const sugerido = computed(() => {
  if (forma.itemId) return null
  const dominios = forma.participantes.map(e => e.split('@')[1])
  return estado.itens.find(i => i.dominio && dominios.includes(i.dominio)) ?? null
})
const categorias = computed(() => fontesAtivas.value.map(f => ({ label: categoriaPorSlug(f.slug).name, value: f.slug })))
const campoDaCategoria = computed(() => {
  const f = fontesAtivas.value.find(x => x.slug === forma.categoria)
  return f ? categoriaPorSlug(f.slug).campos.find(c => c.chave === f.campo)?.rotulo ?? '' : ''
})

const enviando = ref(false)
function enviar() {
  if (!forma.titulo.trim()) return
  enviando.value = true
  setTimeout(() => {
    emit('criado', criar({ ...forma, titulo: forma.titulo.trim() }), forma.tipo)
    enviando.value = false
  }, 400)
}
</script>

<template>
  <form class="flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col gap-3 p-4" :aria-label="t.criacao.titulo" @submit.prevent="enviar">
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-highlighted">{{ t.criacao.titulo }}</p>
      <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.criacao.cancelar" @click="emit('cancelar')" />
    </div>

    <UTabs v-model="forma.tipo" :items="tipos" :content="false" size="xs" class="w-full" />
    <p v-if="!podeReuniao && forma.tipo !== 'reuniao'" class="-mt-1 text-[11px] text-muted">{{ t.criacao.reuniaoSemOutlook }}</p>

    <UInput v-model="forma.titulo" :placeholder="t.criacao.nome[forma.tipo]" :aria-label="t.criacao.nome[forma.tipo]" autofocus size="md" class="w-full" />
    <p class="flex items-center gap-1.5 text-xs text-muted first-letter:uppercase"><UIcon name="i-lucide-clock" class="size-3.5 shrink-0" />{{ quando }}</p>

    <template v-if="forma.tipo === 'reuniao'">
      <UInputTags v-model="forma.participantes" :placeholder="t.criacao.participantes" :aria-label="t.criacao.participantes" icon="i-lucide-users" size="sm" add-on-blur add-on-paste delimiter="," class="w-full" />
      <USwitch v-model="forma.teams" :label="t.criacao.teams" size="sm" />
    </template>

    <template v-if="forma.tipo === 'item'">
      <UFormField :label="t.criacao.categoria" size="xs" :hint="campoDaCategoria ? t.criacao.preenche(campoDaCategoria) : undefined">
        <USelect v-model="forma.categoria" :items="categorias" size="sm" class="w-full" />
      </UFormField>
    </template>

    <UFormField v-else :label="t.criacao.ligadoA" size="xs">
      <USelectMenu
        v-model="forma.itemId"
        :items="opcoesDeItem"
        value-key="value"
        size="sm"
        icon="i-lucide-link-2"
        :placeholder="t.criacao.semVinculo"
        :search-input="{ placeholder: t.detalhe.buscarItem }"
        clear
        class="w-full"
      />
      <UButton
        v-if="sugerido"
        :label="t.criacao.sugestao(sugerido.reference)"
        icon="i-lucide-sparkles"
        color="info"
        variant="soft"
        size="xs"
        class="mt-1.5"
        @click="forma.itemId = sugerido.id"
      />
    </UFormField>

    <p v-if="forma.tipo === 'reuniao'" class="text-[11px] text-muted">{{ t.criacao.noOutlook }}</p>

    <div class="flex justify-end gap-2 border-t border-default pt-3">
      <UButton :label="t.criacao.cancelar" color="neutral" variant="ghost" size="sm" @click="emit('cancelar')" />
      <UButton type="submit" :label="t.criacao.criar" size="sm" :disabled="!forma.titulo.trim()" :loading="enviando" />
    </div>
  </form>
</template>
