<script setup lang="ts">
/**
 * Criação rápida que abre no horário clicado ou arrastado (padrão do Google, do Odoo e do ClickUp, visto em tela):
 * reunião no Outlook, tarefa rápida ou item de categoria. A reunião já nasce ligada a um item quando a pessoa chega
 * pelo "Agendar reunião" do painel do item, ou quando um e-mail digitado tem o domínio do contato de um item.
 *
 * Rodada 2: só aparece o que a pessoa pode criar. Sem Outlook, a aba Reunião some e uma linha leva à conexão; a aba
 * Item lista só as categorias com permissão de criar (sem nenhuma, a aba some). A categoria que pede obrigatórios
 * fora do popover troca o Criar por "Continuar no formulário"; as outras têm "Mais campos" ao lado do Criar.
 *
 * Pedido da redatora em 29/10/2026, no padrão do Google Agenda: a faixa do alto cria sem horário (reunião de dia
 * inteiro, tarefa no dia do prazo, item no dia); "Adicionar horário" põe início e fim, e o fantasma desce para a grade.
 * "Dia inteiro" devolve ao alto. Na tarefa rápida, o horário é o tempo reservado para fazer: a tarefa fica no alto,
 * no dia do prazo, e o horário entra na grade. Item só ganha horário quando a categoria tem campo de hora. A reunião
 * se liga a mais de um item; a tarefa rápida, a 1.
 */
import type { Lugar } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import { AGORA, HOJE, duracao, hora } from './datas'
import { type Criacao, type Criado, type Rascunho, type TipoDeCriacao, categoriasParaCriar, criar, estado, faltam, fonte, podeEditarItem } from './estado'
import { categoriaPorSlug } from './mocks'

/** `semente`: o título e os itens que já chegam preenchidos, do "Agendar reunião sobre isto" do botão direito. */
const props = defineProps<{ t: Textos, locale: string, lugar: Lugar, tipoInicial?: TipoDeCriacao, semente?: { titulo: string, itens: number[] } }>()
const emit = defineEmits<{ criado: [c: Criado, tipo: TipoDeCriacao, itens: number[]], cancelar: [], conectar: [], formulario: [r: Rascunho], lugar: [l: Lugar] }>()

const podeReuniao = computed(() => estado.outlook === 'conectado')
const forma = reactive<Criacao>({
  tipo: props.tipoInicial ?? (podeReuniao.value && (estado.agendandoPara || props.lugar.inicio !== undefined) ? 'reuniao' : 'rapida'),
  titulo: props.semente?.titulo ?? '',
  lugar: props.lugar,
  participantes: [],
  teams: true,
  itens: props.semente?.itens ?? (estado.agendandoPara ? [estado.agendandoPara] : []),
  categoria: categoriasParaCriar.value[0]?.slug ?? 'contratos',
})
watch(() => props.lugar, l => (forma.lugar = l))

/* ---------- quando: sem horário no alto, com horário na grade ---------- */
const comHorario = computed(() => forma.lugar.inicio !== undefined)
/** Item só tem horário quando a fonte da categoria tem campo de hora de início. */
const aceitaHorario = computed(() => forma.tipo !== 'item' || !!fonte(forma.categoria)?.horaInicio)
function mudarLugar(l: Lugar) {
  forma.lugar = l
  emit('lugar', l)
}
function adicionarHorario() {
  const inicio = forma.lugar.dia === HOJE ? Math.min(Math.ceil((AGORA + 1) / 15) * 15, 23 * 60) : 9 * 60
  mudarLugar({ dia: forma.lugar.dia, inicio, fim: Math.min(inicio + 60, 1440 - 15) })
}
const diaInteiro = () => mudarLugar({ dia: forma.lugar.dia })
watch(aceitaHorario, ok => !ok && comHorario.value && diaInteiro())
const QUARTOS = Array.from({ length: 96 }, (_, i) => i * 15)
const horasDeInicio = QUARTOS.map(m => ({ label: hora(m), value: m }))
const horasDeFim = computed(() => QUARTOS.filter(m => m > (forma.lugar.inicio ?? 0)).map(m => ({ label: `${hora(m)} (${duracao(m - forma.lugar.inicio!, props.t.detalhe.h, props.t.detalhe.min)})`, value: m })))
function mudarInicio(v: number) {
  const dur = (forma.lugar.fim ?? forma.lugar.inicio! + 60) - forma.lugar.inicio!
  mudarLugar({ dia: forma.lugar.dia, inicio: v, fim: Math.min(v + dur, 1440 - 15) })
}
function mudarDia(ev: Event) {
  const v = (ev.target as HTMLInputElement).value
  if (v) mudarLugar({ ...forma.lugar, dia: v })
}
const prazoDaTarefa = computed(() => hora(Math.max(18 * 60, forma.lugar.fim ?? 0)))

const tipos = computed(() => (['reuniao', 'rapida', 'item'] as const)
  .filter(v => (v !== 'reuniao' || podeReuniao.value) && (v !== 'item' || categoriasParaCriar.value.length))
  .map(v => ({ label: props.t.criacao.tipos[v], value: v, icon: { reuniao: 'i-lucide-video', rapida: 'i-lucide-clipboard-check', item: 'i-lucide-file-plus' }[v] })))

const opcoesDeItem = computed(() => estado.itens.filter(podeEditarItem).map(i => ({ label: `${i.reference} · ${i.titulo}`, value: i.id, icon: categoriaPorSlug(i.categoria).icon ?? undefined })))
const sugerido = computed(() => {
  const dominios = forma.participantes.map(e => e.split('@')[1])
  return estado.itens.find(i => i.dominio && dominios.includes(i.dominio) && !forma.itens.includes(i.id)) ?? null
})
/** A tarefa rápida se liga a 1 item só. */
const itemDaTarefa = computed({ get: () => forma.itens[0], set: (v?: number) => (forma.itens = v ? [v] : []) })
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
    emit('criado', criar({ ...forma, titulo: forma.titulo.trim() }), forma.tipo, forma.tipo === 'reuniao' ? forma.itens : [])
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
    <!-- Quando: sem horário fica no alto; com horário, na grade -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-clock" class="size-4 shrink-0 text-muted" />
        <UInput type="date" :model-value="forma.lugar.dia" size="sm" class="flex-1" :aria-label="t.horario.data" @change="mudarDia" />
        <UButton v-if="!comHorario && aceitaHorario" :label="forma.tipo === 'rapida' ? t.horario.reservarHorario : t.horario.adicionarHorario" icon="i-lucide-clock-plus" color="neutral" variant="outline" size="sm" @click="adicionarHorario" />
      </div>
      <div v-if="comHorario" class="flex animate-[entrada_.2s_ease-out_both] items-center gap-2 pl-6">
        <USelect :model-value="forma.lugar.inicio" :items="horasDeInicio" size="sm" class="w-24" :aria-label="t.horario.inicio" @update:model-value="v => mudarInicio(Number(v))" />
        <span class="text-muted">-</span>
        <USelect :model-value="forma.lugar.fim" :items="horasDeFim" size="sm" class="min-w-0 flex-1" :aria-label="t.horario.fim" @update:model-value="v => mudarLugar({ ...forma.lugar, fim: Number(v) })" />
      </div>
      <UCheckbox v-if="comHorario" :model-value="false" :label="t.horario.diaInteiro" size="sm" class="pl-6" @update:model-value="diaInteiro" />
      <p v-if="forma.tipo === 'rapida'" class="pl-6 text-xs text-muted">{{ comHorario ? t.horario.tarefaComHorario(prazoDaTarefa) : t.horario.tarefaSemHorario }}</p>
      <p v-else-if="!aceitaHorario" class="pl-6 text-xs text-muted">{{ t.horario.itemSemHora(categoriaPorSlug(forma.categoria).name) }}</p>
    </div>

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
      <!-- A reunião se liga a vários itens: cada um numa linha, e o campo abaixo só acrescenta -->
      <ul v-if="forma.tipo === 'reuniao' && forma.itens.length" class="mb-1.5 flex flex-col gap-1">
        <li v-for="o in opcoesDeItem.filter(x => forma.itens.includes(x.value))" :key="o.value" class="flex animate-[entrada_.2s_ease-out_both] items-center gap-2 rounded-md bg-elevated py-0.5 pr-0.5 pl-2 text-xs">
          <UIcon :name="o.icon ?? 'i-lucide-file'" class="size-3.5 shrink-0 text-muted" />
          <span class="min-w-0 flex-1 truncate text-highlighted">{{ o.label }}</span>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="`${t.detalhe.desligar}: ${o.label}`" @click="forma.itens = forma.itens.filter(x => x !== o.value)" />
        </li>
      </ul>
      <USelectMenu
        v-if="forma.tipo === 'reuniao'"
        v-model="forma.itens"
        :items="opcoesDeItem"
        value-key="value"
        multiple
        size="sm"
        icon="i-lucide-link-2"
        :search-input="{ placeholder: t.detalhe.buscarItem }"
        class="w-full"
      >
        <span class="truncate text-dimmed">{{ forma.itens.length ? t.detalhe.ligarOutro : t.criacao.semVinculo }}</span>
      </USelectMenu>
      <USelectMenu
        v-else
        v-model="itemDaTarefa"
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
        v-if="sugerido && forma.tipo === 'reuniao'"
        :label="t.criacao.sugestao(sugerido.reference)"
        icon="i-lucide-sparkles"
        color="info"
        variant="soft"
        size="xs"
        class="mt-1.5"
        @click="forma.itens = [...forma.itens, sugerido.id]"
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
