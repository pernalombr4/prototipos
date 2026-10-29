<script setup lang="ts">
/**
 * Criação rápida que abre no horário clicado ou arrastado (padrão do Google, do Odoo e do ClickUp, visto em tela):
 * reunião no Outlook, tarefa rápida ou item de categoria. A reunião já nasce ligada a um item quando a pessoa chega
 * pelo "Agendar reunião" do painel do item, ou quando um e-mail digitado tem o domínio do contato de um item.
 *
 * Rodada 2: só aparece o que a pessoa pode criar. Sem Outlook, a aba Reunião some e uma linha leva à conexão; a aba
 * Item lista só as categorias com permissão de criar (sem nenhuma, a aba some). A categoria que pede obrigatórios
 * fora do popover troca o Criar por "Continuar no formulário"; as outras têm "Mais campos" ao lado do Criar.
 */
import type { Lugar } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import { diaLongo, hora } from './datas'
import { type Criacao, type Criado, type Rascunho, type TipoDeCriacao, categoriasParaCriar, criar, estado, faltam, podeEditarItem } from './estado'
import { categoriaPorSlug } from './mocks'

const props = defineProps<{ t: Textos, locale: string, lugar: Lugar, tipoInicial?: TipoDeCriacao }>()
const emit = defineEmits<{ criado: [c: Criado, tipo: TipoDeCriacao, itemId: number | null], cancelar: [], conectar: [], formulario: [r: Rascunho] }>()

const podeReuniao = computed(() => estado.outlook === 'conectado')
const forma = reactive<Criacao>({
  tipo: props.tipoInicial ?? (podeReuniao.value && (estado.agendandoPara || props.lugar.inicio !== undefined) ? 'reuniao' : 'rapida'),
  titulo: '',
  lugar: props.lugar,
  participantes: [],
  teams: true,
  itemId: estado.agendandoPara,
  categoria: categoriasParaCriar.value[0]?.slug ?? 'contratos',
})
watch(() => props.lugar, l => (forma.lugar = l))

const tipos = computed(() => (['reuniao', 'rapida', 'item'] as const)
  .filter(v => (v !== 'reuniao' || podeReuniao.value) && (v !== 'item' || categoriasParaCriar.value.length))
  .map(v => ({ label: props.t.criacao.tipos[v], value: v, icon: { reuniao: 'i-lucide-video', rapida: 'i-lucide-clipboard-check', item: 'i-lucide-file-plus' }[v] })))

const quando = computed(() => {
  const l = forma.lugar
  const dia = diaLongo(l.dia, props.locale)
  return l.inicio === undefined ? `${dia} · ${props.t.grade.diaInteiro}` : `${dia} · ${props.t.grade.intervalo(hora(l.inicio), hora(l.fim ?? l.inicio + 60))}`
})

const opcoesDeItem = computed(() => estado.itens.filter(podeEditarItem).map(i => ({ label: `${i.reference} · ${i.titulo}`, value: i.id, icon: categoriaPorSlug(i.categoria).icon ?? undefined })))
const sugerido = computed(() => {
  if (forma.itemId) return null
  const dominios = forma.participantes.map(e => e.split('@')[1])
  return estado.itens.find(i => i.dominio && dominios.includes(i.dominio)) ?? null
})
const categorias = computed(() => categoriasParaCriar.value.map(f => ({ label: categoriaPorSlug(f.slug).name, value: f.slug })))
const pendentes = computed(() => forma.tipo === 'item' ? faltam(forma) : [])
const campoDaCategoria = computed(() => {
  const f = categoriasParaCriar.value.find(x => x.slug === forma.categoria)
  return f ? categoriaPorSlug(f.slug).campos.find(c => c.chave === f.campo)?.rotulo ?? '' : ''
})

const enviando = ref(false)
const noFormulario = () => emit('formulario', { categoria: forma.categoria, titulo: forma.titulo.trim(), lugar: forma.lugar })
function enviar() {
  if (!forma.titulo.trim()) return
  if (pendentes.value.length) return noFormulario()
  enviando.value = true
  setTimeout(() => {
    emit('criado', criar({ ...forma, titulo: forma.titulo.trim() }), forma.tipo, forma.itemId)
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
    <p v-if="!podeReuniao" class="-mt-1 flex flex-wrap items-center gap-x-1 text-xs text-muted">
      {{ t.criacao2.semReuniao }}
      <UButton :label="t.lateral.conectar" color="primary" variant="link" size="xs" class="p-0" @click="emit('conectar')" />
    </p>

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
      <p v-if="pendentes.length" class="flex flex-col gap-1.5 rounded-md bg-elevated p-2.5 text-xs text-toned">
        <span class="flex items-center gap-1.5"><UIcon name="i-lucide-list-checks" class="size-3.5 text-muted" />{{ t.criacao2.faltam(pendentes.length, categoriaPorSlug(forma.categoria).name) }}</span>
        <span class="flex flex-wrap gap-1"><UBadge v-for="c in pendentes" :key="c.chave" :label="c.rotulo" color="neutral" variant="outline" size="sm" /></span>
      </p>
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

    <div class="flex items-center justify-end gap-2 border-t border-default pt-3">
      <UButton v-if="forma.tipo === 'item' && !pendentes.length" :label="t.criacao2.maisCampos" icon="i-lucide-list-plus" color="neutral" variant="link" size="sm" class="mr-auto px-0" @click="noFormulario" />
      <UButton :label="t.criacao.cancelar" color="neutral" variant="ghost" size="sm" @click="emit('cancelar')" />
      <UButton
        type="submit"
        :label="pendentes.length ? t.criacao2.continuar : t.criacao.criar"
        :trailing-icon="pendentes.length ? 'i-lucide-arrow-right' : undefined"
        size="sm"
        :disabled="!forma.titulo.trim()"
        :loading="enviando"
      />
    </div>
  </form>
</template>
