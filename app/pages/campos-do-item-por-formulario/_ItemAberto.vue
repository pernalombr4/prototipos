<script setup lang="ts">
/**
 * As pastas do item e o conteúdo da pasta aberta: é aqui que as 3 opções se
 * diferenciam.
 *
 * CASCA (cópia do develop, 25/11/2026): as abas Visão Geral, Comentários,
 * Logs de Auditoria e Tarefas, o "+N" da barra lateral, o botão de nova pasta
 * à direita e o Salvar no rodapé.
 *
 * PROPOSTA, por solução:
 *  - Hoje: a Visão Geral mostra os campos do formulário (o da porta, o de
 *    origem do item ou o primeiro), sem seletor quando só há 1 formulário;
 *  - Opção 1: a Visão Geral mostra todos os campos em qualquer porta; o
 *    recorte por formulário fica numa pasta do tipo Formulário, que a pasta
 *    avisa com "Esta pasta exibe 3 de 10 campos";
 *  - Opção 2: igual à 1, e quem chega pela página do formulário ganha uma
 *    pasta automática daquele formulário, aberta e não salva no item;
 *  - Opção 3: o padrão depende da porta e o seletor "Exibir" na Visão Geral
 *    alterna entre "Todos os campos" e o formulário, com a contagem ao lado.
 */
import type { TabsItem, DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import type { ItemDoPrototipo } from './mocks'
import { campoPorRef, campos, formularioPorId, formularios } from './mocks'
import CampoDoItem from './_CampoDoItem.vue'

export type Solucao = 'hoje' | 'op1' | 'op2' | 'op3'
export type Entrada = 'todos' | 'formulario' | 'tela'
export interface PastaDeFormulario { id: string, nome: string, formulario: number }

const props = defineProps<{
  t: Textos
  item: ItemDoPrototipo
  solucao: Solucao
  entrada: Entrada
  /** Barra lateral: as abas além da 2ª vão para o "+N", como no develop. */
  compacto?: boolean
  pastasDeFormulario: PastaDeFormulario[]
  /** Complementos da pesquisa de mercado: formulário de origem no topo e vazios recolhidos. */
  complementos?: boolean
}>()

const emit = defineEmits<{
  salvar: [data: Record<string, string | number>]
  novaPasta: []
}>()

const toast = useToast()
const formularioUnico = formularios[0]!

/* ---------- abas ---------- */
interface Aba extends TabsItem { value: string, tipo: 'visao' | 'sistema' | 'formulario' | 'automatica', formulario?: number }

const automatica = computed(() => props.solucao === 'op2' && props.entrada === 'formulario')

const abas = computed<Aba[]>(() => {
  const lista: Aba[] = [{ value: 'visao-geral', label: props.t.abas.visaoGeral, icon: 'i-lucide-layers', tipo: 'visao' }]
  if (automatica.value) {
    lista.push({
      value: 'automatica',
      label: formularioUnico.nome,
      icon: 'i-lucide-file-input',
      badge: { label: props.t.proposta.automatica, color: 'primary', variant: 'soft', size: 'sm' },
      tipo: 'automatica',
      formulario: formularioUnico.id,
    })
  }
  lista.push(
    { value: 'comentarios', label: props.t.abas.comentarios, icon: 'i-lucide-message-circle', tipo: 'sistema' },
    { value: 'logs', label: props.t.abas.logs, icon: 'i-lucide-shield-check', tipo: 'sistema' },
    { value: 'tarefas', label: props.t.abas.tarefas, icon: 'i-lucide-clipboard-list', tipo: 'sistema' },
    ...props.pastasDeFormulario.map(p => ({ value: p.id, label: p.nome, icon: 'i-lucide-file-input', tipo: 'formulario' as const, formulario: p.formulario })),
  )
  return lista
})

const abertaPorPadrao = () => automatica.value ? 'automatica' : 'visao-geral'
const ativa = ref(abertaPorPadrao())
const aba = computed(() => abas.value.find(a => a.value === ativa.value) ?? abas.value[0]!)

/** Barra lateral: Visão Geral, a 2ª aba (ou a aberta) e o resto no "+N". */
const visiveis = computed(() => {
  if (!props.compacto) return abas.value
  const [primeira, segunda] = abas.value
  const lista = [primeira!, segunda!]
  if (!lista.some(a => a.value === ativa.value)) lista[1] = aba.value
  return lista
})
const escondidas = computed<DropdownMenuItem[]>(() => abas.value
  .filter(a => !visiveis.value.some(v => v.value === a.value))
  .map(a => ({ label: a.label as string, icon: a.icon, onSelect: () => { ativa.value = a.value } })))

/* ---------- Opção 3: o seletor da Visão Geral ---------- */
const selecaoPorPadrao = () => props.entrada === 'formulario' ? String(formularioUnico.id) : 'todos'
const selecao = ref(selecaoPorPadrao())
const opcoesDoSeletor = computed(() => [
  { label: props.t.proposta.todosOsCampos, value: 'todos', icon: 'i-lucide-list' },
  ...formularios.map(f => ({ label: props.t.proposta.formulario(f.nome), value: String(f.id), icon: 'i-lucide-file-input' })),
])

/* Trocar de solução, de porta ou de item reabre a tela como ela abriria. */
watch(() => [props.solucao, props.entrada, props.item.id], () => {
  mostrarVazios.value = false
  ativa.value = abertaPorPadrao()
  selecao.value = selecaoPorPadrao()
})
watch(() => props.pastasDeFormulario.length, (n, antes) => {
  if (n > antes) ativa.value = props.pastasDeFormulario[n - 1]!.id
})

/* ---------- quais campos aparecem ---------- */
const camposDoFormulario = (id: number) => (formularioPorId(id)?.campos ?? []).map(campoPorRef)

/** Hoje: o formulário da porta vence; depois o de origem do item; senão o 1º "Geral" ou "Editar". */
const formularioDeHoje = computed(() =>
  props.entrada === 'formulario' ? formularioUnico : formularioPorId(props.item.form) ?? formularioUnico)

const camposDaVisao = computed(() => {
  if (props.solucao === 'hoje') return camposDoFormulario(formularioDeHoje.value.id)
  if (props.solucao === 'op3' && selecao.value !== 'todos') return camposDoFormulario(Number(selecao.value))
  return campos
})

/** Os campos em blocos: com os complementos, o formulário de origem vem antes do resto. */
const mostraTodos = computed(() => aba.value.tipo === 'visao' && camposDaVisao.value.length === campos.length)
const usaComplementos = computed(() => !!props.complementos && props.solucao !== 'hoje' && mostraTodos.value)
const mostrarVazios = ref(false)
const vazio = (refId: string) => {
  const v = props.item.data[refId]
  return v === '' || v === null || v === undefined
}
const vazios = computed(() => usaComplementos.value ? camposVisiveis.value.filter(c => vazio(c.refId)) : [])

const blocos = computed(() => {
  const visiveis = camposVisiveis.value.filter(c => mostrarVazios.value || !vazios.value.includes(c))
  const origem = formularioPorId(props.item.form)
  if (!usaComplementos.value || !origem) return [{ titulo: '', campos: visiveis }]
  return [
    { titulo: props.t.proposta.grupoDoFormulario(origem.nome), campos: visiveis.filter(c => origem.campos.includes(c.refId)) },
    { titulo: props.t.proposta.outrosCampos, campos: visiveis.filter(c => !origem.campos.includes(c.refId)) },
  ].filter(b => b.campos.length)
})

const camposVisiveis = computed(() => {
  if (aba.value.tipo === 'visao') return camposDaVisao.value
  if (aba.value.formulario) return camposDoFormulario(aba.value.formulario)
  return []
})

/* ---------- edição e salvar ---------- */
const rascunho = ref<Record<string, string | number>>({ ...props.item.data })
watch(() => props.item.id, () => { rascunho.value = { ...props.item.data } })

const salvando = ref(false)
async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 450))
  emit('salvar', { ...rascunho.value })
  salvando.value = false
  toast.add({ title: props.t.conteudo.salvo, icon: 'i-lucide-check', color: 'success', duration: 2500 })
}

const chaveDoConteudo = computed(() => `${ativa.value}-${props.solucao}-${props.entrada}-${selecao.value}-${props.item.id}-${props.complementos}`)
</script>

<template>
  <section class="flex min-w-0 flex-1 flex-col bg-default">
    <!-- Abas (casca), com a pasta automática da Opção 2 -->
    <div class="flex items-center gap-1 border-b border-default pr-2">
      <UTabs
        v-model="ativa"
        :items="visiveis"
        :content="false"
        variant="link"
        size="sm"
        :aria-label="t.abas.rotulo"
        class="min-w-0 flex-1"
        :ui="{ list: 'border-none px-3', trigger: 'py-2.5' }"
      >
        <template #list-trailing>
          <UDropdownMenu v-if="escondidas.length" :items="escondidas">
            <UButton
              :label="`+${escondidas.length}`"
              trailing-icon="i-lucide-chevron-down"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="t.abas.maisAbas"
              class="ml-auto"
            />
          </UDropdownMenu>
        </template>
      </UTabs>
      <UTooltip :text="t.abas.novaPasta">
        <UButton icon="i-lucide-folder-plus" color="neutral" variant="ghost" size="xs" :aria-label="t.abas.novaPasta" @click="emit('novaPasta')" />
      </UTooltip>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 translate-y-1"
        leave-active-class="transition duration-75 ease-in"
        leave-to-class="opacity-0"
      >
        <div :key="chaveDoConteudo" class="flex flex-col gap-5 px-5 py-4">
          <!-- Opção 3: o seletor "Exibir" (proposta) -->
          <div v-if="aba.tipo === 'visao' && solucao === 'op3'" class="flex flex-wrap items-end gap-3 border-b border-default pb-4">
            <UFormField :label="t.proposta.exibir" name="exibir">
              <USelect
                id="exibir"
                v-model="selecao"
                :items="opcoesDoSeletor"
                :icon="selecao === 'todos' ? 'i-lucide-list' : 'i-lucide-file-input'"
                class="w-64 max-w-full"
              />
            </UFormField>
            <p class="pb-2 text-sm text-muted" aria-live="polite">{{ t.proposta.contagem(camposDaVisao.length, campos.length) }}</p>
          </div>

          <!-- Pasta de formulário e pasta automática: o aviso do recorte (proposta) -->
          <UAlert
            v-if="aba.tipo === 'formulario' || aba.tipo === 'automatica'"
            :description="aba.tipo === 'automatica'
              ? t.proposta.avisoAutomatica(formularioUnico.nome)
              : t.proposta.avisoDaPasta(camposVisiveis.length, campos.length, formularioPorId(aba.formulario!)!.nome)"
            :icon="aba.tipo === 'automatica' ? 'i-lucide-sparkles' : 'i-lucide-file-input'"
            color="neutral"
            variant="subtle"
            :ui="{ description: 'text-sm' }"
          />

          <template v-if="camposVisiveis.length">
            <section v-for="b in blocos" :key="b.titulo" class="flex flex-col gap-5">
              <h3 v-if="b.titulo" class="text-xs font-semibold uppercase tracking-wider text-muted">{{ b.titulo }}</h3>
              <CampoDoItem
                v-for="(c, i) in b.campos"
                :key="c.refId"
                v-model="rascunho[c.refId]"
                :t="t"
                :campo="c"
                class="animate-[entrada_.25s_ease-out_both]"
                :style="{ animationDelay: `${i * 25}ms` }"
              />
            </section>
            <!-- Complemento: os vazios recolhidos, com a contagem (proposta) -->
            <UButton
              v-if="vazios.length"
              :label="mostrarVazios ? t.proposta.ocultarVazios : t.proposta.mostrarVazios(vazios.length)"
              :icon="mostrarVazios ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              color="neutral"
              variant="outline"
              size="sm"
              class="self-start"
              @click="mostrarVazios = !mostrarVazios"
            />
          </template>

          <UEmpty
            v-else
            :icon="aba.icon as string"
            :title="aba.label as string"
            :description="t.conteudo.foraDoEscopo"
            variant="naked"
            class="py-16"
          />
        </div>
      </Transition>
    </div>

    <footer class="flex justify-end border-t border-default px-5 py-3">
      <UButton icon="i-lucide-save" :label="t.conteudo.salvar" color="neutral" variant="subtle" size="sm" :loading="salvando" @click="salvar" />
    </footer>
  </section>
</template>
